/* NCODE N · 345 Ruínas na Selva — abra as 3 portas! */
GREG(345,{
init(root,H){
let over=false,door=0;
const hud=H.hud(root,[['p','PORTA','1/3']]);
const say=H.msg(root,'3 portas, 3 enigmas! Passe por todas até o centro do templo.');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const QUIZ=[
 ['Porta do Sol: qual símbolo abre? (dica: nasce no leste)',['','','★'],1],
 ['Porta do Rio: o que flui sem pernas?',['','',''],1],
 ['Porta do Templo: 7 + 5 × 2 = ?',['24','17','19'],1]
];
let tries=3;
function show(){
 const q=QUIZ[door];
 hud.set('p',(door+1)+'/3');
 qz.innerHTML='<b>'+q[0]+'</b><br> Tentativas: '+'♥'.repeat(tries);
 brow.innerHTML='';
 q[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===q[2]){door++;H.sfx('ok');
    if(door>=3){gameOver(true);return;}
    say('✔ Porta aberta! Próximo enigma…');show();
   }else{tries--;H.sfx('bad');
    if(tries<=0){gameOver(false);return;}
    say('✕ Errado! Tentativas: '+tries);show();
   }
  },false);
 });
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?300+tries*100:door*80;H.score(sc);
H.done(win?{win:true,score:sc,title:'Coração do templo!',sub:'3 portas abertas!'}:{win:false,score:sc,title:'Templo selado!',sub:'Sem tentativas. Pense antes!'});}
show();
}});
