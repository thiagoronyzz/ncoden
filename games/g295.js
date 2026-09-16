/* NCODE N · 295 Parapente — pegue as térmicas! */
GREG(295,{
init(root,H){
let over=false,px=60,alt=400,vy=0,t=0,dist=0;
const TH=[];
for(let i=0;i<8;i++)TH.push({x:400+i*700+Math.random()*300,w:120});
const LZ={x:6400,w:300};
const hud=H.hud(root,[['a','ALT','400m'],['d','DIST','0%']]);
const say=H.msg(root,'Plane até a zona de pouso 🟩! Suba nas térmicas ⬆️ (colunas quentes), afunde fora delas. ⬅️➡️ controlam a velocidade!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function gameOver(win,why){over=true;const sc=win?Math.max(200,800-(t|0)*5):dist/64|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🪂 Pouso perfeito!',sub:'Chegou planando!'}:{win:false,score:sc,title:'Pouso forçado!',sub:why});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD;
 const sp=L?90:R?220:150;
 px+=sp*dt;dist=px;
 const inTh=TH.some(q=>Math.abs(px-q.x)<q.w/2);
 vy+=(((inTh?70:-45))-vy)*1.2*dt;
 alt+=vy*dt;
 hud.set('a',Math.max(0,alt|0)+'m');hud.set('d',Math.min(99,px/6550*100|0)+'%');
 if(alt<=0){
  if(px>=LZ.x-LZ.w/2&&px<=LZ.x+LZ.w/2)gameOver(true);
  else gameOver(false,'Caiu a '+((LZ.x-px)|0)+'m da zona. Use as térmicas ⬆️!');
  return;
 }
 if(px>LZ.x+LZ.w/2+200){gameOver(false,'Passou da zona de pouso!');return;}
 const cam=H.clamp(px-120,0,6200);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,400);
 x.fillStyle='#3E7C4F';x.fillRect(0,360,560,40);
 TH.forEach(q=>{
  const qx=q.x-cam;
  if(qx>-100&&qx<660){
   x.fillStyle='rgba(232,163,61,.25)';x.fillRect(qx-q.w/2,60,q.w,300);
   x.fillStyle='#E8A33D';x.font='22px system-ui';x.textAlign='center';
   x.fillText('⬆️',qx,120+((t*40)%200));
  }
 });
 x.fillStyle='#C4D645';x.fillRect(LZ.x-LZ.w/2-cam,340,LZ.w,20);
 x.font='20px system-ui';x.textAlign='center';x.fillText('🟩',LZ.x-cam,336);
 const py=360-alt*.7;
 x.font='30px system-ui';x.fillText('🪂',px-cam,py);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Alt '+Math.max(0,alt|0)+'m  '+(px/6550*100|0)+'%'+(inTh?'  ⬆️ TÉRMICA!':''),12,26);
});
}});
