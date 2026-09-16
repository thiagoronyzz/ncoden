/* NCODE N · 001 Color Flood — expanda a região com tinta limitada */
GREG(1,{
init(root,H){
const cols=[H.C.terra,H.C.gold,H.C.ok,"#2E6E8A",H.C.ink];
let lv=1,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["tk","TINTA",18],["sc","PONTOS",0]]);
const say=H.msg(root,"Sua região nasce no <b>canto superior esquerdo</b>. Escolha cores para engolir o grid.");
const board=H.el("div","g-board",null,root);
let N=7,moves=18,grid=[],cells=[];
function build(){
  N=6+Math.min(4,lv);moves=Math.max(10,Math.round(N*2.7)-lv);
  const r=H.rng((Date.now?Date.now():7)%2147483647+lv*7919);
  grid=[];for(let i=0;i<N*N;i++)grid.push(Math.floor(r()*5));
  board.style.gridTemplateColumns="repeat("+N+",1fr)";
  board.style.width="min(100%,"+(N*42)+"px)";
  board.innerHTML="";cells=[];
  for(let i=0;i<N*N;i++){const d=H.el("button","g-cell",null,board);d.style.aspectRatio="1";d.style.cursor="default";cells.push(d);}
  paint();hud.set("nv",lv);hud.set("tk",moves);
}
function paint(){for(let i=0;i<N*N;i++)cells[i].style.background=cols[grid[i]];}
function flood(nc){
  if(over||moves<=0)return;
  const oc=grid[0];if(oc===nc)return;
  moves--;hud.set("tk",moves);H.sfx("tick");
  const seen=new Set([0]),q=[0];
  while(q.length){const i=q.pop();grid[i]=nc;const r=(i/N)|0,c=i%N;
    if(r>0){const j=i-N;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}
    if(r<N-1){const j=i+N;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}
    if(c>0){const j=i-1;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}
    if(c<N-1){const j=i+1;if(!seen.has(j)&&grid[j]===oc){seen.add(j);q.push(j);}}}
  paint();
  if(grid.every(v=>v===grid[0])){
    const sc=lv*100+moves*10;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(lv>=5){over=true;return H.done({win:true,score:sc,title:"Grade dominada!",sub:"Você unificou as 5 regiões. Mestre da tinta."});}
    lv++;say("Nível "+lv+": grade "+(6+Math.min(4,lv))+"×"+(6+Math.min(4,lv))+" e menos tinta. Planeje a sequência.");build();return;
  }
  if(moves<=0){over=true;H.done({win:false,score:lv*50,title:"Tinta esgotada",sub:"Faltou tinta no nível "+lv+". Tente engolir duas cores por jogada."});}
}
const pal=H.el("div","g-row",null,root);
cols.forEach((c,i)=>{const b=H.el("button","g-cell",null,pal);b.style.width="44px";b.style.height="40px";b.style.background=c;b.setAttribute("aria-label","Cor "+(i+1));b.addEventListener("click",()=>flood(i));});
H.btn(root,"↻ Reembaralhar nível",()=>build(),false);
build();
}});
