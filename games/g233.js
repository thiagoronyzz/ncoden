/* NCODE N · 233 Mão de Poker — banca $25 → $100! */
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
}});
