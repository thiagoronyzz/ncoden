/* NCODE N · 148 Estúdio de Cerâmica — 6 peças do forno */
GREG(148,{
init(root,H){
const GL=["○","○","●"];
let over=false,order=0,stage=0,spin=0,glaze=null,fire=0,served=0;
const hud=H.hud(root,[["pc","PEÇAS","0/6"],["et","ETAPA","Torno"],["sc","PONTOS",0]]);
const say=H.msg(root,"1⃣ <b>Torno</b>: clique 6× ritmado (não rápido demais!). 2⃣ <b>Esmalte</b>: a cor do pedido. 3⃣ <b>Forno</b>: tire na janela verde!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
let sc=0,want=0,rhythm=0,last=0,ft=0,fdir=1;
function newOrder(){
  want=Math.floor(Math.random()*3);stage=0;spin=0;glaze=null;fire=0;ft=0;fdir=1;
  hud.set("et","Torno");
  paint();
}
function paint(){
  od.innerHTML="Pedido: vaso "+GL[want]+" · etapa: <b>"+["torno","esmalte","forno"][stage]+"</b>"+(stage===0?" ("+spin+"/6 toques)":"");
}
newOrder();
const o=H.cvs(root,440,160),x=o.x;
H.loop(dt=>{
  if(over)return;
  if(stage===2){
    ft+=fdir*dt*60;
    if(ft>100){ft=100;fdir=-1;}if(ft<0){ft=0;fdir=1;}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,50,o.W-60,36);
  if(stage===2){
    x.fillStyle=H.C.ok;x.fillRect(30+(o.W-60)*.4,50,(o.W-60)*.2,36);
    x.fillStyle=H.C.ink;x.fillRect(30+(o.W-60)*ft/100-3,40,6,56);
    x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
    x.fillText("TIRE NA FAIXA VERDE!",30,110);
  }else{
    x.fillStyle=H.C.ink;x.font="13px 'Space Mono',monospace";
    x.fillText(stage===0?"clique TORNAR 6× com calma (~1 por segundo)":"escolha o esmalte "+GL[want],30,72);
  }
});
const row=H.el("div","g-row",null,box);
H.btn(row,"TORNAR",()=>{
  if(over||stage!==0)return;
  const now=performance.now();
  if(now-last<700){H.sfx("bad");say("Devagar! Ritmo de ~1 toque/seg.");spin=0;paint();last=now;return;}
  last=now;spin++;H.sfx("tick");
  if(spin>=6){stage=1;hud.set("et","Esmalte");say("Vaso modelado! Agora o esmalte "+GL[want]+".");}
  paint();
},false);
GL.forEach(g=>{
  H.btn(row,g,()=>{
    if(over||stage!==1)return;
    if(g!==GL[want]){H.sfx("bad");say("Cor errada! O pedido é "+GL[want]+".");return;}
    stage=2;hud.set("et","Forno");H.sfx("ok");say("No forno! Tire na faixa verde.");paint();
  },false);
});
H.btn(root,"TIRAR DO FORNO",()=>{
  if(over||stage!==2)return;
  if(ft>=38&&ft<=62){
    served++;sc+=50;H.score(sc);hud.set("pc",served+"/6");hud.set("sc",sc);H.sfx("ok");
    if(served>=6){over=true;return H.done({win:true,score:sc+100,title:"Ceramista premiado!",sub:"6 vasos modelados, esmaltados e queimados."});}
    say("Peça pronta! Próximo pedido…");newOrder();
  }else{H.sfx("bad");say("Queima ruim! Fora da janela — mesma peça, tente de novo.");ft=0;}
},true);
}});
