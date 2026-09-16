/* NCODE N · 117 Mergulhador de Pérolas — 8 pérolas, 1 fôlego */
GREG(117,{
init(root,H){
let over=false,d={x:250,y:40},ox=100,pearls=[],got=0,time=150,vy=0;
const hud=H.hud(root,[["pe","PÉROLAS","0/8"],["ox","OXIGÊNIO",100],["tp","TEMPO",150]]);
const say=H.msg(root,"<b>↑/↓ ou W/S</b> (ou toque acima/abaixo) para nadar. Superfície = ar. Ostras 🦪 no fundo guardam pérolas!");
const o=H.cvs(root,500,420),x=o.x;
const r=H.rng(9);
for(let i=0;i<8;i++)pearls.push({x:40+r()*420,y:250+r()*140,got:false});
let up=false,down=false;
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowUp"||c==="KeyW")up=d;
  if(c==="ArrowDown"||c==="KeyS")down=d;
});
H.onTap(o,(px,py)=>{if(py<d.y-20)up=true,down=false;else if(py>d.y+20)down=true,up=false;H.after(250,()=>{up=false;down=false;});});
H.loop(dt=>{
  if(over)return;
  time-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(up)vy-=300*dt;else if(down)vy+=300*dt;else vy*=0.92;
  vy=H.clamp(vy,-140,140);
  d.y=H.clamp(d.y+vy*dt,30,o.H-20);
  const depth=d.y/o.H;
  if(d.y<60)ox=Math.min(100,ox+50*dt);
  else ox-=dt*(6+depth*14);
  hud.set("ox",Math.max(0,Math.floor(ox)));
  pearls.forEach(p=>{
    if(!p.got&&Math.hypot(p.x-d.x,p.y-d.y)<26){
      p.got=true;got++;H.score(got*40);hud.set("pe",got+"/8");H.sfx("ok");
      if(got>=8){over=true;return H.done({win:true,score:got*40+Math.floor(ox),title:"Mergulho perfeito!",sub:"8 pérolas com fôlego de sobra."});}
    }
  });
  if(ox<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:got*40,title:"Sem ar!",sub:got+"/8 pérolas. Suba para respirar!"});}
  if(time<=0){over=true;
    return H.done({win:false,score:got*40,title:"Maré virou!",sub:got+"/8 pérolas. Mergulhe mais fundo!"});}
  const g=x.createLinearGradient(0,0,0,o.H);
  g.addColorStop(0,"#7fb3d5");g.addColorStop(1,"#0d2436");
  x.fillStyle=g;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(255,255,255,.35)";x.fillRect(0,44,o.W,3);
  x.font="20px serif";
  pearls.forEach(p=>{if(!p.got)x.fillText("🦪",p.x-10,p.y+8);});
  x.font="26px serif";
  x.fillText("🤿",d.x-13,d.y+9);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("profundidade "+Math.floor(depth*30)+"m",12,20);
});
}});
