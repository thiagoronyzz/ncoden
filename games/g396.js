/* NCODE N · 396 Flecha na Flecha — rache ao meio! */
GREG(396,{
init(root,H){
let over=false,aim=0,t=0,round=0,score=0,sp=2.2;
const hud=H.hud(root,[['f','FLECHA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A mira oscila! SOLTE quando o ponto estiver BEM no centro da flecha cravada. 5 tiros!');
const o=H.cvs(root,400,400),x=o.x;
H.btn(root,'🏹 SOLTAR!',()=>{
 if(over)return;
 const err=Math.abs(aim);
 if(err<.1){score+=100;H.sfx('ok');say('🎯 RACHOU! +100');}
 else if(err<.25){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say('❌ Errou!');}
 hud.set('pt',score);round++;sp+=.4;
 if(round>=5){gameOver();return;}
 hud.set('f',(round+1)+'/5');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'🏹 Arqueiro lendário!':'🏹 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 aim=Math.sin(t*sp)*1.2;
 x.fillStyle='#7CB56B';x.fillRect(0,0,400,400);
 x.fillStyle='#EDE8DC';x.beginPath();x.arc(200,190,80,0,7);x.fill();
 x.fillStyle='#D94E34';x.beginPath();x.arc(200,190,40,0,7);x.fill();
 x.fillStyle='#E8A33D';x.beginPath();x.arc(200,190,14,0,7);x.fill();
 x.strokeStyle='#5A4A33';x.lineWidth=6;
 x.beginPath();x.moveTo(200,190);x.lineTo(200,110);x.stroke();
 x.fillStyle='#C4D645';x.beginPath();x.arc(200,104,8,0,7);x.fill();
 const ax=200+aim*120;
 x.strokeStyle='#181816';x.lineWidth=2;
 x.beginPath();x.moveTo(ax-14,300);x.lineTo(ax+14,300);x.moveTo(ax,286);x.lineTo(ax,314);x.stroke();
 x.fillStyle='#181816';x.beginPath();x.arc(ax,300,5,0,7);x.fill();
 x.strokeStyle='#3E7C4F';x.lineWidth=3;
 x.beginPath();x.moveTo(200,280);x.lineTo(200,320);x.stroke();
});
}});
