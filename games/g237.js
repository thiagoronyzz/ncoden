/* NCODE N · 237 Pesca — mais quartetos vence! */
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
}});
