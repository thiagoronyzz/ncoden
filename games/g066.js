/* NCODE N · 066 Cesta em Movimento — arremesse na tabela móvel */
GREG(66,{
init(root,H){
let over=false,balls=10,sc=0,ball=null,hoopX=350,dir=1,aim=null;
const hud=H.hud(root,[["bl","BOLAS",10],["ct","CESTAS","0"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Arraste para trás</b> a partir da bola e solte para arremessar. 6 cestas em 10 bolas vencem!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);
const SX=90,SY=o.H-60,HY=120;
function newBall(){ball={x:SX,y:SY,vx:0,vy:0,fly:false};}
newBall();
H.loop(dt=>{
  if(over)return;
  hoopX+=dir*130*dt;
  if(hoopX>430){hoopX=430;dir=-1;}if(hoopX<220){hoopX=220;dir=1;}
  if(ptr.down&&ball&&!ball.fly){
    if(!aim&&Math.hypot(ptr.x-ball.x,ptr.y-ball.y)<60)aim={x:ptr.x,y:ptr.y};
  }
  if(!ptr.down&&aim&&ball&&!ball.fly){
    ball.vx=(aim.x-ptr.x)*6;ball.vy=(aim.y-ptr.y)*6-200;
    ball.fly=true;aim=null;H.sfx("pop");
  }
  if(!ptr.down)aim=null;
  if(ball&&ball.fly){
    ball.vy+=900*dt;ball.x+=ball.vx*dt;ball.y+=ball.vy*dt;
    if(ball.x>o.W-12){ball.x=o.W-12;ball.vx*=-.6;}
    if(ball.x<12){ball.x=12;ball.vx*=-.6;}
    if(ball.y>o.H-12){ball.y=o.H-12;ball.vy*=-.5;ball.vx*=.9;
      if(Math.abs(ball.vy)<60)endThrow(false);}
    if(ball.vy>0&&Math.abs(ball.x-hoopX)<22&&Math.abs(ball.y-HY)<10){endThrow(true);return;}
    if(ball.y<-40||Math.abs(ball.vx)+Math.abs(ball.vy)<20&&ball.y>o.H-40)endThrow(false);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,o.H-10,o.W,10);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(hoopX-34,HY-46);x.lineTo(hoopX+34,HY-46);x.stroke();
  x.strokeStyle=H.C.terra;x.lineWidth=5;
  x.beginPath();x.ellipse(hoopX,HY,24,7,0,0,7);x.stroke();
  x.strokeStyle=H.C.cement;x.lineWidth=1.5;
  x.beginPath();x.moveTo(hoopX-20,HY+3);x.lineTo(hoopX-14,HY+26);x.moveTo(hoopX+20,HY+3);x.lineTo(hoopX+14,HY+26);x.moveTo(hoopX,HY+5);x.lineTo(hoopX,HY+28);x.stroke();
  if(ball){
    x.fillStyle="#c96f2e";x.beginPath();x.arc(ball.x,ball.y,11,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  }
  if(aim&&ball){
    x.strokeStyle=H.C.terra;x.setLineDash([5,5]);
    x.beginPath();x.moveTo(ball.x,ball.y);x.lineTo(ball.x+(aim.x-ptr.x)*2,ball.y+(aim.y-ptr.y)*2);x.stroke();
    x.setLineDash([]);
  }
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("arraste p/ trás e solte",12,20);
});
function endThrow(hit){
  balls--;hud.set("bl",balls);
  if(hit){sc++;H.score(sc*50);hud.set("sc",sc*50);hud.set("ct",sc);H.sfx("ok");}
  else H.sfx("bad");
  if(balls<=0){over=true;
    return sc>=6?H.done({win:true,score:sc*50+100,title:"Mão quente!",sub:sc+"/10 cestas na tabela móvel."})
                :H.done({win:false,score:sc*50,title:"Dia ruim",sub:sc+"/10 cestas. Meta 6 — antecipe o aro!"});}
  if(sc>=6&&balls>=0&&sc===6){/* continua p/ recorde */}
  newBall();
}
}});
