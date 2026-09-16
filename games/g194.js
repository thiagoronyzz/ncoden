/* NCODE N · 194 DJ Mix — 60s de pista cheia! */
GREG(194,{
init(root,H){
let over=false,t=0,fader=50,score=0,beatT=0,beatOn=false;
const hud=H.hud(root,[["en","ENERGIA",0],["tp","TEMPO",60]]);
const say=H.msg(root,"ARRASTE o crossfader para seguir o <b>alvo verde</b>! Aperte <b>BEAT</b> (ou Espaço) quando o anel pulsar! Energia 70+ vence.");
const o=H.cvs(root,480,360),x=o.x;
const ptr=H.ptr(o);
function target(tt){return 50+38*Math.sin(tt*.9)+12*Math.sin(tt*2.3);}
function beat(){
  if(over)return;
  if(beatOn){score+=8;H.sfx("ok");}
  else{score=Math.max(0,score-4);H.sfx("bad");}
  H.score(Math.floor(score));hud.set("en",Math.floor(score));
}
H.btn(root,"🥁 BEAT!",beat,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")beat();});
H.loop(dt=>{
  if(over)return;
  t+=dt;beatT+=dt;
  hud.set("tp",Math.max(0,Math.ceil(60-t)));
  if(t>=60){
    over=true;
    if(score>=70)return H.done({win:true,score:Math.floor(score)+100,title:"DJ estrela!",sub:"Pista lotada até o fim!"});
    return H.done({win:false,score:Math.floor(score),title:"Pista esvaziou!",sub:"Energia "+Math.floor(score)+"/70. Siga o alvo + beats!"});
  }
  if(ptr.down&&ptr.y>140&&ptr.y<260)fader=H.clamp((ptr.x-60)/(o.W-120)*100,0,100);
  const tg=target(t);
  const err=Math.abs(fader-tg);
  if(err<10)score+=dt*3;
  else if(err<22)score+=dt*1;
  else score=Math.max(0,score-dt*2);
  H.score(Math.floor(score));hud.set("en",Math.floor(score));
  const ph=(beatT%0.5)/0.5;
  beatOn=ph<0.25;
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  // toca-discos
  [100,o.W-100].forEach((cx,i)=>{
    x.save();x.translate(cx,80);x.rotate(t*(2+i));
    x.fillStyle="#333";x.beginPath();x.arc(0,0,44,0,7);x.fill();
    x.strokeStyle=i===0?H.C.wasabi:H.C.terra;x.lineWidth=3;x.stroke();
    x.fillStyle="#888";x.beginPath();x.arc(0,0,8,0,7);x.fill();
    x.restore();
    x.fillStyle="#fff";x.font="11px 'Space Mono',monospace";
    x.fillText(i===0?"FAIXA A":"FAIXA B",cx-32,140);
  });
  // crossfader
  x.fillStyle="#444";x.fillRect(60,180,o.W-120,16);
  x.fillStyle=H.C.ok;
  x.fillRect(60+tg/100*(o.W-120)-8,172,16,32);
  x.fillStyle="#fff";
  x.fillRect(60+fader/100*(o.W-120)-5,168,10,40);
  x.strokeStyle=H.C.ink;x.strokeRect(60+fader/100*(o.W-120)-5,168,10,40);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("arraste o fader branco até o verde!",130,220);
  // anel do beat
  x.strokeStyle=beatOn?H.C.wasabi:"#555";x.lineWidth=beatOn?6:3;
  x.beginPath();x.arc(o.W/2,290,26+ph*14,0,7);x.stroke();
  x.fillStyle="#fff";x.font="bold 13px 'Space Mono',monospace";
  x.fillText("BEAT",o.W/2-20,294);
});
}});
