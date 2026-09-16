/* NCODE N · 002 Espelho Laser — desvie o feixe até os alvos */
GREG(2,{
init(root,H){
const LV=[
 {n:5,src:{r:0,c:-1,d:"R"},tgt:[[2,2]],k:2},
 {n:6,src:{r:4,c:-1,d:"R"},tgt:[[0,4]],k:2},
 {n:6,src:{r:2,c:-1,d:"R"},tgt:[[2,4],[0,5]],k:3},
 {n:6,src:{r:5,c:-1,d:"R"},tgt:[[5,3],[1,4],[0,1]],k:4}
];
const DIRS={R:[0,1],L:[0,-1],U:[-1,0],D:[1,0]};
const SLASH={R:"U",U:"R",L:"D",D:"L"},BACK={R:"D",D:"R",L:"U",U:"L"};
let lv=0,over=false,lock=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["mr","ESPELHOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas casas para ciclar <b>vazio → / → \\</b>. Depois pressione <b>Disparar</b>.");
const board=H.el("div","g-board",null,root);
let cells=[],mir=[],used=0,n=5;
function key(r,c){return r+","+c;}
function build(){
  lock=false;
  const L=LV[lv];n=L.n;mir={};used=0;
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*52)+"px)";
  board.innerHTML="";cells=[];
  const tset=new Set(L.tgt.map(t=>key(t[0],t[1])));
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    if(r===L.src.r&&c===0)d.textContent="▶";
    if(tset.has(key(r,c)))d.textContent="◎";
    (function(rr,cc,dd){dd.addEventListener("click",()=>{
      if(over||lock)return;
      const k=key(rr,cc);
      if(tset.has(k))return;
      const cur=mir[k]||"";
      const nx=cur===""?"/":cur==="/"? "\\":"";
      if(nx!==""&&used>=L.k&&cur===""){H.sfx("bad");say("Sem espelhos! Limite de <b>"+L.k+"</b> neste nível.");return;}
      if(cur===""){used++;} if(nx===""){used--;}
      if(nx==="")delete mir[k];else mir[k]=nx;
      paint();hud.set("mr",used+"/"+L.k);H.sfx("tick");
    });})(r,c,d);
    cells.push(d);
  }
  hud.set("nv",lv+1);hud.set("mr","0/"+L.k);paint();
}
function trace(){
  const L=LV[lv];let r=L.src.r,c=L.src.c,d=L.src.d;
  const path=[],seen=new Set();let guard=0;
  while(guard++<200){
    const v=DIRS[d];r+=v[0];c+=v[1];
    if(r<0||r>=n||c<0||c>=n)break;
    const sk=key(r,c)+d;if(seen.has(sk))break;seen.add(sk);
    path.push([r,c]);
    const m=mir[key(r,c)];
    if(m==="/")d=SLASH[d];else if(m==="\\")d=BACK[d];
  }
  return path;
}
function paint(beam){
  const L=LV[lv];const tset=new Set(L.tgt.map(t=>key(t[0],t[1])));
  const bset=new Set((beam||[]).map(p=>key(p[0],p[1])));
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=cells[r*n+c],k=key(r,c);
    let t=mir[k]||"";
    if(r===L.src.r&&c===0)t="▶";
    if(tset.has(k))t="◎";
    d.textContent=t;
    d.classList.toggle("good",bset.has(k));
    d.classList.toggle("sel",!!mir[k]&&!bset.has(k));
  }
}
function fire(){
  if(over||lock)return;
  const L=LV[lv];const path=trace();paint(path);H.sfx("pop");
  const pset=new Set(path.map(p=>key(p[0],p[1])));
  const hit=L.tgt.filter(t=>pset.has(key(t[0],t[1]))).length;
  if(hit===L.tgt.length){
    lock=true;
    const sc=(lv+1)*150-used*10;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+200,title:"Alvos vaporizados!",sub:"Feixe perfeito nos 4 laboratórios."});}
    lv++;say("Nível "+(lv+1)+": mais alvos, mais espelhos. Reflita antes de agir.");H.after(700,build);
  }else say("Acertou <b>"+hit+"/"+L.tgt.length+"</b> alvos. Ajuste os espelhos e dispare de novo.");
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⚡ Disparar laser",fire,true);
H.btn(row,"Limpar espelhos",()=>{if(!over){mir={};used=0;paint();hud.set("mr","0/"+LV[lv].k);}},false);
build();
}});
