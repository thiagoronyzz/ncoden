/* NCODE N · 272 Telhados Noturnos — fuja do holofote! */
GREG(272,{
init(root,H){
const ROOFS=[[0,380,120],[140,340,100],[260,300,100],[380,330,80],[480,290,90],[590,320,90]];
let over=false,px=40,py=340,vx=0,vy=0,ground=true,exp=0,t=0,win=false;
const hud=H.hud(root,[['ex','EXPOSIÇÃO','0%']]);
const say=H.msg(root,'Atravesse os telhados até a borda direita! Setas movem, Espaço/Toque pula. O holofote revela — cheio = pego!');
const o=H.cvs(root,680,440),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&(c==='Space'||c==='ArrowUp'||c==='KeyW'))jump();});
H.onTap(o,()=>jump());
function jump(){if(over||!ground)return;vy=-330;ground=false;H.sfx('tick');}
function spotX(){return 340+Math.sin(t*.7)*300;}
function gameOver(w){over=true;win=w;const sc=w?350:Math.max(20,px|0);H.score(sc);
H.done(w?{win:true,score:sc,title:'Rei dos telhados!',sub:'Atravessou sem ser visto.'}:{win:false,score:sc,title:'Iluminado!',sub:'O helicóptero te achou. Corra entre as varreduras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const L=dn.ArrowLeft||dn.KeyA,R=dn.ArrowRight||dn.KeyD;
 vx=H.clamp(vx+((R?1:0)-(L?1:0))*900*dt,-180,180);
 if(!L&&!R)vx*=.9;
 px+=vx*dt;
 vy+=900*dt;py+=vy*dt;ground=false;
 ROOFS.forEach(r=>{
  if(px>=r[0]&&px<=r[0]+r[2]&&py>=r[1]-6&&py<=r[1]+24&&vy>=0){py=r[1];vy=0;ground=true;}
 });
 if(py>440){gameOver(false);return;}
 px=H.clamp(px,8,672);
 if(Math.abs(px-spotX())<45)exp+=90*dt;else exp=Math.max(0,exp-50*dt);
 hud.set('ex',(Math.min(100,exp)|0)+'%');
 if(exp>=100){gameOver(false);return;}
 if(px>660){gameOver(true);return;}
 x.fillStyle='#14141C';x.fillRect(0,0,680,440);
 x.fillStyle='#fff';
 for(let i=0;i<40;i++){const sx=(i*167)%680,sy=(i*97)%200;x.fillRect(sx,sy,2,2);}
 const sx=spotX();
 x.fillStyle='rgba(232,163,61,.25)';
 x.beginPath();x.moveTo(sx-20,60);x.lineTo(sx+20,60);x.lineTo(sx+60,440);x.lineTo(sx-60,440);x.fill();
 x.font='26px system-ui';x.textAlign='center';x.fillText('i:heli',sx,50);
 ROOFS.forEach(r=>{x.fillStyle='#3E3E48';x.fillRect(r[0],r[1],r[2],440-r[1]);x.fillStyle='#C4D645';x.fillRect(r[0],r[1],r[2],6);});
 x.fillStyle='#3E7C4F';x.fillRect(660,200,20,240);
 x.fillStyle=Math.abs(px-sx)<45?'#D94E34':'#C4D645';
 x.beginPath();x.arc(px,py-12,11,0,7);x.fill();x.strokeStyle='#000';x.lineWidth=2;x.stroke();
});
}});
