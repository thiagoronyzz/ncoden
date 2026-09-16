/* NCODE N · 270 Museu à Noite — fotografe os artefatos! */
GREG(270,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,photos=0,alerts=0,t=0,flash=0;
const ART=[{x:120,y:120,g:false},{x:340,y:120,g:false},{x:230,y:230,g:false},{x:120,y:340,g:false},{x:340,y:340,g:false}];
const GD=[
 {wp:[[60,60],[400,60]],i:0,sp:60,x:60,y:60,a:0},
 {wp:[[400,400],[60,400]],i:0,sp:75,x:400,y:400,a:Math.PI}
];
const hud=H.hud(root,[['f','FOTOS','0/5'],['a','ALERTAS','0/3']]);
const say=H.msg(root,'Chegue perto dos artefatos 🏺 e toque em FOTOGRAFAR! O flash denuncia se um cone te vir. Depois, fuja pela saída 🚪!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const a=ART.find(q=>!q.g&&Math.hypot(px-q.x,py-q.y)<55);
 if(!a){H.sfx('bad');return;}
 a.g=true;photos++;flash=.6;H.sfx('ok');
 hud.set('f',photos+'/5');
 if(inCone()){alerts++;H.sfx('bad');hud.set('a',alerts+'/3');if(alerts>=3){gameOver(false);return;}}
},true);
function inCone(){
 return GD.some(g=>{
  const dx=px-g.x,dy=py-g.y,d=Math.hypot(dx,dy);
  if(d>140)return false;
  let df=Math.atan2(dy,dx)-g.a;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  return Math.abs(df)<.45;
 });
}
function gameOver(win){over=true;const sc=win?400+(3-alerts)*80:photos*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'📸 Exposição roubada!',sub:'5 artefatos fotografados.'}:{win:false,score:sc,title:'Alarme!',sub:photos+'/5 fotos. Fotografe fora dos cones!'});}
H.loop(dt=>{
 if(over)return;t+=dt;if(flash>0)flash-=dt;
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
 if(photos>=5&&px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#2A2620';x.fillRect(0,0,460,460);
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 ART.forEach(a=>{
  if(a.g)return;
  x.fillStyle='rgba(196,214,69,.15)';x.beginPath();x.arc(a.x,a.y,55,0,7);x.fill();
  x.font='26px system-ui';x.fillText('🏺',a.x,a.y+9);
 });
 GD.forEach(g=>{
  x.fillStyle='rgba(232,163,61,.3)';x.beginPath();x.moveTo(g.x,g.y);x.arc(g.x,g.y,140,g.a-.45,g.a+.45);x.fill();
  x.fillStyle='#2E6E8A';x.beginPath();x.arc(g.x,g.y,11,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 });
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();x.strokeStyle='#000';x.stroke();
 if(flash>0){x.strokeStyle='rgba(255,255,255,'+flash+')';x.lineWidth=4;x.beginPath();x.arc(px,py,20+(0.6-flash)*60,0,7);x.stroke();}
});
}});
