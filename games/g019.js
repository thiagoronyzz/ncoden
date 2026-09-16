/* NCODE N · 019 Reparo Tetris — sele as frestas com tetrominós */
GREG(19,{
init(root,H){
const SHAPES={
 O:[[0,0],[0,1],[1,0],[1,1]],
 I:[[0,0],[1,0],[2,0],[3,0]],
 T:[[0,0],[0,1],[0,2],[1,1]],
 L:[[0,0],[1,0],[2,0],[2,1]],
 S:[[0,1],[0,2],[1,0],[1,1]]
};
const LV=[
 {w:7,h:6,holes:[[1,1],[1,2],[2,1],[2,2],[4,4],[4,5],[5,4],[5,5]],pieces:["O","O"]},
 {w:7,h:6,holes:[[0,1],[1,0],[1,1],[1,2],[2,4],[3,4],[4,4],[5,4]],pieces:["T","I"]},
 {w:8,h:6,holes:[[0,0],[1,0],[2,0],[2,1],[0,5],[0,6],[1,4],[1,5],[4,2],[4,3],[5,2],[5,3]],pieces:["L","S","O"]}
];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["fr","FRESTAS",8],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha uma peça, <b>gire</b> se preciso e clique na parede para <b>assentar</b>. Clique na peça assentada para remover.");
const board=H.el("div","g-board",null,root);
let holes=new Set(),placed=[],sel=0,rot=0,pieces=[];
function key(r,c){return r+","+c;}
function rotShape(s,rt){
  let p=SHAPES[s].map(q=>q.slice());
  for(let i=0;i<rt;i++)p=p.map(([r,c])=>[c,-r]);
  const mr=Math.min(...p.map(q=>q[0])),mc=Math.min(...p.map(q=>q[1]));
  return p.map(([r,c])=>[r-mr,c-mc]);
}
function build(){
  const L=LV[lv];
  holes=new Set(L.holes.map(h=>key(h[0],h[1])));
  placed=[];pieces=L.pieces.slice();sel=0;rot=0;
  board.style.gridTemplateColumns="repeat("+L.w+",1fr)";
  board.style.width="min(100%,"+(L.w*44)+"px)";
  trayPaint();render();
  hud.set("nv",lv+1);hud.set("fr",holes.size);
}
function render(){
  const L=LV[lv];
  board.innerHTML="";
  for(let r=0;r<L.h;r++)for(let c=0;c<L.w;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";
    const k=key(r,c);
    const pl=placed.find(p=>p.cells.includes(k));
    if(pl){d.classList.add("good");d.textContent="▓";}
    else if(holes.has(k)){d.classList.add("sel");d.textContent="░";}
    else{d.textContent="";d.disabled=true;}
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
}
function tap(r,c){
  if(over)return;
  const k=key(r,c);
  const pi=placed.findIndex(p=>p.cells.includes(k));
  if(pi>=0){ // remover
    const[p]=placed.splice(pi,1);
    p.cells.forEach(h=>holes.add(h));
    pieces.push(p.s);sel=pieces.length-1;
    H.sfx("tick");render();trayPaint();hud.set("fr",holes.size);return;
  }
  if(!pieces.length||sel<0||sel>=pieces.length)return;
  const s=pieces[sel],shape=rotShape(s,rot);
  const cells=shape.map(([dr,dc])=>key(r+dr,c+dc));
  const L=LV[lv];
  const ok=cells.every(cc=>{
    const[rr2,cc2]=cc.split(",").map(Number);
    return rr2>=0&&rr2<L.h&&cc2>=0&&cc2<L.w&&holes.has(cc);
  });
  if(!ok){H.sfx("bad");say("Não encaixa aqui — a peça deve cobrir <b>exatamente</b> as frestas.");return;}
  cells.forEach(cc=>holes.delete(cc));
  placed.push({s,cells});pieces.splice(sel,1);sel=0;
  H.sfx("ok");render();trayPaint();hud.set("fr",holes.size);
  if(holes.size===0){
    const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Parede selada!",sub:"3 muros reparados sem deixar uma fresta."});}
    lv++;say("Nível "+(lv+1)+": mais peças, mais frestas.");H.after(700,build);
  }
}
let trayBox=null;
function trayPaint(){
  if(trayBox)trayBox.innerHTML="";
  else trayBox=H.el("div","g-row",null,root);
  pieces.forEach((s,i)=>{
    const b=H.el("button","g-chip"+(i===sel?" hot":""),s+" ",trayBox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");trayPaint();});
  });
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⟳ Girar peça",()=>{rot=(rot+1)%4;H.sfx("tick");},false);
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});
