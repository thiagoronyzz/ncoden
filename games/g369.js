/* NCODE N · 369 Efeito Sonoro — faça o som! */
GREG(369,{
init(root,H){
const SC=['Porta rangendo','Trovão','Gato miando','Carro velho','Bebê chorando','Onda quebrando','Fogueira','Trem chegando'];
let over=false,round=0,score=0,time=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Faça o efeito sonoro com a voz! O grupo (bots) vota. 6 rodadas, 10s cada!');
const box=H.el('div','g-col',null,root);
const sc=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const scenes=SC.slice().sort(()=>Math.random()-.5).slice(0,6);
function show(){
 if(round>=6){gameOver();return;}
 time=10;
 hud.set('r',(round+1)+'/6');
 sc.innerHTML='FAÇA O SOM DE:<br><span style="font-size:34px"><b>'+scenes[round]+'</b></span><br> 10s';
 brow.innerHTML='';
 H.btn(brow,'FEITO! (votação)',()=>{
  if(over)return;
  const v=1+((Math.random()*5)|0);
  score+=v*20;H.sfx(v>=3?'ok':'bad');
  sc.innerHTML=scenes[round]+'<br>Votos: '+'★'.repeat(v)+' ('+v+'/5)';
  round++;hud.set('pt',score);
  H.after(1500,()=>{if(!over)show();});
 },true);
}
H.every(1000,()=>{
 if(over||round>=6)return;
 time--;
 if(time<=0){round++;H.sfx('bad');show();return;}
 sc.innerHTML='FAÇA O SOM DE:<br><span style="font-size:34px"><b>'+scenes[round]+'</b></span><br> '+time+'s';
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'Artista de som!':'Fim!',sub:score+' pontos.'});}
show();
}});
