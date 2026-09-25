/* NCODE N · 134 Floricultura — 6 buquês sob encomenda */
GREG(134,{
init(root,H){
const FL=["rosa","girassol","tulipa","margarida","azaleia"];
let over=false,order=[],bouquet=[],served=0,stock=[];
const hud=H.hud(root,[["bq","BUQUÊS","0/6"],["sc","PONTOS",0]]);
const say=H.msg(root,"O pedido pede flores exatas. Clique nas flores da bancada para montar <b>igual</b> e entregue!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const bq=H.el("div","g-msg","",box);
const bench=H.el("div","g-row",null,box);
let sc=0;
function newOrder(){
  order=[];
  for(let i=0;i<3;i++)order.push(FL[Math.floor(Math.random()*5)]);
  // bancada: pedido + 3 iscas
  stock=order.concat([FL[Math.floor(Math.random()*5)],FL[Math.floor(Math.random()*5)]]);
  stock.sort(()=>Math.random()-.5);
  bouquet=[];
  paint();
}
function paint(){
  od.innerHTML="Pedido: "+order.join(" ");
  bq.innerHTML="Buquê: "+(bouquet.join(" ")||"—");
  bench.innerHTML="";
  stock.forEach((f,i)=>{
    const b=H.el("button","g-btn ghost",f||"·",bench);
    if(!f)b.disabled=true;
    b.addEventListener("click",()=>{
      if(over||!f||bouquet.length>=3)return;
      bouquet.push(f);stock[i]=null;H.sfx("tick");paint();
    });
  });
}
newOrder();
const row=H.el("div","g-row",null,box);
H.btn(row,"↩ Desfazer",()=>{
  if(over||!bouquet.length)return;
  const f=bouquet.pop();
  const ix=stock.findIndex(q=>!q);
  stock[ix]=f;H.sfx("tick");paint();
},false);
H.btn(row,"Entregar buquê",()=>{
  if(over)return;
  const a=order.slice().sort().join(),b=bouquet.slice().sort().join();
  if(bouquet.length===3&&a===b){
    served++;sc+=50;H.score(sc);hud.set("bq",served+"/6");hud.set("sc",sc);H.sfx("ok");
    if(served>=6){over=true;return H.done({win:true,score:sc+100,title:"Flores frescas!",sub:"6 buquês exatamente como pedido."});}
    say("Buquê entregue! Próximo pedido…");newOrder();
  }else{H.sfx("bad");say("✕ Buquê diferente! Confira flor por flor.");}
},true);
}});
