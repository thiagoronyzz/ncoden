/* NCODE N · 147 Alfaiataria — 5 ternos sob medida */
GREG(147,{
init(root,H){
const STEPS=["📏 Medir","✂️ Cortar","🪡 Costurar"];
let over=false,order=1,step=0,pos=0,dir=1,zone={a:40,b:60},fails=0;
const hud=H.hud(root,[["tr","TERNOS","0/5"],["et","ETAPA","Medir"],["sc","PONTOS",0]]);
const say=H.msg(root,"O marcador corre! Clique em <b>AGORA!</b> com ele na <b>faixa verde</b> para concluir cada etapa (medir → cortar → costurar).");
const o=H.cvs(root,440,200),x=o.x;
let sc=0;
function newZone(){
  const a=10+Math.random()*70;
  zone={a,b:Math.min(95,a+14)};
  pos=Math.random()*100;dir=Math.random()<.5?1:-1;
}
newZone();
H.loop(dt=>{
  if(over)return;
  pos+=dir*dt*(70+order*12+step*20);
  if(pos>100){pos=100;dir=-1;}if(pos<0){pos=0;dir=1;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(30,70,o.W-60,40);
  x.fillStyle=H.C.ok;
  x.fillRect(30+(o.W-60)*zone.a/100,70,(o.W-60)*(zone.b-zone.a)/100,40);
  x.fillStyle=H.C.ink;
  x.fillRect(30+(o.W-60)*pos/100-3,58,6,64);
  x.fillStyle=H.C.ink;x.font="bold 15px 'Space Mono',monospace";
  x.fillText(STEPS[step]+" · terno "+order+"/5",30,40);
  x.font="12px 'Space Mono',monospace";
  x.fillText("erros: "+fails+"/5",30,140);
});
H.btn(root,"🎯 AGORA!",()=>{
  if(over)return;
  if(pos>=zone.a&&pos<=zone.b){
    sc+=20;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    step++;
    if(step>=3){
      step=0;order++;hud.set("tr",(order-1)+"/5");
      if(order>5){over=true;return H.done({win:true,score:sc+100,title:"Alfaiate renomado!",sub:"5 ternos sob medida, ponto perfeito."});}
      say("🤵 Terno pronto! Próximo cliente…");
    }
    hud.set("et",STEPS[step].split(" ")[1]);
    newZone();
  }else{
    fails++;H.sfx("bad");say("❌ Fora da faixa! ("+fails+"/5)");
    if(fails>=5){over=true;return H.done({win:false,score:sc,title:"Tecido rasgado!",sub:"5 erros. Acerte a faixa verde!"});}
    newZone();
  }
},true);
}});
