/* NCODE N · 363 Quiz Relâmpago — mais rápido que os bots! */
GREG(363,{
init(root,H){
const Q=[
 ['Capital do Brasil?',['Rio','Brasília','Salvador','Manaus'],1],
 ['2 + 2 × 2 = ?',['6','8','4','10'],0],
 ['Maior planeta?',['Terra','Marte','Júpiter','Saturno'],2],
 ['Cor do céu de dia?',['Verde','Azul','Roxo','Cinza'],1],
 ['Quantos dias tem um ano bissexto?',['365','364','366','367'],2],
 ['Animal que late?',['Gato','Cachorro','Vaca','Pato'],1],
 ['H2O é…?',['Oxigênio','Água','Sal','Açúcar'],1],
 ['Continente do Egito?',['Ásia','Europa','África','Oceania'],2]
];
let over=false,qi=0,score=0,bot=0,t=0,answered=false;
const hud=H.hud(root,[['q','PERGUNTA','1/8'],['vc','VOCÊ',0],['bt','BOTS',0]]);
const say=H.msg(root,'Responda antes dos 3 bots! Rápido = mais pontos. 8 perguntas!');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let botT=0;
function show(){
 if(qi>=8){gameOver();return;}
 answered=false;t=0;botT=2+Math.random()*4;
 hud.set('q',(qi+1)+'/8');
 const q=Q[qi];
 qz.innerHTML='<b>'+q[0]+'</b>';
 brow.innerHTML='';
 q[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over||answered)return;
   answered=true;
   if(i===q[2]){const p=Math.max(10,100-(t*12|0));score+=p;H.sfx('ok');say('✅ +'+p+'!');}
   else{H.sfx('bad');say('❌ Era: '+q[1][q[2]]);}
   qi++;hud.set('vc',score);
   H.after(900,()=>{if(!over)show();});
  },false);
 });
}
H.every(100,()=>{
 if(over||answered||qi>=8)return;
 t+=.1;
 if(t>=botT){
  answered=true;
  if(Math.random()<.65){bot+=60;H.sfx('bad');say('🤖 Bot respondeu primeiro! +60 para eles.');}
  else{say('🤖 Bots erraram! Responda!');answered=false;botT=t+3;return;}
  qi++;hud.set('bt',bot);
  H.after(900,()=>{if(!over)show();});
 }
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>bot,score,title:score>bot?'⚡ Mais rápido!':'⚡ Bots venceram!',sub:'Você '+score+' × '+bot+' bots.'});}
show();
}});
