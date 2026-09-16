/* NCODE N · 192 Violão Rítmico — 30 notas nas cordas! */
GREG(192,{
init(root,H){
const KEYS=["KeyD","KeyF","KeyJ","KeyK"],FR=[196,247,294,392];
let over=false,t=0,notes=[],score=0,hit2=0,total=30;
const hud=H.hud(root,[["nt","NOTAS","0/30"],["pt","PONTOS",0]]);
const say=H.msg(root,"Teclas <b>D F J K</b> ou toque na corda quando a nota cruzar a <b>linha</b>! 70% para vencer.");
const o=H.cvs(root,440,420),x=o.x;
const r=H.rng(11);
for(let i=0;i<total;i++)notes.push({t:2+i*0.55,l:Math.floor(r()*4),hit:0});
const HIT=o.H-70,SPEED=260;
function strike(l){
  if(over)return;
  const n=notes.find(k=>!k.hit&&k.l===l&&Math.abs(HIT-((k.t-t)*SPEED+HIT))<52);
  H.beep(FR[l],.1);
  if(!n){score=Math.max(0,score-10);H.score(score);hud.set("pt",score);return;}
  const e=Math.abs((n.t-t)*SPEED);
  n.hit=e<26?2:1;
  score+=e<26?100:50;hit2++;
  H.score(score);hud.set("nt",hit2+"/"+total);hud.set("pt",score);
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;const i=KEYS.indexOf(c);if(i>=0)strike(i);});
H.onTap(o,(px,py)=>{const l=Math.floor(px/(o.W/4));if(l>=0&&l<4)strike(l);});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  notes.forEach(n=>{if(!n.hit&&t>n.t+0.3)n.hit=-1;});
  const judged=notes.filter(n=>n.hit!==0).length;
  if(judged>=total){
    over=true;
    const good=notes.filter(n=>n.hit>0).length;
    if(good>=21)return H.done({win:true,score,title:"Show de violão!",sub:good+"/30 notas no tempo."});
    return H.done({win:false,score,title:"Cordas desafinadas!",sub:"Só "+good+"/30 (precisa 21)."});
  }
  x.fillStyle="#3a2a20";x.fillRect(0,0,o.W,o.H);
  for(let l=0;l<4;l++){
    x.strokeStyle="#C9A06F";x.lineWidth=2;
    x.beginPath();x.moveTo(o.W/8+l*o.W/4,0);x.lineTo(o.W/8+l*o.W/4,o.H);x.stroke();
  }
  x.strokeStyle=H.C.wasabi;x.lineWidth=4;
  x.beginPath();x.moveTo(0,HIT);x.lineTo(o.W,HIT);x.stroke();
  notes.forEach(n=>{
    if(n.hit)return;
    const y=(n.t-t)*SPEED+HIT;
    if(y<-20||y>o.H+20)return;
    x.fillStyle=n.hit<0?"#555":H.C.wasabi;
    x.beginPath();x.arc(o.W/8+n.l*o.W/4,y,14,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  });
  x.fillStyle="#fff";x.font="bold 13px 'Space Mono',monospace";
  KEYS.forEach((k,l)=>x.fillText(k.replace("Key",""),o.W/8+l*o.W/4-6,o.H-12));
});
}});
