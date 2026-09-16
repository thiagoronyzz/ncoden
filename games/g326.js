/* NCODE N · 326 Nevasca na Montanha — ache abrigo! */
GREG(326,{
init(root,H){
let over=false,step=0,warm=90,prog=0;
const PATHS=[
 ['🏔️ Cume exposto (rápido, frio)','🌲 Floresta (lento, quente)',()=>{prog+=22;warm-=22;},()=>{prog+=12;warm-=8;}],
 ['🕳️ Caverna escura (atalho?)','⛰️ Contornar (seguro)',()=>{if(Math.random()<.6){prog+=25;}else{warm-=20;say('Caverna sem saída! −20 calor.');}prog+=5;},()=>{prog+=12;warm-=10;}],
 ['🔥 Fazer fogueira (−tempo, +calor)','🏃 Seguir andando',()=>{warm=Math.min(100,warm+30);prog+=4;},()=>{prog+=16;warm-=14;}],
 ['🧗 Paredão (arriscado)','🐌 Descer ao vale',()=>{if(Math.random()<.5){prog+=28;}else{warm-=25;say('Queda! −25 calor.');}prog+=4;},()=>{prog+=10;warm-=6;}]
];
const hud=H.hud(root,[['c','CALOR',90],['p','ABRIGO','0%']]);
const say=H.msg(root,'Ache o abrigo (100%) antes de congelar! Cada escolha move e esfria. Fogueiras salvam!');
const box=H.el('div','g-col',null,root);
const ev=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('c',Math.max(0,warm|0));hud.set('p',Math.min(100,prog|0)+'%');}
function next(){
 if(over)return;
 step++;warm-=4;
 if(warm<=0){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 const e=PATHS[(Math.random()*PATHS.length)|0];
 ev.innerHTML='<b>Passo '+step+'</b> · Calor '+warm.toFixed(0)+' · Abrigo '+(prog|0)+'%<br>Escolha o caminho:';
 brow.innerHTML='';
 H.btn(brow,'🅰️ '+e[0],()=>{e[2]();H.sfx('tick');status();next();},false);
 H.btn(brow,'🅱️ '+e[1],()=>{e[3]();H.sfx('tick');status();next();},false);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(warm)*2:prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🏕️ Abrigo encontrado!',sub:'Quentinho na nevasca!'}:{win:false,score:sc|0,title:'Congelado!',sub:'Faça fogueiras quando o calor baixar!'});}
next();
}});
