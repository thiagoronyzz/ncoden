/* NCODE N · 177 Túnel de Vento — 3 voos na faixa! */
GREG(177,{
init(root,H){
const OBJ=[{e:"🪶",n:"pena",w:[35,55]},{e:"🎈",n:"balão",w:[55,75]},{e:"✈️",n:"avião",w:[75,95]}];
let over=false,st=0,wind=30,oy=200,vy=0,holdT=0,gust=0,t=0;
const hud=H.hud(root,[["fs","FASE","1/3"],["vn","VENTO",30],["fx","NA FAIXA","0s/5s"]]);
const say=H.msg(root,"Ajuste o <b>vento</b> (+/−) para segurar o objeto na <b>faixa verde</b> por 5s! Cada um voa numa faixa de vento. Rajadas atrapalham!");
const o=H.cvs(root,500,340),x=o.x;
H.loop(dt=>{
  if(over)return;
  t+=dt;gust=Math.sin(t*2.1)*9+Math.sin(t*.7)*7;
  const O=OBJ[st];
  const eff=wind+gust;
  const mid=(O.w[0]+O.w[1])/2;
  const lift=(eff-mid)*2.2;
  vy+=(160-lift*4)*dt*.4;
  vy=H.clamp(vy,-140,140);
  oy=H.clamp(oy+vy*dt,60,o.H-40);
  const inZone=oy>130&&oy<210;
  if(inZone){holdT+=dt;hud.set("fx",holdT.toFixed(1)+"s/5s");}
  else holdT=Math.max(0,holdT-dt);
  if(holdT>=5){
    H.sfx("ok");st++;
    if(st>=OBJ.length){over=true;
      return H.done({win:true,score:400,title:"Aerodinâmica dominada!",sub:"3 objetos estabilizados no túnel."});}
    holdT=0;oy=200;vy=0;
    say("✅ "+OBJ[st-1].n+"! Agora: "+OBJ[st].e+" "+OBJ[st].n+" (vento "+OBJ[st].w.join("–")+").");
    hud.set("fs",(st+1)+"/3");
  }
  x.fillStyle="#2c3e4d";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(196,214,69,.25)";x.fillRect(0,130,o.W,80);
  x.strokeStyle=H.C.wasabi;x.strokeRect(0,130,o.W,80);
  x.strokeStyle="rgba(255,255,255,.3)";x.lineWidth=2;
  for(let i=0;i<6;i++){
    const yy=40+i*50,off=(t*(30+wind*3)+i*90)%(o.W+100)-50;
    x.beginPath();x.moveTo(off,yy);x.lineTo(off+40+wind,yy);x.stroke();
  }
  x.font="40px serif";x.fillText(O.e,o.W/2-20,oy+14);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText(O.n+" voa com vento "+O.w.join("–")+" · rajada "+(gust>0?"+":"")+Math.round(gust),12,20);
  x.fillText("vento: "+Math.round(wind),12,300);
  x.fillStyle=H.C.wasabi;x.fillRect(12,308,wind*3,12);
});
const row=H.el("div","g-row",null,root);
H.btn(row,"💨 − vento",()=>{wind=Math.max(0,wind-5);hud.set("vn",Math.round(wind));H.sfx("tick");},false);
H.btn(row,"🌪️ + vento",()=>{wind=Math.min(100,wind+5);hud.set("vn",Math.round(wind));H.sfx("tick");},false);
}});
