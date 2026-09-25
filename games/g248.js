/* NCODE N · 248 Jogo da Velha Plus — 4 em linha no 5×5! */
GREG(248,{
init(root,H){
let over=false,b=[],turn=0;
const hud=H.hud(root,[["vz","VEZ","você (X)"]]);
const say=H.msg(root,"Você é ✕! 4 em linha no tabuleiro 5×5 vence. Empate = nova partida!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(5,1fr)";
board.style.width="min(100%,340px)";
function mk(){b=new Array(25).fill(0);turn=0;paint();}
function lines(){
  const L=[];
  for(let r=0;r<5;r++)for(let c=0;c<=1;c++)L.push([r*5+c,r*5+c+1,r*5+c+2,r*5+c+3]);
  for(let c=0;c<5;c++)for(let r=0;r<=1;r++)L.push([r*5+c,(r+1)*5+c,(r+2)*5+c,(r+3)*5+c]);
  for(let r=0;r<=1;r++)for(let c=0;c<=1;c++)L.push([r*5+c,(r+1)*5+c+1,(r+2)*5+c+2,(r+3)*5+c+3]);
  for(let r=0;r<=1;r++)for(let c=3;c<5;c++)L.push([r*5+c,(r+1)*5+c-1,(r+2)*5+c-2,(r+3)*5+c-3]);
  return L;
}
const LINES=lines();
function wins(who){return LINES.some(L=>L.every(i=>b[i]===who));}
function findWin(who){
  for(const L of LINES){
    const vs=L.map(i=>b[i]);
    if(vs.filter(v=>v===who).length===3&&vs.includes(0))return L[vs.indexOf(0)];
  }
  return-1;
}
function paint(){
  board.innerHTML="";
  b.forEach((v,i)=>{
    const d=H.el("button","g-cell",v===1?"✕":v===2?"○":"",board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    if(!v&&turn===0)d.addEventListener("click",()=>{
      if(over||turn!==0||b[i])return;
      b[i]=1;H.sfx("tick");
      if(wins(1)){over=true;paint();return H.done({win:true,score:300,title:"4 em linha!",sub:"Você venceu a CPU!"});}
      if(b.every(v2=>v2)){say("Empate! Nova partida…");H.after(800,mk);return;}
      turn=1;hud.set("vz","CPU (O)");paint();H.after(500,ai);
    });
  });
}
function ai(){
  if(over)return;
  let m=findWin(2);
  if(m<0)m=findWin(1);
  if(m<0){
    const free=b.map((v,i)=>v? -1:i).filter(i=>i>=0);
    const pref=free.filter(i=>[6,7,8,11,12,13,16,17,18].includes(i));
    m=(pref.length?pref:free)[Math.floor(Math.random()*(pref.length?pref.length:free.length))];
  }
  b[m]=2;H.sfx("tick");
  if(wins(2)){over=true;paint();return H.done({win:false,score:50,title:"CPU alinhou 4!",sub:"Bloqueie as trincas dela!"});}
  if(b.every(v=>v)){say("Empate! Nova partida…");H.after(800,mk);return;}
  turn=0;hud.set("vz","você (X)");paint();
}
mk();
}});
