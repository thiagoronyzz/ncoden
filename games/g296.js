/* NCODE N · 296 Corrida Submarina — entre corais e correntes! */
GREG(296,{
init(root,H){
let over=false,py=230,dist=0,t=0,o2=100;
const CORAL=[];
for(let i=0;i<26;i++)CORAL.push({x:400+i*330,y:60+Math.random()*340,hit:false});
const CUR=[];
for(let i=0;i<8;i++)CUR.push({x:600+i*900,y:100+Math.random()*260,dy:Math.random()<.5?-1:1});
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['d','DIST','0%']]);
const say=H.msg(root,'Nade até o fim! ⬆️⬇️ movem, correntes 🌀 empurram, corais 🪸 machucam. Acabou o O₂ = fim!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapY=qy;});
let tapY=null;
function gameOver(win){over=true;const sc=win?Math.max(200,700-(t|0)*6):dist/90|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🤿 Travessia completa!',sub:'Percurso subaquático vencido!'}:{win:false,score:sc,title:'Sem ar!',sub:'Gerencie o oxigênio e desvie dos corais!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 const sp=200;
 dist+=sp*dt;
 if(U)py-=220*dt;if(D)py+=220*dt;
 if(tapY!=null){py+=(tapY-py)*3*dt;if(Math.abs(tapY-py)<6)tapY=null;}
 py=H.clamp(py,30,370);
 CUR.forEach(c=>{if(Math.abs(dist+120-c.x)<90&&Math.abs(py-c.y)<80)py+=c.dy*160*dt;});
 o2-=dt*3.2;
 CORAL.forEach(c=>{
  if(!c.hit&&Math.abs(dist+120-c.x)<30&&Math.abs(py-c.y)<30){c.hit=true;o2-=12;H.sfx('bad');}
 });
 hud.set('ox',(Math.max(0,o2)|0)+'%');hud.set('d',Math.min(99,dist/9000*100|0)+'%');
 if(o2<=0){gameOver(false);return;}
 if(dist>=9000){gameOver(true);return;}
 x.fillStyle='#123F5C';x.fillRect(0,0,560,400);
 CUR.forEach(c=>{
  const cx=c.x-dist;
  if(cx>-60&&cx<620){
   x.strokeStyle='rgba(196,214,69,.5)';x.lineWidth=3;
   x.beginPath();x.arc(cx,c.y,34+t*20%20,0,7);x.stroke();
   x.fillStyle='#C4D645';x.font='16px system-ui';x.textAlign='center';x.fillText(c.dy<0?'⬆':'⬇',cx,c.y+6);
  }
 });
 CORAL.forEach(c=>{
  const cx=c.x-dist;
  if(cx>-40&&cx<600){x.font=c.hit?'20px system-ui':'26px system-ui';x.textAlign='center';x.fillText(c.hit?'💥':'🪸',cx,c.y);}
 });
 x.font='30px system-ui';x.fillText('🤿',120,py+10);
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(Math.max(0,o2)|0)+'%  '+(dist/9000*100|0)+'%',12,26);
 x.fillStyle='#000';x.fillRect(12,34,200,10);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(12,34,200*Math.max(0,o2)/100,10);
});
}});
