/* NCODE N · 151 Fazenda de Cogumelos — 12 cogumelos no clima */
GREG(151,{
init(root,H){
const VAR=[{e:"🍄",h:[60,80],t:[18,24]},{e:"🍄‍🟫",h:[70,90],t:[15,20]},{e:"⛱️",h:[50,70],t:[22,28]}];
let over=false,temp=21,hum=[70,70,70],grow=[0,0,0],got=0,time=150;
const hud=H.hud(root,[["cg","COLHIDOS","0/12"],["tp","TEMPO",60],["tm","TEMP",21]]);
const say=H.msg(root,"Cada variedade quer <b>umidade + temperatura</b> certas. 💧 névoa por prateleira · 🔥/❄️ temperatura global. No ponto = cresce; colha em 100%!");
const box=H.el("div","g-col",null,root);
const sbox=H.el("div","g-row",null,box);
function paint(){
  hud.set("cg",got+"/12");hud.set("tm",Math.round(temp)+"°C");
  sbox.innerHTML="";
  VAR.forEach((v,i)=>{
    const okH=hum[i]>=v.h[0]&&hum[i]<=v.h[1],okT=temp>=v.t[0]&&temp<=v.t[1];
    const b=H.el("button","g-cell"+(grow[i]>=100?" good":okH&&okT?" hot":""),null,sbox);
    b.style.minWidth="110px";b.style.fontSize="12px";
    b.innerHTML=v.e+" "+Math.floor(grow[i])+"%<br>💧"+Math.floor(hum[i])+"% ("+v.h[0]+"–"+v.h[1]+")<br>🌡️ quer "+v.t[0]+"–"+v.t[1]+"°"+(grow[i]>=100?"<br>COLHER!":"");
    b.addEventListener("click",()=>{
      if(over)return;
      if(grow[i]>=100){
        grow[i]=0;got++;H.score(got*25);H.sfx("ok");paint();
        if(got>=12){over=true;return H.done({win:true,score:400,title:"Colheita fúngica!",sub:"12 cogumelos no clima perfeito."});}
      }else{hum[i]=Math.min(100,hum[i]+15);H.sfx("tick");paint();}
    });
  });
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"🔥 +2°",()=>{if(!over){temp=Math.min(32,temp+2);H.sfx("tick");paint();}},false);
H.btn(row,"❄️ −2°",()=>{if(!over){temp=Math.max(10,temp-2);H.sfx("tick");paint();}},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:got*25,title:"Estufa vazia!",sub:"Só "+got+"/12. Ajuste umidade e temp!"});}
  hum=hum.map(h=>Math.max(20,h-dt*2.2));
  VAR.forEach((v,i)=>{
    const ok=hum[i]>=v.h[0]&&hum[i]<=v.h[1]&&temp>=v.t[0]&&temp<=v.t[1];
    if(ok&&grow[i]<100)grow[i]+=dt*9;
  });
  if(Math.random()<dt*2)paint();
});
}});
