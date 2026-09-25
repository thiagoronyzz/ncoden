/* NCODE N — Bancada profunda: joga cada jogo por ~40s simulados com entradas
   agressivas e sinaliza suspeitos: erro, jogo morto, sem reação, sem fim,
   vitória instantânea, loop de reinício. Uso:
     node test/harness2.js            # todos os 400
     node test/harness2.js 42 77      # só alguns
   Saída: PASS/FLAG por jogo + resumo com listas para revisão manual. */
"use strict";
const fs = require("fs");
const path = require("path");
const ROOT = path.join(__dirname, "..");

/* ---------- stubs de DOM ---------- */
function ctxStub(canvas){
  const grad = { addColorStop(){} };
  const t = { canvas, measureText: () => ({ width: 10 }) };
  return new Proxy(t, {
    get(o, p){
      if(p in o) return o[p];
      if(p === "createLinearGradient" || p === "createRadialGradient" || p === "createPattern") return () => grad;
      if(p === "getImageData") return () => ({ data: [], width: 0, height: 0 });
      return () => {};
    },
    set(o, p, v){ o[p] = v; return true; }
  });
}
function mkEl(tag){
  const handlers = {};
  const el = {
    tag: tag || "div", children: [], style: {}, dataset: {},
    className: "", textContent: "", value: "",
    disabled: false, width: 300, height: 150, type: "",
    classList: { add(){}, remove(){}, toggle(){}, contains(){ return false; } },
    appendChild(c){ el.children.push(c); return c; },
    remove(){}, focus(){}, blur(){}, select(){},
    addEventListener(t, f){ (handlers[t] = handlers[t] || []).push(f); },
    removeEventListener(t, f){ handlers[t] = (handlers[t] || []).filter(x => x !== f); },
    setAttribute(){}, getAttribute(){ return null; }, removeAttribute(){},
    querySelector(){ return null; }, querySelectorAll(){ return []; },
    getBoundingClientRect(){ return { left: 0, top: 0, width: el.width || 300, height: el.height || 150 }; },
    click(){ (handlers.click || []).forEach(f => f({ preventDefault(){} })); },
    getContext(){ return ctxStub(el); },
    __handlers: handlers
  };
  let _html = "";
  Object.defineProperty(el, "innerHTML", { get(){ return _html; }, set(v){ _html = String(v); el.children = []; } });
  return el;
}

const PAL = { paper:"#F4F1EB",paper2:"#EDE8DC",card:"#FAF7F0",ink:"#181816",ink2:"#4A4A44",ink3:"#8A877C",
  terra:"#D94E34",terraD:"#B23A24",wasabi:"#C4D645",wasabiD:"#9AAE2E",cement:"#D8D5CC",ok:"#3E7C4F",bad:"#B23A24",gold:"#E8A33D" };

