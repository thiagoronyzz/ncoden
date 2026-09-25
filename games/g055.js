/* NCODE N · 055 Balde de Chuva — pegue água, evite lama */
GREG(55,{
init(root,H){
let over=false,px=250,drops=[],sc=0,lives=3,t=60,spawn=0;
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Mova o balde com <b>mouse, toque ou setas</b>. Gotas +10, lama ● −1 vida!");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=250?H.done({win:true,score:sc,title:"Balde cheio!",sub:sc+" pontos de água pura."})
                  :H.done({win:false,score:sc,title:"Balde raso",sub:"Meta 250 — você fez "+sc+". Cubra mais área!"});}
  if(kb.is("ArrowLeft"))px-=340*dt;
  if(kb.is("ArrowRight"))px+=340*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*10);
  px=H.clamp(px,40,o.W-40);
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.18,.5-t*0.004);
    drops.push({x:20+Math.random()*(o.W-40),y:-16,vy:180+Math.random()*120,mud:Math.random()<.25});}
  for(let i=drops.length-1;i>=0;i--){
    const d=drops[i];d.y+=d.vy*dt;
    if(d.y>o.H-84&&d.y<o.H-30&&Math.abs(d.x-px)<36){
      drops.splice(i,1);
      if(d.mud){lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Balde de lama!",sub:sc+" pontos antes da terceira lama."});}
        say("● Lama! Vidas: "+lives);
      }else{sc+=10;H.score(sc);hud.set("sc",sc);H.beep(700,.05,"sine",.04);}
    }else if(d.y>o.H+16)drops.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#2E6E8A";
  for(let i=0;i<3;i++){x.beginPath();x.ellipse(90+i*160,34,70,20,0,0,7);x.fill();}
  x.fillStyle=H.C.ink;
  for(const d of drops){
    if(d.mud){x.fillStyle="#6b4a2f";x.beginPath();x.arc(d.x,d.y,9,0,7);x.fill();}
    else{x.fillStyle="#2E6E8A";x.beginPath();x.ellipse(d.x,d.y,6,10,0,0,7);x.fill();}
  }
  x.fillStyle=H.C.terra;
  x.beginPath();x.moveTo(px-32,o.H-70);x.lineTo(px+32,o.H-70);x.lineTo(px+26,o.H-16);x.lineTo(px-26,o.H-16);x.closePath();x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
});
}});
