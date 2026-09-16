/* NCODE N · 287 Salto de Esqui — voe longe! */
GREG(287,{
init(root,H){
let over=false,phase='down',sp=0,px=0,py=0,vy=0,lean=0,jump=1,best=0,t=0;
const hud=H.hud(root,[['s','SALTO','1/3'],['d','MELHOR','0m']]);
const say=H.msg(root,'⬇️ agacha na descida (mais velocidade)! Na rampa, ⬅️➡️ ajustam a inclinação do voo. Pouse reto! Melhor de 3 saltos.');
const o=H.cvs(root,560,360),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function rampY(x2){return x2<300?60+x2*.5:210-(x2-300)*.28;}
function landY(x2){return x2<330?400:400-(x2-330)*.55;}
function gameOver(){over=true;const win=best>=70;H.score(best|0);
H.done(win?{win:true,score:best|0,title:'🎿 Voo incrível!',sub:'Melhor salto: '+best.toFixed(1)+'m.'}:{win:false,score:best|0,title:'Saltos curtos!',sub:'Melhor: '+best.toFixed(1)+'m. Agache mais na descida!'});}
function nextJump(crash,d){
 if(crash){say('💥 Queda! Pouse com o corpo reto (incline ⬅️➡️).');}
 else{best=Math.max(best,d);hud.set('d',best.toFixed(1)+'m');say('Salto de '+d.toFixed(1)+'m!');}
 jump++;
 if(jump>3){gameOver();return;}
 hud.set('s',jump+'/3');
 phase='down';sp=0;lean=0;t=0;
}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(phase==='down'){
  const tuck=dn.ArrowDown||dn.KeyS;
  sp+=((tuck?120:70)-sp)*1.5*dt;
  px+=sp*dt*3;
  if(px>=300){phase='fly';px=300;py=rampY(300);vy=-60-sp*.5;}
 }else if(phase==='fly'){
  if(dn.ArrowLeft||dn.KeyA)lean-=1.6*dt;
  if(dn.ArrowRight||dn.KeyD)lean+=1.6*dt;
  lean=H.clamp(lean,-1,1);
  vy+=260*dt-lean*60*dt;
  px+=(60+sp*.6)*dt;py+=vy*dt;
  if(py>=landY(px)-8){
   const d=(px-330)*.35;
   if(Math.abs(lean)>.55||vy>260)nextJump(true,0);
   else nextJump(false,Math.max(5,d));
   px=0;py=0;vy=0;
  }
 }else{px=0;}
 if(phase==='down'&&px>300)px=300;
 x.fillStyle='#BFD9E2';x.fillRect(0,0,560,360);
 x.fillStyle='#fff';
 x.beginPath();x.moveTo(0,400);
 for(let sx=0;sx<=560;sx+=10)x.lineTo(sx,Math.min(400,landY(sx)));
 x.lineTo(560,400);x.fill();
 x.strokeStyle='#8A6A2F';x.lineWidth=8;
 x.beginPath();x.moveTo(0,60);x.lineTo(300,rampY(300));x.stroke();
 let jx,jy,rot;
 if(phase==='down'){jx=px; jy=rampY(Math.min(300,px))-14;rot=.46;}
 else{jx=px; jy=py;rot=lean*.7;}
 x.save();x.translate(H.clamp(jx,20,540),jy);x.rotate(rot);
 x.font='26px system-ui';x.textAlign='center';x.fillText('🎿',0,8);x.restore();
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText(phase==='down'?'DESCIDA — segure ⬇️! Vel '+sp.toFixed(0):'VOO! Incline ⬅️➡️',12,28);
 x.fillText('Salto '+jump+'/3 · Melhor '+best.toFixed(1)+'m',12,50);
});
}});
