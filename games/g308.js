/* NCODE N · 308 Balsa no Rio — colete tudo! */
GREG(308,{
init(root,H){
let over=false,px=230,py=400,dist=0,t=0,got=0,time=120;
const ITEMS=[];
for(let i=0;i<12;i++)ITEMS.push({x:60+Math.random()*340,y:-i*420-200,got:false,k:['🍎','💎','🪙','🍌'][i%4]});
const hud=H.hud(root,[['i','ITENS','0/12'],['tp','TEMPO',120]]);
const say=H.msg(root,'Colete os 12 itens flutuantes! Setas/toque movem a balsa. 2 minutos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx;ty=qy;});
let tx=null,ty=null;
function gameOver(win){over=true;const sc=got*50+(win?Math.ceil(time)*3:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🛶 Rio limpo!',sub:'12/12 itens!'}:{win:false,score:sc,title:'Fim do tempo!',sub:got+'/12 itens.'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 const sp=180*dt;
 if(dn.ArrowLeft||dn.KeyA)px-=sp;if(dn.ArrowRight||dn.KeyD)px+=sp;
 if(dn.ArrowUp||dn.KeyW)py-=sp;if(dn.ArrowDown||dn.KeyS)py+=sp;
 if(tx!=null){px+=(tx-px)*3*dt;py+=(ty-py)*3*dt;}
 px=H.clamp(px,50,410);py=H.clamp(py,200,480);
 dist+=60*dt;
 ITEMS.forEach(it=>{
  const iy=it.y+dist;
  if(!it.got&&Math.hypot(px-it.x,py-iy)<32){it.got=true;got++;H.sfx('ok');hud.set('i',got+'/12');}
 });
 hud.set('tp',Math.ceil(time));
 if(got>=12){gameOver(true);return;}
 if(time<=0){gameOver(false);return;}
 x.fillStyle='#3EAFBF';x.fillRect(0,0,460,520);
 x.strokeStyle='rgba(255,255,255,.4)';
 for(let i=0;i<20;i++){const wy=(i*97+dist)%560-20;x.beginPath();x.moveTo((i*173)%440,wy);x.lineTo((i*173)%440+30,wy);x.stroke();}
 x.fillStyle='#3E7C4F';x.fillRect(0,0,40,520);x.fillRect(420,0,40,520);
 ITEMS.forEach(it=>{
  const iy=it.y+dist;
  if(!it.got&&iy>-20&&iy<540){x.font='24px system-ui';x.textAlign='center';x.fillText(it.k,it.x,iy+8);}
 });
 x.font='34px system-ui';x.fillText('🛶',px,py+11);
});
}});
