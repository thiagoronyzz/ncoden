/* NCODE N · 223 Prefixo — 7/8! */
GREG(223,{
init(root,H){
const Q=[
 {r:"FAZER",o:["RE","DES","IN","TRANS"],ok:[0,1]},
 {r:"POR",o:["RE","PRO","A","EM"],ok:[0,1]},
 {r:"DIZER",o:["PRE","DES","RE","SOB"],ok:[0,1]},
 {r:"LER",o:["RE","DES","PRE","TRI"],ok:[0]},
 {r:"ESCREVER",o:["RE","SUB","DES","IN"],ok:[0,1]},
 {r:"CONTAR",o:["RE","DES","IN","SOB"],ok:[0,1]},
 {r:"NASCER",o:["RE","DES","PRE","A"],ok:[0]},
 {r:"CORTAR",o:["RE","DES","IN","SOB"],ok:[0]}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Escolha um <b>prefixo que forme palavra válida</b>! Pode haver mais de um certo. 7/8 vence.");
const box=H.el("div","g-col",null,root);
function paint(){
  if(over||qi>=Q.length)return;
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","___ + <b>"+Q[qi].r+"</b>",box);
  const row=H.el("div","g-row",null,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op+"…",row);
    b.addEventListener("click",()=>{
      if(over)return;
      if(Q[qi].ok.includes(i)){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");
        say("✔"+op.toLowerCase()+Q[qi].r.toLowerCase()+" existe!");
      }else{H.sfx("bad");say("✕ Não existe essa palavra!");}
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Prefixador!",sub:(score/50)+"/8 palavras."});
        return H.done({win:false,score,title:"Quase!",sub:(score/50)+"/8 (precisa 7)."});
      }
      H.after(700,paint);
    });
  });
}
paint();
}});
