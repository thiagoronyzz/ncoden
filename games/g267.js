/* NCODE N · 267 Ponto Cego da Câmera — dance entre os cones! */
GREG(267,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,det=0,lives=3,t=0,freeze=0,charges=3;
const CAMS=[
 {x:90,y:330,a:0,sp:.6,r:170},
 {x:370,y:330,a:2,sp:-.5,r:170},
 {x:230,y:200,a:1,sp:.7,r:180},
 {x:90,y:70,a:3,sp:-.6,r:160},
 {x:370,y:70,a:5,sp:.55,r:160}
];
const hud=H.hud(root,[['v','VIDAS',3],['dt','DETECÇÃO','0%'],['fr','TRAVAR',3]]);
const say=H.msg(root,'Chegue à saída 🚪! Câmeras giram — ande pelos pontos cegos. Botão TRAVAR congela tudo por 4s!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'📷 Travar câmeras ('+charges+')',()=>{
 if(over||charges<=0||freeze>0)return;
 charges--;freeze=4;H.sfx('ok');hud.set('fr',charges);
},false);
function seen(){
 return CAMS.some(cm=>{
  const dx=px-cm.x,dy=py-cm.y,d=Math.hypot(dx,dy);
  if(d>cm.r)return false;
  let df=Math.atan2(dy,dx)-cm.a;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  return Math.abs(df)<.38;
 });
}
function gameOver(win){over=true;const sc=win?350+lives*100+charges*30:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'📷 Fantasma!',sub:'Nenhuma câmera te registrou.'}:{win:false,score:sc,title:'Gravado!',sub:'A detecção encheu. Congele nas horas críticas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(freeze>0)freeze-=dt;else CAMS.forEach(cm=>cm.a+=cm.sp*dt);
 const sp=125*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const s=freeze>0?false:seen();
 if(s)det+=85*dt;else det=Math.max(0,det-55*dt);
 hud.set('dt',((det|0))+'%');
 if(det>=100){lives--;H.sfx('bad');det=0;if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#20242C';x.fillRect(0,0,460,460);
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('🚪',429,42);
 CAMS.forEach(cm=>{
  x.fillStyle=freeze>0?'rgba(196,214,69,.15)':'rgba(217,78,52,.25)';
  x.beginPath();x.moveTo(cm.x,cm.y);x.arc(cm.x,cm.y,cm.r,cm.a-.38,cm.a+.38);x.fill();
  x.fillStyle=freeze>0?'#C4D645':'#D94E34';
  x.beginPath();x.arc(cm.x,cm.y,10,0,7);x.fill();x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 });
 x.fillStyle=s?'#D94E34':'#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.fillStyle='#000';x.fillRect(10,436,220,14);
 x.fillStyle=det>60?'#D94E34':'#E8A33D';x.fillRect(10,436,220*Math.min(1,det/100),14);
 x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='left';x.fillText('DETECÇÃO'+(freeze>0?' · CONGELADO '+freeze.toFixed(1)+'s':''),14,447);
 hud.set('v',lives);
});
}});
