#!/usr/bin/env python3
"""Gera games/g201..g210 — RITMO & MÚSICA (parte 2, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 201 — Karaokê de Notas
GAMES[201] = r"""/* NCODE N · 201 Karaokê de Notas — 24 notas na altura! */
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
}});"""

# 202 — Banda Marcial
GAMES[202] = r"""/* NCODE N · 202 Banda Marcial — 32 tempos com o maestro! */
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
}});"""

# 203 — Tambor de Chuva
GAMES[203] = r"""/* NCODE N · 203 Tambor de Chuva — 24 pingos musicados! */
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
}});"""

# 204 — Trem no Ritmo
GAMES[204] = r"""/* NCODE N · 204 Trem no Ritmo — 40 batidas nos trilhos! */
GREG(204,{
init(root,H){
let over=false,t=0,next=1.2,beat=0,wob=0,iv=0.7,wx=0;
const hud=H.hud(root,[["bt","BATIDAS","0/40"],["tr","TRILHOS","firmes"]]);
const say=H.msg(root,"Alimente a fornalha <b>NO RITMO</b> (botão, Espaço ou clique)! 3 balançadas e o trem descarrila. Ele acelera!");
const o=H.cvs(root,520,320),x=o.x;
function tap(){
  if(over||beat>=40)return;
  const e=Math.abs(t-next);
  if(e<iv*0.3){beat++;H.sfx("ok");iv=Math.max(0.38,0.7-beat*0.008);next+=iv;}
  else{wob++;wx=8;H.sfx("bad");hud.set("tr","BALANÇANDO "+wob+"/3");
    if(wob>=3){over=true;return H.done({win:false,score:beat*10,title:"DESCARRILOU!",sub:beat+"/40 batidas."});}
  }
  H.score(beat*10);hud.set("bt",beat+"/40");
  if(beat>=40){over=true;return H.done({win:true,score:500,title:"Expresso pontual!",sub:"40 batidas até a estação."});}
}
H.btn(root,"🔥 ALIMENTAR FORNALHA!",tap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")tap();});
H.onTap(o,()=>tap());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(wx>0)wx-=dt*20;
  if(t>next+iv*0.3&&beat<40){
    wob++;wx=8;next+=iv;H.sfx("bad");hud.set("tr","BALANÇANDO "+wob+"/3");
    if(wob>=3){over=true;return H.done({win:false,score:beat*10,title:"DESCARRILOU!",sub:beat+"/40 batidas."});}
  }
  if(Math.abs(t-next)<dt)H.beep(150,.08);
  const sh=wx>0?(Math.random()-.5)*wx:0;
  x.save();x.translate(sh,0);
  x.fillStyle=H.C.paper;x.fillRect(-20,0,o.W+40,o.H);
  x.fillStyle=H.C.ok;x.fillRect(-20,220,o.W+40,100);
  x.fillStyle="#5b3d20";
  for(let i=0;i<14;i++)x.fillRect(i*40-((t*120)%40),250,20,10);
  x.fillStyle="#8A877C";x.fillRect(-20,246,o.W+40,6);x.fillRect(-20,262,o.W+40,6);
  x.font="64px serif";
  x.fillText("🚂",60,240);
  x.fillText("🚃",150,240);x.fillText("🚃",230,240);
  const ph=H.clamp(1-Math.abs(t-next)/(iv*0.3),0,1);
  x.fillStyle=ph>0.5?H.C.wasabi:H.C.card;
  x.beginPath();x.arc(o.W/2,110,34+ph*10,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=4;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 13px 'Space Mono',monospace";
  x.fillText("velocidade "+Math.round(60/iv*2)+" km/h",180,70);
  x.restore();
});
}});"""

# 205 — Batimento Cardíaco
GAMES[205] = r"""/* NCODE N · 205 Batimento Cardíaco — 60s de calma! */
GREG(205,{
init(root,H){
let over=false,t=0,next=1.0,stab=70,iv=0.83,event=null,et=8;
const hud=H.hud(root,[["es","ESTABILIDADE",70],["tp","TEMPO",60]]);
const say=H.msg(root,"Toque <b>NO PULSO</b> (~72 BPM)! Eventos de estresse mudam o ritmo — leia o aviso e acompanhe. Zere = infarto!");
const o=H.cvs(root,500,320),x=o.x;
function tap(){
  if(over)return;
  const e=Math.abs(t-next);
  if(e<0.18){stab=Math.min(100,stab+3);H.sfx("ok");next+=iv;}
  else{stab-=8;H.sfx("bad");}
  hud.set("es",Math.floor(stab));
  if(stab<=0){over=true;return H.done({win:false,score:0,title:"INFARTO!",sub:"Estabilidade zerada."});}
}
H.btn(root,"❤️ PULSAR!",tap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")tap();});
H.onTap(o,()=>tap());
const EV=[["☕ Café! Ritmo acelera!",0.6],["😱 Susto! Uma pausa…",1.4],["🏃 Corrida! Mais rápido!",0.55],["🧘 Respire… devagar.",1.1]];
H.loop(dt=>{
  if(over)return;
  t+=dt;
  hud.set("tp",Math.max(0,Math.ceil(60-t)));
  if(t>=60){over=true;return H.done({win:true,score:Math.floor(stab)*5,title:"Coração zen!",sub:"60s de batidas estáveis."});}
  et-=dt;
  if(et<=0){
    et=10+Math.random()*6;
    event=EV[Math.floor(Math.random()*EV.length)];
    iv=event[1];next=t+iv;
    say("⚠️ "+event[0]+" (novo pulso a cada "+iv.toFixed(2)+"s)");
    H.sfx("bad");
  }
  if(t>next+0.18){
    stab-=8;next+=iv;H.sfx("bad");hud.set("es",Math.floor(stab));
    if(stab<=0){over=true;return H.done({win:false,score:0,title:"INFARTO!",sub:"Pulso perdido."});}
  }
  if(Math.abs(t-next)<dt)H.beep(70,.1);
  x.fillStyle="#2b1215";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.terra;x.lineWidth=3;
  x.beginPath();
  for(let px=0;px<o.W;px+=6){
    const tt=t-px/120;
    const cyc=((tt%iv)+iv)%iv;
    let v=0;
    if(cyc<0.08)v=-40*(cyc/0.08);
    else if(cyc<0.16)v=-40+70*((cyc-0.08)/0.08);
    else if(cyc<0.3)v=30-30*((cyc-0.16)/0.14);
    const y=160+v;
    px===0?x.moveTo(px,y):x.lineTo(px,y);
  }
  x.stroke();
  const near=Math.abs(t-next)<0.18;
  x.font="54px serif";
  x.fillText(near?"❤️":"🖤",o.W/2-27,90);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("pulso a cada "+iv.toFixed(2)+"s · estabilidade "+Math.floor(stab)+"%",130,290);
});
}});"""

# 206 — Carrilhão do Relógio
GAMES[206] = r"""/* NCODE N · 206 Carrilhão do Relógio — 10 badaladas! */
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
}});"""

# 207 — Surf de Ondas
GAMES[207] = r"""/* NCODE N · 207 Surf de Ondas — 20 cristas! */
GREG(207,{
init(root,H){
let over=false,t=0,lane=1,score=0,hit2=0,total=20,ph=0;
const hud=H.hud(root,[["cr","CRISTAS","0/20"],["pt","PONTOS",0]]);
const say=H.msg(root,"Setas ←→/A-D ou toque na raia! Quando a onda <b>quebrar</b> (círculo verde), esteja na <b>raia da crista</b>!");
const o=H.cvs(root,500,360),x=o.x;
const r=H.rng(51);
const waves=[];
for(let i=0;i<total;i++)waves.push({t:2+i*0.9,l:Math.floor(r()*3),hit:0});
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowLeft"||c==="KeyA")lane=Math.max(0,lane-1);
  if(c==="ArrowRight"||c==="KeyD")lane=Math.min(2,lane+1);});
H.onTap(o,(px,py)=>{lane=H.clamp(Math.floor(px/(o.W/3)),0,2);H.sfx("tick");});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  waves.forEach(w=>{
    if(w.hit||t<w.t)return;
    w.hit=lane===w.l?1:-1;
    if(w.hit>0){score+=100;hit2++;H.sfx("ok");}
    else{score=Math.max(0,score-30);H.sfx("bad");}
    H.score(score);hud.set("cr",hit2+"/"+total);hud.set("pt",score);
  });
  if(waves.every(w=>w.hit!==0)){
    over=true;
    if(hit2>=14)return H.done({win:true,score,title:"Surfista!",sub:hit2+"/20 cristas surfadas."});
    return H.done({win:false,score,title:"Caldo!",sub:"Só "+hit2+"/20 (precisa 14)."});
  }
  x.fillStyle="#123a4d";x.fillRect(0,0,o.W,o.H);
  for(let l=0;l<3;l++){
    x.fillStyle=l===lane?"rgba(196,214,69,.15)":"transparent";
    x.fillRect(l*o.W/3,0,o.W/3,o.H);
    x.strokeStyle="rgba(255,255,255,.2)";
    x.beginPath();x.moveTo(l*o.W/3,0);x.lineTo(l*o.W/3,o.H);x.stroke();
  }
  const nx=waves.find(w=>!w.hit);
  waves.forEach(w=>{
    if(w.hit||w.t<t-0.2)return;
    const lead=w.t-t;
    if(lead>1.5)return;
    const cx=o.W/6+w.l*o.W/3;
    const rr=20+lead*70;
    x.strokeStyle=lead<0.25?H.C.wasabi:"#fff";x.lineWidth=3;
    x.beginPath();x.arc(cx,140,Math.max(8,rr),0,7);x.stroke();
  });
  x.strokeStyle=H.C.wasabi;x.lineWidth=4;
  x.beginPath();x.arc(o.W/2,140,22,0,7);x.stroke();
  x.font="34px serif";
  x.fillText("🏄",o.W/6+lane*o.W/3-17,300+Math.sin(t*4)*8);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("fique na raia quando o círculo fechar!",120,340);
});
}});"""

# 208 — Datilografia Jazz
GAMES[208] = r"""/* NCODE N · 208 Datilografia Jazz — 10 palavras no swing! */
GREG(208,{
init(root,H){
const WORDS=["JAZZ","SWING","BLUES","RITMO","ACORDE","TEMPO","BATIDA","MELODIA","SAMBA","GROOVE"];
let over=false,wi=0,buf="",t=0,dead=8,score=0,err=0;
const hud=H.hud(root,[["pv","PALAVRAS","0/10"],["tp","PRAZO",8],["pt","PONTOS",0]]);
const say=H.msg(root,"Digite a palavra antes do prazo (teclado físico ou botões)! Erro apaga tudo. 10 palavras, 3 furos = fim.");
const box=H.el("div","g-col",null,root);
const wd=H.el("div","g-msg","",box);
function paint(){
  wd.innerHTML="🎷 <b>"+WORDS[wi]+"</b> → "+(buf||"_")+" ("+buf.length+"/"+WORDS[wi].length+")";
}
paint();
const kb=H.keys();
kb.on((c,d,ev)=>{
  if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(m)feed(m[1]);
});
function feed(ch){
  if(over)return;
  const want=WORDS[wi][buf.length];
  if(ch===want){
    buf+=ch;H.sfx("tick");H.beep(400+buf.length*40,.05);
    if(buf.length>=WORDS[wi].length){
      score+=100+Math.floor(dead)*10;H.score(score);
      hud.set("pv",(wi+1)+"/10");hud.set("pt",score);H.sfx("ok");
      wi++;buf="";dead=8;
      if(wi>=WORDS.length){over=true;return H.done({win:true,score:score+100,title:"Datilógrafo jazz!",sub:"10 palavras no swing da máquina."});}
    }
  }else{buf="";H.sfx("bad");say("❌ Errou! Palavra zerada.");}
  paint();
}
"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").forEach(ch=>{
  // botões só para vogais+comuns? todos, em linhas
});
const rows=["QWERTYUIOP","ASDFGHJKL","ZXCVBNM"];
rows.forEach(rw=>{
  const row=H.el("div","g-row",null,box);
  rw.split("").forEach(ch=>{
    const b=H.el("button","g-btn ghost",ch,row);
    b.style.minWidth="28px";b.style.padding="4px 2px";b.style.fontSize="12px";
    b.addEventListener("click",()=>feed(ch));
  });
});
H.loop(dt=>{
  if(over)return;
  dead-=dt;hud.set("tp",Math.max(0,Math.ceil(dead)));
  if(dead<=0){
    err++;buf="";dead=8;H.sfx("bad");paint();
    say("⏰ Prazo! ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score,title:"Máquina emperrou!",sub:wi+"/10 palavras."});}
  }
});
}});"""

# 209 — Dança de Sapateado
GAMES[209] = r"""/* NCODE N · 209 Dança de Sapateado — 32 passos! */
GREG(209,{
init(root,H){
let over=false,t=0,steps=[],done=0,err=0;
const hud=H.hud(root,[["ps","PASSOS","0/32"],["er","ERROS","0/5"]]);
const say=H.msg(root,"Siga o padrão: <b>← pé esquerdo / → pé direito</b> (setas, A/D ou botões), um por batida! 5 erros = fim.");
const o=H.cvs(root,500,300),x=o.x;
const r=H.rng(61);
const PAT=[];
for(let i=0;i<32;i++)PAT.push(r()<.5?"L":"R");
PAT.forEach((p,i)=>steps.push({t:1.5+i*0.5,p,hit:0}));
function step(foot){
  if(over)return;
  const s=steps.find(k=>!k.hit&&Math.abs(k.t-t)<0.22);
  if(s&&s.p===foot){
    s.hit=1;done++;H.score(done*20);hud.set("ps",done+"/32");
    H.sfx("ok");H.beep(foot==="L"?300:380,.07);
    if(done>=32){over=true;return H.done({win:true,score:740,title:"Sapateador!",sub:"32 passos sem pisar fora!"});
  }
}else{
    err++;hud.set("er",err+"/5");H.sfx("bad");
    if(s)s.hit=-1;
    if(err>=5){over=true;return H.done({win:false,score:done*20,title:"Tropeçou!",sub:done+"/32 passos."});}
  }
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowLeft"||c==="KeyA")step("L");
  if(c==="ArrowRight"||c==="KeyD")step("R");});
const row=H.el("div","g-row",null,root);
H.btn(row,"🦶 ESQUERDO",()=>step("L"),false);
H.btn(row,"DIREITO 🦶",()=>step("R"),false);
H.loop(dt=>{
  if(over)return;
  t+=dt;
  steps.forEach(s=>{
    if(!s.hit&&t>s.t+0.22){
      s.hit=-1;err++;hud.set("er",err+"/5");H.sfx("bad");
      if(err>=5){over=true;H.done({win:false,score:done*20,title:"Tropeçou!",sub:done+"/32 passos."});}
    }
  });
  if(over)return;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.font="54px serif";
  x.fillText("💃",o.W/2-27,120);
  const nx=steps.find(s=>!s.hit);
  x.font="bold 20px 'Space Mono',monospace";
  steps.forEach((s,i)=>{
    if(s.hit||s.t<t-0.3||i>done+6)return;
    const gx=60+(s.t-t)*160;
    if(gx<20||gx>o.W-20)return;
    x.fillStyle=s.p==="L"?"#2E6E8A":H.C.terra;
    x.fillText(s.p==="L"?"◀ L":"R ▶",gx,220);
  });
  x.fillStyle=H.C.ink;
  x.fillRect(o.W/2-2,160,4,100);
  x.font="13px 'Space Mono',monospace";
  x.fillText("pise o pé certo na linha!",160,270);
});
}});"""

# 210 — Câmara de Eco
GAMES[210] = r"""/* NCODE N · 210 Câmara de Eco — 5 ecos rítmicos! */
GREG(210,{
init(root,H){
const PADS=[["🔴",220],["🟢",277],["🔵",330]];
let over=false,rd=0,seq=[],pos=0,showing=false,strikes=0,lastT=0;
const hud=H.hud(root,[["rd","RODADA","1/5"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Ouça o eco (pad + ritmo) e <b>repita igual, no mesmo ritmo</b>! 5 rodadas. 3 erros = fim.");
const box=H.el("div","g-row",null,root);
const r=H.rng(Date.now()%10000);
function newRound(){
  seq=[];let tt=0;
  const n=rd+3;
  for(let i=0;i<n;i++){tt+=0.45+r()*0.5;seq.push({p:Math.floor(r()*3),dt:tt});}
  pos=0;showing=true;
  hud.set("rd",(rd+1)+"/5");
  say("🎧 Ouça o eco… ("+n+" toques)");
  paint();
  seq.forEach((s,i)=>{
    H.after(s.dt*1000,()=>{
      if(over)return;
      H.beep(PADS[s.p][1],.2);flash(s.p);
      if(i===seq.length-1)H.after(500,()=>{if(!over){showing=false;lastT=performance.now();say("🔁 Sua vez — mesmo ritmo!");}});
    });
  });
}
function flash(p){
  const el=box.children[p];
  if(el){el.classList.add("hot");H.after(250,()=>el.classList.remove("hot"));}
}
function paint(){
  box.innerHTML="";
  PADS.forEach((pd,i)=>{
    const b=H.el("button","g-btn ghost",pd[0],box);
    b.style.fontSize="26px";b.style.minWidth="90px";
    b.addEventListener("click",()=>{
      if(over||showing)return;
      const now=performance.now();
      const want=pos===0?0:seq[pos].dt-seq[pos-1].dt;
      const got=pos===0?0:(now-lastT)/1000;
      lastT=now;
      H.beep(pd[1],.15);flash(i);
      const okPad=i===seq[pos].p;
      const okTime=pos===0?true:Math.abs(got-want)<0.3;
      if(okPad&&okTime){
        pos++;
        if(pos>=seq.length){
          H.sfx("ok");rd++;H.score(rd*80);
          if(rd>=5){over=true;return H.done({win:true,score:500,title:"Eco perfeito!",sub:"5 padrões repetidos no ritmo exato."});}
          say("Eco certo! Próximo…");
          showing=true;H.after(800,newRound);
        }
      }else{
        strikes++;hud.set("er",strikes+"/3");H.sfx("bad");
        if(strikes>=3){over=true;return H.done({win:false,score:rd*80,title:"Eco perdido!",sub:!okPad?"Pad errado!":"Ritmo errado! Ouça os intervalos."});}
        say("❌ "+(!okPad?"Pad errado!":"Fora do ritmo!")+" Ouça de novo… ("+strikes+"/3)");
        pos=0;showing=true;
        H.after(600,()=>{
          seq.forEach((s2,i)=>{
            H.after(s2.dt*1000,()=>{
              if(over)return;
              H.beep(PADS[s2.p][1],.2);flash(s2.p);
              if(i===seq.length-1)H.after(500,()=>{if(!over){showing=false;lastT=performance.now();say("🔁 Sua vez!");}});
            });
          });
        });
      }
    });
  });
}
newRound();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
