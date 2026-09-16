/* NCODE N · 212 Anagrama — 10 palavras, 7 letras! */
GREG(212,{
init(root,H){
const RACK=["A","A","C","E","L","R","S"];
const DICT=["CASA","ESCALA","CARA","LARA","CELA","ARCA","CALA","RALA","LACA","SALA","AREA","ACESA","LASCA","ARCAS","RALAS","CALAS","CARAS","LACAS"];
let over=false,found=[],buf="",used=[],time=150;
const hud=H.hud(root,[["pv","PALAVRAS","0/10"],["tp","TEMPO",150],["pt","PONTOS",0]]);
const say=H.msg(root,"Toque as letras (ou digite) para formar palavras (3+ letras)! 10 diferentes em 150s.");
const box=H.el("div","g-col",null,root);
const cur=H.el("div","g-msg","",box);
const rk=H.el("div","g-row",null,box);
const fd=H.el("div","g-msg","",box);
let score=0;
function paint(){
  cur.innerHTML="⌨️ "+(buf||"_");
  rk.innerHTML="";
  RACK.forEach((l,i)=>{
    const b=H.el("button","g-btn"+(used.includes(i)?"":" ghost"),l,rk);
    b.style.minWidth="40px";b.style.fontSize="18px";
    if(used.includes(i))b.disabled=true;
    b.addEventListener("click",()=>pick(i));
  });
  fd.innerHTML="📖 "+(found.join(" · ")||"nada ainda…");
}
function pick(i){
  if(over||used.includes(i))return;
  used.push(i);buf+=RACK[i];H.sfx("tick");paint();
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(!m)return;
  const i=RACK.findIndex((l,j)=>l===m[1]&&!used.includes(j));
  if(i>=0)pick(i);});
paint();
const row=H.el("div","g-row",null,box);
H.btn(row,"⌫",()=>{if(!over){used.pop();buf=buf.slice(0,-1);paint();}},false);
H.btn(row,"🔀",()=>{if(!over){used=[];buf="";paint();}},false);
H.btn(row,"✅ Enviar",()=>{
  if(over||!buf)return;
  if(buf.length>=3&&DICT.includes(buf)&&!found.includes(buf)){
    found.push(buf);score+=buf.length*10;H.score(score);
    hud.set("pv",found.length+"/10");hud.set("pt",score);H.sfx("ok");
    if(found.length>=10){over=true;return H.done({win:true,score:score+100,title:"Anagramista!",sub:"10 palavras com 7 letras."});}
  }else H.sfx("bad");
  used=[];buf="";paint();
},true);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Tempo!",sub:"Só "+found.length+"/10. Tente ESCALA, CASA, CARA…"});}
});
}});
