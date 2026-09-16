/* NCODE N · 307 Pula-Pula Vertical — quique até o topo! */
GREG(307,{
init(root,H){
let over=false,py=0,vy=0,px=230,power=0,charge=false,t=0,best=0;
const PLAT=[{x:230,y:0}];
for(let i=1;i<24;i++)PLAT.push({x:60+Math.random()*340,y:-i*130});
const hud=H.hud(root,[['a','ALT','0m']]);
const say=H.msg(root,'Segure ESPAÇO para carregar e solte para pular! Mire as plataformas. Caia = recomeça de baixo. Chegue ao topo!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{
 if(c==='Space'){if(d&&!over&&vy===0)charge=true;if(!d&&charge)jump();}
 if(d&&(c==='ArrowLeft'||c==='KeyA'))px-=26;
 if(d&&(c==='ArrowRight'||c==='KeyD'))px+=26;
});
H.onTap(o,(qx,qy)=>{px=qx;});
const jb=H.btn(root,'🟢 Segurar e soltar = PULAR',()=>{},true);
jb.addEventListener('pointerdown',()=>{if(!over&&vy===0)charge=true;});
jb.addEventListener('pointerup',()=>{if(charge)jump();});
function jump(){
 if(over)return;
 charge=false;
 if(vy!==0)return;
 vy=-(280+power*5);power=0;H.sfx('tick');
}
function gameOver(win){over=true;const sc=win?Math.max(250,800-(t|0)*8):best|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'🦘 Topo!',sub:'Escalada completa!'}:{win:false,score:sc,title:'Caiu!',sub:'Altura máxima: '+best.toFixed(0)+'m.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(charge)power=Math.min(100,power+90*dt);
 vy+=900*dt;py+=vy*dt;
 px=H.clamp(px,20,440);
 if(vy>0){
  PLAT.forEach(p=>{
   if(Math.abs(py-p.y)<12&&Math.abs(px-p.x)<44){py=p.y;vy=0;}
  });
 }
 best=Math.max(best,-py/10);
 hud.set('a',best.toFixed(0)+'m');
 if(py>120){gameOver(false);return;}
 if(-py>=23*130){gameOver(true);return;}
 const cam=py-380;
 x.fillStyle='#12303C';x.fillRect(0,0,460,520);
 PLAT.forEach(p=>{
  const sy=p.y-cam;
  if(sy<-20||sy>540)return;
  x.fillStyle='#C4D645';x.fillRect(p.x-44,sy-8,88,16);
 });
 x.font='40px system-ui';x.textAlign='center';x.fillText('🦘',px,py-cam-8);
 x.fillStyle='#000';x.fillRect(180,16,200,16);
 x.fillStyle=power>80?'#D94E34':'#E8A33D';x.fillRect(180,16,200*power/100,16);
 x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('FORÇA',120,29);
});
}});
