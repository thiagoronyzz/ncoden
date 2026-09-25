/* NCODE N · 243 Pirâmide 13 — limpe a pirâmide! */
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
  H.btn(sb,"Monte ("+stock.length+")",()=>{
    if(over)return;
    if(stock.length){waste.push(stock.pop());sel=null;H.sfx("tick");paint();}
    else if(passes>1){passes--;stock=waste.reverse();waste=[];sel=null;H.sfx("tick");say("↻ Novo passe! ("+(passes-1)+" restantes)");paint();}
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
}});
