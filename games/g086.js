/* NCODE N · 086 Frota Pirata — afunde a frota rival */
GREG(86,{
init(root,H){
const N=6,SHIPS=[3,2,2];
let over=false,phase="place",pships=[],eships=[],shotsP=new Set(),shotsE=new Set(),pi=0,orient="H",sc=0;
const hud=H.hud(root,[["fs","FASE","POSICIONAR"],["vo","SEUS NAVIOS",3],["ia","INIMIGOS",3]]);
const say=H.msg(root,"Posicione 3 navios (tamanhos 3,2,2): alterne <b>H/V</b> e clique a casa inicial. Acerto dá <b>tiro extra</b>!");
const wrap=H.el("div","g-row",null,root);
const bP=H.el("div","g-board",null,wrap),bE=H.el("div","g-board",null,wrap);
[bP,bE].forEach(b=>{b.style.gridTemplateColumns="repeat(6,1fr)";b.style.width="min(46%,230px)";});
function cells(ship){const c=[];for(let i=0;i<ship.l;i++)c.push(ship.o==="H"?ship.r*N+ship.c+i:(ship.r+i)*N+ship.c);return c;}
function paint(){
  bP.innerHTML="";bE.innerHTML="";
  const pc=new Set(pships.flatMap(cells));
  const ec=new Set(eships.flatMap(cells));
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,bP);
    d.style.aspectRatio="1";d.style.fontSize="14px";
    if(shotsE.has(i))d.textContent=pc.has(i)?"🔥":"·";
    else if(pc.has(i))d.textContent="🚢";
    if(phase==="place"){(function(idx){d.addEventListener("click",()=>place(idx));})(i);}
  }
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,bE);
    d.style.aspectRatio="1";d.style.fontSize="14px";
    if(shotsP.has(i))d.textContent=ec.has(i)?"🔥":"🌊";
    else d.textContent="❔";
    if(phase==="war"){(function(idx){d.addEventListener("click",()=>fire(idx));})(i);}
  }
  const alive=S=>S.filter(s=>!cells(s).every(c=>(S===pships?shotsE:shotsP).has(c))).length;
  hud.set("vo",alive(pships));hud.set("ia",alive(eships));
}
function fits(ship,other){
  const cc=cells(ship);
  if(ship.o==="H"&&(ship.c+ship.l>N))return false;
  if(ship.o==="V"&&(ship.r+ship.l>N))return false;
  const occ=new Set(other.flatMap(cells));
  return cc.every(c=>!occ.has(c));
}
function place(i){
  if(over||phase!=="place")return;
  const ship={r:(i/N)|0,c:i%N,l:SHIPS[pi],o:orient};
  if(!fits(ship,pships)){H.sfx("bad");say("Não cabe aqui — tente outra casa ou gire!");return;}
  pships.push(ship);pi++;H.sfx("ok");
  if(pi>=SHIPS.length){
    const r=H.rng(Date.now()%100000);
    eships=[];
    for(const L of SHIPS){
      let s,guard=0;
      do{s={r:Math.floor(r()*N),c:Math.floor(r()*N),l:L,o:r()<.5?"H":"V"};guard++;}
      while(!fits(s,eships)&&guard<200);
      eships.push(s);
    }
    phase="war";hud.set("fs","GUERRA");
    say("⚔️ Guerra! Clique no mar inimigo (direita) para atirar.");
  }else say("Navio "+(pi+1)+"/3 (tamanho "+SHIPS[pi]+"). Orientação: "+orient);
  paint();
}
function sunk(S,shots){return S.filter(s=>cells(s).every(c=>shots.has(c))).length;}
function fire(i){
  if(over||phase!=="war"||shotsP.has(i))return;
  shotsP.add(i);
  const ec=new Set(eships.flatMap(cells));
  if(ec.has(i)){H.sfx("ok");sc+=20;H.score(sc);
    say("🎯 Acertou! Atire de novo.");
    if(sunk(eships,shotsP)>=eships.length){over=true;paint();return H.done({win:true,score:sc+150,title:"Mar dominado!",sub:"Frota inimiga afundada."});}
  }else{H.sfx("tick");say("🌊 Água… vez do inimigo!");
    H.after(600,()=>{
      if(over)return;
      aiMove();
    });
  }
  paint();
}
function aiMove(){
  const opts=[];
  for(let i=0;i<N*N;i++)if(!shotsE.has(i))opts.push(i);
  const i=opts[Math.floor(Math.random()*opts.length)];
  shotsE.add(i);
  const pc=new Set(pships.flatMap(cells));
  if(pc.has(i)){
    say("🔥 Seu navio foi atingido! O inimigo atira de novo…");paint();
    if(sunk(pships,shotsE)>=pships.length){over=true;return H.done({win:false,score:sc,title:"Frota afundada!",sub:"Seus navios viraram recife."});}
    H.after(700,()=>{if(!over)aiMove();});
  }else{say("O inimigo errou. Sua vez!");paint();}
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⇄ Girar H/V",()=>{orient=orient==="H"?"V":"H";H.sfx("tick");say("Orientação: "+orient);},false);
paint();
}});
