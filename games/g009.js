/* NCODE N · 009 Gravidade Invertida — inverta e chegue ao gol */
GREG(9,{
init(root,H){
let over=false,dead=false;
const hud=H.hud(root,[["dst","DISTÂNCIA",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Espaço / toque</b> inverte a gravidade. Passe pelas fendas e alcance a 🏁 em 2400m.");
const o=H.cvs(root,520,360),x=o.x;
const GOAL=2400;
let bx,by,vy,g,scroll,obs,speed;
function reset(){
  bx=90;by=o.H/2;vy=0;g=1;scroll=0;speed=150;dead=false;
  const r=H.rng(4242);
  obs=[];
  for(let d=420;d<GOAL;d+=260+Math.floor(r()*80)){
    const gap=110,gy=60+r()*(o.H-120-gap);
    obs.push({d,gap,gy,top:gy,bot:gy+gap});
  }
}
reset();
function flip(){if(over||dead)return;g*=-1;vy*=.4;H.beep(g>0?300:520,.07,"square",.04);}
const kb=H.keys();kb.on((c,d)=>{if(d&&(c==="Space"||c==="ArrowUp"))flip();});
H.onTap(o,flip);
H.loop(dt=>{
  if(over)return;
  if(!dead){
    vy+=g*1400*dt;vy=H.clamp(vy,-420,420);by+=vy*dt;scroll+=speed*dt;
    if(by<14||by>o.H-14){dead=true;H.sfx("bad");say("💥 Bateu na borda! Pressione <b>reiniciar</b> ou toque para tentar de novo.");H.after(900,()=>{if(!over){reset();say("De novo! Inverta antes das bordas.");}});}
    for(const ob of obs){
      const sx=ob.d-scroll;
      if(sx>bx-60&&sx<bx+20){
        if(by<ob.top+8||by>ob.bot-8){dead=true;H.sfx("bad");H.after(900,()=>{if(!over){reset();say("Colisão! Mire o centro das fendas.");}});break;}
      }
    }
    if(scroll>=GOAL){
      over=true;const sc=500;H.score(sc);hud.set("sc",sc);
      return H.done({win:true,score:sc,title:"Gol gravitacional!",sub:"Você atravessou o túnel invertendo a física."});
    }
    hud.set("dst",Math.floor(scroll)+"m");
  }
  // desenho
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(0,8);x.lineTo(o.W,8);x.moveTo(0,o.H-8);x.lineTo(o.W,o.H-8);x.stroke();
  for(const ob of obs){
    const sx=ob.d-scroll;
    if(sx<-40||sx>o.W+40)continue;
    x.fillStyle=H.C.ink;x.fillRect(sx,10,26,ob.top-10);x.fillRect(sx,ob.bot,26,o.H-10-ob.bot);
    x.fillStyle=H.C.wasabi;x.fillRect(sx,ob.top-4,26,4);x.fillRect(sx,ob.bot,26,4);
  }
  const gx=GOAL-scroll;
  if(gx>-20&&gx<o.W+60){x.font="30px serif";x.fillText("🏁",gx,o.H/2);}
  x.save();x.translate(bx,by);if(g<0)x.scale(1,-1);
  x.fillStyle=H.C.terra;x.beginPath();x.arc(0,0,13,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.paper;x.beginPath();x.arc(0,g>0?-4:4,4,0,7);x.fill();x.restore();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(g>0?"GRAV ▼":"GRAV ▲",12,28);
});
H.btn(root,"↻ Reiniciar",()=>{if(!over){reset();say("Recomeçou. Ritmo constante vence.");}},false);
}});
