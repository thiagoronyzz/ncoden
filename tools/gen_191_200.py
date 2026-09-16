#!/usr/bin/env python3
"""Gera games/g191..g200 — RITMO & MÚSICA (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 191 — Roda de Tambores
GAMES[191] = r"""/* NCODE N · 191 Roda de Tambores — 24 batidas no ponto! */
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
}});"""

# 192 — Violão Rítmico
GAMES[192] = r"""/* NCODE N · 192 Violão Rítmico — 30 notas nas cordas! */
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
}});"""

# 193 — Teclas de Piano
GAMES[193] = r"""/* NCODE N · 193 Teclas de Piano — 40 teclas, 3 vidas! */
GREG(193,{
init(root,H){
let over=false,t=0,tiles=[],lives=3,cleared=0,speed=220;
const hud=H.hud(root,[["tc","TECLAS","0/40"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Toque as <b>teclas pretas</b> (clique ou D/F/J/K) antes que cruzem a linha! 40 teclas, 3 vidas.");
const o=H.cvs(root,440,460),x=o.x;
const KEYS=["KeyD","KeyF","KeyJ","KeyK"];
const r=H.rng(21);
let lastL=-1;
for(let i=0;i<40;i++){
  let l=Math.floor(r()*4);
  if(l===lastL)l=(l+1)%4;
  lastL=l;
  tiles.push({y:-i*110-60,l,hit:false});
}
const LINE=o.H-80;
function strike(l){
  if(over)return;
  const tl=tiles.find(k=>!k.hit&&k.l===l&&k.y>LINE-130&&k.y<LINE+30);
  if(tl){tl.hit=true;cleared++;H.score(cleared*25);hud.set("tc",cleared+"/40");hud.set("sc",cleared*25);
    H.beep(300+l*90,.08);
    if(cleared>=40){over=true;return H.done({win:true,score:1100,title:"Pianista!",sub:"40 teclas sem errar o ritmo."});}
  }else{
    lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:cleared*25,title:"Tecla errada!",sub:cleared+"/40. Toque só as pretas na linha!"});}
  }
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;const i=KEYS.indexOf(c);if(i>=0)strike(i);});
H.onTap(o,(px,py)=>{const l=Math.floor(px/(o.W/4));if(l>=0&&l<4)strike(l);});
H.loop(dt=>{
  if(over)return;
  t+=dt;speed=220+cleared*4;
  tiles.forEach(tl=>{if(!tl.hit)tl.y+=speed*dt;});
  const miss=tiles.find(k=>!k.hit&&k.y>LINE+40);
  if(miss){miss.hit=true;lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:cleared*25,title:"Escapou!",sub:cleared+"/40 teclas."});}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let l=0;l<4;l++){
    x.strokeStyle=H.C.cement;
    x.beginPath();x.moveTo(l*o.W/4,0);x.lineTo(l*o.W/4,o.H);x.stroke();
  }
  tiles.forEach(tl=>{
    if(tl.hit)return;
    x.fillStyle=H.C.ink;
    x.fillRect(tl.l*o.W/4+4,tl.y,o.W/4-8,100);
  });
  x.strokeStyle=H.C.terra;x.lineWidth=4;
  x.beginPath();x.moveTo(0,LINE);x.lineTo(o.W,LINE);x.stroke();
});
}});"""

# 194 — DJ Mix
GAMES[194] = r"""/* NCODE N · 194 DJ Mix — 60s de pista cheia! */
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
}});"""

# 195 — Beat Box
GAMES[195] = r"""/* NCODE N · 195 Beat Box — copie 3 batidas! */
GREG(195,{
init(root,H){
const ROWS=[["🥁 kick",90],["👏 snare",280],["🎩 hat",520]];
const TARGETS=[
  [[1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0],[1,1,1,1,1,1,1,1]],
  [[1,0,1,0,1,0,0,0],[0,0,0,0,1,0,0,0],[0,1,0,1,0,1,0,1]],
  [[1,1,0,0,1,0,0,1],[0,0,1,0,0,0,1,0],[1,0,1,0,1,0,1,0]]
];
let over=false,rd=0,grid=[],step=0,acc=0,playing=true;
const hud=H.hud(root,[["bt","BATIDA","1/3"],["ps","PASSO",1]]);
const say=H.msg(root,"Clique nas células para montar a batida <b>igual ao alvo</b> (lado direito). O loop toca a SUA versão — confira de ouvido e aperte CONFERIR!");
const box=H.el("div","g-col",null,root);
function newRound(){
  grid=TARGETS[rd].map(()=>new Array(8).fill(0));
  hud.set("bt",(rd+1)+"/3");
  paint();
}
function paint(){
  box.innerHTML="";
  ROWS.forEach((rw,r)=>{
    const row=H.el("div","g-row",null,box);
    H.el("div","g-chip",rw[0],row);
    for(let s=0;s<8;s++){
      const b=H.el("button","g-btn"+(grid[r][s]?"":" ghost"),grid[r][s]?"●":"·",row);
      b.style.minWidth="34px";b.style.padding="4px";
      b.addEventListener("click",()=>{if(!over){grid[r][s]=grid[r][s]?0:1;H.sfx("tick");paint();}});
    }
    H.el("div","g-chip","🎯 "+TARGETS[rd][r].map(v=>v?"●":"·").join(""),row);
  });
}
newRound();
H.btn(root,"▶️/⏸️ loop",()=>{playing=!playing;H.sfx("tick");},false);
H.btn(root,"✅ Conferir batida",()=>{
  if(over)return;
  const ok=grid.every((row,r)=>row.every((v,s)=>v===TARGETS[rd][r][s]));
  if(ok){
    H.sfx("ok");rd++;
    if(rd>=3){over=true;return H.done({win:true,score:300,title:"Beatmaker!",sub:"3 batidas copiadas nota a nota."});}
    say("Batida "+rd+" pronta! Próxima…");newRound();
  }else{H.sfx("bad");say("❌ Diferente do alvo! Compare ● por ●.");}
},true);
H.loop(dt=>{
  if(over||!playing)return;
  acc+=dt;
  if(acc>0.28){
    acc=0;step=(step+1)%8;
    hud.set("ps",step+1);
    grid.forEach((row,r)=>{if(row[step])H.beep(ROWS[r][1],.07);});
  }
});
}});"""

# 196 — Xilofone Rolante
GAMES[196] = r"""/* NCODE N · 196 Xilofone Rolante — 20 bolinhas! */
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
}});"""

# 197 — Palmas no Beat
GAMES[197] = r"""/* NCODE N · 197 Palmas no Beat — 24 palmas cravadas! */
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
}});"""

# 198 — Torre dos Sinos
GAMES[198] = r"""/* NCODE N · 198 Torre dos Sinos — 5 melodias! */
GREG(198,{
init(root,H){
const BELLS=[["🔔 dó",261],["🔔 mi",329],["🔔 sol",392],["🔔 lá",440]];
let over=false,rd=0,seq=[],pos=0,showing=false,strikes=0;
const hud=H.hud(root,[["rd","RODADA","1/5"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Ouça a sequência e <b>repita nos sinos</b>! 5 rodadas (3→7 notas). 3 erros = fim.");
const box=H.el("div","g-row",null,root);
function newRound(){
  seq=[];
  for(let i=0;i<rd+3;i++)seq.push(Math.floor(Math.random()*4));
  pos=0;showing=true;
  hud.set("rd",(rd+1)+"/5");
  say("🎧 Ouça… ("+(rd+3)+" notas)");
  paint();
  seq.forEach((b,i)=>{
    H.after(700*(i+1),()=>{
      if(over)return;
      H.beep(BELLS[b][1],.25);flash(b);
      if(i===seq.length-1)H.after(400,()=>{if(!over){showing=false;say("🎵 Sua vez!");}});
    });
  });
}
function flash(b){
  const el=box.children[b];
  if(el){el.classList.add("hot");H.after(300,()=>el.classList.remove("hot"));}
}
function paint(){
  box.innerHTML="";
  BELLS.forEach((bl,i)=>{
    const b=H.el("button","g-btn ghost",bl[0],box);
    b.style.fontSize="20px";
    b.addEventListener("click",()=>{
      if(over||showing)return;
      H.beep(bl[1],.2);flash(i);
      if(i===seq[pos]){
        pos++;
        if(pos>=seq.length){
          H.sfx("ok");rd++;H.score(rd*60);
          if(rd>=5){over=true;return H.done({win:true,score:400,title:"Sineiro mestre!",sub:"5 melodias repetidas sem partitura."});}
          say("Melodia certa! Próxima…");
          H.after(800,newRound);
          showing=true;
        }
      }else{
        strikes++;hud.set("er",strikes+"/3");H.sfx("bad");
        if(strikes>=3){over=true;return H.done({win:false,score:rd*60,title:"Sinos desafinados!",sub:"3 erros. Ouça com atenção!"});}
        say("❌ Errou! Ouça de novo… ("+strikes+"/3)");
        pos=0;showing=true;
        H.after(600,()=>{
          seq.forEach((bb,ii)=>H.after(700*(ii+1),()=>{
            if(over)return;
            H.beep(BELLS[bb][1],.25);flash(bb);
            if(ii===seq.length-1)H.after(400,()=>{if(!over){showing=false;say("🎵 Sua vez!");}});
          }));
        });
      }
    });
  });
}
newRound();
}});"""

# 199 — Metrônomo Acelerado
GAMES[199] = r"""/* NCODE N · 199 Metrônomo Acelerado — 40 tempos, 60→160 BPM! */
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
}});"""

# 200 — Pulo Rítmico
GAMES[200] = r"""/* NCODE N · 200 Pulo Rítmico — 20 pulos no beat! */
GREG(200,{
init(root,H){
let over=false,t=0,gaps=[],jumped=0,lives=3,px=60,py=0,vy=0,jumpA=0;
const hud=H.hud(root,[["pu","PULOS","0/20"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Aperte <b>PULAR</b> (ou Espaço/toque) quando o marcador chegar na <b>zona verde</b>! 20 pulos, 3 vidas.");
const o=H.cvs(root,520,320),x=o.x;
for(let i=0;i<20;i++)gaps.push({t:1.5+i*0.62,hit:0});
function jump(){
  if(over)return;
  const g=gaps.find(k=>!k.hit&&Math.abs(k.t-t)<0.22);
  if(g){
    g.hit=1;jumped++;jumpA=1;vy=-300;
    H.score(jumped*25);hud.set("pu",jumped+"/20");hud.set("sc",jumped*25);H.sfx("ok");
    if(jumped>=20){over=true;return H.done({win:true,score:600,title:"Parkour musical!",sub:"20 pulos cravados no beat."});}
  }else{
    lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:jumped*25,title:"Tropeçou!",sub:jumped+"/20. Pule só na zona verde!"});}
  }
}
H.btn(root,"⬆️ PULAR!",jump,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")jump();});
H.onTap(o,()=>jump());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  gaps.forEach(g=>{
    if(!g.hit&&t>g.t+0.22){
      g.hit=-1;lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;H.done({win:false,score:jumped*25,title:"Tropeçou!",sub:jumped+"/20 pulos."});}
    }
  });
  if(over)return;
  jumpA=Math.max(0,jumpA-dt*3);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,240,o.W,80);
  const nx=gaps.find(g=>!g.hit);
  // corredor
  const run=(t*120)%o.W;
  x.font="30px serif";
  x.fillText("🏃",60,232-jumpA*60);
  // linha de tempo
  x.fillStyle=H.C.card;x.fillRect(40,60,o.W-80,40);
  x.fillStyle=H.C.ok;x.fillRect(o.W/2-30,60,60,40);
  gaps.forEach(g=>{
    if(g.hit)return;
    const gx=o.W/2+(g.t-t)*220;
    if(gx<40||gx>o.W-40)return;
    x.fillStyle=H.C.terra;
    x.beginPath();x.arc(gx,80,12,0,7);x.fill();
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("pule quando a bolinha entrar no verde!",130,130);
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
