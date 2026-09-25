/* NCODE N · 283 Subida da Colina — sem capotar! */
GREG(283,{
init(root,H){
const HILLS=[];let hx=0;
for(let i=0;i<60;i++){HILLS.push({x:hx,h:120+Math.sin(i*.7)*60+Math.random()*40});hx+=90;}
const TOP=HILLS[HILLS.length-1].x;
let over=false,px=30,tilt=0,v=0,fuel=100,t=0;
const hud=H.hud(root,[['c','COMBUSTÍVEL','100%'],['d','DIST','0%']]);
const say=H.msg(root,'Suba até o topo ! ↑ acelera, ↓ freia, ←→ inclinam. Capotou (|inclinação| alta) ou sem combustível = fim!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapSide=qx<280?-1:1;tapT=.3;});
let tapSide=0,tapT=0;
function gy(x2){
 const i=H.clamp(Math.floor(x2/90),0,HILLS.length-2),f=(x2-i*90)/90;
 return 330-(HILLS[i].h*(1-f)+HILLS[i+1].h*f);
}
function slope(x2){return(gy(x2+10)-gy(x2-10))/20;}
function gameOver(win){over=true;H.sfx(win?"win":"lose");const sc=win?Math.max(200,600-(t|0)*6):(px/TOP*200|0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Topo conquistado!',sub:'Em '+t.toFixed(1)+'s com '+(fuel|0)+'% de tanque.'}:{win:false,score:sc,title:'Ficou no caminho!',sub:fuel<=0?'Sem combustível — dose o acelerador!':'Capotou! Incline nas subidas.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapSide=0;
 const up=dn.ArrowUp||dn.KeyW,dn2=dn.ArrowDown||dn.KeyS;
 const L=(dn.ArrowLeft||dn.KeyA)||tapSide<0,R=(dn.ArrowRight||dn.KeyD)||tapSide>0;
 if(up&&fuel>0){v+=140*dt;fuel-=7*dt;}
 if(dn2)v-=160*dt;
 v-=slope(px)*60*dt;v*=.995;v=H.clamp(v,-60,220);
 px+=v*dt;px=Math.max(10,px);
 const sl=slope(px);
 tilt+=(Math.atan(sl)*.9-tilt)*2*dt;
 if(L)tilt-=1.4*dt;if(R)tilt+=1.4*dt;
 tilt=H.clamp(tilt,-1.4,1.4);
 hud.set('c',(Math.max(0,fuel)|0)+'%');hud.set('d',Math.min(99,px/TOP*100|0)+'%');
 if(Math.abs(tilt)>1.25||fuel<=0){gameOver(false);return;}
 if(px>=TOP){gameOver(true);return;}
 const cam=H.clamp(px-140,0,TOP-420);
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,380);
 x.fillStyle='#3E7C4F';x.beginPath();x.moveTo(0,380);
 for(let sx=0;sx<=560;sx+=14)x.lineTo(sx,gy(sx+cam));
 x.lineTo(560,380);x.fill();
 x.font='26px system-ui';x.textAlign='center';x.fillText('i:flag',TOP-cam,gy(TOP)-24);
 const py=gy(px);
 x.save();x.translate(px-cam,py-14);x.rotate(tilt);
 x.fillStyle='#D94E34';x.fillRect(-24,-12,48,14);
 x.fillStyle='#181816';x.beginPath();x.arc(-14,4,8,0,7);x.arc(14,4,8,0,7);x.fill();
 x.restore();
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('i:barrel'+(Math.max(0,fuel)|0)+'%   '+(px/TOP*100|0)+'% do morro',12,26);
});
}});
