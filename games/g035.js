/* NCODE N · 035 Cristal Crescente — preencha sem sobrepor */
GREG(35,{
init(root,H){
const LV=[
 {n:5,obs:[],seeds:5},
 {n:6,obs:[[2,0],[2,1],[2,2],[2,3],[2,4],[2,5]],seeds:5},
 {n:6,obs:[[1,2],[2,2],[3,2],[4,2]],seeds:6}
];
const DIRS=[[0,1,"→"],[1,0,"↓"],[0,-1,"←"],[-1,0,"↑"]];
let lv=0,over=false,dir=0,used=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["sm","SEMENTES","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha a <b>direção</b>, clique numa casa vazia para <b>plantar</b>. O cristal cresce reto até o obstáculo. Clique nele para remover.");
const board=H.el("div","g-board",null,root);
let n=5,obs=new Set(),fill={},segs=[];
function key(r,c){return r+","+c;}
function build(){
  const L=LV[lv];n=L.n;used=0;fill={};segs=[];
  obs=new Set(L.obs.map(o=>key(o[0],o[1])));
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*52)+"px)";
  board.innerHTML="";
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="16px";
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
  hud.set("nv",lv+1);hud.set("sm","0/"+L.seeds);
  paint();dirTray();
}
function paint(){
  const cells=board.children;
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const d=cells[r*n+c],k=key(r,c);
    if(obs.has(k)){d.textContent="🧱";d.disabled=true;d.style.background=H.C.ink;}
    else if(fill[k]!=null){d.textContent="💎";d.disabled=false;d.classList.add("good");}
    else{d.textContent="";d.disabled=false;d.classList.remove("good");d.style.background="";}
  }
}
let trayBox=null;
function dirTray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  DIRS.forEach((dd,i)=>{
    const b=H.el("button","g-chip"+(i===dir?" hot":""),"crescer "+dd[2],trayBox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{dir=i;H.sfx("tick");dirTray();});
  });
}
function tap(r,c){
  if(over)return;
  const k=key(r,c);
  if(obs.has(k))return;
  if(fill[k]!=null){ // remover segmento
    const id=fill[k];
    segs=segs.filter(s=>s.id!==id);
    Object.keys(fill).forEach(kk=>{if(fill[kk]===id)delete fill[kk];});
    used--;hud.set("sm",used+"/"+LV[lv].seeds);H.sfx("tick");paint();return;
  }
  if(used>=LV[lv].seeds){H.sfx("bad");say("Sem sementes! Remova um cristal para replantar.");return;}
  const[dr,dc]=DIRS[dir];
  const cells=[k];let nr=r+dr,nc=c+dc;
  while(nr>=0&&nr<n&&nc>=0&&nc<n&&!obs.has(key(nr,nc))&&fill[key(nr,nc)]==null){
    cells.push(key(nr,nc));nr+=dr;nc+=dc;
  }
  if(cells.length<1)return;
  const id=segs.length+Date.now()%100000;
  cells.forEach(cc=>fill[cc]=id);
  segs.push({id});used++;
  hud.set("sm",used+"/"+LV[lv].seeds);H.sfx("ok");paint();
  let empty=0;
  for(let rr=0;rr<n;rr++)for(let cc=0;cc<n;cc++){
    const kk=key(rr,cc);
    if(!obs.has(kk)&&fill[kk]==null)empty++;
  }
  if(empty===0){
    const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Jardim de cristal!",sub:"3 grades preenchidas sem sobreposição."});}
    lv++;say("Nível "+(lv+1)+": obstáculos dividem a grade.");H.after(700,build);
  }
}
build();
}});
