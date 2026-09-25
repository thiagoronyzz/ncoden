/* NCODE N · 133 Sorveteria — 8 casquinhas antes de derreter */
GREG(133,{
init(root,H){
const FL={choc:"",moran:"",menta:"",limao:""},TOP={gran:"",cereja:"",calda:""};
let over=false,order=null,stack=[],top=null,served=0,pat=0;
const hud=H.hud(root,[["sv","SERVIDOS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Monte as bolas <b>na ordem do pedido</b> (de baixo para cima), ponha a cobertura e sirva antes de derreter!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const cup=H.el("div","g-msg","",box);
let sc=0;
function newOrder(){
  const fl=Object.keys(FL),tp=Object.keys(TOP);
  const n=1+Math.floor(Math.random()*3);
  order={balls:[],top:Math.random()<.6?tp[Math.floor(Math.random()*3)]:null};
  for(let i=0;i<n;i++)order.balls.push(fl[Math.floor(Math.random()*4)]);
  stack=[];top=null;pat=24;
  paint();
}
function paint(){
  od.innerHTML="Pedido: "+order.balls.map(b=>FL[b]).join("→")+(order.top?" + "+TOP[order.top]:"")+" · "+Math.ceil(pat)+"s";
  cup.innerHTML="Casquinha: "+(stack.map(b=>FL[b]).join("")||"vazia")+(top?" + "+TOP[top]:"");
}
newOrder();
const r1=H.el("div","g-row",null,box);
Object.keys(FL).forEach(k=>{
  const b=H.el("button","g-btn ghost",FL[k],r1);
  b.addEventListener("click",()=>{
    if(over)return;
    if(stack.length>=order.balls.length){H.sfx("bad");return;}
    if(order.balls[stack.length]!==k){H.sfx("bad");say("✕ Ordem errada! Veja o pedido.");return;}
    stack.push(k);H.sfx("tick");paint();
  });
});
const r2=H.el("div","g-row",null,box);
Object.keys(TOP).forEach(k=>{
  const b=H.el("button","g-btn ghost",TOP[k],r2);
  b.addEventListener("click",()=>{if(!over){top=k;H.sfx("tick");paint();}});
});
const r3=H.el("div","g-row",null,box);
H.btn(r3,"Recomeçar",()=>{if(!over){stack=[];top=null;H.sfx("tick");paint();}},false);
H.btn(r3,"Servir!",()=>{
  if(over)return;
  const ok=stack.length===order.balls.length&&(order.top?top===order.top:!top);
  if(!ok){H.sfx("bad");say("✕ Casquinha diferente do pedido!");return;}
  served++;sc+=40+Math.floor(pat);H.score(sc);hud.set("sv",served+"/8");hud.set("sc",sc);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Mestre sorveteiro!",sub:"8 casquinhas perfeitas e geladas."});}
  say("Servido! Próximo cliente…");newOrder();
},true);
H.loop(dt=>{
  if(over)return;
  pat-=dt;
  if(Math.random()<dt*2)paint();
  if(pat<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Derreteu tudo!",sub:served+"/8. Monte mais rápido!"});}
});
}});
