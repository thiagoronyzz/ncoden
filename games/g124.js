/* NCODE N · 124 Padaria — 8 pedidos sem queimar */
GREG(124,{
init(root,H){
const IT={pao:{e:"",n:"Pão",t:5,pr:6},bolo:{e:"",n:"Bolo",t:8,pr:10},torta:{e:"",n:"Torta",t:11,pr:14}};
let over=false,orders=[],ovens=[null,null],tray=[],served=0,lost=0,spawn=1,time=180,nid=0;
const hud=H.hud(root,[["pd","PEDIDOS","0/8"],["tp","TEMPO",180],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no pedido para <b>enfornar</b> (2 fornos). Tire no ponto — passou do tempo, <b>queima</b>! Clique no pedido pronto para entregar.");
const box=H.el("div","g-col",null,root);
const o1=H.el("div","g-col",null,box),o2=H.el("div","g-row",null,box);
let sc=0;
function paint(){
  hud.set("pd",served+"/8");
  o1.innerHTML="";
  orders.forEach(o=>{
    const b=H.el("button","g-chip",IT[o.k].n+" · "+Math.ceil(o.p)+"s",o1);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      const ti=tray.indexOf(o.k);
      if(ti>=0){
        tray.splice(ti,1);orders=orders.filter(q=>q.id!==o.id);
        served++;sc+=IT[o.k].pr*5;H.score(sc);H.sfx("ok");paint();
        if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Fornada perfeita!",sub:"8 pedidos quentinhos entregues."});}
        return;
      }
      const f=ovens.findIndex(q=>!q);
      if(f<0){H.sfx("bad");say("Fornos ocupados!");return;}
      ovens[f]={k:o.k,t:IT[o.k].t,over:4};H.sfx("tick");paint();
    });
  });
  if(!orders.length)H.el("div","g-chip","sem pedidos…",o1);
  o2.innerHTML="";
  ovens.forEach((ov,i)=>{
    const b=H.el("button","g-cell"+(ov&&ov.t<2?" bad":ov?" hot":""),null,o2);
    b.style.minWidth="110px";b.style.fontSize="14px";
    b.innerHTML=!ov?"forno "+(i+1)+"<br>vazio":IT[ov.k].n+"<br>"+(ov.t>0?Math.ceil(ov.t)+"s":"TIRE JÁ! "+ov.over.toFixed(0)+"s");
    b.addEventListener("click",()=>{
      if(over||!ov)return;
      if(ov.t>0){H.sfx("bad");say("Ainda está cru!");return;}
      tray.push(ov.k);ovens[i]=null;H.sfx("ok");say("Saiu do forno! Clique no pedido para entregar.");paint();
    });
  });
  H.el("div","g-chip","bandeja: "+(tray.map(k=>IT[k].n).join(", ")||"vazia"),box);
  box.lastChild&&(box.lastChild.style.marginTop="6px");
}
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Padaria fechou!",sub:"Só "+served+"/8 entregues."});}
  spawn-=dt;
  if(spawn<=0&&orders.length<3&&served+orders.length<10){
    spawn=6;
    const ks=Object.keys(IT);
    orders.push({id:nid++,k:ks[Math.floor(Math.random()*3)],p:34});
    paint();
  }
  ovens.forEach((ov,i)=>{
    if(!ov)return;
    if(ov.t>0)ov.t-=dt;
    else{
      ov.over-=dt;
      if(ov.over<=0){ovens[i]=null;H.sfx("bad");say("QUEIMOU! Fique de olho no forno.");paint();}
    }
  });
  for(let i=orders.length-1;i>=0;i--){
    orders[i].p-=dt;
    if(orders[i].p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Freguesia perdida!",sub:"3 pedidos cancelados. Enforne cedo!"});}
    }
  }
  if(Math.random()<dt*3)paint();
});
}});
