/* NCODE N · 156 Casa de Chá — 8 infusões no ponto */
GREG(156,{
init(root,H){
const TEA={verde:{e:"verde",n:"verde",t:[65,75]},preto:{e:"preto",n:"preto",t:[95,100]},erva:{e:"erva",n:"ervas",t:[80,90]}};
let over=false,order=null,temp=20,served=0,pat=0,heat=false;
const hud=H.hud(root,[["ch","CHÁS","0/8"],["tm","CHALEIRA","20°C"],["sc","PONTOS",0]]);
const say=H.msg(root,"SEGURE <b>aquecer</b> para subir a temperatura (esfria sozinha). <b>Servir</b> com a água na faixa do pedido!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
let sc=0;
function newOrder(){
  const ks=Object.keys(TEA);
  order=ks[Math.floor(Math.random()*3)];pat=26;paint();
}
function paint(){
  od.innerHTML="Pedido: chá <b>"+TEA[order].n+"</b> ("+TEA[order].t[0]+"–"+TEA[order].t[1]+"°C) · "+Math.ceil(pat)+"s";
}
newOrder();
const hb=H.el("button","g-btn","SEGURE PARA AQUECER",box);
hb.addEventListener("pointerdown",e=>{e.preventDefault();heat=true;});
hb.addEventListener("pointerup",()=>heat=false);
hb.addEventListener("pointerleave",()=>heat=false);
const o=H.cvs(root,440,120),x=o.x;
H.loop(dt=>{
  if(over)return;
  if(heat)temp=Math.min(100,temp+dt*22);
  else temp=Math.max(20,temp-dt*7);
  hud.set("tm",Math.round(temp)+"°C");
  pat-=dt;
  if(Math.random()<dt*3)paint();
  if(pat<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Chá frio!",sub:served+"/8. Aqueça e sirva rápido!"});}
  const T=TEA[order].t;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,40,o.W-60,30);
  x.fillStyle=H.C.ok;
  x.fillRect(30+(o.W-60)*(T[0]-20)/80,40,(o.W-60)*(T[1]-T[0])/80,30);
  x.fillStyle=H.C.ink;
  x.fillRect(30+(o.W-60)*(temp-20)/80-3,30,6,50);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("20°C",30,100);x.fillText("100°C",o.W-60,100);
});
H.btn(root,"Servir chá",()=>{
  if(over)return;
  const T=TEA[order].t;
  if(temp>=T[0]&&temp<=T[1]){
    served++;sc+=50+Math.floor(pat);H.score(sc);hud.set("ch",served+"/8");hud.set("sc",sc);H.sfx("ok");
    if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Mestre de chás!",sub:"8 infusões na temperatura perfeita."});}
    say("Servido! Próximo pedido…");newOrder();
  }else{H.sfx("bad");say("✕ Temperatura errada! Quer "+T[0]+"–"+T[1]+"°C.");}
},true);
}});
