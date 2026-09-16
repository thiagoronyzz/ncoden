/* NCODE N · 197 Palmas no Beat — 24 palmas cravadas! */
GREG(197,{
init(root,H){
let over=false,t=0,errs=[],next=1.5;
const BPM=0.6,TOTAL=24;
const hud=H.hud(root,[["pm","PALMAS","0/24"],["md","ERRO MÉDIO","—"]]);
const say=H.msg(root,"Bata <b>PALMA</b> (botão, Espaço ou toque) <b>exatamente</b> no pulso! Erro médio abaixo de 120ms vence.");
const o=H.cvs(root,440,300),x=o.x;
function clap(){
  if(over||errs.length>=TOTAL)return;
  const e=Math.abs(t-next);
  // aceita palmas próximas de qualquer pulso (anterior ou próximo)
  const ePrev=Math.abs(t-(next-BPM));
  const err=Math.min(e,ePrev);
  errs.push(err);
  H.sfx(err<0.12?"ok":"bad");
  hud.set("pm",errs.length+"/"+TOTAL);
  const avg=errs.reduce((a,b)=>a+b,0)/errs.length;
  hud.set("md",Math.floor(avg*1000)+"ms");
  if(errs.length>=TOTAL){
    over=true;
    if(avg<0.12)return H.done({win:true,score:Math.floor(1000-avg*3000),title:"Palmas perfeitas!",sub:"Erro médio "+Math.floor(avg*1000)+"ms em 24 palmas."});
    return H.done({win:false,score:0,title:"Fora do ritmo!",sub:"Erro médio "+Math.floor(avg*1000)+"ms (precisa <120ms)."});
  }
}
H.btn(root,"👏 PALMA!",clap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")clap();});
H.onTap(o,()=>clap());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(t>=next-0.001){next+=BPM;H.beep(660,.06);}
  const ph=1-Math.min(1,(next-t)/BPM);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const near=Math.abs(t-(next-BPM))<0.12||Math.abs(t-next)<0.12;
  x.fillStyle=near?H.C.wasabi:H.C.card;
  x.beginPath();x.arc(o.W/2,o.H/2,60+ph*30,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=4;x.stroke();
  x.font="44px serif";x.fillText("👏",o.W/2-22,o.H/2+16);
  x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";
  x.fillText(near?"AGORA!":"…",o.W/2-30,o.H-30);
});
}});
