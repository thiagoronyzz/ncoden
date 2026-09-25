/* NCODE N · 265 Roubo de Chaves — furte sem acordar! */
GREG(265,{
init(root,H){
let over=false,lives=3,keys=0,time=120,t=0;
const GD=[
 {x:90,y:170,pr:0,ph:0,st:'sleep',stT:0},
 {x:230,y:170,pr:0,ph:2.5,st:'sleep',stT:0},
 {x:370,y:170,pr:0,ph:5,st:'sleep',stT:0}
];
const hud=H.hud(root,[['v','VIDAS',3],['k','CHAVES','0/3'],['tp','TEMPO',120]]);
const say=H.msg(root,'Toque no guarda para furtar a chave! Quando aparecer !ele vai se mexer — NÃO toque durante o ★ movimento!');
const o=H.cvs(root,460,360),x=o.x;
function status(){hud.set('v',lives);hud.set('k',keys+'/3');hud.set('tp',Math.ceil(time));}
function gameOver(win){over=true;const sc=win?300+lives*80+Math.ceil(time)*2:keys*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'Ladrão silencioso!',sub:'3 chaves furtadas.'}:{win:false,score:sc,title:'Acordaram!',sub:keys+'/3 chaves. Espere o sono profundo!'});}
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
 x.fillText('Dormitório dos guardas ',230,34);
 GD.forEach(g=>{
  const sh=g.st==='stir'?Math.sin(t*30)*3:0;
  x.fillStyle=g.done?'#3E7C4F':'#2E6E8A';
  x.beginPath();x.arc(g.x+sh,g.y,40,0,7);x.fill();
  x.strokeStyle='#000';x.lineWidth=2;x.stroke();
  x.font='30px system-ui';
  x.fillText(g.done?'i:key':g.st==='sleep'?'i:sleep':g.st==='warn'?'!':'★',g.x+sh,g.y+11);
  x.fillStyle='#000';x.fillRect(g.x-40,g.y+50,80,10);
  x.fillStyle='#E8A33D';x.fillRect(g.x-40,g.y+50,80*Math.min(1,g.pr/100),10);
  if(!g.done){x.fillStyle='#fff';x.font='11px system-ui';x.fillText(g.st==='sleep'?'sono profundo…':g.st==='warn'?'vai se mexer!':'QUIETO!',g.x,g.y+74);}
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('i:gauge'+Math.ceil(time)+'s '+keys+'/3 ♥ '+lives,14,344);
});
status();
}});
