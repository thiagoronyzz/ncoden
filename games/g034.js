/* NCODE N · 034 Vazamento — remende antes da cheia */
GREG(34,{
init(root,H){
let over=false,water=0,leaks=[],patched=0,spawnT=0,t=0,nextId=1;
const hud=H.hud(root,[["rm","REMENDOS",0],["nv","NÍVEL DA ÁGUA","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>vazamentos </b> para remendar. Cada vazamento aberto acelera a cheia!");
const o=H.cvs(root,480,400),x=o.x;
H.onTap(o,(px,py)=>{
  if(over)return;
  for(let i=leaks.length-1;i>=0;i--){
    const L=leaks[i];
    if(Math.hypot(L.x-px,L.y-py)<26){
      leaks.splice(i,1);patched++;
      const sc=patched*25;H.score(sc);hud.set("sc",sc);hud.set("rm",patched);
      H.sfx("ok");
      if(patched>=15){over=true;return H.done({win:true,score:sc+150,title:"Encanamento selado!",sub:"15 vazamentos remendados antes da cheia."});}
      return;
    }
  }
});
H.loop(dt=>{
  if(over)return;
  t+=dt;spawnT-=dt;
  const rate=Math.max(.5,1.6-t*0.015);
  if(spawnT<=0){spawnT=rate;
    leaks.push({x:40+Math.random()*400,y:60+Math.random()*240,age:0,id:nextId++});
    if(leaks.length>6)leaks.shift();
  }
  for(const L of leaks)L.age+=dt;
  water+=dt*(1.1+leaks.length*0.9);
  hud.set("nv",Math.min(100,Math.round(water))+"%");
  if(water>=100){over=true;return H.done({win:false,score:patched*25,title:"Sala inundada",sub:patched+" remendos feitos. Priorize os vazamentos maiores!"});}
  if(t>=75){over=true;return H.done({win:true,score:patched*25+100,title:"Turno cumprido!",sub:"Você segurou a cheia por 75 segundos."});}
  H.time(t.toFixed(0)+"s");
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.lineWidth=6;
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(0,60+i*60);x.lineTo(o.W,60+i*60);x.stroke();}
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  for(let i=0;i<5;i++){x.beginPath();x.moveTo(0,60+i*60);x.lineTo(o.W,60+i*60);x.stroke();}
  for(const L of leaks){
    const s=8+Math.min(14,L.age*3);
    x.fillStyle=H.C.terra;x.beginPath();x.arc(L.x,L.y,s,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle="#fff";x.font="bold 13px 'Space Mono',monospace";x.fillText("!",L.x-3,L.y+5);
  }
  const wh=o.H*(water/100);
  x.fillStyle="rgba(46,110,138,.75)";x.fillRect(0,o.H-wh,o.W,wh);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("i:splash"+leaks.length+" abertos",14,24);
});
}});
