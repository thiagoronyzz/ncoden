/* NCODE N · 322 Pós-Terremoto — resgate nos escombros! */
GREG(322,{
init(root,H){
let over=false,time=120,rescued=0,t=0;
const PILES=[];
for(let i=0;i<8;i++)PILES.push({x:40+(i%4)*115,y:90+((i/4)|0)*130,rubble:3+((Math.random()*3)|0),surv:Math.random()<.7?1+((Math.random()*2)|0):0,ping:Math.random()*7});
const hud=H.hud(root,[['s','RESGATADOS',0],['tp','TEMPO',120]]);
const say=H.msg(root,'Toque nos escombros para remover! ♥ indica vida — resgate antes do tempo. 6 sobreviventes vencem!');
const o=H.cvs(root,480,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 PILES.forEach(p=>{
  if(Math.hypot(px-p.x-50,py-p.y-45)<62){
   if(p.rubble>0){p.rubble--;H.sfx('tick');}
   else if(p.surv>0){p.surv--;rescued++;H.sfx('ok');hud.set('s',rescued);
    if(rescued>=6){gameOver(true);return;}}
  }
 });
});
function gameOver(win){over=true;const sc=rescued*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Resgate heróico!',sub:'6 vidas salvas!'}:{win:false,score:sc,title:'Tempo esgotado!',sub:rescued+'/6 resgatados. Siga os ♥!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(rescued>=6);return;}
 x.fillStyle='#8A877C';x.fillRect(0,0,480,360);
 PILES.forEach(p=>{
  x.fillStyle='#5A5A55';
  for(let i=0;i<p.rubble;i++)x.fillRect(p.x+((i*37)%80),p.y+((i*23)%60),34,22);
  if(p.rubble<=0&&p.surv>0){x.font='24px system-ui';x.textAlign='center';x.fillText('i:raise'.repeat(Math.min(2,p.surv)),p.x+50,p.y+50);}
  if(p.surv>0&&p.rubble>0&&Math.sin(t*3+p.ping)>0.6){x.font='18px system-ui';x.fillText('♥',p.x+90,p.y+10);}
 });
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('i:ambulance'+rescued+'/6 · '+Math.ceil(time)+'s',12,28);
});
}});
