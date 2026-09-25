/* NCODE N · 245 Damas — capture tudo! */
GREG(245,{
init(root,H){
let over=false,b=[],sel=null,must=[],turn=0;
const hud=H.hud(root,[["vc","SUAS",12],["cp","CPU",12],["vz","VEZ","você"]]);
const say=H.msg(root,"Você é ● (embaixo)! Captura é <b>obrigatória</b> (inclusive em cadeia). Clique na peça e no destino. Coma as 12!");
const o=H.cvs(root,440,440),x=o.x;
const CS=52,OX=12,OY=12;
function mk(){
  b=[];
  for(let r=0;r<8;r++){b.push([]);for(let c=0;c<8;c++)b[r].push(null);}
  for(let r=0;r<3;r++)for(let c=0;c<8;c++)if((r+c)%2===1)b[r][c]={w:false,k:false};
  for(let r=5;r<8;r++)for(let c=0;c<8;c++)if((r+c)%2===1)b[r][c]={w:true,k:false};
  sel=null;turn=0;
}
function dirs(p){return p.k?[[1,1],[1,-1],[-1,1],[-1,-1]]:(p.w?[[-1,1],[-1,-1]]:[[1,1],[1,-1]]);}
function caps(r,c,bd){
  bd=bd||b;
  const p=bd[r][c],out=[];
  if(!p)return out;
  for(const[dr,dc]of dirs(p)){
    const r1=r+dr,c1=c+dc,r2=r+2*dr,c2=c+2*dc;
    if(r2<0||r2>7||c2<0||c2>7)continue;
    if(bd[r1][c1]&&bd[r1][c1].w!==p.w&&!bd[r2][c2])out.push({fr:r,fc:c,tr:r2,tc:c2,er:r1,ec:c1});
  }
  return out;
}
function steps(r,c,bd){
  bd=bd||b;
  const p=bd[r][c],out=[];
  if(!p)return out;
  for(const[dr,dc]of dirs(p)){
    const r1=r+dr,c1=c+dc;
    if(r1<0||r1>7||c1<0||c1>7)continue;
    if(!bd[r1][c1])out.push({fr:r,fc:c,tr:r1,tc:c1});
  }
  return out;
}
function allMoves(white){
  let cp=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(b[r][c]&&b[r][c].w===white)cp=cp.concat(caps(r,c));
  if(cp.length)return cp;
  let st=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)
    if(b[r][c]&&b[r][c].w===white)st=st.concat(steps(r,c));
  return st;
}
function apply(m){
  const p=b[m.fr][m.fc];
  b[m.tr][m.tc]=p;b[m.fr][m.fc]=null;
  if(m.er!=null)b[m.er][m.ec]=null;
  if(p.w&&m.tr===0)p.k=true;
  if(!p.w&&m.tr===7)p.k=true;
}
function counts(){
  let w=0,bl=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(b[r][c]){if(b[r][c].w)w++;else bl++;}
  }
  return[w,bl];
}
function status(){
  const[w,bl]=counts();
  hud.set("vc",w);hud.set("cp",bl);
  hud.set("vz",turn===0?"você":"CPU");
}
function checkEnd(){
  const[w,bl]=counts();
  if(bl===0){over=true;return H.done({win:true,score:300,title:"Grande mestre!",sub:"Todas as peças da CPU capturadas."});}
  if(w===0){over=true;return H.done({win:false,score:0,title:"Sem peças!",sub:"A CPU comeu tudo."});}
  if(!allMoves(turn===0).length){
    over=true;
    if(turn===0)return H.done({win:false,score:0,title:"Travado!",sub:"Você sem jogadas."});
    return H.done({win:true,score:250,title:"Travou a CPU!",sub:"Ela ficou sem jogadas."});
  }
  return null;
}
mk();status();
H.onTap(o,(px,py)=>{
  if(over||turn!==0)return;
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>7||c<0||c>7)return;
  const moves=allMoves(true);
  const mustCap=moves.some(m=>m.er!=null);
  if(sel&&!(b[r][c]&&b[r][c].w)){
    const m=moves.find(k=>k.fr===sel.r&&k.fc===sel.c&&k.tr===r&&k.tc===c);
    if(m&&(!mustCap||m.er!=null)){
      apply(m);H.sfx("tick");
      if(m.er!=null&&caps(m.tr,m.tc).length){sel={r:m.tr,c:m.tc};status();return;}
      sel=null;turn=1;status();
      const e=checkEnd();if(e)return;
      H.after(600,ai);
      return;
    }
  }
  if(b[r][c]&&b[r][c].w){
    const ok=moves.some(k=>k.fr===r&&k.fc===c&&(!mustCap||k.er!=null));
    if(ok){sel={r,c};H.sfx("tick");}
    else{H.sfx("bad");say(mustCap?"Captura obrigatória em outra peça!":"Peça sem jogada!");}
  }else sel=null;
});
function ai(){
  if(over)return;
  const moves=allMoves(false);
  if(!moves.length){checkEnd();return;}
  const cp=moves.filter(m=>m.er!=null);
  let m;
  if(cp.length)m=cp[Math.floor(Math.random()*cp.length)];
  else{
    const fwd=moves.filter(k=>k.tr>k.fr);
    m=(fwd.length?fwd:moves)[Math.floor(Math.random()*(fwd.length?fwd.length:moves.length))];
  }
  apply(m);
  if(m.er!=null){
    let more=caps(m.tr,m.tc);
    let guard=0;
    while(more.length&&guard++<10){
      const nx=more[0];
      apply(nx);m=nx;more=caps(m.tr,m.tc);
    }
  }
  H.sfx("tick");turn=0;status();
  checkEnd();
}
H.loop(()=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    x.fillStyle=(r+c)%2?"#8A6A2F":"#E4D5B5";
    x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  }
  if(sel){
    x.strokeStyle=H.C.wasabi;x.lineWidth=4;
    x.strokeRect(OX+sel.c*CS+2,OY+sel.r*CS+2,CS-4,CS-4);
    allMoves(true).filter(m=>m.fr===sel.r&&m.fc===sel.c).forEach(m=>{
      x.fillStyle="rgba(196,214,69,.6)";
      x.beginPath();x.arc(OX+m.tc*CS+CS/2,OY+m.tr*CS+CS/2,8,0,7);x.fill();
    });
  }
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const p=b[r][c];
    if(!p)continue;
    x.fillStyle=p.w?"#181816":"#B23A24";
    x.beginPath();x.arc(OX+c*CS+CS/2,OY+r*CS+CS/2,CS/2-8,0,7);x.fill();
    x.strokeStyle="#F4F1EB";x.lineWidth=2;x.stroke();
    if(p.k){x.fillStyle="#E8A33D";x.font="bold 18px serif";x.fillText("♛",OX+c*CS+CS/2-9,OY+r*CS+CS/2+7);}
  }
});
}});
