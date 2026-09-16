/* NCODE N · 324 Fuga do Incêndio — atravesse as chamas! */
GREG(324,{
init(root,H){
const N=10,CS=44,OX=10,OY=10;
let over=false,pc=0,pr=9,water=100,t=0,cd=0;
const FIRE=[];
for(let i=0;i<14;i++)FIRE.push({c:1+((Math.random()*8)|0),r:1+((Math.random()*8)|0)});
const hud=H.hud(root,[['a','ÁGUA','100%']]);
const say=H.msg(root,'Chegue à zona segura 🟩! Fogo 🔥 queima — apague com água (entre na casa com água). Sem água no fogo = dano!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
let hp=100;
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 const f=FIRE.find(q=>q.c===nc&&q.r===nr);
 if(f){
  if(water>=20){water-=20;FIRE.splice(FIRE.indexOf(f),1);H.sfx('ok');}
  else{hp-=34;H.sfx('bad');if(hp<=0){gameOver(false);return;}}
 }
 pc=nc;pr=nr;cd=.14;water=Math.max(0,water-.5);
 hud.set('a',(water|0)+'%');
 if(pc===9&&pr===0){gameOver(true);return;}
}
function gameOver(win){over=true;const sc=win?300+Math.ceil(water)*2+hp:pc*10+(9-pr)*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🧑‍🚒 Atravessou o incêndio!',sub:'Chegou à zona segura!'}:{win:false,score:sc|0,title:'Cercado!',sub:'Apague o fogo com água antes!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 if(Math.random()<dt*.5&&FIRE.length<20){
  const c=(Math.random()*N)|0,r=(Math.random()*N)|0;
  if(!((c===pc&&r===pr)||(c===9&&r===0))&&!FIRE.some(f=>f.c===c&&f.r===r))FIRE.push({c,r});
 }
 x.fillStyle='#3E7C4F';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=(r+c)%2?'#3E7C4F':'#35905A';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
 }
 x.fillStyle='#C4D645';x.fillRect(OX+9*CS,OY+0*CS,CS,CS);
 x.font='22px system-ui';x.textAlign='center';
 FIRE.forEach(f=>x.fillText(Math.sin(t*8+f.c)>0?'🔥':'🧨',OX+f.c*CS+22,OY+f.r*CS+32));
 x.fillText('🟩',OX+9*CS+22,OY+0*CS+32);
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,13,0,7);x.fill();
 x.fillStyle='#7FB3C8';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,5,0,7);x.fill();
});
}});
