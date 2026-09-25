/* NCODE N · 131 Barbearia — 8 cortes, gorjeta por precisão */
GREG(131,{
init(root,H){
let over=false,hair=100,target={a:40,b:55},cutting=false,served=0,tips=0,pat=20;
const hud=H.hud(root,[["ct","CORTES","0/8"],["gb","GORJETAS","$0"],["pc","PACIÊNCIA",20]]);
const say=H.msg(root,"SEGURE <b> Cortar</b> para baixar o cabelo e SOLTE na faixa verde do pedido. Rápido e preciso = gorjeta!");
const o=H.cvs(root,440,300),x=o.x;
function newClient(){
  const a=15+Math.floor(Math.random()*60);
  target={a,b:Math.min(95,a+12+Math.floor(Math.random()*8))};
  hair=100;pat=20;cutting=false;
  say("Pedido: faixa verde ("+target.a+"–"+target.b+"). Segure para cortar!");
}
newClient();
const btn=H.el("button","g-btn","SEGURE PARA CORTAR",root);
function dn(e){if(e)e.preventDefault();if(!over)cutting=true;H.sfx("tick");}
function up(){cutting=false;}
btn.addEventListener("pointerdown",dn);
btn.addEventListener("pointerup",up);
btn.addEventListener("pointerleave",up);
btn.addEventListener("pointercancel",up);
const kb=H.keys();
kb.on((c,d)=>{if(c==="Space")cutting=d&&!over;});
H.loop(dt=>{
  if(over)return;
  pat-=dt;hud.set("pc",Math.max(0,Math.ceil(pat)));
  if(pat<=0){over=true;return H.done({win:false,score:tips,title:"Cadeira vazia!",sub:"Cliente cansou de esperar. Corte sem medo!"});}
  if(cutting&&hair>0){
    const before=hair;
    hair=Math.max(0,hair-38*dt);
    if(before>0&&hair<=0){H.sfx("bad");}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(60,40,o.W-120,60);
  x.fillStyle=H.C.ok;
  x.fillRect(60+(o.W-120)*target.a/100,40,(o.W-120)*(target.b-target.a)/100,60);
  x.fillStyle=H.C.ink;
  x.fillRect(60+(o.W-120)*hair/100-3,30,6,80);
  x.font="60px serif";
  x.fillText("i:suit",o.W/2-30,200);
  x.fillStyle=H.C.ink;x.font="13px 'Space Mono',monospace";
  x.fillText("cabelo: "+Math.floor(hair)+"  ·  alvo: "+target.a+"–"+target.b,60,240);
  x.fillText("paciência: "+Math.ceil(pat)+"s",60,260);
});
H.btn(root,"✔ Finalizar corte",()=>{
  if(over)return;
  const mid=(target.a+target.b)/2;
  const err=Math.abs(hair-mid);
  if(err>(target.b-target.a)/2+6){
    over=true;H.sfx("lose");
    return H.done({win:false,score:tips,title:"Corte torto!",sub:"Fora da faixa pedida. Tente de novo!"});
  }
  const tip=Math.max(1,Math.round(10-err+pat/4));
  tips+=tip;served++;H.score(tips*10+served*20);
  hud.set("ct",served+"/8");hud.set("gb","$"+tips);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:tips*10+160+100,title:"Barbeiro famoso!",sub:"8 cortes e $"+tips+" em gorjetas."});}
  say("+$"+tip+" de gorjeta! Próximo cliente…");
  newClient();
},true);
}});
