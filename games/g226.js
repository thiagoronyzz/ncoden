/* NCODE N · 226 Matemática de Letras — A=1…Z=26! */
GREG(226,{
init(root,H){
const V=l=>"ABCDEFGHIJKLMNOPQRSTUVWXYZ".indexOf(l)+1;
function val(w){return w.split("").reduce((a,l)=>a+V(l),0);}
const Q=[
 {q:"C + A",a:()=>V("C")+V("A")},
 {q:"GATO",a:()=>val("GATO")},
 {q:"SOL − LUA",a:()=>val("SOL")-val("LUA")},
 {q:"BOLA × 2",a:()=>val("BOLA")*2},
 {q:"MAR + RIO",a:()=>val("MAR")+val("RIO")},
 {q:"CÉU (C+E+U)",a:()=>V("C")+V("E")+V("U")},
 {q:"PAZ − DIA",a:()=>val("PAZ")-val("DIA")},
 {q:"FESTA ÷ 5",a:()=>Math.round(val("FESTA")/5)}
];
let over=false,qi=0,score=0,buf="";
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"A=1, B=2 … Z=26 (sem acento). Some as letras e responda! 6/8 vence.");
const box=H.el("div","g-col",null,root);
const qe=H.el("div","g-msg","",box);
const cur=H.el("div","g-msg","",box);
function paint(){
  hud.set("qs",(qi+1)+"/8");
  qe.innerHTML="<b>"+Q[qi].q+"</b> = ?";
  cur.innerHTML=""+(buf||"_");
}
paint();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  const m=/^Digit(\d)$/.exec(c);if(m){buf+=m[1];H.sfx("tick");paint();}
  if(c==="Backspace"){buf=buf.slice(0,-1);paint();}
  if(c==="Enter")ok();});
const nrow=H.el("div","g-row",null,box);
"1234567890".split("").forEach(n=>{
  const b=H.el("button","g-btn ghost",n,nrow);
  b.style.minWidth="36px";
  b.addEventListener("click",()=>{if(!over){buf+=n;H.sfx("tick");paint();}});
});
const row=H.el("div","g-row",null,box);
H.btn(row,"APAGAR",()=>{if(over)return;buf=buf.slice(0,-1);paint();},false);
H.btn(row,"✔ Responder",ok,true);
function ok(){
  if(over||!buf)return;
  if(parseInt(buf,10)===Q[qi].a()){
    score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");
  }else H.sfx("bad");
  qi++;buf="";
  if(qi>=Q.length){
    over=true;
    if(score>=300)return H.done({win:true,score:score+50,title:"Calculista verbal!",sub:(score/50)+"/8 contas."});
    return H.done({win:false,score,title:"Conta errada!",sub:(score/50)+"/8 (precisa 6)."});
  }
  paint();
}
}});
