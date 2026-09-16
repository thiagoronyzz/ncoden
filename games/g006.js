/* NCODE N · 006 Flip Total — vire tudo para a mesma cor */
GREG(6,{
init(root,H){
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","JOGADAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Cada clique vira a peça <b>e as vizinhas</b>. Apague todas as luzes.");
const board=H.el("div","g-board",null,root);
let N=5,grid=[],cells=[];
function toggle(i){
  const r=(i/N)|0,c=i%N;
  grid[i]=!grid[i];
  if(r>0)grid[i-N]=!grid[i-N];if(r<N-1)grid[i+N]=!grid[i+N];
  if(c>0)grid[i-1]=!grid[i-1];if(c<N-1)grid[i+1]=!grid[i+1];
}
function build(){
  N=5;moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  grid=new Array(N*N).fill(false);
  const times=6+lv*2;
  for(let k=0;k<times;k++)toggle(Math.floor(Math.random()*N*N));
  if(grid.every(v=>!v))toggle(12);
  board.style.gridTemplateColumns="repeat(5,1fr)";
  board.style.width="min(100%,320px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    (function(idx,dd){dd.addEventListener("click",()=>press(idx));})(i,d);
    cells.push(d);
  }
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    cells[i].textContent=grid[i]?"💡":"·";
    cells[i].classList.toggle("good",grid[i]);
  }
}
function press(i){
  if(over)return;
  toggle(i);moves++;hud.set("mv",moves);H.sfx("tick");paint();
  if(grid.every(v=>!v)){
    H.sfx("ok");const sc=(lv+1)*100+Math.max(0,60-moves*2);H.score(sc);hud.set("sc",sc);
    if(lv>=3){over=true;return H.done({win:true,score:sc+100,title:"Tudo apagado!",sub:"4 painéis resolvidos com lógica fria."});}
    lv++;say("Nível "+(lv+1)+": embaralhamento mais profundo.");build();
  }
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});
