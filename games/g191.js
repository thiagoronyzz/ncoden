/* NCODE N · 191 Roda de Tambores — 24 batidas no ponto! */
GREG(191,{
init(root,H){
const DR=[{e:"🥁",k:"A",f:110},{e:"🪘",k:"S",f:180},{e:"🥁",k:"D",f:260}];
let over=false,t=0,beats=[],score=0,done=0;
const hud=H.hud(root,[["bt","BATIDAS","0/24"],["pt","PONTOS",0]]);
const say=H.msg(root,"Toque o tambor (clique ou A/S/D) quando o <b>círculo fechar</b>! 24 batidas, precisa de 70%.");
const o=H.cvs(root,480,340),x=o.x;
const r=H.rng(7);
for(let i=0;i<24;i++)beats.push({t:1.5+i*(i<8?0.8:i<16?0.65:0.5),d:Math.floor(r()*3),hit:0});
function hit(d){
  if(over)return;
  const b=beats.find(k=>!k.hit&&k.d===d&&Math.abs(k.t-t)<0.32);
  H.beep(DR[d].f,.12);
  if(!b){score=Math.max(0,score-10);H.score(score);hud.set("pt",score);return;}
  const e=Math.abs(b.t-t);
  b.hit=e<0.16?2:1;
  score+=e<0.16?100:50;done++;
  H.score(score);hud.set("bt",done+"/24");hud.set("pt",score);
  check();
}
function check(){
  if(over)return;
  if(done>=24||t>beats[23].t+1){
    const judged=beats.filter(b=>b.hit).length;
    const sc2=beats.reduce((a,b)=>a+(b.hit===2?100:b.hit===1?50:0),0);
    if(judged>=17){over=true;return H.done({win:true,score:sc2,title:"Samba no pé!",sub:judged+"/24 batidas no ritmo."});}
    if(done>=24||t>beats[23].t+1){over=true;
      return H.done({win:false,score:sc2,title:"Fora do compasso!",sub:"Só "+judged+"/24 (precisa 17). Toque no círculo!"});
    }
  }
}
const kb=H.keys();
kb.on((c,dd)=>{if(!dd)return;
  if(c==="KeyA")hit(0);if(c==="KeyS")hit(1);if(c==="KeyD")hit(2);});
H.onTap(o,(px,py)=>{
  const i=Math.floor(px/(o.W/3));
  if(i>=0&&i<3)hit(i);
});
H.loop(dt=>{
  if(over)return;
  t+=dt;check();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  beats.forEach(b=>{
    if(b.hit||b.t<t-0.4)return;
    const lead=b.t-t;
    if(lead>1.6)return;
    const cx=o.W/6+b.d*o.W/3,cy=100;
    const rr=20+lead*60;
    x.strokeStyle=lead<0?H.C.terra:H.C.ink;x.lineWidth=3;
    x.beginPath();x.arc(cx,cy,rr,0,7);x.stroke();
  });
  x.font="64px serif";
  DR.forEach((d,i)=>{
    const cx=o.W/6+i*o.W/3;
    x.fillText(d.e,cx-32,132);
    x.fillStyle=H.C.ink;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("["+d.k+"]",cx-12,170);
    x.font="64px serif";
  });
  x.fillStyle=H.C.ink;x.font="13px 'Space Mono',monospace";
  x.fillText("acerte quando o círculo encostar!",110,220);
});
}});
