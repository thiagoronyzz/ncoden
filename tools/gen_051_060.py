#!/usr/bin/env python3
"""Gera games/g051..g060 — ARCADE (parte 2)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 51 — Quebra-Tijolos
GAMES[51] = r"""/* NCODE N · 051 Quebra-Tijolos — rebata e destrua */
GREG(51,{
init(root,H){
const LAYOUTS=[
 ["11111","22222","33333","11111"],
 ["13131","32323","13131","32323","11111"],
 ["33333","3...3","32223","3...3","33333"]
];
const BC=["",H.C.terra,H.C.gold,H.C.ok];
let lv=0,over=false,px,bx,by,vx,vy,br=[],lives=3,sc=0,stuck=true;
const hud=H.hud(root,[["nv","NÍVEL",1],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mova a raquete com <b>mouse, toque ou setas</b>. Clique/Espaço lança a bola grudada.");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  px=o.W/2;br=[];
  const L=LAYOUTS[lv];
  L.forEach((row,r)=>{[...row].forEach((ch,c)=>{
    if(ch!==".")br.push({x:30+c*44,y:50+r*26,hp:+ch});
  });});
  reset();hud.set("nv",lv+1);
}
function reset(){bx=px;by=o.H-50;vx=0;vy=0;stuck=true;}
function launch(){if(!stuck||over)return;stuck=false;
  const a=-Math.PI/2+(Math.random()-.5)*.8;
  vx=Math.cos(a)*330;vy=Math.sin(a)*330;H.sfx("pop");}
kb.on((c,d)=>{if(d&&c==="Space")launch();});
H.onTap(o,()=>launch());
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))px-=380*dt;
  if(kb.is("ArrowRight"))px+=380*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*12);
  px=H.clamp(px,50,o.W-50);
  if(stuck){bx=px;by=o.H-50;}
  else{
    bx+=vx*dt;by+=vy*dt;
    if(bx<12){bx=12;vx=Math.abs(vx);H.beep(220,.04);}
    if(bx>o.W-12){bx=o.W-12;vx=-Math.abs(vx);H.beep(220,.04);}
    if(by<12){by=12;vy=Math.abs(vy);H.beep(220,.04);}
    if(vy>0&&by>o.H-58&&by<o.H-38&&Math.abs(bx-px)<52){
      const off=(bx-px)/52;
      const sp=Math.min(520,Math.hypot(vx,vy)+8);
      const a=-Math.PI/2+off*.9;
      vx=Math.cos(a)*sp;vy=Math.sin(a)*sp;H.beep(440,.05);
    }
    for(let i=br.length-1;i>=0;i--){
      const b=br[i];
      if(bx>b.x&&bx<b.x+40&&by>b.y&&by<b.y+22){
        b.hp--;vy*=-1;
        if(b.hp<=0){br.splice(i,1);sc+=20;}
        else sc+=5;
        H.score(sc);hud.set("sc",sc);H.sfx("tick");break;
      }
    }
    if(!br.length){
      H.sfx("ok");
      if(lv>=LAYOUTS.length-1){over=true;return H.done({win:true,score:sc+150,title:"Parede demolida!",sub:"3 fases de tijolos viraram pó."});}
      lv++;say("Fase "+(lv+1)+": tijolos mais duros!");build();return;
    }
    if(by>o.H+10){
      lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Sem bolas",sub:sc+" pontos. Mire os cantos da raquete!"});}
      say("Bola perdida! Restam "+lives+".");reset();
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.paper2;x.fillRect(0,0,o.W,40);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";x.fillText("// FASE "+(lv+1),14,24);
  for(const b of br){
    x.fillStyle=BC[b.hp];x.fillRect(b.x,b.y,40,22);
    x.strokeStyle=H.C.ink;x.lineWidth=1.5;x.strokeRect(b.x,b.y,40,22);
    if(b.hp>1){x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";x.fillText(b.hp,b.x+16,b.y+16);}
  }
  x.fillStyle=H.C.ink;x.fillRect(px-50,o.H-48,100,12);
  x.fillStyle=H.C.wasabi;x.fillRect(px-50,o.H-48,100,4);
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,8,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
});
build();
}});"""

# 52 — Peixe Comilão
GAMES[52] = r"""/* NCODE N · 052 Peixe Comilão — coma os menores, fuja dos maiores */
GREG(52,{
init(root,H){
let over=false,px,py,size=14,eaten=0,fish=[],sc=0,spawn=0;
const hud=H.hud(root,[["tm","TAMANHO",14],["ct","COMIDOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Nade com <b>mouse, toque ou setas</b>. Coma peixes <b>menores</b> que você. Cresça até 40!");
const o=H.cvs(root,520,380),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
px=o.W/2;py=o.H/2;
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))px-=240*dt;if(kb.is("ArrowRight"))px+=240*dt;
  if(kb.is("ArrowUp"))py-=240*dt;if(kb.is("ArrowDown"))py+=240*dt;
  if(ptr.down){px+=(ptr.x-px)*Math.min(1,dt*6);py+=(ptr.y-py)*Math.min(1,dt*6);}
  px=H.clamp(px,20,o.W-20);py=H.clamp(py,20,o.H-20);
  spawn-=dt;
  if(spawn<=0){spawn=.5;
    const left=Math.random()<.5;
    const s=8+Math.random()*36;
    fish.push({x:left?-20:o.W+20,y:20+Math.random()*(o.H-40),vx:(left?1:-1)*(50+Math.random()*70),s,
      c:s<size-2?H.C.wasabi:s>size+2?H.C.terra:H.C.gold});
  }
  for(let i=fish.length-1;i>=0;i--){
    const f=fish[i];f.x+=f.vx*dt;
    if(f.x<-40||f.x>o.W+40){fish.splice(i,1);continue;}
    if(Math.hypot(f.x-px,f.y-py)<(f.s+size)/2+4){
      if(f.s<size-2){fish.splice(i,1);eaten++;size=Math.min(46,size+1.1);sc+=10;
        H.score(sc);hud.set("sc",sc);hud.set("ct",eaten);hud.set("tm",Math.round(size));H.sfx("pop");
        if(size>=40){over=true;return H.done({win:true,score:sc+150,title:"Rei do lago!",sub:eaten+" peixes devorados até o tamanho máximo."});}
      }else if(f.s>size+2){over=true;H.sfx("lose");
        return H.done({win:false,score:sc,title:"Virou lanche!",sub:"Um peixe maior te comeu. Cresça comendo os verdes!"});
      }
    }
  }
  x.fillStyle="#274b5e";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle="rgba(255,255,255,.15)";
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(0,60+i*70+Math.sin(Date.now()/800+i)*6);x.lineTo(o.W,60+i*70);x.stroke();}
  for(const f of fish){
    x.fillStyle=f.c;x.beginPath();x.ellipse(f.x,f.y,f.s,f.s*.55,f.vx>0?0:Math.PI,0,7);x.fill();
    x.fillStyle=H.C.paper;x.beginPath();x.arc(f.x+(f.vx>0?f.s*.5:-f.s*.5),f.y-2,2.5,0,7);x.fill();
  }
  const dir=ptr.down?(ptr.x>px?1:-1):1;
  x.fillStyle=H.C.ink;x.beginPath();x.ellipse(px,py,size,size*.55,0,0,7);x.fill();
  x.strokeStyle=H.C.wasabi;x.lineWidth=3;x.stroke();
  x.fillStyle="#fff";x.beginPath();x.arc(px+dir*size*.5,py-3,4,0,7);x.fill();
  x.fillStyle="#fff";x.font="11px 'Space Mono',monospace";
  x.fillText("verde=comer · vermelho=fugir",12,20);
});
}});"""

# 53 — Helicóptero no Túnel
GAMES[53] = r"""/* NCODE N · 053 Helicóptero no Túnel — segure para subir */
GREG(53,{
init(root,H){
const GOAL=1200;
let over=false,hx,hy,vy,segs,dist,sc=0;
const hud=H.hud(root,[["ds","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Segure toque/Espaço</b> para subir, solte para descer. Atravesse "+GOAL+"m de túnel!");
const o=H.cvs(root,520,340),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
let held=false;
function build(){
  hx=110;hy=o.H/2;vy=0;dist=0;sc=0;segs=[];
  let gy=o.H/2-70;
  for(let i=0;i<40;i++){gy=H.clamp(gy+(Math.random()-.5)*70,30,o.H-160);segs.push({x:i*90,gap:gy,h:150-Math.min(60,i*2)});}
}
build();
kb.on((c,d)=>{if(c==="Space")held=d;});
H.loop(dt=>{
  if(over)return;
  const up=held||ptr.down;
  vy+=1500*dt;if(up)vy-=2600*dt;
  vy=H.clamp(vy,-330,330);hy+=vy*dt;dist+=140*dt/22;
  const scroll=dist*22;
  const idx=Math.floor((scroll+hx)/90);
  const s=segs[Math.min(segs.length-1,Math.max(0,idx))];
  if(s&&(hy<s.gap+14||hy>s.gap+s.h-14)){over=true;H.sfx("lose");
    return H.done({win:false,score:Math.floor(dist),title:"Bateu no túnel!",sub:Math.floor(dist)+"m de "+GOAL+". Toques curtos estabilizam!"});}
  if(hy<-10||hy>o.H+10){over=true;H.sfx("lose");
    return H.done({win:false,score:Math.floor(dist),title:"Saiu do túnel!",sub:Math.floor(dist)+"m percorridos."});}
  sc=Math.floor(dist);H.score(sc);hud.set("sc",sc);hud.set("ds",sc+"m");
  if(dist>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Pouso perfeito!",sub:GOAL+"m de túnel sem um arranhão."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;
  for(const g of segs){
    const sx=g.x-scroll;
    if(sx<-100||sx>o.W+100)continue;
    x.fillRect(sx,0,90,g.gap);x.fillRect(sx,g.gap+g.h,90,o.H-g.gap-g.h);
    x.fillStyle=H.C.wasabi;x.fillRect(sx,g.gap-4,90,4);x.fillRect(sx,g.gap+g.h,90,4);
    x.fillStyle=H.C.ink;
  }
  x.save();x.translate(hx,hy);
  x.fillStyle=H.C.terra;x.fillRect(-22,-10,44,18);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-22,-10,44,18);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  const r=(Date.now()/40)%40;
  x.beginPath();x.moveTo(-34,-12);x.lineTo(34,-12);x.stroke();
  x.beginPath();x.moveTo(-22,8);x.lineTo(-30,20);x.moveTo(22,8);x.lineTo(30,20);x.stroke();
  x.restore();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 54 — Escudo Planetário
GAMES[54] = r"""/* NCODE N · 054 Escudo Planetário — gire o escudo, bloqueie */
GREG(54,{
init(root,H){
let over=false,ang=0,mets=[],sc=0,lives=3,blocked=0,spawn=0;
const hud=H.hud(root,[["bl","BLOQUEIOS","0/40"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Gire o escudo com <b>mouse, toque ou ◀ ▶</b>. Bloqueie 40 meteoros antes que 3 atinjam o planeta!");
const o=H.cvs(root,480,440),x=o.x;
const cx=o.W/2,cy=o.H/2,PR=44,SR=86;
const ptr=H.ptr(o);const kb=H.keys();
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))ang-=3*dt;
  if(kb.is("ArrowRight"))ang+=3*dt;
  if(ptr.down)ang=Math.atan2(ptr.y-cy,ptr.x-cx);
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.35,.9-blocked*0.012);
    const a=Math.random()*6.28,R=Math.max(o.W,o.H)/2+20;
    mets.push({x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,a,sp:60+blocked*2+Math.random()*30});
  }
  for(let i=mets.length-1;i>=0;i--){
    const m=mets[i];
    m.x-=Math.cos(m.a)*m.sp*dt;m.y-=Math.sin(m.a)*m.sp*dt;
    const d=Math.hypot(m.x-cx,m.y-cy);
    if(d<SR+12&&d>SR-22){
      let da=Math.abs(((m.a-ang)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);
      if(da<0.55){mets.splice(i,1);blocked++;sc+=15;
        H.score(sc);hud.set("sc",sc);hud.set("bl",blocked+"/40");H.sfx("pop");
        if(blocked>=40){over=true;return H.done({win:true,score:sc+150,title:"Planeta intacto!",sub:"40 meteoros rebatidos pelo escudo."});}
        continue;}
    }
    if(d<PR+8){mets.splice(i,1);lives--;hud.set("vd",lives);H.sfx("lose");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Planeta em chamas!",sub:blocked+" bloqueios antes do impacto final."});}
      say("☄️ Impacto! Vidas: "+lives);
    }
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#2E6E8A";x.beginPath();x.arc(cx,cy,PR,0,7);x.fill();
  x.fillStyle=H.C.ok;x.beginPath();x.arc(cx-12,cy-8,12,0,7);x.arc(cx+14,cy+10,9,0,7);x.fill();
  x.strokeStyle=H.C.wasabi;x.lineWidth=10;
  x.beginPath();x.arc(cx,cy,SR,ang-.55,ang+.55);x.stroke();
  x.strokeStyle=H.C.paper;x.lineWidth=2;
  x.beginPath();x.arc(cx,cy,SR,ang-.55,ang+.55);x.stroke();
  for(const m of mets){
    x.fillStyle="#8A877C";x.beginPath();x.arc(m.x,m.y,10,0,7);x.fill();
    x.strokeStyle=H.C.terra;x.lineWidth=2;x.stroke();
  }
});
}});"""

# 55 — Balde de Chuva
GAMES[55] = r"""/* NCODE N · 055 Balde de Chuva — pegue água, evite lama */
GREG(55,{
init(root,H){
let over=false,px=250,drops=[],sc=0,lives=3,t=60,spawn=0;
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Mova o balde com <b>mouse, toque ou setas</b>. Gotas 💧 +10, lama 🟤 −1 vida!");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=250?H.done({win:true,score:sc,title:"Balde cheio!",sub:sc+" pontos de água pura."})
                  :H.done({win:false,score:sc,title:"Balde raso",sub:"Meta 250 — você fez "+sc+". Cubra mais área!"});}
  if(kb.is("ArrowLeft"))px-=340*dt;
  if(kb.is("ArrowRight"))px+=340*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*10);
  px=H.clamp(px,40,o.W-40);
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.18,.5-t*0.004);
    drops.push({x:20+Math.random()*(o.W-40),y:-16,vy:180+Math.random()*120,mud:Math.random()<.25});}
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i];d.y+=d.vy*dt;
    if(d.y>o.H-84&&d.y<o.H-30&&Math.abs(d.x-px)<36){
      drops.splice(i,1);
      if(d.mud){lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Balde de lama!",sub:sc+" pontos antes da terceira lama."});}
        say("🟤 Lama! Vidas: "+lives);
      }else{sc+=10;H.score(sc);hud.set("sc",sc);H.beep(700,.05,"sine",.04);}
    }else if(d.y>o.H+16)drops.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#2E6E8A";
  for(let i=0;i<3;i++){x.beginPath();x.ellipse(90+i*160,34,70,20,0,0,7);x.fill();}
  x.fillStyle=H.C.ink;
  for(const d of drops){
    if(d.mud){x.fillStyle="#6b4a2f";x.beginPath();x.arc(d.x,d.y,9,0,7);x.fill();}
    else{x.fillStyle="#2E6E8A";x.beginPath();x.ellipse(d.x,d.y,6,10,0,0,7);x.fill();}
  }
  x.fillStyle=H.C.terra;
  x.beginPath();x.moveTo(px-32,o.H-70);x.lineTo(px+32,o.H-70);x.lineTo(px+26,o.H-16);x.lineTo(px-26,o.H-16);x.closePath();x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
});
}});"""

# 56 — Balão Estouro
GAMES[56] = r"""/* NCODE N · 056 Balão Estouro — estoure antes de voar */
GREG(56,{
init(root,H){
let over=false,bals=[],sc=0,t=45,spawn=0,esc=0;
const hud=H.hud(root,[["sc","PONTOS",0],["fg","FUGAS",0],["tp","TEMPO",45]]);
const say=H.msg(root,"Toque nos balões para estourar (10 pts). <b>Dourado = 50!</b> Preto 💀 tira 20. 10 fugas = fim!");
const o=H.cvs(root,480,420),x=o.x;
H.onTap(o,(px,py)=>{
  if(over)return;
  for(let i=bals.length-1;i>=0;i--){
    const b=bals[i];
    if(Math.hypot(b.x-px,b.y-py)<26){
      bals.splice(i,1);
      if(b.k==="gold"){sc+=50;H.sfx("ok");}
      else if(b.k==="bad"){sc=Math.max(0,sc-20);H.sfx("bad");}
      else{sc+=10;H.sfx("pop");}
      H.score(sc);hud.set("sc",sc);return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=300?H.done({win:true,score:sc,title:"Estouro total!",sub:sc+" pontos em 45 segundos."})
                  :H.done({win:false,score:sc,title:"Muitos voaram",sub:"Meta 300 — você fez "+sc+". Priorize os dourados!"});}
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.2,.6-t*0.006);
    const r=Math.random();
    bals.push({x:30+Math.random()*(o.W-60),y:o.H+24,vy:-(90+Math.random()*90),
      k:r<.12?"gold":r<.26?"bad":"ok",ph:Math.random()*6});}
  for(let i=bals.length-1;i>=0;i--){
    const b=bals[i];b.y+=b.vy*dt;b.ph+=dt*3;b.x+=Math.sin(b.ph)*20*dt;
    if(b.y<-30){bals.splice(i,1);
      if(b.k!=="bad"){esc++;hud.set("fg",esc);
        if(esc>=10){over=true;return H.done({win:false,score:sc,title:"Revoada!",sub:"10 balões escaparam. Toque mais rápido!"});}}}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const b of bals){
    x.strokeStyle=H.C.ink;x.beginPath();x.moveTo(b.x,b.y+22);x.quadraticCurveTo(b.x+6,b.y+34,b.x,b.y+44);x.stroke();
    x.fillStyle=b.k==="gold"?H.C.gold:b.k==="bad"?H.C.ink:H.C.terra;
    x.beginPath();x.ellipse(b.x,b.y,20,24,0,0,7);x.fill();
    x.strokeStyle=b.k==="gold"?H.C.terra:H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.ellipse(b.x-7,b.y-8,5,8,-.3,0,7);x.fill();
  }
});
}});"""

# 57 — Cobra Clássica
GAMES[57] = r"""/* NCODE N · 057 Cobra Clássica — coma, cresça, desvie */
GREG(57,{
init(root,H){
const N=16;
let over=false,snake,dir,nd,food,sc=0,tick=0,speed=.12;
const hud=H.hud(root,[["cp","COMPRIMENTO",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Setas / deslize</b> para virar. Coma 🍎 para crescer. 120 pontos vencem — sem morder o rabo!");
const o=H.cvs(root,440,440),x=o.x;
function build(){
  snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];dir={x:1,y:0};nd=dir;sc=0;speed=.12;
  place();hud.set("cp",3);hud.set("sc",0);
}
function place(){
  while(true){
    const f={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};
    if(!snake.some(s=>s.x===f.x&&s.y===f.y)){food=f;return;}
  }
}
build();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  if(c==="ArrowUp"&&dir.y!==1)nd={x:0,y:-1};
  if(c==="ArrowDown"&&dir.y!==-1)nd={x:0,y:1};
  if(c==="ArrowLeft"&&dir.x!==1)nd={x:-1,y:0};
  if(c==="ArrowRight"&&dir.x!==-1)nd={x:1,y:0};});
H.swipe(o,{up:()=>{if(dir.y!==1)nd={x:0,y:-1};},down:()=>{if(dir.y!==-1)nd={x:0,y:1};},
  left:()=>{if(dir.x!==1)nd={x:-1,y:0};},right:()=>{if(dir.x!==-1)nd={x:1,y:0};}});
H.loop(dt=>{
  if(over)return;
  tick+=dt;
  if(tick>=speed){
    tick=0;dir=nd;
    const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    if(h.x<0||h.y<0||h.x>=N||h.y>=N||snake.some(s=>s.x===h.x&&s.y===h.y)){
      over=true;H.sfx("lose");
      return H.done({win:false,score:sc,title:"Cobra enrolada!",sub:sc+" pontos antes da batida."});
    }
    snake.unshift(h);
    if(h.x===food.x&&h.y===food.y){
      sc+=10;H.score(sc);hud.set("sc",sc);hud.set("cp",snake.length);H.sfx("pop");
      speed=Math.max(.06,speed-.004);place();
      if(sc>=120){over=true;return H.done({win:true,score:sc+100,title:"Sucuri suprema!",sub:"120 pontos de maçãs devoradas."});}
    }else snake.pop();
  }
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(ox-3,oy-3,s*N+6,s*N+6);
  x.font=Math.floor(s*.8)+"px serif";
  x.fillText("🍎",ox+food.x*s+2,oy+food.y*s+s-3);
  snake.forEach((sg,i)=>{
    x.fillStyle=i===0?H.C.ink:H.C.ok;
    x.fillRect(ox+sg.x*s+1,oy+sg.y*s+1,s-2,s-2);
    if(i===0){x.fillStyle=H.C.wasabi;x.fillRect(ox+sg.x*s+s/2-2,oy+sg.y*s+4,4,4);}
  });
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 58 — Pong Solo
GAMES[58] = r"""/* NCODE N · 058 Pong Solo — rebata contra a parede */
GREG(58,{
init(root,H){
let over=false,px,bx,by,vx,vy,rally=0,best=0,sc=0;
const hud=H.hud(root,[["rb","RÉPLICAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Mova com <b>mouse, toque ou setas</b>. A bola acelera a cada réplica. 25 réplicas vencem!");
const o=H.cvs(root,500,380),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){px=o.W/2;rally=0;sc=0;serve(1);}
function serve(dir){
  bx=o.W/2;by=o.H/2;
  const a=(Math.random()*.6-.3)+(dir>0?0:Math.PI);
  vx=Math.cos(a)*260;vy=Math.sin(a)*260-60;
}
build();
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))px-=420*dt;
  if(kb.is("ArrowRight"))px+=420*dt;
  if(kb.is("ArrowUp"))px-=420*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*14);
  px=H.clamp(px,50,o.W-50);
  bx+=vx*dt;by+=vy*dt;
  if(bx<12){bx=12;vx=Math.abs(vx);H.beep(240,.04);}
  if(bx>o.W-12){bx=o.W-12;vx=-Math.abs(vx);H.beep(240,.04);}
  if(by<12){by=12;vy=Math.abs(vy);H.beep(240,.04);}
  if(vy>0&&by>o.H-44&&by<o.H-24&&Math.abs(bx-px)<54){
    const off=(bx-px)/54;
    const sp=Math.min(640,Math.hypot(vx,vy)*1.045+6);
    vx=off*sp*.85;vy=-Math.abs(sp*.9);
    rally++;sc+=rally;H.score(sc);hud.set("sc",sc);hud.set("rb",rally);H.beep(440+rally*12,.05);
    if(rally>=25){over=true;return H.done({win:true,score:sc+150,title:"Muralha!",sub:"25 réplicas contra a parede acelerada."});}
  }
  if(by>o.H+14){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Passou direto!",sub:rally+" réplicas antes da fuga."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(0,0,o.W,8);
  x.setLineDash([6,8]);x.strokeStyle=H.C.cement;
  x.beginPath();x.moveTo(0,o.H/2);x.lineTo(o.W,o.H/2);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ink;x.fillRect(px-54,o.H-36,108,12);
  x.fillStyle=H.C.terra;x.fillRect(px-54,o.H-36,108,4);
  x.fillStyle=H.C.ok;x.beginPath();x.arc(bx,by,9,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("vel "+Math.round(Math.hypot(vx,vy)),12,24);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});"""

# 59 — Invasores em Onda
GAMES[59] = r"""/* NCODE N · 059 Invasores em Onda — segure a descida */
GREG(59,{
init(root,H){
let over=false,px,aliens,shots,eshots,sc=0,lives=3,wave=0,dir=1,cd=0,et=0;
const hud=H.hud(root,[["wv","ONDA","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>◀ ▶</b> move · <b>Espaço/toque</b> atira. Destrua 3 ondas antes que pousem!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function buildWave(){
  wave++;aliens=[];eshots=[];dir=1;
  hud.set("wv",wave+"/3");
  for(let r=0;r<3+Math.min(2,wave);r++)for(let c=0;c<7;c++)
    aliens.push({x:70+c*52,y:60+r*36,pts:(4-r)*10});
}
px=o.W/2;shots=[];buildWave();
kb.on((c,d)=>{if(d&&c==="Space")shoot();});
H.onTap(o,()=>shoot());
function shoot(){
  if(over||cd>0||shots.length>3)return;cd=.3;
  shots.push({x:px,y:o.H-56});H.beep(800,.06,"square",.035);
}
H.loop(dt=>{
  if(over)return;
  cd-=dt;
  if(kb.is("ArrowLeft"))px-=300*dt;
  if(kb.is("ArrowRight"))px+=300*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*10);
  px=H.clamp(px,30,o.W-30);
  const sp=26+wave*10;
  let edge=false;
  for(const a of aliens){a.x+=dir*sp*dt;if(a.x<24||a.x>o.W-24)edge=true;}
  if(edge){dir*=-1;for(const a of aliens)a.y+=16;}
  et-=dt;
  if(et<=0&&aliens.length){et=Math.max(.4,1.1-wave*.2);
    const a=aliens[Math.floor(Math.random()*aliens.length)];
    eshots.push({x:a.x,y:a.y+10});}
  for(const s of shots)s.y-=460*dt;
  shots=shots.filter(s=>s.y>-10);
  for(const s of eshots)s.y+=220*dt;
  eshots=eshots.filter(s=>s.y<o.H+10);
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];
    const j=aliens.findIndex(a=>Math.abs(a.x-s.x)<20&&Math.abs(a.y-s.y)<16);
    if(j>=0){sc+=aliens[j].pts;aliens.splice(j,1);shots.splice(i,1);
      H.score(sc);hud.set("sc",sc);H.sfx("pop");}
  }
  for(let i=eshots.length-1;i>=0;i--){
    const s=eshots[i];
    if(Math.abs(s.x-px)<20&&s.y>o.H-70&&s.y<o.H-30){
      eshots.splice(i,1);lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Base destruída!",sub:sc+" pontos até a onda "+wave+"."});}
      say("🔥 Nave atingida! Vidas: "+lives);
    }
  }
  if(aliens.some(a=>a.y>o.H-90)){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Invasão completa!",sub:"Os aliens pousaram na onda "+wave+"."});}
  if(!aliens.length){
    if(wave>=3){over=true;return H.done({win:true,score:sc+150,title:"Setor limpo!",sub:"3 ondas de invasores vaporizadas."});}
    H.sfx("ok");shots=[];buildWave();say("Onda "+wave+"! Mais rápidos, mais famintos.");
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.font="20px serif";
  for(const a of aliens)x.fillText("👾",a.x-10,a.y+7);
  x.font="26px serif";x.fillText("🚀",px-13,o.H-40);
  x.fillStyle=H.C.wasabi;
  for(const s of shots)x.fillRect(s.x-2,s.y-8,4,10);
  x.fillStyle=H.C.terra;
  for(const s of eshots){x.beginPath();x.arc(s.x,s.y,4,0,7);x.fill();}
});
}});"""

# 60 — Sapo Atravessador
GAMES[60] = r"""/* NCODE N · 060 Sapo Atravessador — rua e rio até a margem */
GREG(60,{
init(root,H){
const LANES=[
 {y:5.5,k:"road",sp:90,dir:1,items:[0,200,400]},
 {y:4.5,k:"road",sp:-130,dir:-1,items:[100,340]},
 {y:3.5,k:"road",sp:160,dir:1,items:[50,300]},
 {y:2,k:"river",sp:80,dir:1,items:[0,260]},
 {y:1,k:"river",sp:-110,dir:-1,items:[140,400]}
];
let over=false,fx,fy,sc=0,lives=3,wins=0;
const hud=H.hud(root,[["cr","TRAVESSIAS","0/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Setas / toque</b> nos vizinhos. Atravesse 3 ruas e 2 rios (pegue carona nas 🪵!). 3 travessias vencem.");
const o=H.cvs(root,500,440),x=o.x;
const ROW=62,OFF=40;
function reset(){fx=4;fy=6;}
reset();
function die(msg){
  lives--;hud.set("vd",lives);H.sfx("bad");reset();
  if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Sapo atropelado!",sub:msg});}
  say("💥 "+msg+" Vidas: "+lives);
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  if(c==="ArrowUp")hop(0,-1);if(c==="ArrowDown")hop(0,1);
  if(c==="ArrowLeft")hop(-1,0);if(c==="ArrowRight")hop(1,0);});
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor(px/(o.W/9)),r=Math.round((py-OFF)/ROW);
  if(Math.abs(c-fx)+Math.abs(r-fy)===1)hop(c-fx,r-fy);
});
function hop(dx,dy){
  fx=H.clamp(fx+dx,0,8);fy=H.clamp(fy+dy,0,6);H.sfx("tick");
  if(fy===0){
    wins++;sc+=100;H.score(sc);hud.set("sc",sc);hud.set("cr",wins+"/3");H.sfx("ok");
    if(wins>=3){over=true;return H.done({win:true,score:sc+100,title:"Rei do brejo!",sub:"3 travessias completas entre rua e rio."});}
    say("Travessia "+wins+"/3! De novo, sapo.");reset();
  }
}
H.loop(dt=>{
  if(over)return;
  for(const L of LANES)
    for(let i=0;i<L.items.length;i++){
      L.items[i]+=L.sp*dt;
      if(L.items[i]>o.W+40)L.items[i]=-40;
      if(L.items[i]<-40)L.items[i]=o.W+40;
    }
  const fyPx=OFF+fy*ROW;
  for(const L of LANES){
    if(Math.abs((OFF+L.y*ROW)-fyPx)>ROW/2)continue;
    const px=fx*(o.W/9)+o.W/18;
    const hit=L.items.some(ix=>Math.abs(ix-px)<36);
    if(L.k==="road"){if(hit){die("Atropelado na rua!");return;}}
    else{
      if(!hit){die("Caiu no rio!");return;}
      fx=H.clamp(fx+L.sp*dt/(o.W/9),0,8);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const zone=fy2=>fy2<2.6?"#2E6E8A":fy2>2.6&&fy2<6?"#4A4A44":H.C.ok;
  for(let r=0;r<=6;r++){x.fillStyle=zone(r);x.fillRect(0,OFF+r*ROW-ROW/2,o.W,ROW);}
  x.fillStyle=H.C.paper;x.font="bold 11px 'Space Mono',monospace";
  x.fillText("🏁 MARGEM SEGURA",14,OFF-ROW/2+16);
  x.fillText("🟢 INÍCIO",14,OFF+6*ROW+22);
  for(const L of LANES){
    const y=OFF+L.y*ROW;
    for(const ix of L.items){
      x.font="26px serif";
      x.fillText(L.k==="road"?(L.dir>0?"🚗":"🚙"):"🪵",ix-14,y+9);
    }
  }
  x.font="30px serif";
  x.fillText("🐸",fx*(o.W/9)+o.W/18-15,fyPx+11);
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
