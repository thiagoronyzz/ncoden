/* NCODE N · 315 Construtor de Jangada — monte e sobreviva! */
GREG(315,{
init(root,H){
let over=false,phase='build',wood=0,rope=0,hull=0,t=0,storm=0,hp=100;
const hud=H.hud(root,[['m','MADEIRA',0],['c','CORDA',0],['j','JANGADA','0%']]);
const say=H.msg(root,'Clique nos destroços para coletar! Monte a jangada (6🪵+4🪢) e sobreviva à tempestade remando e escoando água!');
const o=H.cvs(root,480,400),x=o.x;
const brow=H.el('div','g-row',null,root);
let debris=[];
for(let i=0;i<14;i++)debris.push({x:Math.random()*440+20,y:80+Math.random()*280,k:Math.random()<.6?'🪵':'🪢',got:false,ph:Math.random()*7});
H.onTap(o,(px,py)=>{
 if(over||phase!=='build')return;
 debris.forEach(d=>{
  if(!d.got&&Math.hypot(px-d.x,py-d.y)<26){
   d.got=true;
   if(d.k==='🪵')wood++;else rope++;
   H.sfx('tick');
   hud.set('m',wood);hud.set('c',rope);
   hud.set('j',Math.min(100,(wood/6*50+rope/4*50)|0)+'%');
   checkBuild();
  }
 });
});
function checkBuild(){
 if(wood>=6&&rope>=4){
  phase='storm';storm=40;
  say('🌊 TEMPESTADE! Escoe a água e reme até passar!');
  H.btn(brow,'🪣 Escoar água',()=>{if(!over&&phase==='storm'){storm-=0;hp=Math.min(100,hp+2);water=Math.max(0,water-18);H.sfx('tick');}},false);
  H.btn(brow,'🚣 Remar',()=>{if(!over&&phase==='storm'){storm-=2;water+=4;H.sfx('tick');}},false);
 }
}
let water=0;
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+hp:wood*10+rope*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Naufrágio vencido!',sub:'Jangada aguentou a tempestade!'}:{win:false,score:sc|0,title:'Afundou!',sub:'Escoe a água sem parar de remar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(phase==='storm'){
  storm-=dt;water+=dt*7;
  hp-=water>70?dt*14:0;
  if(water>=100||hp<=0){gameOver(false);return;}
  if(storm<=0){gameOver(true);return;}
 }
 x.fillStyle='#2E6E8A';x.fillRect(0,0,480,400);
 x.strokeStyle='rgba(255,255,255,.4)';
 for(let i=0;i<18;i++){const wy=(i*89+t*40)%440;x.beginPath();x.moveTo((i*167)%460,wy);x.lineTo((i*167)%460+30,wy);x.stroke();}
 if(phase==='build'){
  debris.forEach(d=>{if(!d.got){x.font='24px system-ui';x.textAlign='center';x.fillText(d.k,d.x,d.y+Math.sin(t*2+d.ph)*4);}});
  x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='center';
  x.fillText('🪵 '+wood+'/6  🪢 '+rope+'/4',240,30);
 }else{
  x.font='44px system-ui';x.textAlign='center';
  x.fillText('🛶',240+Math.sin(t*3)*8,220+Math.sin(t*5)*6);
  x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
  x.fillText('🌊 '+Math.ceil(storm)+'s · 💧 água '+(water|0)+'% · ❤️ '+(hp|0),14,30);
  x.fillStyle='#000';x.fillRect(14,40,300,12);
  x.fillStyle='#7FB3C8';x.fillRect(14,40,300*Math.min(1,water/100),12);
 }
});
}});
