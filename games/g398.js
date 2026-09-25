/* NCODE N · 398 Gangorra Equilibrada — segure 30s! */
GREG(398,{
init(root,H){
let over=false,ang=0,av=0,t=0,time=30;
const hud=H.hud(root,[['tp','TEMPO',30]]);
const say=H.msg(root,'A gangorra tomba sozinha! Toque o lado ALTO para descer (◀/▶). Caia para o lado = fim. 30s!');
const o=H.cvs(root,480,360),x=o.x;
H.btn(root,'◀ PESO ESQUERDA',()=>{if(!over){av-=2.2;H.sfx('tick');}},false);
H.btn(root,'PESO DIREITA ▶',()=>{if(!over){av+=2.2;H.sfx('tick');}},false);
function gameOver(win){over=true;const sc=win?400:Math.max(0,30-time|0)*8;H.score(sc|0);
H.done({win:win,score:sc|0,title:win?'Equilíbrio zen!':'Tombou!',sub:win?'30s perfeitos!':'Toque o lado alto para compensar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 av+=(ang*2.4+Math.sin(t*1.7)*.8)*dt;
 av*=.985;
 ang+=av*dt;
 hud.set('tp',Math.ceil(time));
 if(Math.abs(ang)>.9){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,480,360);
 x.fillStyle='#5A5A55';
 x.beginPath();x.moveTo(210,300);x.lineTo(270,300);x.lineTo(240,220);x.fill();
 x.save();x.translate(240,210);x.rotate(ang);
 x.fillStyle='#8A6A2F';x.fillRect(-170,-10,340,20);
 x.font='26px system-ui';x.textAlign='center';x.fillText('i:baby',-140,-14);x.fillText('i:baby',140,-14);
 x.restore();
});
}});
