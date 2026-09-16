/* NCODE N · 239 Rummy — baixe 7 cartas em jogos! */
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
}});
