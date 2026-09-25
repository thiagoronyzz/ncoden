/* NCODE N · 388 Trem em Movimento — pule os vagões! */
GREG(388,{
init(root,H){
let over=false,dist=0,sp=260,jump=0,jT=0,t=0,gapAt=500,gapW=80;
const hud=H.hud(root,[['d','DIST','0m']]);
const say=H.msg(root,'Toque <b>PULAR</b> para atravessar as brechas entre vagões! Caiu = fim. Meta: 5.000m!');
const o=H.cvs(root,560,320),x=o.x;
H.btn(root,'PULAR!',()=>{
 if(over||jump)return;
 jump=1;jT=0;H.sfx('tick');
},true);
function gameOver(){over=true;const sc=dist|0;H.score(sc);
H.done({win:dist>=5000,score:sc,title:dist>=5000?'Rei dos vagões!':'Caiu do trem!',sub:(dist|0).toLocaleString('pt-BR')+'/5.000m.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 dist+=sp*dt;
 if(dist>=5000){gameOver();return;}
 if(jump){jT+=dt/.6;if(jT>=1){jump=0;jT=0;}}
 gapAt-=sp*dt;
 if(gapAt<-100){gapAt=400+Math.random()*400;gapW=60+Math.random()*40;}
 const jr=jump?Math.sin(jT*Math.PI):0;
 const over2=gapAt<130&&gapAt+gapW>130;
 if(over2&&jr<.25){gameOver();return;}
 hud.set('d',(dist|0)+'m');
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,320);
 x.fillStyle='#4A4A55';x.fillRect(0,200,560,60);
 x.fillStyle='#2E6E8A';x.fillRect(0,200,gapAt,60);x.fillRect(gapAt+gapW,200,560-gapAt-gapW,60);
 x.fillStyle='#E8A33D';x.fillRect(0,200,560,8);
 const py=190-jr*110;
 x.font='32px system-ui';x.textAlign='center';x.fillText('i:climb',130,py);
});
}});
