/* NCODE N · 356 Recife de Coral — fotografe a vida! */
GREG(356,{
init(root,H){
let over=false,px=80,py=200,tx=px,ty=py,t=0,o2=100,photos=0;
const LIFE=[
 {k:'🐠',x:300,y:150,got:false},{k:'🐡',x:500,y:280,got:false},{k:'🦑',x:700,y:120,got:false},
 {k:'🐢',x:900,y:250,got:false},{k:'🦈',x:1100,y:180,got:false},{k:'🐙',x:1250,y:300,got:false}
];
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['f','FOTOS','0/6']]);
const say=H.msg(root,'Nade pelo recife e FOTOGRAFE as 6 criaturas! O₂ limitado — seja eficiente!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx+cam;ty=qy;});
let cam=0;
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const s=LIFE.find(q=>!q.got&&Math.hypot(px-q.x,py-q.y)<80);
 if(s){s.got=true;photos++;H.sfx('ok');hud.set('f',photos+'/6');
  if(photos>=6){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=photos*60+(win?Math.ceil(o2)*2:0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🪸 Recife documentado!',sub:'6 criaturas fotografadas!'}:{win:false,score:sc|0,title:'Sem ar!',sub:photos+'/6 fotos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=190*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>6){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,30,1320);py=H.clamp(py,30,350);
 o2-=dt*2.2;
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 cam=H.clamp(px-140,0,790);
 x.fillStyle='#2E9EAF';x.fillRect(0,0,560,380);
 x.font='26px system-ui';x.textAlign='center';
 for(let i=0;i<16;i++){const cx=(i*211-cam%211+211)%571-10;x.fillText('🪸',cx,340);}
 LIFE.forEach(s=>{
  const sx=s.x-cam;
  if(sx>-40&&sx<600){
   x.font='34px system-ui';x.fillText(s.k,sx,s.y+Math.sin(t*2+s.x)*6);
   if(s.got){x.font='18px system-ui';x.fillText('✅',sx,s.y-28);}
  }
 });
 x.font='30px system-ui';x.fillText('🤿',px-cam,py+10);
});
}});
