/* NCODE N · 159 Bar de Smoothies — 8 copos saudáveis */
GREG(159,{
init(root,H){
const GOAL={energia:{e:"🏃",mix:["🍌","🍎"]},calma:{e:"😌",mix:["🫐","🥛"]},detox:{e:"🌿",mix:["🥬","🍋"]}};
const ING=["🍌","🍎","🫐","🥛","🥬","🍋"];
let over=false,goal=null,cup=[],blend=0,served=0;
const hud=H.hud(root,[["sm","SMOOTHIES","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Meta do cliente: <b>🏃 energia = 🍌+🍎 · 😌 calma = 🫐+🥛 · 🌿 detox = 🥬+🍋</b>. Ponha os 2, SEGURE bater (2s) e sirva!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const cbox=H.el("div","g-msg","",box);
let sc=0,hold=false;
function newGoal(){
  const ks=Object.keys(GOAL);
  goal=ks[Math.floor(Math.random()*3)];cup=[];blend=0;paint();
}
function paint(){
  od.innerHTML="🧾 Meta: "+GOAL[goal].e+" <b>"+goal+"</b>";
  cbox.innerHTML="🥤 Copo: "+(cup.join(" ")||"vazio")+(blend>0?" · batido "+Math.floor(blend*50)+"%":"");
}
newGoal();
const irow=H.el("div","g-row",null,box);
ING.forEach(g=>{
  const b=H.el("button","g-btn ghost",g,irow);
  b.addEventListener("click",()=>{
    if(over||cup.length>=2||blend>0)return;
    cup.push(g);H.sfx("tick");paint();
  });
});
const bb=H.el("button","g-btn","SEGURE PARA BATER",box);
bb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
bb.addEventListener("pointerup",()=>hold=false);
bb.addEventListener("pointerleave",()=>hold=false);
H.loop(dt=>{
  if(over)return;
  if(hold&&cup.length===2&&blend<2){blend+=dt;if(Math.random()<dt*6)paint();}
});
const row=H.el("div","g-row",null,box);
H.btn(row,"🗑️ Jogar fora",()=>{if(!over){cup=[];blend=0;H.sfx("tick");paint();}},false);
H.btn(row,"🥤 Servir!",()=>{
  if(over||cup.length<2||blend<2)return;
  const want=GOAL[goal].mix.slice().sort().join(),got=cup.slice().sort().join();
  if(want!==got){H.sfx("bad");say("❌ Mistura errada para "+goal+"! ("+GOAL[goal].mix.join("+")+")");cup=[];blend=0;paint();return;}
  served++;sc+=50;H.score(sc);hud.set("sm",served+"/8");hud.set("sc",sc);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Bar saudável!",sub:"8 smoothies na meta do cliente."});}
  say("🥤 Servido! Próximo cliente…");newGoal();
},true);
}});
