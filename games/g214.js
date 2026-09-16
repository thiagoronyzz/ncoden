/* NCODE N · 214 Forca Clássica — salve o boneco! */
GREG(214,{
init(root,H){
const WORDS=["GATO","CASA","LIVRO","JANELA","ESCOLA","AMIGO","CACHORRO","FLORESTA","JANELA","TREM","PRAIA","MUSICA"];
let over=false,word="",used=[],err=0,wi=0,score=0;
const hud=H.hud(root,[["pv","PALAVRA","1/3"],["er","ERROS","0/6"]]);
const say=H.msg(root,"Adivinhe 3 palavras! 6 erros por palavra enforcam. Teclado ou botões.");
const box=H.el("div","g-col",null,root);
const wd=H.el("div","g-msg","",box);
const o=H.cvs(root,300,260),x=o.x;
function pick(){
  word=WORDS[Math.floor(Math.random()*WORDS.length)];
  used=[];err=0;
  hud.set("pv",(wi+1)+"/3");
  paint();
}
function paint(){
  hud.set("er",err+"/6");
  wd.innerHTML="<b style='font-size:26px;letter-spacing:6px'>"+word.split("").map(l=>used.includes(l)?l:"_").join("")+"</b><br>usadas: "+(used.join(" ")||"—");
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=5;
  x.beginPath();x.moveTo(60,240);x.lineTo(60,20);x.lineTo(180,20);x.lineTo(180,50);x.stroke();
  x.lineWidth=4;
  const parts=[
    ()=>{x.beginPath();x.arc(180,75,25,0,7);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,100);x.lineTo(180,170);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,120);x.lineTo(140,150);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,120);x.lineTo(220,150);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,170);x.lineTo(145,220);x.stroke();},
    ()=>{x.beginPath();x.moveTo(180,170);x.lineTo(215,220);x.stroke();}
  ];
  for(let i=0;i<err;i++)parts[i]();
  if(word.split("").every(l=>used.includes(l))){
    wi++;score+=100;H.score(score);H.sfx("ok");
    if(wi>=3){over=true;return H.done({win:true,score:score+100,title:"Forca vencida!",sub:"3 palavras sem enforcar ninguém."});}
    say("Palavra certa! Próxima…");pick();return;
  }
}
function guess(l){
  if(over||used.includes(l))return;
  used.push(l);
  if(!word.includes(l)){err++;H.sfx("bad");}
  else H.sfx("tick");
  if(err>=6){over=true;paint();
    return H.done({win:false,score,title:"Enforcou!",sub:"A palavra era "+word+". Vogais primeiro!"});
  }
  paint();
}
pick();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);if(m)guess(m[1]);});
["ABCDEF","GHIJLM","NOPQRS","TUVXZ"].forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="30px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>guess(ch));
  });
});
}});