function makeH(id, root){
  const loops = [], afters = [], everys = [], taps = [], keyFns = [], ptrs = [], btns = [], swipes = [];
  let now = 0, everyCount = 0;
  let score = 0, scoreChanges = 0, hudChanges = 0, doneFrame = -1, doneRes = null, restarts = 0, err = null;
  const H = {
    C: PAL, gameId: id,
    el(t, c, h, p){ const e = mkEl(t); if(c) e.className = c; if(h != null) e.innerHTML = h; (p || root).appendChild(e); return e; },
    icon(){},
    icons: [],
    cvs(parent, W, Hh){ const c = mkEl("canvas"); c.width = W; c.height = Hh; (parent || root).appendChild(c); return { c, x: c.getContext("2d"), W, H: Hh }; },
    scaleCtx(o){ return o; },
    hud(parent){ const box = mkEl("div"); (parent||root).appendChild(box);
      return { box, set(){ hudChanges++; } }; },
    msg(parent){ const m = mkEl("div"); (parent||root).appendChild(m); return () => { hudChanges++; }; },
    btn(parent, label, fn, primary){ const b = mkEl("button"); b.innerHTML = label; (parent||root).appendChild(b);
      b.addEventListener("click", () => { try{ fn && fn({}); }catch(e){ err = err || e; } }); btns.push(b); return b; },
    ov(o){ const w = mkEl("div"); root.appendChild(w);
      (o.btns || []).forEach(b => { const btn = mkEl("button"); btn.innerHTML = b.t; w.appendChild(btn);
        btn.addEventListener("click", () => { try{ b.fn && b.fn(); }catch(e){ err = err || e; } }); btns.push(btn); });
      return w; },
    clsOv(){},
    loop(fn){ loops.push(fn); },
    after(ms, fn){ afters.push({ due: now + ms, fn }); },
    every(ms, fn){ const h = { ms, next: now + ms, fn, dead: false }; everys.push(h); return h; },
    keys(){ const down = new Set(); return { down, on(fn){ keyFns.push(fn); }, is(){ return false; } }; },
    ptr(o){ const st = { x: o.W/2, y: o.H/2, down: false, W:o.W, H:o.H }; ptrs.push(st); return st; },
    onTap(elm, fn){ taps.push({ elm, fn }); },
    swipe(elm, o){ swipes.push(o || {}); },
    beep(){}, sfx(){},
    rng(seed){ let s = (seed >>> 0) || 1; return () => { s ^= s << 13; s ^= s >>> 17; s ^= s << 5; s >>>= 0; return s / 4294967296; }; },
    ri(r,a,b){ return a + Math.floor(r() * (b - a + 1)); },
    rf(r,a,b){ return a + r() * (b - a); },
    pick(r,arr){ return arr[Math.floor(r() * arr.length)]; },
    shuffle(r,arr){ const a = arr.slice(); for(let i=a.length-1;i>0;i--){ const j=Math.floor(r()*(i+1)); const t=a[i]; a[i]=a[j]; a[j]=t; } return a; },
    clamp:(v,a,b)=>v<a?a:v>b?b:v, lerp:(a,b,t)=>a+(b-a)*t, dist:(x1,y1,x2,y2)=>Math.hypot(x2-x1,y2-y1),
    score(v){ if(v !== score){ scoreChanges++; score = v; } },
    level(){}, time(){},
    done(o){ if(doneFrame < 0){ doneFrame = Math.round(now); doneRes = o || {}; } },
    restart(){ restarts++; },
    dispose(){},
    __tick(dt){
      now += dt * 1000;
      for(let i = afters.length-1; i >= 0; i--){ if(afters[i].due <= now){ const a = afters.splice(i,1)[0]; try{ a.fn(); }catch(e){ err = err || e; } } }
      for(const e of everys){ if(!e.dead && e.next <= now && everyCount < 20000){ e.next += e.ms; everyCount++; try{ e.fn(); }catch(e2){ err = err || e2; } } }
      for(const fn of loops.slice()){ try{ fn(dt, now/1000); }catch(e){ err = err || e; } }
    },
    __in: { loops, taps, keyFns, ptrs, btns, swipes },
    __stats: { get scoreChanges(){ return scoreChanges; }, get hudChanges(){ return hudChanges; },
      get doneFrame(){ return doneFrame; }, get doneRes(){ return doneRes; }, get restarts(){ return restarts; }, get err(){ return err; } },
    _score: 0
  };
  return H;
}

