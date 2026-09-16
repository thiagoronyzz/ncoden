/* NCODE N · 052 Peixe Comilão — coma os menores, fuja dos maiores */
GREG(52,{
init(root,H){
let over=false,px,py,size=14,eaten=0,fish=[],sc=0,spawn=0;
const hud=H.hud(root,[["tm","TAMANHO",14],["ct","COMIDOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Nade com <b>mouse, toque ou setas</b>. Coma peixes <b>menores</b> que você. Cresça até 40!");
const o=H.cvs(root,520,380),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
px=o.W/2;py=o.H/2;
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))px-=240*dt;if(kb.is("ArrowRight"))px+=240*dt;
  if(kb.is("ArrowUp"))py-=240*dt;if(kb.is("ArrowDown"))py+=240*dt;
  if(ptr.down){px+=(ptr.x-px)*Math.min(1,dt*6);py+=(ptr.y-py)*Math.min(1,dt*6);}
  px=H.clamp(px,20,o.W-20);py=H.clamp(py,20,o.H-20);
  spawn-=dt;
  if(spawn<=0){spawn=.5;
    const left=Math.random()<.5;
    const s=8+Math.random()*36;
    fish.push({x:left?-20:o.W+20,y:20+Math.random()*(o.H-40),vx:(left?1:-1)*(50+Math.random()*70),s,
      c:s<size-2?H.C.wasabi:s>size+2?H.C.terra:H.C.gold});
  }
  for(let i=fish.length-1;i>=0;i--){
    const f=fish[i];f.x+=f.vx*dt;
    if(f.x<-40||f.x>o.W+40){fish.splice(i,1);continue;}
    if(Math.hypot(f.x-px,f.y-py)<(f.s+size)/2+4){
      if(f.s<size-2){fish.splice(i,1);eaten++;size=Math.min(46,size+1.1);sc+=10;
        H.score(sc);hud.set("sc",sc);hud.set("ct",eaten);hud.set("tm",Math.round(size));H.sfx("pop");
        if(size>=40){over=true;return H.done({win:true,score:sc+150,title:"Rei do lago!",sub:eaten+" peixes devorados até o tamanho máximo."});}
      }else if(f.s>size+2){over=true;H.sfx("lose");
        return H.done({win:false,score:sc,title:"Virou lanche!",sub:"Um peixe maior te comeu. Cresça comendo os verdes!"});
      }
    }
  }
  x.fillStyle="#274b5e";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle="rgba(255,255,255,.15)";
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(0,60+i*70+Math.sin(Date.now()/800+i)*6);x.lineTo(o.W,60+i*70);x.stroke();}
  for(const f of fish){
    x.fillStyle=f.c;x.beginPath();x.ellipse(f.x,f.y,f.s,f.s*.55,f.vx>0?0:Math.PI,0,7);x.fill();
    x.fillStyle=H.C.paper;x.beginPath();x.arc(f.x+(f.vx>0?f.s*.5:-f.s*.5),f.y-2,2.5,0,7);x.fill();
  }
  const dir=ptr.down?(ptr.x>px?1:-1):1;
  x.fillStyle=H.C.ink;x.beginPath();x.ellipse(px,py,size,size*.55,0,0,7);x.fill();
  x.strokeStyle=H.C.wasabi;x.lineWidth=3;x.stroke();
  x.fillStyle="#fff";x.beginPath();x.arc(px+dir*size*.5,py-3,4,0,7);x.fill();
  x.fillStyle="#fff";x.font="11px 'Space Mono',monospace";
  x.fillText("verde=comer · vermelho=fugir",12,20);
});
}});
