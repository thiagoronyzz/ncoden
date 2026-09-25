/* NCODE N · 049 Pinbol de Bolso — três bolas, muitos pontos */
GREG(49,{
init(root,H){
let over=false,bx,by,vx,vy,balls=3,sc=0,charge=0,charging=false,state="ready";
const hud=H.hud(root,[["bl","BOLAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Segure Espaço/toque</b> para carregar e solte para lançar. <b>◀ ▶</b> ou toques laterais movem os flippers.");
const o=H.cvs(root,400,520),x=o.x;
const BUMP=[{x:120,y:170},{x:200,y:130},{x:280,y:170}];
let flipL=false,flipR=false;
const W2=o.W;
function serve(){bx=W2-28;by=o.H-60;vx=0;vy=0;state="ready";charge=0;}
serve();
function launch(){if(state!=="ready")return;state="play";vy=-(500+charge*14);vx=-40;H.sfx("pop");}
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="Space"){if(d){if(state==="ready")charging=true;}else{if(charging){charging=false;launch();}}}
  if(c==="ArrowLeft")flipL=d;
  if(c==="ArrowRight")flipR=d;
});
H.onTap(o,(px,py)=>{
  if(state==="ready"){charging=true;H.after(1,()=>{});return;}
  if(px<o.W/2){flipL=true;H.after(140,()=>flipL=false);}
  else{flipR=true;H.after(140,()=>flipR=false);}
});
H.loop(dt=>{
  if(over)return;
  if(charging&&state==="ready"){charge=Math.min(40,charge+dt*60);}
  if(state==="ready"){bx=W2-28;by=o.H-60;}
  else{
    vy+=900*dt;bx+=vx*dt;by+=vy*dt;
    if(bx<14){bx=14;vx=Math.abs(vx)*.7;H.beep(200,.04);}
    if(bx>W2-14){bx=W2-14;vx=-Math.abs(vx)*.7;H.beep(200,.04);}
    if(by<14){by=14;vy=Math.abs(vy)*.7;H.beep(200,.04);}
    if(bx>W2-70&&by>o.H-160){/* canal direito */}
    for(const b of BUMP){
      const dx=bx-b.x,dy=by-b.y,d=Math.hypot(dx,dy);
      if(d<26&&d>0){vx=dx/d*380;vy=dy/d*380-120;sc+=50;H.score(sc);hud.set("sc",sc);H.sfx("pop");}
    }
    const fy=o.H-70;
    if(flipL&&bx>60&&bx<170&&by>fy-24&&by<fy+24){vy=-520;vx-=120;sc+=5;H.score(sc);hud.set("sc",sc);H.beep(600,.05);}
    if(flipR&&bx>o.W-170&&bx<o.W-60&&by>fy-24&&by<fy+24){vy=-520;vx+=120;sc+=5;H.score(sc);hud.set("sc",sc);H.beep(600,.05);}
    if(by>o.H+20){
      balls--;hud.set("bl",balls);H.sfx("bad");
      if(balls<=0){over=true;
        return sc>=600?H.done({win:true,score:sc,title:"Mago do pinball!",sub:sc+" pontos com 3 bolas."})
                      :H.done({win:false,score:sc,title:"Sem bolas",sub:sc+" pontos. Meta 600 — mire os para-choques!"});}
      say("Bola perdida! Restam "+balls+".");serve();
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=4;x.strokeRect(6,6,o.W-12,o.H-12);
  x.strokeStyle=H.C.cement;x.lineWidth=2;
  x.beginPath();x.moveTo(W2-56,120);x.lineTo(W2-56,o.H-6);x.stroke();
  for(const b of BUMP){
    x.fillStyle=H.C.gold;x.beginPath();x.arc(b.x,b.y,20,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";x.fillText("+50",b.x-13,b.y+4);
  }
  const fy=o.H-70;
  x.strokeStyle=H.C.terra;x.lineWidth=8;
  x.beginPath();x.moveTo(60,fy+10);x.lineTo(flipL?150:130,flipL?fy-16:fy+4);x.stroke();
  x.beginPath();x.moveTo(o.W-60,fy+10);x.lineTo(flipR?o.W-150:o.W-130,flipR?fy-16:fy+4);x.stroke();
  x.fillStyle=H.C.ink;x.beginPath();x.arc(bx,by,9,0,7);x.fill();
  x.fillStyle=H.C.paper;x.beginPath();x.arc(bx-3,by-3,3,0,7);x.fill();
  if(state==="ready"){
    x.fillStyle=H.C.ok;x.fillRect(20,o.H-40,charge*6,14);
    x.strokeStyle=H.C.ink;x.strokeRect(20,o.H-40,240,14);
    x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
    x.fillText("SEGURE ESPAÇO / TOQUE…",20,o.H-48);
  }
});
H.btn(root,"Lançar (força mín.)",()=>{if(state==="ready"){charge=22;launch();}},false);
}});
