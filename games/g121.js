/* NCODE N · 121 Cafeteria — 10 pedidos, estoque contado */
GREG(121,{
init(root,H){
const DR={cafe:{e:"☕",n:"Café",t:2,need:["bean","cup"],pr:5},latte:{e:"🥛",n:"Latte",t:3,need:["bean","milk","cup"],pr:8},choc:{e:"🍫",n:"Mocha",t:4,need:["bean","milk","cup","choc"],pr:11}};
let over=false,orders=[],stock={bean:6,milk:4,cup:8,choc:3},cash=10,served=0,lost=0,spawn=1,time=150,nid=0;
const hud=H.hud(root,[["sv","SERVIDOS","0/10"],["cx","CAIXA","$10"],["tp","TEMPO",150]]);
const say=H.msg(root,"Clique no pedido para <b>preparar</b> (gasta estoque), clique de novo para <b>servir</b>. Compre estoque com o caixa!");
const box=H.el("div","g-col",null,root);
const orow=H.el("div","g-col",null,box);
const srow=H.el("div","g-row",null,box);
const SNM={bean:"🫘 grão $2",milk:"🥛 leite $2",cup:"🥤 copo $1",choc:"🍫 choc $3"};
function paint(){
  hud.set("sv",served+"/10");hud.set("cx","$"+cash);
  orow.innerHTML="";
  orders.forEach(o2=>{
    const d=H.el("button","g-chip"+(o2.ready?" good":"")+(o2.brew>0?" hot":""),null,orow);
    d.style.cursor="pointer";
    d.innerHTML=DR[o2.k].e+" "+DR[o2.k].n+(o2.brew>0?" ⏳"+Math.ceil(o2.brew)+"s":o2.ready?" ✅ SERVIR!":" 🅿️ preparar")+" · ⏳"+Math.ceil(o2.p);
    d.addEventListener("click",()=>act(o2.id));
  });
  if(!orders.length)H.el("div","g-chip","balcão livre…",orow);
  srow.innerHTML="";
  Object.keys(SNM).forEach(k=>{
    const b=H.el("button","g-chip","+"+SNM[k]+" ("+stock[k]+")",srow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      const pr={bean:2,milk:2,cup:1,choc:3}[k];
      if(cash<pr){H.sfx("bad");return;}
      cash-=pr;stock[k]++;H.sfx("tick");paint();
    });
  });
}
function act(id){
  if(over)return;
  const o2=orders.find(o3=>o3.id===id);
  if(!o2)return;
  if(o2.ready){
    orders=orders.filter(o3=>o3.id!==id);
    cash+=DR[o2.k].pr;served++;H.score(served*30);H.sfx("ok");paint();
    if(served>=10){over=true;return H.done({win:true,score:300+cash*2,title:"Barista estrela!",sub:"10 bebidas servidas com lucro de $"+cash+"."});}
    return;
  }
  if(o2.brew>0)return;
  for(const k of DR[o2.k].need)if(stock[k]<=0){H.sfx("bad");say("Falta "+SNM[k].split(" ")[1]+"! Compre no estoque.");return;}
  DR[o2.k].need.forEach(k=>stock[k]--);
  o2.brew=DR[o2.k].t;H.sfx("tick");paint();
}
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*30,title:"Café fechado!",sub:"Só "+served+"/10 servidos. Gerencie o estoque!"});}
  spawn-=dt;
  if(spawn<=0&&orders.length<3&&served+orders.length<12){
    spawn=5;
    const ks=Object.keys(DR);
    orders.push({id:nid++,k:ks[Math.floor(Math.random()*3)],p:26,brew:0,ready:false});
    paint();
  }
  for(let i=orders.length-1;i>=0;i--){
    const o2=orders[i];
    if(o2.brew>0){o2.brew-=dt;if(o2.brew<=0){o2.ready=true;H.sfx("ok");}}
    o2.p-=dt;
    if(o2.p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:served*30,title:"Clientes irritados!",sub:"3 desistências. Sirva mais rápido!"});}
    }
  }
  if(Math.random()<dt*3)paint();
});
}});
