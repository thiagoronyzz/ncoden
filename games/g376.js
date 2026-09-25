/* NCODE N · 376 Desafio de Sotaques — qual é qual? */
GREG(376,{
init(root,H){
const P=[
 ['O rato roeu a roupa do rei.','caipira'],
 ['Batatinha quando nasce.','carioca'],
 ['Ô trem bão, sô!','mineiro'],
 ['Meu irmão, que massa!','baiano'],
 ['Bah, que tri legal!','gaúcho'],
 ['Menino, tu é doido é?','nordestino']
];
let over=false,round=0,score=0,time=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Leia a frase no sotaque sorteado! O grupo adivinha qual é. 6 rodadas!');
const box=H.el('div','g-col',null,root);
const ph=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=6){gameOver();return;}
 time=15;
 hud.set('r',(round+1)+'/6');
 const p=P[round];
 ph.innerHTML='Leia com sotaque <b>'+p[1].toUpperCase()+'</b>:<br>"<i>'+p[0]+'</i>"<br> 15s';
 brow.innerHTML='';
 H.btn(brow,'✔ Adivinharam o sotaque!',()=>{score+=100;round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'✕ Erraram',()=>{round++;H.sfx('bad');show();},false);
}
H.every(1000,()=>{
 if(over||round>=6)return;
 time--;
 if(time<=0){round++;show();return;}
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=400,score,title:score>=400?'Poliglota!':'Fim!',sub:score+'/600 pontos.'});}
show();
}});
