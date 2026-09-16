/* NCODE N · 385 Ponte Levadiça — atravesse antes de abrir! */
GREG(385,{
init(root,H){
let over=false,px=40,t=0,cyc=0,state='closed',win=false;
const hud=H.hud(root,[['e','ESTADO','FECHADA']]);
const say=H.msg(root,'Segure ANDAR para atravessar! A ponte ABRE de tempos em tempos — esteja no fim ou caia! 3 travessias!');
let cross=0;
const o=H.cvs(root,560,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
const wb=H.btn(root,'🚶 Segurar = ANDAR',()=>{},true);
wb.addEventListener('pointerdown',()=>{dn.walk=true;});
wb.addEventListener('pointerup',()=>{dn.walk=false;});
function gameOver(w){over=true;win=w;H.score(cross*150);
H.done({win:w,score:cross*150,title:w?'🌉 Travessias completas!':'🌉 Caiu no fosso!',sub:cross+'/3 travessias.'});}
H.loop(dt=>{
 if(over)return;t+=dt;cyc+=dt;
 const ph=cyc%10;
 state=ph<5?'closed':ph<6?'warn':'open';
 hud.set('e',state==='closed'?'FECHADA ✅':state==='warn'?'FECHANDO! ⚠️':'ABERTA ❌');
 if(dn.walk||dn.Space||dn.ArrowRight)px+=130*dt;
 px=H.clamp(px,40,520);
 if(state==='open'&&px>120&&px<460){gameOver(false);return;}
 if(px>=520){cross++;px=40;H.sfx('ok');if(cross>=3){gameOver(true);return;}}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,340);
 x.fillStyle='#2E6E8A';x.fillRect(100,180,360,160);
 x.fillStyle='#8A6A2F';x.fillRect(0,180,100,160);x.fillRect(460,180,100,160);
 if(state==='closed'){x.fillStyle='#5A4A33';x.fillRect(100,170,360,16);}
 else if(state==='warn'){x.fillStyle='#E8A33D';x.fillRect(100,170,360,16);}
 else{
  x.save();x.translate(100,170);x.rotate(-1.1);x.fillStyle='#5A4A33';x.fillRect(0,0,180,16);x.restore();
  x.save();x.translate(460,170);x.rotate(1.1+Math.PI);x.fillStyle='#5A4A33';x.fillRect(0,0,180,16);x.restore();
 }
 x.font='28px system-ui';x.textAlign='center';x.fillText('🚶',px,162);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Travessias '+cross+'/3 · '+(state==='closed'?'✅ CORRA!':state==='warn'?'⚠️ VOLTE OU CORRA!':'❌ ABERTA'),12,28);
});
}});
