/* NCODE N · 262 Patrulha do Guarda — passe na hora certa! */
GREG(262,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,lives=3,t=0;
const hud=H.hud(root,[['v','VIDAS',3]]);
const say=H.msg(root,'Chegue à saída 🚪! Cones amarelos são a visão dos guardas. Caixas escondem.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
const GD=[
 {wp:[[80,360],[380,360]],i:0,sp:70,x:80,y:360,a:0},
 {wp:[[380,240],[80,240]],i:0,sp:90,x:380,y:240,a:Math.PI},
 {wp:[[230,60],[230,180]],i:0,sp:60,x:230,y:60,a:Math.PI/2}
];
const COV=[[150,300,70,50],[300,150,70,50],[150,80,60,40]];
function inCone(g){
 const dx=px-g.x,dy=py-g.y,d=Math.hypot(dx,dy);
 if(d>130)return false;
 let df=Math.atan2(dy,dx)-g.a;
 while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
 return Math.abs(df)<.42;
}
const hidden=()=>COV.some(s=>px>=s[0]&&px<=s[0]+s[2]&&py>=s[1]&&py<=s[1]+s[3]);
function status(){hud.set('v',lives);}
function gameOver(win){over=true;const sc=win?350+lives*100:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🥷 Passou ileso!',sub:'Nenhum guarda te viu.'}:{win:false,score:sc,title:'Pego!',sub:'Um guarda te avistou. Use as caixas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 GD.forEach(g=>{
  const w=g.wp[g.i],d=Math.hypot(w[0]-g.x,w[1]-g.y);
  if(d<6)g.i=(g.i+1)%g.wp.length;
  else{g.a=Math.atan2(w[1]-g.y,w[0]-g.x);g.x+=(w[0]-g.x)/d*g.sp*dt;g.y+=(w[1]-g.y)/d*g.sp*dt;}
 });
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(!hidden()&&GD.some(inCone)){lives--;H.sfx('bad');if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 status();
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 COV.forEach(s=>{x.fillStyle='#8A6A2F';x.fillRect(s[0],s[1],s[2],s[3]);x.strokeStyle='#181816';x.strokeRect(s[0],s[1],s[2],s[3]);});
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 GD.forEach(g=>{
  x.fillStyle='rgba(232,163,61,.35)';x.beginPath();x.moveTo(g.x,g.y);x.arc(g.x,g.y,130,g.a-.42,g.a+.42);x.fill();
  x.fillStyle='#2E6E8A';x.beginPath();x.arc(g.x,g.y,11,0,7);x.fill();x.strokeStyle='#181816';x.lineWidth=2;x.stroke();
 });
 x.fillStyle=hidden()?'#3E7C4F':'#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,4,0,7);x.fill();
});
status();
}});
