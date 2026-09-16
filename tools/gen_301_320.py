#!/usr/bin/env python3
"""Gera games/g301..g320 — RACING fim + SURVIVAL início."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 301 — Surf de Onda
GAMES[301] = r"""/* NCODE N · 301 Surf de Onda — fique no tubo! */
GREG(301,{
init(root,H){
let over=false,py=260,score=0,t=0,time=60,curl=260,wipe=0;
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',60]]);
const say=H.msg(root,'Fique dentro da zona verde do tubo! ⬆️⬇️ movem. Manobras no tubo valem pontos. 3 quedas = fim. Meta: 500!');
const o=H.cvs(root,480,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&c==='Space')trick();});
H.onTap(o,(qx,qy)=>{tapY=qy;});
let tapY=null;
H.btn(root,'🏄 Manobra! (Espaço)',trick,false);
function trick(){
 if(over)return;
 const d=Math.abs(py-curl);
 if(d<40){score+=50;H.sfx('ok');}
 else{wipe++;H.sfx('bad');if(wipe>=3){gameOver();return;}}
}
function gameOver(){over=true;const win=score>=500;H.score(score);
H.done(win?{win:true,score,title:'🏄 Rei do tubo!',sub:score+' pontos!'}:{win:false,score,title:'Fim da onda!',sub:score+'/500 pontos. Fique no verde!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 curl=260+Math.sin(t*1.1)*110+Math.sin(t*2.7)*30;
 const U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 if(U)py-=200*dt;if(D)py+=200*dt;
 if(tapY!=null){py+=(tapY-py)*4*dt;}
 py=H.clamp(py,90,390);
 if(Math.abs(py-curl)<40)score+=dt*20;
 hud.set('pt',score|0);hud.set('tp',Math.ceil(time));
 if(py<=95||py>=385){wipe++;py=260;H.sfx('bad');if(wipe>=3){gameOver();return;}}
 if(time<=0){gameOver();return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,480,400);
 x.fillStyle='#3EAFBF';
 x.beginPath();x.moveTo(0,400);
 for(let sx=0;sx<=480;sx+=10)x.lineTo(sx,120+Math.sin(sx*.02+t*2)*24);
 x.lineTo(480,400);x.fill();
 x.fillStyle='rgba(196,214,69,.5)';x.fillRect(0,curl-40,480,80);
 x.fillStyle='#fff';
 for(let i=0;i<16;i++){const wx=(i*139+t*120)%520-20;x.fillRect(wx,100+((i*67)%60),24,5);}
 x.font='32px system-ui';x.textAlign='center';x.fillText('🏄',140,py+10);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText((score|0)+' pts · ⏱️'+Math.ceil(time)+'s · quedas '+wipe+'/3 · meta 500',12,26);
});
}});"""

# 302 — Asa Delta
GAMES[302] = r"""/* NCODE N · 302 Asa Delta — plane pelos vales! */
GREG(302,{
init(root,H){
let over=false,px=60,alt=350,sp=150,t=0;
const RIDGE=[];
for(let i=0;i<12;i++)RIDGE.push({x:500+i*550,h:150+Math.random()*180});
const LZ={x:7000,w:350};
const hud=H.hud(root,[['a','ALT','350m'],['v','VEL','150']]);
const say=H.msg(root,'Plane até a pista 🛬! ⬆️ pica (ganha velocidade, perde altura), ⬇️ cabra (sobe lento). Lento demais = stall! Desvie dos picos!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function ridgeH(x2){
 let h=0;
 RIDGE.forEach(r=>{const d=Math.abs(x2-r.x);if(d<220)h=Math.max(h,r.h*(1-d/220));});
 return h;
}
function gameOver(win,why){over=true;const sc=win?Math.max(250,850-(t|0)*6):px/70|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🪁 Voo de vale!',sub:'Pouso na pista!'}:{win:false,score:sc,title:'Queda!',sub:why});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 if(U){sp+=120*dt;alt-=60*dt;}
 else if(D){sp-=100*dt;alt+=sp>120?40*dt:-30*dt;}
 else{sp+=(140-sp)*.5*dt;alt-=35*dt;}
 sp=H.clamp(sp,40,300);
 if(sp<70)alt-=80*dt;
 px+=sp*dt;
 hud.set('a',Math.max(0,alt|0)+'m');hud.set('v',sp|0);
 const rh=ridgeH(px);
 if(alt<=rh){
  if(px>=LZ.x-LZ.w/2&&px<=LZ.x+LZ.w/2&&sp<220)gameOver(true);
  else gameOver(false,sp<70?'Stall! Mantenha velocidade.':(sp>=220&&px>=LZ.x-LZ.w/2)?'Rápido demais para pousar!':'Bateu no relevo. Plane mais alto!');
  return;
 }
 if(alt>600)alt=600;
 const cam=H.clamp(px-120,0,6800);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,400);
 x.fillStyle='#5A6E5A';x.beginPath();x.moveTo(0,400);
 for(let sx=0;sx<=560;sx+=12)x.lineTo(sx,400-ridgeH(sx+cam));
 x.lineTo(560,400);x.fill();
 x.fillStyle='#C4D645';x.fillRect(LZ.x-LZ.w/2-cam,386,LZ.w,14);
 x.font='20px system-ui';x.textAlign='center';x.fillText('🛬',LZ.x-cam,382);
 const py=400-alt;
 x.save();x.translate(px-cam,py);x.rotate(U?.4:D?-.3:0);
 x.font='30px system-ui';x.fillText('🪁',0,10);x.restore();
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Alt '+(alt|0)+'m · Vel '+(sp|0)+' · '+(px/7350*100|0)+'%'+(sp<70?' ⚠️ STALL!':''),12,26);
});
}});"""

# 303 — Tirolesa
GAMES[303] = r"""/* NCODE N · 303 Tirolesa — gemas na selva! */
GREG(303,{
init(root,H){
let over=false,px=40,sp=0,gems=0,t=0;
const GEMS=[];
for(let i=0;i<10;i++)GEMS.push({x:400+i*420,y:120+Math.random()*160,got:false});
const hud=H.hud(root,[['g','GEMAS','0/10'],['v','VEL','0']]);
const say=H.msg(root,'Desça a tirolesa e pegue as gemas 💎! Segure FREIO/Espaço para desacelerar — chegue à plataforma com velocidade abaixo de 120!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function lineY(x2){return 60+x2*.42;}
function gameOver(ok,fast){over=true;const win=ok&&!fast&&gems>=6;const sc=gems*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'💎 Descida perfeita!',sub:gems+'/10 gemas e chegada suave.'}:{win:false,score:sc,title:'Chegada ruim!',sub:gems+'/10 gemas. '+(fast?'Rápido demais — freie no fim!':'Pegue ao menos 6 gemas!')});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const brake=dn.Space||dn.ArrowDown||dn.KeyS;
 sp+=((brake?-160:130)-sp*.25)*dt;
 sp=H.clamp(sp,20,340);
 px+=sp*dt;
 const py=lineY(px);
 hud.set('v',sp|0);
 GEMS.forEach(g=>{
  if(!g.got&&Math.abs(g.x-px)<30&&Math.abs(g.y-py)<44){g.got=true;gems++;H.sfx('ok');hud.set('g',gems+'/10');}
 });
 if(px>=4500){gameOver(true,sp>120);return;}
 const cam=H.clamp(px-100,0,4100);
 x.fillStyle='#7CB56B';x.fillRect(0,0,560,380);
 x.strokeStyle='#4A2F1B';x.lineWidth=4;
 x.beginPath();x.moveTo(40-cam,lineY(40));x.lineTo(4540-cam,lineY(4540));x.stroke();
 x.fillStyle='#5A4A33';
 for(let i=0;i<14;i++){const tx2=i*380-cam;x.fillRect(tx2,lineY(i*380+140)+60,26,120);}
 GEMS.forEach(g=>{
  if(g.got)return;
  const gx=g.x-cam;
  if(gx>-20&&gx<580){x.font='22px system-ui';x.textAlign='center';x.fillText('💎',gx,g.y+8);}
 });
 x.fillStyle='#8A6A2F';x.fillRect(4500-cam,lineY(4500)-10,80,20);
 const jx=px-cam,jy=lineY(px);
 x.strokeStyle='#181816';x.lineWidth=3;
 x.beginPath();x.moveTo(jx,jy);x.lineTo(jx,jy+22);x.stroke();
 x.font='28px system-ui';x.textAlign='center';x.fillText('🧗',jx,jy+48);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('💎 '+gems+'/10 · Vel '+(sp|0)+(brake?' 🛑':'')+' · chegue < 120!',12,26);
});
}});"""

# 304 — Parkour Urbano
GAMES[304] = r"""/* NCODE N · 304 Parkour Urbano — corra e salte! */
GREG(304,{
init(root,H){
let over=false,px=0,py=0,vy=0,ground=true,slide=0,dist=0,t=0,lives=3;
const OBS=[];
for(let i=0;i<16;i++)OBS.push({x:400+i*420,k:i%3===2?'alto':'baixo',hit:false});
const hud=H.hud(root,[['v','VIDAS',3],['d','DIST','0%']]);
const say=H.msg(root,'Corra até o fim! ⬆️/Espaço pula os muros baixos, ⬇️ desliza sob as barras altas. 3 erros = fim!');
const o=H.cvs(root,560,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{if(!d)return;if(c==='Space'||c==='ArrowUp'||c==='KeyW')jump();});
H.btn(root,'⬆️ PULAR',jump,false);
H.btn(root,'⬇️ DESLIZAR',()=>{if(!over&&ground){slide=.5;H.sfx('tick');}},false);
function jump(){if(over||!ground)return;vy=-420;ground=false;H.sfx('tick');}
function gameOver(win){over=true;const sc=win?Math.max(250,700-(t|0)*8)+lives*50:dist/70|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏃 Traceur!',sub:'Percurso completo!'}:{win:false,score:sc,title:'Travou!',sub:'3 erros. Pule muros, deslize barras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(slide>0)slide-=dt;
 dist+=200*dt;px=dist;
 vy+=1100*dt;py+=vy*dt;
 if(py>=0){py=0;vy=0;ground=true;}
 OBS.forEach(ob=>{
  const ox=ob.x-dist;
  if(!ob.hit&&Math.abs(ox-120)<30){
   const ok=ob.k==='baixo'?(py<-40):(slide>0);
   if(!ok){ob.hit=true;lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}}
  }
 });
 hud.set('d',Math.min(99,dist/6800*100|0)+'%');
 if(dist>=6800){gameOver(true);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,340);
 x.fillStyle='#8A877C';
 for(let i=0;i<10;i++){const bx=(i*293-dist*.5%600+600)%600-60;x.fillRect(bx,120,50,180);}
 x.fillStyle='#5A5A55';x.fillRect(0,280,560,60);
 OBS.forEach(ob=>{
  const ox=ob.x-dist;
  if(ox<-40||ox>600)return;
  if(ob.k==='baixo'){x.fillStyle=ob.hit?'#D94E34':'#8A6A2F';x.fillRect(ox-14,220,28,60);}
  else{x.fillStyle=ob.hit?'#D94E34':'#2E6E8A';x.fillRect(ox-30,190,60,12);x.fillRect(ox-30,190,8,90);x.fillRect(ox+22,190,8,90);}
 });
 x.font=slide>0?'24px system-ui':'32px system-ui';x.textAlign='center';
 x.fillText(slide>0?'🛷':'🏃',120,272+py);
});
}});"""

# 305 — Segway City
GAMES[305] = r"""/* NCODE N · 305 Segway City — desvie e equilibre! */
GREG(305,{
init(root,H){
let over=false,px=230,bal=0,dist=0,score=0,lives=3,t=0;
const PED=[];
for(let i=0;i<30;i++)PED.push({x:50+Math.random()*360,y:-i*330-200,hit:false,vx:(Math.random()-.5)*60});
const hud=H.hud(root,[['v','VIDAS',3],['pt','PONTOS',0]]);
const say=H.msg(root,'⬅️➡️ movem E equilibram! Desvie dos pedestres 🚶 e não deixe o equilíbrio zerar. Meta: 600 pontos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(){over=true;const win=score>=600;H.score(score|0);
H.done(win?{win:true,score:score|0,title:'🛴 Rei da calçada!',sub:(score|0)+' pontos!'}:{win:false,score:score|0,title:'Tombou!',sub:(score|0)+'/600 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 if(L){px-=220*dt;bal-=50*dt;}
 if(R){px+=220*dt;bal+=50*dt;}
 bal+=Math.sin(t*2.2)*24*dt;
 bal=H.clamp(bal,-100,100);
 if(!L&&!R)bal*=.99;
 px=H.clamp(px,46,414);
 dist+=210*dt;score+=dt*22;
 if(Math.abs(bal)>=100){lives--;bal=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver();return;}}
 PED.forEach(p=>{
  p.x+=p.vx*dt;
  const py=p.y+dist;
  if(!p.hit&&Math.abs(py-430)<26&&Math.abs(p.x-px)<28){p.hit=true;lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver();return;}}
 });
 hud.set('pt',score|0);
 if(dist>=10000){gameOver();return;}
 x.fillStyle='#B9B5A8';x.fillRect(0,0,460,520);
 x.fillStyle='#8A877C';
 for(let i=0;i<20;i++)x.fillRect(0,(i*60+dist)%560-20,460,3);
 PED.forEach(p=>{
  const py=p.y+dist;
  if(py<-20||py>540)return;
  x.font='24px system-ui';x.textAlign='center';x.fillText(p.hit?'💥':'🚶',p.x,py+8);
 });
 x.save();x.translate(px,430);x.rotate(bal/300);
 x.font='32px system-ui';x.textAlign='center';x.fillText('🛴',0,10);x.restore();
 x.fillStyle='#181816';x.fillRect(130,16,200,12);
 x.fillStyle=Math.abs(bal)>70?'#D94E34':'#3E7C4F';x.fillRect(230+bal-4,12,8,20);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText((score|0)+' pts · ❤️'.repeat(1)+' '+lives+' · meta 600',12,50);
});
}});"""

# 306 — Monociclo na Corda
GAMES[306] = r"""/* NCODE N · 306 Monociclo na Corda — atravesse! */
GREG(306,{
init(root,H){
let over=false,px=60,bal=0,t=0,wind=0;
const hud=H.hud(root,[['d','DIST','0%']]);
const say=H.msg(root,'Atravesse a corda! A bike anda sozinha — ⬅️➡️ equilibram contra o vento. Cair = recomeçar do último terço!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
let falls=0;
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*5-falls*60):px/5|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🎪 Equilibrista!',sub:falls+' quedas na travessia.'}:{win:false,score:sc,title:'Não deu!',sub:'5 quedas. Corrija antes do limite!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 wind=Math.sin(t*.6)*30+Math.sin(t*1.7)*15;
 px+=55*dt;
 bal+=wind*dt+(Math.random()-.5)*30*dt;
 if(dn.ArrowLeft||dn.KeyA)bal-=80*dt;
 if(dn.ArrowRight||dn.KeyD)bal+=80*dt;
 bal=H.clamp(bal,-100,100);
 if(Math.abs(bal)>=100){
  falls++;bal=0;px=Math.max(60,px-140);H.sfx('bad');
  say('💥 Queda '+falls+'/5!');
  if(falls>=5){gameOver(false);return;}
 }
 hud.set('d',Math.min(99,px/540*100|0)+'%');
 if(px>=540){gameOver(true);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,380);
 x.fillStyle='#5A5A55';x.fillRect(0,240,60,140);x.fillRect(500,240,60,140);
 x.strokeStyle='#181816';x.lineWidth=4;
 x.beginPath();x.moveTo(30,240);x.lineTo(530,240);x.stroke();
 x.fillStyle='#fff';x.font='14px system-ui';x.textAlign='left';
 x.fillText(wind>0?'Vento ▶ '+wind.toFixed(0):'Vento ◀ '+(-wind).toFixed(0),12,26);
 x.save();x.translate(px,232);x.rotate(bal/160);
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚲',0,4);x.restore();
 x.fillStyle='#181816';x.fillRect(180,300,200,14);
 x.fillStyle=Math.abs(bal)>70?'#D94E34':'#E8A33D';
 x.fillRect(280+bal-5,296,10,22);
});
}});"""

# 307 — Pula-Pula Vertical
GAMES[307] = r"""/* NCODE N · 307 Pula-Pula Vertical — quique até o topo! */
GREG(307,{
init(root,H){
let over=false,py=0,vy=0,px=230,power=0,charge=false,t=0,best=0;
const PLAT=[{x:230,y:0}];
for(let i=1;i<24;i++)PLAT.push({x:60+Math.random()*340,y:-i*130});
const hud=H.hud(root,[['a','ALT','0m']]);
const say=H.msg(root,'Segure ESPAÇO para carregar e solte para pular! Mire as plataformas. Caia = recomeça de baixo. Chegue ao topo!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{
 if(c==='Space'){if(d&&!over&&vy===0)charge=true;if(!d&&charge)jump();}
 if(d&&(c==='ArrowLeft'||c==='KeyA'))px-=26;
 if(d&&(c==='ArrowRight'||c==='KeyD'))px+=26;
});
H.onTap(o,(qx,qy)=>{px=qx;});
const jb=H.btn(root,'🟢 Segurar e soltar = PULAR',()=>{},true);
jb.addEventListener('pointerdown',()=>{if(!over&&vy===0)charge=true;});
jb.addEventListener('pointerup',()=>{if(charge)jump();});
function jump(){
 if(over)return;
 charge=false;
 if(vy!==0)return;
 vy=-(280+power*5);power=0;H.sfx('tick');
}
function gameOver(win){over=true;const sc=win?Math.max(250,800-(t|0)*8):best|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🦘 Topo!',sub:'Escalada completa!'}:{win:false,score:sc,title:'Caiu!',sub:'Altura máxima: '+best.toFixed(0)+'m.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(charge)power=Math.min(100,power+90*dt);
 vy+=900*dt;py+=vy*dt;
 px=H.clamp(px,20,440);
 if(vy>0){
  PLAT.forEach(p=>{
   if(Math.abs(py-p.y)<12&&Math.abs(px-p.x)<44){py=p.y;vy=0;}
  });
 }
 best=Math.max(best,-py/10);
 hud.set('a',best.toFixed(0)+'m');
 if(py>120){gameOver(false);return;}
 if(-py>=23*130){gameOver(true);return;}
 const cam=py-380;
 x.fillStyle='#12303C';x.fillRect(0,0,460,520);
 PLAT.forEach(p=>{
  const sy=p.y-cam;
  if(sy<-20||sy>540)return;
  x.fillStyle='#C4D645';x.fillRect(p.x-44,sy-8,88,16);
 });
 x.font='40px system-ui';x.textAlign='center';x.fillText('🦘',px,py-cam-8);
 x.fillStyle='#000';x.fillRect(180,16,200,16);
 x.fillStyle=power>80?'#D94E34':'#E8A33D';x.fillRect(180,16,200*power/100,16);
 x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('FORÇA',120,29);
});
}});"""

# 308 — Balsa no Rio
GAMES[308] = r"""/* NCODE N · 308 Balsa no Rio — colete tudo! */
GREG(308,{
init(root,H){
let over=false,px=230,py=400,dist=0,t=0,got=0,time=120;
const ITEMS=[];
for(let i=0;i<12;i++)ITEMS.push({x:60+Math.random()*340,y:-i*420-200,got:false,k:['🍎','💎','🪙','🍌'][i%4]});
const hud=H.hud(root,[['i','ITENS','0/12'],['tp','TEMPO',120]]);
const say=H.msg(root,'Colete os 12 itens flutuantes! Setas/toque movem a balsa. 2 minutos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx;ty=qy;});
let tx=null,ty=null;
function gameOver(win){over=true;const sc=got*50+(win?Math.ceil(time)*3:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🛶 Rio limpo!',sub:'12/12 itens!'}:{win:false,score:sc,title:'Fim do tempo!',sub:got+'/12 itens.'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 const sp=180*dt;
 if(dn.ArrowLeft||dn.KeyA)px-=sp;if(dn.ArrowRight||dn.KeyD)px+=sp;
 if(dn.ArrowUp||dn.KeyW)py-=sp;if(dn.ArrowDown||dn.KeyS)py+=sp;
 if(tx!=null){px+=(tx-px)*3*dt;py+=(ty-py)*3*dt;}
 px=H.clamp(px,50,410);py=H.clamp(py,200,480);
 dist+=60*dt;
 ITEMS.forEach(it=>{
  const iy=it.y+dist;
  if(!it.got&&Math.hypot(px-it.x,py-iy)<32){it.got=true;got++;H.sfx('ok');hud.set('i',got+'/12');}
 });
 hud.set('tp',Math.ceil(time));
 if(got>=12){gameOver(true);return;}
 if(time<=0){gameOver(false);return;}
 x.fillStyle='#3EAFBF';x.fillRect(0,0,460,520);
 x.strokeStyle='rgba(255,255,255,.4)';
 for(let i=0;i<20;i++){const wy=(i*97+dist)%560-20;x.beginPath();x.moveTo((i*173)%440,wy);x.lineTo((i*173)%440+30,wy);x.stroke();}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,40,520);x.fillRect(420,0,40,520);
 ITEMS.forEach(it=>{
  const iy=it.y+dist;
  if(!it.got&&iy>-20&&iy<540){x.font='24px system-ui';x.textAlign='center';x.fillText(it.k,it.x,iy+8);}
 });
 x.font='34px system-ui';x.fillText('🛶',px,py+11);
});
}});"""

# 309 — Corrida de Cortador de Grama
GAMES[309] = r"""/* NCODE N · 309 Corrida de Cortador de Grama — apare o bairro! */
GREG(309,{
init(root,H){
const N=12,CS=36,OX=14,OY=50;
let over=false,grid=[],px=0,py=0,ai={x:11,y:11},t=0,time=120,mowed=0,aiM=0;
for(let r=0;r<N;r++){grid.push([]);for(let c=0;c<N;c++)grid[r].push(0);}
grid[0][0]=1;grid[11][11]=2;mowed=1;aiM=1;
const hud=H.hud(root,[['v','SEU %','1%'],['c','CPU %','1%'],['tp','TEMPO',120]]);
const say=H.msg(root,'Apare mais grama que a CPU em 2 minutos! Setas/toque movem. Quem passar primeiro fica com o pedaço!');
const o=H.cvs(root,460,500),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over)return;
 const nc=H.clamp(px+dc,0,N-1),nr=H.clamp(py+dr,0,N-1);
 px=nc;py=nr;
 if(!grid[nr][nc]){grid[nr][nc]=1;mowed++;H.sfx('tick');}
 hud.set('v',(mowed/144*100|0)+'%');
}
H.onTap(o,(qx,qy)=>{
 const c=Math.floor((qx-OX)/CS),r=Math.floor((qy-OY)/CS);
 if(c<0||c>=N||r<0||r>=N)return;
 step(Math.sign(c-px),0);step(0,Math.sign(r-py));
});
function gameOver(){
 over=true;const win=mowed>aiM;const sc=mowed*5;H.score(sc);
H.done(win?{win:true,score:sc,title:'🌱 Gramado impecável!',sub:(mowed/144*100|0)+'% × '+(aiM/144*100|0)+'% da CPU.'}:{win:false,score:sc,title:'CPU aparou mais!',sub:(mowed/144*100|0)+'% × '+(aiM/144*100|0)+'%. Cubra o mapa!'});}
let aiT=0;
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 aiT+=dt;
 if(aiT>.28){aiT=0;
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]].sort(()=>Math.random()-.5);
  for(const d of dirs){
   const nx=H.clamp(ai.x+d[0],0,N-1),ny=H.clamp(ai.y+d[1],0,N-1);
   if(!grid[ny][nx]){ai.x=nx;ai.y=ny;grid[ny][nx]=2;aiM++;break;}
  }
  if(Math.random()<.3){ai.x=H.clamp(ai.x+((Math.random()*3)|0)-1,0,N-1);ai.y=H.clamp(ai.y+((Math.random()*3)|0)-1,0,N-1);if(!grid[ai.y][ai.x]){grid[ai.y][ai.x]=2;aiM++;}}
  hud.set('c',(aiM/144*100|0)+'%');
 }
 hud.set('tp',Math.ceil(time));
 if(time<=0||mowed+aiM>=144){gameOver();return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,500);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=!grid[r][c]?'#3E7C4F':grid[r][c]===1?'#8FD18F':'#7FB3C8';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle=H.C.paper;x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.font='20px system-ui';x.textAlign='center';
 x.fillText('🚜',OX+px*CS+18,OY+py*CS+26);
 x.fillText('🚜',OX+ai.x*CS+18,OY+ai.y*CS+26);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Você '+(mowed/144*100|0)+'% · CPU '+(aiM/144*100|0)+'% · ⏱️'+Math.ceil(time),14,30);
});
}});"""

# 310 — Carrinho de Compras
GAMES[310] = r"""/* NCODE N · 310 Carrinho de Compras — descida maluca! */
GREG(310,{
init(root,H){
let over=false,px=230,dist=0,sp=200,lives=3,score=0,t=0;
const CARS=[];
for(let i=0;i<34;i++)CARS.push({x:50+Math.random()*360,y:-i*300-250,hit:false,lane:(Math.random()*3)|0});
const COINS=[];
for(let i=0;i<20;i++)COINS.push({x:50+Math.random()*360,y:-i*520-150,got:false});
const hud=H.hud(root,[['v','VIDAS',3],['pt','PONTOS',0]]);
const say=H.msg(root,'Desça o estacionamento! Desvie dos carros 🚗, pegue moedas 🪙. 3 batidas = fim. Meta: 500 pontos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(){over=true;const win=score>=500;H.score(score|0);
H.done(win?{win:true,score:score|0,title:'🛒 Descida radical!',sub:(score|0)+' pontos!'}:{win:false,score:score|0,title:'Carrinho quebrou!',sub:(score|0)+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 sp=Math.min(380,sp+dt*8);
 if(L)px-=260*dt;if(R)px+=260*dt;
 px=H.clamp(px,44,416);
 dist+=sp*dt;score+=dt*15;
 CARS.forEach(c=>{
  const cy=c.y+dist;
  if(!c.hit&&Math.abs(cy-430)<30&&Math.abs(c.x-px)<34){
   c.hit=true;lives--;sp=140;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver();return;}
  }
 });
 COINS.forEach(c=>{
  const cy=c.y+dist;
  if(!c.got&&Math.abs(cy-430)<26&&Math.abs(c.x-px)<28){c.got=true;score+=40;H.sfx('ok');hud.set('pt',score|0);}
 });
 hud.set('pt',score|0);
 if(dist>=10400){gameOver();return;}
 x.fillStyle='#5A5A55';x.fillRect(0,0,460,520);
 x.strokeStyle='#E8A33D';x.lineWidth=3;
 for(let i=0;i<4;i++){const lx=60+i*113;x.beginPath();x.moveTo(lx,0);x.lineTo(lx,520);x.stroke();}
 CARS.forEach(c=>{
  const cy=c.y+dist;
  if(cy<-30||cy>550)return;
  x.font='30px system-ui';x.textAlign='center';x.fillText(c.hit?'💥':'🚗',c.x,cy+10);
 });
 COINS.forEach(c=>{
  const cy=c.y+dist;
  if(!c.got&&cy>-20&&cy<540){x.font='20px system-ui';x.fillText('🪙',c.x,cy+7);}
 });
 x.font='32px system-ui';x.fillText('🛒',px,442);
});
}});"""

# 311 — Ilha Deserta
GAMES[311] = r"""/* NCODE N · 311 Ilha Deserta — sobreviva 30 dias! */
GREG(311,{
init(root,H){
let over=false,day=1,water=70,food=70,shelter=0,energy=100,act=2;
const hud=H.hud(root,[['d','DIA','1/30'],['a','ÁGUA',70],['c','COMIDA',70],['s','ABRIGO',0]]);
const say=H.msg(root,'Sobreviva 30 dias! Cada dia tem 2 ações. Água e comida caem todo dia; abrigo protege das tempestades!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/30');hud.set('a',Math.max(0,water|0));hud.set('c',Math.max(0,food|0));hud.set('s',shelter+'%');
 st.innerHTML='🏝️ Dia '+day+'/30 · Ações: '+act+'<br>💧 '+bar(water)+' 🍖 '+bar(food)+' 🏠 '+shelter+'% · ⚡ '+energy;
 paintBtns();
}
function bar(v){const n=Math.round(H.clamp(v,0,100)/10);return'█'.repeat(n)+'░'.repeat(10-n);}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 const acts=[
  ['💧 Buscar água','+30 água, −20⚡',()=>{water=Math.min(100,water+30);energy-=20;}],
  ['🍖 Pescar','+25 comida, −25⚡',()=>{food=Math.min(100,food+25);energy-=25;}],
  ['🏠 Construir','+20% abrigo, −25⚡',()=>{shelter=Math.min(100,shelter+20);energy-=25;}],
  ['😴 Descansar','+40⚡',()=>{energy=Math.min(100,energy+40);}]
 ];
 acts.forEach(a=>{
  H.btn(brow,a[0]+' ('+a[1]+')',()=>{
   if(over||act<=0)return;
   if(energy<20&&a[0][0]!=='😴'){say('Cansado demais! Descanse.');H.sfx('bad');return;}
   a[2]();act--;H.sfx('tick');
   if(act<=0)nextDay();else status();
  },false);
 });
}
function nextDay(){
 water-=18+Math.random()*8;food-=15+Math.random()*8;
 if(day%6===0){
  const dmg=Math.max(0,40-shelter);
  water-=dmg/2;food-=dmg/2;energy-=dmg/3;
  say('⛈️ TEMPESTADE no dia '+day+'! Abrigo '+shelter+'% absorveu.');
 }
 day++;
 if(water<=0||food<=0){gameOver(false,water<=0?'Sede venceu no dia '+day+'.':'Fome venceu no dia '+day+'.');return;}
 if(day>30){gameOver(true);return;}
 act=2;energy=Math.min(100,energy+25);
 status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?500+shelter:day*10;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏝️ Resgatado!',sub:'30 dias sobrevividos! Abrigo '+shelter+'%.'}:{win:false,score:sc,title:'Não resistiu!',sub:why+' Equilibre água e comida!'});}
status();
}});"""

# 312 — Acampamento Ártico
GAMES[312] = r"""/* NCODE N · 312 Acampamento Ártico — calor é vida! */
GREG(312,{
init(root,H){
let over=false,day=1,warm=80,food=60,iglu=0,wood=30,act=2;
const hud=H.hud(root,[['d','DIA','1/20'],['f','CALOR',80],['c','COMIDA',60],['i','IGLU',0]]);
const say=H.msg(root,'Sobreviva 20 dias no gelo! O frio drena calor todo dia; iglu e fogueira (lenha) protegem. Comida também acaba!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/20');hud.set('f',Math.max(0,warm|0));hud.set('c',Math.max(0,food|0));hud.set('i',iglu+'%');
 st.innerHTML='❄️ Dia '+day+'/20 · Ações: '+act+'<br>🔥 '+warm.toFixed(0)+' · 🍖 '+food.toFixed(0)+' · 🪵 '+wood+' · 🧊 '+iglu+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 const acts=[
  ['🪵 Cortar lenha','+25 lenha',()=>{wood+=25;}],
  ['🔥 Fogueira','−15 lenha, +35 calor',()=>{if(wood<15){say('Sem lenha!');return false;}wood-=15;warm=Math.min(100,warm+35);}],
  ['🎣 Pescar no gelo','+25 comida',()=>{food=Math.min(100,food+25);}],
  ['🧊 Erguer iglu','+25% iglu',()=>{iglu=Math.min(100,iglu+25);}]
 ];
 acts.forEach(a=>{
  H.btn(brow,a[0]+' ('+a[1]+')',()=>{
   if(over||act<=0)return;
   const r=a[2]();
   if(r===false){H.sfx('bad');return;}
   act--;H.sfx('tick');
   if(act<=0)nextDay();else status();
  },false);
 });
}
function nextDay(){
 day++;
 const cold=22-iglu*.15-wood*.05;
 warm-=cold;food-=14;
 if(day%5===0){warm-=15;say('🌨️ NEVASCA no dia '+day+'! −15 calor.');}
 if(warm<=0){gameOver(false,'Congelou no dia '+day+'.');return;}
 if(food<=0){gameOver(false,'Fome no dia '+day+'.');return;}
 if(day>20){gameOver(true);return;}
 act=2;status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?450+iglu:day*10;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏔️ Inverno vencido!',sub:'20 dias! Iglu '+iglu+'%.'}:{win:false,score:sc,title:'O Ártico venceu!',sub:why+' Erga o iglu cedo!'});}
status();
}});"""

# 313 — Trilha na Selva
GAMES[313] = r"""/* NCODE N · 313 Trilha na Selva — ache a saída! */
GREG(313,{
init(root,H){
let over=false,hp=100,food=60,prog=0,step=0;
const EVENTS=[
 ['🐍 Cobra na trilha!','Desviar (−10 tempo)','Avançar (risco)',()=>{prog+=5;},()=>{if(Math.random()<.5){hp-=30;say('🐍 Picada! −30 vida.');}prog+=12;}],
 ['🍌 Bananeira!','Colher (+20 comida)','Ignorar',()=>{food=Math.min(100,food+20);prog+=6;},()=>{prog+=10;}],
 ['🐆 Onça por perto!','Subir em árvore','Correr',()=>{prog+=4;},()=>{if(Math.random()<.4){hp-=35;say('🐆 Arranhão! −35 vida.');}prog+=12;}],
 ['💧 Riacho!','Beber e lavar (+10 vida)','Seguir',()=>{hp=Math.min(100,hp+10);prog+=6;},()=>{prog+=10;}],
 ['🌧️ Chuva forte!','Abrigarse','Enfrentar',()=>{prog+=4;food-=5;},()=>{hp-=10;prog+=12;}],
 ['🪤 Fruta estranha!','Comer (+? comida)','Evitar',()=>{if(Math.random()<.5){food=Math.min(100,food+25);}else{hp-=20;say('🤢 Fruta ruim! −20 vida.');}prog+=8;},()=>{prog+=10;}]
];
const hud=H.hud(root,[['v','VIDA',100],['c','COMIDA',60],['p','TRILHA','0%']]);
const say=H.msg(root,'Atravesse a selva (100%)! Cada escolha move a trilha. Comida zera = perde vida. Vida zera = fim!');
const box=H.el('div','g-col',null,root);
const ev=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('v',Math.max(0,hp|0));hud.set('c',Math.max(0,food|0));hud.set('p',Math.min(100,prog|0)+'%');}
function next(){
 if(over)return;
 step++;
 food-=7;
 if(food<=0){hp-=12;food=0;say('😋 Fome! −12 vida.');}
 if(hp<=0){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 const e=EVENTS[(Math.random()*EVENTS.length)|0];
 ev.innerHTML='<b>Passo '+step+'</b> · '+e[0];
 brow.innerHTML='';
 H.btn(brow,'🅰️ '+e[1],()=>{e[3]();H.sfx('tick');status();next();},false);
 H.btn(brow,'🅱️ '+e[2],()=>{e[4]();H.sfx('tick');status();next();},false);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+hp:prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌴 Selva cruzada!',sub:step+' passos com '+(hp|0)+' de vida.'}:{win:false,score:sc|0,title:'Perdido na selva!',sub:'A selva foi mais forte. Coma quando puder!'});}
next();
}});"""

# 314 — Noite Zumbi
GAMES[314] = r"""/* NCODE N · 314 Noite Zumbi — segure até o amanhecer! */
GREG(314,{
init(root,H){
let over=false,wave=0,bar=100,ammo=30,kills=0,t=0,phase='build';
let zombs=[];
const hud=H.hud(root,[['o','ONDA','0/8'],['b','BARRICADA',100],['m','BALAS',30]]);
const say=H.msg(root,'Sobreviva a 8 ondas! Clique nos zumbis para atirar. Entre ondas: repare (+40) ou compre balas (+15). Barricada zera = fim!');
const o=H.cvs(root,480,400),x=o.x;
const brow=H.el('div','g-row',null,root);
function status(){hud.set('o',wave+'/8');hud.set('b',Math.max(0,bar|0));hud.set('m',ammo);}
function paintBtns(){
 brow.innerHTML='';
 if(over||phase!=='build')return;
 H.btn(brow,'🔨 Reparar (+40)',()=>{bar=Math.min(100,bar+40);H.sfx('tick');status();},false);
 H.btn(brow,'🔫 Balas (+15)',()=>{ammo+=15;H.sfx('tick');status();},false);
 H.btn(brow,'🌊 Chamar onda '+(wave+1),()=>{startWave();},true);
}
function startWave(){
 if(over||phase!=='build')return;
 wave++;
 const n=3+wave*2;
 zombs=[];
 for(let i=0;i<n;i++)zombs.push({x:500+Math.random()*220+i*30,y:80+Math.random()*280,hp:1+(wave>4?1:0),sp:26+wave*4+Math.random()*14});
 phase='fight';brow.innerHTML='';
 say('🌊 Onda '+wave+'/8 — '+n+' zumbis!');
 status();
}
H.onTap(o,(px,py)=>{
 if(over||phase!=='fight'||ammo<=0)return;
 ammo--;H.sfx('tick');
 let best=null,bd=1e9;
 zombs.forEach(z=>{const d=Math.hypot(px-z.x,py-z.y);if(d<bd){bd=d;best=z;}});
 if(best&&bd<40){best.hp--;if(best.hp<=0){zombs.splice(zombs.indexOf(best),1);kills++;}}
 status();
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=kills*20+(win?300:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌅 Amanheceu!',sub:kills+' zumbis abatidos!'}:{win:false,score:sc,title:'A casa caiu!',sub:'Onda '+wave+'/8 · '+kills+' abates. Mire na cabeça!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(phase==='fight'){
  zombs.forEach(z=>{z.x-=z.sp*dt;});
  zombs.filter(z=>z.x<70).forEach(z=>{zombs.splice(zombs.indexOf(z),1);bar-=12;H.sfx('bad');});
  status();
  if(bar<=0){gameOver(false);return;}
  if(!zombs.length){
   if(wave>=8){gameOver(true);return;}
   phase='build';ammo+=8;paintBtns();say('Onda '+wave+' limpa! +8 balas. Prepare-se.');
  }
 }
 x.fillStyle='#1C1C24';x.fillRect(0,0,480,400);
 x.fillStyle='#8A6A2F';x.fillRect(0,60,60,320);
 x.fillStyle='#5A4A33';
 for(let i=0;i<6;i++)x.fillRect(6,70+i*50,48,10);
 x.fillStyle='#D94E34';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('CASA '+Math.max(0,bar|0),4,54);
 zombs.forEach(z=>{x.font='26px system-ui';x.textAlign='center';x.fillText('🧟',z.x,z.y);});
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Onda '+wave+'/8 · 🔫'+ammo+' · 🧟'+zombs.length,70,30);
});
paintBtns();status();
}});"""

# 315 — Construtor de Jangada
GAMES[315] = r"""/* NCODE N · 315 Construtor de Jangada — monte e sobreviva! */
GREG(315,{
init(root,H){
let over=false,phase='build',wood=0,rope=0,hull=0,t=0,storm=0,hp=100;
const hud=H.hud(root,[['m','MADEIRA',0],['c','CORDA',0],['j','JANGADA','0%']]);
const say=H.msg(root,'Clique nos destroços para coletar! Monte a jangada (6🪵+4🪢) e sobreviva à tempestade remando e escoando água!');
const o=H.cvs(root,480,400),x=o.x;
const brow=H.el('div','g-row',null,root);
let debris=[];
for(let i=0;i<14;i++)debris.push({x:Math.random()*440+20,y:80+Math.random()*280,k:Math.random()<.6?'🪵':'🪢',got:false,ph:Math.random()*7});
H.onTap(o,(px,py)=>{
 if(over||phase!=='build')return;
 debris.forEach(d=>{
  if(!d.got&&Math.hypot(px-d.x,py-d.y)<26){
   d.got=true;
   if(d.k==='🪵')wood++;else rope++;
   H.sfx('tick');
   hud.set('m',wood);hud.set('c',rope);
   hud.set('j',Math.min(100,(wood/6*50+rope/4*50)|0)+'%');
   checkBuild();
  }
 });
});
function checkBuild(){
 if(wood>=6&&rope>=4){
  phase='storm';storm=40;
  say('🌊 TEMPESTADE! Escoe a água e reme até passar!');
  H.btn(brow,'🪣 Escoar água',()=>{if(!over&&phase==='storm'){storm-=0;hp=Math.min(100,hp+2);water=Math.max(0,water-18);H.sfx('tick');}},false);
  H.btn(brow,'🚣 Remar',()=>{if(!over&&phase==='storm'){storm-=2;water+=4;H.sfx('tick');}},false);
 }
}
let water=0;
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+hp:wood*10+rope*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Naufrágio vencido!',sub:'Jangada aguentou a tempestade!'}:{win:false,score:sc|0,title:'Afundou!',sub:'Escoe a água sem parar de remar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(phase==='storm'){
  storm-=dt;water+=dt*7;
  hp-=water>70?dt*14:0;
  if(water>=100||hp<=0){gameOver(false);return;}
  if(storm<=0){gameOver(true);return;}
 }
 x.fillStyle='#2E6E8A';x.fillRect(0,0,480,400);
 x.strokeStyle='rgba(255,255,255,.4)';
 for(let i=0;i<18;i++){const wy=(i*89+t*40)%440;x.beginPath();x.moveTo((i*167)%460,wy);x.lineTo((i*167)%460+30,wy);x.stroke();}
 if(phase==='build'){
  debris.forEach(d=>{if(!d.got){x.font='24px system-ui';x.textAlign='center';x.fillText(d.k,d.x,d.y+Math.sin(t*2+d.ph)*4);}});
  x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='center';
  x.fillText('🪵 '+wood+'/6  🪢 '+rope+'/4',240,30);
 }else{
  x.font='44px system-ui';x.textAlign='center';
  x.fillText('🛶',240+Math.sin(t*3)*8,220+Math.sin(t*5)*6);
  x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
  x.fillText('🌊 '+Math.ceil(storm)+'s · 💧 água '+(water|0)+'% · ❤️ '+(hp|0),14,30);
  x.fillStyle='#000';x.fillRect(14,40,300,12);
  x.fillStyle='#7FB3C8';x.fillRect(14,40,300*Math.min(1,water/100),12);
 }
});
}});"""

# 316 — Explorador de Caverna
GAMES[316] = r"""/* NCODE N · 316 Explorador de Caverna — ache a saída! */
GREG(316,{
init(root,H){
const MAP=[
 '##########',
 '#S...#...#',
 '###.#.#.#.',
 '#...#.#.#.',
 '#.#.#...#.',
 '#.#.#####.',
 '#.#.....#.',
 '#.#####.#.',
 '#G..#..G#.',
 '##########'
];
const CS=44,OX=10,OY=10;
let over=false,pc=1,pr=1,torch=100,gems=0,cd=0;
let grid=MAP.map(r=>r.split(''));
const hud=H.hud(root,[['t','TOCHA','100%'],['g','GEMAS',0]]);
const say=H.msg(root,'Ache a saída 🚪 no escuro! A tocha apaga com o tempo — gemas 💎 recarregam +20. Setas ou toque vizinho.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(grid[nr]===undefined||grid[nr][nc]==='#')return;
 pc=nc;pr=nr;cd=.14;torch-=1.2;H.sfx('tick');
 if(grid[nr][nc]==='G'){grid[nr][nc]='.';gems++;torch=Math.min(100,torch+25);H.sfx('ok');hud.set('g',gems);}
 if(nr===3&&nc===9){gameOver(true);return;}
 if(torch<=0){gameOver(false);return;}
 status();
}
function status(){hud.set('t',Math.max(0,torch|0)+'%');}
function gameOver(win){over=true;const sc=win?300+gems*80+Math.ceil(torch)*2:gems*40;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🔦 Caverna vencida!',sub:gems+' gemas e tocha em '+(torch|0)+'%.'}:{win:false,score:sc|0,title:'Escuridão total!',sub:'A tocha apagou. Pegue as gemas 💎!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;if(cd>0)cd-=dt;
 torch-=dt*.8;
 hud.set('t',Math.max(0,torch|0)+'%');
 if(torch<=0){gameOver(false);return;}
 x.fillStyle='#0C0C10';x.fillRect(0,0,460,460);
 const R=2.2;
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){
  const d=Math.hypot(c-pc,r-pr);
  if(d>R+1)continue;
  const v=grid[r][c];
  x.globalAlpha=d>R?.25:1;
  x.fillStyle=v==='#'?'#4A4A44':'.#'.includes(v)?'#2A2A33':'#2A2A33';
  if(v==='.')x.fillStyle='#2A2A33';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.globalAlpha=1;
  if(v==='G'&&d<=R+1){x.font='22px system-ui';x.textAlign='center';x.fillText('💎',OX+c*CS+22,OY+r*CS+32);}
 }
 x.font='22px system-ui';x.textAlign='center';x.fillText('🚪',OX+9*CS+22,OY+3*CS+32);
 x.fillStyle='#E8A33D';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,10,0,7);x.fill();
 x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('🔥 '+(torch|0)+'%  💎 '+gems,12,452);
});
status();
}});"""

# 317 — Fuga do Vulcão
GAMES[317] = r"""/* NCODE N · 317 Fuga do Vulcão — corra da lava! */
GREG(317,{
init(root,H){
const N=10,CS=44,OX=10,OY=10;
let over=false,pc=0,pr=9,lava=[],t=0,tick=0,cd=0;
for(let c=0;c<N;c++)lava.push([c,0]);
const hud=H.hud(root,[['tp','LAVA','!']]);
const say=H.msg(root,'Chegue ao barco 🚤 antes da lava! A lava desce 1 fileira a cada 2s. Setas ou toque vizinho. Não pise na lava!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
const isLava=(c,r)=>lava.some(l=>l[0]===c&&l[1]===r);
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N||isLava(nc,nr))return;
 pc=nc;pr=nr;cd=.12;H.sfx('tick');
 if(pc===9&&pr===9){gameOver(true);return;}
}
function gameOver(win){over=true;const sc=win?Math.max(150,500-(t|0)*8):(9-pr)*20+pc*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌋 Escapou por pouco!',sub:'Em '+t.toFixed(1)+'s!'}:{win:false,score:sc|0,title:'A lava venceu!',sub:'Seja mais direto ao barco 🚤!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;t+=dt;tick+=dt;if(cd>0)cd-=dt;
 if(tick>2){tick=0;
  const maxR=Math.max.apply(null,lava.map(l=>l[1]));
  for(let c=0;c<N;c++)if(!lava.some(l=>l[0]===c&&l[1]===maxR+1)&&maxR+1<N)lava.push([c,maxR+1]);
  H.sfx('bad');
 }
 if(isLava(pc,pr)){gameOver(false);return;}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=isLava(c,r)?(Math.sin(t*6+c+r)>0?'#D94E34':'#B23A24'):'#3E7C4F';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='rgba(0,0,0,.2)';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.font='24px system-ui';x.textAlign='center';
 x.fillText('🌋',OX+4*CS+22,OY+0*CS+32);
 x.fillText('🚤',OX+9*CS+22,OY+9*CS+32);
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,5,0,7);x.fill();
});
}});"""

# 318 — Sobrevivência à Enchente
GAMES[318] = r"""/* NCODE N · 318 Sobrevivência à Enchente — suba! */
GREG(318,{
init(root,H){
let over=false,px=230,py=420,vy=0,ground=true,water=460,t=0,sup=0,time=90;
const PLAT=[{x:60,w:120,y:360},{x:280,w:120,y:300},{x:80,w:120,y:230},{x:280,w:120,y:160},{x:140,w:180,y:90}];
const SUP=[];
for(let i=0;i<6;i++)SUP.push({x:60+Math.random()*340,y:[330,270,200,130,60][i%5],got:false});
const hud=H.hud(root,[['s','SUPRIMENTOS','0/6'],['tp','TEMPO',90]]);
const say=H.msg(root,'A água sobe! Pule nas plataformas (Espaço/⬆️), pegue 6 suprimentos 📦 e aguente 90s!');
const o=H.cvs(root,460,500),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&(c==='Space'||c==='ArrowUp'||c==='KeyW'))jump();});
H.onTap(o,(qx,qy)=>{if(qy<py-40)jump();else tapX=qx;});
let tapX=null;
function jump(){if(over||!ground)return;vy=-400;ground=false;H.sfx('tick');}
function gameOver(win){over=true;const sc=sup*60+(win?300:0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Resgate chegou!',sub:sup+'/6 suprimentos!'}:{win:false,score:sc|0,title:'Levado pela água!',sub:'Suba sempre, sem parar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 water-=dt*4.2;
 if(dn.ArrowLeft||dn.KeyA)px-=180*dt;
 if(dn.ArrowRight||dn.KeyD)px+=180*dt;
 if(tapX!=null){px+=(tapX-px)*4*dt;}
 px=H.clamp(px,16,444);
 vy+=1000*dt;py+=vy*dt;ground=false;
 if(py>=430){py=430;vy=0;ground=true;}
 PLAT.forEach(p=>{
  if(px>=p.x&&px<=p.x+p.w&&py>=p.y-4&&py<=p.y+18&&vy>=0){py=p.y;vy=0;ground=true;}
 });
 SUP.forEach(s=>{
  if(!s.got&&Math.hypot(px-s.x,py-s.y)<30){s.got=true;sup++;H.sfx('ok');hud.set('s',sup+'/6');}
 });
 hud.set('tp',Math.ceil(time));
 if(py+10>water){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,500);
 PLAT.forEach(p=>{x.fillStyle='#8A6A2F';x.fillRect(p.x,p.y,p.w,14);});
 SUP.forEach(s=>{if(!s.got){x.font='20px system-ui';x.textAlign='center';x.fillText('📦',s.x,s.y);}});
 x.fillStyle='rgba(46,110,138,.85)';x.fillRect(0,water,460,500-water);
 x.strokeStyle='#fff';x.lineWidth=2;
 x.beginPath();x.moveTo(0,water);
 for(let sx=0;sx<=460;sx+=20)x.lineTo(sx,water+Math.sin(sx*.05+t*3)*4);
 x.stroke();
 x.font='26px system-ui';x.textAlign='center';x.fillText('🏊',px,py-8);
});
}});"""

# 319 — Cabana na Floresta
GAMES[319] = r"""/* NCODE N · 319 Cabana na Floresta — erga antes do inverno! */
GREG(319,{
init(root,H){
let over=false,day=1,logs=0,food=40,cabin=0,act=2;
const hud=H.hud(root,[['d','DIA','1/15'],['t','TORAS',0],['c','COMIDA',40],['h','CABANA','0%']]);
const say=H.msg(root,'Erga a cabana (8 toras) em 15 dias! Coma todo dia. Sem cabana no inverno = fim!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/15');hud.set('t',logs);hud.set('c',Math.max(0,food|0));hud.set('h',cabin+'%');
 st.innerHTML='🌲 Dia '+day+'/15 · Ações: '+act+'<br>🪵 '+logs+' · 🍖 '+food.toFixed(0)+' · 🛖 '+cabin+'%'+(cabin>=100?' ✅ PRONTA!':'');
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🪓 Cortar (+2 toras)',()=>{if(act<=0||over)return;logs+=2;act--;H.sfx('tick');after();},false);
 H.btn(brow,'🍖 Caçar (+20 comida)',()=>{if(act<=0||over)return;food=Math.min(100,food+20);act--;H.sfx('tick');after();},false);
 H.btn(brow,'🔨 Construir (−2 toras, +25%)',()=>{
  if(act<=0||over)return;
  if(logs<2){say('Sem toras! Corte primeiro.');H.sfx('bad');return;}
  logs-=2;cabin=Math.min(100,cabin+25);act--;H.sfx('ok');after();
 },true);
}
function after(){
 if(act<=0){
  day++;food-=12;
  if(food<=0){gameOver(false,'Fome na floresta.');return;}
  if(day>15){gameOver(cabin>=100,cabin>=100?'':'O inverno chegou sem cabana!');return;}
  act=2;
 }
 status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?400+food:cabin*3;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🛖 Cabana pronta!',sub:'Inverno tranquilo!'}:{win:false,score:sc|0,title:'Inverno cruel!',sub:why+' Priorize toras!'});}
status();
}});"""

# 320 — Naufrágio
GAMES[320] = r"""/* NCODE N · 320 Naufrágio — nade e sinalize! */
GREG(320,{
init(root,H){
let over=false,px=60,py=300,stam=100,t=0,sig=0,phase='swim';
const DEB=[];
for(let i=0;i<12;i++)DEB.push({x:100+Math.random()*600,y:100+Math.random()*320,hit:false});
const hud=H.hud(root,[['f','FÔLEGO','100%'],['s','SINAL','0%']]);
const say=H.msg(root,'Nade até a praia 🏖️ desviando dos destroços! Lá, fique parado para acender a fogueira de sinalização!');
const o=H.cvs(root,560,420),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx-cam;ty=qy;});
let tx=null,ty=null,cam=0;
function gameOver(win){over=true;const sc=win?Math.max(200,500-(t|0)*5):px/8|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🔥 Resgatado!',sub:'Sinalização acesa!'}:{win:false,score:sc|0,title:'À deriva!',sub:stam<=0?'Fôlego zerado — nade com calma!':'Os destroços te pegaram. Desvie!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=140*dt;
 let moving=false;
 if(dn.ArrowLeft||dn.KeyA){px-=sp;moving=true;}
 if(dn.ArrowRight||dn.KeyD){px+=sp;moving=true;}
 if(dn.ArrowUp||dn.KeyW){py-=sp;moving=true;}
 if(dn.ArrowDown||dn.KeyS){py+=sp;moving=true;}
 if(tx!=null){const d=Math.hypot(tx-px,ty-py);if(d>8){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;moving=true;}}
 px=H.clamp(px,30,770);py=H.clamp(py,60,380);
 if(moving)stam-=dt*6;else stam=Math.min(100,stam+dt*10);
 DEB.forEach(d=>{
  if(!d.hit&&Math.hypot(px-d.x,py-d.y)<26){d.hit=true;stam-=22;H.sfx('bad');}
 });
 hud.set('f',Math.max(0,stam|0)+'%');
 if(stam<=0){gameOver(false);return;}
 if(px>=730){
  phase='sig';
  if(!moving){sig+=dt/4*100;hud.set('s',Math.min(100,sig|0)+'%');}
  if(sig>=100){gameOver(true);return;}
 }
 cam=H.clamp(px-140,0,240);
 x.fillStyle='#2E6E8A';x.fillRect(0,0,560,420);
 x.fillStyle='#E8C86B';x.fillRect(730-cam,0,90,420);
 x.font='30px system-ui';x.textAlign='center';x.fillText('🏖️',765-cam,60);
 DEB.forEach(d=>{if(!d.hit){x.font='22px system-ui';x.fillText('🛢️',d.x-cam,d.y);}});
 x.font='30px system-ui';x.fillText('🏊',px-cam,py+10);
 if(phase==='sig'){x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';x.fillText('🔥 Acendendo: '+(sig|0)+'% — fique PARADO!',14,30);}
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
