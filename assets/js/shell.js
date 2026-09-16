/* NCODE N — Motor da plataforma: registro de jogos + helpers (H) + montagem no palco */
"use strict";
(function(){
const REG = {};
window.GREG = function(id, def){ REG[id] = def; };
window.__REG = REG;

/* ---------- persistência ---------- */
const store = {
  get(k, d){ try{ const v = localStorage.getItem("ncg_"+k); return v==null?d:JSON.parse(v); }catch(e){ return d; } },
  set(k, v){ try{ localStorage.setItem("ncg_"+k, JSON.stringify(v)); }catch(e){} }
};
window.NCG = {
  store,
  best(id){ return store.get("best_"+id, 0); },
  setBest(id, v){ if(v > store.get("best_"+id, 0)) store.set("best_"+id, v); },
  played(id){ return !!store.get("played_"+id, 0); },
  done(id){ return !!store.get("done_"+id, 0); },
  mark(id, won){ store.set("played_"+id, 1); if(won) store.set("done_"+id, 1); },
  favs(){ return store.get("fav", []); },
  toggleFav(id){ let f = store.get("fav",[]); f = f.includes(id)?f.filter(x=>x!==id):f.concat([id]); store.set("fav",f); return f.includes(id); }
};

/* ---------- áudio: micro-sintetizador ---------- */
let AC = null;
function tone(f, d, type, g, when){
  try{
    if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state === "suspended") AC.resume();
    const t = AC.currentTime + (when||0);
    const o = AC.createOscillator(), v = AC.createGain();
    o.type = type||"square"; o.frequency.value = f; v.gain.value = g||.04;
    o.connect(v); v.connect(AC.destination); o.start(t); o.stop(t+d);
  }catch(e){}
}
const SFX = {
  click(){ tone(440,.05,"square",.03); },
  tick(){ tone(660,.04,"square",.025); },
  ok(){ tone(523,.09,"square",.045); tone(784,.13,"square",.045,.09); },
  bad(){ tone(220,.16,"sawtooth",.05); tone(165,.2,"sawtooth",.045,.12); },
  win(){ [523,659,784,1046,1318].forEach((f,i)=>tone(f,.15,"square",.045,i*.11)); },
  lose(){ [392,330,262,196].forEach((f,i)=>tone(f,.18,"sawtooth",.045,i*.14)); },
  pop(){ tone(880,.06,"sine",.05); tone(1320,.05,"sine",.04,.05); }
};
document.addEventListener("pointerdown", function unlock(){ try{ if(AC&&AC.state==="suspended")AC.resume(); }catch(e){} }, {once:true});

/* ---------- paleta exposta aos jogos ---------- */
const C = {
  paper:"#F4F1EB", paper2:"#EDE8DC", card:"#FAF7F0",
  ink:"#181816", ink2:"#4A4A44", ink3:"#8A877C",
  terra:"#D94E34", terraD:"#B23A24",
  wasabi:"#C4D645", wasabiD:"#9AAE2E",
  cement:"#D8D5CC", ok:"#3E7C4F", bad:"#B23A24", gold:"#E8A33D"
};

/* ---------- construção de H (por montagem) ---------- */
function makeH(gameId, stage, pills){
  const disposers = [];
  const onD = f => disposers.push(f);
  let alive = true, raf = 0;
  const loops = [];

  function frame(t){
    if(!alive) return;
    const dt = Math.min(.05, (t - (frame.l||t)) / 1000 || .016);
    frame.l = t;
    for(const fn of loops.slice()){ try{ fn(dt, t/1000); }catch(e){ console.error("loop", e); } }
    raf = requestAnimationFrame(frame);
  }

  const H = {
    C, gameId,
    /* elementos */
    el(tag, cls, html, parent){
      const e = document.createElement(tag||"div");
      if(cls) e.className = cls;
      if(html != null) e.innerHTML = html;
      (parent||stage).appendChild(e);
      return e;
    },
    /* canvas: interno W×H, CSS responsivo */
    cvs(parent, W, Hh){
      const c = document.createElement("canvas");
      c.width = W; c.height = Hh; c.className = "g-cv";
      (parent||stage).appendChild(c);
      const x = c.getContext("2d");
      return { c, x, W, H:Hh };
    },
    scaleCtx(o){ // nitidez em telas retina sem mudar coordenadas
      const d = Math.min(2, window.devicePixelRatio||1);
      if(d !== 1){ o.c.width = o.W*d; o.c.height = o.H*d; o.x.setTransform(d,0,0,d,0,0); }
      return o;
    },
    /* HUD de fichas */
    hud(parent, defs){
      const box = H.el("div","g-hud",null,parent);
      const map = {};
      defs.forEach(([id,label,val])=>{
        const s = H.el("span","g-chip",label+': <b id="hv_'+id+'">'+val+'</b>',box);
        map[id] = s.querySelector("b");
      });
      return { box, set(id,v){ if(map[id]) map[id].textContent = v; } };
    },
    msg(parent, text){ const m = H.el("div","g-msg",text,parent); return t=>{ m.innerHTML = t; }; },
    btn(parent, label, fn, primary){
      const b = H.el("button","g-btn"+(primary===false?" ghost":""),label,parent);
      b.addEventListener("click", ev=>{ SFX.click(); fn&&fn(ev); });
      return b;
    },
    /* overlay de fim / pausa */
    ov(o){
      H.clsOv();
      const w = H.el("div","g-overlay",null,stage);
      const box = H.el("div","g-ovbox",null,w);
      if(o.k) H.el("div","k",o.k,box);
      H.el("h2","",o.title||"Fim",box);
      if(o.sub) H.el("p","",o.sub,box);
      if(o.score != null) H.el("div","sc",'PONTOS<br><b>'+o.score+'</b>'+(o.best!=null?' &nbsp;·&nbsp; recorde '+o.best:""),box);
      const row = H.el("div","rowB",null,box);
      (o.btns||[{t:"Jogar de novo",fn:()=>H.restart(),p:1}]).forEach(b=>{
        const btn = H.el("button","g-btn"+(b.p?"":" ghost"),b.t,row);
        btn.addEventListener("click",()=>{ SFX.click(); b.fn&&b.fn(); });
      });
      return w;
    },
    clsOv(){ stage.querySelectorAll(".g-overlay").forEach(e=>e.remove()); },
    /* laço principal */
    loop(fn){ loops.push(fn); if(loops.length===1){ frame.l=0; raf=requestAnimationFrame(frame);} onD(()=>{ const i=loops.indexOf(fn); if(i>=0)loops.splice(i,1); }); },
    after(ms, fn){ const t=setTimeout(()=>{ if(alive)fn(); },ms); onD(()=>clearTimeout(t)); return t; },
    every(ms, fn){ const t=setInterval(()=>{ if(alive)fn(); },ms); onD(()=>clearInterval(t)); return t; },
    /* teclado */
    keys(){
      const down = new Set(); const fns = [];
      const dn = e=>{ if(["ArrowUp","ArrowDown","ArrowLeft","ArrowRight"," "].includes(e.key)) e.preventDefault(); if(!e.repeat) down.add(e.code); fns.forEach(f=>f(e.code,true,e)); };
      const up = e=>{ down.delete(e.code); fns.forEach(f=>f(e.code,false,e)); };
      window.addEventListener("keydown",dn); window.addEventListener("keyup",up);
      onD(()=>{ window.removeEventListener("keydown",dn); window.removeEventListener("keyup",up); });
      return { down, on(fn){ fns.push(fn); }, is(c){ return down.has(c); } };
    },
    /* ponteiro sobre canvas (coordenadas internas) */
    ptr(o){
      const st = { x:o.W/2, y:o.H/2, down:false };
      const pos = e=>{
        const r = o.c.getBoundingClientRect();
        st.x = (e.clientX-r.left)/r.width*o.W; st.y = (e.clientY-r.top)/r.height*o.H;
      };
      const dn = e=>{ pos(e); st.down = true; };
      const mv = e=>{ if(st.down) pos(e); else pos(e); };
      const up = ()=>{ st.down = false; };
      o.c.addEventListener("pointerdown",dn); window.addEventListener("pointermove",mv); window.addEventListener("pointerup",up);
      onD(()=>{ o.c.removeEventListener("pointerdown",dn); window.removeEventListener("pointermove",mv); window.removeEventListener("pointerup",up); });
      return st;
    },
    onTap(elm, fn){
      const target = elm.c||elm;
      const h = e=>{
        let x=0,y=0;
        if(elm.c){ const r=target.getBoundingClientRect(); x=(e.clientX-r.left)/r.width*elm.W; y=(e.clientY-r.top)/r.height*elm.H; }
        else if(e.clientX!=null){ x=e.clientX; y=e.clientY; }
        fn(x,y,e);
      };
      target.addEventListener("pointerdown",h);
      onD(()=>target.removeEventListener("pointerdown",h));
    },
    swipe(elm, o){
      const target = elm.c||elm;
      let sx=0, sy=0, t0=0;
      const dn = e=>{ sx=e.clientX; sy=e.clientY; t0=performance.now(); };
      const up = e=>{
        const dx=e.clientX-sx, dy=e.clientY-sy, adx=Math.abs(dx), ady=Math.abs(dy);
        if(Math.max(adx,ady)<24){ o.tap&&o.tap(); return; }
        if(adx>ady) (dx>0?o.right:o.left)&& (dx>0?o.right:o.left)();
        else (dy>0?o.down:o.up)&& (dy>0?o.down:o.up)();
      };
      target.addEventListener("pointerdown",dn); target.addEventListener("pointerup",up);
      onD(()=>{ target.removeEventListener("pointerdown",dn); target.removeEventListener("pointerup",up); });
    },
    /* áudio */
    beep(f,d,t,g){ tone(f||440,d||.08,t,g); },
    sfx(n){ (SFX[n]||SFX.click)(); },
    /* aleatório */
    rng(seed){ let s=(seed>>>0)||1; return ()=>{ s^=s<<13; s^=s>>>17; s^=s<<5; s>>>=0; return s/4294967296; }; },
    ri(r,a,b){ return a+Math.floor(r()*(b-a+1)); },
    rf(r,a,b){ return a+r()*(b-a); },
    pick(r,arr){ return arr[Math.floor(r()*arr.length)]; },
    shuffle(r,arr){ const a=arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); [a[i],a[j]]=[a[j],a[i]]; } return a; },
    /* matemática */
    clamp:(v,a,b)=>v<a?a:v>b?b:v,
    lerp:(a,b,t)=>a+(b-a)*t,
    dist:(x1,y1,x2,y2)=>Math.hypot(x2-x1,y2-y1),
    /* placar do palco */
    score(v){ if(pills.score){ pills.score.innerHTML = 'PTS <b>'+v+'</b>'; pills.score.classList.add("hot"); } H._score=v; },
    level(v){ if(pills.level) pills.level.innerHTML = 'NV <b>'+v+'</b>'; },
    time(v){ if(pills.time) pills.time.textContent = v; },
    /* fim de jogo */
    done(o){
      o = o||{};
      const sc = o.score!=null?o.score:(H._score||0);
      NCG.mark(gameId, o.win!==false);
      if(sc) NCG.setBest(gameId, sc);
      const best = NCG.best(gameId);
      H.score(sc);
      (o.win===false?SFX.lose:SFX.win)();
      const nb = gameId>=400?1:gameId+1;
      H.after(450, ()=>H.ov({
        k: o.win===false?"// FIM DE JOGO":"// VITÓRIA",
        title: o.title || (o.win===false?"Não foi desta vez":"Missão cumprida!"),
        sub: o.sub || "",
        score: sc, best,
        btns:[
          {t:"↻ Jogar de novo", p:1, fn:()=>H.restart()},
          {t:"Próximo →", fn:()=>location.hash="#"+String(nb).padStart(3,"0")},
          {t:"Catálogo", fn:()=>location.href="index.html"}
        ]
      }));
      H._done = true;
    },
    restart(){ mount(gameId, true); },
    dispose(){ alive=false; cancelAnimationFrame(raf); disposers.splice(0).forEach(f=>{try{f();}catch(e){}}); }
  };
  return H;
}

