/* NCODE N · 332 Erupção Solar — proteja a colônia! */
GREG(332,{
init(root,H){
let over=false,mat=20,shield=[0,0,0],t=0,waveT=0,wave=0,hp=100;
const hud=H.hud(root,[['m','MATERIAL',20],['o','ONDA','0/5'],['c','COLÔNIA',100]]);
const say=H.msg(root,'Distribua material nos 3 setores! Ondas de radiação atingem setores aleatórios — sem escudo = dano. 5 ondas!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('m',mat);hud.set('o',wave+'/5');hud.set('c',Math.max(0,hp|0));
 st.innerHTML='Onda '+wave+'/5 · '+mat+' material<br>Setores: '+shield.join(' · ')+' · Colônia '+hp.toFixed(0)+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 for(let i=0;i<3;i++){
  H.btn(brow,'+Setor '+(i+1)+' ('+shield[i]+')',()=>{
   if(over||mat<=0)return;
   mat--;shield[i]++;H.sfx('tick');status();
  },false);
 }
}
H.every(4000,()=>{
 if(over)return;
 wave++;
 mat+=6;
 const hit=(Math.random()*3)|0,str=15+wave*8;
 if(shield[hit]>0){shield[hit]--;say('Setor '+(hit+1)+' absorveu a onda!');H.sfx('ok');}
 else{hp-=str;say('Setor '+(hit+1)+' atingido! −'+str+'!');H.sfx('bad');}
 status();
 if(hp<=0){gameOver(false);return;}
 if(wave>=5){gameOver(true);return;}
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?Math.ceil(hp)*4:wave*40;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Colônia protegida!',sub:'Sobreviveu às 5 ondas!'}:{win:false,score:sc|0,title:'Colônia irradiada!',sub:'Distribua escudos em todos os setores!'});}
status();
}});
