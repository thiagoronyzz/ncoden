/* NCODE N · 113 Pousada da Montanha — 10 hóspedes felizes */
GREG(113,{
init(root,H){
const ROOMS=[{t:"solteiro",e:"🛏️"},{t:"solteiro",e:"🛏️"},{t:"casal",e:"❤️"},{t:"casal",e:"❤️"},{t:"luxo",e:"👑"},{t:"luxo",e:"👑"}];
let over=false,rooms=[],guest=null,done2=0,sat=0,walk=0,spawn=2,sel=-1;
const hud=H.hud(root,[["hs","HÓSPEDES","0/10"],["st","SATISFAÇÃO","—"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no hóspede e depois no quarto. Tipo certo = 😍 · upgrade grátis = 🙂 · downgrade = 😠!");
const box=H.el("div","g-col",null,root);
const grow=H.el("div","g-row",null,box);
const rrow=H.el("div","g-board",null,box);
rrow.style.gridTemplateColumns="repeat(3,1fr)";
rrow.style.width="min(100%,320px)";
let sc=0;
rooms=ROOMS.map(r=>({t:r.t,e:r.e,busy:0}));
const PREF=["solteiro","casal","luxo"];
function paint(){
  grow.innerHTML="";rrow.innerHTML="";
  if(guest){
    const b=H.el("button","g-chip"+(sel===0?" hot":""),"🧳 quer "+guest+" ⏳"+Math.ceil(guest.p),grow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=0;H.sfx("tick");paint();});
  }else H.el("div","g-chip","recepção livre…",grow);
  rooms.forEach((r,i)=>{
    const b=H.el("button","g-cell"+(r.busy>0?"":" good"),null,rrow);
    b.style.minHeight="60px";b.style.fontSize="14px";
    b.innerHTML=r.busy>0?("🔒 "+Math.ceil(r.busy)+"s"):(r.e+"<br>"+r.t);
    b.addEventListener("click",()=>{
      if(over||!guest||sel<0||r.busy>0)return;
      const gi=PREF.indexOf(guest.t),ri=PREF.indexOf(r.t);
      let s=0;
      if(gi===ri)s=100;else if(ri>gi)s=70;else s=20;
      r.busy=9;sat+=s;done2++;sc+=s;H.score(sc);
      hud.set("hs",done2+"/10");hud.set("st",Math.round(sat/done2)+"%");hud.set("sc",sc);
      H.sfx(s>=70?"ok":"bad");
      say(s===100?"😍 Perfeito!":s===70?"🙂 Upgrade agradou.":"😠 Quarto abaixo do esperado!");
      guest=null;sel=-1;paint();
      if(done2>=10){
        over=true;
        const avg=sat/10;
        if(avg>=70&&walk<=2)return H.done({win:true,score:sc+100,title:"Pousada 5 estrelas!",sub:"Satisfação média "+Math.round(avg)+"%."});
        return H.done({win:false,score:sc,title:"Avaliações mistas…",sub:"Média "+Math.round(avg)+"%, "+walk+" desistências. Acerte o tipo!"});
      }
    });
  });
}
paint();
H.loop(dt=>{
  if(over)return;
  if(!guest){spawn-=dt;if(spawn<=0){spawn=2.5;guest={t:PREF[Math.floor(Math.random()*3)],p:14};sel=-1;paint();}}
  else{
    guest.p-=dt;
    if(guest.p<=0){
      guest=null;walk++;H.sfx("bad");paint();
      say("🚶 Hóspede desistiu! ("+walk+")");
      if(walk>2){over=true;return H.done({win:false,score:sc,title:"Pousada vazia!",sub:"3 desistências. Quartos ocupados demais?"});}
    }else if(Math.random()<dt*2)paint();
  }
  rooms.forEach(r=>{if(r.busy>0){r.busy-=dt;if(r.busy<=0)paint();}});
});
}});
