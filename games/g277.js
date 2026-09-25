/* NCODE N · 277 Armazém Escuro — navegue pelo som! */
GREG(277,{
init(root,H){
let over=false,px=30,py=430,tx=px,ty=py,t=0,lives=3,ping=0,reveal=0,charges=3;
const GD=[
 {x:150,y:150,vx:40,vy:25},{x:320,y:320,vx:-35,vy:30},{x:230,y:230,vx:30,vy:-40}
];
const hud=H.hud(root,[['v','VIDAS',3],['fl','LANTERNA',3]]);
const say=H.msg(root,'Chegue à saída no escuro! O radar revela os guardas a cada 2s. Toque = bip: perto = agudo! Lanterna revela tudo (3×).');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;beep();});
function beep(){
 const d=Math.min.apply(null,GD.map(g=>Math.hypot(px-g.x,py-g.y)));
 H.sfx(d<120?'bad':'tick');
}
H.btn(root,'Lanterna (3)',()=>{
 if(over||charges<=0)return;
 charges--;reveal=2.5;H.sfx('ok');hud.set('fl',charges);
},false);
function gameOver(win){over=true;const sc=win?350+lives*100:40;H.score(sc);
H.done(win?{win:true,score:sc,title:'Navegador do escuro!',sub:'Saiu sem esbarrar.'}:{win:false,score:sc,title:'Encurralado!',sub:'Esbarrou nos guardas. Ouça os bips!'});}
H.loop(dt=>{
 if(over)return;t+=dt;ping+=dt;
 if(reveal>0)reveal-=dt;
 if(ping>2){ping=0;beep();}
 GD.forEach(g=>{g.x+=g.vx*dt;g.y+=g.vy*dt;if(g.x<30||g.x>430)g.vx*=-1;if(g.y<30||g.y>430)g.vy*=-1;});
 const sp=120*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 if(GD.some(g=>Math.hypot(px-g.x,py-g.y)<24)){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}px=30;py=430;tx=px;ty=py;}
 if(px>406&&py<54){gameOver(true);return;}
 x.fillStyle='#0C0C10';x.fillRect(0,0,460,460);
 const pr=(ping/2)*230;
 x.strokeStyle='rgba(196,214,69,.5)';x.lineWidth=2;
 x.beginPath();x.arc(px,py,pr,0,7);x.stroke();
 const vis=reveal>0||ping<.9;
 if(vis)GD.forEach(g=>{x.fillStyle='#D94E34';x.beginPath();x.arc(g.x,g.y,11,0,7);x.fill();x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='center';x.fillText('!',g.x,g.y+4);});
 const eg=x.createRadialGradient?null:null;
 x.fillStyle='rgba(62,124,79,.9)';x.fillRect(406,8,46,46);
 x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('i:door',429,42);
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 x.fillStyle='#fff';x.font='12px system-ui';x.textAlign='left';
 x.fillText(reveal>0?'LIGADA':'Radar: '+(2-ping).toFixed(1)+'s',14,448);
});
}});
