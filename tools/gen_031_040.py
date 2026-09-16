#!/usr/bin/env python3
"""Gera games/g031..g040 — PUZZLE (parte 4, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 31 — Fechadura
GAMES[31] = r"""/* NCODE N · 031 Fechadura — descubra a combinação dos pinos */
GREG(31,{
init(root,H){
let round=0,over=false,att=0,lock=false;
const hud=H.hud(root,[["rd","FECHADURA","1/2"],["tt","TENTATIVAS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos pinos para ciclar alturas <b>1–4</b>. <b>Testar</b>: ● = pino certo no lugar certo, ○ = altura certa no lugar errado.");
const o=H.cvs(root,440,220),x=o.x;
let code=[],guess=[1,1,1,1];
const hist=H.el("div","g-col",null,root);
function build(){
  const r=H.rng(600+round*43);
  code=H.shuffle(r,[1,2,3,4]);
  guess=[1,1,1,1];att=0;lock=false;
  hist.innerHTML="";hud.set("rd",(round+1)+"/2");hud.set("tt","0/8");draw();
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(40,30,o.W-80,150);
  x.fillStyle=H.C.gold;x.beginPath();x.arc(o.W/2,150,26,0,7);x.fill();
  for(let i=0;i<4;i++){
    const px=90+i*80;
    for(let h=0;h<4;h++){
      x.fillStyle=h<guess[i]?H.C.wasabi:"#3a3a36";
      x.fillRect(px,160-(h+1)*30,40,26);
      x.strokeStyle=H.C.paper;x.strokeRect(px,160-(h+1)*30,40,26);
    }
    x.fillStyle=H.C.paper;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("P"+(i+1)+"="+guess[i],px-4,200-14);
  }
}
H.onTap(o,(px,py)=>{
  if(over)return;
  for(let i=0;i<4;i++){
    const bx=90+i*80;
    if(px>bx-10&&px<bx+50&&py>20&&py<190){guess[i]=guess[i]%4+1;H.sfx("tick");draw();return;}
  }
});
function test(){
  if(over||lock)return;
  att++;hud.set("tt",att+"/8");
  let exact=0;const cr=code.slice(),gr=guess.slice();
  for(let i=0;i<4;i++)if(gr[i]===cr[i]){exact++;cr[i]=gr[i]=-1;}
  let mis=0;
  for(let i=0;i<4;i++)if(gr[i]>0){const j=cr.indexOf(gr[i]);if(j>=0){mis++;cr[j]=-1;}}
  const row=H.el("div","g-msg","<b>"+guess.join(" ")+"</b> → "+"●".repeat(exact)+"○".repeat(mis)+"<span style='opacity:.5'>"+("·".repeat(4-exact-mis))+"</span>",hist);
  if(exact===4){
    lock=true;
    H.sfx("ok");const sc=(round+1)*150+(8-att)*15;H.score(sc);hud.set("sc",sc);
    round++;
    if(round>=2){over=true;return H.done({win:true,score:sc+100,title:"Cofre aberto!",sub:"2 fechaduras decifradas pela lógica."});}
    say("🔓 Primeira fechadura aberta! Nova combinação…");H.after(800,build);
  }else{
    H.sfx("bad");
    if(att>=8){over=true;return H.done({win:false,score:round*120,title:"Fechadura emperrada",sub:"8 tentativas sem abrir. A combinação era "+code.join(" ")+"."});}
    say("Tentativa "+att+": "+exact+" exatos, "+mis+" deslocados.");
  }
  draw();
}
H.btn(root,"🔑 Testar combinação",test,true);
build();
}});"""

# 32 — Tangram
GAMES[32] = r"""/* NCODE N · 032 Tangram — encaixe as peças na silhueta */
GREG(32,{
init(root,H){
const DEFS=[
 {pts:[[-30,-26],[30,-26],[0,26]],slot:[370,110],rot:0,n:"triângulo"},
 {pts:[[-24,-24],[24,-24],[24,24],[-24,24]],slot:[370,210],rot:0,n:"quadrado"},
 {pts:[[-42,-18],[42,-18],[42,18],[-42,18]],slot:[370,300],rot:0,n:"retângulo"},
 {pts:[[-18,-16],[18,-16],[0,16]],slot:[140,300],rot:180,n:"triângulo P"}
];
let over=false,placed=0,sc=0;
const hud=H.hud(root,[["pc","PEÇAS","0/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste cada peça até seu <b>molde tracejado</b>. Toque numa peça e use <b>Girar</b> se ela estiver torta.");
const o=H.cvs(root,520,360),x=o.x;
const ptr=H.ptr(o);
let pieces=[],sel=null,wasDown=false;
function build(){
  const r=H.rng(77);
  pieces=DEFS.map((d,i)=>({
    pts:d.pts,slot:d.slot,n:d.n,
    x:60+r()*160,y:60+r()*180,rot:[0,90,180,270][Math.floor(r()*4)],
    need:d.rot,done:false
  }));
  placed=0;sel=null;
}
build();
function drawPoly(px,py,pts,rot,fill,stroke,dash){
  x.save();x.translate(px,py);x.rotate(rot*Math.PI/180);
  if(dash)x.setLineDash([6,5]);
  x.beginPath();x.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);
  x.closePath();
  if(fill){x.fillStyle=fill;x.fill();}
  if(stroke){x.strokeStyle=stroke;x.lineWidth=2.5;x.stroke();}
  x.setLineDash([]);x.restore();
}
H.loop(()=>{
  if(ptr.down&&!wasDown){
    sel=null;
    for(let i=pieces.length-1;i>=0;i--){
      const p=pieces[i];
      if(!p.done&&Math.hypot(p.x-ptr.x,p.y-ptr.y)<52){sel=p;break;}
    }
  }
  wasDown=ptr.down;
  if(sel&&ptr.down&&!sel.done){sel.x=ptr.x;sel.y=ptr.y;}
  if(sel&&!ptr.down){
    const p=sel;
    if(Math.hypot(p.x-p.slot[0],p.y-p.slot[1])<34&&((p.rot%360+360)%360)===((p.need%360+360)%360)){
      p.done=true;p.x=p.slot[0];p.y=p.slot[1];
      placed++;sc+=100;H.score(sc);hud.set("sc",sc);hud.set("pc",placed+"/4");H.sfx("ok");
      if(placed>=4){over=true;return H.done({win:true,score:sc+100,title:"Silhueta completa!",sub:"4 peças de tangram no lugar exato."});}
      say("✔ "+p.n+" encaixado! Faltam "+(4-placed)+".");
    }
    sel=null;
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  pieces.forEach(p=>{
    if(!p.done)drawPoly(p.slot[0],p.slot[1],p.pts,p.need,"rgba(217,78,52,.10)",H.C.terra,true);
  });
  pieces.forEach(p=>{
    drawPoly(p.x,p.y,p.pts,p.rot,p.done?H.C.wasabi:(p===sel?H.C.gold:H.C.card),H.C.ink,false);
  });
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(sel?("selecionada: "+sel.n+" ("+sel.rot+"°)"):"toque e arraste uma peça",14,o.H-12);
});
H.btn(root,"⟳ Girar selecionada",()=>{
  if(over||!selPtr())return;
  const p=selPtr();p.rot=(p.rot+90)%360;H.sfx("tick");
},false);
let lastSel=null;
H.loop(()=>{if(sel)lastSel=sel;});
function selPtr(){return sel||lastSel;}
}});"""

# 33 — Sudoku Simbólico
GAMES[33] = r"""/* NCODE N · 033 Sudoku Simbólico — símbolos + diagonal */
GREG(33,{
init(root,H){
const SYM=["🍎","🌙","⭐","⚓"];
const SOL=[
 [0,1,2,3, 3,2,1,0, 1,0,3,2, 2,3,0,1],
 [1,0,2,3, 3,2,1,0, 0,1,3,2, 2,3,0,1],
 [2,3,0,1, 1,0,3,2, 3,2,1,0, 0,1,2,3]
];
const MASK=[[1,5,6,10,13,15],[0,3,6,9,12,15],[2,4,7,8,11,14]];
let lv=0,over=false,errs=0,sel=-1;
const hud=H.hud(root,[["nv","QUEBRA","1/3"],["er","ERROS","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Linhas, colunas, blocos 2×2 <b>e a diagonal ↘</b> sem repetir símbolo. Selecione a casa, depois o símbolo.");
const board=H.el("div","g-board",null,root);
let g=[],fixed=new Set();
function build(){
  const sol=SOL[lv];
  g=sol.slice();fixed=new Set();
  for(let i=0;i<16;i++)if(!MASK[lv].includes(i))fixed.add(i);
  MASK[lv].forEach(i=>g[i]=-1);
  sel=-1;errs=0;hud.set("nv",(lv+1)+"/3");hud.set("er","0/5");
  board.style.gridTemplateColumns="repeat(4,1fr)";
  board.style.width="min(100%,300px)";
  board.innerHTML="";
  for(let i=0;i<16;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    (function(idx){d.addEventListener("click",()=>{if(!over&&!fixed.has(idx)){sel=idx;H.sfx("tick");paint();}});})(i);
  }
  paint();tray();
}
function paint(){
  const cells=board.children;
  const diag=new Set([0,5,10,15]);
  for(let i=0;i<16;i++){
    const d=cells[i];
    d.textContent=g[i]<0?"":SYM[g[i]];
    d.disabled=fixed.has(i);
    d.classList.toggle("sel",i===sel);
    d.style.outline=diag.has(i)?"2px solid "+H.C.terra:"none";
    d.style.outlineOffset="-2px";
  }
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  SYM.forEach((s,i)=>{
    const b=H.el("button","g-cell",s,trayBox);
    b.style.width="52px";b.style.height="52px";b.style.fontSize="24px";
    b.addEventListener("click",()=>{
      if(over||sel<0||fixed.has(sel))return;
      g[sel]=i;H.sfx("tick");paint();check();
    });
  });
}
function check(){
  if(g.some(v=>v<0))return;
  const sol=SOL[lv];
  let bad=[];
  for(let i=0;i<16;i++)if(g[i]!==sol[i])bad.push(i);
  if(!bad.length){
    H.sfx("ok");const sc=(lv+1)*150-errs*10;H.score(Math.max(60,sc));hud.set("sc",Math.max(60,sc));
    if(lv>=2){over=true;return H.done({win:true,score:Math.max(60,sc)+120,title:"Grade simbólica!",sub:"3 sudokus com a regra da diagonal dominados."});}
    lv++;say("Quebra "+(lv+1)+": novos símbolos embaralhados.");H.after(700,build);
  }else{
    errs++;hud.set("er",errs+"/5");H.sfx("bad");
    bad.forEach(i=>{g[i]=-1;});
    if(errs>=5){over=true;return H.done({win:false,score:lv*100,title:"Símbolos embaralhados",sub:"5 erros na quebra "+(lv+1)+". Confira a diagonal ↘!"});}
    say("❌ "+bad.length+" casas erradas foram limpas. Erros: "+errs+"/5.");
    paint();
  }
}
build();
}});"""

# 34 — Vazamento
GAMES[34] = r"""/* NCODE N · 034 Vazamento — remende antes da cheia */
GREG(34,{
init(root,H){
let over=false,water=0,leaks=[],patched=0,spawnT=0,t=0,nextId=1;
const hud=H.hud(root,[["rm","REMENDOS",0],["nv","NÍVEL DA ÁGUA","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>vazamentos 💦</b> para remendar. Cada vazamento aberto acelera a cheia!");
const o=H.cvs(root,480,400),x=o.x;
H.onTap(o,(px,py)=>{
  if(over)return;
  for(let i=leaks.length-1;i>=0;i--){
    const L=leaks[i];
    if(Math.hypot(L.x-px,L.y-py)<26){
      leaks.splice(i,1);patched++;
      const sc=patched*25;H.score(sc);hud.set("sc",sc);hud.set("rm",patched);
      H.sfx("ok");
      if(patched>=15){over=true;return H.done({win:true,score:sc+150,title:"Encanamento selado!",sub:"15 vazamentos remendados antes da cheia."});}
      return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  t+=dt;spawnT-=dt;
  const rate=Math.max(.5,1.6-t*0.015);
  if(spawnT<=0){spawnT=rate;
    leaks.push({x:40+Math.random()*400,y:60+Math.random()*240,age:0,id:nextId++});
    if(leaks.length>6)leaks.shift();
  }
  for(const L of leaks)L.age+=dt;
  water+=dt*(1.1+leaks.length*0.9);
  hud.set("nv",Math.min(100,Math.round(water))+"%");
  if(water>=100){over=true;return H.done({win:false,score:patched*25,title:"Sala inundada",sub:patched+" remendos feitos. Priorize os vazamentos maiores!"});}
  if(t>=75){over=true;return H.done({win:true,score:patched*25+100,title:"Turno cumprido!",sub:"Você segurou a cheia por 75 segundos."});}
  H.time(t.toFixed(0)+"s");
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.lineWidth=6;
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(0,60+i*60);x.lineTo(o.W,60+i*60);x.stroke();}
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(0,60+i*60);x.lineTo(o.W,60+i*60);x.stroke();}
  for(const L of leaks){
    const s=8+Math.min(14,L.age*3);
    x.fillStyle=H.C.terra;x.beginPath();x.arc(L.x,L.y,s,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle="#fff";x.font="bold 13px 'Space Mono',monospace";x.fillText("!",L.x-3,L.y+5);
  }
  const wh=o.H*(water/100);
  x.fillStyle="rgba(46,110,138,.75)";x.fillRect(0,o.H-wh,o.W,wh);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("💦 "+leaks.length+" abertos",14,24);
});
}});"""

# 35 — Cristal Crescente
GAMES[35] = r"""/* NCODE N · 035 Cristal Crescente — preencha sem sobrepor */
GREG(35,{
init(root,H){
const LV=[
 {n:5,obs:[],seeds:5},
 {n:6,obs:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],seeds:5},
 {n:6,obs:[[1,2],[2,2],[3,2],[4,2]],seeds:6}
];
const DIRS=[[0,1,"→"],[1,0,"↓"],[0,-1,"←"],[-1,0,"↑"]];
let lv=0,over=false,dir=0,used=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["sm","SEMENTES","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha a <b>direção</b>, clique numa casa vazia para <b>plantar</b>. O cristal cresce reto até o obstáculo. Clique nele para remover.");
const board=H.el("div","g-board",null,root);
let n=5,obs=new Set(),fill={},segs=[];
function key(r,c){return r+","+c;}
function build(){
  const L=LV[lv];n=L.n;used=0;fill={};segs=[];
  obs=new Set(L.obs.map(o=>key(o[0],o[1])));
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*52)+"px)";
  board.innerHTML="";
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="16px";
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
  hud.set("nv",lv+1);hud.set("sm","0/"+L.seeds);
  paint();dirTray();
}
function paint(){
  const cells=board.children;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=cells[r*n+c],k=key(r,c);
    if(obs.has(k)){d.textContent="🧱";d.disabled=true;d.style.background=H.C.ink;}
    else if(fill[k]!=null){d.textContent="💎";d.disabled=false;d.classList.add("good");}
    else{d.textContent="";d.disabled=false;d.classList.remove("good");d.style.background="";}
  }
}
let trayBox=null;
function dirTray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  DIRS.forEach((dd,i)=>{
    const b=H.el("button","g-chip"+(i===dir?" hot":""),"crescer "+dd[2],trayBox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{dir=i;H.sfx("tick");dirTray();});
  });
}
function tap(r,c){
  if(over)return;
  const k=key(r,c);
  if(obs.has(k))return;
  if(fill[k]!=null){ // remover segmento
    const id=fill[k];
    segs=segs.filter(s=>s.id!==id);
    Object.keys(fill).forEach(kk=>{if(fill[kk]===id)delete fill[kk];});
    used--;hud.set("sm",used+"/"+LV[lv].seeds);H.sfx("tick");paint();return;
  }
  if(used>=LV[lv].seeds){H.sfx("bad");say("Sem sementes! Remova um cristal para replantar.");return;}
  const[dr,dc]=DIRS[dir];
  const cells=[k];let nr=r+dr,nc=c+dc;
  while(nr>=0&&nr<n&&nc>=0&&nc<n&&!obs.has(key(nr,nc))&&fill[key(nr,nc)]==null){
    cells.push(key(nr,nc));nr+=dr;nc+=dc;
  }
  if(cells.length<1)return;
  const id=segs.length+Date.now()%100000;
  cells.forEach(cc=>fill[cc]=id);
  segs.push({id});used++;
  hud.set("sm",used+"/"+LV[lv].seeds);H.sfx("ok");paint();
  let empty=0;
  for(let rr=0;rr<n;rr++)for(let cc=0;cc<n;cc++){
    const kk=key(rr,cc);
    if(!obs.has(kk)&&fill[kk]==null)empty++;
  }
  if(empty===0){
    const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Jardim de cristal!",sub:"3 grades preenchidas sem sobreposição."});}
    lv++;say("Nível "+(lv+1)+": obstáculos dividem a grade.");H.after(700,build);
  }
}
build();
}});"""

# 36 — Desatar Nó
GAMES[36] = r"""/* NCODE N · 036 Desatar Nó — arraste até desembaraçar */
GREG(36,{
init(root,H){
const LV=[
 {n:6,edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4]]},
 {n:7,edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[0,3],[1,4],[2,5]]},
 {n:8,edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,4],[1,5],[2,6],[3,7]]}
];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["xz","CRUZAMENTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste os <b>nós</b> até nenhum segmento se cruzar. Cruzamentos aparecem em vermelho.");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
let nodes=[],sel=null;
function build(){
  const L=LV[lv];
  const r=H.rng(400+lv*123);
  nodes=[];
  for(let i=0;i<L.n;i++)nodes.push({x:60+r()*380,y:60+r()*280});
  sel=null;hud.set("nv",lv+1);
}
function segInt(a,b,c,d){
  const d1=(d[0]-c[0])*(a[1]-c[1])-(d[1]-c[1])*(a[0]-c[0]);
  const d2=(d[0]-c[0])*(b[1]-c[1])-(d[1]-c[1])*(b[0]-c[0]);
  const d3=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  const d4=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]);
  return((d1>0&&d2<0||d1<0&&d2>0)&&(d3>0&&d4<0||d3<0&&d4>0));
}
function crossings(){
  const L=LV[lv];let n=0;const bad=new Set();
  for(let i=0;i<L.edges.length;i++)for(let j=i+1;j<L.edges.length;j++){
    const[a,b]=L.edges[i],[c,d]=L.edges[j];
    if(a===c||a===d||b===c||b===d)continue;
    const A=nodes[a],B=nodes[b],C=nodes[c],D=nodes[d];
    if(segInt([A.x,A.y],[B.x,B.y],[C.x,C.y],[D.x,D.y])){n++;bad.add(i);bad.add(j);}
  }
  return{n,bad};
}
H.loop(()=>{
  if(over)return;
  if(ptr.down&&!sel){
    sel=nodes.find(nd=>Math.hypot(nd.x-ptr.x,nd.y-ptr.y)<22)||null;
  }
  if(!ptr.down)sel=null;
  if(sel){sel.x=H.clamp(ptr.x,20,o.W-20);sel.y=H.clamp(ptr.y,20,o.H-20);}
  const L=LV[lv],cr=crossings();
  hud.set("xz",cr.n);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  L.edges.forEach((e,i)=>{
    const A=nodes[e[0]],B=nodes[e[1]];
    x.strokeStyle=cr.bad.has(i)?H.C.terra:H.C.ink;
    x.lineWidth=cr.bad.has(i)?4:2.5;
    x.beginPath();x.moveTo(A.x,A.y);x.lineTo(B.x,B.y);x.stroke();
  });
  nodes.forEach((nd,i)=>{
    x.fillStyle=nd===sel?H.C.wasabi:H.C.gold;
    x.beginPath();x.arc(nd.x,nd.y,13,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";x.fillText(i,nd.x-4,nd.y+4);
  });
  if(cr.n===0){
    H.sfx("ok");const sc=(lv+1)*140;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Nó desfeito!",sub:"3 emaranhados viraram laços limpos."});}
    lv++;say("Nível "+(lv+1)+": mais nós, mais corda.");build();
    H.after(10,()=>{});
  }
});
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});"""

# 37 — Simetria Espelhada
GAMES[37] = r"""/* NCODE N · 037 Simetria Espelhada — reflita o outro lado */
GREG(37,{
init(root,H){
let round=0,over=false,sc=0;
const hud=H.hud(root,[["rd","RODADA","1/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"O lado <b>modelo</b> está pronto. Clique no lado vazio para espelhar cada peça.");
const board=H.el("div","g-board",null,root);
let W=8,Hh=6,axis="V",model=new Set(),ans=new Set();
function build(){
  axis=round%2===0?"V":"H";
  const r=H.rng(800+round*67);
  model=new Set();ans=new Set();
  if(axis==="V"){
    for(let y=0;y<Hh;y++)for(let xx=0;xx<W/2;xx++)if(r()<0.4)model.add(y+","+xx);
  }else{
    for(let y=0;y<Hh/2;y++)for(let xx=0;xx<W;xx++)if(r()<0.35)model.add(y+","+xx);
  }
  if(!model.size)model.add("0,0");
  board.style.gridTemplateColumns="repeat("+W+",1fr)";
  board.style.width="min(100%,"+(W*44)+"px)";
  board.innerHTML="";
  for(let y=0;y<Hh;y++)for(let xx=0;xx<W;xx++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";
    const k=y+","+xx;
    const isModel=axis==="V"?xx<W/2:y<Hh/2;
    if(isModel){d.disabled=true;if(model.has(k)){d.textContent="⬛";d.style.background=H.C.ink;}}
    else{(function(kk,dd){dd.addEventListener("click",()=>{if(over)return;
      if(ans.has(kk)){ans.delete(kk);dd.textContent="";dd.classList.remove("sel");}
      else{ans.add(kk);dd.textContent="⬛";dd.classList.add("sel");}
      H.sfx("tick");
    });})(k,d);}
    if(axis==="V"&&xx===W/2)d.style.borderLeft="3px solid "+H.C.terra;
    if(axis==="H"&&y===Hh/2)d.style.borderTop="3px solid "+H.C.terra;
  }
  hud.set("rd",(round+1)+"/4");
  say("Rodada "+(round+1)+": espelho <b>"+(axis==="V"?"vertical":"horizontal")+"</b>.");
}
function mirror(k){
  const[y,xx]=k.split(",").map(Number);
  return axis==="V"?y+","+(W-1-xx):(Hh-1-y)+","+xx;
}
function check(){
  if(over)return;
  const want=new Set([...model].map(mirror));
  const ok=want.size===ans.size&&[...want].every(k=>ans.has(k));
  if(ok){
    H.sfx("ok");sc+=120;H.score(sc);hud.set("sc",sc);round++;
    if(round>=4){over=true;return H.done({win:true,score:sc+100,title:"Espelho perfeito!",sub:"4 reflexos idênticos ao modelo."});}
    build();
  }else{H.sfx("bad");say("Ainda diferente do espelho — compare peça por peça.");}
}
H.btn(root,"✓ Conferir espelho",check,true);
build();
}});"""

# 38 — Trilha de Formigas
GAMES[38] = r"""/* NCODE N · 038 Trilha de Formigas — desenhe o caminho do banquete */
GREG(38,{
init(root,H){
const LV=[
 {n:8,col:[0,0],food:[7,7],obs:[[3,1],[3,2],[3,3],[3,4],[3,5],[3,6]],ink:26},
 {n:8,col:[0,7],food:[7,0],obs:[[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5]],ink:30},
 {n:9,col:[4,0],food:[4,8],obs:[[1,3],[2,3],[3,3],[5,3],[6,3],[7,3],[1,5],[2,5],[5,5],[6,5],[7,5]],ink:34}
];
let lv=0,over=false,released=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["fk","FEROMÔNIO",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste para pintar a <b>trilha</b> da colônia 🏠 até a comida 🍎. Depois <b>solte as formigas</b>.");
const o=H.cvs(root,440,440),x=o.x;
const ptr=H.ptr(o);
let N=8,trail=new Set(),obs=new Set(),ants=[],ap=0;
function key(r,c){return r+","+c;}
function build(){
  const L=LV[lv];N=L.n;trail=new Set();ants=[];released=false;ap=0;
  obs=new Set(L.obs.map(p=>key(p[0],p[1])));
  hud.set("nv",lv+1);hud.set("fk","0/"+L.ink);
}
function cell(){
  const s=Math.floor(Math.min(o.W,o.H)/N);
  return{s,ox:(o.W-s*N)/2,oy:(o.H-s*N)/2};
}
H.loop(()=>{
  const L=LV[lv],{s,ox,oy}=cell();
  if(ptr.down&&!over&&!released){
    const c=Math.floor((ptr.x-ox)/s),r=Math.floor((ptr.y-oy)/s);
    if(r>=0&&r<N&&c>=0&&c<N){
      const k=key(r,c);
      if(!obs.has(k)&&!trail.has(k)&&trail.size<L.ink){trail.add(k);hud.set("fk",trail.size+"/"+L.ink);if(trail.size%4===0)H.beep(600,.03,"square",.02);}
    }
  }
  if(released&&ants.length){
    ap+=0.12;
    if(ap>=ants.path.length-1){ap=0;}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const k=key(r,c),X=ox+c*s,Y=oy+r*s;
    x.fillStyle=obs.has(k)?H.C.ink:trail.has(k)?H.C.wasabi:H.C.card;
    x.fillRect(X+1,Y+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(X+1,Y+1,s-2,s-2);
  }
  x.font=Math.floor(s*0.6)+"px serif";
  x.fillText("🏠",ox+L.col[1]*s+4,oy+L.col[0]*s+s-6);
  x.fillText("🍎",ox+L.food[1]*s+4,oy+L.food[0]*s+s-6);
  if(released&&ants.path){
    for(let i=0;i<3;i++){
      const idx=Math.floor(ap-i*2);
      if(idx<0)continue;
      const[r,c]=ants.path[idx];
      x.font="16px serif";x.fillText("🐜",ox+c*s+s/2-8,oy+r*s+s/2+6);
    }
  }
});
function bfs(){
  const L=LV[lv];
  const ok=k=>k===key(L.col[0],L.col[1])||k===key(L.food[0],L.food[1])||trail.has(k);
  const start=key(L.col[0],L.col[1]),goal=key(L.food[0],L.food[1]);
  const prev={[start]:null},q=[start],seen=new Set([start]);
  while(q.length){
    const k=q.shift();
    if(k===goal){const p=[k];let c=k;while(prev[c]){c=prev[c];p.unshift(c);}return p.map(q2=>q2.split(",").map(Number));}
    const[r,c]=k.split(",").map(Number);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1],nk=key(nr,nc);
      if(nr<0||nr>=N||nc<0||nc>=N||seen.has(nk)||obs.has(nk)||!ok(nk))return;
      seen.add(nk);prev[nk]=k;q.push(nk);
    });
  }
  return null;
}
const row=H.el("div","g-row",null,root);
H.btn(row,"🐜 Soltar formigas",()=>{
  if(over||released)return;
  const p=bfs();
  if(!p){H.sfx("bad");say("Trilha <b>desconectada</b>! Ligue a colônia à comida sem pular casas.");return;}
  released=true;ants={path:p};H.sfx("pop");
  say("Formigas a caminho… 🐜🐜🐜");
  H.after(2500,()=>{
    if(over)return;
    const sc=(lv+1)*140;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Banquete entregue!",sub:"3 colônias alimentadas por trilhas perfeitas."});}
    lv++;say("Nível "+(lv+1)+": obstáculos novos na floresta.");build();
  });
},true);
H.btn(row,"🧽 Apagar trilha",()=>{if(!over&&!released){trail=new Set();hud.set("fk","0/"+LV[lv].ink);}},false);
build();
}});"""

# 39 — Pavio Sincronizado
GAMES[39] = r"""/* NCODE N · 039 Pavio Sincronizado — estourem todos juntos */
GREG(39,{
init(root,H){
const LV=[{burn:[4,7,10]},{burn:[3,5.5,8]},{burn:[2.5,6,9,11]}];
let lv=0,over=false,running=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Ajuste o <b>retardo</b> de cada pavio (0–12s). Queimas: some retardo + queima — todos devem explodir <b>juntos</b> (±0.35s).");
const o=H.cvs(root,500,240),x=o.x;
let delays=[];
function build(){
  delays=LV[lv].burn.map(()=>0);
  running=false;hud.set("nv",lv+1);paint();tray();
}
function paint(prog,booms){
  const B=LV[lv].burn;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("TEMPO (s) →",400,16);
  B.forEach((b,i)=>{
    const y=34+i*52;
    x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
    x.fillText("P"+(i+1)+" q="+b+"s",8,y+16);
    x.fillStyle=H.C.card;x.fillRect(110,y,360,26);
    x.strokeStyle=H.C.ink;x.strokeRect(110,y,360,26);
    const sc2=360/16;
    x.fillStyle=H.C.cement;x.fillRect(110,y,delays[i]*sc2,26);
    x.fillStyle=H.C.terra;x.fillRect(110+delays[i]*sc2,y,b*sc2,26);
    const ex=110+(delays[i]+b)*sc2;
    x.fillStyle=booms&&booms[i]?H.C.gold:H.C.ink;
    x.beginPath();x.arc(Math.min(468,ex),y+13,booms&&booms[i]?12:7,0,7);x.fill();
    if(prog!=null){
      const px=110+prog*sc2;
      if(px>=110&&px<=470){x.strokeStyle=H.C.ok;x.lineWidth=2;x.beginPath();x.moveTo(px,20);x.lineTo(px,30+B.length*52);x.stroke();}
    }
  });
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-col",null,root);
  trayBox.innerHTML="";
  LV[lv].burn.forEach((b,i)=>{
    const row=H.el("div","g-row",null,trayBox);
    H.el("span","g-chip","Pavio "+(i+1)+" · retardo <b>"+delays[i].toFixed(1)+"s</b> → 💥 "+(delays[i]+b).toFixed(1)+"s",row);
    const m=H.el("button","g-btn sm ghost","−0.5",row);
    const p=H.el("button","g-btn sm ghost","+0.5",row);
    m.addEventListener("click",()=>{if(!running){delays[i]=Math.max(0,+(delays[i]-0.5).toFixed(1));H.sfx("tick");paint();tray();}});
    p.addEventListener("click",()=>{if(!running){delays[i]=Math.min(12,+(delays[i]+0.5).toFixed(1));H.sfx("tick");paint();tray();}});
  });
}
H.btn(root,"🎆 Acender pavios",()=>{
  if(over||running)return;
  running=true;
  const B=LV[lv].burn;
  const times=B.map((b,i)=>delays[i]+b);
  const T=Math.max(...times);
  const booms=B.map(()=>false);
  let t=0;
  say("Pavios acesos… observem o céu!");
  const iv=H.every(100,()=>{
    t+=0.1;paint(t,booms);
    B.forEach((b,i)=>{if(!booms[i]&&t>=times[i]){booms[i]=true;H.beep(200+i*150,.25,"sawtooth",.06);}});
    if(t>=T+0.6){
      clearInterval(iv);
      const spread=Math.max(...times)-Math.min(...times);
      if(spread<=0.35){
        H.sfx("win");const sc=(lv+1)*150+Math.max(0,Math.round(60-spread*100));H.score(sc);hud.set("sc",sc);
        if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Show sincronizado!",sub:"Todas as baterias explodiram no mesmo instante."});}
        lv++;say("Nível "+(lv+1)+": mais pavios, mais contas.");H.after(800,build);
      }else{H.sfx("bad");running=false;say("Espalhados por <b>"+spread.toFixed(2)+"s</b>! Dica: escolham um alvo T e façam retardo = T − queima.");paint();}
    }
  });
},true);
build();
}});"""

# 40 — Hex Preenchido
GAMES[40] = r"""/* NCODE N · 040 Hex Preenchido — complete a colmeia com tri-hex */
GREG(40,{
init(root,H){
const LINE=[[0,0],[1,0],[2,0]],CORNER=[[0,0],[1,0],[0,1]];
const LV=[
 {qs:3,rs:3,pieces:["L","L","L"]},
 {qs:4,rs:3,pieces:["C","C","L","L"]},
 {qs:5,rs:3,pieces:["C","C","L","L","L"]}
];
let lv=0,over=false,sel=0,rot=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["pc","PEÇAS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha a peça, <b>gire</b> se preciso e clique na colmeia para <b>assentar</b>. Clique na peça assentada para remover.");
const o=H.cvs(root,520,360),x=o.x;
const SZ=24;
let board=new Set(),placed=[],pieces=[];
function key(q,r){return q+","+r;}
function shapeOf(p){return p==="L"?LINE:CORNER;}
function rotAx(cells,k){
  let c=cells.map(q=>q.slice());
  for(let i=0;i<k;i++)c=c.map(([q,r])=>[-r,q+r]);
  const mq=Math.min(...c.map(q=>q[0])),mr=Math.min(...c.map(q=>q[1]));
  return c.map(([q,r])=>[q-mq,r-mr]);
}
function center(q,r){
  const L=LV[lv];
  const wpx=SZ*Math.sqrt(3)*(L.qs+L.rs/2);
  const ox=(o.W-wpx)/2+SZ,hpx=SZ*1.5*(L.rs-1);
  const oy=(o.H-hpx)/2;
  return[ox+SZ*Math.sqrt(3)*(q+r/2),oy+SZ*1.5*r];
}
function hexPath(cx,cy,s){
  x.beginPath();
  for(let i=0;i<6;i++){
    const a=Math.PI/180*(60*i-30);
    const px=cx+s*Math.cos(a),py=cy+s*Math.sin(a);
    i?x.lineTo(px,py):x.moveTo(px,py);
  }
  x.closePath();
}
function build(){
  const L=LV[lv];
  board=new Set();placed=[];pieces=L.pieces.slice();sel=0;rot=0;
  for(let q=0;q<L.qs;q++)for(let r=0;r<L.rs;r++)board.add(key(q,r));
  hud.set("nv",lv+1);hud.set("pc","0/"+pieces.length);
  tray();draw();
}
function atCell(px,py){
  const L=LV[lv];let best=null,bd=1e9;
  for(let q=0;q<L.qs;q++)for(let r=0;r<L.rs;r++){
    const[cx,cy]=center(q,r);
    const d=Math.hypot(cx-px,cy-py);
    if(d<SZ&&d<bd){bd=d;best=[q,r];}
  }
  return best;
}
H.onTap(o,(px,py)=>{
  if(over)return;
  const hit=atCell(px,py);
  if(!hit)return;
  const k=key(hit[0],hit[1]);
  const pi=placed.findIndex(p=>p.cells.includes(k));
  if(pi>=0){
    const[p]=placed.splice(pi,1);pieces.push(p.t);sel=pieces.length-1;
    H.sfx("tick");tray();draw();hud.set("pc",(LV[lv].pieces.length-pieces.length)+"/"+LV[lv].pieces.length);return;
  }
  if(!pieces.length)return;
  const t=pieces[sel],sh=rotAx(shapeOf(t),rot);
  const cells=sh.map(([dq,dr])=>key(hit[0]+dq,hit[1]+dr));
  const used=new Set(placed.flatMap(p=>p.cells));
  if(!cells.every(c=>board.has(c)&&!used.has(c))){H.sfx("bad");say("Não encaixa — respeite a colmeia e as peças vizinhas.");return;}
  placed.push({t,cells});pieces.splice(sel,1);sel=0;
  H.sfx("ok");tray();draw();
  hud.set("pc",(LV[lv].pieces.length-pieces.length)+"/"+LV[lv].pieces.length);
  if(placed.flatMap(p=>p.cells).length>=board.size){
    const sc=(lv+1)*160;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Colmeia completa!",sub:"3 tabuleiros hexagonais sem uma lacuna."});}
    lv++;say("Nível "+(lv+1)+": colmeia maior, peças curvas.");H.after(700,build);
  }
});
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const used={};
  placed.forEach((p,i)=>p.cells.forEach(c=>used[c]=i));
  board.forEach(k=>{
    const[q,r]=k.split(",").map(Number);
    const[cx,cy]=center(q,r);
    hexPath(cx,cy,SZ-2);
    x.fillStyle=used[k]!=null?(used[k]%2?H.C.wasabi:H.C.gold):H.C.card;
    x.fill();x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    if(used[k]!=null){x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";x.fillText(placed[used[k]].t,cx-4,cy+4);}
  });
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  pieces.forEach((t,i)=>{
    const b=H.el("button","g-chip"+(i===sel?" hot":""),t==="L"?"▬ tri-reta":"◣ tri-curva",trayBox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");tray();});
  });
  const rb=H.el("button","g-btn sm ghost","⟳ Girar 60°",trayBox);
  rb.addEventListener("click",()=>{rot=(rot+1)%6;H.sfx("tick");});
}
build();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
