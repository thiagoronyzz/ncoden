/* NCODE N · 386 Fatiada na Linha — corte certo! */
GREG(386,{
init(root,H){
let over=false,fx=0,sp=0,fruit=0,score=0,cut=null,round=0;
const FR=['','','','',''];
const hud=H.hud(root,[['f','FRUTA','1/10'],['pt','PONTOS',0]]);
const say=H.msg(root,'Toque FATIAR quando a fruta cruzar a LINHA! Centro = 100, perto = 50. 10 frutas!');
const o=H.cvs(root,560,300),x=o.x;
H.btn(root,'FATIAR!',()=>{
 if(over||cut)return;
 cut=fx;
 const err=Math.abs(fx-280);
 if(err<18){score+=100;H.sfx('ok');}
 else if(err<50){score+=50;H.sfx('tick');}
 else H.sfx('bad');
 hud.set('pt',score);
},true);
function newFruit(){
 fruit=(Math.random()*FR.length)|0;
 fx=-40;sp=260+Math.random()*260;cut=null;round++;
 hud.set('f',Math.min(10,round)+'/10');
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=700,score,title:score>=700?'Mestre sushi!':'Fim!',sub:score+'/1000 pontos.'});}
newFruit();
H.loop(dt=>{
 if(over)return;
 fx+=sp*dt;
 if(fx>620){
  if(round>=10){gameOver();return;}
  newFruit();return;
 }
 x.fillStyle=H.C.paper;x.fillRect(0,0,560,300);
 x.strokeStyle='#D94E34';x.lineWidth=4;
 x.beginPath();x.moveTo(280,20);x.lineTo(280,280);x.stroke();
 x.strokeStyle='#C4D645';x.lineWidth=2;
 x.beginPath();x.moveTo(262,20);x.lineTo(262,280);x.moveTo(298,20);x.lineTo(298,280);x.stroke();
 x.font='44px system-ui';x.textAlign='center';
 if(cut!=null){
  x.fillText('i:pot',cut,150);
  x.fillText('i:burst',cut,200);
 }else x.fillText(FR[fruit],fx,160);
});
}});
