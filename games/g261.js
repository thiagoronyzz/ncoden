/* NCODE N · 261 Sombra Furtiva — cruze sem tocar a luz! */
GREG(261,{
init(root,H){
let over=false,px=40,py=420,tx=px,ty=py,exp=0,lives=3,t=0,lvl=1;
const hud=H.hud(root,[['v','VIDAS',3],['ex','EXPOSIÇÃO','0%'],['nv','FASE',1]]);
const say=H.msg(root,'Chegue à saída ! Fachos de luz revelam — blocos escuros escondem. 3 salas!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
const SH=[[90,300,120,60],[280,340,110,60],[150,140,100,120],[330,120,80,120]];
function beams(){return 2+lvl;}
function beamX(i,tt){const n=beams();return 60+i*(340/Math.max(1,n-1))+Math.sin(tt*(.5+i*.2)+i*2.1)*95;}
function status(){hud.set('v',lives);hud.set('ex',((exp*100)|0)+'%');hud.set('nv',lvl);}
function reset(){px=40;py=420;tx=px;ty=py;exp=0;}
function gameOver(win){over=true;const sc=win?400+lives*100:Math.max(10,(lvl-1)*120);H.score(sc);
H.done(win?{win:true,score:sc,title:'Invisível!',sub:'3 salas cruzadas sem ser visto.'}:{win:false,score:sc,title:'Flagrado!',sub:'Os holofotes te pegaram na sala '+lvl+'.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=135*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 const inSh=SH.some(s=>px>=s[0]&&px<=s[0]+s[2]&&py>=s[1]&&py<=s[1]+s[3]);
 let lit=false;
 for(let i=0;i<beams();i++)if(Math.abs(px-beamX(i,t))<15+lvl*2)lit=true;
 if(lit&&!inSh)exp+=dt*(.7+lvl*.25);else exp=Math.max(0,exp-dt*.8);
 if(exp>=1){lives--;H.sfx('bad');if(lives<=0){gameOver(false);return;}reset();}
 if(px>406&&py<54){if(lvl>=3){gameOver(true);return;}lvl++;reset();H.sfx('ok');}
 status();
 x.fillStyle='#22222A';x.fillRect(0,0,460,460);
 SH.forEach(s=>{x.fillStyle='#0E0E12';x.fillRect(s[0],s[1],s[2],s[3]);});
 x.fillStyle='#3E7C4F';x.fillRect(406,8,46,46);x.fillStyle='#fff';x.font='24px system-ui';x.textAlign='center';x.fillText('i:door',429,42);
 for(let i=0;i<beams();i++){const bx=beamX(i,t);x.fillStyle='rgba(232,163,61,.28)';x.fillRect(bx-15-lvl*2,0,30+lvl*4,460);x.fillStyle='rgba(232,163,61,.5)';x.fillRect(bx-3,0,6,460);}
 x.fillStyle=lit&&!inSh?'#D94E34':'#C4D645';x.beginPath();x.arc(px,py,10,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=2;x.stroke();
 x.fillStyle='rgba(0,0,0,.55)';x.fillRect(10,436,200,14);
 x.fillStyle=exp>.6?'#D94E34':'#E8A33D';x.fillRect(10,436,200*Math.min(1,exp),14);
 x.fillStyle='#fff';x.font='10px system-ui';x.textAlign='left';x.fillText('EXPOSIÇÃO',14,447);
});
status();
}});
