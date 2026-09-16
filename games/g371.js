/* NCODE N · 371 Detector de Mentiras — ele sabe! */
GREG(371,{
init(root,H){
const Q=['Já fingiu estar doente?','Já comeu algo do chão?','Já mentiu neste jogo?','Tem medo do escuro?','Já quebrou algo escondido?','Canta no banho?'];
let over=false,qi=0,truth=0,needle=0,phase='ask',t=0;
const hud=H.hud(root,[['p','PERGUNTA','1/6'],['v','VERDADES',0]]);
const say=H.msg(root,'Responda SIM ou NÃO e veja o detector (totalmente científico 😏). 6 perguntas!');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const o=H.cvs(root,460,140),x=o.x;
function show(){
 if(qi>=6){gameOver();return;}
 phase='ask';
 hud.set('p',(qi+1)+'/6');
 qz.innerHTML='<b>'+Q[qi]+'</b>';
 brow.innerHTML='';
 H.btn(brow,'✅ SIM',()=>answer(true),true);
 H.btn(brow,'❌ NÃO',()=>answer(false),false);
}
function answer(v){
 if(over||phase!=='ask')return;
 phase='scan';t=0;
 const verdict=Math.random()<.7;
 H.after(1800,()=>{
  if(over)return;
  if(verdict){truth++;hud.set('v',truth);qz.innerHTML='💚 VERDADE! O detector aprova.';H.sfx('ok');}
  else{qz.innerHTML='❤️‍🔥 MENTIRA! O detector apitou!';H.sfx('bad');}
  qi++;
  H.after(1400,()=>{if(!over)show();});
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(truth*100);
H.done({win:truth>=4,score:truth*100,title:truth>=4?'💚 Quase santo!':'❤️‍🔥 Pegou no pulo!',sub:truth+'/6 verdades.'});}
H.loop(dt=>{
 if(phase==='scan')needle=Math.sin(t*20)*80+t*10;
 else needle*=.9;
 t+=dt;
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,140);
 x.fillStyle='#3E7C4F';x.fillRect(30,60,140,30);
 x.fillStyle='#E8A33D';x.fillRect(170,60,120,30);
 x.fillStyle='#D94E34';x.fillRect(290,60,140,30);
 x.strokeStyle='#fff';x.lineWidth=4;
 x.beginPath();x.moveTo(230,120);x.lineTo(230+needle,65);x.stroke();
 x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='center';
 x.fillText(phase==='scan'?'ANALISANDO…':'DETECTOR DE MENTIRAS 3000',230,135);
});
show();
}});
