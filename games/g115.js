/* NCODE N · 115 Táxi da Cidade — $100 antes da gasolina acabar */
GREG(115,{
init(root,H){
const N=8;
let over=false,taxi={r:7,c:0},fuel=60,cash=0,pax=null,dest=null,time=150;
const hud=H.hud(root,[["cx","CAIXA","$0/100"],["cb","COMBUSTÍVEL",60],["tp","TEMPO",150]]);
const say=H.msg(root,"Setas / WASD ou clique numa célula vizinha. Embarque o passageiro e leve-o ao destino. O <b>posto</b> reabastece o tanque!");
const o=H.cvs(root,440,440),x=o.x;
const GAS={r:0,c:7};
function freeCell(){return{r:Math.floor(Math.random()*N),c:Math.floor(Math.random()*N)};}
function newPax(){
  let a=freeCell(),b=freeCell();
  pax=a;dest=b;
  say("Passageiro em ("+(a.r+1)+","+(a.c+1)+") → ("+(b.r+1)+","+(b.c+1)+")");
}
newPax();
function move(dr,dc){
  if(over)return;
  const nr=taxi.r+dr,nc=taxi.c+dc;
  if(nr<0||nr>=N||nc<0||nc>=N)return;
  taxi={r:nr,c:nc};fuel--;H.sfx("tick");
  hud.set("cb",Math.max(0,fuel));
  if(taxi.r===GAS.r&&taxi.c===GAS.c){fuel=60;hud.set("cb",60);H.sfx("ok");say("Tanque cheio!");}
  if(pax&&taxi.r===pax.r&&taxi.c===pax.c){pax="in";H.sfx("ok");say("A bordo! Leve ao ("+(dest.r+1)+","+(dest.c+1)+")");}
  else if(pax==="in"&&taxi.r===dest.r&&taxi.c===dest.c){
    cash+=25;H.score(cash);hud.set("cx","$"+cash+"/100");H.sfx("ok");
    if(cash>=100){over=true;return H.done({win:true,score:cash+fuel,title:"Taxista do mês!",sub:"$100 com "+fuel+" de gasolina sobrando."});}
    newPax();
  }
  if(fuel<=0){over=true;H.sfx("lose");
    return H.done({win:false,score:cash,title:"Pane seca!",sub:"$"+cash+". Reabasteça no (canto superior direito)!"});
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
  if(time<=0&&!over){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+"/100. Rotas mais curtas!"});}
  const ss=s();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.fillStyle=(r+c)%2?H.C.card:H.C.paper;
    x.fillRect(c*ss,r*ss,ss,ss);
    x.strokeStyle=H.C.cement;x.strokeRect(c*ss,r*ss,ss,ss);
  }
  x.font=Math.floor(ss*.6)+"px serif";
  x.fillText("i:barrel",GAS.c*ss+6,GAS.r*ss+ss-6);
  if(pax&&pax!=="in")x.fillText("i:person",pax.c*ss+6,pax.r*ss+ss-6);
  if(dest&&(pax==="in"||pax))x.fillText("i:flag",dest.c*ss+6,dest.r*ss+ss-6);
  x.fillText("i:car",taxi.c*ss+6,taxi.r*ss+ss-6);
});
}});
