/* NCODE N · 042 Bolhas em Cadeia — estoure grupos, some pontos */
GREG(42,{
init(root,H){
const COLS=[H.C.terra,H.C.gold,H.C.ok,"#2E6E8A"];
const GOALS=[300,450,600];
let round=0,over=false,sc=0;
const hud=H.hud(root,[["rd","RODADA","1/3"],["mt","META",300],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique num <b>grupo de 2+</b> bolhas da mesma cor. Grupos maiores valem muito mais!");
const board=H.el("div","g-board",null,root);
const N=8;
let g=[],cells=[];
function build(){
  g=[];for(let i=0;i<N*N;i++)g.push(Math.floor(Math.random()*4));
  board.style.gridTemplateColumns="repeat(8,1fr)";
  board.style.width="min(100%,360px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="18px";d.style.borderRadius="50%";
    (function(idx){d.addEventListener("click",()=>pop(idx));})(i);
    cells.push(d);
  }
  hud.set("rd",(round+1)+"/3");hud.set("mt",GOALS[round]);
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    const v=g[i];
    cells[i].style.background=v<0?"transparent":COLS[v];
    cells[i].style.border=v<0?"1px dashed "+H.C.cement:"1px solid "+H.C.ink;
    cells[i].textContent=v<0?"":"●";
    cells[i].style.color=v<0?"transparent":"rgba(255,255,255,.85)";
  }
}
function group(i){
  const c=g[i];if(c<0)return[];
  const seen=new Set([i]),q=[i];
  while(q.length){
    const j=q.pop(),r=(j/N)|0,cc=j%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=cc+v[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(!seen.has(k)&&g[k]===c){seen.add(k);q.push(k);}
    });
  }
  return[...seen];
}
function hasMoves(){
  for(let i=0;i<N*N;i++)if(g[i]>=0){
    const r=(i/N)|0,c=i%N;
    if(c<N-1&&g[i+1]===g[i])return true;
    if(r<N-1&&g[i+N]===g[i])return true;
  }
  return false;
}
function pop(i){
  if(over||g[i]<0)return;
  const gr=group(i);
  if(gr.length<2){H.sfx("bad");say("Precisa de um <b>grupo</b>! Bolhas solitárias não estouram.");return;}
  gr.forEach(k=>g[k]=-1);
  const gain=gr.length*gr.length*5;sc+=gain;
  H.score(sc);hud.set("sc",sc);H.sfx("pop");
  for(let c=0;c<N;c++){
    const col=[];
    for(let r=N-1;r>=0;r--)if(g[r*N+c]>=0)col.push(g[r*N+c]);
    for(let r=N-1;r>=0;r--)g[r*N+c]=col[N-1-r]!==undefined?col[N-1-r]:-1;
  }
  paint();
  if(g.every(v=>v<0)){sc+=200;H.score(sc);return nextRound(true);}
  if(!hasMoves()){
    if(sc>=GOALS[round])return nextRound(false);
    over=true;return H.done({win:false,score:sc,title:"Sem jogadas",sub:"Meta era "+GOALS[round]+" e você fez "+sc+". Mire grupos grandes!"});
  }
}
function nextRound(clear){
  round++;
  if(round>=3){over=true;return H.done({win:true,score:sc+150,title:"Limpou o aquário!",sub:"3 rodadas de estouros em cadeia."});}
  say((clear?"Bônus de limpeza! (+200) ":"Meta batida! ")+"Rodada "+(round+1)+": meta "+GOALS[round]+".");
  build();
}
build();
}});
