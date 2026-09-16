/* NCODE N · 351 Caçador de Pedras — ache as gemas! */
GREG(351,{
init(root,H){
let over=false,t=0,time=100,gems=0,swings=0;
const ROCKS=[];
for(let i=0;i<10;i++)ROCKS.push({x:50+(i%5)*90,y:100+((i/5)|0)*110,hp:2+((Math.random()*3)|0),gem:Math.random()<.5,open:false});
const hud=H.hud(root,[['g','GEMAS','0/4'],['tp','TEMPO',100]]);
const say=H.msg(root,'Quebre as pedras (toques)! Algumas têm gemas 💎. 4 gemas em 100s! Pedra vazia = tempo perdido…');
const o=H.cvs(root,480,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 ROCKS.forEach(r=>{
  if(!r.open&&Math.hypot(px-r.x-30,py-r.y-30)<42){
   r.hp--;swings++;H.sfx('tick');
   if(r.hp<=0){r.open=true;
    if(r.gem){gems++;H.sfx('ok');hud.set('g',gems+'/4');
     if(gems>=4){gameOver(true);return;}}
   }
  }
 });
});
function gameOver(win){over=true;const sc=gems*80+(win?Math.ceil(time)*2:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'💎 Jazida rica!',sub:'4 gemas em '+swings+' golpes!'}:{win:false,score:sc,title:'Tempo esgotado!',sub:gems+'/4 gemas. Quebre sem parar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(gems>=4);return;}
 x.fillStyle='#5A5A55';x.fillRect(0,0,480,360);
 ROCKS.forEach(r=>{
  if(r.open){
   x.fillStyle='#3A3A35';x.fillRect(r.x,r.y,60,60);
   if(r.gem){x.font='30px system-ui';x.textAlign='center';x.fillText('💎',r.x+30,r.y+42);}
   return;
  }
  x.fillStyle='#8A877C';x.beginPath();x.arc(r.x+30,r.y+30,28,0,7);x.fill();
  x.strokeStyle='#4A4A44';x.lineWidth=3;x.stroke();
  x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='center';x.fillText('x'+r.hp,r.x+30,r.y+36);
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('💎 '+gems+'/4 · ⏱️'+Math.ceil(time)+'s',12,28);
});
}});
