/* NCODE N · 290 Balão de Ar Quente — flutue nas argolas! */
GREG(290,{
init(root,H){
let over=false,py=260,vy=0,heat=45,rings=0,t=0,wind=0;
const RINGS=[];
for(let i=0;i<8;i++)RINGS.push({x:80+Math.random()*300,y:430-i*42,got:false});
const hud=H.hud(root,[['a','ARGOLAS','0/8'],['q','CALOR','50%']]);
const say=H.msg(root,'Suba passando PELAS argolas! Segure AQUECER/Espaço para subir, solte para descer. Colete 6+ e chegue ao topo!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
const hb=H.btn(root,'Segurar = AQUECER',()=>{},true);
hb.addEventListener('pointerdown',()=>{dn.heat=true;});
hb.addEventListener('pointerup',()=>{dn.heat=false;});
function gameOver(win){over=true;const sc=win?Math.max(200,700-(t|0)*6):rings*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'Voo perfeito!',sub:'8/8 argolas!'}:{win:false,score:sc,title:'Pouso forçado!',sub:rings+'/8 argolas. Dose o calor!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 wind=Math.sin(t*.5)*30;
 const h=dn.heat||dn.Space||dn.ArrowUp;
 if(h)heat=Math.min(100,heat+40*dt);else heat=Math.max(0,heat-14*dt);
 vy+=((heat-45)*4-vy)*1.5*dt;
 vy=H.clamp(vy,-160,160);
 py-=vy*dt;
 const px=230+Math.sin(t*.3)*40+wind*.4;
 hud.set('q',(heat|0)+'%');
 
 RINGS.forEach(r=>{
  if(!r.got&&Math.abs(px-r.x)<34&&Math.abs(py-r.y)<34){r.got=true;rings++;H.sfx('ok');hud.set('a',rings+'/8');}
 });
 if(py<=100){gameOver(rings>=6);return;}
 if(py>=460){gameOver(false);return;}
 const cam=0;
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,520);
 x.fillStyle='#fff';
 for(let i=0;i<12;i++){const cy=((i*140-cam*.6)%640+640)%640-60;x.beginPath();x.ellipse((i*199)%440,cy,40,16,0,0,7);x.fill();}
 RINGS.forEach(r=>{
  const ry=r.y-cam;
  if(ry<-40||ry>560)return;
  x.strokeStyle=r.got?'#3E7C4F':'#E8A33D';x.lineWidth=6;
  x.beginPath();x.arc(r.x,ry,30,0,7);x.stroke();
 });
 x.fillStyle='#3E7C4F';x.fillRect(0,470-cam>520?520:470-cam,460,60);
 const by=py-cam;
 x.fillStyle=h?'#D94E34':'#B23A24';
 x.beginPath();x.ellipse(px,by-24,30,36,0,0,7);x.fill();
 x.fillStyle='#8A6A2F';x.fillRect(px-10,by+12,20,14);
 if(h){x.fillStyle='#E8A33D';x.beginPath();x.moveTo(px-6,by+12);x.lineTo(px+6,by+12);x.lineTo(px,by-2);x.fill();}
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('i:target'+rings+'/8 '+(heat|0)+'%  Alt '+(460-py|0)+'m',12,26);
});
}});
