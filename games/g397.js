/* NCODE N · 397 Moeda no Ar — pegue no pico! */
GREG(397,{
init(root,H){
let over=false,cy=0,vy=0,up=true,round=0,score=0,t=0;
const TOP=120,BOT=340;
const hud=H.hud(root,[['m','MOEDA','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'PEGUE a moeda BEM no topo do arco! 8 lançamentos, 5+ pegas!');
const o=H.cvs(root,400,420),x=o.x;
H.btn(root,'🖐️ PEGAR!',()=>{
 if(over)return;
 const err=Math.abs(cy-TOP);
 if(err<22){score+=100;H.sfx('ok');say('🪙 Pega! +100');}
 else{H.sfx('bad');say(err>0&&cy>TOP?'❌ Tarde demais!':'❌ Cedo demais!');}
 round++;hud.set('pt',score);
 if(round>=8){gameOver();return;}
 hud.set('m',(round+1)+'/8');
 cy=BOT;vy=-(300+Math.random()*120);
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=500,score,title:score>=500?'🪙 Mão de ouro!':'🪙 Fim!',sub:score+'/800 pontos.'});}
cy=BOT;vy=-360;
H.loop(dt=>{
 if(over)return;
 vy+=900*dt;cy+=vy*dt;
 if(cy>=BOT){cy=BOT;vy=-(300+Math.random()*140);}
 x.fillStyle='#1C1C24';x.fillRect(0,0,400,420);
 x.strokeStyle='#C4D645';x.lineWidth=2;x.setLineDash([5,5]);
 x.beginPath();x.moveTo(60,TOP);x.lineTo(340,TOP);x.stroke();x.setLineDash([]);
 x.fillStyle='#C4D645';x.font='bold 12px system-ui';x.textAlign='left';
 x.fillText('PICO',62,TOP-8);
 x.fillStyle='#E8A33D';x.beginPath();x.arc(200,cy,22,0,7);x.fill();
 x.strokeStyle='#8A6A2F';x.lineWidth=3;x.stroke();
 x.fillStyle='#8A6A2F';x.font='bold 20px system-ui';x.textAlign='center';
 x.fillText('$',200,cy+7);
});
}});
