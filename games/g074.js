/* NCODE N · 074 Malabarista — mantenha as bolas no ar */
GREG(74,{
init(root,H){
const GOAL=40;
let over=false,balls=[],sc=0,lives=3,spawn=0;
const hud=H.hud(root,[["ct","PEGADAS","0/40"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Toque nas bolas <b>dentro da zona verde</b> para relançá-las. "+GOAL+" pegadas vencem — 3 quedas derrubam!");
const o=H.cvs(root,500,400),x=o.x;
const ZY=o.H-90;
function toss(b){
  b.x=o.W/2+(Math.random()-.5)*120;b.y=ZY;
  b.vx=(Math.random()-.5)*160;b.vy=-(420+Math.random()*160);
}
function build(){balls=[];sc=0;lives=3;spawn=0;
  const b={};toss(b);balls.push(b);
  hud.set("ct","0/"+GOAL);hud.set("vd",3);hud.set("sc",0);}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const b of balls){
    if(Math.hypot(b.x-px,b.y-py)<30&&b.y>ZY-110&&b.vy>0){
      toss(b);sc++;H.score(sc*10);hud.set("sc",sc*10);hud.set("ct",sc+"/"+GOAL);H.sfx("pop");
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*10+150,title:"Malabarista!",sub:GOAL+" pegadas sem deixar cair."});}
      if(sc%10===0&&balls.length<4){const nb={};toss(nb);balls.push(nb);say("➕ Mais uma bola no ar! ("+balls.length+")");}
      return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  for(const b of balls){
    b.vy+=900*dt;b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.x<16){b.x=16;b.vx=Math.abs(b.vx);}
    if(b.x>o.W-16){b.x=o.W-16;b.vx=-Math.abs(vx(b));}
    if(b.y>o.H-16){
      lives--;hud.set("vd",lives);H.sfx("bad");toss(b);
      if(lives<=0){over=true;return H.done({win:false,score:sc*10,title:"Bolas no chão!",sub:sc+" pegadas. Toque só na zona verde!"});}
      say("Queda! Vidas: "+lives);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(196,214,69,.3)";x.fillRect(0,ZY-110,o.W,110);
  x.strokeStyle=H.C.ok;x.setLineDash([6,5]);
  x.beginPath();x.moveTo(0,ZY-110);x.lineTo(o.W,ZY-110);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ok;x.font="11px 'Space Mono',monospace";x.fillText("ZONA DE PEGADA",12,ZY-116);
  x.font="34px serif";x.fillText("🤹",o.W/2-17,o.H-24);
  const cols=[H.C.terra,H.C.gold,"#2E6E8A",H.C.ok];
  balls.forEach((b,i)=>{
    x.fillStyle=cols[i%4];x.beginPath();x.arc(b.x,b.y,14,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  });
});
function vx(b){return b.vx;}
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
