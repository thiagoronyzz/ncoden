#!/usr/bin/env python3
"""Gera games/g321..g340 — SURVIVAL fim."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 321 — Fazenda na Seca
GAMES[321] = r"""/* NCODE N · 321 Fazenda na Seca — cada gota conta! */
GREG(321,{
init(root,H){
let over=false,day=1,water=60,crops=[0,0,0,0,0,0],act=3;
const hud=H.hud(root,[['d','DIA','1/12'],['a','ÁGUA',60],['c','COLHEITA','0/6']]);
const say=H.msg(root,'Colha as 6 plantas em 12 dias! Regar custa água; chuva aleatória ajuda. Planta seca 3 dias seguidos morre!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const grow=H.el('div','g-row',null,box);
const brow=H.el('div','g-row',null,box);
let dry=[0,0,0,0,0,0],done=0;
function status(){
 hud.set('d',day+'/12');hud.set('a',Math.max(0,water|0));hud.set('c',done+'/6');
 st.innerHTML='☀️ Dia '+day+'/12 · Ações: '+act+' · 💧 '+water.toFixed(0);
 grow.innerHTML='';
 crops.forEach((c,i)=>{
  const d=H.el('div','g-chip',c>=100?'🌽':c>=60?'🌱'+(c|0):c>=0?'🌱'+(c|0):'💀',grow);
  d.style.fontSize='18px';
  if(c>=0&&c<100){
   const b=H.el('button','g-chip','💧',grow);
   b.addEventListener('click',()=>water2(i));
  }
 });
 brow.innerHTML='';
 if(!over)H.btn(brow,'⏭️ Dormir (próximo dia)',()=>{if(!over)nextDay();},true);
}
function water2(i){
 if(over||act<=0||crops[i]<0||crops[i]>=100)return;
 if(water<10){say('Sem água! Durma e reze por chuva.');H.sfx('bad');return;}
 water-=10;crops[i]+=25;dry[i]=0;act--;H.sfx('tick');
 if(crops[i]>=100){done++;say('🌽 Planta '+(i+1)+' pronta!');}
 status();
}
function nextDay(){
 day++;act=3;
 if(Math.random()<.35){water=Math.min(100,water+30);say('🌧️ Choveu! +30 água.');}
 if(day>12){gameOver(done>=6);return;}
 crops.forEach((c,i)=>{
  if(c<0||c>=100)return;
  if(dry[i]>=2){crops[i]=-1;say('🥀 Planta '+(i+1)+' morreu!');}
  else dry[i]++;
 });
 water=Math.max(0,water-5);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';grow.innerHTML='';
 const sc=done*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌽 Colheita salva!',sub:'6/6 plantas!'}:{win:false,score:sc,title:'Seca venceu!',sub:done+'/6 plantas. Regue todo dia!'});}
status();
}});"""

# 322 — Pós-Terremoto
GAMES[322] = r"""/* NCODE N · 322 Pós-Terremoto — resgate nos escombros! */
GREG(322,{
init(root,H){
let over=false,time=120,rescued=0,t=0;
const PILES=[];
for(let i=0;i<8;i++)PILES.push({x:40+(i%4)*115,y:90+((i/4)|0)*130,rubble:3+((Math.random()*3)|0),surv:Math.random()<.7?1+((Math.random()*2)|0):0,ping:Math.random()*7});
const hud=H.hud(root,[['s','RESGATADOS',0],['tp','TEMPO',120]]);
const say=H.msg(root,'Toque nos escombros para remover! 💓 indica vida — resgate antes do tempo. 6 sobreviventes vencem!');
const o=H.cvs(root,480,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 PILES.forEach(p=>{
  if(Math.hypot(px-p.x-50,py-p.y-45)<62){
   if(p.rubble>0){p.rubble--;H.sfx('tick');}
   else if(p.surv>0){p.surv--;rescued++;H.sfx('ok');hud.set('s',rescued);
    if(rescued>=6){gameOver(true);return;}}
  }
 });
});
function gameOver(win){over=true;const sc=rescued*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🚑 Resgate heróico!',sub:'6 vidas salvas!'}:{win:false,score:sc,title:'Tempo esgotado!',sub:rescued+'/6 resgatados. Siga os 💓!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(rescued>=6);return;}
 x.fillStyle='#8A877C';x.fillRect(0,0,480,360);
 PILES.forEach(p=>{
  x.fillStyle='#5A5A55';
  for(let i=0;i<p.rubble;i++)x.fillRect(p.x+((i*37)%80),p.y+((i*23)%60),34,22);
  if(p.rubble<=0&&p.surv>0){x.font='24px system-ui';x.textAlign='center';x.fillText('🙋'.repeat(Math.min(2,p.surv)),p.x+50,p.y+50);}
  if(p.surv>0&&p.rubble>0&&Math.sin(t*3+p.ping)>0.6){x.font='18px system-ui';x.fillText('💓',p.x+90,p.y+10);}
 });
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('🚑 '+rescued+'/6 · ⏱️'+Math.ceil(time)+'s',12,28);
});
}});"""

# 323 — Abrigo Anti-Tornado
GAMES[323] = r"""/* NCODE N · 323 Abrigo Anti-Tornado — antes da temporada! */
GREG(323,{
init(root,H){
let over=false,day=1,walls=0,stock=0,act=2,phase='prep';
const hud=H.hud(root,[['d','DIA','1/10'],['p','PAREDES','0%'],['e','ESTOQUE',0]]);
const say=H.msg(root,'10 dias para reforçar o abrigo e estocar comida! Depois, sobreviva à temporada de tornados!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',Math.min(10,day)+'/10');hud.set('p',walls+'%');hud.set('e',stock);
 st.innerHTML=phase==='prep'?'🏠 Dia '+day+'/10 · Ações: '+act+'<br>🧱 '+walls+'% · 🥫 '+stock:'🌪️ TEMPORADA! Segure '+(storm|0)+'s!';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over||phase!=='prep')return;
 H.btn(brow,'🧱 Reforçar (+20%)',()=>{if(act<=0||over)return;walls=Math.min(100,walls+20);act--;H.sfx('tick');after();},false);
 H.btn(brow,'🥫 Estocar (+3)',()=>{if(act<=0||over)return;stock+=3;act--;H.sfx('tick');after();},false);
 H.btn(brow,'⏭️ Dormir',()=>{if(over)return;act=0;after();},true);
}
function after(){
 if(act>0){status();return;}
 day++;
 if(day>10){startStorm();return;}
 act=2;status();
}
let storm=0,dmg=0;
function startStorm(){
 phase='storm';storm=30;dmg=0;
 say('🌪️ A temporada chegou! Abrigo '+walls+'%, estoque '+stock+'.');
 status();
 H.every(1000,()=>{
  if(over||phase!=='storm')return;
  storm--;
  const hit=Math.random()<.6;
  if(hit){
   const d=Math.max(0,30-walls*.3);
   dmg+=d;
   if(stock>0&&dmg>20){stock--;dmg=0;say('🥫 Usou 1 estoque para reparar!');}
  }
  hud.set('e',stock);
  status();
  if(dmg>=100){gameOver(false);return;}
  if(stock<=0&&storm>15&&Math.random()<.3){gameOver(false,'Fome no abrigo!');return;}
  if(storm<=0){gameOver(true);return;}
 });
}
function gameOver(win,why){over=true;phase='end';brow.innerHTML='';
 const sc=win?400+stock*20:walls+stock*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌪️ Temporada vencida!',sub:'Abrigo resistiu!'}:{win:false,score:sc|0,title:'Abrigo caiu!',sub:why||'Reforce mais as paredes!'});}
status();
}});"""

# 324 — Fuga do Incêndio
GAMES[324] = r"""/* NCODE N · 324 Fuga do Incêndio — atravesse as chamas! */
GREG(324,{
init(root,H){
const N=10,CS=44,OX=10,OY=10;
let over=false,pc=0,pr=9,water=100,t=0,cd=0;
const FIRE=[];
for(let i=0;i<14;i++)FIRE.push({c:1+((Math.random()*8)|0),r:1+((Math.random()*8)|0)});
const hud=H.hud(root,[['a','ÁGUA','100%']]);
const say=H.msg(root,'Chegue à zona segura 🟩! Fogo 🔥 queima — apague com água (entre na casa com água). Sem água no fogo = dano!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
let hp=100;
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 const f=FIRE.find(q=>q.c===nc&&q.r===nr);
 if(f){
  if(water>=20){water-=20;FIRE.splice(FIRE.indexOf(f),1);H.sfx('ok');}
  else{hp-=34;H.sfx('bad');if(hp<=0){gameOver(false);return;}}
 }
 pc=nc;pr=nr;cd=.14;water=Math.max(0,water-.5);
 hud.set('a',(water|0)+'%');
 if(pc===9&&pr===0){gameOver(true);return;}
}
function gameOver(win){over=true;const sc=win?300+Math.ceil(water)*2+hp:pc*10+(9-pr)*10;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🧑‍🚒 Atravessou o incêndio!',sub:'Chegou à zona segura!'}:{win:false,score:sc|0,title:'Cercado!',sub:'Apague o fogo com água antes!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 if(Math.random()<dt*.5&&FIRE.length<20){
  const c=(Math.random()*N)|0,r=(Math.random()*N)|0;
  if(!((c===pc&&r===pr)||(c===9&&r===0))&&!FIRE.some(f=>f.c===c&&f.r===r))FIRE.push({c,r});
 }
 x.fillStyle='#3E7C4F';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=(r+c)%2?'#3E7C4F':'#35905A';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
 }
 x.fillStyle='#C4D645';x.fillRect(OX+9*CS,OY+0*CS,CS,CS);
 x.font='22px system-ui';x.textAlign='center';
 FIRE.forEach(f=>x.fillText(Math.sin(t*8+f.c)>0?'🔥':'🧨',OX+f.c*CS+22,OY+f.r*CS+32));
 x.fillText('🟩',OX+9*CS+22,OY+0*CS+32);
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,13,0,7);x.fill();
 x.fillStyle='#7FB3C8';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,5,0,7);x.fill();
});
}});"""

# 325 — Perdido no Mar
GAMES[325] = r"""/* NCODE N · 325 Perdido no Mar — aguente no bote! */
GREG(325,{
init(root,H){
let over=false,day=1,thirst=70,hunger=70,shade=0,act=2;
const hud=H.hud(root,[['d','DIA','1/15'],['s','SEDE',70],['f','FOME',70]]);
const say=H.msg(root,'Sobreviva 15 dias no bote! Sede e fome caem todo dia; sombra protege do sol. Chuva é sorte!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/15');hud.set('s',Math.max(0,thirst|0));hud.set('f',Math.max(0,hunger|0));
 st.innerHTML='🚣 Dia '+day+'/15 · Ações: '+act+'<br>💧 '+thirst.toFixed(0)+' · 🍖 '+hunger.toFixed(0)+' · ⛱️ '+shade+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🎣 Pescar (+25 fome)',()=>{if(act<=0||over)return;hunger=Math.min(100,hunger+25);act--;H.sfx('tick');after();},false);
 H.btn(brow,'💧 Coletar orvalho (+20 sede)',()=>{if(act<=0||over)return;thirst=Math.min(100,thirst+20);act--;H.sfx('tick');after();},false);
 H.btn(brow,'⛱️ Improvisar sombra (+25%)',()=>{if(act<=0||over)return;shade=Math.min(100,shade+25);act--;H.sfx('tick');after();},false);
}
function after(){
 if(act>0){status();return;}
 day++;
 thirst-=16;hunger-=13;
 const sun=Math.max(0,20-shade*.2);
 thirst-=sun/2;
 if(Math.random()<.3){thirst=Math.min(100,thirst+30);say('🌧️ Chuva! +30 sede.');}
 if(thirst<=0){gameOver(false,'Sede no dia '+day+'.');return;}
 if(hunger<=0){gameOver(false,'Fome no dia '+day+'.');return;}
 if(day>15){gameOver(true);return;}
 act=2;status();
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?450:day*12;H.score(sc);
H.done(win?{win:true,score:sc,title:'🚣 Resgatado!',sub:'15 dias à deriva!'}:{win:false,score:sc,title:'O mar venceu!',sub:why+' Faça sombra cedo!'});}
status();
}});"""

# 326 — Nevasca na Montanha
GAMES[326] = r"""/* NCODE N · 326 Nevasca na Montanha — ache abrigo! */
GREG(326,{
init(root,H){
let over=false,step=0,warm=90,prog=0;
const PATHS=[
 ['🏔️ Cume exposto (rápido, frio)','🌲 Floresta (lento, quente)',()=>{prog+=22;warm-=22;},()=>{prog+=12;warm-=8;}],
 ['🕳️ Caverna escura (atalho?)','⛰️ Contornar (seguro)',()=>{if(Math.random()<.6){prog+=25;}else{warm-=20;say('Caverna sem saída! −20 calor.');}prog+=5;},()=>{prog+=12;warm-=10;}],
 ['🔥 Fazer fogueira (−tempo, +calor)','🏃 Seguir andando',()=>{warm=Math.min(100,warm+30);prog+=4;},()=>{prog+=16;warm-=14;}],
 ['🧗 Paredão (arriscado)','🐌 Descer ao vale',()=>{if(Math.random()<.5){prog+=28;}else{warm-=25;say('Queda! −25 calor.');}prog+=4;},()=>{prog+=10;warm-=6;}]
];
const hud=H.hud(root,[['c','CALOR',90],['p','ABRIGO','0%']]);
const say=H.msg(root,'Ache o abrigo (100%) antes de congelar! Cada escolha move e esfria. Fogueiras salvam!');
const box=H.el('div','g-col',null,root);
const ev=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('c',Math.max(0,warm|0));hud.set('p',Math.min(100,prog|0)+'%');}
function next(){
 if(over)return;
 step++;warm-=4;
 if(warm<=0){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 const e=PATHS[(Math.random()*PATHS.length)|0];
 ev.innerHTML='<b>Passo '+step+'</b> · Calor '+warm.toFixed(0)+' · Abrigo '+(prog|0)+'%<br>Escolha o caminho:';
 brow.innerHTML='';
 H.btn(brow,'🅰️ '+e[0],()=>{e[2]();H.sfx('tick');status();next();},false);
 H.btn(brow,'🅱️ '+e[1],()=>{e[3]();H.sfx('tick');status();next();},false);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(warm)*2:prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🏕️ Abrigo encontrado!',sub:'Quentinho na nevasca!'}:{win:false,score:sc|0,title:'Congelado!',sub:'Faça fogueiras quando o calor baixar!'});}
next();
}});"""

# 327 — Pântano Perigoso
GAMES[327] = r"""/* NCODE N · 327 Pântano Perigoso — cruze o brejo! */
GREG(327,{
init(root,H){
const N=9,CS=48,OX=14,OY=14;
let over=false,pc=0,pr=8,cd=0,t=0,lives=3;
const SAND=[[2,7],[5,6],[3,4],[6,3],[1,5],[7,6],[4,2]];
const CROCS=[{c:4,r:7,d:1},{c:2,r:3,d:-1},{c:6,r:1,d:1}];
const hud=H.hud(root,[['v','VIDAS',3]]);
const say=H.msg(root,'Chegue à terra firme 🏁! Areia movediça 🟤 prende (perde vida), crocodilos 🐊 andam — não encoste!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 pc=nc;pr=nr;cd=.16;H.sfx('tick');check();
}
function hurt(why){
 lives--;H.sfx('bad');hud.set('v',lives);
 if(lives<=0){gameOver(false);return;}
 pc=0;pr=8;
 say(why+' Vidas: '+lives);
}
function check(){
 if(SAND.some(s=>s[0]===pc&&s[1]===pr)){hurt('🟤 Areia movediça!');return;}
 if(CROCS.some(c=>c.c===pc&&c.r===pr)){hurt('🐊 Crocodilo!');return;}
 if(pc===8&&pr===0){gameOver(true);return;}
}
function gameOver(win){over=true;const sc=win?300+lives*100:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'🐊 Pântano cruzado!',sub:'Sem virar almoço!'}:{win:false,score:sc,title:'O brejo venceu!',sub:'Decore a areia e o ritmo dos crocodilos!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
let cT=0;
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 cT+=dt;
 if(cT>.6){cT=0;CROCS.forEach(c=>{c.c+=c.d;if(c.c<0||c.c>=N){c.d*=-1;c.c+=c.d*2;}});check();}
 x.fillStyle='#4A6E3E';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const s=SAND.some(q=>q[0]===c&&q[1]===r);
  x.fillStyle=s?'#8A6A2F':'#4A6E3E';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#3A5A30';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  if(s){x.font='20px system-ui';x.textAlign='center';x.fillText('🟤',OX+c*CS+24,OY+r*CS+34);}
 }
 x.font='22px system-ui';x.textAlign='center';
 x.fillText('🏁',OX+8*CS+24,OY+0*CS+34);
 CROCS.forEach(c=>x.fillText('🐊',OX+c.c*CS+24,OY+c.r*CS+34));
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+24,OY+pr*CS+24,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+24,OY+pr*CS+24,5,0,7);x.fill();
});
}});"""

# 328 — Mina Desabada
GAMES[328] = r"""/* NCODE N · 328 Mina Desabada — escape cavando! */
GREG(328,{
init(root,H){
let over=false,o2=100,tools=100,prog=0,t=0;
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['f','FERRAMENTAS','100%'],['s','SAÍDA','0%']]);
const say=H.msg(root,'Cave até a saída (100%)! Cavar gasta ferramenta e oxigênio. Descanse para poupar O₂. Ferramenta zera = mãos (lento)!');
const o=H.cvs(root,460,340),x=o.x;
H.btn(root,'⛏️ Cavar!',()=>{
 if(over)return;
 const eff=tools>0?8:2;
 prog+=eff;tools=Math.max(0,tools-7);o2-=3;
 H.sfx('tick');status();
 if(prog>=100){gameOver(true);return;}
},true);
H.btn(root,'😮‍💨 Poupar ar (+5 O₂)',()=>{
 if(over)return;
 o2=Math.min(100,o2+5);H.sfx('tick');status();
},false);
function status(){hud.set('ox',Math.max(0,o2|0)+'%');hud.set('f',(tools|0)+'%');hud.set('s',Math.min(100,prog|0)+'%');}
function gameOver(win){over=true;const sc=win?Math.max(150,400-(t|0)*3):prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'⛏️ Fora da mina!',sub:'Escapou com '+(o2|0)+'% de O₂.'}:{win:false,score:sc|0,title:'Sem ar!',sub:'Cave em ritmo e poupe oxigênio!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 o2-=dt*1.6;
 status();
 if(o2<=0){gameOver(false);return;}
 x.fillStyle='#2A2118';x.fillRect(0,0,460,340);
 x.fillStyle='#4A3A28';x.fillRect(0,100,460,240);
 x.fillStyle='#1A1410';x.fillRect(30,140,400*Math.min(1,prog/100),120);
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚪',430,240);
 x.fillText('⛏️',30+400*Math.min(1,prog/100),220);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(o2|0)+'% · 🔧 '+(tools|0)+'% · Saída '+(prog|0)+'%',14,30);
 x.fillStyle='#000';x.fillRect(14,40,300,12);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(14,40,300*Math.max(0,o2)/100,12);
});
status();
}});"""

# 329 — Vazamento na Estação Espacial
GAMES[329] = r"""/* NCODE N · 329 Vazamento na Estação Espacial — repare! */
GREG(329,{
init(root,H){
let over=false,o2=100,t=0,fixed=0;
const LEAKS=[];
for(let i=0;i<6;i++)LEAKS.push({x:60+Math.random()*340,y:70+Math.random()*220,hp:2+((Math.random()*2)|0),id:i});
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['r','REPAROS','0/6']]);
const say=H.msg(root,'Toque nos vazamentos 💨 para reparar (2-3 toques)! Cada vazamento drena O₂. Zere os 6 antes do ar acabar!');
const o=H.cvs(root,460,340),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 LEAKS.forEach(l=>{
  if(l.hp>0&&Math.hypot(px-l.x,py-l.y)<30){
   l.hp--;H.sfx('tick');
   if(l.hp<=0){fixed++;H.sfx('ok');hud.set('r',fixed+'/6');}
   if(fixed>=6){gameOver(true);return;}
  }
 });
});
function gameOver(win){over=true;const sc=win?Math.max(200,500-(t|0)*4):fixed*50;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🛰️ Estação salva!',sub:'6 vazamentos selados!'}:{win:false,score:sc|0,title:'Sem oxigênio!',sub:fixed+'/6 reparos. Seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const open=LEAKS.filter(l=>l.hp>0).length;
 o2-=dt*(1+open*1.1);
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 x.fillStyle='#1C2430';x.fillRect(0,0,460,340);
 x.strokeStyle='#4A5A6A';x.lineWidth=3;
 x.strokeRect(30,50,400,260);
 LEAKS.forEach(l=>{
  if(l.hp<=0){x.font='20px system-ui';x.textAlign='center';x.fillText('✅',l.x,l.y);return;}
  x.font='26px system-ui';x.fillText('💨',l.x+Math.sin(t*6+l.id)*4,l.y);
  x.fillStyle='#fff';x.font='bold 12px system-ui';x.fillText('x'+l.hp,l.x,l.y+22);
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(o2|0)+'% · 🔧 '+fixed+'/6',14,30);
 x.fillStyle='#000';x.fillRect(14,36,200,10);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(14,36,200*Math.max(0,o2)/100,10);
});
}});"""

# 330 — Base Subaquática
GAMES[330] = r"""/* NCODE N · 330 Base Subaquática — equilíbrio vital! */
GREG(330,{
init(root,H){
let over=false,o2=80,power=80,press=50,t=0,time=120;
const hud=H.hud(root,[['ox','O₂',80],['en','ENERGIA',80],['pr','PRESSÃO',50]]);
const say=H.msg(root,'Aguente 120s! O₂ cai sempre; energia cai com sistemas ligados; pressão oscila. Ligue/desligue com sabedoria!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let sys={o2:true,heat:true,pump:false};
function status(){
 hud.set('ox',Math.max(0,o2|0));hud.set('en',Math.max(0,power|0));hud.set('pr',press|0);
 st.innerHTML='🌊 '+(time|0)+'s restantes<br>O₂ '+o2.toFixed(0)+' · ⚡ '+power.toFixed(0)+' · 🧭 '+press.toFixed(0)+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,(sys.o2?'🟢':'🔴')+' Gerador O₂',()=>{sys.o2=!sys.o2;H.sfx('tick');status();},false);
 H.btn(brow,(sys.heat?'🟢':'🔴')+' Aquecedor',()=>{sys.heat=!sys.heat;H.sfx('tick');status();},false);
 H.btn(brow,(sys.pump?'🟢':'🔴')+' Bomba pressão',()=>{sys.pump=!sys.pump;H.sfx('tick');status();},false);
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?400:Math.max(20,120-time|0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Turno completo!',sub:'Base estável por 120s!'}:{win:false,score:sc|0,title:'Base perdida!',sub:why});}
H.every(500,()=>{
 if(over)return;
 time-=.5;
 o2+=(sys.o2&&power>0?4:-5)*.5;
 power+=((sys.o2?3:0)+(sys.heat?2:0)+(sys.pump?4:0)>0?-((sys.o2?3:0)+(sys.heat?2:0)+(sys.pump?4:0)):2)*.5;
 power=Math.min(100,power);
 press+=(sys.pump?-8:5+Math.sin(time)*3)*.5;
 press=H.clamp(press,0,100);
 if(!sys.heat)o2-=1;
 status();
 if(o2<=0){gameOver(false,'Sem oxigênio!');return;}
 if(power<=0&&!sys.o2){o2-=2;}
 if(press>=100){gameOver(false,'Pressão máxima — casco rompeu!');return;}
 if(press<=0){gameOver(false,'Pressão zerada!');return;}
 if(time<=0){gameOver(true);return;}
});
status();
}});"""

# 331 — Controle de Pragas
GAMES[331] = r"""/* NCODE N · 331 Controle de Pragas — defenda a fazenda! */
GREG(331,{
init(root,H){
let over=false,wave=0,crop=100,t=0,spawn=0,kills=0;
let pests=[];
const hud=H.hud(root,[['o','ONDA','0/6'],['l','LAVOURA',100]]);
const say=H.msg(root,'Esmague as pragas antes que cheguem à lavoura (base)! 6 ondas. Lavoura zera = fim!');
const o=H.cvs(root,460,420),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 for(let i=pests.length-1;i>=0;i--){
  const p=pests[i];
  if(Math.hypot(px-p.x,py-p.y)<24){pests.splice(i,1);kills++;H.sfx('ok');break;}
 }
});
function gameOver(win){over=true;const sc=kills*15+(win?250:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌾 Lavoura salva!',sub:kills+' pragas esmagadas!'}:{win:false,score:sc,title:'Lavoura devorada!',sub:'Onda '+wave+'/6. Seja mais rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(!pests.length){
  if(wave>=6){gameOver(true);return;}
  wave++;hud.set('o',wave+'/6');
  const kinds=['🦗','🐀','🐦‍⬛'];
  for(let i=0;i<4+wave*2;i++)pests.push({x:Math.random()*440+10,y:-i*46-Math.random()*60,k:kinds[i%3],sp:40+wave*10+Math.random()*20});
  say('Onda '+wave+'/6!');
 }
 spawn+=dt;
 pests.forEach(p=>{p.y+=p.sp*dt;});
 pests.filter(p=>p.y>360).forEach(p=>{pests.splice(pests.indexOf(p),1);crop-=8;H.sfx('bad');hud.set('l',Math.max(0,crop|0));});
 if(crop<=0){gameOver(false);return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,460,420);
 x.fillStyle='#3E7C4F';x.fillRect(0,360,460,60);
 x.font='18px system-ui';x.textAlign='center';
 for(let i=0;i<23;i++)x.fillText(crop>0?'🌽':'🥀',10+i*20,398);
 pests.forEach(p=>{x.font='24px system-ui';x.fillText(p.k==='🐦‍⬛'?'🐦':p.k,p.x,p.y);});
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Onda '+wave+'/6 · 🌽 '+(crop|0)+'% · ☠️ '+kills,12,26);
});
}});"""

# 332 — Erupção Solar
GAMES[332] = r"""/* NCODE N · 332 Erupção Solar — proteja a colônia! */
GREG(332,{
init(root,H){
let over=false,mat=20,shield=[0,0,0],t=0,waveT=0,wave=0,hp=100;
const hud=H.hud(root,[['m','MATERIAL',20],['o','ONDA','0/5'],['c','COLÔNIA',100]]);
const say=H.msg(root,'Distribua material nos 3 setores! Ondas de radiação atingem setores aleatórios — sem escudo = dano. 5 ondas!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('m',mat);hud.set('o',wave+'/5');hud.set('c',Math.max(0,hp|0));
 st.innerHTML='☀️ Onda '+wave+'/5 · 🧱 '+mat+' material<br>Setores: 🛡️ '+shield.join(' · ')+' · Colônia '+hp.toFixed(0)+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 for(let i=0;i<3;i++){
  H.btn(brow,'+Setor '+(i+1)+' ('+shield[i]+')',()=>{
   if(over||mat<=0)return;
   mat--;shield[i]++;H.sfx('tick');status();
  },false);
 }
}
H.every(4000,()=>{
 if(over)return;
 wave++;
 mat+=6;
 const hit=(Math.random()*3)|0,str=15+wave*8;
 if(shield[hit]>0){shield[hit]--;say('🛡️ Setor '+(hit+1)+' absorveu a onda!');H.sfx('ok');}
 else{hp-=str;say('☢️ Setor '+(hit+1)+' atingido! −'+str+'!');H.sfx('bad');}
 status();
 if(hp<=0){gameOver(false);return;}
 if(wave>=5){gameOver(true);return;}
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?Math.ceil(hp)*4:wave*40;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'☀️ Colônia protegida!',sub:'Sobreviveu às 5 ondas!'}:{win:false,score:sc|0,title:'Colônia irradiada!',sub:'Distribua escudos em todos os setores!'});}
status();
}});"""

# 333 — Tempestade de Areia
GAMES[333] = r"""/* NCODE N · 333 Tempestade de Areia — ache o oásis! */
GREG(333,{
init(root,H){
let over=false,px=60,py=400,tx=px,ty=py,water=100,t=0;
const OAS={x:400,y:70};
const hud=H.hud(root,[['a','ÁGUA','100%']]);
const say=H.msg(root,'Atravesse até o oásis 🌴! A visibilidade é curta — siga a bússola (seta). Água acaba = fim!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=win?Math.max(150,450-(t|0)*4):40;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌴 Oásis encontrado!',sub:'Água fresca!'}:{win:false,score:sc|0,title:'Perdido na tempestade!',sub:'Siga a seta da bússola!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 water-=dt*2.6;
 const sp=130*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,12,448);py=H.clamp(py,12,448);
 hud.set('a',Math.max(0,water|0)+'%');
 if(water<=0){gameOver(false);return;}
 if(Math.hypot(px-OAS.x,py-OAS.y)<30){gameOver(true);return;}
 x.fillStyle='#D9B36B';x.fillRect(0,0,460,460);
 x.fillStyle='rgba(217,179,107,.85)';
 for(let i=0;i<30;i++){const sx=(i*173+t*220)%520-30,sy=(i*97+t*60)%500-20;x.fillRect(sx,sy,46,10);}
 const dO=Math.hypot(px-OAS.x,py-OAS.y);
 if(dO<140){x.font='40px system-ui';x.textAlign='center';x.fillText('🌴',OAS.x,OAS.y);}
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,10,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.stroke();
 const a=Math.atan2(OAS.y-py,OAS.x-px);
 x.strokeStyle='#D94E34';x.lineWidth=4;
 x.beginPath();x.moveTo(px,py-24);x.lineTo(px+Math.cos(a)*22,py-24+Math.sin(a)*22);x.stroke();
 x.fillStyle='#181816';x.font='bold 12px system-ui';x.textAlign='center';x.fillText('BÚSSOLA',px,py-32);
});
}});"""

# 334 — Gelo Flutuante
GAMES[334] = r"""/* NCODE N · 334 Gelo Flutuante — pule sem cair! */
GREG(334,{
init(root,H){
let over=false,pi=0,jump=0,jT=0,t=0,lives=3;
const B=[];
for(let i=0;i<10;i++)B.push({x:60+i*62,y:300+Math.sin(i*1.3)*60,melt:0,gone:false});
const hud=H.hud(root,[['v','VIDAS',3],['d','DIST','0/10']]);
const say=H.msg(root,'Toque no próximo bloco (ou Espaço) para pular! Blocos derretem com o tempo — rápido! 3 quedas na água = fim.');
const o=H.cvs(root,680,420),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(d&&c==='Space')hop();});
H.onTap(o,()=>hop());
function hop(){
 if(over||jump)return;
 jump=1;jT=0;H.sfx('tick');
}
function gameOver(win){over=true;const sc=win?350+lives*100:pi*30;H.score(sc);
H.done(win?{win:true,score:sc,title:'🧊 Terra firme!',sub:'Atravessou o degelo!'}:{win:false,score:sc,title:'Água gelada!',sub:'3 quedas. Pule sem hesitar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 B.forEach((b,i)=>{if(!b.gone&&i>=pi)b.melt+=dt*(i===pi?6:2.5);if(b.melt>26)b.gone=true;});
 if(jump){
  jT+=dt/.45;
  if(jT>=1){
   jump=0;jT=0;
   const nb=B[pi+1];
   if(!nb||nb.gone||Math.abs(60+(pi+1)*62-(60+pi*62))>90){
    lives--;H.sfx('bad');hud.set('v',lives);
    if(lives<=0){gameOver(false);return;}
   }else{pi++;H.sfx('ok');hud.set('d',pi+'/10');}
   if(pi>=9){gameOver(true);return;}
  }
 }else{
  const cur=B[pi];
  if(cur&&cur.gone){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}cur.gone=false;cur.melt=0;}
 }
 x.fillStyle='#123F5C';x.fillRect(0,0,680,420);
 x.fillStyle='#3E7C4F';x.fillRect(620,180,60,240);
 x.fillStyle='#5A4A33';x.fillRect(0,200,50,220);
 B.forEach((b,i)=>{
  if(b.gone)return;
  const s=1-b.melt/30;
  x.fillStyle='#DCEEF5';
  x.beginPath();x.ellipse(b.x,b.y+Math.sin(t*2+i)*4,34*s,20*s,0,0,7);x.fill();
  x.strokeStyle='#8A877C';x.stroke();
 });
 let jx=60+pi*62,jy=B[pi]?B[pi].y:300;
 if(jump&&B[pi+1]){jx=jx+(62)*jT;jy=jy-70*Math.sin(jT*Math.PI);}
 x.font='30px system-ui';x.textAlign='center';x.fillText('🐧',jx,jy-14);
});
}});"""

# 335 — Poço Envenenado
GAMES[335] = r"""/* NCODE N · 335 Poço Envenenado — água pura pra vila! */
GREG(335,{
init(root,H){
let over=false,quota=0,t=0,time=120;
const WELLS=[];
for(let i=0;i<6;i++)WELLS.push({x:50+(i%3)*150,y:100+((i/3)|0)*120,pois:Math.random()<.5,tested:false,pure:false});
const hud=H.hud(root,[['q','COTA','0/4'],['tp','TEMPO',120]]);
const say=H.msg(root,'1º toque TESTA o poço, 2º toque PURIFICA (se sujo) ou COLETA (se limpo)! Entregue 4 águas puras em 2 min!');
const o=H.cvs(root,480,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 WELLS.forEach(w=>{
  if(Math.hypot(px-w.x-40,py-w.y-35)<55){
   if(w.pure){H.sfx('bad');return;}
   if(!w.tested){w.tested=true;H.sfx('tick');}
   else if(w.pois){w.pois=false;H.sfx('ok');}
   else{w.pure=true;quota++;H.sfx('ok');hud.set('q',quota+'/4');}
   if(quota>=4){gameOver(true);return;}
  }
 });
});
function gameOver(win){over=true;const sc=quota*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'💧 Vila salva!',sub:'4 águas puras entregues!'}:{win:false,score:sc,title:'Tempo esgotado!',sub:quota+'/4 águas. Teste, purifique, colete!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(quota>=4);return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,480,360);
 WELLS.forEach(w=>{
  x.fillStyle='#8A6A2F';x.fillRect(w.x,w.y,80,60);
  x.fillStyle='#4A2F1B';x.fillRect(w.x+10,w.y+10,60,25);
  x.font='16px system-ui';x.textAlign='center';
  if(w.pure)x.fillText('✅',w.x+40,w.y+75);
  else if(!w.tested)x.fillText('❓',w.x+40,w.y+75);
  else if(w.pois)x.fillText('☠️',w.x+40,w.y+75);
  else x.fillText('💧',w.x+40,w.y+75);
 });
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('💧 '+quota+'/4 · ⏱️'+Math.ceil(time)+'s',12,28);
});
}});"""

# 336 — Apagão no Hospital
GAMES[336] = r"""/* NCODE N · 336 Apagão no Hospital — mantenha a energia! */
GREG(336,{
init(root,H){
let over=false,fuel=60,gen=[true,false],uptime=0,t=0,time=120;
const hud=H.hud(root,[['e','ENERGIA','ON'],['cb','COMBUSTÍVEL',60],['tp','TEMPO',120]]);
const say=H.msg(root,'Aguente 120s com energia! Geradores gastam combustível; abasteça (+20, espera). Sem energia, pacientes em risco!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let risk=0;
function status(){
 const on=gen.some(g=>g)&&fuel>0;
 hud.set('e',on?'ON':'OFF');hud.set('cb',Math.max(0,fuel|0));hud.set('tp',Math.ceil(time));
 st.innerHTML='🏥 Energia: '+(on?'🟢 ON':'🔴 OFF')+' · ⛽ '+fuel.toFixed(0)+'<br>G1 '+(gen[0]?'ligado':'desligado')+' · G2 '+(gen[1]?'ligado':'desligado')+' · Risco '+risk.toFixed(0)+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🔌 Alternar G1',()=>{gen[0]=!gen[0];H.sfx('tick');status();},false);
 H.btn(brow,'🔌 Alternar G2',()=>{gen[1]=!gen[1];H.sfx('tick');status();},false);
 H.btn(brow,'⛽ Abastecer (+20)',()=>{fuel=Math.min(100,fuel+20);H.sfx('tick');status();},true);
}
H.every(500,()=>{
 if(over)return;
 time-=.5;
 const n=gen.filter(g=>g).length;
 if(n>0&&fuel>0){fuel-=n*1.2;uptime+=.5;risk=Math.max(0,risk-3);}
 else{risk+=4;}
 status();
 if(risk>=100){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(fuel)*2:uptime|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🏥 Plantão cumprido!',sub:'Energia mantida!'}:{win:false,score:sc|0,title:'Apagão crítico!',sub:'Ligue ao menos 1 gerador com combustível!'});}
status();
}});"""

# 337 — Ponte Caindo
GAMES[337] = r"""/* NCODE N · 337 Ponte Caindo — resgate os carros! */
GREG(337,{
init(root,H){
let over=false,t=0,saved=0;
const CARS=[];
for(let i=0;i<6;i++)CARS.push({x:60+i*62,y:200,ttl:25+i*14,saved:false,gone:false});
const hud=H.hud(root,[['s','SALVOS','0/6']]);
const say=H.msg(root,'Toque nos carros para guiá-los para fora antes que caiam! Salve 5 de 6!');
const o=H.cvs(root,460,340),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 CARS.forEach(c=>{
  if(!c.saved&&!c.gone&&Math.hypot(px-c.x,py-c.y)<30){
   c.saved=true;saved++;H.sfx('ok');hud.set('s',saved+'/6');
   if(saved>=5){gameOver(true);return;}
  }
 });
});
function gameOver(win){over=true;const sc=saved*70+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌉 Resgate total!',sub:saved+' carros salvos!'}:{win:false,score:sc,title:'A ponte caiu!',sub:saved+'/5 salvos. Seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 CARS.forEach(c=>{
  if(c.saved||c.gone)return;
  c.ttl-=dt;
  if(c.ttl<=0){c.gone=true;H.sfx('bad');}
 });
 if(CARS.every(c=>c.saved||c.gone)){gameOver(saved>=5);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,340);
 x.fillStyle='#2E6E8A';x.fillRect(0,240,460,100);
 x.fillStyle='#8A877C';x.fillRect(30,220,400,20);
 x.fillStyle='#3E7C4F';x.fillRect(0,220,30,20);x.fillRect(430,220,30,20);
 CARS.forEach(c=>{
  if(c.saved){x.font='22px system-ui';x.textAlign='center';x.fillText('🚗',12+saved*4,210);return;}
  if(c.gone){return;}
  x.font='26px system-ui';x.textAlign='center';x.fillText('🚗',c.x,c.y+8+Math.sin(t*10+c.x)*2);
  x.fillStyle='#000';x.fillRect(c.x-20,c.y-26,40,6);
  x.fillStyle=c.ttl<8?'#D94E34':'#E8A33D';x.fillRect(c.x-20,c.y-26,40*Math.max(0,c.ttl/39),6);
 });
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('🚗 '+saved+'/5 salvos',12,28);
});
}});"""

# 338 — Derramamento de Óleo
GAMES[338] = r"""/* NCODE N · 338 Derramamento de Óleo — contenha! */
GREG(338,{
init(root,H){
const N=10,CS=40,OX=30,OY=40;
let over=false,oil=[],booms=[],t=0,tick=0,time=150;
oil.push([4,2]);
const hud=H.hud(root,[['tp','TEMPO',150],['m','MANCHA',1]]);
const say=H.msg(root,'Toque na água para lançar barreiras 🟡! Cerque a mancha antes que toque a costa (embaixo). Sobreviva 150s!');
const o=H.cvs(root,460,470),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(c<0||c>=N||r<0||r>=N||r>=8)return;
 const k=c+','+r;
 if(oil.some(q=>q[0]===c&&q[1]===r)||booms.includes(k))return;
 if(booms.length>=14){say('Limite de 14 barreiras!');H.sfx('bad');return;}
 booms.push(k);H.sfx('tick');
});
function gameOver(win,why){over=true;const sc=win?400:Math.max(20,150-time|0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Costa salva!',sub:'Mancha contida!'}:{win:false,score:sc|0,title:'Desastre!',sub:why});}
H.loop(dt=>{
 if(over)return;t+=dt;tick+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));hud.set('m',oil.length);
 if(tick>1.6){tick=0;
  const news=[];
  oil.forEach(q=>{
   [[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{
    const nc=q[0]+d[0],nr=q[1]+d[1];
    if(nc<0||nc>=N||nr<0||nr>=N)return;
    const k=nc+','+nr;
    if(booms.includes(k)||oil.some(z=>z[0]===nc&&z[1]===nr)||news.some(z=>z[0]===nc&&z[1]===nr))return;
    news.push([nc,nr]);
   });
  });
  oil=oil.concat(news);
  if(oil.some(q=>q[1]>=8)){gameOver(false,'O óleo chegou à costa!');return;}
  // cercada?
  const edge=oil.some(q=>q[0]===0||q[0]===N-1||q[1]===0||q[1]===7);
  if(!edge&&news.length===0){gameOver(true);return;}
 }
 if(time<=0){gameOver(true);return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,460,470);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const isOil=oil.some(q=>q[0]===c&&q[1]===r);
  const isBoom=booms.includes(c+','+r);
  x.fillStyle=r>=8?'#E8C86B':isOil?'#1A1A1A':isBoom?'#E8A33D':'#2E6E8A';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='rgba(255,255,255,.2)';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('⏱️'+Math.ceil(time)+'s · Mancha '+oil.length+' · Barreiras '+booms.length+'/14',14,28);
});
}});"""

# 339 — Fusão Nuclear
GAMES[339] = r"""/* NCODE N · 339 Fusão Nuclear — resfrie o núcleo! */
GREG(339,{
init(root,H){
let over=false,temp=500,t=0,time=120,flow=[0,0,0];
const hud=H.hud(root,[['t','TEMP','500°'],['tp','TEMPO',120]]);
const say=H.msg(root,'Aguente 120s! Abra válvulas para resfriar — mas cada válvula aberta gasta água. Sem água = sem resfriamento!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let water=100;
function status(){
 hud.set('t',(temp|0)+'°');hud.set('tp',Math.ceil(time));
 st.innerHTML='☢️ '+(temp|0)+'°C · 💧 '+(water|0)+'% · ⏱️'+Math.ceil(time)+'s<br>Válvulas: '+flow.map(f=>f?'🟢':'🔴').join(' ');
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 for(let i=0;i<3;i++){
  H.btn(brow,'Válvula '+(i+1)+' '+(flow[i]?'ON':'OFF'),()=>{
   flow[i]=flow[i]?0:1;H.sfx('tick');status();
  },false);
 }
}
H.every(500,()=>{
 if(over)return;
 time-=.5;
 const n=flow.filter(f=>f).length;
 temp+=((n>0&&water>0?-90:60)+Math.sin(time)*10)*.5;
 if(n>0&&water>0)water-=n*2;
 water=Math.min(100,water+.8);
 temp=H.clamp(temp,100,1200);
 status();
 if(temp>=1000){gameOver(false);return;}
 if(time<=0){gameOver(true);return;}
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(water)*2:Math.max(20,120-time|0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'☢️ Núcleo estável!',sub:'Crise evitada!'}:{win:false,score:sc|0,title:'FUSÃO!',sub:'Abra válvulas antes dos 1000°!'});}
status();
}});"""

# 340 — Resposta à Pandemia
GAMES[340] = r"""/* NCODE N · 340 Resposta à Pandemia — cure a cidade! */
GREG(340,{
init(root,H){
let over=false,day=1,sick=10,cured=0,hosp=0,vac=0,act=2,pop=100;
const hud=H.hud(root,[['d','DIA','1/20'],['d2','DOENTES',10],['c','CURADOS',0]]);
const say=H.msg(root,'Zere os doentes em 20 dias! Hospitais curam, vacinas previnem, lockdown freia o contágio (mas cansa a ação)!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){
 hud.set('d',day+'/20');hud.set('d2',Math.ceil(sick));hud.set('c',cured);
 st.innerHTML='🦠 Dia '+day+'/20 · Ações: '+act+'<br>🤒 '+sick.toFixed(0)+' · 💚 '+cured+' · 🏥 '+hosp+' · 💉 '+vac;
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,'🏥 Hospital (+1)',()=>{if(act<=0||over)return;hosp++;act--;H.sfx('tick');after();},false);
 H.btn(brow,'💉 Vacinar (+12)',()=>{if(act<=0||over)return;vac+=12;act--;H.sfx('tick');after();},false);
 H.btn(brow,'🔒 Lockdown',()=>{if(act<=0||over)return;act--;lock=true;H.sfx('tick');after();},true);
}
let lock=false;
function after(){
 if(act>0){status();return;}
 day++;
 const spread=sick*.35*(lock?.3:1)*(1-Math.min(.8,vac/100));
 const cure=Math.min(sick,hosp*6+4);
 sick=sick+spread-cure;
 cured+=Math.ceil(cure);
 lock=false;
 if(sick<1){gameOver(true);return;}
 if(sick>=pop){gameOver(false);return;}
 if(day>20){gameOver(sick<5);return;}
 act=2;status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+cured*2:cured*2;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'💚 Cidade curada!',sub:cured+' curados!'}:{win:false,score:sc|0,title:'Colapso!',sub:'Combine hospital + vacina + lockdown!'});}
status();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
