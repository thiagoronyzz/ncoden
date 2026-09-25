/* NCODE N · 119 Resgate no Terremoto — 5 vidas sob os escombros */
GREG(119,{
init(root,H){
const N=6,NS=5,DIGS=15;
let over=false,digs=0,found=0,surv=[],dug=new Set();
const hud=H.hud(root,[["fd","ENCONTRADOS","0/5"],["esc","ESCAVAÇÕES","0/15"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique para escavar. O sismógrafo indica a <b>distância do sobrevivente mais próximo</b>. Ache os 5 em 15 escavações!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(6,1fr)";
board.style.width="min(100%,340px)";
let sc=0;
function build(){
  const r=H.rng(Date.now()%100000);
  surv=[];dug=new Set();digs=0;found=0;sc=0;
  while(surv.length<NS){
    const i=Math.floor(r()*N*N);
    if(!surv.includes(i))surv.push(i);
  }
  paint();
}
function near(i){
  const r=(i/N)|0,c=i%N;
  let bd=99;
  surv.forEach(s2=>{
    if(dug.has(s2))return;
    bd=Math.min(bd,Math.abs(((s2/N)|0)-r)+Math.abs(s2%N-c));
  });
  return bd;
}
function paint(){
  hud.set("fd",found+"/5");hud.set("esc",digs+"/"+DIGS);
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell"+(dug.has(i)?(surv.includes(i)?" good":""):""),null,board);
    d.style.aspectRatio="1";d.style.fontSize="16px";
    if(!dug.has(i))d.textContent="■";
    else if(surv.includes(i))d.textContent="";
    else d.textContent=near(i)>0?near(i):"·";
    if(!dug.has(i)){const idx=i;d.addEventListener("click",()=>dig(idx));}
  }
}
function dig(i){
  if(over||dug.has(i))return;
  dug.add(i);digs++;
  if(surv.includes(i)){found++;sc+=100;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    say("Sobrevivente resgatado! ("+found+"/5)");
    if(found>=NS){over=true;return H.done({win:true,score:sc+(DIGS-digs)*10,title:"Missão cumprida!",sub:"5 vidas salvas com "+(DIGS-digs)+" escavações de sobra."});}
  }else{
    H.sfx("tick");
    say("Sismógrafo: sobrevivente mais próximo a <b>"+near(i)+" casas</b>.");
  }
  if(digs>=DIGS){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Réplicas chegaram…",sub:"Só "+found+"/5 resgatados. Triangule pelos números!"});
  }
  paint();
}
build();
}});
