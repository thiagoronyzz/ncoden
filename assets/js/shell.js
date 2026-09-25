/* NCODE N — Motor da plataforma: registro de jogos + helpers (H) + biblioteca de
   ícones vetoriais + palco. Nenhum jogo depende de emoji: sprites são ícones
   desenhados em vetor, na identidade gráfica da oficina. */
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

/* ---------- áudio: micro-sintetizador com envelope ---------- */
let AC = null;
function tone(f, d, type, g, when){
  try{
    if(!AC) AC = new (window.AudioContext||window.webkitAudioContext)();
    if(AC.state === "suspended") AC.resume();
    const t0 = AC.currentTime + (when||0);
    const o = AC.createOscillator(), v = AC.createGain();
    o.type = type||"square"; o.frequency.value = f;
    v.gain.setValueAtTime(0.0001, t0);
    v.gain.linearRampToValueAtTime(g||.04, t0+.008);
    v.gain.exponentialRampToValueAtTime(0.0001, t0+(d||.08));
    o.connect(v); v.connect(AC.destination); o.start(t0); o.stop(t0+(d||.08)+.02);
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

/* ============================================================
   BIBLIOTECA DE ÍCONES — desenhados em vetor, centrados em (0,0)
   dentro de uma caixa de lado s. Pessoas/animais: silhueta em tinta.
   Objetos: preenchimento chapado + contorno de tinta.
   ============================================================ */
const INK="#181816", PAPER="#FAF7F0", TERRA="#D94E34", TERRA_D="#B23A24",
      WASABI="#C4D645", GOLD="#E8A33D", OK="#3E7C4F", SEA="#2E6E8A",
      WOOD="#8A6A2F", WOOD_L="#B39668", SKY="#BFD9E2", GRAY="#8A877C",
      DARK="#4A4A44", CREAM="#EDE8DC";

function lw(x,s){ return Math.max(1, s*0.07); }

/* --- pessoas: silhuetas de tinta --- */
function head(x,u){ x.beginPath(); x.arc(0,-8.2*u,3.1*u,0,7); x.fill(); }
function torso(x,u,lean){ x.beginPath(); x.moveTo(-2.3*u+ (lean||0),-4.8*u); x.lineTo(2.3*u+(lean||0),-4.8*u); x.lineTo(1.7*u+(lean||0)*1.4,2.2*u); x.lineTo(-1.7*u+(lean||0)*1.4,2.2*u); x.closePath(); x.fill(); }
const ICONS = {
person(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.fillRect(-2.1*u,2.2*u,1.6*u,6.6*u); x.fillRect(.5*u,2.2*u,1.6*u,6.6*u); },
walk(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.save(); x.translate(0,2.2*u); x.rotate(.35); x.fillRect(-.8*u,0,1.5*u,6.6*u); x.restore();
  x.save(); x.translate(0,2.2*u); x.rotate(-.5); x.fillRect(-.7*u,0,1.5*u,6.4*u); x.restore();
  x.save(); x.translate(-2.2*u,-4.4*u); x.rotate(.7); x.fillRect(0,0,1.4*u,5*u); x.restore(); },
run(x,s){ const u=s/24; x.fillStyle=INK; x.save(); x.rotate(.18); head(x,u); torso(x,u,0);
  x.save(); x.translate(.6*u,2.2*u); x.rotate(.9); x.fillRect(-.8*u,0,1.5*u,6.2*u); x.restore();
  x.save(); x.translate(-.6*u,2.2*u); x.rotate(-.9); x.fillRect(-.7*u,0,1.5*u,6*u); x.restore();
  x.save(); x.translate(-2.4*u,-4.2*u); x.rotate(1.1); x.fillRect(0,0,1.4*u,4.6*u); x.restore();
  x.save(); x.translate(2*u,-3.6*u); x.rotate(-1); x.fillRect(0,0,1.4*u,4.4*u); x.restore(); x.restore(); },
wheelchair(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.fillRect(-2.2*u,2*u,4.4*u,2*u);
  x.strokeStyle=INK; x.lineWidth=1.6*u; x.beginPath(); x.arc(0,7*u,4.6*u,0,7); x.stroke();
  x.fillRect(3.4*u,1.4*u,4.2*u,1.5*u); },
climb(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.save(); x.translate(2*u,-4.4*u); x.rotate(-.9); x.fillRect(0,0,1.4*u,5*u); x.restore();
  x.save(); x.translate(-2.2*u,-3*u); x.rotate(2.2); x.fillRect(0,0,1.4*u,5*u); x.restore();
  x.save(); x.translate(-1.6*u,2*u); x.rotate(1.2); x.fillRect(0,0,1.5*u,6*u); x.restore();
  x.save(); x.translate(1.4*u,2.2*u); x.rotate(-.4); x.fillRect(0,0,1.5*u,6.2*u); x.restore(); },
swim(x,s){ const u=s/24; x.fillStyle=INK; head(x,u);
  x.save(); x.rotate(-.15); torso(x,u,0);
  x.fillRect(-1.6*u,1.6*u,4.6*u,1.9*u); x.restore();
  x.beginPath(); x.moveTo(4*u,4*u); x.lineTo(7.6*u,3.2*u); x.lineWidth=1.4*u; x.strokeStyle=INK; x.stroke(); },
dance(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.save(); x.translate(-2.2*u,-4.6*u); x.rotate(-1.15); x.fillRect(0,0,1.4*u,5.4*u); x.restore();
  x.save(); x.translate(2*u,-4*u); x.rotate(1.9); x.fillRect(0,0,1.4*u,5.4*u); x.restore();
  x.save(); x.translate(-1.8*u,2.2*u); x.rotate(1.15); x.fillRect(0,0,1.6*u,6.4*u); x.restore();
  x.save(); x.translate(.6*u,2.4*u); x.rotate(-1); x.fillRect(0,0,1.6*u,6.2*u); x.restore(); },
acrobat(x,s){ const u=s/24; x.fillStyle=INK; head(x,u);
  x.save(); x.rotate(1.2); torso(x,u,0);
  x.fillRect(-1.4*u,2.2*u,1.5*u,5.6*u); x.fillRect(.1*u,2.2*u,1.5*u,5.6*u);
  x.save(); x.translate(-2.2*u,-4.4*u); x.rotate(-.6); x.fillRect(0,0,1.3*u,4.8*u); x.restore();
  x.save(); x.translate(2*u,-4.6*u); x.rotate(.5); x.fillRect(0,0,1.3*u,4.8*u); x.restore();
  x.restore(); },
raise(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.fillRect(-2.1*u,2.2*u,1.6*u,6.4*u); x.fillRect(.5*u,2.2*u,1.6*u,6.4*u);
  x.save(); x.translate(1.6*u,-4.4*u); x.rotate(-.5); x.fillRect(0,0,1.4*u,7.4*u); x.restore(); },
juggle(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.fillRect(-2*u,2.2*u,1.5*u,6.2*u); x.fillRect(.5*u,2.2*u,1.5*u,6.2*u);
  x.save(); x.translate(-2.1*u,-4.2*u); x.rotate(-2.4); x.fillRect(0,0,1.4*u,5*u); x.restore();
  x.save(); x.translate(1.9*u,-4.4*u); x.rotate(2.3); x.fillRect(0,0,1.4*u,5*u); x.restore();
  x.fillStyle=TERRA; [[-6*u,-11*u],[0,-13*u],[6*u,-11*u]].forEach(p=>{ x.beginPath(); x.arc(p[0],p[1],1.7*u,0,7); x.fill(); }); },
robot(x,s){ const u=s/24; x.strokeStyle=INK; x.fillStyle=GRAY; x.lineWidth=lw(x,s);
  x.beginPath(); x.rect(-6*u,-6*u,12*u,10*u); x.fill(); x.stroke();
  x.fillStyle=DARK; x.beginPath(); x.arc(-2.8*u,-1.5*u,1.5*u,0,7); x.arc(2.8*u,-1.5*u,1.5*u,0,7); x.fill();
  x.beginPath(); x.moveTo(0,-6*u); x.lineTo(0,-9*u); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,-9.6*u,1.4*u,0,7); x.fill();
  x.fillStyle=GRAY; x.fillRect(-4*u,4*u,8*u,5*u); x.strokeRect(-4*u,4*u,8*u,5*u); },
ghost(x,s){ const u=s/24; x.fillStyle=CREAM; x.strokeStyle=INK; x.lineWidth=lw(x,s);
  x.beginPath(); x.arc(0,-2*u,6.4*u,Math.PI,0);
  x.lineTo(6.4*u,7*u); x.lineTo(3.2*u,5*u); x.lineTo(0,7.4*u); x.lineTo(-3.2*u,5*u); x.lineTo(-6.4*u,7*u);
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-2.4*u,-2.6*u,1.2*u,0,7); x.arc(2.4*u,-2.6*u,1.2*u,0,7); x.fill(); },
zombie(x,s){ const u=s/24; x.fillStyle=OK; head(x,u); torso(x,u,1.5);
  x.fillRect(-2*u,2.2*u,1.5*u,6.4*u);
  x.save(); x.translate(.6*u,2.2*u); x.rotate(-1.5); x.fillRect(0,0,1.5*u,6*u); x.restore();
  x.save(); x.translate(2.2*u,-4.2*u); x.rotate(1.5); x.fillRect(0,0,1.4*u,5.6*u); x.restore(); },
guard(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.fillRect(-2.1*u,2.2*u,1.6*u,6.6*u); x.fillRect(.5*u,2.2*u,1.6*u,6.6*u);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-3.8*u,-9.4*u); x.lineTo(3.8*u,-9.4*u); x.lineTo(3*u,-12*u); x.lineTo(-3*u,-12*u); x.closePath(); x.fill();
  x.strokeStyle=INK; x.lineWidth=lw(x,s)*.8; x.stroke(); },
detective(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,0);
  x.fillRect(-2.3*u,2.2*u,1.8*u,6.6*u); x.fillRect(.5*u,2.2*u,1.8*u,6.6*u);
  x.fillRect(-4.4*u,-9.4*u,8.8*u,1.7*u); x.beginPath(); x.arc(0,-9.4*u,3.4*u,Math.PI,0); x.fill(); },
suit(x,s){ const u=s/24; x.fillStyle=DARK; head(x,u); torso(x,u,0);
  x.fillRect(-2.1*u,2.2*u,1.6*u,6.6*u); x.fillRect(.5*u,2.2*u,1.6*u,6.6*u);
  x.fillStyle=PAPER; x.beginPath(); x.moveTo(-1*u,-4.8*u); x.lineTo(1*u,-4.8*u); x.lineTo(0,-1*u); x.closePath(); x.fill(); },
baby(x,s){ const u=s/24; x.fillStyle=INK; x.beginPath(); x.arc(0,-5*u,3.4*u,0,7); x.fill();
  x.beginPath(); x.arc(0,3.6*u,4.6*u,0,7); x.fill(); },
diver(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,.5);
  x.fillStyle=SEA; x.beginPath(); x.arc(0,-7.4*u,3.5*u,-1.2,1.2); x.lineTo(3*u,-8.6*u); x.closePath(); x.fill();
  x.fillStyle=INK; x.fillRect(-2*u,2.2*u,4.6*u,2.1*u);
  x.save(); x.translate(1.4*u,4*u); x.rotate(1.2); x.fillRect(0,0,1.4*u,5.4*u); x.restore();
  x.save(); x.translate(-2.4*u,1.6*u); x.rotate(-1.2); x.fillRect(0,0,1.4*u,5.6*u); x.restore(); },
clap(x,s){ const u=s/24; x.fillStyle=INK;
  x.save(); x.rotate(-.5); x.beginPath(); x.ellipse(-2.4*u,0,2*u,4.4*u,0,0,7); x.fill(); x.restore();
  x.save(); x.rotate(.5); x.beginPath(); x.ellipse(2.4*u,0,2*u,4.4*u,0,0,7); x.fill(); x.restore();
  x.fillStyle=GOLD; [[-6*u,-8*u],[6*u,-8*u],[0,-10*u]].forEach(p=>{ x.save(); x.translate(p[0],p[1]); x.rotate(.7); x.fillRect(-.5*u,-2*u,1*u,4*u); x.restore(); }); },

/* --- veículos --- */
car(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath();
  x.moveTo(-8.5*u,2.5*u); x.lineTo(-7*u,-2.5*u); x.lineTo(-3.4*u,-2.5*u); x.lineTo(-1*u,-6.5*u);
  x.lineTo(4.2*u,-6.5*u); x.lineTo(6.8*u,-2.5*u); x.lineTo(8.5*u,-.5*u); x.lineTo(8.5*u,2.5*u);
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.moveTo(-2.2*u,-3.4*u); x.lineTo(-.2*u,-5.6*u); x.lineTo(3.4*u,-5.6*u); x.lineTo(5*u,-3.4*u); x.closePath(); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-4.6*u,2.8*u,2.3*u,0,7); x.arc(4.8*u,2.8*u,2.3*u,0,7); x.fill();
  x.fillStyle=GRAY; x.beginPath(); x.arc(-4.6*u,2.8*u,.9*u,0,7); x.arc(4.8*u,2.8*u,.9*u,0,7); x.fill(); },
truck(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=OK; x.beginPath(); x.rect(-9*u,-7*u,11*u,9*u); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.rect(3.4*u,-4.6*u,4.6*u,4*u); x.fill(); x.stroke();
  x.fillStyle=DARK; x.beginPath(); x.rect(2*u,-7*u,7*u,6.4*u); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-5.4*u,3.4*u,2.2*u,0,7); x.arc(5.6*u,3.4*u,2.2*u,0,7); x.fill(); },
bike(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=1.5*u;
  x.beginPath(); x.arc(-5.4*u,3.4*u,4*u,0,7); x.stroke();
  x.beginPath(); x.arc(5.4*u,3.4*u,4*u,0,7); x.stroke();
  x.beginPath(); x.moveTo(-5.4*u,3.4*u); x.lineTo(-1.6*u,-3.4*u); x.lineTo(3.4*u,-3.4*u); x.lineTo(5.4*u,3.4*u);
  x.moveTo(-1.6*u,-3.4*u); x.lineTo(-.4*u,3.4*u); x.lineTo(5.4*u,3.4*u); x.moveTo(1.6*u,-5.8*u); x.lineTo(3.4*u,-3.4*u); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(-1.6*u,-3.4*u,1.3*u,0,7); x.fill(); },
moto(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=1.6*u;
  x.beginPath(); x.arc(-6*u,3.6*u,3.6*u,0,7); x.stroke();
  x.beginPath(); x.arc(6*u,3.6*u,3.6*u,0,7); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-4.6*u,.4*u); x.lineTo(1.4*u,-4.4*u); x.lineTo(5.4*u,-2.4*u); x.lineTo(6.4*u,1*u); x.closePath(); x.fill();
  x.strokeStyle=INK; x.beginPath(); x.moveTo(1.4*u,-4.4*u); x.lineTo(-1*u,-7.4*u); x.stroke(); },
scooter(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=1.5*u;
  x.beginPath(); x.arc(-5.4*u,4.4*u,2.8*u,0,7); x.stroke();
  x.beginPath(); x.arc(6*u,4.4*u,2.8*u,0,7); x.stroke();
  x.beginPath(); x.moveTo(-5.4*u,4.4*u); x.lineTo(-1*u,-1.4*u); x.lineTo(2.6*u,-1.4*u); x.lineTo(6*u,4.4*u); x.stroke();
  x.fillStyle=TERRA; x.fillRect(-4.4*u,-4.4*u,5*u,1.8*u); },
tractor(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=OK; x.beginPath(); x.rect(-8.6*u,-4.4*u,10*u,5.6*u); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.rect(-7.6*u,-9*u,5*u,4.6*u); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(5*u,2.6*u,2.6*u,0,7); x.fill();
  x.fillStyle=GRAY; x.beginPath(); x.arc(5*u,2.6*u,1*u,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-4.6*u,3.4*u,4.4*u,0,7); x.fill();
  x.fillStyle=GRAY; x.beginPath(); x.arc(-4.6*u,3.4*u,1.7*u,0,7); x.fill(); },
