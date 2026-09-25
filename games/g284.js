/* NCODE N · 284 Corrida de Barco — slalom nas boias! */
GREG(284,{
init(root,H){
let over=false,px=230,t=0,dist=0,pen=0,sp=0;
const GATES=[];
for(let i=0;i<14;i++)GATES.push({y:-i*420-300,gx:90+Math.random()*280,got:false});
const hud=H.hud(root,[['p','PORTÕES','0/14'],['tp','TEMPO','0.0']]);
const say=H.msg(root,'Passe ENTRE as boias ●●! ↑ acelera, ←→ viram. Portão perdido = +5s. 14 portões!');
const o=H.cvs(root,460,480),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.35;});
let tapS=0,tapT=0;
function gameOver(){over=true;const tot=t+pen;const win=pen<=15;const sc=Math.max(100,900-tot*8);H.score(sc);
H.done({win,score:sc,title:win?'Rio dominado!':'Chegou, mas…',sub:'Tempo '+tot.toFixed(1)+'s (punição '+pen+'s). '+GATES.filter(g=>g.got).length+'/14 portões.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const up=dn.ArrowUp||dn.KeyW,L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 sp+=((up?260:150)-sp)*2*dt;
 if(L)px-=200*dt;if(R)px+=200*dt;
 px=H.clamp(px,50,410);
 dist+=sp*dt;
 GATES.forEach(g=>{
  const gy=g.y+dist;
  if(!g.got&&!g.missed&&gy>440){
   if(Math.abs(px-g.gx)<55){g.got=true;H.sfx('ok');}
   else{g.missed=true;pen+=5;H.sfx('bad');}
   hud.set('p',GATES.filter(q=>q.got).length+'/14');
  }
 });
 hud.set('tp',t.toFixed(1)+'+'+pen);
 if(dist>14*420+400){gameOver();return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,460,480);
 x.fillStyle='#3EAFBF';
 for(let i=0;i<20;i++){const wy=(i*97+dist*.5)%520-20;x.fillRect((i*173)%440,wy,26,4);}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,40,480);x.fillRect(420,0,40,480);
 GATES.forEach(g=>{
  const gy=g.y+dist;
  if(gy<-40||gy>520)return;
  x.fillStyle=g.got?'#3E7C4F':g.missed?'#D94E34':'#E8A33D';
  x.beginPath();x.arc(g.gx-55,gy,14,0,7);x.arc(g.gx+55,gy,14,0,7);x.fill();
  x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 });
 x.font='30px system-ui';x.textAlign='center';x.fillText('i:boat',px,430);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('i:gauge'+t.toFixed(1)+'s (+'+pen+')  Portões '+GATES.filter(g=>g.got).length+'/14',12,26);
});
}});
