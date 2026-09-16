#!/usr/bin/env python3
"""Gera games/g261..g280 — STEALTH completo (20 jogos)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 261 — Sombra Furtiva
GAMES[261] = r"""/* NCODE N · 261 Sombra Furtiva — cruze sem tocar a luz! */
GREG(261,{
init(root,H){
let over=false,px=40,py=420,tx=px,ty=py,exp=0,lives=3,t=0,lvl=1;
const hud=H.hud(root,[['v','VIDAS',3],['ex','EXPOSIÇÃO','0%'],['nv','FASE',1]]);
const say=H.msg(root,'Chegue à saída 🚪! Fachos de luz revelam — blocos escuros escondem. 3 salas!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
const SH=[[90,300,120,60],[280,340,110,60],[150,140,100,120],[330,120,80,120]];
function beams(){return 2+lvl;}
function beamX(i,tt){const n=beams();return 60+i*(340/Math.max(1,n-1))+Math.sin(tt*(.5+i*.2)+i*2.1)*95;}
function status(){hud.set('v',lives);hud.set('ex',((exp*100)|0)+'%');hud.set('nv',lvl);}
function reset(){px=40;py=420;tx=px;ty=py;exp=0;}
function gameOver(win){over=true;const sc=win?400+lives*100:Math.max(10,(lvl-1)*120);H.score(sc);
H.done(win?{win:true,score:sc,title:'👻 Invisível!',sub:'3 salas cruzadas sem ser visto.'}:{win:false,score:sc,title:'Flagrado!',sub:'Os holofotes te pegaram na sala '+lvl+'.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=135*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const inSh=SH.some(s=>px>=s[0]&&px<=s[0]+s[2]&&py>=s[1]&&py<=s[1]+s[3]);
 let lit=false;
 for(let i=0;i<beams();i++)if(Math.abs(px-beamX(i,t))<15+lvl*2)lit=true;
 if(lit&&!inSh)exp+=dt*(.7+lvl*.25);else exp=Math.max(0,exp-dt*.8);
 if(exp>=1){lives--;H.sfx('bad');if(lives<=0){gameOver(false);return;}reset();}
 if(px>406&&py<54){if(lvl>=3){gameOver(true);return;}lvl++;reset();H.sfx('ok');}
 status();
 x.fillStyle='#22222A';x.fillRect(0,0,460,460);
 SH.forEach(s=>{x.fillStyle='#0E0E12';x.fillRect(s[0],s[1],s[2],s[3]);});
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 for(let i=0;i<beams();i++){const bx=beamX(i,t);x.fillStyle='rgba(232,163,61,.28)';x.fillRect(bx-15-lvl*2,0,30+lvl*4,460);x.fillStyle='rgba(232,163,61,.5)';x.fillRect(bx-3,0,6,460);}
 x.fillStyle=lit&&!inSh?'#D94E34':'#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=2;x.stroke();
 x.fillStyle='rgba(0,0,0,.55)';x.fillRect(10,436,200,14);
 x.fillStyle=exp>.6?'#D94E34':'#E8A33D';x.fillRect(10,436,200*Math.min(1,exp),14);
 x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='left';x.fillText('EXPOSIÇÃO',14,447);
});
status();
}});"""

# 262 — Patrulha do Guarda
GAMES[262] = r"""/* NCODE N · 262 Patrulha do Guarda — passe na hora certa! */
GREG(262,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,lives=3,t=0;
const hud=H.hud(root,[['v','VIDAS',3]]);
const say=H.msg(root,'Chegue à saída 🚪! Cones amarelos são a visão dos guardas. Caixas escondem.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
const GD=[
 {wp:[[80,360],[380,360]],i:0,sp:70,x:80,y:360,a:0},
 {wp:[[380,240],[80,240]],i:0,sp:90,x:380,y:240,a:Math.PI},
 {wp:[[230,60],[230,180]],i:0,sp:60,x:230,y:60,a:Math.PI/2}
];
const COV=[[150,300,70,50],[300,150,70,50],[150,80,60,40]];
function inCone(g){
 const dx=px-g.x,dy=py-g.y,d=Math.hypot(dx,dy);
 if(d>130)return false;
 let df=Math.atan2(dy,dx)-g.a;
 while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
 return Math.abs(df)<.42;
}
const hidden=()=>COV.some(s=>px>=s[0]&&px<=s[0]+s[2]&&py>=s[1]&&py<=s[1]+s[3]);
function status(){hud.set('v',lives);}
function gameOver(win){over=true;const sc=win?350+lives*100:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🥷 Passou ileso!',sub:'Nenhum guarda te viu.'}:{win:false,score:sc,title:'Pego!',sub:'Um guarda te avistou. Use as caixas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 GD.forEach(g=>{
  const w=g.wp[g.i],d=Math.hypot(w[0]-g.x,w[1]-g.y);
  if(d<6)g.i=(g.i+1)%g.wp.length;
  else{g.a=Math.atan2(w[1]-g.y,w[0]-g.x);g.x+=(w[0]-g.x)/d*g.sp*dt;g.y+=(w[1]-g.y)/d*g.sp*dt;}
 });
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(!hidden()&&GD.some(inCone)){lives--;H.sfx('bad');if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 status();
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 COV.forEach(s=>{x.fillStyle='#8A6A2F';x.fillRect(s[0],s[1],s[2],s[3]);x.strokeStyle='#181816';x.strokeRect(s[0],s[1],s[2],s[3]);});
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 GD.forEach(g=>{
  x.fillStyle='rgba(232,163,61,.35)';x.beginPath();x.moveTo(g.x,g.y);x.arc(g.x,g.y,130,g.a-.42,g.a+.42);x.fill();
  x.fillStyle='#2E6E8A';x.beginPath();x.arc(g.x,g.y,11,0,7);x.fill();x.strokeStyle='#181816';x.lineWidth=2;x.stroke();
 });
 x.fillStyle=hidden()?'#3E7C4F':'#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,4,0,7);x.fill();
});
status();
}});"""

# 263 — Grid de Lasers
GAMES[263] = r"""/* NCODE N · 263 Grid de Lasers — atravesse no ritmo! */
GREG(263,{
init(root,H){
const N=8,CS=54,OX=14,OY=14;
let over=false,pc=0,pr=7,lvl=0,lives=3,t=0,cd=0;
const LV=[
 [{o:'r',k:2,p:3,ph:0},{o:'c',k:4,p:4,ph:1},{o:'r',k:5,p:3.4,ph:2}],
 [{o:'r',k:1,p:2.6,ph:0},{o:'c',k:2,p:3,ph:1},{o:'r',k:4,p:2.8,ph:2},{o:'c',k:6,p:3.2,ph:0},{o:'r',k:6,p:3,ph:1}],
 [{o:'r',k:0,p:2.2,ph:0},{o:'c',k:1,p:2.4,ph:1},{o:'r',k:3,p:2.2,ph:2},{o:'c',k:3,p:2.6,ph:0},{o:'r',k:5,p:2.2,ph:1},{o:'c',k:5,p:2.4,ph:2},{o:'r',k:7,p:2.6,ph:0}]
];
const hud=H.hud(root,[['v','VIDAS',3],['nv','FASE','1/3']]);
const say=H.msg(root,'Chegue ao cofre 💰! Lasers vermelhos queimam — atravesse quando apagarem. Setas ou toque na casa vizinha.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{if(d)tryMove(c);});
function active(L){return((t+L.ph)%L.p)<L.p/2;}
function onLaser(){
 return LV[lvl].some(L=>active(L)&&((L.o==='r'&&L.k===pr)||(L.o==='c'&&L.k===pc)));
}
function tryMove(c){
 if(over||cd>0)return;
 let dc=0,dr=0;
 if(c==='ArrowLeft'||c==='KeyA')dc=-1;else if(c==='ArrowRight'||c==='KeyD')dc=1;
 else if(c==='ArrowUp'||c==='KeyW')dr=-1;else if(c==='ArrowDown'||c==='KeyS')dr=1;else return;
 step(dc,dr);
}
function step(dc,dr){
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 pc=nc;pr=nr;cd=.16;H.sfx('tick');check();
}
function check(){
 if(onLaser()){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}pc=0;pr=7;}
 if(pc===7&&pr===0){
  if(lvl>=2){gameOver(true);return;}
  lvl++;pc=0;pr=7;H.sfx('ok');hud.set('nv',(lvl+1)+'/3');
 }
}
function gameOver(win){over=true;const sc=win?400+lives*100:lvl*120;H.score(sc);
H.done(win?{win:true,score:sc,title:'⚡ Ninja do laser!',sub:'3 salas sem um arranhão.'}:{win:false,score:sc,title:'Frito!',sub:'O laser te pegou na fase '+(lvl+1)+'.'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 if(onLaser()&&cd<=-1){}
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=(r+c)%2?'#2A2A33':'#24242C';x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#3A3A45';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 LV[lvl].forEach(L=>{
  x.fillStyle=active(L)?'#D94E34':'rgba(217,78,52,.18)';
  if(L.o==='r')x.fillRect(OX,OY+L.k*CS+CS/2-3,N*CS,6);
  else x.fillRect(OX+L.k*CS+CS/2-3,OY,6,N*CS);
 });
 x.font='26px system-ui';x.textAlign='center';
 x.fillText('💰',OX+7*CS+27,OY+0*CS+38);
 x.fillStyle=onLaser()?'#D94E34':'#C4D645';
 x.beginPath();x.arc(OX+pc*CS+27,OY+pr*CS+27,14,0,7);x.fill();
 x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 hud.set('nv',(lvl+1)+'/3');
});
}});"""

# 264 — Disfarce na Multidão
GAMES[264] = r"""/* NCODE N · 264 Disfarce na Multidão — aja natural! */
GREG(264,{
init(root,H){
let over=false,px=30,py=230,tx=px,ty=py,susp=0,t=0,moving=false;
const OBS=[{x:150,y:110,a:0,sp:.5},{x:320,y:110,a:2,sp:-.4},{x:150,y:360,a:1,sp:.45},{x:320,y:360,a:3,sp:-.5}];
const CROWD=[{x:120,y:230,r:46},{x:240,y:150,r:40},{x:240,y:320,r:40},{x:360,y:230,r:46}];
const hud=H.hud(root,[['sp','SUSPEITA','0%']]);
const say=H.msg(root,'Atravesse até a saída 🚪! Parado ou no meio da multidão (círculos), a suspeita cai. Correndo sob olhares, ela dispara!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function inGaze(ob){
 const dx=px-ob.x,dy=py-ob.y,d=Math.hypot(dx,dy);
 if(d>150)return false;
 let df=Math.atan2(dy,dx)-ob.a;
 while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
 return Math.abs(df)<.5;
}
function gameOver(win){over=true;const sc=win?Math.max(100,400-(susp*2|0)):30;H.score(sc);
H.done(win?{win:true,score:sc,title:'🎭 Mestre do disfarce!',sub:'Ninguém desconfiou.'}:{win:false,score:sc,title:'Descoberto!',sub:'A suspeita chegou a 100%. Misture-se à multidão!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 OBS.forEach(ob=>ob.a+=ob.sp*dt);
 const sp=115*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 moving=false;
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;moving=true;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>5){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;moving=true;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const seen=OBS.some(inGaze);
 const blend=CROWD.some(c=>Math.hypot(px-c.x,py-c.y)<c.r);
 if(seen&&moving)susp+=20*dt;else if(seen)susp+=6*dt;
 else if(blend)susp-=16*dt;else susp-=5*dt;
 susp=H.clamp(susp,0,100);
 hud.set('sp',(susp|0)+'%');
 if(susp>=100){gameOver(false);return;}
 if(px>406&&py>200&&py<260){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 CROWD.forEach(c=>{
  x.fillStyle='rgba(62,124,79,.25)';x.beginPath();x.arc(c.x,c.y,c.r,0,7);x.fill();
  x.fillStyle='#3E7C4F';
  for(let i=0;i<6;i++){const a=i/6*6.28+t*.3;x.beginPath();x.arc(c.x+Math.cos(a)*c.r*.55,c.y+Math.sin(a)*c.r*.55,7,0,7);x.fill();}
 });
 x.fillStyle='#3E7C4F';x.fillRect(414,200,38,60);x.fillStyle='#fff';x.font='22px system-ui';x.textAlign='center';x.fillText('🚪',433,240);
 OBS.forEach(ob=>{
  x.fillStyle='rgba(217,78,52,.22)';x.beginPath();x.moveTo(ob.x,ob.y);x.arc(ob.x,ob.y,150,ob.a-.5,ob.a+.5);x.fill();
  x.fillStyle='#181816';x.beginPath();x.arc(ob.x,ob.y,10,0,7);x.fill();
  x.fillStyle='#D94E34';x.beginPath();x.arc(ob.x+Math.cos(ob.a)*5,ob.y+Math.sin(ob.a)*5,4,0,7);x.fill();
 });
 x.fillStyle=seen?'#D94E34':'#2E6E8A';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 x.fillStyle='#181816';x.fillRect(10,10,200,14);
 x.fillStyle=susp>70?'#D94E34':'#E8A33D';x.fillRect(10,10,200*susp/100,14);
 x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='left';x.fillText('SUSPEITA',14,21);
});
}});"""

# 265 — Roubo de Chaves
GAMES[265] = r"""/* NCODE N · 265 Roubo de Chaves — furte sem acordar! */
GREG(265,{
init(root,H){
let over=false,lives=3,keys=0,time=120,t=0;
const GD=[
 {x:90,y:170,pr:0,ph:0,st:'sleep',stT:0},
 {x:230,y:170,pr:0,ph:2.5,st:'sleep',stT:0},
 {x:370,y:170,pr:0,ph:5,st:'sleep',stT:0}
];
const hud=H.hud(root,[['v','VIDAS',3],['k','CHAVES','0/3'],['tp','TEMPO',120]]);
const say=H.msg(root,'Toque no guarda para furtar a chave! Quando aparecer ❗ele vai se mexer — NÃO toque durante o ★ movimento!');
const o=H.cvs(root,460,360),x=o.x;
function status(){hud.set('v',lives);hud.set('k',keys+'/3');hud.set('tp',Math.ceil(time));}
function gameOver(win){over=true;const sc=win?300+lives*80+Math.ceil(time)*2:keys*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🔑 Ladrão silencioso!',sub:'3 chaves furtadas.'}:{win:false,score:sc,title:'Acordaram!',sub:keys+'/3 chaves. Espere o sono profundo!'});}
H.onTap(o,(px,py)=>{
 if(over)return;
 GD.forEach(g=>{
  if(g.done||Math.hypot(px-g.x,py-g.y)>52)return;
  if(g.st==='stir'){lives--;g.pr=0;H.sfx('bad');if(lives<=0)gameOver(false);}
  else{g.pr+=g.st==='warn'?8:15;H.sfx('tick');}
  if(g.pr>=100&&!g.done){g.done=true;keys++;H.sfx('ok');if(keys>=3)gameOver(true);}
 });
 status();
});
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 if(time<=0){gameOver(keys>=3);return;}
 GD.forEach(g=>{
  if(g.done)return;
  const cyc=(t+g.ph)%7;
  g.st=cyc<4.5?'sleep':cyc<5.5?'warn':'stir';
 });
 status();
 x.fillStyle='#23232B';x.fillRect(0,0,460,360);
 x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='center';
 x.fillText('💤 Dormitório dos guardas 💤',230,34);
 GD.forEach(g=>{
  const sh=g.st==='stir'?Math.sin(t*30)*3:0;
  x.fillStyle=g.done?'#3E7C4F':'#2E6E8A';
  x.beginPath();x.arc(g.x+sh,g.y,40,0,7);x.fill();
  x.strokeStyle='#000';x.lineWidth=2;x.stroke();
  x.font='30px system-ui';
  x.fillText(g.done?'🔑':g.st==='sleep'?'😴':g.st==='warn'?'❗':'★',g.x+sh,g.y+11);
  x.fillStyle='#000';x.fillRect(g.x-40,g.y+50,80,10);
  x.fillStyle='#E8A33D';x.fillRect(g.x-40,g.y+50,80*Math.min(1,g.pr/100),10);
  if(!g.done){x.fillStyle='#fff';x.font='11px system-ui';x.fillText(g.st==='sleep'?'sono profundo…':g.st==='warn'?'vai se mexer!':'QUIETO!',g.x,g.y+74);}
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('⏱️ '+Math.ceil(time)+'s   🔑 '+keys+'/3   ❤️ '+lives,14,344);
});
status();
}});"""

# 266 — Duto de Ventilação
GAMES[266] = r"""/* NCODE N · 266 Duto de Ventilação — rasteje até o cofre! */
GREG(266,{
init(root,H){
const MAP=[
 '############',
 '#S...#.....#',
 '##.#.#.###.#',
 '#..#...#F..#',
 '#.####.#.#.#',
 '#.#F...#.#V#',
 '#.#.##.#.#.#',
 '#...#..F#..#',
 '#####.####.#',
 '#.....#....#',
 '############'
];
const CS=38,OX=12,OY=12;
let over=false,pc=1,pr=1,fuses=0,lives=3,cd=0,t=0;
const SW=[
 {path:[[5,1],[5,2],[5,3],[6,3],[7,3],[7,2],[7,1]],i:0,dir:1},
 {path:[[9,4],[9,5],[9,6],[9,7],[8,7],[8,6],[8,5],[8,4]],i:0,dir:1}
];
let grid=MAP.map(r=>r.split(''));
const hud=H.hud(root,[['v','VIDAS',3],['f','FUSÍVEIS','0/3']]);
const say=H.msg(root,'Colete 3 fusíveis 🔌 e chegue ao cofre 💰! Olhos 👁️ patrulham os dutos. Setas ou toque na casa vizinha.');
const o=H.cvs(root,480,440),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(grid[nr][nc]==='#')return;
 pc=nc;pr=nr;cd=.15;H.sfx('tick');
 if(grid[nr][nc]==='F'){grid[nr][nc]='.';fuses++;H.sfx('ok');}
 check();
}
function check(){
 if(SW.some(s=>{const p=s.path[s.i];return p[0]===pc&&p[1]===pr;})){
  lives--;H.sfx('bad');if(lives<=0){gameOver(false);return;}pc=1;pr=1;
 }
 if(grid[pr][pc]==='V'){
  if(fuses>=3)gameOver(true);
 }
 status();
}
function status(){hud.set('v',lives);hud.set('f',fuses+'/3');say(fuses>=3?'Cofre destravado! Vá até 💰!':'Fusíveis: '+fuses+'/3 — o cofre precisa de 3!');}
function gameOver(win){over=true;const sc=win?350+fuses*50+lives*60:fuses*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'💰 Cofre aberto!',sub:'Rastejou como um profissional.'}:{win:false,score:sc,title:'Detectado!',sub:'A segurança te pegou. Decore as rotas!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
let swT=0;
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 swT+=dt;
 if(swT>.55){swT=0;SW.forEach(s=>{s.i+=s.dir;if(s.i>=s.path.length-1||s.i<=0)s.dir*=-1;});check();}
 x.fillStyle=H.C.paper;x.fillRect(0,0,480,440);
 for(let r=0;r<grid.length;r++)for(let c=0;c<grid[0].length;c++){
  const v=grid[r][c];
  x.fillStyle=v==='#'?'#4A4A44':v==='V'?(fuses>=3?'#3E7C4F':'#8A877C'):v==='F'?'#E8A33D':'#D8D5CC';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle=H.C.paper;x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  x.font='20px system-ui';x.textAlign='center';
  if(v==='F')x.fillText('🔌',OX+c*CS+19,OY+r*CS+28);
  if(v==='V')x.fillText('💰',OX+c*CS+19,OY+r*CS+28);
 }
 x.font='20px system-ui';
 SW.forEach(s=>{const p=s.path[s.i];x.fillText('👁️',OX+p[0]*CS+19,OY+p[1]*CS+28);});
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+19,OY+pr*CS+19,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+19,OY+pr*CS+19,5,0,7);x.fill();
});
status();
}});"""

# 267 — Ponto Cego da Câmera
GAMES[267] = r"""/* NCODE N · 267 Ponto Cego da Câmera — dance entre os cones! */
GREG(267,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,det=0,lives=3,t=0,freeze=0,charges=3;
const CAMS=[
 {x:90,y:330,a:0,sp:.6,r:170},
 {x:370,y:330,a:2,sp:-.5,r:170},
 {x:230,y:200,a:1,sp:.7,r:180},
 {x:90,y:70,a:3,sp:-.6,r:160},
 {x:370,y:70,a:5,sp:.55,r:160}
];
const hud=H.hud(root,[['v','VIDAS',3],['dt','DETECÇÃO','0%'],['fr','TRAVAR',3]]);
const say=H.msg(root,'Chegue à saída 🚪! Câmeras giram — ande pelos pontos cegos. Botão TRAVAR congela tudo por 4s!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'📷 Travar câmeras ('+charges+')',()=>{
 if(over||charges<=0||freeze>0)return;
 charges--;freeze=4;H.sfx('ok');hud.set('fr',charges);
},false);
function seen(){
 return CAMS.some(cm=>{
  const dx=px-cm.x,dy=py-cm.y,d=Math.hypot(dx,dy);
  if(d>cm.r)return false;
  let df=Math.atan2(dy,dx)-cm.a;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  return Math.abs(df)<.38;
 });
}
function gameOver(win){over=true;const sc=win?350+lives*100+charges*30:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'📷 Fantasma!',sub:'Nenhuma câmera te registrou.'}:{win:false,score:sc,title:'Gravado!',sub:'A detecção encheu. Congele nas horas críticas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(freeze>0)freeze-=dt;else CAMS.forEach(cm=>cm.a+=cm.sp*dt);
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const s=freeze>0?false:seen();
 if(s)det+=85*dt;else det=Math.max(0,det-55*dt);
 hud.set('dt',((det|0))+'%');
 if(det>=100){lives--;H.sfx('bad');det=0;if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#20242C';x.fillRect(0,0,460,460);
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 CAMS.forEach(cm=>{
  x.fillStyle=freeze>0?'rgba(196,214,69,.15)':'rgba(217,78,52,.25)';
  x.beginPath();x.moveTo(cm.x,cm.y);x.arc(cm.x,cm.y,cm.r,cm.a-.38,cm.a+.38);x.fill();
  x.fillStyle=freeze>0?'#C4D645':'#D94E34';
  x.beginPath();x.arc(cm.x,cm.y,10,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 });
 x.fillStyle=s?'#D94E34':'#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#000';x.fillRect(10,436,220,14);
 x.fillStyle=det>60?'#D94E34':'#E8A33D';x.fillRect(10,436,220*Math.min(1,det/100),14);
 x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='left';x.fillText('DETECÇÃO'+(freeze>0?' · CONGELADO '+freeze.toFixed(1)+'s':''),14,447);
 hud.set('v',lives);
});
}});"""

# 268 — Passo Silencioso
GAMES[268] = r"""/* NCODE N · 268 Passo Silencioso — pise macio! */
GREG(268,{
init(root,H){
const N=10,CS=44,OX=10,OY=10;
// 0 tapete, 1 madeira, 2 vidro
const SUR=[
 [1,1,0,1,1,2,1,1,0,1],
 [1,0,0,1,2,2,1,0,0,1],
 [1,0,1,1,1,1,1,1,0,1],
 [1,0,1,2,2,1,0,1,0,1],
 [1,0,1,2,2,1,0,1,0,0],
 [1,0,0,0,1,1,0,1,1,0],
 [1,1,1,0,1,2,0,0,1,0],
 [2,2,1,0,1,2,1,0,1,0],
 [1,1,1,0,0,0,1,0,0,0],
 [1,0,0,0,1,1,1,1,1,0]
];
let over=false,pc=0,pr=9,noise=0,lives=3,cd=0,maxN=0;
const hud=H.hud(root,[['v','VIDAS',3],['rz','BARULHO','0%']]);
const say=H.msg(root,'Chegue à saída 🚪! 🟫 tapete = silêncio · 🟧 madeira = ruído · 🟦 vidro = MUITO ruído. Pare para o barulho baixar!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 pc=nc;pr=nr;cd=.22;
 noise+=[0,14,34][SUR[nr][nc]];
 maxN=Math.max(maxN,noise);
 H.sfx(SUR[nr][nc]===2?'bad':'tick');
 if(noise>=100){lives--;noise=0;H.sfx('bad');if(lives<=0){gameOver(false);return;}}
 if(pc===9&&pr===0){gameOver(true);return;}
 status();
}
function status(){hud.set('v',lives);hud.set('rz',((noise|0))+'%');}
function gameOver(win){over=true;const sc=win?Math.max(150,500-(maxN|0)*2)+lives*60:40;H.score(sc);
H.done(win?{win:true,score:sc,title:'🐈 Passo de gato!',sub:'Pico de barulho: '+(maxN|0)+'%.' }:{win:false,score:sc,title:'Ouvido!',sub:'O guarda ouviu seus passos. Prefira o tapete!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;if(cd>0)cd-=dt;
 noise=Math.max(0,noise-22*dt);
 hud.set('rz',(noise|0)+'%');
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 const TCOL=['#7A5C3E','#C98A1B','#7FB3C8'];
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=TCOL[SUR[r][c]];x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle=H.C.paper;x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.font='24px system-ui';x.textAlign='center';
 x.fillText('🚪',OX+9*CS+22,OY+0*CS+33);
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,5,0,7);x.fill();
});
status();
}});"""

# 269 — Batedor de Carteira
GAMES[269] = r"""/* NCODE N · 269 Batedor de Carteira — esbarre e furte! */
GREG(269,{
init(root,H){
let over=false,px=230,py=400,tx=px,ty=py,wallets=0,wanted=0,t=0,heat=0;
const WK=[];
for(let i=0;i<12;i++)WK.push({x:Math.random()*460,y:60+Math.random()*320,vx:(Math.random()<.5?-1:1)*(30+Math.random()*40),tgt:i<5,got:false,ph:Math.random()*7});
const GD=[{x:100,y:120,a:0},{x:360,y:340,a:2}];
const hud=H.hud(root,[['w','CARTEIRAS','0/5'],['pr','PROCURADO','0/3']]);
const say=H.msg(root,'Esbarre nos alvos 💰 para furtar! Se um guarda 👁️ te vir logo após o furto, vira procurado. 5 carteiras vencem!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?Math.max(150,500-(t|0)*3):wallets*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'💸 Mão leve!',sub:'5 carteiras em '+(t|0)+'s.'}:{win:false,score:sc,title:'Reconhecido!',sub:wallets+'/5 carteiras. Furte longe dos guardas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(heat>0)heat-=dt;
 GD.forEach((g,i)=>g.a+=dt*(i?-.5:.5));
 WK.forEach(w=>{w.x+=w.vx*dt;w.ph+=dt*6;if(w.x<-20)w.x=480;if(w.x>480)w.x=-20;});
 const sp=130*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 WK.forEach(w=>{
  if(w.tgt&&!w.got&&Math.hypot(px-w.x,py-w.y)<20){w.got=true;wallets++;heat=1.6;H.sfx('ok');hud.set('w',wallets+'/5');}
 });
 if(heat>0){
  const seen=GD.some(g=>{
   const ddx=px-g.x,ddy=py-g.y,d=Math.hypot(ddx,ddy);
   if(d>140)return false;
   let df=Math.atan2(ddy,ddx)-g.a;
   while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
   return Math.abs(df)<.5;
  });
  if(seen){wanted++;heat=0;H.sfx('bad');hud.set('pr',wanted+'/3');if(wanted>=3){gameOver(false);return;}}
 }
 if(wallets>=5){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 WK.forEach(w=>{
  x.fillStyle=w.tgt&&!w.got?'#E8A33D':'#8A877C';
  x.beginPath();x.arc(w.x,w.y+Math.sin(w.ph)*2,9,0,7);x.fill();
  if(w.tgt&&!w.got){x.font='11px system-ui';x.textAlign='center';x.fillText('💰',w.x,w.y-12);}
 });
 GD.forEach(g=>{
  x.fillStyle='rgba(217,78,52,.25)';x.beginPath();x.moveTo(g.x,g.y);x.arc(g.x,g.y,140,g.a-.5,g.a+.5);x.fill();
  x.font='18px system-ui';x.textAlign='center';x.fillText('👁️',g.x,g.y+6);
 });
 x.fillStyle=heat>0?'#D94E34':'#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.stroke();
 if(heat>0){x.fillStyle='#D94E34';x.font='bold 13px system-ui';x.textAlign='center';x.fillText('SUMA!',px,py-16);}
});
}});"""

# 270 — Museu à Noite
GAMES[270] = r"""/* NCODE N · 270 Museu à Noite — fotografe os artefatos! */
GREG(270,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,photos=0,alerts=0,t=0,flash=0;
const ART=[{x:120,y:120,g:false},{x:340,y:120,g:false},{x:230,y:230,g:false},{x:120,y:340,g:false},{x:340,y:340,g:false}];
const GD=[
 {wp:[[60,60],[400,60]],i:0,sp:60,x:60,y:60,a:0},
 {wp:[[400,400],[60,400]],i:0,sp:75,x:400,y:400,a:Math.PI}
];
const hud=H.hud(root,[['f','FOTOS','0/5'],['a','ALERTAS','0/3']]);
const say=H.msg(root,'Chegue perto dos artefatos 🏺 e toque em FOTOGRAFAR! O flash denuncia se um cone te vir. Depois, fuja pela saída 🚪!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const a=ART.find(q=>!q.g&&Math.hypot(px-q.x,py-q.y)<55);
 if(!a){H.sfx('bad');return;}
 a.g=true;photos++;flash=.6;H.sfx('ok');
 hud.set('f',photos+'/5');
 if(inCone()){alerts++;H.sfx('bad');hud.set('a',alerts+'/3');if(alerts>=3){gameOver(false);return;}}
},true);
function inCone(){
 return GD.some(g=>{
  const dx=px-g.x,dy=py-g.y,d=Math.hypot(dx,dy);
  if(d>140)return false;
  let df=Math.atan2(dy,dx)-g.a;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  return Math.abs(df)<.45;
 });
}
function gameOver(win){over=true;const sc=win?400+(3-alerts)*80:photos*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'📸 Exposição roubada!',sub:'5 artefatos fotografados.'}:{win:false,score:sc,title:'Alarme!',sub:photos+'/5 fotos. Fotografe fora dos cones!'});}
H.loop(dt=>{
 if(over)return;t+=dt;if(flash>0)flash-=dt;
 GD.forEach(g=>{
  const w=g.wp[g.i],d=Math.hypot(w[0]-g.x,w[1]-g.y);
  if(d<6)g.i=(g.i+1)%g.wp.length;
  else{g.a=Math.atan2(w[1]-g.y,w[0]-g.x);g.x+=(w[0]-g.x)/d*g.sp*dt;g.y+=(w[1]-g.y)/d*g.sp*dt;}
 });
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(photos>=5&&px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#2A2620';x.fillRect(0,0,460,460);
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 ART.forEach(a=>{
  if(a.g)return;
  x.fillStyle='rgba(196,214,69,.15)';x.beginPath();x.arc(a.x,a.y,55,0,7);x.fill();
  x.font='26px system-ui';x.fillText('🏺',a.x,a.y+9);
 });
 GD.forEach(g=>{
  x.fillStyle='rgba(232,163,61,.3)';x.beginPath();x.moveTo(g.x,g.y);x.arc(g.x,g.y,140,g.a-.45,g.a+.45);x.fill();
  x.fillStyle='#2E6E8A';x.beginPath();x.arc(g.x,g.y,11,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 });
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();x.strokeStyle='#000';x.stroke();
 if(flash>0){x.strokeStyle='rgba(255,255,255,'+flash+')';x.lineWidth=4;x.beginPath();x.arc(px,py,20+(0.6-flash)*60,0,7);x.stroke();}
});
}});"""

# 271 — Fuga da Prisão
GAMES[271] = r"""/* NCODE N · 271 Fuga da Prisão — cave até o muro! */
GREG(271,{
init(root,H){
let over=false,prog=0,caught=0,t=0,time=150;
const hud=H.hud(root,[['t','TÚNEL','0%'],['s','DESCONFIANÇA','0%'],['tp','TEMPO',150]]);
const say=H.msg(root,'Cave até 100%! ⛏️ Cavar faz barulho — pare quando o guarda passar (luz vermelha)! Cavar devagar é sempre seguro.');
const o=H.cvs(root,460,340),x=o.x;
H.btn(root,'⛏️ Cavar rápido (+8, barulhento)',()=>{
 if(over)return;
 prog+=8;H.sfx('tick');
 if(danger()){caught+=34;H.sfx('bad');}
 check();
},true);
H.btn(root,'🥄 Cavar devagar (+3, seguro)',()=>{
 if(over)return;
 prog+=3;H.sfx('tick');check();
},false);
function danger(){return(t%9)>6;}
function check(){
 if(caught>=100){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 status();
}
function status(){hud.set('t',Math.min(100,prog|0)+'%');hud.set('s',Math.min(100,caught|0)+'%');hud.set('tp',Math.ceil(time));}
function gameOver(win){over=true;const sc=win?300+Math.ceil(time)*2:prog|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'⛏️ Liberdade!',sub:'Túnel pronto em '+(150-Math.ceil(time))+'s.'}:{win:false,score:sc,title:'Pego no flagra!',sub:'Túnel em '+(prog|0)+'%. Não cave sob a luz vermelha!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 caught=Math.max(0,caught-dt*3);
 if(time<=0){gameOver(prog>=100);return;}
 status();
 x.fillStyle='#3A332A';x.fillRect(0,0,460,340);
 x.fillStyle='#22222A';x.fillRect(30,60,400,200);
 x.fillStyle=danger()?'rgba(217,78,52,.5)':'rgba(62,124,79,.4)';
 x.fillRect(30,60,400,60);
 x.fillStyle='#fff';x.font='bold 17px system-ui';x.textAlign='center';
 x.fillText(danger()?'🚨 GUARDA PASSANDO — PARE!':'✅ Corredor livre — CAVE!',230,98);
 x.fillStyle='#5A4A33';x.fillRect(30,150,400,110);
 x.fillStyle='#2A2118';x.fillRect(30,150,400*Math.min(1,prog/100),110);
 x.font='30px system-ui';x.fillText('🧱',415,245);x.fillText('⛏️',30+400*Math.min(1,prog/100),205);
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Túnel '+Math.min(100,prog|0)+'% · Desconfiança '+(caught|0)+'% · ⏱️'+Math.ceil(time)+'s',14,300);
 x.fillStyle='#000';x.fillRect(14,308,432,10);
 x.fillStyle='#D94E34';x.fillRect(14,308,432*Math.min(1,caught/100),10);
});
status();
}});"""

# 272 — Telhados Noturnos
GAMES[272] = r"""/* NCODE N · 272 Telhados Noturnos — fuja do holofote! */
GREG(272,{
init(root,H){
const ROOFS=[[0,380,120],[140,340,100],[260,300,100],[380,330,80],[480,290,90],[590,320,90]];
let over=false,px=40,py=340,vx=0,vy=0,ground=true,exp=0,t=0,win=false;
const hud=H.hud(root,[['ex','EXPOSIÇÃO','0%']]);
const say=H.msg(root,'Atravesse os telhados até a borda direita! Setas movem, Espaço/Toque pula. O holofote 🚁 revela — cheio = pego!');
const o=H.cvs(root,680,440),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&(c==='Space'||c==='ArrowUp'||c==='KeyW'))jump();});
H.onTap(o,()=>jump());
function jump(){if(over||!ground)return;vy=-330;ground=false;H.sfx('tick');}
function spotX(){return 340+Math.sin(t*.7)*300;}
function gameOver(w){over=true;win=w;const sc=w?350:Math.max(20,px|0);H.score(sc);
H.done(w?{win:true,score:sc,title:'🌙 Rei dos telhados!',sub:'Atravessou sem ser visto.'}:{win:false,score:sc,title:'Iluminado!',sub:'O helicóptero te achou. Corra entre as varreduras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD;
 vx=H.clamp(vx+((R?1:0)-(L?1:0))*900*dt,-180,180);
 if(!L&&!R)vx*=.9;
 px+=vx*dt;
 vy+=900*dt;py+=vy*dt;ground=false;
 ROOFS.forEach(r=>{
  if(px>=r[0]&&px<=r[0]+r[2]&&py>=r[1]-6&&py<=r[1]+24&&vy>=0){py=r[1];vy=0;ground=true;}
 });
 if(py>440){gameOver(false);return;}
 px=H.clamp(px,8,672);
 if(Math.abs(px-spotX())<45)exp+=90*dt;else exp=Math.max(0,exp-50*dt);
 hud.set('ex',(Math.min(100,exp)|0)+'%');
 if(exp>=100){gameOver(false);return;}
 if(px>660){gameOver(true);return;}
 x.fillStyle='#14141C';x.fillRect(0,0,680,440);
 x.fillStyle='#fff';
 for(let i=0;i<40;i++){const sx=(i*167)%680,sy=(i*97)%200;x.fillRect(sx,sy,2,2);}
 const sx=spotX();
 x.fillStyle='rgba(232,163,61,.25)';
 x.beginPath();x.moveTo(sx-20,60);x.lineTo(sx+20,60);x.lineTo(sx+60,440);x.lineTo(sx-60,440);x.fill();
 x.font='26px system-ui';x.textAlign='center';x.fillText('🚁',sx,50);
 ROOFS.forEach(r=>{x.fillStyle='#3E3E48';x.fillRect(r[0],r[1],r[2],440-r[1]);x.fillStyle='#C4D645';x.fillRect(r[0],r[1],r[2],6);});
 x.fillStyle='#3E7C4F';x.fillRect(660,200,20,240);
 x.fillStyle=Math.abs(px-sx)<45?'#D94E34':'#C4D645';
 x.beginPath();x.arc(px,py-12,11,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=2;x.stroke();
});
}});"""

# 273 — Infiltração Submarina
GAMES[273] = r"""/* NCODE N · 273 Infiltração Submarina — burle o sonar! */
GREG(273,{
init(root,H){
let over=false,px=40,py=380,tx=px,ty=py,exp=0,lives=3,t=0,plant=0;
const EMIT=[{x:150,y:120},{x:330,y:280}];
const DEV={x:415,y:60};
let rings=[];
const hud=H.hud(root,[['v','VIDAS',3],['pl','INSTALAÇÃO','0%']]);
const say=H.msg(root,'Chegue ao terminal 🖥️ e fique parado para instalar (3s)! Anéis de sonar revelam — fuja das bordas dos anéis!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?350+lives*100:plant|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🌊 Fantasma das profundezas!',sub:'Dispositivo instalado sem um ping.'}:{win:false,score:sc,title:'Detectado!',sub:'O sonar te localizou. Desvie dos anéis!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 EMIT.forEach((e,i)=>{if(((t+i*1.4)%2.8)<dt*1.2)rings.push({x:e.x,y:e.y,r:8});});
 rings.forEach(r=>r.r+=95*dt);
 rings=rings.filter(r=>r.r<420);
 const sp=120*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const pinged=rings.some(r=>Math.abs(Math.hypot(px-r.x,py-r.y)-r.r)<11);
 if(pinged){exp+=95*dt;H.sfx('bad');}else exp=Math.max(0,exp-60*dt);
 if(exp>=100){lives--;exp=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=40;py=380;tx=px;ty=py;}
 if(Math.hypot(px-DEV.x,py-DEV.y)<34){plant+=dt/3*100;hud.set('pl',Math.min(100,plant|0)+'%');if(plant>=100){gameOver(true);return;}}
 else plant=Math.max(0,plant-40*dt);
 x.fillStyle='#12303C';x.fillRect(0,0,460,460);
 EMIT.forEach(e=>{x.fillStyle='#E8A33D';x.beginPath();x.arc(e.x,e.y,9,0,7);x.fill();});
 rings.forEach(r=>{x.strokeStyle='rgba(232,163,61,.6)';x.lineWidth=3;x.beginPath();x.arc(r.x,r.y,r.r,0,7);x.stroke();});
 x.font='30px system-ui';x.textAlign='center';x.fillText('🖥️',DEV.x,DEV.y+10);
 x.strokeStyle='#C4D645';x.lineWidth=2;x.beginPath();x.arc(DEV.x,DEV.y,34,0,7);x.stroke();
 x.fillStyle=pinged?'#D94E34':'#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#000';x.fillRect(10,436,200,12);
 x.fillStyle='#E8A33D';x.fillRect(10,436,200*Math.min(1,exp/100),12);
});
}});"""

# 274 — Camuflagem na Floresta
GAMES[274] = r"""/* NCODE N · 274 Camuflagem na Floresta — suma no verde! */
GREG(274,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,spot=0,lives=3,t=0;
const BUSH=[[60,320,90,60],[200,340,110,60],[340,320,80,60],[120,180,100,70],[280,150,120,70],[60,60,80,60],[320,50,100,60]];
const SOL=[
 {x:150,y:250,a:0,sp:.5},
 {x:330,y:150,a:2,sp:-.45},
 {x:230,y:60,a:4,sp:.55}
];
const hud=H.hud(root,[['v','VIDAS',3],['av','AVISTADO','0%']]);
const say=H.msg(root,'Chegue à saída 🚪! Dentro dos arbustos você some. Binóculos têm visão longa e estreita!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
const inBush=()=>BUSH.some(s=>px>=s[0]&&px<=s[0]+s[2]&&py>=s[1]&&py<=s[1]+s[3]);
function seen(){
 return SOL.some(s=>{
  const dx=px-s.x,dy=py-s.y,d=Math.hypot(dx,dy);
  if(d>260)return false;
  let df=Math.atan2(dy,dx)-s.a;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  return Math.abs(df)<.22;
 });
}
function gameOver(win){over=true;const sc=win?350+lives*100:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🌿 Invisível na mata!',sub:'Atravessou sem ser visto.'}:{win:false,score:sc,title:'Avistado!',sub:'Os binóculos te acharam. Use os arbustos!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 SOL.forEach(s=>s.a+=s.sp*dt);
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const hid=inBush(),s=!hid&&seen();
 if(s)spot+=80*dt;else spot=Math.max(0,spot-60*dt);
 hud.set('av',(Math.min(100,spot)|0)+'%');
 if(spot>=100){lives--;spot=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#2E4A2A';x.fillRect(0,0,460,460);
 BUSH.forEach(s=>{x.fillStyle='#3E7C4F';x.beginPath();x.ellipse(s[0]+s[2]/2,s[1]+s[3]/2,s[2]/2,s[3]/2,0,0,7);x.fill();});
 x.fillStyle='#C4D645';x.fillRect(406,8,46,46);x.fillStyle='#181816';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 SOL.forEach(s=>{
  x.fillStyle='rgba(232,163,61,.3)';x.beginPath();x.moveTo(s.x,s.y);x.arc(s.x,s.y,260,s.a-.22,s.a+.22);x.fill();
  x.font='18px system-ui';x.fillText('🔭',s.x,s.y+6);
 });
 x.fillStyle=hid?'#3E7C4F':s?'#D94E34':'#E8A33D';
 x.beginPath();x.arc(px,py,10,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=2;x.stroke();
});
}});"""

# 275 — Mansão do Roubo
GAMES[275] = r"""/* NCODE N · 275 Mansão do Roubo — cômodo por cômodo! */
GREG(275,{
init(root,H){
const RW=140,RH=180,OX=20,OY=20;
let over=false,pc=0,pr=1,loot=0,lives=2,t=0,cd=0,guard=0;
const LOOT=[[0,0],[2,0],[1,1],[2,1]];
const GOT={};
const CIRC=[0,1,2,5,4,3];
const hud=H.hud(root,[['v','VIDAS',2],['s','SAQUES','0/4']]);
const say=H.msg(root,'Saqueie os 4 cômodos 💎 e volte à porta 🚪! O ronda circula — se ele entrar com você, esconda-se no armário (fique parado no 🗄️)!');
const o=H.cvs(root,460,420),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function room(){return pr*3+pc;}
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>2||nr<0||nr>1)return;
 pc=nc;pr=nr;cd=.3;H.sfx('tick');check();
}
function closet(){const cx=OX+pc*RW+RW-28,cy=OY+pr*RH+28;return{cx,cy};}
let hideT=0;
function check(){
 const k=pc+','+pr;
 if(LOOT.some(l=>l[0]===pc&&l[1]===pr)&&!GOT[k]){GOT[k]=1;loot++;H.sfx('ok');hud.set('s',loot+'/4');}
 status();
}
function status(){say(loot>=4?'Tudo saqueado! Volte à porta 🚪 (canto inferior esquerdo)!':'Ronda no cômodo '+(guard+1)+' — saqueie '+loot+'/4!');}
function gameOver(win){over=true;const sc=win?400+lives*100:loot*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'💎 Mansão limpa!',sub:'4 cômodos saqueados.'}:{win:false,score:sc,title:'Pego!',sub:loot+'/4 saques. Fuja da ronda!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/RW),r=Math.floor((py-OY)/RH);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
let gT=0;
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 gT+=dt;
 if(gT>2.6){gT=0;guard=(guard+1)%6;
  if(CIRC[guard]===room()){lives--;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver(false);return;}
   pc=0;pr=1;}
 }
 if(loot>=4&&pc===0&&pr===1){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,420);
 for(let r=0;r<2;r++)for(let c=0;c<3;c++){
  const i=r*3+c;
  x.fillStyle=CIRC[guard]===i?'rgba(217,78,52,.2)':'#EDE8DC';
  x.fillRect(OX+c*RW,OY+r*RH,RW,RH);
  x.strokeStyle='#181816';x.lineWidth=2;x.strokeRect(OX+c*RW,OY+r*RH,RW,RH);
  x.fillStyle='#8A877C';x.font='12px system-ui';x.textAlign='left';x.fillText('Cômodo '+(i+1),OX+c*RW+8,OY+r*RH+20);
  x.font='22px system-ui';x.textAlign='center';
  x.fillText('🗄️',OX+c*RW+RW-28,OY+r*RH+32);
  if(c===0&&r===1)x.fillText('🚪',OX+c*RW+28,OY+r*RH+RH-16);
  const k=c+','+r;
  if(LOOT.some(l=>l[0]===c&&l[1]===r)&&!GOT[k])x.fillText('💎',OX+c*RW+RW/2,OY+r*RH+RH/2+8);
  if(CIRC[guard]===i){x.font='26px system-ui';x.fillText('💂',OX+c*RW+RW/2,OY+r*RH+44);}
 }
 const px=OX+pc*RW+RW/2,py=OY+pr*RH+RH/2+34;
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,11,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,4,0,7);x.fill();
 hud.set('v',lives);
});
status();
}});"""

# 276 — Entrega de Espião
GAMES[276] = r"""/* NCODE N · 276 Entrega de Espião — ache o contato! */
GREG(276,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,t=0,hand=0,lives=3;
const CT={x:120+Math.random()*220,y:80+Math.random()*200};
const WK=[];
for(let i=0;i<14;i++)WK.push({x:Math.random()*460,y:Math.random()*460,vx:(Math.random()-.5)*50,vy:(Math.random()-.5)*50,ph:Math.random()*7});
const POL=[
 {wp:[[60,60],[400,60],[400,200],[60,200]],i:0,sp:80,x:60,y:60},
 {wp:[[60,400],[400,400],[400,260],[60,260]],i:0,sp:80,x:60,y:400}
];
const hud=H.hud(root,[['v','VIDAS',3],['en','ENTREGA','0%']]);
const say=H.msg(root,'Encontre o contato de chapéu vermelho 🎩 na estação e fique perto para entregar! Policiais de perto prendem!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?Math.max(150,450-(t|0)*4)+lives*60:20;H.score(sc);
H.done(win?{win:true,score:sc,title:'🤝 Pacote entregue!',sub:'Missão cumprida em '+(t|0)+'s.'}:{win:false,score:sc,title:'Preso!',sub:'A polícia te pegou 3 vezes.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 WK.forEach(w=>{w.x+=w.vx*dt;w.y+=w.vy*dt;w.ph+=dt*5;if(w.x<0||w.x>460)w.vx*=-1;if(w.y<0||w.y>460)w.vy*=-1;});
 POL.forEach(p=>{
  const w=p.wp[p.i],d=Math.hypot(w[0]-p.x,w[1]-p.y);
  if(d<8)p.i=(p.i+1)%p.wp.length;
  else{p.x+=(w[0]-p.x)/d*p.sp*dt;p.y+=(w[1]-p.y)/d*p.sp*dt;}
 });
 const sp=130*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(POL.some(p=>Math.hypot(px-p.x,py-p.y)<26)){lives--;hand=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(Math.hypot(px-CT.x,py-CT.y)<36){hand+=dt/2*100;hud.set('en',Math.min(100,hand|0)+'%');if(hand>=100){gameOver(true);return;}}
 else hand=Math.max(0,hand-50*dt);
 x.fillStyle='#D8D5CC';x.fillRect(0,0,460,460);
 x.fillStyle='#B9B5A8';
 for(let i=0;i<5;i++)x.fillRect(0,90+i*70,460,8);
 WK.forEach(w=>{x.fillStyle='#8A877C';x.beginPath();x.arc(w.x,w.y+Math.sin(w.ph)*2,8,0,7);x.fill();});
 x.font='22px system-ui';x.textAlign='center';x.fillText('🎩',CT.x,CT.y+8);
 x.strokeStyle='#D94E34';x.lineWidth=2;x.beginPath();x.arc(CT.x,CT.y,36,0,7);x.stroke();
 POL.forEach(p=>{x.font='20px system-ui';x.fillText('👮',p.x,p.y+7);});
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,4,0,7);x.fill();
});
}});"""

# 277 — Armazém Escuro
GAMES[277] = r"""/* NCODE N · 277 Armazém Escuro — navegue pelo som! */
GREG(277,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,t=0,lives=3,ping=0,reveal=0,charges=3;
const GD=[
 {x:150,y:150,vx:40,vy:25},{x:320,y:320,vx:-35,vy:30},{x:230,y:230,vx:30,vy:-40}
];
const hud=H.hud(root,[['v','VIDAS',3],['fl','LANTERNA',3]]);
const say=H.msg(root,'Chegue à saída 🚪 no escuro! O radar revela os guardas a cada 2s. Toque = bip: perto = agudo! Lanterna revela tudo (3×).');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;beep();});
function beep(){
 const d=Math.min.apply(null,GD.map(g=>Math.hypot(px-g.x,py-g.y)));
 H.sfx(d<120?'bad':'tick');
}
H.btn(root,'🔦 Lanterna (3)',()=>{
 if(over||charges<=0)return;
 charges--;reveal=2.5;H.sfx('ok');hud.set('fl',charges);
},false);
function gameOver(win){over=true;const sc=win?350+lives*100:40;H.score(sc);
H.done(win?{win:true,score:sc,title:'🦇 Navegador do escuro!',sub:'Saiu sem esbarrar.'}:{win:false,score:sc,title:'Encurralado!',sub:'Esbarrou nos guardas. Ouça os bips!'});}
H.loop(dt=>{
 if(over)return;t+=dt;ping+=dt;
 if(reveal>0)reveal-=dt;
 if(ping>2){ping=0;beep();}
 GD.forEach(g=>{g.x+=g.vx*dt;g.y+=g.vy*dt;if(g.x<30||g.x>430)g.vx*=-1;if(g.y<30||g.y>430)g.vy*=-1;});
 const sp=120*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(GD.some(g=>Math.hypot(px-g.x,py-g.y)<24)){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#0C0C10';x.fillRect(0,0,460,460);
 const pr=(ping/2)*230;
 x.strokeStyle='rgba(196,214,69,.5)';x.lineWidth=2;
 x.beginPath();x.arc(px,py,pr,0,7);x.stroke();
 const vis=reveal>0||ping<.9;
 if(vis)GD.forEach(g=>{x.fillStyle='#D94E34';x.beginPath();x.arc(g.x,g.y,11,0,7);x.fill();x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='center';x.fillText('!',g.x,g.y+4);});
 const eg=x.createRadialGradient?null:null;
 x.fillStyle='rgba(62,124,79,.9)';x.fillRect(406,8,46,46);
 x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 x.fillStyle='#fff';x.font='12px system-ui';x.textAlign='left';
 x.fillText(reveal>0?'🔦 LIGADA':'Radar: '+(2-ping).toFixed(1)+'s',14,448);
});
}});"""

# 278 — Hack do Elevador
GAMES[278] = r"""/* NCODE N · 278 Hack do Elevador — suba sem ser visto! */
GREG(278,{
init(root,H){
let over=false,floor=1,seq=[],show=0,showT=0,input=[],det=0,phase='show';
const COLS=['#D94E34','#2E6E8A','#3E7C4F','#E8A33D'];
const hud=H.hud(root,[['a','ANDAR','1/3'],['dt','DETECÇÃO','0%']]);
const say=H.msg(root,'Repita a sequência nos painéis para subir! Erro = +25% detecção. 3 andares até o cofre!');
const o=H.cvs(root,460,300),x=o.x;
const brow=H.el('div','g-row',null,root);
function status(){hud.set('a',floor+'/3');hud.set('dt',(det|0)+'%');}
function newSeq(){
 seq=[];input=[];
 const n=3+floor;
 for(let i=0;i<n;i++)seq.push((Math.random()*4)|0);
 phase='show';show=0;showT=0;
 say('Andar '+floor+': memorize a sequência!');
}
function press(i){
 if(over||phase!=='go')return;
 H.sfx('tick');
 if(i===seq[input.length]){input.push(i);
  if(input.length>=seq.length){
   if(floor>=3){gameOver(true);return;}
   floor++;status();H.sfx('ok');
   newSeq();
  }
 }else{
  det+=25;H.sfx('bad');input=[];
  if(det>=100){gameOver(false);return;}
  say('Erro! +25% detecção. Tente de novo.');
 }
 status();
}
function gameOver(win){over=true;const sc=win?400+(100-det)*2:floor*80;H.score(sc);
H.done(win?{win:true,score:sc,title:'🛗 Acesso liberado!',sub:'Andar restrito alcançado.'}:{win:false,score:sc,title:'Rastreado!',sub:'O sistema te detectou no andar '+floor+'.'});}
COLS.forEach((c,i)=>{
 const b=H.el('button','g-card','⬛',brow);
 b.style.width='100px';b.style.height='70px';b.style.fontSize='30px';b.style.background='#222';
 b.addEventListener('click',()=>press(i));
 b.dataset.i=i;
});
function paintBtns(){
 brow.children.forEach(b=>{
  const i=+b.dataset.i;
  const lit=phase==='show'&&show<seq.length&&seq[show]===i&&showT<.5;
  b.style.background=lit?COLS[i]:'#222';
  b.innerHTML=lit?'🔆':'⬛';
 });
}
H.loop(dt=>{
 if(over)return;
 if(phase==='show'){
  showT+=dt;
  if(showT>.7){showT=0;show++;if(show>=seq.length){phase='go';say('Sua vez! Repita!');}}
  paintBtns();
 }
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,300);
 x.fillStyle='#EDE8DC';x.fillRect(150,20,160,260);
 x.strokeStyle='#181816';x.lineWidth=3;x.strokeRect(150,20,160,260);
 for(let f=3;f>=1;f--){
  const y=250-(f-1)*86;
  x.fillStyle=f===floor?'#C4D645':'#8A877C';
  x.beginPath();x.arc(190,y,16,0,7);x.fill();
  x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='center';
  x.fillText(f===3?'💰':f,190,y+5);
 }
 x.fillStyle='#D94E34';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Andar '+floor+'/3',330,60);
 x.fillText('Detecção '+(det|0)+'%',330,90);
 x.fillStyle='#000';x.fillRect(330,100,100,12);
 x.fillStyle='#D94E34';x.fillRect(330,100,det,12);
 x.fillStyle='#E8A33D';x.font='13px system-ui';
 x.fillText(phase==='show'?'MEMORIZE…':'REPITA!',330,140);
 x.fillStyle='#fff';
 x.fillText('Progresso: '+input.length+'/'+seq.length,330,165);
});
newSeq();status();
}});"""

# 279 — Mistura na Multidão
GAMES[279] = r"""/* NCODE N · 279 Mistura na Multidão — flua com todos! */
GREG(279,{
init(root,H){
let over=false,px=30,py=230,tx=px,ty=py,susp=0,t=0,vx=0,vy=0;
const hud=H.hud(root,[['sp','SUSPEITA','0%']]);
const say=H.msg(root,'Atravesse até a saída 🚪 movendo-se COMO a multidão! Siga as setas do fluxo — andar contra a corrente levanta suspeita!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function flow(px2,py2){
 const a=Math.sin(py2*.02+t*.4)*1.2+Math.cos(px2*.015)*0.6;
 return a;
}
function gameOver(win){over=true;const sc=win?Math.max(150,450-(susp|0)*2):30;H.score(sc);
H.done(win?{win:true,score:sc,title:'🌊 Um com a multidão!',sub:'Ninguém notou você.'}:{win:false,score:sc,title:'Destacado!',sub:'Você andou contra o fluxo. Siga as setas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=120*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 let mx=0,my=0;
 if(dx||dy){mx=dx;my=dy;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>6){mx=(tx-px)/d;my=(ty-py)/d;}}
 px+=mx*sp;py+=my*sp;
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const moving=Math.abs(mx)+Math.abs(my)>0.1;
 if(moving){
  const fa=flow(px,py);
  const ma=Math.atan2(my,mx);
  let df=ma-fa;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  if(Math.abs(df)>.7)susp+=26*dt;else susp=Math.max(0,susp-14*dt);
 }else susp=Math.max(0,susp-8*dt);
 hud.set('sp',(susp|0)+'%');
 if(susp>=100){gameOver(false);return;}
 if(px>414&&py>200&&py<260){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 x.strokeStyle='rgba(46,110,138,.4)';x.lineWidth=2;
 for(let gy=30;gy<460;gy+=46)for(let gx=30;gx<460;gx+=46){
  const a=flow(gx,gy);
  x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+Math.cos(a)*14,gy+Math.sin(a)*14);x.stroke();
  x.fillStyle='rgba(46,110,138,.4)';x.beginPath();x.arc(gx+Math.cos(a)*14,gy+Math.sin(a)*14,2.5,0,7);x.fill();
 }
 x.fillStyle='#3E7C4F';x.fillRect(414,200,38,60);x.fillStyle='#fff';x.font='22px system-ui';x.textAlign='center';x.fillText('🚪',433,240);
 x.fillStyle=susp>60?'#D94E34':'#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.stroke();
 x.fillStyle='#181816';x.fillRect(10,10,200,14);
 x.fillStyle=susp>70?'#D94E34':'#E8A33D';x.fillRect(10,10,200*Math.min(1,susp/100),14);
});
}});"""

# 280 — Cofre de Ouvido
GAMES[280] = r"""/* NCODE N · 280 Cofre de Ouvido — ouça os cliques! */
GREG(280,{
init(root,H){
let over=false,dial=0,nums=[],found=0,time=90;
for(let i=0;i<3;i++)nums.push((Math.random()*40)|0);
const hud=H.hud(root,[['n','NÚMEROS','0/3'],['tp','TEMPO',90]]);
const say=H.msg(root,'Gire o disco e sinta os cliques! Perto do número, o medidor sobe e o som acelera. Trave os 3 números antes do guarda voltar!');
const o=H.cvs(root,460,360),x=o.x;
const brow=H.el('div','g-row',null,root);
H.btn(brow,'◀ −1',()=>turn(-1),false);
H.btn(brow,'−5 ◀◀',()=>turn(-5),false);
H.btn(brow,'🔒 Travar número',lock,true);
H.btn(brow,'▶▶ +5',()=>turn(5),false);
H.btn(brow,'+1 ▶',()=>turn(1),false);
function target(){return nums[found];}
function dist(){
 let d=Math.abs(dial-target());
 return Math.min(d,40-d);
}
function turn(d){
 if(over)return;
 dial=(dial+d+40)%40;H.sfx('tick');
}
function lock(){
 if(over||found>=3)return;
 if(dial===target()){found++;H.sfx('ok');hud.set('n',found+'/3');
  if(found>=3){gameOver(true);return;}
  say('✅ Número '+(found)+'/3 travado! Ache o próximo…');
 }else{time-=8;H.sfx('bad');say('❌ Não é esse! −8s. Chegue BEM perto (medidor cheio).');}
}
function gameOver(win){over=true;const sc=win?300+Math.ceil(time)*3:found*70;H.score(sc);
H.done(win?{win:true,score:sc,title:'👂 Ouvido de ouro!',sub:'Cofre aberto com '+Math.ceil(time)+'s de folga.'}:{win:false,score:sc,title:'O guarda voltou!',sub:found+'/3 números. Siga o medidor!'});}
H.loop(dt=>{
 if(over)return;
 time-=dt;
 if(time<=0){gameOver(found>=3);return;}
 hud.set('tp',Math.ceil(time));
 const d=dist(),hot=1-Math.min(1,d/8);
 x.fillStyle='#2A2620';x.fillRect(0,0,460,360);
 x.fillStyle='#4A4A44';x.beginPath();x.arc(150,160,110,0,7);x.fill();
 x.strokeStyle='#E8A33D';x.lineWidth=4;x.stroke();
 for(let i=0;i<40;i++){
  const a=i/40*6.283-Math.PI/2;
  const tx2=150+Math.cos(a)*92,ty2=160+Math.sin(a)*92;
  x.fillStyle=i%5===0?'#fff':'#8A877C';x.font=i%5===0?'bold 11px system-ui':'8px system-ui';x.textAlign='center';
  x.fillText(i,tx2,ty2+4);
 }
 const da=dial/40*6.283-Math.PI/2;
 x.strokeStyle='#D94E34';x.lineWidth=5;
 x.beginPath();x.moveTo(150,160);x.lineTo(150+Math.cos(da)*80,160+Math.sin(da)*80);x.stroke();
 x.fillStyle='#181816';x.beginPath();x.arc(150,160,14,0,7);x.fill();
 x.fillStyle='#fff';x.font='bold 26px system-ui';x.fillText(dial,150,220+70);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Números: '+found+'/3',300,80);
 x.fillText('⏱️ '+Math.ceil(time)+'s',300,105);
 x.fillText('SINAL:',300,150);
 for(let i=0;i<10;i++){
  x.fillStyle=i/10<hot?(hot>.85?'#C4D645':'#E8A33D'):'#4A4A44';
  x.fillRect(300+i*15,160,12,40);
 }
 if(hot>.85){x.fillStyle='#C4D645';x.font='bold 16px system-ui';x.fillText('🔊 CLIQUE!',300,230);}
 x.fillStyle='#8A877C';x.font='12px system-ui';
 x.fillText('Gire e observe o sinal.',300,260);
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
