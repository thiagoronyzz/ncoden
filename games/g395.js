/* NCODE N · 395 Ovo na Almofada — solte na hora! */
GREG(395,{
init(root,H){
let over=false,egg=null,px=200,dir=1,round=0,score=0,t=0;
const hud=H.hud(root,[['o','OVO','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A almofada vai e vem! SOLTE o ovo para cair nela. 5 ovos, 3+ salvos!');
const o=H.cvs(root,460,420),x=o.x;
H.btn(root,'🥚 SOLTAR OVO!',()=>{
 if(over||egg)return;
 egg={x:230,y:60,vy:0};H.sfx('tick');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🥚 Café salvo!':'🥚 Omelete!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 px+=dir*(140+round*30)*dt;
 if(px<70){px=70;dir=1;}if(px>390){px=390;dir=-1;}
 if(egg){
  egg.vy+=800*dt;egg.y+=egg.vy*dt;
  if(egg.y>=340){
   const err=Math.abs(egg.x-px);
   if(err<44){score+=100;H.sfx('ok');say('✅ Salvo! +100');}
   else{H.sfx('bad');say('💥 Quebrou!');}
   hud.set('pt',score);round++;egg=null;
   if(round>=5){gameOver();return;}
   hud.set('o',(round+1)+'/5');
  }
 }
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,420);
 x.strokeStyle='#181816';x.lineWidth=3;
 x.beginPath();x.moveTo(230,0);x.lineTo(230,40);x.stroke();
 if(!egg&&round<5){x.font='28px system-ui';x.textAlign='center';x.fillText('🥚',230,62);}
 if(egg){x.font='28px system-ui';x.fillText('🥚',egg.x,egg.y);}
 x.fillStyle='#D94E34';x.fillRect(px-44,340,88,26);
 x.fillStyle='#B23A24';x.fillRect(px-44,340,88,8);
});
}});
