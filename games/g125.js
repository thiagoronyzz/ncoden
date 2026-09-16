/* NCODE N · 125 Taxista — $80 antes do taxímetro estourar */
GREG(125,{
init(root,H){
const N=7;
let over=false,taxi={r:6,c:0},cash=0,pax=null,dest=null,meter=0,limit=0,riding=false,time=150;
const hud=H.hud(root,[["cx","CAIXA","$0/80"],["tx","TAXÍMETRO","—"],["tp","TEMPO",150]]);
const say=H.msg(root,"Setas/WASD ou vizinho. Com passageiro, o <b>taxímetro sobe a cada quadra</b> — entregue antes do limite dele!");
const o=H.cvs(root,420,420),x=o.x;
function freeCell(){return{r:Math.floor(Math.random()*N),c:Math.floor(Math.random()*N)};}
function newPax(){
  pax=freeCell();dest=freeCell();riding=false;meter=0;
  limit=Math.abs(pax.r-dest.r)+Math.abs(pax.c-dest.c)+6;
  hud.set("tx","limite $"+limit);
  say("🧍 em ("+(pax.r+1)+","+(pax.c+1)+") → 🏁 ("+(dest.r+1)+","+(dest.c+1)+") · limite $"+limit);
}
newPax();
function move(dr,dc){
  if(over)return;
  const nr=taxi.r+dr,nc=taxi.c+dc;
  if(nr<0||nr>=N||nc<0||nc>=N)return;
  taxi={r:nr,c:nc};H.sfx("tick");
  if(riding){meter+=2;hud.set("tx","$"+meter+"/"+limit);
    if(meter>limit){over=true;H.sfx("lose");
      return H.done({win:false,score:cash,title:"Taxímetro estourou!",sub:"$"+cash+". Pegue o caminho mais curto!"});}}
  if(!riding&&taxi.r===pax.r&&taxi.c===pax.c){riding=true;H.sfx("ok");say("🧍 A bordo! Corra ao 🏁 — cada quadra = $2!");}
  else if(riding&&taxi.r===dest.r&&taxi.c===dest.c){
    const fare=10+Math.floor(meter/2)+Math.max(0,limit-meter);
    cash+=fare;H.score(cash);hud.set("cx","$"+cash+"/80");H.sfx("ok");
    if(cash>=80){over=true;return H.done({win:true,score:cash,title:"Rei das ruas!",sub:"$"+cash+" sem estourar nenhum taxímetro."});}
    newPax();
  }
}
const kb=H.keys();
kb.on((c,d)=>{
  if(!d)return;
  if(c==="ArrowUp"||c==="KeyW")move(-1,0);
  else if(c==="ArrowDown"||c==="KeyS")move(1,0);
  else if(c==="ArrowLeft"||c==="KeyA")move(0,-1);
  else if(c==="ArrowRight"||c==="KeyD")move(0,1);
});
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
H.onTap(o,(px,py)=>{
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  if(Math.abs(r-taxi.r)+Math.abs(c-taxi.c)===1)move(r-taxi.r,c-taxi.c);
});
H.loop(dt=>{
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0&&!over){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+"/80."});}
  const ss=s();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.fillStyle=(r+c)%2?H.C.card:H.C.paper;
    x.fillRect(c*ss,r*ss,ss,ss);
    x.strokeStyle=H.C.cement;x.strokeRect(c*ss,r*ss,ss,ss);
  }
  x.font=Math.floor(ss*.62)+"px serif";
  if(!riding&&pax)x.fillText("🧍",pax.c*ss+6,pax.r*ss+ss-6);
  if(dest)x.fillText("🏁",dest.c*ss+6,dest.r*ss+ss-6);
  x.fillText("🚕",taxi.c*ss+6,taxi.r*ss+ss-6);
});
}});
