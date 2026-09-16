#!/usr/bin/env python3
"""Gera games/g259..g260 — Paciência Aranha e Castelo de Cartas. Edicao caprichada."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 259 — Paciência Aranha
GAMES[259] = r"""/* NCODE N · 259 Paciência Aranha — limpe as 8 sequências! */
GREG(259,{
init(root,H){
const RL={1:'A',11:'J',12:'Q',13:'K'};
function rn(r){return RL[r]||String(r);}
let over=false,cols=[],stock=[],sel=null,moves=0,score=500,seqs=0,seq=0;
let msg='Monte sequências descendentes K→A! Coluna vazia aceita qualquer carta.',hintM=null,hintT=0;
const hud=H.hud(root,[['sq','SEQUÊNCIAS','0/8'],['mv','LANCES',0],['pt','PONTOS',500],['st','MONTE',50]]);
const say=H.msg(root,'Aranha 1 naipe! Toque numa carta para selecionar a sequência e toque na coluna destino. Complete K→A para limpar. Completar 8 vence!');
const board=H.el('div','g-row',null,root);
board.style.alignItems='flex-start';
const brow=H.el('div','g-row',null,root);
function status(){hud.set('sq',seqs+'/8');hud.set('mv',moves);hud.set('pt',score);hud.set('st',stock.length);say(msg);}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function deal(){
  const d=[];
  for(let s=0;s<8;s++)for(let r=1;r<=13;r++)d.push({r,up:false});
  shuffle(d);
  cols=[];
  for(let c=0;c<10;c++){
    cols.push([]);
    const n=c<4?6:4;
    for(let k=0;k<n;k++)cols[c].push(d.pop());
    cols[c][cols[c].length-1].up=true;
  }
  stock=d;
}
function runValid(c,i){
  const col=cols[c];
  if(i<0||i>=col.length||!col[i].up)return false;
  for(let k=i;k<col.length-1;k++)if(col[k].r!==col[k+1].r+1)return false;
  return true;
}
function canPlace(t,runFrom,runCard){
  const col=cols[t];
  if(!col.length){
    // mover coluna inteira para outro vazio é inútil
    if(runFrom!=null&&cols[runFrom].length>0&&sel!=null&&sel.i===0)return false;
    return true;
  }
  const top=col[col.length-1];
  return top.up&&top.r===runCard+1;
}
function clickCard(c,i){
  if(over)return;
  hintM=null;
  if(sel){
    if(sel.c===c&&sel.i===i){sel=null;H.sfx('tick');paint();return;}
    if(c!==sel.c){
      const run=cols[sel.c].slice(sel.i);
      if(canPlace(c,sel.c,run[0].r)){
        cols[sel.c]=cols[sel.c].slice(0,sel.i);
        run.forEach(k=>cols[c].push(k));
        const sc=cols[sel.c];
        if(sc.length&&!sc[sc.length-1].up)sc[sc.length-1].up=true;
        sel=null;moves++;score--;H.sfx('tick');
        msg='Boa! '+moves+' lances.';
        checkComplete(c);paint();
        if(!over&&stock.length===0&&!legalMoves())gameOver(false);
        else status();
        return;
      }
    }
    sel=null;
  }
  if(runValid(c,i)){sel={c,i};H.sfx('tick');}
  else if(cols[c][i]&&cols[c][i].up){H.sfx('bad');msg='Só dá para mover sequência descendente revelada!';status();}
  paint();
}
function checkComplete(c){
  const col=cols[c];
  if(col.length<13)return;
  const top=col.slice(col.length-13);
  for(let k=0;k<13;k++){
    if(!top[k].up||top[k].r!==13-k)return;
  }
  cols[c]=col.slice(0,col.length-13);
  const nc=cols[c];
  if(nc.length&&!nc[nc.length-1].up)nc[nc.length-1].up=true;
  seqs++;score+=100;
  H.sfx('ok');
  msg='✨ Sequência K→A completa! +100 ('+seqs+'/8)';
  if(seqs>=8){paint();gameOver(true);}
}
function legalMoves(){
  for(let c=0;c<10;c++){
    for(let i=0;i<cols[c].length;i++){
      if(!runValid(c,i))continue;
      for(let t=0;t<10;t++){
        if(t===c)continue;
        const save=sel;sel={c,i};
        const ok=canPlace(t,c,cols[c][i].r);
        sel=save;
        if(ok)return{c,i,t};
      }
    }
  }
  return null;
}
function dealRow(){
  if(over)return;
  hintM=null;
  if(!stock.length){H.sfx('bad');msg='Monte vazio!';status();return;}
  if(cols.some(c=>!c.length)){H.sfx('bad');msg='Preencha as colunas vazias antes de distribuir!';status();return;}
  for(let c=0;c<10;c++){const k=stock.pop();k.up=true;cols[c].push(k);}
  moves++;score--;H.sfx('tick');
  msg='Nova fileira! ('+stock.length+' restantes)';
  for(let c=0;c<10;c++){checkComplete(c);if(over)return;}
  paint();status();
}
function hint(){
  if(over)return;
  const m=legalMoves();
  if(m){hintM=m;hintT=6;msg='💡 Tente mover a sequência de '+rn(cols[m.c][m.i].r)+' para a coluna '+(m.t+1)+'.';H.sfx('tick');}
  else{msg=stock.length?'Sem jogadas — distribua!':'Sem jogadas e sem monte!';H.sfx('bad');}
  status();
}
function gameOver(win){
  over=true;
  score=Math.max(0,score+(win?Math.max(0,800-moves):0));
  H.score(score);
  H.done(win?{win:true,score,title:'🕷️ Aranha vencida!',sub:'8 sequências · '+moves+' lances · '+score+' pontos.'}
    :{win:false,score,title:'Teia travada!',sub:seqs+'/8 sequências · '+moves+' lances · revele cartas cedo!'});
}
function paint(){
  board.innerHTML='';
  cols.forEach((col,c)=>{
    const cd=H.el('div','g-col',null,board);
    cd.style.minWidth='46px';cd.style.gap='0';
    if(!col.length){
      const s=H.el('button','g-cell','＋',cd);
      s.style.minHeight='60px';s.style.opacity='.5';
      s.addEventListener('click',()=>clickEmpty(c));
    }
    col.forEach((k,i)=>{
      const inSel=sel&&sel.c===c&&i>=sel.i;
      const inHint=hintM&&((hintM.c===c&&i>=hintM.i)||(hintM.t===c&&i===col.length-1))&&hintT>0;
      const b=H.el('button','g-chip',k.up?rn(k.r)+'♠':'▓▓',cd);
      b.style.fontSize='12px';b.style.padding='3px 2px';
      if(!k.up){b.style.background='#D94E34';b.style.color='#FAF7F0';b.style.minHeight='14px';}
      else b.style.minHeight='30px';
      if(inSel)b.style.outline='3px solid #E8A33D';
      if(inHint)b.style.outline='3px solid #C4D645';
      b.addEventListener('click',()=>clickCard(c,i));
    });
  });
  brow.innerHTML='';
  const sb=H.btn(brow,'🃏 Distribuir ('+stock.length+')',dealRow,false);
  if(!stock.length)sb.disabled=true;
  H.btn(brow,'💡 Dica',hint,false);
}
function clickEmpty(c){
  if(over||!sel||sel.c===c)return;
  clickCard(c,cols[c].length);
}
H.every(500,()=>{
  if(hintT>0){hintT-=.5;if(hintT<=0){hintM=null;paint();}}
});
deal();paint();status();
}});"""

# 260 — Castelo de Cartas
GAMES[260] = r"""/* NCODE N · 260 Castelo de Cartas — erga 8 andares sem cair! */
GREG(260,{
init(root,H){
const WINLVL=8,CX=240,BASEY=408,LH=44;
let over=false,seq=0,level=0,cards=0,score=0,perfects=0,stab=100;
let ang=0,vel=0,wind=0,gust=0,gustT=0,phase=0,fall=0,fallT=0,fallDir=1;
let slot=0,best=0,msg='Trave o marcador no VERDE para firmar a carta!';
let placed=[];
const hud=H.hud(root,[['lv','ANDAR','0/8'],['ct','CARTAS',0],['es','ESTABILIDADE',100],['rc','RECORDE',0]]);
const say=H.msg(root,'Cada andar = 2 cartas inclinadas + 1 teto! Trave o marcador no centro verde. Cuidado com o vento! Chegue ao 8º andar.');
const o=H.cvs(root,480,540),x=o.x;
H.btn(root,'🂠 Soltar carta (Espaço)',drop,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==='Space')drop();});
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function status(){hud.set('lv',level+'/'+WINLVL);hud.set('ct',cards);hud.set('es',Math.max(0,stab|0));hud.set('rc',best);say(msg);}
function marker(){return Math.max(-1,Math.min(1,Math.sin(phase)+wind*.12));}
function drop(){
  if(over||fall)return;
  const m=marker(),a=Math.abs(m);
  const wgt=1+level*.14;
  if(a<.12){perfects++;score+=25;stab=Math.min(100,stab+1);msg='✨ PERFEITO! +25';H.sfx('ok');}
  else{stab-=(4+16*a)*wgt;score+=10;msg=a<.4?'Boa! (+10)':'Torto! ('+(a<.7?'instável':'PERIGO')+')';H.sfx(a<.4?'tick':'bad');}
  placed.push({lvl:level,slot,off:m});
  cards++;slot++;
  if(stab<=0){stab=0;startFall();status();return;}
  if(slot>=3){
    slot=0;level++;score+=50;
    gust=(Math.random()*2-1)*(0.6+level*0.18);gustT=3;
    msg+=' — 🏰 '+level+'º andar! Rajada '+(gust>0?'▶':'◀')+'!';
    H.sfx('ok');
    if(level>=WINLVL){gameOver(true);return;}
  }
  if(score>best)best=score;
  status();
}
function startFall(){
  if(fall)return;
  fall=1;fallT=0;fallDir=ang>=0?1:-1;
  msg='🌪️ ESTÁ CAINDO!';
  H.sfx('bad');
}
function gameOver(win){
  over=true;seq++;
  if(score>best)best=score;
  H.score(score);
  H.done(win?{win:true,score,title:'🏰 Castelo pronto!',sub:'8 andares · '+cards+' cartas · '+perfects+' perfeitas · recorde '+best+'.'}
    :{win:false,score,title:'Desmoronou!',sub:level+' andares · '+cards+' cartas · recorde '+best+' · mire o verde!'});
}
function rcard(px,py,w,h,rot,roof){
  x.save();x.translate(px,py);x.rotate(rot);
  x.fillStyle='#FAF7F0';x.strokeStyle='#181816';x.lineWidth=2;
  x.beginPath();x.rect(-w/2,-h/2,w,h);x.fill();x.stroke();
  x.fillStyle=roof?'#D94E34':'#2E6E8A';
  x.font='bold '+(roof?10:13)+'px system-ui';x.textAlign='center';x.textBaseline='middle';
  x.fillText(roof?'▲':'♦',0,1);
  x.restore();
}
H.loop(dt=>{
  if(!over&&!fall){
    phase+=dt*(2.2+level*.35);
    if(gustT>0)gustT-=dt;else gust*=.98;
    const base=Math.sin(phase*.23)*(.3+level*.12);
    wind=base+gust;
    const k=3.2*(stab/100)+.4;
    vel+=(-k*ang-.7*vel+wind*.09)*dt;
    vel+=(Math.random()-.5)*dt*(100-stab)/100*4;
    ang+=vel*dt;
    if(Math.abs(ang)>.45||stab<=0)startFall();
  }
  if(fall&&!over){
    fallT+=dt;
    ang+=fallDir*dt*1.6;
    if(fallT>1.3){gameOver(false);return;}
  }
  // cenário
  x.fillStyle='#EFE9DB';x.fillRect(0,0,o.W,o.H);
  x.fillStyle='#E4DCCB';
  x.beginPath();x.arc(90,80,34,0,7);x.arc(130,70,26,0,7);x.arc(390,60,30,0,7);x.arc(425,72,22,0,7);x.fill();
  x.fillStyle='#8A6A2F';x.fillRect(0,BASEY+54,o.W,o.H-BASEY-54);
  x.fillStyle='#6E5323';x.fillRect(0,BASEY+54,o.W,6);
  // vento
  x.textAlign='left';x.textBaseline='alphabetic';
  x.fillStyle=H.C.ink2;x.font='bold 15px system-ui';
  const wa=Math.abs(wind);
  x.fillText('Vento: '+(wa<.25?'calmo ~':(wind>0?'▶':'◀').repeat(Math.min(3,1+(wa|0)))+' '+wa.toFixed(1)),14,28);
  if(gustT>0){x.fillStyle='#B23A24';x.fillText('🌪️ RAJADA!',330,28);}
  // torre
  x.save();x.translate(CX,BASEY+54);x.rotate(fall?0:ang);
  if(fall)x.rotate((fallT*fallDir*1.2));
  x.strokeStyle='#181816';x.lineWidth=2;
  for(const p of placed){
    const y=-p.lvl*LH-22,wdt=118-p.lvl*5;
    const fade=fall?Math.max(0,1-fallT*.7):1;
    x.globalAlpha=fade;
    x.save();x.translate(0,y);
    if(p.slot===0){rcard(-wdt/4,0,20,42,.24+p.off*.18,false);}
    else if(p.slot===1){rcard(wdt/4,0,20,42,-.24+p.off*.18,false);}
    else{rcard(0,-LH/2+2,wdt/2+26,14,p.off*.1,true);}
    x.restore();
  }
  x.globalAlpha=1;
  // fantasma da próxima carta
  if(!over&&!fall){
    const wdt=118-level*5;
    x.globalAlpha=.35;x.setLineDash([4,4]);
    x.strokeRect(slot===2?-(wdt/4+13):(slot===0?-wdt/4-10:wdt/4-10),slot===2?-level*LH-LH+10:-level*LH-44,slot===2?wdt/2+26:20,slot===2?14:42);
    x.setLineDash([]);x.globalAlpha=1;
  }
  x.restore();
  // marcador
  const my=452;
  x.fillStyle='#181816';x.fillRect(20,my,440,54);
  x.fillStyle='#3E7C4F';x.fillRect(20+220-26,my+8,52,38);
  x.fillStyle='#E8A33D';x.fillRect(20+220-70,my+8,44,38);x.fillRect(20+220+26,my+8,44,38);
  const m=marker();
  x.fillStyle='#FAF7F0';
  x.beginPath();x.moveTo(240+m*210,my+2);x.lineTo(240+m*210-8,my+16);x.lineTo(240+m*210+8,my+16);x.fill();
  x.fillRect(240+m*210-2,my+16,4,34);
  x.font='bold 12px system-ui';x.textAlign='center';
  x.fillStyle='#FAF7F0';x.fillText(slot===2?'TETO':(slot===0?'CARTA ESQUERDA':'CARTA DIREITA'),240,my+66);
  // estabilidade
  x.textAlign='left';
  x.fillStyle=H.C.ink;x.font='bold 13px system-ui';
  x.fillText('Estabilidade',20,530);
  x.fillStyle='#D8D5CC';x.fillRect(120,520,220,12);
  x.fillStyle=stab>55?'#3E7C4F':stab>25?'#E8A33D':'#B23A24';
  x.fillRect(120,520,220*Math.max(0,stab)/100,12);
  x.fillStyle=H.C.ink;
  x.fillText('Andar '+level+'/'+WINLVL+' · '+score+' pts',348,530);
});
status();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
