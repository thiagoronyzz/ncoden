/* NCODE N · 364 Duas Verdades, Uma Mentira — ache a mentira! */
GREG(364,{
init(root,H){
const SETS=[
 [['Tenho 2 irmãos','Já viajei de balão','Sei tocar piano'],2],
 [['Amo pizza fria','Nunca quebrei nada','Corro 5km',],1],
 [['Falo 3 línguas','Tenho medo de altura','Já vi neve'],0],
 [['Sou canhoto','Adoro coentro','Sei nadar'],1],
 [['Já plantei uma árvore','Nunca vi o mar','Cozinho bem'],1],
 [['Tenho um gato','Jogo xadrez','Odeio chocolate'],2]
];
let over=false,round=0,score=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Cada jogador diz 3 frases: ache a MENTIRA! 6 rodadas.');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=6){gameOver();return;}
 const s=SETS[round];
 hud.set('r',(round+1)+'/6');
 st.innerHTML='<b>Jogador '+(round+1)+' diz:</b>';
 brow.innerHTML='';
 s[0].forEach((f,i)=>{
  H.btn(brow,'"'+f+'"',()=>{
   if(over)return;
   if(i===s[1]){score+=100;H.sfx('ok');say('✅ Mentira encontrada! +100');}
   else{H.sfx('bad');say('❌ A mentira era: "'+s[0][s[1]]+'"');}
   round++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=400,score,title:score>=400?'🕵️ Detector humano!':'🕵️ Fim!',sub:score+'/600 pontos.'});}
show();
}});
