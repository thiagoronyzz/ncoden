/* NCODE N · 033 Sudoku Simbólico — símbolos + diagonal */
GREG(33,{
init(root,H){
const SYM=["🍎","🌙","⭐","⚓"];
const SOL=[
 [0,1,2,3, 3,2,1,0, 1,0,3,2, 2,3,0,1],
 [1,0,2,3, 3,2,1,0, 0,1,3,2, 2,3,0,1],
 [2,3,0,1, 1,0,3,2, 3,2,1,0, 0,1,2,3]
];
const MASK=[[1,5,6,10,13,15],[0,3,6,9,12,15],[2,4,7,8,11,14]];
let lv=0,over=false,errs=0,sel=-1;
const hud=H.hud(root,[["nv","QUEBRA","1/3"],["er","ERROS","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Linhas, colunas, blocos 2×2 <b>e a diagonal ↘</b> sem repetir símbolo. Selecione a casa, depois o símbolo.");
const board=H.el("div","g-board",null,root);
let g=[],fixed=new Set();
function build(){
  const sol=SOL[lv];
  g=sol.slice();fixed=new Set();
  for(let i=0;i<16;i++)if(!MASK[lv].includes(i))fixed.add(i);
  MASK[lv].forEach(i=>g[i]=-1);
  sel=-1;errs=0;hud.set("nv",(lv+1)+"/3");hud.set("er","0/5");
  board.style.gridTemplateColumns="repeat(4,1fr)";
  board.style.width="min(100%,300px)";
  board.innerHTML="";
  for(let i=0;i<16;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    (function(idx){d.addEventListener("click",()=>{if(!over&&!fixed.has(idx)){sel=idx;H.sfx("tick");paint();}});})(i);
  }
  paint();tray();
}
function paint(){
  const cells=board.children;
  const diag=new Set([0,5,10,15]);
  for(let i=0;i<16;i++){
    const d=cells[i];
    d.textContent=g[i]<0?"":SYM[g[i]];
    d.disabled=fixed.has(i);
    d.classList.toggle("sel",i===sel);
    d.style.outline=diag.has(i)?"2px solid "+H.C.terra:"none";
    d.style.outlineOffset="-2px";
  }
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  SYM.forEach((s,i)=>{
    const b=H.el("button","g-cell",s,trayBox);
    b.style.width="52px";b.style.height="52px";b.style.fontSize="24px";
    b.addEventListener("click",()=>{
      if(over||sel<0||fixed.has(sel))return;
      g[sel]=i;H.sfx("tick");paint();check();
    });
  });
}
function check(){
  if(g.some(v=>v<0))return;
  const sol=SOL[lv];
  let bad=[];
  for(let i=0;i<16;i++)if(g[i]!==sol[i])bad.push(i);
  if(!bad.length){
    H.sfx("ok");const sc=(lv+1)*150-errs*10;H.score(Math.max(60,sc));hud.set("sc",Math.max(60,sc));
    if(lv>=2){over=true;return H.done({win:true,score:Math.max(60,sc)+120,title:"Grade simbólica!",sub:"3 sudokus com a regra da diagonal dominados."});}
    lv++;say("Quebra "+(lv+1)+": novos símbolos embaralhados.");H.after(700,build);
  }else{
    errs++;hud.set("er",errs+"/5");H.sfx("bad");
    bad.forEach(i=>{g[i]=-1;});
    if(errs>=5){over=true;return H.done({win:false,score:lv*100,title:"Símbolos embaralhados",sub:"5 erros na quebra "+(lv+1)+". Confira a diagonal ↘!"});}
    say("❌ "+bad.length+" casas erradas foram limpas. Erros: "+errs+"/5.");
    paint();
  }
}
build();
}});
