/* NCODE N · 061 Slalom de Esqui — desça entre as bandeiras */
GREG(61,{
init(root,H){
const GOAL=2000;
let over=false,px=260,dist=0,pen=0,gates=[],trees=[],miss=0,hit=0,t=0;
const hud=H.hud(root,[["ds","DESCIDA",0],["pn","PÊNALTIS",0],["sc","TEMPO","0s"]]);
const say=H.msg(root,"Ziguezagueie com <b>mouse, toque ou setas</b>. Passe <b>entre as bandeiras</b> — fora = +3s. Árvores atrasam!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function build(){
  px=260;dist=0;pen=0;miss=0;hit=0;t=0;gates=[];trees=[];
  const r=H.rng(7);
  for(let d=200;d<GOAL;d+=260){
    const gx=80+r()*340;
    gates.push({d,gx,passed:false});
  }
  for(let d=100;d<GOAL;d+=90){
    if(r()<.7)trees.push({d,x:20+r()*460});
  }
}
build();
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(kb.is("ArrowLeft"))px-=300*dt;
  if(kb.is("ArrowRight"))px+=300*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*7);
  px=H.clamp(px,20,o.W-20);
  dist+=170*dt;
  for(const g of gates){
    if(!g.passed&&dist>=g.d){
      g.passed=true;
      if(Math.abs(px-g.gx)<46){H.sfx("ok");}
      else{miss++;pen+=3;H.sfx("bad");say("🚩 Fora da porteira! +3s (faltas: "+miss+")");}
    }
  }
  for(const tr of trees){
    if(!tr.hit&&Math.abs(dist-tr.d)<14&&Math.abs(px-tr.x)<24){
      tr.hit=true;hit++;pen+=2;dist-=30;H.sfx("bad");
    }
  }
  hud.set("ds",Math.floor(dist)+"m");hud.set("pn",pen.toFixed(0)+"s");hud.set("sc",(t+pen).toFixed(1)+"s");
  if(dist>=GOAL){over=true;
    const total=t+pen,sc=Math.max(50,Math.round(600-total*4-miss*20-hit*10));H.score(sc);
    return H.done({win:miss<=6,score:sc,title:miss<=6?"Pódio no slalom!":"Fora do pódio",
      sub:"Tempo "+total.toFixed(1)+"s · "+miss+" porteiras perdidas · "+hit+" árvores."});
  }
  x.fillStyle="#eef3f6";x.fillRect(0,0,o.W,o.H);
  const py=o.H-90;
  for(const tr of trees){
    const sy=py-(tr.d-dist)*0.9;
    if(sy<-30||sy>o.H+30)continue;
    x.font="26px serif";x.fillText("🌲",tr.x-13,sy+9);
  }
  for(const g of gates){
    const sy=py-(g.d-dist)*0.9;
    if(sy<-40||sy>o.H+40)continue;
    const ok=g.passed&&Math.abs(px-g.gx)<60;
    x.fillStyle=g.passed?(ok?"#3E7C4F":H.C.terra):H.C.terra;
    x.fillRect(g.gx-46,sy-24,8,30);x.fillRect(g.gx+38,sy-24,8,30);
    x.fillStyle=g.passed?(ok?"#3E7C4F":H.C.terra):"#2E6E8A";
    x.beginPath();x.moveTo(g.gx-46,sy-24);x.lineTo(g.gx-28,sy-18);x.lineTo(g.gx-46,sy-12);x.fill();
    x.beginPath();x.moveTo(g.gx+46,sy-24);x.lineTo(g.gx+28,sy-18);x.lineTo(g.gx+46,sy-12);x.fill();
  }
  x.font="30px serif";x.fillText("⛷️",px-15,py+10);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(Math.floor(dist)+"m / "+GOAL+"m",12,20);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
