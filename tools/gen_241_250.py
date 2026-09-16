#!/usr/bin/env python3
"""Gera games/g241..g250 — CARTAS & TABULEIRO (parte 2)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 241 — Copas
GAMES[241] = r"""/* NCODE N · 241 Copas — fuja das copas e da dama! */
GREG(241,{
init(root,H){
const S=["♠","♥","♦","♣"],RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,hands=[],pts=[0,0,0,0],roundPts=[0,0,0,0],table=[],turn=2,broken=false,round=1,lead=null;
const hud=H.hud(root,[["rd","RODADA","1/3"],["vc","VOCÊ",0],["cp","CPUs","0/0/0"]]);
const say=H.msg(root,"Evite vazas com ♥ (+1 cada) e a Q♠ (+13)! Não pode sair de ♥ até quebrar. Menos pontos em 3 rodadas vence!");
const box=H.el("div","g-col",null,root);
function mk(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({s,r});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  hands=[[],[],[],[]];
  for(let i=0;i<13;i++)for(let h=0;h<4;h++)hands[h].push(d.pop());
  hands.forEach(h=>h.sort((a,b)=>a.s-b.s||a.r-b.r));
  table=[];roundPts=[0,0,0,0];broken=false;lead=null;
  // quem tem 2♣ sai
  turn=hands.findIndex(h=>h.some(c=>c.s===3&&c.r===2));
}
function canPlay(who,c){
  if(!table.length){
    if(lead!==null)return true;
    // saída: 2♣ obrigatório na 1ª, sem copas se não quebrou
    if(hands[who].length===13){
      const has2=hands[who].some(k=>k.s===3&&k.r===2);
      if(has2)return c.s===3&&c.r===2;
    }
    if(c.s===1&&!broken)return !hands[who].some(k=>k.s!==1);
    return true;
  }
  const led=table[0].c.s;
  if(c.s===led)return true;
  return !hands[who].some(k=>k.s===led);
}
function paint(){
  if(over)return;
  box.innerHTML="";
  hud.set("vc",pts[0]+" (+"+roundPts[0]+")");
  hud.set("cp",pts.slice(1).join("/"));
  H.el("div","g-msg","🎴 Mesa: "+(table.map(t=>RN(t.c.r)+S[t.c.s]).join(" ")||"—")+(turn===0?" · <b>SUA VEZ</b>":" · CPU"+turn+"…"),box);
  const hd=H.el("div","g-row",null,box);
  hands[0].forEach((c,i)=>{
    const ok=turn===0&&canPlay(0,c);
    const b=H.el("button","g-card"+(ok?" hot":""),RN(c.r)+S[c.s],hd);
    b.style.width="40px";b.style.height="56px";b.style.fontSize="13px";
    if(ok)b.addEventListener("click",()=>playCard(0,i));
  });
}
function cardV(c){return c.r===1?14:c.r;}
function playCard(who,i){
  if(over)return;
  if(i<0||i>=hands[who].length)return;
  const c=hands[who].splice(i,1)[0];
  table.push({who,c});
  if(c.s===1)broken=true;
  H.sfx("tick");
  if(table.length>=4){finishTrick();return;}
  turn=(turn+1)%4;paint();
  if(turn!==0)H.after(600,ai);
}
function ai(){
  if(over||turn===0)return;
  const h=hands[turn];
  const opts=h.filter(c=>canPlay(turn,c));
  let pick;
  if(!table.length){
    // sai: evita copas/ás-espadas; prefere baixa
    const safe=opts.filter(c=>!(c.s===0&&(c.r===12||c.r===1||c.r===13)));
    pick=(safe.length?safe:opts).sort((a,b)=>cardV(a)-cardV(b))[0];
  }else{
    const led=table[0].c.s;
    const foll=opts.filter(c=>c.s===led);
    if(foll.length){
      // tenta não levar: joga a maior abaixo da atual
      const curMax=Math.max(...table.filter(t=>t.c.s===led).map(t=>cardV(t.c)));
      const below=foll.filter(c=>cardV(c)<curMax).sort((a,b)=>cardV(b)-cardV(a));
      pick=below.length?below[0]:foll.sort((a,b)=>cardV(b)-cardV(a))[0];
      // se vai levar mesmo assim, descarrega Q♠
      if(!below.length){
        const q=foll.find(c=>c.s===0&&c.r===12);
        if(q)pick=q;
      }
    }else{
      // descarta: Q♠ > A♠ > K♠ > copas altas
      pick=opts.find(c=>c.s===0&&c.r===12)||opts.find(c=>c.s===0&&c.r===1)||opts.find(c=>c.s===1&&c.r>=10)||opts.sort((a,b)=>cardV(b)-cardV(a))[0];
    }
  }
  playCard(turn,h.indexOf(pick));
}
function finishTrick(){
  const led=table[0].c.s;
  let w=table[0];
  table.forEach(t=>{
    if(t.c.s===led&&w.c.s===led&&cardV(t.c)>cardV(w.c))w=t;
  });
  let p=0;
  table.forEach(t=>{
    if(t.c.s===1)p++;
    if(t.c.s===0&&t.c.r===12)p+=13;
  });
  roundPts[w.who]+=p;
  say((w.who===0?"Você levou":"CPU"+w.who+" levou")+" a vaza (+"+p+")");
  table=[];turn=w.who;lead=null;
  if(!hands[0].length){endRound();return;}
  paint();
  if(turn!==0)H.after(600,ai);
}
function endRound(){
  // lua: alguém fez 26
  const mi=roundPts.findIndex(v=>v===26);
  if(mi>=0){
    roundPts=roundPts.map(()=>26);roundPts[mi]=0;
    say("🌙 "+(mi===0?"VOCÊ":"CPU"+mi)+" FEZ A LUA! Todos +26 (menos "+(mi===0?"você":"ele")+")!");
  }
  pts=pts.map((v,i)=>v+roundPts[i]);
  round++;
  if(round>3){
    over=true;
    const best=Math.min(...pts);
    if(pts[0]===best)return H.done({win:true,score:300-pts[0]*2,title:"Coração limpo!",sub:"Placar: você "+pts[0]+" × "+pts.slice(1).join("/")});
    return H.done({win:false,score:100,title:"Azedo!",sub:"Você "+pts[0]+" × melhor "+best+". Fuja da Q♠!"});
  }
  hud.set("rd",round+"/3");
  H.after(1600,()=>{mk();paint();});
  paint();
}
mk();paint();
if(turn!==0)H.after(600,ai);
}});"""

# 242 — Snap
GAMES[242] = r"""/* NCODE N · 242 Snap — bata primeiro nos iguais! */
GREG(242,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,deck=[],pile=[],you=0,cpu=0,avail=true,aiT=-1,flipT=0;
const hud=H.hud(root,[["vc","SUAS",0],["cp","CPU",0],["mc","MONTE",52]]);
const say=H.msg(root,"Carta nova a cada 1s! Quando <b>igualar a anterior</b>, bata <b>SNAP</b> (ou Espaço) antes da CPU! Quem leva mais vence.");
const box=H.el("div","g-col",null,root);
const tp=H.el("div","g-msg","",box);
function mk(){
  deck=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push(r);
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
}
mk();
function snap(){
  if(over||!avail||pile.length<2)return;
  const n=pile.length;
  if(pile[n-1]===pile[n-2]){
    you+=pile.length;pile=[];avail=false;aiT=-1;
    H.score(you);hud.set("vc",you);H.sfx("ok");say("⚡ SNAP seu! +pilha.");
    H.after(600,()=>{avail=true;});
  }else{
    cpu+=1;you=Math.max(0,you-1);
    hud.set("vc",you);hud.set("cp",cpu);H.sfx("bad");say("❌ Falso snap! −1.");
  }
}
H.btn(root,"⚡ SNAP! (Espaço)",snap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")snap();});
H.loop(dt=>{
  if(over)return;
  flipT+=dt;
  if(flipT>=1&&deck.length&&avail){
    flipT=0;
    pile.push(deck.pop());
    hud.set("mc",deck.length);
    H.sfx("tick");
    const n=pile.length;
    if(n>=2&&pile[n-1]===pile[n-2])aiT=0.4+Math.random()*0.8;
    if(!deck.length){
      H.after(1500,()=>{
        if(over)return;
        over=true;
        you+=0;
        if(you>=cpu)return H.done({win:true,score:you*10,title:"Reflexo felino!",sub:"Você "+you+" × CPU "+cpu+"."});
        return H.done({win:false,score:you*10,title:"CPU mais rápida!",sub:"Você "+you+" × CPU "+cpu+"."});
      });
    }
  }
  if(aiT>0){
    aiT-=dt;
    if(aiT<=0){
      cpu+=pile.length;pile=[];aiT=-1;
      hud.set("cp",cpu);H.sfx("bad");say("🤖 CPU deu snap!");
    }
  }
  const n=pile.length;
  tp.innerHTML="🎴 Pilha ("+n+"): "+pile.slice(-6).map(RN).join(" ")+(n>=2&&pile[n-1]===pile[n-2]?"<br><b>⚡ IGUAIS! BATA!</b>":"");
});
}});"""

# 243 — Pirâmide 13
GAMES[243] = r"""/* NCODE N · 243 Pirâmide 13 — limpe a pirâmide! */
GREG(243,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
const V=r=>r;
let over=false,pyr=[],stock=[],waste=[],sel=null,passes=2;
const hud=H.hud(root,[["ct","CARTAS","28/28"],["ps","PASSES",2],["mq","MONTE",24]]);
const say=H.msg(root,"Remova <b>pares livres que somam 13</b> (K=13 sai sozinho, Q+A, J+2…)! Use o monte quando travar. Limpe a pirâmide!");
const box=H.el("div","g-col",null,root);
const pb=H.el("div","g-col",null,box);
const sb=H.el("div","g-row",null,box);
function mk(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({r,id:s*13+r});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  pyr=d.slice(0,28);stock=d.slice(28);waste=[];sel=null;passes=2;
}
function free(i){
  if(!pyr[i])return false;
  const r=Math.floor((Math.sqrt(8*i+1)-1)/2);
  if(r>=6)return true;
  const s=r*(r+1)/2,c=i-s;
  return!pyr[s+r+1+c]&&!pyr[s+r+1+c+1];
}
function paint(){
  if(over)return;
  const left=pyr.filter(Boolean).length;
  hud.set("ct",left+"/28");hud.set("ps",passes);hud.set("mq",stock.length);
  pb.innerHTML="";sb.innerHTML="";
  for(let r=0;r<7;r++){
    const row=H.el("div","g-row",null,pb);
    row.style.justifyContent="center";
    const s=r*(r+1)/2;
    for(let c=0;c<=r;c++){
      const i=s+c,card=pyr[i];
      if(!card){continue;}
      const b=H.el("button","g-card"+(!free(i)?"":" hot")+(sel&&sel.p===i?" sel":""),RN(card.r),row);
      b.style.width="40px";b.style.height="56px";b.style.fontSize="14px";
      if(!free(i))b.disabled=true;
      b.addEventListener("click",()=>clickPyr(i));
      row.appendChild(b);
    }
  }
  const wv=waste.length?waste[waste.length-1]:null;
  if(wv){
    const b=H.el("button","g-card"+(sel&&sel.w?" sel":""),RN(wv.r),sb);
    b.style.width="44px";b.style.height="60px";
    b.addEventListener("click",()=>clickWaste());
  }else H.el("div","g-chip","descarte vazio",sb);
  H.btn(sb,"🎲 Monte ("+stock.length+")",()=>{
    if(over)return;
    if(stock.length){waste.push(stock.pop());sel=null;H.sfx("tick");paint();}
    else if(passes>1){passes--;stock=waste.reverse();waste=[];sel=null;H.sfx("tick");say("🔄 Novo passe! ("+(passes-1)+" restantes)");paint();}
    else{H.sfx("bad");say("Sem passes!");}
  },false);
  if(!left){over=true;H.score(400+passes*100);
    return H.done({win:true,score:400+passes*100,title:"Pirâmide zerada!",sub:"Todas as 28 removidas."});}
}
function valOf(src){return src.w?waste[waste.length-1].r:pyr[src.p].r;}
function remove(src){if(src.w)waste.pop();else pyr[src.p]=null;}
function clickPyr(i){
  if(over||!free(i))return;
  const me={p:i};
  if(pyr[i].r===13){pyr[i]=null;sel=null;H.sfx("ok");paint();return;}
  if(!sel){sel=me;H.sfx("tick");paint();return;}
  if(sel.p===i){sel=null;paint();return;}
  if(valOf(sel)+pyr[i].r===13){remove(sel);pyr[i]=null;sel=null;H.sfx("ok");paint();}
  else{H.sfx("bad");sel=me;paint();}
}
function clickWaste(){
  if(over||!waste.length)return;
  const me={w:true};
  const wv=waste[waste.length-1];
  if(wv.r===13){waste.pop();sel=null;H.sfx("ok");paint();return;}
  if(!sel){sel=me;H.sfx("tick");paint();return;}
  if(sel.w){sel=null;paint();return;}
  if(valOf(sel)+wv.r===13){remove(sel);waste.pop();sel=null;H.sfx("ok");paint();}
  else{H.sfx("bad");sel=me;paint();}
}
mk();paint();
}});"""

# 244 — Relógio
GAMES[244] = r"""/* NCODE N · 244 Relógio — vença 1 de 3 baralhos! */
GREG(244,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,piles=[],cur=null,att=1,kings=0,revealed=0;
const hud=H.hud(root,[["tt","TENTATIVA","1/3"],["rv","REVELADAS","0/52"],["k","REIS",0]]);
const say=H.msg(root,"Clique em <b>virar</b>! A carta vai para sua hora (A=1…Q=12, K=centro) e vira a próxima. 4º K = perde. Revele as 52!");
const box=H.el("div","g-col",null,root);
const cb=H.el("div","g-msg","",box);
function mk(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push(r);
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  piles=[];
  for(let p=0;p<13;p++)piles.push(d.slice(p*4,p*4+4));
  cur=piles[12].pop();kings=0;revealed=0;
  paint();
}
function paint(){
  hud.set("tt",att+"/3");hud.set("rv",revealed+"/52");hud.set("k",kings+"/4");
  cb.innerHTML="🃏 Carta: <b>"+(cur?RN(cur):"—")+"</b> → "+(cur?(cur===13?"CENTRO 👑":"hora "+cur):"—");
}
H.btn(root,"🔄 Virar carta",()=>{
  if(over||!cur)return;
  revealed++;
  const dest=cur===13?12:cur-1;
  if(dest===12){
    kings++;hud.set("k",kings+"/4");H.sfx("bad");
    if(kings>=4){
      att++;
      if(att>3){over=true;return H.done({win:false,score:revealed,title:"4 reis!",sub:"3 baralhos sem sorte. Tente de novo!"});}
      say("👑 4º rei! Tentativa "+att+"/3…");mk();return;
    }
    cur=piles[12].length?piles[12].pop():null;
  }else{
    H.sfx("tick");
    cur=piles[dest].length?piles[dest].pop():null;
  }
  hud.set("rv",revealed+"/52");
  if(revealed>=52){over=true;H.score(500);
    return H.done({win:true,score:500,title:"Relógio completo!",sub:"52 cartas reveladas na tentativa "+att+"!"});
  }
  if(!cur){ // pilha vazia = travou
    att++;
    if(att>3){over=true;return H.done({win:false,score:revealed,title:"Relógio travou!",sub:"3 tentativas sem completar."});}
    say("Travou! Tentativa "+att+"/3…");mk();return;
  }
  paint();
},true);
mk();
}});"""

# 245 — Damas
GAMES[245] = r"""/* NCODE N · 245 Damas — capture tudo! */
GREG(245,{
init(root,H){
let over=false,b=[],sel=null,must=[],turn=0;
const hud=H.hud(root,[["vc","SUAS",12],["cp","CPU",12],["vz","VEZ","você"]]);
const say=H.msg(root,"Você é ⚫ (embaixo)! Captura é <b>obrigatória</b> (inclusive em cadeia). Clique na peça e no destino. Coma as 12!");
const o=H.cvs(root,440,440),x=o.x;
const CS=52,OX=12,OY=12;
function mk(){
  b=[];
  for(let r=0;r<8;r++){b.push([]);for(let c=0;c<8;c++)b[r].push(null);}
  for(let r=0;r<3;r++)for(let c=0;c<8;c++)if((r+c)%2===1)b[r][c]={w:false,k:false};
  for(let r=5;r<8;r++)for(let c=0;c<8;c++)if((r+c)%2===1)b[r][c]={w:true,k:false};
  sel=null;turn=0;
}
function dirs(p){return p.k?[[1,1],[1,-1],[-1,1],[-1,-1]]:(p.w?[[-1,1],[-1,-1]]:[[1,1],[1,-1]]);}
function caps(r,c,bd){
  bd=bd||b;
  const p=bd[r][c],out=[];
  if(!p)return out;
  for(const[dr,dc]of dirs(p)){
    const r1=r+dr,c1=c+dc,r2=r+2*dr,c2=c+2*dc;
    if(r2<0||r2>7||c2<0||c2>7)continue;
    if(bd[r1][c1]&&bd[r1][c1].w!==p.w&&!bd[r2][c2])out.push({fr:r,fc:c,tr:r2,tc:c2,er:r1,ec:c1});
  }
  return out;
}
function steps(r,c,bd){
  bd=bd||b;
  const p=bd[r][c],out=[];
  if(!p)return out;
  for(const[dr,dc]of dirs(p)){
    const r1=r+dr,c1=c+dc;
    if(r1<0||r1>7||c1<0||c1>7)continue;
    if(!bd[r1][c1])out.push({fr:r,fc:c,tr:r1,tc:c1});
  }
  return out;
}
function allMoves(white){
  let cp=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(b[r][c]&&b[r][c].w===white)cp=cp.concat(caps(r,c));
  if(cp.length)return cp;
  let st=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(b[r][c]&&b[r][c].w===white)st=st.concat(steps(r,c));
  return st;
}
function apply(m){
  const p=b[m.fr][m.fc];
  b[m.tr][m.tc]=p;b[m.fr][m.fc]=null;
  if(m.er!=null)b[m.er][m.ec]=null;
  if(p.w&&m.tr===0)p.k=true;
  if(!p.w&&m.tr===7)p.k=true;
}
function counts(){
  let w=0,bl=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(b[r][c]){if(b[r][c].w)w++;else bl++;}
  }
  return[w,bl];
}
function status(){
  const[w,bl]=counts();
  hud.set("vc",w);hud.set("cp",bl);
  hud.set("vz",turn===0?"você":"CPU");
}
function checkEnd(){
  const[w,bl]=counts();
  if(bl===0){over=true;return H.done({win:true,score:300,title:"Grande mestre!",sub:"Todas as peças da CPU capturadas."});}
  if(w===0){over=true;return H.done({win:false,score:0,title:"Sem peças!",sub:"A CPU comeu tudo."});}
  if(!allMoves(turn===0).length){
    over=true;
    if(turn===0)return H.done({win:false,score:0,title:"Travado!",sub:"Você sem jogadas."});
    return H.done({win:true,score:250,title:"Travou a CPU!",sub:"Ela ficou sem jogadas."});
  }
  return null;
}
mk();status();
H.onTap(o,(px,py)=>{
  if(over||turn!==0)return;
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>7||c<0||c>7)return;
  const moves=allMoves(true);
  const mustCap=moves.some(m=>m.er!=null);
  if(sel&&!(b[r][c]&&b[r][c].w)){
    const m=moves.find(k=>k.fr===sel.r&&k.fc===sel.c&&k.tr===r&&k.tc===c);
    if(m&&(!mustCap||m.er!=null)){
      apply(m);H.sfx("tick");
      if(m.er!=null&&caps(m.tr,m.tc).length){sel={r:m.tr,c:m.tc};status();return;}
      sel=null;turn=1;status();
      const e=checkEnd();if(e)return;
      H.after(600,ai);
      return;
    }
  }
  if(b[r][c]&&b[r][c].w){
    const ok=moves.some(k=>k.fr===r&&k.fc===c&&(!mustCap||k.er!=null));
    if(ok){sel={r,c};H.sfx("tick");}
    else{H.sfx("bad");say(mustCap?"Captura obrigatória em outra peça!":"Peça sem jogada!");}
  }else sel=null;
});
function ai(){
  if(over)return;
  const moves=allMoves(false);
  if(!moves.length){checkEnd();return;}
  const cp=moves.filter(m=>m.er!=null);
  let m;
  if(cp.length)m=cp[Math.floor(Math.random()*cp.length)];
  else{
    const fwd=moves.filter(k=>k.tr>k.fr);
    m=(fwd.length?fwd:moves)[Math.floor(Math.random()*(fwd.length?fwd.length:moves.length))];
  }
  apply(m);
  if(m.er!=null){
    let more=caps(m.tr,m.tc);
    let guard=0;
    while(more.length&&guard++<10){
      const nx=more[0];
      apply(nx);m=nx;more=caps(m.tr,m.tc);
    }
  }
  H.sfx("tick");turn=0;status();
  checkEnd();
}
H.loop(()=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    x.fillStyle=(r+c)%2?"#8A6A2F":"#E4D5B5";
    x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  }
  if(sel){
    x.strokeStyle=H.C.wasabi;x.lineWidth=4;
    x.strokeRect(OX+sel.c*CS+2,OY+sel.r*CS+2,CS-4,CS-4);
    allMoves(true).filter(m=>m.fr===sel.r&&m.fc===sel.c).forEach(m=>{
      x.fillStyle="rgba(196,214,69,.6)";
      x.beginPath();x.arc(OX+m.tc*CS+CS/2,OY+m.tr*CS+CS/2,8,0,7);x.fill();
    });
  }
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=b[r][c];
    if(!p)continue;
    x.fillStyle=p.w?"#181816":"#B23A24";
    x.beginPath();x.arc(OX+c*CS+CS/2,OY+r*CS+CS/2,CS/2-8,0,7);x.fill();
    x.strokeStyle="#F4F1EB";x.lineWidth=2;x.stroke();
    if(p.k){x.fillStyle="#E8A33D";x.font="bold 18px serif";x.fillText("♛",OX+c*CS+CS/2-9,OY+r*CS+CS/2+7);}
  }
});
}});"""

# 246 — Reversi
GAMES[246] = r"""/* NCODE N · 246 Reversi — vire o jogo! */
GREG(246,{
init(root,H){
let over=false,b=[],turn=0;
const hud=H.hud(root,[["vc","VOCÊ",2],["cp","CPU",2]]);
const say=H.msg(root,"Você é ⚫! Cerque brancas entre pretas para virar. Cantos valem ouro. Mais peças no fim vence!");
const o=H.cvs(root,440,440),x=o.x;
const CS=52,OX=12,OY=12;
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function mk(){
  b=[];
  for(let r=0;r<8;r++){b.push([]);for(let c=0;c<8;c++)b[r].push(0);}
  b[3][3]=2;b[3][4]=1;b[4][3]=1;b[4][4]=2;
  turn=0;
}
function flips(r,c,who){
  if(b[r][c])return[];
  let out=[];
  for(const[dr,dc]of DIRS){
    const line=[];
    let rr=r+dr,cc=c+dc;
    while(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr][cc]===3-who){line.push([rr,cc]);rr+=dr;cc+=dc;}
    if(line.length&&rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr][cc]===who)out=out.concat(line);
  }
  return out;
}
function legal(who){
  const out=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(flips(r,c,who).length)out.push([r,c]);
  return out;
}
function counts(){
  let w1=0,w2=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(b[r][c]===1)w1++;if(b[r][c]===2)w2++;}
  return[w1,w2];
}
function status(){
  const[w1,w2]=counts();
  hud.set("vc",w1);hud.set("cp",w2);
}
function apply(r,c,who){
  flips(r,c,who).forEach(f=>b[f[0]][f[1]]=who);
  b[r][c]=who;
}
function checkFlow(){
  status();
  if(legal(1).length===0&&legal(2).length===0){
    over=true;
    const[w1,w2]=counts();
    if(w1>w2)return H.done({win:true,score:w1*5,title:"Reversi master!",sub:w1+" × "+w2+"."});
    if(w1<w2)return H.done({win:false,score:w1*5,title:"Virado!",sub:w1+" × "+w2+". Mire os cantos!"});
    return H.done({win:true,score:w1*5,title:"Empate técnico!",sub:w1+" × "+w2+"."});
  }
  return null;
}
mk();status();
H.onTap(o,(px,py)=>{
  if(over||turn!==0)return;
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>7||c<0||c>7)return;
  if(!flips(r,c,1).length){H.sfx("bad");return;}
  apply(r,c,1);H.sfx("tick");
  if(checkFlow())return;
  if(!legal(2).length){say("CPU sem jogada — de novo!");status();return;}
  turn=1;H.after(600,ai);
});
function ai(){
  if(over)return;
  const mv=legal(2);
  if(!mv.length){turn=0;paint0();return;}
  let best=mv[0],bs=-1e9;
  mv.forEach(m=>{
    let sc=flips(m[0],m[1],2).length;
    if((m[0]===0||m[0]===7)&&(m[1]===0||m[1]===7))sc+=30;
    else if(m[0]===0||m[0]===7||m[1]===0||m[1]===7)sc+=6;
    else if(m[0]>=2&&m[0]<=5&&m[1]>=2&&m[1]<=5)sc+=2;
    if((m[0]===1||m[0]===6)&&(m[1]===1||m[1]===6))sc-=12;
    if(sc>bs){bs=sc;best=m;}
  });
  apply(best[0],best[1],2);H.sfx("tick");
  if(checkFlow())return;
  turn=0;
  if(!legal(1).length){say("Você sem jogada — CPU de novo!");turn=1;H.after(600,ai);}
}
function paint0(){}
H.loop(()=>{
  x.fillStyle="#3E7C4F";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    x.strokeStyle="rgba(0,0,0,.3)";
    x.strokeRect(OX+c*CS,OY+r*CS,CS,CS);
  }
  if(turn===0&&!over)legal(1).forEach(m=>{
    x.fillStyle="rgba(255,255,255,.35)";
    x.beginPath();x.arc(OX+m[1]*CS+CS/2,OY+m[0]*CS+CS/2,7,0,7);x.fill();
  });
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(!b[r][c])continue;
    x.fillStyle=b[r][c]===1?"#181816":"#F4F1EB";
    x.beginPath();x.arc(OX+c*CS+CS/2,OY+r*CS+CS/2,CS/2-6,0,7);x.fill();
    x.strokeStyle=b[r][c]===1?"#F4F1EB":"#181816";x.lineWidth=2;x.stroke();
  }
});
}});"""

# 247 — Quatro em Linha
GAMES[247] = r"""/* NCODE N · 247 Quatro em Linha — alinhe 4! */
GREG(247,{
init(root,H){
let over=false,b=[],turn=0;
const hud=H.hud(root,[["vz","VEZ","você"]]);
const say=H.msg(root,"Você é 🔴! Clique na coluna para soltar. Alinhe 4 (linha, coluna ou diagonal) antes da CPU 🟡!");
const o=H.cvs(root,460,420),x=o.x;
const CS=60,OX=20,OY=40;
function mk(){b=[];for(let r=0;r<6;r++){b.push([]);for(let c=0;c<7;c++)b[r].push(0);}turn=0;}
function drop(c,who){
  for(let r=5;r>=0;r--)if(!b[r][c]){b[r][c]=who;return r;}
  return-1;
}
function wins(who){
  for(let r=0;r<6;r++)for(let c=0;c<7;c++){
    if(b[r][c]!==who)continue;
    if(c+3<7&&b[r][c+1]===who&&b[r][c+2]===who&&b[r][c+3]===who)return true;
    if(r+3<6&&b[r+1][c]===who&&b[r+2][c]===who&&b[r+3][c]===who)return true;
    if(c+3<7&&r+3<6&&b[r+1][c+1]===who&&b[r+2][c+2]===who&&b[r+3][c+3]===who)return true;
    if(c-3>=0&&r+3<6&&b[r+1][c-1]===who&&b[r+2][c-2]===who&&b[r+3][c-3]===who)return true;
  }
  return false;
}
function full(){return b[0].every(v=>v);}
mk();
H.onTap(o,(px,py)=>{
  if(over||turn!==0)return;
  const c=Math.floor((px-OX)/CS);
  if(c<0||c>6||b[0][c]){H.sfx("bad");return;}
  drop(c,1);H.sfx("tick");
  if(wins(1)){over=true;return H.done({win:true,score:300,title:"4 em linha!",sub:"Você alinhou primeiro!"});}
  if(full()){over=true;return H.done({win:true,score:150,title:"Empate!",sub:"Tabuleiro cheio."});}
  turn=1;hud.set("vz","CPU");H.after(500,ai);
});
function ai(){
  if(over)return;
  // vence? bloqueia? centro?
  for(let c=0;c<7;c++){
    if(b[0][c])continue;
    const r=drop(c,2);
    if(wins(2)){H.sfx("bad");over=true;paintWin();return H.done({win:false,score:50,title:"CPU alinhou 4!",sub:"Bloqueie as sequências dela!"});}
    b[r][c]=0;
  }
  for(let c=0;c<7;c++){
    if(b[0][c])continue;
    const r=drop(c,1);
    const w=wins(1);
    b[r][c]=0;
    if(w){drop(c,2);H.sfx("tick");afterAi();return;}
  }
  const order=[3,2,4,1,5,0,6].filter(c=>!b[0][c]);
  drop(order[0],2);H.sfx("tick");afterAi();
}
function afterAi(){
  if(wins(2)){over=true;paintWin();return H.done({win:false,score:50,title:"CPU alinhou 4!",sub:""});}
  if(full()){over=true;return H.done({win:true,score:150,title:"Empate!",sub:""});}
  turn=0;hud.set("vz","você");
}
function paintWin(){}
H.loop(()=>{
  x.fillStyle="#2E6E8A";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<6;r++)for(let c=0;c<7;c++){
    x.fillStyle=b[r][c]===1?"#D94E34":b[r][c]===2?"#E8A33D":"#F4F1EB";
    x.beginPath();x.arc(OX+c*CS+CS/2,OY+r*CS+CS/2,CS/2-7,0,7);x.fill();
  }
});
}});"""

# 248 — Jogo da Velha Plus
GAMES[248] = r"""/* NCODE N · 248 Jogo da Velha Plus — 4 em linha no 5×5! */
GREG(248,{
init(root,H){
let over=false,b=[],turn=0;
const hud=H.hud(root,[["vz","VEZ","você (X)"]]);
const say=H.msg(root,"Você é ❌! 4 em linha no tabuleiro 5×5 vence. Empate = nova partida!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(5,1fr)";
board.style.width="min(100%,340px)";
function mk(){b=new Array(25).fill(0);turn=0;paint();}
function lines(){
  const L=[];
  for(let r=0;r<5;r++)for(let c=0;c<=1;c++)L.push([r*5+c,r*5+c+1,r*5+c+2,r*5+c+3]);
  for(let c=0;c<5;c++)for(let r=0;r<=1;r++)L.push([r*5+c,(r+1)*5+c,(r+2)*5+c,(r+3)*5+c]);
  for(let r=0;r<=1;r++)for(let c=0;c<=1;c++)L.push([r*5+c,(r+1)*5+c+1,(r+2)*5+c+2,(r+3)*5+c+3]);
  for(let r=0;r<=1;r++)for(let c=3;c<5;c++)L.push([r*5+c,(r+1)*5+c-1,(r+2)*5+c-2,(r+3)*5+c-3]);
  return L;
}
const LINES=lines();
function wins(who){return LINES.some(L=>L.every(i=>b[i]===who));}
function findWin(who){
  for(const L of LINES){
    const vs=L.map(i=>b[i]);
    if(vs.filter(v=>v===who).length===3&&vs.includes(0))return L[vs.indexOf(0)];
  }
  return-1;
}
function paint(){
  board.innerHTML="";
  b.forEach((v,i)=>{
    const d=H.el("button","g-cell",v===1?"❌":v===2?"⭕":"",board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    if(!v&&turn===0)d.addEventListener("click",()=>{
      if(over||turn!==0||b[i])return;
      b[i]=1;H.sfx("tick");
      if(wins(1)){over=true;paint();return H.done({win:true,score:300,title:"4 em linha!",sub:"Você venceu a CPU!"});}
      if(b.every(v2=>v2)){say("Empate! Nova partida…");H.after(800,mk);return;}
      turn=1;hud.set("vz","CPU (O)");paint();H.after(500,ai);
    });
  });
}
function ai(){
  if(over)return;
  let m=findWin(2);
  if(m<0)m=findWin(1);
  if(m<0){
    const free=b.map((v,i)=>v? -1:i).filter(i=>i>=0);
    const pref=free.filter(i=>[6,7,8,11,12,13,16,17,18].includes(i));
    m=(pref.length?pref:free)[Math.floor(Math.random()*(pref.length?pref.length:free.length))];
  }
  b[m]=2;H.sfx("tick");
  if(wins(2)){over=true;paint();return H.done({win:false,score:50,title:"CPU alinhou 4!",sub:"Bloqueie as trincas dela!"});}
  if(b.every(v=>v)){say("Empate! Nova partida…");H.after(800,mk);return;}
  turn=0;hud.set("vz","você (X)");paint();
}
mk();
}});"""

# 249 — Batalha Naval
GAMES[249] = r"""/* NCODE N · 249 Batalha Naval — afunde tudo primeiro! */
GREG(249,{
init(root,H){
const N=8;
let over=false,ps=[],cs=[],psh=[],csh=[],turn=0,hunt=[];
const hud=H.hud(root,[["vc","SEUS NAVIOS",5],["cp","DELES",5]]);
const say=H.msg(root,"Clique no <b>mar inimigo</b> (acima) para atirar! 🚢 seus navios abaixo. Afunde os 5 dele primeiro. Navios: 3,2,2,1,1.");
const box=H.el("div","g-col",null,root);
H.el("div","g-chip","🌊 MAR INIMIGO — clique para atirar",box);
const eb=H.el("div","g-board",null,box);
H.el("div","g-chip","🚢 SUA FROTA",box);
const pb=H.el("div","g-board",null,box);
[eb,pb].forEach(bd=>{bd.style.gridTemplateColumns="repeat(8,1fr)";bd.style.width="min(100%,320px)";});
const SHIPS=[3,2,2,1,1];
function place(){
  const grid=new Array(N*N).fill(0);
  const ships=[];
  for(const len of SHIPS){
    let ok=false;
    for(let t=0;t<200&&!ok;t++){
      const hz=Math.random()<.5;
      const r=Math.floor(Math.random()*N),c=Math.floor(Math.random()*N);
      const cells=[];
      for(let i=0;i<len;i++){
        const rr=hz?r:r+i,cc=hz?c+i:c;
        if(rr>=N||cc>=N)break;
        cells.push(rr*N+cc);
      }
      if(cells.length!==len)continue;
      if(cells.some(i=>grid[i]))continue;
      let touch=false;
      cells.forEach(i=>{
        const ir=(i/N)|0,ic=i%N;
        for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
          const nr=ir+dr,nc=ic+dc;
          if(nr>=0&&nr<N&&nc>=0&&nc<N&&grid[nr*N+nc]&&!cells.includes(nr*N+nc))touch=true;
        }
      });
      if(touch)continue;
      cells.forEach(i=>grid[i]=1);
      ships.push({cells,hits:0});
      ok=true;
    }
  }
  return{grid,ships};
}
function setup(){
  const p=place(),c=place();
  ps=p.ships;cs=c.ships;
  psh=new Array(N*N).fill(0);csh=new Array(N*N).fill(0);
  turn=0;
}
function sunkCount(sh){return sh.filter(s=>s.hits>=s.cells.length).length;}
function paint(){
  if(over)return;
  hud.set("vc",(5-sunkCount(ps))+"");
  hud.set("cp",(5-sunkCount(cs))+"");
  eb.innerHTML="";pb.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",csh[i]===2?"🔥":csh[i]===1?"💦":"🌊",eb);
    d.style.aspectRatio="1";d.style.fontSize="13px";d.style.minWidth="0";
    if(!csh[i]&&turn===0)d.addEventListener("click",()=>fire(i));
  }
  for(let i=0;i<N*N;i++){
    const mine=ps.some(s=>s.cells.includes(i));
    const d=H.el("div","g-cell",psh[i]===2?"🔥":psh[i]===1?"💦":mine?"🚢":"🌊",pb);
    d.style.aspectRatio="1";d.style.fontSize="13px";
  }
}
function fire(i){
  if(over||turn!==0||csh[i])return;
  const s=cs.find(k=>k.cells.includes(i));
  if(s){s.hits++;csh[i]=2;H.sfx("ok");say(s.hits>=s.cells.length?"🔥 NAVIO DESTRUÍDO!":"🔥 Acertou!");}
  else{csh[i]=1;H.sfx("bad");say("💦 Água…");}
  if(sunkCount(cs)>=5){over=true;paint();
    return H.done({win:true,score:300,title:"Almirante!",sub:"Frota inimiga afundada!"});}
  turn=1;paint();H.after(600,ai);
}
function ai(){
  if(over)return;
  let i=-1;
  hunt=hunt.filter(h=>!psh[h]);
  if(hunt.length)i=hunt.shift();
  else{
    const free=psh.map((v,k)=>v? -1:k).filter(k=>k>=0);
    i=free[Math.floor(Math.random()*free.length)];
  }
  const s=ps.find(k=>k.cells.includes(i));
  if(s){
    s.hits++;psh[i]=2;
    const ir=(i/N)|0,ic=i%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{
      const nr=ir+d[0],nc=ic+d[1];
      if(nr>=0&&nr<N&&nc>=0&&nc<N&&!psh[nr*N+nc])hunt.push(nr*N+nc);
    });
    if(s.hits>=s.cells.length)say("🔥 Eles afundaram um seu!");
  }else{psh[i]=1;}
  H.sfx("tick");
  if(sunkCount(ps)>=5){over=true;paint();
    return H.done({win:false,score:sunkCount(cs)*40,title:"Navios perdidos!",sub:"Sua frota afundou. Mire com padrão!"});}
  turn=0;paint();
}
setup();paint();
}});"""

# 250 — Mancala
GAMES[250] = r"""/* NCODE N · 250 Mancala — capture mais sementes! */
GREG(250,{
init(root,H){
let over=false,pits=[],turn=0;
const hud=H.hud(root,[["vc","SEU DEPÓSITO",0],["cp","DELE",0]]);
const say=H.msg(root,"Clique numa <b>sua casa</b> (fileira de baixo) para semear! Última no seu depósito = joga de novo. Última em casa vazia sua = captura a frente!");
const box=H.el("div","g-col",null,root);
const bd=H.el("div","g-board",null,box);
bd.style.gridTemplateColumns="repeat(8,1fr)";
bd.style.width="min(100%,460px)";
function mk(){pits=new Array(14).fill(4);pits[6]=0;pits[13]=0;turn=0;}
function paint(){
  if(over)return;
  hud.set("vc",pits[6]);hud.set("cp",pits[13]);
  bd.innerHTML="";
  // layout: depósito CPU em cima-esq? simplifica: linha CPU (7-12 invertida), linha você (0-5)
  const mk2=(txt,fn,hot)=>{
    const d=H.el("button","g-cell"+(hot?" hot":""),txt,bd);
    d.style.minHeight="56px";d.style.fontSize="15px";
    if(fn)d.addEventListener("click",fn);
    return d;
  };
  mk2("CPU\n"+pits[13],null,false).style.gridRow="span 2";
  for(let i=12;i>=7;i--)mk2(""+pits[i],null,false);
  mk2("VOCÊ\n"+pits[6],null,false).style.gridRow="span 2";
  for(let i=0;i<6;i++)mk2(""+pits[i],()=>move(i),turn===0&&pits[i]>0);
}
function move(i){
  if(over||turn!==0||i<0||i>5||!pits[i])return;
  let s=pits[i];pits[i]=0;let p=i;
  while(s>0){p=(p+1)%14;if(p===13)continue;pits[p]++;s--;}
  H.sfx("tick");
  if(p===6){paint();say("🎁 Jogue de novo!");return;}
  if(p<6&&pits[p]===1&&pits[12-p]>0){
    pits[6]+=pits[12-p]+1;pits[12-p]=0;pits[p]=0;
    say("💰 Captura!");
  }
  if(checkEnd())return;
  turn=1;paint();say("CPU pensando…");
  H.after(700,ai);
}
function checkEnd(){
  const pe=pits.slice(0,6).every(v=>!v),ae=pits.slice(7,13).every(v=>!v);
  if(pe||ae){
    for(let i=0;i<6;i++){pits[6]+=pits[i];pits[i]=0;}
    for(let i=7;i<13;i++){pits[13]+=pits[i];pits[i]=0;}
    over=true;paint0();
    hud.set("vc",pits[6]);hud.set("cp",pits[13]);
    if(pits[6]>pits[13])return H.done({win:true,score:pits[6]*5,title:"Semeador mestre!",sub:pits[6]+" × "+pits[13]+"."});
    if(pits[6]<pits[13])return H.done({win:false,score:pits[6]*5,title:"Colheita magra!",sub:pits[6]+" × "+pits[13]+". Mire capturas!"});
    return H.done({win:true,score:pits[6]*5,title:"Empate!",sub:pits[6]+" × "+pits[13]+"."});
  }
  return false;
}
function paint0(){}
function ai(){
  if(over)return;
  let opts=[];
  for(let i=7;i<13;i++)if(pits[i])opts.push(i);
  if(!opts.length){checkEnd();return;}
  // prefere jogada extra, depois captura
  let pick=opts[0];
  for(const i of opts){
    if((i+pits[i])%14===13||((i+pits[i])%14===13)){pick=i;break;}
  }
  let best=pick,bs=-1;
  for(const i of opts){
    const land=(i+pits[i])%14;
    let sc=pits[i];
    if(land===13)sc+=20;
    if(land>=7&&land<13&&pits[land]===0&&pits[12-land]>0)sc+=pits[12-land];
    if(sc>bs){bs=sc;best=i;}
  }
  let s=pits[best];pits[best]=0;let p=best;
  while(s>0){p=(p+1)%14;if(p===6)continue;pits[p]++;s--;}
  if(p===13){paint();say("CPU joga de novo!");H.after(700,ai);return;}
  if(p>=7&&p<13&&pits[p]===1&&pits[12-p]>0){
    pits[13]+=pits[12-p]+1;pits[12-p]=0;pits[p]=0;
  }
  if(checkEnd())return;
  turn=0;paint();
}
mk();paint();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
