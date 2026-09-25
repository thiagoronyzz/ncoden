/* NCODE N · 231 Paciência Clássica — feche os 4 naipes! */
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
  const d=H.el("button","g-card"+(RED(c.s)?" red":""),c.up?RN(c.r)+S[c.s]:"",null);
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
  const st=H.el("button","g-card","×"+stock.length,top);
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
H.btn(root,"↻ Reembaralhar",()=>{if(!over){deal();paint();say("Nova mesa!");}},false);
}});
