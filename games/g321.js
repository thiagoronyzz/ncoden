/* NCODE N · 321 Fazenda na Seca — cada gota conta! */
GREG(321,{
init(root,H){
let over=false,day=1,water=60,crops=[0,0,0,0,0,0],act=3;
const hud=H.hud(root,[['d','DIA','1/12'],['a','ÁGUA',60],['c','COLHEITA','0/6']]);
const say=H.msg(root,'Colha as 6 plantas em 12 dias! Regar custa água; chuva aleatória ajuda. Planta seca 3 dias seguidos morre!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const grow=H.el('div','g-row',null,box);
const brow=H.el('div','g-row',null,box);
let dry=[0,0,0,0,0,0],done=0;
function status(){
 hud.set('d',day+'/12');hud.set('a',Math.max(0,water|0));hud.set('c',done+'/6');
 st.innerHTML='Dia '+day+'/12 · Ações: '+act+' · '+water.toFixed(0);
 grow.innerHTML='';
 crops.forEach((c,i)=>{
  const d=H.el('div','g-chip',c>=100?'PRONTA':c>=60?(c|0)+'%':c>=0?(c|0)+'%':'PERDIDA',grow);
  d.style.fontSize='18px';
  if(c>=0&&c<100){
   const b=H.el('button','g-chip','REGAR',grow);
   b.addEventListener('click',()=>water2(i));
  }
 });
 brow.innerHTML='';
 if(!over)H.btn(brow,'Dormir (próximo dia)',()=>{if(!over)nextDay();},true);
}
function water2(i){
 if(over||act<=0||crops[i]<0||crops[i]>=100)return;
 if(water<10){say('Sem água! Durma e reze por chuva.');H.sfx('bad');return;}
 water-=10;crops[i]+=25;dry[i]=0;act--;H.sfx('tick');
 if(crops[i]>=100){done++;say('Planta '+(i+1)+' pronta!');}
 status();
}
function nextDay(){
 day++;act=3;
 if(Math.random()<.35){water=Math.min(100,water+30);say('Choveu! +30 água.');}
 if(day>12){gameOver(done>=6);return;}
 crops.forEach((c,i)=>{
  if(c<0||c>=100)return;
  if(dry[i]>=2){crops[i]=-1;say('Planta '+(i+1)+' morreu!');}
  else dry[i]++;
 });
 water=Math.max(0,water-5);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';grow.innerHTML='';
 const sc=done*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Colheita salva!',sub:'6/6 plantas!'}:{win:false,score:sc,title:'Seca venceu!',sub:done+'/6 plantas. Regue todo dia!'});}
status();
}});
