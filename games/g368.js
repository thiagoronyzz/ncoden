/* NCODE N · 368 Emoji Decifrador — que filme é esse? */
GREG(368,{
init(root,H){
const M=[
 ['','Rei Leão',['Rei Leão','Madagascar','Tarzan','Mogli'],0],
 ['♥','Titanic',['Titanic','Náufrago','Piratas','Aquaman'],0],
 ['','Homem-Aranha',['Batman','Homem-Aranha','Super-Homem','Flash'],1],
 ['','Frozen',['Moana','Frozen','Era do Gelo','Atlantis'],1],
 ['','Jurassic Park',['Kong','Jurassic Park','Godzilla','Jumanji'],1],
 ['♥','WALL-E',['Robocop','Star Wars','WALL-E','Avatar'],2],
 ['','Up',['Up','Divertida Mente','Forrest Gump','Gigante'],0],
 ['','Caça-Fantasmas',['It','Caça-Fantasmas','Invocação','Hotel'],1]
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[['f','FILME','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Adivinhe o filme pelos emojis! 8 filmes.');
const box=H.el('div','g-col',null,root);
const em=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=8){gameOver();return;}
 const m=M[qi];
 hud.set('f',(qi+1)+'/8');
 em.innerHTML='<span style="font-size:52px">'+m[0]+'</span>';
 brow.innerHTML='';
 m[2].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===m[3]){score+=100;H.sfx('ok');}
   else{H.sfx('bad');say('✕ Era: '+m[1]);}
   qi++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=600,score,title:score>=600?'Cinéfilo!':'Fim!',sub:score+'/800 pontos.'});}
show();
}});
