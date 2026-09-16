#!/usr/bin/env python3
"""Gera games/g341..g360 — EXPLORE."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 341 — Mapa do Tesouro
GAMES[341] = r"""/* NCODE N · 341 Mapa do Tesouro — siga as pistas! */
GREG(341,{
init(root,H){
const CLUES=[
 ['🌴 "Onde a palmeira solitária dorme…"',['Palmeira do norte','Palmeira do sul','Coqueiral'],0],
 ['🪨 "A pedra que parece tartaruga…"',['Pedra redonda','Pedra tartaruga','Pedra alta'],1],
 ['💀 "Sob o olhar da caveira…"',['Caverna escura','Arco de pedra','Mirante'],1],
 ['🌊 "Onde a onda beija a areia…"',['Piscina natural','Enseada sul','Recife'],1],
 ['❌ "X marca o ponto final!"',['Sob a palmeira','Atrás da pedra','No centro da enseada'],2]
];
let over=false,step=0,digs=3;
const hud=H.hud(root,[['p','PISTA','1/5'],['pa','PÁS',3]]);
const say=H.msg(root,'Siga as 5 pistas do mapa! Cada pista: escolha o local. Errou = perde 1 pá. Acertou tudo = tesouro!');
const box=H.el('div','g-col',null,root);
const cl=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('p',Math.min(5,step+1)+'/5');hud.set('pa',digs);}
function show(){
 const c=CLUES[step];
 cl.innerHTML='<b>Pista '+(step+1)+'/5:</b> '+c[0];
 brow.innerHTML='';
 c[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===c[2]){step++;H.sfx('ok');
    if(step>=5){gameOver(true);return;}
    say('✅ Certo! Próxima pista…');
   }else{digs--;H.sfx('bad');
    if(digs<=0){gameOver(false);return;}
    say('❌ Lugar errado! Pás: '+digs);
   }
   status();show();
  },false);
 });
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?300+digs*100:step*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'💰 Tesouro encontrado!',sub:'X marcava o ponto!'}:{win:false,score:sc,title:'Mapa perdido!',sub:'Sem pás. Leia as pistas com calma!'});}
show();
}});"""

# 342 — Escavação de Fósseis
GAMES[342] = r"""/* NCODE N · 342 Escavação de Fósseis — escave com cuidado! */
GREG(342,{
init(root,H){
const N=8,CS=52,OX=22,OY=22;
let over=false,hp=100,found=0,t=0;
// esqueleto: espinha + costelas
const BONE=new Set(['3,2','3,3','3,4','3,5','2,3','4,3','2,4','4,4','1,3','5,3','3,1','3,6']);
let dug=new Set();
const hud=H.hud(root,[['o','OSSOS','0/12'],['i','INTEGRIDADE','100%']]);
const say=H.msg(root,'Toque para escavar cada quadrado! 🦴 = osso (gentil). Escavar osso 2× quebra (−integridade). Ache os 12!');
const o=H.cvs(root,460,460),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(c<0||c>=N||r<0||r>=N)return;
 const k=c+','+r;
 if(dug.has(k)){
  if(BONE.has(k)){hp-=15;H.sfx('bad');hud.set('i',Math.max(0,hp)+'%');
   if(hp<=0){gameOver(false);return;}}
  return;
 }
 dug.add(k);H.sfx('tick');
 if(BONE.has(k)){found++;H.sfx('ok');hud.set('o',found+'/12');}
 if(found>=12){gameOver(true);return;}
});
function gameOver(win){over=true;const sc=found*30+(win?hp*2:0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🦕 Esqueleto completo!',sub:'12 ossos, integridade '+(hp|0)+'%.'}:{win:false,score:sc|0,title:'Fóssil quebrou!',sub:'Não escave o osso 2 vezes!'});}
H.loop(()=>{
 if(over)return;
 x.fillStyle='#C9B189';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const k=c+','+r;
  x.fillStyle=!dug.has(k)?'#8A6A2F':BONE.has(k)?'#EDE8DC':'#B9A37E';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#5A4A33';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  if(dug.has(k)&&BONE.has(k)){x.font='26px system-ui';x.textAlign='center';x.fillText('🦴',OX+c*CS+26,OY+r*CS+36);}
 }
});
}});"""

# 343 — Mergulho Profundo
GAMES[343] = r"""/* NCODE N · 343 Mergulho Profundo — fotografe o abismo! */
GREG(343,{
init(root,H){
let over=false,py=100,o2=100,t=0,photos=0;
const SP=[];
const KINDS=['🐙','🦑','🐡','🦈','🐋','🪼'];
for(let i=0;i<12;i++)SP.push({y:200+i*160,x:60+Math.random()*340,k:KINDS[i%6],got:false,ph:Math.random()*7});
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['f','FOTOS','0/6']]);
const say=H.msg(root,'Desça com ⬇️, suba com ⬆️! Perto da criatura, toque FOTOGRAFAR. 6 espécies diferentes! O₂ acaba = fim.');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const s=SP.find(q=>!q.got&&SP.indexOf(q)%2===0?false:!q.got&&Math.abs(py-q.y)<60);
 if(s){s.got=true;photos++;H.sfx('ok');hud.set('f',photos+'/6');
  if(photos>=6){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=photos*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'📸 Abismo documentado!',sub:'6 espécies fotografadas!'}:{win:false,score:sc,title:'Sem ar!',sub:photos+'/6 fotos. Suba para respirar? Não — seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(dn.ArrowUp||dn.KeyW)py-=160*dt;
 if(dn.ArrowDown||dn.KeyS)py+=160*dt;
 py=H.clamp(py,60,2000);
 o2-=dt*(2+py/500);
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 const cam=H.clamp(py-260,0,1560);
 const g=py/2000;
 x.fillStyle='rgb('+(20-g*15|0)+','+(60-g*50|0)+','+(90-g*70|0)+')';
 x.fillRect(0,0,460,520);
 SP.forEach(s=>{
  const sy=s.y-cam;
  if(sy<-30||sy>550)return;
  x.font='34px system-ui';x.textAlign='center';
  x.fillText(s.got?'✅':s.k,s.x+Math.sin(t+s.ph)*20,sy);
 });
 x.font='30px system-ui';x.fillText('🤿',230,py-cam+10);
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(o2|0)+'% · 📸 '+photos+'/6 · '+(py|0)+'m',12,26);
});
}});"""

# 344 — Sonda Espacial
GAMES[344] = r"""/* NCODE N · 344 Sonda Espacial — fotografe o sistema! */
GREG(344,{
init(root,H){
let over=false,px=60,py=260,fuel=100,t=0,photos=0;
const PL=[
 {x:400,y:120,k:'🪐',got:false},{x:700,y:330,k:'🔴',got:false},{x:1000,y:150,k:'🌎',got:false},
 {x:1300,y:300,k:'🪨',got:false},{x:1600,y:200,k:'☄️',got:false}
];
const hud=H.hud(root,[['cb','COMBUSTÍVEL','100%'],['f','FOTOS','0/5']]);
const say=H.msg(root,'Voe até cada corpo celeste e FOTOGRAFE! Setas/toque movem. Sem combustível = à deriva!');
const o=H.cvs(root,560,420),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx+cam;ty=qy;});
let tx=null,ty=null,cam=0;
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const p=PL.find(q=>!q.got&&Math.hypot(px-q.x,py-q.y)<70);
 if(p){p.got=true;photos++;H.sfx('ok');hud.set('f',photos+'/5');
  if(photos>=5){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=photos*70+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🛰️ Missão completa!',sub:'5 corpos fotografados!'}:{win:false,score:sc,title:'À deriva!',sub:photos+'/5 fotos. Economize combustível!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=170*dt;
 let mv=false;
 if(dn.ArrowLeft||dn.KeyA){px-=sp;mv=true;}
 if(dn.ArrowRight||dn.KeyD){px+=sp;mv=true;}
 if(dn.ArrowUp||dn.KeyW){py-=sp;mv=true;}
 if(dn.ArrowDown||dn.KeyS){py+=sp;mv=true;}
 if(tx!=null){const d=Math.hypot(tx-px,ty-py);if(d>8){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;mv=true;}}
 px=H.clamp(px,30,1770);py=H.clamp(py,30,390);
 if(mv)fuel-=dt*4;
 hud.set('cb',Math.max(0,fuel|0)+'%');
 if(fuel<=0){gameOver(false);return;}
 cam=H.clamp(px-140,0,1240);
 x.fillStyle='#0C0C18';x.fillRect(0,0,560,420);
 x.fillStyle='#fff';
 for(let i=0;i<60;i++){const sx=(i*197-cam*.2%560+560)%560,sy=(i*131)%420;x.fillRect(sx,sy,2,2);}
 PL.forEach(p=>{
  const qx=p.x-cam;
  if(qx>-40&&qx<600){
   x.font='40px system-ui';x.textAlign='center';x.fillText(p.k,qx,p.y);
   if(!p.got){x.strokeStyle='#C4D645';x.lineWidth=2;x.beginPath();x.arc(qx,p.y,44,0,7);x.stroke();}
   else{x.font='20px system-ui';x.fillText('✅',qx,p.y-36);}
  }
 });
 x.font='26px system-ui';x.fillText('🛰️',px-cam,py+9);
});
}});"""

# 345 — Ruínas na Selva
GAMES[345] = r"""/* NCODE N · 345 Ruínas na Selva — abra as 3 portas! */
GREG(345,{
init(root,H){
let over=false,door=0;
const hud=H.hud(root,[['p','PORTA','1/3']]);
const say=H.msg(root,'3 portas, 3 enigmas! Passe por todas até o centro do templo.');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const QUIZ=[
 ['🚪 Porta do Sol: qual símbolo abre? (dica: nasce no leste)',['🌙','☀️','⭐'],1],
 ['🚪 Porta do Rio: o que flui sem pernas?',['🐍','💧','🌬️'],1],
 ['🚪 Porta do Templo: 7 + 5 × 2 = ?',['24','17','19'],1]
];
let tries=3;
function show(){
 const q=QUIZ[door];
 hud.set('p',(door+1)+'/3');
 qz.innerHTML='<b>'+q[0]+'</b><br> Tentativas: '+'❤️'.repeat(tries);
 brow.innerHTML='';
 q[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===q[2]){door++;H.sfx('ok');
    if(door>=3){gameOver(true);return;}
    say('✅ Porta aberta! Próximo enigma…');show();
   }else{tries--;H.sfx('bad');
    if(tries<=0){gameOver(false);return;}
    say('❌ Errado! Tentativas: '+tries);show();
   }
  },false);
 });
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?300+tries*100:door*80;H.score(sc);
H.done(win?{win:true,score:sc,title:'🛕 Coração do templo!',sub:'3 portas abertas!'}:{win:false,score:sc,title:'Templo selado!',sub:'Sem tentativas. Pense antes!'});}
show();
}});"""

# 346 — Pinturas Rupestres
GAMES[346] = r"""/* NCODE N · 346 Pinturas Rupestres — documente a caverna! */
GREG(346,{
init(root,H){
let over=false,px=230,py=400,tx=px,ty=py,t=0,doc=0;
const PT=[];
for(let i=0;i<5;i++)PT.push({x:50+Math.random()*360,y:60+Math.random()*300,got:false});
const hud=H.hud(root,[['d','DOCUMENTADAS','0/5']]);
const say=H.msg(root,'Explore no escuro com a tocha! Perto de uma pintura 🎨, toque DOCUMENTAR. 5 pinturas!');
const o=H.cvs(root,460,480),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'📝 Documentar',()=>{
 if(over)return;
 const p=PT.find(q=>!q.got&&Math.hypot(px-q.x,py-q.y)<70);
 if(p){p.got=true;doc++;H.sfx('ok');hud.set('d',doc+'/5');
  if(doc>=5){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=win?Math.max(150,450-(t|0)*3):doc*50;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🎨 Acervo completo!',sub:'5 pinturas documentadas!'}:{win:false,score:sc|0,title:'Fim!',sub:doc+'/5. Explore cada canto!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=140*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,20,440);py=H.clamp(py,20,460);
 x.fillStyle='#0C0C10';x.fillRect(0,0,460,480);
 x.fillStyle='rgba(232,163,61,.12)';x.beginPath();x.arc(px,py,110,0,7);x.fill();
 PT.forEach(p=>{
  if(Math.hypot(px-p.x,py-p.y)>110&&!p.got)return;
  x.font='30px system-ui';x.textAlign='center';
  x.fillText(p.got?'✅':'🎨',p.x,p.y+10);
 });
 x.font='24px system-ui';x.fillText('🔦',px,py+8);
 if(t>150){gameOver(doc>=5);return;}
});
}});"""

# 347 — Poça de Maré
GAMES[347] = r"""/* NCODE N · 347 Poça de Maré — catálogo da maré! */
GREG(347,{
init(root,H){
let over=false,found={},t=0,time=90;
const CR=[
 {k:'🦀',n:'caranguejo',x:80,y:120},{k:'⭐',n:'estrela-do-mar',x:200,y:220},{k:'🐚',n:'concha',x:330,y:140},
 {k:'🦐',n:'camarão',x:140,y:300},{k:'🐙',n:'polvo bebê',x:380,y:290},{k:'🪸',n:'anêmona',x:260,y:90}
];
const ROCKS=[];
for(let i=0;i<8;i++)ROCKS.push({x:40+Math.random()*380,y:60+Math.random()*300,open:false});
CR.forEach(c=>{const r=ROCKS[(Math.random()*ROCKS.length)|0];c.rx=r.x;c.ry=r.y;});
const hud=H.hud(root,[['c','CATÁLOGO','0/6'],['tp','TEMPO',90]]);
const say=H.msg(root,'Toque nas pedras para virar e achar bichos! Toque no bicho para catalogar. 6 espécies em 90s!');
const o=H.cvs(root,460,380),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 let hit=false;
 ROCKS.forEach(r=>{if(Math.hypot(px-r.x,py-r.y)<30){r.open=true;hit=true;H.sfx('tick');}});
 if(!hit)CR.forEach(c=>{
  if(!found[c.n]&&Math.hypot(px-c.x,py-c.y)<26){
   const r=ROCKS.find(q=>q.x===c.rx&&q.y===c.ry);
   if(r&&r.open){found[c.n]=1;H.sfx('ok');
    hud.set('c',Object.keys(found).length+'/6');
    if(Object.keys(found).length>=6){gameOver(true);return;}}
  }
 });
});
function gameOver(win){over=true;const n=Object.keys(found).length;const sc=n*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🦀 Catálogo completo!',sub:'6 bichos da maré!'}:{win:false,score:sc,title:'A maré subiu!',sub:n+'/6. Vire todas as pedras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(Object.keys(found).length>=6);return;}
 x.fillStyle='#7FB3C8';x.fillRect(0,0,460,380);
 x.fillStyle='#E8C86B';x.fillRect(0,330,460,50);
 CR.forEach(c=>{
  if(found[c.n])return;
  const r=ROCKS.find(q=>q.x===c.rx&&q.y===c.ry);
  if(r&&r.open){x.font='26px system-ui';x.textAlign='center';x.fillText(c.k,c.x,c.y);}
 });
 ROCKS.forEach(r=>{
  if(r.open)return;
  x.fillStyle='#5A5A55';x.beginPath();x.ellipse(r.x,r.y,28,20,0,0,7);x.fill();
 });
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('📋 '+Object.keys(found).join(', ')+'  ⏱️'+Math.ceil(time),12,26);
});
}});"""

# 348 — Observador de Aves
GAMES[348] = r"""/* NCODE N · 348 Observador de Aves — identifique! */
GREG(348,{
init(root,H){
const BIRDS=[['🐦','pardal'],['🦜','papagaio'],['🦅','águia'],['🦉','coruja'],['🦩','flamingo'],['🐧','pinguim']];
let over=false,round=0,score=0,t=0,cur=0,opts=[];
const hud=H.hud(root,[['r','AVE','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Uma ave aparece — identifique a espécie! 8 aves, tempo por ave. Rápido = mais pontos!');
const box=H.el('div','g-col',null,root);
const bd=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let timer=0;
function show(){
 if(round>=8){gameOver(true);return;}
 cur=(Math.random()*BIRDS.length)|0;
 opts=[cur];
 while(opts.length<3){const i=(Math.random()*BIRDS.length)|0;if(!opts.includes(i))opts.push(i);}
 opts.sort(()=>Math.random()-.5);
 timer=10;
 bd.innerHTML='<span style="font-size:64px">'+BIRDS[cur][0]+'</span><br>Que ave é essa? ('+Math.ceil(timer)+'s)';
 brow.innerHTML='';
 opts.forEach(i=>{
  H.btn(brow,BIRDS[i][1],()=>{
   if(over)return;
   if(i===cur){score+=50+Math.ceil(timer)*10;H.sfx('ok');}
   else{score=Math.max(0,score-30);H.sfx('bad');}
   round++;hud.set('r',Math.min(8,round+1)+'/8');hud.set('pt',score);
   show();
  },false);
 });
 hud.set('r',(round+1)+'/8');
}
H.every(1000,()=>{
 if(over)return;
 timer--;
 if(timer<=0){round++;score=Math.max(0,score-20);hud.set('pt',score);show();return;}
 bd.innerHTML='<span style="font-size:64px">'+BIRDS[cur][0]+'</span><br>Que ave é essa? ('+Math.ceil(timer)+'s)';
});
function gameOver(win){over=true;H.score(score);
H.done({win:score>=400,score,title:score>=400?'🔭 Ornitólogo!':'🔭 Fim da observação!',sub:score+' pontos em 8 aves.'});}
show();
}});"""

# 349 — Mapa Estelar
GAMES[349] = r"""/* NCODE N · 349 Mapa Estelar — ligue as constelações! */
GREG(349,{
init(root,H){
let over=false,ci=0,path=[],t=0,time=150;
const CONS=[
 {n:'Triângulo',pts:[[100,100],[200,80],[150,180]],need:[0,1,2]},
 {n:'Linha do Norte',pts:[[300,120],[340,200],[380,280],[330,330]],need:[0,1,2,3]},
 {n:'Casa',pts:[[120,300],[200,300],[200,380],[120,380],[160,250]],need:[4,0,1,2,3]}
];
const hud=H.hud(root,[['c','CONSTELAÇÃO','1/3'],['tp','TEMPO',150]]);
const say=H.msg(root,'Ligue as estrelas NA ORDEM dos números! Toque estrela por estrela. 3 constelações!');
const o=H.cvs(root,460,460),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 const c=CONS[ci];
 c.pts.forEach((p,i)=>{
  if(Math.hypot(px-p[0],py-p[1])<26){
   if(c.need[path.length]===i){path.push(i);H.sfx('tick');
    if(path.length>=c.need.length){
     ci++;path=[];
     if(ci>=3){gameOver(true);return;}
     hud.set('c',(ci+1)+'/3');H.sfx('ok');
    }
   }else{path=[];H.sfx('bad');say('❌ Ordem errada! Recomece a constelação.');}
  }
 });
});
function gameOver(win){over=true;const sc=win?300+Math.ceil(time)*2:ci*80;H.score(sc);
H.done(win?{win:true,score:sc,title:'✨ Céu mapeado!',sub:'3 constelações ligadas!'}:{win:false,score:sc,title:'Amanheceu!',sub:ci+'/3. Siga os números!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(ci>=3);return;}
 x.fillStyle='#0C0C18';x.fillRect(0,0,460,460);
 x.fillStyle='#fff';
 for(let i=0;i<40;i++)x.fillRect((i*197)%460,(i*131)%460,2,2);
 if(ci>=3)return;
 const c=CONS[ci];
 x.strokeStyle='#C4D645';x.lineWidth=3;
 x.beginPath();
 path.forEach((pi,k)=>{const p=c.pts[pi];if(k===0)x.moveTo(p[0],p[1]);else x.lineTo(p[0],p[1]);});
 x.stroke();
 c.pts.forEach((p,i)=>{
  const done2=path.includes(i);
  x.fillStyle=done2?'#C4D645':'#fff';
  x.beginPath();x.arc(p[0],p[1],done2?10:13,0,7);x.fill();
  x.fillStyle='#0C0C18';x.font='bold 13px system-ui';x.textAlign='center';
  x.fillText(c.need.indexOf(i)+1,p[0],p[1]+5);
 });
 x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(c.n+' · '+path.length+'/'+c.need.length+' · ⏱️'+Math.ceil(time),12,28);
});
}});"""

# 350 — Coleta de Cogumelos
GAMES[350] = r"""/* NCODE N · 350 Coleta de Cogumelos — comestível ou venenoso? */
GREG(350,{
init(root,H){
// [emoji, nome, venenoso?, dica]
const M=[
 ['🍄','champignon',false,'chapéu marrom liso'],
 ['☠️','cicuta verde',true,'chapéu verde + anel'],
 ['🍄‍🟫','porcini',false,'chapéu marrom grosso'],
 ['🔴','agárico',true,'chapéu vermelho com pintas'],
 ['🦪','ostra',false,'parece concha'],
 ['👻','anjo destruidor',true,'todo branco']
];
let over=false,round=0,score=0,basket=0;
const hud=H.hud(root,[['r','COGUMELO','1/10'],['pt','PONTOS',0],['c','CESTA',0]]);
const say=H.msg(root,'10 cogumelos: COLHA os comestíveis, EVITE os venenosos! Erro = −vida. 3 vidas. Dica ajuda!');
const box=H.el('div','g-col',null,root);
const sh=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let lives=3,cur=null;
function show(){
 if(round>=10){gameOver(true);return;}
 cur=M[(Math.random()*M.length)|0];
 hud.set('r',(round+1)+'/10');
 sh.innerHTML='<span style="font-size:56px">'+cur[0]+'</span><br><b>'+cur[1]+'</b> · '+cur[3]+'<br>❤️'.repeat(1)+' '+lives;
 brow.innerHTML='';
 H.btn(brow,'🧺 COLHER',()=>decide(false),true);
 H.btn(brow,'☠️ VENENOSO (evitar)',()=>decide(true),false);
}
function decide(saysPois){
 if(over)return;
 const isPois=cur[2];
 if(saysPois===isPois){
  score+=isPois?60:100;
  if(!isPois)basket++;
  H.sfx('ok');
 }else{
  lives--;score=Math.max(0,score-50);H.sfx('bad');
  if(lives<=0){gameOver(false);return;}
 }
 round++;hud.set('pt',score);hud.set('c',basket);
 show();
}
function gameOver(win){over=true;brow.innerHTML='';H.score(score);
H.done({win:win&&basket>=4,score,title:win&&basket>=4?'🍄 Cesta cheia!':'🍄 Fim da coleta!',sub:score+' pontos · '+basket+' colhidos.'});}
show();
}});"""

# 351 — Caçador de Pedras
GAMES[351] = r"""/* NCODE N · 351 Caçador de Pedras — ache as gemas! */
GREG(351,{
init(root,H){
let over=false,t=0,time=100,gems=0,swings=0;
const ROCKS=[];
for(let i=0;i<10;i++)ROCKS.push({x:50+(i%5)*90,y:100+((i/5)|0)*110,hp:2+((Math.random()*3)|0),gem:Math.random()<.5,open:false});
const hud=H.hud(root,[['g','GEMAS','0/4'],['tp','TEMPO',100]]);
const say=H.msg(root,'Quebre as pedras (toques)! Algumas têm gemas 💎. 4 gemas em 100s! Pedra vazia = tempo perdido…');
const o=H.cvs(root,480,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 ROCKS.forEach(r=>{
  if(!r.open&&Math.hypot(px-r.x-30,py-r.y-30)<42){
   r.hp--;swings++;H.sfx('tick');
   if(r.hp<=0){r.open=true;
    if(r.gem){gems++;H.sfx('ok');hud.set('g',gems+'/4');
     if(gems>=4){gameOver(true);return;}}
   }
  }
 });
});
function gameOver(win){over=true;const sc=gems*80+(win?Math.ceil(time)*2:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'💎 Jazida rica!',sub:'4 gemas em '+swings+' golpes!'}:{win:false,score:sc,title:'Tempo esgotado!',sub:gems+'/4 gemas. Quebre sem parar!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(gems>=4);return;}
 x.fillStyle='#5A5A55';x.fillRect(0,0,480,360);
 ROCKS.forEach(r=>{
  if(r.open){
   x.fillStyle='#3A3A35';x.fillRect(r.x,r.y,60,60);
   if(r.gem){x.font='30px system-ui';x.textAlign='center';x.fillText('💎',r.x+30,r.y+42);}
   return;
  }
  x.fillStyle='#8A877C';x.beginPath();x.arc(r.x+30,r.y+30,28,0,7);x.fill();
  x.strokeStyle='#4A4A44';x.lineWidth=3;x.stroke();
  x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='center';x.fillText('x'+r.hp,r.x+30,r.y+36);
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('💎 '+gems+'/4 · ⏱️'+Math.ceil(time)+'s',12,28);
});
}});"""

# 352 — Mergulho no Naufrágio
GAMES[352] = r"""/* NCODE N · 352 Mergulho no Naufrágio — artefatos do navio! */
GREG(352,{
init(root,H){
let over=false,room=0,o2=100,t=0,got=0;
const ROOMS=[
 [{k:'🏺',got:false},{k:'⚱️',got:false}],
 [{k:'💰',got:false},{k:'🗡️',got:false}],
 [{k:'👑',got:false},{k:'📿',got:false}]
];
const hud=H.hud(root,[['s','SALA','1/3'],['ox','OXIGÊNIO','100%'],['a','ARTEFATOS','0/6']]);
const say=H.msg(root,'Toque nos artefatos para coletar! Complete a sala para avançar. O₂ acaba = fim!');
const o=H.cvs(root,460,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 ROOMS[room].forEach((a,i)=>{
  const ax=150+i*160,ay=200;
  if(!a.got&&Math.hypot(px-ax,py-ay)<40){
   a.got=true;got++;H.sfx('ok');hud.set('a',got+'/6');
   if(ROOMS[room].every(q=>q.got)){
    room++;
    if(room>=3){gameOver(true);return;}
    hud.set('s',(room+1)+'/3');o2=Math.min(100,o2+20);
    say('Sala '+(room+1)+'! +20 O₂.');
   }
  }
 });
});
function gameOver(win){over=true;const sc=got*60+(win?Math.ceil(o2)*2:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'⚓ Tesouro do navio!',sub:'6 artefatos resgatados!'}:{win:false,score:sc,title:'Sem ar!',sub:got+'/6 artefatos. Seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 o2-=dt*2.4;
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 x.fillStyle='#123F5C';x.fillRect(0,0,460,360);
 x.strokeStyle='#8A6A2F';x.lineWidth=6;x.strokeRect(20,60,420,260);
 x.fillStyle='rgba(255,255,255,.15)';x.fillRect(20,60,420,260);
 if(room<3)ROOMS[room].forEach((a,i)=>{
  if(!a.got){x.font='44px system-ui';x.textAlign='center';x.fillText(a.k,150+i*160,215+Math.sin(t*2+i)*5);}
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Sala '+(room+1)+'/3 · O₂ '+(o2|0)+'% · 🏺 '+got+'/6',12,30);
 x.fillStyle='#000';x.fillRect(12,38,200,10);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(12,38,200*Math.max(0,o2)/100,10);
});
}});"""

# 353 — Jardim de Borboletas
GAMES[353] = r"""/* NCODE N · 353 Jardim de Borboletas — catalogue! */
GREG(353,{
init(root,H){
let over=false,t=0,time=90;
const SP=['🦋','🦋','🦋','🐝','🪲'];
const FLY=[];
for(let i=0;i<8;i++)FLY.push({x:Math.random()*420+20,y:80+Math.random()*260,vx:(Math.random()-.5)*90,vy:(Math.random()-.5)*70,k:SP[i%5],got:false,ph:Math.random()*7});
let cat={};
const hud=H.hud(root,[['c','ESPÉCIES','0/3'],['tp','TEMPO',90]]);
const say=H.msg(root,'Toque nas borboletas 🦋 para catalogar! (abelhas e besouros não contam). 3 espécies: capture 3 borboletas diferentes? Não — capture 5 🦋 em 90s!');
const o=H.cvs(root,460,400),x=o.x;
let n=0;
H.onTap(o,(px,py)=>{
 if(over)return;
 FLY.forEach(f=>{
  if(!f.got&&Math.hypot(px-f.x,py-f.y)<26){
   f.got=true;
   if(f.k==='🦋'){n++;H.sfx('ok');hud.set('c',Math.min(5,n)+'/5');
    if(n>=5){gameOver(true);return;}}
   else H.sfx('bad');
  }
 });
});
function gameOver(win){over=true;const sc=n*60+(win?Math.ceil(time)*2:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🦋 Jardim catalogado!',sub:'5 borboletas!'}:{win:false,score:sc,title:'Voaram!',sub:n+'/5 borboletas. Toque rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(n>=5);return;}
 FLY.forEach(f=>{
  if(f.got)return;
  f.x+=f.vx*dt;f.y+=f.vy*dt;
  if(f.x<20||f.x>440)f.vx*=-1;
  if(f.y<50||f.y>380)f.vy*=-1;
 });
 if(!FLY.some(f=>!f.got&&f.k==='🦋')&&n<5){
  FLY.push({x:230,y:200,vx:80,vy:50,k:'🦋',got:false,ph:0});
 }
 x.fillStyle='#7CB56B';x.fillRect(0,0,460,400);
 x.font='20px system-ui';x.textAlign='center';
 for(let i=0;i<10;i++)x.fillText('🌸',(i*167)%440,60+(i*97)%300);
 FLY.forEach(f=>{
  if(f.got)return;
  x.font='26px system-ui';
  x.fillText(f.k,f.x,f.y+Math.sin(t*6+f.ph)*4);
 });
});
}});"""

# 354 — Cratera do Vulcão
GAMES[354] = r"""/* NCODE N · 354 Cratera do Vulcão — colete gases! */
GREG(354,{
init(root,H){
let over=false,px=230,py=400,tx=px,ty=py,t=0,samples=0,lives=3,warn=null;
const VENTS=[{x:120,y:140},{x:230,y:100},{x:340,y:140}];
const hud=H.hud(root,[['a','AMOSTRAS','0/5'],['v','VIDAS',3]]);
const say=H.msg(root,'Fique perto das fumarolas 💨 para coletar (2s cada)! Círculo vermelho = erupção chegando — SAIA! 5 amostras!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
let collect=0;
function gameOver(win){over=true;const sc=samples*70+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌋 Pesquisa completa!',sub:'5 amostras de gás!'}:{win:false,score:sc,title:'Queimou!',sub:samples+'/5 amostras. Fuja do vermelho!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=150*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,20,440);py=H.clamp(py,20,440);
 if(!warn&&Math.random()<dt*.8){
  const v=VENTS[(Math.random()*3)|0];
  warn={x:v.x,y:v.y,t:1.6};
 }
 if(warn){
  warn.t-=dt;
  if(warn.t<=0){
   if(Math.hypot(px-warn.x,py-warn.y)<70){
    lives--;H.sfx('bad');hud.set('v',lives);
    if(lives<=0){gameOver(false);return;}
   }
   warn=null;
  }
 }
 const near=VENTS.some(v=>Math.hypot(px-v.x,py-v.y)<44);
 if(near){collect+=dt;if(collect>=2){collect=0;samples++;H.sfx('ok');hud.set('a',samples+'/5');if(samples>=5){gameOver(true);return;}}}
 else collect=0;
 x.fillStyle='#3A3A35';x.fillRect(0,0,460,460);
 x.fillStyle='#D94E34';x.beginPath();x.ellipse(230,110,140,60,0,0,7);x.fill();
 x.fillStyle='#B23A24';x.beginPath();x.ellipse(230,110,100,40,0,0,7);x.fill();
 VENTS.forEach(v=>{
  x.font='26px system-ui';x.textAlign='center';
  x.fillText('💨',v.x,v.y+Math.sin(t*3)*4);
 });
 if(warn){
  x.strokeStyle='#D94E34';x.lineWidth=4;
  x.beginPath();x.arc(warn.x,warn.y,70,0,7);x.stroke();
  x.fillStyle='rgba(217,78,52,.3)';x.fill();
 }
 x.fillStyle='#E8A33D';x.beginPath();x.arc(px,py,11,0,7);x.fill();
 x.strokeStyle='#000';x.lineWidth=2;x.stroke();
 if(near){x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='center';x.fillText('coletando '+((collect/2*100)|0)+'%',px,py-18);}
});
}});"""

# 355 — Caminhada na Geleira
GAMES[355] = r"""/* NCODE N · 355 Caminhada na Geleira — fendas e fósseis! */
GREG(355,{
init(root,H){
let over=false,px=40,py=300,tx=px,ty=py,t=0,cold=0,fossils=0;
const CREV=[];
for(let i=0;i<7;i++)CREV.push({x:100+i*80,y:80+Math.random()*300,w:26});
const FOS=[];
for(let i=0;i<4;i++)FOS.push({x:80+Math.random()*480,y:60+Math.random()*320,got:false});
const hud=H.hud(root,[['f','FÓSSEIS','0/4'],['fr','FRIO','0%']]);
const say=H.msg(root,'Atravesse até a caverna 🕳️ e pegue 4 fósseis 🦴! Fendas azuis = volte ao início. Frio sobe parado — mexa-se!');
const o=H.cvs(root,560,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
function gameOver(win){over=true;const sc=fossils*70+(win?250-Math.ceil(cold):0);H.score(Math.max(0,sc)|0);
H.done(win?{win:true,score:Math.max(0,sc)|0,title:'🧊 Travessia glacial!',sub:fossils+'/4 fósseis!'}:{win:false,score:fossils*70,title:'Congelado!',sub:'Não fique parado no gelo!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=150*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 let mv=false;
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;mv=true;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;mv=true;}}
 px=H.clamp(px,16,544);py=H.clamp(py,16,384);
 if(mv)cold=Math.max(0,cold-18*dt);else cold+=12*dt;
 hud.set('fr',Math.min(100,cold|0)+'%');
 if(cold>=100){gameOver(false);return;}
 if(CREV.some(c=>Math.abs(px-c.x)<c.w/2+6&&Math.abs(py-c.y)<90)){px=40;py=300;tx=px;ty=py;H.sfx('bad');say('🕳️ Fenda! De volta ao início.');}
 FOS.forEach(f=>{
  if(!f.got&&Math.hypot(px-f.x,py-f.y)<26){f.got=true;fossils++;H.sfx('ok');hud.set('f',fossils+'/4');}
 });
 if(px>510){gameOver(fossils>=4?true:true);return;}
 x.fillStyle='#DCEEF5';x.fillRect(0,0,560,400);
 CREV.forEach(c=>{x.fillStyle='#2E6E8A';x.fillRect(c.x-c.w/2,c.y-90,c.w,180);});
 FOS.forEach(f=>{if(!f.got){x.font='22px system-ui';x.textAlign='center';x.fillText('🦴',f.x,f.y);}});
 x.font='30px system-ui';x.fillText('🕳️',530,200);
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,11,0,7);x.fill();
 x.fillStyle=cold>60?'#7FB3C8':'#C4D645';x.beginPath();x.arc(px,py,5,0,7);x.fill();
});
}});"""

# 356 — Recife de Coral
GAMES[356] = r"""/* NCODE N · 356 Recife de Coral — fotografe a vida! */
GREG(356,{
init(root,H){
let over=false,px=80,py=200,tx=px,ty=py,t=0,o2=100,photos=0;
const LIFE=[
 {k:'🐠',x:300,y:150,got:false},{k:'🐡',x:500,y:280,got:false},{k:'🦑',x:700,y:120,got:false},
 {k:'🐢',x:900,y:250,got:false},{k:'🦈',x:1100,y:180,got:false},{k:'🐙',x:1250,y:300,got:false}
];
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['f','FOTOS','0/6']]);
const say=H.msg(root,'Nade pelo recife e FOTOGRAFE as 6 criaturas! O₂ limitado — seja eficiente!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tx=qx+cam;ty=qy;});
let cam=0;
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const s=LIFE.find(q=>!q.got&&Math.hypot(px-q.x,py-q.y)<80);
 if(s){s.got=true;photos++;H.sfx('ok');hud.set('f',photos+'/6');
  if(photos>=6){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=photos*60+(win?Math.ceil(o2)*2:0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🪸 Recife documentado!',sub:'6 criaturas fotografadas!'}:{win:false,score:sc|0,title:'Sem ar!',sub:photos+'/6 fotos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=190*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>6){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,30,1320);py=H.clamp(py,30,350);
 o2-=dt*2.2;
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 cam=H.clamp(px-140,0,790);
 x.fillStyle='#2E9EAF';x.fillRect(0,0,560,380);
 x.font='26px system-ui';x.textAlign='center';
 for(let i=0;i<16;i++){const cx=(i*211-cam%211+211)%571-10;x.fillText('🪸',cx,340);}
 LIFE.forEach(s=>{
  const sx=s.x-cam;
  if(sx>-40&&sx<600){
   x.font='34px system-ui';x.fillText(s.k,sx,s.y+Math.sin(t*2+s.x)*6);
   if(s.got){x.font='18px system-ui';x.fillText('✅',sx,s.y-28);}
  }
 });
 x.font='30px system-ui';x.fillText('🤿',px-cam,py+10);
});
}});"""

# 357 — Oásis no Deserto
GAMES[357] = r"""/* NCODE N · 357 Oásis no Deserto — triangule! */
GREG(357,{
init(root,H){
let over=false,digs=8,found=0;
const OAS=[];
for(let i=0;i<3;i++)OAS.push({x:60+Math.random()*340,y:80+Math.random()*280,got:false});
const MARKS=[{x:60,y:60,k:'🗿'},{x:400,y:80,k:'🌵'},{x:80,y:380,k:'⛰️'},{x:400,y:380,k:'🏚️'}];
const hud=H.hud(root,[['o','OÁSIS','0/3'],['p','PÁS',8]]);
const say=H.msg(root,'8 escavações para achar 3 oásis! A distância até o oásis mais próximo aparece a cada tentativa. Triangule!');
const o=H.cvs(root,460,460),x=o.x;
let hint='';
H.onTap(o,(px,py)=>{
 if(over||digs<=0)return;
 digs--;hud.set('p',digs);
 let bd=1e9;
 OAS.forEach(s=>{if(!s.got){const d=Math.hypot(px-s.x,py-s.y);if(d<bd)bd=d;}});
 const hit=OAS.find(s=>!s.got&&Math.hypot(px-s.x,py-s.y)<34);
 if(hit){hit.got=true;found++;H.sfx('ok');hud.set('o',found+'/3');
  if(found>=3){gameOver(true);return;}}
 else H.sfx('tick');
 hint=bd<60?'🔥 MUITO PERTO!':bd<120?'🌡️ perto…':bd<200?'🥶 longe…':'🧊 muito longe…';
 tries.push({x:px,y:py});
 if(digs<=0){gameOver(found>=3);return;}
});
let tries=[];
function gameOver(win){over=true;const sc=found*100+(win?digs*30:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌴 Oásis mapeados!',sub:'3 refúgios encontrados!'}:{win:false,score:sc,title:'Sem pás!',sub:found+'/3 oásis. Use as distâncias!'});}
H.loop(()=>{
 if(over)return;
 x.fillStyle='#E8C86B';x.fillRect(0,0,460,460);
 MARKS.forEach(m=>{x.font='28px system-ui';x.textAlign='center';x.fillText(m.k,m.x,m.y);});
 OAS.forEach(s=>{if(s.got){x.font='34px system-ui';x.fillText('🌴',s.x,s.y);}});
 tries.forEach(q=>{x.fillStyle='#8A6A2F';x.beginPath();x.arc(q.x,q.y,8,0,7);x.fill();});
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('🌴 '+found+'/3 · 🥄 '+digs+'  '+hint,12,28);
});
}});"""

# 358 — Fonte Termal
GAMES[358] = r"""/* NCODE N · 358 Fonte Termal — quente ou frio! */
GREG(358,{
init(root,H){
const N=7,CS=60,OX=20,OY=50;
let over=false,digs=10,found=0;
const SPR=[];
for(let i=0;i<2;i++)SPR.push({c:(Math.random()*N)|0,r:(Math.random()*N)|0,got:false});
let tried=new Set(),hint='';
const hud=H.hud(root,[['f','FONTES','0/2'],['p','PÁS',10]]);
const say=H.msg(root,'Ache 2 fontes termais em 10 tentativas! Cada toque diz QUENTE/MORNO/FRIO pela distância.');
const o=H.cvs(root,460,490),x=o.x;
H.onTap(o,(px,py)=>{
 if(over||digs<=0)return;
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(c<0||c>=N||r<0||r>=N||tried.has(c+','+r))return;
 tried.add(c+','+r);digs--;hud.set('p',digs);
 const hit=SPR.find(s=>!s.got&&s.c===c&&s.r===r);
 if(hit){hit.got=true;found++;H.sfx('ok');hud.set('f',found+'/2');
  if(found>=2){gameOver(true);return;}}
 else{
  let bd=99;
  SPR.forEach(s=>{if(!s.got){const d=Math.abs(s.c-c)+Math.abs(s.r-r);if(d<bd)bd=d;}});
  hint=bd<=1?'🔥 QUENTE!':bd<=2?'🌡️ morno…':'🧊 frio…';
  H.sfx('tick');
 }
 if(digs<=0){gameOver(found>=2);return;}
});
function gameOver(win){over=true;const sc=found*120+(win?digs*25:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'♨️ Águas termais!',sub:'2 fontes descobertas!'}:{win:false,score:sc,title:'Sem pás!',sub:found+'/2 fontes. Cerque o QUENTE!'});}
H.loop(()=>{
 if(over)return;
 x.fillStyle='#5A6E5A';x.fillRect(0,0,460,490);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const k=c+','+r;
  const s=SPR.find(q=>q.c===c&&q.r===r&&q.got);
  x.fillStyle=tried.has(k)?'#8A877C':'#4A5A4A';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#2A3A2A';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  if(s){x.font='30px system-ui';x.textAlign='center';x.fillText('♨️',OX+c*CS+30,OY+r*CS+42);}
 }
 x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('♨️ '+found+'/2 · 🥄 '+digs+'  '+hint,12,30);
});
}});"""

# 359 — Caça a Meteoritos
GAMES[359] = r"""/* NCODE N · 359 Caça a Meteoritos — siga o detector! */
GREG(359,{
init(root,H){
let over=false,px=230,tx=px,py=350,ty=py,t=0,digs=6,found=0;
const MET=[];
for(let i=0;i<4;i++)MET.push({x:40+Math.random()*380,y:60+Math.random()*300,got:false});
const hud=H.hud(root,[['m','METEORITOS','0/4'],['p','PÁS',6]]);
const say=H.msg(root,'Ande com o detector! Perto de metal, ele apita forte (barra cheia). Toque ESCAVAR no ponto certo. 4 meteoritos, 6 pás!');
const o=H.cvs(root,460,420),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'⛏️ ESCAVAR aqui!',()=>{
 if(over||digs<=0)return;
 digs--;hud.set('p',digs);
 const hit=MET.find(m=>!m.got&&Math.hypot(px-m.x,py-m.y)<36);
 if(hit){hit.got=true;found++;H.sfx('ok');hud.set('m',found+'/4');
  if(found>=4){gameOver(true);return;}}
 else H.sfx('bad');
 if(digs<=0){gameOver(found>=4);return;}
},true);
function sig(){
 let bd=1e9;
 MET.forEach(m=>{if(!m.got){const d=Math.hypot(px-m.x,py-m.y);if(d<bd)bd=d;}});
 return H.clamp(1-bd/250,0,1);
}
function gameOver(win){over=true;const sc=found*80+(win?digs*30:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'☄️ Caça estelar!',sub:'4 meteoritos!'}:{win:false,score:sc,title:'Sem pás!',sub:found+'/4. Cave só no sinal máximo!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=150*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,20,440);py=H.clamp(py,20,400);
 const s=sig();
 if(s>.75&&Math.random()<dt*8)H.sfx('tick');
 x.fillStyle='#8A877C';x.fillRect(0,0,460,420);
 MET.forEach(m=>{if(m.got){x.font='26px system-ui';x.textAlign='center';x.fillText('☄️',m.x,m.y);}});
 x.font='28px system-ui';x.textAlign='center';x.fillText('🧑‍🔬',px,py+10);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('SINAL',12,28);
 x.fillStyle='#000';x.fillRect(80,18,220,14);
 x.fillStyle=s>.75?'#C4D645':s>.4?'#E8A33D':'#4A4A44';
 x.fillRect(80,18,220*s,14);
});
}});"""

# 360 — Cidade Perdida
GAMES[360] = r"""/* NCODE N · 360 Cidade Perdida — atravesse a selva! */
GREG(360,{
init(root,H){
let over=false,prog=0,sup=80,hp=100,step=0;
const EV=[
 ['🌉 Ponte de corda!','Atravessar (rápido)','Contornar (seguro)',()=>{if(Math.random()<.4){hp-=25;say('Corda arrebentou! −25.');}prog+=18;},()=>{prog+=10;sup-=8;}],
 ['🐒 Macacos curiosos!','Dar comida (−15)','Espantar',()=>{sup-=15;prog+=14;},()=>{if(Math.random()<.5){hp-=10;say('Mordida! −10.');}prog+=14;}],
 ['🏞️ Cachoeira!','Escalar (atalho)','Descer e subir',()=>{if(Math.random()<.5){prog+=24;}else{hp-=20;say('Escorregou! −20.');}prog+=6;},()=>{prog+=12;sup-=6;}],
 ['🦜 Pássaro guia!','Seguir o pássaro','Ignorar',()=>{prog+=20;},()=>{prog+=10;}],
 ['🍄 Acampamento!','Descansar (+20 vida, −10 sup)','Marchar',()=>{hp=Math.min(100,hp+20);sup-=10;prog+=4;},()=>{prog+=14;sup-=8;}]
];
const hud=H.hud(root,[['p','CIDADE','0%'],['s','SUPRIMENTOS',80],['v','VIDA',100]]);
const say=H.msg(root,'Chegue à cidade perdida (100%)! Suprimentos zeram = perde vida. Vida zera = fim!');
const box=H.el('div','g-col',null,root);
const ev=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('p',Math.min(100,prog|0)+'%');hud.set('s',Math.max(0,sup|0));hud.set('v',Math.max(0,hp|0));}
function next(){
 if(over)return;
 step++;sup-=4;
 if(sup<=0){hp-=10;sup=0;}
 if(hp<=0){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 const e=EV[(Math.random()*EV.length)|0];
 ev.innerHTML='<b>Dia '+step+'</b> · '+e[0];
 brow.innerHTML='';
 H.btn(brow,'🅰️ '+e[1],()=>{e[3]();H.sfx('tick');status();next();},false);
 H.btn(brow,'🅱️ '+e[2],()=>{e[4]();H.sfx('tick');status();next();},false);
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?400+Math.ceil(hp)+Math.ceil(sup):prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🛕 Cidade encontrada!',sub:'Lenda confirmada!'}:{win:false,score:sc|0,title:'Selva venceu!',sub:'Gerencie suprimentos e vida!'});}
next();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
