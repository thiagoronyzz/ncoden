/* NCODE N · 104 Jornal da Manhã — monte a manchete sem erros */
GREG(104,{
init(root,H){
const EDS=[
 {w:["CIDADE","INAUGURA","NOVO","PARQUE","CENTRAL"],bad:["PARQEU","INAUGURO"]},
 {w:["TIME","LOCAL","VENCE","FINAL","HISTÓRICA"],bad:["VENCCE","HISTORIA"]},
 {w:["CHUVA","FORTE","ATINGE","SERRA","HOJE"],bad:["XUVA","ATINJE"]}
];
let e=0,order=[],left=[],over=false,time=45,strikes=0,done=false;
const hud=H.hud(root,[["ed","EDIÇÃO","1/3"],["tp","TEMPO",45],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique as palavras <b>na ordem certa</b>. Palavras com erro de grafia são isca — não toque!");
const line=H.el("div","g-msg","—",root);
const pool=H.el("div","g-row",null,root);
let sc=0;
time=45;strikes=0;
function build(){
  order=[];strikes=0;time=45;
  left=EDS[e].w.concat(EDS[e].bad).sort(()=>Math.random()-.5);
  hud.set("ed",(e+1)+"/3");
  paint();
}
function paint(){
  line.innerHTML=order.length?order.join(" "):"—";
  pool.innerHTML="";
  left.forEach((w,i)=>{
    const b=H.el("button","g-chip",w,pool);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>pick(i));
  });
}
function pick(i){
  if(over||done)return;
  const w=left[i];
  if(EDS[e].w[order.length]===w){
    order.push(w);left.splice(i,1);H.sfx("tick");paint();
    if(order.length===EDS[e].w.length){
      sc+=100+Math.floor(time);H.score(sc);hud.set("sc",sc);H.sfx("ok");
      e++;
      if(e>=EDS.length){over=true;return H.done({win:true,score:sc+100,title:"Edição fechada!",sub:"3 manchetes sem um erro de grafia."});}
      say("Manchete pronta! Próxima edição…");H.after(600,build);
    }
  }else{
    strikes++;H.sfx("bad");
    say("✕ Erro ("+strikes+"/3)! "+(EDS[e].bad.includes(w)?"Essa palavra tem grafia errada.":"Fora de ordem."));
    if(strikes>=3){over=true;return H.done({win:false,score:sc,title:"Jornal recolhido!",sub:"3 erros na edição "+(e+1)+". Leia com calma!"});}
  }
}
build();
H.loop(dt=>{
  if(over||done)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Deadline estourado!",sub:"A gráfica não espera. Faltou a edição "+(e+1)+"."});}
});
}});
