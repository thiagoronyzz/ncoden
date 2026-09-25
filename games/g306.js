/* NCODE N · 306 Monociclo na Corda — atravesse! */
GREG(306,{
init(root,H){
let over=false,px=60,bal=0,t=0,wind=0;
const hud=H.hud(root,[['d','DIST','0%']]);
const say=H.msg(root,'Atravesse a corda! A bike anda sozinha — ←→ equilibram contra o vento. Cair = recomeçar do último terço!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
let falls=0;
function gameOver(win){over=true;const sc=win?Math.max(200,600-(t|0)*5-falls*60):px/5|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'Equilibrista!',sub:falls+' quedas na travessia.'}:{win:false,score:sc,title:'Não deu!',sub:'5 quedas. Corrija antes do limite!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 wind=Math.sin(t*.6)*30+Math.sin(t*1.7)*15;
 px+=55*dt;
 bal+=wind*dt+(Math.random()-.5)*30*dt;
 if(dn.ArrowLeft||dn.KeyA)bal-=80*dt;
 if(dn.ArrowRight||dn.KeyD)bal+=80*dt;
 bal=H.clamp(bal,-100,100);
 if(Math.abs(bal)>=100){
  falls++;bal=0;px=Math.max(60,px-140);H.sfx('bad');
  say('Queda '+falls+'/5!');
  if(falls>=5){gameOver(false);return;}
 }
 hud.set('d',Math.min(99,px/540*100|0)+'%');
 if(px>=540){gameOver(true);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,380);
 x.fillStyle='#5A5A55';x.fillRect(0,240,60,140);x.fillRect(500,240,60,140);
 x.strokeStyle='#181816';x.lineWidth=4;
 x.beginPath();x.moveTo(30,240);x.lineTo(530,240);x.stroke();
 x.fillStyle='#fff';x.font='14px system-ui';x.textAlign='left';
 x.fillText(wind>0?'Vento ▶ '+wind.toFixed(0):'Vento ◀ '+(-wind).toFixed(0),12,26);
 x.save();x.translate(px,232);x.rotate(bal/160);
 x.font='30px system-ui';x.textAlign='center';x.fillText('i:bike',0,4);x.restore();
 x.fillStyle='#181816';x.fillRect(180,300,200,14);
 x.fillStyle=Math.abs(bal)>70?'#D94E34':'#E8A33D';
 x.fillRect(280+bal-5,296,10,22);
});
}});
