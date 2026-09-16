/* NCODE N · 120 Cidade-Estado — 12 turnos de governo */
GREG(120,{
init(root,H){
let over=false,turn=1,food=20,gold=10,sol=2,w={f:2,m:2,r:2},breach=0;
const hud=H.hud(root,[["tn","TURNO","1/12"],["cm","COMIDA",20],["ou","OURO",10],["ex","EXÉRCITO",2]]);
const say=H.msg(root,"Distribua <b>6 trabalhadores</b>: 🌾 fazenda (+4 comida) · ⛏️ mina (+3 ouro) · ⚔️ recruta (+1 soldado). Ataques nos turnos 4, 8 e 12!");
const box=H.el("div","g-col",null,root);
function paint(){
  hud.set("tn",turn+"/12");hud.set("cm",food);hud.set("ou",gold);hud.set("ex",sol);
  box.innerHTML="";
  const rows=[["f","🌾 Fazenda"],["m","⛏️ Mina"],["r","⚔️ Recrutas"]];
  rows.forEach(([k,nm])=>{
    const r2=H.el("div","g-row",null,box);
    H.el("div","g-chip",nm+": <b>"+w[k]+"</b>",r2);
    const bm=H.el("button","g-btn ghost","−",r2);
    const bp=H.el("button","g-btn ghost","+",r2);
    bm.addEventListener("click",()=>{if(!over&&w[k]>0){w[k]--;H.sfx("tick");paint();}});
    bp.addEventListener("click",()=>{
      if(over)return;
      if(w.f+w.m+w.r>=6){H.sfx("bad");say("Só 6 trabalhadores! Tire de outro setor.");return;}
      w[k]++;H.sfx("tick");paint();
    });
  });
  H.el("div","g-msg","Colheita/turno: +"+(w.f*4)+" comida · +"+(w.m*3)+" ouro · +"+w.r+" soldados · consumo −6 comida",box);
}
paint();
H.btn(root,"⏭ Passar turno",()=>{
  if(over)return;
  food+=w.f*4;gold+=w.m*3;sol+=w.r;food-=6;
  let msg="Turno "+turn+": colheita feita. ";
  if(food<0){over=true;H.sfx("lose");paint();
    return H.done({win:false,score:gold,title:"Revolta da fome!",sub:"A cidade passou fome no turno "+turn+". Mais fazenda!"});}
  if(turn===4||turn===8||turn===12){
    const atk=turn===4?4:turn===8?7:10;
    if(sol>=atk){const lost=Math.ceil(atk/2);sol-=lost;msg+="⚔️ Ataque ("+atk+") repelido! −"+lost+" soldados. ";}
    else{breach++;gold=Math.max(0,gold-25);msg+="🔥 Ataque ("+atk+") SAQUEOU a cidade! −25 ouro. ";}
    if(breach>=2){over=true;paint();return H.done({win:false,score:gold,title:"Cidade arrasada!",sub:"2 saques. Recrute antes dos turnos 4/8/12!"});}
  }
  if(turn>=12){
    over=true;paint();
    const sc2=gold+sol*5;H.score(sc2);
    if(gold>=60&&sol>=6)return H.done({win:true,score:sc2+100,title:"Era de ouro!",sub:"$"+gold+" e "+sol+" soldados. A cidade prospera!"});
    return H.done({win:false,score:sc2,title:"Reino medíocre…",sub:"$"+gold+" e "+sol+" soldados (meta: $60 + 6). Equilibre mina e recrutas!"});
  }
  turn++;H.sfx("tick");say(msg);paint();
},true);
}});
