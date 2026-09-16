#!/usr/bin/env python3
"""Gera games/g021..g030 — PUZZLE (parte 3)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 21 — Medida de Água
GAMES[21] = r"""/* NCODE N · 021 Medida de Água — despeje até a medida exata */
GREG(21,{
init(root,H){
const LV=[{caps:[8,5,3],goal:4},{caps:[9,4,3],goal:6},{caps:[12,7,5],goal:6}];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","DESPEJOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique num pote (<b>origem</b>) e depois noutro (<b>destino</b>) para despejar. Obtenha a medida exata em qualquer pote.");
const o=H.cvs(root,480,340),x=o.x;
let caps=[],water=[],sel=-1;
function build(){
  caps=LV[lv].caps.slice();water=[caps[0],0,0];sel=-1;moves=0;
  hud.set("nv",lv+1);hud.set("mv",0);draw();
  say("Nível "+(lv+1)+": potes de <b>"+caps.join(", ")+"</b> L. Meta: <b>"+LV[lv].goal+" L</b> exatos.");
}
function geom(i){
  const w=110,gap=30,tot=caps.length*w+(caps.length-1)*gap;
  const x0=(o.W-tot)/2+i*(w+gap);
  return{x:x0,y:60,w,h:220};
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";
  x.fillText("META: "+LV[lv].goal+" L",20,30);
  caps.forEach((c,i)=>{
    const g=geom(i);
    x.fillStyle=i===sel?H.C.wasabi:H.C.card;
    x.fillRect(g.x,g.y,g.w,g.h);
    x.strokeStyle=H.C.ink;x.lineWidth=i===sel?4:2;x.strokeRect(g.x,g.y,g.w,g.h);
    const fh=g.h*(water[i]/c);
    x.fillStyle="#2E6E8A";x.fillRect(g.x+3,g.y+g.h-fh,g.w-6,Math.max(0,fh));
    x.fillStyle=H.C.ink;x.font="bold 15px 'Space Mono',monospace";
    x.fillText(water[i]+" / "+c+" L",g.x+12,g.y+g.h+24);
    x.font="12px 'Space Mono',monospace";
    x.fillText(i===0?"(cheio)":"",g.x+12,g.y-10);
  });
}
H.onTap(o,(px,py)=>{
  if(over)return;
  let hit=-1;
  caps.forEach((c,i)=>{const g=geom(i);if(px>g.x-8&&px<g.x+g.w+8&&py>g.y-30&&py<g.y+g.h+30)hit=i;});
  if(hit<0)return;
  if(sel<0){if(water[hit]<=0){H.sfx("bad");return;}sel=hit;H.sfx("tick");draw();return;}
  if(sel===hit){sel=-1;draw();return;}
  const amt=Math.min(water[sel],caps[hit]-water[hit]);
  if(amt<=0){H.sfx("bad");sel=-1;draw();return;}
  water[sel]-=amt;water[hit]+=amt;sel=-1;
  moves++;hud.set("mv",moves);H.beep(400+moves*20,.07,"sine",.04);draw();
  if(water.includes(LV[lv].goal)){
    H.sfx("ok");const sc=(lv+1)*120+Math.max(0,80-moves*4);H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Medida perfeita!",sub:"3 quantidades exatas sem copo medidor."});}
    lv++;H.after(600,build);
  }
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});"""

# 22 — Dobra e Corte
GAMES[22] = r"""/* NCODE N · 022 Dobra e Corte — preveja o desdobrar */
GREG(22,{
init(root,H){
let round=0,over=false,sc=0,correct=0,lock=false;
const hud=H.hud(root,[["rd","RODADA","1/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Observe as <b>dobras</b> e o <b>corte</b> (✂). Qual padrão surge ao desdobrar?");
const info=H.el("div","g-msg","",root);
const optsRow=H.el("div","g-row",null,root);
function foldC(c){return c<2?c:3-c;}
function foldR(r){return r<2?r:3-r;}
function pattern(folds,cuts){
  const holes=new Set();
  for(let R=0;R<4;R++)for(let C=0;C<4;C++){
    let r=R,c=C;
    for(const f of folds){if(f==="V")c=foldC(c);else r=foldR(r);}
    if(cuts.has(r+","+c))holes.add(R+","+C);
  }
  return holes;
}
function drawOpt(cv,holes,folded,folds,cuts){
  const x=cv.x;
  x.fillStyle=H.C.paper;x.fillRect(0,0,cv.W,cv.H);
  const s=cv.W/4;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    x.fillStyle=H.C.card;x.fillRect(c*s+1,r*s+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
    if(holes.has(r+","+c)){x.fillStyle=H.C.ink;x.beginPath();x.arc(c*s+s/2,r*s+s/2,s*0.28,0,7);x.fill();}
  }
}
function build(){
  lock=false;
  const r=H.rng(900+round*57);
  const kinds=[["V"],["H"],["V","H"],["H","V"]];
  const folds=kinds[Math.floor(r()*kinds.length)];
  const wf=folds.includes("V")?2:4,hf=folds.includes("H")?2:4;
  const cuts=new Set();
  const nc=1+Math.floor(r()*2);
  while(cuts.size<nc)cuts.add(Math.floor(r()*hf)+","+Math.floor(r()*wf));
  const good=pattern(folds,cuts);
  const setEq=(a,b)=>a.size===b.size&&[...a].every(k=>b.has(k));
  const cands=[good];
  let guard=0;
  while(cands.length<4&&guard++<200){
    const m=new Set(good);
    const op=Math.floor(r()*3);
    if(op===0||m.size===0){m.add(Math.floor(r()*4)+","+Math.floor(r()*4));}
    else if(op===1){const a=[...m];m.delete(a[Math.floor(r()*a.length)]);}
    else{const a=[...m];const k=a[Math.floor(r()*a.length)];m.delete(k);
      const[rr,cc]=k.split(",").map(Number);m.add(rr+","+(3-cc));}
    if(m.size===0||setEq(m,good)||cands.some(c=>setEq(c,m)))continue;
    cands.push(m);
  }
  while(cands.length<4){const m=new Set([Math.floor(r()*4)+","+Math.floor(r()*4)]);if(!cands.some(c=>setEq(c,m)))cands.push(m);}
  const order=H.shuffle(r,[0,1,2,3]);
  correct=order.indexOf(0);
  info.innerHTML="Dobras: <b>"+folds.join(" → ")+"</b> · Cortes: <b>"+cuts.size+"× ✂</b> · Rodada "+(round+1)+" de 5";
  optsRow.innerHTML="";
  order.forEach((ci,k)=>{
    const box=H.el("div","g-col",null,optsRow);
    const cv=H.cvs(box,132,132);
    drawOpt(cv,cands[ci]);
    const b=H.el("button","g-chip","opção "+(k+1),box);
    b.style.cursor="pointer";
    const pick=()=>{
      if(lock||over)return;lock=true;
      if(k===correct){H.sfx("ok");sc+=100;H.score(sc);hud.set("sc",sc);
        say("✅ Correto! O corte se espelhou por todas as dobras.");
        round++;
        if(round>=5){over=true;H.after(700,()=>H.done({win:true,score:sc+100,title:"Mestre do origami!",sub:"5 desdobramentos previstos com perfeição."}));}
        else H.after(900,build);
      }else{H.sfx("bad");say("❌ Não é essa. Observe como cada dobra <b>espelha</b> o corte.");lock=false;}
    };
    b.addEventListener("click",pick);
    H.onTap(cv,()=>pick());
  });
  hud.set("rd",(round+1)+"/5");
}
build();
}});"""

# 23 — Retrato Deslizante
GAMES[23] = r"""/* NCODE N · 023 Retrato Deslizante — ordene o quebra-cabeça */
GREG(23,{
init(root,H){
const LV=[3,4];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","MOVIMENTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique numa peça <b>vizinha ao vazio</b> para deslizá-la. Ordene de 1 até N.");
const board=H.el("div","g-board",null,root);
let N=3,g=[],cells=[];
function build(){
  N=LV[lv];moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  g=[];for(let i=1;i<N*N;i++)g.push(i);g.push(0);
  let blank=N*N-1;
  const times=N===3?40:120;
  for(let k=0;k<times;k++){
    const r=(blank/N)|0,c=blank%N,opts=[];
    if(r>0)opts.push(blank-N);if(r<N-1)opts.push(blank+N);
    if(c>0)opts.push(blank-1);if(c<N-1)opts.push(blank+1);
    const m=opts[Math.floor(Math.random()*opts.length)];
    g[blank]=g[m];g[m]=0;blank=m;
  }
  board.style.gridTemplateColumns="repeat("+N+",1fr)";
  board.style.width="min(100%,"+(N*64)+"px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize=(N===3?"26px":"20px");
    (function(idx){d.addEventListener("click",()=>tap(idx));})(i);
    cells.push(d);
  }
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    const v=g[i];
    cells[i].textContent=v||"";
    cells[i].disabled=!v;
    cells[i].style.background=v?H.C.card:"transparent";
    cells[i].style.border=v?"1px solid "+H.C.ink:"1px dashed "+H.C.cement;
    cells[i].classList.toggle("good",!!v&&v===i+1);
  }
}
function tap(i){
  if(over)return;
  const b=g.indexOf(0);
  const r1=(i/N)|0,c1=i%N,r2=(b/N)|0,c2=b%N;
  if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1)return;
  g[b]=g[i];g[i]=0;moves++;hud.set("mv",moves);H.sfx("tick");paint();
  let ok=true;
  for(let k=0;k<N*N-1;k++)if(g[k]!==k+1)ok=false;
  if(ok){
    H.sfx("ok");const sc=(lv+1)*150+Math.max(0,200-moves*2);H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Retrato restaurado!",sub:"Quadros 3×3 e 4×4 recompostos peça a peça."});}
    lv++;say("Nível 2: agora o <b>4×4</b> — respire e planeje por fileiras.");H.after(700,build);
  }
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});"""

# 24 — Trem Desviado
GAMES[24] = r"""/* NCODE N · 024 Trem Desviado — acione os desvios, entregue os trens */
GREG(24,{
init(root,H){
const LV=[
 {sw:[{x:260,y:180,br:[[[260,180],[260,90],[490,90]],[[260,180],[260,270],[490,270]]],dir:0}],
  st:[{x:490,y:90,c:"red",n:"VERMELHA"},{x:490,y:270,c:"blue",n:"AZUL"}],
  pre:[[30,180],[260,180]],trains:["red","blue"]},
 {sw:[{x:200,y:180,br:[[[200,180],[200,90],[490,90]],[[200,180],[200,270],[330,270]]],dir:0},
      {x:330,y:270,br:[[[330,270],[330,200],[490,200]],[[330,270],[490,270]]],dir:1}],
  st:[{x:490,y:90,c:"red",n:"VERMELHA"},{x:490,y:200,c:"green",n:"VERDE"},{x:490,y:270,c:"blue",n:"AZUL"}],
  pre:[[30,180],[200,180]],trains:["red","green","blue"]},
 {sw:[{x:200,y:120,br:[[[200,120],[200,60],[490,60]],[[200,120],[200,180],[490,180]]],dir:0},
      {x:200,y:300,br:[[[200,300],[200,240],[490,240]],[[200,300],[490,300]]],dir:1}],
  st:[{x:490,y:60,c:"red",n:"VERMELHA"},{x:490,y:180,c:"blue",n:"AZUL"},{x:490,y:240,c:"green",n:"VERDE"},{x:490,y:300,c:"gold",n:"ÂMBAR"}],
  pre:[[30,120],[200,120]],pre2:[[30,300],[200,300]],trains:["red","blue","green","gold"]}
];
const COL={red:"#D94E34",blue:"#2E6E8A",green:"#3E7C4F",gold:"#E8A33D"};
let lv=0,over=false,qi=0,train=null,sc=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["tr","TRENS","0/2"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>desvios ◉</b> para alternar o ramo ativo. Cada trem deve chegar à estação da sua cor.");
const o=H.cvs(root,520,360),x=o.x;
function build(){
  qi=0;train=null;
  LV[lv].sw.forEach(s=>{s.dir=lv===2?(s.y>200?1:0):s.dir;});
  hud.set("nv",lv+1);
  say("Nível "+(lv+1)+": "+LV[lv].trains.length+" trens a caminho. Ajuste os desvios!");
  spawn();
}
function spawn(){
  const L=LV[lv];
  if(qi>=L.trains.length){
    over=true;H.score(sc+150);
    if(lv>=LV.length-1)return H.done({win:true,score:sc+150,title:"Ferrovia pontual!",sub:"Todos os trens nas estações certas, sem colisões."});
    lv++;say("Nível "+(lv+1)+": mais desvios, mais cores.");H.after(800,build);return;
  }
  const pre=(L.pre2&&qi>=2)?L.pre2:L.pre;
  train={c:L.trains[qi],route:pre.map(p=>p.slice()),seg:0,t:0,speed:130,armed:true};
  hud.set("tr",qi+"/"+L.trains.length);
}
function stationAt(px,py){
  return LV[lv].st.find(s=>Math.hypot(s.x-px,s.y-py)<34);
}
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const s of LV[lv].sw){
    if(Math.hypot(s.x-px,s.y-py)<24){s.dir^=1;H.sfx("tick");return;}
  }
});
H.loop(dt=>{
  const L=LV[lv];
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  function line(pts,col,w){
    x.strokeStyle=col;x.lineWidth=w||3;x.beginPath();
    pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
  }
  line(L.pre,"#8A877C",4);
  if(L.pre2)line(L.pre2,"#8A877C",4);
  L.sw.forEach((s,si)=>{
    s.br.forEach((b,bi)=>{
      line(b,bi===s.dir?H.C.ink:"#D8D5CC",bi===s.dir?4:2);
    });
    x.fillStyle=H.C.wasabi;x.beginPath();x.arc(s.x,s.y,13,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";
    x.fillText(s.dir?"▼":"▲",s.x-5,s.y+4);
  });
  L.st.forEach(s=>{
    x.fillStyle=COL[s.c];x.fillRect(s.x-16,s.y-16,32,28);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(s.x-16,s.y-16,32,28);
    x.fillStyle=H.C.ink;x.font="10px 'Space Mono',monospace";x.fillText(s.n,s.x-24,s.y+26);
  });
  if(train&&!over){
    const r=train.route;
    let remain=train.speed*dt,guard=0;
    while(remain>0&&guard++<10){
      const a=r[train.seg],b=r[train.seg+1];
      if(!b)break;
      const len=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const left=len-train.t;
      if(remain<left){train.t+=remain;remain=0;}
      else{remain-=left;train.seg++;train.t=0;
        if(train.seg>=r.length-1){arrive();break;}
        // chegou num desvio? anexa ramo
        const p=r[train.seg];
        const sw=L.sw.find(s=>Math.hypot(s.x-p[0],s.y-p[1])<4);
        if(sw&&train.armed){train.armed=false;
          sw.br[sw.dir].slice(1).forEach(q=>r.push(q.slice()));
        }
      }
    }
    if(!train)return;
    const a=r[Math.min(train.seg,r.length-2)]||r[0],b=r[Math.min(train.seg+1,r.length-1)]||r[0];
    const len=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1]));
    const px=a[0]+(b[0]-a[0])*train.t/len,py=a[1]+(b[1]-a[1])*train.t/len;
    train.px=px;train.py=py;
    x.save();x.translate(px,py);
    x.fillStyle=COL[train.c];x.fillRect(-16,-9,32,18);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-16,-9,32,18);
    x.fillStyle=H.C.paper;x.font="11px serif";x.fillText("🚂",-9,5);
    x.restore();
  }
});
function arrive(){
  const st=stationAt(train.px,train.py);
  if(st&&st.c===train.c){
    H.sfx("ok");sc+=120;H.score(sc);hud.set("sc",sc);qi++;
    say("Trem entregue na estação "+st.n+". "+(LV[lv].trains.length-qi)+" restantes.");
    train=null;H.after(500,spawn);
  }else{
    H.sfx("bad");say("❌ Estação errada! O trem "+train.c+" voltou. Reajuste os desvios.");
    train=null;H.after(700,spawn);
  }
}
build();
}});"""

# 25 — Poção Colorida
GAMES[25] = r"""/* NCODE N · 025 Poção Colorida — misture até igualar */
GREG(25,{
init(root,H){
let round=0,over=false,sc=0;
const hud=H.hud(root,[["rd","RODADA","1/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Ajuste <b>R, G, B</b> em passos e prove a mistura. Erro abaixo de 40 passa de nível.");
const o=H.cvs(root,480,220),x=o.x;
let tgt=[0,0,0],mix=[128,128,128];
const CH=["R","G","B"];
function build(){
  const r=H.rng(300+round*91);
  tgt=[Math.floor(r()*16)*16,Math.floor(r()*16)*16,Math.floor(r()*16)*16];
  mix=[128,128,128];
  hud.set("rd",(round+1)+"/5");paint();tray();
}
function css(c){return"rgb("+c[0]+","+c[1]+","+c[2]+")";}
function paint(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=css(tgt);x.fillRect(30,40,190,140);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(30,40,190,140);
  x.fillStyle=css(mix);x.fillRect(260,40,190,140);x.strokeRect(260,40,190,140);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("ALVO",30,30);x.fillText("SUA MISTURA",260,30);
  const d=Math.sqrt((tgt[0]-mix[0])**2+(tgt[1]-mix[1])**2+(tgt[2]-mix[2])**2);
  x.fillStyle=d<40?H.C.ok:H.C.ink2;x.font="bold 14px 'Space Mono',monospace";
  x.fillText("Δ "+d.toFixed(0)+" / 40",190,205);
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-col",null,root);
  trayBox.innerHTML="";
  CH.forEach((c,i)=>{
    const row=H.el("div","g-row",null,trayBox);
    H.el("span","g-chip",c+" <b>"+mix[i]+"</b> "+(mix[i]<tgt[i]?"▲":mix[i]>tgt[i]?"▼":"✓"),row);
    const b1=H.el("button","g-btn sm ghost","−16",row);
    const b2=H.el("button","g-btn sm ghost","+16",row);
    b1.addEventListener("click",()=>{mix[i]=Math.max(0,mix[i]-16);H.sfx("tick");paint();tray();});
    b2.addEventListener("click",()=>{mix[i]=Math.min(255,mix[i]+16);H.sfx("tick");paint();tray();});
  });
  const row=H.el("div","g-row",null,trayBox);
  H.btn(row,"⚗ Provar poção",prove,true);
}
function prove(){
  if(over)return;
  const d=Math.sqrt((tgt[0]-mix[0])**2+(tgt[1]-mix[1])**2+(tgt[2]-mix[2])**2);
  if(d<40){
    const gain=Math.round(140-d);sc+=gain;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    round++;
    if(round>=5){over=true;return H.done({win:true,score:sc+100,title:"Mestre-poçoeiro!",sub:"5 elixires com a cor exata do grimório."});}
    say("Poção aprovada! (+ "+gain+") Próximo elixir…");build();
  }else{H.sfx("bad");say("Ainda longe (Δ "+d.toFixed(0)+"). Siga as setas ▲▼ de cada canal.");}
}
build();
}});"""

# 26 — Prisma Divisor
GAMES[26] = r"""/* NCODE N · 026 Prisma Divisor — divida o feixe, acerte todos */
GREG(26,{
init(root,H){
const OUT=[["U","D"],["L","R"],["U","R"],["D","L"]];
const GL=["↕","↔","⌜","⌞"];
const LV=[
 {n:5,src:{r:2,c:-1,d:"R"},prism:[{r:2,c:2,rot:1}],tgt:[[0,2],[4,2]]},
 {n:5,src:{r:4,c:-1,d:"R"},prism:[{r:4,c:2,rot:1},{r:1,c:2,rot:0}],tgt:[[3,2],[1,0]]},
 {n:6,src:{r:5,c:-1,d:"R"},prism:[{r:5,c:3,rot:1},{r:0,c:3,rot:2}],tgt:[[2,3],[0,0]]}
];
const DIRS={R:[0,1],L:[0,-1],U:[-1,0],D:[1,0]};
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>prismas ◇</b> para girar o modo de divisão. <b>Disfire</b> e banhe todos os ◎.");
const board=H.el("div","g-board",null,root);
let cells=[];
function key(r,c){return r+","+c;}
function build(){
  lock=false;
  const L=LV[lv];
  board.style.gridTemplateColumns="repeat("+L.n+",1fr)";
  board.style.width="min(100%,"+(L.n*56)+"px)";
  board.innerHTML="";cells=[];
  for(let r=0;r<L.n;r++)for(let c=0;c<L.n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="18px";
    const pi=L.prism.findIndex(p=>p.r===r&&p.c===c);
    if(pi>=0){(function(idx,dd){dd.addEventListener("click",()=>{
      if(over||lock)return;L.prism[idx].rot=(L.prism[idx].rot+1)%4;H.sfx("tick");paint();
    });})(pi,d);}
    cells.push(d);
  }
  hud.set("nv",lv+1);paint();
}
function trace(){
  const L=LV[lv],n=L.n;
  const pmap={};L.prism.forEach(p=>pmap[key(p.r,p.c)]=p);
  const seen=new Set(),cellsHit=new Set();
  const q=[{r:L.src.r,c:L.src.c,d:L.src.d}];
  let guard=0;
  while(q.length&&guard++<500){
    let{r,c,d}=q.shift();
    const v=DIRS[d];r+=v[0];c+=v[1];
    if(r<0||r>=n||c<0||c>=n)continue;
    const sk=key(r,c)+d;
    if(seen.has(sk))continue;seen.add(sk);cellsHit.add(key(r,c));
    const p=pmap[key(r,c)];
    if(p){for(const nd of OUT[p.rot])q.push({r,c,d:nd});}
    else q.push({r,c,d});
  }
  return cellsHit;
}
function paint(beam){
  const L=LV[lv];
  const tset=new Set(L.tgt.map(t=>key(t[0],t[1])));
  const pmap={};L.prism.forEach(p=>pmap[key(p.r,p.c)]=p);
  for(let r=0;r<L.n;r++)for(let c=0;c<L.n;c++){
    const d=cells[r*L.n+c],k=key(r,c);
    let t="";
    if(r===L.src.r&&c===0)t="▶";
    if(pmap[k])t="◇"+GL[pmap[k].rot];
    if(tset.has(k))t="◎";
    d.textContent=t;d.style.fontSize=pmap[k]?"13px":"20px";
    d.classList.toggle("good",!!(beam&&beam.has(k)));
  }
}
function fire(){
  if(over||lock)return;
  const L=LV[lv];const hitCells=trace();paint(hitCells);H.sfx("pop");
  const n2=L.tgt.filter(t=>hitCells.has(key(t[0],t[1]))).length;
  if(n2===L.tgt.length){
    lock=true;
    const sc=(lv+1)*160;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Espectro completo!",sub:"Feixes divididos banhando todos os alvos."});}
    lv++;say("Nível "+(lv+1)+": mais prismas, mais alvos.");H.after(700,build);
  }else say("Iluminados <b>"+n2+"/"+L.tgt.length+"</b>. Gire os prismas e dispare de novo.");
}
H.btn(root,"🔆 Disparar laser",fire,true);
build();
}});"""

# 27 — Bloco Fugitivo
GAMES[27] = r"""/* NCODE N · 027 Bloco Fugitivo — liberte o bloco vermelho */
GREG(27,{
init(root,H){
const LV=[
 [{o:"H",r:2,c:0,l:2,red:1},{o:"V",r:1,c:4,l:2},{o:"H",r:4,c:1,l:2},{o:"V",r:3,c:5,l:3}],
 [{o:"H",r:2,c:0,l:2,red:1},{o:"V",r:0,c:2,l:2},{o:"V",r:2,c:3,l:2},{o:"H",r:5,c:0,l:3},{o:"V",r:4,c:4,l:2}],
 [{o:"H",r:2,c:1,l:2,red:1},{o:"V",r:0,c:4,l:3},{o:"H",r:5,c:3,l:2},{o:"H",r:0,c:0,l:2},{o:"V",r:3,c:1,l:2}]
];
const COLORS=["#2E6E8A","#3E7C4F","#E8A33D","#8A877C","#7A6FF0"];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","MOVIMENTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste os blocos ao longo do seu eixo. Leve o <b>vermelho</b> até a saída ⇒.");
const o=H.cvs(root,440,440),x=o.x;
const ptr=H.ptr(o);
let cars=[],grab=null,grido=0,cell=0,winAnim=null;
function build(){
  cars=LV[lv].map((c,i)=>Object.assign({fr:c.r,fc:c.c,col:c.red?H.C.terra:COLORS[i%COLORS.length]},c));
  moves=0;grab=null;winAnim=null;
  hud.set("nv",lv+1);hud.set("mv",0);
  cell=Math.floor(Math.min(o.W,o.H)/6.6);grido=(o.W-cell*6)/2;
}
function occ(ignore){
  const m=new Set();
  cars.forEach(c=>{if(c===ignore)return;
    for(let i=0;i<c.l;i++)m.add(c.o==="H"?(c.fr+","+ (c.fc+i)):(c.fr+i+","+c.fc));
  });
  return m;
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(grido,grido,cell*6,cell*6);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(grido,grido,cell*6,cell*6);
  x.strokeStyle=H.C.cement;x.lineWidth=1;
  for(let i=1;i<6;i++){
    x.beginPath();x.moveTo(grido+i*cell,grido);x.lineTo(grido+i*cell,grido+6*cell);x.stroke();
    x.beginPath();x.moveTo(grido,grido+i*cell);x.lineTo(grido+6*cell,grido+i*cell);x.stroke();
  }
  x.fillStyle=H.C.ok;x.fillRect(grido+6*cell-4,grido+2*cell+4,14,cell-8);
  x.fillStyle=H.C.ink;x.font="bold 16px 'Space Mono',monospace";x.fillText("⇒",grido+6*cell+16,grido+2*cell+cell/2+6);
  for(const c of cars){
    const px=grido+c.fc*cell+3,py=grido+c.fr*cell+3;
    const w=(c.o==="H"?c.l*cell:cell)-6,h=(c.o==="H"?cell:c.l*cell)-6;
    x.fillStyle=c===grab?H.C.wasabi:c.col;
    x.fillRect(px,py,w,h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(px,py,w,h);
    if(c.red){x.fillStyle="#fff";x.font="bold 18px 'Space Mono',monospace";x.fillText("★",px+w/2-8,py+h/2+6);}
  }
}
H.loop(()=>{
  if(over)return;
  if(winAnim){
    const red=cars.find(c=>c.red);red.fc+=0.09;
    draw();
    if(red.fc>6){winAnim=null;nextLevel();}
    return;
  }
  if(ptr.down&&!grab){
    const c=Math.floor((ptr.x-grido)/cell),r=Math.floor((ptr.y-grido)/cell);
    grab=cars.find(k=>{
      for(let i=0;i<k.l;i++){if(k.o==="H"){if(k.fr===r&&k.fc+i===c)return true;}else{if(k.fr+i===r&&k.fc===c)return true;}}
      return false;
    })||null;
    if(grab){grab.gx=ptr.x;grab.gy=ptr.y;grab.ofr=grab.fr;grab.ofc=grab.fc;grab.moved=false;}
  }else if(!ptr.down&&grab){
    if(grab.moved){moves++;hud.set("mv",moves);H.sfx("tick");
      const red=cars.find(c=>c.red);
      if(red.fc+red.l>=6){winAnim=true;H.sfx("pop");}
    }
    grab=null;
  }
  if(grab){
    const m=occ(grab);
    if(grab.o==="H"){
      let nc=Math.round(grab.ofc+(ptr.x-grab.gx)/cell);
      nc=Math.max(0,Math.min(6-grab.l,nc));
      let lo=grab.ofc,hi=grab.ofc;
      while(lo-1>=0&&!m.has(grab.fr+","+(lo-1)))lo--;
      while(hi+1<=6-grab.l&&!m.has(grab.fr+","+(hi+grab.l)))hi++;
      grab.fc=H.clamp(nc,lo,hi);
      if(grab.fc!==grab.ofc)grab.moved=true;
    }else{
      let nr=Math.round(grab.ofr+(ptr.y-grab.gy)/cell);
      nr=Math.max(0,Math.min(6-grab.l,nr));
      let lo=grab.ofr,hi=grab.ofr;
      while(lo-1>=0&&!m.has((lo-1)+","+grab.fc))lo--;
      while(hi+1<=6-grab.l&&!m.has((hi+grab.l)+","+grab.fc))hi++;
      grab.fr=H.clamp(nr,lo,hi);
      if(grab.fr!==grab.ofr)grab.moved=true;
    }
  }
  draw();
});
function nextLevel(){
  const sc=(lv+1)*140+Math.max(0,100-moves*3);H.score(sc);hud.set("sc",sc);H.sfx("ok");
  if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Fuga limpa!",sub:"O bloco vermelho escapou dos 3 estacionamentos."});}
  lv++;say("Nível "+(lv+1)+": mais carros no caminho.");build();
}
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});"""

# 28 — Constelação
GAMES[28] = r"""/* NCODE N · 028 Constelação — repita a ordem das estrelas */
GREG(28,{
init(root,H){
let round=0,over=false,seq=[],show=[],input=[],lives=2,tLeft=0,phase="show";
const hud=H.hud(root,[["rd","RODADA","1/5"],["vd","VIDAS",2],["sc","PONTOS",0]]);
const say=H.msg(root,"Memorize a ordem em que as estrelas <b>piscam</b> e repita clicando antes do tempo.");
const o=H.cvs(root,480,400),x=o.x;
let stars=[];
function build(){
  const r=H.rng(200+round*31);
  stars=[];
  for(let i=0;i<7;i++)stars.push({x:50+r()*380,y:50+r()*300});
  const len=3+round;
  seq=[];for(let i=0;i<len;i++)seq.push(Math.floor(r()*7));
  input=[];phase="show";show=seq.slice();
  tLeft=6+len*1.5;
  hud.set("rd",(round+1)+"/5");
  say("Observe a sequência…");
  const T=H.every(650,()=>{
    if(!show.length){clearInterval(T);phase="input";say("Sua vez! Repita a ordem.");return;}
    const s=show.shift();stars[s].flash=1;H.beep(500+s*60,.15,"sine",.05);
  });
}
H.onTap(o,(px,py)=>{
  if(over||phase!=="input")return;
  let best=-1,bd=1e9;
  stars.forEach((s,i)=>{const d=Math.hypot(s.x-px,s.y-py);if(d<30&&d<bd){bd=d;best=i;}});
  if(best<0)return;
  stars[best].flash=1;H.beep(500+best*60,.12,"sine",.05);
  input.push(best);
  const k=input.length-1;
  if(input[k]!==seq[k]){
    lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:round*80,title:"Céu nublado",sub:"A sequência se perdeu na rodada "+(round+1)+"."});}
    say("Ordem errada! Vidas: "+lives+". Veja de novo…");
    phase="show";show=seq.slice();input=[];
    const T=H.every(650,()=>{
      if(!show.length){clearInterval(T);phase="input";say("Sua vez!");return;}
      const s=show.shift();stars[s].flash=1;
    });
    return;
  }
  if(input.length>=seq.length){
    phase="wait";
    const sc=(round+1)*90+Math.round(tLeft)*5;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    round++;
    if(round>=5){over=true;return H.done({win:true,score:sc+100,title:"Cartógrafo do céu!",sub:"5 constelações traçadas na ordem exata."});}
    say("Perfeito! Próxima constelação…");H.after(800,build);
  }
});
H.loop(dt=>{
  if(phase==="input"&&!over){
    tLeft-=dt;
    if(tLeft<=0){over=true;return H.done({win:false,score:round*80,title:"Tempo esgotado",sub:"As estrelas se apagaram antes da resposta."});}
    H.time(tLeft.toFixed(1)+"s");
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.terra;x.lineWidth=2;
  for(let i=1;i<input.length;i++){
    if(input[i-1]==null||input[i]==null)continue;
    x.beginPath();x.moveTo(stars[input[i-1]].x,stars[input[i-1]].y);x.lineTo(stars[input[i]].x,stars[input[i]].y);x.stroke();
  }
  stars.forEach((s,i)=>{
    if(s.flash>0)s.flash-=dt*2;
    const f=Math.max(0,s.flash||0);
    x.fillStyle=f>0?"#fff":H.C.gold;
    x.beginPath();x.arc(s.x,s.y,f>0?11:6,0,7);x.fill();
    if(f>0){x.strokeStyle=H.C.wasabi;x.lineWidth=3;x.beginPath();x.arc(s.x,s.y,15,0,7);x.stroke();}
  });
  if(phase==="input"){
    x.fillStyle=H.C.terra;x.fillRect(20,o.H-18,(o.W-40)*Math.max(0,tLeft/12),8);
  }
});
build();
}});"""

# 29 — Balança Perfeita
GAMES[29] = r"""/* NCODE N · 029 Balança Perfeita — distribua e equilibre */
GREG(29,{
init(root,H){
const LV=[[1,2,3,4],[1,2,4,7],[2,3,5,8,2],[1,3,4,6,6]];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos pesos para ciclar <b>fora → prato esquerdo → prato direito</b>. Equilibre com tudo a bordo!");
const o=H.cvs(root,480,320),x=o.x;
let weights=[],side=[];
function build(){
  weights=LV[lv].slice();side=weights.map(()=>0);
  hud.set("nv",lv+1);paint();tray();
}
function sums(){
  let L=0,R=0;
  weights.forEach((w,i)=>{if(side[i]===1)L+=w;if(side[i]===2)R+=w;});
  return[L,R];
}
function paint(){
  const[L,R]=sums();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const tilt=H.clamp((L-R)*0.03,-0.35,0.35);
  x.fillStyle=H.C.ink;x.fillRect(o.W/2-8,150,16,130);
  x.fillRect(o.W/2-60,276,120,10);
  x.save();x.translate(o.W/2,150);x.rotate(tilt);
  x.fillStyle=H.C.terra;x.fillRect(-190,-5,380,10);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-190,-5,380,10);
  [-170,170].forEach(px=>{
    x.strokeStyle=H.C.ink;x.beginPath();x.moveTo(px,5);x.lineTo(px,60);x.stroke();
    x.fillStyle=H.C.gold;x.beginPath();x.ellipse(px,66,44,10,0,0,7);x.fill();x.stroke();
  });
  x.restore();
  x.fillStyle=H.C.ink;x.font="bold 16px 'Space Mono',monospace";
  x.fillText("◀ "+L,o.W/2-220,120);
  x.fillText(R+" ▶",o.W/2+150,120);
  if(side.every(s=>s>0)&&L===R){x.fillStyle=H.C.ok;x.font="bold 18px 'Space Mono',monospace";x.fillText("⚖ EQUILÍBRIO!",o.W/2-80,40);}
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  weights.forEach((w,i)=>{
    const label=w+"kg "+(side[i]===0?"· fora":side[i]===1?"◀ esq":"dir ▶");
    const b=H.el("button","g-chip"+(side[i]?" hot":""),label,trayBox);
    b.style.cursor="pointer";b.style.fontSize="13px";
    b.addEventListener("click",()=>{
      if(over)return;
      side[i]=(side[i]+1)%3;H.sfx("tick");paint();tray();
      const[L,R]=sums();
      if(side.every(s=>s>0)&&L===R){
        H.sfx("ok");const sc=(lv+1)*130;H.score(sc);hud.set("sc",sc);
        if(lv>=LV.length-1){over=true;H.after(600,()=>H.done({win:true,score:sc+120,title:"Equilíbrio total!",sub:"4 balanças zeradas com todos os pesos."}));}
        else{lv++;say("Nível "+(lv+1)+": mais pesos, soma maior.");H.after(800,build);}
      }
    });
  });
}
build();
}});"""

# 30 — Esteira Seletora
GAMES[30] = r"""/* NCODE N · 030 Esteira Seletora — desvie cada item ao cesto certo */
GREG(30,{
init(root,H){
const COLS=[H.C.terra,H.C.ok,"#2E6E8A"];
const NAMES=["VERMELHO","VERDE","AZUL"];
let over=false,items=[],gA=0,gB=1,spawn=0,sc=0,ok=0,wrong=0,total=15,interval=1.5;
const hud=H.hud(root,[["it","ITENS","0/15"],["ok","ACERTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>desviadores</b> (ou teclas 1/2) para alternar o lado. Combine a cor do item com o cesto.");
const o=H.cvs(root,480,420),x=o.x;
const BINS=[{x:70,c:0},{x:240,c:1},{x:410,c:2}];
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;if(c==="Digit1"){gA^=1;H.sfx("tick");}if(c==="Digit2"){gB^=1;H.sfx("tick");}});
H.onTap(o,(px,py)=>{
  if(over)return;
  if(Math.hypot(px-240,py-150)<34){gA^=1;H.sfx("tick");}
  if(Math.hypot(px-330,py-260)<34){gB^=1;H.sfx("tick");}
});
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&(ok+wrong+items.length)<total){
    spawn=interval;interval=Math.max(.8,interval-.03);
    items.push({c:Math.floor(Math.random()*3),x:240,y:20,vy:60,vx:0,stage:0});
  }
  for(const it of items){
    it.y+=it.vy*dt;it.x+=it.vx*dt;
    if(it.stage===0&&it.y>=150){
      it.stage=1;
      if(gA===0){it.vx=-140;}else{it.vx=70;it.stage=1;}
    }
    if(it.stage===1&&gA===1&&it.y>=260&&it.x>200){
      it.stage=2;
      it.vx=gB===0?-120:120;it.x=330;
    }
    if(it.vx!==0&&it.stage>=1){
      const target=it.stage===1&&gA===0?70:(it.stage===2?(gB===0?240:410):it.x);
      if(Math.abs(it.x-target)<8){it.x=target;it.vx=0;}
    }
    it.vy=Math.min(160,it.vy+40*dt);
  }
  for(let i=items.length-1;i>=0;i--){
    const it=items[i];
    if(it.y>=370){
      items.splice(i,1);
      const bin=BINS.reduce((a,b)=>Math.abs(b.x-it.x)<Math.abs(a.x-it.x)?b:a);
      if(bin.c===it.c){ok++;sc+=10;H.sfx("ok");}
      else{sc=Math.max(0,sc-3);wrong++;H.sfx("bad");}
      const done=ok+wrong;
      hud.set("it",done+"/"+total);hud.set("ok",ok);hud.set("sc",sc);H.score(sc);
      if(done>=total){
        over=true;
        if(ok>=Math.ceil(total*0.7))return H.done({win:true,score:sc+100,title:"Separação eficiente!",sub:ok+"/"+total+" itens nos cestos certos."});
        return H.done({win:false,score:sc,title:"Mistura na esteira",sub:"Só "+ok+"/"+total+" certos. Antecipe o próximo item!"});
      }
    }
  }
  // desenho
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(210,0,60,20);
  x.strokeStyle=H.C.cement;x.lineWidth=2;
  x.beginPath();x.moveTo(240,20);x.lineTo(240,150);x.stroke();
  x.beginPath();x.moveTo(240,150);x.lineTo(70,370);x.stroke();
  x.beginPath();x.moveTo(240,150);x.lineTo(330,260);x.stroke();
  x.beginPath();x.moveTo(330,260);x.lineTo(240,370);x.stroke();
  x.beginPath();x.moveTo(330,260);x.lineTo(410,370);x.stroke();
  gate(240,150,gA,["◀ CESTO 1","▼ SEGUE"]);
  gate(330,260,gB,["◀ CESTO 2","CESTO 3 ▶"]);
  BINS.forEach((b,i)=>{
    x.fillStyle=COLS[b.c];x.fillRect(b.x-45,372,90,34);
    x.strokeStyle=H.C.ink;x.strokeRect(b.x-45,372,90,34);
    x.fillStyle="#fff";x.font="bold 10px 'Space Mono',monospace";x.fillText(NAMES[i],b.x-38,393);
  });
  for(const it of items){
    x.fillStyle=COLS[it.c];x.beginPath();x.arc(it.x,it.y,12,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  }
});
function gate(gx,gy,dir,labels){
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(gx,gy,20,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";
  x.fillText(dir?"▼":"◀",gx-6,gy+4);
  x.font="10px 'Space Mono',monospace";x.fillText(labels[dir],gx-30,gy-26);
}
H.btn(root,"↻ Reiniciar",()=>{if(!over){items=[];gA=0;gB=1;sc=0;ok=0;wrong=0;interval=1.5;spawn=0;hud.set("it","0/15");hud.set("ok",0);hud.set("sc",0);}},false);
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
