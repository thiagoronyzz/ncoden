/* NCODE N · 158 Ramen Shop — 8 tigelas fumegantes */
GREG(158,{
init(root,H){
const TOP=["ovo","carne","alga"];
let over=false,orders=[],pots=[null,null],broth=true,served=0,lost=0,spawn=1,time=200,nid=0;
const hud=H.hud(root,[["rm","RAMENS","0/8"],["tp","TEMPO",200],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no pedido para <b>cozinhar o macarrão</b> (2 bocas, 6s). <b>Caldo</b> precisa estar quente. Depois clique para <b>montar com a cobertura certa</b>!");
const box=H.el("div","g-col",null,root);
const lbox=H.el("div","g-col",null,box);
const pbox=H.el("div","g-row",null,box);
let sc=0;
function paint(){
  hud.set("rm",served+"/8");
  lbox.innerHTML="";
  orders.forEach(o=>{
    const b=H.el("button","g-chip"+(o.noodle==="ok"?" good":o.noodle?" hot":""),null,lbox);
    b.style.cursor="pointer";
    b.innerHTML="ramen +["+o.top+"] "+(o.noodle==="ok"?"✔ MONTAR!":o.noodle?"cozinhando":"cozinhar")+" · "+Math.ceil(o.p)+"s";
    b.addEventListener("click",()=>act(o.id));
  });
  if(!orders.length)H.el("div","g-chip","sem pedidos…",lbox);
  pbox.innerHTML="";
  pots.forEach((p,i)=>{
    H.el("div","g-chip",!p?"boca "+(i+1)+" livre":""+Math.ceil(p.t)+"s"+(p.over?"":""),pbox);
  });
  H.el("div","g-chip"+(broth?" good":" bad"),broth?"caldo quente":"caldo frio! REAQUEÇA",pbox);
}
function act(id){
  if(over)return;
  const o=orders.find(q=>q.id===id);
  if(!o)return;
  if(o.noodle==="ok"){
    if(!broth){H.sfx("bad");say("Caldo frio! Reaqueça antes.");return;}
    if(!o.topOk){H.sfx("bad");say("Escolha a cobertura "+o.top+" abaixo!");return;}
    orders=orders.filter(q=>q.id!==id);
    served++;sc+=50;H.score(sc);H.sfx("ok");paint();
    if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Ramen perfeito!",sub:"8 tigelas fumegantes."});}
    return;
  }
  if(o.noodle)return;
  const f=pots.findIndex(q=>!q);
  if(f<0){H.sfx("bad");say("Bocas ocupadas!");return;}
  o.noodle="cook";pots[f]={oid:o.id,t:6,over:5};H.sfx("tick");paint();
}
paint();
const trow=H.el("div","g-row",null,box);
TOP.forEach(t=>{
  H.btn(trow,"cobertura "+t,()=>{
    if(over)return;
    const o=orders.find(q=>q.noodle==="ok"&&!q.topOk);
    if(!o){H.sfx("bad");return;}
    if(o.top!==t){H.sfx("bad");say("Cobertura errada! O pedido quer "+o.top+".");return;}
    o.topOk=true;H.sfx("ok");say("Cobertura certa! Clique no pedido para montar.");paint();
  },false);
});
H.btn(root,"Reaquecer caldo",()=>{if(!over){broth=true;H.sfx("tick");paint();}},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Loja fechou!",sub:"Só "+served+"/8."});}
  if(Math.random()<dt*.12&&broth){broth=false;paint();say("O caldo esfriou! Reaqueça.");}
  spawn-=dt;
  if(spawn<=0&&orders.length<3&&served+orders.length<10){
    spawn=8;orders.push({id:nid++,top:TOP[Math.floor(Math.random()*3)],p:44,noodle:null,topOk:false});paint();
  }
  pots.forEach((p,i)=>{
    if(!p)return;
    if(p.t>0){p.t-=dt;if(p.t<=0){const o=orders.find(q=>q.id===p.oid);if(o)o.noodle="ok";pots[i]=null;H.sfx("ok");paint();}}
  });
  for(let i=orders.length-1;i>=0;i--){
    orders[i].p-=dt;
    if(orders[i].p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Clientes famintos!",sub:"3 cancelamentos."});}
    }
  }
  if(Math.random()<dt*2)paint();
});
}});
