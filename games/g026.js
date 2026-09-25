/* NCODE N · 026 Prisma Divisor — divida o feixe, acerte todos */
GREG(26,{
init(root,H){
const OUT=[["U","D"],["L","R"],["U","R"],["D","L"]];
const GL=["↕","↔","",""];
const LV=[
 {n:5,src:{r:2,c:-1,d:"R"},prism:[{r:2,c:2,rot:1}],tgt:[[0,2],[4,2]]},
 {n:5,src:{r:4,c:-1,d:"R"},prism:[{r:4,c:2,rot:1},{r:1,c:2,rot:0}],tgt:[[3,2],[1,0]]},
 {n:6,src:{r:5,c:-1,d:"R"},prism:[{r:5,c:3,rot:1},{r:0,c:3,rot:2}],tgt:[[2,3],[0,0]]}
];
const DIRS={R:[0,1],L:[0,-1],U:[-1,0],D:[1,0]};
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>prismas ◇</b> para girar o modo de divisão. <b>Disfire</b> e banhe todos os ◎.");
const board=H.el("div","g-board",null,root);
let cells=[];
function key(r,c){return r+","+c;}
function build(){
  lock=false;
  const L=LV[lv];
  board.style.gridTemplateColumns="repeat("+L.n+",1fr)";
  board.style.width="min(100%,"+(L.n*56)+"px)";
  board.innerHTML="";cells=[];
  for(let r=0;r<L.n;r++)for(let c=0;c<L.n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="18px";
    const pi=L.prism.findIndex(p=>p.r===r&&p.c===c);
    if(pi>=0){(function(idx,dd){dd.addEventListener("click",()=>{
      if(over||lock)return;L.prism[idx].rot=(L.prism[idx].rot+1)%4;H.sfx("tick");paint();
    });})(pi,d);}
    cells.push(d);
  }
  hud.set("nv",lv+1);paint();
}
function trace(){
  const L=LV[lv],n=L.n;
  const pmap={};L.prism.forEach(p=>pmap[key(p.r,p.c)]=p);
  const seen=new Set(),cellsHit=new Set();
  const q=[{r:L.src.r,c:L.src.c,d:L.src.d}];
  let guard=0;
  while(q.length&&guard++<500){
    let{r,c,d}=q.shift();
    const v=DIRS[d];r+=v[0];c+=v[1];
    if(r<0||r>=n||c<0||c>=n)continue;
    const sk=key(r,c)+d;
    if(seen.has(sk))continue;seen.add(sk);cellsHit.add(key(r,c));
    const p=pmap[key(r,c)];
    if(p){for(const nd of OUT[p.rot])q.push({r,c,d:nd});}
    else q.push({r,c,d});
  }
  return cellsHit;
}
function paint(beam){
  const L=LV[lv];
  const tset=new Set(L.tgt.map(t=>key(t[0],t[1])));
  const pmap={};L.prism.forEach(p=>pmap[key(p.r,p.c)]=p);
  for(let r=0;r<L.n;r++)for(let c=0;c<L.n;c++){
    const d=cells[r*L.n+c],k=key(r,c);
    let t="";
    if(r===L.src.r&&c===0)t="▶";
    if(pmap[k])t="◇"+GL[pmap[k].rot];
    if(tset.has(k))t="◎";
    d.textContent=t;d.style.fontSize=pmap[k]?"13px":"20px";
    d.classList.toggle("good",!!(beam&&beam.has(k)));
  }
}
function fire(){
  if(over||lock)return;
  const L=LV[lv];const hitCells=trace();paint(hitCells);H.sfx("pop");
  const n2=L.tgt.filter(t=>hitCells.has(key(t[0],t[1]))).length;
  if(n2===L.tgt.length){
    lock=true;
    const sc=(lv+1)*160;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Espectro completo!",sub:"Feixes divididos banhando todos os alvos."});}
    lv++;say("Nível "+(lv+1)+": mais prismas, mais alvos.");H.after(700,build);
  }else say("Iluminados <b>"+n2+"/"+L.tgt.length+"</b>. Gire os prismas e dispare de novo.");
}
H.btn(root,"Disparar laser",fire,true);
build();
}});
