/* NCODE N · 241 Copas — fuja das copas e da dama! */
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
}});
