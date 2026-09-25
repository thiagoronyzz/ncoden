/* NCODE N · 242 Snap — bata primeiro nos iguais! */
GREG(242,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,deck=[],pile=[],you=0,cpu=0,avail=true,aiT=-1,flipT=0;
const hud=H.hud(root,[["vc","SUAS",0],["cp","CPU",0],["mc","MONTE",52]]);
const say=H.msg(root,"Carta nova a cada 1s! Quando <b>igualar a anterior</b>, bata <b>SNAP</b> (ou Espaço) antes da CPU! Quem leva mais vence.");
const box=H.el("div","g-col",null,root);
const tp=H.el("div","g-msg","",box);
function mk(){
  deck=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push(r);
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
}
mk();
function snap(){
  if(over||!avail||pile.length<2)return;
  const n=pile.length;
  if(pile[n-1]===pile[n-2]){
    you+=pile.length;pile=[];avail=false;aiT=-1;
    H.score(you);hud.set("vc",you);H.sfx("ok");say("SNAP seu! +pilha.");
    H.after(600,()=>{avail=true;});
  }else{
    cpu+=1;you=Math.max(0,you-1);
    hud.set("vc",you);hud.set("cp",cpu);H.sfx("bad");say("✕ Falso snap! −1.");
  }
}
H.btn(root,"SNAP! (Espaço)",snap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")snap();});
H.loop(dt=>{
  if(over)return;
  flipT+=dt;
  if(flipT>=1&&deck.length&&avail){
    flipT=0;
    pile.push(deck.pop());
    hud.set("mc",deck.length);
    H.sfx("tick");
    const n=pile.length;
    if(n>=2&&pile[n-1]===pile[n-2])aiT=0.4+Math.random()*0.8;
    if(!deck.length){
      H.after(1500,()=>{
        if(over)return;
        over=true;
        you+=0;
        if(you>=cpu)return H.done({win:true,score:you*10,title:"Reflexo felino!",sub:"Você "+you+" × CPU "+cpu+"."});
        return H.done({win:false,score:you*10,title:"CPU mais rápida!",sub:"Você "+you+" × CPU "+cpu+"."});
      });
    }
  }
  if(aiT>0){
    aiT-=dt;
    if(aiT<=0){
      cpu+=pile.length;pile=[];aiT=-1;
      hud.set("cp",cpu);H.sfx("bad");say("CPU deu snap!");
    }
  }
  const n=pile.length;
  tp.innerHTML="Pilha ("+n+"): "+pile.slice(-6).map(RN).join(" ")+(n>=2&&pile[n-1]===pile[n-2]?"<br><b> IGUAIS! BATA!</b>":"");
});
}});
