/* NCODE N · 215 Caça-Palavras — 6 escondidas! */
GREG(215,{
init(root,H){
const N=10,WORDS=["SOL","LUA","MAR","GATO","FLOR","RIO"];
let over=false,grid=[],placed=[],found=[],drag=null,time=180;
const hud=H.hud(root,[["pv","PALAVRAS","0/6"],["tp","TEMPO",180]]);
const say=H.msg(root,"ARRASTE sobre as letras (ou toque início + fim) para marcar as 6 palavras!");
const o=H.cvs(root,420,420),x=o.x;
const CS=40,OX=10,OY=10;
function build(){
  const r=H.rng(Date.now()%100000);
  grid=new Array(N*N).fill("");
  placed=[];
  const DIRS=[[1,0],[0,1],[1,1],[1,-1],[-1,0],[0,-1],[-1,-1],[-1,1]];
  for(const w of WORDS){
    let ok=false;
    for(let t=0;t<200&&!ok;t++){
      const d=DIRS[Math.floor(r()*8)];
      const rr=Math.floor(r()*N),cc=Math.floor(r()*N);
      const er=rr+d[0]*(w.length-1),ec=cc+d[1]*(w.length-1);
      if(er<0||er>=N||ec<0||ec>=N)continue;
      let fit=true;
      for(let i=0;i<w.length;i++){
        const g=grid[(rr+d[0]*i)*N+cc+d[1]*i];
        if(g&&g!==w[i]){fit=false;break;}
      }
      if(!fit)continue;
      for(let i=0;i<w.length;i++)grid[(rr+d[0]*i)*N+cc+d[1]*i]=w[i];
      placed.push(w);ok=true;
    }
  }
  const ABC="ABCDEFGHILMNOPQRSTUVXZ";
  for(let i=0;i<N*N;i++)if(!grid[i])grid[i]=ABC[Math.floor(Math.random()*ABC.length)];
}
build();
const ptr=H.ptr(o);
function cellAt(px,py){
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>=N||c<0||c>=N)return null;
  return{r,c};
}
function lineCells(a,b){
  const dr=Math.sign(b.r-a.r),dc=Math.sign(b.c-a.c);
  if(dr!==0&&dc!==0&&Math.abs(b.r-a.r)!==Math.abs(b.c-a.c))return[];
  const cells=[];let r=a.r,c=a.c;
  for(let i=0;i<24;i++){cells.push({r,c});if(r===b.r&&c===b.c)break;r+=dr;c+=dc;}
  return cells;
}
let tapStart=null;
H.onTap(o,(px,py)=>{
  if(over)return;
  const cl=cellAt(px,py);
  if(!cl)return;
  if(!tapStart){tapStart=cl;H.sfx("tick");}
  else{finish(tapStart,cl);tapStart=null;}
});
let wasDown=false;
function finish(a,b){
  const cells=lineCells(a,b);
  if(cells.length<2)return;
  const w=cells.map(k=>grid[k.r*N+k.c]).join("");
  const rev=w.split("").reverse().join("");
  const hit=WORDS.find(k=>(k===w||k===rev)&&!found.includes(k));
  if(hit){
    found.push(hit);H.score(found.length*50);hud.set("pv",found.length+"/6");H.sfx("ok");
    say("✔"+hit+"! ("+found.length+"/6)");
    if(found.length>=WORDS.length){over=true;
      return H.done({win:true,score:300+Math.floor(time),title:"Olho de lince!",sub:"6 palavras encontradas."});}
  }else H.sfx("bad");
}
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:found.length*50,title:"Tempo!",sub:found.length+"/6. Procure na horizontal e vertical!"});}
  if(ptr.down&&!wasDown){const cl=cellAt(ptr.x,ptr.y);if(cl)drag={a:cl,b:cl};}
  if(drag&&ptr.down){const cl=cellAt(ptr.x,ptr.y);if(cl)drag.b=cl;}
  if(drag&&!ptr.down){finish(drag.a,drag.b);drag=null;tapStart=null;}
  wasDown=ptr.down;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  // destaca encontradas
  x.font="bold 20px 'Space Mono',monospace";
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.fillStyle=H.C.ink;
    x.fillText(grid[r*N+c],OX+c*CS+11,OY+r*CS+28);
  }
  // linha do arrasto
  const cur=drag||(tapStart?{a:tapStart,b:cellAt(ptr.x,ptr.y)||tapStart}:null);
  if(cur){
    const cells=lineCells(cur.a,cur.b);
    x.fillStyle="rgba(196,214,69,.5)";
    cells.forEach(k=>x.fillRect(OX+k.c*CS,OY+k.r*CS,CS,CS));
  }
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("faltam: "+WORDS.filter(w=>!found.includes(w)).join(" "),12,o.H-8);
});
}});
