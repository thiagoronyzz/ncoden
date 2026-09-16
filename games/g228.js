/* NCODE N · 228 Tabu de Palavras — 7/8! */
GREG(228,{
init(root,H){
const Q=[
 {d:"amarelo, azedo, fruta, suco",tab:["LIMÃO","AZEDO","FRUTA"],o:["LIMÃO","LARANJA","ABACAXI","MARACUJÁ"],a:0},
 {d:"voa, bico, penas, canta",tab:["PASSARINHO","VOAR","BICO"],o:["AVIÃO","PASSARINHO","MORCEGO","BORBOLETA"],a:1},
 {d:"frio, branco, derrete, verão",tab:["GELO","FRIO","ÁGUA"],o:["NEVE","GELO","GRANIZO","GEADA"],a:1},
 {d:"redondo, quica, gol, time",tab:["BOLA","FUTEBOL","GOL"],o:["BOLA","PIÃO","PETECA","DADO"],a:0},
 {d:"late, osso, melhor amigo",tab:["CACHORRO","LATIR","OSSO"],o:["GATO","CACHORRO","LOBO","RAPOSA"],a:1},
 {d:"páginas, história, ler, capa",tab:["LIVRO","LER","PÁGINA"],o:["REVISTA","JORNAL","LIVRO","CADERNO"],a:2},
 {d:"quente, areia, mar, protetor",tab:["PRAIA","MAR","AREIA"],o:["DESERTO","PRAIA","PISCINA","CACHOEIRA"],a:1},
 {d:"apita, trilhos, vagão, estação",tab:["TREM","TRILHO","VAGÃO"],o:["METRÔ","TREM","ÔNIBUS","BONDE"],a:1}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Adivinhe pela descrição — as palavras <b>tabu</b> não puderam ser usadas! 7/8 vence.");
const box=H.el("div","g-col",null,root);
function paint(){
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","🗣️ \""+Q[qi].d+"\"<br>🚫 tabu: "+Q[qi].tab.join(", "),box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op,box);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");}
      else H.sfx("bad");
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Mestre do Tabu!",sub:(score/50)+"/8 adivinhações."});
        return H.done({win:false,score,title:"Mímica falhou!",sub:(score/50)+"/8 (precisa 7)."});
      }
      paint();
    });
  });
}
paint();
}});
