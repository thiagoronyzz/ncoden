#!/usr/bin/env python3
"""Gera games/g011..g020 — PUZZLE (parte 2)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 11 — Cascata de Dominós
GAMES[11] = r"""/* NCODE N · 011 Cascata de Dominós — posicione e derrube até o alvo */
GREG(11,{
init(root,H){
const LV=[
 {k:6,tgt:[470,300],walls:[]},
 {k:8,tgt:[470,120],walls:[[250,120,20,180]]},
 {k:10,tgt:[470,300],walls:[[180,200,140,20],[330,80,20,140]]}
];
let lv=0,over=false,running=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["dm","DOMINÓS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no vazio para <b>plantar</b> dominós (clique num plantado para <b>girar</b>). A queda começa na base 🏁.");
const o=H.cvs(root,520,340),x=o.x;
let doms=[];
function base(){return{x:40,y:300,a:0,fall:0,ft:0};}
function reset(){doms=[base()];running=false;hud.set("dm","1/"+LV[lv].k);hud.set("nv",lv+1);}
function inWall(px,py){
  for(const w of LV[lv].walls)if(px>w[0]&&px<w[0]+w[2]&&py>w[1]&&py<w[1]+w[3])return true;
  return false;
}
H.onTap(o,(px,py)=>{
  if(over||running)return;
  for(const d of doms){
    if(Math.hypot(d.x-px,d.y-py)<16){d.a=(d.a+45)%360;H.sfx("tick");return;}
  }
  if(doms.length>=LV[lv].k){H.sfx("bad");say("Limite de <b>"+LV[lv].k+"</b> dominós!");return;}
  if(inWall(px,py)||py<30||py>320||px<10||px>510)return;
  doms.push({x:px,y:py,a:0,fall:0,ft:0});hud.set("dm",doms.length+"/"+LV[lv].k);H.sfx("tick");
});
H.loop(dt=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;
  for(const w of LV[lv].walls)x.fillRect(w[0],w[1],w[2],w[3]);
  const t=LV[lv].tgt;
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(t[0],t[1],16,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";x.fillText("ALVO",t[0]-18,t[1]+30);
  if(running){
    let all=true;
    for(const d of doms){
      if(d.fall===1&&d.ft<1){d.ft=Math.min(1,d.ft+dt*3);all=false;
        if(d.ft>=1){
          const rad=d.a*Math.PI/180;
          const tipx=d.x+Math.cos(rad)*34,tipy=d.y+Math.sin(rad)*34;
          for(const n of doms)if(!n.fall&&Math.hypot(n.x-tipx,n.y-tipy)<26)n.fall=1;
          if(Math.hypot(t[0]-tipx,t[1]-tipy)<30)win();
        }
      } else if(!d.fall)all=false;
    }
    if(all&&!over){running=false;H.sfx("bad");say("A cascata <b>parou</b> antes do alvo. Reposicione os dominós.");doms.forEach(d=>{d.fall=0;d.ft=0;});}
  }
  for(const d of doms){
    x.save();x.translate(d.x,d.y);x.rotate(d.a*Math.PI/180+d.ft*1.4);
    x.fillStyle=d.fall?H.C.terra:H.C.card;
    x.fillRect(-5,-30,10,30);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-5,-30,10,30);
    x.fillStyle=H.C.ink;x.beginPath();x.arc(0,-10,2,0,7);x.arc(0,-20,2,0,7);x.fill();
    x.restore();
  }
  x.font="20px serif";x.fillText("🏁",22,308);
});
function win(){
  if(over)return;running=false;
  H.sfx("ok");const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
  if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Cascata total!",sub:"Todas as fileiras caíram sobre os alvos."});}
  lv++;say("Nível "+(lv+1)+": paredes no caminho da queda.");H.after(700,reset);
}
const row=H.el("div","g-row",null,root);
H.btn(row,"👆 Derrubar o primeiro",()=>{if(!over&&!running){running=true;doms[0].fall=1;H.sfx("pop");}},true);
H.btn(row,"↻ Limpar",()=>{if(!over)reset();},false);
reset();
}});"""

# 12 — Fusão de Cores
GAMES[12] = r"""/* NCODE N · 012 Fusão de Cores — deslize e funda até o branco quente */
GREG(12,{
init(root,H){
const TIERS=["#8A877C","#2E6E8A",H.C.ok,H.C.gold,H.C.terra,"#FAF7F0"];
const NAMES=["poeira","rio","musgo","âmbar","brasa","LUZ"];
let over=false,won=false,sc=0;
const hud=H.hud(root,[["sc","PONTOS",0],["mx","MAIOR","poeira"]]);
const say=H.msg(root,"Setas ou deslize. Blocos iguais se <b>fundem</b> na próxima cor. Alcance a <b>LUZ</b>.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(4,1fr)";
board.style.width="min(100%,340px)";
let cells=[],g=[];
function spawn(){
  const emp=[];for(let i=0;i<16;i++)if(g[i]<0)emp.push(i);
  if(!emp.length)return;
  g[emp[Math.floor(Math.random()*emp.length)]]=Math.random()<.85?0:1;
}
function build(){
  g=new Array(16).fill(-1);cells=[];board.innerHTML="";
  for(let i=0;i<16;i++){const d=H.el("div","g-cell",null,board);d.style.aspectRatio="1";d.style.cursor="default";cells.push(d);}
  spawn();spawn();paint();
}
function paint(){
  let mx=0;
  for(let i=0;i<16;i++){
    const v=g[i];
    cells[i].style.background=v<0?H.C.paper2:TIERS[v];
    cells[i].style.color=v>=4?H.C.ink:H.C.paper;
    cells[i].textContent=v<0?"":NAMES[v][0].toUpperCase();
    cells[i].style.fontSize="22px";
    if(v>mx)mx=v;
  }
  hud.set("mx",NAMES[mx]);hud.set("sc",sc);H.score(sc);
}
function slide(dir){
  if(over)return false;
  let moved=false,gain=0;
  const lines=[];
  for(let i=0;i<4;i++){
    if(dir==="L")lines.push([i*4,i*4+1,i*4+2,i*4+3]);
    if(dir==="R")lines.push([i*4+3,i*4+2,i*4+1,i*4]);
    if(dir==="U")lines.push([i,i+4,i+8,i+12]);
    if(dir==="D")lines.push([i+12,i+8,i+4,i]);
  }
  for(const L of lines){
    let vals=L.map(i=>g[i]).filter(v=>v>=0);
    for(let k=0;k<vals.length-1;k++){
      if(vals[k]===vals[k+1]){vals[k]++;gain+=(vals[k]+1)*10;vals.splice(k+1,1);}
    }
    while(vals.length<4)vals.push(-1);
    L.forEach((idx,k)=>{if(g[idx]!==vals[k]){g[idx]=vals[k];moved=true;}});
  }
  if(!moved)return false;
  sc+=gain;spawn();paint();H.sfx("tick");
  if(g.some(v=>v>=5)&&!won){won=true;over=true;H.score(sc+300);return H.done({win:true,score:sc+300,title:"Cor final: LUZ!",sub:"Você fundiu até o topo da escala cromática."});}
  if(!canMove()){over=true;return H.done({win:false,score:sc,title:"Paleta travada",sub:"Sem fusões possíveis. Tente manter o canto âncora."});}
  return true;
}
function canMove(){
  if(g.some(v=>v<0))return true;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    const v=g[r*4+c];
    if(c<3&&g[r*4+c+1]===v)return true;
    if(r<3&&g[(r+1)*4+c]===v)return true;
  }
  return false;
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowLeft")slide("L");if(c==="ArrowRight")slide("R");
  if(c==="ArrowUp")slide("U");if(c==="ArrowDown")slide("D");});
H.swipe(board,{left:()=>slide("L"),right:()=>slide("R"),up:()=>slide("U"),down:()=>slide("D")});
H.btn(root,"↻ Recomeçar",()=>{over=false;won=false;sc=0;build();},false);
build();
}});"""

# 13 — Ponte Mínima
GAMES[13] = r"""/* NCODE N · 013 Ponte Mínima — tábuas contadas sobre o abismo */
GREG(13,{
init(root,H){
const LV=[
 {anchors:[[60,250],[60,150],[460,250],[460,150],[260,290]],max:250,k:3},
 {anchors:[[50,260],[50,160],[470,260],[470,160],[200,300],[330,300]],max:200,k:4},
 {anchors:[[50,270],[50,150],[470,270],[470,150],[170,310],[260,250],[355,310]],max:170,k:5}
];
let lv=0,over=false,testing=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["tb","TÁBUAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique em <b>duas âncoras</b> para estender uma tábua (alcance limitado). Depois <b>Teste a travessia</b>.");
const o=H.cvs(root,520,340),x=o.x;
let planks=[],sel=-1,walker=null;
function reset(){
  planks=[];sel=-1;walker=null;testing=false;
  hud.set("nv",lv+1);hud.set("tb","0/"+LV[lv].k);
}
H.onTap(o,(px,py)=>{
  if(over||testing)return;
  const A=LV[lv].anchors;
  let best=-1,bd=1e9;
  A.forEach((a,i)=>{const d=Math.hypot(a[0]-px,a[1]-py);if(d<26&&d<bd){bd=d;best=i;}});
  if(best<0)return;
  if(sel<0){sel=best;H.sfx("tick");return;}
  if(sel===best){sel=-1;return;}
  if(planks.some(p=>(p[0]===sel&&p[1]===best)||(p[0]===best&&p[1]===sel))){sel=-1;return;}
  const d=Math.hypot(A[sel][0]-A[best][0],A[sel][1]-A[best][1]);
  if(d>LV[lv].max){H.sfx("bad");say("Vão <b>longo demais</b> para uma tábua! Use apoios intermediários.");sel=-1;return;}
  if(planks.length>=LV[lv].k){H.sfx("bad");say("Acabaram as tábuas! Clique numa tábua para removê-la.");sel=-1;return;}
  planks.push([sel,best]);hud.set("tb",planks.length+"/"+LV[lv].k);H.sfx("ok");sel=-1;
});
function pathExists(){
  const A=LV[lv].anchors;
  const adj=A.map(()=>[]);
  planks.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const left=A.map((a,i)=>a[0]<150?i:-1).filter(i=>i>=0);
  const seen=new Set(left),q=left.slice();
  while(q.length){const i=q.pop();
    if(A[i][0]>370)return true;
    for(const j of adj[i])if(!seen.has(j)){seen.add(j);q.push(j);}
  }
  return false;
}
function findPath(){
  const A=LV[lv].anchors;
  const adj=A.map(()=>[]);
  planks.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const start=A.findIndex(a=>a[0]<150);
  const prev=new Array(A.length).fill(-1),seen=new Set([start]),q=[start];
  while(q.length){const i=q.shift();
    if(A[i][0]>370){const p=[i];let c=i;while(prev[c]>=0){c=prev[c];p.unshift(c);}return p;}
    for(const j of adj[i])if(!seen.has(j)){seen.add(j);prev[j]=i;q.push(j);}
  }
  return null;
}
H.loop(dt=>{
  const A=LV[lv].anchors;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#9db7c4";x.fillRect(120,230,280,110);
  x.fillStyle=H.C.ink;x.fillRect(0,180,120,160);x.fillRect(400,180,120,160);
  x.fillStyle=H.C.ok;x.fillRect(0,170,120,12);x.fillRect(400,170,120,12);
  x.fillStyle=H.C.gold;
  A.forEach((a,i)=>{if(a[0]>150&&a[0]<370){x.fillRect(a[0]-8,a[1],16,110);}});
  x.strokeStyle=H.C.terra;x.lineWidth=7;
  planks.forEach(([a,b])=>{x.beginPath();x.moveTo(A[a][0],A[a][1]);x.lineTo(A[b][0],A[b][1]);x.stroke();});
  A.forEach((a,i)=>{
    x.fillStyle=i===sel?H.C.wasabi:H.C.ink;
    x.beginPath();x.arc(a[0],a[1],10,0,7);x.fill();
    x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
  });
  if(walker){
    walker.t+=dt*.5;
    const p=walker.path;
    const seg=Math.min(p.length-2,Math.floor(walker.t));
    const f=walker.t-seg;
    const a=A[p[seg]],b=A[p[seg+1]];
    const wx=a[0]+(b[0]-a[0])*f,wy=a[1]+(b[1]-a[1])*f-14;
    x.font="22px serif";x.fillText("🚶",wx-11,wy+8);
    if(walker.t>=p.length-1){walker=null;celebrate();}
  }
});
function celebrate(){
  testing=false;H.sfx("ok");
  const sc=(lv+1)*150+(LV[lv].k-planks.length)*30;H.score(sc);hud.set("sc",sc);
  if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Travessia garantida!",sub:"3 pontes erguidas com o mínimo de tábuas."});}
  lv++;say("Nível "+(lv+1)+": vão maior, tábuas mais curtas.");reset();
}
const row=H.el("div","g-row",null,root);
H.btn(row,"🚶 Testar travessia",()=>{
  if(over||testing)return;
  const p=findPath();
  if(!p){H.sfx("bad");say("Sem caminho contínuo da <b>margem esquerda</b> à direita.");return;}
  testing=true;walker={path:p,t:0};H.sfx("pop");
},true);
H.btn(row,"↺ Desfazer tábua",()=>{if(!over&&!testing){planks.pop();hud.set("tb",planks.length+"/"+LV[lv].k);}},false);
reset();
}});"""

# 14 — Circuito Fechado
GAMES[14] = r"""/* NCODE N · 014 Circuito Fechado — gire e acenda a lâmpada */
GREG(14,{
init(root,H){
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas peças para <b>girar</b>. Ligue a 🔋 até a 💡 com trilhas conectadas.");
const board=H.el("div","g-board",null,root);
let n=4,cells=[],tiles=[];
const DV=[[-1,0],[0,1],[1,0],[0,-1]];
const GLYPH={"0":"╹","1":"╺","2":"╻","3":"╸","0,2":"║","1,3":"═","0,1":"╚","1,2":"╔","2,3":"╗","0,3":"╝","0,1,2":"╠","1,2,3":"╦","0,2,3":"╣","0,1,3":"╩","0,1,2,3":"╬"};
function rot2(o,r){return o.map(d=>(d+r)%4).sort().join(",");}
function build(){
  lock=false;
  n=4+lv;
  const r=H.rng(77+lv*131);
  const inw=[[true]],front=[];
  const inwM=new Set(["0,0"]);
  const edges={};
  const push=(a,b)=>{front.push([a,b]);};
  const key=(a)=>a[0]+","+a[1];
  [[1,0],[0,1]].forEach(v=>push([0,0],v));
  const adj={};
  for(let i=0;i<n*n;i++)adj[i]=[];
  let guard=0;
  while(front.length&&guard++<2000){
    const idx=Math.floor(r()*front.length);
    const[a,b]=front.splice(idx,1)[0];
    if(b[0]<0||b[0]>=n||b[1]<0||b[1]>=n||inwM.has(key(b)))continue;
    inwM.add(key(b));
    const ia=a[0]*n+a[1],ib=b[0]*n+b[1];
    adj[ia].push(ib);adj[ib].push(ia);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>push(b,[b[0]+v[0],b[1]+v[1]]));
  }
  tiles=[];
  for(let i=0;i<n*n;i++){
    const rr=(i/n)|0,cc=i%n;
    const dirs=adj[i].map(j=>{
      const jr=(j/n)|0,jc=j%n;
      if(jr===rr-1)return 0;if(jc===cc+1)return 1;if(jr===rr+1)return 2;return 3;
    }).sort();
    tiles.push({base:dirs,rot:Math.floor(r()*4)});
  }
  tiles[0].fixed=true;tiles[n*n-1].fixed=true;tiles[0].rot=0;tiles[n*n-1].rot=0;
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*54)+"px)";
  board.innerHTML="";cells=[];
  tiles.forEach((t,i)=>{
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    if(!t.fixed)d.addEventListener("click",()=>{if(over||lock)return;t.rot=(t.rot+1)%4;H.sfx("tick");paint();check(true);});
    cells.push(d);
  });
  hud.set("nv",lv+1);paint();check(false);
}
function opens(i){
  const t=tiles[i];
  return t.base.map(d=>(d+t.rot)%4);
}
function paint(lit){
  const lset=new Set(lit||[]);
  tiles.forEach((t,i)=>{
    const o2=opens(i).slice().sort().join(",");
    cells[i].textContent=i===0?"🔋":i===n*n-1?(lset.has(i)?"💡":"🌑"):(GLYPH[o2]||"·");
    cells[i].classList.toggle("good",lset.has(i));
    cells[i].classList.toggle("sel",i===0);
  });
}
function litSet(){
  const seen=new Set([0]),q=[0];
  while(q.length){
    const i=q.pop();const rr=(i/n)|0,cc=i%n;
    for(const d of opens(i)){
      const nr=rr+DV[d][0],nc=cc+DV[d][1];
      if(nr<0||nr>=n||nc<0||nc>=n)continue;
      const j=nr*n+nc;
      if(seen.has(j))continue;
      if(opens(j).includes((d+2)%4)){seen.add(j);q.push(j);}
    }
  }
  return seen;
}
function check(loud){
  if(over||lock)return;
  const s=litSet();paint(s);
  if(s.has(n*n-1)){
    lock=true;
    H.sfx("ok");const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
    if(lv>=2){over=true;H.after(600,()=>H.done({win:true,score:sc+150,title:"Luz acesa!",sub:"Corrente fluindo nos 3 quadros elétricos."}));}
    else{lv++;say("Nível "+(lv+1)+": quadro maior, mais fios.");H.after(800,build);}
  }else if(loud)H.beep(240,.05,"square",.02);
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});"""

# 15 — Equilíbrio de Pilha
GAMES[15] = r"""/* NCODE N · 015 Equilíbrio de Pilha — empilhe sem tombar */
GREG(15,{
init(root,H){
let over=false,lives=3,stack=[],cur=null,sc=0,falling=[];
const hud=H.hud(root,[["pc","PEÇAS","0/6"],["lf","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste a peça <b>suspensa</b> e solte sobre a pilha. Se o centro de massa sair da base, tudo tomba!");
const o=H.cvs(root,520,380),x=o.x;
const ptr=H.ptr(o);
const BASE={x:150,y:330,w:220,h:16};
function newPiece(){
  const r=H.rng(Date.now()%100000+stack.length*97+Math.floor(Math.random()*999));
  cur={w:56+H.rf(r,0,44),h:24,x:o.W/2,y:60,held:true};
}
newPiece();
H.onTap(o,()=>{if(cur&&!over&&falling.length===0){cur.held=false;drop();}});
function drop(){
  if(!cur)return;
  let topY=BASE.y;
  for(const p of stack)topY=Math.min(topY,p.y);
  cur.y=topY-cur.h/2;cur.held=false;
  const below=stack.length?stack[stack.length-1]:{x:BASE.x+BASE.w/2,w:BASE.w};
  const overlap=Math.min(cur.x+cur.w/2,below.x+below.w/2)-Math.max(cur.x-cur.w/2,below.x-below.w/2);
  if(overlap<cur.w*0.25){
    H.sfx("bad");say("Sem apoio! A peça escorregou.");
    falling=[{x:cur.x,y:cur.y,w:cur.w,h:cur.h,vy:0,vx:cur.x<below.x?-120:120}];
    cur=null;H.after(900,()=>{falling=[];if(!over)newPiece();});
    return;
  }
  stack.push(cur);cur=null;H.sfx("ok");
  hud.set("pc",stack.length+"/6");
  // centro de massa
  let m=0,mx=0;
  for(const p of stack){const a=p.w*p.h;m+=a;mx+=p.x*a;}
  mx/=m;
  const bsup=stack[0];
  if(mx<bsup.x-bsup.w/2||mx>bsup.x+bsup.w/2){
    say("⚠️ O centro de massa saiu da base — <b>TOMBANDO</b>!");
    falling=stack.map((p,i)=>({x:p.x,y:p.y,w:p.w,h:p.h,vy:-60-i*10,vx:(mx<260?-1:1)*(60+i*22),rot:0}));
    stack=[];
    lives--;hud.set("lf",lives);H.sfx("lose");
    H.after(1200,()=>{
      falling=[];
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Pilha desabada",sub:"3 tombos. Centralize as peças mais largas embaixo."});}
      say("Restam "+lives+" vidas. Recomece a pilha com calma.");newPiece();
    });
    return;
  }
  sc+=50;H.score(sc);hud.set("sc",sc);
  if(stack.length>=6){over=true;return H.done({win:true,score:sc+150,title:"Torre em pé!",sub:"6 peças empilhadas sobre a plataforma."});}
  newPiece();
}
H.loop(dt=>{
  if(cur&&cur.held){cur.x=H.clamp(ptr.x,30,o.W-30);}
  for(const f of falling){f.vy+=900*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.rot!=null)f.rot+=dt*3;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,346,o.W,34);
  x.fillStyle=H.C.ink;x.fillRect(BASE.x,BASE.y,BASE.w,BASE.h);
  x.fillStyle=H.C.wasabi;x.fillRect(BASE.x,BASE.y,BASE.w,4);
  const drawP=(p,col)=>{
    x.save();x.translate(p.x,p.y);if(p.rot)x.rotate(p.rot*.2);
    x.fillStyle=col;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-p.w/2,-p.h/2,p.w,p.h);
    x.restore();
  };
  stack.forEach((p,i)=>drawP(p,i%2?H.C.gold:H.C.card));
  falling.forEach(f=>drawP(f,H.C.terra));
  if(cur){x.setLineDash([5,5]);x.strokeStyle=H.C.ink3;
    x.beginPath();x.moveTo(cur.x,0);x.lineTo(cur.x,o.H);x.stroke();x.setLineDash([]);
    drawP(cur,H.C.wasabi);}
  if(stack.length){
    let m=0,mx=0;for(const p of stack){const a=p.w*p.h;m+=a;mx+=p.x*a;}mx/=m;
    const topY=stack.reduce((a,p)=>Math.min(a,p.y),BASE.y);
    x.fillStyle=H.C.terra;x.beginPath();x.arc(mx,topY-24,5,0,7);x.fill();
    x.strokeStyle=H.C.terra;x.setLineDash([4,4]);x.beginPath();x.moveTo(mx,topY-20);x.lineTo(mx,BASE.y);x.stroke();x.setLineDash([]);
  }
});
}});"""

# 16 — Labirinto Pintado
GAMES[16] = r"""/* NCODE N · 016 Labirinto Pintado — pinte tudo sem repetir passo */
GREG(16,{
init(root,H){
function snakeOpen(n){return{walls:new Set(),n};}
function snakeRows(n,spurCols){
  const walls=new Set();
  for(let c=0;c<n;c++)if(!spurCols.includes(c))walls.add((n-1)+","+c);
  return{walls,n};
}
const LV=[snakeOpen(4),snakeOpen(5),snakeRows(6,[4,5]),snakeRows(7,[5,6])];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["pt","PINTADO","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas, deslize ou clique em vizinhos: pinte <b>todas</b> as casas sem pisar duas vezes.");
const o=H.cvs(root,440,400),x=o.x;
let N=4,walls=new Set(),px=0,py=0,painted=new Set(),total=1;
function load(){
  N=LV[lv].n;walls=LV[lv].walls;px=0;py=0;
  painted=new Set(["0,0"]);total=N*N-walls.size;
  hud.set("nv",lv+1);upd();draw();
}
function upd(){hud.set("pt",Math.round(painted.size/total*100)+"%");}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const X=ox+c*s,Y=oy+r*s,k=r+","+c;
    x.fillStyle=walls.has(k)?H.C.ink:painted.has(k)?H.C.terra:H.C.card;
    x.fillRect(X+2,Y+2,s-4,s-4);
    x.strokeStyle=H.C.ink;x.lineWidth=1;x.strokeRect(X+2,Y+2,s-4,s-4);
  }
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(ox+px*s+s/2,oy+py*s+s/2,s*0.22,0,7);x.fill();
  x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
}
function move(dx,dy){
  if(over)return;
  const nx=px+dx,ny=py+dy;
  if(nx<0||ny<0||nx>=N||ny>=N||walls.has(ny+","+nx))return;
  if(painted.has(ny+","+nx)){H.sfx("bad");say("Casa <b>repetida</b>! Recomece o nível.");return;}
  px=nx;py=ny;painted.add(ny+","+nx);upd();H.sfx("tick");draw();
  if(painted.size>=total){
    H.sfx("ok");const sc=(lv+1)*120;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Galeria pintada!",sub:"4 labirintos cobertos sem repetir um passo."});}
    lv++;say("Nível "+(lv+1)+": grade maior. Planeje o caminho antes.");load();
  }
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowUp")move(0,-1);if(c==="ArrowDown")move(0,1);
  if(c==="ArrowLeft")move(-1,0);if(c==="ArrowRight")move(1,0);});
