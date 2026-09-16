/* NCODE N · 182 Corpo Mole — atravesse sem estourar! */
GREG(182,{
init(root,H){
let over=false,blob={x:60,y:300,vx:0,vy:0,r:22,sq:0},squeeze=0,spikes=[];
const hud=H.hud(root,[["es","PRESSÃO","0%"],["st","STATUS","vá ao 🏁"]]);
const say=H.msg(root,"ARRASTE a geleca pelo canal até o 🏁! Espremida demais (fino) ou espinho = 💥. Devagar nas fendas!");
const o=H.cvs(root,520,400),x=o.x;
const WALLS=[
  {x:0,y:0,w:520,h:20},{x:0,y:380,w:520,h:20},
  {x:150,y:20,w:24,h:220},{x:150,y:320,w:24,h:60},
  {x:300,y:100,w:24,h:280},{x:420,y:20,w:24,h:200},{x:420,y:300,w:24,h:80}
];
spikes=[{x:260,y:360},{x:262,y:40},{x:486,y:250}];
const GOAL={x:486,y:330};
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  if(ptr.down){
    blob.vx+=((ptr.x-blob.x)*8-blob.vx)*dt*4;
    blob.vy+=((ptr.y-blob.y)*8-blob.vy)*dt*4;
  }else{blob.vx*=0.9;blob.vy*=0.9;}
  blob.vx=H.clamp(blob.vx,-260,260);blob.vy=H.clamp(blob.vy,-260,260);
  blob.x+=blob.vx*dt;blob.y+=blob.vy*dt;
  // colisão paredes (empurra para fora)
  for(const w of WALLS){
    const nx=H.clamp(blob.x,w.x,w.x+w.w),ny=H.clamp(blob.y,w.y,w.y+w.h);
    const dx=blob.x-nx,dy=blob.y-ny,d=Math.hypot(dx,dy);
    if(d<blob.r){
      const push=(blob.r-d);
      if(d>0.01){blob.x+=dx/d*push;blob.y+=dy/d*push;}
      blob.vx*=.5;blob.vy*=.5;
    }
  }
  blob.x=H.clamp(blob.x,24,o.W-24);blob.y=H.clamp(blob.y,24,o.H-24);
  // espremer: mede espaço livre ao redor
  let free=60;
  for(const w of WALLS){
    const nx=H.clamp(blob.x,w.x,w.x+w.w),ny=H.clamp(blob.y,w.y,w.y+w.h);
    free=Math.min(free,Math.hypot(blob.x-nx,blob.y-ny));
  }
  const target=free<blob.r+6?(1-free/(blob.r+6)):0;
  blob.sq+=(target-blob.sq)*dt*5;
  hud.set("es",Math.floor(blob.sq*100)+"%");
  if(blob.sq>0.75){squeeze+=dt;
    if(squeeze>1){over=true;H.sfx("lose");
      return H.done({win:false,score:0,title:"ESPLODIU! 💥",sub:"Espremeram demais a geleca. Passe devagar!"});
    }
  }else squeeze=Math.max(0,squeeze-dt*2);
  if(spikes.some(s=>Math.hypot(blob.x-s.x,blob.y-s.y)<20)){
    over=true;H.sfx("lose");
    return H.done({win:false,score:0,title:"ESPETOU! 💥",sub:"Desvie dos espinhos!"});
  }
  if(Math.hypot(blob.x-GOAL.x,blob.y-GOAL.y)<28){
    over=true;H.score(300);
    return H.done({win:true,score:300,title:"Geleca ninja!",sub:"Atravessou o canal inteirinha."});
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#5b3d20";
  WALLS.forEach(w=>x.fillRect(w.x,w.y,w.w,w.h));
  x.font="20px serif";
  spikes.forEach(s=>x.fillText("🦔",s.x-10,s.y+7));
  x.font="30px serif";x.fillText("🏁",GOAL.x-15,GOAL.y+10);
  const rx=blob.r*(1+blob.sq*.7),ry=blob.r*(1-blob.sq*.55);
  x.fillStyle="rgba(196,214,69,.9)";
  x.beginPath();x.ellipse(blob.x,blob.y,rx,ry,0,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(blob.x-6,blob.y-3,2.5,0,7);x.arc(blob.x+6,blob.y-3,2.5,0,7);x.fill();
  if(blob.sq>0.5){x.fillStyle=H.C.terra;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("⚠ VAI ESTOURAR!",180,30);}
});
}});
