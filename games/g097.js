/* NCODE N · 097 Pastor de Ovelhas — recolha antes dos lobos */
GREG(97,{
init(root,H){
const N=8,PEN=[0,7];
let over=false,turn=1,sheep=[],dog={},wolves=[],fences=new Set(),saved=0,fleft=6;
const hud=H.hud(root,[["tn","TURNO","1/20"],["sv","SALVAS","0/4"],["lb","LOBOS",2]]);
const say=H.msg(root,"Clique num destino (até 2 casas) para mover o <b>cão pastor</b>. As ovelhas fogem dele — empurre-as para dentro do <b>curral</b>! 6 cercas: modo <b>cerca</b>.");
const o=H.cvs(root,440,440),x=o.x;
let mode="dog";
function build(){
  const r=H.rng(12);
  sheep=[];for(let i=0;i<4;i++)sheep.push({r:4+Math.floor(r()*3),c:1+Math.floor(r()*4)});
  dog={r:7,c:0};wolves=[{r:0,c:0},{r:7,c:7}];fences=new Set();saved=0;turn=1;fleft=6;
  hud.set("tn","1/20");hud.set("sv","0/4");
}
build();
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
const key=(r,c)=>r+","+c;
H.onTap(o,(px,py)=>{
  if(over)return;
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  if(r<0||r>=N||c<0||c>=N)return;
  if(mode==="fence"){
    if(fences.has(key(r,c))||(r===PEN[0]&&c===PEN[1]))return;
    if(fleft<=0){H.sfx("bad");return;}
    if(sheep.some(q=>q.r===r&&q.c===c)||wolves.some(q=>q.r===r&&q.c===c))return;
    fences.add(key(r,c));fleft--;H.sfx("tick");return;
  }
  if(Math.abs(r-dog.r)+Math.abs(c-dog.c)>2||fences.has(key(r,c))){H.sfx("bad");return;}
  dog={r,c};H.sfx("tick");advance();
});
function stepAway(e,from){
  const opts=[[1,0],[-1,0],[0,1],[0,-1]];
  let best=null,bd=-1;
  for(const m of opts){
    const nr=e.r+m[0],nc=e.c+m[1];
    if(nr<0||nr>=N||nc<0||nc>=N||fences.has(key(nr,nc)))continue;
    const d=Math.abs(nr-from.r)+Math.abs(nc-from.c);
    if(d>bd){bd=d;best={r:nr,c:nc};}
  }
  return best;
}
function stepTo(e,to){
  const opts=[[1,0],[-1,0],[0,1],[0,-1]];
  let best=null,bd=1e9;
  for(const m of opts){
    const nr=e.r+m[0],nc=e.c+m[1];
    if(nr<0||nr>=N||nc<0||nc>=N||fences.has(key(nr,nc)))continue;
    const d=Math.abs(nr-to.r)+Math.abs(nc-to.c);
    if(d<bd){bd=d;best={r:nr,c:nc};}
  }
  return best;
}
function advance(){
  for(const q of sheep){
    const nearW=wolves.map(w=>({w,d:Math.abs(w.r-q.r)+Math.abs(w.c-q.c)})).sort((a,b)=>a.d-b.d)[0];
    const dd=Math.abs(dog.r-q.r)+Math.abs(dog.c-q.c);
    let mv=null;
    if(nearW&&nearW.d<=4)mv=stepAway(q,nearW.w);
    else if(dd<=3)mv=stepAway(q,dog);
    else if(Math.random()<.5){const m=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(Math.random()*4)];
      const nr=q.r+m[0],nc=q.c+m[1];
      if(nr>=0&&nr<N&&nc>=0&&nc<N&&!fences.has(key(nr,nc)))mv={r:nr,c:nc};}
    if(mv){q.r=mv.r;q.c=mv.c;}
  }
  for(const w of wolves){
    if(!sheep.length)break;
    const prey=sheep.map(q=>({q,d:Math.abs(q.r-w.r)+Math.abs(q.c-w.c)})).sort((a,b)=>a.d-b.d)[0].q;
    const mv=stepTo(w,prey);
    if(mv){w.r=mv.r;w.c=mv.c;}
  }
  for(let i=sheep.length-1;i>=0;i--){
    if(sheep[i].r===PEN[0]&&sheep[i].c===PEN[1]){sheep.splice(i,1);saved++;hud.set("sv",saved+"/4");H.sfx("ok");}
    else if(wolves.some(w=>Math.abs(w.r-sheep[i].r)+Math.abs(w.c-sheep[i].c)<=1)){
      over=true;H.sfx("lose");
      return H.done({win:false,score:saved*50,title:"Lobo no rebanho!",sub:saved+" salvas. Cerque com as 6 cercas!"});
    }
  }
  turn++;hud.set("tn",turn+"/20");
  if(!sheep.length){over=true;H.score(300);return H.done({win:true,score:300,title:"Rebanho a salvo!",sub:"4 ovelhas no curral no turno "+turn+"."});}
  if(turn>20){over=true;return H.done({win:false,score:saved*50,title:"Noite chegou!",sub:"Só "+saved+"/4 salvas. Empurre com o cão!"});}
}
H.loop(()=>{
  const ss=s();
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){x.strokeStyle="rgba(0,0,0,.12)";x.strokeRect(c*ss,r*ss,ss,ss);}
  x.font=Math.floor(ss*.6)+"px serif";
  fences.forEach(k=>{const[r,c]=k.split(",").map(Number);x.fillText("i:log",c*ss+4,r*ss+ss-4);});
  x.fillText("i:house",PEN[1]*ss+4,PEN[0]*ss+ss-4);
  sheep.forEach(q=>x.fillText("i:sheep",q.c*ss+4,q.r*ss+ss-4));
  wolves.forEach(w=>x.fillText("i:dog",w.c*ss+4,w.r*ss+ss-4));
  x.fillText("i:dog",dog.c*ss+4,dog.r*ss+ss-4);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("cercas: "+fleft+" · modo: "+mode,12,18);
});
const row=H.el("div","g-row",null,root);
H.btn(row,"Mover cão",()=>{mode="dog";H.sfx("tick");},false);
H.btn(row,"Plantar cerca",()=>{mode="fence";H.sfx("tick");},false);
}});
