/* NCODE N · 333 Tempestade de Areia — ache o oásis! */
GREG(333,{
init(root,H){
let over=false,px=60,py=400,tx=px,ty=py,water=100,t=0;
const OAS={x:400,y:70};
const hud=H.hud(root,[['a','ÁGUA','100%']]);
const say=H.msg(root,'Atravesse até o oásis 🌴! A visibilidade é curta — siga a bússola (seta). Água acaba = fim!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?Math.max(150,450-(t|0)*4):40;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌴 Oásis encontrado!',sub:'Água fresca!'}:{win:false,score:sc|0,title:'Perdido na tempestade!',sub:'Siga a seta da bússola!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 water-=dt*2.6;
 const sp=130*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 hud.set('a',Math.max(0,water|0)+'%');
 if(water<=0){gameOver(false);return;}
 if(Math.hypot(px-OAS.x,py-OAS.y)<30){gameOver(true);return;}
 x.fillStyle='#D9B36B';x.fillRect(0,0,460,460);
 x.fillStyle='rgba(217,179,107,.85)';
 for(let i=0;i<30;i++){const sx=(i*173+t*220)%520-30,sy=(i*97+t*60)%500-20;x.fillRect(sx,sy,46,10);}
 const dO=Math.hypot(px-OAS.x,py-OAS.y);
 if(dO<140){x.font='40px system-ui';x.textAlign='center';x.fillText('🌴',OAS.x,OAS.y);}
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.stroke();
 const a=Math.atan2(OAS.y-py,OAS.x-px);
 x.strokeStyle='#D94E34';x.lineWidth=4;
 x.beginPath();x.moveTo(px,py-24);x.lineTo(px+Math.cos(a)*22,py-24+Math.sin(a)*22);x.stroke();
 x.fillStyle='#181816';x.font='bold 12px system-ui';x.textAlign='center';x.fillText('BÚSSOLA',px,py-32);
});
}});
