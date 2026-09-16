/* NCODE N · 344 Sonda Espacial — fotografe o sistema! */
GREG(344,{
init(root,H){
let over=false,px=60,py=260,fuel=100,t=0,photos=0;
const PL=[
 {x:400,y:120,k:'🪐',got:false},{x:700,y:330,k:'🔴',got:false},{x:1000,y:150,k:'🌎',got:false},
 {x:1300,y:300,k:'🪨',got:false},{x:1600,y:200,k:'☄️',got:false}
];
const hud=H.hud(root,[['cb','COMBUSTÍVEL','100%'],['f','FOTOS','0/5']]);
const say=H.msg(root,'Voe até cada corpo celeste e FOTOGRAFE! Setas/toque movem. Sem combustível = à deriva!');
const o=H.cvs(root,560,420),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx+cam;ty=qy;});
let tx=null,ty=null,cam=0;
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const p=PL.find(q=>!q.got&&Math.hypot(px-q.x,py-q.y)<70);
 if(p){p.got=true;photos++;H.sfx('ok');hud.set('f',photos+'/5');
  if(photos>=5){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=photos*70+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🛰️ Missão completa!',sub:'5 corpos fotografados!'}:{win:false,score:sc,title:'À deriva!',sub:photos+'/5 fotos. Economize combustível!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=170*dt;
 let mv=false;
 if(dn.ArrowLeft||dn.KeyA){px-=sp;mv=true;}
 if(dn.ArrowRight||dn.KeyD){px+=sp;mv=true;}
 if(dn.ArrowUp||dn.KeyW){py-=sp;mv=true;}
 if(dn.ArrowDown||dn.KeyS){py+=sp;mv=true;}
 if(tx!=null){const d=Math.hypot(tx-px,ty-py);if(d>8){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;mv=true;}}
 px=H.clamp(px,30,1770);py=H.clamp(py,30,390);
 if(mv)fuel-=dt*4;
 hud.set('cb',Math.max(0,fuel|0)+'%');
 if(fuel<=0){gameOver(false);return;}
 cam=H.clamp(px-140,0,1240);
 x.fillStyle='#0C0C18';x.fillRect(0,0,560,420);
 x.fillStyle='#fff';
 for(let i=0;i<60;i++){const sx=(i*197-cam*.2%560+560)%560,sy=(i*131)%420;x.fillRect(sx,sy,2,2);}
 PL.forEach(p=>{
  const qx=p.x-cam;
  if(qx>-40&&qx<600){
   x.font='40px system-ui';x.textAlign='center';x.fillText(p.k,qx,p.y);
   if(!p.got){x.strokeStyle='#C4D645';x.lineWidth=2;x.beginPath();x.arc(qx,p.y,44,0,7);x.stroke();}
   else{x.font='20px system-ui';x.fillText('✅',qx,p.y-36);}
  }
 });
 x.font='26px system-ui';x.fillText('🛰️',px-cam,py+9);
});
}});
