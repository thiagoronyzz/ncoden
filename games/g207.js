/* NCODE N · 207 Surf de Ondas — 20 cristas! */
GREG(207,{
init(root,H){
let over=false,t=0,lane=1,score=0,hit2=0,total=20,ph=0;
const hud=H.hud(root,[["cr","CRISTAS","0/20"],["pt","PONTOS",0]]);
const say=H.msg(root,"Setas ←→/A-D ou toque na raia! Quando a onda <b>quebrar</b> (círculo verde), esteja na <b>raia da crista</b>!");
const o=H.cvs(root,500,360),x=o.x;
const r=H.rng(51);
const waves=[];
for(let i=0;i<total;i++)waves.push({t:2+i*0.9,l:Math.floor(r()*3),hit:0});
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowLeft"||c==="KeyA")lane=Math.max(0,lane-1);
  if(c==="ArrowRight"||c==="KeyD")lane=Math.min(2,lane+1);});
H.onTap(o,(px,py)=>{lane=H.clamp(Math.floor(px/(o.W/3)),0,2);H.sfx("tick");});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  waves.forEach(w=>{
    if(w.hit||t<w.t)return;
    w.hit=lane===w.l?1:-1;
    if(w.hit>0){score+=100;hit2++;H.sfx("ok");}
    else{score=Math.max(0,score-30);H.sfx("bad");}
    H.score(score);hud.set("cr",hit2+"/"+total);hud.set("pt",score);
  });
  if(waves.every(w=>w.hit!==0)){
    over=true;
    if(hit2>=14)return H.done({win:true,score,title:"Surfista!",sub:hit2+"/20 cristas surfadas."});
    return H.done({win:false,score,title:"Caldo!",sub:"Só "+hit2+"/20 (precisa 14)."});
  }
  x.fillStyle="#123a4d";x.fillRect(0,0,o.W,o.H);
  for(let l=0;l<3;l++){
    x.fillStyle=l===lane?"rgba(196,214,69,.15)":"transparent";
    x.fillRect(l*o.W/3,0,o.W/3,o.H);
    x.strokeStyle="rgba(255,255,255,.2)";
    x.beginPath();x.moveTo(l*o.W/3,0);x.lineTo(l*o.W/3,o.H);x.stroke();
  }
  const nx=waves.find(w=>!w.hit);
  waves.forEach(w=>{
    if(w.hit||w.t<t-0.2)return;
    const lead=w.t-t;
    if(lead>1.5)return;
    const cx=o.W/6+w.l*o.W/3;
    const rr=20+lead*70;
    x.strokeStyle=lead<0.25?H.C.wasabi:"#fff";x.lineWidth=3;
    x.beginPath();x.arc(cx,140,Math.max(8,rr),0,7);x.stroke();
  });
  x.strokeStyle=H.C.wasabi;x.lineWidth=4;
  x.beginPath();x.arc(o.W/2,140,22,0,7);x.stroke();
  x.font="34px serif";
  x.fillText("🏄",o.W/6+lane*o.W/3-17,300+Math.sin(t*4)*8);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("fique na raia quando o círculo fechar!",120,340);
});
}});
