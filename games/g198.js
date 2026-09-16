/* NCODE N · 198 Torre dos Sinos — 5 melodias! */
GREG(198,{
init(root,H){
const BELLS=[["🔔 dó",261],["🔔 mi",329],["🔔 sol",392],["🔔 lá",440]];
let over=false,rd=0,seq=[],pos=0,showing=false,strikes=0;
const hud=H.hud(root,[["rd","RODADA","1/5"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Ouça a sequência e <b>repita nos sinos</b>! 5 rodadas (3→7 notas). 3 erros = fim.");
const box=H.el("div","g-row",null,root);
function newRound(){
  seq=[];
  for(let i=0;i<rd+3;i++)seq.push(Math.floor(Math.random()*4));
  pos=0;showing=true;
  hud.set("rd",(rd+1)+"/5");
  say("🎧 Ouça… ("+(rd+3)+" notas)");
  paint();
  seq.forEach((b,i)=>{
    H.after(700*(i+1),()=>{
      if(over)return;
      H.beep(BELLS[b][1],.25);flash(b);
      if(i===seq.length-1)H.after(400,()=>{if(!over){showing=false;say("🎵 Sua vez!");}});
    });
  });
}
function flash(b){
  const el=box.children[b];
  if(el){el.classList.add("hot");H.after(300,()=>el.classList.remove("hot"));}
}
function paint(){
  box.innerHTML="";
  BELLS.forEach((bl,i)=>{
    const b=H.el("button","g-btn ghost",bl[0],box);
    b.style.fontSize="20px";
    b.addEventListener("click",()=>{
      if(over||showing)return;
      H.beep(bl[1],.2);flash(i);
      if(i===seq[pos]){
        pos++;
        if(pos>=seq.length){
          H.sfx("ok");rd++;H.score(rd*60);
          if(rd>=5){over=true;return H.done({win:true,score:400,title:"Sineiro mestre!",sub:"5 melodias repetidas sem partitura."});}
          say("Melodia certa! Próxima…");
          H.after(800,newRound);
          showing=true;
        }
      }else{
        strikes++;hud.set("er",strikes+"/3");H.sfx("bad");
        if(strikes>=3){over=true;return H.done({win:false,score:rd*60,title:"Sinos desafinados!",sub:"3 erros. Ouça com atenção!"});}
        say("❌ Errou! Ouça de novo… ("+strikes+"/3)");
        pos=0;showing=true;
        H.after(600,()=>{
          seq.forEach((bb,ii)=>H.after(700*(ii+1),()=>{
            if(over)return;
            H.beep(BELLS[bb][1],.25);flash(bb);
            if(ii===seq.length-1)H.after(400,()=>{if(!over){showing=false;say("🎵 Sua vez!");}});
          }));
        });
      }
    });
  });
}
newRound();
}});
