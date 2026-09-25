/* NCODE N · 317 Fuga do Vulcão — corra da lava! */
GREG(317,{
init(root,H){
const N=10,CS=44,OX=10,OY=10;
let over=false,pc=0,pr=9,lava=[],t=0,tick=0,cd=0;
for(let c=0;c<N;c++)lava.push([c,0]);
const hud=H.hud(root,[['tp','LAVA','!']]);
const say=H.msg(root,'Chegue ao barco antes da lava! A lava desce 1 fileira a cada 2s. Setas ou toque vizinho. Não pise na lava!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
const isLava=(c,r)=>lava.some(l=>l[0]===c&&l[1]===r);
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N||isLava(nc,nr))return;
 pc=nc;pr=nr;cd=.12;H.sfx('tick');
 if(pc===9&&pr===9){gameOver(true);return;}
}
function gameOver(win){over=true;const sc=win?Math.max(150,500-(t|0)*8):(9-pr)*20+pc*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Escapou por pouco!',sub:'Em '+t.toFixed(1)+'s!'}:{win:false,score:sc|0,title:'A lava venceu!',sub:'Seja mais direto ao barco !'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;t+=dt;tick+=dt;if(cd>0)cd-=dt;
 if(tick>2){tick=0;
  const maxR=Math.max.apply(null,lava.map(l=>l[1]));
  for(let c=0;c<N;c++)if(!lava.some(l=>l[0]===c&&l[1]===maxR+1)&&maxR+1<N)lava.push([c,maxR+1]);
  H.sfx('bad');
 }
 if(isLava(pc,pr)){gameOver(false);return;}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=isLava(c,r)?(Math.sin(t*6+c+r)>0?'#D94E34':'#B23A24'):'#3E7C4F';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='rgba(0,0,0,.2)';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.font='24px system-ui';x.textAlign='center';
 x.fillText('i:volcano',OX+4*CS+22,OY+0*CS+32);
 x.fillText('i:boat',OX+9*CS+22,OY+9*CS+32);
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,5,0,7);x.fill();
});
}});
