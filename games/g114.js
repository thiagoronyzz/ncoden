/* NCODE N · 114 Feira Livre — compre barato, venda caro */
GREG(114,{
init(root,H){
const PROD=[{n:"🍎 Maçã",p:5},{n:"🧀 Queijo",p:12},{n:"🍯 Mel",p:20}];
let over=false,day=1,cash=50,stock=[0,0,0],prices=[];
const hud=H.hud(root,[["dd","DIA","1/5"],["cx","CAIXA","$50"],["mt","META","$120"]]);
const say=H.msg(root,"Preços mudam todo dia e o estoque <b>apodrece 30%</b> à noite. Termine o dia 5 com $120+!");
const box=H.el("div","g-col",null,root);
function roll(){
  prices=PROD.map(p=>Math.max(1,Math.round(p.p*(0.6+Math.random()*0.9))));
}
roll();
function paint(){
  hud.set("dd",day+"/5");hud.set("cx","$"+cash);
  box.innerHTML="";
  PROD.forEach((p,i)=>{
    const r2=H.el("div","g-row",null,box);
    H.el("div","g-chip",p.n+" · <b>$"+prices[i]+"</b> · estoque "+stock[i],r2);
    const bb=H.el("button","g-btn ghost","Comprar",r2);
    const bs=H.el("button","g-btn ghost","Vender",r2);
    bb.addEventListener("click",()=>{
      if(over)return;
      if(cash<prices[i]){H.sfx("bad");return;}
      cash-=prices[i];stock[i]++;H.sfx("tick");paint();
    });
    bs.addEventListener("click",()=>{
      if(over)return;
      if(stock[i]<=0){H.sfx("bad");return;}
      stock[i]--;cash+=prices[i];H.sfx("ok");paint();
    });
  });
  const tot=cash+stock[0]*prices[0]+stock[1]*prices[1]+stock[2]*prices[2];
  H.el("div","g-msg","Patrimônio estimado: <b>$"+tot+"</b>",box);
  const nx=H.el("button","g-btn","🌙 Fechar o dia "+day,true?box:box);
  nx.addEventListener("click",()=>{
    if(over)return;
    stock=stock.map(s=>Math.floor(s*0.7));
    day++;
    if(day>5){
      over=true;
      const final=cash+stock[0]*prices[0]+stock[1]*prices[1]+stock[2]*prices[2];
      H.score(final);
      if(final>=120)return H.done({win:true,score:final,title:"Feirante próspero!",sub:"$"+final+" em 5 dias de banca."});
      return H.done({win:false,score:final,title:"Banca no vermelho…",sub:"$"+final+" (meta $120). Compre na baixa!"});
    }
    roll();H.sfx("tick");
    say("☀️ Dia "+day+": novos preços! Estoque murchou 30%.");
    paint();
  });
}
paint();
}});
