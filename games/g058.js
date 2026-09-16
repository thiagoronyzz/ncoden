/* NCODE N · 058 Pong Solo — rebata contra a parede */
GREG(58,{
init(root,H){
let over=false,px,bx,by,vx,vy,rally=0,best=0,sc=0;
const hud=H.hud(root,[["rb","RÉPLICAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Mova com <b>mouse, toque ou setas</b>. A bola acelera a cada réplica. 25 réplicas vencem!");
const o=H.cvs(root,500,380),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){px=o.W/2;rally=0;sc=0;serve(1);}
function serve(dir){
  bx=o.W/2;by=o.H/2;
  const a=(Math.random()*.6-.3)+(dir>0?0:Math.PI);
  vx=Math.cos(a)*260;vy=Math.sin(a)*260-60;
}
build();
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))px-=420*dt;
  if(kb.is("ArrowRight"))px+=420*dt;
  if(kb.is("ArrowUp"))px-=420*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*14);
  px=H.clamp(px,50,o.W-50);
  bx+=vx*dt;by+=vy*dt;
  if(bx<12){bx=12;vx=Math.abs(vx);H.beep(240,.04);}
  if(bx>o.W-12){bx=o.W-12;vx=-Math.abs(vx);H.beep(240,.04);}
  if(by<12){by=12;vy=Math.abs(vy);H.beep(240,.04);}
  if(vy>0&&by>o.H-44&&by<o.H-24&&Math.abs(bx-px)<54){
    const off=(bx-px)/54;
    const sp=Math.min(640,Math.hypot(vx,vy)*1.045+6);
    vx=off*sp*.85;vy=-Math.abs(sp*.9);
    rally++;sc+=rally;H.score(sc);hud.set("sc",sc);hud.set("rb",rally);H.beep(440+rally*12,.05);
    if(rally>=25){over=true;return H.done({win:true,score:sc+150,title:"Muralha!",sub:"25 réplicas contra a parede acelerada."});}
  }
  if(by>o.H+14){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Passou direto!",sub:rally+" réplicas antes da fuga."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(0,0,o.W,8);
  x.setLineDash([6,8]);x.strokeStyle=H.C.cement;
  x.beginPath();x.moveTo(0,o.H/2);x.lineTo(o.W,o.H/2);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ink;x.fillRect(px-54,o.H-36,108,12);
  x.fillStyle=H.C.terra;x.fillRect(px-54,o.H-36,108,4);
  x.fillStyle=H.C.ok;x.beginPath();x.arc(bx,by,9,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("vel "+Math.round(Math.hypot(vx,vy)),12,24);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
