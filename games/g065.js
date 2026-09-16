/* NCODE N · 065 Estande de Tiro — mire o centro */
GREG(65,{
init(root,H){
let over=false,tgts=[],sc=0,t=30,spawn=0,cd=0,shots=0,hits=0;
const hud=H.hud(root,[["sc","PONTOS",0],["pr","PRECISÃO","-"],["tp","TEMPO",30]]);
const say=H.msg(root,"Toque nos alvos para atirar. <b>Centro = 25</b>, borda = 10. 30 segundos, meta 250!");
const o=H.cvs(root,500,400),x=o.x;
H.onTap(o,(px,py)=>{
  if(over||cd>0)return;cd=.22;shots++;H.beep(180,.09,"sawtooth",.06);
  for(let i=tgts.length-1;i>=0;i--){
    const t=tgts[i];
    const d=Math.hypot(t.x-px,t.y-py);
    if(d<t.r){
      tgts.splice(i,1);hits++;
      sc+=d<t.r/3?25:10;H.score(sc);hud.set("sc",sc);H.sfx("pop");
      hud.set("pr",Math.round(hits/shots*100)+"%");
      return;
    }
  }
  hud.set("pr",Math.round(hits/shots*100)+"%");
});
H.loop(dt=>{
  if(over)return;
  t-=dt;cd-=dt;
  hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=250?H.done({win:true,score:sc,title:"Atirador de elite!",sub:sc+" pontos com "+Math.round(hits/Math.max(1,shots)*100)+"% de precisão."})
                  :H.done({win:false,score:sc,title:"Mira torta",sub:"Meta 250 — você fez "+sc+". Respire e mire o centro!"});}
  spawn-=dt;
  if(spawn<=0){spawn=.5;
    tgts.push({x:Math.random()<.5?-30:o.W+30,y:60+Math.random()*280,
      vx:(Math.random()<.5?1:-1)*(80+Math.random()*120),r:20+Math.random()*14});}
  for(const g of tgts)g.x+=g.vx*dt;
  tgts=tgts.filter(g=>g.x>-50&&g.x<o.W+50);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,0,o.W,40);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";x.fillText("// ESTANDE 07 — FOGO À VONTADE",14,25);
  for(const g of tgts){
    x.fillStyle=H.C.card;x.beginPath();x.arc(g.x,g.y,g.r,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.terra;x.beginPath();x.arc(g.x,g.y,g.r/3,0,7);x.fill();
  }
  x.strokeStyle=H.C.ink;x.lineWidth=1.5;
  x.beginPath();x.moveTo(o.W/2-14,o.H-24);x.lineTo(o.W/2+14,o.H-24);x.moveTo(o.W/2,o.H-36);x.lineTo(o.W/2,o.H-12);x.stroke();
});
}});
