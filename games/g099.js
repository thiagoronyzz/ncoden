/* NCODE N · 099 Médico da Peste — quarentene e salve 60% */
GREG(99,{
init(root,H){
const N=6,TURNS=12;
let over=false,turn=1,st=[],qt={},qi=0;
const hud=H.hud(root,[["tn","TURNO","1/12"],["sd","SAUDÁVEIS","94%"],["qr","QUARENTENAS",2]]);
const say=H.msg(root,"Clique em até <b>2 distritos sãos</b> por turno para isolar (3 turnos). Doentes curam em 3 turnos. Salve 60%!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(6,1fr)";
board.style.width="min(100%,340px)";
function build(){
  st=new Array(N*N).fill(0);qi=2;qt={};
  [7,20,28].forEach(i=>st[i]=1);
  turn=1;paint();
}
function paint(){
  const healthy=st.filter(v=>v===0||v===3).length;
  hud.set("sd",Math.round(healthy/36*100)+"%");
  hud.set("tn",turn+"/"+TURNS);hud.set("qr",qi);
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="18px";
    if(qt[i]){d.textContent="✕";d.classList.add("sel");}
    else if(st[i]===1){d.textContent="";d.classList.add("bad");}
    else if(st[i]===3){d.textContent="♥";}
    else{d.textContent="";(function(idx){d.addEventListener("click",()=>quar(idx));})(i);}
  }
}
function quar(i){
  if(over||qi<=0||st[i]!==0||qt[i])return;
  qt[i]=3;qi--;H.sfx("tick");paint();
}
function next(){
  if(over)return;
  const add=[];
  st.forEach((v,i)=>{
    if(v!==1)return;
    const r=(i/N)|0,c=i%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(q=>{
      const nr=r+q[0],nc=c+q[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(st[k]===0&&!qt[k]&&Math.random()<.5)add.push(k);
    });
  });
  add.forEach(k=>st[k]=1);
  st.forEach((v,i)=>{if(v===2)st[i]=3;});
  const sick=[];
  st.forEach((v,i)=>{if(v===1)sick.push(i);});
  sick.forEach(i=>{st[i]=st[i+"_t"]=(st[i+"_t"]||0)+1>=3?2:1;});
  Object.keys(qt).forEach(k=>{qt[k]--;if(qt[k]<=0)delete qt[k];});
  turn++;qi=2;paint();
  const healthy=st.filter(v=>v===0||v===3).length;
  if(turn>TURNS){
    over=true;H.score(healthy*5);
    if(healthy>=22)return H.done({win:true,score:healthy*5,title:"Epidemia contida!",sub:healthy+"/36 distritos sãos após 12 turnos."});
    return H.done({win:false,score:healthy*5,title:"Peste venceu!",sub:"Só "+healthy+"/36 sãos. Isole os vizinhos dos focos!"});
  }
  say("Turno "+turn+": "+add.length+" novos casos. Saudáveis: "+healthy+"/36.");
}
H.btn(root,"Próximo turno",next,true);
build();
}});
