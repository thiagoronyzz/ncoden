/* NCODE N · 210 Câmara de Eco — 5 ecos rítmicos! */
GREG(210,{
init(root,H){
const PADS=[["○",220],["●",277],["○",330]];
let over=false,rd=0,seq=[],pos=0,showing=false,strikes=0,lastT=0;
const hud=H.hud(root,[["rd","RODADA","1/5"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Ouça o eco (pad + ritmo) e <b>repita igual, no mesmo ritmo</b>! 5 rodadas. 3 erros = fim.");
const box=H.el("div","g-row",null,root);
const r=H.rng(Date.now()%10000);
function newRound(){
  seq=[];let tt=0;
  const n=rd+3;
  for(let i=0;i<n;i++){tt+=0.45+r()*0.5;seq.push({p:Math.floor(r()*3),dt:tt});}
  pos=0;showing=true;
  hud.set("rd",(rd+1)+"/5");
  say("Ouça o eco… ("+n+" toques)");
  paint();
  seq.forEach((s,i)=>{
    H.after(s.dt*1000,()=>{
      if(over)return;
      H.beep(PADS[s.p][1],.2);flash(s.p);
      if(i===seq.length-1)H.after(500,()=>{if(!over){showing=false;lastT=performance.now();say("↻ Sua vez — mesmo ritmo!");}});
    });
  });
}
function flash(p){
  const el=box.children[p];
  if(el){el.classList.add("hot");H.after(250,()=>el.classList.remove("hot"));}
}
function paint(){
  box.innerHTML="";
  PADS.forEach((pd,i)=>{
    const b=H.el("button","g-btn ghost",pd[0],box);
    b.style.fontSize="26px";b.style.minWidth="90px";
    b.addEventListener("click",()=>{
      if(over||showing)return;
      const now=performance.now();
      const want=pos===0?0:seq[pos].dt-seq[pos-1].dt;
      const got=pos===0?0:(now-lastT)/1000;
      lastT=now;
      H.beep(pd[1],.15);flash(i);
      const okPad=i===seq[pos].p;
      const okTime=pos===0?true:Math.abs(got-want)<0.3;
      if(okPad&&okTime){
        pos++;
        if(pos>=seq.length){
          H.sfx("ok");rd++;H.score(rd*80);
          if(rd>=5){over=true;return H.done({win:true,score:500,title:"Eco perfeito!",sub:"5 padrões repetidos no ritmo exato."});}
          say("Eco certo! Próximo…");
          showing=true;H.after(800,newRound);
        }
      }else{
        strikes++;hud.set("er",strikes+"/3");H.sfx("bad");
        if(strikes>=3){over=true;return H.done({win:false,score:rd*80,title:"Eco perdido!",sub:!okPad?"Pad errado!":"Ritmo errado! Ouça os intervalos."});}
        say("✕"+(!okPad?"Pad errado!":"Fora do ritmo!")+" Ouça de novo… ("+strikes+"/3)");
        pos=0;showing=true;
        H.after(600,()=>{
          seq.forEach((s2,i)=>{
            H.after(s2.dt*1000,()=>{
              if(over)return;
              H.beep(PADS[s2.p][1],.2);flash(s2.p);
              if(i===seq.length-1)H.after(500,()=>{if(!over){showing=false;lastT=performance.now();say("↻ Sua vez!");}});
            });
          });
        });
      }
    });
  });
}
newRound();
}});
