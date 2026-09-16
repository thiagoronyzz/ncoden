#!/usr/bin/env python3
"""Gera games/g071..g080 — ARCADE (parte 4, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 71 — Pino na Fenda
GAMES[71] = r"""/* NCODE N · 071 Pino na Fenda — solte na hora exata */
GREG(71,{
init(root,H){
const GOAL=8;
let over=false,slotX=250,dir=1,pin=null,sc=0,lives=5,speed=200;
const hud=H.hud(root,[["ac","ACERTOS","0/8"],["vd","VIDAS",5],["sc","PONTOS",0]]);
const say=H.msg(root,"A fenda desliza sem parar. <b>Toque/Espaço</b> solta o pino de cima. "+GOAL+" acertos vencem!");
const o=H.cvs(root,500,380),x=o.x;
function drop(){
  if(over||pin)return;
  pin={x:o.W/2,y:30,vy:0};H.sfx("tick");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")drop();});
H.onTap(o,drop);
H.loop(dt=>{
  if(over)return;
  slotX+=dir*speed*dt;
  if(slotX>o.W-70){slotX=o.W-70;dir=-1;}
  if(slotX<70){slotX=70;dir=1;}
  if(pin){
    pin.vy+=1500*dt;pin.y+=pin.vy*dt;
    if(pin.y>=o.H-90){
      if(Math.abs(pin.x-slotX)<30){
        sc++;speed+=22;H.score(sc*25);hud.set("sc",sc*25);hud.set("ac",sc+"/"+GOAL);H.sfx("ok");
        if(sc>=GOAL){over=true;return H.done({win:true,score:sc*25+100,title:"Mira de laser!",sub:GOAL+" pinos na fenda em movimento."});}
      }else{
        lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc*25,title:"Pinos tortos!",sub:sc+" acertos. Solte um pouco antes!"});}
        say("Errou! Vidas: "+lives+".");
      }
      pin=null;
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.setLineDash([4,5]);
  x.beginPath();x.moveTo(o.W/2,0);x.lineTo(o.W/2,o.H-90);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ink;
  x.fillRect(20,o.H-80,slotX-30-20,26);
  x.fillRect(slotX+30,o.H-80,o.W-20-(slotX+30),26);
  x.fillStyle=H.C.wasabi;x.fillRect(slotX-30,o.H-80,60,26);
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  x.strokeRect(slotX-30,o.H-80,60,26);
  if(!pin){
    x.fillStyle=H.C.terra;
    x.beginPath();x.moveTo(o.W/2-8,20);x.lineTo(o.W/2+8,20);x.lineTo(o.W/2,52);x.closePath();x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  }else{
    x.fillStyle=H.C.terra;
    x.beginPath();x.moveTo(pin.x-8,pin.y-32);x.lineTo(pin.x+8,pin.y-32);x.lineTo(pin.x,pin.y);x.closePath();x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  }
});
H.btn(root,"↻ Recomeçar",()=>{over=false;sc=0;lives=5;speed=200;pin=null;slotX=250;hud.set("ac","0/8");hud.set("vd",5);hud.set("sc",0);},false);
}});"""

# 72 — Martelada no Tempo
GAMES[72] = r"""/* NCODE N · 072 Martelada no Tempo — bata no ponto */
GREG(72,{
init(root,H){
let over=false,nail=0,hits=0,strikes=0,pos=0,dir=1,speed=1.6,sc=0;
const hud=H.hud(root,[["pr","PREGOS","0/5"],["st","TORTOS","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> quando o marcador estiver no <b>verde</b>. 3 marteladas por prego, 5 pregos. 5 erros = fim!");
const o=H.cvs(root,500,300),x=o.x;
function hit(){
  if(over)return;
  if(pos>0.42&&pos<0.58){
    hits++;sc+=20;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(hits>=3){hits=0;nail++;speed+=.35;hud.set("pr",nail+"/5");H.sfx("pop");
      if(nail>=5){over=true;return H.done({win:true,score:sc+150,title:"Carpinteiro!",sub:"5 pregos retos, zero tortos."});}
      say("Prego "+(nail+1)/1+"! O ritmo acelera…");
    }
  }else{
    strikes++;hud.set("st",strikes+"/5");H.sfx("bad");
    if(strikes>=5){over=true;return H.done({win:false,score:sc,title:"Prego entortado!",sub:nail+" pregos antes do quinto erro."});}
    say("Torto! Erros: "+strikes+"/5.");
  }
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")hit();});
H.onTap(o,hit);
H.loop(dt=>{
  if(over)return;
  pos+=dir*speed*dt;
  if(pos>1){pos=1;dir=-1;}if(pos<0){pos=0;dir=1;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#a4764a";x.fillRect(40,190,o.W-80,50);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(40,190,o.W-80,50);
  for(let i=0;i<5;i++){
    const nx=90+i*80,down=i<nail?34:i===nail?hits*11:0;
    x.fillStyle=i<nail?H.C.ok:"#c9c5b8";
    x.fillRect(nx-4,120-down+30,8,70-down);
    x.strokeStyle=H.C.ink;x.strokeRect(nx-4,120-down+30,8,70-down);
    x.fillStyle=H.C.ink;x.fillRect(nx-9,112-down+30,18,8);
  }
  x.fillStyle=H.C.card;x.fillRect(40,40,o.W-80,44);
  x.strokeStyle=H.C.ink;x.strokeRect(40,40,o.W-80,44);
  x.fillStyle=H.C.ok;x.fillRect(40+(o.W-80)*0.42,40,(o.W-80)*0.16,44);
  x.fillStyle=H.C.gold;x.fillRect(40+(o.W-80)*0.34,40,(o.W-80)*0.08,44);
  x.fillRect(40+(o.W-80)*0.58,40,(o.W-80)*0.08,44);
  x.fillStyle=H.C.ink;x.fillRect(40+pos*(o.W-80)-3,34,6,56);
  x.font="🔨";x.font="34px serif";x.fillText("🔨",40+pos*(o.W-80)-17,130);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("prego "+(nail+1)+"/5 · marteladas "+hits+"/3",40,104);
});
H.btn(root,"🔨 MARTELO!",hit,true);
}});"""

# 73 — Prato Giratório
GAMES[73] = r"""/* NCODE N · 073 Prato Giratório — não deixe cair */
GREG(73,{
init(root,H){
let over=false,plates=[],t=60,lives=3,sc=0;
const hud=H.hud(root,[["tp","TEMPO",60],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Toque nos <b>pratos</b> para girá-los. Se o giro zerar, o prato cai! Sobreviva 60s.");
const o=H.cvs(root,500,380),x=o.x;
function build(){
  plates=[];t=60;lives=3;sc=0;
  for(let i=0;i<4;i++)plates.push({x:70+i*120,spin:70});
  hud.set("vd",3);hud.set("sc",0);
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const p of plates){
    if(Math.hypot(p.x-px,120-py)<52){p.spin=Math.min(100,p.spin+38);sc+=5;H.score(sc);hud.set("sc",sc);H.sfx("tick");return;}
  }
});
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;return H.done({win:true,score:sc+200,title:"Equilibrista!",sub:"60 segundos com 4 pratos no ar."});}
  const decay=11+(60-t)*0.12;
  for(const p of plates){
    p.spin-=decay*dt;
    if(p.spin<=0){
      lives--;hud.set("vd",lives);H.sfx("lose");p.spin=65;
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Louça quebrada!",sub:"3 pratos no chão. Gire os mais lentos primeiro!"});}
      say("💥 Prato caiu! Vidas: "+lives);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(0,o.H-24,o.W,24);
  for(const p of plates){
    x.fillStyle="#a4764a";x.fillRect(p.x-4,150,8,o.H-150-24);
    const wob=p.spin<25?Math.sin(Date.now()/60)*6:0;
    x.save();x.translate(p.x+wob,120);x.rotate(wob/40);
    x.fillStyle=p.spin<25?H.C.terra:H.C.card;
    x.beginPath();x.ellipse(0,0,46,14,0,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.strokeStyle=H.C.cement;x.beginPath();x.ellipse(0,0,26,8,0,0,7);x.stroke();
    x.restore();
    x.fillStyle=H.C.card;x.fillRect(p.x-40,52,80,10);
    x.fillStyle=p.spin<25?H.C.terra:H.C.ok;
    x.fillRect(p.x-40,52,80*Math.max(0,p.spin)/100,10);
    x.strokeStyle=H.C.ink;x.strokeRect(p.x-40,52,80,10);
  }
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 74 — Malabarista
GAMES[74] = r"""/* NCODE N · 074 Malabarista — mantenha as bolas no ar */
GREG(74,{
init(root,H){
const GOAL=40;
let over=false,balls=[],sc=0,lives=3,spawn=0;
const hud=H.hud(root,[["ct","PEGADAS","0/40"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Toque nas bolas <b>dentro da zona verde</b> para relançá-las. "+GOAL+" pegadas vencem — 3 quedas derrubam!");
const o=H.cvs(root,500,400),x=o.x;
const ZY=o.H-90;
function toss(b){
  b.x=o.W/2+(Math.random()-.5)*120;b.y=ZY;
  b.vx=(Math.random()-.5)*160;b.vy=-(420+Math.random()*160);
}
function build(){balls=[];sc=0;lives=3;spawn=0;
  const b={};toss(b);balls.push(b);
  hud.set("ct","0/"+GOAL);hud.set("vd",3);hud.set("sc",0);}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const b of balls){
    if(Math.hypot(b.x-px,b.y-py)<30&&b.y>ZY-110&&b.vy>0){
      toss(b);sc++;H.score(sc*10);hud.set("sc",sc*10);hud.set("ct",sc+"/"+GOAL);H.sfx("pop");
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*10+150,title:"Malabarista!",sub:GOAL+" pegadas sem deixar cair."});}
      if(sc%10===0&&balls.length<4){const nb={};toss(nb);balls.push(nb);say("➕ Mais uma bola no ar! ("+balls.length+")");}
      return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  for(const b of balls){
    b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.x<16){b.x=16;b.vx=Math.abs(b.vx);}
    if(b.x>o.W-16){b.x=o.W-16;b.vx=-Math.abs(vx(b));}
    if(b.y>o.H-16){
      lives--;hud.set("vd",lives);H.sfx("bad");toss(b);
      if(lives<=0){over=true;return H.done({win:false,score:sc*10,title:"Bolas no chão!",sub:sc+" pegadas. Toque só na zona verde!"});}
      say("Queda! Vidas: "+lives);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(196,214,69,.3)";x.fillRect(0,ZY-110,o.W,110);
  x.strokeStyle=H.C.ok;x.setLineDash([6,5]);
  x.beginPath();x.moveTo(0,ZY-110);x.lineTo(o.W,ZY-110);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ok;x.font="11px 'Space Mono',monospace";x.fillText("ZONA DE PEGADA",12,ZY-116);
  x.font="34px serif";x.fillText("🤹",o.W/2-17,o.H-24);
  const cols=[H.C.terra,H.C.gold,"#2E6E8A",H.C.ok];
  balls.forEach((b,i)=>{
    x.fillStyle=cols[i%4];x.beginPath();x.arc(b.x,b.y,14,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  });
});
function vx(b){return b.vx;}
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 75 — Buraco em Um
GAMES[75] = r"""/* NCODE N · 075 Buraco em Um — putt no buraco móvel */
GREG(75,{
init(root,H){
let over=false,hole=0,strokes=0,total=0,ball,hx,dir=1,aim=null;
const hud=H.hud(root,[["bh","BURACO","1/5"],["tc","TACADAS",0],["sc","TOTAL",0]]);
const say=H.msg(root,"<b>Arraste para trás</b> e solte para putt. O buraco desliza! 5 buracos em até 12 tacadas.");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
const TEES=[[80,330],[420,330],[80,90],[420,90],[250,330]];
function build(){
  const t=TEES[hole];
  ball={x:t[0],y:t[1],vx:0,vy:0};hx=250;strokes=0;
  hud.set("bh",(hole+1)+"/5");hud.set("tc",0);
}
build();
H.loop(dt=>{
  if(over)return;
  hx+=dir*(60+hole*22)*dt;
  if(hx>430){hx=430;dir=-1;}if(hx<70){hx=70;dir=1;}
  const hy=200;
  if(ptr.down&&ball&&Math.hypot(ball.vx,ball.vy)<5){
    if(!aim&&Math.hypot(ptr.x-ball.x,ptr.y-ball.y)<50)aim={x:ptr.x,y:ptr.y};
  }
  if(!ptr.down&&aim){
    ball.vx=(aim.x-ptr.x)*5;ball.vy=(aim.y-ptr.y)*5;
    strokes++;total++;hud.set("tc",strokes);hud.set("sc",total);aim=null;H.sfx("pop");
  }
  if(!ptr.down)aim=null;
  ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
  ball.vx*=0.985;ball.vy*=0.985;
  if(ball.x<14){ball.x=14;ball.vx*=-.7;}
  if(ball.x>o.W-14){ball.x=o.W-14;ball.vx*=-.7;}
  if(ball.y<14){ball.y=14;ball.vy*=-.7;}
  if(ball.y>o.H-14){ball.y=o.H-14;ball.vy*=-.7;}
  if(Math.hypot(ball.x-hx,ball.y-hy)<16&&Math.hypot(ball.vx,ball.vy)<260){
    H.sfx("ok");hole++;
    if(hole>=5){over=true;
      return total<=12?H.done({win:true,score:200-total*10,title:"Abaixo do par!",sub:"5 buracos em "+total+" tacadas."})
                      :H.done({win:false,score:100,title:"Acima do par",sub:total+" tacadas (limite 12). Seja mais econômico!"});
    }
    say("Buraco "+hole+"! Tacadas até aqui: "+total+".");build();
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(255,255,255,.12)";
  for(let i=0;i<6;i++)x.fillRect(0,i*70,o.W,34);
  x.strokeStyle=H.C.paper;x.setLineDash([5,5]);
  x.beginPath();x.moveTo(70,200);x.lineTo(430,200);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ink;x.beginPath();x.arc(hx,hy,14,0,7);x.fill();
  x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
  x.strokeStyle=H.C.terra;x.lineWidth=3;
  x.beginPath();x.moveTo(hx,hy);x.lineTo(hx,hy-44);x.stroke();
  x.fillStyle=H.C.terra;x.beginPath();x.moveTo(hx,hy-44);x.lineTo(hx+18,hy-38);x.lineTo(hx,hy-32);x.fill();
  x.fillStyle="#fff";x.beginPath();x.arc(ball.x,ball.y,8,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.stroke();
  if(aim){
    x.strokeStyle="#fff";x.setLineDash([5,5]);
    x.beginPath();x.moveTo(ball.x,ball.y);x.lineTo(ball.x+(aim.x-ptr.x)*1.5,ball.y+(aim.y-ptr.y)*1.5);x.stroke();
    x.setLineDash([]);
  }
});
}});"""

# 76 — Chuva de Flechas
GAMES[76] = r"""/* NCODE N · 076 Chuva de Flechas — dance entre as zonas */
GREG(76,{
init(root,H){
let over=false,lane=2,t=45,lives=3,shots=[],warn=[],sc=0,spawn=0;
const hud=H.hud(root,[["tp","TEMPO",45],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mova-se com <b>◀ ▶ / toque nas faixas</b>. Saia das <b>zonas vermelhas</b> antes das flechas caírem! Sobreviva 45s.");
const o=H.cvs(root,500,400),x=o.x;
const LANES=[70,170,270,370,460];
function build(){lane=2;t=45;lives=3;shots=[];warn=[];sc=0;hud.set("vd",3);}
build();
function move(d){if(over)return;lane=H.clamp(lane+d,0,4);H.sfx("tick");}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;if(c==="ArrowLeft")move(-1);if(c==="ArrowRight")move(1);});
H.onTap(o,(px)=>{const l=Math.round((px-70)/100);lane=H.clamp(l,0,4);});
H.loop(dt=>{
  if(over)return;
  t-=dt;sc+=dt;H.score(Math.floor(sc*10));hud.set("sc",Math.floor(sc*10));
  hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;return H.done({win:true,score:Math.floor(sc*10)+150,title:"Intocado!",sub:"45 segundos de chuva sem um arranhão."});}
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.5,1.1-t*0.012);
    const n=1+Math.floor(Math.random()*2);
    const order=H.shuffle(Math.random,[0,1,2,3,4]).slice(0,n);
    for(const L of order)warn.push({lane:L,ttl:.9});
  }
  for(let i=warn.length-1;i>=0;i--){
    warn[i].ttl-=dt;
    if(warn[i].ttl<=0){shots.push({lane:warn[i].lane,y:-20});warn.splice(i,1);H.beep(500,.05);}
  }
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];s.y+=520*dt;
    if(s.y>o.H-120&&s.y<o.H-40&&s.lane===lane){
      shots.splice(i,1);lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:Math.floor(sc*10),title:"Flechado!",sub:"Sobreviveu "+(45-Math.ceil(t))+"s. Fuja do vermelho!"});}
      say("🏹 Ai! Vidas: "+lives);continue;
    }
    if(s.y>o.H+20)shots.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  LANES.forEach((lx,i)=>{
    const hot=warn.some(w=>w.lane===i);
    x.fillStyle=hot?"rgba(217,78,52,.25)":i%2?"#EDE8DC":H.C.card;
    x.fillRect(lx-48,0,96,o.H);
    if(hot){x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";x.fillText("⚠",lx-8,30);}
  });
  for(const s of shots){
    const lx=LANES[s.lane];
    x.strokeStyle=H.C.ink;x.lineWidth=3;
    x.beginPath();x.moveTo(lx,s.y-22);x.lineTo(lx,s.y);x.stroke();
    x.fillStyle=H.C.ink;
    x.beginPath();x.moveTo(lx-6,s.y-8);x.lineTo(lx+6,s.y-8);x.lineTo(lx,s.y+4);x.closePath();x.fill();
  }
  x.font="32px serif";x.fillText("🧍",LANES[lane]-16,o.H-70);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 77 — Bolha Escudo
GAMES[77] = r"""/* NCODE N · 077 Bolha Escudo — infle e ricocheteie */
GREG(77,{
init(root,H){
const LV=[{len:1400,gap:150},{len:1700,gap:130},{len:2000,gap:112}];
let lv=0,over=false,bx,by,vy,air,on,dist,spikes,lives=3,sc=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["ar","AR",100],["vd","VIDAS",3]]);
const say=H.msg(root,"<b>Segure toque/Espaço</b> para inflar a bolha (gasta ar). Com bolha, espinhos <b>ricocheteiam</b>; sem bolha, machucam!");
const o=H.cvs(root,520,340),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
let held=false;
function build(){
  bx=90;by=o.H/2;vy=0;air=100;dist=0;spikes=[];
  const L=LV[lv],r=H.rng(300+lv*55);
  for(let d=300;d<L.len;d+=170+r()*120){
    const top=r()<.5,sz=26+r()*20;
    const gy=top?0:o.H-sz;
    spikes.push({d,top,sz,gap:L.gap});
    if(r()<.4)spikes.push({d:d+90,top:!top,sz:26,gap:L.gap});
  }
  hud.set("nv",lv+1);hud.set("vd",lives);
}
build();
kb.on((c,d)=>{if(c==="Space")held=d;});
H.loop(dt=>{
  if(over)return;
  on=held||ptr.down;
  air=H.clamp(air+(on?-32:22)*dt,0,100);
  hud.set("ar",Math.round(air));
  const bub=on&&air>0;
  vy+=bub?-200*dt:500*dt;vy=H.clamp(vy,-260,300);
  if(kb.is("ArrowUp"))vy-=700*dt;
  if(kb.is("ArrowDown"))vy+=700*dt;
  by+=vy*dt;dist+=150*dt;
  by=H.clamp(by,20,o.H-20);
  for(const s of spikes){
    const sx=s.d-dist;
    if(sx>bx-70&&sx<bx+20){
      const hitY=s.top?by<s.sz+16:by>o.H-s.sz-16;
      if(hitY){
        if(bub){vy=s.top?260:-260;bx+=14;air=Math.max(0,air-18);H.sfx("pop");}
        else{
          lives--;hud.set("vd",lives);H.sfx("bad");by=o.H/2;vy=0;
          if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Bolha furada!",sub:"Nível "+(lv+1)+". Infle antes dos espinhos!"});}
          say("Espinho! Vidas: "+lives);
          break;
        }
      }
    }
  }
  sc=Math.floor(dist/10)+(lv*200);H.score(sc);
  if(dist>=LV[lv].len){
    H.sfx("ok");
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Travessia blindada!",sub:"3 corredores de espinhos ricocheteados."});}
    lv++;say("Nível "+(lv+1)+": corredor mais estreito!");build();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,0,o.W,14);x.fillRect(0,o.H-14,o.W,14);
  for(const s of spikes){
    const sx=s.d-dist;
    if(sx<-40||sx>o.W+40)continue;
    x.fillStyle=H.C.ink;
    if(s.top){x.beginPath();x.moveTo(sx,s.sz);x.lineTo(sx+18,s.sz);x.lineTo(sx+9,0);x.closePath();x.fill();}
    else{x.beginPath();x.moveTo(sx,o.H-s.sz);x.lineTo(sx+18,o.H-s.sz);x.lineTo(sx+9,o.H);x.closePath();x.fill();}
  }
  if(bub){
    x.fillStyle="rgba(46,110,138,.3)";x.beginPath();x.arc(bx,by,24,0,7);x.fill();
    x.strokeStyle="#2E6E8A";x.lineWidth=2;x.stroke();
  }
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,12,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(Math.floor(dist)+"m / "+LV[lv].len+"m",12,30);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over){lives=3;build();}},false);
}});"""

# 78 — Reação em Cadeia
GAMES[78] = r"""/* NCODE N · 078 Reação em Cadeia — um toque, tudo estoura */
GREG(78,{
init(root,H){
const LV=[{n:22,taps:3,quota:10},{n:25,taps:2,quota:15},{n:28,taps:1,quota:18}];
let lv=0,over=false,dots,bangs,left,popped;
const hud=H.hud(root,[["nv","NÍVEL",1],["tq","TOQUES",3],["pp","ESTOUROS",0]]);
const say=H.msg(root,"Toque para detonar uma <b>bolha expansiva</b>. Bolhas tocam bolas e encadeiam. Bata a meta de estouros!");
const o=H.cvs(root,500,400),x=o.x;
function build(){
  const L=LV[lv],r=H.rng(900+lv*31);
  dots=[];bangs=[];popped=0;left=L.taps;
  for(let i=0;i<L.n;i++)dots.push({x:30+r()*440,y:30+r()*340,
    vx:(r()-.5)*90,vy:(r()-.5)*90,r:9});
  hud.set("nv",lv+1);hud.set("tq",left);hud.set("pp","0/"+L.quota);
  say("Nível "+(lv+1)+": "+L.taps+" toques para "+L.quota+" estouros em "+L.n+" bolas.");
}
build();
H.onTap(o,(px,py)=>{
  if(over||left<=0)return;
  left--;hud.set("tq",left);
  bangs.push({x:px,y:py,r:4,grow:true});
  H.sfx("pop");
});
H.loop(dt=>{
  if(over)return;
  for(const d of dots){
    d.x+=d.vx*dt;d.y+=d.vy*dt;
    if(d.x<12||d.x>o.W-12)d.vx*=-1;
    if(d.y<12||d.y>o.H-12)d.vy*=-1;
  }
  for(const b of bangs){
    if(b.grow){b.r+=70*dt;if(b.r>46)b.grow=false;}
    else b.r-=40*dt;
  }
  bangs=bangs.filter(b=>b.r>1);
  for(let i=dots.length-1;i>=0;i--){
    const d=dots[i];
    if(bangs.some(b=>Math.hypot(b.x-d.x,b.y-d.y)<b.r+d.r)){
      dots.splice(i,1);popped++;
      bangs.push({x:d.x,y:d.y,r:6,grow:true});
      H.beep(400+popped*20,.06,"square",.04);
      hud.set("pp",popped+"/"+LV[lv].quota);
    }
  }
  if(!bangs.length&&left>=0&&dots.length){
    if(popped>=LV[lv].quota){
      H.sfx("ok");const sc=(lv+1)*120+popped*5;H.score(sc);
      if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Reação total!",sub:"3 detonações em cadeia acima da meta."});}
      lv++;build();
    }else if(left<=0){
      over=true;return H.done({win:false,score:popped*5,title:"Cadeia fraca",sub:popped+"/"+LV[lv].quota+" estouros. Mire onde as bolas se juntam!"});
    }
  }
  if(!dots.length&&!over){
    H.sfx("ok");const sc=(lv+1)*120+popped*5+100;H.score(sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc,title:"Tabuleiro limpo!",sub:"Todas as bolas estouradas em cadeia."});}
    lv++;build();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const b of bangs){
    x.strokeStyle=H.C.terra;x.lineWidth=3;
    x.beginPath();x.arc(b.x,b.y,Math.max(1,b.r),0,7);x.stroke();
    x.fillStyle="rgba(217,78,52,.15)";
    x.beginPath();x.arc(b.x,b.y,Math.max(1,b.r),0,7);x.fill();
  }
  for(const d of dots){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(d.x,d.y,d.r,0,7);x.fill();
    x.fillStyle=H.C.wasabi;x.beginPath();x.arc(d.x,d.y,d.r-4,0,7);x.fill();
  }
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
}});"""

# 79 — Defesa Digitada
GAMES[79] = r"""/* NCODE N · 079 Defesa Digitada — destrua com palavras */
GREG(79,{
init(root,H){
const WORDS=["sol","mar","lua","rede","fogo","vento","planta","estrela","trovão","cavalo","janela","rio","ponte","areia","nuvem","papel","tinta","trem","festa","jardim","lago","monte","vale","canto"];
let over=false,foes=[],buf="",lock=-1,wave=0,sc=0,lives=3,spawn=0,kills=0;
const QUOTA=[6,8,10];
const hud=H.hud(root,[["wv","ONDA","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Digite as <b>letras</b> das palavras (teclado físico ou teclado da tela). Complete para destruir antes que cheguem!");
const o=H.cvs(root,500,360),x=o.x;
function startWave(){
  wave++;kills=0;buf="";lock=-1;foes=[];spawn=0;
  hud.set("wv",wave+"/3");say("🌊 Onda "+wave+": destrua "+QUOTA[wave-1]+" invasores!");
}
startWave();
function feed(ch){
  if(over)return;
  ch=ch.toLowerCase();
  if(lock<0||!foes[lock]){
    const cand=foes.findIndex(f=>f.w[0]===ch);
    if(cand<0){H.beep(180,.07,"sawtooth",.05);return;}
    lock=cand;buf="";
  }
  const f=foes[lock];
  if(!f){lock=-1;return;}
  if(f.w[buf.length]===ch){
    buf+=ch;H.beep(600+buf.length*40,.05,"square",.035);
    if(buf.length>=f.w.length){
      foes.splice(lock,1);lock=-1;buf="";kills++;
      sc+=f.w.length*10;H.score(sc);hud.set("sc",sc);H.sfx("pop");
      if(kills>=QUOTA[wave-1]){
        if(wave>=3){over=true;return H.done({win:true,score:sc+150,title:"Teclado flamejante!",sub:"3 ondas destruídas letra a letra."});}
        startWave();
      }
    }
  }else{H.beep(180,.07,"sawtooth",.05);buf="";lock=-1;}
}
const kb=H.keys();
kb.on((c,d,ev)=>{
  if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(m)feed(m[1]);
  if(c==="Backspace"||c==="Escape"){buf="";lock=-1;}
});
H.onTap(o,(px,py)=>{
  const i=foes.findIndex(f=>py>f.y-20&&py<f.y+24);
  if(i>=0){lock=i;buf="";H.sfx("tick");}
});
const kbBox=H.el("div","g-col",null,root);
["QWERTYUIOP","ASDFGHJKLÇ","ZXCVBNM"].forEach(row=>{
  const r=H.el("div","g-row",null,kbBox);
  r.style.justifyContent="center";
  [...row].forEach(ch=>{
    const b=H.el("button","g-chip",ch,r);
    b.style.cursor="pointer";b.style.minWidth="26px";b.style.textAlign="center";
    b.addEventListener("click",()=>feed(ch));
  });
});
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&foes.length<5&&kills+foes.length<QUOTA[wave-1]+2){spawn=1.6;
    const w=WORDS[Math.floor(Math.random()*WORDS.length)];
    foes.push({w,x:60+Math.random()*380,y:-10,sp:26+wave*8});}
  for(let i=foes.length-1;i>=0;i--){
    const f=foes[i];f.y+=f.sp*dt;
    if(f.y>o.H-40){
      foes.splice(i,1);if(lock===i){lock=-1;buf="";}
      lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Base invadida!",sub:"3 invasores passaram. Digite mais rápido!"});}
      say("👾 Passou um! Vidas: "+lives);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.terra;x.fillRect(0,o.H-24,o.W,24);
  x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";x.fillText("⚠ LINHA DA BASE",o.W/2-70,o.H-7);
  foes.forEach((f,i)=>{
    x.font="18px 'Space Mono',monospace";
    const tw=x.measureText(f.w).width;
    x.fillStyle=i===lock?H.C.wasabi:H.C.card;
    x.fillRect(f.x-tw/2-10,f.y-20,tw+20,32);
    x.strokeStyle=H.C.ink;x.lineWidth=i===lock?3:1.5;
    x.strokeRect(f.x-tw/2-10,f.y-20,tw+20,32);
    x.font="bold 18px 'Space Mono',monospace";
    const done=f.w.slice(0,i===lock?buf.length:0),rest=f.w.slice(i===lock?buf.length:0);
    x.fillStyle=H.C.terra;x.fillText(done,f.x-tw/2,f.y+4);
    x.fillStyle=H.C.ink;x.fillText(rest,f.x-tw/2+x.measureText(done).width,f.y+4);
    x.font="20px serif";x.fillText("👾",f.x-10,f.y-24);
  });
});
}});"""

# 80 — Gravidade Flip Runner
GAMES[80] = r"""/* NCODE N · 080 Gravidade Flip Runner — corra no chão e no teto */
GREG(80,{
init(root,H){
const GOAL=1300;
let over=false,px,py,vy,g,obs,dist,speed,sc=0,spawn=0;
const hud=H.hud(root,[["ds","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> inverte a gravidade entre chão e teto. Desvie dos blocos por "+GOAL+"m!");
const o=H.cvs(root,520,320),x=o.x;
const GF=o.H-46,CT=46;
function build(){px=120;py=GF;vy=0;g=1;obs=[];dist=0;speed=240;spawn=1;}
build();
function flip(){if(over)return;g*=-1;vy=0;H.beep(g>0?300:520,.07,"square",.04);}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")flip();});
H.onTap(o,flip);
H.loop(dt=>{
  if(over)return;
  vy+=g*2200*dt;py+=vy*dt;
  if(g>0&&py>=GF){py=GF;vy=0;}
  if(g<0&&py<=CT){py=CT;vy=0;}
  dist+=speed*dt/26;speed+=dt*6;
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.62,1.25-dist*0.0004);
    obs.push({x:o.W+20,top:Math.random()<.5,w:26+Math.random()*22});}
  for(const b of obs)b.x-=speed*dt;
  obs=obs.filter(b=>b.x>-50);
  for(const b of obs){
    const by=b.top?CT:GF-44;
    if(px+14>b.x&&px-14<b.x+b.w&&((g>0&&!b.top)||(g<0&&b.top))){
      if(py+14>by&&py-14<by+44){over=true;H.sfx("lose");
        return H.done({win:false,score:Math.floor(dist),title:"Esmagado!",sub:Math.floor(dist)+"m de "+GOAL+". Inverta antes do bloco!"});}
    }
  }
  sc=Math.floor(dist);H.score(sc);hud.set("sc",sc);hud.set("ds",sc+"m");
  if(dist>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Mestre da gravidade!",sub:GOAL+"m entre chão e teto."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(0,GF+16,o.W,o.H-GF);x.fillRect(0,0,o.W,CT-16);
  x.fillStyle=H.C.wasabi;x.fillRect(0,GF+14,o.W,3);x.fillRect(0,CT-17,o.W,3);
  for(const b of obs){
    const by=b.top?CT:GF-44;
    x.fillStyle=H.C.terra;x.fillRect(b.x,by,b.w,44);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(b.x,by,b.w,44);
    x.fillStyle=H.C.gold;x.fillRect(b.x,by,b.w,6);
  }
  x.save();x.translate(px,py);if(g<0)x.scale(1,-1);
  x.fillStyle=H.C.ink;x.fillRect(-13,-30,26,30);
  x.fillStyle=H.C.terra;x.fillRect(-13,-30,26,7);
  x.fillStyle="#fff";x.fillRect(2,-24,6,6);
  x.restore();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(g>0?"GRAV ▼ CHÃO":"GRAV ▲ TETO",12,o.H/2);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
