/* NCODE N · 193 Teclas de Piano — 40 teclas, 3 vidas! */
GREG(193,{
init(root,H){
let over=false,t=0,tiles=[],lives=3,cleared=0,speed=220;
const hud=H.hud(root,[["tc","TECLAS","0/40"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Toque as <b>teclas pretas</b> (clique ou D/F/J/K) antes que cruzem a linha! 40 teclas, 3 vidas.");
const o=H.cvs(root,440,460),x=o.x;
const KEYS=["KeyD","KeyF","KeyJ","KeyK"];
const r=H.rng(21);
let lastL=-1;
for(let i=0;i<40;i++){
  let l=Math.floor(r()*4);
  if(l===lastL)l=(l+1)%4;
  lastL=l;
  tiles.push({y:-i*110-60,l,hit:false});
}
const LINE=o.H-80;
function strike(l){
  if(over)return;
  const tl=tiles.find(k=>!k.hit&&k.l===l&&k.y>LINE-130&&k.y<LINE+30);
  if(tl){tl.hit=true;cleared++;H.score(cleared*25);hud.set("tc",cleared+"/40");hud.set("sc",cleared*25);
    H.beep(300+l*90,.08);
    if(cleared>=40){over=true;return H.done({win:true,score:1100,title:"Pianista!",sub:"40 teclas sem errar o ritmo."});}
  }else{
    lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:cleared*25,title:"Tecla errada!",sub:cleared+"/40. Toque só as pretas na linha!"});}
  }
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;const i=KEYS.indexOf(c);if(i>=0)strike(i);});
H.onTap(o,(px,py)=>{const l=Math.floor(px/(o.W/4));if(l>=0&&l<4)strike(l);});
H.loop(dt=>{
  if(over)return;
  t+=dt;speed=220+cleared*4;
  tiles.forEach(tl=>{if(!tl.hit)tl.y+=speed*dt;});
  const miss=tiles.find(k=>!k.hit&&k.y>LINE+40);
  if(miss){miss.hit=true;lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:cleared*25,title:"Escapou!",sub:cleared+"/40 teclas."});}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let l=0;l<4;l++){
    x.strokeStyle=H.C.cement;
    x.beginPath();x.moveTo(l*o.W/4,0);x.lineTo(l*o.W/4,o.H);x.stroke();
  }
  tiles.forEach(tl=>{
    if(tl.hit)return;
    x.fillStyle=H.C.ink;
    x.fillRect(tl.l*o.W/4+4,tl.y,o.W/4-8,100);
  });
  x.strokeStyle=H.C.terra;x.lineWidth=4;
  x.beginPath();x.moveTo(0,LINE);x.lineTo(o.W,LINE);x.stroke();
});
}});
