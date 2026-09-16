/* NCODE N · 163 Bola de Demolição — arrase em 5 golpes */
GREG(163,{
init(root,H){
const PIV={x:120,y:40},L=200,R=26;
let over=false,a=-1.2,va=0,drag=false,swings=0,blocks=[],rest=0;
const hud=H.hud(root,[["gp","GOLPES","0/5"],["dm","DEMOLIDO","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE a bola para trás e SOLTE! Demola 70% do prédio em 5 golpes. <b>Arraste de novo</b> quando ela parar.");
const o=H.cvs(root,520,380),x=o.x;
let sc=0;
function buildTower(){
  blocks=[];
  for(let r=0;r<5;r++)for(let c=0;c<3;c++){
    blocks.push({x:380+c*34,y:330-24-r*30,w:32,h:28,vx:0,vy:0,dyn:false,ox:380+c*34,oy:330-24-r*30});
  }
}
buildTower();
const ball=()=>({x:PIV.x+Math.sin(a)*L,y:PIV.y+Math.cos(a)*L});
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  const b=ball();
  if(ptr.down&&Math.hypot(ptr.x-b.x,ptr.y-b.y)<60){
    if(!drag&&Math.abs(va)<0.4){drag=true;swings++;hud.set("gp",swings+"/5");}
    if(drag){
      a=Math.atan2(ptr.x-PIV.x,ptr.y-PIV.y);
      a=H.clamp(a,-1.5,1.5);va=0;
    }
  }else if(drag){drag=false;H.sfx("tick");say("Golpe "+swings+"/5!");}
  if(!drag){
    va+=(-9.8/L*Math.sin(a))*dt*3;
    va*=0.999;a+=va*dt*3;
  }
  const b2=ball();
  const bv={x:(b2.x-b.x)/Math.max(dt,.001),y:(b2.y-b.y)/Math.max(dt,.001)};
  const spd=Math.hypot(bv.x,bv.y);
  blocks.forEach(bl=>{
    if(!bl.dyn){
      if(Math.abs(b2.x-(bl.x+bl.w/2))<R+bl.w/2&&Math.abs(b2.y-(bl.y+bl.h/2))<R+bl.h/2&&spd>120){
        bl.dyn=true;bl.vx=bv.x*.6;bl.vy=bv.y*.6-100;H.sfx("pop");
      }
    }else{
      bl.vy+=900*dt;bl.x+=bl.vx*dt;bl.y+=bl.vy*dt;
      bl.vx*=0.99;
      if(bl.y>330-bl.h){bl.y=330-bl.h;bl.vy*=-0.2;bl.vx*=0.7;}
      if(bl.x<0){bl.x=0;bl.vx*=-0.5;}if(bl.x>o.W-bl.w){bl.x=o.W-bl.w;bl.vx*=-0.5;}
    }
  });
  const down=blocks.filter(bl=>Math.abs(bl.x-bl.ox)>30||bl.oy-bl.y>30||(bl.dyn&&bl.y>bl.oy+10)).length;
  const pct=Math.round(down/blocks.length*100);
  hud.set("dm",pct+"%");
  sc=pct*5;H.score(sc);hud.set("sc",sc);
  if(pct>=70){over=true;return H.done({win:true,score:sc+(5-swings)*50+100,title:"Demolição total!",sub:pct+"% do prédio em "+swings+" golpe(s)."});}
  if(swings>=5&&Math.abs(va)<0.05&&!drag){
    rest+=dt;
    if(rest>2){over=true;
      return H.done({win:false,score:sc,title:"Prédio de pé!",sub:"Só "+pct+"% (meta 70%). Puxe mais para trás!"});}
  }else rest=0;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,330,o.W,50);
  x.strokeStyle=H.C.ink;x.lineWidth=4;
  x.beginPath();x.moveTo(PIV.x,0);x.lineTo(PIV.x,PIV.y);x.stroke();
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(PIV.x,PIV.y);x.lineTo(b2.x,b2.y);x.stroke();
  blocks.forEach(bl=>{
    x.fillStyle=bl.dyn?"#B0A696":"#C96A3D";
    x.fillRect(bl.x,bl.y,bl.w,bl.h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(bl.x,bl.y,bl.w,bl.h);
  });
  x.fillStyle=H.C.ink;x.beginPath();x.arc(b2.x,b2.y,R,0,7);x.fill();
  x.fillStyle="#555";x.beginPath();x.arc(b2.x-8,b2.y-8,7,0,7);x.fill();
  if(!drag&&swings<5&&Math.abs(va)<0.3){
    x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("ARRASTE A BOLA!",b2.x-60,b2.y-40);
  }
});
}});
