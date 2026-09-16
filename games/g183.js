/* NCODE N · 183 Bola Grudenta — cresça até 40! */
GREG(183,{
init(root,H){
let over=false,ball={x:250,y:200,vx:0,vy:0,r:10},objs=[],time=120,ax=0,ay=0;
const hud=H.hud(root,[["tm","TAMANHO",10],["tp","TEMPO",120],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas/WASD ou ARRASTE para rolar! Grude nos menores (📎🍒🧸…). Maiores que você te empurram. Chegue a 40!");
const o=H.cvs(root,500,380),x=o.x;
const EM=[["📎",4],["🍒",5],["🧸",7],["📕",6],["🎾",8],["👟",10],["🐈",12],["🪑",15],["🚲",18],["🛋️",22],["🚗",26],["🐘",30]];
const r=H.rng(9);
for(let i=0;i<36;i++){
  const k=Math.floor(r()*Math.min(EM.length,4+Math.floor(i/5)));
  objs.push({e:EM[k][0],s:EM[k][1],x:30+r()*440,y:30+r()*320});
}
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowLeft"||c==="KeyA")ax=d?-1:(ax===-1?0:ax);
  if(c==="ArrowRight"||c==="KeyD")ax=d?1:(ax===1?0:ax);
  if(c==="ArrowUp"||c==="KeyW")ay=d?-1:(ay===-1?0:ay);
  if(c==="ArrowDown"||c==="KeyS")ay=d?1:(ay===1?0:ay);
});
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:Math.floor(ball.r)*10,title:"Tempo!",sub:"Tamanho "+Math.floor(ball.r)+"/40. Grude nos pequenos primeiro!"});
  }
  let dx=ax,dy=ay;
  if(ptr.down){dx=(ptr.x-ball.x)/60;dy=(ptr.y-ball.y)/60;}
  ball.vx+=(dx*300-ball.vx)*dt*3;
  ball.vy+=(dy*300-ball.vy)*dt*3;
  ball.x=H.clamp(ball.x+ball.vx*dt,ball.r,o.W-ball.r);
  ball.y=H.clamp(ball.y+ball.vy*dt,ball.r,o.H-ball.r);
  for(let i=objs.length-1;i>=0;i--){
    const ob=objs[i];
    if(Math.hypot(ob.x-ball.x,ob.y-ball.y)<ball.r+ob.s){
      if(ob.s<ball.r*1.15){
        objs.splice(i,1);
        ball.r=Math.min(46,ball.r+ob.s*.22);
        H.sfx("pop");
        hud.set("tm",Math.floor(ball.r));H.score(Math.floor(ball.r)*10);hud.set("sc",Math.floor(ball.r)*10);
        if(ball.r>=40){over=true;
          return H.done({win:true,score:500,title:"Bola gigante!",sub:"De clipe a elefante em "+Math.floor(120-time)+"s!"});
        }
      }else{
        const d=Math.max(1,Math.hypot(ball.x-ob.x,ball.y-ob.y));
        ball.vx+=(ball.x-ob.x)/d*400*dt;ball.vy+=(ball.y-ob.y)/d*400*dt;
      }
    }
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.font="20px serif";
  objs.forEach(ob=>{
    x.font=Math.max(12,ob.s*1.6)+"px serif";
    x.fillText(ob.e,ob.x-ob.s*.8,ob.y+ob.s*.6);
  });
  x.fillStyle="#D94E34";
  x.beginPath();x.arc(ball.x,ball.y,ball.r,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.fillStyle="rgba(255,255,255,.4)";
  x.beginPath();x.arc(ball.x-ball.r*.3,ball.y-ball.r*.3,ball.r*.25,0,7);x.fill();
});
}});