train(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.rect(-8.6*u,-4.6*u,13*u,9*u); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.rect(-6*u,-2.2*u,4*u,3.4*u); x.fill(); x.stroke();
  x.fillStyle=DARK; x.beginPath(); x.rect(4.4*u,-8.6*u,3.4*u,4*u); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-4*u,5.6*u,1.9*u,0,7); x.arc(.8*u,5.6*u,1.9*u,0,7); x.arc(5.6*u,5.6*u,1.9*u,0,7); x.fill(); },
wagon(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.rect(-8*u,-5*u,16*u,7.4*u); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.1*u;
  x.beginPath(); x.moveTo(-8*u,-1.4*u); x.lineTo(8*u,-1.4*u); x.stroke();
  x.strokeStyle=INK; x.lineWidth=lw(x,s); x.fillStyle=INK;
  x.beginPath(); x.arc(-4.4*u,4.4*u,2.2*u,0,7); x.arc(4.4*u,4.4*u,2.2*u,0,7); x.fill(); },
kart(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-8*u,3*u); x.lineTo(-6*u,-2*u); x.lineTo(6*u,-2*u); x.lineTo(8*u,3*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=DARK; x.fillRect(-7.6*u,-4.6*u,3*u,2.4*u); x.fillRect(4.6*u,-4.6*u,3*u,2.4*u);
  x.fillStyle=INK; x.beginPath(); x.arc(-5*u,3.4*u,2.4*u,0,7); x.arc(5*u,3.4*u,2.4*u,0,7); x.fill();
  x.fillStyle=GRAY; x.beginPath(); x.arc(-5*u,3.4*u,.9*u,0,7); x.arc(5*u,3.4*u,.9*u,0,7); x.fill(); },
heli(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.ellipse(-.6*u,0,6.4*u,4*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.arc(1.4*u,-.6*u,2*u,0,7); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-8*u,-7.4*u); x.lineTo(8*u,-7.4*u); x.stroke();
  x.beginPath(); x.moveTo(0,-7.4*u); x.lineTo(0,-4*u); x.stroke();
  x.beginPath(); x.moveTo(-4*u,4.4*u); x.lineTo(-4*u,6.4*u); x.lineTo(3.4*u,6.4*u); x.lineTo(3.4*u,4.4*u); x.stroke(); },