/* ---------- montagem ---------- */
let currentH = null, currentId = 0;
function mount(id, force){
  const stage = document.getElementById("stage");
  if(!stage) return;
  if(currentH){ currentH.dispose(); currentH = null; }
  stage.innerHTML = '<div class="g-msg">Carregando jogo '+String(id).padStart(3,"0")+'…</div>';
  const pills = { score:document.getElementById("pillScore"), level:document.getElementById("pillLevel"), time:document.getElementById("pillTime") };
  if(pills.score){ pills.score.classList.remove("hot"); pills.score.innerHTML='PTS <b>0</b>'; }
  if(pills.level) pills.level.innerHTML='NV <b>1</b>';
  if(pills.time) pills.time.textContent='';
  const meta = (window.CATALOG||[]).find(g=>g[0]===id);
  document.getElementById("crumbId").innerHTML = "// "+String(id).padStart(3,"0")+" · "+(((window.GENRES||{})[(meta||[])[2]]||{}).n||"").toUpperCase();
  document.getElementById("playTitle").textContent = meta?meta[1]:"Jogo "+id;
  document.getElementById("howBody").innerHTML = "<b>Como jogar.</b> "+(meta?meta[3]:"")+"<br><br><span class='g-chip'>🎮 "+(meta?meta[4]:"")+"</span>";
  document.getElementById("bestLine").innerHTML = "Recorde: <b>"+NCG.best(id)+"</b> · "+(NCG.done(id)?"✅ concluído":NCG.played(id)?"▶ jogado":"○ novo");
  document.title = "N"+String(id).padStart(3,"0")+" · "+(meta?meta[1]:"")+" — NCODE N";
  NCG.mark(id, NCG.done(id)); // marca como jogado
  // relacionados
  const rel = document.getElementById("relRow");
  if(rel && meta){
    const same = window.CATALOG.filter(g=>g[2]===meta[2]&&g[0]!==id).slice(0,3);
    rel.innerHTML = "";
    same.forEach(g=>{
      const a = document.createElement("a");
      a.className="rel"; a.href="#"+String(g[0]).padStart(3,"0");
      a.innerHTML = '<span class="rn">'+String(g[0]).padStart(3,"0")+'</span><span class="rt">'+g[1]+'</span><span class="rg">'+window.GENRES[g[2]].e+'</span>';
      rel.appendChild(a);
    });
  }
  currentId = id;
  const run = ()=>{
    const def = REG[id];
    if(!def){ stage.innerHTML = '<div class="g-msg">Jogo não encontrado. <a href="index.html">Voltar ao catálogo</a></div>'; return; }
    stage.innerHTML = "";
    currentH = makeH(id, stage, pills);
    try{ def.init(stage, currentH); }
    catch(e){ console.error(e); stage.innerHTML = '<div class="g-msg">⚠️ Erro ao iniciar este jogo. <a href="index.html">Voltar ao catálogo</a></div>'; }
  };
  if(REG[id] && !force){ run(); return; }
  const old = document.getElementById("gameScript"); if(old) old.remove();
  const s = document.createElement("script");
  s.id = "gameScript"; s.src = "games/g"+String(id).padStart(3,"0")+".js";
  s.onload = run;
  s.onerror = ()=>{ stage.innerHTML = '<div class="g-msg">⚠️ Arquivo do jogo não carregou. <a href="index.html">Voltar ao catálogo</a></div>'; };
  document.body.appendChild(s);
}
function idFromHash(){
  const m = (location.hash||"").match(/(\d{1,3})/);
  let id = m?parseInt(m[1],10):1;
  if(!(id>=1&&id<=400)) id = 1;
  return id;
}
window.addEventListener("hashchange", ()=>mount(idFromHash()));
document.addEventListener("DOMContentLoaded", ()=>{
  const rb = document.getElementById("btnRestart"); if(rb) rb.addEventListener("click",()=>mount(currentId,true));
  const rd = document.getElementById("btnRandom"); if(rd) rd.addEventListener("click",()=>{ location.hash = "#"+String(1+Math.floor(Math.random()*400)).padStart(3,"0"); });
  const nx = document.getElementById("btnNext"); if(nx) nx.addEventListener("click",()=>{ location.hash = "#"+String(currentId>=400?1:currentId+1).padStart(3,"0"); });
  mount(idFromHash());
});
})();
