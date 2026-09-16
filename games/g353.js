/* NCODE N · 353 Jardim de Borboletas — catalogue! */
GREG(353,{
init(root,H){
let over=false,t=0,time=90;
const SP=['🦋','🦋','🦋','🐝','🪲'];
const FLY=[];
for(let i=0;i<8;i++)FLY.push({x:Math.random()*420+20,y:80+Math.random()*260,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*70,k:SP[i%5],got:false,ph:Math.random()*7});
let cat={};
const hud=H.hud(root,[['c','ESPÉCIES','0/3'],['tp','TEMPO',90]]);
const say=H.msg(root,'Toque nas borboletas 🦋 para catalogar! (abelhas e besouros não contam). 3 espécies: capture 3 borboletas diferentes? Não — capture 5 🦋 em 90s!');
const o=H.cvs(root,460,400),x=o.x;
let n=0;
H.onTap(o,(px,py)=>{
 if(over)return;
 FLY.forEach(f=>{
  if(!f.got&&Math.hypot(px-f.x,py-f.y)<26){
   f.got=true;
   if(f.k==='🦋'){n++;H.sfx('ok');hud.set('c',Math.min(5,n)+'/5');
    if(n>=5){gameOver(true);return;}}
   else H.sfx('bad');
  }
 });
});
function gameOver(win){over=true;const sc=n*60+(win?Math.ceil(time)*2:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🦋 Jardim catalogado!',sub:'5 borboletas!'}:{win:false,score:sc,title:'Voaram!',sub:n+'/5 borboletas. Toque rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(n>=5);return;}
 FLY.forEach(f=>{
  if(f.got)return;
  f.x+=f.vx*dt;f.y+=f.vy*dt;
  if(f.x<20||f.x>440)f.vx*=-1;
  if(f.y<50||f.y>380)f.vy*=-1;
 });
 if(!FLY.some(f=>!f.got&&f.k==='🦋')&&n<5){
  FLY.push({x:230,y:200,vx:80,vy:50,k:'🦋',got:false,ph:0});
 }
 x.fillStyle='#7CB56B';x.fillRect(0,0,460,400);
 x.font='20px system-ui';x.textAlign='center';
 for(let i=0;i<10;i++)x.fillText('🌸',(i*167)%440,60+(i*97)%300);
 FLY.forEach(f=>{
  if(f.got)return;
  x.font='26px system-ui';
  x.fillText(f.k,f.x,f.y+Math.sin(t*6+f.ph)*4);
 });
});
}});
