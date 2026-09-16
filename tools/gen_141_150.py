#!/usr/bin/env python3
"""Gera games/g141..g150 — SIMULAÇÃO (parte 3)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 141 — Cinema
GAMES[141] = r"""/* NCODE N · 141 Cinema — $120 em ingressos e pipoca */
GREG(141,{
init(root,H){
let over=false,rooms=[],queue=[],cash=0,pop=6,time=180,nid=0,spawn=1;
const hud=H.hud(root,[["cx","CAIXA","$0/120"],["pp","PIPOCA",6],["tp","TEMPO",180]]);
const say=H.msg(root,"Clique no cliente para <b>acomodar</b> na sala do filme dele (se houver lugar). <b>🍿 Estourar</b> repõe pipoca — cada espectador compra uma!");
const box=H.el("div","g-col",null,root);
const qbox=H.el("div","g-col",null,box);
const rbox=H.el("div","g-row",null,box);
rooms=[{mv:"🚀 Espacial",cap:6,in:[],t:30},{mv:"😂 Comédia",cap:4,in:[],t:24}];
function paint(){
  hud.set("cx","$"+cash+"/120");hud.set("pp",pop);
  qbox.innerHTML="";
  queue.forEach(c=>{
    const b=H.el("button","g-chip","🧍 "+rooms[c.m].mv+" ⏳"+Math.ceil(c.p),qbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      const r=rooms[c.m];
      if(r.in.length>=r.cap){H.sfx("bad");say("Sala lotada! Espere a sessão acabar.");return;}
      queue=queue.filter(q=>q.id!==c.id);
      r.in.push(1);cash+=8;
      if(pop>0){pop--;cash+=4;}
      H.score(cash);H.sfx("ok");paint();
      if(cash>=120){over=true;return H.done({win:true,score:cash+Math.floor(time),title:"Sessão esgotada!",sub:"$"+cash+" de bilheteria e bombonière."});}
    });
  });
  if(!queue.length)H.el("div","g-chip","bilheteria calma…",qbox);
  rbox.innerHTML="";
  rooms.forEach(r=>{
    H.el("div","g-chip",r.mv+" · "+r.in.length+"/"+r.cap+" · ⏳"+Math.ceil(r.t)+"s",rbox);
  });
}
paint();
H.btn(root,"🍿 Estourar pipoca (+4)",()=>{
  if(over||pop>=10)return;
  pop=Math.min(10,pop+4);H.sfx("tick");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Última sessão!",sub:"$"+cash+"/120. Acomode e venda pipoca!"});}
  spawn-=dt;
  if(spawn<=0&&queue.length<4){spawn=3.5;queue.push({id:nid++,m:Math.floor(Math.random()*2),p:20});paint();}
  rooms.forEach(r=>{
    r.t-=dt;
    if(r.t<=0){r.t=r.cap===6?30:24;if(r.in.length){r.in=[];H.sfx("tick");}}
  });
  for(let i=queue.length-1;i>=0;i--){
    queue[i].p-=dt;
    if(queue[i].p<=0){queue.splice(i,1);paint();}
  }
  if(Math.random()<dt*2)paint();
});
}});"""

# 142 — Posto de Gasolina
GAMES[142] = r"""/* NCODE N · 142 Posto de Gasolina — $100 sem fila brava */
GREG(142,{
init(root,H){
let over=false,pumps=[null,null],snack=5,cash=0,lost=0,spawn=1,time=150,nid=0;
const hud=H.hud(root,[["cx","CAIXA","$0/100"],["sn","LANCHES",5],["fl","FUGIRAM","0/3"]]);
const say=H.msg(root,"Carro na bomba? Clique para <b>⛽ abastecer</b> (3s). 🛢️ = clique 2ª vez para o <b>óleo</b>. 🍫 clientes compram lanche sozinhos (se houver)!");
const box=H.el("div","g-col",null,root);
const pbox=H.el("div","g-row",null,box);
function paint(){
  hud.set("cx","$"+cash+"/100");hud.set("sn",snack);
  pbox.innerHTML="";
  pumps.forEach((p,i)=>{
    const b=H.el("button","g-cell"+(p?" hot":""),null,pbox);
    b.style.minWidth="140px";b.style.fontSize="14px";
    if(!p)b.innerHTML="⛽ bomba "+(i+1)+"<br>livre";
    else b.innerHTML="🚗 "+(p.fuel>0?"abastecendo "+Math.ceil(p.fuel)+"s":p.oil?"🛢️ ÓLEO? clique!":"✅ pronto, clique!")+"<br>⏳"+Math.ceil(p.p);
    b.addEventListener("click",()=>act(i));
  });
}
function act(i){
  if(over)return;
  const p=pumps[i];
  if(!p||p.fuel>0)return;
  if(!p.done){p.fuel=3;p.done=true;H.sfx("tick");paint();return;}
  if(p.oil){p.oil=false;cash+=6;H.sfx("ok");say("🛢️ Óleo verificado! +$6");paint();return;}
  pumps[i]=null;cash+=12;H.score(cash);H.sfx("ok");paint();
  if(cash>=100){over=true;return H.done({win:true,score:cash+50,title:"Posto premiado!",sub:"$"+cash+" de pista e conveniência."});}
}
paint();
H.btn(root,"🍫 Repor lanches (+4)",()=>{
  if(over||snack>=8)return;
  snack=Math.min(8,snack+4);H.sfx("tick");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+"/100."});}
  spawn-=dt;
  if(spawn<=0){
    spawn=5;
    const f=pumps.findIndex(q=>!q);
    if(f>=0)pumps[f]={fuel:0,done:false,oil:Math.random()<.4,p:24,snack:Math.random()<.5};
    else{lost++;hud.set("fl",lost+"/3");H.sfx("bad");
      if(lost>=3){over=true;return H.done({win:false,score:cash,title:"Fila dobrou a esquina!",sub:"3 carros desistiram. Atenda mais rápido!"});}}
    paint();
  }
  pumps.forEach((p,i)=>{
    if(!p)return;
    if(p.fuel>0){p.fuel-=dt;if(p.fuel<=0)paint();}
    p.p-=dt;
    if(p.p<=0){
      if(p.snack&&snack>0){snack--;cash+=5;say("🍫 +$5 de lanche!");}
      pumps[i]=null;lost++;hud.set("fl",lost+"/3");H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:cash,title:"Fila dobrou a esquina!",sub:"3 desistências."});}
    }
  });
  if(Math.random()<dt*2&&pumps.some(Boolean))paint();
});
}});"""

# 143 — Consultório Dentário
GAMES[143] = r"""/* NCODE N · 143 Consultório Dentário — 8 sorrisos */
GREG(143,{
init(root,H){
const TR={limp:"🪥 Limpar",obt:"🦷 Obturar",ext:"🩹 Extrair"};
let over=false,queue=[],tool="limp",prog=null,served=0,pain=0,spawn=1,nid=0;
const hud=H.hud(root,[["sm","SORRISOS","0/8"],["ai","DOR","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha a <b>ferramenta certa</b> para o caso (🪥 tártaro · 🦷 cárie · 🩹 dente mole) e SEGURE <b>tratar</b> até encher!");
const box=H.el("div","g-col",null,root);
const qbox=H.el("div","g-col",null,box);
const pbox=H.el("div","g-msg","cadeira livre…",box);
let sc=0,hold=false,cur=null;
function paint(){
  hud.set("sm",served+"/8");
  qbox.innerHTML="";
  queue.forEach(c=>{
    const b=H.el("button","g-chip","🧍 "+TR[c.k].split(" ")[0]+" "+c.k+" ⏳"+Math.ceil(c.p),qbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||cur)return;
      cur=c;queue=queue.filter(q=>q.id!==c.id);
      prog=0;H.sfx("tick");paint();
      say("Na cadeira: "+c.k+". Ferramenta certa + SEGURE tratar!");
    });
  });
  if(!queue.length&&!cur)H.el("div","g-chip","sala de espera vazia…",qbox);
}
paint();
const trow=H.el("div","g-row",null,box);
Object.keys(TR).forEach(k=>{
  H.btn(trow,TR[k],()=>{tool=k;H.sfx("tick");say("Ferramenta: "+TR[k]);},k===tool);
});
const tb=H.el("button","g-btn","🦷 SEGURE PARA TRATAR",box);
tb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
tb.addEventListener("pointerup",()=>hold=false);
tb.addEventListener("pointerleave",()=>hold=false);
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&queue.length<3&&served+queue.length+(cur?1:0)<10){
    spawn=5;
    queue.push({id:nid++,k:Object.keys(TR)[Math.floor(Math.random()*3)],p:30});
    paint();
  }
  for(let i=queue.length-1;i>=0;i--){
    queue[i].p-=dt;
    if(queue[i].p<=0){queue.splice(i,1);pain++;hud.set("ai",pain+"/3");H.sfx("bad");paint();say("🚶 Paciente foi embora com dor! ("+pain+"/3)");
      if(pain>=3){over=true;return H.done({win:false,score:sc,title:"Sala vazia!",sub:"3 pacientes perdidos. Atenda mais rápido!"});}}
  }
  if(cur&&hold){
    if(tool!==cur.k){
      hold=false;pain++;hud.set("ai",pain+"/3");H.sfx("bad");
      say("😱 Ferramenta errada! ("+pain+"/3)");
      if(pain>=3){over=true;return H.done({win:false,score:sc,title:"Consultório interditado!",sub:"3 erros de ferramenta."});}
    }else{
      prog+=dt/2.5;
      pbox.innerHTML="🦷 tratando "+cur.k+": "+Math.floor(prog*100)+"%";
      if(prog>=1){
        cur=null;prog=null;served++;sc+=40;H.score(sc);
        hud.set("sm",served+"/8");hud.set("sc",sc);H.sfx("ok");
        pbox.innerHTML="cadeira livre…";paint();
        if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Sorrisos perfeitos!",sub:"8 pacientes tratados sem dor."});}
      }
    }
  }
});
}});"""

# 144 — Correio
GAMES[144] = r"""/* NCODE N · 144 Correio — 18 cartas, 3 CEPs */
GREG(144,{
init(root,H){
const ZONE=["🔴 Sul","🟢 Centro","🔵 Norte"];
let over=false,table=[],sorted=0,sent=0,err=0,spawn=1,time=150,nid=0,truck=0;
const hud=H.hud(root,[["ct","ENTREGUES","0/18"],["er","ERROS","0/3"],["tp","TEMPO",150]]);
const say=H.msg(root,"Clique na carta e depois na <b>caixa do CEP certo</b> (cor). A cada 6, o 🚚 caminhão entrega sozinho!");
const box=H.el("div","g-col",null,root);
const tbox=H.el("div","g-row",null,box);
const zbox=H.el("div","g-row",null,box);
let sel=null;
function paint(){
  tbox.innerHTML="";
  table.forEach(c=>{
    const b=H.el("button","g-chip"+(sel===c.id?" hot":""),"✉️ "+ZONE[c.z],tbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=c.id;H.sfx("tick");paint();});
  });
  if(!table.length)H.el("div","g-chip","mesa livre…",tbox);
}
paint();
ZONE.forEach((z,i)=>{
  H.btn(zbox,"📥 "+z,()=>{
    if(over||sel==null)return;
    const c=table.find(q=>q.id===sel);
    if(!c){sel=null;return;}
    table=table.filter(q=>q.id!==sel);sel=null;
    if(c.z===i){
      sorted++;truck++;H.sfx("ok");
      if(truck>=6){truck=0;sent+=6;H.score(sent*10);hud.set("ct",sent+"/18");H.sfx("ok");say("🚚 Caminhão partiu com 6 cartas!");
        if(sent>=18){over=true;return H.done({win:true,score:280,title:"Entrega total!",sub:"18 cartas nos CEPs certos."});}}
      hud.set("ct",sent+"/18 (+"+truck+" no caminhão)");
    }else{
      err++;hud.set("er",err+"/3");H.sfx("bad");say("❌ CEP errado! ("+err+"/3)");
      if(err>=3){over=true;return H.done({win:false,score:sent*10,title:"Cartas extraviadas!",sub:"3 erros de triagem. Confira a cor!"});}
    }
    paint();
  },false);
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sent*10,title:"Agência fechou!",sub:sent+"/18 entregues."});}
  spawn-=dt;
  if(spawn<=0&&sent+truck+table.length<20){
    spawn=2.2;
    if(table.length>=8){err++;hud.set("er",err+"/3");H.sfx("bad");
      if(err>=3){over=true;return H.done({win:false,score:sent*10,title:"Mesa transbordou!",sub:"Cartas demais acumuladas."});}}
    else{table.push({id:nid++,z:Math.floor(Math.random()*3)});paint();}
  }
});
}});"""

# 145 — Supermercado
GAMES[145] = r"""/* NCODE N · 145 Supermercado — $150 sem fila e sem vencer */
GREG(145,{
init(root,H){
let over=false,shelf=[6,6,6],queue=[],cash=0,time=180,scan=0,exp=[0,0,0],spawn=1,nid=0;
const hud=H.hud(root,[["cx","CAIXA","$0/150"],["fl","FILA",0],["tp","TEMPO",180]]);
const say=H.msg(root,"<b>Repor</b> enche a gôndola (evita fuga). <b>📠 Passar compra</b> atende 1 da fila (2s cada). 🗑️ joga fora o <b>vencido</b> antes que mancha a loja!");
const box=H.el("div","g-col",null,root);
const sbox=H.el("div","g-row",null,box);
const qbox=H.el("div","g-msg","",box);
const NM=["🥛","🍞","🍎"];
function paint(){
  hud.set("cx","$"+cash+"/150");hud.set("fl",queue.length);
  sbox.innerHTML="";
  shelf.forEach((s,i)=>{
    const b=H.el("button","g-chip"+(exp[i]>0?" bad":s<=1?" hot":""),NM[i]+" "+s+(exp[i]>0?" ⚠️"+exp[i]+" venc!":""),sbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      if(exp[i]>0){exp[i]=0;H.sfx("ok");say("🗑️ Vencidos descartados!");}
      else{shelf[i]=Math.min(9,shelf[i]+3);H.sfx("tick");}
      paint();
    });
  });
  qbox.innerHTML="🧍‍♀️ fila: "+queue.length+" esperando"+(scan>0?" · passando compra…":"");
}
paint();
H.btn(root,"📠 Passar compra (2s)",()=>{
  if(over||scan>0||!queue.length)return;
  scan=2;H.sfx("tick");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Loja fechou!",sub:"$"+cash+"/150."});}
  spawn-=dt;
  if(spawn<=0){spawn=3;
    const i=Math.floor(Math.random()*3);
    if(shelf[i]>0){shelf[i]--;queue.push({id:nid++});}
    if(queue.length>6){queue.splice(0,2);cash=Math.max(0,cash-10);H.sfx("bad");say("🚶 Fila gigante! 2 desistiram (−$10).");}
    paint();}
  if(Math.random()<dt*.25){
    const i=Math.floor(Math.random()*3);
    if(shelf[i]>0){shelf[i]--;exp[i]++;}
    paint();
  }
  if(exp.some(e=>e>=4)){over=true;return H.done({win:false,score:cash,title:"Vigilância interditou!",sub:"Vencidos demais na gôndola. Descarte clicando!"});}
  if(scan>0){scan-=dt;
    if(scan<=0&&queue.length){queue.shift();cash+=12;H.score(cash);H.sfx("ok");paint();
      if(cash>=150){over=true;return H.done({win:true,score:cash+Math.floor(time),title:"Rede lucrativa!",sub:"$"+cash+" sem fila e sem vencido."});}}}
  if(Math.random()<dt)paint();
});
}});"""

# 146 — Mecânico
GAMES[146] = r"""/* NCODE N · 146 Mecânico — 6 carros, ferramenta certa */
GREG(146,{
init(root,H){
const PART={freio:{s:"🔔 rangido",t:"🔧 chave"},motor:{s:"💨 fumaça",t:"🔨 martelo"},pneu:{s:"🌀 chiado",t:"🪛 furadeira"}};
let over=false,car=null,diag=null,prog=0,served=0,err=0,spawn=0,nid=0;
const hud=H.hud(root,[["cr","CARROS","0/6"],["er","ERROS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"1️⃣ <b>Diagnosticar</b> revela a peça. 2️⃣ Escolha a <b>ferramenta</b>. 3️⃣ SEGURE <b>consertar</b>. Ferramenta errada quebra a peça!");
const box=H.el("div","g-col",null,root);
const cbox=H.el("div","g-msg","elevador livre…",box);
const pbox=H.el("div","g-msg","",box);
let sc=0,hold=false,tool=null;
function paint(){
  cbox.innerHTML=car?("🚗 sintoma: <b>"+PART[car.k].s+"</b>"+(diag?" · peça: <b>"+car.k+"</b> "+PART[car.k].t:" · peça: ?")):"elevador livre…";
}
H.btn(root,"🔍 Diagnosticar",()=>{
  if(over||!car||diag)return;
  diag=car.k;H.sfx("ok");paint();say("Peça: "+car.k+"! Pegue "+PART[car.k].t+".");
},false);
const trow=H.el("div","g-row",null,root);
["🔧 chave","🔨 martelo","🪛 furadeira"].forEach(t=>{
  H.btn(trow,t,()=>{tool=t.split(" ")[0];H.sfx("tick");say("Ferramenta: "+t);},false);
});
const fb=H.el("button","g-btn","SEGURE PARA CONSERTAR",root);
fb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
fb.addEventListener("pointerup",()=>hold=false);
fb.addEventListener("pointerleave",()=>hold=false);
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&!car&&served<6){
    spawn=1;
    const ks=Object.keys(PART);
    car={k:ks[Math.floor(Math.random()*3)]};diag=null;prog=0;tool=null;
    paint();say("🚗 Novo carro: "+PART[car.k].s+"!");
  }
  if(car&&hold){
    if(!diag){hold=false;H.sfx("bad");say("Diagnostique antes!");}
    else if(tool!==PART[car.k].t.split(" ")[0]){
      hold=false;err++;hud.set("er",err+"/3");H.sfx("bad");
      say("💥 Peça quebrada! ("+err+"/3)");
      if(err>=3){over=true;return H.done({win:false,score:sc,title:"Oficina falida!",sub:"3 peças quebradas. Diagnostique e confira!"});}
    }else{
      prog+=dt/2;
      pbox.innerHTML="🔧 consertando: "+Math.floor(prog*100)+"%";
      if(prog>=1){
        car=null;diag=null;prog=0;served++;sc+=50;H.score(sc);
        hud.set("cr",served+"/6");hud.set("sc",sc);H.sfx("ok");
        pbox.innerHTML="";
        if(served>=6){over=true;return H.done({win:true,score:sc+100,title:"Mecânico mestre!",sub:"6 carros diagnosticados e consertados."});}
        say("🚗 Pronto! Próximo carro…");
      }
      paint();
    }
  }
});
}});"""

# 147 — Alfaiataria
GAMES[147] = r"""/* NCODE N · 147 Alfaiataria — 5 ternos sob medida */
GREG(147,{
init(root,H){
const STEPS=["📏 Medir","✂️ Cortar","🪡 Costurar"];
let over=false,order=1,step=0,pos=0,dir=1,zone={a:40,b:60},fails=0;
const hud=H.hud(root,[["tr","TERNOS","0/5"],["et","ETAPA","Medir"],["sc","PONTOS",0]]);
const say=H.msg(root,"O marcador corre! Clique em <b>AGORA!</b> com ele na <b>faixa verde</b> para concluir cada etapa (medir → cortar → costurar).");
const o=H.cvs(root,440,200),x=o.x;
let sc=0;
function newZone(){
  const a=10+Math.random()*70;
  zone={a,b:Math.min(95,a+14)};
  pos=Math.random()*100;dir=Math.random()<.5?1:-1;
}
newZone();
H.loop(dt=>{
  if(over)return;
  pos+=dir*dt*(70+order*12+step*20);
  if(pos>100){pos=100;dir=-1;}if(pos<0){pos=0;dir=1;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,70,o.W-60,40);
  x.fillStyle=H.C.ok;
  x.fillRect(30+(o.W-60)*zone.a/100,70,(o.W-60)*(zone.b-zone.a)/100,40);
  x.fillStyle=H.C.ink;
  x.fillRect(30+(o.W-60)*pos/100-3,58,6,64);
  x.fillStyle=H.C.ink;x.font="bold 15px 'Space Mono',monospace";
  x.fillText(STEPS[step]+" · terno "+order+"/5",30,40);
  x.font="12px 'Space Mono',monospace";
  x.fillText("erros: "+fails+"/5",30,140);
});
H.btn(root,"🎯 AGORA!",()=>{
  if(over)return;
  if(pos>=zone.a&&pos<=zone.b){
    sc+=20;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    step++;
    if(step>=3){
      step=0;order++;hud.set("tr",(order-1)+"/5");
      if(order>5){over=true;return H.done({win:true,score:sc+100,title:"Alfaiate renomado!",sub:"5 ternos sob medida, ponto perfeito."});}
      say("🤵 Terno pronto! Próximo cliente…");
    }
    hud.set("et",STEPS[step].split(" ")[1]);
    newZone();
  }else{
    fails++;H.sfx("bad");say("❌ Fora da faixa! ("+fails+"/5)");
    if(fails>=5){over=true;return H.done({win:false,score:sc,title:"Tecido rasgado!",sub:"5 erros. Acerte a faixa verde!"});}
    newZone();
  }
},true);
}});"""

# 148 — Estúdio de Cerâmica
GAMES[148] = r"""/* NCODE N · 148 Estúdio de Cerâmica — 6 peças do forno */
GREG(148,{
init(root,H){
const GL=["🔴","🔵","🟢"];
let over=false,order=0,stage=0,spin=0,glaze=null,fire=0,served=0;
const hud=H.hud(root,[["pc","PEÇAS","0/6"],["et","ETAPA","Torno"],["sc","PONTOS",0]]);
const say=H.msg(root,"1️⃣ <b>Torno</b>: clique 6× ritmado (não rápido demais!). 2️⃣ <b>Esmalte</b>: a cor do pedido. 3️⃣ <b>Forno</b>: tire na janela verde!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
let sc=0,want=0,rhythm=0,last=0,ft=0,fdir=1;
function newOrder(){
  want=Math.floor(Math.random()*3);stage=0;spin=0;glaze=null;fire=0;ft=0;fdir=1;
  hud.set("et","Torno");
  paint();
}
function paint(){
  od.innerHTML="🧾 Pedido: vaso "+GL[want]+" · etapa: <b>"+["torno","esmalte","forno"][stage]+"</b>"+(stage===0?" ("+spin+"/6 toques)":"");
}
newOrder();
const o=H.cvs(root,440,160),x=o.x;
H.loop(dt=>{
  if(over)return;
  if(stage===2){
    ft+=fdir*dt*60;
    if(ft>100){ft=100;fdir=-1;}if(ft<0){ft=0;fdir=1;}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,50,o.W-60,36);
  if(stage===2){
    x.fillStyle=H.C.ok;x.fillRect(30+(o.W-60)*.4,50,(o.W-60)*.2,36);
    x.fillStyle=H.C.ink;x.fillRect(30+(o.W-60)*ft/100-3,40,6,56);
    x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
    x.fillText("TIRE NA FAIXA VERDE!",30,110);
  }else{
    x.fillStyle=H.C.ink;x.font="13px 'Space Mono',monospace";
    x.fillText(stage===0?"🌀 clique TORNAR 6× com calma (~1 por segundo)":"🎨 escolha o esmalte "+GL[want],30,72);
  }
});
const row=H.el("div","g-row",null,box);
H.btn(row,"🌀 TORNAR",()=>{
  if(over||stage!==0)return;
  const now=performance.now();
  if(now-last<700){H.sfx("bad");say("Devagar! Ritmo de ~1 toque/seg.");spin=0;paint();last=now;return;}
  last=now;spin++;H.sfx("tick");
  if(spin>=6){stage=1;hud.set("et","Esmalte");say("Vaso modelado! Agora o esmalte "+GL[want]+".");}
  paint();
},false);
GL.forEach(g=>{
  H.btn(row,g,()=>{
    if(over||stage!==1)return;
    if(g!==GL[want]){H.sfx("bad");say("Cor errada! O pedido é "+GL[want]+".");return;}
    stage=2;hud.set("et","Forno");H.sfx("ok");say("🔥 No forno! Tire na faixa verde.");paint();
  },false);
});
H.btn(root,"🧤 TIRAR DO FORNO",()=>{
  if(over||stage!==2)return;
  if(ft>=38&&ft<=62){
    served++;sc+=50;H.score(sc);hud.set("pc",served+"/6");hud.set("sc",sc);H.sfx("ok");
    if(served>=6){over=true;return H.done({win:true,score:sc+100,title:"Ceramista premiado!",sub:"6 vasos modelados, esmaltados e queimados."});}
    say("🏺 Peça pronta! Próximo pedido…");newOrder();
  }else{H.sfx("bad");say("🔥 Queima ruim! Fora da janela — mesma peça, tente de novo.");ft=0;}
},true);
}});"""

# 149 — Fábrica de Velas
GAMES[149] = r"""/* NCODE N · 149 Fábrica de Velas — 10 velas aromáticas */
GREG(149,{
init(root,H){
const SC=["🪻 lavanda","🍋 limão","🌹 rosa"];
let over=false,queue=[],melt=null,pour=0,served=0,nid=0,spawn=1,want=0;
const hud=H.hud(root,[["vl","VELAS","0/10"],["sc","PONTOS",0]]);
const say=H.msg(root,"1️⃣ <b>Derreter</b> cera (4s). 2️⃣ Pingue a <b>essência do pedido</b>. 3️⃣ SEGURE <b>verter</b> até a linha. 4️⃣ <b>Embalar</b>!");
const box=H.el("div","g-col",null,root);
const qbox=H.el("div","g-msg","",box);
let hold=false,level=0,scent=null;
function paint(){
  qbox.innerHTML=queue.length?("🧾 Pedido: vela "+SC[queue[0]]):"sem pedidos…";
}
H.btn(root,"🫕 Derreter cera (4s)",()=>{
  if(over||melt||pour)return;
  melt=4;H.sfx("tick");say("🫕 Derretendo…");
},false);
const srow=H.el("div","g-row",null,root);
SC.forEach((s,i)=>{
  H.btn(srow,s,()=>{
    if(over||!melt||melt>0||scent!=null)return;
    if(!queue.length||queue[0]!==i){H.sfx("bad");say("Essência errada! O pedido é "+(queue.length?SC[queue[0]]:"?"));return;}
    scent=i;H.sfx("ok");say("💧 Essência certa! Agora VERTEJA até a linha.");
  },false);
});
const vb=H.el("button","g-btn","SEGURE PARA VERTER",root);
vb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
vb.addEventListener("pointerup",()=>hold=false);
vb.addEventListener("pointerleave",()=>hold=false);
const o=H.cvs(root,440,170),x=o.x;
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&queue.length<2&&served+queue.length<11){
    spawn=4;queue.push(Math.floor(Math.random()*3));paint();
  }
  if(melt>0){melt-=dt;if(melt<=0){melt=0;say("Cera pronta! Pingue a essência.");}}
  if(hold&&melt===0&&scent!=null)level=Math.min(100,level+dt*45);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.strokeRect(180,20,80,130);
  x.fillStyle="#E8A33D";
  x.fillRect(183,150-124*level/100,74,124*level/100);
  x.strokeStyle=H.C.ok;x.lineWidth=3;
  x.beginPath();x.moveTo(170,150-124*.7);x.lineTo(270,150-124*.7);x.stroke();
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText(melt>0?"derretendo "+Math.ceil(melt)+"s":melt===0?"cera pronta ✓":"derreta a cera",140,165);
});
H.btn(root,"🎁 Embalar vela",()=>{
  if(over||melt!==0||scent==null)return;
  if(level<65||level>78){H.sfx("bad");say("❌ Nível errado! Verteja até a LINHA VERDE. (revertendo)");level=0;return;}
  queue.shift();served++;H.score(served*30);hud.set("vl",served+"/10");H.sfx("ok");
  melt=null;scent=null;level=0;hold=false;paint();
  if(served>=10){over=true;return H.done({win:true,score:400,title:"Velas perfumadas!",sub:"10 velas derretidas, aromatizadas e embaladas."});}
  say("🕯️ Vela embalada! Próxima…");
},true);
}});"""

# 150 — Fazenda de Mel
GAMES[150] = r"""/* NCODE N · 150 Fazenda de Mel — $100 em 180s */
GREG(150,{
init(root,H){
let over=false,hives=[],empty=2,full=0,honey=0,cash=0,time=180,day=1,price=8,dt2=0;
const hud=H.hud(root,[["cx","CAIXA","$0/100"],["dia","DIA","1 · $8"],["jr","POTES CHEIOS",0],["tp","TEMPO",180]]);
const say=H.msg(root,"Colmeia cheia? Clique para <b>colher</b> (+mel). <b>Envasar</b> vira potes (precisa pote vazio — compre!). <b>Vender</b> usa o preço do dia. Preço muda a cada 30s!");
const box=H.el("div","g-col",null,root);
const hbox=H.el("div","g-row",null,box);
const sbox=H.el("div","g-msg","",box);
hives=new Array(4).fill(0).map(()=>({f:Math.random()*50}));
function paint(){
  hud.set("cx","$"+cash+"/100");hud.set("dia",day+" · $"+price);hud.set("jr",full+" (+"+empty+" vazios)");
  hbox.innerHTML="";
  hives.forEach((h,i)=>{
    const b=H.el("button","g-cell"+(h.f>=100?" good":""),null,hbox);
    b.style.minWidth="90px";b.style.fontSize="13px";
    b.innerHTML="🍯 "+Math.floor(h.f)+"%"+(h.f>=100?"<br>COLHER!":"");
    b.addEventListener("click",()=>{
      if(over||h.f<100)return;
      h.f=0;honey+=3;H.sfx("ok");say("🍯 +3 mel! Envasar precisa de potes.");paint();
    });
  });
  sbox.innerHTML="🍯 mel a granel: "+honey+" · 🏺 cheios: "+full+" · vazios: "+empty;
}
paint();
H.btn(root,"🏺 Comprar 2 potes ($6)",()=>{
  if(over||cash<6)return;
  cash-=6;empty+=2;H.sfx("tick");paint();
},false);
H.btn(root,"🫙 Envasar (3 mel → 1 pote)",()=>{
  if(over||honey<3||empty<=0)return;
  honey-=3;empty--;full++;H.sfx("tick");say("🫙 Pote cheio! Venda no preço do dia ($"+price+").");paint();
},false);
H.btn(root,"💰 Vender 1 pote ($ do dia)",()=>{
  if(over||full<=0)return;
  full--;cash+=price;H.score(cash);H.sfx("ok");paint();
  if(cash>=100){over=true;return H.done({win:true,score:cash+Math.floor(time),title:"Rei do mel!",sub:"$"+cash+" em potes vendidos."});}
},true);
H.loop(dt=>{
  if(over)return;
  time-=dt;dt2+=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(dt2>=30){dt2=0;day++;price=5+Math.floor(Math.random()*8);
    say("☀️ Dia "+day+": pote vale $"+price+".");paint();}
  hives.forEach(h=>{if(h.f<100)h.f+=dt*6;});
  if(Math.random()<dt)paint();
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Safra encerrada!",sub:"$"+cash+"/100. Colha, envase e venda no dia caro!"});}
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
