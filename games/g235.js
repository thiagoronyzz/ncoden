/* NCODE N · 235 Uno Style — zere a mão primeiro! */
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
}});
