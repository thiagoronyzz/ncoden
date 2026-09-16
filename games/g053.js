/* NCODE N · 053 Helicóptero no Túnel — segure para subir */
GREG(53,{
init(root,H){
const GOAL=1200;
let over=false,hx,hy,vy,segs,dist,sc=0;
const hud=H.hud(root,[["ds","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Segure toque/Espaço</b> para subir, solte para descer. Atravesse "+GOAL+"m de túnel!");
const o=H.cvs(root,520,340),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
let held=false;
function build(){
  hx=110;hy=o.H/2;vy=0;dist=0;sc=0;segs=[];
  let gy=o.H/2-70;
  for(let i=0;i<40;i++){gy=H.clamp(gy+(Math.random()-.5)*70,30,o.H-160);segs.push({x:i*90,gap:gy,h:150-Math.min(60,i*2)});}
}
build();
kb.on((c,d)=>{if(c==="Space")held=d;});
H.loop(dt=>{
  if(over)return;
  const up=held||ptr.down;
  vy+=1500*dt;if(up)vy-=2600*dt;
  vy=H.clamp(vy,-330,330);hy+=vy*dt;dist+=140*dt/22;
  const scroll=dist*22;
  const idx=Math.floor((scroll+hx)/90);
  const s=segs[Math.min(segs.length-1,Math.max(0,idx))];
  if(s&&(hy<s.gap+14||hy>s.gap+s.h-14)){over=true;H.sfx("lose");
    return H.done({win:false,score:Math.floor(dist),title:"Bateu no túnel!",sub:Math.floor(dist)+"m de "+GOAL+". Toques curtos estabilizam!"});}
  if(hy<-10||hy>o.H+10){over=true;H.sfx("lose");
    return H.done({win:false,score:Math.floor(dist),title:"Saiu do túnel!",sub:Math.floor(dist)+"m percorridos."});}
  sc=Math.floor(dist);H.score(sc);hud.set("sc",sc);hud.set("ds",sc+"m");
  if(dist>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Pouso perfeito!",sub:GOAL+"m de túnel sem um arranhão."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;
  for(const g of segs){
    const sx=g.x-scroll;
    if(sx<-100||sx>o.W+100)continue;
    x.fillRect(sx,0,90,g.gap);x.fillRect(sx,g.gap+g.h,90,o.H-g.gap-g.h);
    x.fillStyle=H.C.wasabi;x.fillRect(sx,g.gap-4,90,4);x.fillRect(sx,g.gap+g.h,90,4);
    x.fillStyle=H.C.ink;
  }
  x.save();x.translate(hx,hy);
  x.fillStyle=H.C.terra;x.fillRect(-22,-10,44,18);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-22,-10,44,18);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  const r=(Date.now()/40)%40;
  x.beginPath();x.moveTo(-34,-12);x.lineTo(34,-12);x.stroke();
  x.beginPath();x.moveTo(-22,8);x.lineTo(-30,20);x.moveTo(22,8);x.lineTo(30,20);x.stroke();
  x.restore();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
