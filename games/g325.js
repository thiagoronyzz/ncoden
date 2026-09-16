/* NCODE N · 325 Perdido no Mar — aguente no bote! */
GREG(325,{
init(root,H){
let over=false,day=1,thirst=70,hunger=70,shade=0,act=2;
const hud=H.hud(root,[['d','DIA','1/15'],['s','SEDE',70],['f','FOME',70]]);
const say=H.msg(root,'Sobreviva 15 dias no bote! Sede e fome caem todo dia; sombra protege do sol. Chuva é sorte!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/15');hud.set('s',Math.max(0,thirst|0));hud.set('f',Math.max(0,hunger|0));
 st.innerHTML='🚣 Dia '+day+'/15 · Ações: '+act+'<br>💧 '+thirst.toFixed(0)+' · 🍖 '+hunger.toFixed(0)+' · ⛱️ '+shade+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🎣 Pescar (+25 fome)',()=>{if(act<=0||over)return;hunger=Math.min(100,hunger+25);act--;H.sfx('tick');after();},false);
 H.btn(brow,'💧 Coletar orvalho (+20 sede)',()=>{if(act<=0||over)return;thirst=Math.min(100,thirst+20);act--;H.sfx('tick');after();},false);
 H.btn(brow,'⛱️ Improvisar sombra (+25%)',()=>{if(act<=0||over)return;shade=Math.min(100,shade+25);act--;H.sfx('tick');after();},false);
}
function after(){
 if(act>0){status();return;}
 day++;
 thirst-=16;hunger-=13;
 const sun=Math.max(0,20-shade*.2);
 thirst-=sun/2;
 if(Math.random()<.3){thirst=Math.min(100,thirst+30);say('🌧️ Chuva! +30 sede.');}
 if(thirst<=0){gameOver(false,'Sede no dia '+day+'.');return;}
 if(hunger<=0){gameOver(false,'Fome no dia '+day+'.');return;}
 if(day>15){gameOver(true);return;}
 act=2;status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?450:day*12;H.score(sc);
H.done(win?{win:true,score:sc,title:'🚣 Resgatado!',sub:'15 dias à deriva!'}:{win:false,score:sc,title:'O mar venceu!',sub:why+' Faça sombra cedo!'});}
status();
}});
