/* NCODE N · 370 Jogo de Imitações — imite o famoso! */
GREG(370,{
init(root,H){
const F=['🤖 Robô dançando','🐵 Macaco','👶 Bebê bravo','🧙 Mago','🦁 Leão','🐔 Galinha','🧛 Vampiro','👽 ET'];
let over=false,round=0,score=0,time=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Imite com corpo e voz! O grupo vota. 6 rodadas!');
const box=H.el('div','g-col',null,root);
const fc=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const picks=F.slice().sort(()=>Math.random()-.5).slice(0,6);
function show(){
 if(round>=6){gameOver();return;}
 time=15;
 hud.set('r',(round+1)+'/6');
 fc.innerHTML='🎭 IMITE:<br><span style="font-size:34px"><b>'+picks[round]+'</b></span><br>⏱️ 15s';
 brow.innerHTML='';
 H.btn(brow,'✅ Adivinharam!',()=>{score+=100+time*5;round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'❌ Ninguém acertou',()=>{round++;H.sfx('bad');show();},false);
}
H.every(1000,()=>{
 if(over||round>=6)return;
 time--;
 if(time<=0){round++;show();return;}
 fc.innerHTML='🎭 IMITE:<br><span style="font-size:34px"><b>'+picks[round]+'</b></span><br>⏱️ '+time+'s';
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎭 Imitador nato!':'🎭 Fim!',sub:score+' pontos.'});}
show();
}});
