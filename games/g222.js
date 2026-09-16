/* NCODE N · 222 Homófono — 7/8! */
GREG(222,{
init(root,H){
const Q=[
 {s:"Ele ___ o carro na oficina.",o:["consertou","concertou"],a:0,h:"consertar=reparar"},
 {s:"A orquestra deu um lindo ___.",o:["conserto","concerto"],a:1,h:"concerto=música"},
 {s:"O remédio ___ efeito rápido.",o:["tem","têm"],a:0,h:"ele tem / eles têm"},
 {s:"Eles ___ muitos livros.",o:["tem","têm"],a:1,h:"eles têm"},
 {s:"Vou ___ praia amanhã.",o:["a","à","há"],a:1,h:"a + a = à (lugar)"},
 {s:"___ dois anos não o vejo.",o:["A","À","Há"],a:2,h:"há = tempo passado"},
 {s:"Ela ___ a porta com força.",o:["serrou","cerrou"],a:1,h:"cerrar=fechar"},
 {s:"O carpinteiro ___ a madeira.",o:["serrou","cerrou"],a:0,h:"serrar=cortar"}
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[["qs","QUESTÃO","1/8"],["pt","PONTOS",0]]);
const say=H.msg(root,"Mesmo som, grafia diferente! Escolha a certa. 7/8 vence.");
const box=H.el("div","g-col",null,root);
function paint(){
  if(over||qi>=Q.length)return;
  hud.set("qs",(qi+1)+"/8");
  box.innerHTML="";
  H.el("div","g-msg","📝 "+Q[qi].s,box);
  Q[qi].o.forEach((op,i)=>{
    const b=H.el("button","g-btn ghost",op,box);
    b.addEventListener("click",()=>{
      if(over)return;
      if(i===Q[qi].a){score+=50;H.score(score);hud.set("pt",score);H.sfx("ok");say("✅ "+Q[qi].h);}
      else{H.sfx("bad");say("❌ "+Q[qi].h);}
      qi++;
      if(qi>=Q.length){
        over=true;
        if(score>=350)return H.done({win:true,score:score+50,title:"Ouvido afiado!",sub:(score/50)+"/8 homófonos."});
        return H.done({win:false,score,title:"Quase lá!",sub:(score/50)+"/8 (precisa 7)."});
      }
      H.after(650,paint);
      box.innerHTML=H.el("div","g-msg","…",box).innerHTML;
    });
  });
}
paint();
}});
