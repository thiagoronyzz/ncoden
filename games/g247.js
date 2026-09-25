/* NCODE N · 247 Quatro em Linha — alinhe 4! */
GREG(247,{
init(root,H){
let over=false,b=[],turn=0;
const hud=H.hud(root,[["vz","VEZ","você"]]);
const say=H.msg(root,"Você é ○! Clique na coluna para soltar. Alinhe 4 (linha, coluna ou diagonal) antes da CPU ●!");
const o=H.cvs(root,460,420),x=o.x;
const CS=60,OX=20,OY=40;
function mk(){b=[];for(let r=0;r<6;r++){b.push([]);for(let c=0;c<7;c++)b[r].push(0);}turn=0;}
function drop(c,who){
  for(let r=5;r>=0;r--)if(!b[r][c]){b[r][c]=who;return r;}
  return-1;
}
function wins(who){
  for(let r=0;r<6;r++)for(let c=0;c<7;c++){
    if(b[r][c]!==who)continue;
    if(c+3<7&&b[r][c+1]===who&&b[r][c+2]===who&&b[r][c+3]===who)return true;
    if(r+3<6&&b[r+1][c]===who&&b[r+2][c]===who&&b[r+3][c]===who)return true;
    if(c+3<7&&r+3<6&&b[r+1][c+1]===who&&b[r+2][c+2]===who&&b[r+3][c+3]===who)return true;
    if(c-3>=0&&r+3<6&&b[r+1][c-1]===who&&b[r+2][c-2]===who&&b[r+3][c-3]===who)return true;
  }
  return false;
}
function full(){return b[0].every(v=>v);}
mk();
H.onTap(o,(px,py)=>{
  if(over||turn!==0)return;
  const c=Math.floor((px-OX)/CS);
  if(c<0||c>6||b[0][c]){H.sfx("bad");return;}
  drop(c,1);H.sfx("tick");
  if(wins(1)){over=true;return H.done({win:true,score:300,title:"4 em linha!",sub:"Você alinhou primeiro!"});}
  if(full()){over=true;return H.done({win:true,score:150,title:"Empate!",sub:"Tabuleiro cheio."});}
  turn=1;hud.set("vz","CPU");H.after(500,ai);
});
function ai(){
  if(over)return;
  // vence? bloqueia? centro?
  for(let c=0;c<7;c++){
    if(b[0][c])continue;
    const r=drop(c,2);
    if(wins(2)){H.sfx("bad");over=true;paintWin();return H.done({win:false,score:50,title:"CPU alinhou 4!",sub:"Bloqueie as sequências dela!"});}
    b[r][c]=0;
  }
  for(let c=0;c<7;c++){
    if(b[0][c])continue;
    const r=drop(c,1);
    const w=wins(1);
    b[r][c]=0;
    if(w){drop(c,2);H.sfx("tick");afterAi();return;}
  }
  const order=[3,2,4,1,5,0,6].filter(c=>!b[0][c]);
  drop(order[0],2);H.sfx("tick");afterAi();
}
function afterAi(){
  if(wins(2)){over=true;paintWin();return H.done({win:false,score:50,title:"CPU alinhou 4!",sub:""});}
  if(full()){over=true;return H.done({win:true,score:150,title:"Empate!",sub:""});}
  turn=0;hud.set("vz","você");
}
function paintWin(){}
H.loop(()=>{
  x.fillStyle="#2E6E8A";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<6;r++)for(let c=0;c<7;c++){
    x.fillStyle=b[r][c]===1?"#D94E34":b[r][c]===2?"#E8A33D":"#F4F1EB";
    x.beginPath();x.arc(OX+c*CS+CS/2,OY+r*CS+CS/2,CS/2-7,0,7);x.fill();
  }
});
}});
