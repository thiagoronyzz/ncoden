/* NCODE N · 154 Fábrica de Chocolate — 8 barras perfeitas */
GREG(154,{
init(root,H){
const TY={leite:"ao leite",meio:"meio-amargo",branco:"branco"};
let over=false,order=null,stage=0,roast=0,grind=0,tpos=0,tdir=1,served=0;
const hud=H.hud(root,[["br","BARRAS","0/8"],["et","ETAPA","—"],["sc","PONTOS",0]]);
const say=H.msg(root,"Pedido → <b>torrar</b> (4s) → <b>moer</b> (3s) → <b>temperar</b> (pare na faixa!) → <b>moldar</b>. Errou a têmpera? A barra recomeça!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const o=H.cvs(root,440,150),x=o.x;
let sc=0;
function newOrder(){
  const ks=Object.keys(TY);
  order=ks[Math.floor(Math.random()*3)];stage=0;roast=0;grind=0;
  hud.set("et","Torrar");paint();
}
function paint(){
  od.innerHTML="Pedido: "+TY[order]+" · etapa: <b>"+["torrar","moer","temperar","moldar"][stage]+"</b>";
}
newOrder();
H.loop(dt=>{
  if(over)return;
  if(stage===2){tpos+=tdir*dt*70;if(tpos>100){tpos=100;tdir=-1;}if(tpos<0){tpos=0;tdir=1;}}
  if(stage===0&&roast>0){roast-=dt;if(roast<=0){stage=1;hud.set("et","Moer");H.sfx("ok");say("Moído? Agora MOA (3s).");paint();}}
  if(stage===1&&grind>0){grind-=dt;if(grind<=0){stage=2;hud.set("et","Temperar");H.sfx("ok");say("Tempere: pare o marcador na faixa!");paint();}}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,50,o.W-60,36);
  if(stage===2){
    x.fillStyle=H.C.ok;x.fillRect(30+(o.W-60)*.35,50,(o.W-60)*.3,36);
    x.fillStyle=H.C.ink;x.fillRect(30+(o.W-60)*tpos/100-3,40,6,56);
  }
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText(stage===0&&roast>0?"torrando "+roast.toFixed(1)+"s":stage===1&&grind>0?"moendo "+grind.toFixed(1)+"s":stage===2?"PARE NA FAIXA!":"aperte o botão da etapa",30,110);
});
const row=H.el("div","g-row",null,box);
H.btn(row,"Torrar",()=>{if(!over&&stage===0&&roast<=0){roast=4;H.sfx("tick");}},false);
H.btn(row,"Moer",()=>{if(!over&&stage===1&&grind<=0){grind=3;H.sfx("tick");}},false);
H.btn(row,"Temperar!",()=>{
  if(over||stage!==2)return;
  if(tpos>=33&&tpos<=67){stage=3;hud.set("et","Moldar");H.sfx("ok");say("Têmpera perfeita! Molde a barra.");paint();}
  else{H.sfx("bad");say("✕ Têmpera errada! Barra descartada — novo pedido.");newOrder();}
},false);
H.btn(root,"Moldar barra",()=>{
  if(over||stage!==3)return;
  served++;sc+=50;H.score(sc);hud.set("br",served+"/8");hud.set("sc",sc);H.sfx("ok");
  if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Chocolatier!",sub:"8 barras torradas, moídas e temperadas."});}
  say("Barra pronta! Próximo pedido…");newOrder();
},true);
}});
