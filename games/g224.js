/* NCODE N · 224 Sufixo Rápido — vença a máquina 5×! */
GREG(224,{
init(root,H){
const Q=[
 {r:"RAPID",o:["AMENTE","OSO","ADA"],a:0},
 {r:"CANT",o:["OR","AGEM","ILHA"],a:0},
 {r:"LIVR",o:["ARIA","OSO","AGEM"],a:0},
 {r:"FLOR",o:["ISTA","ADA","EZA"],a:0},
 {r:"DENT",o:["ISTA","OSO","AGEM"],a:0},
 {r:"JORNAL",o:["EIRO","ISTA","ADA"],a:0},
 {r:"PEDR",o:["EIRO","OSO","ILHA"],a:0},
 {r:"CANT",o:["ORIA","AGEM","ILHA"],a:0}
];
let over=false,qi=0,pw=0,aw=0,aiT=0,aiMax=3;
const hud=H.hud(root,[["pl","VOCÊ",0],["ai","MÁQUINA",0],["rd","RODADA","1/8"]]);
const say=H.msg(root,"Clique no <b>sufixo certo</b> antes da máquina! Melhor de 8 (5+ vence).");
const box=H.el("div","g-col",null,root);
const o=H.cvs(root,440,60),x=o.x;
function paint(){
  hud.set("rd",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","🔤 <b>"+Q[qi].r+"</b> + ___",box);
  const row=H.el("div","g-row",null,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost","…"+op,row);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){pw++;hud.set("pl",pw);H.sfx("ok");say("⚡ Você! "+Q[qi].r.toLowerCase()+op.toLowerCase());}
      else{aw++;hud.set("ai",aw);H.sfx("bad");say("❌ Errado! Ponto da máquina.");}
      next();
    });
  });
  aiMax=2+Math.random()*3;aiT=0;
}
function next(){
  qi++;
  if(qi>=Q.length||pw>=5||aw>=5){
    over=true;
    if(pw>=5)return H.done({win:true,score:pw*60,title:"Dedos velozes!",sub:pw+"×"+aw+" contra a máquina."});
    return H.done({win:false,score:pw*60,title:"Máquina venceu!",sub:pw+"×"+aw+". Clique sem medo!"});
  }
  paint();
}
paint();
H.loop(dt=>{
  if(over)return;
  aiT+=dt;
  if(aiT>=aiMax){
    aw++;hud.set("ai",aw);H.sfx("bad");say("🤖 Máquina foi mais rápida! ("+aw+")");
    next();return;
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(10,20,o.W-20,20);
  x.fillStyle=H.C.terra;
  x.fillRect(10,20,(o.W-20)*aiT/aiMax,20);
  x.strokeStyle=H.C.ink;x.strokeRect(10,20,o.W-20,20);
  x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
  x.fillText("🤖 pensando…",14,14);
});
}});
