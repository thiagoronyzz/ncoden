/* NCODE N · 273 Infiltração Submarina — burle o sonar! */
GREG(273,{
init(root,H){
let over=false,px=40,py=380,tx=px,ty=py,exp=0,lives=3,t=0,plant=0;
const EMIT=[{x:150,y:120},{x:330,y:280}];
const DEV={x:415,y:60};
let rings=[];
const hud=H.hud(root,[['v','VIDAS',3],['pl','INSTALAÇÃO','0%']]);
const say=H.msg(root,'Chegue ao terminal e fique parado para instalar (3s)! Anéis de sonar revelam — fuja das bordas dos anéis!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?350+lives*100:plant|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'Fantasma das profundezas!',sub:'Dispositivo instalado sem um ping.'}:{win:false,score:sc,title:'Detectado!',sub:'O sonar te localizou. Desvie dos anéis!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 EMIT.forEach((e,i)=>{if(((t+i*1.4)%2.8)<dt*1.2)rings.push({x:e.x,y:e.y,r:8});});
 rings.forEach(r=>r.r+=95*dt);
 rings=rings.filter(r=>r.r<420);
 const sp=120*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const pinged=rings.some(r=>Math.abs(Math.hypot(px-r.x,py-r.y)-r.r)<11);
 if(pinged){exp+=95*dt;H.sfx('bad');}else exp=Math.max(0,exp-60*dt);
 if(exp>=100){lives--;exp=0;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=40;py=380;tx=px;ty=py;}
 if(Math.hypot(px-DEV.x,py-DEV.y)<34){plant+=dt/3*100;hud.set('pl',Math.min(100,plant|0)+'%');if(plant>=100){gameOver(true);return;}}
 else plant=Math.max(0,plant-40*dt);
 x.fillStyle='#12303C';x.fillRect(0,0,460,460);
 EMIT.forEach(e=>{x.fillStyle='#E8A33D';x.beginPath();x.arc(e.x,e.y,9,0,7);x.fill();});
 rings.forEach(r=>{x.strokeStyle='rgba(232,163,61,.6)';x.lineWidth=3;x.beginPath();x.arc(r.x,r.y,r.r,0,7);x.stroke();});
 x.font='30px system-ui';x.textAlign='center';x.fillText('i:tv',DEV.x,DEV.y+10);
 x.strokeStyle='#C4D645';x.lineWidth=2;x.beginPath();x.arc(DEV.x,DEV.y,34,0,7);x.stroke();
 x.fillStyle=pinged?'#D94E34':'#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#000';x.fillRect(10,436,200,12);
 x.fillStyle='#E8A33D';x.fillRect(10,436,200*Math.min(1,exp/100),12);
});
}});
