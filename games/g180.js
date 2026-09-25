/* NCODE N · 180 Corrente Giratória — enrole e acerte! */
GREG(180,{
init(root,H){
const N=20,SEG=24,ANCH={x:110,y:80},POST={x:300,y:250,r:26},TGT={x:420,y:300,r:26};
const WALL={x:350,y:0,w:16,h:190};
let over=false,pts=[],tries=5,drag=false,thrown=false,rest=0,firstTouch=true;
const hud=H.hud(root,[["tt","TENTATIVAS",5],["st","STATUS","arraste a bola"]]);
const say=H.msg(root,"ARRASTE a bola da corrente e SOLTE para balançar! Enrole no poste e toque no <b>alvo</b> (o muro bloqueia o caminho direto).");
const o=H.cvs(root,520,380),x=o.x;
function reset(){
  pts=[];
  for(let i=0;i<N;i++)pts.push({x:ANCH.x,y:ANCH.y+i*SEG,ox:ANCH.x,oy:ANCH.y+i*SEG});
  thrown=false;drag=false;rest=0;
}
reset();
function collide(p,ball){
  // poste
  const dx=p.x-POST.x,dy=p.y-POST.y,d=Math.hypot(dx,dy),rr=POST.r+(ball?10:4);
  if(d<rr&&d>0.01){p.x=POST.x+dx/d*rr;p.y=POST.y+dy/d*rr;}
  // muro
  if(p.x>WALL.x&&p.x<WALL.x+WALL.w&&p.y<WALL.y+WALL.h){
    if(p.ox<=WALL.x)p.x=WALL.x;else p.x=WALL.x+WALL.w;
  }
  // chão/teto/paredes
  if(p.y>370){p.y=370;}
  if(p.y<6){p.y=6;}if(p.x<6){p.x=6;}if(p.x>o.W-6){p.x=o.W-6;}
}
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.03);
  const ball=pts[N-1];
  if(!thrown){
    if(ptr.down&&Math.hypot(ptr.x-ball.x,ptr.y-ball.y)<70){
      drag=true;
      ball.x=ptr.x;ball.y=ptr.y;ball.ox=ptr.x;ball.oy=ptr.y;
      collide(ball,true);
      hud.set("st","mirando…");
    }else if(drag){
      drag=false;thrown=true;tries--;hud.set("tt",tries);
      // impulso pelo deslocamento
      H.sfx("tick");hud.set("st","balançando…");
    }
  }else{
    for(let i=1;i<N;i++){
      const p=pts[i];
      const vx=(p.x-p.ox)*0.995,vy=(p.y-p.oy)*0.995;
      p.ox=p.x;p.oy=p.y;
      p.x+=vx;p.y+=vy+1400*dt*dt*(i===N-1?1.6:1);
      collide(p,i===N-1);
    }
    pts[0].x=ANCH.x;pts[0].y=ANCH.y;pts[0].ox=ANCH.x;pts[0].oy=ANCH.y;
    for(let k=0;k<6;k++){
      for(let i=0;i<N-1;i++){
        const A=pts[i],B=pts[i+1];
        const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1;
        const diff=(d-SEG)/d;
        if(i===0){B.x-=dx*diff;B.y-=dy*diff;}
        else{A.x+=dx*diff*.5;A.y+=dy*diff*.5;B.x-=dx*diff*.5;B.y-=dy*diff*.5;}
        if(i>0)collide(A,false);
        collide(B,i+1===N-1);
      }
      pts[0].x=ANCH.x;pts[0].y=ANCH.y;
    }
    const mv=Math.hypot(ball.x-ball.ox,ball.y-ball.oy);
    if(mv<.4)rest+=dt;else rest=0;
    if(Math.hypot(ball.x-TGT.x,ball.y-TGT.y)<TGT.r+10){
      over=true;H.score(200+tries*60);
      return H.done({win:true,score:200+tries*60+100,title:"Tiro de corrente!",sub:"Alvo tocado com "+tries+" tentativa(s) de sobra."});
    }
    if(rest>1.5){
      if(tries<=0){over=true;
        return H.done({win:false,score:0,title:"Corrente cansada!",sub:"5 tentativas. Enrole no poste para alcançar!"});}
      say("Tentativa "+(5-tries)+"/5 falhou — arraste de novo!");
      hud.set("st","arraste a bola");
      reset();thrown=false;
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,370,o.W,10);
  x.fillStyle="#5b3d20";x.fillRect(WALL.x,WALL.y,WALL.w,WALL.h);
  x.fillStyle="#8A6A2F";x.beginPath();x.arc(POST.x,POST.y,POST.r,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.strokeStyle=H.C.terra;x.lineWidth=2;
  x.beginPath();x.arc(TGT.x,TGT.y,TGT.r,0,7);x.stroke();
  x.font="22px serif";x.fillText("i:target",TGT.x-11,TGT.y+8);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(pts[0].x,pts[0].y);
  pts.forEach(p=>x.lineTo(p.x,p.y));x.stroke();
  x.fillStyle=H.C.terra;
  x.beginPath();x.arc(ball.x,ball.y,11,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(ANCH.x,ANCH.y,6,0,7);x.fill();
  if(!thrown&&!drag&&firstTouch){
    x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("ARRASTE A BOLA!",ball.x-60,ball.y+30);
  }
});
}});
