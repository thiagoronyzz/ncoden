/* NCODE N · 048 Toupeira Relâmpago — martele rápido */
GREG(48,{
init(root,H){
let over=false,holes=[],sc=0,lives=3,t=45,spawn=0;
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",45]]);
const say=H.msg(root,"Acerte as toupeiras (10 pts) e as <b>douradas</b> ★ (30). Bombas custam vida!");
const o=H.cvs(root,460,400),x=o.x;
for(let r=0;r<3;r++)for(let c=0;c<3;c++)holes.push({x:80+c*150,y:90+r*110,m:null});
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const h of holes){
    if(h.m&&Math.hypot(h.x-px,h.y-py)<44){
      if(h.m.k==="bomb"){lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Dedos queimados!",sub:sc+" pontos antes da terceira bomba."});}
        say("Bomba! Vidas: "+lives);
      }else{sc+=h.m.k==="gold"?30:10;H.score(sc);hud.set("sc",sc);H.sfx("pop");}
      h.m=null;return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=200?H.done({win:true,score:sc,title:"Martelo de ouro!",sub:sc+" pontos em 45 segundos."})
                  :H.done({win:false,score:sc,title:"Poucas toupeiras",sub:"Meta 200 — você fez "+sc+". Acerte as douradas!"});}
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.3,.8-t*0.008);
    const free=holes.filter(h=>!h.m);
    if(free.length){
      const h=free[Math.floor(Math.random()*free.length)];
      const r=Math.random();
      h.m={k:r<.12?"bomb":r<.3?"gold":"mole",ttl:r<.12?1.2:1.1};
    }
  }
  for(const h of holes)if(h.m){h.m.ttl-=dt;if(h.m.ttl<=0)h.m=null;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const h of holes){
    x.fillStyle=H.C.ink;x.beginPath();x.ellipse(h.x,h.y+24,44,16,0,0,7);x.fill();
    if(h.m){
      x.font="44px serif";
      x.fillText(h.m.k==="bomb"?"i:bomb":h.m.k==="gold"?"":"",h.x-22,h.y+18);
      if(h.m.k==="gold"){x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();x.arc(h.x,h.y,34,0,7);x.stroke();}
    }
  }
});
}});
