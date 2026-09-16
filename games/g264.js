/* NCODE N · 264 Disfarce na Multidão — aja natural! */
GREG(264,{
init(root,H){
let over=false,px=30,py=230,tx=px,ty=py,susp=0,t=0,moving=false;
const OBS=[{x:150,y:110,a:0,sp:.5},{x:320,y:110,a:2,sp:-.4},{x:150,y:360,a:1,sp:.45},{x:320,y:360,a:3,sp:-.5}];
const CROWD=[{x:120,y:230,r:46},{x:240,y:150,r:40},{x:240,y:320,r:40},{x:360,y:230,r:46}];
const hud=H.hud(root,[['sp','SUSPEITA','0%']]);
const say=H.msg(root,'Atravesse até a saída 🚪! Parado ou no meio da multidão (círculos), a suspeita cai. Correndo sob olhares, ela dispara!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function inGaze(ob){
 const dx=px-ob.x,dy=py-ob.y,d=Math.hypot(dx,dy);
 if(d>150)return false;
 let df=Math.atan2(dy,dx)-ob.a;
 while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
 return Math.abs(df)<.5;
}
function gameOver(win){over=true;const sc=win?Math.max(100,400-(susp*2|0)):30;H.score(sc);
H.done(win?{win:true,score:sc,title:'🎭 Mestre do disfarce!',sub:'Ninguém desconfiou.'}:{win:false,score:sc,title:'Descoberto!',sub:'A suspeita chegou a 100%. Misture-se à multidão!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 OBS.forEach(ob=>ob.a+=ob.sp*dt);
 const sp=115*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 moving=false;
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;moving=true;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>5){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;moving=true;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const seen=OBS.some(inGaze);
 const blend=CROWD.some(c=>Math.hypot(px-c.x,py-c.y)<c.r);
 if(seen&&moving)susp+=20*dt;else if(seen)susp+=6*dt;
 else if(blend)susp-=16*dt;else susp-=5*dt;
 susp=H.clamp(susp,0,100);
 hud.set('sp',(susp|0)+'%');
 if(susp>=100){gameOver(false);return;}
 if(px>406&&py>200&&py<260){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 CROWD.forEach(c=>{
  x.fillStyle='rgba(62,124,79,.25)';x.beginPath();x.arc(c.x,c.y,c.r,0,7);x.fill();
  x.fillStyle='#3E7C4F';
  for(let i=0;i<6;i++){const a=i/6*6.28+t*.3;x.beginPath();x.arc(c.x+Math.cos(a)*c.r*.55,c.y+Math.sin(a)*c.r*.55,7,0,7);x.fill();}
 });
 x.fillStyle='#3E7C4F';x.fillRect(414,200,38,60);x.fillStyle='#fff';x.font='22px system-ui';x.textAlign='center';x.fillText('🚪',433,240);
 OBS.forEach(ob=>{
  x.fillStyle='rgba(217,78,52,.22)';x.beginPath();x.moveTo(ob.x,ob.y);x.arc(ob.x,ob.y,150,ob.a-.5,ob.a+.5);x.fill();
  x.fillStyle='#181816';x.beginPath();x.arc(ob.x,ob.y,10,0,7);x.fill();
  x.fillStyle='#D94E34';x.beginPath();x.arc(ob.x+Math.cos(ob.a)*5,ob.y+Math.sin(ob.a)*5,4,0,7);x.fill();
 });
 x.fillStyle=seen?'#D94E34':'#2E6E8A';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 x.fillStyle='#181816';x.fillRect(10,10,200,14);
 x.fillStyle=susp>70?'#D94E34':'#E8A33D';x.fillRect(10,10,200*susp/100,14);
 x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='left';x.fillText('SUSPEITA',14,21);
});
}});
