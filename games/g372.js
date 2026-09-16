/* NCODE N · 372 Debate Relâmpago — defenda o absurdo! */
GREG(372,{
init(root,H){
const T=['Pão com manteiga > pizza','Alienígenas pagam imposto','Cama é melhor que praia','Segunda-feira é ótima','Sopa é bebida','Meia com sandália é estilo'];
let over=false,round=0,score=0,time=0,side=0;
const hud=H.hud(root,[['r','DEBATE','1/4'],['pt','PONTOS',0]]);
const say=H.msg(root,'Defenda seu lado por 30s! A plateia (bots) vota. 4 debates!');
const box=H.el('div','g-col',null,root);
const tp=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=4){gameOver();return;}
 time=30;side=(Math.random()*2)|0;
 hud.set('r',(round+1)+'/4');
 tp.innerHTML='🎤 TEMA: <b>'+T[round]+'</b><br>Você defende: <b>'+(side?'✅ A FAVOR':'❌ CONTRA')+'</b><br>⏱️ 30s — DEBATA!';
 brow.innerHTML='';
 H.btn(brow,'🗳️ Encerrar e votar',()=>{
  if(over)return;
  const v=1+((Math.random()*5)|0);
  score+=v*25;H.sfx(v>=3?'ok':'bad');
  tp.innerHTML='Votos: '+'⭐'.repeat(v)+' ('+v+'/5)';
  round++;hud.set('pt',score);
  H.after(1500,()=>{if(!over)show();});
 },true);
}
H.every(1000,()=>{
 if(over||round>=4)return;
 time--;
 if(time<=0){
  const v=1+((Math.random()*5)|0);
  score+=v*25;round++;hud.set('pt',score);show();return;
 }
 tp.innerHTML='🎤 TEMA: <b>'+T[round]+'</b><br>Você defende: <b>'+(side?'✅ A FAVOR':'❌ CONTRA')+'</b><br>⏱️ '+time+'s — DEBATA!';
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=250,score,title:score>=250?'🎤 Orador supremo!':'🎤 Fim!',sub:score+' pontos.'});}
show();
}});
