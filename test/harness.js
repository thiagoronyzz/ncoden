/* NCODE N — Bancada de testes: executa cada jogo headless com H simulado,
   avança 400 quadros, injeta entradas sintéticas e captura erros. */
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

/* ---------- H simulado ---------- */
const PAL = { paper:"#F4F1EB",paper2:"#EDE8DC",card:"#FAF7F0",ink:"#181816",ink2:"#4A4A44",ink3:"#8A877C",
  terra:"#D94E34",terraD:"#B23A24",wasabi:"#C4D645",wasabiD:"#9AAE2E",cement:"#D8D5CC",ok:"#3E7C4F",bad:"#B23A24",gold:"#E8A33D" };

function makeH(id, root){
  const loops = [], afters = [], everys = [], taps = [], keyFns = [], ptrs = [], btns = [], swipes = [];
  let now = 0, everyCount = 0;
  const H = {
    C: PAL, gameId: id,
    el(t, c, h, p){ const e = mkEl(t); if(c) e.className = c; if(h != null) e.innerHTML = h; (p || root).appendChild(e); return e; },
    cvs(parent, W, Hh){ const c = mkEl("canvas"); c.width = W; c.height = Hh; (parent || root).appendChild(c); return { c, x: c.getContext("2d"), W, H: Hh }; },
    scaleCtx(o){ return o; },
    hud(parent){ const box = mkEl("div"); (parent||root).appendChild(box); return { box, set(){} }; },
    msg(parent, t){ const m = mkEl("div"); (parent||root).appendChild(m); return () => {}; },
    btn(parent, label, fn, primary){ const b = mkEl("button"); b.innerHTML = label; (parent||root).appendChild(b);
      b.addEventListener("click", () => fn && fn({})); btns.push(b); return b; },
    ov(o){
      o = o || {}; H._ovCalls = (H._ovCalls||0)+1;
      const w = mkEl("div"); root.appendChild(w);
      (o.btns || []).forEach(b => { const btn = mkEl("button"); btn.innerHTML = b.t; w.appendChild(btn);
        btn.addEventListener("click", () => { try{ b.fn && b.fn(); }catch(e){ H._err = H._err || e; } }); btns.push(btn); });
      return w;
    },
    clsOv(){},
    loop(fn){ loops.push(fn); },
    after(ms, fn){ afters.push({ due: now + ms, fn }); },
    every(ms, fn){ everys.push({ ms, next: now + ms, fn }); },
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
    score(v){ H._score = v; }, level(){}, time(){},
    best(){ return { get: () => 0, set(){} }; },
    done(o){ H._doneRes = H._doneRes || o || {}; },
    restart(){ H._restarts = (H._restarts||0)+1; },
    dispose(){},
    __tick(dt){
      now += dt * 1000;
      for(let i = afters.length-1; i >= 0; i--){ if(afters[i].due <= now){ const a = afters.splice(i,1)[0]; a.fn(); } }
      for(const e of everys){ if(e.next <= now && everyCount < 4000){ e.next += e.ms; everyCount++; e.fn(); } }
      for(const fn of loops.slice()) fn(dt, now/1000);
    },
    __in: { loops, taps, keyFns, ptrs, btns, swipes },
    _score: 0
  };
  return H;
}

const KEYCODES = ["ArrowLeft","ArrowRight","ArrowUp","ArrowDown","Space","KeyA","KeyD","KeyW","KeyS","Enter","KeyZ","KeyX","Digit1","Digit2","Digit3"];
function rnd(a,b){ return a + Math.random()*(b-a); }
function collectClickables(root){
  const out = [];
  (function walk(e){ const h = e.__handlers || {};
    if((h.click && h.click.length) || (h.pointerdown && h.pointerdown.length)) out.push(e);
    for(const c of e.children || []) walk(c);
  })(root);
  return out;
}
function runGame(id){
  const file = path.join(ROOT, "games", "g"+String(id).padStart(3,"0")+".js");
  const t0 = Date.now();
  const fail = (stage, err) => ({ id, ok:false, stage, err: String((err && err.stack) || err).split("\n").slice(0,4).join(" | "), ms: Date.now()-t0 });
  if(!fs.existsSync(file)) return fail("missing", "arquivo inexistente");
  let code;
  try{ code = fs.readFileSync(file, "utf8"); }
  catch(e){ return fail("read", e); }
  if(code.length < 800) return fail("size", "arquivo pequeno demais ("+code.length+" bytes) — suspeito de stub");
  let def = null;
  global.GREG = (gid, d) => { if(gid === id) def = d; };
  try{
    const fn = new Function("GREG", code);
    fn(global.GREG);
  }catch(e){ return fail("load", e); }
  if(!def || typeof def.init !== "function") return fail("register", "GREG("+id+") com init() não encontrado");
  const root = mkEl("div");
  const H = makeH(id, root);
  try{ def.init(root, H); }
  catch(e){ return fail("init", e); }
  // simula 420 quadros (~7s) com entradas sintéticas
  let btnIdx = 0;
  try{
    for(let f = 0; f < 420; f++){
      for(const p of H.__in.ptrs){ p.x = rnd(0, p.W||300); p.y = rnd(0, p.H||300); if(f % 30 === 0) p.down = !p.down; }
      if(f % 12 === 0) for(const t of H.__in.taps){ const W = (t.elm && t.elm.W) || 300, Hh = (t.elm && t.elm.H) || 300; t.fn(rnd(0,W), rnd(0,Hh), {}); }
      if(f % 20 === 0){ const c = KEYCODES[f % KEYCODES.length]; for(const k of H.__in.keyFns){ k(c, true, {}); k(c, false, {}); } }
      if(f % 24 === 0){ const all = collectClickables(root);
        for(let k = 0; k < Math.min(3, all.length); k++){ const b = all[(btnIdx + k * 7) % all.length]; if(b && !b.disabled) b.click(); }
        btnIdx++; }
      if(f % 40 === 0) for(const s of H.__in.swipes){ const k = ["left","right","up","down","tap"][f % 5]; if(s[k]) s[k](); }
      H.__tick(1/60);
      if(H._err) throw H._err;
      if(H._restarts > 2) throw new Error("loop de restart detectado");
    }
  }catch(e){ return fail("runtime", e); }
  return { id, ok:true, ms: Date.now()-t0,
    loops: H.__in.loops.length, taps: H.__in.taps.length, keys: H.__in.keyFns.length,
    btns: H.__in.btns.length, done: !!H._doneRes, bytes: code.length };
}

function main(){
  const args = process.argv.slice(2).map(Number).filter(n => n >= 1 && n <= 400);
  const ids = args.length ? args : Array.from({length:400},(_,i)=>i+1);
  const results = ids.map(runGame);
  const fails = results.filter(r => !r.ok);
  for(const r of results){
    if(r.ok) console.log(`PASS g${String(r.id).padStart(3,"0")} loops=${r.loops} taps=${r.taps} keys=${r.keys} btns=${r.btns} done=${r.done} ${r.ms}ms ${r.bytes}b`);
    else console.log(`FAIL g${String(r.id).padStart(3,"0")} [${r.stage}] ${r.err}`);
  }
  console.log(`\n== ${results.length - fails.length}/${results.length} PASSOU ==`);
  if(fails.length) process.exitCode = 1;
}
main();
