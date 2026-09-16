/* NCODE N · 012 Fusão de Cores — deslize e funda até o branco quente */
GREG(12,{
init(root,H){
const TIERS=["#8A877C","#2E6E8A",H.C.ok,H.C.gold,H.C.terra,"#FAF7F0"];
const NAMES=["poeira","rio","musgo","âmbar","brasa","LUZ"];
let over=false,won=false,sc=0;
const hud=H.hud(root,[["sc","PONTOS",0],["mx","MAIOR","poeira"]]);
const say=H.msg(root,"Setas ou deslize. Blocos iguais se <b>fundem</b> na próxima cor. Alcance a <b>LUZ</b>.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(4,1fr)";
board.style.width="min(100%,340px)";
let cells=[],g=[];
function spawn(){
  const emp=[];for(let i=0;i<16;i++)if(g[i]<0)emp.push(i);
  if(!emp.length)return;
  g[emp[Math.floor(Math.random()*emp.length)]]=Math.random()<.85?0:1;
}
function build(){
  g=new Array(16).fill(-1);cells=[];board.innerHTML="";
  for(let i=0;i<16;i++){const d=H.el("div","g-cell",null,board);d.style.aspectRatio="1";d.style.cursor="default";cells.push(d);}
  spawn();spawn();paint();
}
function paint(){
  let mx=0;
  for(let i=0;i<16;i++){
    const v=g[i];
    cells[i].style.background=v<0?H.C.paper2:TIERS[v];
    cells[i].style.color=v>=4?H.C.ink:H.C.paper;
    cells[i].textContent=v<0?"":NAMES[v][0].toUpperCase();
    cells[i].style.fontSize="22px";
    if(v>mx)mx=v;
  }
  hud.set("mx",NAMES[mx]);hud.set("sc",sc);H.score(sc);
}
function slide(dir){
  if(over)return false;
  let moved=false,gain=0;
  const lines=[];
  for(let i=0;i<4;i++){
    if(dir==="L")lines.push([i*4,i*4+1,i*4+2,i*4+3]);
    if(dir==="R")lines.push([i*4+3,i*4+2,i*4+1,i*4]);
    if(dir==="U")lines.push([i,i+4,i+8,i+12]);
    if(dir==="D")lines.push([i+12,i+8,i+4,i]);
  }
  for(const L of lines){
    let vals=L.map(i=>g[i]).filter(v=>v>=0);
    for(let k=0;k<vals.length-1;k++){
      if(vals[k]===vals[k+1]){vals[k]++;gain+=(vals[k]+1)*10;vals.splice(k+1,1);}
    }
    while(vals.length<4)vals.push(-1);
    L.forEach((idx,k)=>{if(g[idx]!==vals[k]){g[idx]=vals[k];moved=true;}});
  }
  if(!moved)return false;
  sc+=gain;spawn();paint();H.sfx("tick");
  if(g.some(v=>v>=5)&&!won){won=true;over=true;H.score(sc+300);return H.done({win:true,score:sc+300,title:"Cor final: LUZ!",sub:"Você fundiu até o topo da escala cromática."});}
  if(!canMove()){over=true;return H.done({win:false,score:sc,title:"Paleta travada",sub:"Sem fusões possíveis. Tente manter o canto âncora."});}
  return true;
}
function canMove(){
  if(g.some(v=>v<0))return true;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    const v=g[r*4+c];
    if(c<3&&g[r*4+c+1]===v)return true;
    if(r<3&&g[(r+1)*4+c]===v)return true;
  }
  return false;
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowLeft")slide("L");if(c==="ArrowRight")slide("R");
  if(c==="ArrowUp")slide("U");if(c==="ArrowDown")slide("D");});
H.swipe(board,{left:()=>slide("L"),right:()=>slide("R"),up:()=>slide("U"),down:()=>slide("D")});
H.btn(root,"↻ Recomeçar",()=>{over=false;won=false;sc=0;build();},false);
build();
}});
