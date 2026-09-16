/* NCODE N · 081 Xeque-Mate Rápido — mate em 1 lance */
GREG(81,{
init(root,H){
const PUZ=[
 {w:[["K",2,6],["Q",1,5]],b:[0,7],n:"Qg7 decide."},
 {w:[["K",2,1],["R",1,2]],b:[0,0],n:"A torre coroa na 8ª."},
 {w:[["K",6,5],["Q",5,6]],b:[7,7],n:"Encurrale no canto."},
 {w:[["K",2,3],["Q",3,3]],b:[0,4],n:"A dama fecha a porta."}
];
let pi=0,over=false,att=0,sc=0;
const hud=H.hud(root,[["pz","PUZZLE","1/4"],["tt","TENTATIVAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Brancas jogam e dão <b>mate em 1</b>. Clique na peça e depois no destino.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(8,1fr)";
board.style.width="min(100%,380px)";
let W=[],B=[],sel=-1;
function build(){
  const P=PUZ[pi];
  W=P.w.map(w=>({t:w[0],r:w[1],c:w[2]}));B={r:P.b[0],c:P.b[1]};sel=-1;att=0;
  hud.set("pz",(pi+1)+"/4");hud.set("tt",0);
  say("Puzzle "+(pi+1)+": "+P.n);
  paint();
}
function paint(){
  board.innerHTML="";
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    d.style.background=(r+c)%2?"#D8D5CC":H.C.card;
    const w=W.findIndex(p=>p.r===r&&p.c===c);
    if(w>=0){d.textContent=W[w].t==="K"?"♔":W[w].t==="Q"?"♕":"♖";if(w===sel)d.classList.add("sel");}
    if(B.r===r&&B.c===c)d.textContent="♚";
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
}
function pathClear(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
  let r=r1+dr,c=c1+dc;
  while(r!==r2||c!==c2){
    if(W.some(p=>p.r===r&&p.c===c))return false;
    if(B.r===r&&B.c===c)return false;
    r+=dr;c+=dc;
  }
  return true;
}
function legalMove(p,r,c){
  if(W.some(q=>q.r===r&&q.c===c))return false;
  if(B.r===r&&B.c===c)return false;
  const dr=Math.abs(r-p.r),dc=Math.abs(c-p.c);
  if(p.t==="K"){
    if(dr>1||dc>1||(!dr&&!dc))return false;
    if(Math.abs(r-B.r)<=1&&Math.abs(c-B.c)<=1)return false;
    return true;
  }
  if(p.t==="R"&&!(dr===0||dc===0))return false;
  if(p.t==="Q"&&!(dr===0||dc===0||dr===dc))return false;
  if(!dr&&!dc)return false;
  return pathClear(p.r,p.c,r,c);
}
function attacked(r,c){
  for(const p of W){
    const dr=Math.abs(r-p.r),dc=Math.abs(c-p.c);
    if(p.t==="K"){if(dr<=1&&dc<=1&&(dr||dc))return true;continue;}
    if(p.t==="R"&&!(dr===0||dc===0))continue;
    if(p.t==="Q"&&!(dr===0||dc===0||dr===dc))continue;
    if(pathClear(p.r,p.c,r,c))return true;
  }
  return false;
}
function isMate(){
  if(!attacked(B.r,B.c))return false;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(!dr&&!dc)continue;
    const r=B.r+dr,c=B.c+dc;
    if(r<0||r>7||c<0||c>7)continue;
    const ow=W.findIndex(p=>p.r===r&&p.c===c);
    if(ow>=0){
      const saved=W.splice(ow,1)[0];
      const def=attacked(r,c);
      W.splice(ow,0,saved);
      if(!def)return false;
    }else if(!attacked(r,c))return false;
  }
  return true;
}
function tap(r,c){
  if(over)return;
  const w=W.findIndex(p=>p.r===r&&p.c===c);
  if(sel<0){
    if(w>=0){sel=w;H.sfx("tick");paint();}
    return;
  }
  if(w===sel){sel=-1;paint();return;}
  const p=W[sel];
  if(legalMove(p,r,c)){
    const or=p.r,oc=p.c;p.r=r;p.c=c;
    att++;hud.set("tt",att);H.sfx("pop");
    if(isMate()){
      const gain=Math.max(50,200-att*15);sc+=gain;H.score(sc);hud.set("sc",sc);
      pi++;
      if(pi>=PUZ.length){over=true;paint();return H.done({win:true,score:sc+100,title:"Grande mestre!",sub:"4 mates em 1 lance cravados."});}
      say("♔ <b>MATE!</b> Próximo puzzle…");H.after(900,build);return;
    }
    p.r=or;p.c=oc;sel=-1;paint();
    say("Não é mate — as pretas escapam. Tente outro lance!");
  }else{H.sfx("bad");sel=w>=0?w:-1;paint();}
}
build();
}});
