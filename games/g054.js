/* NCODE N · 054 Escudo Planetário — gire o escudo, bloqueie */
GREG(54,{
init(root,H){
let over=false,ang=0,mets=[],sc=0,lives=3,blocked=0,spawn=0;
const hud=H.hud(root,[["bl","BLOQUEIOS","0/40"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Gire o escudo com <b>mouse, toque ou ◀ ▶</b>. Bloqueie 40 meteoros antes que 3 atinjam o planeta!");
const o=H.cvs(root,480,440),x=o.x;
const cx=o.W/2,cy=o.H/2,PR=44,SR=86;
const ptr=H.ptr(o);const kb=H.keys();
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))ang-=3*dt;
  if(kb.is("ArrowRight"))ang+=3*dt;
  if(ptr.down)ang=Math.atan2(ptr.y-cy,ptr.x-cx);
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.35,.9-blocked*0.012);
    const a=Math.random()*6.28,R=Math.max(o.W,o.H)/2+20;
    mets.push({x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,a,sp:60+blocked*2+Math.random()*30});
  }
  for(let i=mets.length-1;i>=0;i--){
    const m=mets[i];
    m.x-=Math.cos(m.a)*m.sp*dt;m.y-=Math.sin(m.a)*m.sp*dt;
    const d=Math.hypot(m.x-cx,m.y-cy);
    if(d<SR+12&&d>SR-22){
      let da=Math.abs(((m.a-ang)%(Math.PI*2)+Math.PI*3)%(Math.PI*2)-Math.PI);
      if(da<0.55){mets.splice(i,1);blocked++;sc+=15;
        H.score(sc);hud.set("sc",sc);hud.set("bl",blocked+"/40");H.sfx("pop");
        if(blocked>=40){over=true;return H.done({win:true,score:sc+150,title:"Planeta intacto!",sub:"40 meteoros rebatidos pelo escudo."});}
        continue;}
    }
    if(d<PR+8){mets.splice(i,1);lives--;hud.set("vd",lives);H.sfx("lose");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Planeta em chamas!",sub:blocked+" bloqueios antes do impacto final."});}
      say("Impacto! Vidas: "+lives);
    }
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#2E6E8A";x.beginPath();x.arc(cx,cy,PR,0,7);x.fill();
  x.fillStyle=H.C.ok;x.beginPath();x.arc(cx-12,cy-8,12,0,7);x.arc(cx+14,cy+10,9,0,7);x.fill();
  x.strokeStyle=H.C.wasabi;x.lineWidth=10;
  x.beginPath();x.arc(cx,cy,SR,ang-.55,ang+.55);x.stroke();
  x.strokeStyle=H.C.paper;x.lineWidth=2;
  x.beginPath();x.arc(cx,cy,SR,ang-.55,ang+.55);x.stroke();
  for(const m of mets){
    x.fillStyle="#8A877C";x.beginPath();x.arc(m.x,m.y,10,0,7);x.fill();
    x.strokeStyle=H.C.terra;x.lineWidth=2;x.stroke();
  }
});
}});
