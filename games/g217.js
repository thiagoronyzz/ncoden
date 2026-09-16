/* NCODE N · 217 Par de Sinônimos — 6 pares! */
GREG(217,{
init(root,H){
const PAIRS=[["FELIZ","ALEGRE"],["RÁPIDO","VELOZ"],["CASA","LAR"],["COMEÇAR","INICIAR"],["BONITO","BELO"],["FIM","TÉRMINO"]];
let over=false,left=[],right=[],selL=-1,matched=0,err=0;
const hud=H.hud(root,[["pr","PARES","0/6"],["er","ERROS","0/4"]]);
const say=H.msg(root,"Clique numa palavra da esquerda e na sua <b>sinônima</b> da direita! 6 pares, 4 erros no máx.");
const box=H.el("div","g-row",null,root);
const lc=H.el("div","g-col",null,box),rc=H.el("div","g-col",null,box);
left=PAIRS.map((p,i)=>i).sort(()=>Math.random()-.5);
right=PAIRS.map((p,i)=>i).sort(()=>Math.random()-.5);
function paint(){
  lc.innerHTML="";rc.innerHTML="";
  left.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",lc);return;}
    const b=H.el("button","g-chip"+(selL===i?" hot":""),PAIRS[i][0],lc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{selL=i;H.sfx("tick");paint();});
  });
  right.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",rc);return;}
    const b=H.el("button","g-chip",PAIRS[i][1],rc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||selL<0)return;
      if(i===selL){
        left[left.indexOf(selL)]=-1;right[right.indexOf(i)]=-1;
        selL=-1;matched++;H.score(matched*50);hud.set("pr",matched+"/6");H.sfx("ok");
        if(matched>=6){over=true;return H.done({win:true,score:400,title:"Vocabulário rico!",sub:"6 pares de sinônimos!"});}
      }else{
        err++;hud.set("er",err+"/4");H.sfx("bad");selL=-1;
        if(err>=4){over=true;return H.done({win:false,score:matched*50,title:"Confusão!",sub:"4 erros. Leia com calma!"});}
      }
      paint();
    });
  });
}
paint();
}});
