/* NCODE N · 047 Corredor Infinito — pule e deslize */
GREG(47,{
init(root,H){
const GOAL=1500;
let over=false,px,py,vy,slide,obs,dist,speed,sc=0,spawn=0;
const hud=H.hud(root,[["ds","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>↑/Espaço/toque</b> pula · <b>↓</b> desliza. Chegue a "+GOAL+"m!");
const o=H.cvs(root,520,320),x=o.x;
const GY=o.H-60;
function build(){px=110;py=GY;vy=0;slide=0;obs=[];dist=0;speed=230;spawn=1;}
build();
function jump(){if(over||py<GY-4)return;vy=-560;H.beep(520,.07,"square",.035);}
function doSlide(){if(over||py<GY-4)return;slide=.55;H.beep(300,.06,"square",.03);}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;if(c==="Space"||c==="ArrowUp")jump();if(c==="ArrowDown")doSlide();});
H.onTap(o,()=>jump());
H.swipe(o,{up:jump,down:doSlide,tap:jump});
H.loop(dt=>{
  if(over)return;
  slide-=dt;vy+=1600*dt;py+=vy*dt;
  if(py>=GY){py=GY;vy=0;}
  dist+=speed*dt/28;speed+=dt*7;
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.7,1.5-dist*0.0004);
    obs.push({x:o.W+20,hi:Math.random()<.4});}
  for(const b of obs)b.x-=speed*dt;
  obs=obs.filter(b=>b.x>-40);
  const ph=slide>0?22:44,pw=30;
  for(const b of obs){
    const bw=26,bh=b.hi?30:52;
    const bx=b.x,by=b.hi?GY-96:GY-bh;
    if(px+pw>bx&&px<bx+bw&&py-ph+44>by+4&&py-44<by+bh-4){
      if(!(slide>0&&b.hi&&py>=GY-4)){
        over=true;H.sfx("lose");
        return H.done({win:false,score:Math.floor(dist),title:"Tropeçou!",sub:Math.floor(dist)+"m de "+GOAL+". Deslize sob as barreiras altas!"});
      }
    }
  }
  sc=Math.floor(dist);H.score(sc);hud.set("sc",sc);hud.set("ds",sc+"m");
  if(dist>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Maratonista!",sub:GOAL+"m sem tropeçar."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,GY+22,o.W,o.H-GY);
  x.fillStyle=H.C.ink;x.fillRect(0,GY+20,o.W,3);
  x.strokeStyle=H.C.ink3;
  const off=(dist*28)%60;
  for(let i=-1;i<12;i++){x.beginPath();x.moveTo(i*60-off,GY+34);x.lineTo(i*60-off+24,GY+34);x.stroke();}
  for(const b of obs){
    if(b.hi){x.fillStyle=H.C.gold;x.fillRect(b.x,GY-96,26,30);}
    else{x.fillStyle=H.C.terra;x.fillRect(b.x,GY-52,26,52);}
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    b.hi?x.strokeRect(b.x,GY-96,26,30):x.strokeRect(b.x,GY-52,26,52);
  }
  x.fillStyle=H.C.ink;
  if(slide>0)x.fillRect(px,py-22,44,22);
  else x.fillRect(px,py-44,30,44);
  x.fillStyle=H.C.wasabi;x.fillRect(px,py-(slide>0?22:44),30,6);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
