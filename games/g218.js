/* NCODE N · 218 Abelha Soletrando — 6 palavras soletradas! */
GREG(218,{
init(root,H){
const WORDS=["ABELHA","MEL","COLMEIA","FLOR","ZUMBIDO","CERA"];
let over=false,wi=0,buf="",show=3,strikes=0,score=0;
const hud=H.hud(root,[["pv","PALAVRA","1/6"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Decore a palavra (3s), depois <b>soletre letra por letra</b>! 3 erros no total = fim.");
const box=H.el("div","g-col",null,root);
const wd=H.el("div","g-msg","",box);
function paint(){
  hud.set("pv",(wi+1)+"/6");
  if(show>0)wd.innerHTML="Decore: <b style='font-size:26px'>"+WORDS[wi]+"</b> ("+Math.ceil(show)+"s)";
  else wd.innerHTML="Soletre: <b style='font-size:26px'>"+buf+"</b> ("+buf.length+"/"+WORDS[wi].length+")";
}
function feed(ch){
  if(over||show>0)return;
  const want=WORDS[wi][buf.length];
  if(ch===want){
    buf+=ch;H.sfx("tick");
    if(buf.length>=WORDS[wi].length){
      wi++;score+=60;H.score(score);buf="";show=3;H.sfx("ok");
      if(wi>=WORDS.length){over=true;return H.done({win:true,score:score+100,title:"Abelha rainha!",sub:"6 palavras soletradas de cor."});}
      say("Certa! Decore a próxima…");
    }
  }else{
    strikes++;hud.set("er",strikes+"/3");H.sfx("bad");
    if(strikes>=3){over=true;return H.done({win:false,score,title:"Enxame confuso!",sub:"3 erros de soletração."});}
    say("✕ Letra errada! ("+strikes+"/3) Recomece a palavra.");
    buf="";
  }
  paint();
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)feed(m[1]);});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>feed(ch));
  });
});
paint();
H.loop(dt=>{
  if(over)return;
  if(show>0){show-=dt;if(Math.random()<dt*4)paint();}
});
}});
