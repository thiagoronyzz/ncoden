/* NCODE N · 100 Incêndio Florestal — água e aceiros */
GREG(100,{
init(root,H){
const N=8,TURNS=10;
const WIND=[[0,1,"L→"],["Vento E →",""],[1,0,"↓"],[0,-1,"←"],[-1,0,"↑"]];
let over=false,turn=1,g=[],acts=2,wind=0;
const hud=H.hud(root,[["tn","TURNO","1/10"],["vn","VENTO","E"],["ac","AÇÕES",2]]);
const say=H.msg(root,"<b>Árvore pegando fogo 🔥</b>: clique para apagar. <b>Árvore verde</b>: clique para cortar aceiro. 2 ações/turno. Salve 70%!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(8,1fr)";
board.style.width="min(100%,360px)";
function build(){
  g=new Array(N*N).fill(1);
  [27,28,35].forEach(i=>g[i]=2);
  turn=1;acts=2;wind=Math.floor(Math.random()*4);
  paint();
}
const WL=["E →","S ↓","O ←","N ↑"];
function paint(){
  const saved=g.filter(v=>v===1).length;
  hud.set("tn",turn+"/"+TURNS);hud.set("vn",WL[wind]);hud.set("ac",acts);
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="17px";
    if(g[i]===1)d.textContent="🌲";
    else if(g[i]===2){d.textContent="🔥";d.classList.add("bad");}
    else if(g[i]===3){d.textContent="⬛";d.disabled=true;}
    else{d.textContent="🟫";d.disabled=true;}
    if(g[i]===1||g[i]===2){(function(idx){d.addEventListener("click",()=>act(idx));})(i);}
  }
}
function act(i){
  if(over||acts<=0)return;
  if(g[i]===2){g[i]=4;acts--;H.sfx("ok");say("💧 Fogo apagado!");}
  else if(g[i]===1){g[i]=4;acts--;H.sfx("tick");say("🪓 Aceiro aberto!");}
  else return;
  paint();
}
function next(){
  if(over)return;
  const DV=[[0,1],[1,0],[0,-1],[-1,0]][wind];
  const ignite=new Set();
  g.forEach((v,i)=>{
    if(v!==2)return;
    const r=(i/N)|0,c=i%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(q=>{
      const nr=r+q[0],nc=c+q[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(g[k]!==1)return;
      const p=(q[0]===DV[0]&&q[1]===DV[1])?0.85:0.3;
      if(Math.random()<p)ignite.add(k);
    });
  });
  g.forEach((v,i)=>{if(v===2)g[i]=3;});
  ignite.forEach(k=>g[k]=2);
  wind=Math.floor(Math.random()*4);
  turn++;acts=2;paint();
  const saved=g.filter(v=>v===1).length;
  if(turn>TURNS){
    over=true;H.score(saved*3);
    if(saved>=45)return H.done({win:true,score:saved*3+100,title:"Floresta salva!",sub:saved+"/64 árvores de pé após 10 turnos."});
    return H.done({win:false,score:saved*3,title:"Cinzas…",sub:"Só "+saved+"/64 árvores. Corte aceiros contra o vento!"});
  }
  say("Turno "+turn+": "+ignite.size+" novos focos! Vento "+WL[wind]+".");
}
H.btn(root,"⏭ Próximo turno",next,true);
build();
}});
