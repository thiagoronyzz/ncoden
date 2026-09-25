/* NCODE N · 380 Torneio de Pedra-Papel-Tesoura — campeão! */
GREG(380,{
init(root,H){
const M=['','',''];
const N=['Pedra','Papel','Tesoura'];
let over=false,round=0,wins=0,foe=0;
const FOES=['Bot1','Bot2','Bot3','Bot4','Bot5','Bot6','Bot7'];
const hud=H.hud(root,[['r','FASE','Oitavas'],['v','VITÓRIAS','0/3']]);
const say=H.msg(root,'Torneio mata-mata! Vença 3 fases (oitavas→semi→final). Empate = joga de novo!');
const box=H.el('div','g-col',null,root);
const mt=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const STAGES=['Oitavas','Semifinal','FINAL'];
function show(){
 if(wins>=3){gameOver(true);return;}
 foe=(Math.random()*FOES.length)|0;
 hud.set('r',STAGES[wins]);
 mt.innerHTML='<b>'+STAGES[wins]+'</b> · Você × '+FOES[foe]+'<br>Escolha!';
 brow.innerHTML='';
 M.forEach((m,i)=>{
  H.btn(brow,m+' '+N[i],()=>{
   if(over)return;
   const b=(Math.random()*3)|0;
   const res=(i-b+3)%3;
   if(res===1){wins++;H.sfx('ok');
    mt.innerHTML='Você '+m+' × '+M[b]+' '+FOES[foe]+'<br>✔ Venceu a fase!';
    hud.set('v',wins+'/3');
    H.after(1400,()=>{if(!over)show();});
   }else if(res===2){H.sfx('bad');gameOver(false,b,m);}
   else{H.sfx('tick');mt.innerHTML='Você '+m+' × '+M[b]+'<br> Empate! De novo…';}
  },false);
 });
}
function gameOver(win,b,m){over=true;brow.innerHTML='';
 const sc=wins*150+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'CAMPEÃO!',sub:'3 fases vencidas!'}:{win:false,score:sc,title:'Eliminado!',sub:'Seu '+(m||'')+' perdeu para '+M[b||0]+'. Vitórias: '+wins+'/3.'});}
show();
}});
