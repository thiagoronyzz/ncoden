#!/usr/bin/env python3
"""Gera games/g101..g110 — ESTRATÉGIA (parte 3)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 101 — Biblioteca Viva
GAMES[101] = r"""/* NCODE N · 101 Biblioteca Viva — ordene as lombadas */
GREG(101,{
init(root,H){
let round=1,books=[],moves=0,sel=-1,over=false;
const hud=H.hud(root,[["sl","SALA","1/3"],["mv","TROCAS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique em dois livros para trocar de lugar. Ordene do <b>mais baixo ao mais alto</b>!");
const o=H.cvs(root,500,300),x=o.x;
let sc=0;
function build(){
  const n=4+round;
  const r=H.rng(round*7+1);
  books=[];
  for(let i=0;i<n;i++)books.push({h:60+Math.floor(r()*130),c:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F","#7A6A53"][i%5]});
  if(books.every((b,i,a)=>i===0||a[i-1].h<=b.h)){const t=books[0];books[0]=books[n-1];books[n-1]=t;}
  moves=0;sel=-1;
  hud.set("sl",round+"/3");hud.set("mv","0/"+(n+3));
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  const n=books.length,w=o.W/n,i=Math.floor(px/w);
  if(i<0||i>=n)return;
  if(sel<0){sel=i;H.sfx("tick");return;}
  if(sel===i){sel=-1;return;}
  const t=books[sel];books[sel]=books[i];books[i]=t;
  sel=-1;moves++;H.sfx("tick");
  hud.set("mv",moves+"/"+(n+3));
  if(books.every((b,j,a)=>j===0||a[j-1].h<=b.h)){
    sc+=100;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    round++;
    if(round>3){over=true;return H.done({win:true,score:sc+100,title:"Biblioteca em ordem!",sub:"3 salas catalogadas por altura."});}
    say("Sala organizada! +100. Próxima: mais livros.");
    H.after(600,build);return;
  }
  if(moves>=n+3){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Bagunça demais!",sub:"Trocas esgotadas na sala "+round+". Planeje antes!"});}
});
H.loop(()=>{
  const n=books.length,w=o.W/n;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#7A6A53";x.fillRect(0,o.H-24,o.W,24);
  books.forEach((b,i)=>{
    x.fillStyle=sel===i?H.C.wasabi:b.c;
    x.fillRect(i*w+4,o.H-24-b.h,w-8,b.h);
    x.strokeStyle=H.C.ink;x.lineWidth=sel===i?3:1;
    x.strokeRect(i*w+4,o.H-24-b.h,w-8,b.h);
  });
});
}});"""

# 102 — Encanador Hidráulico
GAMES[102] = r"""/* NCODE N · 102 Encanador Hidráulico — gire e conecte */
GREG(102,{
init(root,H){
const LV=[{n:5},{n:6}];
let lv=0,n=5,grid=[],over=false;
const hud=H.hud(root,[["nv","FASE","1/2"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos canos para <b>girar</b>. Ligue a 💧 fonte (esquerda) ao 🏁 ralo (direita) sem vazamento!");
const o=H.cvs(root,440,440),x=o.x;
let sc=0;
// tipo: 0 reto (|), 1 cotovelo. rot 0..3. aberturas [N,L,S,O]
function opens(t,r){
  const base=t===0?[[0,-1],[0,1]]:[[-1,0],[0,1]];
  return base.map(d=>{
    let[dr,dc]=d;
    for(let i=0;i<r;i++){const t2=dr;dr=dc;dc=-t2;}
    return[dr,dc];
  });
}
function build(){
  n=LV[lv].n;
  const r=H.rng(lv*13+5);
  grid=[];
  for(let i=0;i<n*n;i++)grid.push({t:r()<.5?0:1,r:Math.floor(r()*4)});
  // esculpe um caminho garantido: serpenteia linha 0..n-1 alternando
  let rr=0,cc=0;
  const path=[[0,0]];
  while(cc<n-1||rr<n-1){
    if(cc<n-1&&(rr===n-1||r()<.7)){cc++;}else{rr++;}
    path.push([rr,cc]);
  }
  for(let i=0;i<path.length;i++){
    const[pr,pc]=path[i];
    const prev=i>0?path[i-1]:[pr,pc-1],next=i<path.length-1?path[i+1]:[pr,pc+1];
    const d1=[pr-prev[0],pc-prev[1]],d2=[next[0]-pr,next[1]-pc];
    const key2=d1.join()+"/"+d2.join();
    const straight=(d1[0]===-d2[0]&&d1[1]===-d2[1]);
    const cell=grid[pr*n+pc];
    if(straight){cell.t=0;cell.r=(d1[0]!==0)?0:1;}
    else{
      cell.t=1;
      const set=new Set([d1.join(),d2.join()]);
      cell.r=set.has("-1,0")&&set.has("0,1")?0:set.has("0,1")&&set.has("1,0")?1:set.has("1,0")&&set.has("0,-1")?2:3;
    }
    cell.r=(cell.r+1+Math.floor(r()*3))%4; // embaralha
  }
  hud.set("nv",(lv+1)+"/2");
  say("Fase "+(lv+1)+": gire os canos e teste a água!");
}
build();
const s=()=>Math.floor(Math.min(o.W,o.H)/n);
H.onTap(o,(px,py)=>{
  if(over)return;
  const ss=s(),c=Math.floor(px/ss),rr2=Math.floor(py/ss);
  if(rr2<0||rr2>=n||c<0||c>=n)return;
  const cell=grid[rr2*n+c];
  cell.r=(cell.r+1)%4;H.sfx("tick");
});
function test(){
  if(over)return;
  // fonte entra pela esquerda de (0,0); ralo sai à direita de (n-1,n-1)
  const seen=new Set(["0,0"]);
  const q=[[0,0]];
  let leak=false;
  while(q.length){
    const[rr,cc]=q.pop();
    const cell=grid[rr*n+cc];
    for(const[dr,dc]of opens(cell.t,cell.r)){
      const nr=rr+dr,nc=cc+dc;
      if(nr<0||nr>=n||nc<0||nc>=n){
        if(!(rr===0&&cc===0&&dc===-1)&&!(rr===n-1&&cc===n-1&&dc===1))leak=true;
        continue;
      }
      const nb=grid[nr*n+nc];
      const back=nb&&opens(nb.t,nb.r).some(d=>d[0]===-dr&&d[1]===-dc);
      if(!back){leak=true;continue;}
      const k=nr+","+nc;
      if(!seen.has(k)){seen.add(k);q.push([nr,nc]);}
    }
  }
  const first=grid[0],last=grid[n*n-1];
  const inOk=opens(first.t,first.r).some(d=>d[0]===0&&d[1]===-1);
  const outOk=opens(last.t,last.r).some(d=>d[0]===0&&d[1]===1);
  if(inOk&&outOk&&seen.has((n-1)+","+(n-1))&&!leak){
    sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    lv++;
    if(lv>=LV.length){over=true;return H.done({win:true,score:sc+100,title:"Sem vazamentos!",sub:"2 redes conectadas da fonte ao ralo."});}
    H.after(500,build);
  }else{
    H.sfx("bad");
    say(!seen.has((n-1)+","+(n-1))?"💧 A água não chegou ao ralo!":"🚿 Chegou, mas há vazamento! Feche as pontas abertas.");
  }
}
H.loop(()=>{
  const ss=s();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let rr=0;rr<n;rr++)for(let cc=0;cc<n;cc++){
    const cell=grid[rr*n+cc];
    const cx=cc*ss+ss/2,cy=rr*ss+ss/2;
    x.strokeStyle=H.C.cement;x.strokeRect(cc*ss+1,rr*ss+1,ss-2,ss-2);
    x.strokeStyle="#2E6E8A";x.lineWidth=Math.max(5,ss*.18);x.lineCap="round";
    x.beginPath();x.moveTo(cx,cy);
    for(const[dr,dc]of opens(cell.t,cell.r))x.lineTo(cx+dc*ss/2,cy+dr*ss/2);
    x.moveTo(cx,cy);x.stroke();
    x.fillStyle="#2E6E8A";x.beginPath();x.arc(cx,cy,Math.max(3,ss*.09),0,7);x.fill();
  }
  x.font="20px serif";
  x.fillText("💧",2,ss/2+8);
  x.fillText("🏁",o.W-28,o.H-12);
});
H.btn(root,"💧 Testar água",test,true);
}});"""

# 103 — Mural Elétrico
GAMES[103] = r"""/* NCODE N · 103 Mural Elétrico — acenda todas as lâmpadas */
GREG(103,{
init(root,H){
const PANELS=[
 {sw:[[0,1,2],[3,4,5],[6,7,8]],nm:["▬ topo","▬ meio","▬ base"]},
 {sw:[[0,4,8],[2,4,6],[1,4,7]],nm:["╲ diag","╱ diag","＋ coluna"]},
 {sw:[[0,1,3,4],[1,2,4,5],[3,4,6,7],[4,5,7,8]],nm:["◰","◱","◳","◲"]}
];
let p=0,bulbs=[],over=false,moves=0;
const hud=H.hud(root,[["pn","PAINEL","1/3"],["mv","TOQUES",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Cada interruptor alterna um grupo de lâmpadas (veja o símbolo). Acenda as <b>9</b>!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(3,1fr)";
board.style.width="min(100%,260px)";
const row=H.el("div","g-row",null,root);
let sc=0;
function build(){
  const P=PANELS[p];
  bulbs=new Array(9).fill(true);
  const sol=P.sw.map(()=>Math.random()<.5);
  sol.forEach((on,i)=>{if(on)P.sw[i].forEach(b=>bulbs[b]=!bulbs[b]);});
  if(bulbs.every(Boolean))bulbs[4]=false;
  moves=0;hud.set("pn",(p+1)+"/3");hud.set("mv",0);
  paint();
}
function paint(){
  board.innerHTML="";
  bulbs.forEach((b,i)=>{
    const d=H.el("div","g-cell"+(b?" good":""),null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    d.textContent=b?"💡":"⚫";
  });
  row.innerHTML="";
  PANELS[p].sw.forEach((s,i)=>{
    const btn=H.el("button","g-btn ghost",PANELS[p].nm[i],row);
    btn.addEventListener("click",()=>{
      if(over)return;
      s.forEach(b=>bulbs[b]=!bulbs[b]);
      moves++;hud.set("mv",moves);H.sfx("tick");paint();
      if(bulbs.every(Boolean)){
        sc+=120;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        p++;
        if(p>=PANELS.length){over=true;return H.done({win:true,score:sc+80,title:"Mural iluminado!",sub:"3 painéis acesos com lógica."});}
        say("Painel aceso! +120. Próximo: grupos diagonais/blocos.");
        H.after(600,build);
      }
    });
  });
}
build();
}});"""

# 104 — Jornal da Manhã
GAMES[104] = r"""/* NCODE N · 104 Jornal da Manhã — monte a manchete sem erros */
GREG(104,{
init(root,H){
const EDS=[
 {w:["CIDADE","INAUGURA","NOVO","PARQUE","CENTRAL"],bad:["PARQEU","INAUGURO"]},
 {w:["TIME","LOCAL","VENCE","FINAL","HISTÓRICA"],bad:["VENCCE","HISTORIA"]},
 {w:["CHUVA","FORTE","ATINGE","SERRA","HOJE"],bad:["XUVA","ATINJE"]}
];
let e=0,order=[],left=[],over=false,time=45,strikes=0,done=false;
const hud=H.hud(root,[["ed","EDIÇÃO","1/3"],["tp","TEMPO",45],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique as palavras <b>na ordem certa</b>. Palavras com erro de grafia são isca — não toque!");
const line=H.el("div","g-msg","—",root);
const pool=H.el("div","g-row",null,root);
let sc=0;
time=45;strikes=0;
function build(){
  order=[];strikes=0;time=45;
  left=EDS[e].w.concat(EDS[e].bad).sort(()=>Math.random()-.5);
  hud.set("ed",(e+1)+"/3");
  paint();
}
function paint(){
  line.innerHTML=order.length?order.join(" "):"—";
  pool.innerHTML="";
  left.forEach((w,i)=>{
    const b=H.el("button","g-chip",w,pool);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>pick(i));
  });
}
function pick(i){
  if(over||done)return;
  const w=left[i];
  if(EDS[e].w[order.length]===w){
    order.push(w);left.splice(i,1);H.sfx("tick");paint();
    if(order.length===EDS[e].w.length){
      sc+=100+Math.floor(time);H.score(sc);hud.set("sc",sc);H.sfx("ok");
      e++;
      if(e>=EDS.length){over=true;return H.done({win:true,score:sc+100,title:"Edição fechada!",sub:"3 manchetes sem um erro de grafia."});}
      say("Manchete pronta! Próxima edição…");H.after(600,build);
    }
  }else{
    strikes++;H.sfx("bad");
    say("❌ Erro ("+strikes+"/3)! "+(EDS[e].bad.includes(w)?"Essa palavra tem grafia errada.":"Fora de ordem."));
    if(strikes>=3){over=true;return H.done({win:false,score:sc,title:"Jornal recolhido!",sub:"3 erros na edição "+(e+1)+". Leia com calma!"});}
  }
}
build();
H.loop(dt=>{
  if(over||done)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Deadline estourado!",sub:"A gráfica não espera. Faltou a edição "+(e+1)+"."});}
});
}});"""

# 105 — Correio Maluco
GAMES[105] = r"""/* NCODE N · 105 Correio Maluco — 20 encomendas, 3 destinos */
GREG(105,{
init(root,H){
const BINS=[{e:"🔴",n:"NORTE"},{e:"🟢",n:"SUL"},{e:"🔵",n:"LESTE"}];
let over=false,pkgs=[],spawn=0,sent=0,err=0,total=20,sel=null;
const hud=H.hud(root,[["ev","ENVIADAS","0/20"],["er","ERROS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na encomenda e depois no <b>destino certo</b> (cor do selo). Não deixe cair da esteira!");
const o=H.cvs(root,500,300),x=o.x;
let sc=0;
const row=H.el("div","g-row",null,root);
BINS.forEach((b,i)=>{
  const btn=H.el("button","g-btn ghost",b.e+" "+b.n,row);
  btn.addEventListener("click",()=>{
    if(over||!sel)return;
    const p=pkgs.find(k=>k.id===sel);
    if(p){
      if(p.b===i){sent++;sc+=25;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        hud.set("ev",sent+"/"+total);
        if(sent>=total){over=true;return H.done({win:true,score:sc+100,title:"Correspondência em dia!",sub:"20 encomendas nos destinos certos."});}
      }else{err++;H.sfx("bad");hud.set("er",err+"/3");say("❌ Destino errado! ("+err+"/3)");
        if(err>=3){over=true;return H.done({win:false,score:sc,title:"Caos postal!",sub:"3 erros. Confira a cor do selo!"});}}
      pkgs=pkgs.filter(k=>k.id!==sel);
    }
    sel=null;
  });
});
let nid=0;
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&sent+pkgs.length+err<total+3&&sent+pkgs.length<total){
    spawn=Math.max(.7,1.6-sent*.05);
    pkgs.push({id:nid++,b:Math.floor(Math.random()*3),x:-30,y:120+Math.random()*40});
  }
  const sp=60+sent*4;
  for(let i=pkgs.length-1;i>=0;i--){
    pkgs[i].x+=sp*dt;
    if(pkgs[i].x>o.W+20){
      pkgs.splice(i,1);err++;H.sfx("bad");hud.set("er",err+"/3");
      say("📦 Caiu da esteira! ("+err+"/3)");
      if(err>=3){over=true;return H.done({win:false,score:sc,title:"Caos postal!",sub:"3 falhas. Despache mais rápido!"});}
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,100,o.W,90);
  x.fillStyle=H.C.ink;
  for(let lx=0;lx<o.W;lx+=40)x.fillRect(lx,142,22,6);
  x.font="26px serif";
  pkgs.forEach(p=>{
    x.fillStyle=p.id===sel?"#fff":"#c9b98f";
    x.fillRect(p.x,p.y,34,30);x.strokeStyle=p.id===sel?H.C.terra:H.C.ink;
    x.lineWidth=p.id===sel?3:2;x.strokeRect(p.x,p.y,34,30);
    x.fillText(BINS[p.b].e,p.x+4,p.y+27);
  });
});
H.onTap(o,(px,py)=>{
  if(over)return;
  const p=pkgs.find(k=>px>=k.x&&px<=k.x+34&&py>=k.y&&py<=k.y+30);
  if(p){sel=p.id;H.sfx("tick");}
});
}});"""

# 106 — Restaurante Lotado
GAMES[106] = r"""/* NCODE N · 106 Restaurante Lotado — sirva 12 mesas */
GREG(106,{
init(root,H){
const TABLES=[{s:2},{s:2},{s:4},{s:6}];
let over=false,queue=[],tabs=[],served=0,lost=0,spawn=1,sel=-1;
const hud=H.hud(root,[["sv","SERVIDOS","0/12"],["pd","DESISTÊNCIAS","0/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no grupo e depois numa <b>mesa livre que caiba</b>. Quem espera demais vai embora!");
const box=H.el("div","g-col",null,root);
const qrow=H.el("div","g-row",null,box);
const trow=H.el("div","g-row",null,box);
let sc=0;
tabs=TABLES.map(t=>({s:t.s,busy:0}));
let nid=0;
function paint(){
  qrow.innerHTML="";trow.innerHTML="";
  queue.forEach((g,i)=>{
    const b=H.el("button","g-chip"+(sel===i?" hot":""),"👥"+g.n+" ⏳"+Math.ceil(g.p),qrow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");paint();});
  });
  if(!queue.length)H.el("div","g-chip","fila vazia…",qrow);
  tabs.forEach((t,i)=>{
    const b=H.el("button","g-chip"+(t.busy>0?"":" hot"),t.busy>0?("🍽️ "+Math.ceil(t.busy)+"s"):("🪑 mesa "+t.s+" ("+(t.s)+" lug.)"),trow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||sel<0||t.busy>0)return;
      const g=queue[sel];
      if(g.n>t.s){H.sfx("bad");say("Grupo de "+g.n+" não cabe na mesa de "+t.s+"!");return;}
      t.busy=8;queue.splice(sel,1);sel=-1;H.sfx("ok");paint();
    });
  });
}
paint();
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&served+queue.length+tabs.filter(t=>t.busy>0).length<14){
    spawn=3.2;
    queue.push({id:nid++,n:[1,2,2,3,4,5,6][Math.floor(Math.random()*7)],p:16});
    if(sel>=queue.length)sel=-1;
    paint();
  }
  for(let i=queue.length-1;i>=0;i--){
    queue[i].p-=dt;
    if(queue[i].p<=0){
      queue.splice(i,1);lost++;hud.set("pd",lost+"/4");H.sfx("bad");paint();
      if(sel>=queue.length)sel=-1;
      if(lost>=4){over=true;return H.done({win:false,score:sc,title:"Salão vazio!",sub:"4 grupos desistiram. Acomode mais rápido!"});}
    }
  }
  tabs.forEach(t=>{
    if(t.busy>0){
      t.busy-=dt;
      if(t.busy<=0){
        served++;sc+=40;H.score(sc);hud.set("sc",sc);hud.set("sv",served+"/12");H.sfx("ok");
        if(served>=12){over=true;return H.done({win:true,score:sc+120,title:"Casa cheia, casa feliz!",sub:"12 grupos servidos sem esvaziar a fila."});}
      }
    }
  });
  if(Math.random()<dt*4)paint();
});
}});"""

# 107 — Hotel Fantasma
GAMES[107] = r"""/* NCODE N · 107 Hotel Fantasma — 10 hóspedes, 0 sustos */
GREG(107,{
init(root,H){
const N=20;
let over=false,rooms=[],check=0,fled=0,wait=0;
const hud=H.hud(root,[["ck","HÓSPEDES","0/10"],["fg","FUGIRAM","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Hóspede esperando? Clique num quarto <b>escuro e vazio</b> para hospedar. 👻 na porta? Clique nele antes do susto!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(5,1fr)";
board.style.width="min(100%,360px)";
let sc=0;
rooms=new Array(N).fill(null);
function paint(){
  board.innerHTML="";
  for(let i=0;i<N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    const r=rooms[i];
    if(!r){d.textContent="🌑";}
    else if(r.ghost>0){d.textContent="👻";d.classList.add("bad");}
    else{d.textContent="🛏️"+Math.ceil(r.stay);d.classList.add("good");}
    (function(idx){d.addEventListener("click",()=>click(idx));})(i);
  }
}
function click(i){
  if(over)return;
  const r=rooms[i];
  if(r&&r.ghost>0){r.ghost=0;r.scare=6+Math.random()*6;H.sfx("pop");paint();say("👻 Fantasma enxotado!");return;}
  if(!r&&wait>0){
    rooms[i]={stay:12,scare:5+Math.random()*7,ghost:0};
    wait--;H.sfx("ok");paint();say(wait?wait+" hóspede(s) na recepção!":"Todos acomodados… por enquanto.");
  }
}
paint();
H.loop(dt=>{
  if(over)return;
  wait+=dt*.28;
  if(wait>=3)wait=3;
  for(let i=0;i<N;i++){
    const r=rooms[i];
    if(!r)continue;
    if(r.ghost>0){
      r.ghost-=dt;
      if(r.ghost<=0){rooms[i]=null;fled++;hud.set("fg",fled+"/3");H.sfx("bad");paint();
        say("😱 Hóspede fugiu assustado! ("+fled+"/3)");
        if(fled>=3){over=true;return H.done({win:false,score:sc,title:"Hotel mal-assombrado!",sub:"3 fugas. Enxote os fantasmas a tempo!"});}
        continue;}
    }else{
      r.scare-=dt;
      if(r.scare<=0){r.ghost=3;H.sfx("bad");paint();say("👻 Fantasma no quarto "+(i+1)+"! Clique nele!");}
    }
    r.stay-=dt;
    if(r.stay<=0){
      rooms[i]=null;check++;sc+=50;H.score(sc);
      hud.set("ck",check+"/10");hud.set("sc",sc);H.sfx("ok");paint();
      if(check>=10){over=true;return H.done({win:true,score:sc+100,title:"Hotel 5 estrelas!",sub:"10 hóspedes dormiram sem um susto."});}
    }
  }
  if(Math.random()<dt*3)paint();
  hud.set("ck",check+"/10"+(wait>=1?" · +"+Math.floor(wait)+" esperando":""));
});
}});"""

# 108 — Oficina do Robô
GAMES[108] = r"""/* NCODE N · 108 Oficina do Robô — monte sob encomenda */
GREG(108,{
init(root,H){
const HEADS=["🤖","👾","🦾"],BODIES=["🟥","🟩","🟦"],NAMES=["Tocha","Parafuso","Antena"];
let over=false,order=null,slots={},built=0,time=120;
const hud=H.hud(root,[["rb","ROBÔS","0/5"],["tp","TEMPO",120],["sc","PONTOS",0]]);
const say=H.msg(root,"O pedido mostra <b>cabeça + corpo + nome</b>. Clique nas peças e no nome para montar igual!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const bench=H.el("div","g-row",null,box);
let sc=0;
function newOrder(){
  order={h:Math.floor(Math.random()*3),b:Math.floor(Math.random()*3),n:Math.floor(Math.random()*3)};
  slots={};paint();
}
function paint(){
  od.innerHTML="📋 Pedido: "+HEADS[order.h]+" + "+BODIES[order.b]+" corpo + nome <b>"+NAMES[order.n]+"</b>";
  bench.innerHTML="";
  const cur=H.el("div","g-msg","Bancada: "+(slots.h!=null?HEADS[slots.h]:"⬜ cabeça")+" "+(slots.b!=null?BODIES[slots.b]:"⬜ corpo")+" "+(slots.n!=null?NAMES[slots.n]:"⬜ nome"),box);
  [["h",HEADS],["b",BODIES]].forEach(([k,arr])=>{
    const r2=H.el("div","g-row",null,box);
    arr.forEach((e,i)=>{
      const btn=H.el("button","g-btn ghost",e,r2);
      btn.addEventListener("click",()=>{if(!over){slots[k]=i;H.sfx("tick");paint();}});
    });
  });
  const rn=H.el("div","g-row",null,box);
  NAMES.forEach((nm,i)=>{
    const btn=H.el("button","g-chip",nm,rn);
    btn.style.cursor="pointer";
    btn.addEventListener("click",()=>{if(!over){slots.n=i;H.sfx("tick");paint();}});
  });
  const ok=H.el("button","g-btn","📦 Entregar robô",box);
  ok.addEventListener("click",()=>{
    if(over)return;
    if(slots.h===order.h&&slots.b===order.b&&slots.n===order.n){
      built++;sc+=80;H.score(sc);hud.set("sc",sc);hud.set("rb",built+"/5");H.sfx("ok");
      if(built>=5){over=true;return H.done({win:true,score:sc+Math.floor(time),title:"Oficina premiada!",sub:"5 robôs exatamente como pedido."});}
      say("Robô entregue! +80. Próximo pedido…");newOrder();
    }else{H.sfx("bad");say("❌ Peças erradas! Compare com o pedido.");}
  });
}
newOrder();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Fábrica fechada!",sub:"Só "+built+"/5 robôs no prazo."});}
});
}});"""

# 109 — Estufa Inteligente
GAMES[109] = r"""/* NCODE N · 109 Estufa Inteligente — água e luz na medida */
GREG(109,{
init(root,H){
let over=false,plants=[],sel=0,time=60,decay=0;
const hud=H.hud(root,[["vv","VIVAS","8/8"],["tp","TEMPO",60],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na planta e use <b>💧 Regar</b> / <b>💡 Iluminar</b>. Se 💧 e ☀️ zerarem juntos, ela murcha!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(4,1fr)";
board.style.width="min(100%,340px)";
let sc=0;
plants=new Array(8).fill(0).map(()=>({w:2,l:2,alive:true}));
function paint(){
  board.innerHTML="";
  plants.forEach((p,i)=>{
    const d=H.el("button","g-cell"+(sel===i?" sel":""),null,board);
    d.style.fontSize="13px";d.style.minHeight="64px";
    d.innerHTML=!p.alive?"🥀<br>morta":("🌱<br>💧".repeat(1)+p.w+" ☀️"+p.l);
    d.addEventListener("click",()=>{if(!over&&p.alive){sel=i;H.sfx("tick");paint();}});
  });
  const alive=plants.filter(p=>p.alive).length;
  hud.set("vv",alive+"/8");
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"💧 Regar",()=>{
  if(over)return;const p=plants[sel];
  if(p&&p.alive){p.w=Math.min(3,p.w+1);H.sfx("tick");paint();}
},false);
H.btn(row,"💡 Iluminar",()=>{
  if(over)return;const p=plants[sel];
  if(p&&p.alive){p.l=Math.min(3,p.l+1);H.sfx("tick");paint();}
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;decay+=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(decay>5){
    decay=0;
    plants.forEach(p=>{
      if(!p.alive)return;
      if(Math.random()<.6)p.w=Math.max(0,p.w-1);else p.l=Math.max(0,p.l-1);
      if(p.w===0&&p.l===0){p.alive=false;H.sfx("bad");say("🥀 Uma planta murchou!");}
    });
    paint();
  }
  const alive=plants.filter(p=>p.alive).length;
  sc=alive*10+Math.floor((60-time)*2);H.score(sc);hud.set("sc",sc);
  if(alive<6){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Estufa seca!",sub:"Menos de 6 sobreviveram. Alterne água e luz!"});}
  if(time<=0){over=true;
    return H.done({win:true,score:sc+100,title:"Colheita verde!",sub:alive+"/8 plantas vivas após 60s."});}
});
}});"""

# 110 — Aquário Equilibrado
GAMES[110] = r"""/* NCODE N · 110 Aquário Equilibrado — alimente e limpe */
GREG(110,{
init(root,H){
let over=false,fish=[],food=[],dirt=10,time=60,cool=0;
const hud=H.hud(root,[["px","PEIXES","5/5"],["sj","SUJEIRA","10%"],["tp","TEMPO",60]]);
const say=H.msg(root,"<b>🍤 Ração</b> afunda e os peixes caçam. <b>🧹 Limpar</b> tira sujeira (recarrega). Fome zerada ou sujeira 100% = morte!");
const o=H.cvs(root,500,360),x=o.x;
const cols=["#E8A33D","#D94E34","#7fb3d5","#C4D645","#E86AA0"];
for(let i=0;i<5;i++)fish.push({x:60+Math.random()*380,y:80+Math.random()*200,vx:40*(Math.random()<.5?-1:1),hung:80,c:cols[i]});
H.btn(root,"🍤 Jogar ração",()=>{
  if(over)return;
  food.push({x:40+Math.random()*420,y:10});H.sfx("tick");
  if(food.length>12)food.shift();
},false);
H.btn(root,"🧹 Limpar (+rec. 8s)",()=>{
  if(over||cool>0)return;
  cool=8;dirt=Math.max(0,dirt-45);H.sfx("ok");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;dirt=Math.min(100,dirt+dt*1.6);
  hud.set("tp",Math.max(0,Math.ceil(time)));hud.set("sj",Math.floor(dirt)+"%");
  food.forEach(f=>f.y+=40*dt);
  food=food.filter(f=>f.y<o.H-10);
  for(const f of fish){
    let tgt=null,bd=1e9;
    food.forEach(g=>{const d=Math.hypot(g.x-f.x,g.y-f.y);if(d<bd){bd=d;tgt=g;}});
    if(tgt){f.vx+=(tgt.x>f.x?160:-160)*dt;f.y+=(tgt.y-f.y)*2*dt;}
    else{f.vx+=(Math.random()-.5)*60*dt;f.y+=(Math.random()-.5)*30*dt;}
    f.vx=H.clamp(f.vx,-70,70);f.x+=f.vx*dt;
    if(f.x<20){f.x=20;f.vx=Math.abs(f.vx);}if(f.x>o.W-20){f.x=o.W-20;f.vx=-Math.abs(f.vx);}
    f.y=H.clamp(f.y,30,o.H-30);
    f.hung-=dt*(2+dirt*.03);
    for(let i=food.length-1;i>=0;i--){
      if(Math.hypot(food[i].x-f.x,food[i].y-f.y)<16){food.splice(i,1);f.hung=Math.min(100,f.hung+25);H.sfx("pop");}
    }
  }
  for(let i=fish.length-1;i>=0;i--){
    if(fish[i].hung<=0||dirt>=100){fish.splice(i,1);H.sfx("bad");say("🐟 Um peixe não resistiu!");}
  }
  hud.set("px",fish.length+"/5");
  if(fish.length<4){over=true;H.sfx("lose");
    return H.done({win:false,score:0,title:"Aquário vazio!",sub:"Menos de 4 peixes. Alimente e limpe sem parar!"});}
  if(time<=0){over=true;const sc=fish.length*60+Math.floor(100-dirt);
    return H.done({win:true,score:sc,title:"Ecossistema estável!",sub:fish.length+"/5 peixes após 60s."});}
  x.fillStyle="#123a4d";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(120,90,40,"+(dirt/220)+")";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#c9b98f";x.fillRect(0,o.H-14,o.W,14);
  x.fillStyle="#5b3d20";
  food.forEach(f=>{x.beginPath();x.arc(f.x,f.y,4,0,7);x.fill();});
  for(const f of fish){
    x.save();x.translate(f.x,f.y);x.scale(f.vx>=0?1:-1,1);
    x.fillStyle=f.c;
    x.beginPath();x.ellipse(0,0,16,9,0,0,7);x.fill();
    x.beginPath();x.moveTo(-14,0);x.lineTo(-24,-8);x.lineTo(-24,8);x.closePath();x.fill();
    x.fillStyle="#000";x.beginPath();x.arc(6,-2,2,0,7);x.fill();
    x.restore();
    x.fillStyle=f.hung>30?H.C.ok:H.C.terra;
    x.fillRect(f.x-14,f.y-20,28*(f.hung/100),4);
  }
  if(cool>0){x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";x.fillText("limpeza em "+Math.ceil(cool)+"s",12,20);}
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
