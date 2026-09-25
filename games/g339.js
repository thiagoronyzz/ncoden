/* NCODE N · 339 Fusão Nuclear — resfrie o núcleo! */
GREG(339,{
init(root,H){
let over=false,temp=500,t=0,time=120,flow=[0,0,0];
const hud=H.hud(root,[['t','TEMP','500°'],['tp','TEMPO',120]]);
const say=H.msg(root,'Aguente 120s! Abra válvulas para resfriar — mas cada válvula aberta gasta água. Sem água = sem resfriamento!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let water=100;
function status(){
 hud.set('t',(temp|0)+'°');hud.set('tp',Math.ceil(time));
 st.innerHTML=(temp|0)+'°C · '+(water|0)+'% · '+Math.ceil(time)+'s<br>Válvulas: '+flow.map(f=>f?'●':'○').join(' ');
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 for(let i=0;i<3;i++){
  H.btn(brow,'Válvula '+(i+1)+' '+(flow[i]?'ON':'OFF'),()=>{
   flow[i]=flow[i]?0:1;H.sfx('tick');status();
  },false);
 }
}
H.every(500,()=>{
 if(over)return;
 time-=.5;
 const n=flow.filter(f=>f).length;
 temp+=((n>0&&water>0?-90:60)+Math.sin(time)*10)*.5;
 if(n>0&&water>0)water-=n*2;
 water=Math.min(100,water+.8);
 temp=H.clamp(temp,100,1200);
 status();
 if(temp>=1000){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(water)*2:Math.max(20,120-time|0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Núcleo estável!',sub:'Crise evitada!'}:{win:false,score:sc|0,title:'FUSÃO!',sub:'Abra válvulas antes dos 1000°!'});}
status();
}});
