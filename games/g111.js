/* NCODE N · 111 Vinhedo das Estações — 10 cachos em 2 anos */
GREG(111,{
init(root,H){
const SE=["🌱 Primavera","☀️ Verão","🍂 Outono","❄️ Inverno"];
let over=false,turn=0,vines=[],acts=3,grapes=0;
const hud=H.hud(root,[["es","ESTAÇÃO","Primavera"],["uv","UVAS","0/10"],["ac","AÇÕES",3]]);
const say=H.msg(root,"Clique na parreira para <b>cuidar</b> (+crescimento). No <b>outono</b>, parreira madura (3+) vira colheita!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(3,1fr)";
board.style.width="min(100%,320px)";
vines=new Array(6).fill(0).map(()=>({g:0}));
function paint(){
  const se=turn%4;
  hud.set("es",SE[se].split(" ")[1]+" · ano "+(Math.floor(turn/4)+1)+"/2");
  hud.set("uv",grapes+"/10");hud.set("ac",acts);
  board.innerHTML="";
  vines.forEach((v,i)=>{
    const d=H.el("button","g-cell"+(v.g>=3?" good":""),null,board);
    d.style.minHeight="70px";d.style.fontSize="14px";
    d.innerHTML=(v.g>=3?"🍇":v.g===0?"🪴":"🌿")+"<br>"+v.g+"/3"+(se===2&&v.g>=3?"<br>COLHER!":"");
    d.addEventListener("click",()=>tend(i));
  });
}
function tend(i){
  if(over||acts<=0)return;
  const se=turn%4,v=vines[i];
  if(se===2&&v.g>=3){grapes++;v.g=0;acts--;H.sfx("ok");hud.set("uv",grapes+"/10");}
  else if(se<=1){if(v.g>=3){H.sfx("bad");say("Já está no máximo! Espere o outono.");return;}v.g++;acts--;H.sfx("tick");}
  else{H.sfx("bad");say(se===3?"No inverno a vinha descansa…":"Só colha no outono!");return;}
  paint();
}
paint();
H.btn(root,"⏭ Próxima estação",()=>{
  if(over)return;
  turn++;acts=3;
  if(turn%4===3){let rot=0;vines.forEach(v=>{if(v.g>=3){v.g=0;rot++;}});if(rot)say("❄️ "+rot+" parreira(s) apodreceu(ram)! Colha no outono.");}
  if(turn%4===0&&turn>0){vines.forEach(v=>v.g=0);say("🌱 Novo ano! As parreiras rebrotam.");}
  if(turn>=8){
    over=true;H.score(grapes*20);
    if(grapes>=10)return H.done({win:true,score:grapes*20+100,title:"Safra premiada!",sub:grapes+" cachos em 2 anos."});
    return H.done({win:false,score:grapes*20,title:"Vinho aguado…",sub:"Só "+grapes+"/10 cachos. Cuide de 3+ parreiras por ano!"});
  }
  paint();
},true);
}});
