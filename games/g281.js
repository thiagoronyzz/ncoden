/* NCODE N · 281 Kart — 3 voltas com boost! */
GREG(281,{
init(root,H){
const WP=[[230,400],[80,400],[60,230],[80,70],[230,50],[380,70],[400,230],[380,400]];
const BOOST=[{x:230,y:225,r:22},{x:80,y:230,r:22}];
let over=false,px=230,py=360,a=-Math.PI/2,v=0,lap=0,chk=0,t=0,boost=0;
let ax=230,ay=330,ai=0,alap=0;
const hud=H.hud(root,[['v','VOLTA','1/3'],['tp','TEMPO','0.0'],['pos','POS','1º']]);
const say=H.msg(root,'3 voltas! Passe pelos ⚡ para turbo. Grama diminui. Vença o kart azul! Setas ou toque nos lados.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{steer=qx<230?-1:1;setTimeout2();});
let steer=0,sT=0;
function setTimeout2(){sT=.4;}
function onTrack(x2,y2){
 return x2>40&&x2<420&&y2>30&&y2<430&&!(x2>130&&x2<330&&y2>120&&y2<340);
}
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*5):100+lap*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏁 Vitória no kart!',sub:'3 voltas em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Azul venceu!',sub:'Use os turbos ⚡ nas retas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(sT>0)sT-=dt;else steer=0;
 const up=dn.ArrowUp||dn.KeyW,dn2=dn.ArrowDown||dn.KeyS;
 const L=(dn.ArrowLeft||dn.KeyA)||steer<0,R=(dn.ArrowRight||dn.KeyD)||steer>0;
 if(boost>0)boost-=dt;
 const max=boost>0?300:190;
 if(up)v=Math.min(max,v+260*dt);else if(dn2)v=Math.max(-80,v-260*dt);else v*=.985;
 if(!onTrack(px,py))v*=.94;
 if(L)a-=2.6*dt*(v>=0?1:-1);if(R)a+=2.6*dt*(v>=0?1:-1);
 px+=Math.cos(a)*v*dt;py+=Math.sin(a)*v*dt;
 px=H.clamp(px,10,450);py=H.clamp(py,10,450);
 BOOST.forEach(b=>{if(Math.hypot(px-b.x,py-b.y)<b.r){boost=1.6;H.sfx('ok');}});
 const w=WP[chk];
 if(Math.hypot(px-w[0],py-w[1])<45){chk=(chk+1)%WP.length;if(chk===0){lap++;H.sfx('ok');hud.set('v',Math.min(3,lap+1)+'/3');}}
 // rival
 const aw=WP[ai],ad=Math.hypot(aw[0]-ax,aw[1]-ay);
 if(ad<40){ai=(ai+1)%WP.length;if(ai===0)alap++;}
 const aa=Math.atan2(aw[1]-ay,aw[0]-ax);
 ax+=Math.cos(aa)*150*dt;ay+=Math.sin(aa)*150*dt;
 hud.set('tp',t.toFixed(1));
 hud.set('pos',(lap*10+chk)>=(alap*10+ai)?'1º':'2º');
 if(lap>=3){gameOver(true);return;}
 if(alap>=3){gameOver(false);return;}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,460,460);
 x.fillStyle='#8A877C';x.fillRect(40,30,380,400);
 x.fillStyle='#3E7C4F';x.fillRect(130,120,200,220);
 x.strokeStyle='#FAF7F0';x.lineWidth=3;x.strokeRect(40,30,380,400);x.strokeRect(130,120,200,220);
 BOOST.forEach(b=>{x.fillStyle='#C4D645';x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill();x.fillStyle='#181816';x.font='20px system-ui';x.textAlign='center';x.fillText('⚡',b.x,b.y+7);});
 x.fillStyle='#fff';x.fillRect(210,392,40,8);
 WP.forEach((q,i)=>{if(i===chk){x.strokeStyle='#C4D645';x.lineWidth=3;x.beginPath();x.arc(q[0],q[1],18+4*Math.sin(t*6),0,7);x.stroke();}});
 [[ax,ay,'#2E6E8A',0],[px,py,'#D94E34',a]].forEach(k=>{
  x.save();x.translate(k[0],k[1]);x.rotate(k[3]);
  x.fillStyle=k[2];x.fillRect(-12,-8,24,16);
  x.fillStyle='#181816';x.fillRect(-14,-11,5,6);x.fillRect(-14,5,5,6);x.fillRect(9,-11,5,6);x.fillRect(9,5,5,6);
  x.restore();
 });
 if(boost>0){x.fillStyle='#C4D645';x.font='bold 15px system-ui';x.textAlign='center';x.fillText('TURBO!',px,py-18);}
});
}});
