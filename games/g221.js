/* NCODE N · 221 Palíndromo — 3 espelhos de letras! */
GREG(221,{
init(root,H){
const ROUNDS=[["A","R","A","R","A"],["O","V","O"],["A","N","A","I","A","N","A"]];
let over=false,ri=0,rack=[],built=[],score=0;
const hud=H.hud(root,[["rd","RODADA","1/3"],["pt","PONTOS",0]]);
const say=H.msg(root,"Clique nas letras para montar um <b>palíndromo</b> (lê igual de trás pra frente)! Use todas, 3 rodadas.");
const box=H.el("div","g-col",null,root);
const bl=H.el("div","g-msg","",box);
const rk=H.el("div","g-row",null,box);
function build(){
  rack=ROUNDS[ri].map((l,i)=>({l,id:i,used:false}));
  // embaralha
  for(let i=rack.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=rack[i];rack[i]=rack[j];rack[j]=t;}
  built=[];
  hud.set("rd",(ri+1)+"/3");
  paint();
}
function paint(){
  bl.innerHTML=""+(built.map(b=>b.l).join("")||"_");
  rk.innerHTML="";
  rack.forEach(r=>{
    const b=H.el("button","g-btn"+(r.used?"":" ghost"),r.l,rk);
    b.style.minWidth="40px";b.style.fontSize="18px";
    if(r.used)b.disabled=true;
    b.addEventListener("click",()=>{
      if(over||r.used)return;
      r.used=true;built.push(r);H.sfx("tick");paint();
    });
  });
}
build();
const row=H.el("div","g-row",null,box);
H.btn(row,"↩ Desfazer",()=>{
  if(over||!built.length)return;
  const r=built.pop();r.used=false;H.sfx("tick");paint();
},false);
H.btn(row,"✔ É palíndromo?",()=>{
  if(over)return;
  const w=built.map(b=>b.l).join("");
  const ok=w.length===rack.length&&w===w.split("").reverse().join("");
  if(ok){
    score+=w.length*20;H.score(score);hud.set("pt",score);H.sfx("ok");
    ri++;
    if(ri>=ROUNDS.length){over=true;return H.done({win:true,score:score+100,title:"Espelho verbal!",sub:"3 palíndromos perfeitos."});}
    say("Palíndromo! Próximo: "+ROUNDS[ri].length+" letras…");build();
  }else{H.sfx("bad");say("✕ Não espelha! Leia de trás pra frente.");}
},true);
}});
