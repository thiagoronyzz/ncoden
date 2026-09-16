/* NCODE N · 305 Segway City — desvie e equilibre! */
GREG(305,{
init(root,H){
let over=false,px=230,bal=0,dist=0,score=0,lives=3,t=0;
const PED=[];
for(let i=0;i<30;i++)PED.push({x:50+Math.random()*360,y:-i*330-200,hit:false,vx:(Math.random()-.5)*60});
const hud=H.hud(root,[['v','VIDAS',3],['pt','PONTOS',0]]);
const say=H.msg(root,'⬅️➡️ movem E equilibram! Desvie dos pedestres 🚶 e não deixe o equilíbrio zerar. Meta: 600 pontos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(){over=true;const win=score>=600;H.score(score|0);
H.done(win?{win:true,score:score|0,title:'🛴 Rei da calçada!',sub:(score|0)+' pontos!'}:{win:false,score:score|0,title:'Tombou!',sub:(score|0)+'/600 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 if(L){px-=220*dt;bal-=50*dt;}
 if(R){px+=220*dt;bal+=50*dt;}
 bal+=Math.sin(t*2.2)*24*dt;
 bal=H.clamp(bal,-100,100);
 if(!L&&!R)bal*=.99;
 px=H.clamp(px,46,414);
 dist+=210*dt;score+=dt*22;
 if(Math.abs(bal)>=100){lives--;bal=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver();return;}}
 PED.forEach(p=>{
  p.x+=p.vx*dt;
  const py=p.y+dist;
  if(!p.hit&&Math.abs(py-430)<26&&Math.abs(p.x-px)<28){p.hit=true;lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver();return;}}
 });
 hud.set('pt',score|0);
 if(dist>=10000){gameOver();return;}
 x.fillStyle='#B9B5A8';x.fillRect(0,0,460,520);
 x.fillStyle='#8A877C';
 for(let i=0;i<20;i++)x.fillRect(0,(i*60+dist)%560-20,460,3);
 PED.forEach(p=>{
  const py=p.y+dist;
  if(py<-20||py>540)return;
  x.font='24px system-ui';x.textAlign='center';x.fillText(p.hit?'💥':'🚶',p.x,py+8);
 });
 x.save();x.translate(px,430);x.rotate(bal/300);
 x.font='32px system-ui';x.textAlign='center';x.fillText('🛴',0,10);x.restore();
 x.fillStyle='#181816';x.fillRect(130,16,200,12);
 x.fillStyle=Math.abs(bal)>70?'#D94E34':'#3E7C4F';x.fillRect(230+bal-4,12,8,20);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText((score|0)+' pts · ❤️'.repeat(1)+' '+lives+' · meta 600',12,50);
});
}});
