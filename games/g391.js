/* NCODE N · 391 Raio na Garrafa — capture a descarga! */
GREG(391,{
init(root,H){
let over=false,t=0,flash=0,next=2,round=0,score=0,capw=0;
const hud=H.hud(root,[['t','TEMPESTADE','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Quando o RAIO riscar o céu, toque CAPTURAR em 0,4s! 8 tempestades, 5+ capturas!');
const o=H.cvs(root,480,360),x=o.x;
H.btn(root,'⚡ CAPTURAR!',()=>{
 if(over)return;
 if(capw>0){score+=100;H.sfx('ok');say('⚡ Capturado! +100');capw=0;flash=0;round++;hud.set('pt',score);hud.set('t',Math.min(8,round+1)+'/8');}
 else{H.sfx('bad');say('❌ Sem raio! Espere o clarão.');}
 if(round>=8)gameOver();
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=500,score,title:score>=500?'⚡ Caçador de raios!':'⚡ Fim!',sub:score+'/800 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(flash>0){flash-=dt;capw-=dt;
  if(flash<=0){H.sfx('bad');say('🌩️ O raio escapou!');round++;hud.set('t',Math.min(8,round+1)+'/8');if(round>=8){gameOver();return;}}
 }
 else{
  next-=dt;
  if(next<=0){flash=.5;capw=.4;next=1.5+Math.random()*3;H.sfx('bad');}
 }
 x.fillStyle=flash>0?'#E8E8F0':'#23232B';x.fillRect(0,0,480,360);
 x.fillStyle='#3A3A45';x.fillRect(0,300,480,60);
 if(flash>0){
  x.strokeStyle='#E8A33D';x.lineWidth=5;
  x.beginPath();x.moveTo(240,0);x.lineTo(200,100);x.lineTo(250,100);x.lineTo(190,220);x.lineTo(230,220);x.lineTo(180,320);x.stroke();
  x.fillStyle='#181816';x.font='bold 24px system-ui';x.textAlign='center';x.fillText('⚡ AGORA!',240,60);
 }
 x.fillStyle=flash>0?'#181816':'#fff';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Tempestade '+(round+1)+'/8 · '+score+' pts',12,28);
});
}});
