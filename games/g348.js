/* NCODE N · 348 Observador de Aves — identifique! */
GREG(348,{
init(root,H){
const BIRDS=[['🐦','pardal'],['🦜','papagaio'],['🦅','águia'],['🦉','coruja'],['🦩','flamingo'],['🐧','pinguim']];
let over=false,round=0,score=0,t=0,cur=0,opts=[];
const hud=H.hud(root,[['r','AVE','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Uma ave aparece — identifique a espécie! 8 aves, tempo por ave. Rápido = mais pontos!');
const box=H.el('div','g-col',null,root);
const bd=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let timer=0;
function show(){
 if(round>=8){gameOver(true);return;}
 cur=(Math.random()*BIRDS.length)|0;
 opts=[cur];
 while(opts.length<3){const i=(Math.random()*BIRDS.length)|0;if(!opts.includes(i))opts.push(i);}
 opts.sort(()=>Math.random()-.5);
 timer=10;
 bd.innerHTML='<span style="font-size:64px">'+BIRDS[cur][0]+'</span><br>Que ave é essa? ('+Math.ceil(timer)+'s)';
 brow.innerHTML='';
 opts.forEach(i=>{
  H.btn(brow,BIRDS[i][1],()=>{
   if(over)return;
   if(i===cur){score+=50+Math.ceil(timer)*10;H.sfx('ok');}
   else{score=Math.max(0,score-30);H.sfx('bad');}
   round++;hud.set('r',Math.min(8,round+1)+'/8');hud.set('pt',score);
   show();
  },false);
 });
 hud.set('r',(round+1)+'/8');
}
H.every(1000,()=>{
 if(over)return;
 timer--;
 if(timer<=0){round++;score=Math.max(0,score-20);hud.set('pt',score);show();return;}
 bd.innerHTML='<span style="font-size:64px">'+BIRDS[cur][0]+'</span><br>Que ave é essa? ('+Math.ceil(timer)+'s)';
});
function gameOver(win){over=true;H.score(score);
H.done({win:score>=400,score,title:score>=400?'🔭 Ornitólogo!':'🔭 Fim da observação!',sub:score+' pontos em 8 aves.'});}
show();
}});
