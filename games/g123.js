/* NCODE N · 123 Hotel de Pets — 15 vontades atendidas */
GREG(123,{
init(root,H){
const PETS=["cachorro","gato","coelho","papagaio"],NEED={eat:"comer",walk:"passear",play:"brincar"};
let over=false,pets=[],served=0,lost=0,spawn=1,time=150;
const hud=H.hud(root,[["at","ATENDIDOS","0/15"],["er","IGNORADOS","0/4"],["tp","TEMPO",150]]);
const say=H.msg(root,"Clique no pet e depois na <b>ação pedida</b> (). Vontade vencida = pet triste!");
const prow=H.el("div","g-board",null,root);
prow.style.gridTemplateColumns="repeat(2,1fr)";
prow.style.width="min(100%,320px)";
const arow=H.el("div","g-row",null,root);
let sel=-1;
pets=PETS.map(e=>({e,need:null,t:0}));
function paint(){
  hud.set("at",served+"/15");
  prow.innerHTML="";
  pets.forEach((p,i)=>{
    const b=H.el("button","g-cell"+(sel===i?" sel":""),null,prow);
    b.style.minHeight="78px";b.style.fontSize="15px";
    b.innerHTML="<b>"+p.e+"</b><br>"+(p.need?NEED[p.need]+" "+Math.ceil(p.t)+"s":"ok");
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");paint();});
  });
}
paint();
Object.keys(NEED).forEach(k=>{
  H.btn(arow,NEED[k]+" "+(k==="eat"?"Alimentar":k==="walk"?"Passear":"Brincar"),()=>{
    if(over||sel<0)return;
    const p=pets[sel];
    if(p.need===k){
      p.need=null;served++;H.score(served*20);H.sfx("ok");paint();
      if(served>=15){over=true;return H.done({win:true,score:300,title:"Pets felizes!",sub:"15 vontades atendidas na hora."});}
    }else H.sfx("bad");
  },false);
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*20,title:"Check-out!",sub:"Só "+served+"/15 atendidos. Fique de olho!"});}
  spawn-=dt;
  if(spawn<=0){
    spawn=3.5;
    const free=pets.filter(p=>!p.need);
    if(free.length){
      const p=free[Math.floor(Math.random()*free.length)];
      p.need=Object.keys(NEED)[Math.floor(Math.random()*3)];p.t=12;
      paint();
    }
  }
  let ch=false;
  pets.forEach(p=>{
    if(p.need){p.t-=dt;ch=true;
      if(p.t<=0){p.need=null;lost++;hud.set("er",lost+"/4");H.sfx("bad");paint();
        if(lost>=4){over=true;H.done({win:false,score:served*20,title:"Au-au de protesto!",sub:"4 vontades ignoradas. Priorize o timer curto!"});}}}
  });
  if(ch&&Math.random()<dt*3)paint();
});
}});
