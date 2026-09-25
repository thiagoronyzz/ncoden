/* NCODE N · 312 Acampamento Ártico — calor é vida! */
GREG(312,{
init(root,H){
let over=false,day=1,warm=80,food=60,iglu=0,wood=30,act=2;
const hud=H.hud(root,[['d','DIA','1/20'],['f','CALOR',80],['c','COMIDA',60],['i','IGLU',0]]);
const say=H.msg(root,'Sobreviva 20 dias no gelo! O frio drena calor todo dia; iglu e fogueira (lenha) protegem. Comida também acaba!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/20');hud.set('f',Math.max(0,warm|0));hud.set('c',Math.max(0,food|0));hud.set('i',iglu+'%');
 st.innerHTML='Dia '+day+'/20 · Ações: '+act+'<br> '+warm.toFixed(0)+' · '+food.toFixed(0)+' · '+wood+' · '+iglu+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 const acts=[
  ['Cortar lenha','+25 lenha',()=>{wood+=25;}],
  ['Fogueira','−15 lenha, +35 calor',()=>{if(wood<15){say('Sem lenha!');return false;}wood-=15;warm=Math.min(100,warm+35);}],
  ['Pescar no gelo','+25 comida',()=>{food=Math.min(100,food+25);}],
  ['Erguer iglu','+25% iglu',()=>{iglu=Math.min(100,iglu+25);}]
 ];
 acts.forEach(a=>{
  H.btn(brow,a[0]+' ('+a[1]+')',()=>{
   if(over||act<=0)return;
   const r=a[2]();
   if(r===false){H.sfx('bad');return;}
   act--;H.sfx('tick');
   if(act<=0)nextDay();else status();
  },false);
 });
}
function nextDay(){
 day++;
 const cold=22-iglu*.15-wood*.05;
 warm-=cold;food-=14;
 if(day%5===0){warm-=15;say('NEVASCA no dia '+day+'! −15 calor.');}
 if(warm<=0){gameOver(false,'Congelou no dia '+day+'.');return;}
 if(food<=0){gameOver(false,'Fome no dia '+day+'.');return;}
 if(day>20){gameOver(true);return;}
 act=2;status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?450+iglu:day*10;H.score(sc);
H.done(win?{win:true,score:sc,title:'Inverno vencido!',sub:'20 dias! Iglu '+iglu+'%.'}:{win:false,score:sc,title:'O Ártico venceu!',sub:why+' Erga o iglu cedo!'});}
status();
}});
