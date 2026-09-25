/* NCODE N · 073 Prato Giratório — não deixe cair */
GREG(73,{
init(root,H){
let over=false,plates=[],t=60,lives=3,sc=0;
const hud=H.hud(root,[["tp","TEMPO",60],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Toque nos <b>pratos</b> para girá-los. Se o giro zerar, o prato cai! Sobreviva 60s.");
const o=H.cvs(root,500,380),x=o.x;
function build(){
  plates=[];t=60;lives=3;sc=0;
  for(let i=0;i<4;i++)plates.push({x:70+i*120,spin:70});
  hud.set("vd",3);hud.set("sc",0);
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const p of plates){
    if(Math.hypot(p.x-px,120-py)<52){p.spin=Math.min(100,p.spin+38);sc+=5;H.score(sc);hud.set("sc",sc);H.sfx("tick");return;}
  }
});
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;return H.done({win:true,score:sc+200,title:"Equilibrista!",sub:"60 segundos com 4 pratos no ar."});}
  const decay=11+(60-t)*0.12;
  for(const p of plates){
    p.spin-=decay*dt;
    if(p.spin<=0){
      lives--;hud.set("vd",lives);H.sfx("lose");p.spin=65;
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Louça quebrada!",sub:"3 pratos no chão. Gire os mais lentos primeiro!"});}
      say("Prato caiu! Vidas: "+lives);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(0,o.H-24,o.W,24);
  for(const p of plates){
    x.fillStyle="#a4764a";x.fillRect(p.x-4,150,8,o.H-150-24);
    const wob=p.spin<25?Math.sin(Date.now()/60)*6:0;
    x.save();x.translate(p.x+wob,120);x.rotate(wob/40);
    x.fillStyle=p.spin<25?H.C.terra:H.C.card;
    x.beginPath();x.ellipse(0,0,46,14,0,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.strokeStyle=H.C.cement;x.beginPath();x.ellipse(0,0,26,8,0,0,7);x.stroke();
    x.restore();
    x.fillStyle=H.C.card;x.fillRect(p.x-40,52,80,10);
    x.fillStyle=p.spin<25?H.C.terra:H.C.ok;
    x.fillRect(p.x-40,52,80*Math.max(0,p.spin)/100,10);
    x.strokeStyle=H.C.ink;x.strokeRect(p.x-40,52,80,10);
  }
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
