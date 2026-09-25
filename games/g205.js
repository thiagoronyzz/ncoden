/* NCODE N · 205 Batimento Cardíaco — 60s de calma! */
GREG(205,{
init(root,H){
let over=false,t=0,next=1.0,stab=70,iv=0.83,event=null,et=8;
const hud=H.hud(root,[["es","ESTABILIDADE",70],["tp","TEMPO",60]]);
const say=H.msg(root,"Toque <b>NO PULSO</b> (~72 BPM)! Eventos de estresse mudam o ritmo — leia o aviso e acompanhe. Zere = infarto!");
const o=H.cvs(root,500,320),x=o.x;
function tap(){
  if(over)return;
  const e=Math.abs(t-next);
  if(e<0.18){stab=Math.min(100,stab+3);H.sfx("ok");next+=iv;}
  else{stab-=8;H.sfx("bad");}
  hud.set("es",Math.floor(stab));
  if(stab<=0){over=true;return H.done({win:false,score:0,title:"INFARTO!",sub:"Estabilidade zerada."});}
}
H.btn(root,"♥ PULSAR!",tap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")tap();});
H.onTap(o,()=>tap());
const EV=[["Café! Ritmo acelera!",0.6],["Susto! Uma pausa…",1.4],["Corrida! Mais rápido!",0.55],["Respire… devagar.",1.1]];
H.loop(dt=>{
  if(over)return;
  t+=dt;
  hud.set("tp",Math.max(0,Math.ceil(60-t)));
  if(t>=60){over=true;return H.done({win:true,score:Math.floor(stab)*5,title:"Coração zen!",sub:"60s de batidas estáveis."});}
  et-=dt;
  if(et<=0){
    et=10+Math.random()*6;
    event=EV[Math.floor(Math.random()*EV.length)];
    iv=event[1];next=t+iv;
    say(""+event[0]+" (novo pulso a cada "+iv.toFixed(2)+"s)");
    H.sfx("bad");
  }
  if(t>next+0.18){
    stab-=8;next+=iv;H.sfx("bad");hud.set("es",Math.floor(stab));
    if(stab<=0){over=true;return H.done({win:false,score:0,title:"INFARTO!",sub:"Pulso perdido."});}
  }
  if(Math.abs(t-next)<dt)H.beep(70,.1);
  x.fillStyle="#2b1215";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.terra;x.lineWidth=3;
  x.beginPath();
  for(let px=0;px<o.W;px+=6){
    const tt=t-px/120;
    const cyc=((tt%iv)+iv)%iv;
    let v=0;
    if(cyc<0.08)v=-40*(cyc/0.08);
    else if(cyc<0.16)v=-40+70*((cyc-0.08)/0.08);
    else if(cyc<0.3)v=30-30*((cyc-0.16)/0.14);
    const y=160+v;
    px===0?x.moveTo(px,y):x.lineTo(px,y);
  }
  x.stroke();
  const near=Math.abs(t-next)<0.18;
  x.font="54px serif";
  x.fillText(near?"i:heart":"♥",o.W/2-27,90);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("pulso a cada "+iv.toFixed(2)+"s · estabilidade "+Math.floor(stab)+"%",130,290);
});
}});
