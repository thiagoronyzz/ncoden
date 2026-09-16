/* NCODE N · 051 Quebra-Tijolos — rebata e destrua */
GREG(51,{
init(root,H){
const LAYOUTS=[
 ["11111","22222","33333","11111"],
 ["13131","32323","13131","32323","11111"],
 ["33333","3...3","32223","3...3","33333"]
];
const BC=["",H.C.terra,H.C.gold,H.C.ok];
let lv=0,over=false,px,bx,by,vx,vy,br=[],lives=3,sc=0,stuck=true;
const hud=H.hud(root,[["nv","NÍVEL",1],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mova a raquete com <b>mouse, toque ou setas</b>. Clique/Espaço lança a bola grudada.");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  px=o.W/2;br=[];
  const L=LAYOUTS[lv];
  L.forEach((row,r)=>{[...row].forEach((ch,c)=>{
    if(ch!==".")br.push({x:30+c*44,y:50+r*26,hp:+ch});
  });});
  reset();hud.set("nv",lv+1);
}
function reset(){bx=px;by=o.H-50;vx=0;vy=0;stuck=true;}
function launch(){if(!stuck||over)return;stuck=false;
  const a=-Math.PI/2+(Math.random()-.5)*.8;
  vx=Math.cos(a)*330;vy=Math.sin(a)*330;H.sfx("pop");}
kb.on((c,d)=>{if(d&&c==="Space")launch();});
H.onTap(o,()=>launch());
H.loop(dt=>{
  if(over)return;
  if(kb.is("ArrowLeft"))px-=380*dt;
  if(kb.is("ArrowRight"))px+=380*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*12);
  px=H.clamp(px,50,o.W-50);
  if(stuck){bx=px;by=o.H-50;}
  else{
    bx+=vx*dt;by+=vy*dt;
    if(bx<12){bx=12;vx=Math.abs(vx);H.beep(220,.04);}
    if(bx>o.W-12){bx=o.W-12;vx=-Math.abs(vx);H.beep(220,.04);}
    if(by<12){by=12;vy=Math.abs(vy);H.beep(220,.04);}
    if(vy>0&&by>o.H-58&&by<o.H-38&&Math.abs(bx-px)<52){
      const off=(bx-px)/52;
      const sp=Math.min(520,Math.hypot(vx,vy)+8);
      const a=-Math.PI/2+off*.9;
      vx=Math.cos(a)*sp;vy=Math.sin(a)*sp;H.beep(440,.05);
    }
    for(let i=br.length-1;i>=0;i--){
      const b=br[i];
      if(bx>b.x&&bx<b.x+40&&by>b.y&&by<b.y+22){
        b.hp--;vy*=-1;
        if(b.hp<=0){br.splice(i,1);sc+=20;}
        else sc+=5;
        H.score(sc);hud.set("sc",sc);H.sfx("tick");break;
      }
    }
    if(!br.length){
      H.sfx("ok");
      if(lv>=LAYOUTS.length-1){over=true;return H.done({win:true,score:sc+150,title:"Parede demolida!",sub:"3 fases de tijolos viraram pó."});}
      lv++;say("Fase "+(lv+1)+": tijolos mais duros!");build();return;
    }
    if(by>o.H+10){
      lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Sem bolas",sub:sc+" pontos. Mire os cantos da raquete!"});}
      say("Bola perdida! Restam "+lives+".");reset();
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.paper2;x.fillRect(0,0,o.W,40);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";x.fillText("// FASE "+(lv+1),14,24);
  for(const b of br){
    x.fillStyle=BC[b.hp];x.fillRect(b.x,b.y,40,22);
    x.strokeStyle=H.C.ink;x.lineWidth=1.5;x.strokeRect(b.x,b.y,40,22);
    if(b.hp>1){x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";x.fillText(b.hp,b.x+16,b.y+16);}
  }
  x.fillStyle=H.C.ink;x.fillRect(px-50,o.H-48,100,12);
  x.fillStyle=H.C.wasabi;x.fillRect(px-50,o.H-48,100,4);
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,8,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
});
build();
}});
