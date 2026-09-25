/* NCODE N · 219 Corrente de Palavras — 10 elos! */
GREG(219,{
init(root,H){
let over=false,chain=["CASA"],buf="",time=20,score=0;
const hud=H.hud(root,[["el","ELOS","1/10"],["tp","PRAZO",20],["lt","LETRA","A"]]);
const say=H.msg(root,"Cada palavra começa com a <b>última letra</b> da anterior (4+ letras, sem repetir)! 10 elos, 20s cada.");
const box=H.el("div","g-col",null,root);
const ch=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  const last=chain[chain.length-1];
  hud.set("el",chain.length+"/10");hud.set("lt",last[last.length-1]);
  ch.innerHTML=""+chain.join(" → ");
  cur.innerHTML=""+(buf||"_");
}
function feed(chr){if(!over){buf+=chr;H.sfx("tick");paint();}}
function back(){buf=buf.slice(0,-1);paint();}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function ok(){
  if(over||!buf)return;
  const b=norm(buf),last=norm(chain[chain.length-1]);
  if(b.length>=4&&b[0]===last[last.length-1]&&!chain.includes(b)){
    chain.push(b);score+=40;H.score(score);buf="";time=20;H.sfx("ok");paint();
    if(chain.length>=10){over=true;return H.done({win:true,score:score+100,title:"Corrente forte!",sub:"10 elos sem quebrar."});}
  }else{H.sfx("bad");say("✕ Comece com "+last[last.length-1]+", 4+ letras, sem repetir!");buf="";paint();}
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
H.btn(row,"",back,false);
H.btn(row,"✔ Elo!",ok,true);
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Elo perdido!",sub:chain.length+"/10 elos."});}
});
}});
