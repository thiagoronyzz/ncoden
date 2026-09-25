/* NCODE N · 003 Encanador — conecte fonte ao ralo antes da cheia */
GREG(3,{
init(root,H){
const PATHS=[
 [[0,0],[0,1],[0,2],[1,2],[2,2]],
 [[0,0],[0,1],[0,2],[0,3],[1,3],[2,3],[2,2],[2,1],[3,1],[4,1],[5,1],[5,2],[5,3]],
 [[0,0],[1,0],[2,0],[2,1],[2,2],[3,2],[4,2],[4,3],[4,4],[3,4],[2,4],[2,5],[3,5],[4,5],[5,5]]
];
const SIZES=[3,6,6];
let lv=0,over=false,flowing=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas peças para <b>girar</b>. Quando o caminho estiver pronto, abra a água.");
const board=H.el("div","g-board",null,root);
const GLYPH={src:"",drn:"",str0:"═",str1:"║",elb0:"╔",elb1:"╗",elb2:"╝",elb3:"╚"};
let n=3,cells=[],tiles=[];
function openings(t){
  if(t.k==="src"||t.k==="drn")return t.fix;
  let o=t.k==="str"?[0,2]:[0,1];
  return o.map(x=>(x+t.rot)%4);
}
function glyph(t){
  if(t.k==="src")return GLYPH.src;if(t.k==="drn")return GLYPH.drn;
  if(t.k==="str")return t.rot%2===0?GLYPH.str0:GLYPH.str1;
  return [GLYPH.elb0,GLYPH.elb1,GLYPH.elb2,GLYPH.elb3][t.rot%4];
}
function dirBetween(a,b){if(b[0]===a[0]-1)return 3;if(b[0]===a[0]+1)return 1;if(b[1]===a[1]-1)return 2;return 0;}
function build(){
  flowing=false;const P=PATHS[lv];n=SIZES[lv];
  const pset=new Set(P.map(p=>p[0]+","+p[1]));
  tiles=[];
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    const idx=P.findIndex(p=>p[0]===r&&p[1]===c);
    let t;
    if(idx===0)t={k:"src",fix:[dirBetween(P[0],P[1])],rot:0,fixed:true};
    else if(idx===P.length-1)t={k:"drn",fix:[dirBetween(P[idx],P[idx-1])],rot:0,fixed:true};
    else if(idx>0){
      const a=dirBetween(P[idx],P[idx-1]),b=dirBetween(P[idx],P[idx+1]);
      const opp=(a+2)%4===b;
      t={k:opp?"str":"elb",rot:Math.floor(Math.random()*4)};
      if(opp)t.rot=Math.random()<.5?0:1;
    }else t={k:Math.random()<.5?"str":"elb",rot:Math.floor(Math.random()*4),decoy:true};
    tiles.push(t);
  }
  board.style.gridTemplateColumns="repeat("+n+",1fr)";
  board.style.width="min(100%,"+(n*54)+"px)";
  board.innerHTML="";cells=[];
  tiles.forEach((t,i)=>{
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="22px";
    if(!t.fixed)d.addEventListener("click",()=>{if(over||flowing)return;t.rot=(t.rot+1)%4;paint();H.sfx("tick");});
    cells.push(d);
  });
  paint();hud.set("nv",lv+1);
}
function paint(flow){
  const fset=new Set((flow||[]).map(i=>i));
  tiles.forEach((t,i)=>{
    cells[i].textContent=glyph(t);
    cells[i].classList.toggle("good",fset.has(i));
    cells[i].classList.toggle("sel",!!t.fixed);
  });
}
const DV=[[0,1],[1,0],[0,-1],[-1,0]];
function flowPath(){
  const P=PATHS[lv];let cur=0,path=[0],seen=new Set([0]);
  let guard=0;
  while(guard++<200){
    const cell=P[cur];const t=tiles[cell[0]*n+cell[1]];
    const outs=openings(t);
    let moved=false;
    for(const d of outs){
      const nr=cell[0]+DV[d][0],nc=cell[1]+DV[d][1];
      if(nr<0||nr>=n||nc<0||nc>=n)continue;
      const ni=nr*n+nc;if(seen.has(ni))continue;
      const nt=tiles[ni];if(!nt||nt.decoy&&false)continue;
      if(openings(nt).includes((d+2)%4)){seen.add(ni);path.push(ni);
        const pi=P.findIndex(p=>p[0]===nr&&p[1]===nc);
        if(ni===(P[P.length-1][0]*n+P[P.length-1][1]))return{path,win:true};
        if(pi<0)return{path,win:false};
        cur=pi;moved=true;break;}
    }
    if(!moved)return{path,win:false};
  }
  return{path,win:false};
}
function openWater(){
  if(over||flowing)return;flowing=true;
  const res=flowPath();let i=0;
  const T=H.every(160,()=>{
    i++;paint(res.path.slice(0,i+1));H.beep(300+i*40,.06,"sine",.03);
    if(i>=res.path.length){
      clearInterval(T);
      if(res.win){
        H.sfx("ok");const sc=(lv+1)*120;H.score(sc);hud.set("sc",sc);
        if(lv>=PATHS.length-1){over=true;return H.done({win:true,score:sc+150,title:"Encanamento perfeito!",sub:"Água fluindo da fonte ao ralo nos 3 setores."});}
        lv++;say("Nível "+(lv+1)+": uma rede maior e mais peças falsas.");H.after(700,build);
      }else{say("A água <b>vazou</b> no caminho! Gire as peças e tente de novo.");H.sfx("bad");flowing=false;}
    }
  });
}
const row=H.el("div","g-row",null,root);
H.btn(row,"Abrir água",openWater,true);
H.btn(row,"↻ Embaralhar",()=>{if(!flowing)build();},false);
build();
}});
