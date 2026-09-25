/* NCODE N · 022 Dobra e Corte — preveja o desdobrar */
GREG(22,{
init(root,H){
let round=0,over=false,sc=0,correct=0,lock=false;
const hud=H.hud(root,[["rd","RODADA","1/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Observe as <b>dobras</b> e o <b>corte</b> (). Qual padrão surge ao desdobrar?");
const info=H.el("div","g-msg","",root);
const optsRow=H.el("div","g-row",null,root);
function foldC(c){return c<2?c:3-c;}
function foldR(r){return r<2?r:3-r;}
function pattern(folds,cuts){
  const holes=new Set();
  for(let R=0;R<4;R++)for(let C=0;C<4;C++){
    let r=R,c=C;
    for(const f of folds){if(f==="V")c=foldC(c);else r=foldR(r);}
    if(cuts.has(r+","+c))holes.add(R+","+C);
  }
  return holes;
}
function drawOpt(cv,holes,folded,folds,cuts){
  const x=cv.x;
  x.fillStyle=H.C.paper;x.fillRect(0,0,cv.W,cv.H);
  const s=cv.W/4;
  for(let r=0;r<4;r++)for(let c=0;c<4;c++){
    x.fillStyle=H.C.card;x.fillRect(c*s+1,r*s+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
    if(holes.has(r+","+c)){x.fillStyle=H.C.ink;x.beginPath();x.arc(c*s+s/2,r*s+s/2,s*0.28,0,7);x.fill();}
  }
}
function build(){
  lock=false;
  const r=H.rng(900+round*57);
  const kinds=[["V"],["H"],["V","H"],["H","V"]];
  const folds=kinds[Math.floor(r()*kinds.length)];
  const wf=folds.includes("V")?2:4,hf=folds.includes("H")?2:4;
  const cuts=new Set();
  const nc=1+Math.floor(r()*2);
  while(cuts.size<nc)cuts.add(Math.floor(r()*hf)+","+Math.floor(r()*wf));
  const good=pattern(folds,cuts);
  const setEq=(a,b)=>a.size===b.size&&[...a].every(k=>b.has(k));
  const cands=[good];
  let guard=0;
  while(cands.length<4&&guard++<200){
    const m=new Set(good);
    const op=Math.floor(r()*3);
    if(op===0||m.size===0){m.add(Math.floor(r()*4)+","+Math.floor(r()*4));}
    else if(op===1){const a=[...m];m.delete(a[Math.floor(r()*a.length)]);}
    else{const a=[...m];const k=a[Math.floor(r()*a.length)];m.delete(k);
      const[rr,cc]=k.split(",").map(Number);m.add(rr+","+(3-cc));}
    if(m.size===0||setEq(m,good)||cands.some(c=>setEq(c,m)))continue;
    cands.push(m);
  }
  while(cands.length<4){const m=new Set([Math.floor(r()*4)+","+Math.floor(r()*4)]);if(!cands.some(c=>setEq(c,m)))cands.push(m);}
  const order=H.shuffle(r,[0,1,2,3]);
  correct=order.indexOf(0);
  info.innerHTML="Dobras: <b>"+folds.join(" → ")+"</b> · Cortes: <b>"+cuts.size+"× </b> · Rodada "+(round+1)+" de 5";
  optsRow.innerHTML="";
  order.forEach((ci,k)=>{
    const box=H.el("div","g-col",null,optsRow);
    const cv=H.cvs(box,132,132);
    drawOpt(cv,cands[ci]);
    const b=H.el("button","g-chip","opção "+(k+1),box);
    b.style.cursor="pointer";
    const pick=()=>{
      if(lock||over)return;lock=true;
      if(k===correct){H.sfx("ok");sc+=100;H.score(sc);hud.set("sc",sc);
        say("✔ Correto! O corte se espelhou por todas as dobras.");
        round++;
        if(round>=5){over=true;H.after(700,()=>H.done({win:true,score:sc+100,title:"Mestre do origami!",sub:"5 desdobramentos previstos com perfeição."}));}
        else H.after(900,build);
      }else{H.sfx("bad");say("✕ Não é essa. Observe como cada dobra <b>espelha</b> o corte.");lock=false;}
    };
    b.addEventListener("click",pick);
    H.onTap(cv,()=>pick());
  });
  hud.set("rd",(round+1)+"/5");
}
build();
}});
