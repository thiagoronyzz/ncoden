/* NCODE N · 367 História em Cadeia — conte junto! */
GREG(367,{
init(root,H){
const OPEN=['Era uma noite escura quando…','O robô acordou e viu…','Na ilha deserta havia…'];
const MID=[
 'um dragão faminto apareceu!','a porta se abriu sozinha…','tudo começou a flutuar!',
 'o telefone tocou: era o futuro.','um mapa misterioso caiu do céu.','o bolo ganhou vida!',
 'de repente, todos viraram sapos.','um OVNI pousou no quintal.','o tesouro era de chocolate.'
];
const END=['E viveram rindo para sempre. FIM.','E foi tudo um sonho… ou não? FIM.','E a aventura continua! FIM.'];
let over=false,round=0,story=[];
const hud=H.hud(root,[['r','PARTE','1/7']]);
const say=H.msg(root,'Cada um adiciona um trecho! Escolha 1 de 3 cartas por rodada. 7 partes = história completa!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
story.push(OPEN[(Math.random()*3)|0]);
function show(){
 if(round>=6){
  story.push(END[(Math.random()*3)|0]);
  gameOver();return;
 }
 hud.set('r',(round+2)+'/7');
 st.innerHTML='<i>'+story.join(' ')+'</i><br><b>Sua vez! Escolha:</b>';
 brow.innerHTML='';
 const opts=MID.slice().sort(()=>Math.random()-.5).slice(0,3);
 opts.forEach(o=>{
  H.btn(brow,o,()=>{
   if(over)return;
   story.push(o);
   const bot=MID[(Math.random()*MID.length)|0];
   story.push('(Bot : '+bot+')');
   round+=2;H.sfx('ok');show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';
 st.innerHTML='<b> SUA HISTÓRIA:</b><br><i>'+story.join(' ')+'</i>';
 H.score(story.length*20);
H.done({win:true,score:story.length*20,title:'História pronta!',sub:story.length+' trechos de pura arte.'});}
show();
}});
