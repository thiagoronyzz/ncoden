#!/usr/bin/env python3
"""Gera games/g041..g050 — ARCADE (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 41 — Torre Empilhada
GAMES[41] = r"""/* NCODE N · 041 Torre Empilhada — alinhe os blocos que caem */
GREG(41,{
init(root,H){
let over=false;
const hud=H.hud(root,[["bl","BLOCOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Espaço / toque</b> solta o bloco. Alinhe sobre a torre — o que sobrar é cortado!");
const o=H.cvs(root,460,440),x=o.x;
let stack,cur,dir,speed,sc=0;
function build(){
  stack=[{x:o.W/2-70,w:140,y:o.H-30}];sc=0;
  newBlock();hud.set("bl",0);hud.set("sc",0);
}
function newBlock(){
  const top=stack[stack.length-1];
  cur={x:0,y:top.y-26,w:top.w,fromLeft:Math.random()<.5};
  cur.x=cur.fromLeft?-cur.w:o.W;
  dir=cur.fromLeft?1:-1;speed=170+stack.length*14;
}
function drop(){
  if(over||!cur)return;
  const top=stack[stack.length-1];
  const L=Math.max(cur.x,top.x),R=Math.min(cur.x+cur.w,top.x+top.w);
  if(R-L<8){over=true;H.sfx("lose");return H.done({win:false,score:sc,title:"Bloco perdido!",sub:stack.length-1+" andares erguidos antes da queda."});}
  const perfect=(R-L)/top.w>0.9;
  stack.push({x:L,w:R-L,y:top.y-26});
  sc+=perfect?30:10;H.score(sc);hud.set("sc",sc);hud.set("bl",stack.length-1);
  H.sfx(perfect?"ok":"tick");
  if(stack.length-1>=15){over=true;return H.done({win:true,score:sc+150,title:"Arranha-céu!",sub:"15 andares perfeitamente alinhados."});}
  newBlock();
}
const kb=H.keys();kb.on((c,d)=>{if(d&&(c==="Space"||c==="ArrowDown"))drop();});
H.onTap(o,drop);
H.loop(dt=>{
  if(over||!cur)return;
  cur.x+=dir*speed*dt;
  if(cur.x<-cur.w-10){cur.x=o.W+10;}if(cur.x>o.W+10){cur.x=-cur.w-10;}
  const camY=Math.max(0,(o.H-140)-(stack[stack.length-1].y));
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,o.H-14+camY,o.W,14);
  stack.forEach((b,i)=>{
    x.fillStyle=i%2?H.C.terra:H.C.ink;
    x.fillRect(b.x,b.y+camY,b.w,26);
    x.strokeStyle=H.C.paper;x.lineWidth=1;x.strokeRect(b.x,b.y+camY,b.w,26);
  });
  x.fillStyle=H.C.wasabi;x.fillRect(cur.x,cur.y+camY,cur.w,26);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(cur.x,cur.y+camY,cur.w,26);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("ANDAR "+stack.length,12,20);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
build();
}});"""

# 42 — Bolhas em Cadeia
GAMES[42] = r"""/* NCODE N · 042 Bolhas em Cadeia — estoure grupos, some pontos */
GREG(42,{
init(root,H){
const COLS=[H.C.terra,H.C.gold,H.C.ok,"#2E6E8A"];
const GOALS=[300,450,600];
let round=0,over=false,sc=0;
const hud=H.hud(root,[["rd","RODADA","1/3"],["mt","META",300],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique num <b>grupo de 2+</b> bolhas da mesma cor. Grupos maiores valem muito mais!");
const board=H.el("div","g-board",null,root);
const N=8;
let g=[],cells=[];
function build(){
  g=[];for(let i=0;i<N*N;i++)g.push(Math.floor(Math.random()*4));
  board.style.gridTemplateColumns="repeat(8,1fr)";
  board.style.width="min(100%,360px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="18px";d.style.borderRadius="50%";
    (function(idx){d.addEventListener("click",()=>pop(idx));})(i);
    cells.push(d);
  }
  hud.set("rd",(round+1)+"/3");hud.set("mt",GOALS[round]);
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    const v=g[i];
    cells[i].style.background=v<0?"transparent":COLS[v];
    cells[i].style.border=v<0?"1px dashed "+H.C.cement:"1px solid "+H.C.ink;
    cells[i].textContent=v<0?"":"●";
    cells[i].style.color=v<0?"transparent":"rgba(255,255,255,.85)";
  }
}
function group(i){
  const c=g[i];if(c<0)return[];
  const seen=new Set([i]),q=[i];
  while(q.length){
    const j=q.pop(),r=(j/N)|0,cc=j%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=cc+v[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(!seen.has(k)&&g[k]===c){seen.add(k);q.push(k);}
    });
  }
  return[...seen];
}
function hasMoves(){
  for(let i=0;i<N*N;i++)if(g[i]>=0){
    const r=(i/N)|0,c=i%N;
    if(c<N-1&&g[i+1]===g[i])return true;
    if(r<N-1&&g[i+N]===g[i])return true;
  }
  return false;
}
function pop(i){
  if(over||g[i]<0)return;
  const gr=group(i);
  if(gr.length<2){H.sfx("bad");say("Precisa de um <b>grupo</b>! Bolhas solitárias não estouram.");return;}
  gr.forEach(k=>g[k]=-1);
  const gain=gr.length*gr.length*5;sc+=gain;
  H.score(sc);hud.set("sc",sc);H.sfx("pop");
  for(let c=0;c<N;c++){
    const col=[];
    for(let r=N-1;r>=0;r--)if(g[r*N+c]>=0)col.push(g[r*N+c]);
    for(let r=N-1;r>=0;r--)g[r*N+c]=col[N-1-r]!==undefined?col[N-1-r]:-1;
  }
  paint();
  if(g.every(v=>v<0)){sc+=200;H.score(sc);return nextRound(true);}
  if(!hasMoves()){
    if(sc>=GOALS[round])return nextRound(false);
    over=true;return H.done({win:false,score:sc,title:"Sem jogadas",sub:"Meta era "+GOALS[round]+" e você fez "+sc+". Mire grupos grandes!"});
  }
}
function nextRound(clear){
  round++;
  if(round>=3){over=true;return H.done({win:true,score:sc+150,title:"Limpou o aquário!",sub:"3 rodadas de estouros em cadeia."});}
  say((clear?"Bônus de limpeza! (+200) ":"Meta batida! ")+"Rodada "+(round+1)+": meta "+GOALS[round]+".");
  build();
}
build();
}});"""

# 43 — Corte de Frutas
GAMES[43] = r"""/* NCODE N · 043 Corte de Frutas — fatie, desvie das bombas */
GREG(43,{
init(root,H){
const FR=["🍎","🍊","🍉","🍋","🍇","🥝"];
let over=false,items=[],halves=[],sc=0,lives=3,t=60,spawn=0,trail=[];
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Deslize o dedo/mouse para <b>fatiar</b>. Bombas 💣 custam uma vida!");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
let last={x:0,y:0};
H.loop(dt=>{
  if(over)return;
  t-=dt;H.time(Math.ceil(t)+"s");hud.set("tp",Math.ceil(t));
  if(t<=0){over=true;
    return sc>=250?H.done({win:true,score:sc,title:"Chef fatiador!",sub:sc+" pontos em 60 segundos de corte."})
                  :H.done({win:false,score:sc,title:"Salada pequena",sub:"Faltaram "+(250-sc)+" pontos para a meta 250."});}
  spawn-=dt;
  if(spawn<=0){spawn=0.55;
    const bomb=Math.random()<0.16;
    items.push({x:60+Math.random()*380,y:o.H+20,vx:(Math.random()-.5)*120,vy:-(380+Math.random()*160),
      e:bomb?"💣":FR[Math.floor(Math.random()*FR.length)],bomb,r:22,sliced:false,rot:Math.random()*6});
  }
  trail.push({x:ptr.x,y:ptr.y});if(trail.length>14)trail.shift();
  for(const it of items){
    it.vy+=700*dt;it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=dt*2;
    if(!it.sliced){
      for(const p of trail){
        if(Math.hypot(it.x-p.x,it.y-p.y)<it.r+8){
          it.sliced=true;
          if(it.bomb){lives--;hud.set("vd",lives);H.sfx("lose");
            if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Explodiu!",sub:"3 bombas fatiadas. Observe antes de cortar."});}
            say("💥 Bomba! Vidas: "+lives);
          }else{sc+=10;H.score(sc);hud.set("sc",sc);H.sfx("pop");}
          halves.push({x:it.x,y:it.y,vx:-90,vy:it.vy*.4,e:it.e,bomb:it.bomb,life:1});
          halves.push({x:it.x,y:it.y,vx:90,vy:it.vy*.4,e:it.e,bomb:it.bomb,life:1});
          break;
        }
      }
    }
  }
  items=items.filter(it=>it.y<o.H+40&&!it.sliced);
  for(const h of halves){h.vy+=700*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.life-=dt;}
  halves=halves.filter(h=>h.life>0);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.font="30px serif";
  for(const it of items){x.save();x.translate(it.x,it.y);x.rotate(it.rot*.2);x.fillText(it.e,-15,10);x.restore();}
  x.globalAlpha=.7;
  for(const h of halves){x.font="20px serif";x.fillText(h.e,h.x-10,h.y+7);}
  x.globalAlpha=1;
  x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();
  trail.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();
});
}});"""

# 44 — Chuva de Perigos
GAMES[44] = r"""/* NCODE N · 044 Chuva de Perigos — desvie, colete, sobreviva */
GREG(44,{
init(root,H){
let over=false,px=250,items=[],sc=0,lives=3,t=60,spawn=0;
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Mova com <b>mouse, toque ou setas</b>. Moedas 🪙 valem 10, estrelas ⭐ 30, bigornas 💥 machucam!");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
const kb=H.keys();
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=200?H.done({win:true,score:sc,title:"Sobrevivente!",sub:sc+" pontos sem ser esmagado."})
                  :H.done({win:false,score:sc,title:"Poucas moedas",sub:"Meta 200 — você fez "+sc+". Arrisque-se mais!"});}
  if(kb.is("ArrowLeft"))px-=320*dt;
  if(kb.is("ArrowRight"))px+=320*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*10);
  px=H.clamp(px,30,o.W-30);
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.25,.7-t*0.006);
    const r=Math.random();
    items.push({x:20+Math.random()*(o.W-40),y:-20,vy:160+Math.random()*140+(60-t)*3,
      k:r<.55?"coin":r<.8?"anvil":"star"});
  }
  for(let i=items.length-1;i>=0;i--){
    const it=items[i];it.y+=it.vy*dt;
    if(it.y>o.H-70&&it.y<o.H-20&&Math.abs(it.x-px)<34){
      items.splice(i,1);
      if(it.k==="coin"){sc+=10;H.sfx("tick");}
      else if(it.k==="star"){sc+=30;H.sfx("ok");}
      else{lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Esmagado!",sub:sc+" pontos antes da terceira bigorna."});}
        say("💥 Ai! Vidas: "+lives);
      }
      H.score(sc);hud.set("sc",sc);
    }else if(it.y>o.H+20)items.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;
  for(let i=0;i<8;i++){x.beginPath();x.moveTo(i*70,0);x.lineTo(i*70-20,o.H);x.stroke();}
  x.font="26px serif";
  for(const it of items)x.fillText(it.k==="coin"?"🪙":it.k==="star"?"⭐":"💥",it.x-13,it.y+9);
  x.font="34px serif";x.fillText("🧑‍🌾",px-17,o.H-34);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("◀ ▶ ou arraste",12,20);
});
}});"""

# 45 — Bola Quicante
GAMES[45] = r"""/* NCODE N · 045 Bola Quicante — suba pelas fendas */
GREG(45,{
init(root,H){
const GOAL=1500;
let over=false,bx,by,vy,plats,cam,sc=0,jumpCD=0;
const hud=H.hud(root,[["al","ALTURA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> pula · <b>setas/mouse</b> move. Suba "+GOAL+"px sem cair no vazio!");
const o=H.cvs(root,460,440),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  bx=o.W/2;by=o.H-80;vy=0;cam=0;sc=0;
  plats=[];let y=o.H-40;
  for(let i=0;i<24;i++){
    const gap=132-Math.min(50,i*2.4);
    plats.push({y,gx:40+Math.random()*(o.W-80-gap),gw:gap});
    y-=118;
  }
}
build();
function jump(){if(over||jumpCD>0)return;jumpCD=.18;vy=-560;H.beep(500,.06,"square",.035);}
kb.on((c,d)=>{if(d&&c==="Space")jump();});
H.onTap(o,()=>jump());
H.loop(dt=>{
  if(over)return;
  jumpCD-=dt;
  if(kb.is("ArrowLeft"))bx-=260*dt;
  if(kb.is("ArrowRight"))bx+=260*dt;
  if(ptr.down)bx+=(ptr.x-bx)*Math.min(1,dt*8);
  bx=H.clamp(bx,14,o.W-14);
  vy+=1500*dt;by+=vy*dt;
  const wy=by+cam;
  for(const p of plats){
    if(vy>0&&Math.abs(wy-p.y)<10&&(bx<p.gx||bx>p.gx+p.gw)){
      if(wy>=p.y-4&&wy<=p.y+14){by=p.y-cam;vy=0;}
    }
  }
  if(by<o.H*0.42)cam-=(o.H*0.42-by),by=o.H*0.42;
  const alt=Math.max(0,Math.round(-cam));
  sc=alt;H.score(sc);hud.set("sc",sc);hud.set("al",alt+"px");
  if(by>o.H+30){over=true;return H.done({win:false,score:sc,title:"Caiu no vazio!",sub:alt+"px escalados de "+GOAL+". Pule mais cedo!"});}
  if(alt>=GOAL){over=true;return H.done({win:true,score:sc+200,title:"Topo alcançado!",sub:GOAL+"px de pura impulsão."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const p of plats){
    const sy=p.y-cam;
    if(sy<-20||sy>o.H+20)continue;
    x.fillStyle=H.C.ink;
    x.fillRect(0,sy,p.gx,14);x.fillRect(p.gx+p.gw,sy,o.W-p.gx-p.gw,14);
    x.fillStyle=H.C.wasabi;
    x.fillRect(p.gx-4,sy,4,14);x.fillRect(p.gx+p.gw,sy,4,14);
  }
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,13,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 46 — Troca de Cor
GAMES[46] = r"""/* NCODE N · 046 Troca de Cor — combine com o anel */
GREG(46,{
init(root,H){
const COLS=[H.C.terra,H.C.gold,H.C.ok,"#2E6E8A"];
let over=false,by,ci=0,rings,ri=0,sc=0,speed=120;
const hud=H.hud(root,[["an","ANÉIS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"A bola sobe sozinha. <b>Toque/Espaço</b> troca a cor. Atravesse cada anel na <b>cor do arco</b> que encostar!");
const o=H.cvs(root,440,460),x=o.x;
function build(){
  by=o.H-60;ci=0;ri=0;sc=0;
  rings=[];
  const r=H.rng(99);
  for(let i=0;i<8;i++)rings.push({y:o.H-220-i*260,rot:r()*6,sp:(0.7+r()*0.9)*(i%2?-1:1)});
}
build();
function swap(){if(over)return;ci=(ci+1)%4;H.beep(400+ci*120,.06,"square",.04);}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")swap();});
H.onTap(o,swap);
H.loop(dt=>{
  if(over)return;
  by-=speed*dt;speed+=dt*4;
  const r=rings[ri];
  if(r){
    r.rot+=r.sp*dt;
    const dy=by-r.y;
    if(Math.abs(dy)<8){
      let a=Math.atan2(dy,o.W/2-o.W/2+0.0001);
      a=Math.atan2(dy,1);
      const ang=((Math.PI/2 - r.rot)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      const seg=Math.floor(ang/(Math.PI/2))%4;
      if(seg!==ci){over=true;H.sfx("lose");
        return H.done({win:false,score:sc,title:"Cor errada!",sub:ri+" anéis vencidos. Gire o olhar junto com o anel."});}
      ri++;sc+=50;H.score(sc);hud.set("sc",sc);hud.set("an",ri+"/8");H.sfx("ok");
      if(ri>=rings.length){over=true;return H.done({win:true,score:sc+150,title:"Cromático!",sub:"8 anéis atravessados na cor exata."});}
    }
    if(by<r.y-200){/* segue */}
  }
  const camY=Math.max(0,(o.H-140)-by+200);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  rings.forEach((g,i)=>{
    if(i<ri)return;
    const cy=g.y+camY;
    if(cy<-60||cy>o.H+60)return;
    for(let s=0;s<4;s++){
      x.strokeStyle=COLS[s];x.lineWidth=14;
      x.beginPath();x.arc(o.W/2,cy,52,g.rot+s*Math.PI/2,g.rot+(s+1)*Math.PI/2);x.stroke();
    }
    x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
    x.fillText("ANEL "+(i+1),o.W/2-26,cy+78);
  });
  x.fillStyle=COLS[ci];x.beginPath();x.arc(o.W/2,by+camY,13,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  if(by+camY<-40){by=o.H-60;}
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 47 — Corredor Infinito
GAMES[47] = r"""/* NCODE N · 047 Corredor Infinito — pule e deslize */
GREG(47,{
init(root,H){
const GOAL=1500;
let over=false,px,py,vy,slide,obs,dist,speed,sc=0,spawn=0;
const hud=H.hud(root,[["ds","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>↑/Espaço/toque</b> pula · <b>↓</b> desliza. Chegue a "+GOAL+"m!");
const o=H.cvs(root,520,320),x=o.x;
const GY=o.H-60;
function build(){px=110;py=GY;vy=0;slide=0;obs=[];dist=0;speed=230;spawn=1;}
build();
function jump(){if(over||py<GY-4)return;vy=-560;H.beep(520,.07,"square",.035);}
function doSlide(){if(over||py<GY-4)return;slide=.55;H.beep(300,.06,"square",.03);}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;if(c==="Space"||c==="ArrowUp")jump();if(c==="ArrowDown")doSlide();});
H.onTap(o,()=>jump());
H.swipe(o,{up:jump,down:doSlide,tap:jump});
H.loop(dt=>{
  if(over)return;
  slide-=dt;vy+=1600*dt;py+=vy*dt;
  if(py>=GY){py=GY;vy=0;}
  dist+=speed*dt/28;speed+=dt*7;
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.7,1.5-dist*0.0004);
    obs.push({x:o.W+20,hi:Math.random()<.4});}
  for(const b of obs)b.x-=speed*dt;
  obs=obs.filter(b=>b.x>-40);
  const ph=slide>0?22:44,pw=30;
  for(const b of obs){
    const bw=26,bh=b.hi?30:52;
    const bx=b.x,by=b.hi?GY-96:GY-bh;
    if(px+pw>bx&&px<bx+bw&&py-ph+44>by+4&&py-44<by+bh-4){
      if(!(slide>0&&b.hi&&py>=GY-4)){
        over=true;H.sfx("lose");
        return H.done({win:false,score:Math.floor(dist),title:"Tropeçou!",sub:Math.floor(dist)+"m de "+GOAL+". Deslize sob as barreiras altas!"});
      }
    }
  }
  sc=Math.floor(dist);H.score(sc);hud.set("sc",sc);hud.set("ds",sc+"m");
  if(dist>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Maratonista!",sub:GOAL+"m sem tropeçar."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,GY+22,o.W,o.H-GY);
  x.fillStyle=H.C.ink;x.fillRect(0,GY+20,o.W,3);
  x.strokeStyle=H.C.ink3;
  const off=(dist*28)%60;
  for(let i=-1;i<12;i++){x.beginPath();x.moveTo(i*60-off,GY+34);x.lineTo(i*60-off+24,GY+34);x.stroke();}
  for(const b of obs){
    if(b.hi){x.fillStyle=H.C.gold;x.fillRect(b.x,GY-96,26,30);}
    else{x.fillStyle=H.C.terra;x.fillRect(b.x,GY-52,26,52);}
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    b.hi?x.strokeRect(b.x,GY-96,26,30):x.strokeRect(b.x,GY-52,26,52);
  }
  x.fillStyle=H.C.ink;
  if(slide>0)x.fillRect(px,py-22,44,22);
  else x.fillRect(px,py-44,30,44);
  x.fillStyle=H.C.wasabi;x.fillRect(px,py-(slide>0?22:44),30,6);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 48 — Toupeira Relâmpago
GAMES[48] = r"""/* NCODE N · 048 Toupeira Relâmpago — martele rápido */
GREG(48,{
init(root,H){
let over=false,holes=[],sc=0,lives=3,t=45,spawn=0;
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",45]]);
const say=H.msg(root,"Acerte as toupeiras 🐹 (10 pts) e as <b>douradas</b> ⭐ (30). Bombas 💣 custam vida!");
const o=H.cvs(root,460,400),x=o.x;
for(let r=0;r<3;r++)for(let c=0;c<3;c++)holes.push({x:80+c*150,y:90+r*110,m:null});
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const h of holes){
    if(h.m&&Math.hypot(h.x-px,h.y-py)<44){
      if(h.m.k==="bomb"){lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Dedos queimados!",sub:sc+" pontos antes da terceira bomba."});}
        say("💥 Bomba! Vidas: "+lives);
      }else{sc+=h.m.k==="gold"?30:10;H.score(sc);hud.set("sc",sc);H.sfx("pop");}
      h.m=null;return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=200?H.done({win:true,score:sc,title:"Martelo de ouro!",sub:sc+" pontos em 45 segundos."})
                  :H.done({win:false,score:sc,title:"Poucas toupeiras",sub:"Meta 200 — você fez "+sc+". Acerte as douradas!"});}
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.3,.8-t*0.008);
    const free=holes.filter(h=>!h.m);
    if(free.length){
      const h=free[Math.floor(Math.random()*free.length)];
      const r=Math.random();
      h.m={k:r<.12?"bomb":r<.3?"gold":"mole",ttl:r<.12?1.2:1.1};
    }
  }
  for(const h of holes)if(h.m){h.m.ttl-=dt;if(h.m.ttl<=0)h.m=null;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const h of holes){
    x.fillStyle=H.C.ink;x.beginPath();x.ellipse(h.x,h.y+24,44,16,0,0,7);x.fill();
    if(h.m){
      x.font="44px serif";
      x.fillText(h.m.k==="bomb"?"💣":h.m.k==="gold"?"🌟":"🐹",h.x-22,h.y+18);
      if(h.m.k==="gold"){x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();x.arc(h.x,h.y,34,0,7);x.stroke();}
    }
  }
});
}});"""

# 49 — Pinbol de Bolso
GAMES[49] = r"""/* NCODE N · 049 Pinbol de Bolso — três bolas, muitos pontos */
GREG(49,{
init(root,H){
let over=false,bx,by,vx,vy,balls=3,sc=0,charge=0,charging=false,state="ready";
const hud=H.hud(root,[["bl","BOLAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Segure Espaço/toque</b> para carregar e solte para lançar. <b>◀ ▶</b> ou toques laterais movem os flippers.");
const o=H.cvs(root,400,520),x=o.x;
const BUMP=[{x:120,y:170},{x:200,y:130},{x:280,y:170}];
let flipL=false,flipR=false;
const W2=o.W;
function serve(){bx=W2-28;by=o.H-60;vx=0;vy=0;state="ready";charge=0;}
serve();
function launch(){if(state!=="ready")return;state="play";vy=-(500+charge*14);vx=-40;H.sfx("pop");}
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="Space"){if(d){if(state==="ready")charging=true;}else{if(charging){charging=false;launch();}}}
  if(c==="ArrowLeft")flipL=d;
  if(c==="ArrowRight")flipR=d;
});
H.onTap(o,(px,py)=>{
  if(state==="ready"){charging=true;H.after(1,()=>{});return;}
  if(px<o.W/2){flipL=true;H.after(140,()=>flipL=false);}
  else{flipR=true;H.after(140,()=>flipR=false);}
});
H.loop(dt=>{
  if(over)return;
  if(charging&&state==="ready"){charge=Math.min(40,charge+dt*60);}
  if(state==="ready"){bx=W2-28;by=o.H-60;}
  else{
    vy+=900*dt;bx+=vx*dt;by+=vy*dt;
    if(bx<14){bx=14;vx=Math.abs(vx)*.7;H.beep(200,.04);}
    if(bx>W2-14){bx=W2-14;vx=-Math.abs(vx)*.7;H.beep(200,.04);}
    if(by<14){by=14;vy=Math.abs(vy)*.7;H.beep(200,.04);}
    if(bx>W2-70&&by>o.H-160){/* canal direito */}
    for(const b of BUMP){
      const dx=bx-b.x,dy=by-b.y,d=Math.hypot(dx,dy);
      if(d<26&&d>0){vx=dx/d*380;vy=dy/d*380-120;sc+=50;H.score(sc);hud.set("sc",sc);H.sfx("pop");}
    }
    const fy=o.H-70;
    if(flipL&&bx>60&&bx<170&&by>fy-24&&by<fy+24){vy=-520;vx-=120;sc+=5;H.score(sc);hud.set("sc",sc);H.beep(600,.05);}
    if(flipR&&bx>o.W-170&&bx<o.W-60&&by>fy-24&&by<fy+24){vy=-520;vx+=120;sc+=5;H.score(sc);hud.set("sc",sc);H.beep(600,.05);}
    if(by>o.H+20){
      balls--;hud.set("bl",balls);H.sfx("bad");
      if(balls<=0){over=true;
        return sc>=600?H.done({win:true,score:sc,title:"Mago do pinball!",sub:sc+" pontos com 3 bolas."})
                      :H.done({win:false,score:sc,title:"Sem bolas",sub:sc+" pontos. Meta 600 — mire os para-choques!"});}
      say("Bola perdida! Restam "+balls+".");serve();
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=4;x.strokeRect(6,6,o.W-12,o.H-12);
  x.strokeStyle=H.C.cement;x.lineWidth=2;
  x.beginPath();x.moveTo(W2-56,120);x.lineTo(W2-56,o.H-6);x.stroke();
  for(const b of BUMP){
    x.fillStyle=H.C.gold;x.beginPath();x.arc(b.x,b.y,20,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";x.fillText("+50",b.x-13,b.y+4);
  }
  const fy=o.H-70;
  x.strokeStyle=H.C.terra;x.lineWidth=8;
  x.beginPath();x.moveTo(60,fy+10);x.lineTo(flipL?150:130,flipL?fy-16:fy+4);x.stroke();
  x.beginPath();x.moveTo(o.W-60,fy+10);x.lineTo(flipR?o.W-150:o.W-130,flipR?fy-16:fy+4);x.stroke();
  x.fillStyle=H.C.ink;x.beginPath();x.arc(bx,by,9,0,7);x.fill();
  x.fillStyle=H.C.paper;x.beginPath();x.arc(bx-3,by-3,3,0,7);x.fill();
  if(state==="ready"){
    x.fillStyle=H.C.ok;x.fillRect(20,o.H-40,charge*6,14);
    x.strokeStyle=H.C.ink;x.strokeRect(20,o.H-40,240,14);
    x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
    x.fillText("SEGURE ESPAÇO / TOQUE…",20,o.H-48);
  }
});
H.btn(root,"🚀 Lançar (força mín.)",()=>{if(state==="ready"){charge=22;launch();}},false);
}});"""

# 50 — Canhão Espacial
GAMES[50] = r"""/* NCODE N · 050 Canhão Espacial — defenda o núcleo */
GREG(50,{
init(root,H){
let over=false,ang=-Math.PI/2,shots=[],rocks=[],sc=0,lives=3,wave=0,spawnQ=0,cd=0,wavePause=2;
const hud=H.hud(root,[["wv","ONDA","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mire com <b>mouse/toque</b>, atire com <b>clique/Espaço</b>. Não deixe as rochas atingirem o núcleo!");
const o=H.cvs(root,480,440),x=o.x;
const cx=o.W/2,cy=o.H/2;
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")shoot();});
H.onTap(o,(px,py)=>{ang=Math.atan2(py-cy,px-cx);shoot();});
const ptr=H.ptr(o);
function shoot(){
  if(over||cd>0)return;cd=.22;
  shots.push({x:cx+Math.cos(ang)*26,y:cy+Math.sin(ang)*26,vx:Math.cos(ang)*420,vy:Math.sin(ang)*420});
  H.beep(700,.06,"square",.04);
}
function startWave(){
  wave++;spawnQ=4+wave*3;hud.set("wv",wave+"/3");
  say(wave>=3?"🌊 Onda final! Segure o núcleo!":"🌊 Onda "+wave+" se aproximando!");
}
H.loop(dt=>{
  if(over)return;
  cd-=dt;
  if(kb.is("ArrowLeft"))ang-=2.4*dt;
  if(kb.is("ArrowRight"))ang+=2.4*dt;
  if(ptr.down)ang=Math.atan2(ptr.y-cy,ptr.x-cx);
  if(!spawnQ&&!rocks.length){
    wavePause-=dt;
    if(wavePause<=0){
      if(wave>=3){over=true;return H.done({win:true,score:sc+150,title:"Núcleo salvo!",sub:"3 ondas vaporizadas pelo canhão."});}
      startWave();wavePause=1.5;
    }
  }
  if(spawnQ>0){spawnQ-=dt*1.2;
    if(Math.random()<dt*2){
      const a=Math.random()*6.28,R=Math.max(o.W,o.H)/2+30;
      const big=Math.random()<.35;
      rocks.push({x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,
        vx:-(cx-(cx+Math.cos(a)*R)),vy:-(cy-(cy+Math.sin(a)*R)),r:big?22:13,hp:big?2:1});
      const rk=rocks[rocks.length-1];
      const d=Math.hypot(rk.vx,rk.vy),sp=40+wave*14;
      rk.vx=rk.vx/d*sp;rk.vy=rk.vy/d*sp;
    }
  }
  for(const s of shots){s.x+=s.vx*dt;s.y+=s.vy*dt;}
  shots=shots.filter(s=>s.x>-20&&s.x<o.W+20&&s.y>-20&&s.y<o.H+20);
  for(const r of rocks){r.x+=r.vx*dt;r.y+=r.vy*dt;}
  for(let i=shots.length-1;i>=0;i--){
    for(let j=rocks.length-1;j>=0;j--){
      const s=shots[i],r=rocks[j];
      if(Math.hypot(s.x-r.x,s.y-r.y)<r.r+4){
        shots.splice(i,1);r.hp--;
        if(r.hp<=0){
          rocks.splice(j,1);sc+=r.r>15?20:40;H.score(sc);hud.set("sc",sc);H.sfx("pop");
          if(r.r>15)for(let k=0;k<2;k++)rocks.push({x:r.x,y:r.y,vx:r.vx+(Math.random()-.5)*120,vy:r.vy+(Math.random()-.5)*120,r:12,hp:1});
        }else H.beep(300,.05);
        break;
      }
    }
  }
  for(let j=rocks.length-1;j>=0;j--){
    if(Math.hypot(rocks[j].x-cx,rocks[j].y-cy)<34){
      rocks.splice(j,1);lives--;hud.set("vd",lives);H.sfx("lose");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Núcleo destruído!",sub:sc+" pontos até a onda "+wave+"."});}
      say("💥 Impacto no núcleo! Vidas: "+lives);
    }
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(cx,cy,22+Math.sin(Date.now()/300)*2,0,7);x.fill();
  x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
  x.save();x.translate(cx,cy);x.rotate(ang);
  x.fillStyle=H.C.terra;x.fillRect(10,-6,26,12);
  x.strokeStyle=H.C.paper;x.strokeRect(10,-6,26,12);
  x.restore();
  x.fillStyle=H.C.gold;
  for(const s of shots){x.beginPath();x.arc(s.x,s.y,4,0,7);x.fill();}
  for(const r of rocks){
    x.fillStyle="#8A877C";x.beginPath();x.arc(r.x,r.y,r.r,0,7);x.fill();
    x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.paper;x.font="10px 'Space Mono',monospace";x.fillText(r.hp>1?"2":"1",r.x-3,r.y+3);
  }
  x.fillStyle=H.C.paper;x.font="11px 'Space Mono',monospace";
  x.fillText("rochas: "+rocks.length,12,20);
});
startWave();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
