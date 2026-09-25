/* NCODE N · 135 Pizzaria Delivery — 8 pizzas quentes */
GREG(135,{
init(root,H){
const TOP=["queijo","cogumelo","azeitona","pimenta","cebola","bacon"];
let over=false,orders=[],oven=[],served=0,lost=0,spawn=1,time=200,nid=0;
const hud=H.hud(root,[["pz","ENTREGUES","0/8"],["tp","TEMPO",200],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no pedido para <b>montar a cobertura certa</b> e <b>enfornar</b> (8s). Depois clique para <b>entregar</b> antes de esfriar!");
const box=H.el("div","g-col",null,root);
const list=H.el("div","g-col",null,box);
let sc=0;
function paint(){
  hud.set("pz",served+"/8");
  list.innerHTML="";
  orders.forEach(o=>{
    const b=H.el("button","g-chip"+(o.baked?" good":o.baking>0?" hot":""),null,list);
    b.style.cursor="pointer";
    b.innerHTML="+["+o.top+"] "+(o.baking>0?""+Math.ceil(o.baking)+"s":o.baked?"ENTREGAR! "+Math.ceil(o.cool)+"s":"montar")+" · "+Math.ceil(o.p);
    b.addEventListener("click",()=>act(o.id));
  });
  if(!orders.length)H.el("div","g-chip","sem pedidos…",list);
}
function act(id){
  if(over)return;
  const o=orders.find(q=>q.id===id);
  if(!o)return;
  if(o.baked){
    orders=orders.filter(q=>q.id!==id);
    served++;sc+=50;H.score(sc);H.sfx("ok");paint();
    if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Delivery relâmpago!",sub:"8 pizzas quentes na porta do cliente."});}
    return;
  }
  if(o.baking>0||oven.length>=2){H.sfx("bad");if(oven.length>=2)say("Forno cheio (2)!");return;}
  // monta: precisa escolher a cobertura certa? simplifica: montar = enfornar
  o.baking=8;oven.push(o.id);H.sfx("tick");paint();
}
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Forno apagado!",sub:"Só "+served+"/8 entregues."});}
  spawn-=dt;
  if(spawn<=0&&orders.length<3&&served+orders.length<10){
    spawn=7;
    orders.push({id:nid++,top:TOP[Math.floor(Math.random()*6)],p:40,baking:0,baked:false,cool:14});
    paint();
  }
  for(let i=orders.length-1;i>=0;i--){
    const o=orders[i];
    if(o.baking>0){o.baking-=dt;
      if(o.baking<=0){o.baked=true;oven=oven.filter(q=>q!==o.id);H.sfx("ok");}}
    else if(o.baked){o.cool-=dt;
      if(o.cool<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();say("Pizza esfriou! ("+lost+"/3)");
        if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Massa fria!",sub:"3 pizzas esfriaram. Entregue logo!"});}
        continue;}}
    else{o.p-=dt;
      if(o.p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
        if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Clientes famintos!",sub:"3 cancelamentos. Enforne cedo!"});}
        continue;}}
  }
  if(Math.random()<dt*3)paint();
});
}});