const KEYCODES = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyW","KeyS","Enter","KeyZ","KeyX","KeyP","KeyR","Digit1","Digit2","Digit3"];
function rnd(a,b){ return a + Math.random()*(b-a); }
const RESTART_RE = /recome|reinic|jogar de novo|reembaralh|zerar|novo jogo|refazer|reinicio|de novo/i;
function collectClickables(root, skipRestart){
  const out = [];
  (function walk(e){ const h = e.__handlers || {};
    const isBtn = (e.tag === "button") || (h.click && h.click.length) || (h.pointerdown && h.pointerdown.length);
    if(isBtn){
      const lbl = String(e.innerHTML || "") + " " + String(e.textContent || "");
      if(!(skipRestart && RESTART_RE.test(lbl))) out.push(e);
    }
    for(const c of e.children || []) walk(c);
  })(root);
  return out;
}
const FRAMES = 2400;
function runGame(id){
  const file = path.join(ROOT, "games", "g"+String(id).padStart(3,"0")+".js");
  const fail = (stage, err) => ({ id, ok:false, stage, err: String((err && err.stack) || err).split("\n").slice(0,4).join(" | ") });
  if(!fs.existsSync(file)) return fail("missing", "arquivo inexistente");
  let code;
  try{ code = fs.readFileSync(file, "utf8"); }catch(e){ return fail("read", e); }
  let def = null;
  global.GREG = (gid, d) => { if(gid === id) def = d; };
  try{ new Function("GREG", "const clearInterval=h=>{if(h&&typeof h===\"object\")h.dead=true;};\nconst clearTimeout=h=>{if(h&&typeof h===\"object\")h.dead=true;};\nconst setInterval=(f,ms)=>H.every(ms,f);\nconst setTimeout=(f,ms)=>H.after(ms,f);" + code)(global.GREG); }catch(e){ return fail("load", e); }
  if(!def || typeof def.init !== "function") return fail("register", "GREG("+id+") com init() ausente");
  const root = mkEl("div");
  const H = makeH(id, root);
  try{ def.init(root, H); }
  catch(e){ return fail("init", e); }
  const inStatic = H.__in;
  const interactN = Math.max(
    collectClickables(root).length,
    inStatic.loops.length + inStatic.taps.length + inStatic.keyFns.length + inStatic.btns.length + inStatic.ptrs.length + inStatic.swipes.length
  );
  let btnIdx = 0, passiveDoneAt = -1;
  try{
    /* fase passiva: 600 quadros (10s) sem nenhuma entrada */
    for(let f = 0; f < 600; f++){
      if(H.__stats.err) throw H.__stats.err;
      H.__tick(1/60);
      if(H.__stats.doneFrame >= 0){ passiveDoneAt = H.__stats.doneFrame; break; }
      if(H.__stats.restarts > 2) throw new Error("loop de restart");
    }
    /* fase ativa: 1800 quadros com entradas agressivas (sem clicar em reiniciar) */
    for(let f = 0; f < 1800; f++){
      if(H.__stats.err) throw H.__stats.err;
      for(const p of H.__in.ptrs){ p.x = rnd(0, p.W||300); p.y = rnd(0, p.H||300); p.down = (f % 14) < 7; }
      if(f % 8 === 0) for(const t of H.__in.taps){ const W = (t.elm && t.elm.W) || 300, Hh = (t.elm && t.elm.H) || 300; t.fn(rnd(0,W), rnd(0,Hh), {}); }
      if(f % 6 === 0){ const c = KEYCODES[(f/6) % KEYCODES.length]; for(const k of H.__in.keyFns){ k(c, true, {}); k(c, false, {}); } }
      if(f % 10 === 0){ const all = collectClickables(root, true);
        for(let k = 0; k < Math.min(5, all.length); k++){ const b = all[(btnIdx + k * 3) % all.length]; if(b && !b.disabled) b.click(); }
        btnIdx++; }
      if(f % 16 === 0) for(const s of H.__in.swipes){ const kk = ["left","right","up","down","tap"][(f/16) % 5]; if(s[kk]) s[kk](); }
      H.__tick(1/60);
      if(H.__stats.restarts > 2) throw new Error("loop de restart");
      if(H.__stats.err) throw H.__stats.err;
    }
  }catch(e){ return fail("runtime", e); }
  const st = H.__stats;
  const flags = [];
  if(interactN === 0) flags.push("morto: nenhuma via de interação");
  if(passiveDoneAt >= 0 && passiveDoneAt < 1800) flags.push("termina sozinho sem entrada ("+ (passiveDoneAt/1000).toFixed(1) +"s, win="+(st.doneRes&&st.doneRes.win)+")");
  if(st.doneFrame < 0){
    if(st.scoreChanges === 0 && st.hudChanges === 0 && interactN > 0) flags.push("sem reação a entradas");
    else flags.push("sem fim em 40s (pode ser por design)");
  }
  if(flags.length) return { id, ok:true, flags, interactN, scoreCh: st.scoreChanges, hudCh: st.hudChanges, doneF: st.doneFrame, win: st.doneRes ? st.doneRes.win : null };
  return { id, ok:true, flags: [], interactN };
}
function main(){
  const args = process.argv.slice(2).map(Number).filter(n => n >= 1 && n <= 400);
  const ids = args.length ? args : Array.from({length:400},(_,i)=>i+1);
  const results = ids.map(runGame);
  const flagged = results.filter(r => r.flags && r.flags.length);
  const errors = results.filter(r => !r.ok);
  for(const r of results){
    const tag = "g"+String(r.id).padStart(3,"0");
    if(!r.ok) console.log(`ERRO ${tag} [${r.stage}] ${r.err}`);
    else if(r.flags.length) console.log(`FLAG ${tag} ${r.flags.join("; ")} | int=${r.interactN} scoreCh=${r.scoreCh!=null?r.scoreCh:"-"} hudCh=${r.hudCh!=null?r.hudCh:"-"} done@=${r.doneF!=null?(r.doneF/1000).toFixed(1)+"s":"-"} win=${r.win}`);
  }
  console.log(`\n== ${results.length} jogos, ${errors.length} com erro, ${flagged.length} sinalizados ==`);
  if(flagged.length){
    console.log("Revisar:", flagged.map(r => "g"+String(r.id).padStart(3,"0")).join(" "));
  }
}
main();
