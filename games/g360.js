/* NCODE N · 360 Cidade Perdida — atravesse a selva! */
GREG(360,{
init(root,H){
let over=false,prog=0,sup=80,hp=100,step=0;
const EV=[
 ['Ponte de corda!','Atravessar (rápido)','Contornar (seguro)',()=>{if(Math.random()<.4){hp-=25;say('Corda arrebentou! −25.');}prog+=18;},()=>{prog+=10;sup-=8;}],
 ['Macacos curiosos!','Dar comida (−15)','Espantar',()=>{sup-=15;prog+=14;},()=>{if(Math.random()<.5){hp-=10;say('Mordida! −10.');}prog+=14;}],
 ['Cachoeira!','Escalar (atalho)','Descer e subir',()=>{if(Math.random()<.5){prog+=24;}else{hp-=20;say('Escorregou! −20.');}prog+=6;},()=>{prog+=12;sup-=6;}],
 ['Pássaro guia!','Seguir o pássaro','Ignorar',()=>{prog+=20;},()=>{prog+=10;}],
 ['Acampamento!','Descansar (+20 vida, −10 sup)','Marchar',()=>{hp=Math.min(100,hp+20);sup-=10;prog+=4;},()=>{prog+=14;sup-=8;}]
];
const hud=H.hud(root,[['p','CIDADE','0%'],['s','SUPRIMENTOS',80],['v','VIDA',100]]);
const say=H.msg(root,'Chegue à cidade perdida (100%)! Suprimentos zeram = perde vida. Vida zera = fim!');
const box=H.el('div','g-col',null,root);
const ev=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('p',Math.min(100,prog|0)+'%');hud.set('s',Math.max(0,sup|0));hud.set('v',Math.max(0,hp|0));}
function next(){
 if(over)return;
 step++;sup-=4;
 if(sup<=0){hp-=10;sup=0;}
 if(hp<=0){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 const e=EV[(Math.random()*EV.length)|0];
 ev.innerHTML='<b>Dia '+step+'</b> · '+e[0];
 brow.innerHTML='';
 H.btn(brow,''+e[1],()=>{e[3]();H.sfx('tick');status();next();},false);
 H.btn(brow,''+e[2],()=>{e[4]();H.sfx('tick');status();next();},false);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(hp)+Math.ceil(sup):prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Cidade encontrada!',sub:'Lenda confirmada!'}:{win:false,score:sc|0,title:'Selva venceu!',sub:'Gerencie suprimentos e vida!'});}
next();
}});
