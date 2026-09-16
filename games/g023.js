/* NCODE N · 023 Retrato Deslizante — ordene o quebra-cabeça */
GREG(23,{
init(root,H){
const LV=[3,4];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","MOVIMENTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique numa peça <b>vizinha ao vazio</b> para deslizá-la. Ordene de 1 até N.");
const board=H.el("div","g-board",null,root);
let N=3,g=[],cells=[];
function build(){
  N=LV[lv];moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  g=[];for(let i=1;i<N*N;i++)g.push(i);g.push(0);
  let blank=N*N-1;
  const times=N===3?40:120;
  for(let k=0;k<times;k++){
    const r=(blank/N)|0,c=blank%N,opts=[];
    if(r>0)opts.push(blank-N);if(r<N-1)opts.push(blank+N);
    if(c>0)opts.push(blank-1);if(c<N-1)opts.push(blank+1);
    const m=opts[Math.floor(Math.random()*opts.length)];
    g[blank]=g[m];g[m]=0;blank=m;
  }
  board.style.gridTemplateColumns="repeat("+N+",1fr)";
  board.style.width="min(100%,"+(N*64)+"px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize=(N===3?"26px":"20px");
    (function(idx){d.addEventListener("click",()=>tap(idx));})(i);
    cells.push(d);
  }
  paint();
}
function paint(){
  for(let i=0;i<N*N;i++){
    const v=g[i];
    cells[i].textContent=v||"";
    cells[i].disabled=!v;
    cells[i].style.background=v?H.C.card:"transparent";
    cells[i].style.border=v?"1px solid "+H.C.ink:"1px dashed "+H.C.cement;
    cells[i].classList.toggle("good",!!v&&v===i+1);
  }
}
function tap(i){
  if(over)return;
  const b=g.indexOf(0);
  const r1=(i/N)|0,c1=i%N,r2=(b/N)|0,c2=b%N;
  if(Math.abs(r1-r2)+Math.abs(c1-c2)!==1)return;
  g[b]=g[i];g[i]=0;moves++;hud.set("mv",moves);H.sfx("tick");paint();
  let ok=true;
  for(let k=0;k<N*N-1;k++)if(g[k]!==k+1)ok=false;
  if(ok){
    H.sfx("ok");const sc=(lv+1)*150+Math.max(0,200-moves*2);H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Retrato restaurado!",sub:"Quadros 3×3 e 4×4 recompostos peça a peça."});}
    lv++;say("Nível 2: agora o <b>4×4</b> — respire e planeje por fileiras.");H.after(700,build);
  }
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});
