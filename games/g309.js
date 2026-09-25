/* NCODE N · 309 Corrida de Cortador de Grama — apare o bairro! */
GREG(309,{
init(root,H){
const N=12,CS=36,OX=14,OY=50;
let over=false,grid=[],px=0,py=0,ai={x:11,y:11},t=0,time=120,mowed=0,aiM=0;
for(let r=0;r<N;r++){grid.push([]);for(let c=0;c<N;c++)grid[r].push(0);}
grid[0][0]=1;grid[11][11]=2;mowed=1;aiM=1;
const hud=H.hud(root,[['v','SEU %','1%'],['c','CPU %','1%'],['tp','TEMPO',120]]);
const say=H.msg(root,'Apare mais grama que a CPU em 2 minutos! Setas/toque movem. Quem passar primeiro fica com o pedaço!');
const o=H.cvs(root,460,500),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over)return;
 const nc=H.clamp(px+dc,0,N-1),nr=H.clamp(py+dr,0,N-1);
 px=nc;py=nr;
 if(!grid[nr][nc]){grid[nr][nc]=1;mowed++;H.sfx('tick');}
 hud.set('v',(mowed/144*100|0)+'%');
}
H.onTap(o,(qx,qy)=>{
 const c=Math.floor((qx-OX)/CS),r=Math.floor((qy-OY)/CS);
 if(c<0||c>=N||r<0||r>=N)return;
 step(Math.sign(c-px),0);step(0,Math.sign(r-py));
});
function gameOver(){
 over=true;const win=mowed>aiM;const sc=mowed*5;H.score(sc);
H.done(win?{win:true,score:sc,title:'Gramado impecável!',sub:(mowed/144*100|0)+'% × '+(aiM/144*100|0)+'% da CPU.'}:{win:false,score:sc,title:'CPU aparou mais!',sub:(mowed/144*100|0)+'% × '+(aiM/144*100|0)+'%. Cubra o mapa!'});}
let aiT=0;
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 aiT+=dt;
 if(aiT>.28){aiT=0;
  const dirs=[[1,0],[-1,0],[0,1],[0,-1]].sort(()=>Math.random()-.5);
  for(const d of dirs){
   const nx=H.clamp(ai.x+d[0],0,N-1),ny=H.clamp(ai.y+d[1],0,N-1);
   if(!grid[ny][nx]){ai.x=nx;ai.y=ny;grid[ny][nx]=2;aiM++;break;}
  }
  if(Math.random()<.3){ai.x=H.clamp(ai.x+((Math.random()*3)|0)-1,0,N-1);ai.y=H.clamp(ai.y+((Math.random()*3)|0)-1,0,N-1);if(!grid[ai.y][ai.x]){grid[ai.y][ai.x]=2;aiM++;}}
  hud.set('c',(aiM/144*100|0)+'%');
 }
 hud.set('tp',Math.ceil(time));
 if(time<=0||mowed+aiM>=144){gameOver();return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,500);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=!grid[r][c]?'#3E7C4F':grid[r][c]===1?'#8FD18F':'#7FB3C8';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle=H.C.paper;x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.font='20px system-ui';x.textAlign='center';
 x.fillText('i:tractor',OX+px*CS+18,OY+py*CS+26);
 x.fillText('i:tractor',OX+ai.x*CS+18,OY+ai.y*CS+26);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Você '+(mowed/144*100|0)+'% · CPU '+(aiM/144*100|0)+'% · '+Math.ceil(time),14,30);
});
}});
