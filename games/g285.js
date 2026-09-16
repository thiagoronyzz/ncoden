/* NCODE N · 285 Trial de Moto — sem pôr o pé! */
GREG(285,{
init(root,H){
const OBS=[];
for(let i=0;i<10;i++)OBS.push({x:300+i*330,h:30+Math.random()*55});
let over=false,px=60,bal=0,dabs=0,t=0,v=0;
const hud=H.hud(root,[['p','PÉS NO CHÃO','0/5'],['d','DIST','0%']]);
const say=H.msg(root,'Chegue ao fim! A moto balança sozinha — ⬅️➡️ equilibram. Balanço no limite = pé no chão (5 = fim). ⬆️ acelera!');
const o=H.cvs(root,560,360),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function bump(x2){
 let h=0;
 OBS.forEach(ob=>{const d=Math.abs(x2-ob.x);if(d<60)h=Math.max(h,ob.h*(1-d/60));});
 return h;
}
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*5-dabs*40):(px/3600*150|0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🏍️ Trial limpo!',sub:dabs+' pés em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Cheio de pés!',sub:'5 apoios. Antecipe o balanço!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const up=dn.ArrowUp||dn.KeyW,L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD;
 v+=((up?170:90)-v)*2*dt;
 px+=v*dt;
 bal+=Math.sin(t*2.3)*28*dt+Math.sin(t*5.1)*12*dt;
 if(L)bal-=60*dt;if(R)bal+=60*dt;
 bal=H.clamp(bal,-100,100);
 if(Math.abs(bal)>=100){dabs++;bal=0;H.sfx('bad');hud.set('p',dabs+'/5');if(dabs>=5){gameOver(false);return;}}
 hud.set('d',Math.min(99,px/3600*100|0)+'%');
 if(px>=3600){gameOver(true);return;}
 const cam=px-120;
 x.fillStyle='#BFD9E2';x.fillRect(0,0,560,360);
 x.fillStyle='#8A6A2F';x.beginPath();x.moveTo(0,360);
 for(let sx=0;sx<=560;sx+=12)x.lineTo(sx,300-bump(sx+cam));
 x.lineTo(560,360);x.fill();
 OBS.forEach(ob=>{
  const ox=ob.x-cam;
  if(ox>-40&&ox<600){x.fillStyle='#5A4A33';x.fillRect(ox-8,300-ob.h-14,16,14);x.font='20px system-ui';x.textAlign='center';x.fillText('🪵',ox,300-ob.h);}
 });
 x.font='26px system-ui';x.textAlign='center';x.fillText('🏁',3600-cam,270);
 const py=300-bump(px);
 x.save();x.translate(120,py-16);x.rotate(bal/300);
 x.font='30px system-ui';x.fillText('🏍️',0,10);x.restore();
 x.fillStyle='#181816';x.fillRect(180,20,200,16);
 x.fillStyle='#3E7C4F';x.fillRect(270,20,20,16);
 x.fillStyle=Math.abs(bal)>70?'#D94E34':'#E8A33D';
 x.fillRect(280+bal*0.9-4,16,8,24);
 x.fillStyle='#181816';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('EQUILÍBRIO',70,33);
});
}});
