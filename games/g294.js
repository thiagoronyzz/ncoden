/* NCODE N · 294 Caiaque em Corredeiras — passe nos checks! */
GREG(294,{
init(root,H){
let over=false,px=230,dist=0,t=0,checks=0,lives=3;
const CK=[];
for(let i=0;i<10;i++)CK.push({y:-i*600-400,gx:100+Math.random()*260,got:false});
const ROCKS=[];
for(let i=0;i<30;i++)ROCKS.push({x:50+Math.random()*360,y:-i*260-150,hit:false});
const hud=H.hud(root,[['c','CHECKS','0/10'],['v','VIDAS',3]]);
const say=H.msg(root,'Passe pelos portões verdes ✅ e desvie das pedras! A correnteza empurra — ⬅️➡️ remam.');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(win){over=true;const sc=checks*100+lives*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'🚣 Corredeira vencida!',sub:'10/10 checks!'}:{win:false,score:sc,title:'Virou o caiaque!',sub:checks+'/10 checks. Desvie das pedras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 const cur=Math.sin(t*1.3+dist*.002)*90;
 if(L)px-=200*dt;if(R)px+=200*dt;
 px+=cur*dt;px=H.clamp(px,46,414);
 dist+=200*dt;
 CK.forEach(c=>{
  const cy=c.y+dist;
  if(!c.got&&cy>430&&cy<470&&Math.abs(px-c.gx)<50){c.got=true;checks++;H.sfx('ok');hud.set('c',checks+'/10');}
 });
 ROCKS.forEach(r=>{
  const ry=r.y+dist;
  if(!r.hit&&Math.abs(ry-430)<24&&Math.abs(r.x-px)<28){
   r.hit=true;lives--;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver(false);return;}
  }
 });
 if(checks>=10){gameOver(true);return;}
 if(dist>6600){gameOver(checks>=8);return;}
 x.fillStyle='#3EAFBF';x.fillRect(0,0,460,520);
 x.strokeStyle='rgba(255,255,255,.5)';x.lineWidth=2;
 for(let i=0;i<26;i++){const wy=(i*79+dist*1.2)%560-20;x.beginPath();x.moveTo((i*149)%440,wy);x.lineTo((i*149)%440+36,wy);x.stroke();}
 x.fillStyle='#5A4A33';x.fillRect(0,0,36,520);x.fillRect(424,0,36,520);
 CK.forEach(c=>{
  const cy=c.y+dist;
  if(cy<-30||cy>550)return;
  x.fillStyle=c.got?'#3E7C4F':'#C4D645';
  x.fillRect(c.gx-50,cy-6,100,12);
 });
 ROCKS.forEach(r=>{
  const ry=r.y+dist;
  if(ry<-20||ry>540)return;
  x.fillStyle=r.hit?'#D94E34':'#5A5A55';x.beginPath();x.arc(r.x,ry,13,0,7);x.fill();
 });
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚣',px,442);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('✅ '+checks+'/10  ❤️'.repeat(1)+' '+lives+'  Corrente '+(cur>0?'▶':'◀'),12,26);
});
}});
