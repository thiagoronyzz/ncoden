/* NCODE N · 379 Telefone Sem Fio — sussurre certo! */
GREG(379,{
init(root,H){
const CHAIN=[
 ['O gato subiu no telhado',['O gato subiu no telhado','O pato fugiu no feriado','O rato sumiu no sapato'],0],
 ['Três tigres tristes',['Três tigres tristes','Três pratos quentes','Dois tigres listrados'],0],
 ['A aranha arranha a jarra',['A aranha arranha a jarra','A abelha beija a flor','A arara amarra a vara'],0],
 ['Pão, queijo e presunto',['Pão, queijo e presunto','Cão, peixe e peru','Mão, queixo e ombro'],0],
 ['Meu vizinho tem um sino',['Meu vizinho tem um sino','Meu sobrinho viu um cisne','Meu caminho tem espinhos'],0]
];
let over=false,round=0,score=0;
const hud=H.hud(root,[['r','CORRENTE','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Memorize a frase e escolha o que saiu no fim da corrente! A frase se deforma… 5 correntes!');
const box=H.el('div','g-col',null,root);
const ph=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=5){gameOver();return;}
 const c=CHAIN[round];
 hud.set('r',(round+1)+'/5');
 ph.innerHTML='FRASE ORIGINAL:<br><b>"'+c[0]+'"</b><br>Memorize e toque PRONTO!';
 brow.innerHTML='';
 H.btn(brow,'PRONTO! (ver fim)',()=>{
  if(over)return;
  ph.innerHTML='O que chegou no fim?';
  brow.innerHTML='';
  const opts=c[1].slice().sort(()=>Math.random()-.5);
  opts.forEach(o=>{
   H.btn(brow,'"'+o+'"',()=>{
    if(over)return;
    if(o===c[0]){score+=100;H.sfx('ok');}
    else{H.sfx('bad');say('✕ Era: "'+c[0]+'"');}
    round++;hud.set('pt',score);show();
   },false);
  });
 },true);
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'Linha clara!':'Chiado!',sub:score+'/500 pontos.'});}
show();
}});
