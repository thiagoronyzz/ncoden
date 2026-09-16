/* NCODE N · 201 Karaokê de Notas — 24 notas na altura! */
GREG(201,{
init(root,H){
let over=false,t=0,notes=[],pitch=1,score=0,hit2=0,total=24;
const FR=[261,329,392,523];
const hud=H.hud(root,[["nt","NOTAS","0/24"],["pt","PONTOS",0]]);
const say=H.msg(root,"As notas vêm rolando! Deixe selecionada a <b>altura certa</b> (1–4 ou toque na faixa) quando a nota cruzar o cursor!");
const o=H.cvs(root,500,360),x=o.x;
const r=H.rng(29);
for(let i=0;i<total;i++){
  const p=i===0?1:H.clamp(notes[i-1].p+Math.floor(r()*3)-1,0,3);
  notes.push({t:2+i*0.62,p,hit:0});
}
const CUR=120,SPEED=220;
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  const m=/^Digit([1-4])$/.exec(c);
  if(m){pitch=+m[1]-1;H.beep(FR[pitch],.08);}});
H.onTap(o,(px,py)=>{
  const p=Math.floor(py/(o.H/4));
  if(p>=0&&p<4){pitch=p;H.beep(FR[pitch],.08);}
});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  notes.forEach(n=>{
    if(n.hit||t<n.t)return;
    n.hit=pitch===n.p?1:-1;
    if(n.hit>0){score+=100;hit2++;H.sfx("ok");}
    else{score=Math.max(0,score-20);H.sfx("bad");}
    H.score(score);hud.set("nt",hit2+"/"+total);hud.set("pt",score);
  });
  if(notes.every(n=>n.hit!==0)){
    over=true;
    if(hit2>=17)return H.done({win:true,score,title:"Voz de ouro!",sub:hit2+"/24 notas na altura certa."});
    return H.done({win:false,score,title:"Desafinado!",sub:"Só "+hit2+"/24 (precisa 17)."});
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const cols=["#D94E34","#E8A33D","#3E7C4F","#2E6E8A"];
  notes.forEach(n=>{
    if(n.hit)return;
    const nx=CUR+(n.t-t)*SPEED;
    if(nx<-20||nx>o.W+20)return;
    x.fillStyle=cols[n.p];
    x.beginPath();x.arc(nx,o.H/8+n.p*o.H/4,14,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  });
  for(let p=0;p<4;p++){
    x.fillStyle=p===pitch?"rgba(0,0,0,.12)":"transparent";
    x.fillRect(0,p*o.H/4,CUR,o.H/4);
    x.strokeStyle=cols[p];x.lineWidth=p===pitch?4:1;
    x.beginPath();x.moveTo(0,o.H/8+p*o.H/4);x.lineTo(o.W,o.H/8+p*o.H/4);x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
    x.fillText(p+1,8,o.H/8+p*o.H/4-16);
  }
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(CUR,0);x.lineTo(CUR,o.H);x.stroke();
});
}});
