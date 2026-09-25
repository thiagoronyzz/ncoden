/* NCODE N · 276 Entrega de Espião — ache o contato! */
GREG(276,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,t=0,hand=0,lives=3;
const CT={x:120+Math.random()*220,y:80+Math.random()*200};
const WK=[];
for(let i=0;i<14;i++)WK.push({x:Math.random()*460,y:Math.random()*460,vx:(Math.random()-.5)*50,vy:(Math.random()-.5)*50,ph:Math.random()*7});
const POL=[
 {wp:[[60,60],[400,60],[400,200],[60,200]],i:0,sp:80,x:60,y:60},
 {wp:[[60,400],[400,400],[400,260],[60,260]],i:0,sp:80,x:60,y:400}
];
const hud=H.hud(root,[['v','VIDAS',3],['en','ENTREGA','0%']]);
const say=H.msg(root,'Encontre o contato de chapéu vermelho na estação e fique perto para entregar! Policiais de perto prendem!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?Math.max(150,450-(t|0)*4)+lives*60:20;H.score(sc);
H.done(win?{win:true,score:sc,title:'Pacote entregue!',sub:'Missão cumprida em '+(t|0)+'s.'}:{win:false,score:sc,title:'Preso!',sub:'A polícia te pegou 3 vezes.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 WK.forEach(w=>{w.x+=w.vx*dt;w.y+=w.vy*dt;w.ph+=dt*5;if(w.x<0||w.x>460)w.vx*=-1;if(w.y<0||w.y>460)w.vy*=-1;});
 POL.forEach(p=>{
  const w=p.wp[p.i],d=Math.hypot(w[0]-p.x,w[1]-p.y);
  if(d<8)p.i=(p.i+1)%p.wp.length;
  else{p.x+=(w[0]-p.x)/d*p.sp*dt;p.y+=(w[1]-p.y)/d*p.sp*dt;}
 });
 const sp=130*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(POL.some(p=>Math.hypot(px-p.x,py-p.y)<26)){lives--;hand=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(Math.hypot(px-CT.x,py-CT.y)<36){hand+=dt/2*100;hud.set('en',Math.min(100,hand|0)+'%');if(hand>=100){gameOver(true);return;}}
 else hand=Math.max(0,hand-50*dt);
 x.fillStyle='#D8D5CC';x.fillRect(0,0,460,460);
 x.fillStyle='#B9B5A8';
 for(let i=0;i<5;i++)x.fillRect(0,90+i*70,460,8);
 WK.forEach(w=>{x.fillStyle='#8A877C';x.beginPath();x.arc(w.x,w.y+Math.sin(w.ph)*2,8,0,7);x.fill();});
 x.font='22px system-ui';x.textAlign='center';x.fillText('',CT.x,CT.y+8);
 x.strokeStyle='#D94E34';x.lineWidth=2;x.beginPath();x.arc(CT.x,CT.y,36,0,7);x.stroke();
 POL.forEach(p=>{x.font='20px system-ui';x.fillText('i:guard',p.x,p.y+7);});
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,4,0,7);x.fill();
});
}});
