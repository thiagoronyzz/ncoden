/* NCODE N · 319 Cabana na Floresta — erga antes do inverno! */
GREG(319,{
init(root,H){
let over=false,day=1,logs=0,food=40,cabin=0,act=2;
const hud=H.hud(root,[['d','DIA','1/15'],['t','TORAS',0],['c','COMIDA',40],['h','CABANA','0%']]);
const say=H.msg(root,'Erga a cabana (8 toras) em 15 dias! Coma todo dia. Sem cabana no inverno = fim!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/15');hud.set('t',logs);hud.set('c',Math.max(0,food|0));hud.set('h',cabin+'%');
 st.innerHTML='🌲 Dia '+day+'/15 · Ações: '+act+'<br>🪵 '+logs+' · 🍖 '+food.toFixed(0)+' · 🛖 '+cabin+'%'+(cabin>=100?' ✅ PRONTA!':'');
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🪓 Cortar (+2 toras)',()=>{if(act<=0||over)return;logs+=2;act--;H.sfx('tick');after();},false);
 H.btn(brow,'🍖 Caçar (+20 comida)',()=>{if(act<=0||over)return;food=Math.min(100,food+20);act--;H.sfx('tick');after();},false);
 H.btn(brow,'🔨 Construir (−2 toras, +25%)',()=>{
  if(act<=0||over)return;
  if(logs<2){say('Sem toras! Corte primeiro.');H.sfx('bad');return;}
  logs-=2;cabin=Math.min(100,cabin+25);act--;H.sfx('ok');after();
 },true);
}
function after(){
 if(act<=0){
  day++;food-=12;
  if(food<=0){gameOver(false,'Fome na floresta.');return;}
  if(day>15){gameOver(cabin>=100,cabin>=100?'':'O inverno chegou sem cabana!');return;}
  act=2;
 }
 status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?400+food:cabin*3;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🛖 Cabana pronta!',sub:'Inverno tranquilo!'}:{win:false,score:sc|0,title:'Inverno cruel!',sub:why+' Priorize toras!'});}
status();
}});
