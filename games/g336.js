/* NCODE N · 336 Apagão no Hospital — mantenha a energia! */
GREG(336,{
init(root,H){
let over=false,fuel=60,gen=[true,false],uptime=0,t=0,time=120;
const hud=H.hud(root,[['e','ENERGIA','ON'],['cb','COMBUSTÍVEL',60],['tp','TEMPO',120]]);
const say=H.msg(root,'Aguente 120s com energia! Geradores gastam combustível; abasteça (+20, espera). Sem energia, pacientes em risco!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let risk=0;
function status(){
 const on=gen.some(g=>g)&&fuel>0;
 hud.set('e',on?'ON':'OFF');hud.set('cb',Math.max(0,fuel|0));hud.set('tp',Math.ceil(time));
 st.innerHTML='🏥 Energia: '+(on?'🟢 ON':'🔴 OFF')+' · ⛽ '+fuel.toFixed(0)+'<br>G1 '+(gen[0]?'ligado':'desligado')+' · G2 '+(gen[1]?'ligado':'desligado')+' · Risco '+risk.toFixed(0)+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🔌 Alternar G1',()=>{gen[0]=!gen[0];H.sfx('tick');status();},false);
 H.btn(brow,'🔌 Alternar G2',()=>{gen[1]=!gen[1];H.sfx('tick');status();},false);
 H.btn(brow,'⛽ Abastecer (+20)',()=>{fuel=Math.min(100,fuel+20);H.sfx('tick');status();},true);
}
H.every(500,()=>{
 if(over)return;
 time-=.5;
 const n=gen.filter(g=>g).length;
 if(n>0&&fuel>0){fuel-=n*1.2;uptime+=.5;risk=Math.max(0,risk-3);}
 else{risk+=4;}
 status();
 if(risk>=100){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(fuel)*2:uptime|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🏥 Plantão cumprido!',sub:'Energia mantida!'}:{win:false,score:sc|0,title:'Apagão crítico!',sub:'Ligue ao menos 1 gerador com combustível!'});}
status();
}});
