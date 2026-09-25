/* NCODE N · 279 Mistura na Multidão — flua com todos! */
GREG(279,{
init(root,H){
let over=false,px=30,py=230,tx=px,ty=py,susp=0,t=0,vx=0,vy=0;
const hud=H.hud(root,[['sp','SUSPEITA','0%']]);
const say=H.msg(root,'Atravesse até a saída movendo-se COMO a multidão! Siga as setas do fluxo — andar contra a corrente levanta suspeita!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function flow(px2,py2){
 const a=Math.sin(py2*.02+t*.4)*1.2+Math.cos(px2*.015)*0.6;
 return a;
}
function gameOver(win){over=true;H.sfx(win?"win":"lose");const sc=win?Math.max(150,450-(susp|0)*2):30;H.score(sc);
H.done(win?{win:true,score:sc,title:'Um com a multidão!',sub:'Ninguém notou você.'}:{win:false,score:sc,title:'Destacado!',sub:'Você andou contra o fluxo. Siga as setas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=120*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 let mx=0,my=0;
 if(dx||dy){mx=dx;my=dy;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>6){mx=(tx-px)/d;my=(ty-py)/d;}}
 px+=mx*sp;py+=my*sp;
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const moving=Math.abs(mx)+Math.abs(my)>0.1;
 if(moving){
  const fa=flow(px,py);
  const ma=Math.atan2(my,mx);
  let df=ma-fa;
  while(df>Math.PI)df-=2*Math.PI;while(df<-Math.PI)df+=2*Math.PI;
  if(Math.abs(df)>.7)susp+=26*dt;else susp=Math.max(0,susp-14*dt);
 }else susp=Math.max(0,susp-8*dt);
 hud.set('sp',(susp|0)+'%');
 if(susp>=100){gameOver(false);return;}
 if(px>414&&py>200&&py<260){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 x.strokeStyle='rgba(46,110,138,.4)';x.lineWidth=2;
 for(let gy=30;gy<460;gy+=46)for(let gx=30;gx<460;gx+=46){
  const a=flow(gx,gy);
  x.beginPath();x.moveTo(gx,gy);x.lineTo(gx+Math.cos(a)*14,gy+Math.sin(a)*14);x.stroke();
  x.fillStyle='rgba(46,110,138,.4)';x.beginPath();x.arc(gx+Math.cos(a)*14,gy+Math.sin(a)*14,2.5,0,7);x.fill();
 }
 x.fillStyle='#3E7C4F';x.fillRect(414,200,38,60);x.fillStyle='#fff';x.font='22px system-ui';x.textAlign='center';x.fillText('i:door',433,240);
 x.fillStyle=susp>60?'#D94E34':'#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.stroke();
 x.fillStyle='#181816';x.fillRect(10,10,200,14);
 x.fillStyle=susp>70?'#D94E34':'#E8A33D';x.fillRect(10,10,200*Math.min(1,susp/100),14);
});
}});
