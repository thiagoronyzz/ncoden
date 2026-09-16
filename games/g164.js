/* NCODE N · 164 Catapulta de Cerco — 3 acertos sobre a muralha */
GREG(164,{
init(root,H){
const AX={x:80,y:300};
let over=false,aim=null,stone=null,shots=5,hits=0,wind=0,parts=[];
const hud=H.hud(root,[["pd","PEDRAS",5],["ac","ACERTOS","0/3"],["vn","VENTO",0]]);
const say=H.msg(root,"ARRASTE da catapulta para trás e solte para lançar! Passe por cima da muralha e atinja a 🎯 bandeira.");
const o=H.cvs(root,520,360),x=o.x;
const WALL={x:300,w:26,y:170,h:170},TGT={x:430,y:320};
wind=Math.round((Math.random()-.5)*30);
hud.set("vn",wind);
const ptr=H.ptr(o);
let wasDown=false;
H.loop(dt=>{
  if(over)return;
  if(ptr.down&&!stone){
    if(!wasDown&&Math.hypot(ptr.x-AX.x,ptr.y-AX.y)<90)aim={x:ptr.x,y:ptr.y};
    if(aim)aim={x:ptr.x,y:ptr.y};
  }else if(aim&&!ptr.down){
    const dx=AX.x-aim.x,dy=AX.y-aim.y;
    if(Math.hypot(dx,dy)>20&&shots>0){
      stone={x:AX.x,y:AX.y,vx:dx*3.2,vy:dy*3.2};
      shots--;hud.set("pd",shots);H.sfx("tick");
    }
    aim=null;
  }
  wasDown=ptr.down;
  if(stone){
    stone.vy+=700*dt;stone.vx+=wind*dt;
    stone.x+=stone.vx*dt;stone.y+=stone.vy*dt;
    if(stone.x>WALL.x&&stone.x<WALL.x+WALL.w&&stone.y>WALL.y){
      stone=null;H.sfx("bad");say("🧱 Na muralha! Mais força.");
    }else if(Math.hypot(stone.x-TGT.x,stone.y-TGT.y)<26){
      stone=null;hits++;H.score(hits*100);hud.set("ac",hits+"/3");H.sfx("ok");
      for(let i=0;i<10;i++)parts.push({x:TGT.x,y:TGT.y,vx:(Math.random()-.5)*200,vy:-100-Math.random()*150,l:1});
      if(hits>=3){over=true;return H.done({win:true,score:300+shots*40+100,title:"Muralha vencida!",sub:"3 acertos com "+shots+" pedra(s) de sobra."});}
      say("🎯 Acertou! ("+hits+"/3)");
    }else if(stone.y>340||stone.x>o.W+20||stone.x<-20){
      stone=null;
      if(shots<=0){over=true;H.sfx("lose");
        return H.done({win:false,score:hits*100,title:"Sem pedras!",sub:"Só "+hits+"/3 acertos. Mire mais alto!"});}
      say("💥 Errou! Restam "+shots+".");
    }
  }
  parts=parts.filter(p=>p.l>0);
  parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=400*dt;p.l-=dt*1.5;});
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,330,o.W,30);
  x.fillStyle="#9A8F7A";
  x.fillRect(WALL.x,WALL.y,WALL.w,WALL.h);
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  for(let yy=WALL.y;yy<WALL.y+WALL.h;yy+=18){x.beginPath();x.moveTo(WALL.x,yy);x.lineTo(WALL.x+WALL.w,yy);x.stroke();}
  x.font="24px serif";x.fillText("🎯",TGT.x-12,TGT.y+8);
  x.strokeStyle="#8A6A2F";x.lineWidth=6;
  x.beginPath();x.moveTo(AX.x-20,330);x.lineTo(AX.x,AX.y);x.lineTo(AX.x+20,330);x.stroke();
  if(aim){
    x.strokeStyle=H.C.terra;x.lineWidth=2;
    x.beginPath();x.moveTo(AX.x,AX.y);x.lineTo(aim.x,aim.y);x.stroke();
    const dx=AX.x-aim.x,dy=AX.y-aim.y;
    let px=AX.x,py=AX.y,vx=dx*3.2,vy=dy*3.2;
    x.fillStyle=H.C.terra;
    for(let i=0;i<12;i++){vx+=wind*.05;vy+=700*.05;px+=vx*.05;py+=vy*.05;
      if(i%2===0){x.beginPath();x.arc(px,py,3,0,7);x.fill();}}
    x.fillStyle=H.C.ink;x.beginPath();x.arc(aim.x,aim.y,10,0,7);x.fill();
  }else if(!stone&&shots>0){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(AX.x,AX.y,10,0,7);x.fill();
  }
  if(stone){x.fillStyle=H.C.ink;x.beginPath();x.arc(stone.x,stone.y,10,0,7);x.fill();}
  parts.forEach(p=>{x.globalAlpha=Math.max(0,p.l);x.fillStyle=H.C.wasabi;x.fillRect(p.x,p.y,5,5);x.globalAlpha=1;});
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("vento "+(wind>0?"→":"←")+" "+Math.abs(Math.round(wind)),400,24);
});
}});
