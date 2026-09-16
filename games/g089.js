/* NCODE N · 089 Firewall — proteja o núcleo por 12 turnos */
GREG(89,{
init(root,H){
const N=7,CORE=3*N+3;
let over=false,turn=1,inf=new Set([0,N-1,(N-1)*N,N*N-1]),blk=new Set(),mode="block",acts={block:2,clean:1};
const hud=H.hud(root,[["tn","TURNO","1/12"],["if","INFECTADOS",4],["ac","AÇÕES","3"]]);
const say=H.msg(root,"Modo <b>bloquear 🧱</b> (2/turno) ou <b>limpar 💊</b> (1/turno). O vírus se espalha a cada turno — salve o ⭐!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(7,1fr)";
board.style.width="min(100%,350px)";
function paint(){
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="16px";
    if(i===CORE){d.textContent="⭐";d.classList.add("sel");}
    else if(blk.has(i)){d.textContent="🧱";d.disabled=true;}
    else if(inf.has(i)){d.textContent="🦠";d.classList.add("bad");}
    else d.textContent="·";
    (function(idx){d.addEventListener("click",()=>tap(idx));})(i);
  }
  hud.set("if",inf.size);hud.set("tn",turn+"/12");hud.set("ac",acts.block+acts.clean);
}
function tap(i){
  if(over||i===CORE)return;
  if(mode==="block"){
    if(acts.block<=0||blk.has(i)||inf.has(i)){H.sfx("bad");return;}
    blk.add(i);acts.block--;H.sfx("tick");paint();
  }else{
    if(acts.clean<=0||!inf.has(i)){H.sfx("bad");return;}
    inf.delete(i);acts.clean--;H.sfx("ok");paint();
  }
}
function next(){
  if(over)return;
  const add=[];
  inf.forEach(i=>{
    const r=(i/N)|0,c=i%N,opts=[];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(!blk.has(k)&&!inf.has(k))opts.push(k);
    });
    if(opts.length)add.push(opts[Math.floor(Math.random()*opts.length)]);
  });
  add.forEach(k=>inf.add(k));
  turn++;acts={block:2,clean:1};paint();
  if(inf.has(CORE)){over=true;return H.done({win:false,score:turn*10,title:"Núcleo infectado!",sub:"O vírus chegou ao ⭐ no turno "+turn+"."});}
  if(turn>12){over=true;return H.done({win:true,score:200-inf.size*5,title:"Rede segura!",sub:"12 turnos com o núcleo intacto."});}
  say("Turno "+turn+": o vírus avançou para "+add.length+" nós!");
}
const row=H.el("div","g-row",null,root);
H.btn(row,"🧱 Bloquear",()=>{mode="block";H.sfx("tick");},false);
H.btn(row,"💊 Limpar",()=>{mode="clean";H.sfx("tick");},false);
H.btn(row,"⏭ Próximo turno",next,true);
paint();
}});
