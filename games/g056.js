/* NCODE N · 056 Balão Estouro — estoure antes de voar */
GREG(56,{
init(root,H){
let over=false,bals=[],sc=0,t=45,spawn=0,esc=0;
const hud=H.hud(root,[["sc","PONTOS",0],["fg","FUGAS",0],["tp","TEMPO",45]]);
const say=H.msg(root,"Toque nos balões para estourar (10 pts). <b>Dourado = 50!</b> Preto 💀 tira 20. 10 fugas = fim!");
const o=H.cvs(root,480,420),x=o.x;
H.onTap(o,(px,py)=>{
  if(over)return;
  for(let i=bals.length-1;i>=0;i--){
    const b=bals[i];
    if(Math.hypot(b.x-px,b.y-py)<26){
      bals.splice(i,1);
      if(b.k==="gold"){sc+=50;H.sfx("ok");}
      else if(b.k==="bad"){sc=Math.max(0,sc-20);H.sfx("bad");}
      else{sc+=10;H.sfx("pop");}
      H.score(sc);hud.set("sc",sc);return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=300?H.done({win:true,score:sc,title:"Estouro total!",sub:sc+" pontos em 45 segundos."})
                  :H.done({win:false,score:sc,title:"Muitos voaram",sub:"Meta 300 — você fez "+sc+". Priorize os dourados!"});}
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.2,.6-t*0.006);
    const r=Math.random();
    bals.push({x:30+Math.random()*(o.W-60),y:o.H+24,vy:-(90+Math.random()*90),
      k:r<.12?"gold":r<.26?"bad":"ok",ph:Math.random()*6});}
  for(let i=bals.length-1;i>=0;i--){
    const b=bals[i];b.y+=b.vy*dt;b.ph+=dt*3;b.x+=Math.sin(b.ph)*20*dt;
    if(b.y<-30){bals.splice(i,1);
      if(b.k!=="bad"){esc++;hud.set("fg",esc);
        if(esc>=10){over=true;return H.done({win:false,score:sc,title:"Revoada!",sub:"10 balões escaparam. Toque mais rápido!"});}}}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const b of bals){
    x.strokeStyle=H.C.ink;x.beginPath();x.moveTo(b.x,b.y+22);x.quadraticCurveTo(b.x+6,b.y+34,b.x,b.y+44);x.stroke();
    x.fillStyle=b.k==="gold"?H.C.gold:b.k==="bad"?H.C.ink:H.C.terra;
    x.beginPath();x.ellipse(b.x,b.y,20,24,0,0,7);x.fill();
    x.strokeStyle=b.k==="gold"?H.C.terra:H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle="rgba(255,255,255,.5)";x.beginPath();x.ellipse(b.x-7,b.y-8,5,8,-.3,0,7);x.fill();
  }
});
}});
