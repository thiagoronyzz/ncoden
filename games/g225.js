/* NCODE N · 225 Metade do Ditado — junte 6 palavras! */
GREG(225,{
init(root,H){
const WORDS=[["CA","SA"],["LI","VRO"],["GA","TO"],["JA","NELA"],["ES","COLA"],["FLO","RESTA"]];
let over=false,left=[],right=[],selL=-1,matched=0,err=0;
const hud=H.hud(root,[["pr","PARES","0/6"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Junte a <b>primeira metade</b> com a <b>segunda</b>! 6 palavras, 3 erros no máx.");
const box=H.el("div","g-row",null,root);
const lc=H.el("div","g-col",null,box),rc=H.el("div","g-col",null,box);
left=WORDS.map((w,i)=>i).sort(()=>Math.random()-.5);
right=WORDS.map((w,i)=>i).sort(()=>Math.random()-.5);
function paint(){
  lc.innerHTML="";rc.innerHTML="";
  left.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",lc);return;}
    const b=H.el("button","g-chip"+(selL===i?" hot":""),WORDS[i][0]+"…",lc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{selL=i;H.sfx("tick");paint();});
  });
  right.forEach(i=>{
    if(i<0){H.el("div","g-chip","✓",rc);return;}
    const b=H.el("button","g-chip","…"+WORDS[i][1],rc);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||selL<0)return;
      if(i===selL){
        left[left.indexOf(selL)]=-1;right[right.indexOf(i)]=-1;
        selL=-1;matched++;H.score(matched*50);hud.set("pr",matched+"/6");H.sfx("ok");
        if(matched>=6){over=true;return H.done({win:true,score:400,title:"Ditado perfeito!",sub:"6 palavras remontadas."});}
      }else{
        err++;hud.set("er",err+"/3");H.sfx("bad");selL=-1;
        if(err>=3){over=true;return H.done({win:false,score:matched*50,title:"Ditado borrado!",sub:"3 erros."});}
      }
      paint();
    });
  });
}
paint();
}});
