/* NCODE N · 390 Foto do Pássaro — clique no pouso! */
GREG(390,{
init(root,H){
let over=false,bx=-40,state='fly',sitT=0,t=0,round=0,score=0;
const hud=H.hud(root,[['c','CHANCE','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'O pássaro voa e POUSA por 1,2s! Toque FOTOGRAFAR bem no pouso. 8 chances, 5+ fotos!');
const o=H.cvs(root,560,340),x=o.x;
H.btn(root,'FOTOGRAFAR!',()=>{
 if(over)return;
 if(state==='sit'){score+=100;H.sfx('ok');say('Linda foto! +100');}
 else{H.sfx('bad');say('✕ Borrada… (ele estava voando)');}
 round++;hud.set('pt',score);hud.set('c',Math.min(8,round+1)+'/8');
 if(round>=8){gameOver();return;}
 bx=-40;state='fly';
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=500,score,title:score>=500?'Vida selvagem!':'Fim!',sub:score+'/800 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(state==='fly'){
  bx+=220*dt;
  if(bx>280){state='sit';sitT=1.2;}
  if(bx>620){bx=-40;}
 }else{
  sitT-=dt;
  if(sitT<=0){state='fly';bx=320;}
 }
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,340);
 x.fillStyle='#5A4A33';x.fillRect(250,260,60,80);
 x.fillStyle='#3E7C4F';x.beginPath();x.ellipse(280,240,90,40,0,0,7);x.fill();
 const by=state==='sit'?225:140+Math.sin(t*6)*20;
 x.font='34px system-ui';x.textAlign='center';x.fillText(state==='sit'?'i:bird':'i:bird',bx,by);
 if(state==='sit'){x.fillStyle='#C4D645';x.font='bold 18px system-ui';x.fillText('POUSOU! ',280,60);}
});
}});
