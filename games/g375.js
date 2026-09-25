/* NCODE N · 375 Associação de Palavras — rápido ou fora! */
GREG(375,{
init(root,H){
const W=[
 ['Sol',['Lua','Calor','Noite','Frio'],1],
 ['Mar',['Areia','Montanha','Deserto','Cidade'],0],
 ['Cachorro',['Osso','Peixe','Cenoura','Mel'],0],
 ['Aniversário',['Festa','Luto','Prova','Fila'],0],
 ['Futebol',['Gol','Raquete','Piscina','Ringue'],0],
 ['Livro',['Leitura','Martelo','Panela','Chave'],0],
 ['Noite',['Estrela','Sol','Almoço','Praia'],0],
 ['Pizza',['Queijo','Sabão','Papel','Vidro'],0]
];
let over=false,qi=0,lives=3,score=0,time=0;
const hud=H.hud(root,[['v','VIDAS',3],['pt','PONTOS',0]]);
const say=H.msg(root,'Diga (toque) a associação antes de 4s! Lento ou errado = perde vida. 8 palavras, 3 vidas!');
const box=H.el('div','g-col',null,root);
const wd=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=8){gameOver(true);return;}
 time=4;
 const w=W[qi];
 wd.innerHTML='<span style="font-size:40px"><b>'+w[0]+'</b></span><br> 4s!';
 brow.innerHTML='';
 w[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===w[2]){score+=50+Math.ceil(time)*15;H.sfx('ok');}
   else{lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}}
   qi++;hud.set('pt',score);show();
  },false);
 });
}
H.every(500,()=>{
 if(over||qi>=8)return;
 time-=.5;
 if(time<=0){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}qi++;show();return;}
 wd.innerHTML='<span style="font-size:40px"><b>'+W[qi][0]+'</b></span><br> '+time.toFixed(1)+'s!';
});
function gameOver(win){over=true;brow.innerHTML='';H.score(score);
H.done({win:win,score,title:win?'Mente relâmpago!':'Lento demais!',sub:score+' pontos.'});}
show();
}});
