/* NCODE N · 095 Campo Minado Tático — minas na rota dos tanques */
GREG(95,{
init(root,H){
const SC=[
 {n:8,mines:4,tanks:[
   {path:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]},
   {path:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
   {path:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]]}
 ]},
 {n:8,mines:6,tanks:[
   {path:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
   {path:[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]},
   {path:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]]},
   {path:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]}
 ]}
];
let sc2=0,over=false,mines=new Set(),running=false;
const hud=H.hud(root,[["cn","CENÁRIO","1/2"],["mn","MINAS","0/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique para plantar minas (números = turno da passagem). <b>Iniciar</b> move os tanques. Destrua todos antes da base!");
const o=H.cvs(root,440,440),x=o.x;
let sc=0;
function key(r,c){return r+","+c;}
function build(){
  mines=new Set();running=false;
  hud.set("cn",(sc2+1)+"/2");hud.set("mn","0/"+SC[sc2].mines);
  say("Cenário "+(sc2+1)+": "+SC[sc2].tanks.length+" tanques, "+SC[sc2].mines+" minas.");
}
build();
const cell=()=>Math.floor(Math.min(o.W,o.H)/SC[sc2].n);
H.onTap(o,(px,py)=>{
  if(over||running)return;
  const s=cell(),c=Math.floor(px/s),r=Math.floor(py/s);
  const k=key(r,c),S=SC[sc2];
  const isTerm=S.tanks.some(t=>{const p=t.path;return(p[0][0]===r&&p[0][1]===c)||(p[p.length-1][0]===r&&p[p.length-1][1]===c);});
  if(isTerm){H.sfx("bad");say("Não dá para minar início/fim da rota!");return;}
  if(mines.has(k)){mines.delete(k);}
  else{
    if(mines.size>=S.mines){H.sfx("bad");say("Sem minas! Clique numa plantada para remover.");return;}
    mines.add(k);
  }
  H.sfx("tick");hud.set("mn",mines.size+"/"+S.mines);
});
function simulate(){
  if(over||running)return;
  running=true;
  const S=SC[sc2];
  const alive=S.tanks.map(()=>true);
  const mm=new Set(mines);
  let t=0;
  say("Tanques em movimento…");
  const iv=H.every(450,()=>{
    let boom=false;
    S.tanks.forEach((tk,i)=>{
      if(!alive[i]||t>=tk.path.length)return;
      const[r,c]=tk.path[t];
      if(mm.has(key(r,c))){mm.delete(key(r,c));alive[i]=false;boom=true;H.sfx("pop");}
    });
    drawSim(t,alive);
    t++;
    const maxL=Math.max(...S.tanks.map(tk=>tk.path.length));
    if(t>=maxL||!alive.some(Boolean)){
      clearInterval(iv);
      if(!alive.some(Boolean)){
        sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        sc2++;
        if(sc2>=SC.length){over=true;return H.done({win:true,score:sc+100,title:"Coluna aniquilada!",sub:"Todos os tanques destruídos nos 2 cenários."});}
        say("Cenário limpo! Próximo: mais tanques.");H.after(700,build);
      }else{
        H.sfx("bad");say("✕"+alive.filter(Boolean).length+" tanque(s) chegou(aram) à base! Reposicione as minas.");
        running=false;
      }
    }
  });
}
function drawSim(t,alive){
  const S=SC[sc2],n=S.n,s=cell();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
  }
  S.tanks.forEach((tk,i)=>{
    tk.path.forEach((p,j)=>{
      if(j>t)return;
      x.fillStyle="rgba(217,78,52,.12)";x.fillRect(p[1]*s+1,p[0]*s+1,s-2,s-2);
    });
    if(alive[i]&&t<tk.path.length){
      const[r,c]=tk.path[t];
      x.font=Math.floor(s*.6)+"px serif";x.fillText("i:shield",c*s+6,r*s+s-8);
    }else if(!alive[i]){
      x.font="18px serif";x.fillText("i:burst",10+i*30,o.H-10);
    }
  });
  x.font="14px serif";
  mines.forEach(k=>{
    const[r,c]=k.split(",").map(Number);
    x.fillText("●",c*s+10,r*s+s-10);
  });
}
H.loop(()=>{
  if(running||over)return;
  const S=SC[sc2],n=S.n,s=cell();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    x.fillStyle=H.C.card;x.fillRect(c*s+1,r*s+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
  }
  const cols=["rgba(217,78,52,.25)","rgba(46,110,138,.25)","rgba(62,124,79,.25)","rgba(232,163,61,.3)"];
  S.tanks.forEach((tk,i)=>{
    tk.path.forEach((p,j)=>{
      x.fillStyle=cols[i%4];x.fillRect(p[1]*s+1,p[0]*s+1,s-2,s-2);
      x.fillStyle=H.C.ink;x.font="10px 'Space Mono',monospace";
      x.fillText(j,p[1]*s+5,p[0]*s+14);
    });
    const e=tk.path[tk.path.length-1];
    x.font="16px serif";x.fillText("i:flag",e[1]*s+8,e[0]*s+s-8);
  });
  x.font="16px serif";
  mines.forEach(k=>{
    const[r,c]=k.split(",").map(Number);
    x.fillText("i:bomb",c*s+8,r*s+s-8);
  });
});
H.btn(root,"Iniciar simulação",simulate,true);
}});
