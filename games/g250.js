/* NCODE N · 250 Mancala — capture mais sementes! */
GREG(250,{
init(root,H){
let over=false,pits=[],turn=0;
const hud=H.hud(root,[["vc","SEU DEPÓSITO",0],["cp","DELE",0]]);
const say=H.msg(root,"Clique numa <b>sua casa</b> (fileira de baixo) para semear! Última no seu depósito = joga de novo. Última em casa vazia sua = captura a frente!");
const box=H.el("div","g-col",null,root);
const bd=H.el("div","g-board",null,box);
bd.style.gridTemplateColumns="repeat(8,1fr)";
bd.style.width="min(100%,460px)";
function mk(){pits=new Array(14).fill(4);pits[6]=0;pits[13]=0;turn=0;}
function paint(){
  if(over)return;
  hud.set("vc",pits[6]);hud.set("cp",pits[13]);
  bd.innerHTML="";
  // layout: depósito CPU em cima-esq? simplifica: linha CPU (7-12 invertida), linha você (0-5)
  const mk2=(txt,fn,hot)=>{
    const d=H.el("button","g-cell"+(hot?" hot":""),txt,bd);
    d.style.minHeight="56px";d.style.fontSize="15px";
    if(fn)d.addEventListener("click",fn);
    return d;
  };
  mk2("CPU\n"+pits[13],null,false).style.gridRow="span 2";
  for(let i=12;i>=7;i--)mk2(""+pits[i],null,false);
  mk2("VOCÊ\n"+pits[6],null,false).style.gridRow="span 2";
  for(let i=0;i<6;i++)mk2(""+pits[i],()=>move(i),turn===0&&pits[i]>0);
}
function move(i){
  if(over||turn!==0||i<0||i>5||!pits[i])return;
  let s=pits[i];pits[i]=0;let p=i;
  while(s>0){p=(p+1)%14;if(p===13)continue;pits[p]++;s--;}
  H.sfx("tick");
  if(p===6){paint();say("🎁 Jogue de novo!");return;}
  if(p<6&&pits[p]===1&&pits[12-p]>0){
    pits[6]+=pits[12-p]+1;pits[12-p]=0;pits[p]=0;
    say("💰 Captura!");
  }
  if(checkEnd())return;
  turn=1;paint();say("CPU pensando…");
  H.after(700,ai);
}
function checkEnd(){
  const pe=pits.slice(0,6).every(v=>!v),ae=pits.slice(7,13).every(v=>!v);
  if(pe||ae){
    for(let i=0;i<6;i++){pits[6]+=pits[i];pits[i]=0;}
    for(let i=7;i<13;i++){pits[13]+=pits[i];pits[i]=0;}
    over=true;paint0();
    hud.set("vc",pits[6]);hud.set("cp",pits[13]);
    if(pits[6]>pits[13])return H.done({win:true,score:pits[6]*5,title:"Semeador mestre!",sub:pits[6]+" × "+pits[13]+"."});
    if(pits[6]<pits[13])return H.done({win:false,score:pits[6]*5,title:"Colheita magra!",sub:pits[6]+" × "+pits[13]+". Mire capturas!"});
    return H.done({win:true,score:pits[6]*5,title:"Empate!",sub:pits[6]+" × "+pits[13]+"."});
  }
  return false;
}
function paint0(){}
function ai(){
  if(over)return;
  let opts=[];
  for(let i=7;i<13;i++)if(pits[i])opts.push(i);
  if(!opts.length){checkEnd();return;}
  // prefere jogada extra, depois captura
  let pick=opts[0];
  for(const i of opts){
    if((i+pits[i])%14===13||((i+pits[i])%14===13)){pick=i;break;}
  }
  let best=pick,bs=-1;
  for(const i of opts){
    const land=(i+pits[i])%14;
    let sc=pits[i];
    if(land===13)sc+=20;
    if(land>=7&&land<13&&pits[land]===0&&pits[12-land]>0)sc+=pits[12-land];
    if(sc>bs){bs=sc;best=i;}
  }
  let s=pits[best];pits[best]=0;let p=best;
  while(s>0){p=(p+1)%14;if(p===6)continue;pits[p]++;s--;}
  if(p===13){paint();say("CPU joga de novo!");H.after(700,ai);return;}
  if(p>=7&&p<13&&pits[p]===1&&pits[12-p]>0){
    pits[13]+=pits[12-p]+1;pits[12-p]=0;pits[p]=0;
  }
  if(checkEnd())return;
  turn=0;paint();
}
mk();paint();
}});
