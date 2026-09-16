/* NCODE N · 313 Trilha na Selva — ache a saída! */
GREG(313,{
init(root,H){
let over=false,hp=100,food=60,prog=0,step=0;
const EVENTS=[
 ['🐍 Cobra na trilha!','Desviar (−10 tempo)','Avançar (risco)',()=>{prog+=5;},()=>{if(Math.random()<.5){hp-=30;say('🐍 Picada! −30 vida.');}prog+=12;}],
 ['🍌 Bananeira!','Colher (+20 comida)','Ignorar',()=>{food=Math.min(100,food+20);prog+=6;},()=>{prog+=10;}],
 ['🐆 Onça por perto!','Subir em árvore','Correr',()=>{prog+=4;},()=>{if(Math.random()<.4){hp-=35;say('🐆 Arranhão! −35 vida.');}prog+=12;}],
 ['💧 Riacho!','Beber e lavar (+10 vida)','Seguir',()=>{hp=Math.min(100,hp+10);prog+=6;},()=>{prog+=10;}],
 ['🌧️ Chuva forte!','Abrigarse','Enfrentar',()=>{prog+=4;food-=5;},()=>{hp-=10;prog+=12;}],
 ['🪤 Fruta estranha!','Comer (+? comida)','Evitar',()=>{if(Math.random()<.5){food=Math.min(100,food+25);}else{hp-=20;say('🤢 Fruta ruim! −20 vida.');}prog+=8;},()=>{prog+=10;}]
];
const hud=H.hud(root,[['v','VIDA',100],['c','COMIDA',60],['p','TRILHA','0%']]);
const say=H.msg(root,'Atravesse a selva (100%)! Cada escolha move a trilha. Comida zera = perde vida. Vida zera = fim!');
const box=H.el('div','g-col',null,root);
const ev=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('v',Math.max(0,hp|0));hud.set('c',Math.max(0,food|0));hud.set('p',Math.min(100,prog|0)+'%');}
function next(){
 if(over)return;
 step++;
 food-=7;
 if(food<=0){hp-=12;food=0;say('😋 Fome! −12 vida.');}
 if(hp<=0){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 const e=EVENTS[(Math.random()*EVENTS.length)|0];
 ev.innerHTML='<b>Passo '+step+'</b> · '+e[0];
 brow.innerHTML='';
 H.btn(brow,'🅰️ '+e[1],()=>{e[3]();H.sfx('tick');status();next();},false);
 H.btn(brow,'🅱️ '+e[2],()=>{e[4]();H.sfx('tick');status();next();},false);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+hp:prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌴 Selva cruzada!',sub:step+' passos com '+(hp|0)+' de vida.'}:{win:false,score:sc|0,title:'Perdido na selva!',sub:'A selva foi mais forte. Coma quando puder!'});}
next();
}});
