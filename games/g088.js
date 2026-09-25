/* NCODE N · 088 Quarteirão Urbano — zoneie a felicidade */
GREG(88,{
init(root,H){
const N=5;
const Z={casa:{e:"casa",c:20},loja:{e:"loja",c:30},fab:{e:"fábrica",c:30},parq:{e:"parque",c:25}};
let over=false,g=[],sel="casa",cash=200,built=0;
const hud=H.hud(root,[["din","CAIXA",200],["fel","FELICIDADE",0],["ob","OBRAS",0]]);
const say=H.msg(root,"Escolha a zona e clique nos lotes. Meta: <b>10 obras e felicidade ≥ 20</b>. Casas amam parques e odeiam fábricas!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(5,1fr)";
board.style.width="min(100%,320px)";
function build(){g=new Array(N*N).fill(null);paint();}
function happy(){
  let h=0;
  for(let i=0;i<N*N;i++){
    if(!g[i])continue;
    const r=(i/N)|0,c=i%N;
    const nb=[];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1];
      if(nr>=0&&nr<N&&nc>=0&&nc<N&&g[nr*N+nc])nb.push(g[nr*N+nc]);
    });
    if(g[i]==="casa"){h+=2;nb.forEach(n=>{if(n==="parq")h+=2;if(n==="fab")h-=2;if(n==="loja")h+=1;});}
    if(g[i]==="loja"){h+=nb.filter(n=>n==="casa").length;}
    if(g[i]==="fab"){h+=1;h-=nb.filter(n=>n==="casa").length;}
    if(g[i]==="parq"){h+=nb.filter(n=>n==="casa").length;}
  }
  return h;
}
function paint(){
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="22px";
    if(g[i])d.textContent=Z[g[i]].e;
    else{(function(idx){d.addEventListener("click",()=>place(idx));})(i);}
  }
  hud.set("din",cash);hud.set("fel",happy());hud.set("ob",built+"/10");
}
function place(i){
  if(over||g[i])return;
  if(cash<Z[sel].c){H.sfx("bad");say("Sem caixa para "+sel+"!");return;}
  cash-=Z[sel].c;g[i]=sel;built++;H.sfx("ok");paint();
  if(built>=10){
    over=true;const h=happy();H.score(Math.max(0,h*5));
    if(h>=20)return H.done({win:true,score:h*5,title:"Bairro modelo!",sub:"Felicidade "+h+" com 10 obras."});
    return H.done({win:false,score:Math.max(0,h*5),title:"Bairro cinzento",sub:"Felicidade "+h+" (meta 20). Separe casas e fábricas!"});
  }
}
const row=H.el("div","g-row",null,root);
Object.keys(Z).forEach(k=>{
  const b=H.el("button","g-chip",Z[k].e+" $"+Z[k].c,row);
  b.style.cursor="pointer";
  b.addEventListener("click",()=>{sel=k;H.sfx("tick");say("Zona: <b>"+k+"</b> ($"+Z[k].c+")");});
});
build();
}});
