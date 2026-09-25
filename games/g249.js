/* NCODE N · 249 Batalha Naval — afunde tudo primeiro! */
GREG(249,{
init(root,H){
const N=8;
let over=false,ps=[],cs=[],psh=[],csh=[],turn=0,hunt=[];
const hud=H.hud(root,[["vc","SEUS NAVIOS",5],["cp","DELES",5]]);
const say=H.msg(root,"Clique no <b>mar inimigo</b> (acima) para atirar! seus navios abaixo. Afunde os 5 dele primeiro. Navios: 3,2,2,1,1.");
const box=H.el("div","g-col",null,root);
H.el("div","g-chip","MAR INIMIGO — clique para atirar",box);
const eb=H.el("div","g-board",null,box);
H.el("div","g-chip","SUA FROTA",box);
const pb=H.el("div","g-board",null,box);
[eb,pb].forEach(bd=>{bd.style.gridTemplateColumns="repeat(8,1fr)";bd.style.width="min(100%,320px)";});
const SHIPS=[3,2,2,1,1];
function place(){
  const grid=new Array(N*N).fill(0);
  const ships=[];
  for(const len of SHIPS){
    let ok=false;
    for(let t=0;t<200&&!ok;t++){
      const hz=Math.random()<.5;
      const r=Math.floor(Math.random()*N),c=Math.floor(Math.random()*N);
      const cells=[];
      for(let i=0;i<len;i++){
        const rr=hz?r:r+i,cc=hz?c+i:c;
        if(rr>=N||cc>=N)break;
        cells.push(rr*N+cc);
      }
      if(cells.length!==len)continue;
      if(cells.some(i=>grid[i]))continue;
      let touch=false;
      cells.forEach(i=>{
        const ir=(i/N)|0,ic=i%N;
        for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
          const nr=ir+dr,nc=ic+dc;
          if(nr>=0&&nr<N&&nc>=0&&nc<N&&grid[nr*N+nc]&&!cells.includes(nr*N+nc))touch=true;
        }
      });
      if(touch)continue;
      cells.forEach(i=>grid[i]=1);
      ships.push({cells,hits:0});
      ok=true;
    }
  }
  return{grid,ships};
}
function setup(){
  const p=place(),c=place();
  ps=p.ships;cs=c.ships;
  psh=new Array(N*N).fill(0);csh=new Array(N*N).fill(0);
  turn=0;
}
function sunkCount(sh){return sh.filter(s=>s.hits>=s.cells.length).length;}
function paint(){
  if(over)return;
  hud.set("vc",(5-sunkCount(ps))+"");
  hud.set("cp",(5-sunkCount(cs))+"");
  eb.innerHTML="";pb.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",csh[i]===2?"":csh[i]===1?"":"",eb);
    d.style.aspectRatio="1";d.style.fontSize="13px";d.style.minWidth="0";
    if(!csh[i]&&turn===0)d.addEventListener("click",()=>fire(i));
  }
  for(let i=0;i<N*N;i++){
    const mine=ps.some(s=>s.cells.includes(i));
    const d=H.el("div","g-cell",psh[i]===2?"":psh[i]===1?"":mine?"":"",pb);
    d.style.aspectRatio="1";d.style.fontSize="13px";
  }
}
function fire(i){
  if(over||turn!==0||csh[i])return;
  const s=cs.find(k=>k.cells.includes(i));
  if(s){s.hits++;csh[i]=2;H.sfx("ok");say(s.hits>=s.cells.length?"NAVIO DESTRUÍDO!":"Acertou!");}
  else{csh[i]=1;H.sfx("bad");say("Água…");}
  if(sunkCount(cs)>=5){over=true;paint();
    return H.done({win:true,score:300,title:"Almirante!",sub:"Frota inimiga afundada!"});}
  turn=1;paint();H.after(600,ai);
}
function ai(){
  if(over)return;
  let i=-1;
  hunt=hunt.filter(h=>!psh[h]);
  if(hunt.length)i=hunt.shift();
  else{
    const free=psh.map((v,k)=>v? -1:k).filter(k=>k>=0);
    i=free[Math.floor(Math.random()*free.length)];
  }
  const s=ps.find(k=>k.cells.includes(i));
  if(s){
    s.hits++;psh[i]=2;
    const ir=(i/N)|0,ic=i%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{
      const nr=ir+d[0],nc=ic+d[1];
      if(nr>=0&&nr<N&&nc>=0&&nc<N&&!psh[nr*N+nc])hunt.push(nr*N+nc);
    });
    if(s.hits>=s.cells.length)say("Eles afundaram um seu!");
  }else{psh[i]=1;}
  H.sfx("tick");
  if(sunkCount(ps)>=5){over=true;paint();
    return H.done({win:false,score:sunkCount(cs)*40,title:"Navios perdidos!",sub:"Sua frota afundou. Mire com padrão!"});}
  turn=0;paint();
}
setup();paint();
}});
