/* NCODE N · 311 Ilha Deserta — sobreviva 30 dias! */
GREG(311,{
init(root,H){
let over=false,day=1,water=70,food=70,shelter=0,energy=100,act=2;
const hud=H.hud(root,[['d','DIA','1/30'],['a','ÁGUA',70],['c','COMIDA',70],['s','ABRIGO',0]]);
const say=H.msg(root,'Sobreviva 30 dias! Cada dia tem 2 ações. Água e comida caem todo dia; abrigo protege das tempestades!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/30');hud.set('a',Math.max(0,water|0));hud.set('c',Math.max(0,food|0));hud.set('s',shelter+'%');
 st.innerHTML='Dia '+day+'/30 · Ações: '+act+'<br> '+bar(water)+bar(food)+shelter+'% · '+energy;
 paintBtns();
}
function bar(v){const n=Math.round(H.clamp(v,0,100)/10);return'█'.repeat(n)+'░'.repeat(10-n);}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 const acts=[
  ['Buscar água','+30 água, −20',()=>{water=Math.min(100,water+30);energy-=20;}],
  ['Pescar','+25 comida, −25',()=>{food=Math.min(100,food+25);energy-=25;}],
  ['Construir','+20% abrigo, −25',()=>{shelter=Math.min(100,shelter+20);energy-=25;}],
  ['Descansar','+40',()=>{energy=Math.min(100,energy+40);}]
 ];
 acts.forEach(a=>{
  H.btn(brow,a[0]+' ('+a[1]+')',()=>{
   if(over||act<=0)return;
   if(energy<20&&a[0][0]!==''){say('Cansado demais! Descanse.');H.sfx('bad');return;}
   a[2]();act--;H.sfx('tick');
   if(act<=0)nextDay();else status();
  },false);
 });
}
function nextDay(){
 water-=18+Math.random()*8;food-=15+Math.random()*8;
 if(day%6===0){
  const dmg=Math.max(0,40-shelter);
  water-=dmg/2;food-=dmg/2;energy-=dmg/3;
  say('TEMPESTADE no dia '+day+'! Abrigo '+shelter+'% absorveu.');
 }
 day++;
 if(water<=0||food<=0){gameOver(false,water<=0?'Sede venceu no dia '+day+'.':'Fome venceu no dia '+day+'.');return;}
 if(day>30){gameOver(true);return;}
 act=2;energy=Math.min(100,energy+25);
 status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?500+shelter:day*10;H.score(sc);
H.done(win?{win:true,score:sc,title:'Resgatado!',sub:'30 dias sobrevividos! Abrigo '+shelter+'%.'}:{win:false,score:sc,title:'Não resistiu!',sub:why+' Equilibre água e comida!'});}
status();
}});
