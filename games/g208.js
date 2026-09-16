/* NCODE N · 208 Datilografia Jazz — 10 palavras no swing! */
GREG(208,{
init(root,H){
const WORDS=["JAZZ","SWING","BLUES","RITMO","ACORDE","TEMPO","BATIDA","MELODIA","SAMBA","GROOVE"];
let over=false,wi=0,buf="",t=0,dead=8,score=0,err=0;
const hud=H.hud(root,[["pv","PALAVRAS","0/10"],["tp","PRAZO",8],["pt","PONTOS",0]]);
const say=H.msg(root,"Digite a palavra antes do prazo (teclado físico ou botões)! Erro apaga tudo. 10 palavras, 3 furos = fim.");
const box=H.el("div","g-col",null,root);
const wd=H.el("div","g-msg","",box);
function paint(){
  wd.innerHTML="🎷 <b>"+WORDS[wi]+"</b> → "+(buf||"_")+" ("+buf.length+"/"+WORDS[wi].length+")";
}
paint();
const kb=H.keys();
kb.on((c,d,ev)=>{
  if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(m)feed(m[1]);
});
function feed(ch){
  if(over)return;
  const want=WORDS[wi][buf.length];
  if(ch===want){
    buf+=ch;H.sfx("tick");H.beep(400+buf.length*40,.05);
    if(buf.length>=WORDS[wi].length){
      score+=100+Math.floor(dead)*10;H.score(score);
      hud.set("pv",(wi+1)+"/10");hud.set("pt",score);H.sfx("ok");
      wi++;buf="";dead=8;
      if(wi>=WORDS.length){over=true;return H.done({win:true,score:score+100,title:"Datilógrafo jazz!",sub:"10 palavras no swing da máquina."});}
    }
  }else{buf="";H.sfx("bad");say("❌ Errou! Palavra zerada.");}
  paint();
}
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(ch=>{
  // botões só para vogais+comuns? todos, em linhas
});
const rows=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
rows.forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="28px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>feed(ch));
  });
});
H.loop(dt=>{
  if(over)return;
  dead-=dt;hud.set("tp",Math.max(0,Math.ceil(dead)));
  if(dead<=0){
    err++;buf="";dead=8;H.sfx("bad");paint();
    say("⏰ Prazo! ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score,title:"Máquina emperrou!",sub:wi+"/10 palavras."});}
  }
});
}});
