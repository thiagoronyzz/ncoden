/* NCODE N · 143 Consultório Dentário — 8 sorrisos */
GREG(143,{
init(root,H){
const TR={limp:"🪥 Limpar",obt:"🦷 Obturar",ext:"🩹 Extrair"};
let over=false,queue=[],tool="limp",prog=null,served=0,pain=0,spawn=1,nid=0;
const hud=H.hud(root,[["sm","SORRISOS","0/8"],["ai","DOR","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha a <b>ferramenta certa</b> para o caso (🪥 tártaro · 🦷 cárie · 🩹 dente mole) e SEGURE <b>tratar</b> até encher!");
const box=H.el("div","g-col",null,root);
const qbox=H.el("div","g-col",null,box);
const pbox=H.el("div","g-msg","cadeira livre…",box);
let sc=0,hold=false,cur=null;
function paint(){
  hud.set("sm",served+"/8");
  qbox.innerHTML="";
  queue.forEach(c=>{
    const b=H.el("button","g-chip","🧍 "+TR[c.k].split(" ")[0]+" "+c.k+" ⏳"+Math.ceil(c.p),qbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||cur)return;
      cur=c;queue=queue.filter(q=>q.id!==c.id);
      prog=0;H.sfx("tick");paint();
      say("Na cadeira: "+c.k+". Ferramenta certa + SEGURE tratar!");
    });
  });
  if(!queue.length&&!cur)H.el("div","g-chip","sala de espera vazia…",qbox);
}
paint();
const trow=H.el("div","g-row",null,box);
Object.keys(TR).forEach(k=>{
  H.btn(trow,TR[k],()=>{tool=k;H.sfx("tick");say("Ferramenta: "+TR[k]);},k===tool);
});
const tb=H.el("button","g-btn","🦷 SEGURE PARA TRATAR",box);
tb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
tb.addEventListener("pointerup",()=>hold=false);
tb.addEventListener("pointerleave",()=>hold=false);
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&queue.length<3&&served+queue.length+(cur?1:0)<10){
    spawn=5;
    queue.push({id:nid++,k:Object.keys(TR)[Math.floor(Math.random()*3)],p:30});
    paint();
  }
  for(let i=queue.length-1;i>=0;i--){
    queue[i].p-=dt;
    if(queue[i].p<=0){queue.splice(i,1);pain++;hud.set("ai",pain+"/3");H.sfx("bad");paint();say("🚶 Paciente foi embora com dor! ("+pain+"/3)");
      if(pain>=3){over=true;return H.done({win:false,score:sc,title:"Sala vazia!",sub:"3 pacientes perdidos. Atenda mais rápido!"});}}
  }
  if(cur&&hold){
    if(tool!==cur.k){
      hold=false;pain++;hud.set("ai",pain+"/3");H.sfx("bad");
      say("😱 Ferramenta errada! ("+pain+"/3)");
      if(pain>=3){over=true;return H.done({win:false,score:sc,title:"Consultório interditado!",sub:"3 erros de ferramenta."});}
    }else{
      prog+=dt/2.5;
      pbox.innerHTML="🦷 tratando "+cur.k+": "+Math.floor(prog*100)+"%";
      if(prog>=1){
        cur=null;prog=null;served++;sc+=40;H.score(sc);
        hud.set("sm",served+"/8");hud.set("sc",sc);H.sfx("ok");
        pbox.innerHTML="cadeira livre…";paint();
        if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Sorrisos perfeitos!",sub:"8 pacientes tratados sem dor."});}
      }
    }
  }
});
}});
