/* NCODE N · 178 Campo Magnético — 70% da limalha no alvo! */
GREG(178,{
init(root,H){
let over=false,parts=[],mags=[],holdT=0,time=120;
const hud=H.hud(root,[["lm","NO ALVO","0%"],["tp","TEMPO",120],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no vazio para plantar <b>ímã 🧲N (atrai)</b>, clique nele para virar <b>S (repele)</b>, de novo para tirar (máx 4). Segure 70% no ⭕ por 3s!");
const o=H.cvs(root,500,360),x=o.x;
const TGT={x:400,y:90,r:46};
const r=H.rng(55);
for(let i=0;i<40;i++)parts.push({x:40+r()*300,y:120+r()*200,vx:0,vy:0});
H.onTap(o,(px,py)=>{
  if(over)return;
  const mi=mags.findIndex(m=>Math.hypot(px-m.x,py-m.y)<24);
  if(mi>=0){
    const m=mags[mi];
    if(m.p==="N")m.p="S";
    else mags.splice(mi,1);
    H.sfx("tick");return;
  }
  if(mags.length>=4){H.sfx("bad");say("Máx 4 ímãs! Clique num ímã para alternar/remover.");return;}
  mags.push({x:px,y:py,p:"N"});H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:0,title:"Tempo esgotado!",sub:"N atrai, S empurra: combine os 4 ímãs!"});
  }
  parts.forEach(p=>{
    mags.forEach(m=>{
      const dx=m.x-p.x,dy=m.y-p.y,d=Math.max(20,Math.hypot(dx,dy));
      const f=(m.p==="N"?1:-1)*9000/(d*d)*dt*60;
      p.vx+=dx/d*f*dt*10;p.vy+=dy/d*f*dt*10;
    });
    p.vx*=0.94;p.vy*=0.94;
    p.vx=H.clamp(p.vx,-160,160);p.vy=H.clamp(p.vy,-160,160);
    p.x=H.clamp(p.x+p.vx*dt,8,o.W-8);
    p.y=H.clamp(p.y+p.vy*dt,8,o.H-8);
  });
  const inside=parts.filter(p=>Math.hypot(p.x-TGT.x,p.y-TGT.y)<TGT.r).length;
  const pct=Math.round(inside/parts.length*100);
  hud.set("lm",pct+"%");H.score(pct*4);hud.set("sc",pct*4);
  if(pct>=70){holdT+=dt;
    if(holdT>=3){over=true;
      return H.done({win:true,score:380,title:"Física magnética!",sub:"70% da limalha presa no alvo."});}
  }else holdT=0;
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.wasabi;x.lineWidth=3;
  x.beginPath();x.arc(TGT.x,TGT.y,TGT.r,0,7);x.stroke();
  x.fillStyle="rgba(196,214,69,.12)";
  x.beginPath();x.arc(TGT.x,TGT.y,TGT.r,0,7);x.fill();
  x.fillStyle="#C9C5B8";
  parts.forEach(p=>{x.beginPath();x.arc(p.x,p.y,3,0,7);x.fill();});
  x.font="20px serif";
  mags.forEach(m=>{
    x.fillText(m.p==="N"?"🧲":"🧿",m.x-10,m.y+7);
    x.fillStyle=m.p==="N"?"#D94E34":"#2E6E8A";x.font="bold 11px 'Space Mono',monospace";
    x.fillText(m.p,m.x-4,m.y-14);x.font="20px serif";
  });
  if(holdT>0){x.fillStyle=H.C.wasabi;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("SEGURANDO "+(3-holdT).toFixed(1)+"s…",180,30);}
});
H.btn(root,"🔀 Espalhar limalha",()=>{
  if(over)return;
  parts.forEach(p=>{p.x=40+Math.random()*300;p.y=120+Math.random()*200;p.vx=0;p.vy=0;});
  H.sfx("tick");
},false);
}});
