/* NCODE N · 076 Chuva de Flechas — dance entre as zonas */
GREG(76,{
init(root,H){
let over=false,lane=2,t=45,lives=3,shots=[],warn=[],sc=0,spawn=0;
const hud=H.hud(root,[["tp","TEMPO",45],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mova-se com <b>◀ ▶ / toque nas faixas</b>. Saia das <b>zonas vermelhas</b> antes das flechas caírem! Sobreviva 45s.");
const o=H.cvs(root,500,400),x=o.x;
const LANES=[70,170,270,370,460];
function build(){lane=2;t=45;lives=3;shots=[];warn=[];sc=0;hud.set("vd",3);}
build();
function move(d){if(over)return;lane=H.clamp(lane+d,0,4);H.sfx("tick");}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;if(c==="ArrowLeft")move(-1);if(c==="ArrowRight")move(1);});
H.onTap(o,(px)=>{const l=Math.round((px-70)/100);lane=H.clamp(l,0,4);});
H.loop(dt=>{
  if(over)return;
  t-=dt;sc+=dt;H.score(Math.floor(sc*10));hud.set("sc",Math.floor(sc*10));
  hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;return H.done({win:true,score:Math.floor(sc*10)+150,title:"Intocado!",sub:"45 segundos de chuva sem um arranhão."});}
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.5,1.1-t*0.012);
    const n=1+Math.floor(Math.random()*2);
    const order=H.shuffle(Math.random,[0,1,2,3,4]).slice(0,n);
    for(const L of order)warn.push({lane:L,ttl:.9});
  }
  for(let i=warn.length-1;i>=0;i--){
    warn[i].ttl-=dt;
    if(warn[i].ttl<=0){shots.push({lane:warn[i].lane,y:-20});warn.splice(i,1);H.beep(500,.05);}
  }
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];s.y+=520*dt;
    if(s.y>o.H-120&&s.y<o.H-40&&s.lane===lane){
      shots.splice(i,1);lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:Math.floor(sc*10),title:"Flechado!",sub:"Sobreviveu "+(45-Math.ceil(t))+"s. Fuja do vermelho!"});}
      say("🏹 Ai! Vidas: "+lives);continue;
    }
    if(s.y>o.H+20)shots.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  LANES.forEach((lx,i)=>{
    const hot=warn.some(w=>w.lane===i);
    x.fillStyle=hot?"rgba(217,78,52,.25)":i%2?"#EDE8DC":H.C.card;
    x.fillRect(lx-48,0,96,o.H);
    if(hot){x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";x.fillText("⚠",lx-8,30);}
  });
  for(const s of shots){
    const lx=LANES[s.lane];
    x.strokeStyle=H.C.ink;x.lineWidth=3;
    x.beginPath();x.moveTo(lx,s.y-22);x.lineTo(lx,s.y);x.stroke();
    x.fillStyle=H.C.ink;
    x.beginPath();x.moveTo(lx-6,s.y-8);x.lineTo(lx+6,s.y-8);x.lineTo(lx,s.y+4);x.closePath();x.fill();
  }
  x.font="32px serif";x.fillText("🧍",LANES[lane]-16,o.H-70);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
