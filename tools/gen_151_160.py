#!/usr/bin/env python3
"""Gera games/g151..g160 — SIMULAÇÃO (parte 4, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 151 — Fazenda de Cogumelos
GAMES[151] = r"""/* NCODE N · 151 Fazenda de Cogumelos — 12 cogumelos no clima */
GREG(151,{
init(root,H){
const VAR=[{e:"🍄",h:[60,80],t:[18,24]},{e:"🍄‍🟫",h:[70,90],t:[15,20]},{e:"⛱️",h:[50,70],t:[22,28]}];
let over=false,temp=21,hum=[70,70,70],grow=[0,0,0],got=0,time=150;
const hud=H.hud(root,[["cg","COLHIDOS","0/12"],["tp","TEMPO",60],["tm","TEMP",21]]);
const say=H.msg(root,"Cada variedade quer <b>umidade + temperatura</b> certas. 💧 névoa por prateleira · 🔥/❄️ temperatura global. No ponto = cresce; colha em 100%!");
const box=H.el("div","g-col",null,root);
const sbox=H.el("div","g-row",null,box);
function paint(){
  hud.set("cg",got+"/12");hud.set("tm",Math.round(temp)+"°C");
  sbox.innerHTML="";
  VAR.forEach((v,i)=>{
    const okH=hum[i]>=v.h[0]&&hum[i]<=v.h[1],okT=temp>=v.t[0]&&temp<=v.t[1];
    const b=H.el("button","g-cell"+(grow[i]>=100?" good":okH&&okT?" hot":""),null,sbox);
    b.style.minWidth="110px";b.style.fontSize="12px";
    b.innerHTML=v.e+" "+Math.floor(grow[i])+"%<br>💧"+Math.floor(hum[i])+"% ("+v.h[0]+"–"+v.h[1]+")<br>🌡️ quer "+v.t[0]+"–"+v.t[1]+"°"+(grow[i]>=100?"<br>COLHER!":"");
    b.addEventListener("click",()=>{
      if(over)return;
      if(grow[i]>=100){
        grow[i]=0;got++;H.score(got*25);H.sfx("ok");paint();
        if(got>=12){over=true;return H.done({win:true,score:400,title:"Colheita fúngica!",sub:"12 cogumelos no clima perfeito."});}
      }else{hum[i]=Math.min(100,hum[i]+15);H.sfx("tick");paint();}
    });
  });
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"🔥 +2°",()=>{if(!over){temp=Math.min(32,temp+2);H.sfx("tick");paint();}},false);
H.btn(row,"❄️ −2°",()=>{if(!over){temp=Math.max(10,temp-2);H.sfx("tick");paint();}},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:got*25,title:"Estufa vazia!",sub:"Só "+got+"/12. Ajuste umidade e temp!"});}
  hum=hum.map(h=>Math.max(20,h-dt*2.2));
  VAR.forEach((v,i)=>{
    const ok=hum[i]>=v.h[0]&&hum[i]<=v.h[1]&&temp>=v.t[0]&&temp<=v.t[1];
    if(ok&&grow[i]<100)grow[i]+=dt*9;
  });
  if(Math.random()<dt*2)paint();
});
}});"""

# 152 — Queijaria
GAMES[152] = r"""/* NCODE N · 152 Queijaria — 4 rodas premiadas em 10 dias */
GREG(152,{
init(root,H){
let over=false,day=1,temp=13,wheels=[];
const hud=H.hud(root,[["dd","DIA","1/10"],["tm","ADEGA","13°C"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na roda para <b>virar</b> (todo dia!). Mantenha 12–14°C. Roda < 50 estraga. Termine com 4+ rodas em 80+!");
const box=H.el("div","g-col",null,root);
const wbox=H.el("div","g-board",null,box);
wbox.style.gridTemplateColumns="repeat(3,1fr)";
wbox.style.width="min(100%,330px)";
wheels=new Array(6).fill(0).map(()=>({q:100,flip:false,bad:false}));
function paint(){
  hud.set("dd",day+"/10");hud.set("tm",temp+"°C");
  wbox.innerHTML="";
  wheels.forEach((w,i)=>{
    const b=H.el("button","g-cell"+(w.bad?" bad":w.flip?" good":" hot"),null,wbox);
    b.style.minHeight="72px";b.style.fontSize="13px";
    b.innerHTML=w.bad?"🤢<br>estragada":"🧀 "+Math.floor(w.q)+"<br>"+(w.flip?"virada ✓":"VIRAR!");
    if(!w.bad)b.addEventListener("click",()=>{if(!over){w.flip=true;H.sfx("tick");paint();}});
  });
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"🔥 +1°",()=>{if(!over){temp++;H.sfx("tick");paint();}},false);
H.btn(row,"❄️ −1°",()=>{if(!over){temp--;H.sfx("tick");paint();}},false);
H.btn(root,"🌙 Próximo dia",()=>{
  if(over)return;
  const okT=temp>=12&&temp<=14;
  wheels.forEach(w=>{
    if(w.bad)return;
    if(!w.flip)w.q-=18;
    if(!okT)w.q-=12;
    if(w.q<50){w.bad=true;H.sfx("bad");}
    w.flip=false;
  });
  temp+=Math.random()<.5?-1:1;
  temp=Math.max(8,Math.min(19,temp));
  day++;
  if(day>10){
    over=true;
    const good=wheels.filter(w=>!w.bad&&w.q>=80).length;
    H.score(good*60);
    if(good>=4)return H.done({win:true,score:good*60+100,title:"Queijos premiados!",sub:good+" rodas perfeitas após 10 dias."});
    return H.done({win:false,score:good*60,title:"Adega azeda…",sub:"Só "+good+"/4 premiadas. Vire todo dia, segure 12–14°C!"});
  }
  say("☀️ Dia "+day+": adega em "+temp+"°C. Vire as rodas!");
  paint();
},true);
}});"""

# 153 — Vinhedo
GAMES[153] = r"""/* NCODE N · 153 Vinhedo — 3 vinhos envelhecidos */
GREG(153,{
init(root,H){
const SE=["🌱 Primavera","☀️ Verão","🍂 Outono","❄️ Inverno"];
let over=false,se=0,vines=[],grapes=0,barrels=[];
const hud=H.hud(root,[["es","ESTAÇÃO","Primavera"],["uv","UVAS",0],["vn","VINHOS","0/3"]]);
const say=H.msg(root,"Primavera/verão: clique na parreira para <b>crescer</b>. Outono: <b>colha</b> as maduras (3+). <b>Prensar</b>: 4 uvas → 1 mosto. Cada inverno envelhece +1. 3 vinhos com 2+ invernos!");
const box=H.el("div","g-col",null,root);
const vbox=H.el("div","g-board",null,box);
vbox.style.gridTemplateColumns="repeat(4,1fr)";
vbox.style.width="min(100%,340px)";
const bbox=H.el("div","g-msg","",box);
vines=new Array(8).fill(0);
function aged(){return barrels.filter(b=>b>=2).length;}
function paint(){
  hud.set("es",SE[se%4].split(" ")[1]+" · ano "+(Math.floor(se/4)+1)+"/2");
  hud.set("uv",grapes);hud.set("vn",aged()+"/3");
  vbox.innerHTML="";
  vines.forEach((v,i)=>{
    const b=H.el("button","g-cell"+(v>=3?" good":""),null,vbox);
    b.style.minHeight="62px";b.style.fontSize="13px";
    b.innerHTML=(v>=3?"🍇":"🌿")+v+"/3";
    b.addEventListener("click",()=>{
      if(over)return;
      const s2=se%4;
      if(s2<=1){if(vines[i]<3){vines[i]++;H.sfx("tick");paint();}}
      else if(s2===2){if(vines[i]>=3){vines[i]=0;grapes++;H.sfx("ok");say("🍇 +1 uva! ("+grapes+")");paint();}}
      else H.sfx("bad");
    });
  });
  bbox.innerHTML="🛢️ barricas: "+(barrels.map(b=>"🍷"+b+"inv").join(" ")||"vazias");
}
paint();
H.btn(root,"🍇 Prensar (4 uvas → 1 mosto)",()=>{
  if(over||grapes<4||barrels.length>=4)return;
  grapes-=4;barrels.push(0);H.sfx("ok");say("🛢️ Mosto na barrica! Envelhece a cada inverno.");paint();
},false);
H.btn(root,"⏭ Próxima estação",()=>{
  if(over)return;
  se++;
  if(se%4===0){barrels=barrels.map(b=>b+1);vines=vines.map(()=>0);say("❄️ Inverno: vinhos envelheceram!");}
  if(aged()>=3){over=true;paint();return H.done({win:true,score:500,title:"Vinho de reserva!",sub:"3 vinhos com 2+ invernos de barrica."});}
  if(se>=8){over=true;paint();
    return H.done({win:false,score:aged()*80,title:"Safra fraca…",sub:"Só "+aged()+"/3 reservas. Colha 4+ uvas por outono!"});
  }
  paint();
},true);
}});"""

# 154 — Fábrica de Chocolate
GAMES[154] = r"""/* NCODE N · 154 Fábrica de Chocolate — 8 barras perfeitas */
GREG(154,{
init(root,H){
const TY={leite:"🍫 ao leite",meio:"🍫 meio-amargo",branco:"🧈 branco"};
let over=false,order=null,stage=0,roast=0,grind=0,tpos=0,tdir=1,served=0;
const hud=H.hud(root,[["br","BARRAS","0/8"],["et","ETAPA","—"],["sc","PONTOS",0]]);
const say=H.msg(root,"Pedido → <b>torrar</b> (4s) → <b>moer</b> (3s) → <b>temperar</b> (pare na faixa!) → <b>moldar</b>. Errou a têmpera? A barra recomeça!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const o=H.cvs(root,440,150),x=o.x;
let sc=0;
function newOrder(){
  const ks=Object.keys(TY);
  order=ks[Math.floor(Math.random()*3)];stage=0;roast=0;grind=0;
  hud.set("et","Torrar");paint();
}
function paint(){
  od.innerHTML="🧾 Pedido: "+TY[order]+" · etapa: <b>"+["torrar","moer","temperar","moldar"][stage]+"</b>";
}
newOrder();
H.loop(dt=>{
  if(over)return;
  if(stage===2){tpos+=tdir*dt*70;if(tpos>100){tpos=100;tdir=-1;}if(tpos<0){tpos=0;tdir=1;}}
  if(stage===0&&roast>0){roast-=dt;if(roast<=0){stage=1;hud.set("et","Moer");H.sfx("ok");say("Moído? Agora MOA (3s).");paint();}}
  if(stage===1&&grind>0){grind-=dt;if(grind<=0){stage=2;hud.set("et","Temperar");H.sfx("ok");say("Tempere: pare o marcador na faixa!");paint();}}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,50,o.W-60,36);
  if(stage===2){
    x.fillStyle=H.C.ok;x.fillRect(30+(o.W-60)*.35,50,(o.W-60)*.3,36);
    x.fillStyle=H.C.ink;x.fillRect(30+(o.W-60)*tpos/100-3,40,6,56);
  }
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText(stage===0&&roast>0?"🔥 torrando "+roast.toFixed(1)+"s":stage===1&&grind>0?"⚙️ moendo "+grind.toFixed(1)+"s":stage===2?"🌡️ PARE NA FAIXA!":"aperte o botão da etapa",30,110);
});
const row=H.el("div","g-row",null,box);
H.btn(row,"🔥 Torrar",()=>{if(!over&&stage===0&&roast<=0){roast=4;H.sfx("tick");}},false);
H.btn(row,"⚙️ Moer",()=>{if(!over&&stage===1&&grind<=0){grind=3;H.sfx("tick");}},false);
H.btn(row,"🌡️ Temperar!",()=>{
  if(over||stage!==2)return;
  if(tpos>=33&&tpos<=67){stage=3;hud.set("et","Moldar");H.sfx("ok");say("Têmpera perfeita! Molde a barra.");paint();}
  else{H.sfx("bad");say("❌ Têmpera errada! Barra descartada — novo pedido.");newOrder();}
},false);
H.btn(root,"🍫 Moldar barra",()=>{
  if(over||stage!==3)return;
  served++;sc+=50;H.score(sc);hud.set("br",served+"/8");hud.set("sc",sc);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Chocolatier!",sub:"8 barras torradas, moídas e temperadas."});}
  say("🍫 Barra pronta! Próximo pedido…");newOrder();
},true);
}});"""

# 155 — Saboaria
GAMES[155] = r"""/* NCODE N · 155 Saboaria — 8 sabonetes curados */
GREG(155,{
init(root,H){
const SC=["🪻 lavanda","🍋 limão","🌹 rosa"];
let over=false,order=0,mix=null,pour=0,rack=[],served=0,hold=false;
const hud=H.hud(root,[["sb","SABONETES","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"1️⃣ Misture o <b>óleo do pedido</b>. 2️⃣ SEGURE <b>verter</b> até a linha. 3️⃣ Leve à <b>cura</b> (10s, cabem 3). 4️⃣ <b>Embale</b> o curado!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const rbox=H.el("div","g-row",null,box);
function paint(){
  od.innerHTML="🧾 Pedido: sabonete "+SC[order]+(mix!=null?" · mistura ✓":" · misture!")+(rack.length?" · curando "+rack.length+"/3":"");
  rbox.innerHTML="";
  rack.forEach((r,i)=>{
    const b=H.el("button","g-chip"+(r<=0?" good":""),r<=0?"✅ curado! EMBALAR":"🧼 "+Math.ceil(r)+"s",rbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||r>0)return;
      rack.splice(i,1);served++;H.score(served*40);hud.set("sb",served+"/8");H.sfx("ok");paint();
      order=Math.floor(Math.random()*3);mix=null;pour=0;
      if(served>=8){over=true;return H.done({win:true,score:420,title:"Sabonetes artesanais!",sub:"8 barras misturadas, curadas e embaladas."});}
      say("🧼 Embalado! Novo pedido: "+SC[order]+".");paint();
    });
  });
  if(!rack.length)H.el("div","g-chip","prateleira de cura vazia",rbox);
}
const orow=H.el("div","g-row",null,box);
SC.forEach((s,i)=>{
  H.btn(orow,s,()=>{
    if(over||mix!=null)return;
    if(i!==order){H.sfx("bad");say("Óleo errado! O pedido é "+SC[order]+".");return;}
    mix=i;H.sfx("ok");say("Mistura pronta! VERTEJA até a linha.");paint();
  },false);
});
const vb=H.el("button","g-btn","SEGURE PARA VERTER",box);
vb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
vb.addEventListener("pointerup",()=>hold=false);
vb.addEventListener("pointerleave",()=>hold=false);
const o=H.cvs(root,440,150),x=o.x;
H.loop(dt=>{
  if(over)return;
  rack=rack.map(r=>r-dt);
  if(hold&&mix!=null)pour=Math.min(100,pour+dt*40);
  if(Math.random()<dt*2)paint();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(180,10,80,120);
  x.fillStyle="#C4D645";x.fillRect(183,128-114*pour/100,74,114*pour/100);
  x.strokeStyle=H.C.ok;x.lineWidth=3;
  x.beginPath();x.moveTo(170,128-114*.6);x.lineTo(270,128-114*.6);x.stroke();
});
paint();
H.btn(root,"🧺 Levar à cura",()=>{
  if(over||mix==null)return;
  if(pour<55||pour>68){H.sfx("bad");say("❌ Nível fora da linha! (revertendo)");pour=0;return;}
  if(rack.length>=3){H.sfx("bad");say("Prateleira cheia! Embale um curado.");return;}
  rack.push(10);mix=null;pour=0;H.sfx("ok");say("🧼 Na cura (10s)! Pode misturar o próximo.");paint();
},true);
}});"""

# 156 — Casa de Chá
GAMES[156] = r"""/* NCODE N · 156 Casa de Chá — 8 infusões no ponto */
GREG(156,{
init(root,H){
const TEA={verde:{e:"🍵",n:"verde",t:[65,75]},preto:{e:"☕",n:"preto",t:[95,100]},erva:{e:"🌿",n:"ervas",t:[80,90]}};
let over=false,order=null,temp=20,served=0,pat=0,heat=false;
const hud=H.hud(root,[["ch","CHÁS","0/8"],["tm","CHALEIRA","20°C"],["sc","PONTOS",0]]);
const say=H.msg(root,"SEGURE <b>aquecer</b> para subir a temperatura (esfria sozinha). <b>Servir</b> com a água na faixa do pedido!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
let sc=0;
function newOrder(){
  const ks=Object.keys(TEA);
  order=ks[Math.floor(Math.random()*3)];pat=26;paint();
}
function paint(){
  od.innerHTML="🧾 Pedido: chá "+TEA[order].e+" <b>"+order+"</b> ("+TEA[order].t[0]+"–"+TEA[order].t[1]+"°C) · ⏳"+Math.ceil(pat)+"s";
}
newOrder();
const hb=H.el("button","g-btn","🔥 SEGURE PARA AQUECER",box);
hb.addEventListener("pointerdown",e=>{e.preventDefault();heat=true;});
hb.addEventListener("pointerup",()=>heat=false);
hb.addEventListener("pointerleave",()=>heat=false);
const o=H.cvs(root,440,120),x=o.x;
H.loop(dt=>{
  if(over)return;
  if(heat)temp=Math.min(100,temp+dt*22);
  else temp=Math.max(20,temp-dt*7);
  hud.set("tm",Math.round(temp)+"°C");
  pat-=dt;
  if(Math.random()<dt*3)paint();
  if(pat<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Chá frio!",sub:served+"/8. Aqueça e sirva rápido!"});}
  const T=TEA[order].t;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,40,o.W-60,30);
  x.fillStyle=H.C.ok;
  x.fillRect(30+(o.W-60)*(T[0]-20)/80,40,(o.W-60)*(T[1]-T[0])/80,30);
  x.fillStyle=H.C.ink;
  x.fillRect(30+(o.W-60)*(temp-20)/80-3,30,6,50);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("20°C",30,100);x.fillText("100°C",o.W-60,100);
});
H.btn(root,"🍵 Servir chá",()=>{
  if(over)return;
  const T=TEA[order].t;
  if(temp>=T[0]&&temp<=T[1]){
    served++;sc+=50+Math.floor(pat);H.score(sc);hud.set("ch",served+"/8");hud.set("sc",sc);H.sfx("ok");
    if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Mestre de chás!",sub:"8 infusões na temperatura perfeita."});}
    say("🍵 Servido! Próximo pedido…");newOrder();
  }else{H.sfx("bad");say("❌ Temperatura errada! Quer "+T[0]+"–"+T[1]+"°C.");}
},true);
}});"""

# 157 — Sushi Bar
GAMES[157] = r"""/* NCODE N · 157 Sushi Bar — 10 pedidos da esteira */
GREG(157,{
init(root,H){
const PC=["🍣 nigiri","🍱 maki","🍤 temaki"];
let over=false,belt=[],order=0,served=0,err=0,time=150,spawn=0,nid=0;
const hud=H.hud(root,[["pd","PEDIDOS","0/10"],["er","ERROS","0/3"],["tp","TEMPO",150]]);
const say=H.msg(root,"O pedido mostra a peça. Clique no <b>prato certo</b> quando passar na esteira! Prato errado = erro.");
const o=H.cvs(root,500,300),x=o.x;
let sc=0;
function newOrder(){order=Math.floor(Math.random()*3);}
newOrder();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Bar fechou!",sub:served+"/10. Fique de olho na esteira!"});}
  spawn-=dt;
  if(spawn<=0){spawn=1.6;belt.push({id:nid++,k:Math.floor(Math.random()*3),x:-30});}
  for(let i=belt.length-1;i>=0;i--){
    belt[i].x+=75*dt;
    if(belt[i].x>o.W+30)belt.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.font="bold 15px 'Space Mono',monospace";
  x.fillText("🧾 PEDIDO: "+PC[order],14,30);
  x.fillStyle="#8A877C";x.fillRect(0,120,o.W,80);
  x.fillStyle=H.C.ink;
  for(let lx=0;lx<o.W;lx+=44)x.fillRect(lx,156,24,6);
  x.font="30px serif";
  belt.forEach(p=>{
    x.fillStyle="#fff";x.beginPath();x.ellipse(p.x,160,26,14,0,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillText(PC[p.k].split(" ")[0],p.x-15,172);
  });
});
H.onTap(o,(px,py)=>{
  if(over)return;
  const p=belt.find(k=>Math.abs(px-k.x)<28&&py>110&&py<210);
  if(!p)return;
  if(p.k===order){
    belt=belt.filter(k=>k.id!==p.id);
    served++;sc+=40;H.score(sc);hud.set("pd",served+"/10");hud.set("sc",sc);H.sfx("ok");
    if(served>=10){over=true;return H.done({win:true,score:sc+100,title:"Itamae!",sub:"10 pedidos pescados da esteira."});}
    newOrder();
  }else{
    err++;hud.set("er",err+"/3");H.sfx("bad");say("❌ Peça errada! Pedido: "+PC[order]+". ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score:sc,title:"Cliente alérgico!",sub:"3 pratos errados. Leia o pedido!"});}
  }
});
}});"""

# 158 — Ramen Shop
GAMES[158] = r"""/* NCODE N · 158 Ramen Shop — 8 tigelas fumegantes */
GREG(158,{
init(root,H){
const TOP=["🥚","🍖","🌿"];
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
    b.innerHTML="🍜+"+o.top+" "+(o.noodle==="ok"?"✅ MONTAR!":o.noodle?"⏳ cozinhando":"🅿️ cozinhar")+" · ⏳"+Math.ceil(o.p);
    b.addEventListener("click",()=>act(o.id));
  });
  if(!orders.length)H.el("div","g-chip","sem pedidos…",lbox);
  pbox.innerHTML="";
  pots.forEach((p,i)=>{
    H.el("div","g-chip",!p?"🍲 boca "+(i+1)+" livre":"🍲 "+Math.ceil(p.t)+"s"+(p.over?" ⚠️":""),pbox);
  });
  H.el("div","g-chip"+(broth?" good":" bad"),broth?"🔥 caldo quente":"🥶 caldo frio! REAQUEÇA",pbox);
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
H.btn(root,"🔥 Reaquecer caldo",()=>{if(!over){broth=true;H.sfx("tick");paint();}},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Loja fechou!",sub:"Só "+served+"/8."});}
  if(Math.random()<dt*.12&&broth){broth=false;paint();say("🥶 O caldo esfriou! Reaqueça.");}
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
}});"""

# 159 — Bar de Smoothies
GAMES[159] = r"""/* NCODE N · 159 Bar de Smoothies — 8 copos saudáveis */
GREG(159,{
init(root,H){
const GOAL={energia:{e:"🏃",mix:["🍌","🍎"]},calma:{e:"😌",mix:["🫐","🥛"]},detox:{e:"🌿",mix:["🥬","🍋"]}};
const ING=["🍌","🍎","🫐","🥛","🥬","🍋"];
let over=false,goal=null,cup=[],blend=0,served=0;
const hud=H.hud(root,[["sm","SMOOTHIES","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Meta do cliente: <b>🏃 energia = 🍌+🍎 · 😌 calma = 🫐+🥛 · 🌿 detox = 🥬+🍋</b>. Ponha os 2, SEGURE bater (2s) e sirva!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const cbox=H.el("div","g-msg","",box);
let sc=0,hold=false;
function newGoal(){
  const ks=Object.keys(GOAL);
  goal=ks[Math.floor(Math.random()*3)];cup=[];blend=0;paint();
}
function paint(){
  od.innerHTML="🧾 Meta: "+GOAL[goal].e+" <b>"+goal+"</b>";
  cbox.innerHTML="🥤 Copo: "+(cup.join(" ")||"vazio")+(blend>0?" · batido "+Math.floor(blend*50)+"%":"");
}
newGoal();
const irow=H.el("div","g-row",null,box);
ING.forEach(g=>{
  const b=H.el("button","g-btn ghost",g,irow);
  b.addEventListener("click",()=>{
    if(over||cup.length>=2||blend>0)return;
    cup.push(g);H.sfx("tick");paint();
  });
});
const bb=H.el("button","g-btn","SEGURE PARA BATER",box);
bb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
bb.addEventListener("pointerup",()=>hold=false);
bb.addEventListener("pointerleave",()=>hold=false);
H.loop(dt=>{
  if(over)return;
  if(hold&&cup.length===2&&blend<2){blend+=dt;if(Math.random()<dt*6)paint();}
});
const row=H.el("div","g-row",null,box);
H.btn(row,"🗑️ Jogar fora",()=>{if(!over){cup=[];blend=0;H.sfx("tick");paint();}},false);
H.btn(row,"🥤 Servir!",()=>{
  if(over||cup.length<2||blend<2)return;
  const want=GOAL[goal].mix.slice().sort().join(),got=cup.slice().sort().join();
  if(want!==got){H.sfx("bad");say("❌ Mistura errada para "+goal+"! ("+GOAL[goal].mix.join("+")+")");cup=[];blend=0;paint();return;}
  served++;sc+=50;H.score(sc);hud.set("sm",served+"/8");hud.set("sc",sc);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Bar saudável!",sub:"8 smoothies na meta do cliente."});}
  say("🥤 Servido! Próximo cliente…");newGoal();
},true);
}});"""

# 160 — Barraca de Pipoca
GAMES[160] = r"""/* NCODE N · 160 Barraca de Pipoca — 15 saquinhos no carnaval */
GREG(160,{
init(root,H){
const SEA=["🧂 sal","🧀 queijo","🍫 chocolate"];
let over=false,orders=[],pop=0,ready=0,served=0,lost=0,spawn=1,time=160,nid=0;
const hud=H.hud(root,[["pp","SAQUINHOS","0/15"],["ml","PRONTA",0],["tp","TEMPO",160]]);
const say=H.msg(root,"<b>Estourar</b> (5s) rende 5 porções. Clique no pedido com o <b>tempero certo</b> para ensacar e entregar!");
const box=H.el("div","g-col",null,root);
const lbox=H.el("div","g-col",null,box);
function paint(){
  hud.set("pp",served+"/15");hud.set("ml",ready+(pop>0?" (+"+Math.ceil(pop)+"s)":""));
  lbox.innerHTML="";
  orders.forEach(o=>{
    const b=H.el("button","g-chip","🍿 "+SEA[o.s]+" ⏳"+Math.ceil(o.p),lbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>act(o.id));
  });
  if(!orders.length)H.el("div","g-chip","fila calma…",lbox);
}
function act(id){
  if(over)return;
  const o=orders.find(q=>q.id===id);
  if(!o)return;
  if(o.sea==null){H.sfx("bad");say("Escolha o tempero "+SEA[o.s]+" abaixo primeiro!");return;}
  if(o.sea!==o.s){H.sfx("bad");return;}
  if(ready<=0){H.sfx("bad");say("Sem pipoca pronta! Estoure mais.");return;}
  orders=orders.filter(q=>q.id!==id);
  ready--;served++;H.score(served*20);H.sfx("ok");paint();
  if(served>=15){over=true;return H.done({win:true,score:400,title:"Pipoqueiro rei!",sub:"15 saquinhos no carnaval lotado."});}
}
paint();
H.btn(root,"🍿 Estourar (5s → 5 porções)",()=>{
  if(over||pop>0||ready>=10)return;
  pop=5;H.sfx("tick");paint();
},false);
const srow=H.el("div","g-row",null,box);
SEA.forEach((s,i)=>{
  H.btn(srow,"temperar "+s,()=>{
    if(over)return;
    const o=orders.find(q=>q.sea==null);
    if(!o){H.sfx("bad");return;}
    if(o.s!==i){H.sfx("bad");say("Tempero errado! O pedido quer "+SEA[o.s]+".");return;}
    o.sea=i;H.sfx("ok");say("Temperado! Clique no pedido para ensacar.");paint();
  },false);
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*20,title:"Bloco acabou!",sub:served+"/15. Estoure sem parar!"});}
  if(pop>0){pop-=dt;if(pop<=0){ready=Math.min(12,ready+5);H.sfx("ok");}}
  spawn-=dt;
  if(spawn<=0&&orders.length<4&&served+orders.length<17){
    spawn=4;orders.push({id:nid++,s:Math.floor(Math.random()*3),p:20,sea:null});paint();
  }
  for(let i=orders.length-1;i>=0;i--){
    orders[i].p-=dt;
    if(orders[i].p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=4){over=true;return H.done({win:false,score:served*20,title:"Foliões bravos!",sub:"4 desistências. A fila anda!"});}
    }
  }
  if(Math.random()<dt*2)paint();
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
