/* NCODE N · 206 Carrilhão do Relógio — 10 badaladas! */
GREG(206,{
init(root,H){
let over=false,t=0,ang=0,rung=0,miss=0,speed=1.6,lastZone=-1;
const hud=H.hud(root,[["bd","BADALADAS","0/10"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Bata o sino (botão, Espaço ou clique) quando o ponteiro cruzar a <b>zona dourada</b>! 10 badaladas, 3 erros.");
const o=H.cvs(root,420,380),x=o.x;
const CX=o.W/2,CY=170,RR=110;
function ring(){
  if(over)return;
  const a=((ang%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
  const d=Math.abs(a-Math.PI*1.5);
  const dd=Math.min(d,Math.PI*2-d);
  if(dd<0.22){
    rung++;H.score(rung*50);hud.set("bd",rung+"/10");H.sfx("ok");H.beep(520,.3);
    speed+=0.12;
    if(rung>=10){over=true;return H.done({win:true,score:600,title:"Mestre do tempo!",sub:"10 badaladas no instante exato."});}
  }else{
    miss++;hud.set("er",miss+"/3");H.sfx("bad");
    if(miss>=3){over=true;return H.done({win:false,score:rung*50,title:"Sino rachado!",sub:rung+"/10. Espere a zona dourada!"});}
  }
}
H.btn(root,"🔔 BADALAR!",ring,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")ring();});
H.onTap(o,()=>ring());
H.loop(dt=>{
  if(over)return;
  t+=dt;ang+=speed*dt;
  const a=((ang%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
  const zone=Math.floor(a/(Math.PI/6));
  if(zone!==lastZone){lastZone=zone;H.beep(200,.03);}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;
  x.beginPath();x.arc(CX,CY,RR+18,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=4;x.stroke();
  // zona dourada (topo)
  x.strokeStyle=H.C.wasabi;x.lineWidth=14;
  x.beginPath();x.arc(CX,CY,RR,Math.PI*1.5-0.22,Math.PI*1.5+0.22);x.stroke();
  for(let i=0;i<12;i++){
    const aa=i*Math.PI/6;
    x.fillStyle=H.C.ink;
    x.beginPath();x.arc(CX+Math.cos(aa)*RR,CY+Math.sin(aa)*RR,4,0,7);x.fill();
  }
  x.strokeStyle=H.C.terra;x.lineWidth=6;
  x.beginPath();x.moveTo(CX,CY);
  x.lineTo(CX+Math.cos(a)*RR,CY+Math.sin(a)*RR);x.stroke();
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(CX,CY,8,0,7);x.fill();
  x.font="40px serif";x.fillText("🔔",CX-20,CY+RR+62);
  const d=Math.abs(a-Math.PI*1.5),dd=Math.min(d,Math.PI*2-d);
  if(dd<0.22){x.fillStyle=H.C.ok;x.font="bold 16px 'Space Mono',monospace";x.fillText("AGORA!",CX-34,40);}
});
}});
