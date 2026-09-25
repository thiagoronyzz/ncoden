/* NCODE N · 269 Batedor de Carteira — esbarre e furte! */
GREG(269,{
init(root,H){
let over=false,px=230,py=400,tx=px,ty=py,wallets=0,wanted=0,t=0,heat=0;
const WK=[];
for(let i=0;i<12;i++)WK.push({x:Math.random()*460,y:60+Math.random()*320,vx:(Math.random()<.5?-1:1)*(30+Math.random()*40),tgt:i<5,got:false,ph:Math.random()*7});
const GD=[{x:100,y:120,a:0},{x:360,y:340,a:2}];
const hud=H.hud(root,[['w','CARTEIRAS','0/5'],['pr','PROCURADO','0/3']]);
const say=H.msg(root,'Esbarre nos alvos para furtar! Se um guarda te vir logo após o furto, vira procurado. 5 carteiras vencem!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?Math.max(150,500-(t|0)*3):wallets*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'Mão leve!',sub:'5 carteiras em '+(t|0)+'s.'}:{win:false,score:sc,title:'Reconhecido!',sub:wallets+'/5 carteiras. Furte longe dos guardas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(heat>0)heat-=dt;
 GD.forEach((g,i)=>g.a+=dt*(i?-.5:.5));
 WK.forEach(w=>{w.x+=w.vx*dt;w.ph+=dt*6;if(w.x<-20)w.x=480;if(w.x>480)w.x=-20;});
 const sp=130*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 WK.forEach(w=>{
  if(w.tgt&&!w.got&&Math.hypot(px-w.x,py-w.y)<20){w.got=true;wallets++;heat=1.6;H.sfx('ok');hud.set('w',wallets+'/5');}
 });
 if(heat>0){
  const seen=GD.some(g=>{
   const ddx=px-g.x,ddy=py-g.y,d=Math.hypot(ddx,ddy);
   if(d>140)return false;
   let df=Math.atan2(ddy,ddx)-g.a;
   while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
   return Math.abs(df)<.5;
  });
  if(seen){wanted++;heat=0;H.sfx('bad');hud.set('pr',wanted+'/3');if(wanted>=3){gameOver(false);return;}}
 }
 if(wallets>=5){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 WK.forEach(w=>{
  x.fillStyle=w.tgt&&!w.got?'#E8A33D':'#8A877C';
  x.beginPath();x.arc(w.x,w.y+Math.sin(w.ph)*2,9,0,7);x.fill();
  if(w.tgt&&!w.got){x.font='11px system-ui';x.textAlign='center';x.fillText('i:money',w.x,w.y-12);}
 });
 GD.forEach(g=>{
  x.fillStyle='rgba(217,78,52,.25)';x.beginPath();x.moveTo(g.x,g.y);x.arc(g.x,g.y,140,g.a-.5,g.a+.5);x.fill();
  x.font='18px system-ui';x.textAlign='center';x.fillText('i:eye',g.x,g.y+6);
 });
 x.fillStyle=heat>0?'#D94E34':'#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.stroke();
 if(heat>0){x.fillStyle='#D94E34';x.font='bold 13px system-ui';x.textAlign='center';x.fillText('SUMA!',px,py-16);}
});
}});
