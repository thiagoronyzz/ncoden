/* NCODE N · 334 Gelo Flutuante — pule sem cair! */
GREG(334,{
init(root,H){
let over=false,pi=0,jump=0,jT=0,t=0,lives=3;
const B=[];
for(let i=0;i<10;i++)B.push({x:60+i*62,y:300+Math.sin(i*1.3)*60,melt:0,gone:false});
const hud=H.hud(root,[['v','VIDAS',3],['d','DIST','0/10']]);
const say=H.msg(root,'Toque no próximo bloco (ou Espaço) para pular! Blocos derretem com o tempo — rápido! 3 quedas na água = fim.');
const o=H.cvs(root,680,420),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(d&&c==='Space')hop();});
H.onTap(o,()=>hop());
function hop(){
 if(over||jump)return;
 jump=1;jT=0;H.sfx('tick');
}
function gameOver(win){over=true;const sc=win?350+lives*100:pi*30;H.score(sc);
H.done(win?{win:true,score:sc,title:'Terra firme!',sub:'Atravessou o degelo!'}:{win:false,score:sc,title:'Água gelada!',sub:'3 quedas. Pule sem hesitar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 B.forEach((b,i)=>{if(!b.gone&&i>=pi)b.melt+=dt*(i===pi?6:2.5);if(b.melt>26)b.gone=true;});
 if(jump){
  jT+=dt/.45;
  if(jT>=1){
   jump=0;jT=0;
   const nb=B[pi+1];
   if(!nb||nb.gone||Math.abs(60+(pi+1)*62-(60+pi*62))>90){
    lives--;H.sfx('bad');hud.set('v',lives);
    if(lives<=0){gameOver(false);return;}
   }else{pi++;H.sfx('ok');hud.set('d',pi+'/10');}
   if(pi>=9){gameOver(true);return;}
  }
 }else{
  const cur=B[pi];
  if(cur&&cur.gone){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}cur.gone=false;cur.melt=0;}
 }
 x.fillStyle='#123F5C';x.fillRect(0,0,680,420);
 x.fillStyle='#3E7C4F';x.fillRect(620,180,60,240);
 x.fillStyle='#5A4A33';x.fillRect(0,200,50,220);
 B.forEach((b,i)=>{
  if(b.gone)return;
  const s=1-b.melt/30;
  x.fillStyle='#DCEEF5';
  x.beginPath();x.ellipse(b.x,b.y+Math.sin(t*2+i)*4,34*s,20*s,0,0,7);x.fill();
  x.strokeStyle='#8A877C';x.stroke();
 });
 let jx=60+pi*62,jy=B[pi]?B[pi].y:300;
 if(jump&&B[pi+1]){jx=jx+(62)*jT;jy=jy-70*Math.sin(jT*Math.PI);}
 x.font='30px system-ui';x.textAlign='center';x.fillText('i:penguin',jx,jy-14);
});
}});
