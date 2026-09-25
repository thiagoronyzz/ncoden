/* NCODE N · 169 Boneco de Pano — 400 pontos escada abaixo */
GREG(169,{
init(root,H){
let over=false,pts=[],sticks=[],thrown=false,drag=null,throws=0,score=0,rot=0,lastA=0,air=0,rest=0;
const hud=H.hud(root,[["ar","ARREMESSOS","0/3"],["pt","PONTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE o boneco para trás e SOLTE escada abaixo! Cambalhotas + distância = pontos. 3 arremessos, meta 400.");
const o=H.cvs(root,520,400),x=o.x;
const STEPS=[];
for(let i=0;i<7;i++)STEPS.push({x0:150+i*50,x1:200+i*50,top:150+i*32});
const GY=390;
function reset(){
  const sx=90,sy=110;
  pts=[
    {x:sx,y:sy-34,ox:sx,oy:sy-34},   // 0 cabeça
    {x:sx,y:sy-10,ox:sx,oy:sy-10},   // 1 tronco alto
    {x:sx,y:sy+16,ox:sx,oy:sy+16},   // 2 tronco baixo
    {x:sx-20,y:sy-8,ox:sx-20,oy:sy-8}, // 3 mão L
    {x:sx+20,y:sy-8,ox:sx+20,oy:sy-8}, // 4 mão R
    {x:sx-12,y:sy+40,ox:sx-12,oy:sy+40},// 5 pé L
    {x:sx+12,y:sy+40,ox:sx+12,oy:sy+40} // 6 pé R
  ];
  sticks=[[0,1],[1,2],[1,3],[1,4],[2,5],[2,6]];
  thrown=false;drag=null;rot=0;air=0;rest=0;
  lastA=Math.atan2(pts[2].y-pts[1].y,pts[2].x-pts[1].x);
}
reset();
const ptr=H.ptr(o);
function collide(p){
  if(p.y>GY){p.y=GY;p.x+=(p.ox-p.x)*-.0;p.vx=0;}
  for(const s of STEPS){
    if(p.x>s.x0&&p.x<s.x1&&p.y>s.top&&p.y<s.top+34){
      p.y=s.top;
    }
  }
  if(p.x<60&&p.y<150&&p.x>20){/* plataforma */
    if(p.y>140&&p.y<170)p.y=140;
  }
  if(p.x<8){p.x=8;}if(p.x>o.W-8){p.x=o.W-8;}
}
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.033);
  const cx=pts[1].x,cy=pts[1].y;
  if(!thrown){
    if(ptr.down&&Math.hypot(ptr.x-cx,ptr.y-cy)<70){
      if(!drag)drag={sx:ptr.x,sy:ptr.y};
      const dx=ptr.x-drag.sx,dy=ptr.y-drag.sy;
      pts.forEach((p,i)=>{
        const base=[[-0,-34],[0,-10],[0,16],[-20,-8],[20,-8],[-12,40],[12,40]][i];
        p.x=90+base[0]+dx*.5;p.y=110+base[1]+dy*.5;p.ox=p.x;p.oy=p.y;
      });
    }else if(drag){
      const dx=(ptr.x-drag.sx)*4,dy=(ptr.y-drag.sy)*4;
      pts.forEach(p=>{p.ox=p.x-dx*dt*8;p.oy=p.y-dy*dt*8;});
      thrown=true;throws++;hud.set("ar",throws+"/3");
      H.sfx("tick");drag=null;
    }
  }else{
    for(const p of pts){
      const vx=(p.x-p.ox)*0.99,vy=(p.y-p.oy)*0.99;
      p.ox=p.x;p.oy=p.y;
      p.x+=vx;p.y+=vy+900*dt*dt*2;
      collide(p);
    }
    for(let k=0;k<3;k++){
      for(const[a,b]of sticks){
        const A=pts[a],B=pts[b];
        const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1;
        const L0={ "0,1":24,"1,2":26,"1,3":20,"1,4":20,"2,5":26,"2,6":26 }[a+","+b]||24;
        const diff=(d-L0)/d*.5;
        A.x+=dx*diff;A.y+=dy*diff;B.x-=dx*diff;B.y-=dy*diff;
        collide(A);collide(B);
      }
    }
    const ang=Math.atan2(pts[2].y-pts[1].y,pts[2].x-pts[1].x);
    let da=ang-lastA;
    while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
    rot+=Math.abs(da);lastA=ang;air+=dt;
    const mv=Math.hypot(pts[1].x-pts[1].ox,pts[1].y-pts[1].oy);
    if(mv<.3)rest+=dt;else rest=0;
    if(rest>1.2||air>14){
      const dist=Math.max(0,pts[1].x-90);
      const flips=Math.floor(rot/(Math.PI*2));
      const gain=Math.floor(dist*.8)+flips*80+Math.floor(air*5);
      score+=gain;H.score(score);hud.set("pt",score);hud.set("sc",score);
      H.sfx("ok");say(""+gain+" pts! ("+flips+" flips, "+Math.floor(dist)+"px)");
      if(throws>=3){
        over=true;
        if(score>=400)return H.done({win:true,score,title:"Dublê lendário!",sub:score+" pontos em 3 tombos."});
        return H.done({win:false,score,title:"Queda sem graça…",sub:"Só "+score+"/400. Arremesse com mais força!"});
      }
      reset();
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,GY,o.W,o.H-GY);
  x.fillStyle="#9A8F7A";x.fillRect(20,140,130,10);
  STEPS.forEach(s=>{
    x.fillStyle="#B0A696";x.fillRect(s.x0,s.top,s.x1-s.x0,GY-s.top);
    x.strokeStyle=H.C.ink;x.strokeRect(s.x0,s.top,s.x1-s.x0,GY-s.top);
  });
  x.strokeStyle=H.C.ink;x.lineWidth=5;x.lineCap="round";
  sticks.forEach(([a,b])=>{x.beginPath();x.moveTo(pts[a].x,pts[a].y);x.lineTo(pts[b].x,pts[b].y);x.stroke();});
  x.fillStyle="#E8A33D";x.beginPath();x.arc(pts[0].x,pts[0].y,11,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  if(!thrown&&!drag){
    x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("ARRASTE E SOLTE!",40,60);
  }
});
}});
