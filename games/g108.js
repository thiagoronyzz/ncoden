/* NCODE N · 108 Oficina do Robô — monte sob encomenda */
GREG(108,{
init(root,H){
const HEADS=["cúpula","parafuso","antena"],BODIES=["■","■","■"],NAMES=["Tocha","Parafuso","Antena"];
let over=false,order=null,slots={},built=0,time=120;
const hud=H.hud(root,[["rb","ROBÔS","0/5"],["tp","TEMPO",120],["sc","PONTOS",0]]);
const say=H.msg(root,"O pedido mostra <b>cabeça + corpo + nome</b>. Clique nas peças e no nome para montar igual!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const bench=H.el("div","g-row",null,box);
let sc=0;
function newOrder(){
  order={h:Math.floor(Math.random()*3),b:Math.floor(Math.random()*3),n:Math.floor(Math.random()*3)};
  slots={};paint();
}
function paint(){
  od.innerHTML="Pedido: "+HEADS[order.h]+" + "+BODIES[order.b]+" corpo + nome <b>"+NAMES[order.n]+"</b>";
  bench.innerHTML="";
  const cur=H.el("div","g-msg","Bancada: "+(slots.h!=null?HEADS[slots.h]:"□ cabeça")+" "+(slots.b!=null?BODIES[slots.b]:"□ corpo")+" "+(slots.n!=null?NAMES[slots.n]:"□ nome"),box);
  [["h",HEADS],["b",BODIES]].forEach(([k,arr])=>{
    const r2=H.el("div","g-row",null,box);
    arr.forEach((e,i)=>{
      const btn=H.el("button","g-btn ghost",e,r2);
      btn.addEventListener("click",()=>{if(!over){slots[k]=i;H.sfx("tick");paint();}});
    });
  });
  const rn=H.el("div","g-row",null,box);
  NAMES.forEach((nm,i)=>{
    const btn=H.el("button","g-chip",nm,rn);
    btn.style.cursor="pointer";
    btn.addEventListener("click",()=>{if(!over){slots.n=i;H.sfx("tick");paint();}});
  });
  const ok=H.el("button","g-btn","Entregar robô",box);
  ok.addEventListener("click",()=>{
    if(over)return;
    if(slots.h===order.h&&slots.b===order.b&&slots.n===order.n){
      built++;sc+=80;H.score(sc);hud.set("sc",sc);hud.set("rb",built+"/5");H.sfx("ok");
      if(built>=5){over=true;return H.done({win:true,score:sc+Math.floor(time),title:"Oficina premiada!",sub:"5 robôs exatamente como pedido."});}
      say("Robô entregue! +80. Próximo pedido…");newOrder();
    }else{H.sfx("bad");say("✕ Peças erradas! Compare com o pedido.");}
  });
}
newOrder();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Fábrica fechada!",sub:"Só "+built+"/5 robôs no prazo."});}
});
}});
