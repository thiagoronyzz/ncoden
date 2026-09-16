/* NCODE N · 199 Metrônomo Acelerado — 40 tempos, 60→160 BPM! */
GREG(199,{
init(root,H){
let over=false,t=0,next=1.2,beat=0,miss=0,iv=1.0;
const hud=H.hud(root,[["bt","TEMPOS","0/40"],["bpm","BPM",60],["er","ERROS","0/5"]]);
const say=H.msg(root,"Toque <b>NO TEMPO</b> (botão, Espaço ou clique) a cada clique do metrônomo — ele acelera de 60 a 160 BPM! 5 erros = fim.");
const o=H.cvs(root,440,280),x=o.x;
function tap(){
  if(over||beat>=40)return;
  const e=Math.abs(t-next);
  const tol=iv*0.28;
  if(e<tol){
    beat++;H.sfx("ok");
    iv=1.0-beat*(0.625/40);
    next+=iv;
    hud.set("bt",beat+"/40");hud.set("bpm",Math.round(60/iv));
    H.score(beat*10);
    if(beat>=40){over=true;return H.done({win:true,score:500,title:"Relógio humano!",sub:"40 tempos até 160 BPM sem perder o pulso."});}
  }else{
    miss++;hud.set("er",miss+"/5");H.sfx("bad");
    if(miss>=5){over=true;return H.done({win:false,score:beat*10,title:"Perdeu o pulso!",sub:beat+"/40 tempos. Antecipe a aceleração!"});}
  }
}
H.btn(root,"⏱️ TOCAR NO TEMPO!",tap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")tap();});
H.onTap(o,()=>tap());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(t>next+iv*0.28&&beat<40){
    miss++;hud.set("er",miss+"/5");H.sfx("bad");
    next+=iv;
    if(miss>=5){over=true;return H.done({win:false,score:beat*10,title:"Perdeu o pulso!",sub:beat+"/40 tempos."});}
  }
  if(Math.abs(t-next)<dt*1.5)H.beep(880,.05);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const ph=H.clamp(1-Math.abs(t-next)/(iv*0.28),0,1);
  x.save();x.translate(o.W/2,220);
  const ang=Math.sin((t/next)*Math.PI*2)*.5;
  x.rotate(-ang);
  x.fillStyle=H.C.ink;x.fillRect(-4,-160,8,160);
  x.fillStyle=H.C.terra;x.beginPath();x.arc(0,-120,12,0,7);x.fill();
  x.restore();
  x.fillStyle="#8A6A2F";
  x.beginPath();x.moveTo(o.W/2-50,220);x.lineTo(o.W/2+50,220);x.lineTo(o.W/2+34,260);x.lineTo(o.W/2-34,260);x.fill();
  x.fillStyle=ph>0.5?H.C.wasabi:H.C.card;
  x.beginPath();x.arc(o.W/2,60,30+ph*14,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 13px 'Space Mono',monospace";
  x.fillText(Math.round(60/iv)+" BPM · próximo em "+Math.max(0,(next-t)).toFixed(2)+"s",110,120);
});
}});
