/* NCODE N · 150 Fazenda de Mel — $100 em 180s */
GREG(150,{
init(root,H){
let over=false,hives=[],empty=2,full=0,honey=0,cash=0,time=180,day=1,price=8,dt2=0;
const hud=H.hud(root,[["cx","CAIXA","$0/100"],["dia","DIA","1 · $8"],["jr","POTES CHEIOS",0],["tp","TEMPO",180]]);
const say=H.msg(root,"Colmeia cheia? Clique para <b>colher</b> (+mel). <b>Envasar</b> vira potes (precisa pote vazio — compre!). <b>Vender</b> usa o preço do dia. Preço muda a cada 30s!");
const box=H.el("div","g-col",null,root);
const hbox=H.el("div","g-row",null,box);
const sbox=H.el("div","g-msg","",box);
hives=new Array(4).fill(0).map(()=>({f:Math.random()*50}));
function paint(){
  hud.set("cx","$"+cash+"/100");hud.set("dia",day+" · $"+price);hud.set("jr",full+" (+"+empty+" vazios)");
  hbox.innerHTML="";
  hives.forEach((h,i)=>{
    const b=H.el("button","g-cell"+(h.f>=100?" good":""),null,hbox);
    b.style.minWidth="90px";b.style.fontSize="13px";
    b.innerHTML="🍯 "+Math.floor(h.f)+"%"+(h.f>=100?"<br>COLHER!":"");
    b.addEventListener("click",()=>{
      if(over||h.f<100)return;
      h.f=0;honey+=3;H.sfx("ok");say("🍯 +3 mel! Envasar precisa de potes.");paint();
    });
  });
  sbox.innerHTML="🍯 mel a granel: "+honey+" · 🏺 cheios: "+full+" · vazios: "+empty;
}
paint();
H.btn(root,"🏺 Comprar 2 potes ($6)",()=>{
  if(over||cash<6)return;
  cash-=6;empty+=2;H.sfx("tick");paint();
},false);
H.btn(root,"🫙 Envasar (3 mel → 1 pote)",()=>{
  if(over||honey<3||empty<=0)return;
  honey-=3;empty--;full++;H.sfx("tick");say("🫙 Pote cheio! Venda no preço do dia ($"+price+").");paint();
},false);
H.btn(root,"💰 Vender 1 pote ($ do dia)",()=>{
  if(over||full<=0)return;
  full--;cash+=price;H.score(cash);H.sfx("ok");paint();
  if(cash>=100){over=true;return H.done({win:true,score:cash+Math.floor(time),title:"Rei do mel!",sub:"$"+cash+" em potes vendidos."});}
},true);
H.loop(dt=>{
  if(over)return;
  time-=dt;dt2+=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(dt2>=30){dt2=0;day++;price=5+Math.floor(Math.random()*8);
    say("☀️ Dia "+day+": pote vale $"+price+".");paint();}
  hives.forEach(h=>{if(h.f<100)h.f+=dt*6;});
  if(Math.random()<dt)paint();
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Safra encerrada!",sub:"$"+cash+"/100. Colha, envase e venda no dia caro!"});}
});
}});
