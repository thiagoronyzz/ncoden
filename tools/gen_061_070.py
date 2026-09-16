#!/usr/bin/env python3
"""Gera games/g061..g070 — ARCADE (parte 3)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 61 — Slalom de Esqui
GAMES[61] = r"""/* NCODE N · 061 Slalom de Esqui — desça entre as bandeiras */
GREG(61,{
init(root,H){
const GOAL=2000;
let over=false,px=260,dist=0,pen=0,gates=[],trees=[],miss=0,hit=0,t=0;
const hud=H.hud(root,[["ds","DESCIDA",0],["pn","PÊNALTIS",0],["sc","TEMPO","0s"]]);
const say=H.msg(root,"Ziguezagueie com <b>mouse, toque ou setas</b>. Passe <b>entre as bandeiras</b> — fora = +3s. Árvores atrasam!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  px=260;dist=0;pen=0;miss=0;hit=0;t=0;gates=[];trees=[];
  const r=H.rng(7);
  for(let d=200;d<GOAL;d+=260){
    const gx=80+r()*340;
    gates.push({d,gx,passed:false});
  }
  for(let d=100;d<GOAL;d+=90){
    if(r()<.7)trees.push({d,x:20+r()*460});
  }
}
build();
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(kb.is("ArrowLeft"))px-=300*dt;
  if(kb.is("ArrowRight"))px+=300*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*7);
  px=H.clamp(px,20,o.W-20);
  dist+=170*dt;
  for(const g of gates){
    if(!g.passed&&dist>=g.d){
      g.passed=true;
      if(Math.abs(px-g.gx)<46){H.sfx("ok");}
      else{miss++;pen+=3;H.sfx("bad");say("🚩 Fora da porteira! +3s (faltas: "+miss+")");}
    }
  }
  for(const tr of trees){
    if(!tr.hit&&Math.abs(dist-tr.d)<14&&Math.abs(px-tr.x)<24){
      tr.hit=true;hit++;pen+=2;dist-=30;H.sfx("bad");
    }
  }
  hud.set("ds",Math.floor(dist)+"m");hud.set("pn",pen.toFixed(0)+"s");hud.set("sc",(t+pen).toFixed(1)+"s");
  if(dist>=GOAL){over=true;
    const total=t+pen,sc=Math.max(50,Math.round(600-total*4-miss*20-hit*10));H.score(sc);
    return H.done({win:miss<=6,score:sc,title:miss<=6?"Pódio no slalom!":"Fora do pódio",
      sub:"Tempo "+total.toFixed(1)+"s · "+miss+" porteiras perdidas · "+hit+" árvores."});
  }
  x.fillStyle="#eef3f6";x.fillRect(0,0,o.W,o.H);
  const py=o.H-90;
  for(const tr of trees){
    const sy=py-(tr.d-dist)*0.9;
    if(sy<-30||sy>o.H+30)continue;
    x.font="26px serif";x.fillText("🌲",tr.x-13,sy+9);
  }
  for(const g of gates){
    const sy=py-(g.d-dist)*0.9;
    if(sy<-40||sy>o.H+40)continue;
    const ok=g.passed&&Math.abs(px-g.gx)<60;
    x.fillStyle=g.passed?(ok?"#3E7C4F":H.C.terra):H.C.terra;
    x.fillRect(g.gx-46,sy-24,8,30);x.fillRect(g.gx+38,sy-24,8,30);
    x.fillStyle=g.passed?(ok?"#3E7C4F":H.C.terra):"#2E6E8A";
    x.beginPath();x.moveTo(g.gx-46,sy-24);x.lineTo(g.gx-28,sy-18);x.lineTo(g.gx-46,sy-12);x.fill();
    x.beginPath();x.moveTo(g.gx+46,sy-24);x.lineTo(g.gx+28,sy-18);x.lineTo(g.gx+46,sy-12);x.fill();
  }
  x.font="30px serif";x.fillText("⛷️",px-15,py+10);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(Math.floor(dist)+"m / "+GOAL+"m",12,20);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 62 — Canos Batendo Asa
GAMES[62] = r"""/* NCODE N · 062 Canos Batendo Asa — voe entre os canos */
GREG(62,{
init(root,H){
const GOAL=15;
let over=false,bx,by,vy,pipes,sc=0,spawn=0,dead=false;
const hud=H.hud(root,[["cb","CANOS","0/15"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> bate as asas. Passe por "+GOAL+" canos sem encostar!");
const o=H.cvs(root,460,440),x=o.x;
function build(){bx=120;by=o.H/2;vy=0;pipes=[];sc=0;dead=false;spawn=1.2;}
build();
function flap(){if(over||dead)return;vy=-430;H.beep(600,.06,"square",.035);}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")flap();});
H.onTap(o,flap);
H.loop(dt=>{
  if(over)return;
  if(!dead){
    vy+=1300*dt;by+=vy*dt;
    spawn-=dt;
    if(spawn<=0){spawn=1.5;
      const gap=140,gy=80+Math.random()*(o.H-160-gap);
      pipes.push({x:o.W+20,gy,gap,ok:false});
    }
    for(const p of pipes){
      p.x-=170*dt;
      if(!p.ok&&p.x+34<bx){p.ok=true;sc++;H.score(sc);hud.set("sc",sc);hud.set("cb",sc+"/"+GOAL);H.sfx("ok");
        if(sc>=GOAL){over=true;return H.done({win:true,score:sc*20+100,title:"Voo limpo!",sub:GOAL+" canos cruzados sem uma pena amassada."});}}
      if(bx+12>p.x&&bx-12<p.x+34&&(by-12<p.gy||by+12>p.gy+p.gap)){dead=true;H.sfx("lose");}
    }
    pipes=pipes.filter(p=>p.x>-60);
    if(by<-20||by>o.H+20)dead=true;
    if(dead){over=true;return H.done({win:false,score:sc*20,title:"Caiu do céu!",sub:sc+" canos de "+GOAL+". Bata as asas com ritmo!"});}
  }
  x.fillStyle="#cfe8ef";x.fillRect(0,0,o.W,o.H);
  for(const p of pipes){
    x.fillStyle=H.C.ok;x.fillRect(p.x,0,34,p.gy);x.fillRect(p.x,p.gy+p.gap,34,o.H-p.gy-p.gap);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(p.x,0,34,p.gy);x.strokeRect(p.x,p.gy+p.gap,34,o.H-p.gy-p.gap);
    x.fillStyle=H.C.ink;x.fillRect(p.x-3,p.gy-12,40,12);x.fillRect(p.x-3,p.gy+p.gap,40,12);
  }
  x.save();x.translate(bx,by);x.rotate(H.clamp(vy/900,-.4,.7));
  x.font="30px serif";x.fillText("🐤",-15,10);x.restore();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 63 — Ímã de Moedas
GAMES[63] = r"""/* NCODE N · 063 Ímã de Moedas — ligue e puxe o ouro */
GREG(63,{
init(root,H){
const GOAL=25;
let over=false,coins=[],sc=0,t=60,spawn=0,mag=0,cd=0,px=110,py=0;
const hud=H.hud(root,[["mo","MOEDAS","0/25"],["mg","ÍMÃ","PRONTO"],["tp","TEMPO",60]]);
const say=H.msg(root,"Você corre sozinho. <b>Toque/Espaço</b> liga o ímã por 1,5s (recarrega 3s) e puxa as 🪙 próximas!");
const o=H.cvs(root,520,340),x=o.x;
py=o.H-90;
function pulse(){if(over||cd>0)return;mag=1.5;cd=4.5;H.sfx("pop");}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")pulse();});
H.onTap(o,pulse);
H.loop(dt=>{
  if(over)return;
  t-=dt;mag-=dt;cd-=dt;
  hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  hud.set("mg",mag>0?"LIGADO!":cd>0?cd.toFixed(1)+"s":"PRONTO");
  if(t<=0){over=true;
    return sc>=GOAL?H.done({win:true,score:sc*10+100,title:"Colecionador!",sub:GOAL+" moedas pescadas pelo ímã."})
                  :H.done({win:false,score:sc*10,title:"Poucas moedas",sub:sc+"/"+GOAL+". Ligue o ímã quando o arco se aproximar!"});}
  spawn-=dt;
  if(spawn<=0){spawn=.55;
    const n=2+Math.floor(Math.random()*3),baseY=60+Math.random()*180;
    for(let i=0;i<n;i++)coins.push({x:o.W+20+i*36,y:baseY+Math.sin(i)*30,vx:-(150+Math.random()*60)});}
  for(let i=coins.length-1;i>=0;i--){
    const c=coins[i];c.x+=c.vx*dt;
    if(mag>0){
      const d=Math.hypot(c.x-px,c.y-py);
      if(d<190){c.x+=(px-c.x)*dt*6;c.y+=(py-c.y)*dt*6;}
    }
    if(Math.hypot(c.x-px,c.y-py)<30){coins.splice(i,1);sc++;
      H.score(sc*10);hud.set("sc",sc*10);hud.set("mo",sc+"/"+GOAL);H.beep(900,.06,"sine",.05);
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*10+100,title:"Colecionador!",sub:GOAL+" moedas pescadas pelo ímã."});}
    }else if(c.x<-30)coins.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,py+34,o.W,o.H-py);
  x.fillStyle=H.C.ink;x.fillRect(0,py+32,o.W,3);
  const run=Math.sin(Date.now()/90)*4;
  x.font="34px serif";x.fillText("🏃",px-17,py+22+run);
  if(mag>0){x.strokeStyle=H.C.terra;x.lineWidth=3;
    x.beginPath();x.arc(px,py+6,60+Math.sin(Date.now()/60)*8,0,7);x.stroke();
    x.beginPath();x.arc(px,py+6,110,0,7);x.stroke();}
  x.font="22px serif";
  for(const c of coins)x.fillText("🪙",c.x-11,c.y+8);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("ímã: "+(mag>0?"ON":cd>0?cd.toFixed(1)+"s":"pronto"),12,20);
});
}});"""

# 64 — Chão de Lava
GAMES[64] = r"""/* NCODE N · 064 Chão de Lava — suba, a lava sobe junto */
GREG(64,{
init(root,H){
const GOAL=1200;
let over=false,bx,by,vy,plats,lavaY,cam,sc=0;
const hud=H.hud(root,[["al","ALTURA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> pula · <b>setas/mouse</b> move. A lava sobe sem parar — alcance "+GOAL+"px!");
const o=H.cvs(root,460,440),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  bx=o.W/2;by=o.H-60;vy=0;cam=0;lavaY=60;sc=0;plats=[{x:0,w:o.W,y:0}];
  let y=-110;
  const r=H.rng(5);
  for(let i=0;i<22;i++){
    const w=110+r()*70;
    plats.push({x:r()*(o.W-w),w,y,mv:r()<.3?1+((i%2)*2-1)*0:0,ph:r()*6});
    y-=105;
  }
}
build();
function jump(){
  if(over)return;
  const wy=by+cam;
  for(const p of plats){
    const px=p.mv?p.x+Math.sin(Date.now()/900+p.ph)*40:p.x;
    if(vy>=0&&wy>=p.y-6&&wy<=p.y+18&&bx>px-4&&bx<px+p.w+4){vy=-620;H.beep(520,.06,"square",.035);return;}
  }
  if(wy>=-4&&wy<40){vy=-620;H.beep(520,.06,"square",.035);}
}
kb.on((c,d)=>{if(d&&c==="Space")jump();});
H.onTap(o,()=>jump());
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))bx-=280*dt;
  if(kb.is("ArrowRight"))bx+=280*dt;
  if(ptr.down)bx+=(ptr.x-bx)*Math.min(1,dt*8);
  bx=H.clamp(bx,12,o.W-12);
  vy+=1500*dt;vy=Math.min(700,vy);by+=vy*dt;
  lavaY+=26*dt;
  const wy=by+cam;
  for(const p of plats){
    const px=p.mv?p.x+Math.sin(Date.now()/900+p.ph)*40:p.x;
    if(vy>0&&wy>=p.y-4&&wy<=p.y+16&&bx>px&&bx<px+p.w){by=p.y-cam;vy=0;}
  }
  if(by<o.H*0.45){cam-=(o.H*0.45-by);by=o.H*0.45;}
  const alt=Math.max(0,Math.round(-cam));
  sc=alt;H.score(sc);hud.set("sc",sc);hud.set("al",alt+"px");
  const lavaScreenY=o.H-lavaY-cam+o.H*0;
  if(wy>=-lavaY+40){
    over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Virou churrasco!",sub:alt+"px de "+GOAL+". Não pare de subir!"});
  }
  if(by>o.H+40){over=true;H.sfx("lose");return H.done({win:false,score:sc,title:"Caiu na lava!",sub:alt+"px escalados."});}
  if(alt>=GOAL){over=true;return H.done({win:true,score:sc+200,title:"Acima da lava!",sub:GOAL+"px escalados contra a maré de fogo."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const p of plats){
    const sy=p.y-cam;
    if(sy<-20||sy>o.H+20)continue;
    const px=p.mv?p.x+Math.sin(Date.now()/900+p.ph)*40:p.x;
    x.fillStyle=p.mv?H.C.gold:H.C.ink;
    x.fillRect(px,sy,p.w,14);
    x.fillStyle=H.C.wasabi;x.fillRect(px,sy,p.w,4);
  }
  const ly=o.H-(-lavaY+40)-cam+ (o.H-40);
  const lavaTop=o.H-40-(-lavaY)-cam+40;
  x.fillStyle=H.C.terra;
  const lt=o.H-(lavaY-40)-cam;
  x.fillRect(0,Math.min(o.H,lt),o.W,o.H);
  x.fillStyle=H.C.gold;
  for(let i=0;i<10;i++){
    const bx2=i*50+((Date.now()/20)%50);
    x.beginPath();x.arc(bx2%o.W,Math.min(o.H,lt)+8,7,0,7);x.fill();
  }
  x.fillStyle=H.C.ink;x.beginPath();x.arc(bx,by,12,0,7);x.fill();
  x.strokeStyle=H.C.wasabi;x.lineWidth=2;x.stroke();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 65 — Estande de Tiro
GAMES[65] = r"""/* NCODE N · 065 Estande de Tiro — mire o centro */
GREG(65,{
init(root,H){
let over=false,tgts=[],sc=0,t=30,spawn=0,cd=0,shots=0,hits=0;
const hud=H.hud(root,[["sc","PONTOS",0],["pr","PRECISÃO","-"],["tp","TEMPO",30]]);
const say=H.msg(root,"Toque nos alvos para atirar. <b>Centro = 25</b>, borda = 10. 30 segundos, meta 250!");
const o=H.cvs(root,500,400),x=o.x;
H.onTap(o,(px,py)=>{
  if(over||cd>0)return;cd=.22;shots++;H.beep(180,.09,"sawtooth",.06);
  for(let i=tgts.length-1;i>=0;i--){
    const t=tgts[i];
    const d=Math.hypot(t.x-px,t.y-py);
    if(d<t.r){
      tgts.splice(i,1);hits++;
      sc+=d<t.r/3?25:10;H.score(sc);hud.set("sc",sc);H.sfx("pop");
      hud.set("pr",Math.round(hits/shots*100)+"%");
      return;
    }
  }
  hud.set("pr",Math.round(hits/shots*100)+"%");
});
H.loop(dt=>{
  if(over)return;
  t-=dt;cd-=dt;
  hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=250?H.done({win:true,score:sc,title:"Atirador de elite!",sub:sc+" pontos com "+Math.round(hits/Math.max(1,shots)*100)+"% de precisão."})
                  :H.done({win:false,score:sc,title:"Mira torta",sub:"Meta 250 — você fez "+sc+". Respire e mire o centro!"});}
  spawn-=dt;
  if(spawn<=0){spawn=.5;
    tgts.push({x:Math.random()<.5?-30:o.W+30,y:60+Math.random()*280,
      vx:(Math.random()<.5?1:-1)*(80+Math.random()*120),r:20+Math.random()*14});}
  for(const g of tgts)g.x+=g.vx*dt;
  tgts=tgts.filter(g=>g.x>-50&&g.x<o.W+50);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,0,o.W,40);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";x.fillText("// ESTANDE 07 — FOGO À VONTADE",14,25);
  for(const g of tgts){
    x.fillStyle=H.C.card;x.beginPath();x.arc(g.x,g.y,g.r,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.terra;x.beginPath();x.arc(g.x,g.y,g.r/3,0,7);x.fill();
  }
  x.strokeStyle=H.C.ink;x.lineWidth=1.5;
  x.beginPath();x.moveTo(o.W/2-14,o.H-24);x.lineTo(o.W/2+14,o.H-24);x.moveTo(o.W/2,o.H-36);x.lineTo(o.W/2,o.H-12);x.stroke();
});
}});"""

# 66 — Cesta em Movimento
GAMES[66] = r"""/* NCODE N · 066 Cesta em Movimento — arremesse na tabela móvel */
GREG(66,{
init(root,H){
let over=false,balls=10,sc=0,ball=null,hoopX=350,dir=1,aim=null;
const hud=H.hud(root,[["bl","BOLAS",10],["ct","CESTAS","0"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Arraste para trás</b> a partir da bola e solte para arremessar. 6 cestas em 10 bolas vencem!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);
const SX=90,SY=o.H-60,HY=120;
function newBall(){ball={x:SX,y:SY,vx:0,vy:0,fly:false};}
newBall();
H.loop(dt=>{
  if(over)return;
  hoopX+=dir*130*dt;
  if(hoopX>430){hoopX=430;dir=-1;}if(hoopX<220){hoopX=220;dir=1;}
  if(ptr.down&&ball&&!ball.fly){
    if(!aim&&Math.hypot(ptr.x-ball.x,ptr.y-ball.y)<60)aim={x:ptr.x,y:ptr.y};
  }
  if(!ptr.down&&aim&&ball&&!ball.fly){
    ball.vx=(aim.x-ptr.x)*6;ball.vy=(aim.y-ptr.y)*6-200;
    ball.fly=true;aim=null;H.sfx("pop");
  }
  if(!ptr.down)aim=null;
  if(ball&&ball.fly){
    ball.vy+=900*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
    if(ball.x>o.W-12){ball.x=o.W-12;ball.vx*=-.6;}
    if(ball.x<12){ball.x=12;ball.vx*=-.6;}
    if(ball.y>o.H-12){ball.y=o.H-12;ball.vy*=-.5;ball.vx*=.9;
      if(Math.abs(ball.vy)<60)endThrow(false);}
    if(ball.vy>0&&Math.abs(ball.x-hoopX)<22&&Math.abs(ball.y-HY)<10){endThrow(true);return;}
    if(ball.y<-40||Math.abs(ball.vx)+Math.abs(ball.vy)<20&&ball.y>o.H-40)endThrow(false);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,o.H-10,o.W,10);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(hoopX-34,HY-46);x.lineTo(hoopX+34,HY-46);x.stroke();
  x.strokeStyle=H.C.terra;x.lineWidth=5;
  x.beginPath();x.ellipse(hoopX,HY,24,7,0,0,7);x.stroke();
  x.strokeStyle=H.C.cement;x.lineWidth=1.5;
  x.beginPath();x.moveTo(hoopX-20,HY+3);x.lineTo(hoopX-14,HY+26);x.moveTo(hoopX+20,HY+3);x.lineTo(hoopX+14,HY+26);x.moveTo(hoopX,HY+5);x.lineTo(hoopX,HY+28);x.stroke();
  if(ball){
    x.fillStyle="#c96f2e";x.beginPath();x.arc(ball.x,ball.y,11,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  }
  if(aim&&ball){
    x.strokeStyle=H.C.terra;x.setLineDash([5,5]);
    x.beginPath();x.moveTo(ball.x,ball.y);x.lineTo(ball.x+(aim.x-ptr.x)*2,ball.y+(aim.y-ptr.y)*2);x.stroke();
    x.setLineDash([]);
  }
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("arraste p/ trás e solte",12,20);
});
function endThrow(hit){
  balls--;hud.set("bl",balls);
  if(hit){sc++;H.score(sc*50);hud.set("sc",sc*50);hud.set("ct",sc);H.sfx("ok");}
  else H.sfx("bad");
  if(balls<=0){over=true;
    return sc>=6?H.done({win:true,score:sc*50+100,title:"Mão quente!",sub:sc+"/10 cestas na tabela móvel."})
                :H.done({win:false,score:sc*50,title:"Dia ruim",sub:sc+"/10 cestas. Meta 6 — antecipe o aro!"});}
  if(sc>=6&&balls>=0&&sc===6){/* continua p/ recorde */}
  newBall();
}
}});"""

# 67 — Faca Giratória
GAMES[67] = r"""/* NCODE N · 067 Faca Giratória — fique sem bater */
GREG(67,{
init(root,H){
const GOAL=10;
let over=false,ang=0,speed=2.2,stuck=[],knife=null,sc=0;
const hud=H.hud(root,[["fk","FACAS","0/10"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> lança a faca no tronco giratório. Não acerte as já fincadas!");
const o=H.cvs(root,440,440),x=o.x;
const cx=o.W/2,cy=180,LR=74;
function build(){ang=0;stuck=[];knife=null;sc=0;speed=2.2;}
build();
function toss(){
  if(over||knife)return;
  knife={y:o.H-40};H.sfx("tick");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")toss();});
H.onTap(o,toss);
H.loop(dt=>{
  if(over)return;
  ang+=speed*dt;
  if(Math.random()<dt*.5)speed=H.clamp(speed+(Math.random()-.5)*.6,1.4,3.4)*(Math.random()<.02?-1:1);
  if(knife){
    knife.y-=620*dt;
    if(knife.y<=cy+LR+26){
      const rel=(((-Math.PI/2-ang)%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      const clash=stuck.some(s=>{
        let d=Math.abs(s-rel);
        if(d>Math.PI)d=Math.PI*2-d;
        return d<0.32;
      });
      if(clash){over=true;H.sfx("lose");
        return H.done({win:false,score:sc*20,title:"Facas colidiram!",sub:sc+"/"+GOAL+" fincadas. Espere a abertura!"});}
      stuck.push(rel);knife=null;sc++;
      H.score(sc*20);hud.set("sc",sc*20);hud.set("fk",sc+"/"+GOAL);H.sfx("ok");
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*20+150,title:"Faqueiro completo!",sub:GOAL+" facas no tronco sem uma colisão."});}
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.save();x.translate(cx,cy);
  x.fillStyle="#a4764a";x.beginPath();x.arc(0,0,LR,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.strokeStyle="rgba(0,0,0,.2)";
  for(let i=0;i<3;i++){x.beginPath();x.arc(0,0,24+i*16,0,7);x.stroke();}
  x.rotate(ang);
  for(const s of stuck){
    x.save();x.rotate(s);
    x.fillStyle="#c9c5b8";x.fillRect(LR-4,-5,44,10);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(LR-4,-5,44,10);
    x.fillStyle=H.C.ink;x.fillRect(LR+40,-7,12,14);
    x.restore();
  }
  x.restore();
  x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
  x.fillText("🎯 "+(GOAL-sc)+" restantes",14,24);
  const ky=knife?knife.y:o.H-40;
  x.fillStyle="#c9c5b8";x.fillRect(cx-5,ky-44,10,44);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(cx-5,ky-44,10,44);
  x.fillStyle=H.C.ink;x.fillRect(cx-7,ky-58,14,14);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 68 — Torre Balançante
GAMES[68] = r"""/* NCODE N · 068 Torre Balançante — solte no balanço certo */
GREG(68,{
init(root,H){
const GOAL=10;
let over=false,stack,sw,falling,sc=0;
const hud=H.hud(root,[["bl","BLOCOS","0/10"],["sc","PONTOS",0]]);
const say=H.msg(root,"O guindaste balança. <b>Toque/Espaço</b> solta o bloco sobre a torre. Tortos são <b>cortados</b>!");
const o=H.cvs(root,460,440),x=o.x;
const PIV={x:o.W/2,y:60},LEN=150;
function build(){
  stack=[{x:o.W/2-70,w:140,y:o.H-30}];sc=0;
  sw={a:1.1,w:0};falling=null;
  hud.set("bl","0/"+GOAL);hud.set("sc",0);
}
build();
function release(){
  if(over||falling)return;
  const bx=PIV.x+Math.sin(sw.a)*LEN;
  falling={x:bx-70,y:PIV.y+Math.cos(sw.a)*LEN,w:140,vy:0};
  H.sfx("tick");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")release();});
H.onTap(o,release);
H.loop(dt=>{
  if(over)return;
  if(!falling){
    sw.w+=(-9.8/LEN*Math.sin(sw.a))*dt*8;
    sw.a+=sw.w*dt;
    if(Math.abs(sw.a)>1.3)sw.w*=-0.98;
  }else{
    falling.vy+=1400*dt;falling.y+=falling.vy*dt;
    const top=stack[stack.length-1];
    if(falling.y>=top.y-24){
      const L=Math.max(falling.x,top.x),R=Math.min(falling.x+falling.w,top.x+top.w);
      if(R-L<10){over=true;H.sfx("lose");
        return H.done({win:false,score:sc,title:"Bloco ao vento!",sub:(stack.length-1)+" andares antes da queda."});}
      stack.push({x:L,w:R-L,y:top.y-24});
      sc+=(R-L)/top.w>0.92?30:10;
      H.score(sc);hud.set("sc",sc);hud.set("bl",(stack.length-1)+"/"+GOAL);H.sfx("ok");
      falling=null;sw={a:(Math.random()<.5?-1:1)*1.15,w:0};
      if(stack.length-1>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Guindaste de ouro!",sub:GOAL+" blocos empilhados no balanço."});}
    }
    if(falling&&falling.y>o.H+40){over=true;H.sfx("lose");
      return H.done({win:false,score:sc,title:"Errou a torre!",sub:(stack.length-1)+" andares."});}
  }
  const camY=Math.max(0,(o.H-160)-stack[stack.length-1].y);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(PIV.x-40,20,80,14);
  if(!falling){
    const bx=PIV.x+Math.sin(sw.a)*LEN,by=PIV.y+Math.cos(sw.a)*LEN;
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.beginPath();x.moveTo(PIV.x,PIV.y);x.lineTo(bx,by);x.stroke();
    x.fillStyle=H.C.gold;x.fillRect(bx-70,by,140,24);
    x.strokeStyle=H.C.ink;x.strokeRect(bx-70,by,140,24);
  }
  stack.forEach((b,i)=>{
    x.fillStyle=i%2?H.C.terra:H.C.ink;
    x.fillRect(b.x,b.y+camY,b.w,24);
    x.strokeStyle=H.C.paper;x.strokeRect(b.x,b.y+camY,b.w,24);
  });
  if(falling){
    x.fillStyle=H.C.gold;x.fillRect(falling.x,falling.y+camY,falling.w,24);
    x.strokeStyle=H.C.ink;x.strokeRect(falling.x,falling.y+camY,falling.w,24);
  }
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 69 — Salto Orbital
GAMES[69] = r"""/* NCODE N · 069 Salto Orbital — pule de planeta em planeta */
GREG(69,{
init(root,H){
const GOAL=12;
let over=false,planets,cur,tgt,proj,sc=0,lives=3;
const hud=H.hud(root,[["sl","SALTOS","0/12"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> salta ao planeta 🎯. O tiro vai reto até onde ele <b>está</b> — tempere a órbita!");
const o=H.cvs(root,500,440),x=o.x;
const cx=o.W/2,cy=o.H/2;
function build(){
  const r=H.rng(21);
  planets=[
    {orb:70,pr:20,a:r()*6,sp:.5},
    {orb:120,pr:17,a:r()*6,sp:-.38},
    {orb:170,pr:15,a:r()*6,sp:.3}
  ];
  cur={p:0};tgt=1;proj=null;sc=0;lives=3;
  hud.set("sl","0/"+GOAL);hud.set("vd",3);hud.set("sc",0);
}
build();
function pos(p){return{x:cx+Math.cos(p.a)*p.orb,y:cy+Math.sin(p.a)*p.orb};}
function leap(){
  if(over||proj)return;
  const a=pos(planets[cur.p]),b=pos(planets[tgt]);
  const d=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y));
  proj={x:a.x,y:a.y,vx:(b.x-a.x)/d*340,vy:(b.y-a.y)/d*340,from:cur.p,to:tgt};
  H.sfx("pop");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")leap();});
H.onTap(o,leap);
H.loop(dt=>{
  if(over)return;
  for(const p of planets)p.a+=p.sp*dt;
  if(proj){
    proj.x+=proj.vx*dt;proj.y+=proj.vy*dt;
    const b=pos(planets[proj.to]);
    if(Math.hypot(proj.x-b.x,proj.y-b.y)<planets[proj.to].pr+10){
      cur.p=proj.to;proj=null;sc++;
      tgt=(tgt+1)%planets.length;
      if(tgt===cur.p)tgt=(tgt+1)%planets.length;
      H.score(sc*25);hud.set("sc",sc*25);hud.set("sl",sc+"/"+GOAL);H.sfx("ok");
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*25+150,title:"Navegador orbital!",sub:GOAL+" saltos entre planetas sem deriva."});}
    }else if(proj.x<-30||proj.x>o.W+30||proj.y<-30||proj.y>o.H+30){
      proj=null;lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc*25,title:"Deriva espacial!",sub:sc+" saltos antes de se perder. Salte mais cedo!"});}
      say("🌀 Deriva! Vidas: "+lives+". Mire onde o planeta <b>vai estar</b>.");
    }
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.gold;x.beginPath();x.arc(cx,cy,26,0,7);x.fill();
  planets.forEach((p,i)=>{
    x.strokeStyle="rgba(255,255,255,.18)";x.beginPath();x.arc(cx,cy,p.orb,0,7);x.stroke();
  });
  planets.forEach((p,i)=>{
    const q=pos(p);
    x.fillStyle=i===cur.p?H.C.wasabi:i===tgt?H.C.terra:"#2E6E8A";
    x.beginPath();x.arc(q.x,q.y,p.pr,0,7);x.fill();
    x.strokeStyle="#fff";x.lineWidth=2;x.stroke();
    if(i===cur.p){x.fillStyle="#fff";x.font="14px serif";x.fillText("🧑‍🚀",q.x-8,q.y-14);}
    if(i===tgt){x.strokeStyle=H.C.wasabi;x.setLineDash([4,4]);x.beginPath();x.arc(q.x,q.y,p.pr+7,0,7);x.stroke();x.setLineDash([]);}
  });
  if(proj){
    x.strokeStyle=H.C.paper;x.setLineDash([4,4]);
    const a=pos(planets[proj.from]);
    x.beginPath();x.moveTo(a.x,a.y);x.lineTo(proj.x,proj.y);x.stroke();x.setLineDash([]);
    x.fillStyle="#fff";x.beginPath();x.arc(proj.x,proj.y,6,0,7);x.fill();
  }
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 70 — Tiro Ricochete
GAMES[70] = r"""/* NCODE N · 070 Tiro Ricochete — quique até o alvo */
GREG(70,{
init(root,H){
const LV=[
 {walls:[[200,120,24,180]],tgt:[420,80],ammo:3},
 {walls:[[140,200,220,22],[330,60,22,120]],tgt:[430,330],ammo:3},
 {walls:[[120,120,22,220],[120,120,240,22],[360,120,22,220]],tgt:[240,280],ammo:4},
 {walls:[[180,80,22,140],[180,220,220,22],[400,220,22,140]],tgt:[90,330],ammo:4},
 {walls:[[100,150,300,22],[100,150,22,180],[380,150,22,180]],tgt:[240,330],ammo:4}
];
const GUN=[60,360];
let lv=0,over=false,ammo=3,bullets=[];
const hud=H.hud(root,[["nv","NÍVEL",1],["bl","BALAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mire com <b>mouse/toque</b>, <b>clique/Espaço</b> atira. A bala quica nas paredes e muros até 6 vezes!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);
function build(){ammo=LV[lv].ammo;bullets=[];hud.set("nv",lv+1);hud.set("bl",ammo);}
build();
function shoot(){
  if(over||ammo<=0||bullets.length>0)return;
  ammo--;hud.set("bl",ammo);
  const a=Math.atan2(ptr.y-GUN[1],ptr.x-GUN[0]);
  bullets.push({x:GUN[0],y:GUN[1],vx:Math.cos(a)*460,vy:Math.sin(a)*460,b:0});
  H.beep(200,.12,"sawtooth",.06);
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")shoot();});
H.onTap(o,()=>shoot());
function bounceWalls(b){
  for(const w of LV[lv].walls){
    if(b.x>w[0]&&b.x<w[0]+w[2]&&b.y>w[1]&&b.y<w[1]+w[3]){
      const dl=Math.abs(b.x-w[0]),dr=Math.abs(b.x-w[0]-w[2]);
      const dt=Math.abs(b.y-w[1]),db=Math.abs(b.y-w[1]-w[3]);
      const m=Math.min(dl,dr,dt,db);
      if(m===dl||m===dr){b.vx*=-1;b.x+=m===dl?-3:3;}
      else{b.vy*=-1;b.y+=m===dt?-3:3;}
      b.b++;H.beep(300+b.b*60,.05);return true;
    }
  }
  return false;
}
H.loop(dt=>{
  if(over)return;
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.x<10||b.x>o.W-10){b.vx*=-1;b.x=H.clamp(b.x,10,o.W-10);b.b++;H.beep(300,.05);}
    if(b.y<10||b.y>o.H-10){b.vy*=-1;b.y=H.clamp(b.y,10,o.H-10);b.b++;H.beep(300,.05);}
    bounceWalls(b);
    const t=LV[lv].tgt;
    if(Math.hypot(b.x-t[0],b.y-t[1])<20){
      bullets.splice(i,1);
      const sc=(lv+1)*120+ammo*30;H.score(sc);hud.set("sc",sc);H.sfx("ok");
      if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Ricochete certeiro!",sub:"5 alvos atrás de cobertura, todos atingidos."});}
      lv++;say("Nível "+(lv+1)+": cobertura mais traiçoeira.");build();return;
    }
    if(b.b>6){bullets.splice(i,1);
      if(ammo<=0){over=true;return H.done({win:false,score:lv*100,title:"Sem balas!",sub:"A bala morreu no nível "+(lv+1)+". Use os cantos!"});}
      say("Bala perdida. Restam "+ammo+".");
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(5,5,o.W-10,o.H-10);
  x.fillStyle=H.C.ink;
  for(const w of LV[lv].walls)x.fillRect(w[0],w[1],w[2],w[3]);
  const t=LV[lv].tgt;
  x.fillStyle=H.C.terra;x.beginPath();x.arc(t[0],t[1],18,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle="#fff";x.beginPath();x.arc(t[0],t[1],7,0,7);x.fill();
  const a=Math.atan2(ptr.y-GUN[1],ptr.x-GUN[0]);
  x.save();x.translate(GUN[0],GUN[1]);x.rotate(a);
  x.fillStyle=H.C.ink;x.fillRect(0,-5,34,10);
  x.fillStyle=H.C.wasabi;x.fillRect(28,-3,8,6);
  x.restore();
  x.setLineDash([4,5]);x.strokeStyle=H.C.cement;
  x.beginPath();x.moveTo(GUN[0],GUN[1]);x.lineTo(GUN[0]+Math.cos(a)*60,GUN[1]+Math.sin(a)*60);x.stroke();
  x.setLineDash([]);
  for(const b of bullets){
    x.fillStyle=H.C.gold;x.beginPath();x.arc(b.x,b.y,5,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  }
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
