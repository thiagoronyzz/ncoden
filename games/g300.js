/* NCODE N · 300 Patinação no Gelo — incline nas curvas! */
GREG(300,{
init(root,H){
const CURVES=[{x:500,dir:1},{x:1200,dir:-1},{x:1900,dir:1},{x:2600,dir:-1}];
let over=false,px=0,sp=0,lean=0,t=0,off=0;
const hud=H.hud(root,[['v','VEL','0'],['d','DIST','0%']]);
const say=H.msg(root,'⬆️ acelera, ⬅️➡️ inclinam! Nas curvas, incline para o lado indicado ou derrapa para fora. Complete a pista!');
const o=H.cvs(root,560,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function curveAt(x2){
 for(const c of CURVES)if(Math.abs(x2-c.x)<220)return c;
 return null;
}
function gameOver(win){over=true;const sc=win?Math.max(250,800-(t|0)*8):px/32|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'⛸️ Volta perfeita!',sub:'Em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Derrapou para fora!',sub:'Incline com força nas curvas sinalizadas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const up=dn.ArrowUp||dn.KeyW;
 sp+=((up?300:170)-sp)*1.5*dt;
 if(dn.ArrowLeft||dn.KeyA)lean-=2.4*dt;
 if(dn.ArrowRight||dn.KeyD)lean+=2.4*dt;
 lean=H.clamp(lean,-1.4,1.4);
 if(!dn.ArrowLeft&&!dn.ArrowRight&&!dn.KeyA&&!dn.KeyD)lean*=.95;
 px+=sp*dt;
 const c=curveAt(px);
 if(c){
  const need=c.dir*(sp/300);
  off+=(Math.abs(lean-need)>.55?1:-2)*dt*sp/200;
 }else off=Math.max(0,off-3*dt);
 off=H.clamp(off,0,1);
 hud.set('v',sp|0);hud.set('d',Math.min(99,px/3200*100|0)+'%');
 if(off>=1){gameOver(false);return;}
 if(px>=3200){gameOver(true);return;}
 const cam=px-140;
 x.fillStyle='#DCEEF5';x.fillRect(0,0,560,340);
 x.fillStyle='#fff';x.fillRect(0,120,560,140);
 CURVES.forEach(q=>{
  const qx=q.x-cam;
  if(qx>-260&&qx<620){
   x.fillStyle='rgba(217,78,52,.25)';x.fillRect(qx-220,120,440,140);
   x.fillStyle='#D94E34';x.font='bold 40px system-ui';x.textAlign='center';
   x.fillText(q.dir>0?'➡️':'⬅️',qx,200);
  }
 });
 x.save();x.translate(140,190);x.rotate(lean*.5);
 x.font='36px system-ui';x.textAlign='center';x.fillText('⛸️',0,12);x.restore();
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Derrapagem',12,300);
 x.fillStyle='#000';x.fillRect(120,290,300,14);
 x.fillStyle=off>.6?'#D94E34':'#E8A33D';x.fillRect(120,290,300*off,14);
 if(c){x.fillStyle='#D94E34';x.font='bold 18px system-ui';x.fillText('CURVA '+(c.dir>0?'➡️':'⬅️')+'!',200,60);}
});
}});
