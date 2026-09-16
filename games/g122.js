/* NCODE N · 122 Barraca de Limonada — 7 dias até $60 */
GREG(122,{
init(root,H){
let over=false,day=1,cash=20,lem=0,sug=0,cup=0,price=3,wx=0;
const hud=H.hud(root,[["dd","DIA","1/7"],["cx","CAIXA","$20"],["cl","CLIMA","☀️"]]);
const say=H.msg(root,"Compre insumos, ajuste o preço e abra a barraca! Sol ☀️ = sede · nublado ⛅ = morno · chuva 🌧️ = fraco.");
const box=H.el("div","g-col",null,root);
const WX=[["☀️ sol",30],["⛅ nublado",18],["🌧️ chuva",8]];
function paint(){
  hud.set("dd",day+"/7");hud.set("cx","$"+cash);hud.set("cl",WX[wx][0]);
  box.innerHTML="";
  H.el("div","g-msg","📦 limões "+lem+" · açúcar "+sug+" · copos "+cup+" (1 copo vendido = 1 de cada)",box);
  const r2=H.el("div","g-row",null,box);
  [["🍋 Limão $1","lem",1],["🍬 Açúcar $1","sug",1],["🥤 2 copos $1","cup",1]].forEach(([nm,k,pr])=>{
    const b=H.el("button","g-btn ghost",nm,r2);
    b.addEventListener("click",()=>{
      if(over||cash<pr){H.sfx("bad");return;}
      cash-=pr;
      if(k==="cup")cup+=2;else if(k==="lem")lem++;else sug++;
      H.sfx("tick");paint();
    });
  });
  const r3=H.el("div","g-row",null,box);
  H.el("div","g-chip","💲 Preço: <b>$"+price+"</b>",r3);
  const bm=H.el("button","g-btn ghost","−",r3),bp=H.el("button","g-btn ghost","+",r3);
  bm.addEventListener("click",()=>{if(price>1&&!over){price--;H.sfx("tick");paint();}});
  bp.addEventListener("click",()=>{if(price<8&&!over){price++;H.sfx("tick");paint();}});
  const go=H.el("button","g-btn","🍋 Abrir a barraca!",box);
  go.addEventListener("click",sell);
}
function sell(){
  if(over)return;
  const clients=WX[wx][1];
  let sold=0;
  for(let i=0;i<clients;i++){
    const will=1+Math.random()*5+(wx===0?1.5:wx===2?-1.5:0);
    if(price<=will&&lem>0&&sug>0&&cup>0){lem--;sug--;cup--;sold++;cash+=price;}
  }
  H.sfx(sold?"ok":"bad");
  lem=Math.max(0,lem-1);
  day++;
  if(day>7){
    over=true;H.score(cash);
    if(cash>=60)return H.done({win:true,score:cash,title:"Império da limonada!",sub:"$"+cash+" em 7 dias (começou com $20)."});
    return H.done({win:false,score:cash,title:"Caldo azedo…",sub:"$"+cash+" (meta $60). Preço baixo no sol, alto na chuva!"});
  }
  const r=Math.random();
  wx=r<.5?0:r<.8?1:2;
  say("Dia "+(day-1)+": "+sold+" copos vendidos! Previsão: "+WX[wx][0]+".");
  paint();
}
paint();
}});
