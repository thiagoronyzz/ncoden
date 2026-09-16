/* NCODE N · 213 Cruzadinha Relâmpago — 3 palavras, 90s! */
GREG(213,{
init(root,H){
const WORDS=[
 {n:"1A",clue:"Estrela do dia",cells:[[0,0],[0,1],[0,2]],w:"SOL"},
 {n:"2A",clue:"Pronome: dele → …",cells:[[2,0],[2,1],[2,2]],w:"SUA"},
 {n:"1D",clue:"Satélite natural",cells:[[0,2],[1,2],[2,2]],w:"LUA"}
];
let over=false,grid={},sel=null,time=90;
const hud=H.hud(root,[["tp","TEMPO",90],["ok","CERTAS","0/3"]]);
const say=H.msg(root,"Clique na célula e digite a letra! Complete as 3 palavras em 90s.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(3,52px)";
const cells=[[0,0],[0,1],[0,2],[1,2],[2,0],[2,1],[2,2]];
function key(r,c){return r+","+c;}
function paint(){
  board.innerHTML="";
  for(let r=0;r<3;r++)for(let c=0;c<3;c++){
    const on=cells.some(k=>k[0]===r&&k[1]===c);
    if(!on){H.el("div","g-cell",null,board).style.background="#222";continue;}
    const k=key(r,c);
    const d=H.el("button","g-cell"+(sel===k?" sel":""),grid[k]||"",board);
    d.style.width="52px";d.style.height="52px";d.style.fontSize="22px";
    d.addEventListener("click",()=>{sel=k;H.sfx("tick");paint();});
  }
  const ok=WORDS.filter(w=>w.cells.every((cell,i)=>grid[key(cell[0],cell[1])]===w.w[i])).length;
  hud.set("ok",ok+"/3");
  if(ok>=3&&!over){over=true;H.score(200+Math.floor(time)*2);
    return H.done({win:true,score:200+Math.floor(time)*2+100,title:"Cruzadista relâmpago!",sub:"3/3 com "+Math.ceil(time)+"s de sobra."});}
}
WORDS.forEach(w=>H.el("div","g-chip","<b>"+w.n+"</b> "+w.clue+" ("+w.w.length+")",root));
paint();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over||!sel)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(m){grid[sel]=m[1];H.sfx("tick");paint();}});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,root);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>{if(sel&&!over){grid[sel]=ch;H.sfx("tick");paint();}});
  });
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:0,title:"Relógio venceu!",sub:"Faltaram palavras. Leia as dicas!"});}
});
}});
