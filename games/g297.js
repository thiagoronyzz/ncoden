/* NCODE N · 297 Corrida de Foguetes — desvie dos asteroides! */
GREG(297,{
init(root,H){
let over=false,px=120,py=260,dist=0,fuel=100,t=0,shield=3;
const AST=[];
for(let i=0;i<40;i++)AST.push({x:500+i*330+Math.random()*150,y:40+Math.random()*440,r:14+Math.random()*22,hit:false});
const FUEL=[];
for(let i=0;i<8;i++)FUEL.push({x:900+i*1300,y:60+Math.random()*400,got:false});
const hud=H.hud(root,[['cb','COMBUSTÍVEL','100%'],['e','ESCUDO',3],['d','DIST','0%']]);
const say=H.msg(root,'Chegue ao planeta ! Setas movem, ↑ gasta mais combustível. Pegue e desvie dos asteroides!');
const o=H.cvs(root,560,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tpx=qx;tpy=qy;});
let tpx=null,tpy=null;
function gameOver(win){over=true;const sc=win?Math.max(250,800-(t|0)*6):dist/150|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'Órbita alcançada!',sub:'Campo de asteroides vencido!'}:{win:false,score:sc,title:'Missão abortada!',sub:fuel<=0?'Sem combustível — pegue os !':'Escudo esgotado. Desvie mais cedo!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD,U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 const sp=U?320:210;
 dist+=sp*dt;
 fuel-=dt*(U?6:3.2);
 if(L)px-=200*dt;if(R)px+=200*dt;if(U)py-=200*dt;if(D)py+=200*dt;
 if(tpx!=null){px+=(tpx-px)*3*dt;py+=(tpy-py)*3*dt;}
 px=H.clamp(px,40,520);py=H.clamp(py,40,480);
 AST.forEach(a=>{
  const ax=a.x-dist*.9;
  if(!a.hit&&Math.abs(ax-px)<a.r+12&&Math.abs(a.y-py)<a.r+12){
   a.hit=true;shield--;H.sfx('bad');hud.set('e',shield);
   if(shield<=0){gameOver(false);return;}
  }
 });
 FUEL.forEach(f=>{
  const fx=f.x-dist*.9;
  if(!f.got&&Math.abs(fx-px)<26&&Math.abs(f.y-py)<26){f.got=true;fuel=Math.min(100,fuel+35);H.sfx('ok');}
 });
 hud.set('cb',(Math.max(0,fuel)|0)+'%');hud.set('d',Math.min(99,dist/14000*100|0)+'%');
 if(fuel<=0){gameOver(false);return;}
 if(dist>=14000){gameOver(true);return;}
 x.fillStyle='#0C0C18';x.fillRect(0,0,560,520);
 x.fillStyle='#fff';
 for(let i=0;i<50;i++){const sx=(i*197-dist*.3%560+560)%560,sy=(i*131)%520;x.fillRect(sx,sy,2,2);}
 AST.forEach(a=>{
  const ax=a.x-dist*.9;
  if(ax>-50&&ax<610){x.fillStyle=a.hit?'#D94E34':'#8A877C';x.beginPath();x.arc(ax,a.y,a.r,0,7);x.fill();}
 });
 FUEL.forEach(f=>{
  const fx=f.x-dist*.9;
  if(!f.got&&fx>-30&&fx<590){x.font='22px system-ui';x.textAlign='center';x.fillText('i:barrel',fx,f.y);}
 });
 x.font='30px system-ui';x.textAlign='center';x.fillText('i:planet',14500-dist*.9>600?600:14500-dist*.9,260);
 x.save();x.translate(px,py);x.rotate(Math.PI/4);
 x.font='28px system-ui';x.fillText('i:rocket',0,9);x.restore();
});
}});
