/* NCODE N · 230 Criador de Siglas — 5 siglas viram frases! */
GREG(230,{
init(root,H){
const SIG=["PNG","VASP","FOME","PAZ","LUA"];
let over=false,si=0,words=[],buf="",score=0;
const hud=H.hud(root,[["sg","SIGLA","1/5"],["pv","PALAVRAS","0/3"]]);
const say=H.msg(root,"Para cada letra da sigla, invente uma palavra (3+ letras) começando com ela! 5 siglas.");
const box=H.el("div","g-col",null,root);
const sg=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  hud.set("sg",(si+1)+"/5");hud.set("pv",words.length+"/"+SIG[si].length);
  sg.innerHTML="Sigla: <b style='font-size:24px'>"+SIG[si]+"</b> → "+(words.join(" ")||"…");
  cur.innerHTML="palavra com <b>"+SIG[si][words.length]+"</b>: "+(buf||"_");
}
function feed(ch){if(!over){buf+=ch;H.sfx("tick");paint();}}
function back(){buf=buf.slice(0,-1);paint();}
function norm(s){return s.normalize("NFD").replace(/[\u0300-\u036f]/g,"").toUpperCase();}
function ok(){
  if(over||!buf)return;
  const b=norm(buf),want=SIG[si][words.length];
  if(b.length>=3&&b[0]===want){
    words.push(buf.toUpperCase());buf="";H.sfx("ok");paint();
    if(words.length>=SIG[si].length){
      score+=60;H.score(score);
      si++;words=[];buf="";
      if(si>=SIG.length){over=true;return H.done({win:true,score:score+100,title:"Siglador criativo!",sub:"5 siglas viraram frases."});}
      say("Sigla pronta! Próxima: "+SIG[si]);
    }
    paint();
  }else{H.sfx("bad");say("✕ 3+ letras começando com "+want+"!");buf="";paint();}
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
H.btn(row,"✔ Palavra!",ok,true);
paint();
}});
