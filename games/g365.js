/* NCODE N · 365 Você Preferiria — com a maioria! */
GREG(365,{
init(root,H){
const D=[
 ['Voar','Ficar invisível'],['Pizza todo dia','Sorvete todo dia'],
 ['Viajar ao passado','Viajar ao futuro'],['Falar com animais','Falar 10 línguas'],
 ['Ser rico','Ser famoso'],['Praia','Montanha'],['Livro','Filme'],['Dia','Noite']
];
let over=false,round=0,score=0;
const hud=H.hud(root,[['r','DILEMA','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Vote com a maioria do grupo (bots)! Acertar o lado popular = pontos. 8 dilemas!');
const box=H.el('div','g-col',null,root);
const dm=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=8){gameOver();return;}
 const d=D[round];
 hud.set('r',(round+1)+'/8');
 dm.innerHTML='<b>Você preferiria…</b>';
 brow.innerHTML='';
 d.forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   const votes=[0,0];
   for(let b=0;b<5;b++)votes[Math.random()<.55?0:1]++;
   votes[i]++;
   const maj=votes[0]===votes[1]?-1:(votes[0]>votes[1]?0:1);
   if(maj===i){score+=100;H.sfx('ok');}
   else H.sfx('bad');
   dm.innerHTML='<b>'+d[0]+'</b> '+votes[0]+' × '+votes[1]+' <b>'+d[1]+'</b><br>'+(maj===i?'✅ Com a maioria! +100':'❌ Minoria…');
   round++;hud.set('pt',score);
   H.after(1400,()=>{if(!over)show();});
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=500,score,title:score>=500?'🗳️ Voz do povo!':'🗳️ Fim!',sub:score+'/800 pontos.'});}
show();
}});
