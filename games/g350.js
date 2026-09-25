/* NCODE N · 350 Coleta de Cogumelos — comestível ou venenoso? */
GREG(350,{
init(root,H){
// [emoji, nome, venenoso?, dica]
const M=[
 ['','champignon',false,'chapéu marrom liso'],
 ['','cicuta verde',true,'chapéu verde + anel'],
 ['','porcini',false,'chapéu marrom grosso'],
 ['○','agárico',true,'chapéu vermelho com pintas'],
 ['','ostra',false,'parece concha'],
 ['','anjo destruidor',true,'todo branco']
];
let over=false,round=0,score=0,basket=0;
const hud=H.hud(root,[['r','COGUMELO','1/10'],['pt','PONTOS',0],['c','CESTA',0]]);
const say=H.msg(root,'10 cogumelos: COLHA os comestíveis, EVITE os venenosos! Erro = −vida. 3 vidas. Dica ajuda!');
const box=H.el('div','g-col',null,root);
const sh=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let lives=3,cur=null;
function show(){
 if(round>=10){gameOver(true);return;}
 cur=M[(Math.random()*M.length)|0];
 hud.set('r',(round+1)+'/10');
 sh.innerHTML='<span style="font-size:56px">'+cur[0]+'</span><br><b>'+cur[1]+'</b> · '+cur[3]+'<br>♥'.repeat(1)+' '+lives;
 brow.innerHTML='';
 H.btn(brow,'COLHER',()=>decide(false),true);
 H.btn(brow,'VENENOSO (evitar)',()=>decide(true),false);
}
function decide(saysPois){
 if(over)return;
 const isPois=cur[2];
 if(saysPois===isPois){
  score+=isPois?60:100;
  if(!isPois)basket++;
  H.sfx('ok');
 }else{
  lives--;score=Math.max(0,score-50);H.sfx('bad');
  if(lives<=0){gameOver(false);return;}
 }
 round++;hud.set('pt',score);hud.set('c',basket);
 show();
}
function gameOver(win){over=true;brow.innerHTML='';H.score(score);
H.done({win:win&&basket>=4,score,title:win&&basket>=4?'Cesta cheia!':'Fim da coleta!',sub:score+' pontos · '+basket+' colhidos.'});}
show();
}});