plane(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.beginPath(); x.ellipse(0,1.4*u,8.6*u,2.6*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-2*u,-.6*u); x.lineTo(-8.6*u,-6*u); x.lineTo(-4.6*u,-6*u); x.lineTo(2*u,-.6*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(1.4*u,-.4*u); x.lineTo(7*u,-4.4*u); x.lineTo(8.6*u,-2.4*u); x.lineTo(4*u,.6*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.arc(5.4*u,1.4*u,1.4*u,0,7); x.fill(); },
rocket(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath();
  x.moveTo(0,-10*u); x.quadraticCurveTo(4.4*u,-4*u,4.4*u,1*u); x.lineTo(-4.4*u,1*u);
  x.quadraticCurveTo(-4.4*u,-4*u,0,-10*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-4.4*u,-1*u); x.lineTo(-7.4*u,5*u); x.lineTo(-4.4*u,3.4*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(4.4*u,-1*u); x.lineTo(7.4*u,5*u); x.lineTo(4.4*u,3.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SEA; x.beginPath(); x.arc(0,-4*u,1.9*u,0,7); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-2.6*u,3.4*u); x.lineTo(0,9*u); x.lineTo(2.6*u,3.4*u); x.closePath(); x.fill(); },
boat(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-9*u,1*u); x.lineTo(9*u,1*u); x.lineTo(5.4*u,5.6*u); x.lineTo(-5.4*u,5.6*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.fillRect(-4*u,-4*u,6*u,5*u); x.strokeRect(-4*u,-4*u,6*u,5*u);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(2*u,-8*u); x.lineTo(2*u,-4*u); x.lineTo(7*u,-4*u); x.closePath(); x.fill(); x.stroke(); },
canoe(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-9*u,-1*u); x.quadraticCurveTo(0,5.6*u,9*u,-1*u); x.lineTo(7*u,1.4*u); x.quadraticCurveTo(0,6.4*u,-7*u,1.4*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(-8.4*u,-.4*u); x.lineTo(8.4*u,-.4*u); x.stroke(); },
ship(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=DARK; x.beginPath(); x.moveTo(-9.4*u,0); x.lineTo(9.4*u,0); x.lineTo(6*u,5*u); x.lineTo(-6*u,5*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.fillRect(-6*u,-6*u,7*u,6*u); x.strokeRect(-6*u,-6*u,7*u,6*u);
  x.fillStyle=TERRA; x.fillRect(1.4*u,-3.4*u,4*u,3.4*u); x.strokeRect(1.4*u,-3.4*u,4*u,3.4*u); },
sled(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineWidth=1.5*u;
  x.beginPath(); x.moveTo(-8*u,-2*u); x.quadraticCurveTo(0,4*u,8*u,-2*u); x.stroke();
  x.fillStyle=WOOD; x.fillRect(-4*u,-5.4*u,8*u,2.6*u); x.strokeRect(-4*u,-5.4*u,8*u,2.6*u); },
ski(x,s){ const u=s/24; x.fillStyle=INK; head(x,u); torso(x,u,.8);
  x.save(); x.translate(.4*u,2.4*u); x.rotate(1.1); x.fillRect(0,0,1.4*u,5.6*u); x.restore();
  x.save(); x.translate(-.6*u,2.2*u); x.rotate(.7); x.fillRect(0,0,1.4*u,5.4*u); x.restore();
  x.strokeStyle=INK; x.lineWidth=1.3*u; x.beginPath(); x.moveTo(-6*u,9*u); x.lineTo(6*u,6*u); x.stroke(); },
skate(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-8*u,1.4*u); x.quadraticCurveTo(0,3.4*u,8*u,1.4*u); x.lineTo(8*u,-.4*u); x.quadraticCurveTo(0,1.4*u,-8*u,-.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-4.4*u,4.4*u,1.7*u,0,7); x.arc(4.4*u,4.4*u,1.7*u,0,7); x.fill(); },
surf(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-9*u,4*u); x.quadraticCurveTo(0,7.4*u,9*u,4*u); x.quadraticCurveTo(0,5.4*u,-9*u,4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.save(); x.translate(0,-2*u); head(x,u); torso(x,u,0);
  x.save(); x.translate(1.6*u,-4*u); x.rotate(-1.2); x.fillRect(0,0,1.3*u,4.6*u); x.restore();
  x.save(); x.translate(-1.8*u,1.8*u); x.rotate(2.4); x.fillRect(0,0,1.3*u,4.6*u); x.restore();
  x.restore(); },
para(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,-4*u,7.4*u,Math.PI,0); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1*u;
  x.beginPath(); x.moveTo(-7.4*u,-4*u); x.lineTo(-1*u,6*u); x.moveTo(7.4*u,-4*u); x.lineTo(1*u,6*u); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(0,8*u,2.4*u,0,7); x.fill(); },
kite(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(0,-9*u); x.lineTo(6*u,-1.4*u); x.lineTo(0,4.4*u); x.lineTo(-6*u,-1.4*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.1*u; x.beginPath(); x.moveTo(0,4.4*u); x.quadraticCurveTo(-4*u,7.4*u,-2*u,10*u); x.stroke(); },
elevator(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.beginPath(); x.rect(-6.6*u,-8*u,13.2*u,16*u); x.fill(); x.stroke();
  x.fillStyle=INK; x.fillRect(-1.4*u,-5.4*u,2.8*u,10.8*u);
  x.fillStyle=OK; x.beginPath(); x.moveTo(-4*u,-2.4*u); x.lineTo(-2.2*u,-5*u); x.lineTo(-.4*u,-2.4*u); x.closePath(); x.fill();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-4*u,3*u); x.lineTo(-2.2*u,5.6*u); x.lineTo(-.4*u,3*u); x.closePath(); x.fill(); },
ambulance(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.moveTo(-9*u,3.4*u); x.lineTo(-9*u,-5*u); x.lineTo(0,-5*u); x.lineTo(3*u,-1*u); x.lineTo(9*u,-1*u); x.lineTo(9*u,3.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.fillRect(-1.4*u,-3.6*u,2.8*u,1.3*u); x.fillRect(-3.1*u,-1.9*u,2.8*u,1.3*u);
  x.fillStyle=INK; x.beginPath(); x.arc(-4.6*u,3.8*u,2.2*u,0,7); x.arc(5.4*u,3.8*u,2.2*u,0,7); x.fill(); },

/* --- animais: silhuetas de tinta --- */
dog(x,s){ const u=s/24; x.fillStyle=WOOD;
  x.beginPath(); x.ellipse(1.4*u,1*u,6.6*u,4.4*u,0,0,7); x.fill();
  x.beginPath(); x.arc(-6.4*u,-3*u,3.6*u,0,7); x.fill();
  x.beginPath(); x.ellipse(-9.4*u,-1.4*u,1.4*u,2.8*u,-.5,0,7); x.fill();
  x.beginPath(); x.ellipse(-4*u,-6*u,1.8*u,2.6*u,.3,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=lw(x,s)*.8; x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(5.4*u,-2*u,1*u,0,7); x.fill();
  x.fillStyle=INK; x.fillRect(3.4*u,4.6*u,1.6*u,4*u); x.fillRect(-.6*u,4.6*u,1.6*u,4*u);
  x.strokeStyle=INK; x.lineWidth=1.4*u; x.beginPath(); x.moveTo(7.6*u,.4*u); x.quadraticCurveTo(10.4*u,1.4*u,9*u,4*u); x.stroke(); },
cat(x,s){ const u=s/24; x.fillStyle=DARK;
  x.beginPath(); x.ellipse(1*u,1.4*u,6*u,4.2*u,0,0,7); x.fill();
  x.beginPath(); x.arc(-6*u,-3.4*u,3.4*u,0,7); x.fill();
  x.beginPath(); x.moveTo(-8.6*u,-5*u); x.lineTo(-8*u,-9.4*u); x.lineTo(-5*u,-6.2*u); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-3.4*u,-6.2*u); x.lineTo(-1.4*u,-9.4*u); x.lineTo(-2.6*u,-4.8*u); x.closePath(); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(6.6*u,1*u); x.quadraticCurveTo(10*u,2.4*u,8*u,6.6*u); x.stroke();
  x.fillStyle=INK; x.fillRect(3*u,4.6*u,1.6*u,3.6*u); x.fillRect(-.8*u,4.6*u,1.6*u,3.6*u); },
bird(x,s){ const u=s/24; x.fillStyle=SEA;
  x.beginPath(); x.ellipse(0,.6*u,5*u,4.2*u,0,0,7); x.fill();
  x.beginPath(); x.arc(2.6*u,-5*u,3*u,0,7); x.fill();
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(4.6*u,-5*u); x.lineTo(8*u,-4*u); x.lineTo(4.6*u,-3*u); x.closePath(); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(3*u,-5.6*u,.8*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.2*u;
  x.beginPath(); x.moveTo(-1.4*u,4.4*u); x.lineTo(-1.4*u,7.4*u); x.moveTo(1.4*u,4.4*u); x.lineTo(1.4*u,7.4*u); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.ellipse(-2.6*u,-1*u,3*u,1.8*u,-.5,0,7); x.fill(); },
chick(x,s){ const u=s/24; x.fillStyle=GOLD;
  x.beginPath(); x.arc(0,0,6*u,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-2*u,-1.6*u,.9*u,0,7); x.fill();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-5.6*u,-.4*u); x.lineTo(-8.6*u,.4*u); x.lineTo(-5.6*u,1.4*u); x.closePath(); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.1*u;
  x.beginPath(); x.moveTo(-1*u,5.6*u); x.lineTo(-1*u,7.4*u); x.moveTo(1.6*u,5.6*u); x.lineTo(1.6*u,7.4*u); x.stroke();
  x.fillStyle=OK; x.beginPath(); x.moveTo(-1.6*u,-6.4*u); x.lineTo(0,-9*u); x.lineTo(1.8*u,-6.4*u); x.closePath(); x.fill(); },
penguin(x,s){ const u=s/24; x.fillStyle=INK;
  x.beginPath(); x.ellipse(0,1*u,5.4*u,7.4*u,0,0,7); x.fill();
  x.fillStyle=PAPER; x.beginPath(); x.ellipse(0,2.4*u,3*u,5*u,0,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-2*u,-4.4*u,.9*u,0,7); x.arc(2*u,-4.4*u,.9*u,0,7); x.fill();
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-1.4*u,-2.4*u); x.lineTo(3.4*u,-1.4*u); x.lineTo(-1.4*u,-.4*u); x.closePath(); x.fill(); },
frog(x,s){ const u=s/24; x.fillStyle=OK;
  x.beginPath(); x.ellipse(0,1.4*u,7*u,5*u,0,0,7); x.fill();
  x.beginPath(); x.arc(-4*u,-4.6*u,2.8*u,0,7); x.arc(4*u,-4.6*u,2.8*u,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-4*u,-4.8*u,1.1*u,0,7); x.arc(4*u,-4.8*u,1.1*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.arc(0,1.4*u,3.4*u,.3,2.8); x.stroke(); },
sheep(x,s){ const u=s/24; x.fillStyle=CREAM; x.strokeStyle=INK; x.lineWidth=lw(x,s)*.8;
  x.beginPath(); x.arc(0,-2.6*u,5.4*u,0,7); x.fill(); x.stroke();
  x.fillStyle=DARK; x.beginPath(); x.ellipse(-6.4*u,-4*u,2.8*u,2.4*u,0,0,7); x.fill();
  x.fillRect(-7*u,-2*u,1.6*u,6.4*u); x.fillRect(-2.4*u,2*u,1.6*u,4.6*u); x.fillRect(1.4*u,2*u,1.6*u,4.6*u); },
horse(x,s){ const u=s/24; x.fillStyle=WOOD;
  x.beginPath(); x.ellipse(1.4*u,.4*u,6.6*u,3.8*u,0,0,7); x.fill();
  x.save(); x.translate(-6*u,-3.4*u); x.rotate(-.5); x.beginPath(); x.ellipse(0,0,2.4*u,4*u,0,0,7); x.fill(); x.restore();
  x.beginPath(); x.ellipse(6.6*u,-4*u,1.4*u,3*u,.4,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=lw(x,s)*.8; x.stroke();
  x.fillStyle=INK; x.fillRect(3*u,3*u,1.7*u,5*u); x.fillRect(-1*u,3*u,1.7*u,5*u);
  x.strokeStyle=WOOD; x.lineWidth=1.6*u; x.beginPath(); x.moveTo(7.6*u,0); x.quadraticCurveTo(10.6*u,-1*u,9.6*u,-4*u); x.stroke(); },
ant(x,s){ const u=s/24; x.fillStyle=TERRA_D;
  x.beginPath(); x.arc(-5*u,0,2.6*u,0,7); x.fill();
  x.beginPath(); x.ellipse(0,0,3*u,2.2*u,0,0,7); x.fill();
  x.beginPath(); x.arc(4.4*u,-.6*u,2*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1*u;
  x.beginPath(); x.moveTo(-6*u,-1.4*u); x.lineTo(-8.6*u,-4.4*u); x.moveTo(-6*u,1.4*u); x.lineTo(-8.6*u,4.4*u);
  x.moveTo(4.6*u,-2*u); x.lineTo(6*u,-6*u); x.moveTo(4.6*u,2*u); x.lineTo(7*u,4.6*u); x.stroke(); },
croc(x,s){ const u=s/24; x.fillStyle=OK;
  x.beginPath(); x.ellipse(1*u,1.4*u,7*u,3.4*u,0,0,7); x.fill();
  x.beginPath(); x.moveTo(-9.4*u,-1*u); x.lineTo(-3*u,-3.4*u); x.lineTo(-3*u,.6*u); x.closePath(); x.fill();
  x.strokeStyle=INK; x.lineWidth=lw(x,s)*.7; x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-7.4*u,-1.6*u,.7*u,0,7); x.fill();
  x.fillStyle=OK; x.beginPath(); x.moveTo(-2*u,-2.4*u); x.lineTo(.4*u,-7.4*u); x.lineTo(3*u,-2.4*u); x.closePath(); x.fill(); x.stroke(); },
hedgehog(x,s){ const u=s/24; x.fillStyle=WOOD;
  x.beginPath(); x.arc(1*u,.6*u,5.4*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.3*u;
  for(let a=0;a<10;a++){ const an=a/10*7-3.6; x.beginPath(); x.moveTo(1*u+Math.cos(an)*4.4*u,.6*u+Math.sin(an)*4.4*u); x.lineTo(1*u+Math.cos(an)*8.4*u,.6*u+Math.sin(an)*8.4*u); x.stroke(); }
  x.fillStyle=INK; x.beginPath(); x.arc(-5*u,1.4*u,2.6*u,0,7); x.fill();
  x.fillStyle=PAPER; x.beginPath(); x.arc(-5.8*u,.8*u,.7*u,0,7); x.fill(); },
kangaroo(x,s){ const u=s/24; x.fillStyle=TERRA;
  x.beginPath(); x.ellipse(1.4*u,1*u,6*u,3.8*u,0,0,7); x.fill();
  x.beginPath(); x.ellipse(-4.4*u,-.4*u,2.6*u,3.4*u,-.4,0,7); x.fill();
  x.beginPath(); x.arc(-6*u,-4.6*u,2.8*u,0,7); x.fill();
  x.fillStyle=CREAM; x.beginPath(); x.ellipse(2.6*u,1.4*u,2.6*u,2*u,0,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=lw(x,s)*.7; x.stroke();
  x.fillStyle=INK; x.fillRect(3*u,3.4*u,1.6*u,4.6*u); x.fillRect(-1*u,3.4*u,1.6*u,4.6*u);
  x.strokeStyle=TERRA; x.lineWidth=1.6*u; x.beginPath(); x.moveTo(6*u,1.4*u); x.quadraticCurveTo(9.4*u,3.4*u,7*u,6.4*u); x.stroke(); },
turtle(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=OK; x.beginPath(); x.ellipse(-7*u,3*u,3*u,2*u,0,0,7); x.fill(); x.stroke();
  x.beginPath(); x.ellipse(6.4*u,2.6*u,2.2*u,1.7*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=WOOD; x.beginPath(); x.ellipse(0,.4*u,5.6*u,4.2*u,0,0,7); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1*u;
  x.beginPath(); x.moveTo(-2.8*u,-2.6*u); x.lineTo(2.8*u,-2.6*u); x.moveTo(-3.6*u,.4*u); x.lineTo(3.6*u,.4*u); x.moveTo(-2.8*u,3*u); x.lineTo(2.8*u,3*u); x.stroke(); },
fish(x,s){ const u=s/24; x.fillStyle=SEA;
  x.beginPath(); x.ellipse(.6*u,0,6.4*u,3.8*u,0,0,7); x.fill();
  x.fillStyle=SKY; x.beginPath(); x.moveTo(-4.6*u,0); x.lineTo(-9.4*u,-3.4*u); x.lineTo(-9.4*u,3.4*u); x.closePath(); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(3.4*u,-1*u,.9*u,0,7); x.fill(); },
shark(x,s){ const u=s/24; x.fillStyle=GRAY;
  x.beginPath(); x.moveTo(-9*u,0); x.quadraticCurveTo(0,-4.6*u,7*u,-1.4*u); x.quadraticCurveTo(9.4*u,-.4*u,8*u,1*u); x.quadraticCurveTo(0,3.4*u,-9*u,0); x.closePath(); x.fill();
  x.beginPath(); x.moveTo(-.6*u,-2.4*u); x.lineTo(1.4*u,-7.4*u); x.lineTo(3.4*u,-2.4*u); x.closePath(); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(4.6*u,-1.4*u,.8*u,0,7); x.fill(); },
shellfish(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.beginPath(); x.moveTo(0,4*u);
  for(let a=0;a<=6;a++){ const an=Math.PI+a/6*Math.PI; x.lineTo(Math.cos(an)*7.4*u, 4*u+Math.sin(an)*7.4*u*-1*0+Math.abs(Math.sin(an))*0); }
  x.moveTo(-7.4*u,4*u); x.quadraticCurveTo(0,-9*u,7.4*u,4*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-7.4*u,4*u); x.lineTo(7.4*u,4*u); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,1.4*u,2.4*u,0,7); x.fill(); x.stroke(); },
snake(x,s){ const u=s/24; x.strokeStyle=OK; x.lineWidth=2.4*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-7*u,4*u); x.quadraticCurveTo(-3*u,-2*u,0,2*u); x.quadraticCurveTo(3*u,6*u,6*u,0); x.quadraticCurveTo(7.4*u,-2.4*u,6*u,-4.4*u); x.stroke();
  x.fillStyle=OK; x.beginPath(); x.arc(5.6*u,-5*u,2.2*u,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(5*u,-5.6*u,.7*u,0,7); x.fill(); },
butterfly(x,s){ const u=s/24; x.fillStyle=TERRA;
  x.beginPath(); x.ellipse(-3.8*u,-2.6*u,3.6*u,2.8*u,-.5,0,7); x.fill();
  x.fillStyle=GOLD; x.beginPath(); x.ellipse(3.8*u,-2.6*u,3.6*u,2.8*u,.5,0,7); x.fill();
  x.fillStyle=TERRA; x.beginPath(); x.ellipse(-3.4*u,2.2*u,3*u,2.4*u,.4,0,7); x.fill();
  x.fillStyle=GOLD; x.beginPath(); x.ellipse(3.4*u,2.2*u,3*u,2.4*u,-.4,0,7); x.fill();
  x.fillStyle=INK; x.fillRect(-.6*u,-5*u,1.2*u,10.4*u);
  x.strokeStyle=INK; x.lineWidth=1*u; x.beginPath(); x.moveTo(-.4*u,-4.6*u); x.lineTo(-2.4*u,-8*u); x.moveTo(.4*u,-4.6*u); x.lineTo(2.4*u,-8*u); x.stroke(); },
bee(x,s){ const u=s/24; x.fillStyle=GOLD; x.beginPath(); x.ellipse(0,1*u,5.6*u,4*u,0,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.4*u;
  x.beginPath(); x.moveTo(-2.4*u,-2.4*u); x.lineTo(-2.4*u,4.4*u); x.moveTo(1.4*u,-2.8*u); x.lineTo(1.4*u,4.4*u); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.ellipse(-1*u,-3.4*u,3.4*u,2.2*u,-.4,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(4.4*u,-.4*u,.8*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1*u; x.beginPath(); x.moveTo(-5.4*u,1*u); x.lineTo(-7.4*u,1*u); x.stroke(); },
spider(x,s){ const u=s/24; x.fillStyle=INK; x.beginPath(); x.arc(0,1.4*u,3.8*u,0,7); x.fill();
  x.beginPath(); x.arc(0,-3.4*u,2.2*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.1*u;
  [[-3,-2],[3,-2],[-4,1],[4,1],[-3,4],[3,4]].forEach(v=>{ x.beginPath(); x.moveTo(v[0]*u, v[1]*u+1.4*u); x.lineTo(v[0]*2.2*u, v[1]*2.6*u+2*u); x.stroke(); }); },
mouse(x,s){ const u=s/24; x.fillStyle=GRAY;
  x.beginPath(); x.ellipse(1*u,1.4*u,5.4*u,3.8*u,0,0,7); x.fill();
  x.beginPath(); x.arc(-5*u,-2.6*u,3*u,0,7); x.fill();
  x.beginPath(); x.arc(-6.4*u,-5.4*u,1.4*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=lw(x,s)*.6; x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-6.2*u,-2.8*u,.7*u,0,7); x.fill();
  x.strokeStyle=GRAY; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(6*u,1*u); x.quadraticCurveTo(9.4*u,3.4*u,7*u,5.4*u); x.stroke(); },
octopus(x,s){ const u=s/24; x.fillStyle=TERRA;
  x.beginPath(); x.arc(0,-2.4*u,4.6*u,0,7); x.fill();
  x.strokeStyle=TERRA; x.lineWidth=1.8*u; x.lineCap="round";
  for(let i=-2;i<=2;i++){ x.beginPath(); x.moveTo(i*2.2*u,1*u); x.quadraticCurveTo(i*2.6*u,5*u,i*3.4*u,6.6*u); x.stroke(); }
  x.fillStyle=INK; x.beginPath(); x.arc(-1.8*u,-3*u,.9*u,0,7); x.arc(1.8*u,-3*u,.9*u,0,7); x.fill(); },
crab(x,s){ const u=s/24; x.fillStyle=TERRA;
  x.beginPath(); x.ellipse(0,1*u,5.4*u,3.8*u,0,0,7); x.fill();
  x.strokeStyle=TERRA; x.lineWidth=1.4*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-4*u,3.4*u); x.lineTo(-6*u,6*u); x.moveTo(4*u,3.4*u); x.lineTo(6*u,6*u); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-2*u,-.4*u,.8*u,0,7); x.arc(2*u,-.4*u,.8*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.1*u;
  x.beginPath(); x.moveTo(-4.6*u,-2*u); x.lineTo(-7.4*u,-4.4*u); x.moveTo(4.6*u,-2*u); x.lineTo(7.4*u,-4.4*u); x.stroke(); },

/* --- natureza --- */
tree(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.fillRect(-1.4*u,2*u,2.8*u,7.4*u); x.strokeRect(-1.4*u,2*u,2.8*u,7.4*u);
  x.fillStyle=OK; x.beginPath(); x.arc(0,-2.6*u,6.6*u,0,7); x.fill(); x.stroke();
  x.fillStyle=WOOD_L; x.beginPath(); x.arc(-2*u,-4*u,1.6*u,0,7); x.fill(); },
pine(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.fillRect(-1.2*u,5.4*u,2.4*u,4*u);
  x.fillStyle=OK; x.beginPath(); x.moveTo(0,-10*u); x.lineTo(5*u,-2.6*u); x.lineTo(-5*u,-2.6*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(0,-5.4*u); x.lineTo(6.6*u,2.6*u); x.lineTo(-6.6*u,2.6*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(0,-.6*u); x.lineTo(8*u,6*u); x.lineTo(-8*u,6*u); x.closePath(); x.fill(); x.stroke(); },
palm(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=WOOD; x.lineWidth=2.2*u; x.beginPath(); x.moveTo(-1*u,9*u); x.quadraticCurveTo(.6*u,0,2*u,-4*u); x.stroke();
  x.fillStyle=OK; x.lineWidth=lw(x,s);
  [[-6,-3.4,1.9],[6,-3.4,-1.9],[-4.4,-7,2.4],[4.4,-7,-2.4],[0,-9.4,3.1]].forEach(v=>{
    x.save(); x.translate(v[0]*u,v[1]*u); x.rotate(v[2]);
    x.beginPath(); x.ellipse(0,0,4.2*u,1.6*u,0,0,7); x.fill(); x.stroke(); x.restore(); }); },
flower(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=OK; x.lineWidth=1.4*u; x.beginPath(); x.moveTo(0,2*u); x.lineTo(0,9*u); x.stroke();
  x.fillStyle=TERRA;
  for(let a=0;a<6;a++){ const an=a/6*7-1.55; x.save(); x.translate(Math.cos(an)*4.4*u,-2.6*u+Math.sin(an)*4.4*u); x.beginPath(); x.arc(0,0,2.6*u,0,7); x.fill(); x.stroke(); x.restore(); }
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,-2.6*u,2.4*u,0,7); x.fill(); x.stroke(); },
wheat(x,s){ const u=s/24; x.strokeStyle=OK; x.lineWidth=1.3*u;
  x.beginPath(); x.moveTo(0,9*u); x.quadraticCurveTo(.6*u,0,0,-4*u); x.stroke();
  x.fillStyle=GOLD;
  for(let i=0;i<4;i++){ const yy=-3*u+i*2.6*u;
    x.beginPath(); x.ellipse(-2.2*u,yy,1.8*u,.9*u,-.6,0,7); x.fill();
    x.beginPath(); x.ellipse(2.2*u,yy,1.8*u,.9*u,.6,0,7); x.fill(); }
  x.beginPath(); x.ellipse(0,-7*u,1.1*u,2.4*u,0,0,7); x.fill(); },
sprout(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=OK; x.lineWidth=1.5*u; x.beginPath(); x.moveTo(0,9*u); x.quadraticCurveTo(-.6*u,2*u,0,-1*u); x.stroke();
  x.fillStyle=OK; x.save(); x.translate(-.4*u,-2*u); x.rotate(-.7); x.beginPath(); x.ellipse(3*u,0,3.4*u,1.8*u,0,0,7); x.fill(); x.stroke(); x.restore();
  x.save(); x.translate(.4*u,-3.4*u); x.rotate(.7); x.beginPath(); x.ellipse(-3*u,0,3*u,1.7*u,0,0,7); x.fill(); x.stroke(); x.restore(); },
leaf(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(0,-8*u); x.quadraticCurveTo(7*u,-2*u,4*u,4*u); x.quadraticCurveTo(1.4*u,7*u,-4*u,6*u); x.quadraticCurveTo(-7*u,0,0,-8*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=WOOD; x.lineWidth=1.1*u; x.beginPath(); x.moveTo(0,-6*u); x.lineTo(-.6*u,4.6*u); x.stroke(); },
mushroom(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.fillRect(-2*u,0,4*u,7*u); x.strokeRect(-2*u,0,4*u,7*u);
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,0,7.4*u,Math.PI,0); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.beginPath(); x.arc(-3*u,-3*u,1.4*u,0,7); x.arc(2.6*u,-2*u,1.7*u,0,7); x.fill(); },
volcano(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=DARK; x.beginPath(); x.moveTo(-9*u,8*u); x.lineTo(-2.6*u,-5*u); x.lineTo(2.6*u,-5*u); x.lineTo(9*u,8*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-2.6*u,-5*u); x.lineTo(2.6*u,-5*u); x.lineTo(1.4*u,-7*u); x.lineTo(-1.4*u,-7*u); x.closePath(); x.fill();
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-1.4*u,-7*u); x.quadraticCurveTo(-.4*u,-9.4*u,-2.4*u,-11*u); x.moveTo(1.4*u,-7*u); x.quadraticCurveTo(2*u,-9*u,3.4*u,-10*u); x.stroke(); },
wave(x,s){ const u=s/24; x.strokeStyle=SEA; x.lineWidth=2*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-9*u,-1*u); x.quadraticCurveTo(-5*u,-5*u,-1*u,-1*u); x.quadraticCurveTo(3*u,3*u,7*u,-1*u); x.stroke();
  x.beginPath(); x.moveTo(-7*u,5*u); x.quadraticCurveTo(-3*u,1.4*u,1*u,5*u); x.stroke(); },
drop(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.moveTo(0,-8.6*u);
  x.quadraticCurveTo(6.4*u,-.6*u,5*u,3.4*u); x.quadraticCurveTo(3.4*u,8*u,0,8*u);
  x.quadraticCurveTo(-3.4*u,8*u,-5*u,3.4*u); x.quadraticCurveTo(-6.4*u,-.6*u,0,-8.6*u);
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SKY; x.beginPath(); x.arc(-1.6*u,3*u,1.3*u,0,7); x.fill(); },
splash(x,s){ const u=s/24; x.fillStyle=SEA;
  x.beginPath(); x.moveTo(0,-4*u); x.quadraticCurveTo(4.4*u,1*u,3*u,5*u); x.quadraticCurveTo(1.6*u,8*u,0,8*u); x.quadraticCurveTo(-1.6*u,8*u,-3*u,5*u); x.quadraticCurveTo(-4.4*u,1*u,0,-4*u); x.closePath(); x.fill();
  x.strokeStyle=SEA; x.lineWidth=1.6*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-6*u,-6*u); x.lineTo(-8*u,-9*u); x.moveTo(6*u,-6*u); x.lineTo(8*u,-9*u); x.moveTo(0,-6.4*u); x.lineTo(0,-9.4*u); x.stroke(); },
flame(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(0,-9.4*u);
  x.quadraticCurveTo(6.4*u,-3.4*u,5.4*u,2.6*u); x.quadraticCurveTo(4.4*u,8.6*u,0,8.6*u);
  x.quadraticCurveTo(-4.4*u,8.6*u,-5.4*u,2.6*u); x.quadraticCurveTo(-6.4*u,-3.4*u,0,-9.4*u);
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(0,-3.4*u); x.quadraticCurveTo(3*u,.4*u,2.6*u,3.4*u); x.quadraticCurveTo(2*u,6*u,0,6*u); x.quadraticCurveTo(-2*u,6*u,-2.6*u,3.4*u); x.quadraticCurveTo(-3*u,.4*u,0,-3.4*u); x.closePath(); x.fill(); },
smoke(x,s){ const u=s/24; x.strokeStyle=GRAY; x.lineWidth=2.2*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-6*u,6*u); x.quadraticCurveTo(-2*u,2*u,-5*u,-1*u); x.quadraticCurveTo(-8*u,-4*u,-4*u,-6.4*u); x.stroke();
  x.beginPath(); x.moveTo(1*u,6.6*u); x.quadraticCurveTo(5*u,2.6*u,2*u,-.6*u); x.quadraticCurveTo(-.4*u,-3.4*u,3*u,-5.4*u); x.stroke(); },
cloud(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath();
  x.arc(-4*u,1.4*u,3.6*u,0,7); x.arc(.4*u,-1.4*u,4.2*u,0,7); x.arc(5*u,1.4*u,3.4*u,0,7);
  x.rect(-5*u,1*u,11.6*u,3.6*u); x.closePath(); x.fill(); x.stroke(); },
sun(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,0,5*u,0,7); x.fill(); x.stroke();
  x.strokeStyle=GOLD; x.lineWidth=1.6*u; x.lineCap="round";
  for(let a=0;a<8;a++){ const an=a/8*7; x.beginPath(); x.moveTo(Math.cos(an)*6.8*u,Math.sin(an)*6.8*u); x.lineTo(Math.cos(an)*9*u,Math.sin(an)*9*u); x.stroke(); } },
moon(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,0,7*u,0,7); x.fill(); x.stroke();
  x.fillStyle=C.paper; x.beginPath(); x.arc(3.4*u,-1.6*u,5.6*u,0,7); x.fill(); },
snow(x,s){ const u=s/24; x.strokeStyle=SEA; x.lineWidth=1.5*u; x.lineCap="round";
  for(let a=0;a<6;a++){ const an=a/6*Math.PI; x.beginPath(); x.moveTo(Math.cos(an)*7*u,Math.sin(an)*7*u); x.lineTo(-Math.cos(an)*7*u,-Math.sin(an)*7*u); x.stroke(); }
  x.beginPath(); x.arc(0,0,2.2*u,0,7); x.stroke(); },
tornado(x,s){ const u=s/24; x.strokeStyle=DARK; x.lineWidth=1.9*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-8*u,-7*u); x.lineTo(8*u,-7*u); x.moveTo(-6.4*u,-3.4*u); x.lineTo(6*u,-3.4*u);
  x.moveTo(-4.6*u,.4*u); x.lineTo(4*u,.4*u); x.moveTo(-3*u,4*u); x.lineTo(2*u,4*u); x.moveTo(-1.4*u,7.4*u); x.lineTo(.6*u,7.4*u); x.stroke(); },
meteor(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.arc(2.6*u,2.6*u,5*u,0,7); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.arc(1*u,1.4*u,1.4*u,0,7); x.arc(4.4*u,3*u,1*u,0,7); x.fill();
  x.strokeStyle=GOLD; x.lineWidth=1.7*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-2.6*u,-.6*u); x.lineTo(-8*u,-6*u); x.moveTo(-.6*u,-4*u); x.lineTo(-4.4*u,-8*u); x.stroke(); },
mountain(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.beginPath(); x.moveTo(-9.4*u,8*u); x.lineTo(-1.4*u,-6*u); x.lineTo(3*u,1.4*u); x.lineTo(5.4*u,-2.4*u); x.lineTo(9.4*u,8*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.beginPath(); x.moveTo(-3*u,-2.2*u); x.lineTo(-1.4*u,-6*u); x.lineTo(0,-3.4*u); x.lineTo(-2.4*u,-.6*u); x.closePath(); x.fill(); },
umbrella(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,-2*u,8*u,Math.PI,0);
  x.quadraticCurveTo(4*u,-5*u,0,-2*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=CREAM; x.beginPath(); x.arc(0,-2*u,8*u,Math.PI,-Math.PI/2); x.lineTo(0,-2*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.4*u; x.beginPath(); x.moveTo(0,-2*u); x.lineTo(0,8*u); x.quadraticCurveTo(0,9.4*u,1.6*u,9*u); x.stroke(); },
cactus(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=OK; x.beginPath(); x.rect(-2.2*u,-8*u,4.4*u,17*u); x.fill(); x.stroke();
  x.beginPath(); x.rect(-7*u,-4*u,2.6*u,6*u); x.rect(-7*u,-4*u,4.8*u,2.4*u); x.fill(); x.stroke();
  x.beginPath(); x.rect(4.4*u,-1*u,2.6*u,7*u); x.rect(2.2*u,-1*u,4.8*u,2.4*u); x.fill(); x.stroke(); },
coral(x,s){ const u=s/24; x.strokeStyle=TERRA; x.lineWidth=2.2*u; x.lineCap="round";
  x.beginPath(); x.moveTo(0,9*u); x.lineTo(0,0); x.moveTo(0,2*u); x.quadraticCurveTo(-4*u,0,-4.6*u,-5*u); x.moveTo(0,0); x.quadraticCurveTo(4*u,-1*u,5*u,-6*u); x.moveTo(0,4*u); x.quadraticCurveTo(3*u,4.4*u,4.4*u,7*u); x.stroke(); },
planet(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,0,5.4*u,0,7); x.fill(); x.stroke();
  x.strokeStyle=TERRA; x.lineWidth=1.6*u; x.beginPath(); x.ellipse(0,.4*u,9*u,2.8*u,-.35,0,7); x.stroke(); },
earth(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.arc(0,0,7.4*u,0,7); x.fill(); x.stroke();
  x.fillStyle=OK; x.beginPath(); x.ellipse(-2*u,-2.4*u,3*u,2*u,-.4,0,7); x.fill();
  x.beginPath(); x.ellipse(2.6*u,2*u,2.6*u,1.8*u,.3,0,7); x.fill(); },

/* --- objetos --- */
door(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.rect(-6*u,-9*u,12*u,18*u); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.1*u; x.strokeRect(-3.6*u,-6.4*u,7.2*u,12.8*u);
  x.fillStyle=GOLD; x.beginPath(); x.arc(3.4*u,0,1.2*u,0,7); x.fill(); },
flag(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.beginPath(); x.moveTo(-6.4*u,9.4*u); x.lineTo(-6.4*u,-9*u); x.stroke();
  const q=4.4*u; x.fillStyle=PAPER; x.strokeStyle=INK; x.lineWidth=lw(x,s)*.7;
  for(let r=0;r<3;r++)for(let c2=0;c2<4;c2++){
    x.fillStyle=(r+c2)%2?INK:PAPER;
    x.fillRect(-6.4*u+c2*q, -9*u+r*q, q, q); x.strokeRect(-6.4*u+c2*q, -9*u+r*q, q, q);
  } },
pennant(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.beginPath(); x.moveTo(-5*u,9.4*u); x.lineTo(-5*u,-9*u); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-5*u,-9*u); x.lineTo(7*u,-6.4*u); x.lineTo(-5*u,-2.6*u); x.closePath(); x.fill(); x.stroke(); },
target(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.arc(0,0,8*u,0,7); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,0,5*u,0,7); x.fill();
  x.fillStyle=PAPER; x.beginPath(); x.arc(0,0,2.6*u,0,7); x.fill();
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,0,1*u,0,7); x.fill(); },
gem(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.moveTo(-7*u,-3.4*u); x.lineTo(-3.4*u,-7*u); x.lineTo(3.4*u,-7*u); x.lineTo(7*u,-3.4*u); x.lineTo(0,8*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=SKY; x.lineWidth=1.1*u; x.beginPath(); x.moveTo(-7*u,-3.4*u); x.lineTo(7*u,-3.4*u); x.moveTo(-3.4*u,-3.4*u); x.lineTo(0,8*u); x.lineTo(3.4*u,-3.4*u); x.stroke(); },
coin(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,0,7.4*u,0,7); x.fill(); x.stroke();
  x.strokeStyle=WOOD; x.lineWidth=1.4*u; x.beginPath(); x.moveTo(0,-4.4*u); x.lineTo(0,4.4*u); x.moveTo(-2.6*u,-4.4*u); x.lineTo(2.6*u,-4.4*u); x.moveTo(-2.6*u,4.4*u); x.lineTo(2.6*u,4.4*u); x.stroke(); },
