/* NCODE N · 258 Deck Builder Masmorra — monte o deck e vença o Dragão! */
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
const say=H.msg(root,'Sobreviva às 6 salas e mate o Dragão! dano · bloqueio · força · vulnerável. Após cada luta, escolha 1 carta!');
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
  if(mv[0]==='a')return'vai atacar '+(mv[1]+e.str);
  if(mv[0]==='b')return'vai defender +'+mv[1];
  return'vai fortalecer +'+mv[1];
}
function cardDesc(k){
  const c=CARDS[k],p=[];
  if(c.d)p.push(''+c.d+(c.m?'×'+c.m:''));
  if(c.b)p.push(''+c.b);
  if(c.dr)p.push('+'+c.dr+' carta'+(c.dr>1?'s':''));
  if(c.e)p.push('+'+c.e+'');
  if(c.s)p.push('+'+c.s+'');
  if(c.v)p.push('+'+c.v+'');
  if(c.heal)p.push('+'+c.heal+'♥');
  return'<b>'+c.n+'</b> '+c.c+'<br><span style="font-size:11px">'+p.join(' · ')+'</span>';
}
function draw(n){
  for(let k=0;k<n;k++){
    if(!drawP.length){
      if(!disc.length)return;
      drawP=shuffle(disc);disc=[];
      say2('↻ Descarte reembaralhado!');
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
  say2(''+e.n+' ('+e.hp+'♥) bloqueia a passagem!');
  startTurn();
}
function startTurn(){
  if(over)return;
  energy=3;pb=0;
  draw(5);
  say('Sua vez! '+energy+'· '+intent());
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
  if(c.d){let tot=0;for(let h=0;h<(c.m||1);h++)tot+=dealToFoe(c.d);parts.push(''+tot);}
  if(c.b){pb+=c.b;parts.push(''+c.b);}
  if(c.s){ps+=c.s;parts.push('+'+c.s);}
  if(c.v){e.vuln+=c.v;parts.push('+'+c.v);}
  if(c.heal){php=Math.min(PMAX,php+c.heal);parts.push('♥+'+c.heal);}
  if(c.e){energy+=c.e;parts.push('+'+c.e);}
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
  }else if(mv[0]==='b'){e.block+=mv[1];say2(e.n+' defendeu +'+mv[1]+'.');H.sfx('tick');}
  else{e.str+=mv[1];say2(e.n+' fortaleceu +'+mv[1]+'!');H.sfx('bad');}
  if(php<=0){php=0;paint();gameOver(false);return;}
  phase='fight';
  sched(startTurn,650);
}
function victory(){
  kills++;
  say2(''+e.n+' derrotado!');
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
  H.done(win?{win:true,score:sc,title:'Dragão derrotado!',sub:'Masmorra limpa · '+deck.length+' cartas · '+php+'♥ restantes.'}
    :{win:false,score:sc,title:'Você caiu na sala '+(node+1)+'!',sub:kills+' vitórias · o Dragão aguarda outra run.'});
}
function bar(cur,max,w){
  const p=Math.max(0,cur)/max;
  return'<span style="display:inline-block;width:'+w+'px;height:10px;background:#D8D5CC"><span style="display:inline-block;width:'+(p*w|0)+'px;height:10px;background:'+(p>.35?'#3E7C4F':'#B23A24')+'"></span></span>';
}
function paint(){
  status();
  if(phase==='fight'||phase==='foe'){
    foeBox.innerHTML=(e.boss?'[CHEFE] ':'')+'<b>'+e.n+'</b> '+bar(e.hp,e.max,120)+' '+Math.max(0,e.hp)+'/'+e.max+'♥'+(e.block?' BLOQ+'+e.block:'')+(e.str?' FORÇA+'+e.str:'')+(e.vuln?' VULN'+e.vuln:'')+'<br><i>'+intent()+'</i>';
    meBox.innerHTML='<b>Você</b> '+bar(php,PMAX,120)+' '+php+'/'+PMAX+'♥'+(pb?' BLOQ+'+pb:'')+(ps?' FORÇA+'+ps:'')+' · energia '+energy+' · comp:'+drawP.length+' desc:'+disc.length;
    hrow.innerHTML='';
    hand.forEach((k,i)=>{
      const c=CARDS[k],ok=phase==='fight'&&energy>=c.c;
      const b=H.el('button','g-card'+(ok?' hot':''),cardDesc(k),hrow);
      b.style.minWidth='108px';b.style.fontSize='12px';
      if(ok)b.addEventListener('click',()=>playCard(i));
    });
    brow.innerHTML='';
    if(phase==='fight')H.btn(brow,'Encerrar turno',endTurn,true);
    H.btn(brow,'Deck ('+deck.length+')',()=>{showDeck=!showDeck;paint();},false);
  }else if(phase==='reward'){
    foeBox.innerHTML='<b>Sala limpa!</b> Escolha 1 carta (ou pule e cure 6):';
    meBox.innerHTML=''+php+'/'+PMAX+'♥ · deck com '+deck.length+' cartas';
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
    H.btn(brow,'Pular (+6♥)',()=>{
      if(over||phase!=='reward')return;
      php=Math.min(PMAX,php+6);say2('Descansou: +6♥.');
      startCombat();
    },false);
  }else if(phase==='rest'){
    const f=FOES[node];
    foeBox.innerHTML='<b>Fogueira!</b> Descanse e recupere '+f.heal+' de vida.';
    meBox.innerHTML=''+php+'/'+PMAX+'♥';
    hrow.innerHTML='';brow.innerHTML='';
    H.btn(brow,'Descansar (+'+f.heal+'♥)',()=>{
      if(over||phase!=='rest')return;
      php=Math.min(PMAX,php+f.heal);
      say2('Descanso: +'+f.heal+'♥.');
      node++;startCombat();
    },true);
  }
  logBox.innerHTML='<span style="font-size:12px">'+(log.join('<br>')||'…')+'</span>';
  if(showDeck){
    const cnt={};
    deck.forEach(k=>cnt[k]=(cnt[k]||0)+1);
    deckBox.innerHTML='<span style="font-size:12px"> '+Object.keys(cnt).map(k=>CARDS[k].n+'×'+cnt[k]).join(' · ')+'</span>';
  }else deckBox.innerHTML='';
}
deck=['golpe','golpe','golpe','golpe','golpe','golpe','guarda','guarda','guarda','guarda'];
startCombat();
}});
