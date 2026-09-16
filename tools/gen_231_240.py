#!/usr/bin/env python3
"""Gera games/g231..g240 — CARTAS & TABULEIRO (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 231 — Paciência Clássica
GAMES[231] = r"""/* NCODE N · 231 Paciência Clássica — feche os 4 naipes! */
GREG(231,{
init(root,H){
const S=["♠","♥","♦","♣"];
const RED=s=>s===1||s===2;
let over=false,tab=[],stock=[],waste=[],found=[[],[],[],[]],sel=null,moves=0;
const hud=H.hud(root,[["mv","JOGADAS",0],["fd","FUNDAÇÕES","0/52"]]);
const say=H.msg(root,"Clique no <b>estoque</b> para virar · clique numa carta e no <b>destino</b> (mesa alterna cor e desce · fundação sobe no naipe) · clique de novo na carta para <b>auto-fundação</b>!");
const box=H.el("div","g-col",null,root);
function mkDeck(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({s,r,up:false});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  return d;
}
function deal(){
  const d=mkDeck();
  tab=[];
  for(let i=0;i<7;i++){
    const p=[];
    for(let j=0;j<=i;j++){const c=d.pop();c.up=j===i;p.push(c);}
    tab.push(p);
  }
  stock=d;waste=[];found=[[],[],[],[]];sel=null;moves=0;
  hud.set("mv",0);
}
deal();
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
function cardEl(c,mini){
  const d=H.el("button","g-card"+(RED(c.s)?" red":""),c.up?RN(c.r)+S[c.s]:"🂠",null);
  d.style.width="46px";d.style.height="62px";d.style.fontSize="15px";
  if(mini){d.style.width="40px";d.style.height="54px";}
  return d;
}
function selCards(){
  if(!sel)return[];
  if(sel.f==="w")return waste.length?[waste[waste.length-1]]:[];
  return tab[sel.i].slice(sel.j);
}
function tryFound(){
  const cs=selCards();
  if(cs.length!==1||!cs[0].up)return false;
  const c=cs[0],f=found[c.s];
  if((f.length===0&&c.r===1)||(f.length>0&&f[f.length-1].r===c.r-1)){
    if(sel.f==="w")waste.pop();else tab[sel.i].pop();
    f.push(c);flipTop(sel);sel=null;moves++;hud.set("mv",moves);
    H.sfx("ok");paint();checkWin();return true;
  }
  return false;
}
function flipTop(s){
  if(s&&s.f==="t"){
    const p=tab[s.i];
    if(p.length&&!p[p.length-1].up)p[p.length-1].up=true;
  }
}
function checkWin(){
  const n=found.reduce((a,f)=>a+f.length,0);
  hud.set("fd",n+"/52");
  if(n>=52){over=true;H.score(Math.max(100,2000-moves*5));
    return H.done({win:true,score:Math.max(100,2000-moves*5),title:"Paciência vencida!",sub:"52 cartas em "+moves+" jogadas."});}
}
function paint(){
  if(over)return;
  box.innerHTML="";
  const top=H.el("div","g-row",null,box);
  const st=H.el("button","g-card","🂠 ×"+stock.length,top);
  st.style.width="46px";st.style.height="62px";
  st.addEventListener("click",()=>{
    if(over)return;
    if(stock.length){const c=stock.pop();c.up=true;waste.push(c);}
    else{while(waste.length){const c=waste.pop();c.up=false;stock.push(c);}}
    sel=null;moves++;hud.set("mv",moves);H.sfx("tick");paint();
  });
  const wv=waste.length?cardEl(waste[waste.length-1]):H.el("div","g-card","·",top);
  if(waste.length){
    wv.addEventListener("click",()=>{
      if(over)return;
      if(sel&&sel.f==="w"){if(!tryFound()){sel=null;paint();}return;}
      sel={f:"w"};H.sfx("tick");paint();
    });
    if(sel&&sel.f==="w")wv.classList.add("hot");
    top.appendChild(wv);
  }
  found.forEach((f,i)=>{
    const d=f.length?cardEl(f[f.length-1],true):H.el("div","g-card",S[i],top);
    d.style.width="40px";d.style.height="54px";
    d.addEventListener("click",()=>{if(!over){if(!tryFound()){sel=null;paint();}}});
    top.appendChild(d);
  });
  const tb=H.el("div","g-row",null,box);
  tb.style.alignItems="flex-start";
  tab.forEach((p,i)=>{
    const col=H.el("div","g-col",null,tb);
    col.style.minWidth="48px";col.style.gap="0";
    if(!p.length){
      const d=H.el("button","g-card","·",col);
      d.style.width="46px";d.style.height="62px";
      d.addEventListener("click",()=>dropTab(i));
    }
    p.forEach((c,j)=>{
      const d=cardEl(c);
      if(j>0)d.style.marginTop="-38px";
      if(sel&&sel.f==="t"&&sel.i===i&&j>=sel.j)d.classList.add("hot");
      d.addEventListener("click",()=>{
        if(over||!c.up)return;
        if(sel&&sel.f==="t"&&sel.i===i&&sel.j===j){
          if(!tryFound()){sel=null;paint();}
          return;
        }
        // é destino?
        if(sel&&(sel.f==="w"||sel.i!==i)){dropTab(i);return;}
        sel={f:"t",i,j};H.sfx("tick");paint();
      });
      col.appendChild(d);
    });
  });
}
function dropTab(i){
  if(!sel){paint();return;}
  const cs=selCards();
  if(!cs.length||!cs[0].up){sel=null;paint();return;}
  const p=tab[i],top=p[p.length-1];
  const ok=!top?(cs[0].r===13):(top.up&&RED(top.s)!==RED(cs[0].s)&&top.r===cs[0].r+1);
  if(!ok){H.sfx("bad");sel=null;paint();return;}
  if(sel.f==="w")waste.pop();
  else tab[sel.i].splice(sel.j);
  cs.forEach(c=>p.push(c));
  flipTop(sel);sel=null;moves++;hud.set("mv",moves);
  H.sfx("tick");paint();checkWin();
}
paint();
H.btn(root,"🔄 Reembaralhar",()=>{if(!over){deal();paint();say("Nova mesa!");}},false);
}});"""

# 232 — Blackjack
GAMES[232] = r"""/* NCODE N · 232 Blackjack — banca de $100 a $150! */
GREG(232,{
init(root,H){
let over=false,deck=[],ph=[],dh=[],bank=100,bet=10,state="bet",hide=true;
const hud=H.hud(root,[["bc","BANCA","$100"],["rd","RODADA",1]]);
const say=H.msg(root,"Chegue a <b>$150</b> (aposta $10)! <b>Pedir</b> soma carta · <b>Parar</b> encerra · dealer para no 17. Blackjack paga 3:2!");
const box=H.el("div","g-col",null,root);
let rd=1;
function mk(){
  deck=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push(Math.min(r,10));
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
}
function val(h){
  let t=h.reduce((a,b)=>a+b,0),aces=h.filter(v=>v===1).length;
  while(aces>0&&t+10<=21){t+=10;aces--;}
  return t;
}
function paint(){
  hud.set("bc","$"+bank);hud.set("rd",rd);
  box.innerHTML="";
  const dv=hide?"?":val(dh);
  H.el("div","g-msg","🤖 Dealer ("+dv+"): "+dh.map((c,i)=>hide&&i===1?"🂠":c).join(" "),box);
  H.el("div","g-msg","🧍 Você ("+val(ph)+"): "+ph.join(" "),box);
  const row=H.el("div","g-row",null,box);
  if(state==="play"){
    H.btn(row,"➕ Pedir",()=>{
      if(over)return;
      ph.push(deck.pop());H.sfx("tick");
      if(val(ph)>21)finish();
      else paint();
    },true);
    H.btn(row,"✋ Parar",()=>{if(!over)finish();},false);
  }else{
    H.btn(row,"🃏 Nova rodada ($10)",()=>{
      if(over||bank<10)return;
      bank-=10;rd++;start();
    },true);
  }
}
function start(){
  if(deck.length<12)mk();
  ph=[deck.pop(),deck.pop()];dh=[deck.pop(),deck.pop()];
  hide=true;state="play";paint();
  if(val(ph)===21)finish();
}
function finish(){
  hide=false;state="bet";
  while(val(dh)<17)dh.push(deck.pop());
  const p=val(ph),d=val(dh);
  let msg="";
  if(p>21){msg="💥 Estourou! −$10";}
  else if(d>21){bank+=20;msg="🤖 Dealer estourou! +$10";}
  else if(p===21&&ph.length===2&&!(d===21&&dh.length===2)){bank+=25;msg="🂡 BLACKJACK! +$15";}
  else if(p>d){bank+=20;msg="Você "+p+" × "+d+"! +$10";}
  else if(p<d){msg="Dealer "+d+" × "+p+". −$10";}
  else{bank+=10;msg="Empate — aposta de volta.";}
  H.score(bank);H.sfx(bank>=100?"ok":"bad");say(msg);
  paint();
  if(bank>=150){over=true;return H.done({win:true,score:bank,title:"Mesa dominada!",sub:"Banca de $"+bank+"!"});}
  if(bank<10){over=true;return H.done({win:false,score:bank,title:"Banca quebrada!",sub:"Sem fichas. Pare no 17+!"});}
}
mk();
bank-=10;start();
}});"""

# 233 — Mão de Poker
GAMES[233] = r"""/* NCODE N · 233 Mão de Poker — banca $25 → $100! */
GREG(233,{
init(root,H){
const S=["♠","♥","♦","♣"],RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
const PAY=[["Royal Flush",250],["Straight Flush",50],["Quadra",25],["Full House",9],["Flush",6],["Straight",4],["Trinca",3],["Dois pares",2],["Par de J+",1],["Nada",0]];
let over=false,deck=[],hand=[],hold=[],bank=25,bet=5,drawn=false;
const hud=H.hud(root,[["bc","BANCA","$25"],["ap","APOSTA","$5"]]);
const say=H.msg(root,"Apuesta $5 por mão! Clique para <b>segurar</b> cartas, <b>trocar</b> o resto 1×. Par de valetes+ já paga!");
const box=H.el("div","g-col",null,root);
function mk(){
  deck=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push({s,r});
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
}
function deal(){
  bank-=bet;drawn=false;hold=[false,false,false,false,false];
  hand=[deck.pop(),deck.pop(),deck.pop(),deck.pop(),deck.pop()];
  paint();
}
function rank(){
  const rs=hand.map(c=>c.r===1?14:c.r).sort((a,b)=>a-b);
  const flush=hand.every(c=>c.s===hand[0].s);
  let straight=rs.every((v,i)=>i===0||v===rs[i-1]+1);
  if(!straight&&rs.join()=="2,3,4,5,14")straight=true;
  const cnt={};
  rs.forEach(v=>cnt[v]=(cnt[v]||0)+1);
  const groups=Object.values(cnt).sort((a,b)=>b-a);
  const isRoyal=flush&&straight&&rs[0]===10;
  if(isRoyal)return 0;
  if(flush&&straight)return 1;
  if(groups[0]===4)return 2;
  if(groups[0]===3&&groups[1]===2)return 3;
  if(flush)return 4;
  if(straight)return 5;
  if(groups[0]===3)return 6;
  if(groups[0]===2&&groups[1]===2)return 7;
  if(groups[0]===2){
    const pv=Object.keys(cnt).find(k=>cnt[k]===2);
    if(+pv>=11)return 8;
  }
  return 9;
}
function paint(){
  hud.set("bc","$"+bank);
  box.innerHTML="";
  const row=H.el("div","g-row",null,box);
  hand.forEach((c,i)=>{
    const b=H.el("button","g-card"+(hold[i]?" hot":"")+(c.s===1||c.s===2?" red":""),RN(c.r)+S[c.s],row);
    b.style.width="52px";b.style.height="72px";b.style.fontSize="20px";
    b.addEventListener("click",()=>{
      if(over||drawn)return;
      hold[i]=!hold[i];H.sfx("tick");paint();
    });
  });
  const r2=H.el("div","g-row",null,box);
  if(!drawn){
    H.btn(r2,"🔄 Trocar (1×)",()=>{
      if(over)return;
      hand=hand.map((c,i)=>hold[i]?c:deck.pop());
      drawn=true;
      const rk=rank(),pay=PAY[rk][1]*bet;
      bank+=pay;H.score(bank);H.sfx(pay?"ok":"bad");
      say("🎰 "+PAY[rk][0]+"! "+(pay?" +$"+pay:"nada."));
      paint();
      if(bank>=100){over=true;return H.done({win:true,score:bank,title:"Tubarão do poker!",sub:"Banca de $"+bank+"!"});}
      if(bank<bet){over=true;return H.done({win:false,score:bank,title:"Sem fichas!",sub:"Segure pares e draws!"});}
    },true);
  }else{
    H.btn(r2,"🃏 Nova mão ($5)",()=>{if(!over&&bank>=bet){if(deck.length<12)mk();deal();}},true);
  }
  H.el("div","g-msg","💰 "+PAY.slice(0,9).map(p=>p[0]+" $"+p[1]*bet).join(" · "),box);
}
mk();deal();
}});"""

# 234 — Guerra de Cartas
GAMES[234] = r"""/* NCODE N · 234 Guerra de Cartas — leve as 52! */
GREG(234,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,you=[],cpu=[],log=[],battles=0;
const hud=H.hud(root,[["vc","SUAS","26"],["cp","DELE","26"],["bt","BATALHAS",0]]);
const say=H.msg(root,"Aperte <b>BATALHAR</b>! Maior leva. Empate = GUERRA (3 viradas + decide). Leve as 52 (máx 300 batalhas)!");
const box=H.el("div","g-col",null,root);
const vs=H.el("div","g-msg","",box);
const lg=H.el("div","g-msg","",box);
function deal(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push(r);
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  you=d.slice(0,26);cpu=d.slice(26);
}
deal();
function paint(){
  hud.set("vc",you.length);hud.set("cp",cpu.length);hud.set("bt",battles);
  lg.innerHTML=log.slice(-4).join("<br>");
}
function battle(){
  if(over)return;
  battles++;
  const pile=[];
  while(true){
    if(!you.length||!cpu.length)break;
    const a=you.shift(),b=cpu.shift();
    pile.push(a,b);
    vs.innerHTML="⚔️ Você <b>"+RN(a)+"</b> × <b>"+RN(b)+"</b> CPU";
    if(a===1||b===1){/* A vale 14 */}
    const va=a===1?14:a,vb=b===1?14:b;
    if(va===vb){
      log.push("🔥 GUERRA! ("+pile.length+" na mesa)");
      for(let i=0;i<3;i++){
        if(you.length)pile.push(you.shift());
        if(cpu.length)pile.push(cpu.shift());
      }
      continue;
    }
    if(va>vb){you.push(...pile);log.push("✅ Você levou "+pile.length+"!");}
    else{cpu.push(...pile);log.push("❌ CPU levou "+pile.length+".");}
    break;
  }
  H.sfx("tick");paint();
  if(!cpu.length||!you.length||battles>=300){
    over=true;
    const winCpu=!you.length?false:!cpu.length?true:you.length>=cpu.length;
    H.score(you.length);
    if(winCpu&&you.length>=cpu.length&&you.length>0||!cpu.length)
      return H.done({win:true,score:100,title:"General invicto!",sub:"Todas as 52 cartas são suas!"});
    if(battles>=300&&you.length>=cpu.length)
      return H.done({win:true,score:you.length,title:"Venceu no tempo!",sub:you.length+" × "+cpu.length+" em 300 batalhas."});
    return H.done({win:false,score:cpu.length,title:"Derrota!",sub:"CPU ficou com as cartas. Guerra é sorte!"});
  }
}
paint();
H.btn(root,"⚔️ BATALHAR!",battle,true);
H.btn(root,"⏩ 10 batalhas",()=>{if(!over){for(let i=0;i<10&&!over;i++)battle();}},false);
}});"""

# 235 — Uno Style
GAMES[235] = r"""/* NCODE N · 235 Uno Style — zere a mão primeiro! */
GREG(235,{
init(root,H){
const COL=["🟥","🟩","🟦","🟨"];
let over=false,deck=[],disc=[],hands=[[],[],[]],turn=0,color=0,dir=1,drawStack=0,skipNext=false;
const hud=H.hud(root,[["vc","SUAS",7],["a1","CPU1",7],["a2","CPU2",7]]);
const say=H.msg(root,"Combine <b>cor, número ou símbolo</b>! ⏭️ pula · +2 acumula · 🌈 troca a cor (clique na cor). Zere antes das CPUs!");
const box=H.el("div","g-col",null,root);
const tp=H.el("div","g-msg","",box);
const hd=H.el("div","g-row",null,box);
function mk(){
  deck=[];
  for(let c=0;c<4;c++){
    for(let n=0;n<=9;n++){deck.push({c,n});if(n>0)deck.push({c,n});}
    deck.push({c,s:"skip"},{c,s:"skip"},{c,s:"d2"},{c,s:"d2"});
  }
  for(let i=0;i<4;i++)deck.push({c:-1,s:"wild"});
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
}
function nm(card){return card.s?(card.s==="skip"?"⏭️":card.s==="d2"?"+2":"🌈"):card.n;}
function playable(card){
  const t=disc[disc.length-1];
  if(card.s==="wild")return true;
  if(card.c===color)return true;
  if(!card.s&&!t.s&&card.n===t.n)return true;
  if(card.s&&t.s&&card.s===t.s)return true;
  return false;
}
function draw(h,n){for(let i=0;i<n;i++){if(!deck.length)reshuffle();h.push(deck.pop());}}
function reshuffle(){
  const t=disc.pop();
  deck=disc;disc=[t];
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const x=deck[i];deck[i]=deck[j];deck[j]=x;}
}
function start(){
  mk();hands=[[],[],[]];
  for(let i=0;i<7;i++)for(let h=0;h<3;h++)hands[h].push(deck.pop());
  disc=[deck.pop()];
  while(disc[0].s){deck.push(disc[0]);disc=[deck.pop()];}
  color=disc[0].c;turn=0;
  paint();
}
function paint(){
  if(over)return;
  hud.set("vc",hands[0].length);hud.set("a1",hands[1].length);hud.set("a2",hands[2].length);
  const t=disc[disc.length-1];
  tp.innerHTML="🎴 Mesa: "+(t.c>=0?COL[t.c]:"🌈")+" <b>"+nm(t)+"</b> · cor: "+COL[color]+(drawStack?" · +"+drawStack:"")+(turn===0?" · <b>SUA VEZ</b>":" · CPU"+turn+"…");
  hd.innerHTML="";
  hands[0].forEach((card,i)=>{
    const ok=turn===0&&playable(card);
    const b=H.el("button","g-card"+(ok?" hot":""),(card.c>=0?COL[card.c]:"🌈")+nm(card),hd);
    b.style.width="56px";b.style.height="76px";b.style.fontSize="16px";
    if(ok)b.addEventListener("click",()=>play(i));
  });
}
function play(i){
  if(over||turn!==0)return;
  if(i<0||i>=hands[0].length)return;
  const card=hands[0].splice(i,1)[0];
  disc.push(card);
  H.sfx("tick");
  if(card.s==="wild"){
    say("🌈 Escolha a cor!");
    const row=H.el("div","g-row",null,box);
    COL.forEach((cc,ci)=>{
      H.btn(row,cc,()=>{color=ci;row.remove();afterPlay(card,0);},false);
    });
    paint();
    return;
  }
  color=card.c;
  afterPlay(card,0);
}
function afterPlay(card,who){
  if(!hands[who].length){
    over=true;
    if(who===0)return H.done({win:true,score:200,title:"UNO!",sub:"Você zerou primeiro!"});
    return H.done({win:false,score:hands[0].length,title:"CPU"+who+" venceu!",sub:"Restavam "+hands[0].length+" na sua mão."});
  }
  let nt=(who+1)%3;
  if(card.s==="skip")nt=(nt+1)%3;
  if(card.s==="d2"){drawStack+=2;}
  if(drawStack>0){
    draw(hands[nt],drawStack);
    say("CPU"+(nt||"você")+" comprou "+drawStack+"!");drawStack=0;
    nt=(nt+1)%3;
  }
  turn=nt;paint();
  if(turn!==0)H.after(800,ai);
}
function ai(){
  if(over||turn===0)return;
  const h=hands[turn];
  let ix=h.findIndex(c=>playable(c)&&c.s==="d2");
  if(ix<0)ix=h.findIndex(c=>playable(c)&&c.s==="skip");
  if(ix<0)ix=h.findIndex(c=>playable(c)&&!c.s);
  if(ix<0)ix=h.findIndex(c=>playable(c));
  if(ix<0){
    draw(h,1);
    say("CPU"+turn+" comprou.");
    turn=(turn+1)%3;paint();
    if(turn!==0)H.after(800,ai);
    return;
  }
  const card=h.splice(ix,1)[0];
  disc.push(card);
  if(card.s==="wild"){
    const cnt=[0,0,0,0];
    h.forEach(c=>{if(c.c>=0)cnt[c.c]++;});
    color=cnt.indexOf(Math.max(...cnt));
  }else color=card.c;
  say("CPU"+turn+" jogou "+nm(card)+".");
  afterPlay(card,turn);
}
start();
H.btn(root,"➕ Comprar",()=>{
  if(over||turn!==0)return;
  draw(hands[0],1);H.sfx("tick");
  turn=1;paint();H.after(800,ai);
},false);
}});"""

# 236 — Jogo da Memória
GAMES[236] = r"""/* NCODE N · 236 Jogo da Memória — 12 pares! */
GREG(236,{
init(root,H){
const EM=["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐸"];
let over=false,deck=[],open=[],matched=0,moves=0,lock=false;
const hud=H.hud(root,[["pr","PARES","0/12"],["jg","JOGADAS",0]]);
const say=H.msg(root,"Vire 2 cartas por vez e decore! Complete os 12 pares — menos jogadas, mais pontos.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(6,1fr)";
board.style.width="min(100%,440px)";
deck=EM.concat(EM).map((e,i)=>({e,id:i,up:false,ok:false}));
for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
function paint(){
  board.innerHTML="";
  deck.forEach((c,i)=>{
    const d=H.el("button","g-card"+(c.ok?" good":c.up?" hot":""),c.up||c.ok?c.e:"🂠",board);
    d.style.aspectRatio="0.72";d.style.fontSize="22px";
    d.addEventListener("click",()=>{
      if(over||lock||c.up||c.ok)return;
      c.up=true;open.push(i);H.sfx("tick");paint();
      if(open.length>=2){
        moves++;hud.set("jg",moves);lock=true;
        const[a,b]=open;open=[];
        if(deck[a].e===deck[b].e){
          H.after(400,()=>{
            deck[a].ok=deck[b].ok=true;matched++;
            hud.set("pr",matched+"/12");H.sfx("ok");lock=false;paint();
            if(matched>=12){
              over=true;
              const sc=Math.max(100,1200-moves*15);H.score(sc);
              return H.done({win:true,score:sc,title:"Memória de elefante!",sub:"12 pares em "+moves+" jogadas."});
            }
          });
        }else{
          H.after(750,()=>{deck[a].up=deck[b].up=false;lock=false;paint();});
        }
      }
    });
  });
}
paint();
}});"""

# 237 — Pesca
GAMES[237] = r"""/* NCODE N · 237 Pesca — mais quartetos vence! */
GREG(237,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,stock=[],hands=[[],[],[]],sets=[0,0,0],turn=0,busy=false;
const hud=H.hud(root,[["vc","SEUS",0],["c1","CPU1",0],["c2","CPU2",0]]);
const say=H.msg(root,"Peça um valor que você tem a uma CPU! Acertou, pede de novo; errou, pesca. Mais quartetos no fim vence.");
const box=H.el("div","g-col",null,root);
const tb=H.el("div","g-msg","",box);
const hb=H.el("div","g-row",null,box);
function mk(){
  stock=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)stock.push(r);
  for(let i=stock.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=stock[i];stock[i]=stock[j];stock[j]=t;}
  hands=[[],[],[]];
  for(let i=0;i<7;i++)for(let h=0;h<3;h++)hands[h].push(stock.pop());
  checkAll();
}
function checkAll(){hands.forEach((h,i)=>checkSet(i));}
function checkSet(i){
  const cnt={};
  hands[i].forEach(r=>cnt[r]=(cnt[r]||0)+1);
  Object.keys(cnt).forEach(k=>{
    if(cnt[k]===4){
      hands[i]=hands[i].filter(r=>+r!==+k);
      sets[i]++;H.sfx("ok");
    }
  });
  hud.set("vc",sets[0]);hud.set("c1",sets[1]);hud.set("c2",sets[2]);
}
function ranks(i){return[...new Set(hands[i])].sort((a,b)=>a-b);}
function paint(){
  tb.innerHTML="🎣 Sua mão: <b>"+ranks(0).map(RN).join(" ")+"</b> ("+hands[0].length+") · CPU1: "+hands[1].length+" · CPU2: "+hands[2].length+" · monte: "+stock.length+(turn===0&&!busy?"<br>Escolha valor + alvo!":turn===0?"":"<br>CPU"+turn+" pensando…");
  hb.innerHTML="";
  if(turn===0&&!busy){
    ranks(0).forEach(r=>{
      [1,2].forEach(t=>{
        const b=H.el("button","g-chip",RN(r)+" → CPU"+t,hb);
        b.style.cursor="pointer";
        b.addEventListener("click",()=>ask(0,t,r));
      });
    });
  }
}
function ask(from,to,r){
  if(over||busy)return;
  busy=true;
  const has=hands[to].filter(v=>v===r);
  if(has.length){
    hands[to]=hands[to].filter(v=>v!==r);
    hands[from].push(...has);
    say((from===0?"Você":("CPU"+from))+" tomou "+has.length+"× "+RN(r)+"!");
    checkSet(from);paint();
    H.after(900,()=>{
      busy=false;
      if(checkEnd())return;
      if(from===0)paint();
      else aiTurn(from);
    });
  }else{
    say((from===0?"Você":("CPU"+from))+" pediu "+RN(r)+"… VAI PESCAR!");
    H.after(900,()=>{
      if(stock.length){
        const c=stock.pop();
        hands[from].push(c);checkSet(from);
        if(c===r){
          say("🎣 Pescou justo "+RN(r)+"! De novo.");
          busy=false;paint();
          if(from!==0){busy=true;H.after(900,()=>{busy=false;aiTurn(from);});}
          return;
        }
      }
      turn=(from+1)%3;busy=false;paint();
      if(checkEnd())return;
      if(turn!==0)aiTurn(turn);
    });
  }
}
function aiTurn(who){
  if(over)return;
  if(!hands[who].length){
    if(stock.length)hands[who].push(stock.pop());
    turn=(who+1)%3;paint();
    if(checkEnd())return;
    if(turn!==0)aiTurn(turn);
    return;
  }
  const rs=ranks(who);
  const r=rs[Math.floor(Math.random()*rs.length)];
  const others=[0,1,2].filter(v=>v!==who);
  const to=others[Math.floor(Math.random()*others.length)];
  H.after(700,()=>ask(who,to,r));
}
function checkEnd(){
  if(sets[0]+sets[1]+sets[2]>=13||!stock.length&&hands.every(h=>!h.length)){
    over=true;
    const best=Math.max(...sets);
    if(sets[0]>=best)return H.done({win:true,score:sets[0]*60,title:"Pescador campeão!",sub:"Quartetos: você "+sets[0]+" × CPU "+sets[1]+" × "+sets[2]+"."});
    return H.done({win:false,score:sets[0]*60,title:"Rede furada!",sub:"Você "+sets[0]+" × CPU "+sets[1]+" × "+sets[2]+"."});
  }
  return false;
}
mk();paint();
}});"""

# 238 — Oito Maluco
GAMES[238] = r"""/* NCODE N · 238 Oito Maluco — zere primeiro! */
GREG(238,{
init(root,H){
const S=["♠","♥","♦","♣"],RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,stock=[],disc=[],hands=[[],[],[]],turn=0,suit=0;
const hud=H.hud(root,[["vc","SUAS",7],["a1","CPU1",7],["a2","CPU2",7]]);
const say=H.msg(root,"Combine <b>naipe ou valor</b>! 8 é curinga (você escolhe o naipe). Sem jogada, compre até 3. Zere primeiro!");
const box=H.el("div","g-col",null,root);
const tp=H.el("div","g-msg","",box);
const hd=H.el("div","g-row",null,box);
function mk(){
  stock=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)stock.push({s,r});
  for(let i=stock.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=stock[i];stock[i]=stock[j];stock[j]=t;}
  hands=[[],[],[]];
  for(let i=0;i<7;i++)for(let h=0;h<3;h++)hands[h].push(stock.pop());
  disc=[stock.pop()];suit=disc[0].s;turn=0;
}
function playable(c){
  const t=disc[disc.length-1];
  return c.r===8||c.s===suit||c.r===t.r;
}
function draw(h,n){for(let i=0;i<n;i++){if(!stock.length)reshuffle();if(stock.length)h.push(stock.pop());}}
function reshuffle(){
  const t=disc.pop();
  stock=disc;disc=[t];
  for(let i=stock.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const x=stock[i];stock[i]=stock[j];stock[j]=x;}
}
function paint(){
  if(over)return;
  hud.set("vc",hands[0].length);hud.set("a1",hands[1].length);hud.set("a2",hands[2].length);
  const t=disc[disc.length-1];
  tp.innerHTML="🎴 Mesa: <b>"+RN(t.r)+S[t.s]+"</b> · naipe: "+S[suit]+(turn===0?" · <b>SUA VEZ</b>":" · CPU"+turn+"…");
  hd.innerHTML="";
  hands[0].forEach((c,i)=>{
    const ok=turn===0&&playable(c);
    const b=H.el("button","g-card"+(ok?" hot":""),RN(c.r)+S[c.s],hd);
    b.style.width="48px";b.style.height="66px";b.style.fontSize="16px";
    if(ok)b.addEventListener("click",()=>play(0,i));
  });
  if(turn===0){
    const b=H.el("button","g-btn ghost","➕ Comprar",box);
    b.addEventListener("click",()=>{
      if(over||turn!==0)return;
      draw(hands[0],1);H.sfx("tick");
      if(hands[0].filter(playable).length===0&&stock.length){paint();say("Comprou… ainda sem jogada? Compre de novo ou passe.");}
      paint();
    });
    const p=H.el("button","g-btn ghost","⏭️ Passar",box);
    p.addEventListener("click",()=>{
      if(over||turn!==0)return;
      turn=1;paint();H.after(700,ai);
    });
  }
}
function play(who,i){
  if(over)return;
  if(i<0||i>=hands[who].length)return;
  const c=hands[who].splice(i,1)[0];
  disc.push(c);
  if(c.r===8){
    if(who===0){
      say("🃏 8! Escolha o naipe:");
      const row=H.el("div","g-row",null,box);
      S.forEach((ss,si)=>{
        H.btn(row,ss,()=>{suit=si;row.remove();after(who);},false);
      });
      return;
    }
    const cnt=[0,0,0,0];
    hands[who].forEach(k=>cnt[k.s]++);
    suit=cnt.indexOf(Math.max(...cnt));
  }else suit=c.s;
  after(who);
}
function after(who){
  H.sfx("tick");
  if(!hands[who].length){
    over=true;
    if(who===0)return H.done({win:true,score:200,title:"Maluco beleza!",sub:"Você zerou primeiro!"});
    return H.done({win:false,score:50,title:"CPU"+who+" zerou!",sub:"Restavam "+hands[0].length+" na sua mão."});
  }
  turn=(who+1)%3;paint();
  if(turn!==0)H.after(700,ai);
}
function ai(){
  if(over||turn===0)return;
  const h=hands[turn];
  let ix=h.findIndex(c=>playable(c)&&c.r!==8);
  if(ix<0)ix=h.findIndex(c=>playable(c));
  if(ix<0){
    draw(h,1);
    ix=h.findIndex(playable);
    if(ix<0){turn=(turn+1)%3;say("CPU"+((turn+2)%3)+" passou.");paint();if(turn!==0)H.after(700,ai);return;}
  }
  say("CPU"+turn+" jogou.");
  play(turn,ix);
}
mk();paint();
}});"""

# 239 — Rummy
GAMES[239] = r"""/* NCODE N · 239 Rummy — baixe 7 cartas em jogos! */
GREG(239,{
init(root,H){
const S=["♠","♥","♦","♣"],RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,stock=[],disc=[],ph=[],ch=[],drew=false;
const hud=H.hud(root,[["vc","SUAS",7],["cp","CPU",7],["mn","MONTE",38]]);
const say=H.msg(root,"Compre do <b>monte</b> ou do <b>descarte</b>, depois clique numa carta para <b>descartar</b>. Baixe tudo em trincas/sequências (3+)!");
const box=H.el("div","g-col",null,root);
const tp=H.el("div","g-msg","",box);
const hd=H.el("div","g-row",null,box);
function mk(){
  stock=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)stock.push({s,r,id:s*13+r});
  for(let i=stock.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=stock[i];stock[i]=stock[j];stock[j]=t;}
  ph=[];ch=[];
  for(let i=0;i<7;i++){ph.push(stock.pop());ch.push(stock.pop());}
  disc=[stock.pop()];drew=false;
}
function isMeld(g){
  if(g.length<3)return false;
  if(g.every(c=>c.r===g[0].r))return true;
  if(!g.every(c=>c.s===g[0].s))return false;
  const rs=g.map(c=>c.r).sort((a,b)=>a-b);
  return rs.every((v,i)=>i===0||v===rs[i-1]+1);
}
function canMeld(cards){
  if(!cards.length)return true;
  const first=cards[0],rest=cards.slice(1);
  // tenta trinca com first
  const same=rest.filter(c=>c.r===first.r);
  for(let i=0;i<same.length;i++)for(let j=i+1;j<same.length;j++){
    const g=[first,same[i],same[j]];
    if(isMeld(g)&&canMeld(cards.filter(c=>!g.includes(c))))return true;
  }
  // tenta sequência
  const su=rest.filter(c=>c.s===first.s).sort((a,b)=>a.r-b.r);
  for(let i=0;i<su.length;i++)for(let j=i+1;j<su.length;j++){
    const g=[first,su[i],su[j]];
    if(isMeld(g)&&canMeld(cards.filter(c=>!g.includes(c))))return true;
  }
  return false;
}
function paint(){
  if(over)return;
  hud.set("vc",ph.length);hud.set("cp",ch.length);hud.set("mn",stock.length);
  const t=disc[disc.length-1];
  tp.innerHTML="🎴 Descarte: <b>"+RN(t.r)+S[t.s]+"</b> · "+(drew?"clique numa carta para descartar":"compre do monte ou descarte");
  hd.innerHTML="";
  ph.forEach((c,i)=>{
    const b=H.el("button","g-card",RN(c.r)+S[c.s],hd);
    b.style.width="48px";b.style.height="66px";b.style.fontSize="16px";
    if(drew)b.addEventListener("click",()=>discard(i));
  });
  if(!drew){
    const r2=H.el("div","g-row",null,box);
    H.btn(r2,"🎲 Comprar do monte",()=>{
      if(over||drew)return;
      if(!stock.length)reshuffle();
      ph.push(stock.pop());drew=true;H.sfx("tick");paint();
    },true);
    H.btn(r2,"♻️ Pegar "+RN(t.r)+S[t.s],()=>{
      if(over||drew)return;
      ph.push(disc.pop());drew=true;H.sfx("tick");paint();
    },false);
  }
}
function reshuffle(){
  const t=disc.pop();
  stock=disc;disc=[t];
  for(let i=stock.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const x=stock[i];stock[i]=stock[j];stock[j]=x;}
}
function discard(i){
  if(over||!drew)return;
  const c=ph.splice(i,1)[0];
  disc.push(c);drew=false;H.sfx("tick");
  if(canMeld(ph)&&ph.length>=7&&ph.length%3<=1&&meldAll(ph)){
    over=true;return H.done({win:true,score:250,title:"RUMMY!",sub:"Mão baixada em jogos!"});
  }
  H.after(700,ai);
  paint();say("CPU pensando…");
}
function meldAll(h){
  // 7 cartas: precisa partição total (7=4+3 ou 3+4)
  if(h.length!==7)return canMeld(h);
  return partition7(h);
}
function partition7(h){
  const idx=[0,1,2,3,4,5,6];
  // todas as combinações de 3 para o 1º jogo
  for(let a=0;a<7;a++)for(let b=a+1;b<7;b++)for(let c= b+1;c<7;c++){
    const g=[h[a],h[b],h[c]];
    const rest=h.filter((_,i)=>i!==a&&i!==b&&i!==c);
    if(isMeld(g)&&isMeld(rest))return true;
    if(isMeld(g)&&rest.length===4){
      // 4 pode ser 3+1? não — precisa ser jogo de 4 válido
      if(isMeld(rest))return true;
    }
  }
  return false;
}
function ai(){
  if(over)return;
  if(!stock.length)reshuffle();
  const t=disc[disc.length-1];
  const wantT=ch.filter(c=>c.r===t.r||(c.s===t.s&&Math.abs(c.r-t.r)<=2)).length>=1;
  ch.push(wantT?disc.pop():stock.pop());
  // descarta a que menos combina
  let bi=0,bs=-1;
  ch.forEach((c,i)=>{
    const sc=ch.filter((k,j)=>j!==i&&(k.r===c.r||(k.s===c.s&&Math.abs(k.r-c.r)<=2))).length;
    if(bs<0||sc<bs){bs=sc;bi=i;}
  });
  const d=ch.splice(bi,1)[0];
  disc.push(d);
  say("CPU descartou "+RN(d.r)+S[d.s]+". Sua vez!");
  if(ch.length===7&&partition7(ch)){
    over=true;return H.done({win:false,score:50,title:"CPU bateu!",sub:"Ela baixou primeiro. Seja mais rápido!"});
  }
  paint();
}
mk();paint();
}});"""

# 240 — Espadas
GAMES[240] = r"""/* NCODE N · 240 Espadas — some 60 pontos em 3 rodadas! */
GREG(240,{
init(root,H){
const S=["♠","♥","♦","♣"],RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,hands=[],bids=[],tricks=[0,0,0,0],table=[],leader=0,turn=0,round=1,total=0,bidding=true;
const hud=H.hud(root,[["rd","RODADA","1/3"],["pt","TOTAL",0],["ap","SUA APOSTA","—"]]);
const say=H.msg(root,"Aposte quantas vazas fará (1–7)! ♠ é trunfo. Fazer a aposta = 10× + extras; errar = −10×; <b>exato = +25 bônus</b>!");
const box=H.el("div","g-col",null,root);
function mk(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push({s,r});
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  hands=[[],[],[],[]];
  for(let i=0;i<13;i++)for(let h=0;h<4;h++)hands[h].push(d.pop());
  hands.forEach(h=>h.sort((a,b)=>a.s-b.s||a.r-b.r));
  tricks=[0,0,0,0];table=[];bids=[];
  leader=(round-1)%4;turn=leader;bidding=true;
}
function aiBid(h){
  const sp=h.filter(c=>c.s===0).length;
  const aces=h.filter(c=>c.r===1).length;
  return Math.min(7,Math.max(1,Math.round(sp*0.5+aces*0.8+1)));
}
function paint(){
  if(over)return;
  box.innerHTML="";
  H.el("div","g-msg","🎴 Vazas: você "+tricks[0]+"/"+(bids[0]!=null?bids[0]:"?")+" · CPU "+tricks.slice(1).join("/")+" (apostas "+(bids.slice(1).join("/")||"?")+") · mesa: "+(table.map(t=>RN(t.c.r)+S[t.c.s]).join(" ")||"—"),box);
  if(bidding){
    H.el("div","g-msg","📢 Sua aposta (vazas):",box);
    const row=H.el("div","g-row",null,box);
    for(let b=1;b<=7;b++){
      H.btn(row,""+b,()=>{
        if(over||!bidding)return;
        bids[0]=b;
        for(let i=1;i<4;i++)bids[i]=aiBid(hands[i]);
        bidding=false;hud.set("ap",b);
        H.sfx("ok");say("Apostas: você "+bids[0]+" · CPU "+bids.slice(1).join("/"));
        paint();
        if(turn!==0)H.after(600,ai);
      },false);
    }
    return;
  }
  const hd=H.el("div","g-row",null,box);
  hands[0].forEach((c,i)=>{
    const ok=turn===0&&canPlay(0,c);
    const b=H.el("button","g-card"+(ok?" hot":""),RN(c.r)+S[c.s],hd);
    b.style.width="42px";b.style.height="58px";b.style.fontSize="14px";
    if(ok)b.addEventListener("click",()=>playCard(0,i));
  });
}
function canPlay(who,c){
  if(!table.length)return true;
  const led=table[0].c.s;
  if(c.s===led)return true;
  return !hands[who].some(k=>k.s===led);
}
function playCard(who,i){
  if(over)return;
  if(i<0||i>=hands[who].length)return;
  const c=hands[who].splice(i,1)[0];
  table.push({who,c});
  H.sfx("tick");
  if(table.length>=4){finishTrick();return;}
  turn=(turn+1)%4;paint();
  if(turn!==0)H.after(600,ai);
}
function ai(){
  if(over||turn===0||bidding)return;
  const h=hands[turn];
  const opts=h.filter(c=>canPlay(turn,c));
  // heurística: maior que leva ou menor
  const led=table.length?table[0].c.s:-1;
  let pick=opts[0];
  if(table.length){
    const cur=tableWin();
    const winners=opts.filter(c=>beats(c,cur.c,led));
    pick=winners.length?winners.sort((a,b)=>cardV(b)-cardV(a))[0]:opts.sort((a,b)=>cardV(a)-cardV(b))[0];
  }else{
    pick=opts.sort((a,b)=>cardV(b)-cardV(a))[0];
  }
  playCard(turn,h.indexOf(pick));
}
function cardV(c){return(c.r===1?14:c.r)+(c.s===0?100:0);}
function beats(c,cur,led){
  const cs=c.s===0,bs=cur.s===0;
  if(cs&&!bs)return true;
  if(!cs&&bs)return false;
  if(c.s!==cur.s)return c.s===led;
  return(c.r===1?14:c.r)>(cur.r===1?14:cur.r);
}
function tableWin(){
  const led=table[0].c.s;
  let w=table[0];
  table.forEach(t=>{if(beats(t.c,w.c,led))w=t;});
  return w;
}
function finishTrick(){
  const w=tableWin();
  tricks[w.who]++;
  say("Vaza de "+(w.who===0?"você":"CPU"+w.who)+" ("+RN(w.c.r)+S[w.c.s]+")");
  table=[];leader=w.who;turn=w.who;
  if(!hands[0].length){endRound();return;}
  paint();
  if(turn!==0)H.after(600,ai);
}
function endRound(){
  let pts=0;
  const made=tricks[0]>=bids[0];
  if(made){
    pts=bids[0]*10+(tricks[0]-bids[0]);
    if(tricks[0]===bids[0])pts+=25;
  }else pts=-bids[0]*10;
  total+=pts;H.score(total);
  hud.set("pt",total);
  say("Rodada "+round+": você fez "+tricks[0]+"/"+bids[0]+" → "+(pts>=0?"+":"")+pts+" (total "+total+")");
  round++;
  if(round>3){
    over=true;
    if(total>=60)return H.done({win:true,score:total,title:"Mestre de espadas!",sub:total+" pontos em 3 rodadas."});
    return H.done({win:false,score:total,title:"Aposta furada!",sub:"Só "+total+" pontos (meta 60). Aposte com ♠ na mão!"});
  }
  hud.set("rd",round+"/3");
  H.after(1500,()=>{mk();hud.set("ap","—");paint();});
  paint();
}
mk();paint();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
