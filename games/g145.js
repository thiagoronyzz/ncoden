/* NCODE N · 145 Supermercado — $150 sem fila e sem vencer */
GREG(145,{
init(root,H){
let over=false,shelf=[6,6,6],queue=[],cash=0,time=180,scan=0,exp=[0,0,0],spawn=1,nid=0;
const hud=H.hud(root,[["cx","CAIXA","$0/150"],["fl","FILA",0],["tp","TEMPO",180]]);
const say=H.msg(root,"<b>Repor</b> enche a gôndola (evita fuga). <b>📠 Passar compra</b> atende 1 da fila (2s cada). 🗑️ joga fora o <b>vencido</b> antes que mancha a loja!");
const box=H.el("div","g-col",null,root);
const sbox=H.el("div","g-row",null,box);
const qbox=H.el("div","g-msg","",box);
const NM=["🥛","🍞","🍎"];
function paint(){
  hud.set("cx","$"+cash+"/150");hud.set("fl",queue.length);
  sbox.innerHTML="";
  shelf.forEach((s,i)=>{
    const b=H.el("button","g-chip"+(exp[i]>0?" bad":s<=1?" hot":""),NM[i]+" "+s+(exp[i]>0?" ⚠️"+exp[i]+" venc!":""),sbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      if(exp[i]>0){exp[i]=0;H.sfx("ok");say("🗑️ Vencidos descartados!");}
      else{shelf[i]=Math.min(9,shelf[i]+3);H.sfx("tick");}
      paint();
    });
  });
  qbox.innerHTML="🧍‍♀️ fila: "+queue.length+" esperando"+(scan>0?" · passando compra…":"");
}
paint();
H.btn(root,"📠 Passar compra (2s)",()=>{
  if(over||scan>0||!queue.length)return;
  scan=2;H.sfx("tick");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Loja fechou!",sub:"$"+cash+"/150."});}
  spawn-=dt;
  if(spawn<=0){spawn=3;
    const i=Math.floor(Math.random()*3);
    if(shelf[i]>0){shelf[i]--;queue.push({id:nid++});}
    if(queue.length>6){queue.splice(0,2);cash=Math.max(0,cash-10);H.sfx("bad");say("🚶 Fila gigante! 2 desistiram (−$10).");}
    paint();}
  if(Math.random()<dt*.25){
    const i=Math.floor(Math.random()*3);
    if(shelf[i]>0){shelf[i]--;exp[i]++;}
    paint();
  }
  if(exp.some(e=>e>=4)){over=true;return H.done({win:false,score:cash,title:"Vigilância interditou!",sub:"Vencidos demais na gôndola. Descarte clicando!"});}
  if(scan>0){scan-=dt;
    if(scan<=0&&queue.length){queue.shift();cash+=12;H.score(cash);H.sfx("ok");paint();
      if(cash>=150){over=true;return H.done({win:true,score:cash+Math.floor(time),title:"Rede lucrativa!",sub:"$"+cash+" sem fila e sem vencido."});}}}
  if(Math.random()<dt)paint();
});
}});
