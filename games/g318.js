/* NCODE N · 318 Sobrevivência à Enchente — suba! */
GREG(318,{
init(root,H){
let over=false,px=230,py=420,vy=0,ground=true,water=460,t=0,sup=0,time=90;
const PLAT=[{x:60,w:120,y:360},{x:280,w:120,y:300},{x:80,w:120,y:230},{x:280,w:120,y:160},{x:140,w:180,y:90}];
const SUP=[];
for(let i=0;i<6;i++)SUP.push({x:60+Math.random()*340,y:[330,270,200,130,60][i%5],got:false});
const hud=H.hud(root,[['s','SUPRIMENTOS','0/6'],['tp','TEMPO',90]]);
const say=H.msg(root,'A água sobe! Pule nas plataformas (Espaço/⬆️), pegue 6 suprimentos 📦 e aguente 90s!');
const o=H.cvs(root,460,500),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&(c==='Space'||c==='ArrowUp'||c==='KeyW'))jump();});
H.onTap(o,(qx,qy)=>{if(qy<py-40)jump();else tapX=qx;});
let tapX=null;
function jump(){if(over||!ground)return;vy=-400;ground=false;H.sfx('tick');}
function gameOver(win){over=true;const sc=sup*60+(win?300:0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Resgate chegou!',sub:sup+'/6 suprimentos!'}:{win:false,score:sc|0,title:'Levado pela água!',sub:'Suba sempre, sem parar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 water-=dt*4.2;
 if(dn.ArrowLeft||dn.KeyA)px-=180*dt;
 if(dn.ArrowRight||dn.KeyD)px+=180*dt;
 if(tapX!=null){px+=(tapX-px)*4*dt;}
 px=H.clamp(px,16,444);
 vy+=1000*dt;py+=vy*dt;ground=false;
 if(py>=430){py=430;vy=0;ground=true;}
 PLAT.forEach(p=>{
  if(px>=p.x&&px<=p.x+p.w&&py>=p.y-4&&py<=p.y+18&&vy>=0){py=p.y;vy=0;ground=true;}
 });
 SUP.forEach(s=>{
  if(!s.got&&Math.hypot(px-s.x,py-s.y)<30){s.got=true;sup++;H.sfx('ok');hud.set('s',sup+'/6');}
 });
 hud.set('tp',Math.ceil(time));
 if(py+10>water){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,500);
 PLAT.forEach(p=>{x.fillStyle='#8A6A2F';x.fillRect(p.x,p.y,p.w,14);});
 SUP.forEach(s=>{if(!s.got){x.font='20px system-ui';x.textAlign='center';x.fillText('📦',s.x,s.y);}});
 x.fillStyle='rgba(46,110,138,.85)';x.fillRect(0,water,460,500-water);
 x.strokeStyle='#fff';x.lineWidth=2;
 x.beginPath();x.moveTo(0,water);
 for(let sx=0;sx<=460;sx+=20)x.lineTo(sx,water+Math.sin(sx*.05+t*3)*4);
 x.stroke();
 x.font='26px system-ui';x.textAlign='center';x.fillText('🏊',px,py-8);
});
}});
