/* NCODE N · 220 Complete a Frase — 7/8! */
GREG(220,{
init(root,H){
const Q=[
 {s:"O gato ___ no sofá.",o:["dorme","dormem","dormir","dormiu ontem à"],a:0},
 {s:"Ela ___ um livro ontem.",o:["ler","leu","lêem","lido"],a:1},
 {s:"Nós ___ ao parque amanhã.",o:["vamos","vão","ir","fomos"],a:0},
 {s:"O plural de 'cidadão' é ___.",o:["cidadãos","cidadões","cidadães","cidadans"],a:0},
 {s:"Que horas ___? ",o:["é","são","está","tem"],a:1},
 {s:"Ele é ___ aluno da turma.",o:["o melhor","o mais melhor","mais bom","o bom maior"],a:0},
 {s:"___ muita gente na festa.",o:["Havia","Haviam","Hão","Haveram"],a:0},
 {s:"Vou ___ praia no verão.",o:["à","a","para a","na"],a:0}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Escolha a palavra certa! 7/8 para vencer.");
const box=H.el("div","g-col",null,root);
function paint(){
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","📝 "+Q[qi].s,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op,box);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");}
      else H.sfx("bad");
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Gramático!",sub:(score/50)+"/8 frases perfeitas."});
        return H.done({win:false,score,title:"Revisão pendente!",sub:(score/50)+"/8 (precisa 7)."});
      }
      paint();
    });
  });
}
paint();
}});
