/* NCODE N · 323 Abrigo Anti-Tornado — antes da temporada! */
GREG(323,{
init(root,H){
let over=false,day=1,walls=0,stock=0,act=2,phase='prep';
const hud=H.hud(root,[['d','DIA','1/10'],['p','PAREDES','0%'],['e','ESTOQUE',0]]);
const say=H.msg(root,'10 dias para reforçar o abrigo e estocar comida! Depois, sobreviva à temporada de tornados!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',Math.min(10,day)+'/10');hud.set('p',walls+'%');hud.set('e',stock);
 st.innerHTML=phase==='prep'?'Dia '+day+'/10 · Ações: '+act+'<br> '+walls+'% · '+stock:'TEMPORADA! Segure '+(storm|0)+'s!';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over||phase!=='prep')return;
 H.btn(brow,'Reforçar (+20%)',()=>{if(act<=0||over)return;walls=Math.min(100,walls+20);act--;H.sfx('tick');after();},false);
 H.btn(brow,'Estocar (+3)',()=>{if(act<=0||over)return;stock+=3;act--;H.sfx('tick');after();},false);
 H.btn(brow,'Dormir',()=>{if(over)return;act=0;after();},true);
}
function after(){
 if(act>0){status();return;}
 day++;
 if(day>10){startStorm();return;}
 act=2;status();
}
let storm=0,dmg=0;
function startStorm(){
 phase='storm';storm=30;dmg=0;
 say('A temporada chegou! Abrigo '+walls+'%, estoque '+stock+'.');
 status();
 H.every(1000,()=>{
  if(over||phase!=='storm')return;
  storm--;
  const hit=Math.random()<.6;
  if(hit){
   const d=Math.max(0,30-walls*.3);
   dmg+=d;
   if(stock>0&&dmg>20){stock--;dmg=0;say('Usou 1 estoque para reparar!');}
  }
  hud.set('e',stock);
  status();
  if(dmg>=100){gameOver(false);return;}
  if(stock<=0&&storm>15&&Math.random()<.3){gameOver(false,'Fome no abrigo!');return;}
  if(storm<=0){gameOver(true);return;}
 });
}
function gameOver(win,why){over=true;phase='end';brow.innerHTML='';
 const sc=win?400+stock*20:walls+stock*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Temporada vencida!',sub:'Abrigo resistiu!'}:{win:false,score:sc|0,title:'Abrigo caiu!',sub:why||'Reforce mais as paredes!'});}
status();
}});
