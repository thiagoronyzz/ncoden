/* NCODE N · 045 Bola Quicante — suba pelas fendas */
GREG(45,{
init(root,H){
const GOAL=1500;
let over=false,bx,by,vy,plats,cam,sc=0,jumpCD=0;
const hud=H.hud(root,[["al","ALTURA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> pula · <b>setas/mouse</b> move. Suba "+GOAL+"px sem cair no vazio!");
const o=H.cvs(root,460,440),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  bx=o.W/2;by=o.H-80;vy=0;cam=0;sc=0;
  plats=[];let y=o.H-40;
  for(let i=0;i<24;i++){
    const gap=132-Math.min(50,i*2.4);
    let gx=40+Math.random()*(o.W-80-gap);
    if(i===0){ // a fenda inicial não fica sob a bola
      const mid=o.W/2-34;
      if(gx<mid&&gx+gap>mid+68)gx=mid+68;
      else if(gx<mid+68&&gx+gap>mid)gx=Math.max(40,Math.min(gx,mid-70-gap>40?mid-70-gap:gx));
    }
    plats.push({y,gx,gw:gap});
    y-=118;
  }
}
build();
function jump(){if(over||jumpCD>0)return;jumpCD=.18;vy=-560;H.beep(500,.06,"square",.035);}
kb.on((c,d)=>{if(d&&c==="Space")jump();});
H.onTap(o,()=>jump());
H.loop(dt=>{
  if(over)return;
  jumpCD-=dt;
  if(kb.is("ArrowLeft"))bx-=260*dt;
  if(kb.is("ArrowRight"))bx+=260*dt;
  if(ptr.down)bx+=(ptr.x-bx)*Math.min(1,dt*8);
  bx=H.clamp(bx,14,o.W-14);
  vy+=1500*dt;by+=vy*dt;
  const wy=by+cam;
  for(const p of plats){
    if(vy>0&&Math.abs(wy-p.y)<10&&(bx<p.gx||bx>p.gx+p.gw)){
      if(wy>=p.y-4&&wy<=p.y+14){by=p.y-cam;vy=0;}
    }
  }
  if(by<o.H*0.42)cam-=(o.H*0.42-by),by=o.H*0.42;
  const alt=Math.max(0,Math.round(-cam));
  sc=alt;H.score(sc);hud.set("sc",sc);hud.set("al",alt+"px");
  if(by>o.H+30){over=true;return H.done({win:false,score:sc,title:"Caiu no vazio!",sub:alt+"px escalados de "+GOAL+". Pule mais cedo!"});}
  if(alt>=GOAL){over=true;return H.done({win:true,score:sc+200,title:"Topo alcançado!",sub:GOAL+"px de pura impulsão."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const p of plats){
    const sy=p.y-cam;
    if(sy<-20||sy>o.H+20)continue;
    x.fillStyle=H.C.ink;
    x.fillRect(0,sy,p.gx,14);x.fillRect(p.gx+p.gw,sy,o.W-p.gx-p.gw,14);
    x.fillStyle=H.C.wasabi;
    x.fillRect(p.gx-4,sy,4,14);x.fillRect(p.gx+p.gw,sy,4,14);
  }
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,13,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