H.swipe(o,{up:()=>move(0,-1),down:()=>move(0,1),left:()=>move(-1,0),right:()=>move(1,0)});
H.onTap(o,(tx,ty)=>{
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  const c=Math.floor((tx-ox)/s),r=Math.floor((ty-oy)/s);
  if(Math.abs(r-py)+Math.abs(c-px)===1)move(c-px,r-py);
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)load();},false);
load();
}});"""

# 17 — Elevador Lógico
GAMES[17] = r"""/* NCODE N · 017 Elevador Lógico — programe paradas, entregue todos */
GREG(17,{
init(root,H){
const LV=[{floors:6,pax:6,runs:3},{floors:6,pax:9,runs:3},{floors:7,pax:12,runs:4}];
let lv=0,over=false,busy=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["run","VIAGENS","0/3"],["dlv","ENTREGUES","0/6"]]);
const say=H.msg(root,"Clique em andares para enfileirar <b>paradas</b> (máx. 4). <b>Executar</b> roda o elevador. Capacidade: 4.");
const o=H.cvs(root,520,400),x=o.x;
let F=6,wait=[],stops=[],el=0,aboard=[],runs=0,deliv=0,total=6,moving=null;
function build(){
  const L=LV[lv];F=L.floors;total=L.pax;deliv=0;runs=0;el=0;aboard=[];stops=[];wait=[];
  const r=H.rng(500+lv*77);
  for(let i=0;i<total;i++){
    const f=Math.floor(r()*F);let t=Math.floor(r()*F);
    if(t===f)t=(t+1)%F;
    wait.push({f,t});
  }
  hud.set("nv",lv+1);hud.set("run","0/"+L.runs);hud.set("dlv","0/"+total);
  draw();
}
function floorY(f){return 30+(F-1-f)*((o.H-60)/F);}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const fw=(o.H-60)/F;
  for(let f=0;f<F;f++){
    const y=floorY(f);
    x.fillStyle=stops.includes(f)?H.C.wasabi:H.C.card;
    x.fillRect(120,y,360,fw-4);
    x.strokeStyle=H.C.ink;x.strokeRect(120,y,360,fw-4);
    x.fillStyle=H.C.ink;x.font="bold 13px 'Space Mono',monospace";
    x.fillText((f+1)+"º",60,y+fw/2+5);
    const w=wait.filter(p=>p.f===f);
    x.font="12px 'Space Mono',monospace";
    w.slice(0,6).forEach((p,i)=>{x.fillStyle=H.C.terra;x.fillText("🧍→"+(p.t+1),140+i*52,y+fw/2+5);});
    if(stops.includes(f)){x.fillStyle=H.C.ink;x.fillText("◉ parada "+(stops.indexOf(f)+1),400,y+fw/2+5);}
  }
  const ey=floorY(Math.round(el));
  x.fillStyle=H.C.ink;x.fillRect(20,ey,70,fw-4);
  x.fillStyle=H.C.gold;x.font="12px 'Space Mono',monospace";
  x.fillText("🛗"+aboard.length+"/4",26,ey+fw/2+4);
}
H.onTap(o,(px,py)=>{
  if(over||busy)return;
  const fw=(o.H-60)/F;
  const f=F-1-Math.floor((py-30)/fw);
  if(f<0||f>=F)return;
  if(stops.includes(f))stops=stops.filter(s=>s!==f);
  else{if(stops.length>=4){H.sfx("bad");say("Máximo de <b>4 paradas</b> por viagem!");return;}stops.push(f);}
  H.sfx("tick");draw();
});
function exec(){
  if(over||busy||!stops.length)return;
  busy=true;runs++;hud.set("run",runs+"/"+LV[lv].runs);H.sfx("pop");
  const queue=stops.slice();stops=[];
  function nextStop(){
    if(!queue.length){busy=false;draw();
      if(deliv>=total){
        over=true;const sc=(lv+1)*150+(LV[lv].runs-runs)*60;H.score(sc);
        if(lv>=LV.length-1)return H.done({win:true,score:sc+100,title:"Síndico eficiente!",sub:"Todos entregues no mínimo de viagens."});
        lv++;say("Nível "+(lv+1)+": mais moradores, mais pressa.");H.after(700,build);return;
      }
      if(runs>=LV[lv].runs){over=true;return H.done({win:false,score:deliv*20,title:"Viagens esgotadas",sub:"Faltaram "+(total-deliv)+" entregas. Agrupe destinos vizinhos."});}
      say("Viagem "+runs+" concluída. Programe as próximas paradas.");
      return;
    }
    const target=queue.shift();
    moving=H.every(120,()=>{
      if(el<target)el++;else if(el>target)el--;else{
        clearInterval(moving);
        const out=aboard.filter(p=>p.t===target).length;
        aboard=aboard.filter(p=>p.t!==target);deliv+=out;
        while(aboard.length<4){
          const i=wait.findIndex(p=>p.f===target);
          if(i<0)break;aboard.push(wait.splice(i,1)[0]);
        }
        hud.set("dlv",deliv+"/"+total);H.sfx("ok");draw();
        H.after(350,nextStop);return;
      }
      draw();
    });
  }
  nextStop();
}
H.btn(root,"▶ Executar viagem",exec,true);
build();
}});"""

# 18 — Grid de Luzes
GAMES[18] = r"""/* NCODE N · 018 Grid de Luzes — linha e coluna acendem juntas */
GREG(18,{
init(root,H){
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","TOQUES",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Cada toque inverte <b>linha e coluna inteiras</b>. Acenda todas as luzes.");
const board=H.el("div","g-board",null,root);
let N=5,g=[],cells=[];
function toggle(r,c){
  for(let i=0;i<N;i++){g[r*N+i]=!g[r*N+i];if(i!==r)g[i*N+c]=!g[i*N+c];}
}
function build(){
  N=5+Math.min(2,lv);moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  g=new Array(N*N).fill(true);
  const k=3+lv;
  for(let t=0;t<k;t++)toggle(Math.floor(Math.random()*N),Math.floor(Math.random()*N));
  if(g.every(v=>v))toggle(0,0);
  board.style.gridTemplateColumns="repeat("+N+",1fr)";
  board.style.width="min(100%,"+(N*52)+"px)";
  board.innerHTML="";cells=[];
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    (function(rr,cc){d.addEventListener("click",()=>press(rr,cc));})(r,c);
    cells.push(d);
  }
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    cells[i].textContent=g[i]?"💡":"·";
    cells[i].classList.toggle("good",g[i]);
  }
}
function press(r,c){
  if(over)return;
  toggle(r,c);moves++;hud.set("mv",moves);H.sfx("tick");paint();
  if(g.every(v=>v)){
    H.sfx("ok");const sc=(lv+1)*120+Math.max(0,50-moves*2);H.score(sc);hud.set("sc",sc);
    if(lv>=2){over=true;return H.done({win:true,score:sc+100,title:"Sala iluminada!",sub:"3 painéis acesos com lógica par."});}
    lv++;say("Nível "+(lv+1)+": grade maior, mais interferência.");build();
  }
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});"""

# 19 — Reparo Tetris
GAMES[19] = r"""/* NCODE N · 019 Reparo Tetris — sele as frestas com tetrominós */
GREG(19,{
init(root,H){
const SHAPES={
 O:[[0,0],[0,1],[1,0],[1,1]],
 I:[[0,0],[1,0],[2,0],[3,0]],
 T:[[0,0],[0,1],[0,2],[1,1]],
 L:[[0,0],[1,0],[2,0],[2,1]],
 S:[[0,1],[0,2],[1,0],[1,1]]
};
const LV=[
 {w:7,h:6,holes:[[1,1],[1,2],[2,1],[2,2],[4,4],[4,5],[5,4],[5,5]],pieces:["O","O"]},
 {w:7,h:6,holes:[[0,1],[1,0],[1,1],[1,2],[2,4],[3,4],[4,4],[5,4]],pieces:["T","I"]},
 {w:8,h:6,holes:[[0,0],[1,0],[2,0],[2,1],[0,5],[0,6],[1,4],[1,5],[4,2],[4,3],[5,2],[5,3]],pieces:["L","S","O"]}
];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["fr","FRESTAS",8],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha uma peça, <b>gire</b> se preciso e clique na parede para <b>assentar</b>. Clique na peça assentada para remover.");
const board=H.el("div","g-board",null,root);
let holes=new Set(),placed=[],sel=0,rot=0,pieces=[];
function key(r,c){return r+","+c;}
function rotShape(s,rt){
  let p=SHAPES[s].map(q=>q.slice());
  for(let i=0;i<rt;i++)p=p.map(([r,c])=>[c,-r]);
  const mr=Math.min(...p.map(q=>q[0])),mc=Math.min(...p.map(q=>q[1]));
  return p.map(([r,c])=>[r-mr,c-mc]);
}
function build(){
  const L=LV[lv];
  holes=new Set(L.holes.map(h=>key(h[0],h[1])));
  placed=[];pieces=L.pieces.slice();sel=0;rot=0;
  board.style.gridTemplateColumns="repeat("+L.w+",1fr)";
  board.style.width="min(100%,"+(L.w*44)+"px)";
  trayPaint();render();
  hud.set("nv",lv+1);hud.set("fr",holes.size);
}
function render(){
  const L=LV[lv];
  board.innerHTML="";
  for(let r=0;r<L.h;r++)for(let c=0;c<L.w;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";
    const k=key(r,c);
    const pl=placed.find(p=>p.cells.includes(k));
    if(pl){d.classList.add("good");d.textContent="▓";}
    else if(holes.has(k)){d.classList.add("sel");d.textContent="░";}
    else{d.textContent="";d.disabled=true;}
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
}
function tap(r,c){
  if(over)return;
  const k=key(r,c);
  const pi=placed.findIndex(p=>p.cells.includes(k));
  if(pi>=0){ // remover
    const[p]=placed.splice(pi,1);
    p.cells.forEach(h=>holes.add(h));
    pieces.push(p.s);sel=pieces.length-1;
    H.sfx("tick");render();trayPaint();hud.set("fr",holes.size);return;
  }
  if(!pieces.length||sel<0||sel>=pieces.length)return;
  const s=pieces[sel],shape=rotShape(s,rot);
  const cells=shape.map(([dr,dc])=>key(r+dr,c+dc));
  const L=LV[lv];
  const ok=cells.every(cc=>{
    const[rr2,cc2]=cc.split(",").map(Number);
    return rr2>=0&&rr2<L.h&&cc2>=0&&cc2<L.w&&holes.has(cc);
  });
  if(!ok){H.sfx("bad");say("Não encaixa aqui — a peça deve cobrir <b>exatamente</b> as frestas.");return;}
  cells.forEach(cc=>holes.delete(cc));
  placed.push({s,cells});pieces.splice(sel,1);sel=0;
  H.sfx("ok");render();trayPaint();hud.set("fr",holes.size);
  if(holes.size===0){
    const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Parede selada!",sub:"3 muros reparados sem deixar uma fresta."});}
    lv++;say("Nível "+(lv+1)+": mais peças, mais frestas.");H.after(700,build);
  }
}
let trayBox=null;
function trayPaint(){
  if(trayBox)trayBox.innerHTML="";
  else trayBox=H.el("div","g-row",null,root);
  pieces.forEach((s,i)=>{
    const b=H.el("button","g-chip"+(i===sel?" hot":""),s+" ",trayBox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");trayPaint();});
  });
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⟳ Girar peça",()=>{rot=(rot+1)%4;H.sfx("tick");},false);
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});"""

# 20 — Ímã Empurrão
GAMES[20] = r"""/* NCODE N · 020 Ímã Empurrão — guie a bola de metal com o ímã */
GREG(20,{
init(root,H){
const LV=[
 {walls:[[200,120,24,160]],holes:[[400,300]],goal:[470,80],start:[60,300]},
 {walls:[[150,0,24,220],[330,140,24,220]],holes:[[240,300],[420,200]],goal:[470,320],start:[60,60]},
 {walls:[[0,180,320,24],[200,180,320,24]],holes:[[260,80],[260,280]],goal:[470,60],start:[40,320]}
];
let lv=0,over=false,deaths=0,t0=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["qd","QUEDAS",0],["md","MODO","ATRAIR"]]);
const say=H.msg(root,"Mova o <b>ímã</b> (mouse/toque). Botão ou Espaço alterna <b>atrair/repelir</b>. Leve a bola ● ao ◉ sem cair.");
const o=H.cvs(root,520,360),x=o.x;
const ptr=H.ptr(o);
let bx,by,vx,vy,pol=1;
function load(){
  const L=LV[lv];
  bx=L.start[0];by=L.start[1];vx=0;vy=0;
  hud.set("nv",lv+1);
  if(lv===0)t0=performance.now();
}
function toggle(){pol*=-1;hud.set("md",pol>0?"ATRAIR":"REPELIR");H.sfx("tick");}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")toggle();});
H.btn(root,"🧲 Alternar: atrair / repelir",toggle,false);
function circleRect(cx,cy,r,rc){
  const nx=H.clamp(cx,rc[0],rc[0]+rc[2]),ny=H.clamp(cy,rc[1],rc[1]+rc[3]);
  const dx=cx-nx,dy=cy-ny,d=Math.hypot(dx,dy);
  if(d<r){
    if(d===0)return;
    const push=(r-d);
    bx+=dx/d*push;by+=dy/d*push;
    const vn=(vx*dx+vy*dy)/d;
    if(vn<0){vx-=1.6*vn*dx/d;vy-=1.6*vn*dy/d;}
  }
}
H.loop(dt=>{
  if(over)return;
  const L=LV[lv];
  const dx=ptr.x-bx,dy=ptr.y-by,d=Math.max(30,Math.hypot(dx,dy));
  const F=pol*26000/(d*d)*60;
  vx+=dx/d*F*dt;vy+=dy/d*F*dt;
  vx*=0.985;vy*=0.985;
  vx=H.clamp(vx,-320,320);vy=H.clamp(vy,-320,320);
  bx+=vx*dt;by+=vy*dt;
  bx=H.clamp(bx,12,o.W-12);by=H.clamp(by,12,o.H-12);
  for(const w of L.walls)circleRect(bx,by,10,w);
  for(const h of L.holes){
    if(Math.hypot(bx-h[0],by-h[1])<16){
      deaths++;hud.set("qd",deaths);H.sfx("bad");
      say("🕳️ A bola caiu! De volta ao início.");
      bx=L.start[0];by=L.start[1];vx=0;vy=0;
    }
  }
  if(Math.hypot(bx-L.goal[0],by-L.goal[1])<18){
    H.sfx("ok");
    if(lv>=LV.length-1){
      over=true;
      const secs=Math.round((performance.now()-t0)/1000);
      const sc=Math.max(100,1200-secs*8-deaths*80);H.score(sc);
      return H.done({win:true,score:sc,title:"Metal sob controle!",sub:"3 labirintos em "+secs+"s com "+deaths+" quedas."});
    }
    lv++;say("Nível "+(lv+1)+": mais paredes, mais buracos.");load();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(4,4,o.W-8,o.H-8);
  x.fillStyle=H.C.ink;
  for(const w of L.walls)x.fillRect(w[0],w[1],w[2],w[3]);
  for(const h of L.holes){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(h[0],h[1],15,0,7);x.fill();
    x.fillStyle=H.C.paper;x.font="11px 'Space Mono',monospace";x.fillText("O",h[0]-4,h[1]+4);
  }
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(L.goal[0],L.goal[1],14,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.strokeStyle=pol>0?H.C.ok:H.C.terra;x.setLineDash([4,4]);
  x.beginPath();x.moveTo(bx,by);x.lineTo(ptr.x,ptr.y);x.stroke();x.setLineDash([]);
  x.font="20px serif";x.fillText(pol>0?"🧲":"🧲",ptr.x-10,ptr.y-14);
  const gr=x.createRadialGradient(bx-3,by-3,1,bx,by,11);
  gr.addColorStop(0,"#fff");gr.addColorStop(1,"#8A877C");
  x.fillStyle=gr;x.beginPath();x.arc(bx,by,10,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.stroke();
});
load();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
