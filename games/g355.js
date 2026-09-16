/* NCODE N · 355 Caminhada na Geleira — fendas e fósseis! */
GREG(355,{
init(root,H){
let over=false,px=40,py=300,tx=px,ty=py,t=0,cold=0,fossils=0;
const CREV=[];
for(let i=0;i<7;i++)CREV.push({x:100+i*80,y:80+Math.random()*300,w:26});
const FOS=[];
for(let i=0;i<4;i++)FOS.push({x:80+Math.random()*480,y:60+Math.random()*320,got:false});
const hud=H.hud(root,[['f','FÓSSEIS','0/4'],['fr','FRIO','0%']]);
const say=H.msg(root,'Atravesse até a caverna 🕳️ e pegue 4 fósseis 🦴! Fendas azuis = volte ao início. Frio sobe parado — mexa-se!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=fossils*70+(win?250-Math.ceil(cold):0);H.score(Math.max(0,sc)|0);
H.done(win?{win:true,score:Math.max(0,sc)|0,title:'🧊 Travessia glacial!',sub:fossils+'/4 fósseis!'}:{win:false,score:fossils*70,title:'Congelado!',sub:'Não fique parado no gelo!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=150*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 let mv=false;
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;mv=true;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;mv=true;}}
 px=H.clamp(px,16,544);py=H.clamp(py,16,384);
 if(mv)cold=Math.max(0,cold-18*dt);else cold+=12*dt;
 hud.set('fr',Math.min(100,cold|0)+'%');
 if(cold>=100){gameOver(false);return;}
 if(CREV.some(c=>Math.abs(px-c.x)<c.w/2+6&&Math.abs(py-c.y)<90)){px=40;py=300;tx=px;ty=py;H.sfx('bad');say('🕳️ Fenda! De volta ao início.');}
 FOS.forEach(f=>{
  if(!f.got&&Math.hypot(px-f.x,py-f.y)<26){f.got=true;fossils++;H.sfx('ok');hud.set('f',fossils+'/4');}
 });
 if(px>510){gameOver(fossils>=4?true:true);return;}
 x.fillStyle='#DCEEF5';x.fillRect(0,0,560,400);
 CREV.forEach(c=>{x.fillStyle='#2E6E8A';x.fillRect(c.x-c.w/2,c.y-90,c.w,180);});
 FOS.forEach(f=>{if(!f.got){x.font='22px system-ui';x.textAlign='center';x.fillText('🦴',f.x,f.y);}});
 x.font='30px system-ui';x.fillText('🕳️',530,200);
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,11,0,7);x.fill();
 x.fillStyle=cold>60?'#7FB3C8':'#C4D645';x.beginPath();x.arc(px,py,5,0,7);x.fill();
});
}});
