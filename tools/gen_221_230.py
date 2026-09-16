#!/usr/bin/env python3
"""Gera games/g221..g230 — PALAVRAS (parte 2, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 221 — Palíndromo
GAMES[221] = r"""/* NCODE N · 221 Palíndromo — 3 espelhos de letras! */
GREG(221,{
init(root,H){
const ROUNDS=[["A","R","A","R","A"],["O","V","O"],["A","N","A","I","A","N","A"]];
let over=false,ri=0,rack=[],built=[],score=0;
const hud=H.hud(root,[["rd","RODADA","1/3"],["pt","PONTOS",0]]);
const say=H.msg(root,"Clique nas letras para montar um <b>palíndromo</b> (lê igual de trás pra frente)! Use todas, 3 rodadas.");
const box=H.el("div","g-col",null,root);
const bl=H.el("div","g-msg","",box);
const rk=H.el("div","g-row",null,box);
function build(){
  rack=ROUNDS[ri].map((l,i)=>({l,id:i,used:false}));
  // embaralha
  for(let i=rack.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=rack[i];rack[i]=rack[j];rack[j]=t;}
  built=[];
  hud.set("rd",(ri+1)+"/3");
  paint();
}
function paint(){
  bl.innerHTML="🔤 "+(built.map(b=>b.l).join("")||"_");
  rk.innerHTML="";
  rack.forEach(r=>{
    const b=H.el("button","g-btn"+(r.used?"":" ghost"),r.l,rk);
    b.style.minWidth="40px";b.style.fontSize="18px";
    if(r.used)b.disabled=true;
    b.addEventListener("click",()=>{
      if(over||r.used)return;
      r.used=true;built.push(r);H.sfx("tick");paint();
    });
  });
}
build();
const row=H.el("div","g-row",null,box);
H.btn(row,"↩️ Desfazer",()=>{
  if(over||!built.length)return;
  const r=built.pop();r.used=false;H.sfx("tick");paint();
},false);
H.btn(row,"✅ É palíndromo?",()=>{
  if(over)return;
  const w=built.map(b=>b.l).join("");
  const ok=w.length===rack.length&&w===w.split("").reverse().join("");
  if(ok){
    score+=w.length*20;H.score(score);hud.set("pt",score);H.sfx("ok");
    ri++;
    if(ri>=ROUNDS.length){over=true;return H.done({win:true,score:score+100,title:"Espelho verbal!",sub:"3 palíndromos perfeitos."});}
    say("Palíndromo! Próximo: "+ROUNDS[ri].length+" letras…");build();
  }else{H.sfx("bad");say("❌ Não espelha! Leia de trás pra frente.");}
},true);
}});"""

# 222 — Homófono
GAMES[222] = r"""/* NCODE N · 222 Homófono — 7/8! */
GREG(222,{
init(root,H){
const Q=[
 {s:"Ele ___ o carro na oficina.",o:["consertou","concertou"],a:0,h:"consertar=reparar"},
 {s:"A orquestra deu um lindo ___.",o:["conserto","concerto"],a:1,h:"concerto=música"},
 {s:"O remédio ___ efeito rápido.",o:["tem","têm"],a:0,h:"ele tem / eles têm"},
 {s:"Eles ___ muitos livros.",o:["tem","têm"],a:1,h:"eles têm"},
 {s:"Vou ___ praia amanhã.",o:["a","à","há"],a:1,h:"a + a = à (lugar)"},
 {s:"___ dois anos não o vejo.",o:["A","À","Há"],a:2,h:"há = tempo passado"},
 {s:"Ela ___ a porta com força.",o:["serrou","cerrou"],a:1,h:"cerrar=fechar"},
 {s:"O carpinteiro ___ a madeira.",o:["serrou","cerrou"],a:0,h:"serrar=cortar"}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Mesmo som, grafia diferente! Escolha a certa. 7/8 vence.");
const box=H.el("div","g-col",null,root);
function paint(){
  if(over||qi>=Q.length)return;
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","📝 "+Q[qi].s,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op,box);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");say("✅ "+Q[qi].h);}
      else{H.sfx("bad");say("❌ "+Q[qi].h);}
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Ouvido afiado!",sub:(score/50)+"/8 homófonos."});
        return H.done({win:false,score,title:"Quase lá!",sub:(score/50)+"/8 (precisa 7)."});
      }
      H.after(650,paint);
      box.innerHTML=H.el("div","g-msg","…",box).innerHTML;
    });
  });
}
paint();
}});"""

# 223 — Prefixo
GAMES[223] = r"""/* NCODE N · 223 Prefixo — 7/8! */
GREG(223,{
init(root,H){
const Q=[
 {r:"FAZER",o:["RE","DES","IN","TRANS"],ok:[0,1]},
 {r:"POR",o:["RE","PRO","A","EM"],ok:[0,1]},
 {r:"DIZER",o:["PRE","DES","RE","SOB"],ok:[0,1]},
 {r:"LER",o:["RE","DES","PRE","TRI"],ok:[0]},
 {r:"ESCREVER",o:["RE","SUB","DES","IN"],ok:[0,1]},
 {r:"CONTAR",o:["RE","DES","IN","SOB"],ok:[0,1]},
 {r:"NASCER",o:["RE","DES","PRE","A"],ok:[0]},
 {r:"CORTAR",o:["RE","DES","IN","SOB"],ok:[0]}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Escolha um <b>prefixo que forme palavra válida</b>! Pode haver mais de um certo. 7/8 vence.");
const box=H.el("div","g-col",null,root);
function paint(){
  if(over||qi>=Q.length)return;
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","🔤 ___ + <b>"+Q[qi].r+"</b>",box);
  const row=H.el("div","g-row",null,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op+"…",row);
    b.addEventListener("click",()=>{
      if(over)return;
      if(Q[qi].ok.includes(i)){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");
        say("✅ "+op.toLowerCase()+Q[qi].r.toLowerCase()+" existe!");
      }else{H.sfx("bad");say("❌ Não existe essa palavra!");}
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Prefixador!",sub:(score/50)+"/8 palavras."});
        return H.done({win:false,score,title:"Quase!",sub:(score/50)+"/8 (precisa 7)."});
      }
      H.after(700,paint);
    });
  });
}
paint();
}});"""

# 224 — Sufixo Rápido
GAMES[224] = r"""/* NCODE N · 224 Sufixo Rápido — vença a máquina 5×! */
GREG(224,{
init(root,H){
const Q=[
 {r:"RAPID",o:["AMENTE","OSO","ADA"],a:0},
 {r:"CANT",o:["OR","AGEM","ILHA"],a:0},
 {r:"LIVR",o:["ARIA","OSO","AGEM"],a:0},
 {r:"FLOR",o:["ISTA","ADA","EZA"],a:0},
 {r:"DENT",o:["ISTA","OSO","AGEM"],a:0},
 {r:"JORNAL",o:["EIRO","ISTA","ADA"],a:0},
 {r:"PEDR",o:["EIRO","OSO","ILHA"],a:0},
 {r:"CANT",o:["ORIA","AGEM","ILHA"],a:0}
];
let over=false,qi=0,pw=0,aw=0,aiT=0,aiMax=3;
const hud=H.hud(root,[["pl","VOCÊ",0],["ai","MÁQUINA",0],["rd","RODADA","1/8"]]);
const say=H.msg(root,"Clique no <b>sufixo certo</b> antes da máquina! Melhor de 8 (5+ vence).");
const box=H.el("div","g-col",null,root);
const o=H.cvs(root,440,60),x=o.x;
function paint(){
  hud.set("rd",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","🔤 <b>"+Q[qi].r+"</b> + ___",box);
  const row=H.el("div","g-row",null,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost","…"+op,row);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){pw++;hud.set("pl",pw);H.sfx("ok");say("⚡ Você! "+Q[qi].r.toLowerCase()+op.toLowerCase());}
      else{aw++;hud.set("ai",aw);H.sfx("bad");say("❌ Errado! Ponto da máquina.");}
      next();
    });
  });
  aiMax=2+Math.random()*3;aiT=0;
}
function next(){
  qi++;
  if(qi>=Q.length||pw>=5||aw>=5){
    over=true;
    if(pw>=5)return H.done({win:true,score:pw*60,title:"Dedos velozes!",sub:pw+"×"+aw+" contra a máquina."});
    return H.done({win:false,score:pw*60,title:"Máquina venceu!",sub:pw+"×"+aw+". Clique sem medo!"});
  }
  paint();
}
paint();
H.loop(dt=>{
  if(over)return;
  aiT+=dt;
  if(aiT>=aiMax){
    aw++;hud.set("ai",aw);H.sfx("bad");say("🤖 Máquina foi mais rápida! ("+aw+")");
    next();return;
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(10,20,o.W-20,20);
  x.fillStyle=H.C.terra;
  x.fillRect(10,20,(o.W-20)*aiT/aiMax,20);
  x.strokeStyle=H.C.ink;x.strokeRect(10,20,o.W-20,20);
  x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
  x.fillText("🤖 pensando…",14,14);
});
}});"""

# 225 — Metade do Ditado
GAMES[225] = r"""/* NCODE N · 225 Metade do Ditado — junte 6 palavras! */
GREG(225,{
init(root,H){
const WORDS=[["CA","SA"],["LI","VRO"],["GA","TO"],["JA","NELA"],["ES","COLA"],["FLO","RESTA"]];
let over=false,left=[],right=[],selL=-1,matched=0,err=0;
const hud=H.hud(root,[["pr","PARES","0/6"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Junte a <b>primeira metade</b> com a <b>segunda</b>! 6 palavras, 3 erros no máx.");
const box=H.el("div","g-row",null,root);
const lc=H.el("div","g-col",null,box),rc=H.el("div","g-col",null,box);
left=WORDS.map((w,i)=>i).sort(()=>Math.random()-.5);
right=WORDS.map((w,i)=>i).sort(()=>Math.random()-.5);
function paint(){
  lc.innerHTML="";rc.innerHTML="";
  left.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",lc);return;}
    const b=H.el("button","g-chip"+(selL===i?" hot":""),WORDS[i][0]+"…",lc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{selL=i;H.sfx("tick");paint();});
  });
  right.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",rc);return;}
    const b=H.el("button","g-chip","…"+WORDS[i][1],rc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||selL<0)return;
      if(i===selL){
        left[left.indexOf(selL)]=-1;right[right.indexOf(i)]=-1;
        selL=-1;matched++;H.score(matched*50);hud.set("pr",matched+"/6");H.sfx("ok");
        if(matched>=6){over=true;return H.done({win:true,score:400,title:"Ditado perfeito!",sub:"6 palavras remontadas."});}
      }else{
        err++;hud.set("er",err+"/3");H.sfx("bad");selL=-1;
        if(err>=3){over=true;return H.done({win:false,score:matched*50,title:"Ditado borrado!",sub:"3 erros."});}
      }
      paint();
    });
  });
}
paint();
}});"""

# 226 — Matemática de Letras
GAMES[226] = r"""/* NCODE N · 226 Matemática de Letras — A=1…Z=26! */
GREG(226,{
init(root,H){
const V=l=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(l)+1;
function val(w){return w.split("").reduce((a,l)=>a+V(l),0);}
const Q=[
 {q:"C + A",a:()=>V("C")+V("A")},
 {q:"GATO",a:()=>val("GATO")},
 {q:"SOL − LUA",a:()=>val("SOL")-val("LUA")},
 {q:"BOLA × 2",a:()=>val("BOLA")*2},
 {q:"MAR + RIO",a:()=>val("MAR")+val("RIO")},
 {q:"CÉU (C+E+U)",a:()=>V("C")+V("E")+V("U")},
 {q:"PAZ − DIA",a:()=>val("PAZ")-val("DIA")},
 {q:"FESTA ÷ 5",a:()=>Math.round(val("FESTA")/5)}
];
let over=false,qi=0,score=0,buf="";
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"A=1, B=2 … Z=26 (sem acento). Some as letras e responda! 6/8 vence.");
const box=H.el("div","g-col",null,root);
const qe=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  hud.set("qs",(qi+1)+"/8");
  qe.innerHTML="🔢 <b>"+Q[qi].q+"</b> = ?";
  cur.innerHTML="⌨️ "+(buf||"_");
}
paint();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Digit(\d)$/.exec(c);if(m){buf+=m[1];H.sfx("tick");paint();}
  if(c==="Backspace"){buf=buf.slice(0,-1);paint();}
  if(c==="Enter")ok();});
