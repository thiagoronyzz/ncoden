#!/usr/bin/env python3
"""Gera games/g121..g130 — SIMULAÇÃO (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 121 — Cafeteria
GAMES[121] = r"""/* NCODE N · 121 Cafeteria — 10 pedidos, estoque contado */
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
}});"""

# 122 — Barraca de Limonada
GAMES[122] = r"""/* NCODE N · 122 Barraca de Limonada — 7 dias até $60 */
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
}});"""

# 123 — Hotel de Pets
GAMES[123] = r"""/* NCODE N · 123 Hotel de Pets — 15 vontades atendidas */
GREG(123,{
init(root,H){
const PETS=["🐶","🐱","🐰","🦜"],NEED={eat:"🍖",walk:"🦮",play:"🧸"};
let over=false,pets=[],served=0,lost=0,spawn=1,time=150;
const hud=H.hud(root,[["at","ATENDIDOS","0/15"],["er","IGNORADOS","0/4"],["tp","TEMPO",150]]);
const say=H.msg(root,"Clique no pet e depois na <b>ação pedida</b> (🍖🦮🧸). Vontade vencida = pet triste!");
const prow=H.el("div","g-board",null,root);
prow.style.gridTemplateColumns="repeat(2,1fr)";
prow.style.width="min(100%,320px)";
const arow=H.el("div","g-row",null,root);
let sel=-1;
pets=PETS.map(e=>({e,need:null,t:0}));
function paint(){
  hud.set("at",served+"/15");
  prow.innerHTML="";
  pets.forEach((p,i)=>{
    const b=H.el("button","g-cell"+(sel===i?" sel":""),null,prow);
    b.style.minHeight="78px";b.style.fontSize="15px";
    b.innerHTML=p.e+"<br>"+(p.need?NEED[p.need]+" "+Math.ceil(p.t)+"s":"😌 ok");
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");paint();});
  });
}
paint();
Object.keys(NEED).forEach(k=>{
  H.btn(arow,NEED[k]+" "+(k==="eat"?"Alimentar":k==="walk"?"Passear":"Brincar"),()=>{
    if(over||sel<0)return;
    const p=pets[sel];
    if(p.need===k){
      p.need=null;served++;H.score(served*20);H.sfx("ok");paint();
      if(served>=15){over=true;return H.done({win:true,score:300,title:"Pets felizes!",sub:"15 vontades atendidas na hora."});}
    }else H.sfx("bad");
  },false);
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*20,title:"Check-out!",sub:"Só "+served+"/15 atendidos. Fique de olho!"});}
  spawn-=dt;
  if(spawn<=0){
    spawn=3.5;
    const free=pets.filter(p=>!p.need);
    if(free.length){
      const p=free[Math.floor(Math.random()*free.length)];
      p.need=Object.keys(NEED)[Math.floor(Math.random()*3)];p.t=12;
      paint();
    }
  }
  let ch=false;
  pets.forEach(p=>{
    if(p.need){p.t-=dt;ch=true;
      if(p.t<=0){p.need=null;lost++;hud.set("er",lost+"/4");H.sfx("bad");paint();
        if(lost>=4){over=true;H.done({win:false,score:served*20,title:"Au-au de protesto!",sub:"4 vontades ignoradas. Priorize o timer curto!"});}}}
  });
  if(ch&&Math.random()<dt*3)paint();
});
}});"""

# 124 — Padaria
GAMES[124] = r"""/* NCODE N · 124 Padaria — 8 pedidos sem queimar */
GREG(124,{
init(root,H){
const IT={pao:{e:"🥖",n:"Pão",t:5,pr:6},bolo:{e:"🍰",n:"Bolo",t:8,pr:10},torta:{e:"🥧",n:"Torta",t:11,pr:14}};
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
    const b=H.el("button","g-chip",IT[o.k].e+" "+IT[o.k].n+" ⏳"+Math.ceil(o.p),o1);
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
    b.innerHTML=!ov?"🔥 forno "+(i+1)+"<br>vazio":IT[ov.k].e+"<br>"+(ov.t>0?Math.ceil(ov.t)+"s":"TIRE JÁ! "+ov.over.toFixed(0)+"s");
    b.addEventListener("click",()=>{
      if(over||!ov)return;
      if(ov.t>0){H.sfx("bad");say("Ainda está cru!");return;}
      tray.push(ov.k);ovens[i]=null;H.sfx("ok");say("🍞 Saiu do forno! Clique no pedido para entregar.");paint();
    });
  });
  H.el("div","g-chip","🍽️ bandeja: "+(tray.map(k=>IT[k].e).join(" ")||"vazia"),box);
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
      if(ov.over<=0){ovens[i]=null;H.sfx("bad");say("🔥 QUEIMOU! Fique de olho no forno.");paint();}
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
}});"""

# 125 — Taxista
GAMES[125] = r"""/* NCODE N · 125 Taxista — $80 antes do taxímetro estourar */
GREG(125,{
init(root,H){
const N=7;
let over=false,taxi={r:6,c:0},cash=0,pax=null,dest=null,meter=0,limit=0,riding=false,time=150;
const hud=H.hud(root,[["cx","CAIXA","$0/80"],["tx","TAXÍMETRO","—"],["tp","TEMPO",150]]);
const say=H.msg(root,"Setas/WASD ou vizinho. Com passageiro, o <b>taxímetro sobe a cada quadra</b> — entregue antes do limite dele!");
const o=H.cvs(root,420,420),x=o.x;
function freeCell(){return{r:Math.floor(Math.random()*N),c:Math.floor(Math.random()*N)};}
function newPax(){
  pax=freeCell();dest=freeCell();riding=false;meter=0;
  limit=Math.abs(pax.r-dest.r)+Math.abs(pax.c-dest.c)+6;
  hud.set("tx","limite $"+limit);
  say("🧍 em ("+(pax.r+1)+","+(pax.c+1)+") → 🏁 ("+(dest.r+1)+","+(dest.c+1)+") · limite $"+limit);
}
newPax();
function move(dr,dc){
  if(over)return;
  const nr=taxi.r+dr,nc=taxi.c+dc;
  if(nr<0||nr>=N||nc<0||nc>=N)return;
  taxi={r:nr,c:nc};H.sfx("tick");
  if(riding){meter+=2;hud.set("tx","$"+meter+"/"+limit);
    if(meter>limit){over=true;H.sfx("lose");
      return H.done({win:false,score:cash,title:"Taxímetro estourou!",sub:"$"+cash+". Pegue o caminho mais curto!"});}}
  if(!riding&&taxi.r===pax.r&&taxi.c===pax.c){riding=true;H.sfx("ok");say("🧍 A bordo! Corra ao 🏁 — cada quadra = $2!");}
  else if(riding&&taxi.r===dest.r&&taxi.c===dest.c){
    const fare=10+Math.floor(meter/2)+Math.max(0,limit-meter);
    cash+=fare;H.score(cash);hud.set("cx","$"+cash+"/80");H.sfx("ok");
    if(cash>=80){over=true;return H.done({win:true,score:cash,title:"Rei das ruas!",sub:"$"+cash+" sem estourar nenhum taxímetro."});}
    newPax();
  }
}
const kb=H.keys();
kb.on((c,d)=>{
  if(!d)return;
  if(c==="ArrowUp"||c==="KeyW")move(-1,0);
  else if(c==="ArrowDown"||c==="KeyS")move(1,0);
  else if(c==="ArrowLeft"||c==="KeyA")move(0,-1);
  else if(c==="ArrowRight"||c==="KeyD")move(0,1);
});
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
H.onTap(o,(px,py)=>{
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  if(Math.abs(r-taxi.r)+Math.abs(c-taxi.c)===1)move(r-taxi.r,c-taxi.c);
});
H.loop(dt=>{
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0&&!over){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+"/80."});}
  const ss=s();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.fillStyle=(r+c)%2?H.C.card:H.C.paper;
    x.fillRect(c*ss,r*ss,ss,ss);
    x.strokeStyle=H.C.cement;x.strokeRect(c*ss,r*ss,ss,ss);
  }
  x.font=Math.floor(ss*.62)+"px serif";
  if(!riding&&pax)x.fillText("🧍",pax.c*ss+6,pax.r*ss+ss-6);
  if(dest)x.fillText("🏁",dest.c*ss+6,dest.r*ss+ss-6);
  x.fillText("🚕",taxi.c*ss+6,taxi.r*ss+ss-6);
});
}});"""

# 126 — Gerente de Hotel
GAMES[126] = r"""/* NCODE N · 126 Gerente de Hotel — 8 hóspedes, reclamação zero */
GREG(126,{
init(root,H){
let over=false,rooms=[],guest=null,done2=0,angry=0,spawn=1;
const hud=H.hud(root,[["hs","HÓSPEDES","0/8"],["rc","RECLAMAÇÕES","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Hóspede na recepção? Clique num quarto <b>livre</b>. Quarto com ❗? Clique para <b>resolver</b> antes que vire 1 estrela!");
const box=H.el("div","g-col",null,root);
const grow=H.el("div","g-row",null,box);
const rrow=H.el("div","g-board",null,box);
rrow.style.gridTemplateColumns="repeat(3,1fr)";
rrow.style.width="min(100%,320px)";
let sc=0;
rooms=new Array(6).fill(0).map(()=>({busy:0,comp:0}));
function paint(){
  grow.innerHTML="";rrow.innerHTML="";
  if(guest)H.el("div","g-chip hot","🧳 hóspede esperando ⏳"+Math.ceil(guest.p),grow);
  else H.el("div","g-chip","recepção livre…",grow);
  rooms.forEach((r,i)=>{
    const b=H.el("button","g-cell"+(r.comp>0?" bad":r.busy>0?" good":""),null,rrow);
    b.style.minHeight="62px";b.style.fontSize="13px";
    b.innerHTML=r.comp>0?("❗ "+Math.ceil(r.comp)+"s<br>RESOLVER!"):r.busy>0?("🛏️ "+Math.ceil(r.busy)+"s"):"🚪 livre";
    b.addEventListener("click",()=>click(i));
  });
}
function click(i){
  if(over)return;
  const r=rooms[i];
  if(r.comp>0){r.comp=0;sc+=15;H.score(sc);hud.set("sc",sc);H.sfx("ok");paint();say("✅ Reclamação resolvida! +15");return;}
  if(r.busy<=0&&guest){
    r.busy=14;r.comp=0;
    H.after(5000+Math.random()*5000,()=>{if(!over&&r.busy>0&&r.comp<=0){r.comp=8;paint();say("❗ Reclamação no quarto "+(i+1)+"!");}});
    guest=null;done2++;sc+=40;H.score(sc);
    hud.set("hs",done2+"/8");hud.set("sc",sc);H.sfx("ok");paint();
    if(done2>=8){over=true;return H.done({win:true,score:sc+100,title:"Gerente 5 estrelas!",sub:"8 check-ins com reclamações sob controle."});}
  }
}
paint();
H.loop(dt=>{
  if(over)return;
  if(!guest&&done2<8){spawn-=dt;if(spawn<=0){spawn=3;guest={p:16};paint();}}
  if(guest){guest.p-=dt;
    if(guest.p<=0){guest=null;angry++;hud.set("rc",angry+"/3");H.sfx("bad");paint();
      say("🚶 Hóspede foi para a concorrência! ("+angry+"/3)");
      if(angry>=3){over=true;return H.done({win:false,score:sc,title:"Hotel vazio!",sub:"3 hóspedes perdidos. Libere quartos!"});}}}
  rooms.forEach(r=>{
    if(r.busy>0){r.busy-=dt;if(r.busy<=0){r.comp=0;paint();}}
    if(r.comp>0){r.comp-=dt;
      if(r.comp<=0){r.comp=0;r.busy=0;angry++;hud.set("rc",angry+"/3");H.sfx("bad");paint();
        say("⭐ 1 estrela no site! ("+angry+"/3)");
        if(angry>=3){over=true;return H.done({win:false,score:sc,title:"Fama arruinada!",sub:"3 reclamações ignoradas."});}}}
  });
  if(Math.random()<dt*2)paint();
});
}});"""

# 127 — Dia na Fazenda
GAMES[127] = r"""/* NCODE N · 127 Dia na Fazenda — $100 em 5 dias */
GREG(127,{
init(root,H){
const CROP={nabo:{e:"🌱",f:"🥕",n:"Nabo",cost:3,t:2,pr:8},abob:{e:"🌱",f:"🎃",n:"Abóbora",cost:8,t:4,pr:25}};
let over=false,day=1,cash=20,plots=[],plant="nabo";
const hud=H.hud(root,[["dd","DIA","1/5"],["cx","CAIXA","$20"],["mt","META","$100"]]);
const say=H.msg(root,"Clique no canteiro vazio para <b>plantar</b>, no seco 💧 para <b>regar</b>, no maduro para <b>colher e vender</b>!");
const box=H.el("div","g-col",null,root);
const prow=H.el("div","g-board",null,box);
prow.style.gridTemplateColumns="repeat(3,1fr)";
prow.style.width="min(100%,300px)";
plots=new Array(6).fill(0).map(()=>null);
function paint(){
  hud.set("dd",day+"/5");hud.set("cx","$"+cash);
  prow.innerHTML="";
  plots.forEach((p,i)=>{
    const b=H.el("button","g-cell"+(p&&p.g>=CROP[p.k].t?" good":""),null,prow);
    b.style.minHeight="70px";b.style.fontSize="14px";
    if(!p)b.innerHTML="🟫<br>plantar";
    else if(p.g>=CROP[p.k].t)b.innerHTML=CROP[p.k].f+"<br>COLHER!";
    else b.innerHTML=CROP[p.k].e+" "+p.g+"/"+CROP[p.k].t+(p.w?"":"<br>💧 seco");
    b.addEventListener("click",()=>act(i));
  });
}
function act(i){
  if(over)return;
  const p=plots[i];
  if(!p){
    if(cash<CROP[plant].cost){H.sfx("bad");return;}
    cash-=CROP[plant].cost;plots[i]={k:plant,g:0,w:false};H.sfx("tick");paint();return;
  }
  if(p.g>=CROP[p.k].t){cash+=CROP[p.k].pr;plots[i]=null;H.score(cash);H.sfx("ok");paint();return;}
  if(!p.w){p.w=true;H.sfx("tick");paint();}
  else H.sfx("bad");
}
paint();
const row=H.el("div","g-row",null,root);
Object.keys(CROP).forEach(k=>{
  H.btn(row,CROP[k].f+" "+CROP[k].n+" $"+CROP[k].cost+" ("+CROP[k].t+"d → $"+CROP[k].pr+")",()=>{plant=k;H.sfx("tick");say("Plantando "+CROP[k].n+".");},k===plant);
});
H.btn(root,"🌙 Encerrar o dia",()=>{
  if(over)return;
  plots.forEach(p=>{if(p&&p.w&&p.g<CROP[p.k].t)p.g++;if(p)p.w=false;});
  day++;
  if(day>5){
    over=true;H.score(cash);
    plots.forEach(p=>{if(p&&p.g>=CROP[p.k].t)cash+=CROP[p.k].pr;});
    if(cash>=100)return H.done({win:true,score:cash,title:"Fazenda próspera!",sub:"$"+cash+" em 5 dias."});
    return H.done({win:false,score:cash,title:"Colheita fraca…",sub:"$"+cash+" (meta $100). Abóbora vale mais!"});
  }
  say("☀️ Dia "+day+": regue tudo de novo!");
  paint();
},true);
}});"""

# 128 — Barco de Pesca
GAMES[128] = r"""/* NCODE N · 128 Barco de Pesca — $120 no cais */
GREG(128,{
init(root,H){
const FISH=[{e:"🐟",v:8},{e:"🐠",v:15},{e:"🦑",v:25}];
let over=false,bx=250,dir=0,fish=[],hold=[],cool=0,time=150,net=null;
const hud=H.hud(root,[["cx","CAIXA","$0/120"],["po","PORÃO","0/10"],["tp","TEMPO",150]]);
const say=H.msg(root,"<b>←/→ ou A/D</b> (ou toque nas laterais) para navegar. <b>Rede</b> pesca em volta! Venda no cais 🏭 (esquerda).");
const o=H.cvs(root,500,360),x=o.x;
let cash=0;
const r=H.rng(4);
for(let i=0;i<10;i++)fish.push({x:r()*500,y:150+r()*180,v:20+r()*30,k:Math.floor(r()*3),d:r()<.5?1:-1});
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowLeft"||c==="KeyA")dir=d?-1:(dir===-1?0:dir);
  if(c==="ArrowRight"||c==="KeyD")dir=d?1:(dir===1?0:dir);
});
H.onTap(o,(px,py)=>{dir=px<o.W/2?-1:1;H.after(400,()=>dir=0);});
H.btn(root,"🎣 Lançar rede (3s)",()=>{
  if(over||cool>0||hold.length>=10)return;
  cool=3;net={x:bx,t:.5};H.sfx("tick");
  fish.forEach(f=>{
    if(hold.length>=10)return;
    if(Math.hypot(f.x-bx,f.y-200)<90&&Math.random()<.7){
      hold.push(f.k);f.x=Math.random()*500;f.y=150+Math.random()*180;
      H.sfx("pop");
    }
  });
  hud.set("po",hold.length+"/10");
},false);
H.btn(root,"🏭 Vender no cais",()=>{
  if(over||!hold.length)return;
  if(bx>90){H.sfx("bad");say("Navegue até o cais (esquerda)!");return;}
  hold.forEach(k=>cash+=FISH[k].v);
  hold=[];H.score(cash);hud.set("cx","$"+cash+"/120");hud.set("po","0/10");H.sfx("ok");
  if(cash>=120){over=true;return H.done({win:true,score:cash,title:"Pescador lendário!",sub:"$"+cash+" de peixe vendido no cais."});}
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Maré baixa!",sub:"$"+cash+"/120. Lulas 🦑 valem $25!"});}
  bx=H.clamp(bx+dir*140*dt,30,o.W-30);
  fish.forEach(f=>{
    f.x+=f.v*f.d*dt;
    if(f.x<10){f.x=10;f.d=1;}if(f.x>o.W-10){f.x=o.W-10;f.d=-1;}
  });
  if(net){net.t-=dt;if(net.t<=0)net=null;}
  x.fillStyle="#7fb3d5";x.fillRect(0,0,o.W,120);
  x.fillStyle="#123a4d";x.fillRect(0,120,o.W,o.H-120);
  x.fillStyle="#5b3d20";x.fillRect(0,100,70,20);
  x.font="26px serif";x.fillText("🏭",8,96);
  x.font="20px serif";
  fish.forEach(f=>x.fillText(FISH[f.k].e,f.x-10,f.y+8));
  x.font="34px serif";x.fillText("🚤",bx-17,112);
  if(net){
    x.strokeStyle="#fff";x.lineWidth=2;
    x.beginPath();x.arc(net.x,200,90*(1-net.t),0,7);x.stroke();
  }
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("porão: "+hold.map(k=>FISH[k].e).join(""),12,o.H-10);
});
}});"""

# 129 — Food Truck
GAMES[129] = r"""/* NCODE N · 129 Food Truck — 20 marmitas no almoço */
GREG(129,{
init(root,H){
const SPOTS=[{n:"🏢 Centro",x:90,crowd:0},{n:"🏫 Escola",x:250,crowd:0},{n:"🏟️ Estádio",x:410,crowd:0}];
let over=false,at=0,cook=0,ready=4,served=0,time=150,drive=0;
const hud=H.hud(root,[["sv","SERVIDOS","0/20"],["mm","MARMITAS",4],["tp","TEMPO",150]]);
const say=H.msg(root,"Dirija-se à <b>multidão</b>, frite marmitas (4 por vez) e sirva! A fome muda de lugar…");
const o=H.cvs(root,500,260),x=o.x;
H.onTap(o,(px,py)=>{
  if(over||drive>0)return;
  let bi=0,bd=1e9;
  SPOTS.forEach((s,i)=>{const d=Math.abs(px-s.x);if(d<bd){bd=d;bi=i;}});
  if(bi!==at){drive=2.5;at=bi;H.sfx("tick");say("🚚 A caminho do "+SPOTS[bi].n+"…");}
});
H.btn(root,"🍔 Fritar 4 marmitas (6s)",()=>{
  if(over||cook>0||ready>=8)return;
  cook=6;H.sfx("tick");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*10,title:"Almoço acabou!",sub:served+"/20 servidos. Frite sem parar!"});}
  if(drive>0)drive-=dt;
  if(cook>0){cook-=dt;if(cook<=0){ready=Math.min(12,ready+4);hud.set("mm",ready);H.sfx("ok");}}
  SPOTS.forEach((s,i)=>{
    s.crowd=Math.max(0,s.crowd-dt*.15);
    if(Math.random()<dt*.5)s.crowd=Math.min(8,s.crowd+1);
  });
  const s=SPOTS[at];
  if(drive<=0&&s.crowd>=1&&ready>0){
    s.serve=(s.serve||0)+dt;
    if(s.serve>1.2){s.serve=0;s.crowd--;ready--;served++;
      hud.set("sv",served+"/20");hud.set("mm",ready);H.score(served*10);H.sfx("pop");
      if(served>=20){over=true;return H.done({win:true,score:250,title:"Truck famoso!",sub:"20 marmitas no horário do almoço."});}}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#4A4A44";x.fillRect(0,190,o.W,70);
  SPOTS.forEach(sp=>{
    x.font="22px serif";x.fillText(sp.n.split(" ")[0],sp.x-12,60);
    x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
    x.fillText(sp.n.split(" ")[1],sp.x-22,78);
    x.font="16px serif";
    for(let i=0;i<Math.floor(sp.crowd);i++)x.fillText("🧍",sp.x-30+(i%4)*16,120+Math.floor(i/4)*20);
  });
  x.font="40px serif";
  x.fillText("🚚",SPOTS[at].x-20,225);
  if(drive>0){x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";x.fillText("dirigindo…",SPOTS[at].x-32,190);}
  if(cook>0){x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";x.fillText("🍔 "+Math.ceil(cook)+"s",10,20);}
});
}});"""

# 130 — Lavanderia
GAMES[130] = r"""/* NCODE N · 130 Lavanderia — 10 peças no prazo */
GREG(130,{
init(root,H){
let over=false,items=[],wash=[null,null],dry=[null],served=0,lost=0,spawn=1,time=180,nid=0;
const hud=H.hud(root,[["pv","DEVOLVIDAS","0/10"],["tp","TEMPO",180],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na peça suja para <b>lavar</b> → clique na lavadora pronta para <b>secar</b> → clique na secadora pronta para <b>dobrar e devolver</b>! Peça esquecida mofa e volta à estaca zero.");
const box=H.el("div","g-col",null,root);
let sc=0;
function paint(){
  hud.set("pv",served+"/10");
  box.innerHTML="";
  H.el("div","g-msg","🧺 Cesto: "+items.length+" peça(s) suja(s)",box);
  const r1=H.el("div","g-row",null,box);
  items.forEach(it=>{
    const b=H.el("button","g-chip","👕 "+Math.ceil(it.p)+"s",r1);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      const f=wash.findIndex(q=>!q);
      if(f<0){H.sfx("bad");say("Lavadoras ocupadas!");return;}
      items=items.filter(q=>q.id!==it.id);
      wash[f]={t:5,over:8};H.sfx("tick");paint();
    });
  });
  const r2=H.el("div","g-row",null,box);
  wash.forEach((w,i)=>{
    const b=H.el("button","g-cell"+(w&&w.t<=0?" good":w?" hot":""),null,r2);
    b.style.minWidth="120px";b.style.fontSize="13px";
    b.innerHTML=!w?"🌀 lav "+(i+1)+"<br>livre":w.t>0?"🌀 lavando<br>"+Math.ceil(w.t)+"s":"✅ PRONTA!<br>"+Math.ceil(w.over)+"s";
    b.addEventListener("click",()=>{
      if(over||!w||w.t>0)return;
      if(dry[0]){H.sfx("bad");say("Secadora ocupada!");return;}
      dry[0]={t:4,over:8};wash[i]=null;H.sfx("tick");paint();
    });
  });
  const r3=H.el("div","g-row",null,box);
  const d=dry[0];
  const bd=H.el("button","g-cell"+(d&&d.t<=0?" good":d?" hot":""),null,r3);
  bd.style.minWidth="140px";bd.style.fontSize="13px";
  bd.innerHTML=!d?"💨 secadora<br>livre":d.t>0?"💨 secando<br>"+Math.ceil(d.t)+"s":"✅ DOBRAR!<br>"+Math.ceil(d.over)+"s";
  bd.addEventListener("click",()=>{
    if(over||!d||d.t>0)return;
    dry[0]=null;served++;sc+=30;H.score(sc);H.sfx("ok");paint();
    if(served>=10){over=true;return H.done({win:true,score:sc+100,title:"Roupa cheirosa!",sub:"10 peças lavadas, secas e dobradas."});}
  });
}
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Expediente acabou!",sub:"Só "+served+"/10 devolvidas."});}
  spawn-=dt;
  if(spawn<=0&&served+items.length+wash.filter(Boolean).length+(dry[0]?1:0)<12){
    spawn=7;items.push({id:nid++,p:40});paint();
  }
  wash.forEach((w,i)=>{
    if(!w)return;
    if(w.t>0)w.t-=dt;
    else{w.over-=dt;if(w.over<=0){wash[i]=null;items.push({id:nid++,p:30});H.sfx("bad");say("🤢 Peça mofou na lavadora! Relave.");paint();}}
  });
  if(dry[0]){
    if(dry[0].t>0)dry[0].t-=dt;
    else{dry[0].over-=dt;
      if(dry[0].over<=0){dry[0]=null;items.push({id:nid++,p:30});H.sfx("bad");say("🤢 Peça mofou na secadora! Relave.");paint();}}
  }
  for(let i=items.length-1;i>=0;i--){
    items[i].p-=dt;
    if(items[i].p<=0){items.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Freguesia perdida!",sub:"3 clientes levaram a roupa suja embora."});}}
  }
  if(Math.random()<dt*3)paint();
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
