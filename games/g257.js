/* NCODE N · 257 Batalha de Cartas — derrube o herói rival! */
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
}});
