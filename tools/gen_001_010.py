#!/usr/bin/env python3
"""Gera games/g001..g010 — PUZZLE (parte 1). Cada jogo: código próprio e completo."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")

GAMES = {}

# 1 — Color Flood
GAMES[1] = r"""/* NCODE N · 001 Color Flood — expanda a região com tinta limitada */
GREG(1,{
init(root,H){
const cols=[H.C.terra,H.C.gold,H.C.ok,"#2E6E8A",H.C.ink];
let lv=1,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["tk","TINTA",18],["sc","PONTOS",0]]);
const say=H.msg(root,"Sua região nasce no <b>canto superior esquerdo</b>. Escolha cores para engolir o grid.");
const board=H.el("div","g-board",null,root);
let N=7,moves=18,grid=[],cells=[];
function build(){
  N=6+Math.min(4,lv);moves=Math.max(10,Math.round(N*2.7)-lv);
  const r=H.rng((Date.now?Date.now():7)%2147483647+lv*7919);
  grid=[];for(let i=0;i<N*N;i++)grid.push(Math.floor(r()*5));
  board.style.gridTemplateColumns="repeat("+N+",1fr)";
  board.style.width="min(100%,"+(N*42)+"px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){const d=H.el("button","g-cell",null,board);d.style.aspectRatio="1";d.style.cursor="default";cells.push(d);}
  paint();hud.set("nv",lv);hud.set("tk",moves);
}
function paint(){for(let i=0;i<N*N;i++)cells[i].style.background=cols[grid[i]];}
function flood(nc){
  if(over||moves<=0)return;
  const oc=grid[0];if(oc===nc)return;
  moves--;hud.set("tk",moves);H.sfx("tick");
  const seen=new Set([0]),q=[0];
  while(q.length){const i=q.pop();grid[i]=nc;const r=(i/N)|0,c=i%N;
    if(r>0){const j=i-N;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}
    if(r<N-1){const j=i+N;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}
    if(c>0){const j=i-1;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}
    if(c<N-1){const j=i+1;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}}
  paint();
  if(grid.every(v=>v===grid[0])){
    const sc=lv*100+moves*10;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(lv>=5){over=true;return H.done({win:true,score:sc,title:"Grade dominada!",sub:"Você unificou as 5 regiões. Mestre da tinta."});}
    lv++;say("Nível "+lv+": grade "+(6+Math.min(4,lv))+"×"+(6+Math.min(4,lv))+" e menos tinta. Planeje a sequência.");build();return;
  }
  if(moves<=0){over=true;H.done({win:false,score:lv*50,title:"Tinta esgotada",sub:"Faltou tinta no nível "+lv+". Tente engolir duas cores por jogada."});}
}
const pal=H.el("div","g-row",null,root);
cols.forEach((c,i)=>{const b=H.el("button","g-cell",null,pal);b.style.width="44px";b.style.height="40px";b.style.background=c;b.setAttribute("aria-label","Cor "+(i+1));b.addEventListener("click",()=>flood(i));});
H.btn(root,"↻ Reembaralhar nível",()=>build(),false);
build();
}});"""

# 2 — Espelho Laser
GAMES[2] = r"""/* NCODE N · 002 Espelho Laser — desvie o feixe até os alvos */
GREG(2,{
init(root,H){
const LV=[
 {n:5,src:{r:0,c:-1,d:"R"},tgt:[[2,2]],k:2},
 {n:6,src:{r:4,c:-1,d:"R"},tgt:[[0,4]],k:2},
 {n:6,src:{r:2,c:-1,d:"R"},tgt:[[2,4],[0,5]],k:3},
 {n:6,src:{r:5,c:-1,d:"R"},tgt:[[5,3],[1,4],[0,1]],k:4}
];
const DIRS={R:[0,1],L:[0,-1],U:[-1,0],D:[1,0]};
const SLASH={R:"U",U:"R",L:"D",D:"L"},BACK={R:"D",D:"R",L:"U",U:"L"};
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["mr","ESPELHOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas casas para ciclar <b>vazio → / → \\</b>. Depois pressione <b>Disparar</b>.");
const board=H.el("div","g-board",null,root);
let cells=[],mir=[],used=0,n=5;
function key(r,c){return r+","+c;}
function build(){
  lock=false;
  const L=LV[lv];n=L.n;mir={};used=0;
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*52)+"px)";
  board.innerHTML="";cells=[];
  const tset=new Set(L.tgt.map(t=>key(t[0],t[1])));
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    if(r===L.src.r&&c===0)d.textContent="▶";
    if(tset.has(key(r,c)))d.textContent="◎";
    (function(rr,cc,dd){dd.addEventListener("click",()=>{
      if(over||lock)return;
      const k=key(rr,cc);
      if(tset.has(k))return;
      const cur=mir[k]||"";
      const nx=cur===""?"/":cur==="/"? "\\":"";
      if(nx!==""&&used>=L.k&&cur===""){H.sfx("bad");say("Sem espelhos! Limite de <b>"+L.k+"</b> neste nível.");return;}
      if(cur===""){used++;} if(nx===""){used--;}
      if(nx==="")delete mir[k];else mir[k]=nx;
      paint();hud.set("mr",used+"/"+L.k);H.sfx("tick");
    });})(r,c,d);
    cells.push(d);
  }
  hud.set("nv",lv+1);hud.set("mr","0/"+L.k);paint();
}
function trace(){
  const L=LV[lv];let r=L.src.r,c=L.src.c,d=L.src.d;
  const path=[],seen=new Set();let guard=0;
  while(guard++<200){
    const v=DIRS[d];r+=v[0];c+=v[1];
    if(r<0||r>=n||c<0||c>=n)break;
    const sk=key(r,c)+d;if(seen.has(sk))break;seen.add(sk);
    path.push([r,c]);
    const m=mir[key(r,c)];
    if(m==="/")d=SLASH[d];else if(m==="\\")d=BACK[d];
  }
  return path;
}
function paint(beam){
  const L=LV[lv];const tset=new Set(L.tgt.map(t=>key(t[0],t[1])));
  const bset=new Set((beam||[]).map(p=>key(p[0],p[1])));
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=cells[r*n+c],k=key(r,c);
    let t=mir[k]||"";
    if(r===L.src.r&&c===0)t="▶";
    if(tset.has(k))t="◎";
    d.textContent=t;
    d.classList.toggle("good",bset.has(k));
    d.classList.toggle("sel",!!mir[k]&&!bset.has(k));
  }
}
function fire(){
  if(over||lock)return;
  const L=LV[lv];const path=trace();paint(path);H.sfx("pop");
  const pset=new Set(path.map(p=>key(p[0],p[1])));
  const hit=L.tgt.filter(t=>pset.has(key(t[0],t[1]))).length;
  if(hit===L.tgt.length){
    lock=true;
    const sc=(lv+1)*150-used*10;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+200,title:"Alvos vaporizados!",sub:"Feixe perfeito nos 4 laboratórios."});}
    lv++;say("Nível "+(lv+1)+": mais alvos, mais espelhos. Reflita antes de agir.");H.after(700,build);
  }else say("Acertou <b>"+hit+"/"+L.tgt.length+"</b> alvos. Ajuste os espelhos e dispare de novo.");
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⚡ Disparar laser",fire,true);
H.btn(row,"Limpar espelhos",()=>{if(!over){mir={};used=0;paint();hud.set("mr","0/"+LV[lv].k);}},false);
build();
}});"""

# 3 — Encanador
GAMES[3] = r"""/* NCODE N · 003 Encanador — conecte fonte ao ralo antes da cheia */
GREG(3,{
init(root,H){
const PATHS=[
 [[0,0],[0,1],[0,2],[1,2],[2,2]],
 [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[5,1],[5,2],[5,3]],
 [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4],[3,4],[2,4],[2,5],[3,5],[4,5],[5,5]]
];
const SIZES=[3,6,6];
let lv=0,over=false,flowing=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas peças para <b>girar</b>. Quando o caminho estiver pronto, abra a água.");
const board=H.el("div","g-board",null,root);
const GLYPH={src:"🚰",drn:"🕳️",str0:"═",str1:"║",elb0:"╔",elb1:"╗",elb2:"╝",elb3:"╚"};
let n=3,cells=[],tiles=[];
function openings(t){
  if(t.k==="src"||t.k==="drn")return t.fix;
  let o=t.k==="str"?[0,2]:[0,1];
  return o.map(x=>(x+t.rot)%4);
}
function glyph(t){
  if(t.k==="src")return GLYPH.src;if(t.k==="drn")return GLYPH.drn;
  if(t.k==="str")return t.rot%2===0?GLYPH.str0:GLYPH.str1;
  return [GLYPH.elb0,GLYPH.elb1,GLYPH.elb2,GLYPH.elb3][t.rot%4];
}
function dirBetween(a,b){if(b[0]===a[0]-1)return 3;if(b[0]===a[0]+1)return 1;if(b[1]===a[1]-1)return 2;return 0;}
function build(){
  flowing=false;const P=PATHS[lv];n=SIZES[lv];
  const pset=new Set(P.map(p=>p[0]+","+p[1]));
  tiles=[];
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const idx=P.findIndex(p=>p[0]===r&&p[1]===c);
    let t;
    if(idx===0)t={k:"src",fix:[dirBetween(P[0],P[1])],rot:0,fixed:true};
    else if(idx===P.length-1)t={k:"drn",fix:[dirBetween(P[idx],P[idx-1])],rot:0,fixed:true};
    else if(idx>0){
      const a=dirBetween(P[idx],P[idx-1]),b=dirBetween(P[idx],P[idx+1]);
      const opp=(a+2)%4===b;
      t={k:opp?"str":"elb",rot:Math.floor(Math.random()*4)};
      if(opp)t.rot=Math.random()<.5?0:1;
    }else t={k:Math.random()<.5?"str":"elb",rot:Math.floor(Math.random()*4),decoy:true};
    tiles.push(t);
  }
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*54)+"px)";
  board.innerHTML="";cells=[];
  tiles.forEach((t,i)=>{
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="22px";
    if(!t.fixed)d.addEventListener("click",()=>{if(over||flowing)return;t.rot=(t.rot+1)%4;paint();H.sfx("tick");});
    cells.push(d);
  });
  paint();hud.set("nv",lv+1);
}
function paint(flow){
  const fset=new Set((flow||[]).map(i=>i));
  tiles.forEach((t,i)=>{
    cells[i].textContent=glyph(t);
    cells[i].classList.toggle("good",fset.has(i));
    cells[i].classList.toggle("sel",!!t.fixed);
  });
}
const DV=[[0,1],[1,0],[0,-1],[-1,0]];
function flowPath(){
  const P=PATHS[lv];let cur=0,path=[0],seen=new Set([0]);
  let guard=0;
  while(guard++<200){
    const cell=P[cur];const t=tiles[cell[0]*n+cell[1]];
    const outs=openings(t);
    let moved=false;
    for(const d of outs){
      const nr=cell[0]+DV[d][0],nc=cell[1]+DV[d][1];
      if(nr<0||nr>=n||nc<0||nc>=n)continue;
      const ni=nr*n+nc;if(seen.has(ni))continue;
      const nt=tiles[ni];if(!nt||nt.decoy&&false)continue;
      if(openings(nt).includes((d+2)%4)){seen.add(ni);path.push(ni);
        const pi=P.findIndex(p=>p[0]===nr&&p[1]===nc);
        if(ni===(P[P.length-1][0]*n+P[P.length-1][1]))return{path,win:true};
        if(pi<0)return{path,win:false};
        cur=pi;moved=true;break;}
    }
    if(!moved)return{path,win:false};
  }
  return{path,win:false};
}
function openWater(){
  if(over||flowing)return;flowing=true;
  const res=flowPath();let i=0;
  const T=H.every(160,()=>{
    i++;paint(res.path.slice(0,i+1));H.beep(300+i*40,.06,"sine",.03);
    if(i>=res.path.length){
      clearInterval(T);
      if(res.win){
        H.sfx("ok");const sc=(lv+1)*120;H.score(sc);hud.set("sc",sc);
        if(lv>=PATHS.length-1){over=true;return H.done({win:true,score:sc+150,title:"Encanamento perfeito!",sub:"Água fluindo da fonte ao ralo nos 3 setores."});}
        lv++;say("Nível "+(lv+1)+": uma rede maior e mais peças falsas.");H.after(700,build);
      }else{say("💦 A água <b>vazou</b> no caminho! Gire as peças e tente de novo.");H.sfx("bad");flowing=false;}
    }
  });
}
const row=H.el("div","g-row",null,root);
H.btn(row,"💧 Abrir água",openWater,true);
H.btn(row,"↻ Embaralhar",()=>{if(!flowing)build();},false);
build();
}});"""

# 4 — Sombra Certa
GAMES[4] = r"""/* NCODE N · 004 Sombra Certa — gire a peça até a sombra bater */
GREG(4,{
init(root,H){
const SHAPES=[
 [[0,-46],[40,26],[-40,26]],
 [[-34,-20],[34,-20],[46,26],[0,10],[-46,26]],
 [[-40,-30],[-12,-30],[-12,-8],[40,-8],[40,26],[-40,26]],
 [[0,-48],[30,-14],[48,30],[0,18],[-48,30],[-30,-14]]
];
const ANG=[35,-50,120,-140,75];
let lv=0,cur=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["dg","ÂNGULO","0°"],["sc","PONTOS",0]]);
const say=H.msg(root,"Gire a peça com <b>◀ ▶</b> (ou setas) até a sombra coincidir com o molde tracejado.");
const o=H.cvs(root,520,340),x=o.x;
function poly(cx,cy,pts,ang,fill,stroke,dash){
  x.save();x.translate(cx,cy);x.rotate(ang*Math.PI/180);
  if(dash)x.setLineDash([7,6]);
  x.beginPath();x.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);
  x.closePath();
  if(fill){x.fillStyle=fill;x.fill();}
  if(stroke){x.strokeStyle=stroke;x.lineWidth=2.5;x.stroke();}
  x.setLineDash([]);x.restore();
}
function norm(a){a%=360;if(a>180)a-=360;if(a<-180)a+=360;return a;}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.lineWidth=1;
  x.beginPath();x.moveTo(o.W/2,20);x.lineTo(o.W/2,o.H-20);x.stroke();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("// MOLDE-ALVO",24,30);x.fillText("// SUA PEÇA",o.W/2+24,30);
  x.fillStyle=H.C.terra;x.font="bold 12px 'Space Mono',monospace";
  x.fillText("☀ LUZ",o.W/2-58,44);
  const pts=SHAPES[lv%SHAPES.length],A=ANG[lv%ANG.length];
  poly(130,200,pts,A,"rgba(217,78,52,.14)",H.C.terra,true);
  poly(390,140,pts,cur,H.C.ink,H.C.ink,false);
  x.save();x.globalAlpha=.28;
  poly(390,256,pts,cur,H.C.ink,null,false);
  x.restore();
  x.strokeStyle=H.C.ink3;x.beginPath();x.moveTo(60,300);x.lineTo(460,300);x.stroke();
  const d=Math.abs(norm(cur-A));
  x.fillStyle=d<7?H.C.ok:H.C.ink2;x.font="bold 15px 'Space Mono',monospace";
  x.fillText("Δ "+d.toFixed(1)+"°",o.W/2-24,o.H-14);
}
function rot(d){if(over)return;cur=norm(cur+d);hud.set("dg",Math.round(cur)+"°");H.sfx("tick");draw();}
const kb=H.keys();
kb.on(c=>{if(c==="ArrowLeft")rot(-6);if(c==="ArrowRight")rot(6);if(c==="Enter"||c==="Space")check();});
const row=H.el("div","g-row",null,root);
H.btn(row,"◀ Girar",()=>rot(-6),false);
H.btn(row,"Girar ▶",()=>rot(6),false);
H.btn(row,"✓ Conferir sombra",check,true);
function check(){
  if(over)return;
  const A=ANG[lv%ANG.length];
  if(Math.abs(norm(cur-A))<7){
    H.sfx("ok");const sc=(lv+1)*100;H.score(sc);hud.set("sc",sc);
    if(lv>=4){over=true;return H.done({win:true,score:sc+100,title:"Sombras alinhadas!",sub:"5 peças calibradas com precisão de relojoeiro."});}
    lv++;cur=0;hud.set("nv",lv+1);hud.set("dg","0°");
    say("Nível "+(lv+1)+": novo molde, novo ângulo.");
  }else{H.sfx("bad");say("Ainda fora — ajuste em passos de 6° até o Δ zerar.");}
  draw();
}
draw();
}});"""

# 5 — Corrente Numérica
GAMES[5] = r"""/* NCODE N · 005 Corrente Numérica — ligue 1..N sem cruzar */
GREG(5,{
init(root,H){
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["nx","PRÓXIMO",2],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste da casa <b>1</b> passando por <b>2, 3…</b> em ordem. Sem cruzar, sem revisitar.");
const o=H.cvs(root,480,440),x=o.x;
const ptr=H.ptr(o);
let N=5,K=4,nums={},path=[],expected=2,block=new Set(),drag=false;
function build(){
  N=5+Math.min(2,lv);K=4+lv;nums={};path=[];expected=2;block=new Set();
  const r=H.rng(1000+lv*333);
  const cells=[];for(let i=0;i<N*N;i++)cells.push(i);
  const sh=H.shuffle(r,cells);
  for(let k=1;k<=K;k++)nums[sh[k-1]]=k;
  const nb=Math.floor(N*N*0.08);
  for(let i=0;i<nb;i++){const c=sh[K+i];if(nums[c]==null)block.add(c);}
  const start=Object.keys(nums).find(k=>nums[k]===1);
  path=[+start];hud.set("nv",lv+1);hud.set("nx",2);
}
const cell=()=>Math.floor(Math.min(o.W,o.H)/N);
function rc(i){return[(i/N)|0,i%N];}
function adj(a,b){const[ra,ca]=rc(a),[rb,cb]=rc(b);return Math.abs(ra-rb)+Math.abs(ca-cb)===1;}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const s=cell(),ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  const inPath=new Set(path);
  for(let i=0;i<N*N;i++){
    const[r,c]=rc(i),px=ox+c*s,py=oy+r*s;
    x.fillStyle=block.has(i)?H.C.ink:inPath.has(i)?H.C.wasabi:H.C.card;
    x.fillRect(px+2,py+2,s-4,s-4);
    x.strokeStyle=H.C.ink;x.lineWidth=1;x.strokeRect(px+2,py+2,s-4,s-4);
    if(nums[i]){
      x.fillStyle=nums[i]<expected?H.C.ok:H.C.terra;
      x.font="bold "+Math.floor(s*0.42)+"px 'Space Mono',monospace";
      x.textAlign="center";x.textBaseline="middle";
      x.fillText(nums[i],px+s/2,py+s/2+1);
    }
  }
  if(path.length>1){
    x.strokeStyle=H.C.ink;x.lineWidth=4;x.beginPath();
    path.forEach((i,k)=>{const[r,c]=rc(i);const px=ox+c*s+s/2,py=oy+r*s+s/2;k?x.lineTo(px,py):x.moveTo(px,py);});
    x.stroke();
  }
  x.textAlign="left";x.textBaseline="alphabetic";
}
function cellAt(px,py){
  const s=cell(),ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  const c=Math.floor((px-ox)/s),r=Math.floor((py-oy)/s);
  if(r<0||r>=N||c<0||c>=N)return -1;return r*N+c;
}
H.onTap(o,(px,py)=>{drag=true;step(cellAt(px,py));});
H.loop(()=>{
  if(over||!drag||!ptr.down&&drag){if(!ptr.down)drag=false;}
  if(drag&&ptr.down)step(cellAt(ptr.x,ptr.y));
  draw();
});
function step(i){
  if(over||i<0||block.has(i))return;
  const head=path[path.length-1];
  if(i===head)return;
  if(path.length>1&&i===path[path.length-2]){ // voltar
    const rm=path.pop();
    if(nums[rm]&&nums[rm]===expected-1){expected--;hud.set("nx",expected);}
    H.sfx("tick");return;
  }
  if(path.includes(i)||!adj(head,i))return;
  if(nums[i]&&nums[i]!==expected){H.sfx("bad");say("Ordem! O próximo é o <b>"+expected+"</b>.");return;}
  path.push(i);
  if(nums[i]===expected){
    expected++;hud.set("nx",expected>K?"✓":expected);H.sfx("ok");
    if(expected>K){
      const sc=(lv+1)*120;H.score(sc);hud.set("sc",sc);
      if(lv>=3){over=true;return H.done({win:true,score:sc+120,title:"Corrente completa!",sub:"Sequências ligadas sem um único cruzamento."});}
      lv++;say("Nível "+(lv+1)+": mais números, grade maior.");build();
    }
  }else H.beep(520,.04,"square",.02);
}
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});"""

# 6 — Flip Total
GAMES[6] = r"""/* NCODE N · 006 Flip Total — vire tudo para a mesma cor */
GREG(6,{
init(root,H){
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","JOGADAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Cada clique vira a peça <b>e as vizinhas</b>. Apague todas as luzes.");
const board=H.el("div","g-board",null,root);
let N=5,grid=[],cells=[];
function toggle(i){
  const r=(i/N)|0,c=i%N;
  grid[i]=!grid[i];
  if(r>0)grid[i-N]=!grid[i-N];if(r<N-1)grid[i+N]=!grid[i+N];
  if(c>0)grid[i-1]=!grid[i-1];if(c<N-1)grid[i+1]=!grid[i+1];
}
function build(){
  N=5;moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  grid=new Array(N*N).fill(false);
  const times=6+lv*2;
  for(let k=0;k<times;k++)toggle(Math.floor(Math.random()*N*N));
  if(grid.every(v=>!v))toggle(12);
  board.style.gridTemplateColumns="repeat(5,1fr)";
  board.style.width="min(100%,320px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    (function(idx,dd){dd.addEventListener("click",()=>press(idx));})(i,d);
    cells.push(d);
  }
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    cells[i].textContent=grid[i]?"💡":"·";
    cells[i].classList.toggle("good",grid[i]);
  }
}
function press(i){
  if(over)return;
  toggle(i);moves++;hud.set("mv",moves);H.sfx("tick");paint();
  if(grid.every(v=>!v)){
    H.sfx("ok");const sc=(lv+1)*100+Math.max(0,60-moves*2);H.score(sc);hud.set("sc",sc);
    if(lv>=3){over=true;return H.done({win:true,score:sc+100,title:"Tudo apagado!",sub:"4 painéis resolvidos com lógica fria."});}
    lv++;say("Nível "+(lv+1)+": embaralhamento mais profundo.");build();
  }
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});"""

# 7 — Trem de Engrenagens
GAMES[7] = r"""/* NCODE N · 007 Trem de Engrenagens — leve o giro até a roda final */
GREG(7,{
init(root,H){
const LV=[
 {n:5,drv:[2,0],fin:[2,4],obs:[],k:4},
 {n:6,drv:[0,0],fin:[5,5],obs:[[2,2],[2,3],[3,2]],k:9},
 {n:6,drv:[5,0],fin:[0,5],obs:[[4,1],[3,2],[2,3],[1,4]],k:9}
];
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["gr","ENGRENAGENS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique para <b>colocar/retirar</b> engrenagens e conecte ⚙️ à 🎯. Depois pressione <b>Girar</b>.");
const board=H.el("div","g-board",null,root);
let cells=[],gears=new Set();
function key(r,c){return r+","+c;}
function build(){
  lock=false;
  gears=new Set();const L=LV[lv];
  board.style.gridTemplateColumns="repeat("+L.n+",1fr)";
  board.style.width="min(100%,"+(L.n*56)+"px)";
  board.innerHTML="";cells=[];
  const ok=(r,c)=>!(r===L.drv[0]&&c===L.drv[1]||r===L.fin[0]&&c===L.fin[1]||L.obs.some(o=>o[0]===r&&o[1]===c));
  for(let r=0;r<L.n;r++)for(let c=0;c<L.n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="22px";
    if(r===L.drv[0]&&c===L.drv[1]){d.textContent="⚙️";d.classList.add("sel");}
    else if(r===L.fin[0]&&c===L.fin[1]){d.textContent="🎯";}
    else if(L.obs.some(o=>o[0]===r&&o[1]===c)){d.textContent="🧱";d.disabled=true;}
    else{(function(rr,cc,dd){dd.addEventListener("click",()=>{
      if(over||lock)return;const k=key(rr,cc);
      if(gears.has(k)){gears.delete(k);dd.textContent="";}
      else{if(gears.size>=L.k){H.sfx("bad");say("Limite de <b>"+L.k+"</b> engrenagens!");return;}gears.add(k);dd.textContent="⚙️";}
      hud.set("gr",gears.size+"/"+L.k);H.sfx("tick");
    });})(r,c,d);}
    cells.push(d);
  }
  hud.set("nv",lv+1);hud.set("gr","0/"+L.k);
}
function spin(){
  if(over||lock)return;
  const L=LV[lv],n=L.n;
  const has=(r,c)=>gears.has(key(r,c))||(r===L.drv[0]&&c===L.drv[1])||(r===L.fin[0]&&c===L.fin[1]);
  const dist={};dist[key(L.drv[0],L.drv[1])]=0;
  const q=[[L.drv[0],L.drv[1]]];
  while(q.length){
    const[r,c]=q.shift();
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1],k=key(nr,nc);
      if(nr<0||nr>=n||nc<0||nc>=n||dist[k]!=null||!has(nr,nc))return;
      dist[k]=dist[key(r,c)]+1;q.push([nr,nc]);
    });
  }
  const fk=key(L.fin[0],L.fin[1]);
  if(dist[fk]!=null){
    lock=true;
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){
      const k=key(r,c);
      if(dist[k]!=null&&gears.has(k))cells[r*n+c].textContent=dist[k]%2?"↻":"↺";
    }
    H.sfx("ok");const sc=(lv+1)*140-gears.size*5;H.score(Math.max(50,sc));hud.set("sc",Math.max(50,sc));
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:Math.max(50,sc)+150,title:"Transmissão perfeita!",sub:"O giro chegou à roda final nos 3 mecanismos."});}
    lv++;say("Nível "+(lv+1)+": obstáculos no caminho do giro.");H.after(900,build);
  }else{H.sfx("bad");say("O giro <b>não chegou</b> à roda final. Complete a cadeia de vizinhas.");}
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⚙️ Girar mecanismo",spin,true);
build();
}});"""

# 8 — Gelo Deslizante
GAMES[8] = r"""/* NCODE N · 008 Gelo Deslizante — deslize até a saída */
GREG(8,{
init(root,H){
const MAPS=[
 ["#####","#S..#","#.###","#..E#","#####"],
 ["#####","#S#E#","#.#.#","#...#","#####"],
 ["######","#S..##","#.##.#","#.#.##","#...E#","######"],
 ["#######","#S...##","#.##..#","#.##..#","#..O.E#","#######"]
];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","DESLIZES",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas, deslize ou clique numa casa: você <b>só para</b> ao bater. ⭕ é buraco — desvie.");
const o=H.cvs(root,460,400),x=o.x;
let grid=[],W=0,Hh=0,px=0,py=0,anim=null;
function load(){
  grid=MAPS[lv].map(r=>r.split(""));Hh=grid.length;W=grid[0].length;moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  for(let r=0;r<Hh;r++)for(let c=0;c<W;c++)if(grid[r][c]==="S"){py=r;px=c;grid[r][c]=".";}
  draw();
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const s=Math.floor(Math.min(o.W/W,o.H/Hh));
  const ox=(o.W-s*W)/2,oy=(o.H-s*Hh)/2;
  for(let r=0;r<Hh;r++)for(let c=0;c<W;c++){
    const v=grid[r][c],X=ox+c*s,Y=oy+r*s;
    x.fillStyle=v==="#"?H.C.ink:v==="O"?H.C.ink:H.C.card;
    x.fillRect(X+1,Y+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(X+1,Y+1,s-2,s-2);
    x.font=Math.floor(s*0.5)+"px serif";x.textAlign="center";x.textBaseline="middle";
    if(v==="E"){x.fillStyle=H.C.ok;x.fillText("🏁",X+s/2,Y+s/2);}
    if(v==="O"){x.fillStyle=H.C.paper;x.fillText("⭕",X+s/2,Y+s/2);}
  }
  const bx=ox+px*s+s/2,by=oy+py*s+s/2;
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,s*0.3,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.textAlign="left";x.textBaseline="alphabetic";
}
function slide(dx,dy){
  if(over||anim)return;
  let nx=px,ny=py,fell=false,win=false;
  while(true){
    const tx=nx+dx,ty=ny+dy;
    if(grid[ty][tx]==="#")break;
    nx=tx;ny=ty;
    if(grid[ty][tx]==="O"){fell=true;break;}
    if(grid[ty][tx]==="E"){win=true;break;}
  }
  if(nx===px&&ny===py)return;
  moves++;hud.set("mv",moves);H.sfx("tick");
  anim={fx:px,fy:py,tx:nx,ty:ny,t:0,fell,win};
}
H.loop(dt=>{
  if(anim){
    anim.t+=dt*5;
    const fx=anim.fx+(anim.tx-anim.fx)*Math.min(1,anim.t);
    const fy=anim.fy+(anim.ty-anim.fy)*Math.min(1,anim.t);
    px=Math.round(fx);py=Math.round(fy);draw();
    if(anim.t>=1){
      px=anim.tx;py=anim.ty;
      if(anim.fell){H.sfx("bad");say("🕳️ Caiu no buraco! De volta ao início.");load();}
      else if(anim.win){
        H.sfx("ok");const sc=(lv+1)*120+Math.max(0,60-moves*3);H.score(sc);hud.set("sc",sc);
        if(lv>=MAPS.length-1){over=true;anim=null;return H.done({win:true,score:sc+100,title:"Pista gelada vencida!",sub:"4 labirintos derrapados até a saída."});}
        lv++;say("Nível "+(lv+1)+": gelo mais traiçoeiro.");load();
      }
      anim=null;draw();
    }
  }
});
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowUp")slide(0,-1);if(c==="ArrowDown")slide(0,1);
  if(c==="ArrowLeft")slide(-1,0);if(c==="ArrowRight")slide(1,0);});
H.swipe(o,{up:()=>slide(0,-1),down:()=>slide(0,1),left:()=>slide(-1,0),right:()=>slide(1,0)});
H.onTap(o,(tx,ty)=>{
  const s=Math.floor(Math.min(o.W/W,o.H/Hh));
  const ox=(o.W-s*W)/2,oy=(o.H-s*Hh)/2;
  const c=Math.floor((tx-ox)/s),r=Math.floor((ty-oy)/s);
  if(r===py&&c!==px)slide(c>px?1:-1,0);else if(c===px&&r!==py)slide(0,r>py?1:-1);
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over){anim=null;load();}},false);
load();draw();
}});"""

# 9 — Gravidade Invertida
GAMES[9] = r"""/* NCODE N · 009 Gravidade Invertida — inverta e chegue ao gol */
GREG(9,{
init(root,H){
let over=false,dead=false;
const hud=H.hud(root,[["dst","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Espaço / toque</b> inverte a gravidade. Passe pelas fendas e alcance a 🏁 em 2400m.");
const o=H.cvs(root,520,360),x=o.x;
const GOAL=2400;
let bx,by,vy,g,scroll,obs,speed;
function reset(){
  bx=90;by=o.H/2;vy=0;g=1;scroll=0;speed=150;dead=false;
  const r=H.rng(4242);
  obs=[];
  for(let d=420;d<GOAL;d+=260+Math.floor(r()*80)){
    const gap=110,gy=60+r()*(o.H-120-gap);
    obs.push({d,gap,gy,top:gy,bot:gy+gap});
  }
}
reset();
function flip(){if(over||dead)return;g*=-1;vy*=.4;H.beep(g>0?300:520,.07,"square",.04);}
const kb=H.keys();kb.on((c,d)=>{if(d&&(c==="Space"||c==="ArrowUp"))flip();});
H.onTap(o,flip);
H.loop(dt=>{
  if(over)return;
  if(!dead){
    vy+=g*1400*dt;vy=H.clamp(vy,-420,420);by+=vy*dt;scroll+=speed*dt;
    if(by<14||by>o.H-14){dead=true;H.sfx("bad");say("💥 Bateu na borda! Pressione <b>reiniciar</b> ou toque para tentar de novo.");H.after(900,()=>{if(!over){reset();say("De novo! Inverta antes das bordas.");}});}
    for(const ob of obs){
      const sx=ob.d-scroll;
      if(sx>bx-60&&sx<bx+20){
        if(by<ob.top+8||by>ob.bot-8){dead=true;H.sfx("bad");H.after(900,()=>{if(!over){reset();say("Colisão! Mire o centro das fendas.");}});break;}
      }
    }
    if(scroll>=GOAL){
      over=true;const sc=500;H.score(sc);hud.set("sc",sc);
      return H.done({win:true,score:sc,title:"Gol gravitacional!",sub:"Você atravessou o túnel invertendo a física."});
    }
    hud.set("dst",Math.floor(scroll)+"m");
  }
  // desenho
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(0,8);x.lineTo(o.W,8);x.moveTo(0,o.H-8);x.lineTo(o.W,o.H-8);x.stroke();
  for(const ob of obs){
    const sx=ob.d-scroll;
    if(sx<-40||sx>o.W+40)continue;
    x.fillStyle=H.C.ink;x.fillRect(sx,10,26,ob.top-10);x.fillRect(sx,ob.bot,26,o.H-10-ob.bot);
    x.fillStyle=H.C.wasabi;x.fillRect(sx,ob.top-4,26,4);x.fillRect(sx,ob.bot,26,4);
  }
  const gx=GOAL-scroll;
  if(gx>-20&&gx<o.W+60){x.font="30px serif";x.fillText("🏁",gx,o.H/2);}
  x.save();x.translate(bx,by);if(g<0)x.scale(1,-1);
  x.fillStyle=H.C.terra;x.beginPath();x.arc(0,0,13,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.paper;x.beginPath();x.arc(0,g>0?-4:4,4,0,7);x.fill();x.restore();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(g>0?"GRAV ▼":"GRAV ▲",12,28);
});
H.btn(root,"↻ Reiniciar",()=>{if(!over){reset();say("Recomeçou. Ritmo constante vence.");}},false);
}});"""

# 10 — Corda Cortada
GAMES[10] = r"""/* NCODE N · 010 Corda Cortada — corte no instante certo */
GREG(10,{
init(root,H){
const LV=[
 {piv:[150,70],L:170,ang:1.1,box:[330,300,80,34]},
 {piv:[360,60],L:200,ang:-1.2,box:[110,300,70,34]},
 {piv:[260,50],L:230,ang:1.25,box:[400,300,60,34]}
];
let lv=0,att=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["tt","TENTATIVA","1/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"A bola balança na corda. Pressione <b>CORTAR</b> (ou Espaço/toque) para soltá-la na cesta.");
const o=H.cvs(root,520,360),x=o.x;
let th,om,mode,bx,by,vx,vy;
function attempt(){
  const L=LV[lv];th=L.ang;om=0;mode="swing";hud.set("tt",(att+1)+"/3");hud.set("nv",lv+1);
}
function cut(){
  if(over||mode!=="swing")return;
  const L=LV[lv];
  bx=L.piv[0]+Math.sin(th)*L.L;by=L.piv[1]+Math.cos(th)*L.L;
  const w=om*L.L;vx=Math.cos(th)*w;vy=-Math.sin(th)*w;
  mode="fly";H.sfx("pop");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&(c==="Space"||c==="Enter"))cut();});
H.onTap(o,cut);
H.loop(dt=>{
  if(over)return;
  const L=LV[lv];
  if(mode==="swing"){
    const al=-(9.8/L.L)*Math.sin(th)*60;
    om+=al*dt;th+=om*dt;
  }else if(mode==="fly"){
    vy+=900*dt;bx+=vx*dt;by+=vy*dt;
    const[qx,qy,qw,qh]=L.box;
    if(bx>qx&&bx<qx+qw&&by>qy&&by<qy+qh){
      mode="done";H.sfx("ok");
      const sc=(lv+1)*150+(2-att)*50;H.score(sc);hud.set("sc",sc);
      if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Corte cirúrgico!",sub:"3 cestas acertadas com 3 cortes precisos."});}
      lv++;att=0;say("Nível "+(lv+1)+": pêndulo novo, cesta nova.");H.after(800,attempt);
    }else if(by>o.H+20||bx<-20||bx>o.W+20){
      mode="done";att++;H.sfx("bad");
      if(att>=3){over=true;return H.done({win:false,score:lv*120,title:"Corda desperdiçada",sub:"3 tentativas sem cesta no nível "+(lv+1)+". Observe o balanço."});}
      say("Errou! Tentativa "+(att+1)+" de 3.");H.after(600,attempt);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.beginPath();x.moveTo(0,334);x.lineTo(o.W,334);x.stroke();
  const[qx,qy,qw,qh]=L.box;
  x.fillStyle=H.C.wasabi;x.fillRect(qx,qy,qw,qh);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(qx,qy,qw,qh);
  x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";x.fillText("CESTA",qx+8,qy+qh-10);
  x.fillStyle=H.C.ink;x.fillRect(L.piv[0]-5,20,10,L.piv[1]-20);
  x.beginPath();x.arc(L.piv[0],L.piv[1],6,0,7);x.fill();
  let px,py;
  if(mode==="swing"){px=L.piv[0]+Math.sin(th)*L.L;py=L.piv[1]+Math.cos(th)*L.L;
    x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();x.moveTo(L.piv[0],L.piv[1]);x.lineTo(px,py);x.stroke();
  }else{px=bx;py=by;}
  if(mode!=="done"||true){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(px,py,14,0,7);x.fill();
    x.fillStyle=H.C.terra;x.beginPath();x.arc(px,py,9,0,7);x.fill();
  }
});
H.btn(root,"✂ CORTAR A CORDA",cut,true);
attempt();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
