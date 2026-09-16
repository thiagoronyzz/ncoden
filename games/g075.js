/* NCODE N · 075 Buraco em Um — putt no buraco móvel */
GREG(75,{
init(root,H){
let over=false,hole=0,strokes=0,total=0,ball,hx,dir=1,aim=null;
const hud=H.hud(root,[["bh","BURACO","1/5"],["tc","TACADAS",0],["sc","TOTAL",0]]);
const say=H.msg(root,"<b>Arraste para trás</b> e solte para putt. O buraco desliza! 5 buracos em até 12 tacadas.");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
const TEES=[[80,330],[420,330],[80,90],[420,90],[250,330]];
function build(){
  const t=TEES[hole];
  ball={x:t[0],y:t[1],vx:0,vy:0};hx=250;strokes=0;
  hud.set("bh",(hole+1)+"/5");hud.set("tc",0);
}
build();
H.loop(dt=>{
  if(over)return;
  hx+=dir*(60+hole*22)*dt;
  if(hx>430){hx=430;dir=-1;}if(hx<70){hx=70;dir=1;}
  const hy=200;
  if(ptr.down&&ball&&Math.hypot(ball.vx,ball.vy)<5){
    if(!aim&&Math.hypot(ptr.x-ball.x,ptr.y-ball.y)<50)aim={x:ptr.x,y:ptr.y};
  }
  if(!ptr.down&&aim){
    ball.vx=(aim.x-ptr.x)*5;ball.vy=(aim.y-ptr.y)*5;
    strokes++;total++;hud.set("tc",strokes);hud.set("sc",total);aim=null;H.sfx("pop");
  }
  if(!ptr.down)aim=null;
  ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
  ball.vx*=0.985;ball.vy*=0.985;
  if(ball.x<14){ball.x=14;ball.vx*=-.7;}
  if(ball.x>o.W-14){ball.x=o.W-14;ball.vx*=-.7;}
  if(ball.y<14){ball.y=14;ball.vy*=-.7;}
  if(ball.y>o.H-14){ball.y=o.H-14;ball.vy*=-.7;}
  if(Math.hypot(ball.x-hx,ball.y-hy)<16&&Math.hypot(ball.vx,ball.vy)<260){
    H.sfx("ok");hole++;
    if(hole>=5){over=true;
      return total<=12?H.done({win:true,score:200-total*10,title:"Abaixo do par!",sub:"5 buracos em "+total+" tacadas."})
                      :H.done({win:false,score:100,title:"Acima do par",sub:total+" tacadas (limite 12). Seja mais econômico!"});
    }
    say("Buraco "+hole+"! Tacadas até aqui: "+total+".");build();
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(255,255,255,.12)";
  for(let i=0;i<6;i++)x.fillRect(0,i*70,o.W,34);
  x.strokeStyle=H.C.paper;x.setLineDash([5,5]);
  x.beginPath();x.moveTo(70,200);x.lineTo(430,200);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ink;x.beginPath();x.arc(hx,hy,14,0,7);x.fill();
  x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
  x.strokeStyle=H.C.terra;x.lineWidth=3;
  x.beginPath();x.moveTo(hx,hy);x.lineTo(hx,hy-44);x.stroke();
  x.fillStyle=H.C.terra;x.beginPath();x.moveTo(hx,hy-44);x.lineTo(hx+18,hy-38);x.lineTo(hx,hy-32);x.fill();
  x.fillStyle="#fff";x.beginPath();x.arc(ball.x,ball.y,8,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.stroke();
  if(aim){
    x.strokeStyle="#fff";x.setLineDash([5,5]);
    x.beginPath();x.moveTo(ball.x,ball.y);x.lineTo(ball.x+(aim.x-ptr.x)*1.5,ball.y+(aim.y-ptr.y)*1.5);x.stroke();
    x.setLineDash([]);
  }
});
}});
