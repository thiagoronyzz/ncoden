/* NCODE N · 203 Tambor de Chuva — 24 pingos musicados! */
GREG(203,{
init(root,H){
const FR=[220,277,330,415];
let over=false,t=0,drops=[],score=0,hit2=0,total=24;
const hud=H.hud(root,[["pg","PINGOS","0/24"],["pt","PONTOS",0]]);
const say=H.msg(root,"Toque a <b>poça</b> (clique ou 1–4) quando o pingo cair nela! 17+ acertos vencem.");
const o=H.cvs(root,480,400),x=o.x;
const r=H.rng(41);
for(let i=0;i<total;i++)drops.push({t:1.5+i*0.66,p:Math.floor(r()*4),hit:0});
const PY=o.H-70,SPEED=300;
function strike(p){
  if(over)return;
  const d=drops.find(k=>!k.hit&&k.p===p&&Math.abs((k.t-t)*SPEED)<60);
  H.beep(FR[p],.1);
  if(!d){score=Math.max(0,score-10);H.score(score);hud.set("pt",score);return;}
  const e=Math.abs((d.t-t)*SPEED);
  d.hit=e<30?2:1;
  score+=e<30?100:50;hit2++;
  H.score(score);hud.set("pg",hit2+"/"+total);hud.set("pt",score);
}
const kb=H.keys();
kb.on((c,dd)=>{if(!dd)return;
  const m=/^Digit([1-4])$/.exec(c);if(m)strike(+m[1]-1);});
H.onTap(o,(px,py)=>{
  const p=Math.floor(px/(o.W/4));
  if(p>=0&&p<4)strike(p);
});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  drops.forEach(d=>{if(!d.hit&&t>d.t+0.3)d.hit=-1;});
  if(drops.every(d=>d.hit!==0)){
    over=true;
    const good=drops.filter(d=>d.hit>0).length;
    if(good>=17)return H.done({win:true,score,title:"Sinfonia da chuva!",sub:good+"/24 pingos no tempo."});
    return H.done({win:false,score,title:"Chuva passageira!",sub:"Só "+good+"/24 (precisa 17)."});
  }
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  drops.forEach(d=>{
    if(d.hit)return;
    const y=(d.t-t)*SPEED+PY;
    if(y<-10||y>o.H+10)return;
    x.fillStyle="#7FB3D5";
    x.beginPath();x.ellipse(o.W/8+d.p*o.W/4,y,7,12,0,0,7);x.fill();
  });
  for(let p=0;p<4;p++){
    x.fillStyle="#2E6E8A";
    x.beginPath();x.ellipse(o.W/8+p*o.W/4,PY,44,16,0,0,7);x.fill();
    x.strokeStyle="#7FB3D5";x.lineWidth=2;x.stroke();
    x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";
    x.fillText(p+1,o.W/8+p*o.W/4-4,PY+32);
  }
});
}});