const nrow=H.el("div","g-row",null,box);
"1234567890".split("").forEach(n=>{
  const b=H.el("button","g-btn ghost",n,nrow);
  b.style.minWidth="36px";
  b.addEventListener("click",()=>{if(!over){buf+=n;H.sfx("tick");paint();}});
});
const row=H.el("div","g-row",null,box);
H.btn(row,"⌫",()=>{buf=buf.slice(0,-1);paint();},false);
H.btn(row,"✅ Responder",ok,true);
function ok(){
  if(over||!buf)return;
  if(parseInt(buf,10)===Q[qi].a()){
    score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");
  }else H.sfx("bad");
  qi++;buf="";
  if(qi>=Q.length){
    over=true;
    if(score>=300)return H.done({win:true,score:score+50,title:"Calculista verbal!",sub:(score/50)+"/8 contas."});
    return H.done({win:false,score,title:"Conta errada!",sub:(score/50)+"/8 (precisa 6)."});
  }
  paint();
}
}});"""

# 227 — Sopa de Letras Flutuante
GAMES[227] = r"""/* NCODE N · 227 Sopa de Letras Flutuante — pesque 5 palavras! */
GREG(227,{
init(root,H){
const WORDS=["SOPA","CALDO","MACARRAO","LEGUME","TEMPERO"];
let over=false,wi=0,chips=[],buf=[],time=150,score=0;
const hud=H.hud(root,[["pv","PALAVRAS","0/5"],["tp","TEMPO",150]]);
const say=H.msg(root,"Toque as letras flutuantes <b>na ordem</b> da palavra! Errou = recomeça a palavra. 5 palavras em 150s.");
const o=H.cvs(root,480,400),x=o.x;
const r=H.rng(Date.now()%10000);
function build(){
  buf=[];
  const w=WORDS[wi];
  chips=[];
  const letters=w.split("").concat(["A","E","O","S","R"].slice(0,3));
  letters.forEach(l=>{
    chips.push({l,x:40+r()*400,y:80+r()*280,vx:(r()-.5)*40,vy:(r()-.5)*40,got:false});
  });
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=chips.find(k=>!k.got&&Math.hypot(px-k.x,py-k.y)<22);
  if(!c)return;
  const want=WORDS[wi][buf.length];
  if(c.l===want){
    c.got=true;buf.push(c.l);H.sfx("tick");H.beep(400+buf.length*50,.06);
    if(buf.length>=WORDS[wi].length){
      wi++;score+=80;H.score(score);hud.set("pv",wi+"/5");H.sfx("ok");
      if(wi>=WORDS.length){over=true;return H.done({win:true,score:score+Math.floor(time),title:"Sopa pronta!",sub:"5 palavras pescadas na ordem."});}
      say("Palavra pescada! Próxima…");build();
    }
  }else{
    chips.forEach(k=>k.got=false);buf=[];H.sfx("bad");say("❌ Fora de ordem! Recomece "+WORDS[wi]+".");
  }
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Sopa esfriou!",sub:wi+"/5 palavras."});}
  chips.forEach(c=>{
    if(c.got)return;
    c.x+=c.vx*dt;c.y+=c.vy*dt;
    if(c.x<24||c.x>o.W-24)c.vx*=-1;
    if(c.y<64||c.y>o.H-24)c.vy*=-1;
    c.x=H.clamp(c.x,24,o.W-24);c.y=H.clamp(c.y,64,o.H-24);
  });
  x.fillStyle="#B06A1F";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A4F14";
  for(let i=0;i<20;i++){x.beginPath();x.arc((i*67)%o.W,(i*97)%o.H,3,0,7);x.fill();}
  x.fillStyle="#fff";x.font="bold 16px 'Space Mono',monospace";
  x.fillText("🎯 "+WORDS[wi]+"  ·  "+buf.join(""),14,28);
  x.font="bold 18px 'Space Mono',monospace";
  chips.forEach(c=>{
    if(c.got)return;
    x.fillStyle="#F4F1EB";
    x.beginPath();x.arc(c.x,c.y,19,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;
    x.fillText(c.l,c.x-7,c.y+7);
  });
});
}});"""

# 228 — Tabu de Palavras
GAMES[228] = r"""/* NCODE N · 228 Tabu de Palavras — 7/8! */
GREG(228,{
init(root,H){
const Q=[
 {d:"amarelo, azedo, fruta, suco",tab:["LIMÃO","AZEDO","FRUTA"],o:["LIMÃO","LARANJA","ABACAXI","MARACUJÁ"],a:0},
 {d:"voa, bico, penas, canta",tab:["PASSARINHO","VOAR","BICO"],o:["AVIÃO","PASSARINHO","MORCEGO","BORBOLETA"],a:1},
 {d:"frio, branco, derrete, verão",tab:["GELO","FRIO","ÁGUA"],o:["NEVE","GELO","GRANIZO","GEADA"],a:1},
 {d:"redondo, quica, gol, time",tab:["BOLA","FUTEBOL","GOL"],o:["BOLA","PIÃO","PETECA","DADO"],a:0},
 {d:"late, osso, melhor amigo",tab:["CACHORRO","LATIR","OSSO"],o:["GATO","CACHORRO","LOBO","RAPOSA"],a:1},
 {d:"páginas, história, ler, capa",tab:["LIVRO","LER","PÁGINA"],o:["REVISTA","JORNAL","LIVRO","CADERNO"],a:2},
 {d:"quente, areia, mar, protetor",tab:["PRAIA","MAR","AREIA"],o:["DESERTO","PRAIA","PISCINA","CACHOEIRA"],a:1},
 {d:"apita, trilhos, vagão, estação",tab:["TREM","TRILHO","VAGÃO"],o:["METRÔ","TREM","ÔNIBUS","BONDE"],a:1}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Adivinhe pela descrição — as palavras <b>tabu</b> não puderam ser usadas! 7/8 vence.");
const box=H.el("div","g-col",null,root);
function paint(){
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","🗣️ \""+Q[qi].d+"\"<br>🚫 tabu: "+Q[qi].tab.join(", "),box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op,box);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");}
      else H.sfx("bad");
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Mestre do Tabu!",sub:(score/50)+"/8 adivinhações."});
        return H.done({win:false,score,title:"Mímica falhou!",sub:(score/50)+"/8 (precisa 7)."});
      }
      paint();
    });
  });
}
paint();
}});"""

# 229 — Boggle Shake
GAMES[229] = r"""/* NCODE N · 229 Boggle Shake — 10 palavras conectadas! */
GREG(229,{
init(root,H){
const GRID=["C","A","T","O","A","R","E","I","S","O","L","A","M","E","S","A"];
const DICT=["ATO","SOL","SOLA","MESA","TER","OLEO","REI","LEIA","TIA","OITO","RATO","ERA","ARO","OLA","OLAS","MOLA","MOLAS","SELO","SELOS","TEIA","TEIAS","REAL","ROL","SOM"];
let over=false,found=[],chain=[],time=150,score=0;
const hud=H.hud(root,[["pv","PALAVRAS","0/10"],["tp","TEMPO",150],["pt","PONTOS",0]]);
const say=H.msg(root,"ARRASTE (ou toque em sequência) por letras <b>vizinhas</b> (8 direções, sem repetir)! Solte/toque ✅ para confirmar. 10 palavras!");
const o=H.cvs(root,400,440),x=o.x;
const CS=88,OX=24,OY=60;
const ptr=H.ptr(o);
let wasDown=false,dragging=false;
function cellAt(px,py){
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>3||c<0||c>3)return -1;
  return r*4+c;
}
function adj(a,b){
  const ar=(a/4)|0,ac=a%4,br=(b/4)|0,bc=b%4;
  return Math.abs(ar-br)<=1&&Math.abs(ac-bc)<=1&&a!==b;
}
function addCell(i){
  if(i<0||over)return;
  if(!chain.length){chain.push(i);H.sfx("tick");return;}
  if(chain[chain.length-1]===i)return;
  if(chain.includes(i)){
    if(chain.length>1&&chain[chain.length-2]===i){chain.pop();H.sfx("tick");}
    return;
  }
  if(adj(chain[chain.length-1],i)){chain.push(i);H.beep(350+chain.length*30,.05);}
}
function seal(){
  if(!chain.length)return;
  const w=chain.map(i=>GRID[i]).join("");
  if(w.length>=3&&DICT.includes(w)&&!found.includes(w)){
    found.push(w);score+=w.length*10;H.score(score);
    hud.set("pv",found.length+"/10");hud.set("pt",score);H.sfx("ok");
    if(found.length>=10){over=true;return H.done({win:true,score:score+100,title:"Boggle master!",sub:"10 palavras conectadas."});}
  }else H.sfx("bad");
  chain=[];
}
H.onTap(o,(px,py)=>{if(!dragging)addCell(cellAt(px,py));});
H.btn(root,"✅ Confirmar palavra",()=>{if(!over)seal();},false);
H.btn(root,"🗑️ Limpar",()=>{chain=[];H.sfx("tick");},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Tempo!",sub:found.length+"/10. Tente SOL, MESA, RATO…"});}
  if(ptr.down&&!wasDown){dragging=true;chain=[];addCell(cellAt(ptr.x,ptr.y));}
  if(dragging&&ptr.down)addCell(cellAt(ptr.x,ptr.y));
  if(dragging&&!ptr.down){dragging=false;seal();}
  wasDown=ptr.down;
  x.fillStyle="#2E6E8A";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";x.font="bold 15px 'Space Mono',monospace";
  x.fillText("🔤 "+chain.map(i=>GRID[i]).join("")+" ("+chain.length+")",20,32);
  x.fillText("📖 "+found.join(" "),20,o.H-12);
  for(let i=0;i<16;i++){
    const r=(i/4)|0,c=i%4;
    const on=chain.includes(i);
    x.fillStyle=on?H.C.wasabi:"#F4F1EB";
    x.fillRect(OX+c*CS+3,OY+r*CS+3,CS-6,CS-6);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(OX+c*CS+3,OY+r*CS+3,CS-6,CS-6);
    x.fillStyle=H.C.ink;x.font="bold 34px 'Space Mono',monospace";
    x.fillText(GRID[i],OX+c*CS+28,OY+r*CS+58);
    if(on){
      x.fillStyle=H.C.terra;x.font="bold 14px 'Space Mono',monospace";
      x.fillText(chain.indexOf(i)+1,OX+c*CS+8,OY+r*CS+24);
    }
  }
});
}});"""

# 230 — Criador de Siglas
GAMES[230] = r"""/* NCODE N · 230 Criador de Siglas — 5 siglas viram frases! */
GREG(230,{
init(root,H){
const SIG=["PNG","VASP","FOME","PAZ","LUA"];
let over=false,si=0,words=[],buf="",score=0;
const hud=H.hud(root,[["sg","SIGLA","1/5"],["pv","PALAVRAS","0/3"]]);
const say=H.msg(root,"Para cada letra da sigla, invente uma palavra (3+ letras) começando com ela! 5 siglas.");
const box=H.el("div","g-col",null,root);
const sg=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  hud.set("sg",(si+1)+"/5");hud.set("pv",words.length+"/"+SIG[si].length);
  sg.innerHTML="🔤 Sigla: <b style='font-size:24px'>"+SIG[si]+"</b> → "+(words.join(" ")||"…");
  cur.innerHTML="⌨️ palavra com <b>"+SIG[si][words.length]+"</b>: "+(buf||"_");
}
function feed(ch){if(!over){buf+=ch;H.sfx("tick");paint();}}
function back(){buf=buf.slice(0,-1);paint();}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function ok(){
  if(over||!buf)return;
  const b=norm(buf),want=SIG[si][words.length];
  if(b.length>=3&&b[0]===want){
    words.push(buf.toUpperCase());buf="";H.sfx("ok");paint();
    if(words.length>=SIG[si].length){
      score+=60;H.score(score);
      si++;words=[];buf="";
      if(si>=SIG.length){over=true;return H.done({win:true,score:score+100,title:"Siglador criativo!",sub:"5 siglas viraram frases."});}
      say("Sigla pronta! Próxima: "+SIG[si]);
    }
    paint();
  }else{H.sfx("bad");say("❌ 3+ letras começando com "+want+"!");buf="";paint();}
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)feed(m[1]);
  if(c==="Backspace")back();if(c==="Enter")ok();});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>feed(ch));
  });
});
const row=H.el("div","g-row",null,box);
H.btn(row,"⌫",back,false);
H.btn(row,"✅ Palavra!",ok,true);
paint();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
