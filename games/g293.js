/* NCODE N · 293 Roller Derby — passe e pontue! */
GREG(293,{
init(root,H){
let over=false,t=0,time=75,score=0,py=230,px=80,sp=0;
const OPP=[];
for(let i=0;i<6;i++)OPP.push({a:i/6*6.28,sp:.5+Math.random()*.3,lap:0});
let passed={};
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',75]]);
const say=H.msg(root,'Você é a jammer ⭐! ⬆️ acelera, ⬅️➡️ mudam de faixa. Ultrapasse rivais para pontuar. Meta: 12 pontos em 75s!');
const o=H.cvs(root,460,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
const CX=230,CY=200,RX=170,RY=120;
function pos(a,lane){return{x:CX+Math.cos(a)*(RX+lane*22),y:CY+Math.sin(a)*(RY+lane*14)};}
let ma=0,lane=0;
function gameOver(){over=true;const win=score>=12;H.score(score*50);
H.done(win?{win:true,score:score*50,title:'⭐ Jammer estrela!',sub:score+' ultrapassagens!'}:{win:false,score:score*50,title:'Fim do jam!',sub:score+'/12 pontos. Acelere nas retas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 const up=dn.ArrowUp||dn.KeyW;
 if(dn.ArrowLeft||dn.KeyA)lane=Math.max(-1,lane-3*dt);
 if(dn.ArrowRight||dn.KeyD)lane=Math.min(1,lane+3*dt);
 sp+=((up?2.2:1.1)-sp)*2*dt;
 ma+=sp*dt;
 OPP.forEach((op,i)=>{
  const pa=op.a;
  op.a+=op.sp*dt;
  let rel=((ma-op.a)%6.28+6.28)%6.28;
  let relP=((ma-sp*dt-pa)%6.28+6.28)%6.28;
  if(relP>3&&rel<=3||relP<3&&rel>=3&&false){}
  if(rel<.15&&!passed[i]){passed[i]=1;score++;H.sfx('ok');hud.set('pt',score);}
  if(rel>.5)passed[i]=0;
 });
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver();return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,400);
 x.strokeStyle='#8A877C';x.lineWidth=64;
 x.beginPath();x.ellipse(CX,CY,RX,RY,0,0,7);x.stroke();
 x.strokeStyle='#EDE8DC';x.lineWidth=56;
 x.beginPath();x.ellipse(CX,CY,RX,RY,0,0,7);x.stroke();
 OPP.forEach(op=>{
  const p=pos(op.a,0);
  x.fillStyle='#2E6E8A';x.beginPath();x.arc(p.x,p.y,11,0,7);x.fill();
 });
 const mp=pos(ma,lane);
 x.fillStyle='#D94E34';x.beginPath();x.arc(mp.x,mp.y,12,0,7);x.fill();
 x.fillStyle='#fff';x.font='bold 12px system-ui';x.textAlign='center';x.fillText('★',mp.x,mp.y+4);
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(score+' pts · ⏱️'+Math.ceil(time)+'s · meta 12',12,26);
});
}});
