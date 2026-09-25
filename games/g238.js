/* NCODE N · 238 Oito Maluco — zere primeiro! */
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
  tp.innerHTML="Mesa: <b>"+RN(t.r)+S[t.s]+"</b> · naipe: "+S[suit]+(turn===0?" · <b>SUA VEZ</b>":" · CPU"+turn+"…");
  hd.innerHTML="";
  hands[0].forEach((c,i)=>{
    const ok=turn===0&&playable(c);
    const b=H.el("button","g-card"+(ok?" hot":""),RN(c.r)+S[c.s],hd);
    b.style.width="48px";b.style.height="66px";b.style.fontSize="16px";
    if(ok)b.addEventListener("click",()=>play(0,i));
  });
  if(turn===0){
    const b=H.el("button","g-btn ghost","Comprar",box);
    b.addEventListener("click",()=>{
      if(over||turn!==0)return;
      draw(hands[0],1);H.sfx("tick");
      if(hands[0].filter(playable).length===0&&stock.length){paint();say("Comprou… ainda sem jogada? Compre de novo ou passe.");}
      paint();
    });
    const p=H.el("button","g-btn ghost","Passar",box);
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
      say("8! Escolha o naipe:");
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
}});
