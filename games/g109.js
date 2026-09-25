/* NCODE N · 109 Estufa Inteligente — água e luz na medida */
GREG(109,{
init(root,H){
let over=false,plants=[],sel=0,time=60,decay=0;
const hud=H.hud(root,[["vv","VIVAS","8/8"],["tp","TEMPO",60],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na planta e use <b> Regar</b> / <b> Iluminar</b>. Se e zerarem juntos, ela murcha!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(4,1fr)";
board.style.width="min(100%,340px)";
let sc=0;
plants=new Array(8).fill(0).map(()=>({w:2,l:2,alive:true}));
function paint(){
  board.innerHTML="";
  plants.forEach((p,i)=>{
    const d=H.el("button","g-cell"+(sel===i?" sel":""),null,board);
    d.style.fontSize="13px";d.style.minHeight="64px";
    d.innerHTML=!p.alive?"<br>morta":("<br>".repeat(1)+p.w+""+p.l);
    d.addEventListener("click",()=>{if(!over&&p.alive){sel=i;H.sfx("tick");paint();}});
  });
  const alive=plants.filter(p=>p.alive).length;
  hud.set("vv",alive+"/8");
}
paint();
const row=H.el("div","g-row",null,root);
H.btn(row,"Regar",()=>{
  if(over)return;const p=plants[sel];
  if(p&&p.alive){p.w=Math.min(3,p.w+1);H.sfx("tick");paint();}
},false);
H.btn(row,"Iluminar",()=>{
  if(over)return;const p=plants[sel];
  if(p&&p.alive){p.l=Math.min(3,p.l+1);H.sfx("tick");paint();}
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;decay+=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(decay>5){
    decay=0;
    plants.forEach(p=>{
      if(!p.alive)return;
      if(Math.random()<.6)p.w=Math.max(0,p.w-1);else p.l=Math.max(0,p.l-1);
      if(p.w===0&&p.l===0){p.alive=false;H.sfx("bad");say("Uma planta murchou!");}
    });
    paint();
  }
  const alive=plants.filter(p=>p.alive).length;
  sc=alive*10+Math.floor((60-time)*2);H.score(sc);hud.set("sc",sc);
  if(alive<6){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Estufa seca!",sub:"Menos de 6 sobreviveram. Alterne água e luz!"});}
  if(time<=0){over=true;
    return H.done({win:true,score:sc+100,title:"Colheita verde!",sub:alive+"/8 plantas vivas após 60s."});}
});
}});
