/* NCODE N · 246 Reversi — vire o jogo! */
GREG(246,{
init(root,H){
let over=false,b=[],turn=0;
const hud=H.hud(root,[["vc","VOCÊ",2],["cp","CPU",2]]);
const say=H.msg(root,"Você é ⚫! Cerque brancas entre pretas para virar. Cantos valem ouro. Mais peças no fim vence!");
const o=H.cvs(root,440,440),x=o.x;
const CS=52,OX=12,OY=12;
const DIRS=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
function mk(){
  b=[];
  for(let r=0;r<8;r++){b.push([]);for(let c=0;c<8;c++)b[r].push(0);}
  b[3][3]=2;b[3][4]=1;b[4][3]=1;b[4][4]=2;
  turn=0;
}
function flips(r,c,who){
  if(b[r][c])return[];
  let out=[];
  for(const[dr,dc]of DIRS){
    const line=[];
    let rr=r+dr,cc=c+dc;
    while(rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr][cc]===3-who){line.push([rr,cc]);rr+=dr;cc+=dc;}
    if(line.length&&rr>=0&&rr<8&&cc>=0&&cc<8&&b[rr][cc]===who)out=out.concat(line);
  }
  return out;
}
function legal(who){
  const out=[];
  for(let r=0;r<8;r++)for(let c=0;c<8;c++)if(flips(r,c,who).length)out.push([r,c]);
  return out;
}
function counts(){
  let w1=0,w2=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){if(b[r][c]===1)w1++;if(b[r][c]===2)w2++;}
  return[w1,w2];
}
function status(){
  const[w1,w2]=counts();
  hud.set("vc",w1);hud.set("cp",w2);
}
function apply(r,c,who){
  flips(r,c,who).forEach(f=>b[f[0]][f[1]]=who);
  b[r][c]=who;
}
function checkFlow(){
  status();
  if(legal(1).length===0&&legal(2).length===0){
    over=true;
    const[w1,w2]=counts();
    if(w1>w2)return H.done({win:true,score:w1*5,title:"Reversi master!",sub:w1+" × "+w2+"."});
    if(w1<w2)return H.done({win:false,score:w1*5,title:"Virado!",sub:w1+" × "+w2+". Mire os cantos!"});
    return H.done({win:true,score:w1*5,title:"Empate técnico!",sub:w1+" × "+w2+"."});
  }
  return null;
}
mk();status();
H.onTap(o,(px,py)=>{
  if(over||turn!==0)return;
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>7||c<0||c>7)return;
  if(!flips(r,c,1).length){H.sfx("bad");return;}
  apply(r,c,1);H.sfx("tick");
  if(checkFlow())return;
  if(!legal(2).length){say("CPU sem jogada — de novo!");status();return;}
  turn=1;H.after(600,ai);
});
function ai(){
  if(over)return;
  const mv=legal(2);
  if(!mv.length){turn=0;paint0();return;}
  let best=mv[0],bs=-1e9;
  mv.forEach(m=>{
    let sc=flips(m[0],m[1],2).length;
    if((m[0]===0||m[0]===7)&&(m[1]===0||m[1]===7))sc+=30;
    else if(m[0]===0||m[0]===7||m[1]===0||m[1]===7)sc+=6;
    else if(m[0]>=2&&m[0]<=5&&m[1]>=2&&m[1]<=5)sc+=2;
    if((m[0]===1||m[0]===6)&&(m[1]===1||m[1]===6))sc-=12;
    if(sc>bs){bs=sc;best=m;}
  });
  apply(best[0],best[1],2);H.sfx("tick");
  if(checkFlow())return;
  turn=0;
  if(!legal(1).length){say("Você sem jogada — CPU de novo!");turn=1;H.after(600,ai);}
}
function paint0(){}
H.loop(()=>{
  x.fillStyle="#3E7C4F";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    x.strokeStyle="rgba(0,0,0,.3)";
    x.strokeRect(OX+c*CS,OY+r*CS,CS,CS);
  }
  if(turn===0&&!over)legal(1).forEach(m=>{
    x.fillStyle="rgba(255,255,255,.35)";
    x.beginPath();x.arc(OX+m[1]*CS+CS/2,OY+m[0]*CS+CS/2,7,0,7);x.fill();
  });
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    if(!b[r][c])continue;
    x.fillStyle=b[r][c]===1?"#181816":"#F4F1EB";
    x.beginPath();x.arc(OX+c*CS+CS/2,OY+r*CS+CS/2,CS/2-6,0,7);x.fill();
    x.strokeStyle=b[r][c]===1?"#F4F1EB":"#181816";x.lineWidth=2;x.stroke();
  }
});
}});
