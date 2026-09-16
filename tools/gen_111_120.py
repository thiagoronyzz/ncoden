#!/usr/bin/env python3
"""Gera games/g111..g120 — ESTRATÉGIA (parte 4, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 111 — Vinhedo das Estações
GAMES[111] = r"""/* NCODE N · 111 Vinhedo das Estações — 10 cachos em 2 anos */
GREG(111,{
init(root,H){
const SE=["🌱 Primavera","☀️ Verão","🍂 Outono","❄️ Inverno"];
let over=false,turn=0,vines=[],acts=3,grapes=0;
const hud=H.hud(root,[["es","ESTAÇÃO","Primavera"],["uv","UVAS","0/10"],["ac","AÇÕES",3]]);
const say=H.msg(root,"Clique na parreira para <b>cuidar</b> (+crescimento). No <b>outono</b>, parreira madura (3+) vira colheita!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(3,1fr)";
board.style.width="min(100%,320px)";
vines=new Array(6).fill(0).map(()=>({g:0}));
function paint(){
  const se=turn%4;
  hud.set("es",SE[se].split(" ")[1]+" · ano "+(Math.floor(turn/4)+1)+"/2");
  hud.set("uv",grapes+"/10");hud.set("ac",acts);
  board.innerHTML="";
  vines.forEach((v,i)=>{
    const d=H.el("button","g-cell"+(v.g>=3?" good":""),null,board);
    d.style.minHeight="70px";d.style.fontSize="14px";
    d.innerHTML=(v.g>=3?"🍇":v.g===0?"🪴":"🌿")+"<br>"+v.g+"/3"+(se===2&&v.g>=3?"<br>COLHER!":"");
    d.addEventListener("click",()=>tend(i));
  });
}
function tend(i){
  if(over||acts<=0)return;
  const se=turn%4,v=vines[i];
  if(se===2&&v.g>=3){grapes++;v.g=0;acts--;H.sfx("ok");hud.set("uv",grapes+"/10");}
  else if(se<=1){if(v.g>=3){H.sfx("bad");say("Já está no máximo! Espere o outono.");return;}v.g++;acts--;H.sfx("tick");}
  else{H.sfx("bad");say(se===3?"No inverno a vinha descansa…":"Só colha no outono!");return;}
  paint();
}
paint();
H.btn(root,"⏭ Próxima estação",()=>{
  if(over)return;
  turn++;acts=3;
  if(turn%4===3){let rot=0;vines.forEach(v=>{if(v.g>=3){v.g=0;rot++;}});if(rot)say("❄️ "+rot+" parreira(s) apodreceu(ram)! Colha no outono.");}
  if(turn%4===0&&turn>0){vines.forEach(v=>v.g=0);say("🌱 Novo ano! As parreiras rebrotam.");}
  if(turn>=8){
    over=true;H.score(grapes*20);
    if(grapes>=10)return H.done({win:true,score:grapes*20+100,title:"Safra premiada!",sub:grapes+" cachos em 2 anos."});
    return H.done({win:false,score:grapes*20,title:"Vinho aguado…",sub:"Só "+grapes+"/10 cachos. Cuide de 3+ parreiras por ano!"});
  }
  paint();
},true);
}});"""

# 112 — Apiário
GAMES[112] = r"""/* NCODE N · 112 Apiário — 12 potes de mel */
GREG(112,{
init(root,H){
let over=false,hives=[],turn=1,acts=3,honey=0,mode="colher";
const hud=H.hud(root,[["tn","TURNO","1/6"],["ml","MEL","0/12"],["ac","AÇÕES",3]]);
const say=H.msg(root,"<b>Colher</b> em colmeia calma rende até 3 potes (e agita!). <b>Fumaça</b> acalma. Colher enfurecida (😡×2) = ferroada!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(2,1fr)";
board.style.width="min(100%,300px)";
hives=new Array(4).fill(0).map(()=>({ag:0}));
function paint(){
  hud.set("tn",turn+"/6");hud.set("ml",honey+"/12");hud.set("ac",acts);
  board.innerHTML="";
  hives.forEach((h,i)=>{
    const d=H.el("button","g-cell"+(h.ag===0?" good":h.ag===2?" bad":""),null,board);
    d.style.minHeight="80px";d.style.fontSize="15px";
    d.innerHTML="🍯 "+(h.ag===0?"😌 calma":h.ag===1?"😠 irritada":"😡 FURIOSA");
    d.addEventListener("click",()=>act(i));
  });
}
function act(i){
  if(over||acts<=0)return;
  const h=hives[i];
  if(mode==="fumaca"){h.ag=0;acts--;H.sfx("tick");say("💨 Colmeia acalmada.");}
  else{
    if(h.ag>=2){H.sfx("bad");say("🐝 FERROADA! Sem mel e -1 ação extra.");acts=Math.max(0,acts-2);paint();return;}
    const y=3-h.ag;honey+=y;h.ag=2;acts--;H.sfx("ok");hud.set("ml",honey+"/12");
    say("🍯 +"+y+" potes!");
  }
  paint();
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"🍯 Colher",()=>{mode="colher";H.sfx("tick");},false);
H.btn(row,"💨 Fumaça",()=>{mode="fumaca";H.sfx("tick");},false);
H.btn(root,"⏭ Próximo turno",()=>{
  if(over)return;
  turn++;acts=3;
  hives.forEach(h=>{if(Math.random()<.5)h.ag=Math.min(2,h.ag+1);});
  if(turn>6){
    over=true;H.score(honey*10);
    if(honey>=12)return H.done({win:true,score:honey*10+80,title:"Mestre apicultor!",sub:honey+" potes sem acidentes graves."});
    return H.done({win:false,score:honey*10,title:"Colmeias vazias…",sub:"Só "+honey+"/12 potes. Alterne fumaça e colheita!"});
  }
  say("Turno "+turn+": abelhas se agitam…");
  paint();
},true);
}});"""

# 113 — Pousada da Montanha
GAMES[113] = r"""/* NCODE N · 113 Pousada da Montanha — 10 hóspedes felizes */
GREG(113,{
init(root,H){
const ROOMS=[{t:"solteiro",e:"🛏️"},{t:"solteiro",e:"🛏️"},{t:"casal",e:"❤️"},{t:"casal",e:"❤️"},{t:"luxo",e:"👑"},{t:"luxo",e:"👑"}];
let over=false,rooms=[],guest=null,done2=0,sat=0,walk=0,spawn=2,sel=-1;
const hud=H.hud(root,[["hs","HÓSPEDES","0/10"],["st","SATISFAÇÃO","—"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no hóspede e depois no quarto. Tipo certo = 😍 · upgrade grátis = 🙂 · downgrade = 😠!");
const box=H.el("div","g-col",null,root);
const grow=H.el("div","g-row",null,box);
const rrow=H.el("div","g-board",null,box);
rrow.style.gridTemplateColumns="repeat(3,1fr)";
rrow.style.width="min(100%,320px)";
let sc=0;
rooms=ROOMS.map(r=>({t:r.t,e:r.e,busy:0}));
const PREF=["solteiro","casal","luxo"];
function paint(){
  grow.innerHTML="";rrow.innerHTML="";
  if(guest){
    const b=H.el("button","g-chip"+(sel===0?" hot":""),"🧳 quer "+guest+" ⏳"+Math.ceil(guest.p),grow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=0;H.sfx("tick");paint();});
  }else H.el("div","g-chip","recepção livre…",grow);
  rooms.forEach((r,i)=>{
    const b=H.el("button","g-cell"+(r.busy>0?"":" good"),null,rrow);
    b.style.minHeight="60px";b.style.fontSize="14px";
    b.innerHTML=r.busy>0?("🔒 "+Math.ceil(r.busy)+"s"):(r.e+"<br>"+r.t);
    b.addEventListener("click",()=>{
      if(over||!guest||sel<0||r.busy>0)return;
      const gi=PREF.indexOf(guest.t),ri=PREF.indexOf(r.t);
      let s=0;
      if(gi===ri)s=100;else if(ri>gi)s=70;else s=20;
      r.busy=9;sat+=s;done2++;sc+=s;H.score(sc);
      hud.set("hs",done2+"/10");hud.set("st",Math.round(sat/done2)+"%");hud.set("sc",sc);
      H.sfx(s>=70?"ok":"bad");
      say(s===100?"😍 Perfeito!":s===70?"🙂 Upgrade agradou.":"😠 Quarto abaixo do esperado!");
      guest=null;sel=-1;paint();
      if(done2>=10){
        over=true;
        const avg=sat/10;
        if(avg>=70&&walk<=2)return H.done({win:true,score:sc+100,title:"Pousada 5 estrelas!",sub:"Satisfação média "+Math.round(avg)+"%."});
        return H.done({win:false,score:sc,title:"Avaliações mistas…",sub:"Média "+Math.round(avg)+"%, "+walk+" desistências. Acerte o tipo!"});
      }
    });
  });
}
paint();
H.loop(dt=>{
  if(over)return;
  if(!guest){spawn-=dt;if(spawn<=0){spawn=2.5;guest={t:PREF[Math.floor(Math.random()*3)],p:14};sel=-1;paint();}}
  else{
    guest.p-=dt;
    if(guest.p<=0){
      guest=null;walk++;H.sfx("bad");paint();
      say("🚶 Hóspede desistiu! ("+walk+")");
      if(walk>2){over=true;return H.done({win:false,score:sc,title:"Pousada vazia!",sub:"3 desistências. Quartos ocupados demais?"});}
    }else if(Math.random()<dt*2)paint();
  }
  rooms.forEach(r=>{if(r.busy>0){r.busy-=dt;if(r.busy<=0)paint();}});
});
}});"""

# 114 — Feira Livre
GAMES[114] = r"""/* NCODE N · 114 Feira Livre — compre barato, venda caro */
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
}});"""

# 115 — Táxi da Cidade
GAMES[115] = r"""/* NCODE N · 115 Táxi da Cidade — $100 antes da gasolina acabar */
GREG(115,{
init(root,H){
const N=8;
let over=false,taxi={r:7,c:0},fuel=60,cash=0,pax=null,dest=null,time=150;
const hud=H.hud(root,[["cx","CAIXA","$0/100"],["cb","COMBUSTÍVEL",60],["tp","TEMPO",150]]);
const say=H.msg(root,"Setas / WASD ou clique em célula vizinha. Embarque 🧍 e entregue no 🏁. ⛽ reabastece!");
const o=H.cvs(root,440,440),x=o.x;
const GAS={r:0,c:7};
function freeCell(){return{r:Math.floor(Math.random()*N),c:Math.floor(Math.random()*N)};}
function newPax(){
  let a=freeCell(),b=freeCell();
  pax=a;dest=b;
  say("🧍 Passageiro em ("+(a.r+1)+","+(a.c+1)+") → 🏁 ("+(b.r+1)+","+(b.c+1)+")");
}
newPax();
function move(dr,dc){
  if(over)return;
  const nr=taxi.r+dr,nc=taxi.c+dc;
  if(nr<0||nr>=N||nc<0||nc>=N)return;
  taxi={r:nr,c:nc};fuel--;H.sfx("tick");
  hud.set("cb",Math.max(0,fuel));
  if(taxi.r===GAS.r&&taxi.c===GAS.c){fuel=60;hud.set("cb",60);H.sfx("ok");say("⛽ Tanque cheio!");}
  if(pax&&taxi.r===pax.r&&taxi.c===pax.c){pax="in";H.sfx("ok");say("🧍 A bordo! Leve ao 🏁 ("+(dest.r+1)+","+(dest.c+1)+")");}
  else if(pax==="in"&&taxi.r===dest.r&&taxi.c===dest.c){
    cash+=25;H.score(cash);hud.set("cx","$"+cash+"/100");H.sfx("ok");
    if(cash>=100){over=true;return H.done({win:true,score:cash+fuel,title:"Taxista do mês!",sub:"$100 com "+fuel+" de gasolina sobrando."});}
    newPax();
  }
  if(fuel<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:cash,title:"Pane seca!",sub:"$"+cash+". Reabasteça no ⛽ (canto superior direito)!"});
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
  if(time<=0&&!over){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+"/100. Rotas mais curtas!"});}
  const ss=s();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.fillStyle=(r+c)%2?H.C.card:H.C.paper;
    x.fillRect(c*ss,r*ss,ss,ss);
    x.strokeStyle=H.C.cement;x.strokeRect(c*ss,r*ss,ss,ss);
  }
  x.font=Math.floor(ss*.6)+"px serif";
  x.fillText("⛽",GAS.c*ss+6,GAS.r*ss+ss-6);
  if(pax&&pax!=="in")x.fillText("🧍",pax.c*ss+6,pax.r*ss+ss-6);
  if(dest&&(pax==="in"||pax))x.fillText("🏁",dest.c*ss+6,dest.r*ss+ss-6);
  x.fillText("🚕",taxi.c*ss+6,taxi.r*ss+ss-6);
});
}});"""

# 116 — Carteiro
GAMES[116] = r"""/* NCODE N · 116 Carteiro — a rota mais curta */
GREG(116,{
init(root,H){
const MAPS=[
 {h:[[60,80],[200,60],[350,90],[120,220],[280,210],[420,230],[180,330],[330,330]],},
 {h:[[70,70],[250,50],[430,80],[90,200],[260,180],[400,200],[150,330],[330,310]],}
];
let m=0,order=[],over=false,moving=false;
const hud=H.hud(root,[["mp","MAPA","1/2"],["km","DISTÂNCIA","—"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas 🏠 casas na ordem da rota (do correio 📮 e de volta). Respeite o <b>limite de km</b>!");
const o=H.cvs(root,500,360),x=o.x;
let sc=0,budget=0;
const P0=[40,320];
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);}
function routeLen(ord){
  const H2=MAPS[m].h;
  let d=dist(P0,H2[ord[0]]),i;
  for(i=1;i<ord.length;i++)d+=dist(H2[ord[i-1]],H2[ord[i]]);
  d+=dist(H2[ord[ord.length-1]],P0);
  return d;
}
function greedy(){
  const H2=MAPS[m].h,left=H2.map((_,i)=>i),ord=[];
  let cur=P0;
  while(left.length){
    left.sort((a,b)=>dist(cur,H2[a])-dist(cur,H2[b]));
    cur=H2[left[0]];ord.push(left[0]);left.shift();
  }
  return ord;
}
function build(){
  order=[];moving=false;
  budget=Math.round(routeLen(greedy())*1.18);
  hud.set("mp",(m+1)+"/2");hud.set("km","limite "+budget);
  say("Mapa "+(m+1)+": visite as 8 casas com até <b>"+budget+" km</b>.");
}
build();
H.onTap(o,(px,py)=>{
  if(over||moving)return;
  const H2=MAPS[m].h;
  let bi=-1,bd=26;
  H2.forEach((h,i)=>{const d=Math.hypot(px-h[0],py-h[1]);if(d<bd){bd=d;bi=i;}});
  if(bi<0)return;
  const ix=order.indexOf(bi);
  if(ix>=0)order.splice(ix,1);else order.push(bi);
  H.sfx("tick");
  if(order.length===H2.length)hud.set("km",Math.round(routeLen(order))+" / "+budget);
});
H.loop(()=>{
  const H2=MAPS[m].h;
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  x.beginPath();x.moveTo(P0[0],P0[1]);
  order.forEach(i=>x.lineTo(H2[i][0],H2[i][1]));
  if(order.length===H2.length)x.lineTo(P0[0],P0[1]);
  x.stroke();
  x.font="22px serif";
  x.fillText("📮",P0[0]-12,P0[1]+8);
  H2.forEach((h,i)=>{
    x.fillText("🏠",h[0]-12,h[1]+8);
    const ix=order.indexOf(i);
    if(ix>=0){x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
      x.fillText(ix+1,h[0]+10,h[1]-8);x.font="22px serif";}
  });
});
H.btn(root,"📬 Entregar rota",()=>{
  if(over||moving)return;
  if(order.length!==MAPS[m].h.length){H.sfx("bad");say("Visite todas as 8 casas!");return;}
  const L=Math.round(routeLen(order));
  hud.set("km",L+" / "+budget);
  if(L>budget){H.sfx("bad");say("❌ "+L+" km — acima do limite! Encurte a rota.");return;}
  sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
  m++;
  if(m>=MAPS.length){over=true;return H.done({win:true,score:sc+100,title:"Carteiro eficiente!",sub:"2 rotas dentro do limite de km."});}
  say("Rota aprovada! +150. Próximo mapa…");
  H.after(600,build);
},true);
}});"""

# 117 — Mergulhador de Pérolas
GAMES[117] = r"""/* NCODE N · 117 Mergulhador de Pérolas — 8 pérolas, 1 fôlego */
GREG(117,{
init(root,H){
let over=false,d={x:250,y:40},ox=100,pearls=[],got=0,time=150,vy=0;
const hud=H.hud(root,[["pe","PÉROLAS","0/8"],["ox","OXIGÊNIO",100],["tp","TEMPO",150]]);
const say=H.msg(root,"<b>↑/↓ ou W/S</b> (ou toque acima/abaixo) para nadar. Superfície = ar. Ostras 🦪 no fundo guardam pérolas!");
const o=H.cvs(root,500,420),x=o.x;
const r=H.rng(9);
for(let i=0;i<8;i++)pearls.push({x:40+r()*420,y:250+r()*140,got:false});
let up=false,down=false;
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowUp"||c==="KeyW")up=d;
  if(c==="ArrowDown"||c==="KeyS")down=d;
});
H.onTap(o,(px,py)=>{if(py<d.y-20)up=true,down=false;else if(py>d.y+20)down=true,up=false;H.after(250,()=>{up=false;down=false;});});
H.loop(dt=>{
  if(over)return;
  time-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(up)vy-=300*dt;else if(down)vy+=300*dt;else vy*=0.92;
  vy=H.clamp(vy,-140,140);
  d.y=H.clamp(d.y+vy*dt,30,o.H-20);
  const depth=d.y/o.H;
  if(d.y<60)ox=Math.min(100,ox+50*dt);
  else ox-=dt*(6+depth*14);
  hud.set("ox",Math.max(0,Math.floor(ox)));
  pearls.forEach(p=>{
    if(!p.got&&Math.hypot(p.x-d.x,p.y-d.y)<26){
      p.got=true;got++;H.score(got*40);hud.set("pe",got+"/8");H.sfx("ok");
      if(got>=8){over=true;return H.done({win:true,score:got*40+Math.floor(ox),title:"Mergulho perfeito!",sub:"8 pérolas com fôlego de sobra."});}
    }
  });
  if(ox<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:got*40,title:"Sem ar!",sub:got+"/8 pérolas. Suba para respirar!"});}
  if(time<=0){over=true;
    return H.done({win:false,score:got*40,title:"Maré virou!",sub:got+"/8 pérolas. Mergulhe mais fundo!"});}
  const g=x.createLinearGradient(0,0,0,o.H);
  g.addColorStop(0,"#7fb3d5");g.addColorStop(1,"#0d2436");
  x.fillStyle=g;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(255,255,255,.35)";x.fillRect(0,44,o.W,3);
  x.font="20px serif";
  pearls.forEach(p=>{if(!p.got)x.fillText("🦪",p.x-10,p.y+8);});
  x.font="26px serif";
  x.fillText("🤿",d.x-13,d.y+9);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("profundidade "+Math.floor(depth*30)+"m",12,20);
});
}});"""

# 118 — Vulcão
GAMES[118] = r"""/* NCODE N · 118 Vulcão — evacue antes da lava */
GREG(118,{
init(root,H){
const N=7,LAVA=[[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]];
const VIL=[{r:5,c:1,p:30},{r:3,c:5,p:40},{r:1,c:1,p:30}];
let over=false,turn=1,front=0,saved=0,lost=0,acts=3,bar={},evac={};
const hud=H.hud(root,[["tn","TURNO","1/10"],["sv","SALVOS",0],["ac","AÇÕES",3]]);
const say=H.msg(root,"Lava desce a coluna central! Clique na 🏘️ vila para <b>evacuar</b> (1 ação) ou na lava futura 🔥 para <b>barreira</b> (segura 2 turnos, máx 3).");
const o=H.cvs(root,420,420),x=o.x;
const tot=VIL.reduce((a,v)=>a+v.p,0);
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
function lavaAt(){return LAVA[Math.min(front,LAVA.length-1)];}
H.onTap(o,(px,py)=>{
  if(over||acts<=0)return;
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  const vi=VIL.findIndex(v=>v.r===r&&v.c===c&&!evac[vi2id(r,c)]&&!eaten(r,c));
  const id=r+","+c;
  if(vi>=0&&!evac[id]){evac[id]=1;saved+=VIL[vi].p;acts--;H.sfx("ok");hud.set("sv",saved+"/"+tot);
    say("🚁 "+VIL[vi].p+" moradores evacuados!");return;}
  if(LAVA.some(l=>l[0]===r&&l[1]===c)&&Object.keys(bar).length<3&&!bar[id]){
    bar[id]=2;acts--;H.sfx("tick");say("🧱 Barreira erguida! (+2 turnos)");return;}
  H.sfx("bad");
});
function vi2id(r,c){return r+","+c;}
function eaten(r,c){
  for(let i=0;i<front&&i<LAVA.length;i++)if(LAVA[i][0]===r&&LAVA[i][1]===c)return true;
  return false;
}
H.loop(()=>{
  const ss=s();
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.strokeStyle="rgba(0,0,0,.15)";x.strokeRect(c*ss,r*ss,ss,ss);
  }
  x.font=Math.floor(ss*.6)+"px serif";
  for(let i=0;i<front&&i<LAVA.length;i++){
    const[r,c]=LAVA[i];
    x.fillStyle="#D94E34";x.fillRect(c*ss,r*ss,ss,ss);
    x.fillText("🔥",c*ss+6,r*ss+ss-6);
  }
  LAVA.forEach((l,i)=>{
    if(i<front)return;
    const id=l[0]+","+l[1];
    x.fillStyle="rgba(217,78,52,.25)";x.fillRect(l[1]*ss,l[0]*ss,ss,ss);
    if(bar[id])x.fillText("🧱",l[1]*ss+6,l[0]*ss+ss-6);
  });
  const top=LAVA[LAVA.length-1];
  x.fillText("🌋",top[1]*ss+2,top[0]*ss+ss-2);
  VIL.forEach(v=>{
    const id=v.r+","+v.c;
    if(evac[id])x.fillText("✅",v.c*ss+6,v.r*ss+ss-6);
    else if(eaten(v.r,v.c))x.fillText("☠️",v.c*ss+6,v.r*ss+ss-6);
    else x.fillText("🏘️",v.c*ss+6,v.r*ss+ss-6);
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("barreiras: "+Object.keys(bar).length+"/3",12,18);
});
H.btn(root,"⏭ Avançar turno",()=>{
  if(over)return;
  const lavaCell=LAVA[Math.min(front,LAVA.length-1)];
  const id=lavaCell?lavaCell[0]+","+lavaCell[1]:null;
  if(id&&bar[id]){bar[id]--;if(bar[id]<=0)delete bar[id];say("🧱 Barreira segurou a lava!");}
  else front++;
  VIL.forEach(v=>{
    const vid=v.r+","+v.c;
    if(!evac[vid]&&eaten(v.r,v.c)){lost+=v.p;say("🔥 Uma vila foi engolida! ("+v.p+" moradores)");evac[vid]=2;}
  });
  turn++;acts=3;hud.set("tn",turn+"/10");hud.set("ac",3);hud.set("sv",saved+"/"+tot);
  const doneAll=VIL.every(v=>evac[v.r+","+v.c]);
  if(doneAll||turn>10){
    over=true;
    const pct=Math.round(saved/tot*100);H.score(saved);
    if(pct>=80)return H.done({win:true,score:saved+100,title:"Evacuação heroica!",sub:pct+"% da população a salvo."});
    return H.done({win:false,score:saved,title:"Cinzas e lamento…",sub:"Só "+pct+"% salvos. Evacue cedo, barre a lava!"});
  }
},true);
}});"""

# 119 — Resgate no Terremoto
GAMES[119] = r"""/* NCODE N · 119 Resgate no Terremoto — 5 vidas sob os escombros */
GREG(119,{
init(root,H){
const N=6,NS=5,DIGS=15;
let over=false,digs=0,found=0,surv=[],dug=new Set();
const hud=H.hud(root,[["fd","ENCONTRADOS","0/5"],["esc","ESCAVAÇÕES","0/15"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique para escavar. O sismógrafo indica a <b>distância do sobrevivente mais próximo</b>. Ache os 5 em 15 escavações!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(6,1fr)";
board.style.width="min(100%,340px)";
let sc=0;
function build(){
  const r=H.rng(Date.now()%100000);
  surv=[];dug=new Set();digs=0;found=0;sc=0;
  while(surv.length<NS){
    const i=Math.floor(r()*N*N);
    if(!surv.includes(i))surv.push(i);
  }
  paint();
}
function near(i){
  const r=(i/N)|0,c=i%N;
  let bd=99;
  surv.forEach(s2=>{
    if(dug.has(s2))return;
    bd=Math.min(bd,Math.abs(((s2/N)|0)-r)+Math.abs(s2%N-c));
  });
  return bd;
}
function paint(){
  hud.set("fd",found+"/5");hud.set("esc",digs+"/"+DIGS);
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell"+(dug.has(i)?(surv.includes(i)?" good":""):""),null,board);
    d.style.aspectRatio="1";d.style.fontSize="16px";
    if(!dug.has(i))d.textContent="🟫";
    else if(surv.includes(i))d.textContent="🧑‍⚕️";
    else d.textContent=near(i)>0?near(i):"·";
    if(!dug.has(i)){const idx=i;d.addEventListener("click",()=>dig(idx));}
  }
}
function dig(i){
  if(over||dug.has(i))return;
  dug.add(i);digs++;
  if(surv.includes(i)){found++;sc+=100;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    say("🎉 Sobrevivente resgatado! ("+found+"/5)");
    if(found>=NS){over=true;return H.done({win:true,score:sc+(DIGS-digs)*10,title:"Missão cumprida!",sub:"5 vidas salvas com "+(DIGS-digs)+" escavações de sobra."});}
  }else{
    H.sfx("tick");
    say("📻 Sismógrafo: sobrevivente mais próximo a <b>"+near(i)+" casas</b>.");
  }
  if(digs>=DIGS){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Réplicas chegaram…",sub:"Só "+found+"/5 resgatados. Triangule pelos números!"});
  }
  paint();
}
build();
}});"""

# 120 — Cidade-Estado
GAMES[120] = r"""/* NCODE N · 120 Cidade-Estado — 12 turnos de governo */
GREG(120,{
init(root,H){
let over=false,turn=1,food=20,gold=10,sol=2,w={f:2,m:2,r:2},breach=0;
const hud=H.hud(root,[["tn","TURNO","1/12"],["cm","COMIDA",20],["ou","OURO",10],["ex","EXÉRCITO",2]]);
const say=H.msg(root,"Distribua <b>6 trabalhadores</b>: 🌾 fazenda (+4 comida) · ⛏️ mina (+3 ouro) · ⚔️ recruta (+1 soldado). Ataques nos turnos 4, 8 e 12!");
const box=H.el("div","g-col",null,root);
function paint(){
  hud.set("tn",turn+"/12");hud.set("cm",food);hud.set("ou",gold);hud.set("ex",sol);
  box.innerHTML="";
  const rows=[["f","🌾 Fazenda"],["m","⛏️ Mina"],["r","⚔️ Recrutas"]];
  rows.forEach(([k,nm])=>{
    const r2=H.el("div","g-row",null,box);
    H.el("div","g-chip",nm+": <b>"+w[k]+"</b>",r2);
    const bm=H.el("button","g-btn ghost","−",r2);
    const bp=H.el("button","g-btn ghost","+",r2);
    bm.addEventListener("click",()=>{if(!over&&w[k]>0){w[k]--;H.sfx("tick");paint();}});
    bp.addEventListener("click",()=>{
      if(over)return;
      if(w.f+w.m+w.r>=6){H.sfx("bad");say("Só 6 trabalhadores! Tire de outro setor.");return;}
      w[k]++;H.sfx("tick");paint();
    });
  });
  H.el("div","g-msg","Colheita/turno: +"+(w.f*4)+" comida · +"+(w.m*3)+" ouro · +"+w.r+" soldados · consumo −6 comida",box);
}
paint();
H.btn(root,"⏭ Passar turno",()=>{
  if(over)return;
  food+=w.f*4;gold+=w.m*3;sol+=w.r;food-=6;
  let msg="Turno "+turn+": colheita feita. ";
  if(food<0){over=true;H.sfx("lose");paint();
    return H.done({win:false,score:gold,title:"Revolta da fome!",sub:"A cidade passou fome no turno "+turn+". Mais fazenda!"});}
  if(turn===4||turn===8||turn===12){
    const atk=turn===4?4:turn===8?7:10;
    if(sol>=atk){const lost=Math.ceil(atk/2);sol-=lost;msg+="⚔️ Ataque ("+atk+") repelido! −"+lost+" soldados. ";}
    else{breach++;gold=Math.max(0,gold-25);msg+="🔥 Ataque ("+atk+") SAQUEOU a cidade! −25 ouro. ";}
    if(breach>=2){over=true;paint();return H.done({win:false,score:gold,title:"Cidade arrasada!",sub:"2 saques. Recrute antes dos turnos 4/8/12!"});}
  }
  if(turn>=12){
    over=true;paint();
    const sc2=gold+sol*5;H.score(sc2);
    if(gold>=60&&sol>=6)return H.done({win:true,score:sc2+100,title:"Era de ouro!",sub:"$"+gold+" e "+sol+" soldados. A cidade prospera!"});
    return H.done({win:false,score:sc2,title:"Reino medíocre…",sub:"$"+gold+" e "+sol+" soldados (meta: $60 + 6). Equilibre mina e recrutas!"});
  }
  turn++;H.sfx("tick");say(msg);paint();
},true);
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
