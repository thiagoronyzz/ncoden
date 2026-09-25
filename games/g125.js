/* NCODE N · 125 Motoboy Expresso — entregue no prazo entre os semáforos */
GREG(125,{
init(root,H){
const N=7;
let over=false,bike={r:6,c:0},cash=0,pick=null,drop=null,timer=0,quota=0,riding=false,time=180,clock=0;
const LIGHTS=new Set();
while(LIGHTS.size<6){const r=1+Math.floor(Math.random()*(N-2)),c=1+Math.floor(Math.random()*(N-2));LIGHTS.add(r+","+c);}
let lightState=()=>false; // definido após clock (ciclo de 3s)
const hud=H.hud(root,[["cx","CAIXA","$0/80"],["sv","PRAZO","—"],["tp","TEMPO",180]]);
const say=H.msg(root,"Setas/WASD ou clique na célula vizinha. Pegue o <b>pedido</b> e entregue antes do prazo! Semáforos fecham a cada 4 movimentos.");
const o=H.cvs(root,420,420),x=o.x;
function freeCell(){let a;do{a={r:Math.floor(Math.random()*N),c:Math.floor(Math.random()*(N-2))};}while(LIGHTS.has(a.r+","+a.c));return a;}
function newOrder(){
  pick=freeCell();drop=freeCell();riding=false;
  const dist=Math.abs(pick.r-drop.r)+Math.abs(pick.c-drop.c);
  timer=dist*2+14;quota=Math.max(12,timer-Math.floor(timer*.45));
  hud.set("sv",timer+" mov.");
  say("Busque em ("+(pick.r+1)+","+(pick.c+1)+") → entregue em ("+(drop.r+1)+","+(drop.c+1)+") · prazo "+timer+" movimentos.");
}
newOrder();
function blocked(r,c){
  if(!LIGHTS.has(r+","+c))return false;
  return lightState();
}
function move(dr,dc){
  if(over)return;
  const nr=bike.r+dr,nc=bike.c+dc;
  if(nr<0||nr>=N||nc<0||nc>=N)return;
  if(blocked(nr,nc)){H.sfx("bad");say("Semáforo fechado — aguarde o ciclo ou contorne!");return;}
  bike={r:nr,c:nc};
  if(riding){timer--;hud.set("sv",Math.max(0,timer)+" mov.");
    if(timer<=0){over=true;H.sfx("lose");
      return H.done({win:false,score:cash,title:"Pedido esfriou!",sub:"$"+cash+". Prazo estourado — prefira rotas curtas."});}}
  if(!riding&&bike.r===pick.r&&bike.c===pick.c){
    riding=true;H.sfx("ok");say("Pedido a bordo! Corra ao <b>destino</b> — dentro do prazo rende gorjeta.");
  }else if(riding&&bike.r===drop.r&&bike.c===drop.c){
    const fare=12+Math.max(0,timer-quota)*2;
    cash+=fare;H.score(cash);hud.set("cx","$"+cash+"/80");H.sfx("ok");
    if(cash>=80){over=true;return H.done({win:true,score:cash+Math.max(0,time),title:"Expresso 5 estrelas!",sub:"$"+cash+" com entregas dentro do prazo."});}
    newOrder();
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
function draw(){
  const s=Math.floor(Math.min(o.W,o.H)/N);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const k=r+","+c;
    x.fillStyle=LIGHTS.has(k)?(lightState()?"#E5B9B2":"#C9DFC8"):(r+c)%2?H.C.paper2||"#F3EFE6":"#EDE8DC";
    x.fillRect(c*s+1,r*s+1,s-2,s-2);
    if(LIGHTS.has(k)){
      x.fillStyle=lightState()?H.C.terra:"#5F8F5F";
      x.beginPath();x.arc(c*s+s/2,r*s+s/2,Math.max(3,s*.14),0,7);x.fill();
    }
  }
  if(pick){x.fillStyle=H.C.ink;x.font="bold "+Math.floor(s*.34)+"px 'Plus Jakarta Sans',sans-serif";x.textAlign="center";x.textBaseline="middle";
    x.fillText(riding?"PKG":"PED",pick.c*s+s/2,pick.r*s+s/2);}
  if(riding&&drop){x.strokeStyle=H.C.terra;x.lineWidth=2;x.setLineDash([4,3]);
    x.strokeRect(drop.c*s+3,drop.r*s+3,s-6,s-6);x.setLineDash([]);
    x.fillStyle=H.C.terra;x.fillText("ENT",drop.c*s+s/2,drop.r*s+s/2);}
  x.fillStyle=H.C.ink;x.beginPath();x.arc(bike.c*s+s/2,bike.r*s+s/2,s*.3,0,7);x.fill();
  x.fillStyle=H.C.paper;x.beginPath();x.arc(bike.c*s+s/2,bike.r*s+s/2,s*.12,0,7);x.fill();
}
const ptr=H.ptr(o);
let pdown=false;
function ptrMove(){
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const c=Math.floor(ptr.x/s),r=Math.floor(ptr.y/s);
  const dr=r-bike.r,dc=c-bike.c;
  if(Math.abs(dr)+Math.abs(dc)===1)move(dr,dc);
  else if(Math.abs(dr)+Math.abs(dc)>1)say("Um passo por vez — toque uma célula vizinha.");
}
let last=0;
H.loop((dt,t)=>{
  if(over)return;
  clock=t;lightState=()=>Math.floor(clock/3)%2===0;
  if(ptr.down&&!pdown){pdown=true;ptrMove();}
  else if(!ptr.down)pdown=false;
  if(t-last>=1){last=t;time--;hud.set("tp",time);
    if(time<=0){over=true;return H.done({win:false,score:cash,title:"Turno encerrado!",sub:"$"+cash+". Faltou $"+(80-cash)+" para a meta."});}}
  draw();
});
}});
