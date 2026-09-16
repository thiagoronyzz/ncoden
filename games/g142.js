/* NCODE N · 142 Posto de Gasolina — $100 sem fila brava */
GREG(142,{
init(root,H){
let over=false,pumps=[null,null],snack=5,cash=0,lost=0,spawn=1,time=150,nid=0;
const hud=H.hud(root,[["cx","CAIXA","$0/100"],["sn","LANCHES",5],["fl","FUGIRAM","0/3"]]);
const say=H.msg(root,"Carro na bomba? Clique para <b>⛽ abastecer</b> (3s). 🛢️ = clique 2ª vez para o <b>óleo</b>. 🍫 clientes compram lanche sozinhos (se houver)!");
const box=H.el("div","g-col",null,root);
const pbox=H.el("div","g-row",null,box);
function paint(){
  hud.set("cx","$"+cash+"/100");hud.set("sn",snack);
  pbox.innerHTML="";
  pumps.forEach((p,i)=>{
    const b=H.el("button","g-cell"+(p?" hot":""),null,pbox);
    b.style.minWidth="140px";b.style.fontSize="14px";
    if(!p)b.innerHTML="⛽ bomba "+(i+1)+"<br>livre";
    else b.innerHTML="🚗 "+(p.fuel>0?"abastecendo "+Math.ceil(p.fuel)+"s":p.oil?"🛢️ ÓLEO? clique!":"✅ pronto, clique!")+"<br>⏳"+Math.ceil(p.p);
    b.addEventListener("click",()=>act(i));
  });
}
function act(i){
  if(over)return;
  const p=pumps[i];
  if(!p||p.fuel>0)return;
  if(!p.done){p.fuel=3;p.done=true;H.sfx("tick");paint();return;}
  if(p.oil){p.oil=false;cash+=6;H.sfx("ok");say("🛢️ Óleo verificado! +$6");paint();return;}
  pumps[i]=null;cash+=12;H.score(cash);H.sfx("ok");paint();
  if(cash>=100){over=true;return H.done({win:true,score:cash+50,title:"Posto premiado!",sub:"$"+cash+" de pista e conveniência."});}
}
paint();
H.btn(root,"🍫 Repor lanches (+4)",()=>{
  if(over||snack>=8)return;
  snack=Math.min(8,snack+4);H.sfx("tick");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+"/100."});}
  spawn-=dt;
  if(spawn<=0){
    spawn=5;
    const f=pumps.findIndex(q=>!q);
    if(f>=0)pumps[f]={fuel:0,done:false,oil:Math.random()<.4,p:24,snack:Math.random()<.5};
    else{lost++;hud.set("fl",lost+"/3");H.sfx("bad");
      if(lost>=3){over=true;return H.done({win:false,score:cash,title:"Fila dobrou a esquina!",sub:"3 carros desistiram. Atenda mais rápido!"});}}
    paint();
  }
  pumps.forEach((p,i)=>{
    if(!p)return;
    if(p.fuel>0){p.fuel-=dt;if(p.fuel<=0)paint();}
    p.p-=dt;
    if(p.p<=0){
      if(p.snack&&snack>0){snack--;cash+=5;say("🍫 +$5 de lanche!");}
      pumps[i]=null;lost++;hud.set("fl",lost+"/3");H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:cash,title:"Fila dobrou a esquina!",sub:"3 desistências."});}
    }
  });
  if(Math.random()<dt*2&&pumps.some(Boolean))paint();
});
}});
