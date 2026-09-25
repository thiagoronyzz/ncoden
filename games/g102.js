/* NCODE N · 102 Encanador Hidráulico — gire e conecte */
GREG(102,{
init(root,H){
const LV=[{n:5},{n:6}];
let lv=0,n=5,grid=[],over=false;
const hud=H.hud(root,[["nv","FASE","1/2"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos canos para <b>girar</b>. Ligue a fonte (esquerda) ao ralo (direita) sem vazamento!");
const o=H.cvs(root,440,440),x=o.x;
let sc=0;
// tipo: 0 reto (|), 1 cotovelo. rot 0..3. aberturas [N,L,S,O]
function opens(t,r){
  const base=t===0?[[0,-1],[0,1]]:[[-1,0],[0,1]];
  return base.map(d=>{
    let[dr,dc]=d;
    for(let i=0;i<r;i++){const t2=dr;dr=dc;dc=-t2;}
    return[dr,dc];
  });
}
function build(){
  n=LV[lv].n;
  const r=H.rng(lv*13+5);
  grid=[];
  for(let i=0;i<n*n;i++)grid.push({t:r()<.5?0:1,r:Math.floor(r()*4)});
  // esculpe um caminho garantido: serpenteia linha 0..n-1 alternando
  let rr=0,cc=0;
  const path=[[0,0]];
  while(cc<n-1||rr<n-1){
    if(cc<n-1&&(rr===n-1||r()<.7)){cc++;}else{rr++;}
    path.push([rr,cc]);
  }
  for(let i=0;i<path.length;i++){
    const[pr,pc]=path[i];
    const prev=i>0?path[i-1]:[pr,pc-1],next=i<path.length-1?path[i+1]:[pr,pc+1];
    const d1=[pr-prev[0],pc-prev[1]],d2=[next[0]-pr,next[1]-pc];
    const key2=d1.join()+"/"+d2.join();
    const straight=(d1[0]===-d2[0]&&d1[1]===-d2[1]);
    const cell=grid[pr*n+pc];
    if(straight){cell.t=0;cell.r=(d1[0]!==0)?0:1;}
    else{
      cell.t=1;
      const set=new Set([d1.join(),d2.join()]);
      cell.r=set.has("-1,0")&&set.has("0,1")?0:set.has("0,1")&&set.has("1,0")?1:set.has("1,0")&&set.has("0,-1")?2:3;
    }
    cell.r=(cell.r+1+Math.floor(r()*3))%4; // embaralha
  }
  hud.set("nv",(lv+1)+"/2");
  say("Fase "+(lv+1)+": gire os canos e teste a água!");
}
build();
const s=()=>Math.floor(Math.min(o.W,o.H)/n);
H.onTap(o,(px,py)=>{
  if(over)return;
  const ss=s(),c=Math.floor(px/ss),rr2=Math.floor(py/ss);
  if(rr2<0||rr2>=n||c<0||c>=n)return;
  const cell=grid[rr2*n+c];
  cell.r=(cell.r+1)%4;H.sfx("tick");
});
function test(){
  if(over)return;
  // fonte entra pela esquerda de (0,0); ralo sai à direita de (n-1,n-1)
  const seen=new Set(["0,0"]);
  const q=[[0,0]];
  let leak=false;
  while(q.length){
    const[rr,cc]=q.pop();
    const cell=grid[rr*n+cc];
    for(const[dr,dc]of opens(cell.t,cell.r)){
      const nr=rr+dr,nc=cc+dc;
      if(nr<0||nr>=n||nc<0||nc>=n){
        if(!(rr===0&&cc===0&&dc===-1)&&!(rr===n-1&&cc===n-1&&dc===1))leak=true;
        continue;
      }
      const nb=grid[nr*n+nc];
      const back=nb&&opens(nb.t,nb.r).some(d=>d[0]===-dr&&d[1]===-dc);
      if(!back){leak=true;continue;}
      const k=nr+","+nc;
      if(!seen.has(k)){seen.add(k);q.push([nr,nc]);}
    }
  }
  const first=grid[0],last=grid[n*n-1];
  const inOk=opens(first.t,first.r).some(d=>d[0]===0&&d[1]===-1);
  const outOk=opens(last.t,last.r).some(d=>d[0]===0&&d[1]===1);
  if(inOk&&outOk&&seen.has((n-1)+","+(n-1))&&!leak){
    sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    lv++;
    if(lv>=LV.length){over=true;return H.done({win:true,score:sc+100,title:"Sem vazamentos!",sub:"2 redes conectadas da fonte ao ralo."});}
    H.after(500,build);
  }else{
    H.sfx("bad");
    say(!seen.has((n-1)+","+(n-1))?"A água não chegou ao ralo!":"Chegou, mas há vazamento! Feche as pontas abertas.");
  }
}
H.loop(()=>{
  const ss=s();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let rr=0;rr<n;rr++)for(let cc=0;cc<n;cc++){
    const cell=grid[rr*n+cc];
    const cx=cc*ss+ss/2,cy=rr*ss+ss/2;
    x.strokeStyle=H.C.cement;x.strokeRect(cc*ss+1,rr*ss+1,ss-2,ss-2);
    x.strokeStyle="#2E6E8A";x.lineWidth=Math.max(5,ss*.18);x.lineCap="round";
    x.beginPath();x.moveTo(cx,cy);
    for(const[dr,dc]of opens(cell.t,cell.r))x.lineTo(cx+dc*ss/2,cy+dr*ss/2);
    x.moveTo(cx,cy);x.stroke();
    x.fillStyle="#2E6E8A";x.beginPath();x.arc(cx,cy,Math.max(3,ss*.09),0,7);x.fill();
  }
  x.font="20px serif";
  x.fillText("i:drop",2,ss/2+8);
  x.fillText("i:flag",o.W-28,o.H-12);
});
H.btn(root,"Testar água",test,true);
}});
