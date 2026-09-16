/* NCODE N · 014 Circuito Fechado — gire e acenda a lâmpada */
GREG(14,{
init(root,H){
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas peças para <b>girar</b>. Ligue a 🔋 até a 💡 com trilhas conectadas.");
const board=H.el("div","g-board",null,root);
let n=4,cells=[],tiles=[];
const DV=[[-1,0],[0,1],[1,0],[0,-1]];
const GLYPH={"0":"╹","1":"╺","2":"╻","3":"╸","0,2":"║","1,3":"═","0,1":"╚","1,2":"╔","2,3":"╗","0,3":"╝","0,1,2":"╠","1,2,3":"╦","0,2,3":"╣","0,1,3":"╩","0,1,2,3":"╬"};
function rot2(o,r){return o.map(d=>(d+r)%4).sort().join(",");}
function build(){
  lock=false;
  n=4+lv;
  const r=H.rng(77+lv*131);
  const inw=[[true]],front=[];
  const inwM=new Set(["0,0"]);
  const edges={};
  const push=(a,b)=>{front.push([a,b]);};
  const key=(a)=>a[0]+","+a[1];
  [[1,0],[0,1]].forEach(v=>push([0,0],v));
  const adj={};
  for(let i=0;i<n*n;i++)adj[i]=[];
  let guard=0;
  while(front.length&&guard++<2000){
    const idx=Math.floor(r()*front.length);
    const[a,b]=front.splice(idx,1)[0];
    if(b[0]<0||b[0]>=n||b[1]<0||b[1]>=n||inwM.has(key(b)))continue;
    inwM.add(key(b));
    const ia=a[0]*n+a[1],ib=b[0]*n+b[1];
    adj[ia].push(ib);adj[ib].push(ia);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>push(b,[b[0]+v[0],b[1]+v[1]]));
  }
  tiles=[];
  for(let i=0;i<n*n;i++){
    const rr=(i/n)|0,cc=i%n;
    const dirs=adj[i].map(j=>{
      const jr=(j/n)|0,jc=j%n;
      if(jr===rr-1)return 0;if(jc===cc+1)return 1;if(jr===rr+1)return 2;return 3;
    }).sort();
    tiles.push({base:dirs,rot:Math.floor(r()*4)});
  }
  tiles[0].fixed=true;tiles[n*n-1].fixed=true;tiles[0].rot=0;tiles[n*n-1].rot=0;
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*54)+"px)";
  board.innerHTML="";cells=[];
  tiles.forEach((t,i)=>{
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    if(!t.fixed)d.addEventListener("click",()=>{if(over||lock)return;t.rot=(t.rot+1)%4;H.sfx("tick");paint();check(true);});
    cells.push(d);
  });
  hud.set("nv",lv+1);paint();check(false);
}
function opens(i){
  const t=tiles[i];
  return t.base.map(d=>(d+t.rot)%4);
}
function paint(lit){
  const lset=new Set(lit||[]);
  tiles.forEach((t,i)=>{
    const o2=opens(i).slice().sort().join(",");
    cells[i].textContent=i===0?"🔋":i===n*n-1?(lset.has(i)?"💡":"🌑"):(GLYPH[o2]||"·");
    cells[i].classList.toggle("good",lset.has(i));
    cells[i].classList.toggle("sel",i===0);
  });
}
function litSet(){
  const seen=new Set([0]),q=[0];
  while(q.length){
    const i=q.pop();const rr=(i/n)|0,cc=i%n;
    for(const d of opens(i)){
      const nr=rr+DV[d][0],nc=cc+DV[d][1];
      if(nr<0||nr>=n||nc<0||nc>=n)continue;
      const j=nr*n+nc;
      if(seen.has(j))continue;
      if(opens(j).includes((d+2)%4)){seen.add(j);q.push(j);}
    }
  }
  return seen;
}
function check(loud){
  if(over||lock)return;
  const s=litSet();paint(s);
  if(s.has(n*n-1)){
    lock=true;
    H.sfx("ok");const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
    if(lv>=2){over=true;H.after(600,()=>H.done({win:true,score:sc+150,title:"Luz acesa!",sub:"Corrente fluindo nos 3 quadros elétricos."}));}
    else{lv++;say("Nível "+(lv+1)+": quadro maior, mais fios.");H.after(800,build);}
  }else if(loud)H.beep(240,.05,"square",.02);
}
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});
