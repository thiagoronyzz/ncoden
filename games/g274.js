/* NCODE N · 274 Camuflagem na Floresta — suma no verde! */
GREG(274,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,spot=0,lives=3,t=0;
const BUSH=[[60,320,90,60],[200,340,110,60],[340,320,80,60],[120,180,100,70],[280,150,120,70],[60,60,80,60],[320,50,100,60]];
const SOL=[
 {x:150,y:250,a:0,sp:.5},
 {x:330,y:150,a:2,sp:-.45},
 {x:230,y:60,a:4,sp:.55}
];
const hud=H.hud(root,[['v','VIDAS',3],['av','AVISTADO','0%']]);
const say=H.msg(root,'Chegue à saída 🚪! Dentro dos arbustos você some. Binóculos têm visão longa e estreita!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
const inBush=()=>BUSH.some(s=>px>=s[0]&&px<=s[0]+s[2]&&py>=s[1]&&py<=s[1]+s[3]);
function seen(){
 return SOL.some(s=>{
  const dx=px-s.x,dy=py-s.y,d=Math.hypot(dx,dy);
  if(d>260)return false;
  let df=Math.atan2(dy,dx)-s.a;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  return Math.abs(df)<.22;
 });
}
function gameOver(win){over=true;const sc=win?350+lives*100:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🌿 Invisível na mata!',sub:'Atravessou sem ser visto.'}:{win:false,score:sc,title:'Avistado!',sub:'Os binóculos te acharam. Use os arbustos!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 SOL.forEach(s=>s.a+=s.sp*dt);
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const hid=inBush(),s=!hid&&seen();
 if(s)spot+=80*dt;else spot=Math.max(0,spot-60*dt);
 hud.set('av',(Math.min(100,spot)|0)+'%');
 if(spot>=100){lives--;spot=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#2E4A2A';x.fillRect(0,0,460,460);
 BUSH.forEach(s=>{x.fillStyle='#3E7C4F';x.beginPath();x.ellipse(s[0]+s[2]/2,s[1]+s[3]/2,s[2]/2,s[3]/2,0,0,7);x.fill();});
 x.fillStyle='#C4D645';x.fillRect(406,8,46,46);x.fillStyle='#181816';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 SOL.forEach(s=>{
  x.fillStyle='rgba(232,163,61,.3)';x.beginPath();x.moveTo(s.x,s.y);x.arc(s.x,s.y,260,s.a-.22,s.a+.22);x.fill();
  x.font='18px system-ui';x.fillText('🔭',s.x,s.y+6);
 });
 x.fillStyle=hid?'#3E7C4F':s?'#D94E34':'#E8A33D';
 x.beginPath();x.arc(px,py,10,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=2;x.stroke();
});
}});
