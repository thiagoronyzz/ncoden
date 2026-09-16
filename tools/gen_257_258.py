#!/usr/bin/env python3
"""Gera games/g257..g258 — Batalha de Cartas e Deck Builder. Edicao caprichada."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 257 — Batalha de Cartas
GAMES[257] = r"""/* NCODE N · 257 Batalha de Cartas — derrube o herói rival! */
GREG(257,{
init(root,H){
// nome, custo, atk, hp, skill, texto
const POOL=[
  ['Batedor',1,2,1,'',''],
  ['Escudeiro',1,1,3,'escudo','Bloqueia o primeiro dano.'],
  ['Lobo Veloz',2,3,2,'investida','Pode atacar ao entrar.'],
  ['Tartaruga Anciã',2,1,6,'escudo','Bloqueia o primeiro dano.'],
  ['Clériga',2,2,3,'cura','Cura 2 do seu herói ao entrar.'],
  ['Arqueira Élfica',3,4,3,'',''],
  ['Vampiro',3,3,4,'dreno','Cura 2 do seu herói ao abater.'],
  ['Piromante',4,5,3,'',''],
  ['Golem de Pedra',4,3,7,'',''],
  ['Dragão Jovem',6,6,6,'investida','Pode atacar ao entrar.']
];
const SPELLS=[['Raio',2,'Causa 3 de dano.'],['Cura Maior',2,'Restaura 5 do seu herói.'],['Chuva de Meteoros',5,'Causa 2 em TODOS os inimigos.']];
const SKL={investida:'⚡',escudo:'🛡️',dreno:'🩸',cura:'💚'};
let over=false,turn=0,seq=0,roundN=1,sel=-1,tmode=null,kills=0;
let hp=[20,20],mana=[0,0],maxm=[0,0],deck=[[],[]],hand=[[],[]],board=[[],[]],fat=[0,0];
let log=[];
const hud=H.hud(root,[['r','TURNO',1],['vh','SUA VIDA',20],['ch','VIDA CPU',20],['mn','MANA','0/0']]);
const say=H.msg(root,'Baixe criaturas, ataque com as prontas (💤 = dormindo)! Magias: Raio e Chuva ferem, Cura protege. Zere a vida da CPU!');
const ehero=H.el('div','g-msg','',root);
const eboard=H.el('div','g-row',null,root);
const mid=H.el('div','g-msg','',root);
const pboard=H.el('div','g-row',null,root);
const phero=H.el('div','g-msg','',root);
const hrow=H.el('div','g-row',null,root);
const brow=H.el('div','g-row',null,root);
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function say2(t){log.unshift(t);log=log.slice(0,4);}
function mkDeck(){
  const d=[];
  [0,0,1,1,2,2,3,4,4,5,5,6,7,8,9].forEach(id=>d.push({t:'c',id}));
  d.push({t:'s',id:0});d.push({t:'s',id:0});d.push({t:'s',id:1});d.push({t:'s',id:2});
  for(let i=d.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=d[i];d[i]=d[j];d[j]=t;}
  return d;
}
function draw(w,n){
  for(let k=0;k<n;k++){
    if(!deck[w].length){fat[w]++;hp[w]-=fat[w];say2((w?'CPU':'Você')+' em fadiga: -'+fat[w]+'!');checkWin();continue;}
    if(hand[w].length>=8){deck[w].pop();say2((w?'CPU':'Você')+' queimou carta (mão cheia)!');continue;}
    hand[w].push(deck[w].pop());
  }
}
function status(){
  hud.set('r',roundN);hud.set('vh',hp[0]);hud.set('ch',hp[1]);hud.set('mn',mana[0]+'/'+maxm[0]);
  say((turn===0?'Sua vez! ':'Vez da CPU… ')+'Baixe cartas e ataque!');
}
function checkWin(){
  if(over)return true;
  if(hp[1]<=0){gameOver(true);return true;}
  if(hp[0]<=0){gameOver(false);return true;}
  return false;
}
function gameOver(win){
  over=true;seq++;
  const sc=win?300+hp[0]*10+Math.max(0,20-roundN)*5:Math.max(10,hp[0]*5+kills*10);
  H.score(sc);
  H.done(win?{win:true,score:sc,title:'🏆 Herói rival caído!',sub:roundN+' turnos · '+hp[0]+' de vida restante · '+kills+' abates.'}
    :{win:false,score:sc,title:'Seu herói caiu!',sub:'Sobreviveu '+roundN+' turnos · proteja-se com Cura e escudos!'});
}
function hitMinion(w,i,dmg){
  const m=board[w][i];
  if(!m)return false;
  if(m.sh){m.sh=false;say2(m.n+' bloqueou com 🛡️!');return false;}
  m.hp-=dmg;
  if(m.hp<=0){
    board[w].splice(i,1);
    if(!w)kills++;
    say2(m.n+' foi destruído!');
    return true;
  }
  return false;
}
function combat(w,i,dt,di){
  const m=board[w][i];
  if(!m||!m.can)return;
  m.can=false;
  if(dt==='hero'){
    hp[1-w]-=m.atk;
    say2(m.n+' golpeou o herói: -'+m.atk+'!');
    H.sfx('ok');paint();
    checkWin();return;
  }
  const d=board[1-w][di];
  if(!d)return;
  say2(m.n+' ('+m.atk+'/'+m.hp+') × '+d.n+' ('+d.atk+'/'+d.hp+')');
  const killed=hitMinion(1-w,di,m.atk);
  if(killed&&m.sk==='dreno'){hp[w]=Math.min(30,hp[w]+2);say2('🩸 Dreno curou 2!');}
  const ai=board[w].indexOf(m);
  if(ai>=0&&board[1-w].indexOf(d)>=0)hitMinion(w,ai,d.atk);
  H.sfx('ok');paint();
  checkWin();
}
function castSpell(w,card,target){
  const sp=SPELLS[card.id];
  if(card.id===0){
    if(target.t==='hero'){hp[1-w]-=3;say2('⚡ Raio no herói: -3!');}
    else{hitMinion(1-w,target.i,3);say2('⚡ Raio em '+3+' de dano!');}
  }else if(card.id===1){hp[w]=Math.min(30,hp[w]+5);say2('💚 Cura Maior: +5!');}
  else{
    for(let i=board[1-w].length-1;i>=0;i--)hitMinion(1-w,i,2);
    hp[1-w]-=2;say2('☄️ Meteoros: 2 em tudo!');
  }
  H.sfx('ok');
}
function playCard(w,hi,target){
  const card=hand[w][hi];
  if(!card)return false;
  const cost=card.t==='c'?POOL[card.id][1]:SPELLS[card.id][1];
  if(mana[w]<cost){if(!w){H.sfx('bad');}return false;}
  if(card.t==='c'){
    if(board[w].length>=5){if(!w)H.sfx('bad');return false;}
    const c=POOL[card.id];
    mana[w]-=cost;hand[w].splice(hi,1);
    const m={n:c[0],atk:c[2],hp:c[3],max:c[3],sk:c[4],can:c[4]==='investida',sh:c[4]==='escudo'};
    board[w].push(m);
    say2((w?'CPU baixou ':'Você baixou ')+c[0]+'.');
    if(c[4]==='cura'){hp[w]=Math.min(30,hp[w]+2);say2('💚 Clériga curou 2!');}
    H.sfx('tick');return true;
  }
  if(card.id===0&&!target){
    if(!w){tmode={kind:'spell',hi};paint();}
    return false;
  }
  mana[w]-=cost;hand[w].splice(hi,1);
  castSpell(w,card,target||{t:'hero'});
  return true;
}
function startTurn(w){
  if(over)return;
  seq++;turn=w;sel=-1;tmode=null;
  maxm[w]=Math.min(10,maxm[w]+1);mana[w]=maxm[w];
  board[w].forEach(m=>m.can=true);
  draw(w,1);
  if(checkWin())return;
  if(w===1){roundN++;status();paint();sched(aiPlay,900);}
  else{status();paint();}
}
function aiPlay(){
  if(over||turn!==1)return;
  let acted=true,guard=0;
  while(acted&&guard++<20){
    acted=false;
    let bi=-1,bc=-1;
    hand[1].forEach((c,hi)=>{
      const cost=c.t==='c'?POOL[c.id][1]:SPELLS[c.id][1];
      if(c.t==='c'&&cost<=mana[1]&&board[1].length<5&&cost>bc){bc=cost;bi=hi;}
    });
    if(bi>=0){playCard(1,bi);acted=true;continue;}
    for(let hi=0;hi<hand[1].length;hi++){
      const c=hand[1][hi];
      if(c.t!=='s')continue;
      const cost=SPELLS[c.id][1];
      if(cost>mana[1])continue;
      if(c.id===1&&hp[1]<=12){playCard(1,hi,{t:'hero'});acted=true;break;}
      if(c.id===2&&board[0].length>=2){playCard(1,hi,{t:'hero'});acted=true;break;}
      if(c.id===0){
        if(hp[0]<=3){playCard(1,hi,{t:'hero'});acted=true;break;}
        let ti=-1,ta=-1;
        board[0].forEach((m,i)=>{if(m.hp<=3&&m.atk>ta){ta=m.atk;ti=i;}});
        if(ti>=0){playCard(1,hi,{t:'min',i:ti});acted=true;break;}
        if(!board[0].length){playCard(1,hi,{t:'hero'});acted=true;break;}
      }
    }
  }
  sched(aiAttack,700);
}
function aiAttack(){
  if(over||turn!==1)return;
  board[1].forEach(m=>{if(m.can){
    if(hp[0]<=m.atk){combat(1,board[1].indexOf(m),'hero');return;}
    let ti=-1,ta=-1;
    board[0].forEach((d,i)=>{if(d.hp<=m.atk&&d.atk>ta){ta=d.atk;ti=i;}});
    if(ti>=0&&!over)combat(1,board[1].indexOf(m),'min',ti);
    else if(!over)combat(1,board[1].indexOf(m),'hero');
  }});
  if(over)return;
  if(roundN>30){gameOver(hp[0]>=hp[1]);return;}
  sched(()=>startTurn(0),700);
}
function cardLabel(c){
  if(c.t==='c'){const p=POOL[c.id];return'<b>'+p[0]+'</b> '+p[1]+'🔮<br>⚔️'+p[2]+' ❤️'+p[3]+(p[4]?' '+SKL[p[4]]:'');}
  const s=SPELLS[c.id];return'<b>'+s[0]+'</b> '+s[1]+'🔮<br><span style="font-size:11px">'+s[2]+'</span>';
}
function minLabel(m){
  return'<b>'+m.n+'</b><br>⚔️'+m.atk+' ❤️'+m.hp+(m.sk?' '+SKL[m.sk]:'')+(m.can?'':' 💤');
}
function paint(){
  if(over)return;
  ehero.innerHTML='🤖 <b>CPU</b> · ❤️ '+Math.max(0,hp[1])+' · 🔮 '+mana[1]+'/'+maxm[1]+' · deck '+deck[1].length;
  eboard.innerHTML='';
  board[1].forEach((m,i)=>{
    const hot=tmode!=null;
    const b=H.el('button','g-card'+(hot?' hot':''),minLabel(m),eboard);
    b.style.minWidth='96px';b.style.fontSize='12px';
    if(hot)b.addEventListener('click',()=>hitTarget('min',i));
  });
  if(tmode){
    const hb=H.el('button','g-card hot','🎯 Herói rival',eboard);
    hb.addEventListener('click',()=>hitTarget('hero'));
  }
  mid.innerHTML=(turn===0?'<b>SUA VEZ</b> — ':'<b>VEZ DA CPU…</b> — ')+(tmode?'escolha um alvo! 🎯':'')+'<br><span style="font-size:12px">'+(log.join('<br>')||'…')+'</span>';
  pboard.innerHTML='';
  board[0].forEach((m,i)=>{
    const b=H.el('button','g-card'+(sel===i?' sel':m.can?' hot':''),minLabel(m),pboard);
    b.style.minWidth='96px';b.style.fontSize='12px';
    if(turn===0&&m.can)b.addEventListener('click',()=>{
      sel=sel===i?-1:i;tmode=sel>=0?{kind:'atk',i:sel}:null;H.sfx('tick');paint();
    });
  });
  phero.innerHTML='😀 <b>Você</b> · ❤️ '+Math.max(0,hp[0])+' · 🔮 '+mana[0]+'/'+maxm[0]+' · deck '+deck[0].length;
  hrow.innerHTML='';
  hand[0].forEach((c,hi)=>{
    const cost=c.t==='c'?POOL[c.id][1]:SPELLS[c.id][1];
    const ok=turn===0&&mana[0]>=cost;
    const b=H.el('button','g-card'+(ok?' hot':''),cardLabel(c),hrow);
    b.style.minWidth='104px';b.style.fontSize='12px';
    if(ok)b.addEventListener('click',()=>{
      if(playCard(0,hi)){sel=-1;tmode=null;}
      paint();checkWin();
    });
  });
  brow.innerHTML='';
  if(turn===0)H.btn(brow,'⏭️ Encerrar turno',()=>{if(!over&&turn===0){startTurn(1);}},true);
}
function hitTarget(t,i){
  if(over||turn!==0||!tmode)return;
  if(tmode.kind==='atk'){const a=tmode.i;sel=-1;tmode=null;combat(0,a,t,i);}
  else{
    const hi=tmode.hi;tmode=null;
    const card=hand[0][hi];
    if(card&&card.t==='s'&&card.id===0){
      const cost=SPELLS[0][1];
      if(mana[0]>=cost){mana[0]-=cost;hand[0].splice(hi,1);castSpell(0,card,{t,i});}
    }
    paint();checkWin();
  }
}
deck[0]=mkDeck();deck[1]=mkDeck();
draw(0,3);draw(1,3);
say2('A batalha começou! Você é o primeiro.');
startTurn(0);
}});"""

# 258 — Deck Builder Masmorra
GAMES[258] = r"""/* NCODE N · 258 Deck Builder Masmorra — monte o deck e vença o Dragão! */
GREG(258,{
init(root,H){
const CARDS={
  golpe:{n:'Golpe',c:1,d:6},guarda:{n:'Guarda',c:1,b:5},
  esmagar:{n:'Esmagar',c:2,d:11},danca:{n:'Dança das Lâminas',c:1,d:4,m:2},
  muralha:{n:'Muralha',c:2,b:11},adren:{n:'Adrenalina',c:0,dr:2,e:1},
  brutal:{n:'Golpe Brutal',c:1,d:8,v:2},foco:{n:'Foco',c:1,s:2,dr:1},
  folego:{n:'Segundo Fôlego',c:2,heal:8},provocar:{n:'Provocar',c:1,b:7,dr:1},
  machado:{n:'Machadada',c:3,d:16},chuva:{n:'Chuva de Aço',c:2,d:5,m:2}
};
const REWARDS=['esmagar','danca','muralha','adren','brutal','foco','folego','provocar','machado','chuva'];
const FOES=[
  {n:'Slime',hp:30,pat:[['a',7],['b',5],['a',9]]},
  {n:'Goblin',hp:26,pat:[['a',5],['a',6],['s',2]]},
  {n:'REST',heal:12},
  {n:'Orc',hp:44,pat:[['a',11],['b',8],['a',8]]},
  {n:'REST',heal:10},
  {n:'Dragão',hp:75,pat:[['a',13],['a',9],['b',12],['a',18]],boss:true}
];
const PMAX=50;
let over=false,phase='fight',seq=0,node=0;
let php=PMAX,deck=[],drawP=[],disc=[],hand=[],energy=0;
let e=null,pb=0,ps=0,log=[],kills=0,showDeck=false;
const hud=H.hud(root,[['nd','SALA','1/6'],['hp','SUA VIDA',PMAX],['en','ENERGIA','3/3'],['dk','DECK',10]]);
const say=H.msg(root,'Sobreviva às 6 salas e mate o Dragão! ⚔️ dano · 🛡️ bloqueio · 💪 força · 🌀 vulnerável. Após cada luta, escolha 1 carta!');
const foeBox=H.el('div','g-msg','',root);
const meBox=H.el('div','g-msg','',root);
const hrow=H.el('div','g-row',null,root);
const brow=H.el('div','g-row',null,root);
const logBox=H.el('div','g-msg','',root);
const deckBox=H.el('div','g-msg','',root);
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function say2(t){log.unshift(t);log=log.slice(0,5);}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function status(){hud.set('nd',(node+1)+'/6');hud.set('hp',php);hud.set('en',energy+'/3');hud.set('dk',deck.length);}
function intent(){
  if(!e)return'';
  const mv=e.pat[e.mi%e.pat.length];
  if(mv[0]==='a')return'😡 vai atacar ⚔️'+(mv[1]+e.str);
  if(mv[0]==='b')return'🛡️ vai defender +'+mv[1];
  return'💪 vai fortalecer +'+mv[1];
}
function cardDesc(k){
  const c=CARDS[k],p=[];
  if(c.d)p.push('⚔️'+c.d+(c.m?'×'+c.m:''));
  if(c.b)p.push('🛡️'+c.b);
  if(c.dr)p.push('+'+c.dr+' carta'+(c.dr>1?'s':''));
  if(c.e)p.push('+'+c.e+'⚡');
  if(c.s)p.push('+'+c.s+'💪');
  if(c.v)p.push('+'+c.v+'🌀');
  if(c.heal)p.push('+'+c.heal+'❤️');
  return'<b>'+c.n+'</b> '+c.c+'⚡<br><span style="font-size:11px">'+p.join(' · ')+'</span>';
}
function draw(n){
  for(let k=0;k<n;k++){
    if(!drawP.length){
      if(!disc.length)return;
      drawP=shuffle(disc);disc=[];
      say2('🔄 Descarte reembaralhado!');
    }
    if(hand.length>=10){say2('Mão cheia!');return;}
    hand.push(drawP.pop());
  }
}
function startCombat(){
  const f=FOES[node];
  e={n:f.n,hp:f.hp,max:f.hp,pat:f.pat,mi:0,block:0,str:0,vuln:0,boss:!!f.boss};
  drawP=shuffle(deck.slice());disc=[];hand=[];pb=0;ps=0;
  phase='fight';
  say2('⚔️ '+e.n+' ('+e.hp+'❤️) bloqueia a passagem!');
  startTurn();
}
function startTurn(){
  if(over)return;
  energy=3;pb=0;
  draw(5);
  say('Sua vez! '+energy+'⚡ · '+intent());
  paint();
}
function dealToFoe(raw){
  let d=raw+ps;
  if(e.vuln>0)d=((d*1.5)|0);
  if(e.block>=d){e.block-=d;d=0;}
  else{d-=e.block;e.block=0;}
  e.hp-=d;
  return d;
}
function playCard(i){
  if(over||phase!=='fight')return;
  if(i<0||i>=hand.length)return;
  const k=hand[i],c=CARDS[k];
  if(energy<c.c){H.sfx('bad');return;}
  energy-=c.c;hand.splice(i,1);disc.push(k);
  const parts=[];
  if(c.d){let tot=0;for(let h=0;h<(c.m||1);h++)tot+=dealToFoe(c.d);parts.push('⚔️'+tot);}
  if(c.b){pb+=c.b;parts.push('🛡️'+c.b);}
  if(c.s){ps+=c.s;parts.push('💪+'+c.s);}
  if(c.v){e.vuln+=c.v;parts.push('🌀+'+c.v);}
  if(c.heal){php=Math.min(PMAX,php+c.heal);parts.push('❤️+'+c.heal);}
  if(c.e){energy+=c.e;parts.push('⚡+'+c.e);}
  if(c.dr){draw(c.dr);parts.push('+'+c.dr+' carta');}
  say2(c.n+': '+parts.join(' '));
  H.sfx('tick');
  if(e.hp<=0){victory();return;}
  paint();
}
function endTurn(){
  if(over||phase!=='fight')return;
  phase='foe';
  e.block=0;
  if(e.vuln>0)e.vuln--;
  const mv=e.pat[e.mi%e.pat.length];
  e.mi++;
  if(mv[0]==='a'){
    let d=mv[1]+e.str;
    if(pb>=d){pb-=d;d=0;}else{d-=pb;pb=0;}
    php-=d;
    say2(e.n+' atacou: -'+d+'!'+(d?'':' (bloqueado)'));
    H.sfx(d?'bad':'tick');
  }else if(mv[0]==='b'){e.block+=mv[1];say2(e.n+' defendeu +'+mv[1]+'🛡️.');H.sfx('tick');}
  else{e.str+=mv[1];say2(e.n+' fortaleceu +'+mv[1]+'💪!');H.sfx('bad');}
  if(php<=0){php=0;paint();gameOver(false);return;}
  phase='fight';
  sched(startTurn,650);
}
function victory(){
  kills++;
  say2('💀 '+e.n+' derrotado!');
  H.sfx('ok');
  node++;
  e=null;hand=[];disc=[];drawP=[];
  if(node>=FOES.length){gameOver(true);return;}
  if(FOES[node].n==='REST'){
    phase='rest';
    paint();
    return;
  }
  phase='reward';
  paint();
}
function gameOver(win){
  over=true;seq++;
  const sc=node*120+kills*60+php*3+(win?400:0);
  H.score(sc);
  H.done(win?{win:true,score:sc,title:'🐉 Dragão derrotado!',sub:'Masmorra limpa · '+deck.length+' cartas · '+php+'❤️ restantes.'}
    :{win:false,score:sc,title:'Você caiu na sala '+(node+1)+'!',sub:kills+' vitórias · o Dragão aguarda outra run.'});
}
function bar(cur,max,w){
  const p=Math.max(0,cur)/max;
  return'<span style="display:inline-block;width:'+w+'px;height:10px;background:#D8D5CC"><span style="display:inline-block;width:'+(p*w|0)+'px;height:10px;background:'+(p>.35?'#3E7C4F':'#B23A24')+'"></span></span>';
}
function paint(){
  status();
  if(phase==='fight'||phase==='foe'){
    foeBox.innerHTML=(e.boss?'🐉':'👹')+' <b>'+e.n+'</b> '+bar(e.hp,e.max,120)+' '+Math.max(0,e.hp)+'/'+e.max+'❤️'+(e.block?' 🛡️'+e.block:'')+(e.str?' 💪'+e.str:'')+(e.vuln?' 🌀'+e.vuln:'')+'<br><i>'+intent()+'</i>';
    meBox.innerHTML='🧙 <b>Você</b> '+bar(php,PMAX,120)+' '+php+'/'+PMAX+'❤️'+(pb?' 🛡️'+pb:'')+(ps?' 💪'+ps:'')+' · ⚡'+energy+' · comp:'+drawP.length+' desc:'+disc.length;
    hrow.innerHTML='';
    hand.forEach((k,i)=>{
      const c=CARDS[k],ok=phase==='fight'&&energy>=c.c;
      const b=H.el('button','g-card'+(ok?' hot':''),cardDesc(k),hrow);
      b.style.minWidth='108px';b.style.fontSize='12px';
      if(ok)b.addEventListener('click',()=>playCard(i));
    });
    brow.innerHTML='';
    if(phase==='fight')H.btn(brow,'⏭️ Encerrar turno',endTurn,true);
    H.btn(brow,'🎴 Deck ('+deck.length+')',()=>{showDeck=!showDeck;paint();},false);
  }else if(phase==='reward'){
    foeBox.innerHTML='✨ <b>Sala limpa!</b> Escolha 1 carta (ou pule e cure 6):';
    meBox.innerHTML='🧙 '+php+'/'+PMAX+'❤️ · deck com '+deck.length+' cartas';
    hrow.innerHTML='';brow.innerHTML='';
    const pool=shuffle(REWARDS.slice()).slice(0,3);
    pool.forEach(k=>{
      const b=H.el('button','g-card hot',cardDesc(k),hrow);
      b.style.minWidth='120px';
      b.addEventListener('click',()=>{
        if(over||phase!=='reward')return;
        deck.push(k);say2('Nova carta: '+CARDS[k].n+'!');
        H.sfx('ok');startCombat();
      });
    });
    H.btn(brow,'⏭️ Pular (+6❤️)',()=>{
      if(over||phase!=='reward')return;
      php=Math.min(PMAX,php+6);say2('Descansou: +6❤️.');
      startCombat();
    },false);
  }else if(phase==='rest'){
    const f=FOES[node];
    foeBox.innerHTML='🏕️ <b>Fogueira!</b> Descanse e recupere '+f.heal+' de vida.';
    meBox.innerHTML='🧙 '+php+'/'+PMAX+'❤️';
    hrow.innerHTML='';brow.innerHTML='';
    H.btn(brow,'🔥 Descansar (+'+f.heal+'❤️)',()=>{
      if(over||phase!=='rest')return;
      php=Math.min(PMAX,php+f.heal);
      say2('Descanso: +'+f.heal+'❤️.');
      node++;startCombat();
    },true);
  }
  logBox.innerHTML='<span style="font-size:12px">'+(log.join('<br>')||'…')+'</span>';
  if(showDeck){
    const cnt={};
    deck.forEach(k=>cnt[k]=(cnt[k]||0)+1);
    deckBox.innerHTML='<span style="font-size:12px">🎴 '+Object.keys(cnt).map(k=>CARDS[k].n+'×'+cnt[k]).join(' · ')+'</span>';
  }else deckBox.innerHTML='';
}
deck=['golpe','golpe','golpe','golpe','golpe','golpe','guarda','guarda','guarda','guarda'];
startCombat();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
