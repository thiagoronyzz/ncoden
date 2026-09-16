/* NCODE N · 025 Poção Colorida — misture até igualar */
GREG(25,{
init(root,H){
let round=0,over=false,sc=0;
const hud=H.hud(root,[["rd","RODADA","1/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Ajuste <b>R, G, B</b> em passos e prove a mistura. Erro abaixo de 40 passa de nível.");
const o=H.cvs(root,480,220),x=o.x;
let tgt=[0,0,0],mix=[128,128,128];
const CH=["R","G","B"];
function build(){
  const r=H.rng(300+round*91);
  tgt=[Math.floor(r()*16)*16,Math.floor(r()*16)*16,Math.floor(r()*16)*16];
  mix=[128,128,128];
  hud.set("rd",(round+1)+"/5");paint();tray();
}
function css(c){return"rgb("+c[0]+","+c[1]+","+c[2]+")";}
function paint(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=css(tgt);x.fillRect(30,40,190,140);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(30,40,190,140);
  x.fillStyle=css(mix);x.fillRect(260,40,190,140);x.strokeRect(260,40,190,140);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("ALVO",30,30);x.fillText("SUA MISTURA",260,30);
  const d=Math.sqrt((tgt[0]-mix[0])**2+(tgt[1]-mix[1])**2+(tgt[2]-mix[2])**2);
  x.fillStyle=d<40?H.C.ok:H.C.ink2;x.font="bold 14px 'Space Mono',monospace";
  x.fillText("Δ "+d.toFixed(0)+" / 40",190,205);
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-col",null,root);
  trayBox.innerHTML="";
  CH.forEach((c,i)=>{
    const row=H.el("div","g-row",null,trayBox);
    H.el("span","g-chip",c+" <b>"+mix[i]+"</b> "+(mix[i]<tgt[i]?"▲":mix[i]>tgt[i]?"▼":"✓"),row);
    const b1=H.el("button","g-btn sm ghost","−16",row);
    const b2=H.el("button","g-btn sm ghost","+16",row);
    b1.addEventListener("click",()=>{mix[i]=Math.max(0,mix[i]-16);H.sfx("tick");paint();tray();});
    b2.addEventListener("click",()=>{mix[i]=Math.min(255,mix[i]+16);H.sfx("tick");paint();tray();});
  });
  const row=H.el("div","g-row",null,trayBox);
  H.btn(row,"⚗ Provar poção",prove,true);
}
function prove(){
  if(over)return;
  const d=Math.sqrt((tgt[0]-mix[0])**2+(tgt[1]-mix[1])**2+(tgt[2]-mix[2])**2);
  if(d<40){
    const gain=Math.round(140-d);sc+=gain;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    round++;
    if(round>=5){over=true;return H.done({win:true,score:sc+100,title:"Mestre-poçoeiro!",sub:"5 elixires com a cor exata do grimório."});}
    say("Poção aprovada! (+ "+gain+") Próximo elixir…");build();
  }else{H.sfx("bad");say("Ainda longe (Δ "+d.toFixed(0)+"). Siga as setas ▲▼ de cada canal.");}
}
build();
}});
