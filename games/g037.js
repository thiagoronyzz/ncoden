/* NCODE N · 037 Simetria Espelhada — reflita o outro lado */
GREG(37,{
init(root,H){
let round=0,over=false,sc=0;
const hud=H.hud(root,[["rd","RODADA","1/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"O lado <b>modelo</b> está pronto. Clique no lado vazio para espelhar cada peça.");
const board=H.el("div","g-board",null,root);
let W=8,Hh=6,axis="V",model=new Set(),ans=new Set();
function build(){
  axis=round%2===0?"V":"H";
  const r=H.rng(800+round*67);
  model=new Set();ans=new Set();
  if(axis==="V"){
    for(let y=0;y<Hh;y++)for(let xx=0;xx<W/2;xx++)if(r()<0.4)model.add(y+","+xx);
  }else{
    for(let y=0;y<Hh/2;y++)for(let xx=0;xx<W;xx++)if(r()<0.35)model.add(y+","+xx);
  }
  if(!model.size)model.add("0,0");
  board.style.gridTemplateColumns="repeat("+W+",1fr)";
  board.style.width="min(100%,"+(W*44)+"px)";
  board.innerHTML="";
  for(let y=0;y<Hh;y++)for(let xx=0;xx<W;xx++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";
    const k=y+","+xx;
    const isModel=axis==="V"?xx<W/2:y<Hh/2;
    if(isModel){d.disabled=true;if(model.has(k)){d.textContent="⬛";d.style.background=H.C.ink;}}
    else{(function(kk,dd){dd.addEventListener("click",()=>{if(over)return;
      if(ans.has(kk)){ans.delete(kk);dd.textContent="";dd.classList.remove("sel");}
      else{ans.add(kk);dd.textContent="⬛";dd.classList.add("sel");}
      H.sfx("tick");
    });})(k,d);}
    if(axis==="V"&&xx===W/2)d.style.borderLeft="3px solid "+H.C.terra;
    if(axis==="H"&&y===Hh/2)d.style.borderTop="3px solid "+H.C.terra;
  }
  hud.set("rd",(round+1)+"/4");
  say("Rodada "+(round+1)+": espelho <b>"+(axis==="V"?"vertical":"horizontal")+"</b>.");
}
function mirror(k){
  const[y,xx]=k.split(",").map(Number);
  return axis==="V"?y+","+(W-1-xx):(Hh-1-y)+","+xx;
}
function check(){
  if(over)return;
  const want=new Set([...model].map(mirror));
  const ok=want.size===ans.size&&[...want].every(k=>ans.has(k));
  if(ok){
    H.sfx("ok");sc+=120;H.score(sc);hud.set("sc",sc);round++;
    if(round>=4){over=true;return H.done({win:true,score:sc+100,title:"Espelho perfeito!",sub:"4 reflexos idênticos ao modelo."});}
    build();
  }else{H.sfx("bad");say("Ainda diferente do espelho — compare peça por peça.");}
}
H.btn(root,"✓ Conferir espelho",check,true);
build();
}});
