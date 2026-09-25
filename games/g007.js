/* NCODE N · 007 Trem de Engrenagens — leve o giro até a roda final */
GREG(7,{
init(root,H){
const LV=[
 {n:5,drv:[2,0],fin:[2,4],obs:[],k:4},
 {n:6,drv:[0,0],fin:[5,5],obs:[[2,2],[2,3],[3,2]],k:9},
 {n:6,drv:[5,0],fin:[0,5],obs:[[4,1],[3,2],[2,3],[1,4]],k:9}
];
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["gr","ENGRENAGENS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique para <b>colocar/retirar</b> engrenagens e conecte até a <b>roda final</b>. Depois pressione <b>Girar</b>.");
const board=H.el("div","g-board",null,root);
let cells=[],gears=new Set();
function key(r,c){return r+","+c;}
function build(){
  lock=false;
  gears=new Set();const L=LV[lv];
  board.style.gridTemplateColumns="repeat("+L.n+",1fr)";
  board.style.width="min(100%,"+(L.n*56)+"px)";
  board.innerHTML="";cells=[];
  const ok=(r,c)=>!(r===L.drv[0]&&c===L.drv[1]||r===L.fin[0]&&c===L.fin[1]||L.obs.some(o=>o[0]===r&&o[1]===c));
  for(let r=0;r<L.n;r++)for(let c=0;c<L.n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="22px";
    if(r===L.drv[0]&&c===L.drv[1]){d.textContent="";d.classList.add("sel");}
    else if(r===L.fin[0]&&c===L.fin[1]){d.textContent="";}
    else if(L.obs.some(o=>o[0]===r&&o[1]===c)){d.textContent="";d.disabled=true;}
    else{(function(rr,cc,dd){dd.addEventListener("click",()=>{
      if(over||lock)return;const k=key(rr,cc);
      if(gears.has(k)){gears.delete(k);dd.textContent="";}
      else{if(gears.size>=L.k){H.sfx("bad");say("Limite de <b>"+L.k+"</b> engrenagens!");return;}gears.add(k);dd.textContent="";}
      hud.set("gr",gears.size+"/"+L.k);H.sfx("tick");
    });})(r,c,d);}
    cells.push(d);
  }
  hud.set("nv",lv+1);hud.set("gr","0/"+L.k);
}
function spin(){
  if(over||lock)return;
  const L=LV[lv],n=L.n;
  const has=(r,c)=>gears.has(key(r,c))||(r===L.drv[0]&&c===L.drv[1])||(r===L.fin[0]&&c===L.fin[1]);
  const dist={};dist[key(L.drv[0],L.drv[1])]=0;
  const q=[[L.drv[0],L.drv[1]]];
  while(q.length){
    const[r,c]=q.shift();
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1],k=key(nr,nc);
      if(nr<0||nr>=n||nc<0||nc>=n||dist[k]!=null||!has(nr,nc))return;
      dist[k]=dist[key(r,c)]+1;q.push([nr,nc]);
    });
  }
  const fk=key(L.fin[0],L.fin[1]);
  if(dist[fk]!=null){
    lock=true;
    for(let r=0;r<n;r++)for(let c=0;c<n;c++){
      const k=key(r,c);
      if(dist[k]!=null&&gears.has(k))cells[r*n+c].textContent=dist[k]%2?"↻":"↺";
    }
    H.sfx("ok");const sc=(lv+1)*140-gears.size*5;H.score(Math.max(50,sc));hud.set("sc",Math.max(50,sc));
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:Math.max(50,sc)+150,title:"Transmissão perfeita!",sub:"O giro chegou à roda final nos 3 mecanismos."});}
    lv++;say("Nível "+(lv+1)+": obstáculos no caminho do giro.");H.after(900,build);
  }else{H.sfx("bad");say("O giro <b>não chegou</b> à roda final. Complete a cadeia de vizinhas.");}
}
const row=H.el("div","g-row",null,root);
H.btn(row,"Girar mecanismo",spin,true);
build();
}});
