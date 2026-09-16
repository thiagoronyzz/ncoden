#!/usr/bin/env python3
"""Gera games/g361..g380 — PARTY."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 361 — Mímica
GAMES[361] = r"""/* NCODE N · 361 Mímica — atue e adivinhe! */
GREG(361,{
init(root,H){
const WORDS=['elefante','avião','dentista','sereia','vulcão','robô','pirata','bailarina','terremoto','churrasco','fantasma','malabarista'];
let over=false,round=0,score=0,time=0,phase='act';
const hud=H.hud(root,[['r','RODADA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Atue a palavra para seu time! Quando adivinharem (ou o tempo acabar), marque o resultado. 5 rodadas!');
const box=H.el('div','g-col',null,root);
const wd=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const words=WORDS.slice().sort(()=>Math.random()-.5).slice(0,5);
function show(){
 if(round>=5){gameOver();return;}
 phase='act';time=60;
 hud.set('r',(round+1)+'/5');
 wd.innerHTML='🎭 ATUE:<br><span style="font-size:42px"><b>'+words[round]+'</b></span><br>⏱️ <span id="t">60</span>s';
 brow.innerHTML='';
 H.btn(brow,'✅ Adivinharam!',()=>{score+=100+Math.ceil(time);round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'⏭️ Pular (−20)',()=>{score=Math.max(0,score-20);round++;H.sfx('bad');hud.set('pt',score);show();},false);
}
H.every(1000,()=>{
 if(over||phase!=='act')return;
 time--;
 wd.innerHTML='🎭 ATUE:<br><span style="font-size:42px"><b>'+words[round]+'</b></span><br>⏱️ '+Math.ceil(time)+'s';
 if(time<=0){round++;show();}
});
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎭 Show de mímica!':'🎭 Fim do jogo!',sub:score+' pontos em 5 rodadas.'});}
show();
}});"""

# 362 — Desenho Rápido
GAMES[362] = r"""/* NCODE N · 362 Desenho Rápido — rabisque e adivinhem! */
GREG(362,{
init(root,H){
const WORDS=['gato','casa','sol','peixe','árvore','carro','flor','barco','lua','óculos'];
let over=false,round=0,score=0,time=45,strokes=[],cur=null;
const hud=H.hud(root,[['r','RODADA','1/4'],['pt','PONTOS',0]]);
const say=H.msg(root,'Desenhe a palavra arrastando o dedo! Seu time adivinha. 4 rodadas de 45s!');
const o=H.cvs(root,460,340),x=o.x;
const ptr=H.ptr(o);
const wd=H.el('div','g-msg','',root);
const brow=H.el('div','g-row',null,root);
const words=WORDS.slice().sort(()=>Math.random()-.5).slice(0,4);
let wasDown=false;
function show(){
 if(round>=4){gameOver();return;}
 time=45;strokes=[];
 hud.set('r',(round+1)+'/4');
 wd.innerHTML='✏️ DESENHE: <b style="font-size:28px">'+words[round]+'</b>';
 brow.innerHTML='';
 H.btn(brow,'🧹 Limpar',()=>{strokes=[];H.sfx('tick');},false);
 H.btn(brow,'✅ Adivinharam!',()=>{score+=100+Math.ceil(time)*2;round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'⏭️ Pular',()=>{round++;H.sfx('bad');show();},false);
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎨 Artista veloz!':'🎨 Fim!',sub:score+' pontos.'});}
H.loop(dt=>{
 if(over)return;
 time-=dt;
 if(time<=0){round++;show();return;}
 if(ptr.down&&!wasDown)cur=[];
 if(ptr.down&&cur)cur.push([ptr.x,ptr.y]);
 if(!ptr.down&&wasDown&&cur&&cur.length){strokes.push(cur);cur=null;}
 wasDown=ptr.down;
 x.fillStyle='#FAF7F0';x.fillRect(0,0,460,340);
 x.strokeStyle='#181816';x.lineWidth=4;x.lineCap='round';
 strokes.forEach(s=>{x.beginPath();s.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();});
 if(cur&&cur.length){x.beginPath();cur.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();}
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(words[round]+' · ⏱️'+Math.ceil(time)+'s · '+score+' pts',12,28);
});
show();
}});"""

# 363 — Quiz Relâmpago
GAMES[363] = r"""/* NCODE N · 363 Quiz Relâmpago — mais rápido que os bots! */
GREG(363,{
init(root,H){
const Q=[
 ['Capital do Brasil?',['Rio','Brasília','Salvador','Manaus'],1],
 ['2 + 2 × 2 = ?',['6','8','4','10'],0],
 ['Maior planeta?',['Terra','Marte','Júpiter','Saturno'],2],
 ['Cor do céu de dia?',['Verde','Azul','Roxo','Cinza'],1],
 ['Quantos dias tem um ano bissexto?',['365','364','366','367'],2],
 ['Animal que late?',['Gato','Cachorro','Vaca','Pato'],1],
 ['H2O é…?',['Oxigênio','Água','Sal','Açúcar'],1],
 ['Continente do Egito?',['Ásia','Europa','África','Oceania'],2]
];
let over=false,qi=0,score=0,bot=0,t=0,answered=false;
const hud=H.hud(root,[['q','PERGUNTA','1/8'],['vc','VOCÊ',0],['bt','BOTS',0]]);
const say=H.msg(root,'Responda antes dos 3 bots! Rápido = mais pontos. 8 perguntas!');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let botT=0;
function show(){
 if(qi>=8){gameOver();return;}
 answered=false;t=0;botT=2+Math.random()*4;
 hud.set('q',(qi+1)+'/8');
 const q=Q[qi];
 qz.innerHTML='<b>'+q[0]+'</b>';
 brow.innerHTML='';
 q[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over||answered)return;
   answered=true;
   if(i===q[2]){const p=Math.max(10,100-(t*12|0));score+=p;H.sfx('ok');say('✅ +'+p+'!');}
   else{H.sfx('bad');say('❌ Era: '+q[1][q[2]]);}
   qi++;hud.set('vc',score);
   H.after(900,()=>{if(!over)show();});
  },false);
 });
}
H.every(100,()=>{
 if(over||answered||qi>=8)return;
 t+=.1;
 if(t>=botT){
  answered=true;
  if(Math.random()<.65){bot+=60;H.sfx('bad');say('🤖 Bot respondeu primeiro! +60 para eles.');}
  else{say('🤖 Bots erraram! Responda!');answered=false;botT=t+3;return;}
  qi++;hud.set('bt',bot);
  H.after(900,()=>{if(!over)show();});
 }
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>bot,score,title:score>bot?'⚡ Mais rápido!':'⚡ Bots venceram!',sub:'Você '+score+' × '+bot+' bots.'});}
show();
}});"""

# 364 — Duas Verdades, Uma Mentira
GAMES[364] = r"""/* NCODE N · 364 Duas Verdades, Uma Mentira — ache a mentira! */
GREG(364,{
init(root,H){
const SETS=[
 [['Tenho 2 irmãos','Já viajei de balão','Sei tocar piano'],2],
 [['Amo pizza fria','Nunca quebrei nada','Corro 5km',],1],
 [['Falo 3 línguas','Tenho medo de altura','Já vi neve'],0],
 [['Sou canhoto','Adoro coentro','Sei nadar'],1],
 [['Já plantei uma árvore','Nunca vi o mar','Cozinho bem'],1],
 [['Tenho um gato','Jogo xadrez','Odeio chocolate'],2]
];
let over=false,round=0,score=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Cada jogador diz 3 frases: ache a MENTIRA! 6 rodadas.');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=6){gameOver();return;}
 const s=SETS[round];
 hud.set('r',(round+1)+'/6');
 st.innerHTML='<b>Jogador '+(round+1)+' diz:</b>';
 brow.innerHTML='';
 s[0].forEach((f,i)=>{
  H.btn(brow,'"'+f+'"',()=>{
   if(over)return;
   if(i===s[1]){score+=100;H.sfx('ok');say('✅ Mentira encontrada! +100');}
   else{H.sfx('bad');say('❌ A mentira era: "'+s[0][s[1]]+'"');}
   round++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=400,score,title:score>=400?'🕵️ Detector humano!':'🕵️ Fim!',sub:score+'/600 pontos.'});}
show();
}});"""

# 365 — Você Preferiria
GAMES[365] = r"""/* NCODE N · 365 Você Preferiria — com a maioria! */
GREG(365,{
init(root,H){
const D=[
 ['Voar','Ficar invisível'],['Pizza todo dia','Sorvete todo dia'],
 ['Viajar ao passado','Viajar ao futuro'],['Falar com animais','Falar 10 línguas'],
 ['Ser rico','Ser famoso'],['Praia','Montanha'],['Livro','Filme'],['Dia','Noite']
];
let over=false,round=0,score=0;
const hud=H.hud(root,[['r','DILEMA','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Vote com a maioria do grupo (bots)! Acertar o lado popular = pontos. 8 dilemas!');
const box=H.el('div','g-col',null,root);
const dm=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=8){gameOver();return;}
 const d=D[round];
 hud.set('r',(round+1)+'/8');
 dm.innerHTML='<b>Você preferiria…</b>';
 brow.innerHTML='';
 d.forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   const votes=[0,0];
   for(let b=0;b<5;b++)votes[Math.random()<.55?0:1]++;
   votes[i]++;
   const maj=votes[0]===votes[1]?-1:(votes[0]>votes[1]?0:1);
   if(maj===i){score+=100;H.sfx('ok');}
   else H.sfx('bad');
   dm.innerHTML='<b>'+d[0]+'</b> '+votes[0]+' × '+votes[1]+' <b>'+d[1]+'</b><br>'+(maj===i?'✅ Com a maioria! +100':'❌ Minoria…');
   round++;hud.set('pt',score);
   H.after(1400,()=>{if(!over)show();});
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=500,score,title:score>=500?'🗳️ Voz do povo!':'🗳️ Fim!',sub:score+'/800 pontos.'});}
show();
}});"""

# 366 — Cadeira Quente
GAMES[366] = r"""/* NCODE N · 366 Cadeira Quente — responda rápido! */
GREG(366,{
init(root,H){
const Q=['Cor favorita?','Comida que odeia?','Sonho de viagem?','Medo bobo?','Talento secreto?','Filme favorito?','Time do coração?','Animal preferido?','Música viciante?','Lugar feliz?'];
let over=false,qi=0,streak=0,best=0,time=0;
const hud=H.hud(root,[['p','PERGUNTA','1/10'],['sq','SEQUÊNCIA',0]]);
const say=H.msg(root,'Responda em voz alta e toque RESPONDI antes de 5s! Atrasou = perde a sequência. 10 perguntas!');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=10){gameOver();return;}
 time=5;
 hud.set('p',(qi+1)+'/10');
 qz.innerHTML='<span style="font-size:30px"><b>'+Q[qi]+'</b></span><br>⏱️ 5s!';
 brow.innerHTML='';
 H.btn(brow,'🔥 RESPONDI!',()=>{
  if(over)return;
  streak++;best=Math.max(best,streak);H.sfx('ok');
  hud.set('sq',streak);qi++;show();
 },true);
}
H.every(1000,()=>{
 if(over||qi>=10)return;
 time--;
 if(time<=0){streak=0;H.sfx('bad');hud.set('sq',0);qi++;say('⏰ Lento! Sequência zerada.');show();return;}
 qz.innerHTML='<span style="font-size:30px"><b>'+Q[qi]+'</b></span><br>⏱️ '+time+'s!';
});
function gameOver(){over=true;brow.innerHTML='';H.score(best*50);
H.done({win:best>=7,score:best*50,title:best>=7?'🔥 Imparável!':'🔥 Fim!',sub:'Melhor sequência: '+best+'/10.'});}
show();
}});"""

# 367 — História em Cadeia
GAMES[367] = r"""/* NCODE N · 367 História em Cadeia — conte junto! */
GREG(367,{
init(root,H){
const OPEN=['Era uma noite escura quando…','O robô acordou e viu…','Na ilha deserta havia…'];
const MID=[
 'um dragão faminto apareceu!','a porta se abriu sozinha…','tudo começou a flutuar!',
 'o telefone tocou: era o futuro.','um mapa misterioso caiu do céu.','o bolo ganhou vida!',
 'de repente, todos viraram sapos.','um OVNI pousou no quintal.','o tesouro era de chocolate.'
];
const END=['E viveram rindo para sempre. FIM.','E foi tudo um sonho… ou não? FIM.','E a aventura continua! FIM.'];
let over=false,round=0,story=[];
const hud=H.hud(root,[['r','PARTE','1/7']]);
const say=H.msg(root,'Cada um adiciona um trecho! Escolha 1 de 3 cartas por rodada. 7 partes = história completa!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
story.push(OPEN[(Math.random()*3)|0]);
function show(){
 if(round>=6){
  story.push(END[(Math.random()*3)|0]);
  gameOver();return;
 }
 hud.set('r',(round+2)+'/7');
 st.innerHTML='<i>'+story.join(' ')+'</i><br><b>Sua vez! Escolha:</b>';
 brow.innerHTML='';
 const opts=MID.slice().sort(()=>Math.random()-.5).slice(0,3);
 opts.forEach(o=>{
  H.btn(brow,o,()=>{
   if(over)return;
   story.push(o);
   const bot=MID[(Math.random()*MID.length)|0];
   story.push('(Bot 🤖: '+bot+')');
   round+=2;H.sfx('ok');show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';
 st.innerHTML='<b>📖 SUA HISTÓRIA:</b><br><i>'+story.join(' ')+'</i>';
 H.score(story.length*20);
H.done({win:true,score:story.length*20,title:'📖 História pronta!',sub:story.length+' trechos de pura arte.'});}
show();
}});"""

# 368 — Emoji Decifrador
GAMES[368] = r"""/* NCODE N · 368 Emoji Decifrador — que filme é esse? */
GREG(368,{
init(root,H){
const M=[
 ['🦁👑','Rei Leão',['Rei Leão','Madagascar','Tarzan','Mogli'],0],
 ['🚢💔🌊','Titanic',['Titanic','Náufrago','Piratas','Aquaman'],0],
 ['🕷️🏙️','Homem-Aranha',['Batman','Homem-Aranha','Super-Homem','Flash'],1],
 ['🧊🚢','Frozen',['Moana','Frozen','Era do Gelo','Atlantis'],1],
 ['🦖🏝️','Jurassic Park',['Kong','Jurassic Park','Godzilla','Jumanji'],1],
 ['🤖❤️','WALL-E',['Robocop','Star Wars','WALL-E','Avatar'],2],
 ['🏠🎈','Up',['Up','Divertida Mente','Forrest Gump','Gigante'],0],
 ['👻🏠','Caça-Fantasmas',['It','Caça-Fantasmas','Invocação','Hotel'],1]
];
let over=false,qi=0,score=0;
const hud=H.hud(root,[['f','FILME','1/8'],['pt','PONTOS',0]]);
const say=H.msg(root,'Adivinhe o filme pelos emojis! 8 filmes.');
const box=H.el('div','g-col',null,root);
const em=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=8){gameOver();return;}
 const m=M[qi];
 hud.set('f',(qi+1)+'/8');
 em.innerHTML='<span style="font-size:52px">'+m[0]+'</span>';
 brow.innerHTML='';
 m[2].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===m[3]){score+=100;H.sfx('ok');}
   else{H.sfx('bad');say('❌ Era: '+m[1]);}
   qi++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=600,score,title:score>=600?'🎬 Cinéfilo!':'🎬 Fim!',sub:score+'/800 pontos.'});}
show();
}});"""

# 369 — Efeito Sonoro
GAMES[369] = r"""/* NCODE N · 369 Efeito Sonoro — faça o som! */
GREG(369,{
init(root,H){
const SC=['🚪 Porta rangendo','⚡ Trovão','🐱 Gato miando','🚗 Carro velho','👶 Bebê chorando','🌊 Onda quebrando','🔥 Fogueira','🚂 Trem chegando'];
let over=false,round=0,score=0,time=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Faça o efeito sonoro com a voz! O grupo (bots) vota. 6 rodadas, 10s cada!');
const box=H.el('div','g-col',null,root);
const sc=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const scenes=SC.slice().sort(()=>Math.random()-.5).slice(0,6);
function show(){
 if(round>=6){gameOver();return;}
 time=10;
 hud.set('r',(round+1)+'/6');
 sc.innerHTML='🎙️ FAÇA O SOM DE:<br><span style="font-size:34px"><b>'+scenes[round]+'</b></span><br>⏱️ 10s';
 brow.innerHTML='';
 H.btn(brow,'🎬 FEITO! (votação)',()=>{
  if(over)return;
  const v=1+((Math.random()*5)|0);
  score+=v*20;H.sfx(v>=3?'ok':'bad');
  sc.innerHTML=scenes[round]+'<br>Votos: '+'⭐'.repeat(v)+' ('+v+'/5)';
  round++;hud.set('pt',score);
  H.after(1500,()=>{if(!over)show();});
 },true);
}
H.every(1000,()=>{
 if(over||round>=6)return;
 time--;
 if(time<=0){round++;H.sfx('bad');show();return;}
 sc.innerHTML='🎙️ FAÇA O SOM DE:<br><span style="font-size:34px"><b>'+scenes[round]+'</b></span><br>⏱️ '+time+'s';
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎙️ Artista de som!':'🎙️ Fim!',sub:score+' pontos.'});}
show();
}});"""

# 370 — Jogo de Imitações
GAMES[370] = r"""/* NCODE N · 370 Jogo de Imitações — imite o famoso! */
GREG(370,{
init(root,H){
const F=['🤖 Robô dançando','🐵 Macaco','👶 Bebê bravo','🧙 Mago','🦁 Leão','🐔 Galinha','🧛 Vampiro','👽 ET'];
let over=false,round=0,score=0,time=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Imite com corpo e voz! O grupo vota. 6 rodadas!');
const box=H.el('div','g-col',null,root);
const fc=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const picks=F.slice().sort(()=>Math.random()-.5).slice(0,6);
function show(){
 if(round>=6){gameOver();return;}
 time=15;
 hud.set('r',(round+1)+'/6');
 fc.innerHTML='🎭 IMITE:<br><span style="font-size:34px"><b>'+picks[round]+'</b></span><br>⏱️ 15s';
 brow.innerHTML='';
 H.btn(brow,'✅ Adivinharam!',()=>{score+=100+time*5;round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'❌ Ninguém acertou',()=>{round++;H.sfx('bad');show();},false);
}
H.every(1000,()=>{
 if(over||round>=6)return;
 time--;
 if(time<=0){round++;show();return;}
 fc.innerHTML='🎭 IMITE:<br><span style="font-size:34px"><b>'+picks[round]+'</b></span><br>⏱️ '+time+'s';
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎭 Imitador nato!':'🎭 Fim!',sub:score+' pontos.'});}
show();
}});"""

# 371 — Detector de Mentiras
GAMES[371] = r"""/* NCODE N · 371 Detector de Mentiras — ele sabe! */
GREG(371,{
init(root,H){
const Q=['Já fingiu estar doente?','Já comeu algo do chão?','Já mentiu neste jogo?','Tem medo do escuro?','Já quebrou algo escondido?','Canta no banho?'];
let over=false,qi=0,truth=0,needle=0,phase='ask',t=0;
const hud=H.hud(root,[['p','PERGUNTA','1/6'],['v','VERDADES',0]]);
const say=H.msg(root,'Responda SIM ou NÃO e veja o detector (totalmente científico 😏). 6 perguntas!');
const box=H.el('div','g-col',null,root);
const qz=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const o=H.cvs(root,460,140),x=o.x;
function show(){
 if(qi>=6){gameOver();return;}
 phase='ask';
 hud.set('p',(qi+1)+'/6');
 qz.innerHTML='<b>'+Q[qi]+'</b>';
 brow.innerHTML='';
 H.btn(brow,'✅ SIM',()=>answer(true),true);
 H.btn(brow,'❌ NÃO',()=>answer(false),false);
}
function answer(v){
 if(over||phase!=='ask')return;
 phase='scan';t=0;
 const verdict=Math.random()<.7;
 H.after(1800,()=>{
  if(over)return;
  if(verdict){truth++;hud.set('v',truth);qz.innerHTML='💚 VERDADE! O detector aprova.';H.sfx('ok');}
  else{qz.innerHTML='❤️‍🔥 MENTIRA! O detector apitou!';H.sfx('bad');}
  qi++;
  H.after(1400,()=>{if(!over)show();});
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(truth*100);
H.done({win:truth>=4,score:truth*100,title:truth>=4?'💚 Quase santo!':'❤️‍🔥 Pegou no pulo!',sub:truth+'/6 verdades.'});}
H.loop(dt=>{
 if(phase==='scan')needle=Math.sin(t*20)*80+t*10;
 else needle*=.9;
 t+=dt;
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,140);
 x.fillStyle='#3E7C4F';x.fillRect(30,60,140,30);
 x.fillStyle='#E8A33D';x.fillRect(170,60,120,30);
 x.fillStyle='#D94E34';x.fillRect(290,60,140,30);
 x.strokeStyle='#fff';x.lineWidth=4;
 x.beginPath();x.moveTo(230,120);x.lineTo(230+needle,65);x.stroke();
 x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='center';
 x.fillText(phase==='scan'?'ANALISANDO…':'DETECTOR DE MENTIRAS 3000',230,135);
});
show();
}});"""

# 372 — Debate Relâmpago
GAMES[372] = r"""/* NCODE N · 372 Debate Relâmpago — defenda o absurdo! */
GREG(372,{
init(root,H){
const T=['Pão com manteiga > pizza','Alienígenas pagam imposto','Cama é melhor que praia','Segunda-feira é ótima','Sopa é bebida','Meia com sandália é estilo'];
let over=false,round=0,score=0,time=0,side=0;
const hud=H.hud(root,[['r','DEBATE','1/4'],['pt','PONTOS',0]]);
const say=H.msg(root,'Defenda seu lado por 30s! A plateia (bots) vota. 4 debates!');
const box=H.el('div','g-col',null,root);
const tp=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=4){gameOver();return;}
 time=30;side=(Math.random()*2)|0;
 hud.set('r',(round+1)+'/4');
 tp.innerHTML='🎤 TEMA: <b>'+T[round]+'</b><br>Você defende: <b>'+(side?'✅ A FAVOR':'❌ CONTRA')+'</b><br>⏱️ 30s — DEBATA!';
 brow.innerHTML='';
 H.btn(brow,'🗳️ Encerrar e votar',()=>{
  if(over)return;
  const v=1+((Math.random()*5)|0);
  score+=v*25;H.sfx(v>=3?'ok':'bad');
  tp.innerHTML='Votos: '+'⭐'.repeat(v)+' ('+v+'/5)';
  round++;hud.set('pt',score);
  H.after(1500,()=>{if(!over)show();});
 },true);
}
H.every(1000,()=>{
 if(over||round>=4)return;
 time--;
 if(time<=0){
  const v=1+((Math.random()*5)|0);
  score+=v*25;round++;hud.set('pt',score);show();return;
 }
 tp.innerHTML='🎤 TEMA: <b>'+T[round]+'</b><br>Você defende: <b>'+(side?'✅ A FAVOR':'❌ CONTRA')+'</b><br>⏱️ '+time+'s — DEBATA!';
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=250,score,title:score>=250?'🎤 Orador supremo!':'🎤 Fim!',sub:score+' pontos.'});}
show();
}});"""

# 373 — Qual é a Música
GAMES[373] = r"""/* NCODE N · 373 Qual é a Música — ouça e adivinhe! */
GREG(373,{
init(root,H){
const M=[
 ['🎸 Rock clássico',['Rock','Samba','Funk','Jazz'],0],
 ['🥁 Batucada',['Rock','Samba','Pop','Clássica'],1],
 ['🎻 Cordas suaves',['Funk','Rock','Clássica','Rap'],2],
 ['🎤 Refrão pop',['Samba','Pop','Jazz','Blues'],1],
 ['🎺 Sopro alto',['Jazz','Rock','Sertanejo','Eletrônica'],0],
 ['🪗 Sanfona',['Forró','Rock','Pop','Reggae'],0]
];
let over=false,qi=0,score=0,play=0,t=0;
const hud=H.hud(root,[['m','MÚSICA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Um trecho toca (barras animadas + dica)! Adivinhe o estilo. 6 músicas!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const o=H.cvs(root,460,120),x=o.x;
function show(){
 if(qi>=6){gameOver();return;}
 play=3;
 hud.set('m',(qi+1)+'/6');
 const m=M[qi];
 st.innerHTML='🎵 Ouvindo… dica: <b>'+m[0]+'</b>';
 brow.innerHTML='';
 m[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===m[2]){score+=100;H.sfx('ok');}
   else{H.sfx('bad');say('❌ Era: '+m[1][m[2]]);}
   qi++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=400,score,title:score>=400?'🎵 Ouvido de ouro!':'🎵 Fim!',sub:score+'/600 pontos.'});}
H.loop(dt=>{
 t+=dt;if(play>0)play-=dt;
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,120);
 for(let i=0;i<24;i++){
  const h=play>0?20+Math.abs(Math.sin(t*6+i))*(50+((i*37)%40)):8;
  x.fillStyle=play>0?'#C4D645':'#4A4A44';
  x.fillRect(10+i*18,110-h,12,h);
 }
});
show();
}});"""

# 374 — Corrida de Categorias
GAMES[374] = r"""/* NCODE N · 374 Corrida de Categorias — toque rápido! */
GREG(374,{
init(root,H){
const CATS=[
 ['FRUTAS',['🍎','🍌','🍇','🚗','🐶','🍊','⚽','🍉','🎸']],
 ['ANIMAIS',['🐶','🐱','🍎','🐦','🚗','🐟','⚽','🐵','🍌']],
 ['VEÍCULOS',['🚗','✈️','🍎','🚲','🐶','🚀','⚽','🛶','🍇']]
];
let over=false,round=0,score=0,bot=0,time=0,need=0;
const hud=H.hud(root,[['r','RODADA','1/3'],['vc','VOCÊ',0],['bt','BOT',0]]);
const say=H.msg(root,'Toque TUDO da categoria antes do bot! 3 rodadas. Errar = −1s!');
const box=H.el('div','g-col',null,root);
const ct=H.el('div','g-msg','',box);
const grid=H.el('div','g-board',null,box);
grid.style.gridTemplateColumns='repeat(3,1fr)';
let items=[];
function show(){
 if(round>=3){gameOver();return;}
 const c=CATS[round];
 hud.set('r',(round+1)+'/3');
 time=20;
 items=c[1].map((e,i)=>({e,ok:'🍎🍌🍇🍊🍉🐶🐱🐦🐟🐵🚗✈️🚲🚀🛶'.includes(e)&&((round===0&&'🍎🍌🍇🍊🍉'.includes(e))||(round===1&&'🐶🐱🐦🐟🐵'.includes(e))||(round===2&&'🚗✈️🚲🚀🛶'.includes(e))),got:false}));
 need=items.filter(i=>i.ok).length;
 ct.innerHTML='<b>'+c[0]+'</b> · ache '+need+'! ⏱️20s';
 grid.innerHTML='';
 items.forEach(it=>{
  const b=H.el('button','g-cell',it.e,grid);
  b.style.fontSize='34px';b.style.minHeight='64px';
  b.addEventListener('click',()=>{
   if(over||it.got)return;
   if(it.ok){it.got=true;b.style.opacity='.25';score++;H.sfx('ok');hud.set('vc',score);
    if(!items.some(i=>i.ok&&!i.got)){round++;bot+=3+((Math.random()*3)|0);hud.set('bt',bot);H.after(800,()=>{if(!over)show();});}
   }else{time=Math.max(0,time-1);H.sfx('bad');}
  });
 });
}
H.every(1000,()=>{
 if(over||round>=3)return;
 time--;
 ct.innerHTML='<b>'+CATS[round][0]+'</b> · ache '+items.filter(i=>i.ok&&!i.got).length+'! ⏱️'+time+'s';
 if(time<=0){round++;bot+=4;hud.set('bt',bot);show();}
});
function gameOver(){over=true;grid.innerHTML='';H.score(score*20);
H.done({win:score>bot,score:score*20,title:score>bot?'🏁 Mais rápido!':'🏁 Bot venceu!',sub:'Você '+score+' × '+bot+' bot.'});}
show();
}});"""

# 375 — Associação de Palavras
GAMES[375] = r"""/* NCODE N · 375 Associação de Palavras — rápido ou fora! */
GREG(375,{
init(root,H){
const W=[
 ['☀️ Sol',['Lua','Calor','Noite','Frio'],1],
 ['🌊 Mar',['Areia','Montanha','Deserto','Cidade'],0],
 ['🐕 Cachorro',['Osso','Peixe','Cenoura','Mel'],0],
 ['🎂 Aniversário',['Festa','Luto','Prova','Fila'],0],
 ['⚽ Futebol',['Gol','Raquete','Piscina','Ringue'],0],
 ['📚 Livro',['Leitura','Martelo','Panela','Chave'],0],
 ['🌙 Noite',['Estrela','Sol','Almoço','Praia'],0],
 ['🍕 Pizza',['Queijo','Sabão','Papel','Vidro'],0]
];
let over=false,qi=0,lives=3,score=0,time=0;
const hud=H.hud(root,[['v','VIDAS',3],['pt','PONTOS',0]]);
const say=H.msg(root,'Diga (toque) a associação antes de 4s! Lento ou errado = perde vida. 8 palavras, 3 vidas!');
const box=H.el('div','g-col',null,root);
const wd=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=8){gameOver(true);return;}
 time=4;
 const w=W[qi];
 wd.innerHTML='<span style="font-size:40px"><b>'+w[0]+'</b></span><br>⏱️ 4s!';
 brow.innerHTML='';
 w[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===w[2]){score+=50+Math.ceil(time)*15;H.sfx('ok');}
   else{lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}}
   qi++;hud.set('pt',score);show();
  },false);
 });
}
H.every(500,()=>{
 if(over||qi>=8)return;
 time-=.5;
 if(time<=0){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}qi++;show();return;}
 wd.innerHTML='<span style="font-size:40px"><b>'+W[qi][0]+'</b></span><br>⏱️ '+time.toFixed(1)+'s!';
});
function gameOver(win){over=true;brow.innerHTML='';H.score(score);
H.done({win:win,score,title:win?'⚡ Mente relâmpago!':'⚡ Lento demais!',sub:score+' pontos.'});}
show();
}});"""

# 376 — Desafio de Sotaques
GAMES[376] = r"""/* NCODE N · 376 Desafio de Sotaques — qual é qual? */
GREG(376,{
init(root,H){
const P=[
 ['O rato roeu a roupa do rei.','caipira'],
 ['Batatinha quando nasce.','carioca'],
 ['Ô trem bão, sô!','mineiro'],
 ['Meu irmão, que massa!','baiano'],
 ['Bah, que tri legal!','gaúcho'],
 ['Menino, tu é doido é?','nordestino']
];
let over=false,round=0,score=0,time=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Leia a frase no sotaque sorteado! O grupo adivinha qual é. 6 rodadas!');
const box=H.el('div','g-col',null,root);
const ph=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=6){gameOver();return;}
 time=15;
 hud.set('r',(round+1)+'/6');
 const p=P[round];
 ph.innerHTML='🗣️ Leia com sotaque <b>'+p[1].toUpperCase()+'</b>:<br>"<i>'+p[0]+'</i>"<br>⏱️ 15s';
 brow.innerHTML='';
 H.btn(brow,'✅ Adivinharam o sotaque!',()=>{score+=100;round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'❌ Erraram',()=>{round++;H.sfx('bad');show();},false);
}
H.every(1000,()=>{
 if(over||round>=6)return;
 time--;
 if(time<=0){round++;show();return;}
});
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=400,score,title:score>=400?'🗣️ Poliglota!':'🗣️ Fim!',sub:score+'/600 pontos.'});}
show();
}});"""

# 377 — Leitura Labial
GAMES[377] = r"""/* NCODE N · 377 Leitura Labial — fale sem som! */
GREG(377,{
init(root,H){
const P=[
 ['Eu amo pizza',['Eu amo pizza','Eu odeio chuva','Meu gato mia','Vou à praia'],0],
 ['O cachorro latiu',['O cachorro latiu','A vaca pulou','O galo cantou','O pato nadou'],0],
 ['Vamos à festa hoje',['Vamos à festa hoje','Fomos ao jogo ontem','Venha à feira amanhã','Vou à escola cedo'],0],
 ['Que calor danado',['Que calor danado','Que frio medonho','Que vento forte','Que chuva boa'],0],
 ['Meu time ganhou',['Meu time ganhou','Meu primo sumiu','Minha tia ligou','Meu vô dormiu'],0]
];
let over=false,qi=0,score=0,mem=5,phase='mem';
const hud=H.hud(root,[['f','FRASE','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Memorize a frase, fale em SILÊNCIO para o grupo e veja se adivinham! Depois confira. 5 frases!');
const box=H.el('div','g-col',null,root);
const ph=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(qi>=5){gameOver();return;}
 phase='mem';mem=5;
 hud.set('f',(qi+1)+'/5');
 ph.innerHTML='🤫 MEMORIZE:<br><b style="font-size:26px">"'+P[qi][0]+'"</b><br>5s…';
 brow.innerHTML='';
 H.after(5000,()=>{if(!over&&phase==='mem'){phase='ask';ask();}});
}
function ask(){
 ph.innerHTML='🤫 Fale "<b>???</b>" em silêncio!<br>O grupo adivinhou?';
 brow.innerHTML='';
 P[qi][1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over||phase!=='ask')return;
   if(i===P[qi][3]){score+=100;H.sfx('ok');}
   else H.sfx('bad');
   qi++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'👄 Lábios de ouro!':'👄 Fim!',sub:score+'/500 pontos.'});}
show();
}});"""

# 378 — Dança Congelada
GAMES[378] = r"""/* NCODE N · 378 Dança Congelada — parou, congelou! */
GREG(378,{
init(root,H){
let over=false,round=0,lives=3,phase='dance',t=0,stopAt=0,react=0;
const hud=H.hud(root,[['r','RODADA','1/6'],['v','VIDAS',3]]);
const say=H.msg(root,'DANCE (toque no ritmo)! Quando a música parar, toque CONGELAR em 1s! Mexeu = perde vida. 6 rodadas!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const o=H.cvs(root,460,120),x=o.x;
function show(){
 if(round>=6){gameOver(true);return;}
 phase='dance';stopAt=3+Math.random()*5;t=0;
 hud.set('r',(round+1)+'/6');
 st.innerHTML='🎶 DANCE! 🎶<br>Toque no ritmo…';
 brow.innerHTML='';
 H.btn(brow,'💃 Dançar!',()=>{if(!over&&phase==='dance')H.sfx('tick');},false);
 H.btn(brow,'🧊 CONGELAR!',freeze,true);
}
function freeze(){
 if(over)return;
 if(phase==='stop'){
  const r=t-stopAt;
  if(r<=1){H.sfx('ok');say('🧊 Congelado em '+r.toFixed(2)+'s!');}
  else{lives--;H.sfx('bad');hud.set('v',lives);say('🐢 Lento! −1 vida.');if(lives<=0){gameOver(false);return;}}
  round++;show();
 }else{
  lives--;H.sfx('bad');hud.set('v',lives);
  if(lives<=0){gameOver(false);return;}
  say('🕺 A música ainda toca! −1 vida.');round++;show();
 }
}
function gameOver(win){over=true;brow.innerHTML='';H.score((6-round)*0+lives*100);
H.done({win:win,score:lives*100,title:win?'🧊 Estátua viva!':'🧊 Mexeu!',sub:'Vidas: '+lives+'/3.'});}
H.loop(dt=>{
 if(over)return;
 t+=dt;
 if(phase==='dance'&&t>=stopAt){phase='stop';st.innerHTML='🔇 PAROU! CONGELE!';H.sfx('bad');}
 if(phase==='stop'&&t-stopAt>2.5){lives--;hud.set('v',lives);H.sfx('bad');if(lives<=0){gameOver(false);return;}round++;show();return;}
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,120);
 for(let i=0;i<24;i++){
  const h=phase==='dance'?20+Math.abs(Math.sin(t*7+i))*70:6;
  x.fillStyle=phase==='dance'?'#C4D645':'#4A4A44';
  x.fillRect(10+i*18,110-h,12,h);
 }
});
show();
}});"""

# 379 — Telefone Sem Fio
GAMES[379] = r"""/* NCODE N · 379 Telefone Sem Fio — sussurre certo! */
GREG(379,{
init(root,H){
const CHAIN=[
 ['O gato subiu no telhado',['O gato subiu no telhado','O pato fugiu no feriado','O rato sumiu no sapato'],0],
 ['Três tigres tristes',['Três tigres tristes','Três pratos quentes','Dois tigres listrados'],0],
 ['A aranha arranha a jarra',['A aranha arranha a jarra','A abelha beija a flor','A arara amarra a vara'],0],
 ['Pão, queijo e presunto',['Pão, queijo e presunto','Cão, peixe e peru','Mão, queixo e ombro'],0],
 ['Meu vizinho tem um sino',['Meu vizinho tem um sino','Meu sobrinho viu um cisne','Meu caminho tem espinhos'],0]
];
let over=false,round=0,score=0;
const hud=H.hud(root,[['r','CORRENTE','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Memorize a frase e escolha o que saiu no fim da corrente! A frase se deforma… 5 correntes!');
const box=H.el('div','g-col',null,root);
const ph=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function show(){
 if(round>=5){gameOver();return;}
 const c=CHAIN[round];
 hud.set('r',(round+1)+'/5');
 ph.innerHTML='📞 FRASE ORIGINAL:<br><b>"'+c[0]+'"</b><br>Memorize e toque PRONTO!';
 brow.innerHTML='';
 H.btn(brow,'👂 PRONTO! (ver fim)',()=>{
  if(over)return;
  ph.innerHTML='📞 O que chegou no fim?';
  brow.innerHTML='';
  const opts=c[1].slice().sort(()=>Math.random()-.5);
  opts.forEach(o=>{
   H.btn(brow,'"'+o+'"',()=>{
    if(over)return;
    if(o===c[0]){score+=100;H.sfx('ok');}
    else{H.sfx('bad');say('❌ Era: "'+c[0]+'"');}
    round++;hud.set('pt',score);show();
   },false);
  });
 },true);
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=300,score,title:score>=300?'📞 Linha clara!':'📞 Chiado!',sub:score+'/500 pontos.'});}
show();
}});"""

# 380 — Torneio de Pedra-Papel-Tesoura
GAMES[380] = r"""/* NCODE N · 380 Torneio de Pedra-Papel-Tesoura — campeão! */
GREG(380,{
init(root,H){
const M=['✊','✋','✌️'];
const N=['Pedra','Papel','Tesoura'];
let over=false,round=0,wins=0,foe=0;
const FOES=['🤖 Bot1','🤖 Bot2','🤖 Bot3','🤖 Bot4','🤖 Bot5','🤖 Bot6','🤖 Bot7'];
const hud=H.hud(root,[['r','FASE','Oitavas'],['v','VITÓRIAS','0/3']]);
const say=H.msg(root,'Torneio mata-mata! Vença 3 fases (oitavas→semi→final). Empate = joga de novo!');
const box=H.el('div','g-col',null,root);
const mt=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const STAGES=['Oitavas','Semifinal','FINAL'];
function show(){
 if(wins>=3){gameOver(true);return;}
 foe=(Math.random()*FOES.length)|0;
 hud.set('r',STAGES[wins]);
 mt.innerHTML='<b>'+STAGES[wins]+'</b> · Você × '+FOES[foe]+'<br>Escolha!';
 brow.innerHTML='';
 M.forEach((m,i)=>{
  H.btn(brow,m+' '+N[i],()=>{
   if(over)return;
   const b=(Math.random()*3)|0;
   const res=(i-b+3)%3;
   if(res===1){wins++;H.sfx('ok');
    mt.innerHTML='Você '+m+' × '+M[b]+' '+FOES[foe]+'<br>✅ Venceu a fase!';
    hud.set('v',wins+'/3');
    H.after(1400,()=>{if(!over)show();});
   }else if(res===2){H.sfx('bad');gameOver(false,b,m);}
   else{H.sfx('tick');mt.innerHTML='Você '+m+' × '+M[b]+'<br>⚖️ Empate! De novo…';}
  },false);
 });
}
function gameOver(win,b,m){over=true;brow.innerHTML='';
 const sc=wins*150+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🏆 CAMPEÃO!',sub:'3 fases vencidas!'}:{win:false,score:sc,title:'Eliminado!',sub:'Seu '+(m||'')+' perdeu para '+M[b||0]+'. Vitórias: '+wins+'/3.'});}
show();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
