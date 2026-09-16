/* NCODE N · 080 Gravidade Flip Runner — corra no chão e no teto */
GREG(80,{
init(root,H){
const GOAL=1300;
let over=false,px,py,vy,g,obs,dist,speed,sc=0,spawn=0;
const hud=H.hud(root,[["ds","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> inverte a gravidade entre chão e teto. Desvie dos blocos por "+GOAL+"m!");
const o=H.cvs(root,520,320),x=o.x;
const GF=o.H-46,CT=46;
function build(){px=120;py=GF;vy=0;g=1;obs=[];dist=0;speed=240;spawn=1;}
build();
function flip(){if(over)return;g*=-1;vy=0;H.beep(g>0?300:520,.07,"square",.04);}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")flip();});
H.onTap(o,flip);
H.loop(dt=>{
  if(over)return;
  vy+=g*2200*dt;py+=vy*dt;
  if(g>0&&py>=GF){py=GF;vy=0;}
  if(g<0&&py<=CT){py=CT;vy=0;}
  dist+=speed*dt/26;speed+=dt*6;
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.62,1.25-dist*0.0004);
    obs.push({x:o.W+20,top:Math.random()<.5,w:26+Math.random()*22});}
  for(const b of obs)b.x-=speed*dt;
  obs=obs.filter(b=>b.x>-50);
  for(const b of obs){
    const by=b.top?CT:GF-44;
    if(px+14>b.x&&px-14<b.x+b.w&&((g>0&&!b.top)||(g<0&&b.top))){
      if(py+14>by&&py-14<by+44){over=true;H.sfx("lose");
        return H.done({win:false,score:Math.floor(dist),title:"Esmagado!",sub:Math.floor(dist)+"m de "+GOAL+". Inverta antes do bloco!"});}
    }
  }
  sc=Math.floor(dist);H.score(sc);hud.set("sc",sc);hud.set("ds",sc+"m");
  if(dist>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Mestre da gravidade!",sub:GOAL+"m entre chão e teto."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(0,GF+16,o.W,o.H-GF);x.fillRect(0,0,o.W,CT-16);
  x.fillStyle=H.C.wasabi;x.fillRect(0,GF+14,o.W,3);x.fillRect(0,CT-17,o.W,3);
  for(const b of obs){
    const by=b.top?CT:GF-44;
    x.fillStyle=H.C.terra;x.fillRect(b.x,by,b.w,44);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(b.x,by,b.w,44);
    x.fillStyle=H.C.gold;x.fillRect(b.x,by,b.w,6);
  }
  x.save();x.translate(px,py);if(g<0)x.scale(1,-1);
  x.fillStyle=H.C.ink;x.fillRect(-13,-30,26,30);
  x.fillStyle=H.C.terra;x.fillRect(-13,-30,26,7);
  x.fillStyle="#fff";x.fillRect(2,-24,6,6);
  x.restore();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(g>0?"GRAV ▼ CHÃO":"GRAV ▲ TETO",12,o.H/2);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
