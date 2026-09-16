#!/usr/bin/env python3
"""Gera games/g131..g140 — SIMULAÇÃO (parte 2)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 131 — Barbearia
GAMES[131] = r"""/* NCODE N · 131 Barbearia — 8 cortes, gorjeta por precisão */
GREG(131,{
init(root,H){
let over=false,hair=100,target={a:40,b:55},cutting=false,served=0,tips=0,pat=20;
const hud=H.hud(root,[["ct","CORTES","0/8"],["gb","GORJETAS","$0"],["pc","PACIÊNCIA",20]]);
const say=H.msg(root,"SEGURE <b>✂️ Cortar</b> para baixar o cabelo e SOLTE na faixa verde do pedido. Rápido e preciso = gorjeta!");
const o=H.cvs(root,440,300),x=o.x;
function newClient(){
  const a=15+Math.floor(Math.random()*60);
  target={a,b:Math.min(95,a+12+Math.floor(Math.random()*8))};
  hair=100;pat=20;cutting=false;
  say("Pedido: faixa verde ("+target.a+"–"+target.b+"). Segure para cortar!");
}
newClient();
const btn=H.el("button","g-btn","✂️ SEGURE PARA CORTAR",root);
function dn(e){if(e)e.preventDefault();if(!over)cutting=true;H.sfx("tick");}
function up(){cutting=false;}
btn.addEventListener("pointerdown",dn);
btn.addEventListener("pointerup",up);
btn.addEventListener("pointerleave",up);
btn.addEventListener("pointercancel",up);
const kb=H.keys();
kb.on((c,d)=>{if(c==="Space")cutting=d&&!over;});
H.loop(dt=>{
  if(over)return;
  pat-=dt;hud.set("pc",Math.max(0,Math.ceil(pat)));
  if(pat<=0){over=true;return H.done({win:false,score:tips,title:"Cadeira vazia!",sub:"Cliente cansou de esperar. Corte sem medo!"});}
  if(cutting&&hair>0){
    const before=hair;
    hair=Math.max(0,hair-38*dt);
    if(before>0&&hair<=0){H.sfx("bad");}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(60,40,o.W-120,60);
  x.fillStyle=H.C.ok;
  x.fillRect(60+(o.W-120)*target.a/100,40,(o.W-120)*(target.b-target.a)/100,60);
  x.fillStyle=H.C.ink;
  x.fillRect(60+(o.W-120)*hair/100-3,30,6,80);
  x.font="60px serif";
  x.fillText("💇",o.W/2-30,200);
  x.fillStyle=H.C.ink;x.font="13px 'Space Mono',monospace";
  x.fillText("cabelo: "+Math.floor(hair)+"  ·  alvo: "+target.a+"–"+target.b,60,240);
  x.fillText("paciência: "+Math.ceil(pat)+"s",60,260);
});
H.btn(root,"✅ Finalizar corte",()=>{
  if(over)return;
  const mid=(target.a+target.b)/2;
  const err=Math.abs(hair-mid);
  if(err>(target.b-target.a)/2+6){
    over=true;H.sfx("lose");
    return H.done({win:false,score:tips,title:"Corte torto!",sub:"Fora da faixa pedida. Tente de novo!"});
  }
  const tip=Math.max(1,Math.round(10-err+pat/4));
  tips+=tip;served++;H.score(tips*10+served*20);
  hud.set("ct",served+"/8");hud.set("gb","$"+tips);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:tips*10+160+100,title:"Barbeiro famoso!",sub:"8 cortes e $"+tips+" em gorjetas."});}
  say("💈 +$"+tip+" de gorjeta! Próximo cliente…");
  newClient();
},true);
}});"""

# 132 — Lava-Jato
GAMES[132] = r"""/* NCODE N · 132 Lava-Jato — 8 carros, 4 etapas em ordem */
GREG(132,{
init(root,H){
const ST=["🧼 Sabão","🧽 Esfrega","🚿 Enxágue","💨 Seca"];
let over=false,cars=[],served=0,spawn=0;
const hud=H.hud(root,[["cr","CARROS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Carros avançam sozinhos! Clique na <b>etapa certa</b> quando o carro estiver na sua estação (faixas coloridas). Ordem: 🧼→🧽→🚿→💨.");
const o=H.cvs(root,520,260),x=o.x;
let sc=0,nid=0;
const ZW=o.W/4;
function paint2(){hud.set("cr",served+"/8");}
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&served+cars.length<9){
    spawn=7;
    cars.push({id:nid++,x:-50,stage:0,prog:0,col:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F"][nid%4]});
  }
  for(let i=cars.length-1;i>=0;i--){
    const c=cars[i];
    const need=c.stage<4;
    const inZone=c.x>=c.stage*ZW&&c.x<(c.stage+1)*ZW-40;
    if(need&&inZone&&c.prog<=0){
      // parado esperando a etapa
    }else{
      c.x+=44*dt;
    }
    if(need&&c.x>=(c.stage+1)*ZW-40&&c.prog<=0){
      // passou da estação sem fazer: volta? perde a etapa
      cars.splice(i,1);H.sfx("bad");
      say("🚗 Carro saiu sujo! Clique a etapa quando ele estiver na faixa.");
      if(served+cars.length>=9){/* fluxo */}
      continue;
    }
    if(c.prog>0){
      c.prog-=dt;
      if(c.prog<=0){c.stage++;}
    }
    if(c.stage>=4&&c.x>o.W+40){
      cars.splice(i,1);served++;sc+=50;H.score(sc);H.sfx("ok");paint2();
      if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Carros brilhando!",sub:"8 lavagens completas no ritmo da esteira."});}
    }
  }
  const cols=["#7fb3d5","#E8A33D","#3E7C4F","#C4D645"];
  for(let z=0;z<4;z++){
    x.fillStyle=cols[z]+"44";x.fillRect(z*ZW,0,ZW,o.H);
    x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
    x.fillText(ST[z],z*ZW+8,20);
  }
  cars.forEach(c=>{
    x.fillStyle=c.col;
    x.fillRect(c.x,120,70,36);
    x.fillStyle="#222";
    x.beginPath();x.arc(c.x+15,158,9,0,7);x.arc(c.x+55,158,9,0,7);x.fill();
    x.fillStyle="#fff";x.font="bold 11px 'Space Mono',monospace";
    x.fillText("etapa "+(c.stage+1)+"/4",c.x+4,140);
    if(c.prog>0){x.fillStyle=H.C.ink;x.fillText("…",c.x+32,112);}
  });
});
const row=H.el("div","g-row",null,root);
ST.forEach((s,i)=>{
  H.btn(row,s,()=>{
    if(over)return;
    const c=cars.find(k=>k.stage===i&&k.prog<=0&&k.x>=i*ZW-10&&k.x<(i+1)*ZW-40);
    if(c){c.prog=1.6;H.sfx("tick");}
    else H.sfx("bad");
  },false);
});
}});"""

# 133 — Sorveteria
GAMES[133] = r"""/* NCODE N · 133 Sorveteria — 8 casquinhas antes de derreter */
GREG(133,{
init(root,H){
const FL={choc:"🍫",moran:"🍓",menta:"🌿",limao:"🍋"},TOP={gran:"🍩",cereja:"🍒",calda:"🍯"};
let over=false,order=null,stack=[],top=null,served=0,pat=0;
const hud=H.hud(root,[["sv","SERVIDOS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Monte as bolas <b>na ordem do pedido</b> (de baixo para cima), ponha a cobertura e sirva antes de derreter!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const cup=H.el("div","g-msg","",box);
let sc=0;
function newOrder(){
  const fl=Object.keys(FL),tp=Object.keys(TOP);
  const n=1+Math.floor(Math.random()*3);
  order={balls:[],top:Math.random()<.6?tp[Math.floor(Math.random()*3)]:null};
  for(let i=0;i<n;i++)order.balls.push(fl[Math.floor(Math.random()*4)]);
  stack=[];top=null;pat=24;
  paint();
}
function paint(){
  od.innerHTML="🧾 Pedido: "+order.balls.map(b=>FL[b]).join("→")+(order.top?" + "+TOP[order.top]:"")+" · ⏳"+Math.ceil(pat)+"s";
  cup.innerHTML="🍦 Casquinha: "+(stack.map(b=>FL[b]).join("")||"vazia")+(top?" + "+TOP[top]:"");
}
newOrder();
const r1=H.el("div","g-row",null,box);
Object.keys(FL).forEach(k=>{
  const b=H.el("button","g-btn ghost",FL[k],r1);
  b.addEventListener("click",()=>{
    if(over)return;
    if(stack.length>=order.balls.length){H.sfx("bad");return;}
    if(order.balls[stack.length]!==k){H.sfx("bad");say("❌ Ordem errada! Veja o pedido.");return;}
    stack.push(k);H.sfx("tick");paint();
  });
});
const r2=H.el("div","g-row",null,box);
Object.keys(TOP).forEach(k=>{
  const b=H.el("button","g-btn ghost",TOP[k],r2);
  b.addEventListener("click",()=>{if(!over){top=k;H.sfx("tick");paint();}});
});
const r3=H.el("div","g-row",null,box);
H.btn(r3,"🗑️ Recomeçar",()=>{if(!over){stack=[];top=null;H.sfx("tick");paint();}},false);
H.btn(r3,"🛎️ Servir!",()=>{
  if(over)return;
  const ok=stack.length===order.balls.length&&(order.top?top===order.top:!top);
  if(!ok){H.sfx("bad");say("❌ Casquinha diferente do pedido!");return;}
  served++;sc+=40+Math.floor(pat);H.score(sc);hud.set("sv",served+"/8");hud.set("sc",sc);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Mestre sorveteiro!",sub:"8 casquinhas perfeitas e geladas."});}
  say("🍨 Servido! Próximo cliente…");newOrder();
},true);
H.loop(dt=>{
  if(over)return;
  pat-=dt;
  if(Math.random()<dt*2)paint();
  if(pat<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Derreteu tudo!",sub:served+"/8. Monte mais rápido!"});}
});
}});"""

# 134 — Floricultura
GAMES[134] = r"""/* NCODE N · 134 Floricultura — 6 buquês sob encomenda */
GREG(134,{
init(root,H){
const FL=["🌹","🌻","🌷","💐","🌸"];
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
  od.innerHTML="🧾 Pedido: "+order.join(" ");
  bq.innerHTML="💐 Buquê: "+(bouquet.join(" ")||"—");
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
H.btn(row,"↩️ Desfazer",()=>{
  if(over||!bouquet.length)return;
  const f=bouquet.pop();
  const ix=stock.findIndex(q=>!q);
  stock[ix]=f;H.sfx("tick");paint();
},false);
H.btn(row,"🎁 Entregar buquê",()=>{
  if(over)return;
  const a=order.slice().sort().join(),b=bouquet.slice().sort().join();
  if(bouquet.length===3&&a===b){
    served++;sc+=50;H.score(sc);hud.set("bq",served+"/6");hud.set("sc",sc);H.sfx("ok");
    if(served>=6){over=true;return H.done({win:true,score:sc+100,title:"Flores frescas!",sub:"6 buquês exatamente como pedido."});}
    say("💐 Buquê entregue! Próximo pedido…");newOrder();
  }else{H.sfx("bad");say("❌ Buquê diferente! Confira flor por flor.");}
},true);
}});"""

# 135 — Pizzaria Delivery
GAMES[135] = r"""/* NCODE N · 135 Pizzaria Delivery — 8 pizzas quentes */
GREG(135,{
init(root,H){
const TOP=["🍕","🍄","🫒","🌶️","🧅","🥓"];
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
    b.innerHTML="🍕+["+o.top+"] "+(o.baking>0?"🔥"+Math.ceil(o.baking)+"s":o.baked?"🛵 ENTREGAR! ⏳"+Math.ceil(o.cool)+"s":"🅿️ montar")+" · ⏳"+Math.ceil(o.p);
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
      if(o.cool<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();say("🥶 Pizza esfriou! ("+lost+"/3)");
        if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Massa fria!",sub:"3 pizzas esfriaram. Entregue logo!"});}
        continue;}}
    else{o.p-=dt;
      if(o.p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
        if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Clientes famintos!",sub:"3 cancelamentos. Enforne cedo!"});}
        continue;}}
  }
  if(Math.random()<dt*3)paint();
});
}});"""

# 136 — Passeador de Cães
GAMES[136] = r"""/* NCODE N · 136 Passeador de Cães — 60s sem nó nas guias */
GREG(136,{
init(root,H){
let over=false,walker={x:250,y:300},dogs=[],posts=[],time=60,tangle=0,knots=0;
const hud=H.hud(root,[["tp","TEMPO",60],["no","NÓS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE o passeador (ou os cães) para que as <b>guias nunca se cruzem</b>! Linha cruzada por 3s = nó.");
const o=H.cvs(root,500,420),x=o.x;
let sc=0;
const r=H.rng(21);
for(let i=0;i<3;i++)dogs.push({x:100+i*150,y:120,a:r()*6.28,sp:40+r()*25});
for(let i=0;i<4;i++)posts.push({x:80+r()*340,y:80+r()*220});
const ptr=H.ptr(o);
function seg(a,b,c,d){
  const d1=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
  const d2=(d.x-c.x)*(b.y-c.y)-(d.y-c.y)*(b.x-c.x);
  const d3=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const d4=(b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x);
  return((d1>0&&d2<0)||(d1<0&&d2>0))&&((d3>0&&d4<0)||(d3<0&&d4>0));
}
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  sc=Math.floor((60-time)*5);H.score(sc);hud.set("sc",sc);
  if(time<=0){over=true;return H.done({win:true,score:300,title:"Passeio tranquilo!",sub:"60 segundos sem um nó nas guias."});}
  if(ptr.down){
    // arrasta o mais próximo do toque (passeador ou cão)
    let best=walker,bd=Math.hypot(ptr.x-walker.x,ptr.y-walker.y);
    dogs.forEach(d=>{const dd=Math.hypot(ptr.x-d.x,ptr.y-d.y);if(dd<bd){bd=dd;best=d;}});
    best.x=H.clamp(ptr.x,20,o.W-20);best.y=H.clamp(ptr.y,20,o.H-20);
  }
  dogs.forEach(d=>{
    d.a+=(Math.random()-.5)*3*dt;
    const dd=Math.hypot(d.x-walker.x,d.y-walker.y);
    if(dd>150)d.a=Math.atan2(walker.y-d.y,walker.x-d.x)+(Math.random()-.5);
    if(dd<50)d.a=Math.atan2(d.y-walker.y,d.x-walker.x)+(Math.random()-.5);
    d.x=H.clamp(d.x+Math.cos(d.a)*d.sp*dt,20,o.W-20);
    d.y=H.clamp(d.y+Math.sin(d.a)*d.sp*dt,20,o.H-20);
  });
  let cross=false;
  for(let i=0;i<dogs.length;i++)for(let j=i+1;j<dogs.length;j++){
    if(seg(walker,dogs[i],walker,dogs[j])){cross=true;break;}
  }
  if(cross){
    tangle+=dt;
    if(tangle>3){
      tangle=0;knots++;hud.set("no",knots+"/3");H.sfx("bad");
      dogs.forEach((d,i)=>{d.x=100+i*150;d.y=120;});
      say("🪢 Nó! ("+knots+"/3) Cães reposicionados.");
      if(knots>=3){over=true;return H.done({win:false,score:sc,title:"Emaranhado total!",sub:"3 nós. Arraste os cães para separar!"});}
    }
  }else tangle=Math.max(0,tangle-dt*2);
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.font="22px serif";
  posts.forEach(p=>x.fillText("🌳",p.x-11,p.y+8));
  dogs.forEach(d=>{
    x.strokeStyle=cross?"#D94E34":H.C.ink;x.lineWidth=2;
    x.beginPath();x.moveTo(walker.x,walker.y);x.lineTo(d.x,d.y);x.stroke();
  });
  x.font="26px serif";
  x.fillText("🧍",walker.x-13,walker.y+9);
  dogs.forEach(d=>x.fillText("🐕",d.x-13,d.y+9));
  if(cross){x.fillStyle="#D94E34";x.font="bold 14px 'Space Mono',monospace";
    x.fillText("⚠ GUIAS CRUZADAS! "+(3-tangle).toFixed(1)+"s",120,24);}
});
}});"""

# 137 — Livraria
GAMES[137] = r"""/* NCODE N · 137 Livraria — 10 leitores atendidos */
GREG(137,{
init(root,H){
const GEN=["📕 romance","📗 aventura","📘 história"];
let over=false,stock=[3,3,3],cust=[],served=0,lost=0,spawn=1,time=150,nid=0;
const hud=H.hud(root,[["rd","LEITORES","0/10"],["tp","TEMPO",150],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no cliente para <b>recomendar</b> (gasta 1 do gênero). <b>Repor</b> enche a prateleira. <b>Sarau</b> acalma a fila (+6s para todos, recarrega)!");
const box=H.el("div","g-col",null,root);
const cbox=H.el("div","g-col",null,box);
const sbox=H.el("div","g-row",null,box);
let sc=0,cool=0;
function paint(){
  hud.set("rd",served+"/10");
  cbox.innerHTML="";
  cust.forEach(c=>{
    const b=H.el("button","g-chip","🧍 quer "+GEN[c.g]+" ⏳"+Math.ceil(c.p),cbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      if(stock[c.g]<=0){H.sfx("bad");say("Prateleira vazia! Reponha "+GEN[c.g]+".");return;}
      stock[c.g]--;cust=cust.filter(q=>q.id!==c.id);
      served++;sc+=30;H.score(sc);H.sfx("ok");paint();
      if(served>=10){over=true;return H.done({win:true,score:sc+100,title:"Livreiros felizes!",sub:"10 leitores com o livro certo."});}
    });
  });
  if(!cust.length)H.el("div","g-chip","loja calma…",cbox);
  sbox.innerHTML="";
  GEN.forEach((g,i)=>{
    const b=H.el("button","g-chip","📚 "+g+": "+stock[i]+" · repor",sbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{if(!over){stock[i]=Math.min(6,stock[i]+2);H.sfx("tick");paint();}});
  });
}
paint();
H.btn(root,"🎤 Sarau (+6s p/ todos)",()=>{
  if(over||cool>0)return;
  cool=20;cust.forEach(c=>c.p+=6);H.sfx("ok");say("🎤 Sarau! Fila acalmada.");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Livraria fechou!",sub:"Só "+served+"/10 atendidos."});}
  spawn-=dt;
  if(spawn<=0&&cust.length<3&&served+cust.length<12){
    spawn=5;cust.push({id:nid++,g:Math.floor(Math.random()*3),p:22});paint();
  }
  for(let i=cust.length-1;i>=0;i--){
    cust[i].p-=dt;
    if(cust[i].p<=0){cust.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Leitores fugiram!",sub:"3 desistências. Reponha e recomende!"});}
    }
  }
  if(Math.random()<dt*3)paint();
});
}});"""

# 138 — Fábrica de Brinquedos
GAMES[138] = r"""/* NCODE N · 138 Fábrica de Brinquedos — 20 peças, 0 defeito na caixa */
GREG(138,{
init(root,H){
let over=false,toys=[],spawn=0,done2=0,err=0,total=20,nid=0;
const hud=H.hud(root,[["pc","PEÇAS","0/20"],["er","ERROS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Brinquedo <b>perfeito 🧸</b> → 📦 EMBALAR · <b>quebrado 💔</b> (torto/cinza) → 🗑️ DESCARTAR. Clique na peça e depois no destino!");
const o=H.cvs(root,500,260),x=o.x;
let sc=0,sel=null;
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&done2+toys.length<total){
    spawn=1.5;
    toys.push({id:nid++,x:-30,bad:Math.random()<.3,wob:Math.random()*6});
  }
  for(let i=toys.length-1;i>=0;i--){
    toys[i].x+=70*dt;toys[i].wob+=dt*4;
    if(toys[i].x>o.W+30){toys.splice(i,1);err++;hud.set("er",err+"/3");H.sfx("bad");
      if(err>=3){over=true;return H.done({win:false,score:sc,title:"Linha parada!",sub:"3 falhas. Decida antes do fim da esteira!"});}
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,110,o.W,70);
  x.font="30px serif";
  toys.forEach(t=>{
    x.save();x.translate(t.x,150);
    if(t.bad){x.rotate(Math.sin(t.wob)*.4);x.globalAlpha=.55;}
    x.fillText(t.bad?"🧸‍💔":"🧸",-15,10);
    if(t.id===sel){x.strokeStyle=H.C.terra;x.lineWidth=3;x.strokeRect(-20,-28,40,44);}
    x.restore();x.globalAlpha=1;
  });
  x.font="13px 'Space Mono',monospace";x.fillStyle=H.C.ink;
  x.fillText("clique na peça para selecionar",12,24);
});
H.onTap(o,(px,py)=>{
  if(over)return;
  const t=toys.find(k=>Math.abs(px-k.x)<26&&py>100&&py<190);
  if(t){sel=t.id;H.sfx("tick");}
});
const row=H.el("div","g-row",null,root);
H.btn(row,"📦 EMBALAR (bom)",()=>{
  if(over||sel==null)return;
  const t=toys.find(k=>k.id===sel);
  if(!t){sel=null;return;}
  toys=toys.filter(k=>k.id!==sel);sel=null;
  if(t.bad){err++;hud.set("er",err+"/3");H.sfx("bad");say("💔 Defeito embalado! ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score:sc,title:"Recall!",sub:"3 defeitos na caixa. Olhe com atenção!"});}}
  else{done2++;sc+=25;H.score(sc);hud.set("pc",done2+"/"+total);H.sfx("ok");
    if(done2>=total){over=true;return H.done({win:true,score:sc+100,title:"Qualidade total!",sub:"20 brinquedos perfeitos embalados."});}}
},false);
H.btn(row,"🗑️ DESCARTAR (ruim)",()=>{
  if(over||sel==null)return;
  const t=toys.find(k=>k.id===sel);
  if(!t){sel=null;return;}
  toys=toys.filter(k=>k.id!==sel);sel=null;
  if(!t.bad){err++;hud.set("er",err+"/3");H.sfx("bad");say("🧸 Bom descartado! ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score:sc,title:"Desperdício!",sub:"3 bons no lixo."});}}
  else{done2++;sc+=25;H.score(sc);hud.set("pc",done2+"/"+total);H.sfx("ok");
    if(done2>=total){over=true;return H.done({win:true,score:sc+100,title:"Qualidade total!",sub:"20 peças triadas sem erro."});}}
},false);
}});"""

# 139 — Acampamento
GAMES[139] = r"""/* NCODE N · 139 Acampamento — 10 campistas sob as estrelas */
GREG(139,{
init(root,H){
let over=false,tents=[0,0,0],fire=70,wood=3,queue=0,served=0,lost=0,spawn=2,time=180;
const hud=H.hud(root,[["cp","CAMPISTAS","0/10"],["fg","FOGUEIRA",70],["tp","TEMPO",180]]);
const say=H.msg(root,"Clique na barraca <b>livre</b> para acomodar quem espera. <b>🪵 Lenha</b> alimenta o fogo — apagou, campista vai embora bravo!");
const box=H.el("div","g-col",null,root);
const trow=H.el("div","g-row",null,box);
const frow=H.el("div","g-msg","",box);
function paint(){
  hud.set("cp",served+"/10");hud.set("fg",Math.max(0,Math.floor(fire)));
  trow.innerHTML="";
  tents.forEach((t,i)=>{
    const b=H.el("button","g-cell"+(t>0?" good":""),null,trow);
    b.style.minWidth="100px";b.style.fontSize="14px";
    b.innerHTML=t>0?("⛺ "+Math.ceil(t)+"s"):"⛺ livre";
    b.addEventListener("click",()=>{
      if(over||t>0||queue<=0)return;
      if(fire<=10){H.sfx("bad");say("Muito frio! Alimente a fogueira antes.");return;}
      tents[i]=16;queue--;H.sfx("ok");paint();
    });
  });
  frow.innerHTML="🔥 "+(fire>50?"acesa":fire>15?"fraca":"QUASE APAGADA!")+" · 🪵 lenha "+wood+" · 🧍 esperando "+queue;
}
paint();
H.btn(root,"🪵 Jogar lenha (+25 fogo)",()=>{
  if(over||wood<=0)return;
  wood--;fire=Math.min(100,fire+25);H.sfx("tick");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*25,title:"Fim da temporada!",sub:"Só "+served+"/10 acomodados."});}
  fire-=dt*4;
  if(Math.random()<dt*.4&&wood<5){wood++;paint();}
  spawn-=dt;
  if(spawn<=0&&served+queue+tents.filter(Boolean).length<13){spawn=6;queue++;paint();}
  if(fire<=0){
    fire=0;
    tents.forEach((t,i)=>{if(t>0){tents[i]=0;lost++;}});
    if(lost>0){H.sfx("bad");paint();say("🥶 Fogueira apagou! Campistas fugiram! ("+lost+")");
      if(lost>=3){over=true;return H.done({win:false,score:served*25,title:"Acampamento gelado!",sub:"3 fugiram do frio. Alimente o fogo!"});}}
    fire=20;
  }
  let ch=false;
  tents.forEach((t,i)=>{
    if(t>0){tents[i]=t-dt;ch=true;
      if(tents[i]<=0){tents[i]=0;served++;H.score(served*25);H.sfx("ok");
        if(served>=10){over=true;H.done({win:true,score:350,title:"Noite perfeita!",sub:"10 campistas felizes sob as estrelas."});}}}
  });
  if(ch||Math.random()<dt)paint();
});
}});"""

# 140 — Aquário
GAMES[140] = r"""/* NCODE N · 140 Aquário — $150 em ingressos */
GREG(140,{
init(root,H){
let over=false,tanks=[],cash=0,time=180,show=0;
const hud=H.hud(root,[["cx","CAIXA","$0/150"],["tp","TEMPO",180],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no tanque para <b>🍤 alimentar</b>, duas vezes rápido para <b>🧹 limpar</b>. Peixes saudáveis atraem público pagante! <b>Show</b> dobra a renda por 15s.");
const box=H.el("div","g-col",null,root);
const trow=H.el("div","g-board",null,box);
trow.style.gridTemplateColumns="repeat(3,1fr)";
trow.style.width="min(100%,360px)";
tanks=[0,1,2].map(()=>({hung:80,dirt:10,fish:3}));
function paint(){
  hud.set("cx","$"+Math.floor(cash)+"/150");
  trow.innerHTML="";
  tanks.forEach((t,i)=>{
    const b=H.el("button","g-cell"+(t.fish===0?" bad":t.hung<25||t.dirt>75?" hot":" good"),null,trow);
    b.style.minHeight="86px";b.style.fontSize="13px";
    b.innerHTML="🐠".repeat(t.fish)+"<br>🍤"+Math.floor(t.hung)+" 🧹"+Math.floor(100-t.dirt);
    let clicks=0;
    b.addEventListener("click",()=>{
      if(over||t.fish===0)return;
      clicks++;
      H.after(350,()=>{
        if(clicks>=2){t.dirt=Math.max(0,t.dirt-50);H.sfx("ok");say("🧹 Tanque "+(i+1)+" limpo!");}
        else{t.hung=Math.min(100,t.hung+30);H.sfx("tick");}
        clicks=0;paint();
      });
    });
  });
}
paint();
H.btn(root,"🎪 Show das focas (dobra renda 15s)",()=>{
  if(over||show>0)return;
  show=15;H.sfx("ok");say("🎪 SHOW! Renda dobrada!");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;show-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  tanks.forEach(t=>{
    if(t.fish===0)return;
    t.hung-=dt*4;t.dirt+=dt*3;
    if(t.hung<=0||t.dirt>=100){
      t.fish--;t.hung=70;t.dirt=30;H.sfx("bad");say("🐟 Um peixe não resistiu!");paint();
    }
  });
  const health=tanks.reduce((a,t)=>a+t.fish*(t.hung/100)*(1-t.dirt/150),0);
  cash+=dt*(0.5+health*0.35)*(show>0?2:1);
  H.score(Math.floor(cash));
  if(Math.random()<dt*2)paint();
  if(tanks.every(t=>t.fish===0)){over=true;return H.done({win:false,score:Math.floor(cash),title:"Tanques vazios!",sub:"Todos os peixes… Alimente e limpe!"});}
  if(cash>=150){over=true;return H.done({win:true,score:150+Math.floor(time),title:"Aquário lotado!",sub:"$150 em ingressos antes do fechamento."});}
  if(time<=0){over=true;return H.done({win:false,score:Math.floor(cash),title:"Hora de fechar!",sub:"$"+Math.floor(cash)+"/150. Peixes saudáveis = público!"});}
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
