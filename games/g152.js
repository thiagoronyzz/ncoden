/* NCODE N · 152 Queijaria — 4 rodas premiadas em 10 dias */
GREG(152,{
init(root,H){
let over=false,day=1,temp=13,wheels=[];
const hud=H.hud(root,[["dd","DIA","1/10"],["tm","ADEGA","13°C"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na roda para <b>virar</b> (todo dia!). Mantenha 12–14°C. Roda < 50 estraga. Termine com 4+ rodas em 80+!");
const box=H.el("div","g-col",null,root);
const wbox=H.el("div","g-board",null,box);
wbox.style.gridTemplateColumns="repeat(3,1fr)";
wbox.style.width="min(100%,330px)";
wheels=new Array(6).fill(0).map(()=>({q:100,flip:false,bad:false}));
function paint(){
  hud.set("dd",day+"/10");hud.set("tm",temp+"°C");
  wbox.innerHTML="";
  wheels.forEach((w,i)=>{
    const b=H.el("button","g-cell"+(w.bad?" bad":w.flip?" good":" hot"),null,wbox);
    b.style.minHeight="72px";b.style.fontSize="13px";
    b.innerHTML=w.bad?"🤢<br>estragada":"🧀 "+Math.floor(w.q)+"<br>"+(w.flip?"virada ✓":"VIRAR!");
    if(!w.bad)b.addEventListener("click",()=>{if(!over){w.flip=true;H.sfx("tick");paint();}});
  });
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"🔥 +1°",()=>{if(!over){temp++;H.sfx("tick");paint();}},false);
H.btn(row,"❄️ −1°",()=>{if(!over){temp--;H.sfx("tick");paint();}},false);
H.btn(root,"🌙 Próximo dia",()=>{
  if(over)return;
  const okT=temp>=12&&temp<=14;
  wheels.forEach(w=>{
    if(w.bad)return;
    if(!w.flip)w.q-=18;
    if(!okT)w.q-=12;
    if(w.q<50){w.bad=true;H.sfx("bad");}
    w.flip=false;
  });
  temp+=Math.random()<.5?-1:1;
  temp=Math.max(8,Math.min(19,temp));
  day++;
  if(day>10){
    over=true;
    const good=wheels.filter(w=>!w.bad&&w.q>=80).length;
    H.score(good*60);
    if(good>=4)return H.done({win:true,score:good*60+100,title:"Queijos premiados!",sub:good+" rodas perfeitas após 10 dias."});
    return H.done({win:false,score:good*60,title:"Adega azeda…",sub:"Só "+good+"/4 premiadas. Vire todo dia, segure 12–14°C!"});
  }
  say("☀️ Dia "+day+": adega em "+temp+"°C. Vire as rodas!");
  paint();
},true);
}});
