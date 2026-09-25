/* NCODE N · 211 Escada de Palavras — 3 escadas letra a letra! */
GREG(211,{
init(root,H){
const LAD=[{a:"SOL",b:"MAR",max:5},{a:"LUA",b:"RUA",max:5},{a:"BOCA",b:"CASA",max:6}];
const DICT=["SOL","SAL","MAL","MAR","LUA","SUA","TUA","RUA","BOCA","BOLA","COLA","COTA","CASA","SUL","MIL","TAL","RATO","COLO","BOLO","CAPA","CASO","MALA","BALA","CALA","FALA","SOAR","SUAR"];
let over=false,li=0,chain=[],buf="";
const hud=H.hud(root,[["esc","ESCADA","1/3"],["ps","PASSOS","0/5"]]);
const say=H.msg(root,"Chegue ao alvo trocando <b>1 letra por vez</b> (palavras válidas)! Digite e confirme.");
const box=H.el("div","g-col",null,root);
const ch=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  const L=LAD[li];
  hud.set("esc",(li+1)+"/3");hud.set("ps",chain.length+"/"+L.max);
  ch.innerHTML=""+L.a+" → … → <b>"+L.b+"</b><br>"+chain.join(" → ");
  cur.innerHTML=""+(buf||"_")+" ("+(buf.length)+"/"+L.a.length+")";
}
function diff1(a,b){
  if(a.length!==b.length)return false;
  let d=0;
  for(let i=0;i<a.length;i++)if(a[i]!==b[i])d++;
  return d===1;
}
function feed(chr){
  if(over)return;
  const L=LAD[li];
  if(buf.length<L.a.length){buf+=chr;H.sfx("tick");paint();}
}
function back(){buf=buf.slice(0,-1);paint();}
function ok(){
  if(over||!buf)return;
  const L=LAD[li];
  const prev=chain.length?chain[chain.length-1]:L.a;
  if(buf.length!==L.a.length||!diff1(prev,buf)||!DICT.includes(buf)){
    H.sfx("bad");say("✕ Precisa: válida + 1 letra diferente de "+prev+"!");buf="";paint();return;
  }
  chain.push(buf);buf="";
  H.sfx("ok");paint();
  if(chain[chain.length-1]===L.b){
    H.score((li+1)*100);
    li++;chain=[];buf="";
    if(li>=LAD.length){over=true;return H.done({win:true,score:400,title:"Escalador de palavras!",sub:"3 escadas letra a letra."});}
    say("Escada pronta! Próxima: "+LAD[li].a+" → "+LAD[li].b);paint();return;
  }
  if(chain.length>=L.max){over=true;return H.done({win:false,score:li*100,title:"Degraus esgotados!",sub:"Escada "+(li+1)+" sem saída. Recomece do topo!"});}
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)feed(m[1]);
  if(c==="Backspace")back();if(c==="Enter")ok();});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(chr=>{
    const b=H.el("button","g-btn ghost",chr,row);
    b.style.minWidth="34px";
    b.addEventListener("click",()=>feed(chr));
  });
});
const row=H.el("div","g-row",null,box);
H.btn(row,"",back,false);
H.btn(row,"✔ Confirmar",ok,true);
paint();
}});