money(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=OK; x.beginPath(); x.moveTo(-6.4*u,-3.4*u); x.quadraticCurveTo(0,-6.4*u,6.4*u,-3.4*u); x.quadraticCurveTo(9*u,3.4*u,4.4*u,7.4*u); x.lineTo(-4.4*u,7.4*u); x.quadraticCurveTo(-9*u,3.4*u,-6.4*u,-3.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=CREAM; x.beginPath(); x.ellipse(0,-.6*u,1.4*u,2.2*u,0,0,7); x.fill(); x.stroke(); },
key(x,s){ const u=s/24; x.lineWidth=1.6*u; x.strokeStyle=GOLD;
  x.beginPath(); x.arc(-4.4*u,0,3.4*u,0,7); x.stroke();
  x.beginPath(); x.moveTo(-1*u,0); x.lineTo(8*u,0); x.moveTo(4.4*u,0); x.lineTo(4.4*u,3.4*u); x.moveTo(8*u,0); x.lineTo(8*u,3.4*u); x.stroke(); },
lock(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineWidth=1.7*u; x.beginPath(); x.arc(0,-3.4*u,3.8*u,Math.PI,0); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.rect(-5.4*u,-3.4*u,10.8*u,9*u); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(0,1*u,1.6*u,0,7); x.fill(); x.fillRect(-.7*u,1*u,1.4*u,3*u); },
box(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.rect(-8*u,-6.4*u,16*u,13*u); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.2*u;
  x.beginPath(); x.moveTo(-8*u,-1*u); x.lineTo(8*u,-1*u); x.moveTo(-2.6*u,-6.4*u); x.lineTo(-2.6*u,6.6*u); x.moveTo(2.6*u,-6.4*u); x.lineTo(2.6*u,6.6*u); x.stroke(); },
barrel(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-5.4*u,-8*u); x.lineTo(5.4*u,-8*u); x.quadraticCurveTo(7.4*u,0,5.4*u,8*u); x.lineTo(-5.4*u,8*u); x.quadraticCurveTo(-7.4*u,0,-5.4*u,-8*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=DARK; x.lineWidth=1.3*u;
  x.beginPath(); x.moveTo(-6.4*u,-3.4*u); x.lineTo(6.4*u,-3.4*u); x.moveTo(-6.4*u,3.4*u); x.lineTo(6.4*u,3.4*u); x.stroke(); },
brick(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.rect(-8*u,-5.4*u,16*u,10.8*u); x.fill(); x.stroke();
  x.strokeStyle=CREAM; x.lineWidth=1.2*u;
  x.beginPath(); x.moveTo(-8*u,-1.4*u); x.lineTo(8*u,-1.4*u); x.moveTo(-2.6*u,-5.4*u); x.lineTo(-2.6*u,-1.4*u); x.moveTo(2.6*u,-1.4*u); x.lineTo(2.6*u,5.4*u); x.stroke(); },
ice(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SKY; x.beginPath(); x.moveTo(-6*u,-5*u); x.lineTo(0,-8*u); x.lineTo(6*u,-5*u); x.lineTo(6*u,5*u); x.lineTo(0,8*u); x.lineTo(-6*u,5*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=PAPER; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(-3*u,-4*u); x.lineTo(3*u,-2*u); x.moveTo(-4*u,0); x.lineTo(1*u,2.4*u); x.stroke(); },
ball(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.arc(0,0,7.4*u,0,7); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.3*u;
  x.beginPath(); x.arc(0,0,2.6*u,0,7); x.stroke();
  for(let a=0;a<3;a++){ const an=a/3*Math.PI+.5; x.beginPath(); x.ellipse(0,0,7.4*u,2.6*u,an,0,7); x.stroke(); } },
egg(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.ellipse(0,0,5.4*u,7*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.arc(-1.6*u,-2.4*u,1.6*u,0,7); x.fill(); },
bomb(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=INK; x.beginPath(); x.arc(0,1.4*u,6.4*u,0,7); x.fill();
  x.fillStyle=GRAY; x.beginPath(); x.arc(-2*u,-.6*u,1.6*u,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.beginPath(); x.moveTo(3*u,-3.4*u); x.quadraticCurveTo(5.4*u,-6.4*u,8*u,-5.4*u); x.stroke();
  x.fillStyle=GOLD; x.save(); x.translate(8.6*u,-5.4*u); x.rotate(.7); x.fillRect(-1.1*u,-2.6*u,2.2*u,5.2*u); x.restore(); },
gear(x,s){ const u=s/24; x.fillStyle=GRAY; x.strokeStyle=INK; x.lineWidth=lw(x,s);
  x.beginPath();
  for(let a=0;a<8;a++){ const an=a/8*7, st=an-.2, en=an+.2;
    x.lineTo(Math.cos(st)*8.4*u,Math.sin(st)*8.4*u); x.lineTo(Math.cos(an)*6.2*u,Math.sin(an)*6.2*u);
    x.lineTo(Math.cos(an+ .39)*6.2*u,Math.sin(an+.39)*6.2*u); x.lineTo(Math.cos(en)*8.4*u,Math.sin(en)*8.4*u); }
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=C.paper; x.beginPath(); x.arc(0,0,3*u,0,7); x.fill(); x.stroke(); },
bell(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-6.4*u,4.4*u); x.quadraticCurveTo(-5*u,-6.4*u,0,-6.4*u); x.quadraticCurveTo(5*u,-6.4*u,6.4*u,4.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(0,6.6*u,2*u,0,7); x.fill(); x.fillRect(-.8*u,-9.4*u,1.6*u,3*u); },
hammer(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(-.7);
  x.fillStyle=GRAY; x.fillRect(-7*u,-7*u,10*u,4.6*u); x.strokeRect(-7*u,-7*u,10*u,4.6*u);
  x.fillStyle=WOOD; x.fillRect(-1.6*u,-2.4*u,3.2*u,12*u); x.strokeRect(-1.6*u,-2.4*u,3.2*u,12*u);
  x.restore(); },
wrench(x,s){ const u=s/24; x.lineWidth=2*u; x.strokeStyle=GRAY; x.lineCap="round";
  x.beginPath(); x.moveTo(-5*u,5*u); x.lineTo(4*u,-4*u); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.2*u;
  x.beginPath(); x.arc(5.6*u,-5.6*u,2.8*u,.6,3.4); x.stroke();
  x.beginPath(); x.arc(-6*u,6*u,2.8*u,-2.4,.8); x.stroke(); },
pick(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(-.6);
  x.fillStyle=WOOD; x.fillRect(-1.3*u,-3*u,2.6*u,12*u); x.strokeRect(-1.3*u,-3*u,2.6*u,12*u);
  x.strokeStyle=GRAY; x.lineWidth=2.4*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-7*u,-3.4*u); x.quadraticCurveTo(0,-8*u,7*u,-3.4*u); x.stroke();
  x.restore(); },
axe(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(-.7);
  x.fillStyle=WOOD; x.fillRect(-1.3*u,-4*u,2.6*u,12.6*u); x.strokeRect(-1.3*u,-4*u,2.6*u,12.6*u);
  x.fillStyle=GRAY; x.beginPath(); x.moveTo(.6*u,-4*u); x.quadraticCurveTo(7.4*u,-6.4*u,6.4*u,.4*u); x.lineTo(.6*u,-1*u); x.closePath(); x.fill(); x.stroke();
  x.restore(); },
scissors(x,s){ const u=s/24; x.lineWidth=1.7*u; x.strokeStyle=GRAY; x.lineCap="round";
  x.beginPath(); x.moveTo(-4*u,4*u); x.lineTo(4.4*u,-4*u); x.moveTo(4*u,4*u); x.lineTo(-4.4*u,-4*u); x.stroke();
  x.strokeStyle=INK;
  x.beginPath(); x.arc(-4.6*u,5.6*u,2.2*u,0,7); x.stroke();
  x.beginPath(); x.arc(4.6*u,5.6*u,2.2*u,0,7); x.stroke(); },
bone(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.beginPath(); x.rect(-5.4*u,-1.2*u,10.8*u,2.4*u);
  x.arc(-5.4*u,-1.6*u,2*u,0,7); x.arc(-5.4*u,1.6*u,2*u,0,7);
  x.arc(5.4*u,-1.6*u,2*u,0,7); x.arc(5.4*u,1.6*u,2*u,0,7); x.fill(); x.stroke(); },
skull(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.beginPath(); x.arc(0,-1*u,6.6*u,0,7); x.fill(); x.stroke();
  x.fillRect(-3.4*u,3.4*u,6.8*u,3.4*u); x.strokeRect(-3.4*u,3.4*u,6.8*u,3.4*u);
  x.fillStyle=INK; x.beginPath(); x.arc(-2.6*u,-1.4*u,1.7*u,0,7); x.arc(2.6*u,-1.4*u,1.7*u,0,7); x.fill();
  x.fillRect(-1.4*u,3.4*u,1*u,3.4*u); x.fillRect(.6*u,3.4*u,1*u,3.4*u); },
heart(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(0,7.4*u);
  x.quadraticCurveTo(-8.6*u,1*u,-6.4*u,-3.4*u); x.quadraticCurveTo(-4.6*u,-7.4*u,0,-3.4*u);
  x.quadraticCurveTo(4.6*u,-7.4*u,6.4*u,-3.4*u); x.quadraticCurveTo(8.6*u,1*u,0,7.4*u);
  x.closePath(); x.fill(); x.stroke(); },
star(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath();
  for(let a=0;a<10;a++){ const an=-Math.PI/2+a*Math.PI/5, rr=a%2?3.8*u:8.4*u;
    x.lineTo(Math.cos(an)*rr,Math.sin(an)*rr); }
  x.closePath(); x.fill(); x.stroke(); },
check(x,s){ const u=s/24; x.fillStyle=OK; x.strokeStyle=OK; x.lineWidth=2.6*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(-6*u,.6*u); x.lineTo(-1.6*u,5*u); x.lineTo(6.6*u,-4.6*u); x.stroke(); },
cross(x,s){ const u=s/24; x.strokeStyle=TERRA; x.lineWidth=2.6*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-5*u,-5*u); x.lineTo(5*u,5*u); x.moveTo(5*u,-5*u); x.lineTo(-5*u,5*u); x.stroke(); },
warning(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(0,-8.6*u); x.lineTo(8.6*u,7.4*u); x.lineTo(-8.6*u,7.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.fillRect(-1.1*u,-3.4*u,2.2*u,6.4*u); x.beginPath(); x.arc(0,5.4*u,1.3*u,0,7); x.fill(); },
question(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.arc(0,0,8*u,0,7); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.font="bold "+(9*u)+"px "+'"Plus Jakarta Sans",sans-serif';
  x.textAlign="center"; x.textBaseline="middle"; x.fillText("?",0,.6*u); },
arrowL(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=2.4*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(6*u,0); x.lineTo(-6*u,0); x.moveTo(-1.4*u,-5*u); x.lineTo(-6.6*u,0); x.lineTo(-1.4*u,5*u); x.stroke(); },
arrowR(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=2.4*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(-6*u,0); x.lineTo(6*u,0); x.moveTo(1.4*u,-5*u); x.lineTo(6.6*u,0); x.lineTo(1.4*u,5*u); x.stroke(); },
arrowU(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=2.4*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(0,6*u); x.lineTo(0,-6*u); x.moveTo(-5*u,-1.4*u); x.lineTo(0,-6.6*u); x.lineTo(5*u,-1.4*u); x.stroke(); },
arrowD(x,s){ const u=s/24; x.strokeStyle=INK; x.lineWidth=2.4*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(0,-6*u); x.lineTo(0,6*u); x.moveTo(-5*u,1.4*u); x.lineTo(0,6.6*u); x.lineTo(5*u,1.4*u); x.stroke(); },
eye(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.moveTo(-8*u,0); x.quadraticCurveTo(0,-7.4*u,8*u,0); x.quadraticCurveTo(0,7.4*u,-8*u,0); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SEA; x.beginPath(); x.arc(0,0,3.4*u,0,7); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(0,0,1.4*u,0,7); x.fill(); },
hole(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=INK; x.beginPath(); x.ellipse(0,1*u,7.4*u,4.2*u,0,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.ellipse(0,1*u,9*u,5.4*u,0,0,7); x.stroke(); },
magnet(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=TERRA; x.lineWidth=4*u; x.lineCap="butt";
  x.beginPath(); x.arc(0,0,5.4*u,Math.PI,0); x.stroke();
  x.beginPath(); x.moveTo(-5.4*u,0); x.lineTo(-5.4*u,6*u); x.moveTo(5.4*u,0); x.lineTo(5.4*u,6*u); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.2*u;
  x.strokeRect(-7.4*u,-1.4*u,4*u,2.8*u); x.strokeRect(3.4*u,-1.4*u,4*u,2.8*u); },
mailbox(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.moveTo(-7*u,2*u); x.lineTo(-7*u,-3.4*u); x.arc(-3.4*u,-3.4*u,3.6*u,Math.PI,0); x.lineTo(7*u,2*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=WOOD; x.fillRect(-1.4*u,2*u,2.8*u,7*u); x.strokeRect(-1.4*u,2*u,2.8*u,7*u);
  x.fillStyle=CREAM; x.fillRect(3*u,-6*u,1.6*u,5*u); },
tower(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.beginPath(); x.moveTo(-4.4*u,9*u); x.lineTo(-3*u,-6*u); x.lineTo(3*u,-6*u); x.lineTo(4.4*u,9*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-4*u,-6*u); x.lineTo(0,-10.6*u); x.lineTo(4*u,-6*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SEA; x.fillRect(-1.4*u,-1*u,2.8*u,4*u); },
house(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.fillRect(-7*u,-1.4*u,14*u,10.4*u); x.strokeRect(-7*u,-1.4*u,14*u,10.4*u);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-8.6*u,-1.4*u); x.lineTo(0,-9.4*u); x.lineTo(8.6*u,-1.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=WOOD; x.fillRect(-1.8*u,2*u,3.6*u,7*u); x.strokeRect(-1.8*u,2*u,3.6*u,7*u); },
cabin(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.fillRect(-7*u,-1.4*u,14*u,10.4*u); x.strokeRect(-7*u,-1.4*u,14*u,10.4*u);
  x.fillStyle=TERRA_D; x.beginPath(); x.moveTo(-8.6*u,-1.4*u); x.lineTo(0,-8*u); x.lineTo(8.6*u,-1.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.fillRect(-1.6*u,1.6*u,3.2*u,7.4*u); },
building(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.beginPath(); x.rect(-6*u,-9*u,12*u,18*u); x.fill(); x.stroke();
  x.fillStyle=SKY;
  for(let r=0;r<4;r++)for(let c2=0;c2<3;c2++) x.fillRect(-4.4*u+c2*3.4*u,-7*u+r*4*u,2*u,2.4*u); },
factory(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=DARK; x.beginPath(); x.moveTo(-8*u,8*u); x.lineTo(-8*u,-3.4*u); x.lineTo(-1*u,.6*u); x.lineTo(-1*u,-3.4*u); x.lineTo(6*u,.6*u); x.lineTo(6*u,-8*u); x.lineTo(8.6*u,-8*u); x.lineTo(8.6*u,8*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.beginPath(); x.arc(7.4*u,-11*u,1.7*u,0,7); x.arc(6*u,-14*u,1.3*u,0,7); x.fill(); },
castle(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.fillRect(-8*u,-3*u,16*u,12*u); x.strokeRect(-8*u,-3*u,16*u,12*u);
  x.fillRect(-8*u,-8*u,4.6*u,5*u); x.strokeRect(-8*u,-8*u,4.6*u,5*u);
  x.fillRect(3.4*u,-8*u,4.6*u,5*u); x.strokeRect(3.4*u,-8*u,4.6*u,5*u);
  x.fillStyle=INK; x.fillRect(-1.6*u,1*u,3.2*u,8*u); },
tent(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=OK; x.beginPath(); x.moveTo(0,-8.6*u); x.lineTo(9*u,8*u); x.lineTo(-9*u,8*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=CREAM; x.beginPath(); x.moveTo(0,-3.4*u); x.lineTo(3*u,8*u); x.lineTo(-3*u,8*u); x.closePath(); x.fill(); x.stroke(); },
bed(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.fillRect(-8*u,0,16*u,2.4*u); x.strokeRect(-8*u,0,16*u,2.4*u);
  x.fillRect(-8*u,-5*u,2*u,5*u); x.strokeRect(-8*u,-5*u,2*u,5*u);
  x.fillStyle=PAPER; x.fillRect(-6*u,-2*u,12*u,2*u); x.strokeRect(-6*u,-2*u,12*u,2*u);
  x.fillStyle=SEA; x.fillRect(-5.4*u,-3.4*u,4*u,1.8*u); },
bulb(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,-1.4*u,5.6*u,0,7); x.fill(); x.stroke();
  x.fillStyle=GRAY; x.fillRect(-2.4*u,3.4*u,4.8*u,2.4*u); x.strokeRect(-2.4*u,3.4*u,4.8*u,2.4*u);
  x.fillRect(-1.6*u,5.8*u,3.2*u,1.6*u); x.strokeRect(-1.6*u,5.8*u,3.2*u,1.6*u);
  x.strokeStyle=PAPER; x.lineWidth=1.1*u; x.beginPath(); x.moveTo(-2*u,-2.4*u); x.quadraticCurveTo(0,-4.4*u,2*u,-2.4*u); x.stroke(); },
camera(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.beginPath(); x.rect(-8*u,-4.4*u,16*u,10*u); x.fill(); x.stroke();
  x.fillStyle=DARK; x.fillRect(-3*u,-6.6*u,6*u,2.2*u);
  x.fillStyle=SKY; x.beginPath(); x.arc(0,.6*u,3.4*u,0,7); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.fillRect(4.4*u,-2.8*u,2*u,1.4*u); },
tv(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=DARK; x.beginPath(); x.rect(-8*u,-6.6*u,16*u,11*u); x.fill(); x.stroke();
  x.fillStyle=SKY; x.fillRect(-6*u,-4.6*u,12*u,7*u);
  x.strokeStyle=INK; x.lineWidth=1.4*u; x.beginPath(); x.moveTo(-2*u,4.4*u); x.lineTo(-3.4*u,8*u); x.moveTo(2*u,4.4*u); x.lineTo(3.4*u,8*u); x.stroke(); },
speaker(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=DARK; x.beginPath(); x.moveTo(-6*u,-3*u); x.lineTo(-2*u,-3*u); x.lineTo(2*u,-7*u); x.lineTo(2*u,7*u); x.lineTo(-2*u,3*u); x.lineTo(-6*u,3*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.lineCap="round";
  x.beginPath(); x.arc(3.4*u,0,3*u,-.9,.9); x.stroke();
  x.beginPath(); x.arc(3.4*u,0,5.4*u,-.8,.8); x.stroke(); },
bucket(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.beginPath(); x.moveTo(-5.4*u,-4*u); x.lineTo(5.4*u,-4*u); x.lineTo(4*u,7*u); x.lineTo(-4*u,7*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.3*u; x.beginPath(); x.arc(0,-4.4*u,5.4*u,Math.PI,0); x.stroke();
  x.fillStyle=SEA; x.fillRect(-4.6*u,-1.4*u,9.2*u,2*u); },
basket(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-6.4*u,-2*u); x.lineTo(6.4*u,-2*u); x.lineTo(5*u,7*u); x.lineTo(-5*u,7*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.1*u;
  x.beginPath(); x.moveTo(-6*u,0); x.lineTo(6*u,0); x.moveTo(-5.4*u,2.6*u); x.lineTo(5.4*u,2.6*u); x.moveTo(-5*u,5*u); x.lineTo(5*u,5*u); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.beginPath(); x.arc(0,-3.4*u,4*u,Math.PI,0); x.stroke(); },
log(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(-.5);
  x.fillStyle=WOOD; x.beginPath(); x.rect(-8*u,-3.4*u,16*u,6.8*u); x.fill(); x.stroke();
  x.fillStyle=WOOD_L; x.beginPath(); x.ellipse(8*u,0,2*u,3.4*u,0,0,7); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.1*u; x.beginPath(); x.moveTo(-5*u,-1.4*u); x.lineTo(5*u,-1.4*u); x.moveTo(-5*u,1.4*u); x.lineTo(5*u,1.4*u); x.stroke();
  x.restore(); },
pot(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-5.4*u,-5*u); x.quadraticCurveTo(-7.4*u,2*u,-3*u,7*u); x.lineTo(3*u,7*u); x.quadraticCurveTo(7.4*u,2*u,5.4*u,-5*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=WOOD_D||GOLD; x.beginPath(); x.ellipse(0,-5*u,5.4*u,1.8*u,0,0,7); x.fill(); x.stroke(); },
telescope(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(.5);
  x.fillStyle=GRAY; x.fillRect(-2*u,-8.4*u,4*u,14*u); x.strokeRect(-2*u,-8.4*u,4*u,14*u);
  x.restore();
  x.save(); x.rotate(-.6);
  x.fillStyle=SEA; x.fillRect(-7*u,-2*u,14*u,3.4*u); x.strokeRect(-7*u,-2*u,14*u,3.4*u);
  x.fillStyle=GOLD; x.fillRect(5*u,-2*u,2.6*u,3.4*u); x.strokeRect(5*u,-2*u,2.6*u,3.4*u);
  x.restore(); },
microscope(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.save(); x.rotate(.4); x.fillRect(-1.6*u,-8*u,3.2*u,9*u); x.strokeRect(-1.6*u,-8*u,3.2*u,9*u); x.restore();
  x.fillStyle=SEA; x.save(); x.translate(1*u,-7.4*u); x.rotate(.9); x.fillRect(-3.4*u,-1.6*u,6*u,3.2*u); x.strokeRect(-3.4*u,-1.6*u,6*u,3.2*u); x.restore();
  x.fillStyle=DARK; x.fillRect(-5*u,6*u,10*u,2.4*u); x.strokeRect(-5*u,6*u,10*u,2.4*u);
  x.strokeStyle=INK; x.lineWidth=1.4*u; x.beginPath(); x.arc(0,1.4*u,6*u,-.4,1.2); x.stroke(); },
battery(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.rect(-4.4*u,-7*u,8.8*u,14*u); x.fill(); x.stroke();
  x.fillStyle=INK; x.fillRect(-2*u,-8.4*u,4*u,1.4*u);
  x.fillStyle=TERRA; x.fillRect(-4.4*u,-3.4*u,8.8*u,4*u); },
plug(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.beginPath(); x.rect(-4*u,-3.4*u,8*u,7*u); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-2.4*u,-3.4*u); x.lineTo(-2.4*u,-7.4*u); x.moveTo(2.4*u,-3.4*u); x.lineTo(2.4*u,-7.4*u); x.moveTo(0,3.4*u); x.quadraticCurveTo(0,7.4*u,0,8*u); x.stroke(); },
clipboard(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.rect(-5.4*u,-7*u,10.8*u,15*u); x.fill(); x.stroke();
  x.fillStyle=CREAM; x.fillRect(-3.4*u,-4.4*u,6.8*u,10*u);
  x.strokeStyle=GRAY; x.lineWidth=1.1*u;
  x.beginPath(); x.moveTo(-2*u,-1.4*u); x.lineTo(2*u,-1.4*u); x.moveTo(-2*u,1.4*u); x.lineTo(2*u,1.4*u); x.moveTo(-2*u,4*u); x.lineTo(2*u,4*u); x.stroke();
  x.fillStyle=GRAY; x.fillRect(-2*u,-8*u,4*u,2*u); },
medal(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-5*u,-8*u); x.lineTo(-1*u,-1*u); x.lineTo(1*u,-1*u); x.lineTo(5*u,-8*u); x.lineTo(1.4*u,-8*u); x.lineTo(0,-5*u); x.lineTo(-1.4*u,-8*u); x.closePath(); x.fill();
  x.fillStyle=GOLD; x.beginPath(); x.arc(0,3*u,5*u,0,7); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,3*u,2.6*u,0,7); x.fill(); },
trophy(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-5*u,-8*u); x.lineTo(5*u,-8*u); x.quadraticCurveTo(5*u,-.6*u,0,-.6*u); x.quadraticCurveTo(-5*u,-.6*u,-5*u,-8*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=GOLD; x.lineWidth=1.6*u;
  x.beginPath(); x.arc(-6.4*u,-5.4*u,2.4*u,Math.PI*.4,Math.PI*1.5); x.stroke();
  x.beginPath(); x.arc(6.4*u,-5.4*u,2.4*u,Math.PI*1.5,Math.PI*.6); x.stroke();
  x.fillStyle=GOLD; x.fillRect(-1.6*u,-.6*u,3.2*u,5*u); x.strokeRect(-1.6*u,-.6*u,3.2*u,5*u);
  x.fillStyle=WOOD; x.fillRect(-4.4*u,4.4*u,8.8*u,2.6*u); x.strokeRect(-4.4*u,4.4*u,8.8*u,2.6*u); },
crown(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-8*u,5*u); x.lineTo(-8*u,-5*u); x.lineTo(-3.4*u,-1*u); x.lineTo(0,-8*u); x.lineTo(3.4*u,-1*u); x.lineTo(8*u,-5*u); x.lineTo(8*u,5*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(-4*u,1*u,1.2*u,0,7); x.arc(0,1*u,1.2*u,0,7); x.arc(4*u,1*u,1.2*u,0,7); x.fill(); },
dice(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.rect(-7*u,-7*u,14*u,14*u); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-3.4*u,-3.4*u,1.3*u,0,7); x.arc(3.4*u,-3.4*u,1.3*u,0,7); x.arc(0,0,1.3*u,0,7); x.arc(-3.4*u,3.4*u,1.3*u,0,7); x.arc(3.4*u,3.4*u,1.3*u,0,7); x.fill(); },
gauge(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=PAPER; x.beginPath(); x.arc(0,0,7.4*u,0,7); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.4*u; x.lineCap="round";
  x.beginPath(); x.moveTo(0,0); x.lineTo(4*u,-4*u); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(0,0,1.6*u,0,7); x.fill();
  x.strokeStyle=TERRA; x.beginPath(); x.arc(0,0,5.4*u,-2.4,-1.2); x.stroke(); },
candle(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=CREAM; x.fillRect(-1.8*u,-2*u,3.6*u,10*u); x.strokeRect(-1.8*u,-2*u,3.6*u,10*u);
  x.fillStyle=GOLD; x.beginPath(); x.ellipse(0,8*u,4.4*u,1.4*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(0,-4*u); x.quadraticCurveTo(2.4*u,-6.4*u,0,-9.4*u); x.quadraticCurveTo(-2.4*u,-6.4*u,0,-4*u); x.fill(); },
rope(x,s){ const u=s/24; x.strokeStyle=WOOD; x.lineWidth=2.2*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-7*u,-6*u); x.quadraticCurveTo(0,-4*u,-1*u,0); x.quadraticCurveTo(-2*u,4*u,4*u,6*u); x.stroke();
  x.beginPath(); x.moveTo(2*u,-2*u); x.quadraticCurveTo(6*u,-4*u,7*u,-6*u); x.stroke(); },
chain(x,s){ const u=s/24; x.strokeStyle=GRAY; x.lineWidth=1.7*u;
  x.beginPath(); x.ellipse(-4.4*u,0,3*u,2*u,.5,0,7); x.stroke();
  x.beginPath(); x.ellipse(0,0,3*u,2*u,0,0,7); x.stroke();
  x.beginPath(); x.ellipse(4.4*u,0,3*u,2*u,-.5,0,7); x.stroke(); },
signpost(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.fillRect(-1.2*u,-6*u,2.4*u,15*u); x.strokeRect(-1.2*u,-6*u,2.4*u,15*u);
  x.fillStyle=SEA; x.beginPath(); x.moveTo(-7*u,-6*u); x.lineTo(7*u,-6*u); x.lineTo(7*u,-1.4*u); x.lineTo(-7*u,-1.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.beginPath(); x.moveTo(-4.4*u,-5*u); x.lineTo(1*u,-3.6*u); x.lineTo(-4.4*u,-2.4*u); x.closePath(); x.fill(); },
siren(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-4.4*u,2*u); x.quadraticCurveTo(-4.4*u,-7*u,0,-7*u); x.quadraticCurveTo(4.4*u,-7*u,4.4*u,2*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=DARK; x.fillRect(-5.4*u,2*u,10.8*u,2.4*u); x.strokeRect(-5.4*u,2*u,10.8*u,2.4*u);
  x.strokeStyle=GOLD; x.lineWidth=1.4*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-7*u,-6*u); x.lineTo(-8.6*u,-7.4*u); x.moveTo(7*u,-6*u); x.lineTo(8.6*u,-7.4*u); x.moveTo(0,-9*u); x.lineTo(0,-10.6*u); x.stroke(); },
teddy(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD;
  x.beginPath(); x.arc(-4.6*u,-5.4*u,2.4*u,0,7); x.arc(4.6*u,-5.4*u,2.4*u,0,7); x.fill();
  x.beginPath(); x.arc(0,0,5.4*u,0,7); x.fill(); x.stroke();
  x.fillStyle=WOOD_L; x.beginPath(); x.ellipse(0,2.4*u,2.4*u,1.8*u,0,0,7); x.fill();
  x.fillStyle=INK; x.beginPath(); x.arc(-1.8*u,-1.4*u,.9*u,0,7); x.arc(1.8*u,-1.4*u,.9*u,0,7); x.fill();
  x.beginPath(); x.arc(0,.6*u,1*u,0,7); x.fill(); },
drum(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.ellipse(0,4*u,6.4*u,3.4*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.beginPath(); x.ellipse(0,-2*u,6.4*u,3.4*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.fillRect(-6.4*u,-2*u,12.8*u,6*u); x.strokeRect(-6.4*u,-2*u,12.8*u,6*u);
  x.strokeStyle=INK; x.lineWidth=1.3*u; x.lineCap="round";
  x.beginPath(); x.moveTo(-3*u,-4.4*u); x.lineTo(-5.4*u,-8*u); x.moveTo(3*u,-4.4*u); x.lineTo(5.4*u,-8*u); x.stroke(); },
tophat(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=INK; x.fillRect(-4.4*u,-9*u,8.8*u,10*u);
  x.fillRect(-7.4*u,1*u,14.8*u,2.4*u);
  x.fillStyle=TERRA; x.fillRect(-4.4*u,-1.4*u,8.8*u,2*u); },
letters(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=INK; x.font="bold "+(11*u)+"px "+'"Space Mono",monospace';
  x.textAlign="center"; x.textBaseline="middle";
  x.fillText("Aa",0,.6*u);
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(-7*u,-7*u); x.lineTo(7*u,-7*u); x.moveTo(-7*u,7*u); x.lineTo(7*u,7*u); x.stroke(); },
book(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.moveTo(-7*u,-7*u); x.quadraticCurveTo(0,-8.6*u,0,-6.4*u); x.lineTo(0,7*u); x.quadraticCurveTo(0,5*u,-7*u,6.6*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=SEA; x.beginPath(); x.moveTo(7*u,-7*u); x.quadraticCurveTo(0,-8.6*u,0,-6.4*u); x.lineTo(0,7*u); x.quadraticCurveTo(0,5*u,7*u,6.6*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=PAPER; x.lineWidth=1*u; x.beginPath(); x.moveTo(0,-6*u); x.lineTo(0,6*u); x.stroke(); },
cabinet(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.rect(-6.4*u,-8*u,12.8*u,16*u); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(-6.4*u,0); x.lineTo(6.4*u,0); x.stroke();
  x.fillStyle=INK; x.fillRect(-1.4*u,-4*u,2.8*u,1.4*u); x.fillRect(-1.4*u,3*u,2.8*u,1.4*u); },
flashlight(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(-.7);
  x.fillStyle=GRAY; x.fillRect(-3*u,-4*u,6*u,12*u); x.strokeRect(-3*u,-4*u,6*u,12*u);
  x.fillStyle=GOLD; x.fillRect(-4.4*u,-8*u,8.8*u,4*u); x.strokeRect(-4.4*u,-8*u,8.8*u,4*u);
  x.restore();
  x.strokeStyle=GOLD; x.lineWidth=1.4*u; x.lineCap="round";
  x.beginPath(); x.moveTo(6*u,-8*u); x.lineTo(8*u,-10*u); x.moveTo(8.6*u,-5*u); x.lineTo(11*u,-6*u); x.stroke(); },
satellite(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GRAY; x.fillRect(-1.6*u,-3.4*u,3.2*u,7*u); x.strokeRect(-1.6*u,-3.4*u,3.2*u,7*u);
  x.fillStyle=SEA; x.fillRect(-8*u,-2.4*u,4*u,5*u); x.strokeRect(-8*u,-2.4*u,4*u,5*u);
  x.fillRect(4*u,-2.4*u,4*u,5*u); x.strokeRect(4*u,-2.4*u,4*u,5*u);
  x.strokeStyle=INK; x.lineWidth=1.3*u; x.beginPath(); x.moveTo(0,-3.4*u); x.lineTo(0,-6.4*u); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,-7.4*u,1.4*u,0,7); x.fill(); },
scale(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineWidth=1.5*u;
  x.beginPath(); x.moveTo(0,-8*u); x.lineTo(0,7*u); x.moveTo(-6*u,7*u); x.lineTo(6*u,7*u); x.moveTo(-6*u,-6*u); x.lineTo(6*u,-6*u); x.stroke();
  x.fillStyle=GOLD;
  x.beginPath(); x.moveTo(-8.6*u,-1*u); x.quadraticCurveTo(-6*u,4*u,-3.4*u,-1*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(3.4*u,-1*u); x.quadraticCurveTo(6*u,4*u,8.6*u,-1*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(0,-8*u,1.4*u,0,7); x.fill(); },
fruit(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,1*u,6.4*u,0,7); x.fill(); x.stroke();
  x.fillStyle=OK; x.beginPath(); x.ellipse(2.6*u,-6*u,2.6*u,1.4*u,-.6,0,7); x.fill();
  x.strokeStyle=OK; x.lineWidth=1.3*u; x.beginPath(); x.moveTo(0,-5*u); x.quadraticCurveTo(1*u,-7*u,2.6*u,-6*u); x.stroke(); },
bread(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-7*u,6*u); x.lineTo(-7*u,-1*u); x.quadraticCurveTo(-7*u,-7*u,0,-7*u); x.quadraticCurveTo(7*u,-7*u,7*u,-1*u); x.lineTo(7*u,6*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=WOOD_L; x.lineWidth=1.2*u;
  x.beginPath(); x.moveTo(-3.4*u,-2.4*u); x.lineTo(3.4*u,-2.4*u); x.moveTo(-3.4*u,1.4*u); x.lineTo(3.4*u,1.4*u); x.moveTo(-3.4*u,4.4*u); x.lineTo(3.4*u,4.4*u); x.stroke(); },
burger(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(-7*u,0); x.quadraticCurveTo(-7*u,-7*u,0,-7*u); x.quadraticCurveTo(7*u,-7*u,7*u,0); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=OK; x.fillRect(-7.4*u,.6*u,14.8*u,2*u); x.strokeRect(-7.4*u,.6*u,14.8*u,2*u);
  x.fillStyle=WOOD; x.beginPath(); x.moveTo(-7*u,3.4*u); x.lineTo(7*u,3.4*u); x.quadraticCurveTo(7*u,7*u,0,7*u); x.quadraticCurveTo(-7*u,7*u,-7*u,3.4*u); x.closePath(); x.fill(); x.stroke(); },
candy(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,0,4.6*u,0,7); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(-4*u,-2*u); x.lineTo(-8*u,-4.6*u); x.lineTo(-7.4*u,0); x.lineTo(-8*u,4.6*u); x.lineTo(-4*u,2*u); x.closePath(); x.fill(); x.stroke();
  x.beginPath(); x.moveTo(4*u,-2*u); x.lineTo(8*u,-4.6*u); x.lineTo(7.4*u,0); x.lineTo(8*u,4.6*u); x.lineTo(4*u,2*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=CREAM; x.beginPath(); x.arc(-1.4*u,-1.4*u,1*u,0,7); x.fill(); },
dot(x,s){ const u=s/24; x.fillStyle=INK; x.beginPath(); x.arc(0,0,5.6*u,0,7); x.fill(); },
dotOn(x,s){ const u=s/24; x.lineWidth=lw(x,s); x.fillStyle=OK; x.beginPath(); x.arc(0,0,6*u,0,7); x.fill(); x.stroke(); },
dotOff(x,s){ const u=s/24; x.lineWidth=lw(x,s); x.strokeStyle=INK; x.beginPath(); x.arc(0,0,6*u,0,7); x.stroke(); },
sq(x,s){ const u=s/24; x.lineWidth=lw(x,s); x.fillStyle=INK; x.fillRect(-5.6*u,-5.6*u,11.2*u,11.2*u); },
sqOk(x,s){ const u=s/24; x.lineWidth=lw(x,s); x.fillStyle=OK; x.fillRect(-5.6*u,-5.6*u,11.2*u,11.2*u); x.strokeRect(-5.6*u,-5.6*u,11.2*u,11.2*u); },
diamond(x,s){ const u=s/24; x.lineWidth=lw(x,s); x.fillStyle=SEA; x.beginPath(); x.moveTo(0,-7*u); x.lineTo(7*u,0); x.lineTo(0,7*u); x.lineTo(-7*u,0); x.closePath(); x.fill(); x.stroke(); },
spark(x,s){ const u=s/24; x.fillStyle=GOLD;
  x.save(); for(let a=0;a<4;a++){ x.rotate(Math.PI/4); x.beginPath(); x.ellipse(0,0,7.4*u,1.7*u,0,0,7); x.fill(); } x.restore();
  x.fillStyle=PAPER; x.beginPath(); x.arc(0,0,2*u,0,7); x.fill(); },
burst(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath();
  for(let a=0;a<12;a++){ const an=a/12*7, rr=a%2?3.4*u:8*u; x.lineTo(Math.cos(an)*rr,Math.sin(an)*rr); }
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=TERRA; x.beginPath(); x.arc(0,0,2.6*u,0,7); x.fill(); },
sleep(x,s){ const u=s/24; x.fillStyle=SEA; x.strokeStyle=INK; x.lineWidth=lw(x,s)*.7;
  [[-4,-3,3],[2,-1,3.6],[-1,5,2.6]].forEach(v=>{
    x.font="bold "+(v[2]*u)+"px "+'"Space Mono",monospace'; x.textAlign="center"; x.textBaseline="middle";
    x.fillText("Z", v[0]*u, v[1]*u); }); },
heartPulse(x,s){ const u=s/24; ICONS.heart(x,s);
  x.strokeStyle=PAPER; x.lineWidth=1.4*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(-4*u,-.4*u); x.lineTo(-1.4*u,-.4*u); x.lineTo(0,2.6*u); x.lineTo(1.6*u,-2.6*u); x.lineTo(3*u,-.4*u); x.lineTo(4.4*u,-.4*u); x.stroke(); },
bolt(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=GOLD; x.beginPath(); x.moveTo(2.4*u,-9*u); x.lineTo(-5.4*u,1*u); x.lineTo(-.6*u,1*u); x.lineTo(-2.4*u,9*u); x.lineTo(5.4*u,-1.4*u); x.lineTo(.6*u,-1.4*u); x.closePath(); x.fill(); x.stroke(); },
shield(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SEA; x.beginPath(); x.moveTo(0,-8.4*u); x.lineTo(7.4*u,-5.4*u);
  x.quadraticCurveTo(7.4*u,3.4*u,0,8.4*u); x.quadraticCurveTo(-7.4*u,3.4*u,-7.4*u,-5.4*u);
  x.closePath(); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.beginPath(); x.moveTo(0,-4.6*u); x.lineTo(3.4*u,-1.4*u); x.lineTo(0,4.4*u); x.lineTo(-3.4*u,-1.4*u); x.closePath(); x.fill(); },
sword(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(Math.PI/4);
  x.fillStyle=GRAY; x.beginPath(); x.moveTo(0,-9.4*u); x.lineTo(1.7*u,-7.4*u); x.lineTo(.9*u,4.4*u); x.lineTo(-.9*u,4.4*u); x.lineTo(-1.7*u,-7.4*u); x.closePath(); x.fill(); x.stroke();
  x.fillStyle=GOLD; x.fillRect(-2.8*u,4.4*u,5.6*u,1.7*u); x.strokeRect(-2.8*u,4.4*u,5.6*u,1.7*u);
  x.fillRect(-1*u,6.1*u,2*u,3*u); x.strokeRect(-1*u,6.1*u,2*u,3*u);
  x.restore(); },
ladder(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.save(); x.rotate(-.35);
  x.fillStyle=WOOD; x.fillRect(-4.4*u,-9.4*u,1.8*u,18.8*u); x.strokeRect(-4.4*u,-9.4*u,1.8*u,18.8*u);
  x.fillRect(2.6*u,-9.4*u,1.8*u,18.8*u); x.strokeRect(2.6*u,-9.4*u,1.8*u,18.8*u);
  x.strokeStyle=WOOD_L; x.lineWidth=1.4*u;
  for(let i=0;i<5;i++){ const yy=-6.4*u+i*3.4*u; x.beginPath(); x.moveTo(-2.6*u,yy); x.lineTo(2.6*u,yy); x.stroke(); }
  x.restore(); },
flagpole(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineWidth=1.5*u; x.beginPath(); x.moveTo(-7*u,9.4*u); x.lineTo(-7*u,-8*u); x.stroke();
  x.fillStyle=OK; x.beginPath(); x.moveTo(-7*u,-8*u); x.lineTo(6*u,-5*u); x.lineTo(-7*u,-1.4*u); x.closePath(); x.fill(); x.stroke(); },
sparkline(x,s){ const u=s/24; x.strokeStyle=TERRA; x.lineWidth=1.8*u; x.lineCap="round"; x.lineJoin="round";
  x.beginPath(); x.moveTo(-8*u,6*u); x.lineTo(-3*u,0); x.lineTo(0,3.4*u); x.lineTo(4*u,-5*u); x.lineTo(8*u,-2*u); x.stroke(); },
bolt2(x,s){ ICONS.bolt(x,s); },
cart(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.strokeStyle=INK; x.lineJoin="round"; x.lineCap="round";
  x.beginPath(); x.moveTo(-8.6*u,-7*u); x.lineTo(-5*u,-7*u); x.lineTo(-2.6*u,2.6*u); x.lineTo(6.6*u,2.6*u); x.lineTo(8.6*u,-4*u); x.lineTo(-4*u,-4*u); x.stroke();
  x.fillStyle=INK; x.beginPath(); x.arc(-1*u,6*u,1.9*u,0,7); x.arc(4.6*u,6*u,1.9*u,0,7); x.fill(); },
feather(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=SKY; x.beginPath(); x.moveTo(-6*u,8*u);
  x.quadraticCurveTo(-7*u,-2*u,2*u,-7*u); x.quadraticCurveTo(7*u,-8*u,6*u,-3*u);
  x.quadraticCurveTo(4*u,4*u,-4*u,6*u); x.closePath(); x.fill(); x.stroke();
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(-6*u,8*u); x.lineTo(4*u,-6*u); x.stroke(); },
balloon(x,s){ const u=s/24; x.lineWidth=lw(x,s);
  x.fillStyle=TERRA; x.beginPath(); x.ellipse(0,-2*u,5.6*u,6.8*u,0,0,7); x.fill(); x.stroke();
  x.fillStyle=PAPER; x.beginPath(); x.ellipse(-1.8*u,-4*u,1.4*u,2.2*u,.4,0,7); x.fill();
  x.strokeStyle=INK; x.lineWidth=1.2*u; x.beginPath(); x.moveTo(0,4.8*u); x.quadraticCurveTo(1.4*u,6.6*u,0,8.6*u); x.stroke(); }
};

/* apelidos */
const ALIAS = {
  person2:"person", man:"person", woman:"person", guy:"person", kid:"baby",
  dooropen:"door", flag3:"flag", cn:"flag", checkered:"flag",
  boomsq:"burst", explosion:"burst", boom:"burst",
  house2:"house", home:"house", building2:"building", office:"building",
  coin2:"coin", moneybag:"money", cash:"money",
  arrowleft:"arrowL", arrowright:"arrowR", arrowup:"arrowU", arrowdown:"arrowD",
  checkmark:"check", ok:"check", no:"cross", x:"cross",
  star2:"star", sparkles:"spark", fire:"flame", water:"drop", waves:"wave",
  tree2:"tree", evergreen:"pine", apple:"fruit", apple2:"fruit",
  ball2:"ball", soccer:"ball", cube:"ice", box2:"box", crate:"box",
  lock2:"lock", key2:"key", bulb:"bulb", light:"bulb", lamp:"bulb",
  alarm:"siren", alert:"warning", warn:"warning",
  turtle2:"turtle", tortoise:"turtle", rabbit:"mouse", bunny:"mouse",
  wolf:"dog", fox:"dog", puppy:"dog", kitty:"cat",
  eagle:"bird", owl:"bird", duck:"bird", seagull:"bird",
  shark2:"shark", dolphin:"fish", goldfish:"fish", tropical:"fish",
  whale:"fish", jellyfish:"fish", stingray:"fish",
  chest:"box", barrel2:"barrel", column:"tower", lighthouse:"tower",
  clock:"gauge", timer:"gauge", meter:"gauge", thermo:"gauge",
  gift:"box", present:"box", package:"box",
  ship2:"ship", sail:"boat", sailboat:"boat", ferry:"ship",
  kart2:"kart", racecar:"kart", f1:"kart",
  ambulance2:"ambulance", van:"truck", lorry:"truck",
  scooter2:"scooter", moped:"scooter", skateboard:"skate",
  snowman:"snow", snowflake:"snow", blizzard:"snow",
  sun2:"sun", sunny:"sun", moon2:"moon", night:"moon",
  cloud2:"cloud", cloudy:"cloud", rain:"drop", rainy:"drop",
  wind:"smoke", breeze:"smoke", fog:"smoke",
  king:"crown", queen:"crown", prince:"crown", princess:"crown",
  first:"medal", gold:"medal", prize:"trophy", award:"trophy",
  king2:"crown"
};
const ICON_KEYS = Object.keys(ICONS).concat(Object.keys(ALIAS));

/* desenha um ícone pelo nome em (cx,cy) com tamanho s; rotação opcional */
function drawIcon(x, name, cx, cy, s, rot){
  let fn = ICONS[name] || ICONS[ALIAS[name]];
  if(!fn) fn = ICONS.dot;
  x.save();
  x.translate(cx, cy);
  if(rot) x.rotate(rot);
  x.lineWidth = lw(x, s);
  x.strokeStyle = INK; x.fillStyle = INK;
  x.lineJoin = "round"; x.lineCap = "round";
  try{ fn(x, s); }catch(e){ /* ícone defensivo: círculo */ x.beginPath(); x.arc(0,0,s*.35,0,7); x.fill(); }
  x.restore();
  return true;
}

/* ---------- normalização tipográfica do canvas ---------- */
const F_UI  = '"Plus Jakarta Sans","Trebuchet MS",Verdana,sans-serif';
const F_DIS = '"Fraunces",Georgia,"Times New Roman",serif';
const F_MONO = '"Space Mono","Courier New",monospace';
function normFont(v){
  if(typeof v !== "string") return v;
  let out = v.replace(/system-ui|ui-sans-serif|sans-serif|-apple-system|helvetica|arial|Segoe UI|Roboto/gi, "\u0001UI\u0001");
  out = out.replace(/(?<![-\w])serif(?![\w-])/gi, "\u0001D\u0001");
  out = out.replace(/monospace|courier/gi, "\u0001M\u0001");
  return out.replace(/\u0001UI\u0001/g, F_UI).replace(/\u0001D\u0001/g, F_DIS).replace(/\u0001M\u0001/g, F_MONO);
}
function fontSizeOf(font){
  const m = /([\d.]+)px/.exec(font||"");
  return m ? parseFloat(m[1]) : 16;
}

/* mapa emoji→ícone (injetado por tools/deemoji.py — segurança em runtime) */
const EMO_ICON = {"⌚":"gauge", "⌛":"gauge", "⏭":"arrowR", "⏮":"arrowL", "⏰":"gauge", "⏱":"gauge", "⏳":"gauge", "⏴":"arrowL", "⏵":"arrowR", "☀":"sun", "☁":"cloud", "☄":"meteor", "☕":"drop", "☠":"skull", "♔":"crown", "♕":"crown", "♖":"crown", "♗":"crown", "♚":"crown", "♛":"crown", "⚒":"hammer", "⚔":"sword", "⚙":"gear", "⚛":"microscope", "⚠":"warning", "⚡":"bolt", "⚽":"ball", "⚾":"ball", "⛄":"snow", "⛅":"cloud", "⛏":"pick", "⛔":"cross", "⛪":"building", "⛰":"mountain", "⛱":"umbrella", "⛵":"boat", "⛷":"ski", "⛺":"tent", "⛽":"barrel", "✂":"scissors", "✅":"check", "✈":"plane", "✊":"raise", "✋":"raise", "✌":"raise", "✔":"check", "✨":"spark", "❄":"snow", "❌":"cross", "❓":"question", "❔":"question", "❗":"warning", "❤":"heart", "⭕":"target", "🌀":"tornado", "🌂":"umbrella", "🌊":"wave", "🌋":"volcano", "🌍":"earth", "🌎":"earth", "🌙":"moon", "🌤":"cloud", "🌦":"drop", "🌧":"drop", "🌨":"snow", "🌩":"warning", "🌪":"tornado", "🌫":"smoke", "🌬":"smoke", "🌱":"sprout", "🌲":"pine", "🌳":"tree", "🌴":"palm", "🌵":"cactus", "🌶":"fruit", "🌷":"flower", "🌸":"flower", "🌹":"flower", "🌺":"flower", "🌻":"flower", "🌽":"wheat", "🌾":"wheat", "🌿":"leaf", "🍂":"leaf", "🍃":"leaf", "🍄":"mushroom", "🍇":"fruit", "🍉":"fruit", "🍊":"fruit", "🍋":"fruit", "🍎":"fruit", "🍏":"fruit", "🍑":"fruit", "🍒":"fruit", "🍔":"burger", "🍖":"bread", "🍗":"bread", "🍝":"bread", "🍞":"bread", "🍟":"bread", "🍣":"bread", "🍪":"candy", "🍫":"candy", "🍬":"candy", "🍭":"candy", "🍮":"candy", "🍯":"candy", "🍰":"candy", "🍲":"pot", "🍳":"egg", "🍵":"drop", "🍽":"pot", "🍾":"candy", "🎁":"box", "🎆":"burst", "🎈":"candy", "🎉":"burst", "🎊":"burst", "🎓":"book", "🎖":"medal", "🎗":"medal", "🎞":"camera", "🎥":"camera", "🎨":"suit", "🎬":"camera", "🎭":"detective", "🎮":"tv", "🎯":"target", "🎰":"dice", "🎲":"dice", "🎸":"letters", "🎹":"letters", "🎺":"speaker", "🎻":"letters", "🎾":"ball", "🎿":"ski", "🏁":"flag", "🏃":"run", "🏃♀":"run", "🏃♂":"run", "🏄":"surf", "🏄♀":"surf", "🏄♂":"surf", "🏅":"medal", "🏆":"trophy", "🏇":"horse", "🏊":"swim", "🏊♀":"swim", "🏊♂":"swim", "🏋":"suit", "🏋♀":"suit", "🏋♂":"suit", "🏌":"bike", "🏌♀":"bike", "🏌♂":"bike", "🏍":"moto", "🏎":"kart", "🏐":"ball", "🏔":"mountain", "🏕":"tent", "🏖":"umbrella", "🏗":"building", "🏘":"house", "🏙":"building", "🏚":"house", "🏝":"umbrella", "🏠":"house", "🏡":"house", "🏢":"building", "🏣":"building", "🏥":"building", "🏦":"building", "🏨":"building", "🏩":"bed", "🏪":"building", "🏫":"building", "🏭":"factory", "🏯":"building", "🏰":"castle", "🏹":"arrowR", "🏺":"pot", "🐆":"cat", "🐇":"mouse", "🐈":"cat", "🐊":"croc", "🐍":"snake", "🐎":"horse", "🐐":"sheep", "🐑":"sheep", "🐔":"chick", "🐕":"dog", "🐘":"turtle", "🐙":"octopus", "🐜":"ant", "🐝":"bee", "🐟":"fish", "🐠":"fish", "🐢":"turtle", "🐣":"chick", "🐤":"chick", "🐥":"chick", "🐦":"bird", "🐧":"penguin", "🐨":"mouse", "🐩":"dog", "🐭":"mouse", "🐯":"cat", "🐰":"mouse", "🐱":"cat", "🐶":"dog", "🐸":"frog", "🐺":"dog", "🐻":"dog", "👀":"eye", "👁":"eye", "👁🗨":"eye", "👊":"raise", "👌":"raise", "👍":"raise", "👏":"clap", "👑":"crown", "👕":"suit", "👗":"suit", "👚":"suit", "👞":"suit", "👟":"suit", "👠":"suit", "👢":"suit", "👤":"person", "👥":"person", "👨⚕":"suit", "👨🌾":"person", "👨🍳":"suit", "👨🏫":"suit", "👨💻":"suit", "👨🔬":"detective", "👨🚀":"suit", "👨🚒":"guard", "👩⚕":"suit", "👩🌾":"person", "👩🍳":"suit", "👩🏫":"suit", "👩💻":"suit", "👩🔬":"detective", "👩🚀":"suit", "👩🚒":"guard", "👮":"guard", "👯":"dance", "👱":"person", "👶":"baby", "👺":"ghost", "👻":"ghost", "👽":"robot", "👾":"robot", "👿":"ghost", "💀":"skull", "💁":"raise", "💂":"guard", "💃":"dance", "💇":"suit", "💈":"suit", "💉":"drop", "💊":"drop", "💎":"gem", "💐":"flower", "💚":"heart", "💡":"bulb", "💢":"siren", "💣":"bomb", "💤":"sleep", "💥":"burst", "💦":"splash", "💧":"drop", "💨":"smoke", "💪":"suit", "💫":"spark", "💰":"money", "💴":"money", "💵":"money", "💸":"money", "📃":"clipboard", "📄":"clipboard", "📋":"clipboard", "📑":"book", "📒":"book", "📓":"book", "📕":"book", "📖":"book", "📗":"book", "📘":"book", "📙":"book", "📚":"book", "📝":"clipboard", "📞":"gauge", "📠":"gauge", "📡":"satellite", "📢":"speaker", "📣":"speaker", "📥":"box", "📦":"box", "📧":"mailbox", "📨":"mailbox", "📩":"mailbox", "📪":"mailbox", "📫":"mailbox", "📬":"mailbox", "📮":"mailbox", "📯":"speaker", "📱":"gauge", "📲":"gauge", "📷":"camera", "📸":"camera", "📺":"gauge", "📻":"gauge", "🔇":"speaker", "🔈":"speaker", "🔉":"speaker", "🔊":"speaker", "🔋":"battery", "🔌":"plug", "🔏":"lock", "🔑":"key", "🔒":"lock", "🔓":"lock", "🔔":"bell", "🔗":"chain", "🔣":"letters", "🔤":"letters", "🔥":"flame", "🔧":"wrench", "🔨":"hammer", "🔫":"sword", "🔬":"microscope", "🔭":"telescope", "🔮":"gem", "🕌":"building", "🕍":"building", "🕮":"candle", "🕯":"candle", "🕳":"hole", "🕴":"suit", "🕵":"detective", "🕷":"spider", "🕹":"tv", "🕺":"dance", "🖐":"raise", "🖥":"tv", "🖵":"tv", "🗂":"clipboard", "🗄":"cabinet", "🗡":"sword", "🗻":"mountain", "🗼":"tower", "🗽":"tower", "😀":"person", "😂":"person", "😋":"person", "😌":"person", "😏":"person", "😑":"person", "😠":"person", "😡":"person", "😭":"person", "😱":"person", "😲":"person", "😳":"person", "😴":"sleep", "😶":"person", "😷":"person", "🙂":"person", "🙃":"person", "🙅":"person", "🙆":"person", "🙋":"raise", "🙌":"clap", "🙍":"person", "🙎":"person", "🙏":"raise", "🚀":"rocket", "🚁":"heli", "🚂":"train", "🚃":"wagon", "🚃🚃":"wagon", "🚄":"train", "🚅":"train", "🚆":"train", "🚈":"train", "🚌":"truck", "🚍":"truck", "🚎":"truck", "🚐":"truck", "🚑":"ambulance", "🚒":"truck", "🚓":"car", "🚔":"car", "🚕":"car", "🚖":"car", "🚗":"car", "🚘":"car", "🚙":"car", "🚚":"truck", "🚛":"truck", "🚜":"tractor", "🚤":"boat", "🚧":"warning", "🚨":"siren", "🚩":"pennant", "🚪":"door", "🚰":"bucket", "🚲":"bike", "🚴":"bike", "🚴♀":"bike", "🚴♂":"bike", "🚵":"bike", "🚵♀":"bike", "🚵♂":"bike", "🚶":"walk", "🚿":"bucket", "🛁":"bucket", "🛂":"guard", "🛋":"cabinet", "🛌":"bed", "🛍":"box", "🛏":"bed", "🛒":"cart", "🛖":"cabin", "🛗":"elevator", "🛟":"satellite", "🛠":"wrench", "🛡":"shield", "🛢":"barrel", "🛫":"plane", "🛬":"plane", "🛰":"satellite", "🛴":"scooter", "🛵":"scooter", "🛶":"canoe", "🛷":"sled", "🛹":"skate", "🛺":"truck", "🛻":"car", "🛼":"sled", "🤒":"person", "🤕":"person", "🤖":"robot", "🤚":"raise", "🤝":"person", "🤟":"raise", "🤢":"person", "🤤":"person", "🤮":"person", "🤵":"suit", "🤷":"person", "🤸":"acrobat", "🤸♀":"acrobat", "🤸♂":"acrobat", "🤹":"juggle", "🤹♀":"juggle", "🤹♂":"juggle", "🤼":"suit", "🤼♀":"suit", "🤼♂":"suit", "🤽":"swim", "🤽♀":"swim", "🤽♂":"swim", "🤿":"diver", "🥁":"drum", "🥇":"medal", "🥋":"medal", "🥐":"bread", "🥑":"fruit", "🥒":"fruit", "🥓":"bread", "🥕":"fruit", "🥖":"bread", "🥘":"bread", "🥚":"egg", "🥛":"drop", "🥜":"fruit", "🥝":"fruit", "🥣":"pot", "🥤":"drop", "🥦":"fruit", "🥧":"candy", "🥩":"bread", "🥯":"bread", "🥷":"zombie", "🦀":"crab", "🦁":"cat", "🦅":"bird", "🦈":"shark", "🦉":"bird", "🦊":"dog", "🦋":"butterfly", "🦌":"horse", "🦍":"dog", "🦔":"turtle", "🦠":"dotOn", "🦩":"dog", "🦪":"shellfish", "🦴":"bone", "🦾":"suit", "🧁":"candy", "🧂":"pot", "🧃":"drop", "🧄":"fruit", "🧅":"fruit", "🧆":"pot", "🧊":"ice", "🧋":"drop", "🧍":"person", "🧍♀":"person", "🧍♂":"person", "🧍🦯":"walk", "🧎":"run", "🧎♀":"run", "🧎♂":"run", "🧐":"person", "🧑":"person", "🧑⚕":"suit", "🧑🌾":"person", "🧑🍳":"suit", "🧑🎓":"suit", "🧑🎨":"suit", "🧑🏫":"suit", "🧑🏭":"suit", "🧑💻":"suit", "🧑🔧":"suit", "🧑🔬":"detective", "🧑🚀":"suit", "🧑🤝🧑":"person", "🧒":"baby", "🧔":"person", "🧗":"climb", "🧘":"person", "🧙":"detective", "🧙♀":"detective", "🧙♂":"detective", "🧚":"detective", "🧛":"detective", "🧜":"person", "🧝":"person", "🧟":"zombie", "🧨":"candy", "🧪":"microscope", "🧫":"microscope", "🧱":"brick", "🧲":"battery", "🧳":"box", "🧴":"drop", "🧵":"scissors", "🧶":"rope", "🧸":"teddy", "🧹":"wrench", "🧺":"basket", "🧼":"bucket", "🧿":"spark", "🩹":"drop", "🪃":"sword", "🪄":"sword", "🪐":"planet", "🪑":"bed", "🪓":"axe", "🪙":"coin", "🪛":"ladder", "🪜":"ladder", "🪢":"rope", "🪣":"bucket", "🪧":"barrel", "🪨":"box", "🪵":"log", "🪶":"flower", "🪷":"flower", "🪸":"coral", "🫐":"fruit"};
const EMO_SCAN = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{2190}-\u{21FF}\u{FE0F}]/u;
const EMO_GLOBAL = /[\u{1F000}-\u{1FAFF}\u{2600}-\u{27BF}\u{2B00}-\u{2BFF}\u{FE0F}]/gu;
const GLYPH_FALLBACK = {"\u2705":"\u2714","\u274C":"\u2715","\u2B50":"\u2605","\u2764":"\u2665","\u2B06":"\u2191","\u2B05":"\u2190","\u27A1":"\u2192","\u2B07":"\u2193","\u26D4":"\u2715","\u2757":"!"};

/* aprimora um contexto 2d: fontes da marca + ícones via fillText */
function enhance(x){
  if(x.__nc) return x;
  try{
    let _font = "";
    const d = Object.getOwnPropertyDescriptor(Object.getPrototypeOf(x), "font");
    Object.defineProperty(x, "font", {
      get(){ return _font; },
      set(v){ _font = normFont(v); try{ if(d&&d.set) d.set.call(x, _font); }catch(e){} }
    });
  }catch(e){}
  const ICON_TOK = /^i:[\w]+(?:i:[\w]+)*$/;
  const oFill = x.fillText.bind(x), oStroke = x.strokeText.bind(x), oMeas = x.measureText.bind(x);
  function iconSize(){ return fontSizeOf(_font); }
  function drawIconAt(name, px, py){
    const s = iconSize()*1.06, ta = x.textAlign||"start", bl = x.textBaseline||"alphabetic";
    let ax = px; if(ta==="right"||ta==="end") ax = px - s/2; else if(ta!=="center"&&ta!=="middle") ax = px + s/2;
    let cy = py;
    if(bl==="alphabetic") cy = py - s*.36;
    else if(bl==="top"||bl==="hanging") cy = py + s/2;
    else if(bl==="bottom") cy = py - s/2;
    drawIcon(x, name, ax, cy, s);
  }
  function drawIconRun(text, px, py){
    const names = text.split("i:").filter(Boolean);
    const s = iconSize()*1.06, ta = x.textAlign||"start", bl = x.textBaseline||"alphabetic";
    const total = names.length*s;
    let sx = px;
    if(ta==="center"||ta==="middle") sx = px - total/2;
    else if(ta==="right"||ta==="end") sx = px - total;
    let cy = py;
    if(bl==="alphabetic") cy = py - s*.36;
    else if(bl==="top"||bl==="hanging") cy = py + s/2;
    else if(bl==="bottom") cy = py - s/2;
    names.forEach(n=>{ drawIcon(x, n, sx+s/2, cy, s); sx += s; });
  }
  function drawMixed(text, px, py, stroke){
    const segs = [];
    let buf = "", i = 0;
    while(i < text.length){
      const ch = text[i], code = text.codePointAt(i);
      if((code>=0x1F000&&code<=0x1FAFF)||(code>=0x2600&&code<=0x27BF)||(code>=0x2B00&&code<=0x2BFF)||(code===0xFE0F)){
        if(buf){ segs.push({t:buf}); buf=""; }
        let name = EMO_ICON[ch];
        if(!name && GLYPH_FALLBACK[ch]) name = null;
        if(code===0xFE0F){ /* seletor: ignora */ }
        else if(name) segs.push({i:name});
        else if(GLYPH_FALLBACK[ch]) segs.push({t:GLYPH_FALLBACK[ch]});
        i += code>0xFFFF ? 2 : 1;
      } else { buf += ch; i++; }
    }
    if(buf) segs.push({t:buf});
    const s = iconSize();
    let total = 0;
    segs.forEach(sg=>{ sg.w = sg.i ? s*1.06 : oMeas(sg.t).width; total += sg.w; });
    const ta = x.textAlign||"start";
    let sx = px;
    if(ta==="center"||ta==="middle") sx = px - total/2;
    else if(ta==="right"||ta==="end") sx = px - total;
    for(const sg of segs){
      if(sg.i) drawIconAt(sg.i, sx + sg.w/2, py);
      else (stroke?oStroke(sg.t, sx, py):oFill(sg.t, sx, py));
      sx += sg.w;
    }
  }
  x.fillText = function(text, px, py, mw){
    if(typeof text === "string"){
      if(ICON_TOK.test(text)) return drawIconRun(text, px, py);
      if(EMO_SCAN.test(text)) return drawMixed(text, px, py, false);
    }
    return oFill(text, px, py, mw);
  };
  x.strokeText = function(text, px, py, mw){
    if(typeof text === "string"){
      if(ICON_TOK.test(text)) return drawIconRun(text, px, py);
      if(EMO_SCAN.test(text)) return drawMixed(text, px, py, true);
    }
    return oStroke(text, px, py, mw);
  };
  x.measureText = function(text){
    if(typeof text === "string" && ICON_TOK.test(text))
      return { width: text.split("i:").filter(Boolean).length * iconSize()*1.12 };
    return oMeas(text);
  };
  try{ x.__nc = 1; }catch(e){}
  return x;
}

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
    /* ícones vetoriais (nomes em H.icons) */
    icon(ctxOrCv, name, cx, cy, s, rot){ drawIcon(ctxOrCv&&ctxOrCv.x||ctxOrCv, name, cx, cy, s, rot||0); },
    icons: ICON_KEYS,
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
      const x = enhance(c.getContext("2d"));
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
      const mv = e=>{ pos(e); };
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
      const prevBest = NCG.best(gameId);
      const isRecord = sc>0 && sc>prevBest;
      NCG.mark(gameId, o.win!==false);
      if(sc) NCG.setBest(gameId, sc);
      const best = NCG.best(gameId);
      H.score(sc);
      (o.win===false?SFX.lose:SFX.win)();
      const nb = gameId>=400?1:gameId+1;
      H.after(450, ()=>H.ov({
        k: o.win===false?"// FIM DE JOGO":"// VITÓRIA",
        title: o.title || (o.win===false?"Não foi desta vez":"Missão cumprida"),
        sub: (isRecord?'<span class="nb">NOVO RECORDE</span> ':'')+(o.sub||""),
        score: sc, best,
        btns:[
          {t:"Jogar de novo <i>R</i>", p:1, fn:()=>H.restart()},
          {t:"Próxima <i>N</i>", fn:()=>location.hash="#"+String(nb).padStart(3,"0")},
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
  document.getElementById("howBody").innerHTML = (meta?meta[3]:"")+"<br><br><span class='g-chip'>CONTROLES · "+(meta?meta[4]:"")+"</span>";
  document.getElementById("bestLine").innerHTML = "Recorde: <b>"+NCG.best(id)+"</b> · "+(NCG.done(id)?"\u2714 concluído":NCG.played(id)?"\u25B6 jogado":"\u25CB novo");
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
      a.innerHTML = '<span class="rn">'+String(g[0]).padStart(3,"0")+'</span><span class="rt">'+g[1]+'</span><span class="rg">'+window.GENRES[g[2]].n+'</span>';
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
    catch(e){ console.error(e); stage.innerHTML = '<div class="g-msg">Erro ao iniciar este jogo. <a href="index.html">Voltar ao catálogo</a></div>'; }
  };
  if(REG[id] && !force){ run(); return; }
  const old = document.getElementById("gameScript"); if(old) old.remove();
  const s = document.createElement("script");
  s.id = "gameScript"; s.src = "games/g"+String(id).padStart(3,"0")+".js";
  s.onload = run;
  s.onerror = ()=>{ stage.innerHTML = '<div class="g-msg">Arquivo do jogo não carregou. <a href="index.html">Voltar ao catálogo</a></div>'; };
  document.body.appendChild(s);
}
function idFromHash(){
  const m = (location.hash||"").match(/(\d{1,3})/);
  let id = m?parseInt(m[1],10):1;
  if(!(id>=1&&id<=400)) id = 1;
  return id;
}
window.addEventListener("hashchange", ()=>mount(idFromHash()));
/* atalhos no palco: R reinicia · N/Enter avança (só com overlay aberto) */
document.addEventListener("keydown", e=>{
  if(/INPUT|TEXTAREA|SELECT/.test((e.target&&e.target.tagName)||"")) return;
  const stage = document.getElementById("stage");
  if(!stage || !stage.querySelector(".g-overlay")) return;
  if(e.code==="KeyR"){ e.preventDefault(); mount(currentId, true); }
  else if(e.code==="KeyN"||e.code==="Enter"){ e.preventDefault(); location.hash = "#"+String(currentId>=400?1:currentId+1).padStart(3,"0"); }
});
document.addEventListener("DOMContentLoaded", ()=>{
  const rb = document.getElementById("btnRestart"); if(rb) rb.addEventListener("click",()=>mount(currentId,true));
  const rd = document.getElementById("btnRandom"); if(rd) rd.addEventListener("click",()=>{ location.hash = "#"+String(1+Math.floor(Math.random()*400)).padStart(3,"0"); });
  const nx = document.getElementById("btnNext"); if(nx) nx.addEventListener("click",()=>{ location.hash = "#"+String(currentId>=400?1:currentId+1).padStart(3,"0"); });
  mount(idFromHash());
});
})();
