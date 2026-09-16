/* NCODE N · 083 Pintura de Território — pinte mais que a IA */
GREG(83,{
init(root,H){
const N=8;
let over=false,g=[],lock=false;
const hud=H.hud(root,[["vo","VOCÊ",2],["ia","IA",2],["rd","RESTAM",60]]);
const say=H.msg(root,"Clique numa casa vazia: ela é sua <b>e as vizinhas inimigas viram</b>. Quem pintar mais vence!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(8,1fr)";
board.style.width="min(100%,360px)";
function build(){
  g=new Array(N*N).fill(0);
  g[27]=1;g[28]=-1;g[35]=-1;g[36]=1;
  lock=false;paint();counts();
}
function paint(){
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";
    if(g[i]===1){d.style.background=H.C.terra;}
    else if(g[i]===-1){d.style.background=H.C.ink;}
    else{d.addEventListener("click",()=>play(i));}
  }
}
function counts(){
  let a=0,b=0,e=0;
  for(const v of g){if(v===1)a++;else if(v===-1)b++;else e++;}
  hud.set("vo",a);hud.set("ia",b);hud.set("rd",e);
  return[a,b,e];
}
function flips(i,who){
  const r=(i/N)|0,c=i%N,out=[];
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
    const nr=r+v[0],nc=c+v[1];
    if(nr>=0&&nr<N&&nc>=0&&nc<N&&g[nr*N+nc]===-who)out.push(nr*N+nc);
  });
  return out;
}
function play(i){
  if(over||lock||g[i]!==0)return;
  g[i]=1;flips(i,1).forEach(k=>g[k]=1);
  H.sfx("tick");paint();
  let[a,b,e]=counts();
  if(!e)return finish();
  lock=true;
  H.after(450,()=>{
    if(over)return;
    let best=-1,bs=-1;
    for(let k=0;k<N*N;k++){
      if(g[k]!==0)continue;
      const f=flips(k,-1).length+(Math.random()*.5);
      if(f>bs){bs=f;best=k;}
    }
    if(best>=0){g[best]=-1;flips(best,-1).forEach(k=>g[k]=-1);}
    paint();counts();
    const e2=counts()[2];
    if(e2<=0)return finish();
    lock=false;
  });
}
function finish(){
  over=true;
  const[a,b]=counts();
  H.score(a);
  if(a>b)return H.done({win:true,score:a*5,title:"Território conquistado!",sub:a+" × "+b+" contra a IA."});
  if(a<b)return H.done({win:false,score:a*5,title:"IA pintou mais!",sub:a+" × "+b+". Roube as bordas dela!"});
  return H.done({win:true,score:a*5,title:"Empate técnico!",sub:a+" × "+b+"."});
}
build();
}});
