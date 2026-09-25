/* NCODE N · 063 Ímã de Moedas — ligue e puxe o ouro */
GREG(63,{
init(root,H){
const GOAL=25;
let over=false,coins=[],sc=0,t=60,spawn=0,mag=0,cd=0,px=110,py=0;
const hud=H.hud(root,[["mo","MOEDAS","0/25"],["mg","ÍMÃ","PRONTO"],["tp","TEMPO",60]]);
const say=H.msg(root,"Você corre sozinho. <b>Toque/Espaço</b> liga o ímã por 1,5s (recarrega 3s) e puxa as próximas!");
const o=H.cvs(root,520,340),x=o.x;
py=o.H-90;
function pulse(){if(over||cd>0)return;mag=1.5;cd=4.5;H.sfx("pop");}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")pulse();});
H.onTap(o,pulse);
H.loop(dt=>{
  if(over)return;
  t-=dt;mag-=dt;cd-=dt;
  hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  hud.set("mg",mag>0?"LIGADO!":cd>0?cd.toFixed(1)+"s":"PRONTO");
  if(t<=0){over=true;
    return sc>=GOAL?H.done({win:true,score:sc*10+100,title:"Colecionador!",sub:GOAL+" moedas pescadas pelo ímã."})
                  :H.done({win:false,score:sc*10,title:"Poucas moedas",sub:sc+"/"+GOAL+". Ligue o ímã quando o arco se aproximar!"});}
  spawn-=dt;
  if(spawn<=0){spawn=.55;
    const n=2+Math.floor(Math.random()*3),baseY=60+Math.random()*180;
    for(let i=0;i<n;i++)coins.push({x:o.W+20+i*36,y:baseY+Math.sin(i)*30,vx:-(150+Math.random()*60)});}
  for(let i=coins.length-1;i>=0;i--){
    const c=coins[i];c.x+=c.vx*dt;
    if(mag>0){
      const d=Math.hypot(c.x-px,c.y-py);
      if(d<190){c.x+=(px-c.x)*dt*6;c.y+=(py-c.y)*dt*6;}
    }
    if(Math.hypot(c.x-px,c.y-py)<30){coins.splice(i,1);sc++;
      H.score(sc*10);hud.set("sc",sc*10);hud.set("mo",sc+"/"+GOAL);H.beep(900,.06,"sine",.05);
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*10+100,title:"Colecionador!",sub:GOAL+" moedas pescadas pelo ímã."});}
    }else if(c.x<-30)coins.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,py+34,o.W,o.H-py);
  x.fillStyle=H.C.ink;x.fillRect(0,py+32,o.W,3);
  const run=Math.sin(Date.now()/90)*4;
  x.font="34px serif";x.fillText("i:run",px-17,py+22+run);
  if(mag>0){x.strokeStyle=H.C.terra;x.lineWidth=3;
    x.beginPath();x.arc(px,py+6,60+Math.sin(Date.now()/60)*8,0,7);x.stroke();
    x.beginPath();x.arc(px,py+6,110,0,7);x.stroke();}
  x.font="22px serif";
  for(const c of coins)x.fillText("i:coin",c.x-11,c.y+8);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("ímã: "+(mag>0?"ON":cd>0?cd.toFixed(1)+"s":"pronto"),12,20);
});
}});
