/* NCODE N · 216 Rima Rápida — 6 rimas em 30s! */
GREG(216,{
init(root,H){
const SETS=[
 {w:"AMOR",ok:["DOR","FLOR","CALOR","VALOR","SABOR","HUMOR","CLAMOR","TORPOR","ODOR","RIGOR","TAMBOR","VIGOR"]},
 {w:"CASA",ok:["ASA","BRASA","ATRASA","VAZA","ARRAZA","EXTRAVASA"]},
 {w:"MAR",ok:["PAR","LUAR","OLHAR","JANTAR","CANTAR","SONHAR","AMAR","LUGAR"]}
];
let over=false,si=0,found=[],buf="",time=30,score=0;
const hud=H.hud(root,[["rm","RIMAS","0/6"],["tp","TEMPO",30],["al","ALVO","AMOR"]]);
const say=H.msg(root,"Digite palavras que rimam com o alvo! 6 rimas em 30s. Troque de alvo quando quiser.");
const box=H.el("div","g-col",null,root);
const cur=H.el("div","g-msg","",box);
const fd=H.el("div","g-msg","",box);
function paint(){
  hud.set("al",SETS[si].w);
  cur.innerHTML="⌨️ "+(buf||"_");
  fd.innerHTML="📖 "+(found.join(" · ")||"—");
}
function feed(ch){
  if(over)return;
  buf+=ch;H.sfx("tick");paint();
}
function back(){buf=buf.slice(0,-1);paint();}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function ok(){
  if(over||!buf)return;
  const b=norm(buf);
  if(b.length>=2&&SETS[si].ok.includes(b)&&!found.includes(b)){
    found.push(b);score+=50;H.score(score);
    hud.set("rm",found.length+"/6");H.sfx("ok");
    if(found.length>=6){over=true;return H.done({win:true,score:score+Math.floor(time)*5+100,title:"Poeta veloz!",sub:"6 rimas em "+(30-Math.ceil(time))+"s!"});}
  }else H.sfx("bad");
  buf="";paint();
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)feed(m[1]);
  if(c==="Backspace")back();if(c==="Enter")ok();});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>feed(ch));
  });
});
const row=H.el("div","g-row",null,box);
H.btn(row,"⌫",back,false);
H.btn(row,"✅ Rima!",ok,true);
H.btn(row,"🎯 Trocar alvo",()=>{if(!over){si=(si+1)%SETS.length;paint();H.sfx("tick");}},false);
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Tempo!",sub:"Só "+found.length+"/6 rimas. Para AMOR: DOR, FLOR, CALOR…"});}
});
}});
