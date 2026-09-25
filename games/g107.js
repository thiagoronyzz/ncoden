/* NCODE N · 107 Hotel Fantasma — 10 hóspedes, 0 sustos */
GREG(107,{
init(root,H){
const N=20;
let over=false,rooms=[],check=0,fled=0,wait=0;
const hud=H.hud(root,[["ck","HÓSPEDES","0/10"],["fg","FUGIRAM","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Hóspede esperando? Clique num quarto <b>escuro e vazio</b> para hospedar. na porta? Clique nele antes do susto!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(5,1fr)";
board.style.width="min(100%,360px)";
let sc=0;
rooms=new Array(N).fill(null);
function paint(){
  board.innerHTML="";
  for(let i=0;i<N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="20px";
    const r=rooms[i];
    if(!r){d.textContent="";}
    else if(r.ghost>0){d.textContent="";d.classList.add("bad");}
    else{d.textContent=""+Math.ceil(r.stay);d.classList.add("good");}
    (function(idx){d.addEventListener("click",()=>click(idx));})(i);
  }
}
function click(i){
  if(over)return;
  const r=rooms[i];
  if(r&&r.ghost>0){r.ghost=0;r.scare=6+Math.random()*6;H.sfx("pop");paint();say("Fantasma enxotado!");return;}
  if(!r&&wait>0){
    rooms[i]={stay:12,scare:5+Math.random()*7,ghost:0};
    wait--;H.sfx("ok");paint();say(wait?wait+" hóspede(s) na recepção!":"Todos acomodados… por enquanto.");
  }
}
paint();
H.loop(dt=>{
  if(over)return;
  wait+=dt*.28;
  if(wait>=3)wait=3;
  for(let i=0;i<N;i++){
    const r=rooms[i];
    if(!r)continue;
    if(r.ghost>0){
      r.ghost-=dt;
      if(r.ghost<=0){rooms[i]=null;fled++;hud.set("fg",fled+"/3");H.sfx("bad");paint();
        say("Hóspede fugiu assustado! ("+fled+"/3)");
        if(fled>=3){over=true;return H.done({win:false,score:sc,title:"Hotel mal-assombrado!",sub:"3 fugas. Enxote os fantasmas a tempo!"});}
        continue;}
    }else{
      r.scare-=dt;
      if(r.scare<=0){r.ghost=3;H.sfx("bad");paint();say("Fantasma no quarto "+(i+1)+"! Clique nele!");}
    }
    r.stay-=dt;
    if(r.stay<=0){
      rooms[i]=null;check++;sc+=50;H.score(sc);
      hud.set("ck",check+"/10");hud.set("sc",sc);H.sfx("ok");paint();
      if(check>=10){over=true;return H.done({win:true,score:sc+100,title:"Hotel 5 estrelas!",sub:"10 hóspedes dormiram sem um susto."});}
    }
  }
  if(Math.random()<dt*3)paint();
  hud.set("ck",check+"/10"+(wait>=1?" · +"+Math.floor(wait)+" esperando":""));
});
}});
