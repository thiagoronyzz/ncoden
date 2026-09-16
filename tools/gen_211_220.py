#!/usr/bin/env python3
"""Gera games/g211..g220 — PALAVRAS (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 211 — Escada de Palavras
GAMES[211] = r"""/* NCODE N · 211 Escada de Palavras — 3 escadas letra a letra! */
GREG(211,{
init(root,H){
const LAD=[{a:"SOL",b:"MAR",max:5},{a:"LUA",b:"RUA",max:5},{a:"BOCA",b:"CASA",max:6}];
const DICT=["SOL","SAL","MAL","MAR","LUA","SUA","TUA","RUA","BOCA","BOLA","COLA","COTA","CASA","SUL","MIL","TAL","RATO","COLO","BOLO","CAPA","CASO","MALA","BALA","CALA","FALA","SOAR","SUAR"];
let over=false,li=0,chain=[],buf="";
const hud=H.hud(root,[["esc","ESCADA","1/3"],["ps","PASSOS","0/5"]]);
const say=H.msg(root,"Chegue ao alvo trocando <b>1 letra por vez</b> (palavras válidas)! Digite e confirme.");
const box=H.el("div","g-col",null,root);
const ch=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  const L=LAD[li];
  hud.set("esc",(li+1)+"/3");hud.set("ps",chain.length+"/"+L.max);
  ch.innerHTML="🪜 "+L.a+" → … → <b>"+L.b+"</b><br>"+chain.join(" → ");
  cur.innerHTML="⌨️ "+(buf||"_")+" ("+(buf.length)+"/"+L.a.length+")";
}
function diff1(a,b){
  if(a.length!==b.length)return false;
  let d=0;
  for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++;
  return d===1;
}
function feed(chr){
  if(over)return;
  const L=LAD[li];
  if(buf.length<L.a.length){buf+=chr;H.sfx("tick");paint();}
}
function back(){buf=buf.slice(0,-1);paint();}
function ok(){
  if(over||!buf)return;
  const L=LAD[li];
  const prev=chain.length?chain[chain.length-1]:L.a;
  if(buf.length!==L.a.length||!diff1(prev,buf)||!DICT.includes(buf)){
    H.sfx("bad");say("❌ Precisa: válida + 1 letra diferente de "+prev+"!");buf="";paint();return;
  }
  chain.push(buf);buf="";
  H.sfx("ok");paint();
  if(chain[chain.length-1]===L.b){
    H.score((li+1)*100);
    li++;chain=[];buf="";
    if(li>=LAD.length){over=true;return H.done({win:true,score:400,title:"Escalador de palavras!",sub:"3 escadas letra a letra."});}
    say("Escada pronta! Próxima: "+LAD[li].a+" → "+LAD[li].b);paint();return;
  }
  if(chain.length>=L.max){over=true;return H.done({win:false,score:li*100,title:"Degraus esgotados!",sub:"Escada "+(li+1)+" sem saída. Recomece do topo!"});}
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)feed(m[1]);
  if(c==="Backspace")back();if(c==="Enter")ok();});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(chr=>{
    const b=H.el("button","g-btn ghost",chr,row);
    b.style.minWidth="34px";
    b.addEventListener("click",()=>feed(chr));
  });
});
const row=H.el("div","g-row",null,box);
H.btn(row,"⌫",back,false);
H.btn(row,"✅ Confirmar",ok,true);
paint();
}});"""

# 212 — Anagrama
GAMES[212] = r"""/* NCODE N · 212 Anagrama — 10 palavras, 7 letras! */
GREG(212,{
init(root,H){
const RACK=["A","A","C","E","L","R","S"];
const DICT=["CASA","ESCALA","CARA","LARA","CELA","ARCA","CALA","RALA","LACA","SALA","AREA","ACESA","LASCA","ARCAS","RALAS","CALAS","CARAS","LACAS"];
let over=false,found=[],buf="",used=[],time=150;
const hud=H.hud(root,[["pv","PALAVRAS","0/10"],["tp","TEMPO",150],["pt","PONTOS",0]]);
const say=H.msg(root,"Toque as letras (ou digite) para formar palavras (3+ letras)! 10 diferentes em 150s.");
const box=H.el("div","g-col",null,root);
const cur=H.el("div","g-msg","",box);
const rk=H.el("div","g-row",null,box);
const fd=H.el("div","g-msg","",box);
let score=0;
function paint(){
  cur.innerHTML="⌨️ "+(buf||"_");
  rk.innerHTML="";
  RACK.forEach((l,i)=>{
    const b=H.el("button","g-btn"+(used.includes(i)?"":" ghost"),l,rk);
    b.style.minWidth="40px";b.style.fontSize="18px";
    if(used.includes(i))b.disabled=true;
    b.addEventListener("click",()=>pick(i));
  });
  fd.innerHTML="📖 "+(found.join(" · ")||"nada ainda…");
}
function pick(i){
  if(over||used.includes(i))return;
  used.push(i);buf+=RACK[i];H.sfx("tick");paint();
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(!m)return;
  const i=RACK.findIndex((l,j)=>l===m[1]&&!used.includes(j));
  if(i>=0)pick(i);});
paint();
const row=H.el("div","g-row",null,box);
H.btn(row,"⌫",()=>{if(!over){used.pop();buf=buf.slice(0,-1);paint();}},false);
H.btn(row,"🔀",()=>{if(!over){used=[];buf="";paint();}},false);
H.btn(row,"✅ Enviar",()=>{
  if(over||!buf)return;
  if(buf.length>=3&&DICT.includes(buf)&&!found.includes(buf)){
    found.push(buf);score+=buf.length*10;H.score(score);
    hud.set("pv",found.length+"/10");hud.set("pt",score);H.sfx("ok");
    if(found.length>=10){over=true;return H.done({win:true,score:score+100,title:"Anagramista!",sub:"10 palavras com 7 letras."});}
  }else H.sfx("bad");
  used=[];buf="";paint();
},true);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Tempo!",sub:"Só "+found.length+"/10. Tente ESCALA, CASA, CARA…"});}
});
}});"""

# 213 — Cruzadinha Relâmpago
GAMES[213] = r"""/* NCODE N · 213 Cruzadinha Relâmpago — 3 palavras, 90s! */
GREG(213,{
init(root,H){
const WORDS=[
 {n:"1A",clue:"Estrela do dia",cells:[[0,0],[0,1],[0,2]],w:"SOL"},
 {n:"2A",clue:"Pronome: dele → …",cells:[[2,0],[2,1],[2,2]],w:"SUA"},
 {n:"1D",clue:"Satélite natural",cells:[[0,2],[1,2],[2,2]],w:"LUA"}
];
let over=false,grid={},sel=null,time=90;
const hud=H.hud(root,[["tp","TEMPO",90],["ok","CERTAS","0/3"]]);
const say=H.msg(root,"Clique na célula e digite a letra! Complete as 3 palavras em 90s.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(3,52px)";
const cells=[[0,0],[0,1],[0,2],[1,2],[2,0],[2,1],[2,2]];
function key(r,c){return r+","+c;}
function paint(){
  board.innerHTML="";
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const on=cells.some(k=>k[0]===r&&k[1]===c);
    if(!on){H.el("div","g-cell",null,board).style.background="#222";continue;}
    const k=key(r,c);
    const d=H.el("button","g-cell"+(sel===k?" sel":""),grid[k]||"",board);
    d.style.width="52px";d.style.height="52px";d.style.fontSize="22px";
    d.addEventListener("click",()=>{sel=k;H.sfx("tick");paint();});
  }
  const ok=WORDS.filter(w=>w.cells.every((cell,i)=>grid[key(cell[0],cell[1])]===w.w[i])).length;
  hud.set("ok",ok+"/3");
  if(ok>=3&&!over){over=true;H.score(200+Math.floor(time)*2);
    return H.done({win:true,score:200+Math.floor(time)*2+100,title:"Cruzadista relâmpago!",sub:"3/3 com "+Math.ceil(time)+"s de sobra."});}
}
WORDS.forEach(w=>H.el("div","g-chip","<b>"+w.n+"</b> "+w.clue+" ("+w.w.length+")",root));
paint();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over||!sel)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(m){grid[sel]=m[1];H.sfx("tick");paint();}});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,root);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>{if(sel&&!over){grid[sel]=ch;H.sfx("tick");paint();}});
  });
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:0,title:"Relógio venceu!",sub:"Faltaram palavras. Leia as dicas!"});}
});
}});"""

# 214 — Forca Clássica
GAMES[214] = r"""/* NCODE N · 214 Forca Clássica — salve o boneco! */
GREG(214,{
init(root,H){
const WORDS=["GATO","CASA","LIVRO","JANELA","ESCOLA","AMIGO","CACHORRO","FLORESTA","JANELA","TREM","PRAIA","MUSICA"];
let over=false,word="",used=[],err=0,wi=0,score=0;
const hud=H.hud(root,[["pv","PALAVRA","1/3"],["er","ERROS","0/6"]]);
const say=H.msg(root,"Adivinhe 3 palavras! 6 erros por palavra enforcam. Teclado ou botões.");
const box=H.el("div","g-col",null,root);
const wd=H.el("div","g-msg","",box);
const o=H.cvs(root,300,260),x=o.x;
function pick(){
  word=WORDS[Math.floor(Math.random()*WORDS.length)];
  used=[];err=0;
  hud.set("pv",(wi+1)+"/3");
  paint();
}
function paint(){
  hud.set("er",err+"/6");
  wd.innerHTML="<b style='font-size:26px;letter-spacing:6px'>"+word.split("").map(l=>used.includes(l)?l:"_").join("")+"</b><br>usadas: "+(used.join(" ")||"—");
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=5;
  x.beginPath();x.moveTo(60,240);x.lineTo(60,20);x.lineTo(180,20);x.lineTo(180,50);x.stroke();
  x.lineWidth=4;
  const parts=[
    ()=>{x.beginPath();x.arc(180,75,25,0,7);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,100);x.lineTo(180,170);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,120);x.lineTo(140,150);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,120);x.lineTo(220,150);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,170);x.lineTo(145,220);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,170);x.lineTo(215,220);x.stroke();}
  ];
  for(let i=0;i<err;i++)parts[i]();
  if(word.split("").every(l=>used.includes(l))){
    wi++;score+=100;H.score(score);H.sfx("ok");
    if(wi>=3){over=true;return H.done({win:true,score:score+100,title:"Forca vencida!",sub:"3 palavras sem enforcar ninguém."});}
    say("Palavra certa! Próxima…");pick();return;
  }
}
function guess(l){
  if(over||used.includes(l))return;
  used.push(l);
  if(!word.includes(l)){err++;H.sfx("bad");}
  else H.sfx("tick");
  if(err>=6){over=true;paint();
    return H.done({win:false,score,title:"Enforcou!",sub:"A palavra era "+word+". Vogais primeiro!"});
  }
  paint();
}
pick();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)guess(m[1]);});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>guess(ch));
  });
});
}});"""

# 215 — Caça-Palavras
GAMES[215] = r"""/* NCODE N · 215 Caça-Palavras — 6 escondidas! */
GREG(215,{
init(root,H){
const N=10,WORDS=["SOL","LUA","MAR","GATO","FLOR","RIO"];
let over=false,grid=[],placed=[],found=[],drag=null,time=180;
const hud=H.hud(root,[["pv","PALAVRAS","0/6"],["tp","TEMPO",180]]);
const say=H.msg(root,"ARRASTE sobre as letras (ou toque início + fim) para marcar as 6 palavras!");
const o=H.cvs(root,420,420),x=o.x;
const CS=40,OX=10,OY=10;
function build(){
  const r=H.rng(Date.now()%100000);
  grid=new Array(N*N).fill("");
  placed=[];
  const DIRS=[[1,0],[0,1],[1,1],[1,-1],[-1,0],[0,-1],[-1,-1],[-1,1]];
  for(const w of WORDS){
    let ok=false;
    for(let t=0;t<200&&!ok;t++){
      const d=DIRS[Math.floor(r()*8)];
      const rr=Math.floor(r()*N),cc=Math.floor(r()*N);
      const er=rr+d[0]*(w.length-1),ec=cc+d[1]*(w.length-1);
      if(er<0||er>=N||ec<0||ec>=N)continue;
      let fit=true;
      for(let i=0;i<w.length;i++){
        const g=grid[(rr+d[0]*i)*N+cc+d[1]*i];
        if(g&&g!==w[i]){fit=false;break;}
      }
      if(!fit)continue;
      for(let i=0;i<w.length;i++)grid[(rr+d[0]*i)*N+cc+d[1]*i]=w[i];
      placed.push(w);ok=true;
    }
  }
  const ABC="ABCDEFGHILMNOPQRSTUVXZ";
  for(let i=0;i<N*N;i++)if(!grid[i])grid[i]=ABC[Math.floor(Math.random()*ABC.length)];
}
build();
const ptr=H.ptr(o);
function cellAt(px,py){
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>=N||c<0||c>=N)return null;
  return{r,c};
}
function lineCells(a,b){
  const dr=Math.sign(b.r-a.r),dc=Math.sign(b.c-a.c);
  if(dr!==0&&dc!==0&&Math.abs(b.r-a.r)!==Math.abs(b.c-a.c))return[];
  const cells=[];let r=a.r,c=a.c;
  for(let i=0;i<24;i++){cells.push({r,c});if(r===b.r&&c===b.c)break;r+=dr;c+=dc;}
  return cells;
}
let tapStart=null;
H.onTap(o,(px,py)=>{
  if(over)return;
  const cl=cellAt(px,py);
  if(!cl)return;
  if(!tapStart){tapStart=cl;H.sfx("tick");}
  else{finish(tapStart,cl);tapStart=null;}
});
let wasDown=false;
function finish(a,b){
  const cells=lineCells(a,b);
  if(cells.length<2)return;
  const w=cells.map(k=>grid[k.r*N+k.c]).join("");
  const rev=w.split("").reverse().join("");
  const hit=WORDS.find(k=>(k===w||k===rev)&&!found.includes(k));
  if(hit){
    found.push(hit);H.score(found.length*50);hud.set("pv",found.length+"/6");H.sfx("ok");
    say("✅ "+hit+"! ("+found.length+"/6)");
    if(found.length>=WORDS.length){over=true;
      return H.done({win:true,score:300+Math.floor(time),title:"Olho de lince!",sub:"6 palavras encontradas."});}
  }else H.sfx("bad");
}
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:found.length*50,title:"Tempo!",sub:found.length+"/6. Procure na horizontal e vertical!"});}
  if(ptr.down&&!wasDown){const cl=cellAt(ptr.x,ptr.y);if(cl)drag={a:cl,b:cl};}
  if(drag&&ptr.down){const cl=cellAt(ptr.x,ptr.y);if(cl)drag.b=cl;}
  if(drag&&!ptr.down){finish(drag.a,drag.b);drag=null;tapStart=null;}
  wasDown=ptr.down;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  // destaca encontradas
  x.font="bold 20px 'Space Mono',monospace";
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.fillStyle=H.C.ink;
    x.fillText(grid[r*N+c],OX+c*CS+11,OY+r*CS+28);
  }
  // linha do arrasto
  const cur=drag||(tapStart?{a:tapStart,b:cellAt(ptr.x,ptr.y)||tapStart}:null);
  if(cur){
    const cells=lineCells(cur.a,cur.b);
    x.fillStyle="rgba(196,214,69,.5)";
    cells.forEach(k=>x.fillRect(OX+k.c*CS,OY+k.r*CS,CS,CS));
  }
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("faltam: "+WORDS.filter(w=>!found.includes(w)).join(" "),12,o.H-8);
});
}});"""

# 216 — Rima Rápida
GAMES[216] = r"""/* NCODE N · 216 Rima Rápida — 6 rimas em 30s! */
GREG(216,{
init(root,H){
const SETS=[
 {w:"AMOR",ok:["DOR","FLOR","CALOR","VALOR","SABOR","HUMOR","CLAMOR","TORPOR","ODOR","RIGOR","TAMBOR","VIGOR"]},
 {w:"CASA",ok:["ASA","BRASA","ATRASA","VAZA","ARRAZA","EXTRAVASA"]},
 {w:"MAR",ok:["PAR","LUAR","OLHAR","JANTAR","CANTAR","SONHAR","AMAR","LUGAR"]}
];
let over=false,si=0,found=[],buf="",time=30,score=0;
const hud=H.hud(root,[["rm","RIMAS","0/6"],["tp","TEMPO",30],["al","ALVO","AMOR"]]);
const say=H.msg(root,"Digite palavras que rimam com o alvo! 6 rimas em 30s. Troque de alvo quando quiser.");
const box=H.el("div","g-col",null,root);
const cur=H.el("div","g-msg","",box);
const fd=H.el("div","g-msg","",box);
function paint(){
  hud.set("al",SETS[si].w);
  cur.innerHTML="⌨️ "+(buf||"_");
  fd.innerHTML="📖 "+(found.join(" · ")||"—");
}
function feed(ch){
  if(over)return;
  buf+=ch;H.sfx("tick");paint();
}
function back(){buf=buf.slice(0,-1);paint();}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function ok(){
  if(over||!buf)return;
  const b=norm(buf);
  if(b.length>=2&&SETS[si].ok.includes(b)&&!found.includes(b)){
    found.push(b);score+=50;H.score(score);
    hud.set("rm",found.length+"/6");H.sfx("ok");
    if(found.length>=6){over=true;return H.done({win:true,score:score+Math.floor(time)*5+100,title:"Poeta veloz!",sub:"6 rimas em "+(30-Math.ceil(time))+"s!"});}
  }else H.sfx("bad");
  buf="";paint();
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
H.btn(row,"✅ Rima!",ok,true);
H.btn(row,"🎯 Trocar alvo",()=>{if(!over){si=(si+1)%SETS.length;paint();H.sfx("tick");}},false);
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Tempo!",sub:"Só "+found.length+"/6 rimas. Para AMOR: DOR, FLOR, CALOR…"});}
});
}});"""

# 217 — Par de Sinônimos
GAMES[217] = r"""/* NCODE N · 217 Par de Sinônimos — 6 pares! */
GREG(217,{
init(root,H){
const PAIRS=[["FELIZ","ALEGRE"],["RÁPIDO","VELOZ"],["CASA","LAR"],["COMEÇAR","INICIAR"],["BONITO","BELO"],["FIM","TÉRMINO"]];
let over=false,left=[],right=[],selL=-1,matched=0,err=0;
const hud=H.hud(root,[["pr","PARES","0/6"],["er","ERROS","0/4"]]);
const say=H.msg(root,"Clique numa palavra da esquerda e na sua <b>sinônima</b> da direita! 6 pares, 4 erros no máx.");
const box=H.el("div","g-row",null,root);
const lc=H.el("div","g-col",null,box),rc=H.el("div","g-col",null,box);
left=PAIRS.map((p,i)=>i).sort(()=>Math.random()-.5);
right=PAIRS.map((p,i)=>i).sort(()=>Math.random()-.5);
function paint(){
  lc.innerHTML="";rc.innerHTML="";
  left.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",lc);return;}
    const b=H.el("button","g-chip"+(selL===i?" hot":""),PAIRS[i][0],lc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{selL=i;H.sfx("tick");paint();});
  });
  right.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",rc);return;}
    const b=H.el("button","g-chip",PAIRS[i][1],rc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||selL<0)return;
      if(i===selL){
        left[left.indexOf(selL)]=-1;right[right.indexOf(i)]=-1;
        selL=-1;matched++;H.score(matched*50);hud.set("pr",matched+"/6");H.sfx("ok");
        if(matched>=6){over=true;return H.done({win:true,score:400,title:"Vocabulário rico!",sub:"6 pares de sinônimos!"});}
      }else{
        err++;hud.set("er",err+"/4");H.sfx("bad");selL=-1;
        if(err>=4){over=true;return H.done({win:false,score:matched*50,title:"Confusão!",sub:"4 erros. Leia com calma!"});}
      }
      paint();
    });
  });
}
paint();
}});"""

# 218 — Abelha Soletrando
GAMES[218] = r"""/* NCODE N · 218 Abelha Soletrando — 6 palavras soletradas! */
GREG(218,{
init(root,H){
const WORDS=["ABELHA","MEL","COLMEIA","FLOR","ZUMBIDO","CERA"];
let over=false,wi=0,buf="",show=3,strikes=0,score=0;
const hud=H.hud(root,[["pv","PALAVRA","1/6"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Decore a palavra (3s), depois <b>soletre letra por letra</b>! 3 erros no total = fim.");
const box=H.el("div","g-col",null,root);
const wd=H.el("div","g-msg","",box);
function paint(){
  hud.set("pv",(wi+1)+"/6");
  if(show>0)wd.innerHTML="🐝 Decore: <b style='font-size:26px'>"+WORDS[wi]+"</b> ("+Math.ceil(show)+"s)";
  else wd.innerHTML="🐝 Soletre: <b style='font-size:26px'>"+buf+"</b> ("+buf.length+"/"+WORDS[wi].length+")";
}
function feed(ch){
  if(over||show>0)return;
  const want=WORDS[wi][buf.length];
  if(ch===want){
    buf+=ch;H.sfx("tick");
    if(buf.length>=WORDS[wi].length){
      wi++;score+=60;H.score(score);buf="";show=3;H.sfx("ok");
      if(wi>=WORDS.length){over=true;return H.done({win:true,score:score+100,title:"Abelha rainha!",sub:"6 palavras soletradas de cor."});}
      say("Certa! Decore a próxima…");
    }
  }else{
    strikes++;hud.set("er",strikes+"/3");H.sfx("bad");
    if(strikes>=3){over=true;return H.done({win:false,score,title:"Enxame confuso!",sub:"3 erros de soletração."});}
    say("❌ Letra errada! ("+strikes+"/3) Recomece a palavra.");
    buf="";
  }
  paint();
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)feed(m[1]);});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>feed(ch));
  });
});
paint();
H.loop(dt=>{
  if(over)return;
  if(show>0){show-=dt;if(Math.random()<dt*4)paint();}
});
}});"""

# 219 — Corrente de Palavras
GAMES[219] = r"""/* NCODE N · 219 Corrente de Palavras — 10 elos! */
GREG(219,{
init(root,H){
let over=false,chain=["CASA"],buf="",time=20,score=0;
const hud=H.hud(root,[["el","ELOS","1/10"],["tp","PRAZO",20],["lt","LETRA","A"]]);
const say=H.msg(root,"Cada palavra começa com a <b>última letra</b> da anterior (4+ letras, sem repetir)! 10 elos, 20s cada.");
const box=H.el("div","g-col",null,root);
const ch=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  const last=chain[chain.length-1];
  hud.set("el",chain.length+"/10");hud.set("lt",last[last.length-1]);
  ch.innerHTML="🔗 "+chain.join(" → ");
  cur.innerHTML="⌨️ "+(buf||"_");
}
function feed(chr){if(!over){buf+=chr;H.sfx("tick");paint();}}
function back(){buf=buf.slice(0,-1);paint();}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function ok(){
  if(over||!buf)return;
  const b=norm(buf),last=norm(chain[chain.length-1]);
  if(b.length>=4&&b[0]===last[last.length-1]&&!chain.includes(b)){
    chain.push(b);score+=40;H.score(score);buf="";time=20;H.sfx("ok");paint();
    if(chain.length>=10){over=true;return H.done({win:true,score:score+100,title:"Corrente forte!",sub:"10 elos sem quebrar."});}
  }else{H.sfx("bad");say("❌ Comece com "+last[last.length-1]+", 4+ letras, sem repetir!");buf="";paint();}
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
H.btn(row,"✅ Elo!",ok,true);
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Elo perdido!",sub:chain.length+"/10 elos."});}
});
}});"""

# 220 — Complete a Frase
GAMES[220] = r"""/* NCODE N · 220 Complete a Frase — 7/8! */
GREG(220,{
init(root,H){
const Q=[
 {s:"O gato ___ no sofá.",o:["dorme","dormem","dormir","dormiu ontem à"],a:0},
 {s:"Ela ___ um livro ontem.",o:["ler","leu","lêem","lido"],a:1},
 {s:"Nós ___ ao parque amanhã.",o:["vamos","vão","ir","fomos"],a:0},
 {s:"O plural de 'cidadão' é ___.",o:["cidadãos","cidadões","cidadães","cidadans"],a:0},
 {s:"Que horas ___? ",o:["é","são","está","tem"],a:1},
 {s:"Ele é ___ aluno da turma.",o:["o melhor","o mais melhor","mais bom","o bom maior"],a:0},
 {s:"___ muita gente na festa.",o:["Havia","Haviam","Hão","Haveram"],a:0},
 {s:"Vou ___ praia no verão.",o:["à","a","para a","na"],a:0}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Escolha a palavra certa! 7/8 para vencer.");
const box=H.el("div","g-col",null,root);
function paint(){
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","📝 "+Q[qi].s,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op,box);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");}
      else H.sfx("bad");
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Gramático!",sub:(score/50)+"/8 frases perfeitas."});
        return H.done({win:false,score,title:"Revisão pendente!",sub:(score/50)+"/8 (precisa 7)."});
      }
      paint();
    });
  });
}
paint();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
