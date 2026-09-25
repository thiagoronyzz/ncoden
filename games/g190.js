/* NCODE N · 190 Castelo Inflável — 8 estrelas pulando! */
GREG(190,{
init(root,H){
let over=false,pl={x:250,y:200,vx:0,vy:0},stars=[],got=0,time=90,ax=0;
const hud=H.hud(root,[["es","ESTRELAS","0/8"],["tp","TEMPO",90],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas/A-D ou ARRASTE para os lados — o pula-pula quica sozinho! Pegue as 8 ★ em 90s. Rosa = super-quique!");
const o=H.cvs(root,500,400),x=o.x;
const r=H.rng(12);
for(let i=0;i<8;i++)stars.push({x:40+r()*420,y:60+r()*180,got:false});
const BUMP=[{x:120,w:80},{x:320,w:80}];
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowLeft"||c==="KeyA")ax=d?-1:(ax===-1?0:ax);
  if(c==="ArrowRight"||c==="KeyD")ax=d?1:(ax===1?0:ax);
});
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:got*40,title:"Festa acabou!",sub:got+"/8 estrelas. Mire os quiques rosa!"});
  }
  let dx=ax;
  if(ptr.down)dx=H.clamp((ptr.x-pl.x)/80,-1,1);
  pl.vx+=(dx*260-pl.vx)*dt*4;
  pl.vy+=900*dt;
  pl.x+=pl.vx*dt;pl.y+=pl.vy*dt;
  if(pl.x<16){pl.x=16;pl.vx*=-0.7;}if(pl.x>o.W-16){pl.x=o.W-16;pl.vx*=-0.7;}
  if(pl.y>340){
    pl.y=340;
    const sup=BUMP.some(b=>pl.x>b.x&&pl.x<b.x+b.w);
    pl.vy=sup?-620:-430;
    H.sfx("pop");
  }
  stars.forEach(s=>{
    if(!s.got&&Math.hypot(s.x-pl.x,s.y-pl.y)<30){
      s.got=true;got++;H.score(got*40);hud.set("es",got+"/8");hud.set("sc",got*40);H.sfx("ok");
      if(got>=8){over=true;
        return H.done({win:true,score:420,title:"Rei do pula-pula!",sub:"8 estrelas sem parar de quicar!"});
      }
    }
  });
  x.fillStyle="#E86AA0";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#C44E80";
  for(let i=0;i<6;i++){x.fillRect(i*90+10,0,26,60);}
  x.fillStyle="#7A2E50";x.fillRect(0,340,o.W,60);
  BUMP.forEach(b=>{
    x.fillStyle=H.C.wasabi;x.fillRect(b.x,330,b.w,12);
  });
  x.font="24px serif";
  stars.forEach(s=>{if(!s.got)x.fillText("★",s.x-12,s.y+8);});
  x.font="30px serif";
  x.fillText("i:acrobat",pl.x-15,pl.y-6);
});
}});
