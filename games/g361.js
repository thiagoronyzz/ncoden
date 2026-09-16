/* NCODE N · 361 Mímica — atue e adivinhe! */
GREG(361,{
init(root,H){
const WORDS=['elefante','avião','dentista','sereia','vulcão','robô','pirata','bailarina','terremoto','churrasco','fantasma','malabarista'];
let over=false,round=0,score=0,time=0,phase='act';
const hud=H.hud(root,[['r','RODADA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Atue a palavra para seu time! Quando adivinharem (ou o tempo acabar), marque o resultado. 5 rodadas!');
const box=H.el('div','g-col',null,root);
const wd=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const words=WORDS.slice().sort(()=>Math.random()-.5).slice(0,5);
function show(){
 if(round>=5){gameOver();return;}
 phase='act';time=60;
 hud.set('r',(round+1)+'/5');
 wd.innerHTML='🎭 ATUE:<br><span style="font-size:42px"><b>'+words[round]+'</b></span><br>⏱️ <span id="t">60</span>s';
 brow.innerHTML='';
 H.btn(brow,'✅ Adivinharam!',()=>{score+=100+Math.ceil(time);round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'⏭️ Pular (−20)',()=>{score=Math.max(0,score-20);round++;H.sfx('bad');hud.set('pt',score);show();},false);
}
H.every(1000,()=>{
 if(over||phase!=='act')return;
 time--;
 wd.innerHTML='🎭 ATUE:<br><span style="font-size:42px"><b>'+words[round]+'</b></span><br>⏱️ '+Math.ceil(time)+'s';
 if(time<=0){round++;show();}
});
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎭 Show de mímica!':'🎭 Fim do jogo!',sub:score+' pontos em 5 rodadas.'});}
show();
}});
