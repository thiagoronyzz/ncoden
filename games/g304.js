/* NCODE N · 304 Parkour Urbano — corra e salte! */
GREG(304,{
init(root,H){
let over=false,px=0,py=0,vy=0,ground=true,slide=0,dist=0,t=0,lives=3;
const OBS=[];
for(let i=0;i<16;i++)OBS.push({x:400+i*420,k:i%3===2?'alto':'baixo',hit:false});
const hud=H.hud(root,[['v','VIDAS',3],['d','DIST','0%']]);
const say=H.msg(root,'Corra até o fim! ⬆️/Espaço pula os muros baixos, ⬇️ desliza sob as barras altas. 3 erros = fim!');
const o=H.cvs(root,560,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{if(!d)return;if(c==='Space'||c==='ArrowUp'||c==='KeyW')jump();});
H.btn(root,'⬆️ PULAR',jump,false);
H.btn(root,'⬇️ DESLIZAR',()=>{if(!over&&ground){slide=.5;H.sfx('tick');}},false);
function jump(){if(over||!ground)return;vy=-420;ground=false;H.sfx('tick');}
function gameOver(win){over=true;const sc=win?Math.max(250,700-(t|0)*8)+lives*50:dist/70|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🏃 Traceur!',sub:'Percurso completo!'}:{win:false,score:sc,title:'Travou!',sub:'3 erros. Pule muros, deslize barras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(slide>0)slide-=dt;
 dist+=200*dt;px=dist;
 vy+=1100*dt;py+=vy*dt;
 if(py>=0){py=0;vy=0;ground=true;}
 OBS.forEach(ob=>{
  const ox=ob.x-dist;
  if(!ob.hit&&Math.abs(ox-120)<30){
   const ok=ob.k==='baixo'?(py<-40):(slide>0);
   if(!ok){ob.hit=true;lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}}
  }
 });
 hud.set('d',Math.min(99,dist/6800*100|0)+'%');
 if(dist>=6800){gameOver(true);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,340);
 x.fillStyle='#8A877C';
 for(let i=0;i<10;i++){const bx=(i*293-dist*.5%600+600)%600-60;x.fillRect(bx,120,50,180);}
 x.fillStyle='#5A5A55';x.fillRect(0,280,560,60);
 OBS.forEach(ob=>{
  const ox=ob.x-dist;
  if(ox<-40||ox>600)return;
  if(ob.k==='baixo'){x.fillStyle=ob.hit?'#D94E34':'#8A6A2F';x.fillRect(ox-14,220,28,60);}
  else{x.fillStyle=ob.hit?'#D94E34':'#2E6E8A';x.fillRect(ox-30,190,60,12);x.fillRect(ox-30,190,8,90);x.fillRect(ox+22,190,8,90);}
 });
 x.font=slide>0?'24px system-ui':'32px system-ui';x.textAlign='center';
 x.fillText(slide>0?'🛷':'🏃',120,272+py);
});
}});
