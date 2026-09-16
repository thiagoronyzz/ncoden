/* NCODE N · 286 Skate Park — 90s de manobras! */
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
}});
