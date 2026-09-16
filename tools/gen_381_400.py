#!/usr/bin/env python3
"""Gera games/g381..g400 — TIMING (final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 381 — Cronômetro Perfeito
GAMES[381] = r"""/* NCODE N · 381 Cronômetro Perfeito — pare nos 5,00s! */
GREG(381,{
init(root,H){
let over=false,t=0,run=false,round=0,errs=[];
const hud=H.hud(root,[['r','TENTATIVA','1/5'],['e','ERRO','—']]);
const say=H.msg(root,'Toque INICIAR e PARE o mais perto de 5,00s! 5 tentativas. Erro médio < 0,30s vence!');
const o=H.cvs(root,460,220),x=o.x;
const brow=H.el('div','g-row',null,root);
H.btn(brow,'▶️ INICIAR',()=>{
 if(over||run)return;
 t=0;run=true;H.sfx('tick');
},false);
H.btn(brow,'⏹️ PARAR!',()=>{
 if(over||!run)return;
 run=false;
 const e=Math.abs(t-5);
 errs.push(e);round++;
 H.sfx(e<.15?'ok':'bad');
 hud.set('r',Math.min(5,round+1)+'/5');hud.set('e',e.toFixed(2)+'s');
 say(e<.05?'🎯 PERFEITO! '+t.toFixed(2)+'s':e<.15?'Ótimo! '+t.toFixed(2)+'s':'Foi '+t.toFixed(2)+'s (erro '+e.toFixed(2)+'s)');
 if(round>=5)gameOver();
},true);
function gameOver(){over=true;
 const avg=errs.reduce((a,b)=>a+b,0)/5;
 const sc=Math.max(0,500-avg*800|0);H.score(sc);
H.done({win:avg<.3,score:sc,title:avg<.3?'⏱️ Precisão cirúrgica!':'⏱️ Fim!',sub:'Erro médio: '+avg.toFixed(2)+'s.'});}
H.loop(dt=>{
 if(run)t+=dt;
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,220);
 x.fillStyle=run?'#C4D645':'#4A4A44';x.font='bold 72px system-ui';x.textAlign='center';
 x.fillText(run?t.toFixed(2):(errs.length?t.toFixed(2):'0.00'),230,120);
 x.fillStyle='#E8A33D';x.font='bold 18px system-ui';
 x.fillText('META: 5.00s',230,160);
 x.fillStyle='#fff';x.font='14px system-ui';x.textAlign='left';
 x.fillText('Tentativas: '+errs.map(e=>e.toFixed(2)).join('  '),14,200);
});
}});"""

# 382 — Pêndulo no Alvo
GAMES[382] = r"""/* NCODE N · 382 Pêndulo no Alvo — solte no ponto! */
GREG(382,{
init(root,H){
let over=false,a=1,av=0,round=0,hits=0,released=false,ba=null;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['a','ACERTOS','0/5']]);
const say=H.msg(root,'O pêndulo balança! Toque SOLTAR quando passar pelo CENTRO para acertar o alvo. 5 tentativas, 3+ acertos!');
const o=H.cvs(root,460,400),x=o.x;
H.btn(root,'🎯 SOLTAR!',()=>{
 if(over||released)return;
 released=true;
 const err=Math.abs(a);
 ba={x:230+Math.sin(a)*220,y:120+Math.cos(a)*220,vy:0};
 if(err<.18){hits++;H.sfx('ok');say('🎯 ACERTOU!');}
 else{H.sfx('bad');say('❌ Errou por '+(err*57|0)+'°!');}
 hud.set('a',hits+'/5');
 round++;
 H.after(1200,()=>{
  if(over)return;
  if(round>=5){gameOver();return;}
  a=1;av=0;released=false;ba=null;
  hud.set('t',(round+1)+'/5');
 });
},true);
function gameOver(){over=true;H.score(hits*100);
H.done({win:hits>=3,score:hits*100,title:hits>=3?'🎯 Mira de mestre!':'🎯 Fim!',sub:hits+'/5 acertos.'});}
H.loop(dt=>{
 if(over)return;
 if(!released){av+=-9.8/2.2*Math.sin(a)*dt;a+=av*dt;}
 else if(ba){ba.vy+=900*dt;ba.y+=ba.vy*dt;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,400);
 x.fillStyle='#D94E34';x.beginPath();x.arc(230,360,26,0,7);x.fill();
 x.fillStyle='#FAF7F0';x.beginPath();x.arc(230,360,14,0,7);x.fill();
 x.fillStyle='#D94E34';x.beginPath();x.arc(230,360,6,0,7);x.fill();
 const px=230+Math.sin(a)*220,py=120+Math.cos(a)*220;
 x.strokeStyle='#181816';x.lineWidth=4;
 x.beginPath();x.moveTo(230,120);x.lineTo(released?230:px,released?120:py);x.stroke();
 x.fillStyle='#181816';x.fillRect(220,112,20,10);
 if(!released){x.fillStyle='#2E6E8A';x.beginPath();x.arc(px,py,16,0,7);x.fill();}
 else if(ba&&ba.y<380){x.fillStyle='#2E6E8A';x.beginPath();x.arc(ba.x,Math.min(360,ba.y),14,0,7);x.fill();}
 x.strokeStyle='#C4D645';x.lineWidth=2;x.setLineDash([5,5]);
 x.beginPath();x.moveTo(230,120);x.lineTo(230,360);x.stroke();x.setLineDash([]);
});
}});"""

# 383 — Brecha no Trânsito
GAMES[383] = r"""/* NCODE N · 383 Brecha no Trânsito — atravesse correndo! */
GREG(383,{
init(root,H){
let over=false,lane=0,px=40,t=0,lives=3,cross=0;
const LANES=[];
for(let i=0;i<5;i++){LANES.push({y:80+i*70,sp:(120+i*40)*(i%2?-1:1),cars:[]});LANES[i].cars.push(Math.random()*500,Math.random()*500+300);}
const hud=H.hud(root,[['v','VIDAS',3],['t','TRAVESSIAS','0/3']]);
const say=H.msg(root,'Toque CORRER para avançar 1 faixa entre os carros! Atravesse as 5 faixas, 3 vezes. 3 vidas!');
const o=H.cvs(root,560,460),x=o.x;
H.btn(root,'🏃 CORRER 1 faixa!',()=>{
 if(over)return;
 lane++;H.sfx('tick');
 const L=LANES[lane-1];
 if(L&&L.cars.some(cx=>Math.abs(cx-px)<44)){lives--;H.sfx('bad');hud.set('v',lives);lane=0;if(lives<=0){gameOver(false);return;}}
 if(lane>=5){lane=0;cross++;H.sfx('ok');hud.set('t',cross+'/3');px=40+Math.random()*480;if(cross>=3){gameOver(true);return;}}
},true);
function gameOver(win){over=true;H.score(cross*120+lives*50);
H.done({win:win,score:cross*120+lives*50,title:win?'🏃 Atravessou tudo!':'🏃 Atropelado!',sub:cross+'/3 travessias.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 LANES.forEach(L=>{L.cars=L.cars.map(cx=>{cx+=L.sp*dt;if(cx>620)cx=-60;if(cx<-60)cx=620;return cx;});});
 x.fillStyle='#3A3A45';x.fillRect(0,0,560,460);
 x.fillStyle='#3E7C4F';x.fillRect(0,0,560,50);x.fillRect(0,410,560,50);
 LANES.forEach((L,i)=>{
  x.fillStyle='#E8A33D';
  for(let s=0;s<10;s++)x.fillRect(s*60,72+i*70,30,4);
  L.cars.forEach(cx=>{x.font='30px system-ui';x.textAlign='center';x.fillText('🚗',cx,L.y+10);});
 });
 const py=435-lane*78;
 x.font='28px system-ui';x.textAlign='center';x.fillText('🚶',px,py);
});
}});"""

# 384 — Pulo do Elevador
GAMES[384] = r"""/* NCODE N · 384 Pulo do Elevador — pule na plataforma! */
GREG(384,{
init(root,H){
let over=false,ey=300,dir=1,jumping=false,jx=0,jy=0,jt=0,round=0,score=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'O elevador sobe e desce! PULE quando alinhar com a plataforma. 5 tentativas!');
const o=H.cvs(root,460,480),x=o.x;
H.btn(root,'🦘 PULAR!',()=>{
 if(over||jumping)return;
 jumping=true;jt=0;jx=140;jy=ey;H.sfx('tick');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🦘 Saltador preciso!':'🦘 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;
 if(!jumping)ey+=dir*140*dt;
 if(ey<80){ey=80;dir=1;}if(ey>420){ey=420;dir=-1;}
 if(jumping){
  jt+=dt;jx+=260*dt;jy+=60*dt;
  if(jx>=330){
   jumping=false;round++;
   const err=Math.abs(jy-250);
   if(err<26){score+=100;H.sfx('ok');say('✅ '+(100)+'! Na plataforma!');}
   else{H.sfx('bad');say('❌ Errou por '+(err|0)+'px!');}
   hud.set('pt',score);hud.set('t',Math.min(5,round+1)+'/5');
   if(round>=5){gameOver();return;}
  }
 }
 x.fillStyle='#2A2A33';x.fillRect(0,0,460,480);
 x.fillStyle='#4A4A55';x.fillRect(100,40,80,420);
 x.fillStyle='#C4D645';x.fillRect(110,ey-30,60,60);
 x.fillStyle='#3E7C4F';x.fillRect(330,224,100,16);
 x.font='20px system-ui';x.textAlign='center';x.fillText('🏁',380,218);
 if(jumping){x.font='26px system-ui';x.fillText('🦘',jx,jy);}
 else{x.font='26px system-ui';x.fillText('🕺',140,ey+8);}
});
}});"""

# 385 — Ponte Levadiça
GAMES[385] = r"""/* NCODE N · 385 Ponte Levadiça — atravesse antes de abrir! */
GREG(385,{
init(root,H){
let over=false,px=40,t=0,cyc=0,state='closed',win=false;
const hud=H.hud(root,[['e','ESTADO','FECHADA']]);
const say=H.msg(root,'Segure ANDAR para atravessar! A ponte ABRE de tempos em tempos — esteja no fim ou caia! 3 travessias!');
let cross=0;
const o=H.cvs(root,560,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
const wb=H.btn(root,'🚶 Segurar = ANDAR',()=>{},true);
wb.addEventListener('pointerdown',()=>{dn.walk=true;});
wb.addEventListener('pointerup',()=>{dn.walk=false;});
function gameOver(w){over=true;win=w;H.score(cross*150);
H.done({win:w,score:cross*150,title:w?'🌉 Travessias completas!':'🌉 Caiu no fosso!',sub:cross+'/3 travessias.'});}
H.loop(dt=>{
 if(over)return;t+=dt;cyc+=dt;
 const ph=cyc%10;
 state=ph<5?'closed':ph<6?'warn':'open';
 hud.set('e',state==='closed'?'FECHADA ✅':state==='warn'?'FECHANDO! ⚠️':'ABERTA ❌');
 if(dn.walk||dn.Space||dn.ArrowRight)px+=130*dt;
 px=H.clamp(px,40,520);
 if(state==='open'&&px>120&&px<460){gameOver(false);return;}
 if(px>=520){cross++;px=40;H.sfx('ok');if(cross>=3){gameOver(true);return;}}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,340);
 x.fillStyle='#2E6E8A';x.fillRect(100,180,360,160);
 x.fillStyle='#8A6A2F';x.fillRect(0,180,100,160);x.fillRect(460,180,100,160);
 if(state==='closed'){x.fillStyle='#5A4A33';x.fillRect(100,170,360,16);}
 else if(state==='warn'){x.fillStyle='#E8A33D';x.fillRect(100,170,360,16);}
 else{
  x.save();x.translate(100,170);x.rotate(-1.1);x.fillStyle='#5A4A33';x.fillRect(0,0,180,16);x.restore();
  x.save();x.translate(460,170);x.rotate(1.1+Math.PI);x.fillStyle='#5A4A33';x.fillRect(0,0,180,16);x.restore();
 }
 x.font='28px system-ui';x.textAlign='center';x.fillText('🚶',px,162);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Travessias '+cross+'/3 · '+(state==='closed'?'✅ CORRA!':state==='warn'?'⚠️ VOLTE OU CORRA!':'❌ ABERTA'),12,28);
});
}});"""

# 386 — Fatiada na Linha
GAMES[386] = r"""/* NCODE N · 386 Fatiada na Linha — corte certo! */
GREG(386,{
init(root,H){
let over=false,fx=0,sp=0,fruit=0,score=0,cut=null,round=0;
const FR=['🍉','🍍','🍎','🍊','🥝'];
const hud=H.hud(root,[['f','FRUTA','1/10'],['pt','PONTOS',0]]);
const say=H.msg(root,'Toque FATIAR quando a fruta cruzar a LINHA! Centro = 100, perto = 50. 10 frutas!');
const o=H.cvs(root,560,300),x=o.x;
H.btn(root,'🔪 FATIAR!',()=>{
 if(over||cut)return;
 cut=fx;
 const err=Math.abs(fx-280);
 if(err<18){score+=100;H.sfx('ok');}
 else if(err<50){score+=50;H.sfx('tick');}
 else H.sfx('bad');
 hud.set('pt',score);
},true);
function newFruit(){
 fruit=(Math.random()*FR.length)|0;
 fx=-40;sp=260+Math.random()*260;cut=null;round++;
 hud.set('f',Math.min(10,round)+'/10');
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=700,score,title:score>=700?'🔪 Mestre sushi!':'🔪 Fim!',sub:score+'/1000 pontos.'});}
newFruit();
H.loop(dt=>{
 if(over)return;
 fx+=sp*dt;
 if(fx>620){
  if(round>=10){gameOver();return;}
  newFruit();return;
 }
 x.fillStyle=H.C.paper;x.fillRect(0,0,560,300);
 x.strokeStyle='#D94E34';x.lineWidth=4;
 x.beginPath();x.moveTo(280,20);x.lineTo(280,280);x.stroke();
 x.strokeStyle='#C4D645';x.lineWidth=2;
 x.beginPath();x.moveTo(262,20);x.lineTo(262,280);x.moveTo(298,20);x.lineTo(298,280);x.stroke();
 x.font='44px system-ui';x.textAlign='center';
 if(cut!=null){
  x.fillText('🍽️',cut,150);
  x.fillText('💥',cut,200);
 }else x.fillText(FR[fruit],fx,160);
});
}});"""

# 387 — Porta Giratória
GAMES[387] = r"""/* NCODE N · 387 Porta Giratória — entre no giro! */
GREG(387,{
init(root,H){
let over=false,a=0,round=0,score=0,try2=false,pa=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A porta gira! Toque ENTRAR quando a abertura passar na SUA frente (embaixo). 5 tentativas!');
const o=H.cvs(root,400,400),x=o.x;
H.btn(root,'🚶 ENTRAR!',()=>{
 if(over||try2)return;
 try2=true;pa=a;
 let d=Math.abs(((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2)-Math.PI/2);
 d=Math.min(d,Math.PI*2-d);
 if(d<.3){score+=100;H.sfx('ok');say('✅ Entrou! +100');}
 else{H.sfx('bad');say('❌ Bateu na porta!');}
 hud.set('pt',score);
 round++;
 H.after(1100,()=>{if(over)return;if(round>=5){gameOver();return;}try2=false;hud.set('t',(round+1)+'/5');});
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🚪 Entrada triunfal!':'🚪 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;
 if(!try2)a+=dt*1.6;
 x.fillStyle=H.C.paper;x.fillRect(0,0,400,400);
 x.strokeStyle='#181816';x.lineWidth=6;
 x.beginPath();x.arc(200,190,110,0,7);x.stroke();
 for(let i=0;i<3;i++){
  const aa=a+i*2.094;
  x.strokeStyle='#8A6A2F';x.lineWidth=8;
  x.beginPath();x.moveTo(200,190);x.lineTo(200+Math.cos(aa)*105,190+Math.sin(aa)*105);x.stroke();
 }
 x.fillStyle='#3E7C4F';x.fillRect(170,300,60,60);
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚶',200,345);
 if(try2){x.font='40px system-ui';x.fillText(score%100===0&&round>0?'✅':'💥',200,120);}
});
}});"""

# 388 — Trem em Movimento
GAMES[388] = r"""/* NCODE N · 388 Trem em Movimento — pule os vagões! */
GREG(388,{
init(root,H){
let over=false,dist=0,sp=260,jump=0,jT=0,t=0,gapAt=500,gapW=90;
const hud=H.hud(root,[['d','DIST','0m']]);
const say=H.msg(root,'Toque PULAR para atravessar as brechas entre vagões! Caiu = fim. Meta: 500m!');
const o=H.cvs(root,560,320),x=o.x;
H.btn(root,'🦘 PULAR!',()=>{
 if(over||jump)return;
 jump=1;jT=0;H.sfx('tick');
},true);
function gameOver(){over=true;const sc=dist|0;H.score(sc);
H.done({win:dist>=500,score:sc,title:dist>=500?'🚂 Rei dos vagões!':'🚂 Caiu do trem!',sub:(dist|0)+'/500m.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 dist+=sp*dt;
 if(jump){jT+=dt/.5;if(jT>=1){jump=0;jT=0;}}
 gapAt-=sp*dt;
 if(gapAt<-100){gapAt=400+Math.random()*400;gapW=70+Math.random()*70;}
 const jr=jump?Math.sin(jT*Math.PI):0;
 const over2=gapAt>60&&gapAt<200;
 if(over2&&jr<.3){gameOver();return;}
 hud.set('d',(dist|0)+'m');
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,320);
 x.fillStyle='#4A4A55';x.fillRect(0,200,560,60);
 x.fillStyle='#2E6E8A';x.fillRect(0,200,gapAt,60);x.fillRect(gapAt+gapW,200,560-gapAt-gapW,60);
 x.fillStyle='#E8A33D';x.fillRect(0,200,560,8);
 const py=190-jr*110;
 x.font='32px system-ui';x.textAlign='center';x.fillText('🧗',130,py);
});
}});"""

# 389 — Torneira Cheia
GAMES[389] = r"""/* NCODE N · 389 Torneira Cheia — até a borda! */
GREG(389,{
init(root,H){
let over=false,level=0,filling=false,round=0,score=0,sp=0;
const hud=H.hud(root,[['c','COPO','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Segure ENCHER e solte BEM na linha verde! Passou = transborda. 5 copos!');
const o=H.cvs(root,400,420),x=o.x;
const fb=H.btn(root,'🚰 Segurar = ENCHER',()=>{},true);
fb.addEventListener('pointerdown',()=>{if(!over&&!filling)startFill();});
fb.addEventListener('pointerup',()=>{if(!over&&filling)stopFill();});
function startFill(){level=0;filling=true;sp=55+Math.random()*45;}
function stopFill(){
 filling=false;
 const err=Math.abs(level-85);
 if(err<4){score+=100;H.sfx('ok');say('🎯 Perfeito! +100');}
 else if(err<10){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say(err>0&&level>85?'🌊 Transbordou!':'☕ Pouco demais!');}
 hud.set('pt',score);round++;
 if(round>=5)gameOver();
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'🚰 Barman preciso!':'🚰 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;
 if(filling){level+=sp*dt;if(level>=100){stopFill();}}
 x.fillStyle=H.C.paper;x.fillRect(0,0,400,420);
 x.strokeStyle='#181816';x.lineWidth=5;
 x.strokeRect(140,60,120,300);
 x.fillStyle='#7FB3C8';
 const h=Math.min(100,level)/100*280;
 x.fillRect(145,355-h,110,h);
 x.strokeStyle='#3E7C4F';x.lineWidth=4;
 const ly=355-85/100*280;
 x.beginPath();x.moveTo(130,ly);x.lineTo(270,ly);x.stroke();
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Copo '+(round+1)+'/5 · '+score+' pts',12,28);
});
}});"""

# 390 — Foto do Pássaro
GAMES[390] = r"""/* NCODE N · 390 Foto do Pássaro — clique no pouso! */
GREG(390,{
init(root,H){
let over=false,bx=-40,state='fly',sitT=0,t=0,round=0,score=0;
const hud=H.hud(root,[['c','CHANCE','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'O pássaro voa e POUSA por 1,2s! Toque FOTOGRAFAR bem no pouso. 8 chances, 5+ fotos!');
const o=H.cvs(root,560,340),x=o.x;
H.btn(root,'📸 FOTOGRAFAR!',()=>{
 if(over)return;
 if(state==='sit'){score+=100;H.sfx('ok');say('📸 Linda foto! +100');}
 else{H.sfx('bad');say('❌ Borrada… (ele estava voando)');}
 round++;hud.set('pt',score);hud.set('c',Math.min(8,round+1)+'/8');
 if(round>=8){gameOver();return;}
 bx=-40;state='fly';
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=500,score,title:score>=500?'📸 Vida selvagem!':'📸 Fim!',sub:score+'/800 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(state==='fly'){
  bx+=220*dt;
  if(bx>280){state='sit';sitT=1.2;}
  if(bx>620){bx=-40;}
 }else{
  sitT-=dt;
  if(sitT<=0){state='fly';bx=320;}
 }
 x.fillStyle='#9AD0E8';x.fillRect(0,0,560,340);
 x.fillStyle='#5A4A33';x.fillRect(250,260,60,80);
 x.fillStyle='#3E7C4F';x.beginPath();x.ellipse(280,240,90,40,0,0,7);x.fill();
 const by=state==='sit'?225:140+Math.sin(t*6)*20;
 x.font='34px system-ui';x.textAlign='center';x.fillText(state==='sit'?'🐦':'🦅',bx,by);
 if(state==='sit'){x.fillStyle='#C4D645';x.font='bold 18px system-ui';x.fillText('POUSOU! 📸',280,60);}
});
}});"""

# 391 — Raio na Garrafa
GAMES[391] = r"""/* NCODE N · 391 Raio na Garrafa — capture a descarga! */
GREG(391,{
init(root,H){
let over=false,t=0,flash=0,next=2,round=0,score=0,capw=0;
const hud=H.hud(root,[['t','TEMPESTADE','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Quando o RAIO riscar o céu, toque CAPTURAR em 0,4s! 8 tempestades, 5+ capturas!');
const o=H.cvs(root,480,360),x=o.x;
H.btn(root,'⚡ CAPTURAR!',()=>{
 if(over)return;
 if(capw>0){score+=100;H.sfx('ok');say('⚡ Capturado! +100');capw=0;flash=0;round++;hud.set('pt',score);hud.set('t',Math.min(8,round+1)+'/8');}
 else{H.sfx('bad');say('❌ Sem raio! Espere o clarão.');}
 if(round>=8)gameOver();
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=500,score,title:score>=500?'⚡ Caçador de raios!':'⚡ Fim!',sub:score+'/800 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(flash>0){flash-=dt;capw-=dt;
  if(flash<=0){H.sfx('bad');say('🌩️ O raio escapou!');round++;hud.set('t',Math.min(8,round+1)+'/8');if(round>=8){gameOver();return;}}
 }
 else{
  next-=dt;
  if(next<=0){flash=.5;capw=.4;next=1.5+Math.random()*3;H.sfx('bad');}
 }
 x.fillStyle=flash>0?'#E8E8F0':'#23232B';x.fillRect(0,0,480,360);
 x.fillStyle='#3A3A45';x.fillRect(0,300,480,60);
 if(flash>0){
  x.strokeStyle='#E8A33D';x.lineWidth=5;
  x.beginPath();x.moveTo(240,0);x.lineTo(200,100);x.lineTo(250,100);x.lineTo(190,220);x.lineTo(230,220);x.lineTo(180,320);x.stroke();
  x.fillStyle='#181816';x.font='bold 24px system-ui';x.textAlign='center';x.fillText('⚡ AGORA!',240,60);
 }
 x.fillStyle=flash>0?'#181816':'#fff';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Tempestade '+(round+1)+'/8 · '+score+' pts',12,28);
});
}});"""

# 392 — Metrônomo no Centro
GAMES[392] = r"""/* NCODE N · 392 Metrônomo no Centro — pare no meio! */
GREG(392,{
init(root,H){
let over=false,a=0,t=0,sp=2,round=0,score=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Pare o pêndulo BEM no centro (linha verde)! A cada tentativa ele acelera. 5 tentativas!');
const o=H.cvs(root,400,380),x=o.x;
H.btn(root,'🛑 PARAR!',()=>{
 if(over)return;
 const err=Math.abs(a);
 if(err<.08){score+=100;H.sfx('ok');say('🎯 Centro! +100');}
 else if(err<.2){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say('❌ Longe!');}
 hud.set('pt',score);round++;sp+=.5;
 if(round>=5){gameOver();return;}
 hud.set('t',(round+1)+'/5');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'🎼 Maestro!':'🎼 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 a=Math.sin(t*sp*2)*1.1;
 x.fillStyle=H.C.paper;x.fillRect(0,0,400,380);
 x.strokeStyle='#3E7C4F';x.lineWidth=4;
 x.beginPath();x.moveTo(200,60);x.lineTo(200,320);x.stroke();
 const px=200+Math.sin(a)*200,py=90+Math.cos(a)*200;
 x.strokeStyle='#181816';x.lineWidth=6;
 x.beginPath();x.moveTo(200,90);x.lineTo(px,py);x.stroke();
 x.fillStyle='#D94E34';x.beginPath();x.arc(px,py,18,0,7);x.fill();
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Velocidade x'+sp.toFixed(1),12,28);
});
}});"""

# 393 — Sopro da Vela
GAMES[393] = r"""/* NCODE N · 393 Sopro da Vela — apague no pico! */
GREG(393,{
init(root,H){
let over=false,f=0,t=0,round=0,score=0;
const hud=H.hud(root,[['v','VELA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A chama oscila! SOPRE quando ela estiver no ponto MAIS ALTO. 5 velas, 3+ apagadas!');
const o=H.cvs(root,400,380),x=o.x;
H.btn(root,'💨 SOPRAR!',()=>{
 if(over)return;
 if(f>.8){score+=100;H.sfx('ok');say('🕯️ Apagada! +100');}
 else{H.sfx('bad');say('❌ A chama resistiu…');}
 hud.set('pt',score);round++;
 if(round>=5){gameOver();return;}
 hud.set('v',(round+1)+'/5');t=0;
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'💨 Sopro certeiro!':'💨 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 f=(Math.sin(t*3.1)*.5+.5)*.7+(Math.sin(t*7.3)*.5+.5)*.3;
 x.fillStyle='#1C1C24';x.fillRect(0,0,400,380);
 x.fillStyle='#EDE8DC';x.fillRect(180,220,40,120);
 const fh=40+f*90;
 x.fillStyle='#E8A33D';
 x.beginPath();x.ellipse(200,220-fh/2,22,fh/2,0,0,7);x.fill();
 x.fillStyle='#D94E34';
 x.beginPath();x.ellipse(200,220-fh/4,10,fh/4,0,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.setLineDash([4,4]);
 x.beginPath();x.moveTo(120,220-(40+.8*90));x.lineTo(280,220-(40+.8*90));x.stroke();x.setLineDash([]);
 x.fillStyle='#C4D645';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('SOPRE ACIMA DA LINHA',120,110);
});
}});"""

# 394 — Bolha no Limite
GAMES[394] = r"""/* NCODE N · 394 Bolha no Limite — estoure no máximo! */
GREG(394,{
init(root,H){
let over=false,r=10,grow=true,round=0,score=0,sp=0;
const MAX=110;
const hud=H.hud(root,[['b','BOLHA','1/10'],['pt','PONTOS',0]]);
const say=H.msg(root,'A bolha cresce… e ESTOURA sozinha! Toque ESTOURAR o mais perto do máximo. 10 bolhas!');
const o=H.cvs(root,400,380),x=o.x;
H.btn(root,'💥 ESTOURAR!',()=>{
 if(over)return;
 const p=r/MAX;
 if(p>.92){score+=100;H.sfx('ok');}
 else if(p>.75){score+=50;H.sfx('tick');}
 else H.sfx('bad');
 hud.set('pt',score);next();
},true);
function next(){
 round++;
 if(round>=10){gameOver();return;}
 hud.set('b',(round+1)+'/10');
 r=10;sp=40+Math.random()*50;
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=700,score,title:score>=700?'🫧 Mestre das bolhas!':'🫧 Fim!',sub:score+'/1000 pontos.'});}
sp=50;
H.loop(dt=>{
 if(over)return;
 r+=sp*dt;
 if(r>=MAX){H.sfx('bad');say('💥 Estourou sozinha!');next();return;}
 x.fillStyle='#BFD9E2';x.fillRect(0,0,400,380);
 x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.arc(200,190,r,0,7);x.fill();
 x.strokeStyle='#2E6E8A';x.lineWidth=3;x.stroke();
 x.strokeStyle='#D94E34';x.setLineDash([5,5]);
 x.beginPath();x.arc(200,190,MAX,0,7);x.stroke();x.setLineDash([]);
 x.fillStyle='#fff';x.beginPath();x.arc(200-r*.3,190-r*.3,8,0,7);x.fill();
});
}});"""

# 395 — Ovo na Almofada
GAMES[395] = r"""/* NCODE N · 395 Ovo na Almofada — solte na hora! */
GREG(395,{
init(root,H){
let over=false,egg=null,px=200,dir=1,round=0,score=0,t=0;
const hud=H.hud(root,[['o','OVO','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A almofada vai e vem! SOLTE o ovo para cair nela. 5 ovos, 3+ salvos!');
const o=H.cvs(root,460,420),x=o.x;
H.btn(root,'🥚 SOLTAR OVO!',()=>{
 if(over||egg)return;
 egg={x:230,y:60,vy:0};H.sfx('tick');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🥚 Café salvo!':'🥚 Omelete!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 px+=dir*(140+round*30)*dt;
 if(px<70){px=70;dir=1;}if(px>390){px=390;dir=-1;}
 if(egg){
  egg.vy+=800*dt;egg.y+=egg.vy*dt;
  if(egg.y>=340){
   const err=Math.abs(egg.x-px);
   if(err<44){score+=100;H.sfx('ok');say('✅ Salvo! +100');}
   else{H.sfx('bad');say('💥 Quebrou!');}
   hud.set('pt',score);round++;egg=null;
   if(round>=5){gameOver();return;}
   hud.set('o',(round+1)+'/5');
  }
 }
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,420);
 x.strokeStyle='#181816';x.lineWidth=3;
 x.beginPath();x.moveTo(230,0);x.lineTo(230,40);x.stroke();
 if(!egg&&round<5){x.font='28px system-ui';x.textAlign='center';x.fillText('🥚',230,62);}
 if(egg){x.font='28px system-ui';x.fillText('🥚',egg.x,egg.y);}
 x.fillStyle='#D94E34';x.fillRect(px-44,340,88,26);
 x.fillStyle='#B23A24';x.fillRect(px-44,340,88,8);
});
}});"""

# 396 — Flecha na Flecha
GAMES[396] = r"""/* NCODE N · 396 Flecha na Flecha — rache ao meio! */
GREG(396,{
init(root,H){
let over=false,aim=0,t=0,round=0,score=0,sp=2.2;
const hud=H.hud(root,[['f','FLECHA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A mira oscila! SOLTE quando o ponto estiver BEM no centro da flecha cravada. 5 tiros!');
const o=H.cvs(root,400,400),x=o.x;
H.btn(root,'🏹 SOLTAR!',()=>{
 if(over)return;
 const err=Math.abs(aim);
 if(err<.1){score+=100;H.sfx('ok');say('🎯 RACHOU! +100');}
 else if(err<.25){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say('❌ Errou!');}
 hud.set('pt',score);round++;sp+=.4;
 if(round>=5){gameOver();return;}
 hud.set('f',(round+1)+'/5');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'🏹 Arqueiro lendário!':'🏹 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 aim=Math.sin(t*sp)*1.2;
 x.fillStyle='#7CB56B';x.fillRect(0,0,400,400);
 x.fillStyle='#EDE8DC';x.beginPath();x.arc(200,190,80,0,7);x.fill();
 x.fillStyle='#D94E34';x.beginPath();x.arc(200,190,40,0,7);x.fill();
 x.fillStyle='#E8A33D';x.beginPath();x.arc(200,190,14,0,7);x.fill();
 x.strokeStyle='#5A4A33';x.lineWidth=6;
 x.beginPath();x.moveTo(200,190);x.lineTo(200,110);x.stroke();
 x.fillStyle='#C4D645';x.beginPath();x.arc(200,104,8,0,7);x.fill();
 const ax=200+aim*120;
 x.strokeStyle='#181816';x.lineWidth=2;
 x.beginPath();x.moveTo(ax-14,300);x.lineTo(ax+14,300);x.moveTo(ax,286);x.lineTo(ax,314);x.stroke();
 x.fillStyle='#181816';x.beginPath();x.arc(ax,300,5,0,7);x.fill();
 x.strokeStyle='#3E7C4F';x.lineWidth=3;
 x.beginPath();x.moveTo(200,280);x.lineTo(200,320);x.stroke();
});
}});"""

# 397 — Moeda no Ar
GAMES[397] = r"""/* NCODE N · 397 Moeda no Ar — pegue no pico! */
GREG(397,{
init(root,H){
let over=false,cy=0,vy=0,up=true,round=0,score=0,t=0;
const TOP=120,BOT=340;
const hud=H.hud(root,[['m','MOEDA','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'PEGUE a moeda BEM no topo do arco! 8 lançamentos, 5+ pegas!');
const o=H.cvs(root,400,420),x=o.x;
H.btn(root,'🖐️ PEGAR!',()=>{
 if(over)return;
 const err=Math.abs(cy-TOP);
 if(err<22){score+=100;H.sfx('ok');say('🪙 Pega! +100');}
 else{H.sfx('bad');say(err>0&&cy>TOP?'❌ Tarde demais!':'❌ Cedo demais!');}
 round++;hud.set('pt',score);
 if(round>=8){gameOver();return;}
 hud.set('m',(round+1)+'/8');
 cy=BOT;vy=-(300+Math.random()*120);
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=500,score,title:score>=500?'🪙 Mão de ouro!':'🪙 Fim!',sub:score+'/800 pontos.'});}
cy=BOT;vy=-360;
H.loop(dt=>{
 if(over)return;
 vy+=900*dt;cy+=vy*dt;
 if(cy>=BOT){cy=BOT;vy=-(300+Math.random()*140);}
 x.fillStyle='#1C1C24';x.fillRect(0,0,400,420);
 x.strokeStyle='#C4D645';x.lineWidth=2;x.setLineDash([5,5]);
 x.beginPath();x.moveTo(60,TOP);x.lineTo(340,TOP);x.stroke();x.setLineDash([]);
 x.fillStyle='#C4D645';x.font='bold 12px system-ui';x.textAlign='left';
 x.fillText('PICO',62,TOP-8);
 x.fillStyle='#E8A33D';x.beginPath();x.arc(200,cy,22,0,7);x.fill();
 x.strokeStyle='#8A6A2F';x.lineWidth=3;x.stroke();
 x.fillStyle='#8A6A2F';x.font='bold 20px system-ui';x.textAlign='center';
 x.fillText('$',200,cy+7);
});
}});"""

# 398 — Gangorra Equilibrada
GAMES[398] = r"""/* NCODE N · 398 Gangorra Equilibrada — segure 30s! */
GREG(398,{
init(root,H){
let over=false,ang=0,av=0,t=0,time=30;
const hud=H.hud(root,[['tp','TEMPO',30]]);
const say=H.msg(root,'A gangorra tomba sozinha! Toque o lado ALTO para descer (◀️/▶️). Caia para o lado = fim. 30s!');
const o=H.cvs(root,480,360),x=o.x;
H.btn(root,'◀️ PESO ESQUERDA',()=>{if(!over){av-=2.2;H.sfx('tick');}},false);
H.btn(root,'PESO DIREITA ▶️',()=>{if(!over){av+=2.2;H.sfx('tick');}},false);
function gameOver(win){over=true;const sc=win?400:Math.max(0,30-time|0)*8;H.score(sc|0);
H.done({win:win,score:sc|0,title:win?'⚖️ Equilíbrio zen!':'⚖️ Tombou!',sub:win?'30s perfeitos!':'Toque o lado alto para compensar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 av+=(ang*2.4+Math.sin(t*1.7)*.8)*dt;
 av*=.985;
 ang+=av*dt;
 hud.set('tp',Math.ceil(time));
 if(Math.abs(ang)>.9){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,480,360);
 x.fillStyle='#5A5A55';
 x.beginPath();x.moveTo(210,300);x.lineTo(270,300);x.lineTo(240,220);x.fill();
 x.save();x.translate(240,210);x.rotate(ang);
 x.fillStyle='#8A6A2F';x.fillRect(-170,-10,340,20);
 x.font='26px system-ui';x.textAlign='center';x.fillText('🧒',-140,-14);x.fillText('🧒',140,-14);
 x.restore();
});
}});"""

# 399 — Corte do Pavio
GAMES[399] = r"""/* NCODE N · 399 Corte do Pavio — no comprimento exato! */
GREG(399,{
init(root,H){
let over=false,burn=0,round=0,score=0,sp=0;
const MARK=70;
const hud=H.hud(root,[['p','PAVIO','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'O pavio queima! CORTE quando o fogo chegar BEM na marca verde. 5 pavios!');
const o=H.cvs(root,560,260),x=o.x;
H.btn(root,'✂️ CORTAR!',()=>{
 if(over)return;
 const err=Math.abs(burn-MARK);
 if(err<4){score+=100;H.sfx('ok');say('🎯 Exato! +100');}
 else if(err<10){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say('❌ Errou!');}
 hud.set('pt',score);round++;
 if(round>=5){gameOver();return;}
 hud.set('p',(round+1)+'/5');burn=0;sp=26+Math.random()*22;
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'✂️ Mestre artífice!':'✂️ Fim!',sub:score+'/500 pontos.'});}
sp=30;
H.loop(dt=>{
 if(over)return;
 burn+=sp*dt;
 if(burn>=100){H.sfx('bad');say('💥 Queimou tudo!');round++;hud.set('pt',score);if(round>=5){gameOver();return;}hud.set('p',(round+1)+'/5');burn=0;sp=26+Math.random()*22;return;}
 x.fillStyle='#2A2A33';x.fillRect(0,0,560,260);
 x.fillStyle='#8A6A2F';x.fillRect(40,110,480,14);
 x.fillStyle='#D94E34';x.fillRect(40,110,480*Math.min(1,burn/100),14);
 const fx=40+480*Math.min(1,burn/100);
 x.font='26px system-ui';x.textAlign='center';x.fillText('🔥',fx,118);
 x.strokeStyle='#3E7C4F';x.lineWidth=4;
 const mx=40+480*MARK/100;
 x.beginPath();x.moveTo(mx,90);x.lineTo(mx,150);x.stroke();
 x.font='40px system-ui';x.fillText('🧨',520,140);
});
}});"""

# 400 — Eclipse Solar
GAMES[400] = r"""/* NCODE N · 400 Eclipse Solar — alinhe a lua! */
GREG(400,{
init(root,H){
let over=false,a=0,sp=1,round=0,score=0,t=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A lua orbita! Toque ALINHAR quando ela cobrir BEM o sol (topo). A cada tentativa, mais rápido. 5 tentativas!');
const o=H.cvs(root,440,440),x=o.x;
H.btn(root,'🌙 ALINHAR!',()=>{
 if(over)return;
 let d=Math.abs(((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2)-Math.PI*1.5);
 d=Math.min(d,Math.PI*2-d);
 if(d<.12){score+=100;H.sfx('ok');say('🌑 ECLIPSE TOTAL! +100');}
 else if(d<.3){score+=50;H.sfx('tick');say('🌒 Parcial! +50');}
 else{H.sfx('bad');say('❌ Passou longe!');}
 hud.set('pt',score);round++;sp+=.35;
 if(round>=5){gameOver();return;}
 hud.set('t',(round+1)+'/5');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'🌑 Astrônomo supremo!':'🌑 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 a+=sp*dt;
 x.fillStyle='#0C0C18';x.fillRect(0,0,440,440);
 x.strokeStyle='#3A3A45';x.lineWidth=2;
 x.beginPath();x.arc(220,220,130,0,7);x.stroke();
 x.fillStyle='#E8A33D';x.beginPath();x.arc(220,90,44,0,7);x.fill();
 x.fillStyle='#E8C86B';x.beginPath();x.arc(220,90,34,0,7);x.fill();
 const mx=220+Math.cos(a)*130,my=220+Math.sin(a)*130;
 x.fillStyle='#C9C9D4';x.beginPath();x.arc(mx,my,40,0,7);x.fill();
 x.fillStyle='#8A877C';x.beginPath();x.arc(mx-10,my-8,10,0,7);x.arc(mx+12,my+10,7,0,7);x.fill();
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
