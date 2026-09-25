/* NCODE N · 185 Pilha de Canhão — pirâmide 3-2-1! */
GREG(185,{
init(root,H){
const CAN={x:70,y:320};
let over=false,balls=[],aim=null,shots=12,rest=0;
const hud=H.hud(root,[["ti","TIROS",12],["pl","EMPILHADAS","0/6"]]);
const say=H.msg(root,"ARRASTE do canhão para mirar e SOLTE! Empilhe 6 balas na plataforma: 3 embaixo, 2 no meio, 1 no topo. 12 tiros!");
const o=H.cvs(root,520,380),x=o.x;
const PLAT={x:330,y:300,w:150,h:16};
const ptr=H.ptr(o);
let wasDown=false;
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.03);
  if(ptr.down&&shots>0){
    if(!wasDown&&Math.hypot(ptr.x-CAN.x,ptr.y-CAN.y)<110)aim={x:ptr.x,y:ptr.y};
    if(aim)aim={x:ptr.x,y:ptr.y};
  }else if(aim&&!ptr.down){
    const dx=CAN.x-aim.x,dy=CAN.y-aim.y;
    if(Math.hypot(dx,dy)>24){
      balls.push({x:CAN.x,y:CAN.y,vx:dx*3.4,vy:dy*3.4,r:14});
      shots--;hud.set("ti",shots);H.sfx("tick");
      if(shots<=0&&balls.length<6)say("Últimos tiros voando…");
    }
    aim=null;
  }
  wasDown=ptr.down;
  // física
  balls.forEach(b=>{
    b.vy+=800*dt;
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    b.vx*=0.999;
    // chão
    if(b.y>360-b.r){b.y=360-b.r;b.vy*=-0.3;b.vx*=0.8;}
    // plataforma (topo)
    if(b.vy>0&&b.x>PLAT.x&&b.x<PLAT.x+PLAT.w&&b.y+b.r>PLAT.y&&b.y+b.r<PLAT.y+26){
      b.y=PLAT.y-b.r;b.vy*=-0.25;b.vx*=0.85;
    }
    if(b.x<14){b.x=14;b.vx*=-0.4;}if(b.x>o.W-14){b.x=o.W-14;b.vx*=-0.4;}
  });
  for(let k=0;k<4;k++){
    for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
      const A=balls[i],B=balls[j];
      const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy),min=A.r+B.r;
      if(d<min&&d>0.01){
        const push=(min-d)/2,nx=dx/d,ny=dy/d;
        A.x-=nx*push;A.y-=ny*push;B.x+=nx*push;B.y+=ny*push;
        const rvx=B.vx-A.vx,rvy=B.vy-A.vy,rel=rvx*nx+rvy*ny;
        if(rel<0){
          A.vx+=nx*rel*.6;A.vy+=ny*rel*.6;
          B.vx-=nx*rel*.6;B.vy-=ny*rel*.6;
        }
      }
    }
  }
  const still=balls.every(b=>Math.hypot(b.vx,b.vy)<25);
  const onPlat=balls.filter(b=>b.x>PLAT.x-10&&b.x<PLAT.x+PLAT.w+10&&b.y<PLAT.y);
  const lv0=onPlat.filter(b=>b.y>PLAT.y-40).length;
  const lv1=onPlat.filter(b=>b.y<=PLAT.y-40&&b.y>PLAT.y-72).length;
  const lv2=onPlat.filter(b=>b.y<=PLAT.y-72).length;
  hud.set("pl",onPlat.length+"/6");
  if(still&&onPlat.length>=6&&lv0>=3&&lv1>=2&&lv1+lv2>=3){
    over=true;H.score(300+shots*20);
    return H.done({win:true,score:300+shots*20+100,title:"Artilheiro engenheiro!",sub:"Pirâmide 3-2-1 empilhada a bala!"});
  }
  if(shots<=0&&still){
    rest+=dt;
    if(rest>1.5){over=true;
      return H.done({win:false,score:onPlat.length*30,title:"Pilha torta!",sub:onPlat.length+"/6 na plataforma (3+2+1). Mire com carinho!"});
    }
  }else rest=0;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,360,o.W,20);
  x.fillStyle="#5b3d20";x.fillRect(PLAT.x,PLAT.y,PLAT.w,PLAT.h);
  x.fillRect(PLAT.x+10,PLAT.y+16,14,44);x.fillRect(PLAT.x+PLAT.w-24,PLAT.y+16,14,44);
  x.font="30px serif";x.fillText("i:bomb",CAN.x-15,CAN.y+10);
  if(aim){
    x.strokeStyle=H.C.terra;x.lineWidth=2;
    x.beginPath();x.moveTo(CAN.x,CAN.y);x.lineTo(aim.x,aim.y);x.stroke();
  }
  balls.forEach(b=>{
    x.fillStyle=H.C.ink;x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill();
    x.fillStyle="#555";x.beginPath();x.arc(b.x-4,b.y-4,4,0,7);x.fill();
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("base "+Math.min(3,lv0)+"/3 · meio "+Math.min(2,lv1)+"/2 · topo "+Math.min(1,lv2)+"/1",330,290);
});
}});
