/* NCODE N · 377 Leitura Labial — fale sem som! */
GREG(377,{
init(root,H){
const P=[
 ['Eu amo pizza',['Eu amo pizza','Eu odeio chuva','Meu gato mia','Vou à praia'],0],
 ['O cachorro latiu',['O cachorro latiu','A vaca pulou','O galo cantou','O pato nadou'],0],
 ['Vamos à festa hoje',['Vamos à festa hoje','Fomos ao jogo ontem','Venha à feira amanhã','Vou à escola cedo'],0],
 ['Que calor danado',['Que calor danado','Que frio medonho','Que vento forte','Que chuva boa'],0],
 ['Meu time ganhou',['Meu time ganhou','Meu primo sumiu','Minha tia ligou','Meu vô dormiu'],0]
];
let over=false,qi=0,score=0,mem=5,phase='mem';
const hud=H.hud(root,[['f','FRASE','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Memorize a frase, fale em SILÊNCIO para o grupo e veja se adivinham! Depois confira. 5 frases!');
const box=H.el('div','g-col',null,root);
const ph=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=5){gameOver();return;}
 phase='mem';mem=5;
 hud.set('f',(qi+1)+'/5');
 ph.innerHTML='MEMORIZE:<br><b style="font-size:26px">"'+P[qi][0]+'"</b><br>5s…';
 brow.innerHTML='';
 H.after(5000,()=>{if(!over&&phase==='mem'){phase='ask';ask();}});
}
function ask(){
 ph.innerHTML='Fale "<b>???</b>" em silêncio!<br>O grupo adivinhou?';
 brow.innerHTML='';
 P[qi][1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over||phase!=='ask')return;
   if(i===P[qi][3]){score+=100;H.sfx('ok');}
   else H.sfx('bad');
   qi++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'Lábios de ouro!':'Fim!',sub:score+'/500 pontos.'});}
show();
}});
