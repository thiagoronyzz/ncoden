/* NCODE N · 064 Chão de Lava — suba, a lava sobe junto */
GREG(64,{
init(root,H){
const GOAL=1200;
let over=false,bx,by,vy,plats,lavaY,cam,sc=0;
const hud=H.hud(root,[["al","ALTURA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> pula · <b>setas/mouse</b> move. A lava sobe sem parar — alcance "+GOAL+"px!");
const o=H.cvs(root,460,440),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  bx=o.W/2;by=o.H-60;vy=0;cam=0;lavaY=60;sc=0;plats=[{x:0,w:o.W,y:0}];
  let y=-110;
  const r=H.rng(5);
  for(let i=0;i<22;i++){
    const w=110+r()*70;
    plats.push({x:r()*(o.W-w),w,y,mv:r()<.3?1+((i%2)*2-1)*0:0,ph:r()*6});
    y-=105;
  }
}
build();
function jump(){
  if(over)return;
  const wy=by+cam;
  for(const p of plats){
    const px=p.mv?p.x+Math.sin(Date.now()/900+p.ph)*40:p.x;
    if(vy>=0&&wy>=p.y-6&&wy<=p.y+18&&bx>px-4&&bx<px+p.w+4){vy=-620;H.beep(520,.06,"square",.035);return;}
  }
  if(wy>=-4&&wy<40){vy=-620;H.beep(520,.06,"square",.035);}
}
kb.on((c,d)=>{if(d&&c==="Space")jump();});
H.onTap(o,()=>jump());
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))bx-=280*dt;
  if(kb.is("ArrowRight"))bx+=280*dt;
  if(ptr.down)bx+=(ptr.x-bx)*Math.min(1,dt*8);
  bx=H.clamp(bx,12,o.W-12);
  vy+=1500*dt;vy=Math.min(700,vy);by+=vy*dt;
  lavaY+=26*dt;
  const wy=by+cam;
  for(const p of plats){
    const px=p.mv?p.x+Math.sin(Date.now()/900+p.ph)*40:p.x;
    if(vy>0&&wy>=p.y-4&&wy<=p.y+16&&bx>px&&bx<px+p.w){by=p.y-cam;vy=0;}
  }
  if(by<o.H*0.45){cam-=(o.H*0.45-by);by=o.H*0.45;}
  const alt=Math.max(0,Math.round(-cam));
  sc=alt;H.score(sc);hud.set("sc",sc);hud.set("al",alt+"px");
  const lavaScreenY=o.H-lavaY-cam+o.H*0;
  if(wy>=-lavaY+40){
    over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Virou churrasco!",sub:alt+"px de "+GOAL+". Não pare de subir!"});
  }
  if(by>o.H+40){over=true;H.sfx("lose");return H.done({win:false,score:sc,title:"Caiu na lava!",sub:alt+"px escalados."});}
  if(alt>=GOAL){over=true;return H.done({win:true,score:sc+200,title:"Acima da lava!",sub:GOAL+"px escalados contra a maré de fogo."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const p of plats){
    const sy=p.y-cam;
    if(sy<-20||sy>o.H+20)continue;
    const px=p.mv?p.x+Math.sin(Date.now()/900+p.ph)*40:p.x;
    x.fillStyle=p.mv?H.C.gold:H.C.ink;
    x.fillRect(px,sy,p.w,14);
    x.fillStyle=H.C.wasabi;x.fillRect(px,sy,p.w,4);
  }
  const ly=o.H-(-lavaY+40)-cam+ (o.H-40);
  const lavaTop=o.H-40-(-lavaY)-cam+40;
  x.fillStyle=H.C.terra;
  const lt=o.H-(lavaY-40)-cam;
  x.fillRect(0,Math.min(o.H,lt),o.W,o.H);
  x.fillStyle=H.C.gold;
  for(let i=0;i<10;i++){
    const bx2=i*50+((Date.now()/20)%50);
    x.beginPath();x.arc(bx2%o.W,Math.min(o.H,lt)+8,7,0,7);x.fill();
  }
  x.fillStyle=H.C.ink;x.beginPath();x.arc(bx,by,12,0,7);x.fill();
  x.strokeStyle=H.C.wasabi;x.lineWidth=2;x.stroke();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
