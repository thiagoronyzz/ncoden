/* NCODE N · 139 Acampamento — 10 campistas sob as estrelas */
GREG(139,{
init(root,H){
let over=false,tents=[0,0,0],fire=70,wood=3,queue=0,served=0,lost=0,spawn=2,time=180;
const hud=H.hud(root,[["cp","CAMPISTAS","0/10"],["fg","FOGUEIRA",70],["tp","TEMPO",180]]);
const say=H.msg(root,"Clique na barraca <b>livre</b> para acomodar quem espera. <b>🪵 Lenha</b> alimenta o fogo — apagou, campista vai embora bravo!");
const box=H.el("div","g-col",null,root);
const trow=H.el("div","g-row",null,box);
const frow=H.el("div","g-msg","",box);
function paint(){
  hud.set("cp",served+"/10");hud.set("fg",Math.max(0,Math.floor(fire)));
  trow.innerHTML="";
  tents.forEach((t,i)=>{
    const b=H.el("button","g-cell"+(t>0?" good":""),null,trow);
    b.style.minWidth="100px";b.style.fontSize="14px";
    b.innerHTML=t>0?("⛺ "+Math.ceil(t)+"s"):"⛺ livre";
    b.addEventListener("click",()=>{
      if(over||t>0||queue<=0)return;
      if(fire<=10){H.sfx("bad");say("Muito frio! Alimente a fogueira antes.");return;}
      tents[i]=16;queue--;H.sfx("ok");paint();
    });
  });
  frow.innerHTML="🔥 "+(fire>50?"acesa":fire>15?"fraca":"QUASE APAGADA!")+" · 🪵 lenha "+wood+" · 🧍 esperando "+queue;
}
paint();
H.btn(root,"🪵 Jogar lenha (+25 fogo)",()=>{
  if(over||wood<=0)return;
  wood--;fire=Math.min(100,fire+25);H.sfx("tick");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*25,title:"Fim da temporada!",sub:"Só "+served+"/10 acomodados."});}
  fire-=dt*4;
  if(Math.random()<dt*.4&&wood<5){wood++;paint();}
  spawn-=dt;
  if(spawn<=0&&served+queue+tents.filter(Boolean).length<13){spawn=6;queue++;paint();}
  if(fire<=0){
    fire=0;
    tents.forEach((t,i)=>{if(t>0){tents[i]=0;lost++;}});
    if(lost>0){H.sfx("bad");paint();say("🥶 Fogueira apagou! Campistas fugiram! ("+lost+")");
      if(lost>=3){over=true;return H.done({win:false,score:served*25,title:"Acampamento gelado!",sub:"3 fugiram do frio. Alimente o fogo!"});}}
    fire=20;
  }
  let ch=false;
  tents.forEach((t,i)=>{
    if(t>0){tents[i]=t-dt;ch=true;
      if(tents[i]<=0){tents[i]=0;served++;H.score(served*25);H.sfx("ok");
        if(served>=10){over=true;H.done({win:true,score:350,title:"Noite perfeita!",sub:"10 campistas felizes sob as estrelas."});}}}
  });
  if(ch||Math.random()<dt)paint();
});
}});
