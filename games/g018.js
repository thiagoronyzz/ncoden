/* NCODE N · 018 Grid de Luzes — linha e coluna acendem juntas */
GREG(18,{
init(root,H){
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","TOQUES",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Cada toque inverte <b>linha e coluna inteiras</b>. Acenda todas as luzes.");
const board=H.el("div","g-board",null,root);
let N=5,g=[],cells=[];
function toggle(r,c){
  for(let i=0;i<N;i++){g[r*N+i]=!g[r*N+i];if(i!==r)g[i*N+c]=!g[i*N+c];}
}
function build(){
  N=5+Math.min(2,lv);moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  g=new Array(N*N).fill(true);
  const k=3+lv;
  for(let t=0;t<k;t++)toggle(Math.floor(Math.random()*N),Math.floor(Math.random()*N));
  if(g.every(v=>v))toggle(0,0);
  board.style.gridTemplateColumns="repeat("+N+",1fr)";
  board.style.width="min(100%,"+(N*52)+"px)";
  board.innerHTML="";cells=[];
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    (function(rr,cc){d.addEventListener("click",()=>press(rr,cc));})(r,c);
    cells.push(d);
  }
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    cells[i].textContent=g[i]?"💡":"·";
    cells[i].classList.toggle("good",g[i]);
  }
}
function press(r,c){
  if(over)return;
  toggle(r,c);moves++;hud.set("mv",moves);H.sfx("tick");paint();
  if(g.every(v=>v)){
    H.sfx("ok");const sc=(lv+1)*120+Math.max(0,50-moves*2);H.score(sc);hud.set("sc",sc);
    if(lv>=2){over=true;return H.done({win:true,score:sc+100,title:"Sala iluminada!",sub:"3 painéis acesos com lógica par."});}
    lv++;say("Nível "+(lv+1)+": grade maior, mais interferência.");build();
  }
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});
