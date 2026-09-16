/* NCODE N · 340 Resposta à Pandemia — cure a cidade! */
GREG(340,{
init(root,H){
let over=false,day=1,sick=10,cured=0,hosp=0,vac=0,act=2,pop=100;
const hud=H.hud(root,[['d','DIA','1/20'],['d2','DOENTES',10],['c','CURADOS',0]]);
const say=H.msg(root,'Zere os doentes em 20 dias! Hospitais curam, vacinas previnem, lockdown freia o contágio (mas cansa a ação)!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/20');hud.set('d2',Math.ceil(sick));hud.set('c',cured);
 st.innerHTML='🦠 Dia '+day+'/20 · Ações: '+act+'<br>🤒 '+sick.toFixed(0)+' · 💚 '+cured+' · 🏥 '+hosp+' · 💉 '+vac;
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🏥 Hospital (+1)',()=>{if(act<=0||over)return;hosp++;act--;H.sfx('tick');after();},false);
 H.btn(brow,'💉 Vacinar (+12)',()=>{if(act<=0||over)return;vac+=12;act--;H.sfx('tick');after();},false);
 H.btn(brow,'🔒 Lockdown',()=>{if(act<=0||over)return;act--;lock=true;H.sfx('tick');after();},true);
}
let lock=false;
function after(){
 if(act>0){status();return;}
 day++;
 const spread=sick*.35*(lock?.3:1)*(1-Math.min(.8,vac/100));
 const cure=Math.min(sick,hosp*6+4);
 sick=sick+spread-cure;
 cured+=Math.ceil(cure);
 lock=false;
 if(sick<1){gameOver(true);return;}
 if(sick>=pop){gameOver(false);return;}
 if(day>20){gameOver(sick<5);return;}
 act=2;status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+cured*2:cured*2;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'💚 Cidade curada!',sub:cured+' curados!'}:{win:false,score:sc|0,title:'Colapso!',sub:'Combine hospital + vacina + lockdown!'});}
status();
}});
