/* NCODE N · 378 Dança Congelada — parou, congelou! */
GREG(378,{
init(root,H){
let over=false,round=0,lives=3,phase='dance',t=0,stopAt=0,react=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['v','VIDAS',3]]);
const say=H.msg(root,'DANCE (toque no ritmo)! Quando a música parar, toque CONGELAR em 1s! Mexeu = perde vida. 6 rodadas!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const o=H.cvs(root,460,120),x=o.x;
function show(){
 if(round>=6){gameOver(true);return;}
 phase='dance';stopAt=3+Math.random()*5;t=0;
 hud.set('r',(round+1)+'/6');
 st.innerHTML='DANCE! <br>Toque no ritmo…';
 brow.innerHTML='';
 H.btn(brow,'Dançar!',()=>{if(!over&&phase==='dance')H.sfx('tick');},false);
 H.btn(brow,'CONGELAR!',freeze,true);
}
function freeze(){
 if(over)return;
 if(phase==='stop'){
  const r=t-stopAt;
  if(r<=1){H.sfx('ok');say('Congelado em '+r.toFixed(2)+'s!');}
  else{lives--;H.sfx('bad');hud.set('v',lives);say('Lento! −1 vida.');if(lives<=0){gameOver(false);return;}}
  round++;show();
 }else{
  lives--;H.sfx('bad');hud.set('v',lives);
  if(lives<=0){gameOver(false);return;}
  say('A música ainda toca! −1 vida.');round++;show();
 }
}
function gameOver(win){over=true;brow.innerHTML='';H.score((6-round)*0+lives*100);
H.done({win:win,score:lives*100,title:win?'Estátua viva!':'Mexeu!',sub:'Vidas: '+lives+'/3.'});}
H.loop(dt=>{
 if(over)return;
 t+=dt;
 if(phase==='dance'&&t>=stopAt){phase='stop';st.innerHTML='PAROU! CONGELE!';H.sfx('bad');}
 if(phase==='stop'&&t-stopAt>2.5){lives--;hud.set('v',lives);H.sfx('bad');if(lives<=0){gameOver(false);return;}round++;show();return;}
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,120);
 for(let i=0;i<24;i++){
  const h=phase==='dance'?20+Math.abs(Math.sin(t*7+i))*70:6;
  x.fillStyle=phase==='dance'?'#C4D645':'#4A4A44';
  x.fillRect(10+i*18,110-h,12,h);
 }
});
show();
}});
