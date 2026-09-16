/* NCODE N · 202 Banda Marcial — 32 tempos com o maestro! */
GREG(202,{
init(root,H){
let over=false,t=0,next=1.5,beat=0,coh=70;
const IV=0.55,TOTAL=32;
const hud=H.hud(root,[["tm","TEMPOS","0/32"],["cn","COESÃO",70]]);
const say=H.msg(root,"Toque <b>NO TEMPO</b> da batuta (botão, Espaço ou clique)! Erro derruba a coesão; termine com 60+!");
const o=H.cvs(root,500,320),x=o.x;
function tap(){
  if(over||beat>=TOTAL)return;
  const e=Math.abs(t-next);
  if(e<0.16){beat++;coh=Math.min(100,coh+4);H.sfx("ok");next+=IV;}
  else{coh-=9;H.sfx("bad");
    if(coh<=0){over=true;return H.done({win:false,score:beat*10,title:"Banda dispersou!",sub:"Coesão zerada no tempo "+beat+"."});}
  }
  hud.set("tm",beat+"/"+TOTAL);hud.set("cn",Math.floor(coh));H.score(beat*10);
  if(beat>=TOTAL){
    over=true;
    if(coh>=60)return H.done({win:true,score:320+Math.floor(coh),title:"Desfile perfeito!",sub:"32 tempos com coesão "+Math.floor(coh)+"%."});
    return H.done({win:false,score:beat*10,title:"Fora de passo!",sub:"Coesão "+Math.floor(coh)+"% (precisa 60)."});
  }
}
H.btn(root,"🥁 MARCAR PASSO!",tap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")tap();});
H.onTap(o,()=>tap());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(t>next+0.16&&beat<TOTAL){
    coh-=9;next+=IV;H.sfx("bad");
    hud.set("cn",Math.floor(coh));
    if(coh<=0){over=true;return H.done({win:false,score:beat*10,title:"Banda dispersou!",sub:"Tempo perdido no "+beat+"."});}
  }
  const ph=(t%IV)/IV;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  // maestro
  x.font="40px serif";x.fillText("🤵",o.W/2-20,70);
  const ang=Math.sin(ph*Math.PI*2)*.7;
  x.save();x.translate(o.W/2+18,50);x.rotate(ang);
  x.strokeStyle=H.C.ink;x.lineWidth=4;
  x.beginPath();x.moveTo(0,0);x.lineTo(0,-46);x.stroke();
  x.restore();
  x.font="26px serif";
  for(let i=0;i<6;i++)x.fillText("🥁",40+i*70,180+Math.sin(t*4+i)*6);
  // coesão
  x.fillStyle=H.C.card;x.fillRect(60,250,o.W-120,20);
  x.fillStyle=coh>60?H.C.ok:coh>30?"#E8A33D":H.C.terra;
  x.fillRect(60,250,(o.W-120)*coh/100,20);
  x.strokeStyle=H.C.ink;x.strokeRect(60,250,o.W-120,20);
  const near=Math.abs(t-next)<0.16;
  x.fillStyle=near?H.C.wasabi:H.C.ink;
  x.beginPath();x.arc(o.W/2,110,near?16:10,0,7);x.fill();
});
}});
