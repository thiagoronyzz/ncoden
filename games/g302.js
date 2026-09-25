/* NCODE N · 302 Asa Delta — plane pelos vales! */
GREG(302,{
init(root,H){
let over=false,px=60,alt=350,sp=150,t=0;
const RIDGE=[];
for(let i=0;i<12;i++)RIDGE.push({x:500+i*550,h:150+Math.random()*180});
const LZ={x:7000,w:350};
const hud=H.hud(root,[['a','ALT','350m'],['v','VEL','150']]);
const say=H.msg(root,'Plane até a pista ! ↑ pica (ganha velocidade, perde altura), ↓ cabra (sobe lento). Lento demais = stall! Desvie dos picos!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function ridgeH(x2){
 let h=0;
 RIDGE.forEach(r=>{const d=Math.abs(x2-r.x);if(d<220)h=Math.max(h,r.h*(1-d/220));});
 return h;
}
function gameOver(win,why){over=true;H.sfx(win?"win":"lose");const sc=win?Math.max(250,850-(t|0)*6):px/70|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'Voo de vale!',sub:'Pouso na pista!'}:{win:false,score:sc,title:'Queda!',sub:why});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 if(U){sp+=120*dt;alt-=60*dt;}
 else if(D){sp-=100*dt;alt+=sp>120?40*dt:-30*dt;}
 else{sp+=(140-sp)*.5*dt;alt-=35*dt;}
 sp=H.clamp(sp,40,300);
 if(sp<70)alt-=80*dt;
 px+=sp*dt;
 hud.set('a',Math.max(0,alt|0)+'m');hud.set('v',sp|0);
 const rh=ridgeH(px);
 if(alt<=rh){
  if(px>=LZ.x-LZ.w/2&&px<=LZ.x+LZ.w/2&&sp<220)gameOver(true);
  else gameOver(false,sp<70?'Stall! Mantenha velocidade.':(sp>=220&&px>=LZ.x-LZ.w/2)?'Rápido demais para pousar!':'Bateu no relevo. Plane mais alto!');
  return;
 }
 if(alt>600)alt=600;
 const cam=H.clamp(px-120,0,6800);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,400);
 x.fillStyle='#5A6E5A';x.beginPath();x.moveTo(0,400);
 for(let sx=0;sx<=560;sx+=12)x.lineTo(sx,400-ridgeH(sx+cam));
 x.lineTo(560,400);x.fill();
 x.fillStyle='#C4D645';x.fillRect(LZ.x-LZ.w/2-cam,386,LZ.w,14);
 x.font='20px system-ui';x.textAlign='center';x.fillText('i:plane',LZ.x-cam,382);
 const py=400-alt;
 x.save();x.translate(px-cam,py);x.rotate(U?.4:D?-.3:0);
 x.font='30px system-ui';x.fillText('',0,10);x.restore();
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Alt '+(alt|0)+'m · Vel '+(sp|0)+' · '+(px/7350*100|0)+'%'+(sp<70?'STALL!':''),12,26);
});
}});
