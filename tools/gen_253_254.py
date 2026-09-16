#!/usr/bin/env python3
"""Gera games/g253..g254 — Gamão e Dominó. Edicao caprichada."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 253 — Gamão
GAMES[253] = r"""/* NCODE N · 253 Gamão — retire as 15 damas primeiro! */
GREG(253,{
init(root,H){
const YOU=1,AI=2;
// ordem de desenho: fileira de cima e de baixo (esq -> dir)
const TOP=[12,13,14,15,16,17,18,19,20,21,22,23];
const BOT=[11,10,9,8,7,6,5,4,3,2,1,0];
const PX=40,PW=36,PYT=34,PYB=346,PR=15;
function fresh(){
  const pts=[];for(let i=0;i<24;i++)pts.push([0,0]);
  const put=(i,w,n)=>{pts[i]=[w,n];};
  put(23,YOU,2);put(12,YOU,5);put(7,YOU,3);put(5,YOU,5);
  put(0,AI,2);put(11,AI,5);put(16,AI,3);put(18,AI,5);
  return{pts,bar:[0,0,0],off:[0,0,0]};
}
let B=fresh(),over=false,turn=YOU,dice=[],seqs=[],seq=0,plies=0;
let msg='Você (🔴) anda da direita para a esquerda em cima e recolhe embaixo à direita.';
const hud=H.hud(root,[['yo','SUAS FORA','0/15'],['ao','DELE FORA','0/15'],['py','SEUS PIPS',167],['pa','PIPS DELE',167]]);
const say=H.msg(root,'Vença retirando as 15 damas! Dama sozinha (blot) pode ser capturada. Com dama na barra, ela entra primeiro. Dados iguais = 4 lances!');
const o=H.cvs(root,560,400),x=o.x;
const brow=H.el('div','g-row',null,root);
const rollBtn=H.btn(root,'🎲 Rolar dados',doRoll,true);
const opp=w=>3-w;
function clone(b){return{pts:b.pts.map(p=>[p[0],p[1]]),bar:[b.bar[0],b.bar[1],b.bar[2]],off:[b.off[0],b.off[1],b.off[2]]};}
function canLand(b,w,t){return b.pts[t][0]!==opp(w)||b.pts[t][1]<=1;}
function allHome(b,w){
  if(b.bar[w]>0)return false;
  for(let i=0;i<24;i++){
    if(b.pts[i][0]!==w||!b.pts[i][1])continue;
    if(w===YOU&&i>5)return false;
    if(w===AI&&i<18)return false;
  }
  return true;
}
function oneMoves(b,w,d){
  const o=opp(w),out=[];
  if(b.bar[w]>0){
    const t=w===YOU?24-d:d-1;
    if(canLand(b,w,t))out.push({f:-1,t,hit:b.pts[t][0]===o?1:0});
    return out;
  }
  for(let i=0;i<24;i++){
    if(b.pts[i][0]!==w||!b.pts[i][1])continue;
    const t=w===YOU?i-d:i+d;
    if(t>=0&&t<24&&canLand(b,w,t))out.push({f:i,t,hit:b.pts[t][0]===o?1:0});
  }
  if(allHome(b,w)){
    if(w===YOU){
      const e=d-1;
      if(b.pts[e][0]===YOU&&b.pts[e][1])out.push({f:e,t:-2,hit:0});
      else{
        let hi=-1,above=false;
        for(let i=0;i<6;i++)if(b.pts[i][0]===YOU&&b.pts[i][1])hi=i;
        for(let i=e+1;i<6;i++)if(b.pts[i][0]===YOU&&b.pts[i][1])above=true;
        if(hi>=0&&hi<e&&!above)out.push({f:hi,t:-2,hit:0});
      }
    }else{
      const e=24-d;
      if(b.pts[e][0]===AI&&b.pts[e][1])out.push({f:e,t:-2,hit:0});
      else{
        let lo=-1,below=false;
        for(let i=23;i>=18;i--)if(b.pts[i][0]===AI&&b.pts[i][1])lo=i;
        for(let i=18;i<e;i++)if(b.pts[i][0]===AI&&b.pts[i][1])below=true;
        if(lo>=18&&lo>e&&!below)out.push({f:lo,t:-2,hit:0});
      }
    }
  }
  return out;
}
function applyMove(b,w,m){
  const o=opp(w),nb=clone(b);
  if(m.f===-1)nb.bar[w]--;else{nb.pts[m.f][1]--;if(!nb.pts[m.f][1])nb.pts[m.f][0]=0;}
  if(m.t===-2){nb.off[w]++;return nb;}
  if(m.hit){nb.pts[m.t]=[w,1];nb.bar[o]++;}
  else if(nb.pts[m.t][0]===w)nb.pts[m.t][1]++;else nb.pts[m.t]=[w,1];
  return nb;
}
function sig(b){return b.pts.map(p=>p[0]+':'+p[1]).join(',')+'|'+b.bar[1]+','+b.bar[2]+','+b.off[1]+','+b.off[2];}
function genSeqs(b,w,d1,d2){
  const orders=(d1===d2)?[[d1,d1,d1,d1]]:[[d1,d2],[d2,d1]];
  let all=[];
  for(const od of orders){
    let cur=[{b,ms:[]}];
    for(const d of od){
      const nx=[];
      for(const s of cur){
        const opts=oneMoves(s.b,w,d);
        if(!opts.length){nx.push(s);continue;}
        for(const m of opts){m.d=d;nx.push({b:applyMove(s.b,w,m),ms:s.ms.concat([m])});if(nx.length>120)break;}
        if(nx.length>120)break;
      }
      cur=nx;
    }
    all=all.concat(cur);
  }
  let ml=0;all.forEach(s=>{if(s.ms.length>ml)ml=s.ms.length;});
  let best=all.filter(s=>s.ms.length===ml);
  if(ml===1&&d1!==d2){
    const hd=Math.max(d1,d2),only=best.filter(s=>s.ms[0].d===hd);
    if(only.length)best=only;
  }
  const seen={},out=[];
  for(const s of best){const k=sig(s.b);if(!seen[k]){seen[k]=1;out.push(s);}if(out.length>=10)break;}
  return out;
}
function pips(b,w){
  let s=b.bar[w]*25;
  for(let i=0;i<24;i++){
    if(b.pts[i][0]!==w)continue;
    s+=(w===YOU?i+1:24-i)*b.pts[i][1];
  }
  return s;
}
function fmt(m){
  const f=m.f===-1?'barra':(24-m.f),t=m.t===-2?'fora':(24-m.t);
  return f+'→'+t+(m.hit?'✖':'');
}
function status(){
  hud.set('yo',B.off[1]+'/15');hud.set('ao',B.off[2]+'/15');
  hud.set('py',pips(B,1));hud.set('pa',pips(B,2));
  say(msg);
}
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function doRoll(){
  if(over||turn!==YOU||dice.length)return;
  dice=[1+((Math.random()*6)|0),1+((Math.random()*6)|0)];
  H.sfx('tick');
  seqs=genSeqs(B,YOU,dice[0],dice[1]).filter(s=>s.ms.length);
  if(!seqs.length){
    msg='Você tirou '+dice[0]+' e '+dice[1]+': sem lances!';dice=[];status();
    sched(aiTurn,1100);return;
  }
  msg='Você tirou '+dice[0]+' e '+dice[1]+' — escolha o lance:';
  buildBtns();status();
}
function buildBtns(){
  brow.innerHTML='';
  seqs.forEach((s,i)=>{
    const label=s.ms.map(fmt).join('  ·  ');
    H.btn(brow,(i+1)+'. '+label,()=>humanPick(i),i===0);
  });
}
function humanPick(i){
  if(over||turn!==YOU||!dice.length)return;
  if(i<0||i>=seqs.length)return;
  const s=seqs[i];
  msg='Você: '+s.ms.map(fmt).join(' · ');
  B=s.b;dice=[];seqs=[];brow.innerHTML='';
  H.sfx(s.ms.some(m=>m.hit)?'ok':'tick');
  if(B.off[1]>=15){gameOver(true);return;}
  status();sched(aiTurn,800);
}
function aiTurn(){
  if(over)return;
  seq++;turn=AI;plies++;
  if(plies>220){gameOver(B.off[1]-pips(B,1)/50>B.off[2]-pips(B,2)/50);return;}
  dice=[1+((Math.random()*6)|0),1+((Math.random()*6)|0)];
  const opts=genSeqs(B,AI,dice[0],dice[1]).filter(s=>s.ms.length);
  if(!opts.length){
    msg='CPU tirou '+dice[0]+' e '+dice[1]+': sem lances!';dice=[];turn=YOU;status();
    sched(()=>{msg='Sua vez!';status();},900);return;
  }
  let bi=0,bs=-1e9;
  opts.forEach((s,i)=>{
    const hits=s.ms.filter(m=>m.hit).length;
    const offd=s.b.off[2]-B.off[2];
    const pipd=pips(B,AI)-pips(s.b,AI);
    let made=0;
    for(let k=0;k<24;k++)if(s.b.pts[k][0]===AI&&s.b.pts[k][1]>=2&&!(B.pts[k][0]===AI&&B.pts[k][1]>=2))made++;
    const sc=hits*14+offd*16+pipd*.6+made*3+Math.random()*2;
    if(sc>bs){bs=sc;bi=i;}
  });
  const s=opts[bi];
  msg='CPU ('+dice[0]+' e '+dice[1]+'): '+s.ms.map(fmt).join(' · ');
  B=s.b;dice=[];turn=YOU;
  H.sfx(s.ms.some(m=>m.hit)?'bad':'tick');
  if(B.off[2]>=15){gameOver(false);return;}
  status();
}
function gameOver(youWin){
  over=true;seq++;brow.innerHTML='';rollBtn.disabled=true;
  const sc=youWin?400+pips(B,AI)*2:Math.max(20,B.off[1]*15);
  H.score(sc);
  H.done(youWin?{win:true,score:sc,title:'🏆 Gamão vencido!',sub:'15 damas retiradas · '+plies+' rodadas · '+pips(B,AI)+' pips dele restantes.'}
    :{win:false,score:sc,title:'CPU retirou tudo!',sub:'Você tirou '+B.off[1]+'/15 · proteja os blots!'});
}
function colX(k){return PX+k*PW+(k>=6?26:0);}
H.loop(()=>{
  rollBtn.disabled=over||turn!==YOU||dice.length>0;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle='#8A6A2F';x.fillRect(PX-14,PYT-14,12*PW+26+28,PYB-PYT+28);
  x.fillStyle='#EDE8DC';x.fillRect(PX-8,PYT-8,12*PW+26+16,PYB-PYT+16);
  // barra central
  x.fillStyle='#8A6A2F';x.fillRect(PX+6*PW,PYT-8,26,PYB-PYT+16);
  for(let k=0;k<12;k++){
    const cx=colX(k);
    x.fillStyle=k%2?'#D9C9A3':'#B99B5F';
    x.beginPath();x.moveTo(cx,PYT);x.lineTo(cx+PW,PYT);x.lineTo(cx+PW/2,PYT+120);x.fill();
    x.beginPath();x.moveTo(cx,PYB);x.lineTo(cx+PW,PYB);x.lineTo(cx+PW/2,PYB-120);x.fill();
    x.fillStyle=H.C.ink3;x.font='10px system-ui';x.textAlign='center';
    x.fillText(24-TOP[k],cx+PW/2,PYT-11);
    x.fillText(24-BOT[k],cx+PW/2,PYB+13);
  }
  function checker(cx,cy,w,top){
    x.fillStyle='rgba(0,0,0,.15)';x.beginPath();x.ellipse(cx+1,cy+2,PR-2,6,0,0,7);x.fill();
    x.fillStyle=w===YOU?'#D94E34':'#181816';
    x.beginPath();x.arc(cx,cy,PR,0,7);x.fill();
    x.strokeStyle=w===YOU?'#FAF7F0':H.C.gold;x.lineWidth=2;x.stroke();
    x.strokeStyle=w===YOU?'rgba(255,255,255,.5)':'rgba(255,255,255,.25)';x.lineWidth=1;
    x.beginPath();x.arc(cx,cy,PR-5,0,7);x.stroke();
  }
  for(let k=0;k<12;k++){
    const cx=colX(k)+PW/2;
    [[TOP[k],1],[BOT[k],-1]].forEach(pair=>{
      const i=pair[0],dir=pair[1];
      const st=B.pts[i];
      if(!st[1])return;
      const n=Math.min(st[1],5);
      for(let j=0;j<n;j++){
        const cy=dir===1?PYT+PR+4+j*(PR*2+2):PYB-PR-4-j*(PR*2+2);
        checker(cx,cy,st[0],dir===1);
      }
      if(st[1]>5){
        const cy=dir===1?PYT+PR+4+5*(PR*2+2):PYB-PR-4-5*(PR*2+2);
        x.fillStyle=H.C.ink;x.font='bold 12px system-ui';x.textAlign='center';x.fillText('+'+(st[1]-5),cx,cy);
      }
    });
  }
  // barra
  const bx=PX+6*PW+13;
  for(let j=0;j<B.bar[1];j++)checker(bx,300-j*20,YOU);
  for(let j=0;j<B.bar[2];j++)checker(bx,100+j*20,AI);
  x.fillStyle=H.C.paper;x.font='bold 11px system-ui';x.textAlign='center';
  x.fillText('BAR',bx,208);
  // bandejas de retiradas
  x.fillStyle=H.C.ink2;x.font='bold 12px system-ui';
  x.fillText('FORA',528,196);
  for(let j=0;j<B.off[1];j++){x.fillStyle='#D94E34';x.fillRect(516,300-Math.ceil((j+1)/3)*12+((j%3)*10),8,10);}
  for(let j=0;j<B.off[2];j++){x.fillStyle='#181816';x.fillRect(516,88+Math.ceil((j+1)/3)*12-((j%3)*10),8,10);}
  // dados + turno
  x.fillStyle=turn===YOU?'#D94E34':'#181816';
  x.font='bold 15px system-ui';x.textAlign='left';
  x.fillText(turn===YOU?'SUA VEZ':'VEZ DA CPU',14,392);
  x.textAlign='right';
  x.fillText(dice.length?'🎲 '+dice[0]+'  '+dice[1]:'🎲 —',546,392);
  x.textAlign='left';
});
status();
}});"""

# 254 — Dominó
GAMES[254] = r"""/* NCODE N · 254 Dominó — combine as pontas e bata primeiro! */
GREG(254,{
init(root,H){
const TARGET=60;
let over=false,hand=[],ai=[],bone=[],chain=[],turn=0,seq=0,round=1;
let sc=[0,0],dominos=[0,0],passes=0;
let msg='Boa pedra!';
const PIPS={0:[],1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]]};
const hud=H.hud(root,[['r','RODADA',1],['vc','VOCÊ',0],['cp','CPU',0],['mt','META',TARGET]]);
const say=H.msg(root,'Combine uma ponta da mesa! Sem pedra? Compre do monte. Bata (mão vazia) ou feche com menos pontos. Primeiro aos '+TARGET+'!');
const o=H.cvs(root,480,330),x=o.x;
const brow=H.el('div','g-row',null,root);
const hrow=H.el('div','g-row',null,root);
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function pips(t){return t.a+t.b;}
function handPips(h){let s=0;h.forEach(t=>s+=pips(t));return s;}
function status(){
  hud.set('r',round);hud.set('vc',sc[0]);hud.set('cp',sc[1]);
  say(msg);
}
function deal(){
  const all=[];
  for(let a=0;a<=6;a++)for(let b=a;b<=6;b++)all.push({a,b});
  for(let i=all.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=all[i];all[i]=all[j];all[j]=t;}
  hand=all.slice(0,7);ai=all.slice(7,14);bone=all.slice(14);
  hand.sort((p,q)=>pips(q)-pips(p));ai.sort((p,q)=>pips(q)-pips(p));
  chain=[];passes=0;
  // quem sai: maior carroça, senão maior pedra
  let bk=-1,bt=null,bw=0;
  [[hand,0],[ai,1]].forEach(pair=>{
    pair[0].forEach((t,i)=>{
      const k=(t.a===t.b?100+t.a:pips(t));
      if(k>bk){bk=k;bt=i;bw=pair[1];}
    });
  });
  const first=(bw===0?hand:ai).splice(bt,1)[0];
  chain.push({l:first.a,r:first.b});
  turn=1-bw;
  msg=(bw===0?'Você saiu de ['+first.a+'|'+first.b+']!':'CPU saiu de ['+first.a+'|'+first.b+'].')+' Vez de '+(turn===0?'você.':'CPU.');
  paintHand();refresh();
  status();
  if(turn===1)sched(aiTurn,1000);
}
function ends(){return{L:chain[0].l,R:chain[chain.length-1].r};}
function options(h){
  const{L,R}=ends(),out=[];
  h.forEach((t,i)=>{
    if(t.a===L||t.b===L)out.push({i,side:-1,t});
    if(t.a===R||t.b===R)out.push({i,side:1,t});
  });
  return out;
}
function place(who,i,side){
  const h=who===0?hand:ai;
  if(i<0||i>=h.length)return false;
  const t=h[i],{L,R}=ends();
  if(side<0){
    if(t.a!==L&&t.b!==L)return false;
    chain.unshift(t.b===L?{l:t.a,r:t.b}:{l:t.b,r:t.a});
  }else{
    if(t.a!==R&&t.b!==R)return false;
    chain.push(t.a===R?{l:t.a,r:t.b}:{l:t.b,r:t.a});
  }
  h.splice(i,1);passes=0;
  H.sfx('tick');
  return true;
}
function refresh(){
  brow.innerHTML='';
  if(over||turn!==0)return;
  const opts=options(hand);
  opts.forEach(op=>{
    const tag=op.side<0?'◀ ['+op.t.a+'|'+op.t.b+']':'['+op.t.a+'|'+op.t.b+'] ▶';
    H.btn(brow,tag,()=>humanPlay(op.i,op.side),false);
  });
  if(!opts.length){
    if(bone.length)H.btn(brow,'🎲 Comprar ('+bone.length+' no monte)',humanDraw,true);
    else{H.btn(brow,'⏭️ Passar (sem pedras)',humanPass,true);}
  }
}
function paintHand(){
  hrow.innerHTML='';
  hand.forEach(t=>{
    const d=H.el('div','g-chip','['+t.a+'|'+t.b+']',hrow);
    d.style.fontSize='15px';
  });
}
function humanPlay(i,side){
  if(over||turn!==0)return;
  if(!place(0,i,side)){H.sfx('bad');return;}
  msg='Você jogou '+(side<0?'na esquerda.':'na direita.');
  paintHand();
  if(!hand.length){endRound(0,'batida');return;}
  turn=1;refresh();status();
  sched(aiTurn,900);
}
function humanDraw(){
  if(over||turn!==0||!bone.length)return;
  hand.push(bone.pop());
  hand.sort((p,q)=>pips(q)-pips(p));
  H.sfx('tick');paintHand();
  if(!options(hand).length&&bone.length){msg='Comprou… ainda sem jogo ('+bone.length+' restantes).';status();return;}
  if(!options(hand).length){msg='Monte vazio e sem jogo: passe a vez.';}
  else msg='Comprou e achou jogo!';
  refresh();status();
}
function humanPass(){
  if(over||turn!==0)return;
  if(options(hand).length||bone.length){H.sfx('bad');return;}
  passes++;msg='Você passou.';turn=1;refresh();status();
  sched(aiTurn,800);
}
function aiTurn(){
  if(over||turn!==1)return;
  let opts=options(ai);
  let guard=0;
  while(!opts.length&&bone.length&&guard++<20){ai.push(bone.pop());opts=options(ai);}
  if(!opts.length){
    passes++;
    msg='CPU passou.'+(passes>=2?' Mesa fechada!':'');
    H.sfx('bad');
    if(passes>=2){endRound(-1,'fechada');return;}
    turn=0;refresh();status();return;
  }
  opts.sort((p,q)=>pips(q.t)-pips(p.t));
  const best=opts[0];
  place(1,best.i,best.side);
  msg='CPU jogou ['+best.t.a+'|'+best.t.b+'] '+(best.side<0?'na esquerda.':'na direita.');
  if(!ai.length){endRound(1,'batida');return;}
  turn=0;refresh();status();
}
function endRound(w,how){
  seq++;
  const hp=handPips(hand),ap=handPips(ai);
  if(how==='batida'){
    const pts=w===0?ap:hp;
    sc[w]+=pts;dominos[w]++;
    msg=(w===0?'🎉 VOCÊ BATEU! +'+pts+' pts.':'CPU bateu! +'+pts+' para ela.');
  }else{
    if(hp===ap){msg='Mesa fechada em empate ('+hp+' × '+ap+'): ninguém pontua.';}
    else if(hp<ap){sc[0]+=ap-hp;msg='Mesa fechada! Você tinha menos ('+hp+' × '+ap+'): +'+(ap-hp)+'!';}
    else{sc[1]+=hp-ap;msg='Mesa fechada! CPU tinha menos ('+hp+' × '+ap+'): +'+(hp-ap)+' para ela.';}
  }
  H.sfx(w===0||(how==='fechada'&&hp<ap)?'ok':'bad');
  status();
  if(sc[0]>=TARGET||sc[1]>=TARGET){sched(()=>gameOver(),1400);return;}
  round++;
  sched(()=>{msg='Rodada '+round+'!';deal();},2200);
}
function gameOver(){
  over=true;seq++;brow.innerHTML='';
  const win=sc[0]>=TARGET&&sc[0]>sc[1];
  const scf=sc[0]*5+dominos[0]*30;
  H.score(scf);
  H.done(win?{win:true,score:scf,title:'🏆 Dominó vencido!',sub:sc[0]+' × '+sc[1]+' · '+dominos[0]+' batidas.'}
    :{win:false,score:scf,title:'CPU fez '+TARGET+'!',sub:sc[0]+' × '+sc[1]+' · guarde as carroças!'});
}
function tile2(cx,cy,a,b,horiz){
  const w=horiz?46:26,h=horiz?26:46;
  x.fillStyle='#FAF7F0';x.strokeStyle='#181816';x.lineWidth=2;
  x.beginPath();x.rect(cx-w/2,cy-h/2,w,h);x.fill();x.stroke();
  x.strokeStyle=H.C.cement;x.lineWidth=1;
  x.beginPath();
  if(horiz){x.moveTo(cx,cy-h/2);x.lineTo(cx,cy+h/2);}else{x.moveTo(cx-w/2,cy);x.lineTo(cx+w/2,cy);}
  x.stroke();
  [[a,-1],[b,1]].forEach(pair=>{
    const v=pair[0],s=pair[1];
    const ox=horiz?s*11.5:0,oy=horiz?0:s*11.5;
    x.fillStyle='#181816';
    PIPS[v].forEach(p=>{x.beginPath();x.arc(cx+ox+p[0]*5.5,cy+oy+p[1]*5.5,2.4,0,7);x.fill();});
  });
}
H.loop(()=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle='#3E7C4F';x.fillRect(8,8,o.W-16,242);
  x.strokeStyle='#8A6A2F';x.lineWidth=4;x.strokeRect(8,8,o.W-16,242);
  const n=chain.length,per=9;
  for(let i=0;i<n;i++){
    const r=(i/per)|0,c=i%per;
    const cx=44+c*44,cy=52+r*62;
    tile2(cx,cy,chain[i].l,chain[i].r,true);
  }
  x.fillStyle=H.C.paper;x.font='bold 13px system-ui';x.textAlign='left';
  if(chain.length){const{L,R}=ends();x.fillText('⬅ '+L+'   ·   '+R+' ➡',20,240);}
  x.fillStyle=H.C.ink;x.font='bold 15px system-ui';
  x.fillText('Você: '+hand.length+' pedras ('+handPips(hand)+' pts)',14,274);
  x.fillText('CPU: '+ai.length+' pedras · Monte: '+bone.length,14,296);
  x.fillStyle=H.C.ink2;x.font='13px system-ui';
  x.fillText('Placar: '+sc[0]+' × '+sc[1]+' (meta '+TARGET+') · Batidas: '+dominos[0]+' × '+dominos[1],14,318);
});
deal();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
