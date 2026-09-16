#!/usr/bin/env python3
"""Gera games/g281..g300 — RACING (20 jogos)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 281 — Kart
GAMES[281] = r"""/* NCODE N · 281 Kart — 3 voltas com boost! */
GREG(281,{
init(root,H){
const WP=[[230,400],[80,400],[60,230],[80,70],[230,50],[380,70],[400,230],[380,400]];
const BOOST=[{x:230,y:225,r:22},{x:80,y:230,r:22}];
let over=false,px=230,py=360,a=-Math.PI/2,v=0,lap=0,chk=0,t=0,boost=0;
let ax=230,ay=330,ai=0,alap=0;
const hud=H.hud(root,[['v','VOLTA','1/3'],['tp','TEMPO','0.0'],['pos','POS','1º']]);
const say=H.msg(root,'3 voltas! Passe pelos ⚡ para turbo. Grama diminui. Vença o kart azul! Setas ou toque nos lados.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{steer=qx<230?-1:1;setTimeout2();});
let steer=0,sT=0;
function setTimeout2(){sT=.4;}
function onTrack(x2,y2){
 return x2>40&&x2<420&&y2>30&&y2<430&&!(x2>130&&x2<330&&y2>120&&y2<340);
}
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*5):100+lap*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏁 Vitória no kart!',sub:'3 voltas em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Azul venceu!',sub:'Use os turbos ⚡ nas retas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(sT>0)sT-=dt;else steer=0;
 const up=dn.ArrowUp||dn.KeyW,dn2=dn.ArrowDown||dn.KeyS;
 const L=(dn.ArrowLeft||dn.KeyA)||steer<0,R=(dn.ArrowRight||dn.KeyD)||steer>0;
 if(boost>0)boost-=dt;
 const max=boost>0?300:190;
 if(up)v=Math.min(max,v+260*dt);else if(dn2)v=Math.max(-80,v-260*dt);else v*=.985;
 if(!onTrack(px,py))v*=.94;
 if(L)a-=2.6*dt*(v>=0?1:-1);if(R)a+=2.6*dt*(v>=0?1:-1);
 px+=Math.cos(a)*v*dt;py+=Math.sin(a)*v*dt;
 px=H.clamp(px,10,450);py=H.clamp(py,10,450);
 BOOST.forEach(b=>{if(Math.hypot(px-b.x,py-b.y)<b.r){boost=1.6;H.sfx('ok');}});
 const w=WP[chk];
 if(Math.hypot(px-w[0],py-w[1])<45){chk=(chk+1)%WP.length;if(chk===0){lap++;H.sfx('ok');hud.set('v',Math.min(3,lap+1)+'/3');}}
 // rival
 const aw=WP[ai],ad=Math.hypot(aw[0]-ax,aw[1]-ay);
 if(ad<40){ai=(ai+1)%WP.length;if(ai===0)alap++;}
 const aa=Math.atan2(aw[1]-ay,aw[0]-ax);
 ax+=Math.cos(aa)*150*dt;ay+=Math.sin(aa)*150*dt;
 hud.set('tp',t.toFixed(1));
 hud.set('pos',(lap*10+chk)>=(alap*10+ai)?'1º':'2º');
 if(lap>=3){gameOver(true);return;}
 if(alap>=3){gameOver(false);return;}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,460,460);
 x.fillStyle='#8A877C';x.fillRect(40,30,380,400);
 x.fillStyle='#3E7C4F';x.fillRect(130,120,200,220);
 x.strokeStyle='#FAF7F0';x.lineWidth=3;x.strokeRect(40,30,380,400);x.strokeRect(130,120,200,220);
 BOOST.forEach(b=>{x.fillStyle='#C4D645';x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill();x.fillStyle='#181816';x.font='20px system-ui';x.textAlign='center';x.fillText('⚡',b.x,b.y+7);});
 x.fillStyle='#fff';x.fillRect(210,392,40,8);
 WP.forEach((q,i)=>{if(i===chk){x.strokeStyle='#C4D645';x.lineWidth=3;x.beginPath();x.arc(q[0],q[1],18+4*Math.sin(t*6),0,7);x.stroke();}});
 [[ax,ay,'#2E6E8A',0],[px,py,'#D94E34',a]].forEach(k=>{
  x.save();x.translate(k[0],k[1]);x.rotate(k[3]);
  x.fillStyle=k[2];x.fillRect(-12,-8,24,16);
  x.fillStyle='#181816';x.fillRect(-14,-11,5,6);x.fillRect(-14,5,5,6);x.fillRect(9,-11,5,6);x.fillRect(9,5,5,6);
  x.restore();
 });
 if(boost>0){x.fillStyle='#C4D645';x.font='bold 15px system-ui';x.textAlign='center';x.fillText('TURBO!',px,py-18);}
});
}});"""

# 282 — Arrancada
GAMES[282] = r"""/* NCODE N · 282 Arrancada — troque no verde! */
GREG(282,{
init(root,H){
let over=false,rpm=0,gear=1,dist=0,rdist=0,t=0,red=0,go=false,cd=3;
const hud=H.hud(root,[['m','MARCHA',1],['d','DIST','0m']]);
const say=H.msg(root,'Segure ACELERAR para subir o giro e troque no VERDE! Vermelho demais quebra o motor. 400m contra o rival!');
const o=H.cvs(root,460,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&(c==='Space'||c==='Enter'))shift();});
H.btn(root,'🔼 TROCAR MARCHA (Espaço)',shift,true);
const acc=H.btn(root,'🟢 Segurar = ACELERAR',()=>{},false);
acc.addEventListener('pointerdown',()=>{dn.acc=true;});
acc.addEventListener('pointerup',()=>{dn.acc=false;});
function shift(){
 if(over||!go)return;
 if(rpm>6.2&&rpm<8){gear=Math.min(5,gear+1);rpm=3;H.sfx('ok');}
 else if(rpm>=8){H.sfx('bad');}
 else{H.sfx('tick');}
}
function gameOver(win){over=true;const sc=win?Math.max(150,500-(t|0)*8):dist|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏁 Arrancada vencida!',sub:'400m em '+t.toFixed(2)+'s.'}:{win:false,score:sc,title:'Rival venceu!',sub:'Troque sempre no verde!'});}
H.loop(dt=>{
 if(over)return;
 if(cd>0){cd-=dt;if(cd<=0){go=true;say('FOI! 🟢');} }
 else t+=dt;
 const th=dn.acc||dn.ArrowUp||dn.KeyW;
 if(go&&th)rpm+=dt*(9-gear);
 else rpm-=dt*4;
 rpm=H.clamp(rpm,0,10);
 if(rpm>=8.6)red+=dt;else red=Math.max(0,red-dt*2);
 if(red>1.2){gameOver(false);return;}
 const sp=go?(gear*14+rpm*4)*(red>.4?.6:1):0;
 dist+=sp*dt;
 rdist+=go?(62+t*1.5)*dt:0;
 hud.set('m',gear);hud.set('d',(dist|0)+'m');
 if(dist>=400){gameOver(true);return;}
 if(rdist>=400){gameOver(false);return;}
 x.fillStyle='#2A2A33';x.fillRect(0,0,460,340);
 x.fillStyle='#3A3A45';x.fillRect(0,120,460,140);
 x.fillStyle='#E8A33D';
 for(let i=0;i<12;i++)x.fillRect((i*60-(dist*2%60)),198,30,5);
 x.font='34px system-ui';x.textAlign='center';
 x.fillText('🚗',60+(dist/400)*340,165);
 x.fillText('🚙',60+(rdist/400)*340,235);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('VOCÊ '+Math.min(400,dist|0)+'m  ●  RIVAL '+Math.min(400,rdist|0)+'m',14,40);
 // conta-giros
 x.fillStyle='#000';x.fillRect(14,60,432,34);
 for(let i=0;i<=10;i++){
  x.fillStyle=i<6?'#3E7C4F':i<8?'#C4D645':'#D94E34';
  if(rpm>=i)x.fillRect(16+i*43,62,40,30);
 }
 x.fillStyle='#fff';x.font='bold 14px system-ui';
 x.fillText('GIRO '+rpm.toFixed(1)+'  ·  Marcha '+gear+'/5'+(red>.4?'  ⚠️ MOTOR!':''),14,115);
 if(cd>0){x.fillStyle='#C4D645';x.font='bold 60px system-ui';x.textAlign='center';x.fillText(Math.ceil(cd),230,200);}
});
}});"""

# 283 — Subida da Colina
GAMES[283] = r"""/* NCODE N · 283 Subida da Colina — sem capotar! */
GREG(283,{
init(root,H){
const HILLS=[];let hx=0;
for(let i=0;i<60;i++){HILLS.push({x:hx,h:120+Math.sin(i*.7)*60+Math.random()*40});hx+=90;}
const TOP=HILLS[HILLS.length-1].x;
let over=false,px=30,tilt=0,v=0,fuel=100,t=0;
const hud=H.hud(root,[['c','COMBUSTÍVEL','100%'],['d','DIST','0%']]);
const say=H.msg(root,'Suba até o topo 🏁! ⬆️ acelera, ⬇️ freia, ⬅️➡️ inclinam. Capotou (|inclinação| alta) ou sem combustível = fim!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapSide=qx<280?-1:1;tapT=.3;});
let tapSide=0,tapT=0;
function gy(x2){
 const i=H.clamp(Math.floor(x2/90),0,HILLS.length-2),f=(x2-i*90)/90;
 return 330-(HILLS[i].h*(1-f)+HILLS[i+1].h*f);
}
function slope(x2){return(gy(x2+10)-gy(x2-10))/20;}
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*6):(px/TOP*200|0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🏔️ Topo conquistado!',sub:'Em '+t.toFixed(1)+'s com '+(fuel|0)+'% de tanque.'}:{win:false,score:sc,title:'Ficou no caminho!',sub:fuel<=0?'Sem combustível — dose o acelerador!':'Capotou! Incline nas subidas.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapSide=0;
 const up=dn.ArrowUp||dn.KeyW,dn2=dn.ArrowDown||dn.KeyS;
 const L=(dn.ArrowLeft||dn.KeyA)||tapSide<0,R=(dn.ArrowRight||dn.KeyD)||tapSide>0;
 if(up&&fuel>0){v+=140*dt;fuel-=7*dt;}
 if(dn2)v-=160*dt;
 v-=slope(px)*60*dt;v*=.995;v=H.clamp(v,-60,220);
 px+=v*dt;px=Math.max(10,px);
 const sl=slope(px);
 tilt+=(Math.atan(sl)*.9-tilt)*2*dt;
 if(L)tilt-=1.4*dt;if(R)tilt+=1.4*dt;
 tilt=H.clamp(tilt,-1.4,1.4);
 hud.set('c',(Math.max(0,fuel)|0)+'%');hud.set('d',Math.min(99,px/TOP*100|0)+'%');
 if(Math.abs(tilt)>1.25||fuel<=0){gameOver(false);return;}
 if(px>=TOP){gameOver(true);return;}
 const cam=H.clamp(px-140,0,TOP-420);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,380);
 x.fillStyle='#3E7C4F';x.beginPath();x.moveTo(0,380);
 for(let sx=0;sx<=560;sx+=14)x.lineTo(sx,gy(sx+cam));
 x.lineTo(560,380);x.fill();
 x.font='26px system-ui';x.textAlign='center';x.fillText('🏁',TOP-cam,gy(TOP)-24);
 const py=gy(px);
 x.save();x.translate(px-cam,py-14);x.rotate(tilt);
 x.fillStyle='#D94E34';x.fillRect(-24,-12,48,14);
 x.fillStyle='#181816';x.beginPath();x.arc(-14,4,8,0,7);x.arc(14,4,8,0,7);x.fill();
 x.restore();
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('⛽ '+(Math.max(0,fuel)|0)+'%   '+(px/TOP*100|0)+'% do morro',12,26);
});
}});"""

# 284 — Corrida de Barco
GAMES[284] = r"""/* NCODE N · 284 Corrida de Barco — slalom nas boias! */
GREG(284,{
init(root,H){
let over=false,px=230,t=0,dist=0,pen=0,sp=0;
const GATES=[];
for(let i=0;i<14;i++)GATES.push({y:-i*420-300,gx:90+Math.random()*280,got:false});
const hud=H.hud(root,[['p','PORTÕES','0/14'],['tp','TEMPO','0.0']]);
const say=H.msg(root,'Passe ENTRE as boias 🟠🟠! ⬆️ acelera, ⬅️➡️ viram. Portão perdido = +5s. 14 portões!');
const o=H.cvs(root,460,480),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.35;});
let tapS=0,tapT=0;
function gameOver(){over=true;const tot=t+pen;const win=pen<=15;const sc=Math.max(100,900-tot*8);H.score(sc);
H.done({win,score:sc,title:win?'🚤 Rio dominado!':'🌊 Chegou, mas…',sub:'Tempo '+tot.toFixed(1)+'s (punição '+pen+'s). '+GATES.filter(g=>g.got).length+'/14 portões.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const up=dn.ArrowUp||dn.KeyW,L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 sp+=((up?260:150)-sp)*2*dt;
 if(L)px-=200*dt;if(R)px+=200*dt;
 px=H.clamp(px,50,410);
 dist+=sp*dt;
 GATES.forEach(g=>{
  const gy=g.y+dist;
  if(!g.got&&!g.missed&&gy>440){
   if(Math.abs(px-g.gx)<55){g.got=true;H.sfx('ok');}
   else{g.missed=true;pen+=5;H.sfx('bad');}
   hud.set('p',GATES.filter(q=>q.got).length+'/14');
  }
 });
 hud.set('tp',t.toFixed(1)+'+'+pen);
 if(dist>14*420+400){gameOver();return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,460,480);
 x.fillStyle='#3EAFBF';
 for(let i=0;i<20;i++){const wy=(i*97+dist*.5)%520-20;x.fillRect((i*173)%440,wy,26,4);}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,40,480);x.fillRect(420,0,40,480);
 GATES.forEach(g=>{
  const gy=g.y+dist;
  if(gy<-40||gy>520)return;
  x.fillStyle=g.got?'#3E7C4F':g.missed?'#D94E34':'#E8A33D';
  x.beginPath();x.arc(g.gx-55,gy,14,0,7);x.arc(g.gx+55,gy,14,0,7);x.fill();
  x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 });
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚤',px,430);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('⏱️ '+t.toFixed(1)+'s (+'+pen+')  Portões '+GATES.filter(g=>g.got).length+'/14',12,26);
});
}});"""

# 285 — Trial de Moto
GAMES[285] = r"""/* NCODE N · 285 Trial de Moto — sem pôr o pé! */
GREG(285,{
init(root,H){
const OBS=[];
for(let i=0;i<10;i++)OBS.push({x:300+i*330,h:30+Math.random()*55});
let over=false,px=60,bal=0,dabs=0,t=0,v=0;
const hud=H.hud(root,[['p','PÉS NO CHÃO','0/5'],['d','DIST','0%']]);
const say=H.msg(root,'Chegue ao fim! A moto balança sozinha — ⬅️➡️ equilibram. Balanço no limite = pé no chão (5 = fim). ⬆️ acelera!');
const o=H.cvs(root,560,360),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function bump(x2){
 let h=0;
 OBS.forEach(ob=>{const d=Math.abs(x2-ob.x);if(d<60)h=Math.max(h,ob.h*(1-d/60));});
 return h;
}
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*5-dabs*40):(px/3600*150|0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🏍️ Trial limpo!',sub:dabs+' pés em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Cheio de pés!',sub:'5 apoios. Antecipe o balanço!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const up=dn.ArrowUp||dn.KeyW,L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD;
 v+=((up?170:90)-v)*2*dt;
 px+=v*dt;
 bal+=Math.sin(t*2.3)*28*dt+Math.sin(t*5.1)*12*dt;
 if(L)bal-=60*dt;if(R)bal+=60*dt;
 bal=H.clamp(bal,-100,100);
 if(Math.abs(bal)>=100){dabs++;bal=0;H.sfx('bad');hud.set('p',dabs+'/5');if(dabs>=5){gameOver(false);return;}}
 hud.set('d',Math.min(99,px/3600*100|0)+'%');
 if(px>=3600){gameOver(true);return;}
 const cam=px-120;
 x.fillStyle='#BFD9E2';x.fillRect(0,0,560,360);
 x.fillStyle='#8A6A2F';x.beginPath();x.moveTo(0,360);
 for(let sx=0;sx<=560;sx+=12)x.lineTo(sx,300-bump(sx+cam));
 x.lineTo(560,360);x.fill();
 OBS.forEach(ob=>{
  const ox=ob.x-cam;
  if(ox>-40&&ox<600){x.fillStyle='#5A4A33';x.fillRect(ox-8,300-ob.h-14,16,14);x.font='20px system-ui';x.textAlign='center';x.fillText('🪵',ox,300-ob.h);}
 });
 x.font='26px system-ui';x.textAlign='center';x.fillText('🏁',3600-cam,270);
 const py=300-bump(px);
 x.save();x.translate(120,py-16);x.rotate(bal/300);
 x.font='30px system-ui';x.fillText('🏍️',0,10);x.restore();
 x.fillStyle='#181816';x.fillRect(180,20,200,16);
 x.fillStyle='#3E7C4F';x.fillRect(270,20,20,16);
 x.fillStyle=Math.abs(bal)>70?'#D94E34':'#E8A33D';
 x.fillRect(280+bal*0.9-4,16,8,24);
 x.fillStyle='#181816';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('EQUILÍBRIO',70,33);
});
}});"""

# 286 — Skate Park
GAMES[286] = r"""/* NCODE N · 286 Skate Park — 90s de manobras! */
GREG(286,{
init(root,H){
let over=false,score=0,time=90,last=-1,rep=0,air=0,trick='',trickT=0;
const TRICKS=[['Ollie',50],['Kickflip',120],['360°',200],['Grind',150]];
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',90]]);
const say=H.msg(root,'Faça manobras antes do tempo! Repetir a mesma vale metade. Meta: 1500 pontos!');
const o=H.cvs(root,460,320),x=o.x;
const brow=H.el('div','g-row',null,root);
TRICKS.forEach((tr,i)=>{
 H.btn(brow,'🛹 '+tr[0]+' ('+tr[1]+')',()=>{
  if(over||air<=0)return;
  let pts=tr[1];
  if(i===last){rep++;pts=Math.max(10,pts>>rep);}else{rep=0;}
  last=i;score+=pts;air=Math.max(air,.5);
  trick=tr[0]+' +'+pts;trickT=1;H.sfx('ok');
  hud.set('pt',score);
 },false);
});
H.btn(root,'⬆️ PULAR (rampa)',()=>{
 if(over||air>0)return;
 air=1.1;H.sfx('tick');
},true);
function gameOver(){over=true;const win=score>=1500;H.score(score);
H.done(win?{win:true,score,title:'🛹 Lenda do park!',sub:score+' pontos!'}:{win:false,score,title:'Fim do tempo!',sub:score+'/1500 pontos. Varie as manobras!'});}
H.loop(dt=>{
 if(over)return;
 time-=dt;if(air>0)air-=dt;if(trickT>0)trickT-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver();return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,320);
 x.fillStyle='#8A877C';x.fillRect(0,240,460,80);
 x.fillStyle='#5A5A55';
 x.beginPath();x.moveTo(60,240);x.quadraticCurveTo(130,240,150,180);x.lineTo(190,180);x.quadraticCurveTo(210,240,280,240);x.fill();
 x.beginPath();x.moveTo(320,240);x.lineTo(380,160);x.lineTo(400,160);x.lineTo(400,240);x.fill();
 const py=air>0?190-air*90:232;
 x.font='34px system-ui';x.textAlign='center';
 x.fillText('🛹',230+(air>0?Math.sin(air*9)*20:0),py);
 if(trickT>0){x.fillStyle='#181816';x.font='bold 20px system-ui';x.fillText(trick,230,80);}
 x.fillStyle='#181816';x.font='bold 17px system-ui';x.textAlign='left';
 x.fillText(score+' pts · ⏱️'+Math.ceil(time)+'s · meta 1500',12,28);
});
}});"""

# 287 — Salto de Esqui
GAMES[287] = r"""/* NCODE N · 287 Salto de Esqui — voe longe! */
GREG(287,{
init(root,H){
let over=false,phase='down',sp=0,px=0,py=0,vy=0,lean=0,jump=1,best=0,t=0;
const hud=H.hud(root,[['s','SALTO','1/3'],['d','MELHOR','0m']]);
const say=H.msg(root,'⬇️ agacha na descida (mais velocidade)! Na rampa, ⬅️➡️ ajustam a inclinação do voo. Pouse reto! Melhor de 3 saltos.');
const o=H.cvs(root,560,360),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function rampY(x2){return x2<300?60+x2*.5:210-(x2-300)*.28;}
function landY(x2){return x2<330?400:400-(x2-330)*.55;}
function gameOver(){over=true;const win=best>=70;H.score(best|0);
H.done(win?{win:true,score:best|0,title:'🎿 Voo incrível!',sub:'Melhor salto: '+best.toFixed(1)+'m.'}:{win:false,score:best|0,title:'Saltos curtos!',sub:'Melhor: '+best.toFixed(1)+'m. Agache mais na descida!'});}
function nextJump(crash,d){
 if(crash){say('💥 Queda! Pouse com o corpo reto (incline ⬅️➡️).');}
 else{best=Math.max(best,d);hud.set('d',best.toFixed(1)+'m');say('Salto de '+d.toFixed(1)+'m!');}
 jump++;
 if(jump>3){gameOver();return;}
 hud.set('s',jump+'/3');
 phase='down';sp=0;lean=0;t=0;
}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(phase==='down'){
  const tuck=dn.ArrowDown||dn.KeyS;
  sp+=((tuck?120:70)-sp)*1.5*dt;
  px+=sp*dt*3;
  if(px>=300){phase='fly';px=300;py=rampY(300);vy=-60-sp*.5;}
 }else if(phase==='fly'){
  if(dn.ArrowLeft||dn.KeyA)lean-=1.6*dt;
  if(dn.ArrowRight||dn.KeyD)lean+=1.6*dt;
  lean=H.clamp(lean,-1,1);
  vy+=260*dt-lean*60*dt;
  px+=(60+sp*.6)*dt;py+=vy*dt;
  if(py>=landY(px)-8){
   const d=(px-330)*.35;
   if(Math.abs(lean)>.55||vy>260)nextJump(true,0);
   else nextJump(false,Math.max(5,d));
   px=0;py=0;vy=0;
  }
 }else{px=0;}
 if(phase==='down'&&px>300)px=300;
 x.fillStyle='#BFD9E2';x.fillRect(0,0,560,360);
 x.fillStyle='#fff';
 x.beginPath();x.moveTo(0,400);
 for(let sx=0;sx<=560;sx+=10)x.lineTo(sx,Math.min(400,landY(sx)));
 x.lineTo(560,400);x.fill();
 x.strokeStyle='#8A6A2F';x.lineWidth=8;
 x.beginPath();x.moveTo(0,60);x.lineTo(300,rampY(300));x.stroke();
 let jx,jy,rot;
 if(phase==='down'){jx=px; jy=rampY(Math.min(300,px))-14;rot=.46;}
 else{jx=px; jy=py;rot=lean*.7;}
 x.save();x.translate(H.clamp(jx,20,540),jy);x.rotate(rot);
 x.font='26px system-ui';x.textAlign='center';x.fillText('🎿',0,8);x.restore();
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText(phase==='down'?'DESCIDA — segure ⬇️! Vel '+sp.toFixed(0):'VOO! Incline ⬅️➡️',12,28);
 x.fillText('Salto '+jump+'/3 · Melhor '+best.toFixed(1)+'m',12,50);
});
}});"""

# 288 — Corrida de Cavalos
GAMES[288] = r"""/* NCODE N · 288 Corrida de Cavalos — galope ritmado! */
GREG(288,{
init(root,H){
let over=false,px=0,sp=0,stam=100,last=0,combo=0,t=0;
let rivals=[{x:0,sp:0},{x:0,sp:0}];
const hud=H.hud(root,[['d','DIST','0m'],['st','FÔLEGO','100%'],['pos','POS','3º']]);
const say=H.msg(root,'Toque GALOPAR no ritmo (~3 por segundo)! Ritmo certo = velocidade; descompasso cansa. 400m contra 2 rivais!');
const o=H.cvs(root,560,320),x=o.x;
H.btn(root,'🐎 GALOPAR (toque no ritmo!)',gallop,true);
function gallop(){
 if(over)return;
 const now=t,gap=now-last;last=now;
 if(gap>.22&&gap<.48){combo++;sp=Math.min(46,sp+4+combo*.4);stam-=1.5;H.sfx('tick');}
 else{combo=0;sp=Math.min(40,sp+1);stam-=4;H.sfx('bad');}
}
function gameOver(){
 over=true;
 const r=Math.min(rivals[0].x,rivals[1].x);
 const win=px>=400&&px>=r;
 const sc=win?Math.max(200,600-(t|0)*6):px|0;
 H.score(sc);
 H.done(win?{win:true,score:sc,title:'🏇 Foto-finish sua!',sub:'400m em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Rivais venceram!',sub:'Mantenha o ritmo sem esgotar o fôlego!'});
}
H.loop(dt=>{
 if(over)return;t+=dt;
 stam=Math.min(100,stam+(sp<20?10:2)*dt);
 if(stam<=0){sp*=.9;}
 sp*=.995;
 px+=sp*dt*3;
 rivals.forEach((r,i)=>{r.sp=30+Math.sin(t*(1+i*.3)+i*2)*8+t*.4;r.x+=r.sp*dt*3;});
 const order=[px,rivals[0].x,rivals[1].x].sort((a,b)=>b-a).indexOf(px)+1;
 hud.set('d',(Math.min(400,px/3)|0)+'m');hud.set('st',(stam|0)+'%');hud.set('pos',order+'º');
 if(px>=1200||rivals.some(r=>r.x>=1200)){gameOver();return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,560,320);
 x.fillStyle='#C9B189';
 for(let i=0;i<3;i++)x.fillRect(0,70+i*70,560,44);
 const cam=Math.max(0,px-200);
 x.font='30px system-ui';x.textAlign='center';
 x.fillText('🏇',px-cam,105);
 x.fillText('🐎',rivals[0].x-cam,175);
 x.fillText('🐎',rivals[1].x-cam,245);
 x.fillStyle='#fff';x.fillRect(1200-cam,60,8,200);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Fôlego',12,30);
 x.fillStyle='#000';x.fillRect(80,18,200,14);
 x.fillStyle=stam>30?'#3E7C4F':'#D94E34';x.fillRect(80,18,200*stam/100,14);
 x.fillStyle='#181816';
 x.fillText('Ritmo x'+combo+'  Vel '+sp.toFixed(0),300,30);
});
}});"""

# 289 — Descida de Trenó
GAMES[289] = r"""/* NCODE N · 289 Descida de Trenó — desvie no gelo! */
GREG(289,{
init(root,H){
let over=false,px=230,dist=0,sp=220,lives=3,t=0;
const OBS=[];
for(let i=0;i<40;i++)OBS.push({x:40+Math.random()*380,y:-i*260-300,k:Math.random()<.5?'🌲':'🪨',hit:false});
const hud=H.hud(root,[['v','VIDAS',3],['d','DIST','0%']]);
const say=H.msg(root,'Desça até a base! ⬅️➡️ desviam, ⬇️ freia. Bater tira vida e velocidade.');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(win){over=true;const sc=win?Math.max(200,700-(t|0)*8)+lives*60:dist/40|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🛷 Descida limpa!',sub:t.toFixed(1)+'s com '+lives+' vidas.'}:{win:false,score:sc,title:'Trenó quebrado!',sub:'3 batidas. Freie nas curvas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0,D=dn.ArrowDown||dn.KeyS;
 sp+=(((D?120:240))-sp)*1.5*dt;
 if(L)px-=230*dt;if(R)px+=230*dt;
 px=H.clamp(px,36,424);
 dist+=sp*dt;
 OBS.forEach(ob=>{
  const oy=ob.y+dist;
  if(!ob.hit&&Math.abs(oy-440)<26&&Math.abs(ob.x-px)<30){
   ob.hit=true;lives--;sp=90;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver(false);return;}
  }
 });
 hud.set('d',Math.min(99,dist/10500*100|0)+'%');
 if(dist>=10500){gameOver(true);return;}
 x.fillStyle='#DCEEF5';x.fillRect(0,0,460,520);
 x.fillStyle='#fff';
 for(let i=0;i<30;i++){const wy=(i*89+dist)%560-20;x.fillRect((i*157)%440,wy,20,3);}
 x.fillStyle='#8A6A2F';x.fillRect(0,0,28,520);x.fillRect(432,0,28,520);
 OBS.forEach(ob=>{
  const oy=ob.y+dist;
  if(oy<-30||oy>550)return;
  x.font='26px system-ui';x.textAlign='center';
  x.fillText(ob.hit?'💥':ob.k,(ob.x,oy+9));
 });
 x.font='32px system-ui';x.fillText('🛷',px,452);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('❤️'.repeat(Math.max(0,lives))+'  '+(dist/10500*100|0)+'%  '+sp.toFixed(0)+'km/h',12,26);
});
}});"""

# 290 — Balão de Ar Quente
GAMES[290] = r"""/* NCODE N · 290 Balão de Ar Quente — flutue nas argolas! */
GREG(290,{
init(root,H){
let over=false,py=400,vy=0,heat=50,rings=0,t=0,wind=0;
const RINGS=[];
for(let i=0;i<8;i++)RINGS.push({x:80+Math.random()*300,y:3400-i*420,got:false});
const hud=H.hud(root,[['a','ARGOLAS','0/8'],['q','CALOR','50%']]);
const say=H.msg(root,'Suba passando PELAS argolas ⭕! Segure AQUECER/Espaço para subir, solte para descer. 8 argolas até o topo!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
const hb=H.btn(root,'🔥 Segurar = AQUECER',()=>{},true);
hb.addEventListener('pointerdown',()=>{dn.heat=true;});
hb.addEventListener('pointerup',()=>{dn.heat=false;});
function gameOver(win){over=true;const sc=win?Math.max(200,700-(t|0)*6):rings*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🎈 Voo perfeito!',sub:'8/8 argolas!'}:{win:false,score:sc,title:'Pouso forçado!',sub:rings+'/8 argolas. Dose o calor!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 wind=Math.sin(t*.5)*30;
 const h=dn.heat||dn.Space||dn.ArrowUp;
 if(h)heat=Math.min(100,heat+40*dt);else heat=Math.max(0,heat-25*dt);
 vy+=((heat-45)*4-vy)*1.5*dt;
 vy=H.clamp(vy,-160,160);
 py-=vy*dt;
 const px=230+Math.sin(t*.3)*40+wind*.4;
 hud.set('q',(heat|0)+'%');
 RINGS.forEach(r=>{
  if(!r.got&&Math.abs(px-r.x)<34&&Math.abs(py-r.y)<34){r.got=true;rings++;H.sfx('ok');hud.set('a',rings+'/8');}
 });
 if(py<=100){gameOver(rings>=6);return;}
 if(py>=460){gameOver(false);return;}
 const cam=H.clamp(py-300,-2600,200);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,520);
 x.fillStyle='#fff';
 for(let i=0;i<12;i++){const cy=((i*140-cam*.6)%640+640)%640-60;x.beginPath();x.ellipse((i*199)%440,cy,40,16,0,0,7);x.fill();}
 RINGS.forEach(r=>{
  const ry=r.y-cam;
  if(ry<-40||ry>560)return;
  x.strokeStyle=r.got?'#3E7C4F':'#E8A33D';x.lineWidth=6;
  x.beginPath();x.arc(r.x,ry,30,0,7);x.stroke();
 });
 x.fillStyle='#3E7C4F';x.fillRect(0,470-cam>520?520:470-cam,460,60);
 const by=py-cam;
 x.fillStyle=h?'#D94E34':'#B23A24';
 x.beginPath();x.ellipse(px,by-24,30,36,0,0,7);x.fill();
 x.fillStyle='#8A6A2F';x.fillRect(px-10,by+12,20,14);
 if(h){x.fillStyle='#E8A33D';x.beginPath();x.moveTo(px-6,by+12);x.lineTo(px+6,by+12);x.lineTo(px,by-2);x.fill();}
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('⭕ '+rings+'/8  🔥 '+(heat|0)+'%  Alt '+(460-py|0)+'m',12,26);
});
}});"""

# 291 — Jet Ski
GAMES[291] = r"""/* NCODE N · 291 Jet Ski — salte as ondas! */
GREG(291,{
init(root,H){
let over=false,px=230,dist=0,sp=240,air=0,vy=0,score=0,t=0;
const RAMPS=[];
for(let i=0;i<10;i++)RAMPS.push({x:60+Math.random()*340,y:-i*700-400,used:false});
const BUOY=[];
for(let i=0;i<24;i++)BUOY.push({x:40+Math.random()*380,y:-i*350-200,hit:false});
const hud=H.hud(root,[['pt','PONTOS',0],['d','DIST','0%']]);
const say=H.msg(root,'Passe pelas rampas 🌊 para saltar e fazer pontos! Desvie das boias. ⬅️➡️ viram, ⬆️ turbo. Meta: 800 pontos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(){over=true;const win=score>=800;H.score(score);
H.done(win?{win:true,score,title:'🌊 Rei do jet!',sub:score+' pontos!'}:{win:false,score,title:'Fim do percurso!',sub:score+'/800 pontos. Acerte as rampas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const up=dn.ArrowUp||dn.KeyW,L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 sp+=((up?340:230)-sp)*2*dt;
 if(L)px-=240*dt;if(R)px+=240*dt;
 px=H.clamp(px,36,424);
 dist+=sp*dt;
 if(air>0){air-=dt;vy-=900*dt;}
 RAMPS.forEach(r=>{
  const ry=r.y+dist;
  if(!r.used&&air<=0&&Math.abs(ry-430)<24&&Math.abs(r.x-px)<34){
   r.used=true;air=.9;H.sfx('ok');score+=100;hud.set('pt',score);
  }
 });
 BUOY.forEach(b=>{
  const by=b.y+dist;
  if(!b.hit&&air<=0&&Math.abs(by-430)<20&&Math.abs(b.x-px)<24){b.hit=true;sp=120;H.sfx('bad');}
 });
 score+=air>0?dt*60:0;
 hud.set('pt',score|0);hud.set('d',Math.min(99,dist/7400*100|0)+'%');
 if(dist>=7400){gameOver();return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,460,520);
 x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=2;
 for(let i=0;i<24;i++){const wy=(i*83+dist)%560-20;x.beginPath();x.moveTo((i*167)%440,wy);x.lineTo((i*167)%440+30,wy);x.stroke();}
 RAMPS.forEach(r=>{
  const ry=r.y+dist;
  if(ry<-30||ry>550)return;
  x.fillStyle=r.used?'#8A877C':'#E8A33D';
  x.beginPath();x.moveTo(r.x-30,ry+14);x.lineTo(r.x+30,ry+14);x.lineTo(r.x+30,ry-14);x.fill();
 });
 BUOY.forEach(b=>{
  const by=b.y+dist;
  if(by<-20||by>540)return;
  x.fillStyle=b.hit?'#D94E34':'#fff';x.beginPath();x.arc(b.x,by,10,0,7);x.fill();
 });
 const jy=430-(air>0?Math.sin((0.9-air)/0.9*Math.PI)*90:0);
 x.font='32px system-ui';x.textAlign='center';x.fillText('🚤',px,jy);
 if(air>0){x.fillStyle='#C4D645';x.font='bold 18px system-ui';x.fillText('NO AR! +'+(60*dt|0),px,jy-30);}
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText((score|0)+' pts  '+(dist/7400*100|0)+'%  meta 800',12,26);
});
}});"""

# 292 — BMX Flatland
GAMES[292] = r"""/* NCODE N · 292 BMX Flatland — equilíbrio parado! */
GREG(292,{
init(root,H){
let over=false,bal=0,score=0,t=0,time=60,trick=null,trickT=0;
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',60]]);
const say=H.msg(root,'Equilibre a bike parada com ⬅️➡️! No verde, faça manobras para pontuar. Caiu 3 vezes = fim. Meta: 600!');
const o=H.cvs(root,460,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
let falls=0;
[['Tailwhip',100],['Barspin',150],['Manual',80]].forEach(tr=>{
 H.btn(root,'🚲 '+tr[0]+' ('+tr[1]+')',()=>{
  if(over||trick)return;
  if(Math.abs(bal)<25){score+=tr[1];trick=tr[0]+' +'+tr[1];trickT=1;H.sfx('ok');}
  else{score+=10;trick='fraco +10';trickT=1;H.sfx('bad');}
  hud.set('pt',score);
 },false);
});
function gameOver(win){over=true;H.score(score);
H.done(win?{win:true,score,title:'🚲 Mestre do flatland!',sub:score+' pontos!'}:{win:false,score,title:'Fim!',sub:score+'/600 pontos. Faça truques no verde!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 if(trickT>0)trickT-=dt;else trick=null;
 bal+=Math.sin(t*1.7)*30*dt+Math.sin(t*4.3)*14*dt;
 if(dn.ArrowLeft||dn.KeyA)bal-=70*dt;
 if(dn.ArrowRight||dn.KeyD)bal+=70*dt;
 bal=H.clamp(bal,-100,100);
 if(Math.abs(bal)>=100){falls++;bal=0;H.sfx('bad');say('💥 Queda '+falls+'/3!');if(falls>=3){gameOver(score>=600);return;}}
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(score>=600);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,340);
 x.fillStyle='#8A877C';x.fillRect(0,260,460,80);
 x.save();x.translate(230,220);x.rotate(bal/220);
 x.font='60px system-ui';x.textAlign='center';x.fillText('🚲',0,20);x.restore();
 x.fillStyle='#181816';x.fillRect(80,40,300,18);
 x.fillStyle='#3E7C4F';x.fillRect(205,40,50,18);
 x.fillStyle=Math.abs(bal)>60?'#D94E34':'#E8A33D';
 x.fillRect(230+bal*1.4-5,34,10,30);
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(score+' pts · ⏱️'+Math.ceil(time)+'s · quedas '+falls+'/3 · meta 600',14,90);
 if(trick){x.font='bold 22px system-ui';x.textAlign='center';x.fillText(trick,230,130);}
});
}});"""

# 293 — Roller Derby
GAMES[293] = r"""/* NCODE N · 293 Roller Derby — passe e pontue! */
GREG(293,{
init(root,H){
let over=false,t=0,time=75,score=0,py=230,px=80,sp=0;
const OPP=[];
for(let i=0;i<6;i++)OPP.push({a:i/6*6.28,sp:.5+Math.random()*.3,lap:0});
let passed={};
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',75]]);
const say=H.msg(root,'Você é a jammer ⭐! ⬆️ acelera, ⬅️➡️ mudam de faixa. Ultrapasse rivais para pontuar. Meta: 12 pontos em 75s!');
const o=H.cvs(root,460,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
const CX=230,CY=200,RX=170,RY=120;
function pos(a,lane){return{x:CX+Math.cos(a)*(RX+lane*22),y:CY+Math.sin(a)*(RY+lane*14)};}
let ma=0,lane=0;
function gameOver(){over=true;const win=score>=12;H.score(score*50);
H.done(win?{win:true,score:score*50,title:'⭐ Jammer estrela!',sub:score+' ultrapassagens!'}:{win:false,score:score*50,title:'Fim do jam!',sub:score+'/12 pontos. Acelere nas retas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 const up=dn.ArrowUp||dn.KeyW;
 if(dn.ArrowLeft||dn.KeyA)lane=Math.max(-1,lane-3*dt);
 if(dn.ArrowRight||dn.KeyD)lane=Math.min(1,lane+3*dt);
 sp+=((up?2.2:1.1)-sp)*2*dt;
 ma+=sp*dt;
 OPP.forEach((op,i)=>{
  const pa=op.a;
  op.a+=op.sp*dt;
  let rel=((ma-op.a)%6.28+6.28)%6.28;
  let relP=((ma-sp*dt-pa)%6.28+6.28)%6.28;
  if(relP>3&&rel<=3||relP<3&&rel>=3&&false){}
  if(rel<.15&&!passed[i]){passed[i]=1;score++;H.sfx('ok');hud.set('pt',score);}
  if(rel>.5)passed[i]=0;
 });
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver();return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,400);
 x.strokeStyle='#8A877C';x.lineWidth=64;
 x.beginPath();x.ellipse(CX,CY,RX,RY,0,0,7);x.stroke();
 x.strokeStyle='#EDE8DC';x.lineWidth=56;
 x.beginPath();x.ellipse(CX,CY,RX,RY,0,0,7);x.stroke();
 OPP.forEach(op=>{
  const p=pos(op.a,0);
  x.fillStyle='#2E6E8A';x.beginPath();x.arc(p.x,p.y,11,0,7);x.fill();
 });
 const mp=pos(ma,lane);
 x.fillStyle='#D94E34';x.beginPath();x.arc(mp.x,mp.y,12,0,7);x.fill();
 x.fillStyle='#fff';x.font='bold 12px system-ui';x.textAlign='center';x.fillText('★',mp.x,mp.y+4);
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(score+' pts · ⏱️'+Math.ceil(time)+'s · meta 12',12,26);
});
}});"""

# 294 — Caiaque em Corredeiras
GAMES[294] = r"""/* NCODE N · 294 Caiaque em Corredeiras — passe nos checks! */
GREG(294,{
init(root,H){
let over=false,px=230,dist=0,t=0,checks=0,lives=3;
const CK=[];
for(let i=0;i<10;i++)CK.push({y:-i*600-400,gx:100+Math.random()*260,got:false});
const ROCKS=[];
for(let i=0;i<30;i++)ROCKS.push({x:50+Math.random()*360,y:-i*260-150,hit:false});
const hud=H.hud(root,[['c','CHECKS','0/10'],['v','VIDAS',3]]);
const say=H.msg(root,'Passe pelos portões verdes ✅ e desvie das pedras! A correnteza empurra — ⬅️➡️ remam.');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(win){over=true;const sc=checks*100+lives*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'🚣 Corredeira vencida!',sub:'10/10 checks!'}:{win:false,score:sc,title:'Virou o caiaque!',sub:checks+'/10 checks. Desvie das pedras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 const cur=Math.sin(t*1.3+dist*.002)*90;
 if(L)px-=200*dt;if(R)px+=200*dt;
 px+=cur*dt;px=H.clamp(px,46,414);
 dist+=200*dt;
 CK.forEach(c=>{
  const cy=c.y+dist;
  if(!c.got&&cy>430&&cy<470&&Math.abs(px-c.gx)<50){c.got=true;checks++;H.sfx('ok');hud.set('c',checks+'/10');}
 });
 ROCKS.forEach(r=>{
  const ry=r.y+dist;
  if(!r.hit&&Math.abs(ry-430)<24&&Math.abs(r.x-px)<28){
   r.hit=true;lives--;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver(false);return;}
  }
 });
 if(checks>=10){gameOver(true);return;}
 if(dist>6600){gameOver(checks>=8);return;}
 x.fillStyle='#3EAFBF';x.fillRect(0,0,460,520);
 x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=2;
 for(let i=0;i<26;i++){const wy=(i*79+dist*1.2)%560-20;x.beginPath();x.moveTo((i*149)%440,wy);x.lineTo((i*149)%440+36,wy);x.stroke();}
 x.fillStyle='#5A4A33';x.fillRect(0,0,36,520);x.fillRect(424,0,36,520);
 CK.forEach(c=>{
  const cy=c.y+dist;
  if(cy<-30||cy>550)return;
  x.fillStyle=c.got?'#3E7C4F':'#C4D645';
  x.fillRect(c.gx-50,cy-6,100,12);
 });
 ROCKS.forEach(r=>{
  const ry=r.y+dist;
  if(ry<-20||ry>540)return;
  x.fillStyle=r.hit?'#D94E34':'#5A5A55';x.beginPath();x.arc(r.x,ry,13,0,7);x.fill();
 });
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚣',px,442);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('✅ '+checks+'/10  ❤️'.repeat(1)+' '+lives+'  Corrente '+(cur>0?'▶':'◀'),12,26);
});
}});"""

# 295 — Parapente
GAMES[295] = r"""/* NCODE N · 295 Parapente — pegue as térmicas! */
GREG(295,{
init(root,H){
let over=false,px=60,alt=400,vy=0,t=0,dist=0;
const TH=[];
for(let i=0;i<8;i++)TH.push({x:400+i*700+Math.random()*300,w:120});
const LZ={x:6400,w:300};
const hud=H.hud(root,[['a','ALT','400m'],['d','DIST','0%']]);
const say=H.msg(root,'Plane até a zona de pouso 🟩! Suba nas térmicas ⬆️ (colunas quentes), afunde fora delas. ⬅️➡️ controlam a velocidade!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function gameOver(win,why){over=true;const sc=win?Math.max(200,800-(t|0)*5):dist/64|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🪂 Pouso perfeito!',sub:'Chegou planando!'}:{win:false,score:sc,title:'Pouso forçado!',sub:why});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD;
 const sp=L?90:R?220:150;
 px+=sp*dt;dist=px;
 const inTh=TH.some(q=>Math.abs(px-q.x)<q.w/2);
 vy+=(((inTh?70:-45))-vy)*1.2*dt;
 alt+=vy*dt;
 hud.set('a',Math.max(0,alt|0)+'m');hud.set('d',Math.min(99,px/6550*100|0)+'%');
 if(alt<=0){
  if(px>=LZ.x-LZ.w/2&&px<=LZ.x+LZ.w/2)gameOver(true);
  else gameOver(false,'Caiu a '+((LZ.x-px)|0)+'m da zona. Use as térmicas ⬆️!');
  return;
 }
 if(px>LZ.x+LZ.w/2+200){gameOver(false,'Passou da zona de pouso!');return;}
 const cam=H.clamp(px-120,0,6200);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,400);
 x.fillStyle='#3E7C4F';x.fillRect(0,360,560,40);
 TH.forEach(q=>{
  const qx=q.x-cam;
  if(qx>-100&&qx<660){
   x.fillStyle='rgba(232,163,61,.25)';x.fillRect(qx-q.w/2,60,q.w,300);
   x.fillStyle='#E8A33D';x.font='22px system-ui';x.textAlign='center';
   x.fillText('⬆️',qx,120+((t*40)%200));
  }
 });
 x.fillStyle='#C4D645';x.fillRect(LZ.x-LZ.w/2-cam,340,LZ.w,20);
 x.font='20px system-ui';x.textAlign='center';x.fillText('🟩',LZ.x-cam,336);
 const py=360-alt*.7;
 x.font='30px system-ui';x.fillText('🪂',px-cam,py);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Alt '+Math.max(0,alt|0)+'m  '+(px/6550*100|0)+'%'+(inTh?'  ⬆️ TÉRMICA!':''),12,26);
});
}});"""

# 296 — Corrida Submarina
GAMES[296] = r"""/* NCODE N · 296 Corrida Submarina — entre corais e correntes! */
GREG(296,{
init(root,H){
let over=false,py=230,dist=0,t=0,o2=100;
const CORAL=[];
for(let i=0;i<26;i++)CORAL.push({x:400+i*330,y:60+Math.random()*340,hit:false});
const CUR=[];
for(let i=0;i<8;i++)CUR.push({x:600+i*900,y:100+Math.random()*260,dy:Math.random()<.5?-1:1});
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['d','DIST','0%']]);
const say=H.msg(root,'Nade até o fim! ⬆️⬇️ movem, correntes 🌀 empurram, corais 🪸 machucam. Acabou o O₂ = fim!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapY=qy;});
let tapY=null;
function gameOver(win){over=true;const sc=win?Math.max(200,700-(t|0)*6):dist/90|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🤿 Travessia completa!',sub:'Percurso subaquático vencido!'}:{win:false,score:sc,title:'Sem ar!',sub:'Gerencie o oxigênio e desvie dos corais!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 const sp=200;
 dist+=sp*dt;
 if(U)py-=220*dt;if(D)py+=220*dt;
 if(tapY!=null){py+=(tapY-py)*3*dt;if(Math.abs(tapY-py)<6)tapY=null;}
 py=H.clamp(py,30,370);
 CUR.forEach(c=>{if(Math.abs(dist+120-c.x)<90&&Math.abs(py-c.y)<80)py+=c.dy*160*dt;});
 o2-=dt*3.2;
 CORAL.forEach(c=>{
  if(!c.hit&&Math.abs(dist+120-c.x)<30&&Math.abs(py-c.y)<30){c.hit=true;o2-=12;H.sfx('bad');}
 });
 hud.set('ox',(Math.max(0,o2)|0)+'%');hud.set('d',Math.min(99,dist/9000*100|0)+'%');
 if(o2<=0){gameOver(false);return;}
 if(dist>=9000){gameOver(true);return;}
 x.fillStyle='#123F5C';x.fillRect(0,0,560,400);
 CUR.forEach(c=>{
  const cx=c.x-dist;
  if(cx>-60&&cx<620){
   x.strokeStyle='rgba(196,214,69,.5)';x.lineWidth=3;
   x.beginPath();x.arc(cx,c.y,34+t*20%20,0,7);x.stroke();
   x.fillStyle='#C4D645';x.font='16px system-ui';x.textAlign='center';x.fillText(c.dy<0?'⬆':'⬇',cx,c.y+6);
  }
 });
 CORAL.forEach(c=>{
  const cx=c.x-dist;
  if(cx>-40&&cx<600){x.font=c.hit?'20px system-ui':'26px system-ui';x.textAlign='center';x.fillText(c.hit?'💥':'🪸',cx,c.y);}
 });
 x.font='30px system-ui';x.fillText('🤿',120,py+10);
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(Math.max(0,o2)|0)+'%  '+(dist/9000*100|0)+'%',12,26);
 x.fillStyle='#000';x.fillRect(12,34,200,10);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(12,34,200*Math.max(0,o2)/100,10);
});
}});"""

# 297 — Corrida de Foguetes
GAMES[297] = r"""/* NCODE N · 297 Corrida de Foguetes — desvie dos asteroides! */
GREG(297,{
init(root,H){
let over=false,px=120,py=260,dist=0,fuel=100,t=0,shield=3;
const AST=[];
for(let i=0;i<40;i++)AST.push({x:500+i*330+Math.random()*150,y:40+Math.random()*440,r:14+Math.random()*22,hit:false});
const FUEL=[];
for(let i=0;i<8;i++)FUEL.push({x:900+i*1300,y:60+Math.random()*400,got:false});
const hud=H.hud(root,[['cb','COMBUSTÍVEL','100%'],['e','ESCUDO',3],['d','DIST','0%']]);
const say=H.msg(root,'Chegue ao planeta 🪐! Setas movem, ⬆️ gasta mais combustível. Pegue ⛽ e desvie dos asteroides!');
const o=H.cvs(root,560,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tpx=qx;tpy=qy;});
let tpx=null,tpy=null;
function gameOver(win){over=true;const sc=win?Math.max(250,800-(t|0)*6):dist/150|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🚀 Órbita alcançada!',sub:'Campo de asteroides vencido!'}:{win:false,score:sc,title:'Missão abortada!',sub:fuel<=0?'Sem combustível — pegue os ⛽!':'Escudo esgotado. Desvie mais cedo!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD,U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 const sp=U?320:210;
 dist+=sp*dt;
 fuel-=dt*(U?6:3.2);
 if(L)px-=200*dt;if(R)px+=200*dt;if(U)py-=200*dt;if(D)py+=200*dt;
 if(tpx!=null){px+=(tpx-px)*3*dt;py+=(tpy-py)*3*dt;}
 px=H.clamp(px,40,520);py=H.clamp(py,40,480);
 AST.forEach(a=>{
  const ax=a.x-dist*.9;
  if(!a.hit&&Math.abs(ax-px)<a.r+12&&Math.abs(a.y-py)<a.r+12){
   a.hit=true;shield--;H.sfx('bad');hud.set('e',shield);
   if(shield<=0){gameOver(false);return;}
  }
 });
 FUEL.forEach(f=>{
  const fx=f.x-dist*.9;
  if(!f.got&&Math.abs(fx-px)<26&&Math.abs(f.y-py)<26){f.got=true;fuel=Math.min(100,fuel+35);H.sfx('ok');}
 });
 hud.set('cb',(Math.max(0,fuel)|0)+'%');hud.set('d',Math.min(99,dist/14000*100|0)+'%');
 if(fuel<=0){gameOver(false);return;}
 if(dist>=14000){gameOver(true);return;}
 x.fillStyle='#0C0C18';x.fillRect(0,0,560,520);
 x.fillStyle='#fff';
 for(let i=0;i<50;i++){const sx=(i*197-dist*.3%560+560)%560,sy=(i*131)%520;x.fillRect(sx,sy,2,2);}
 AST.forEach(a=>{
  const ax=a.x-dist*.9;
  if(ax>-50&&ax<610){x.fillStyle=a.hit?'#D94E34':'#8A877C';x.beginPath();x.arc(ax,a.y,a.r,0,7);x.fill();}
 });
 FUEL.forEach(f=>{
  const fx=f.x-dist*.9;
  if(!f.got&&fx>-30&&fx<590){x.font='22px system-ui';x.textAlign='center';x.fillText('⛽',fx,f.y);}
 });
 x.font='30px system-ui';x.textAlign='center';x.fillText('🪐',14500-dist*.9>600?600:14500-dist*.9,260);
 x.save();x.translate(px,py);x.rotate(Math.PI/4);
 x.font='28px system-ui';x.fillText('🚀',0,9);x.restore();
});
}});"""

# 298 — Triciclo Maluco
GAMES[298] = r"""/* NCODE N · 298 Triciclo Maluco — pedale bambo! */
GREG(298,{
init(root,H){
let over=false,px=0,sp=0,wob=0,t=0;
let rivals=[{x:0},{x:0}];
const hud=H.hud(root,[['d','DIST','0m'],['pos','POS','3º']]);
const say=H.msg(root,'Pedale (toque PEDAL!) e segure o bambo com ⬅️➡️! Bambo no limite = queda (perde velocidade). 300m contra 2 malucos!');
const o=H.cvs(root,560,320),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&c==='Space')pedal();});
H.btn(root,'🚲 PEDAL!',pedal,true);
function pedal(){
 if(over)return;
 sp=Math.min(50,sp+3);wob+=(Math.random()-.5)*36;H.sfx('tick');
}
function gameOver(){
 over=true;
 const win=px>=900&&px>=rivals[0].x&&px>=rivals[1].x;
 const sc=win?Math.max(200,600-(t|0)*6):px|0;
 H.score(sc);
 H.done(win?{win:true,score:sc,title:'🚲 Rei do bambo!',sub:'300m em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Os malucos venceram!',sub:'Pedale e corrija o bambo sem parar!'});
}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(dn.ArrowLeft||dn.KeyA)wob-=90*dt;
 if(dn.ArrowRight||dn.KeyD)wob+=90*dt;
 wob+=Math.sin(t*3)*20*dt;
 wob=H.clamp(wob,-100,100);
 if(Math.abs(wob)>=100){wob=0;sp*=.3;H.sfx('bad');}
 sp*=.99;
 px+=sp*dt*3;
 rivals.forEach((r,i)=>{r.x+=(26+Math.sin(t*2+i*3)*6+t*.3)*dt*3;});
 const order=[px,rivals[0].x,rivals[1].x].sort((a,b)=>b-a).indexOf(px)+1;
 hud.set('d',(Math.min(300,px/3)|0)+'m');hud.set('pos',order+'º');
 if(px>=900||rivals.some(r=>r.x>=900)){gameOver();return;}
 x.fillStyle='#C9B189';x.fillRect(0,0,560,320);
 const cam=Math.max(0,px-200);
 x.font='28px system-ui';x.textAlign='center';
 x.save();x.translate(px-cam,110);x.rotate(wob/200);x.fillText('🚲',0,9);x.restore();
 x.fillText('🛺',rivals[0].x-cam,190);
 x.fillText('🛵',rivals[1].x-cam,260);
 x.fillStyle='#fff';x.fillRect(900-cam,60,8,220);
 x.fillStyle='#181816';x.fillRect(180,20,200,14);
 x.fillStyle=Math.abs(wob)>70?'#D94E34':'#E8A33D';
 x.fillRect(280+wob-5,16,10,22);
 x.fillStyle='#181816';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('BAMBO',120,32);
});
}});"""

# 299 — Corrida de Cadeira de Rodas
GAMES[299] = r"""/* NCODE N · 299 Corrida de Cadeira de Rodas — impulsos alternados! */
GREG(299,{
init(root,H){
let over=false,px=0,sp=0,next=0,t=0,combo=0;
let rivals=[{x:0,sp:0},{x:0,sp:0}];
const hud=H.hud(root,[['d','DIST','0m'],['pos','POS','3º']]);
const say=H.msg(root,'Alterne ESQUERDA e DIREITA no ritmo! Repetir o lado quebra o embalo. 200m contra 2 rivais!');
const o=H.cvs(root,560,300),x=o.x;
const bL=H.btn(root,'⬅️ ESQUERDA',()=>push(0),false);
const bR=H.btn(root,'➡️ DIREITA',()=>push(1),false);
const kb=H.keys();kb.on((c,d)=>{if(!d)return;if(c==='ArrowLeft'||c==='KeyA')push(0);if(c==='ArrowRight'||c==='KeyD')push(1);});
function push(s){
 if(over)return;
 if(s===next){combo++;sp=Math.min(44,sp+2.5+combo*.3);next=1-next;H.sfx('tick');}
 else{combo=0;sp*=.85;H.sfx('bad');}
}
function gameOver(){
 over=true;
 const win=px>=600&&px>=rivals[0].x&&px>=rivals[1].x;
 const sc=win?Math.max(200,500-(t|0)*8):px|0;
 H.score(sc);
 H.done(win?{win:true,score:sc,title:'🥇 Sprint vencido!',sub:'200m em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Rivais venceram!',sub:'Alterne E-D-E-D sem errar!'});
}
H.loop(dt=>{
 if(over)return;t+=dt;
 sp*=.992;px+=sp*dt*3;
 rivals.forEach((r,i)=>{r.sp=27+Math.sin(t*1.5+i*2)*5+t*.5;r.x+=r.sp*dt*3;});
 const order=[px,rivals[0].x,rivals[1].x].sort((a,b)=>b-a).indexOf(px)+1;
 hud.set('d',(Math.min(200,px/3)|0)+'m');hud.set('pos',order+'º');
 if(px>=600||rivals.some(r=>r.x>=600)){gameOver();return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,560,300);
 x.fillStyle='#C9553E';x.fillRect(0,60,560,180);
 x.strokeStyle='#fff';x.lineWidth=2;
 for(let i=0;i<3;i++)x.strokeRect(0,60+i*60,560,60);
 const cam=Math.max(0,px-200);
 x.font='28px system-ui';x.textAlign='center';
 x.fillText('🦽',px-cam,105);
 x.fillText('🦽',rivals[0].x-cam,165);
 x.fillText('🦽',rivals[1].x-cam,225);
 x.fillStyle='#fff';x.fillRect(600-cam,60,8,180);
 x.fillStyle=next===0?'#C4D645':'#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Próximo: '+(next===0?'⬅️ ESQUERDA':'DIREITA ➡️')+'  x'+combo,12,40);
});
}});"""

# 300 — Patinação no Gelo
GAMES[300] = r"""/* NCODE N · 300 Patinação no Gelo — incline nas curvas! */
GREG(300,{
init(root,H){
const CURVES=[{x:500,dir:1},{x:1200,dir:-1},{x:1900,dir:1},{x:2600,dir:-1}];
let over=false,px=0,sp=0,lean=0,t=0,off=0;
const hud=H.hud(root,[['v','VEL','0'],['d','DIST','0%']]);
const say=H.msg(root,'⬆️ acelera, ⬅️➡️ inclinam! Nas curvas, incline para o lado indicado ou derrapa para fora. Complete a pista!');
const o=H.cvs(root,560,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function curveAt(x2){
 for(const c of CURVES)if(Math.abs(x2-c.x)<220)return c;
 return null;
}
function gameOver(win){over=true;const sc=win?Math.max(250,800-(t|0)*8):px/32|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'⛸️ Volta perfeita!',sub:'Em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Derrapou para fora!',sub:'Incline com força nas curvas sinalizadas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const up=dn.ArrowUp||dn.KeyW;
 sp+=((up?300:170)-sp)*1.5*dt;
 if(dn.ArrowLeft||dn.KeyA)lean-=2.4*dt;
 if(dn.ArrowRight||dn.KeyD)lean+=2.4*dt;
 lean=H.clamp(lean,-1.4,1.4);
 if(!dn.ArrowLeft&&!dn.ArrowRight&&!dn.KeyA&&!dn.KeyD)lean*=.95;
 px+=sp*dt;
 const c=curveAt(px);
 if(c){
  const need=c.dir*(sp/300);
  off+=(Math.abs(lean-need)>.55?1:-2)*dt*sp/200;
 }else off=Math.max(0,off-3*dt);
 off=H.clamp(off,0,1);
 hud.set('v',sp|0);hud.set('d',Math.min(99,px/3200*100|0)+'%');
 if(off>=1){gameOver(false);return;}
 if(px>=3200){gameOver(true);return;}
 const cam=px-140;
 x.fillStyle='#DCEEF5';x.fillRect(0,0,560,340);
 x.fillStyle='#fff';x.fillRect(0,120,560,140);
 CURVES.forEach(q=>{
  const qx=q.x-cam;
  if(qx>-260&&qx<620){
   x.fillStyle='rgba(217,78,52,.25)';x.fillRect(qx-220,120,440,140);
   x.fillStyle='#D94E34';x.font='bold 40px system-ui';x.textAlign='center';
   x.fillText(q.dir>0?'➡️':'⬅️',qx,200);
  }
 });
 x.save();x.translate(140,190);x.rotate(lean*.5);
 x.font='36px system-ui';x.textAlign='center';x.fillText('⛸️',0,12);x.restore();
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Derrapagem',12,300);
 x.fillStyle='#000';x.fillRect(120,290,300,14);
 x.fillStyle=off>.6?'#D94E34':'#E8A33D';x.fillRect(120,290,300*off,14);
 if(c){x.fillStyle='#D94E34';x.font='bold 18px system-ui';x.fillText('CURVA '+(c.dir>0?'➡️':'⬅️')+'!',200,60);}
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
