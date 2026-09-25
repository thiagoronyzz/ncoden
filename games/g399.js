/* NCODE N · 399 Corte do Pavio — no comprimento exato! */
GREG(399,{
init(root,H){
let over=false,burn=0,round=0,score=0,sp=0;
const MARK=70;
const hud=H.hud(root,[['p','PAVIO','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'O pavio queima! CORTE quando o fogo chegar BEM na marca verde. 5 pavios!');
const o=H.cvs(root,560,260),x=o.x;
H.btn(root,'CORTAR!',()=>{
 if(over)return;
 const err=Math.abs(burn-MARK);
 if(err<4){score+=100;H.sfx('ok');say('Exato! +100');}
 else if(err<10){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say('✕ Errou!');}
 hud.set('pt',score);round++;
 if(round>=5){gameOver();return;}
 hud.set('p',(round+1)+'/5');burn=0;sp=26+Math.random()*22;
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'Mestre artífice!':'Fim!',sub:score+'/500 pontos.'});}
sp=30;
H.loop(dt=>{
 if(over)return;
 burn+=sp*dt;
 if(burn>=100){H.sfx('bad');say('Queimou tudo!');round++;hud.set('pt',score);if(round>=5){gameOver();return;}hud.set('p',(round+1)+'/5');burn=0;sp=26+Math.random()*22;return;}
 x.fillStyle='#2A2A33';x.fillRect(0,0,560,260);
 x.fillStyle='#8A6A2F';x.fillRect(40,110,480,14);
 x.fillStyle='#D94E34';x.fillRect(40,110,480*Math.min(1,burn/100),14);
 const fx=40+480*Math.min(1,burn/100);
 x.font='26px system-ui';x.textAlign='center';x.fillText('i:flame',fx,118);
 x.strokeStyle='#3E7C4F';x.lineWidth=4;
 const mx=40+480*MARK/100;
 x.beginPath();x.moveTo(mx,90);x.lineTo(mx,150);x.stroke();
 x.font='40px system-ui';x.fillText('i:candy',520,140);
});
}});
