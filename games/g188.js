/* NCODE N · 188 Areia no Recipiente — na medida exata! */
GREG(188,{
init(root,H){
let over=false,fx=250,pour=false,sand=100,jars=[],spill=0;
const hud=H.hud(root,[["ar","AREIA",100],["js","POTES","0/3"]]);
const say=H.msg(root,"ARRASTE o funil e SEGURE <b>despejar</b>! Encha cada pote até a <b>linha (±5)</b>. Areia fora do pote = desperdício. 100 de areia no total!");
const o=H.cvs(root,500,380),x=o.x;
jars=[{x:90,t:30,f:0},{x:250,t:45,f:0},{x:410,t:25,f:0}];
const ptr=H.ptr(o);
const btn=H.el("button","g-btn","SEGURE PARA DESPEJAR",root);
btn.addEventListener("pointerdown",e=>{e.preventDefault();pour=true;});
btn.addEventListener("pointerup",()=>pour=false);
btn.addEventListener("pointerleave",()=>pour=false);
const kb=H.keys();
kb.on((c,d)=>{if(c==="Space")pour=d;});
H.loop(dt=>{
  if(over)return;
  if(ptr.down)fx=H.clamp(ptr.x,40,o.W-40);
  if(pour&&sand>0){
    const amt=Math.min(sand,dt*16);
    sand-=amt;
    const j=jars.find(k=>Math.abs(fx-k.x)<34);
    if(j)j.f+=amt;else spill+=amt;
    hud.set("ar",Math.floor(sand));
    if(Math.random()<dt*10)H.sfx("tick");
  }
  const ok=jars.filter(j=>Math.abs(j.f-j.t)<=5).length;
  hud.set("js",ok+"/3");
  if(ok>=3){over=true;H.score(300+Math.floor(sand)*3);
    return H.done({win:true,score:300+Math.floor(sand)*3+100,title:"Medida exata!",sub:"3 potes perfeitos, "+Math.floor(sand)+" de areia de sobra."});
  }
  if(sand<=0&&!pour){
    over=true;
    return H.done({win:false,score:ok*80,title:"Areia acabou!",sub:ok+"/3 potes. Desperdiçou "+Math.floor(spill)+" fora!"});
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  jars.forEach(j=>{
    const h=200,fh=Math.min(200,j.f/50*200);
    x.strokeStyle=H.C.ink;x.lineWidth=3;
    x.strokeRect(j.x-34,140,68,200);
    x.fillStyle="#E4D5B5";
    x.fillRect(j.x-31,340-fh,62,fh);
    const ty=340-j.t/50*200;
    x.strokeStyle=H.C.ok;x.lineWidth=3;
    x.beginPath();x.moveTo(j.x-40,ty);x.lineTo(j.x+40,ty);x.stroke();
    x.fillStyle=Math.abs(j.f-j.t)<=5?H.C.ok:H.C.ink;
    x.font="bold 12px 'Space Mono',monospace";
    x.fillText(Math.floor(j.f)+"/"+j.t,j.x-20,356);
  });
  // funil
  x.fillStyle="#8A877C";
  x.beginPath();x.moveTo(fx-26,20);x.lineTo(fx+26,20);x.lineTo(fx+8,60);x.lineTo(fx-8,60);x.closePath();x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  if(pour&&sand>0){
    x.fillStyle="#D9B96F";
    x.fillRect(fx-2,60,4,90);
  }
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("arraste o funil · espaço também despeja",12,20);
});
}});
