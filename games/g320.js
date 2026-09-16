/* NCODE N · 320 Naufrágio — nade e sinalize! */
GREG(320,{
init(root,H){
let over=false,px=60,py=300,stam=100,t=0,sig=0,phase='swim';
const DEB=[];
for(let i=0;i<12;i++)DEB.push({x:100+Math.random()*600,y:100+Math.random()*320,hit:false});
const hud=H.hud(root,[['f','FÔLEGO','100%'],['s','SINAL','0%']]);
const say=H.msg(root,'Nade até a praia 🏖️ desviando dos destroços! Lá, fique parado para acender a fogueira de sinalização!');
const o=H.cvs(root,560,420),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx-cam;ty=qy;});
let tx=null,ty=null,cam=0;
function gameOver(win){over=true;const sc=win?Math.max(200,500-(t|0)*5):px/8|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🔥 Resgatado!',sub:'Sinalização acesa!'}:{win:false,score:sc|0,title:'À deriva!',sub:stam<=0?'Fôlego zerado — nade com calma!':'Os destroços te pegaram. Desvie!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=140*dt;
 let moving=false;
 if(dn.ArrowLeft||dn.KeyA){px-=sp;moving=true;}
 if(dn.ArrowRight||dn.KeyD){px+=sp;moving=true;}
 if(dn.ArrowUp||dn.KeyW){py-=sp;moving=true;}
 if(dn.ArrowDown||dn.KeyS){py+=sp;moving=true;}
 if(tx!=null){const d=Math.hypot(tx-px,ty-py);if(d>8){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;moving=true;}}
 px=H.clamp(px,30,770);py=H.clamp(py,60,380);
 if(moving)stam-=dt*6;else stam=Math.min(100,stam+dt*10);
 DEB.forEach(d=>{
  if(!d.hit&&Math.hypot(px-d.x,py-d.y)<26){d.hit=true;stam-=22;H.sfx('bad');}
 });
 hud.set('f',Math.max(0,stam|0)+'%');
 if(stam<=0){gameOver(false);return;}
 if(px>=730){
  phase='sig';
  if(!moving){sig+=dt/4*100;hud.set('s',Math.min(100,sig|0)+'%');}
  if(sig>=100){gameOver(true);return;}
 }
 cam=H.clamp(px-140,0,240);
 x.fillStyle='#2E6E8A';x.fillRect(0,0,560,420);
 x.fillStyle='#E8C86B';x.fillRect(730-cam,0,90,420);
 x.font='30px system-ui';x.textAlign='center';x.fillText('🏖️',765-cam,60);
 DEB.forEach(d=>{if(!d.hit){x.font='22px system-ui';x.fillText('🛢️',d.x-cam,d.y);}});
 x.font='30px system-ui';x.fillText('🏊',px-cam,py+10);
 if(phase==='sig'){x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';x.fillText('🔥 Acendendo: '+(sig|0)+'% — fique PARADO!',14,30);}
});
}});
