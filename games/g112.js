/* NCODE N · 112 Apiário — 12 potes de mel */
GREG(112,{
init(root,H){
let over=false,hives=[],turn=1,acts=3,honey=0,mode="colher";
const hud=H.hud(root,[["tn","TURNO","1/6"],["ml","MEL","0/12"],["ac","AÇÕES",3]]);
const say=H.msg(root,"<b>Colher</b> em colmeia calma rende até 3 potes (e agita!). <b>Fumaça</b> acalma. Colher enfurecida (×2) = ferroada!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(2,1fr)";
board.style.width="min(100%,300px)";
hives=new Array(4).fill(0).map(()=>({ag:0}));
function paint(){
  hud.set("tn",turn+"/6");hud.set("ml",honey+"/12");hud.set("ac",acts);
  board.innerHTML="";
  hives.forEach((h,i)=>{
    const d=H.el("button","g-cell"+(h.ag===0?" good":h.ag===2?" bad":""),null,board);
    d.style.minHeight="80px";d.style.fontSize="15px";
    d.innerHTML=""+(h.ag===0?"calma":h.ag===1?"irritada":"FURIOSA");
    d.addEventListener("click",()=>act(i));
  });
}
function act(i){
  if(over||acts<=0)return;
  const h=hives[i];
  if(mode==="fumaca"){h.ag=0;acts--;H.sfx("tick");say("Colmeia acalmada.");}
  else{
    if(h.ag>=2){H.sfx("bad");say("FERROADA! Sem mel e -1 ação extra.");acts=Math.max(0,acts-2);paint();return;}
    const y=3-h.ag;honey+=y;h.ag=2;acts--;H.sfx("ok");hud.set("ml",honey+"/12");
    say("+"+y+" potes!");
  }
  paint();
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"Colher",()=>{mode="colher";H.sfx("tick");},false);
H.btn(row,"Fumaça",()=>{mode="fumaca";H.sfx("tick");},false);
H.btn(root,"Próximo turno",()=>{
  if(over)return;
  turn++;acts=3;
  hives.forEach(h=>{if(Math.random()<.5)h.ag=Math.min(2,h.ag+1);});
  if(turn>6){
    over=true;H.score(honey*10);
    if(honey>=12)return H.done({win:true,score:honey*10+80,title:"Mestre apicultor!",sub:honey+" potes sem acidentes graves."});
    return H.done({win:false,score:honey*10,title:"Colmeias vazias…",sub:"Só "+honey+"/12 potes. Alterne fumaça e colheita!"});
  }
  say("Turno "+turn+": abelhas se agitam…");
  paint();
},true);
}});
