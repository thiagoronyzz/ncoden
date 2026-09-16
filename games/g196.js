/* NCODE N · 196 Xilofone Rolante — 20 bolinhas! */
GREG(196,{
init(root,H){
const BARS=[261,294,330,392,440];
let over=false,t=0,balls=[],score=0,hit2=0,total=20;
const hud=H.hud(root,[["bl","BOLINHAS","0/20"],["pt","PONTOS",0]]);
const say=H.msg(root,"Toque a <b>barra</b> (clique ou 1–5) quando a bolinha chegar nela! 14+ acertos vencem.");
const o=H.cvs(root,480,400),x=o.x;
const r=H.rng(17);
for(let i=0;i<total;i++)balls.push({t:1.5+i*0.7,b:Math.floor(r()*5),hit:0});
const BAR_Y=o.H-90,SPEED=240;
function strike(b){
  if(over)return;
  const bl=balls.find(k=>!k.hit&&k.b===b&&Math.abs((k.t-t)*SPEED)<56);
  H.beep(BARS[b],.12);
  if(!bl){score=Math.max(0,score-10);H.score(score);hud.set("pt",score);return;}
  const e=Math.abs((bl.t-t)*SPEED);
  bl.hit=e<28?2:1;
  score+=e<28?100:50;hit2++;
  H.score(score);hud.set("bl",hit2+"/"+total);hud.set("pt",score);
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  const m=/^Digit([1-5])$/.exec(c);if(m)strike(+m[1]-1);});
H.onTap(o,(px,py)=>{
  const b=Math.floor(px/(o.W/5));
  if(b>=0&&b<5)strike(b);
});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  balls.forEach(b=>{if(!b.hit&&t>b.t+0.35)b.hit=-1;});
  if(balls.every(b=>b.hit!==0)){
    over=true;
    const good=balls.filter(b=>b.hit>0).length;
    if(good>=14)return H.done({win:true,score,title:"Xilofonista!",sub:good+"/20 bolinhas no ponto."});
    return H.done({win:false,score,title:"Fora do tom!",sub:"Só "+good+"/20 (precisa 14)."});
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const cols=["#D94E34","#E8A33D","#C4D645","#3E7C4F","#2E6E8A"];
  balls.forEach(b=>{
    if(b.hit)return;
    const y=(b.t-t)*SPEED+BAR_Y;
    if(y<-20||y>o.H+20)return;
    x.fillStyle=cols[b.b];
    x.beginPath();x.arc(o.W/10+b.b*o.W/5,y,13,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  });
  BARS.forEach((f,i)=>{
    x.fillStyle=cols[i];
    x.fillRect(i*o.W/5+8,BAR_Y,o.W/5-16,34);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(i*o.W/5+8,BAR_Y,o.W/5-16,34);
    x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";
    x.fillText(i+1,i*o.W/5+o.W/10-4,BAR_Y+22);
  });
});
}});
