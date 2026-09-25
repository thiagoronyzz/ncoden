/* NCODE N · 354 Cratera do Vulcão — colete gases! */
GREG(354,{
init(root,H){
let over=false,px=230,py=400,tx=px,ty=py,t=0,samples=0,lives=3,warn=null;
const VENTS=[{x:120,y:140},{x:230,y:100},{x:340,y:140}];
const hud=H.hud(root,[['a','AMOSTRAS','0/5'],['v','VIDAS',3]]);
const say=H.msg(root,'Fique perto das fumarolas para coletar (2s cada)! Círculo vermelho = erupção chegando — SAIA! 5 amostras!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
let collect=0;
function gameOver(win){over=true;const sc=samples*70+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Pesquisa completa!',sub:'5 amostras de gás!'}:{win:false,score:sc,title:'Queimou!',sub:samples+'/5 amostras. Fuja do vermelho!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=150*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,20,440);py=H.clamp(py,20,440);
 if(!warn&&Math.random()<dt*.8){
  const v=VENTS[(Math.random()*3)|0];
  warn={x:v.x,y:v.y,t:1.6};
 }
 if(warn){
  warn.t-=dt;
  if(warn.t<=0){
   if(Math.hypot(px-warn.x,py-warn.y)<70){
    lives--;H.sfx('bad');hud.set('v',lives);
    if(lives<=0){gameOver(false);return;}
   }
   warn=null;
  }
 }
 const near=VENTS.some(v=>Math.hypot(px-v.x,py-v.y)<44);
 if(near){collect+=dt;if(collect>=2){collect=0;samples++;H.sfx('ok');hud.set('a',samples+'/5');if(samples>=5){gameOver(true);return;}}}
 else collect=0;
 x.fillStyle='#3A3A35';x.fillRect(0,0,460,460);
 x.fillStyle='#D94E34';x.beginPath();x.ellipse(230,110,140,60,0,0,7);x.fill();
 x.fillStyle='#B23A24';x.beginPath();x.ellipse(230,110,100,40,0,0,7);x.fill();
 VENTS.forEach(v=>{
  x.font='26px system-ui';x.textAlign='center';
  x.fillText('i:smoke',v.x,v.y+Math.sin(t*3)*4);
 });
 if(warn){
  x.strokeStyle='#D94E34';x.lineWidth=4;
  x.beginPath();x.arc(warn.x,warn.y,70,0,7);x.stroke();
  x.fillStyle='rgba(217,78,52,.3)';x.fill();
 }
 x.fillStyle='#E8A33D';x.beginPath();x.arc(px,py,11,0,7);x.fill();
 x.strokeStyle='#000';x.lineWidth=2;x.stroke();
 if(near){x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='center';x.fillText('coletando '+((collect/2*100)|0)+'%',px,py-18);}
});
}});
