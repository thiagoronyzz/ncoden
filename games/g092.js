/* NCODE N · 092 Arena de Gladiadores — draft e torneio */
GREG(92,{
init(root,H){
const T={esp:{e:"🗡",n:"Espada"},arc:{e:"🏹",n:"Arco"},esc:{e:"🛡",n:"Escudo"}};
const BEAT={esp:"arc",arc:"esc",esc:"esp"};
let over=false,team=[],stage=0;
const hud=H.hud(root,[["fs","FASE","DRAFT"],["sc","PONTOS",0]]);
const say=H.msg(root,"🗡 vence 🏹 · 🏹 vence 🛡 · 🛡 vence 🗡. Monte 3 gladiadores e vença quartas, semi e final!");
const box=H.el("div","g-col",null,root);
const log=H.el("div","g-msg","Escolha 3 gladiadores…",root);
let sc=0;
function draftUI(){
  box.innerHTML="";
  const row=H.el("div","g-row",null,box);
  Object.keys(T).forEach(k=>{
    const b=H.el("button","g-btn ghost",T[k].e+" "+T[k].n,row);
    b.addEventListener("click",()=>{
      if(over||team.length>=3)return;
      team.push(k);H.sfx("tick");
      if(team.length>=3){say("Time: "+team.map(t=>T[t].e).join(" ")+" — para a arena!");H.after(600,()=>fight(0));}
      else say("Escolhidos "+team.length+"/3: "+team.map(t=>T[t].e).join(" "));
    });
  });
}
function fight(st){
  stage=st;
  const names=["Quartas","Semifinal","FINAL"];
  hud.set("fs",names[st]);
  const foe=[0,1,2].map(()=>Object.keys(T)[Math.floor(Math.random()*3)]);
  log.innerHTML="<b>"+names[st]+"</b> — você "+team.map(t=>T[t].e).join("")+" × "+foe.map(t=>T[t].e).join("")+" rival";
  let w=0,l=0,msg="";
  for(let i=0;i<3;i++){
    const a=team[i],b=foe[i];
    if(a===b){msg+="Duelo "+(i+1+": ")+T[a].e+" = "+T[b].e+" (empate). ";}
    else if(BEAT[a]===b){w++;msg+="Duelo "+(i+1)+": "+T[a].e+" vence "+T[b].e+"! ";}
    else{l++;msg+="Duelo "+(i+1)+": "+T[a].e+" cai para "+T[b].e+". ";}
  }
  box.innerHTML="";
  H.el("div","g-msg",msg,box);
  const row=H.el("div","g-row",null,box);
  if(w>l){
    sc+=100;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(st>=2){over=true;H.after(800,()=>H.done({win:true,score:sc+150,title:"Campeão da arena!",sub:"3 chaves vencidas no pedra-papel-tesoura de aço."}));return;}
    H.btn(row,"⚔ Avançar para "+names[st+1],()=>fight(st+1),true);
  }else{
    H.sfx("bad");
    H.btn(row,"🔄 Novo draft",()=>{team=[];say("Escolha 3 gladiadores…");draftUI();},true);
    if(st>=2&&w<=l){/* pode tentar de novo */}
    H.el("div","g-msg","Derrota "+w+"×"+l+" (+empates). Redrafte e tente outra combinação!",box);
    if(w<l&&st===0){/* continua */}
  }
  const oldDone=log.innerHTML;
  if(w<=l&&w+l<3){/* empate geral conta como derrota */}
  if(w===l){/* desempate: revanche */}
}
draftUI();
const origFight=fight;
}});
