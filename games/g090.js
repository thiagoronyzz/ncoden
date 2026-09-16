/* NCODE N · 090 Rotação de Culturas — 4 estações no verde */
GREG(90,{
init(root,H){
const CR={trigo:{y:60,n:-20,e:"🌾"},milho:{y:95,n:-35,e:"🌽"},feijao:{y:40,n:25,e:"🫘"},pousio:{y:0,n:12,e:"🟫"}};
const SE=["Primavera","Verão","Outono","Inverno"];
let over=false,se=0,cash=100,N2=[60,60,60,60],plan=["trigo","trigo","trigo","trigo"];
const hud=H.hud(root,[["es","ESTAÇÃO","Primavera"],["cx","CAIXA",100],["sc","META","$800"]]);
const say=H.msg(root,"Escolha a cultura de cada talhão e avance a estação. Solo pobre rende pouco — alterne com feijão e pousio!");
const box=H.el("div","g-col",null,root);
const log=H.el("div","g-msg","Planeje a primeira estação…",root);
function paint(){
  box.innerHTML="";
  for(let f=0;f<4;f++){
    const row=H.el("div","g-row",null,box);
    H.el("span","g-chip","Talhão "+(f+1)+" · N=<b>"+Math.round(N2[f])+"</b>",row);
    Object.keys(CR).forEach(k=>{
      const b=H.el("button","g-chip"+(plan[f]===k?" hot":""),CR[k].e+" "+k,row);
      b.style.cursor="pointer";
      (function(ff,kk){b.addEventListener("click",()=>{plan[ff]=kk;H.sfx("tick");paint();});})(f,k);
    });
  }
  hud.set("es",SE[se]);hud.set("cx",cash);
}
function advance(){
  if(over)return;
  const price=0.85+Math.random()*0.5;
  let gain=0,msg="Colheita de "+SE[se]+" (preço ×"+price.toFixed(2)+"): ";
  for(let f=0;f<4;f++){
    const c=CR[plan[f]];
    const y=Math.round(c.y*(0.4+N2[f]/100)*price);
    gain+=y;
    N2[f]=H.clamp(N2[f]+c.n,0,100);
    msg+=plan[f]+" +$"+y+" · ";
  }
  cash+=gain;log.innerHTML=msg+"<b>Caixa: $"+cash+"</b>";
  H.sfx("ok");se++;
  if(se>=4){
    over=true;H.score(cash);
    if(cash>=800)return H.done({win:true,score:cash,title:"Safra recorde!",sub:"$"+cash+" com solo vivo. Agrônomo nato!"});
    return H.done({win:false,score:cash,title:"Solo esgotado",sub:"$"+cash+" (meta $800). Descanse a terra!"});
  }
  paint();
}
H.btn(root,"🌤️ Avançar estação",advance,true);
paint();
}});
