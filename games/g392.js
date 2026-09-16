/* NCODE N · 392 Metrônomo no Centro — pare no meio! */
GREG(392,{
init(root,H){
let over=false,a=0,t=0,sp=2,round=0,score=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Pare o pêndulo BEM no centro (linha verde)! A cada tentativa ele acelera. 5 tentativas!');
const o=H.cvs(root,400,380),x=o.x;
H.btn(root,'🛑 PARAR!',()=>{
 if(over)return;
 const err=Math.abs(a);
 if(err<.08){score+=100;H.sfx('ok');say('🎯 Centro! +100');}
 else if(err<.2){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say('❌ Longe!');}
 hud.set('pt',score);round++;sp+=.5;
 if(round>=5){gameOver();return;}
 hud.set('t',(round+1)+'/5');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'🎼 Maestro!':'🎼 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 a=Math.sin(t*sp*2)*1.1;
 x.fillStyle=H.C.paper;x.fillRect(0,0,400,380);
 x.strokeStyle='#3E7C4F';x.lineWidth=4;
 x.beginPath();x.moveTo(200,60);x.lineTo(200,320);x.stroke();
 const px=200+Math.sin(a)*200,py=90+Math.cos(a)*200;
 x.strokeStyle='#181816';x.lineWidth=6;
 x.beginPath();x.moveTo(200,90);x.lineTo(px,py);x.stroke();
 x.fillStyle='#D94E34';x.beginPath();x.arc(px,py,18,0,7);x.fill();
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Velocidade x'+sp.toFixed(1),12,28);
});
}});
