/* NCODE N · 126 Gerente de Hotel — 8 hóspedes, reclamação zero */
GREG(126,{
init(root,H){
let over=false,rooms=[],guest=null,done2=0,angry=0,spawn=1;
const hud=H.hud(root,[["hs","HÓSPEDES","0/8"],["rc","RECLAMAÇÕES","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Hóspede na recepção? Clique num quarto <b>livre</b>. Quarto com !? Clique para <b>resolver</b> antes que vire 1 estrela!");
const box=H.el("div","g-col",null,root);
const grow=H.el("div","g-row",null,box);
const rrow=H.el("div","g-board",null,box);
rrow.style.gridTemplateColumns="repeat(3,1fr)";
rrow.style.width="min(100%,320px)";
let sc=0;
rooms=new Array(6).fill(0).map(()=>({busy:0,comp:0}));
function paint(){
  grow.innerHTML="";rrow.innerHTML="";
  if(guest)H.el("div","g-chip hot","hóspede esperando "+Math.ceil(guest.p),grow);
  else H.el("div","g-chip","recepção livre…",grow);
  rooms.forEach((r,i)=>{
    const b=H.el("button","g-cell"+(r.comp>0?" bad":r.busy>0?" good":""),null,rrow);
    b.style.minHeight="62px";b.style.fontSize="13px";
    b.innerHTML=r.comp>0?("!"+Math.ceil(r.comp)+"s<br>RESOLVER!"):r.busy>0?(""+Math.ceil(r.busy)+"s"):"livre";
    b.addEventListener("click",()=>click(i));
  });
}
function click(i){
  if(over)return;
  const r=rooms[i];
  if(r.comp>0){r.comp=0;sc+=15;H.score(sc);hud.set("sc",sc);H.sfx("ok");paint();say("✔ Reclamação resolvida! +15");return;}
  if(r.busy<=0&&guest){
    r.busy=14;r.comp=0;
    H.after(5000+Math.random()*5000,()=>{if(!over&&r.busy>0&&r.comp<=0){r.comp=8;paint();say("! Reclamação no quarto "+(i+1)+"!");}});
    guest=null;done2++;sc+=40;H.score(sc);
    hud.set("hs",done2+"/8");hud.set("sc",sc);H.sfx("ok");paint();
    if(done2>=8){over=true;return H.done({win:true,score:sc+100,title:"Gerente 5 estrelas!",sub:"8 check-ins com reclamações sob controle."});}
  }
}
paint();
H.loop(dt=>{
  if(over)return;
  if(!guest&&done2<8){spawn-=dt;if(spawn<=0){spawn=3;guest={p:16};paint();}}
  if(guest){guest.p-=dt;
    if(guest.p<=0){guest=null;angry++;hud.set("rc",angry+"/3");H.sfx("bad");paint();
      say("Hóspede foi para a concorrência! ("+angry+"/3)");
      if(angry>=3){over=true;return H.done({win:false,score:sc,title:"Hotel vazio!",sub:"3 hóspedes perdidos. Libere quartos!"});}}}
  rooms.forEach(r=>{
    if(r.busy>0){r.busy-=dt;if(r.busy<=0){r.comp=0;paint();}}
    if(r.comp>0){r.comp-=dt;
      if(r.comp<=0){r.comp=0;r.busy=0;angry++;hud.set("rc",angry+"/3");H.sfx("bad");paint();
        say("★ 1 estrela no site! ("+angry+"/3)");
        if(angry>=3){over=true;return H.done({win:false,score:sc,title:"Fama arruinada!",sub:"3 reclamações ignoradas."});}}}
  });
  if(Math.random()<dt*2)paint();
});
}});
