/* NCODE N · 366 Cadeira Quente — responda rápido! */
GREG(366,{
init(root,H){
const Q=['Cor favorita?','Comida que odeia?','Sonho de viagem?','Medo bobo?','Talento secreto?','Filme favorito?','Time do coração?','Animal preferido?','Música viciante?','Lugar feliz?'];
let over=false,qi=0,streak=0,best=0,time=0;
const hud=H.hud(root,[['p','PERGUNTA','1/10'],['sq','SEQUÊNCIA',0]]);
const say=H.msg(root,'Responda em voz alta e toque RESPONDI antes de 5s! Atrasou = perde a sequência. 10 perguntas!');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=10){gameOver();return;}
 time=5;
 hud.set('p',(qi+1)+'/10');
 qz.innerHTML='<span style="font-size:30px"><b>'+Q[qi]+'</b></span><br>⏱️ 5s!';
 brow.innerHTML='';
 H.btn(brow,'🔥 RESPONDI!',()=>{
  if(over)return;
  streak++;best=Math.max(best,streak);H.sfx('ok');
  hud.set('sq',streak);qi++;show();
 },true);
}
H.every(1000,()=>{
 if(over||qi>=10)return;
 time--;
 if(time<=0){streak=0;H.sfx('bad');hud.set('sq',0);qi++;say('⏰ Lento! Sequência zerada.');show();return;}
 qz.innerHTML='<span style="font-size:30px"><b>'+Q[qi]+'</b></span><br>⏱️ '+time+'s!';
});
function gameOver(){over=true;brow.innerHTML='';H.score(best*50);
H.done({win:best>=7,score:best*50,title:best>=7?'🔥 Imparável!':'🔥 Fim!',sub:'Melhor sequência: '+best+'/10.'});}
show();
}});
