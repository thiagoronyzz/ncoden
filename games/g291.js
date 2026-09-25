/* NCODE N · 291 Jet Ski — salte as ondas! */
GREG(291,{
init(root,H){
let over=false,px=230,dist=0,sp=240,air=0,vy=0,score=0,t=0;
const RAMPS=[];
for(let i=0;i<10;i++)RAMPS.push({x:60+Math.random()*340,y:-i*700-400,used:false});
const BUOY=[];
for(let i=0;i<24;i++)BUOY.push({x:40+Math.random()*380,y:-i*350-200,hit:false});
const hud=H.hud(root,[['pt','PONTOS',0],['d','DIST','0%']]);
const say=H.msg(root,'Passe pelas rampas para saltar e fazer pontos! Desvie das boias. ←→ viram, ↑ turbo. Meta: 800 pontos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(){over=true;const win=score>=800;H.score(score);
H.done(win?{win:true,score,title:'Rei do jet!',sub:score+' pontos!'}:{win:false,score,title:'Fim do percurso!',sub:score+'/800 pontos. Acerte as rampas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const up=dn.ArrowUp||dn.KeyW,L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 sp+=((up?340:230)-sp)*2*dt;
 if(L)px-=240*dt;if(R)px+=240*dt;
 px=H.clamp(px,36,424);
 dist+=sp*dt;
 if(air>0){air-=dt;vy-=900*dt;}
 RAMPS.forEach(r=>{
  const ry=r.y+dist;
  if(!r.used&&air<=0&&Math.abs(ry-430)<24&&Math.abs(r.x-px)<34){
   r.used=true;air=.9;H.sfx('ok');score+=100;hud.set('pt',score);
  }
 });
 BUOY.forEach(b=>{
  const by=b.y+dist;
  if(!b.hit&&air<=0&&Math.abs(by-430)<20&&Math.abs(b.x-px)<24){b.hit=true;sp=120;H.sfx('bad');}
 });
 score+=air>0?dt*60:0;
 hud.set('pt',score|0);hud.set('d',Math.min(99,dist/7400*100|0)+'%');
 if(dist>=7400){gameOver();return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,460,520);
 x.strokeStyle='rgba(255,255,255,.3)';x.lineWidth=2;
 for(let i=0;i<24;i++){const wy=(i*83+dist)%560-20;x.beginPath();x.moveTo((i*167)%440,wy);x.lineTo((i*167)%440+30,wy);x.stroke();}
 RAMPS.forEach(r=>{
  const ry=r.y+dist;
  if(ry<-30||ry>550)return;
  x.fillStyle=r.used?'#8A877C':'#E8A33D';
  x.beginPath();x.moveTo(r.x-30,ry+14);x.lineTo(r.x+30,ry+14);x.lineTo(r.x+30,ry-14);x.fill();
 });
 BUOY.forEach(b=>{
  const by=b.y+dist;
  if(by<-20||by>540)return;
  x.fillStyle=b.hit?'#D94E34':'#fff';x.beginPath();x.arc(b.x,by,10,0,7);x.fill();
 });
 const jy=430-(air>0?Math.sin((0.9-air)/0.9*Math.PI)*90:0);
 x.font='32px system-ui';x.textAlign='center';x.fillText('i:boat',px,jy);
 if(air>0){x.fillStyle='#C4D645';x.font='bold 18px system-ui';x.fillText('NO AR! +'+(60*dt|0),px,jy-30);}
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText((score|0)+' pts  '+(dist/7400*100|0)+'%  meta 800',12,26);
});
}});
