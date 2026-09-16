/* NCODE N · 240 Espadas — some 60 pontos em 3 rodadas! */
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
}});
