/* NCODE N · 254 Dominó — combine as pontas e bata primeiro! */
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
    if(bone.length)H.btn(brow,'Comprar ('+bone.length+' no monte)',humanDraw,true);
    else{H.btn(brow,'Passar (sem pedras)',humanPass,true);}
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
    msg=(w===0?'VOCÊ BATEU! +'+pts+' pts.':'CPU bateu! +'+pts+' para ela.');
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
  H.done(win?{win:true,score:scf,title:'Dominó vencido!',sub:sc[0]+' × '+sc[1]+' · '+dominos[0]+' batidas.'}
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
  if(chain.length){const{L,R}=ends();x.fillText('←'+L+'   ·   '+R+'→',20,240);}
  x.fillStyle=H.C.ink;x.font='bold 15px system-ui';
  x.fillText('Você: '+hand.length+' pedras ('+handPips(hand)+' pts)',14,274);
  x.fillText('CPU: '+ai.length+' pedras · Monte: '+bone.length,14,296);
  x.fillStyle=H.C.ink2;x.font='13px system-ui';
  x.fillText('Placar: '+sc[0]+' × '+sc[1]+' (meta '+TARGET+') · Batidas: '+dominos[0]+' × '+dominos[1],14,318);
});
deal();
}});
