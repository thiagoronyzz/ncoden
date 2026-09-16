#!/usr/bin/env python3
"""Gera games/g251..g252 — CARTAS & TABULEIRO (parte 3). Edicao caprichada."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 251 — Ludo
GAMES[251] = r"""/* NCODE N · 251 Ludo — leve os 4 peões para casa! */
GREG(251,{
init(root,H){
const CS=32;
const TRACK=[[6,0],[6,1],[6,2],[6,3],[6,4],[6,5],[5,6],[4,6],[3,6],[2,6],[1,6],[0,6],[0,7],[0,8],[1,8],[2,8],[3,8],[4,8],[5,8],[6,9],[6,10],[6,11],[6,12],[6,13],[6,14],[7,14],[8,14],[8,13],[8,12],[8,11],[8,10],[8,9],[9,8],[10,8],[11,8],[12,8],[13,8],[14,8],[14,7],[14,6],[13,6],[12,6],[11,6],[10,6],[9,6],[8,5],[8,4],[8,3],[8,2],[8,1],[8,0],[7,0]];
const HOME=[[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]],[[1,7],[2,7],[3,7],[4,7],[5,7],[6,7]],[[7,13],[7,12],[7,11],[7,10],[7,9],[7,8]],[[13,7],[12,7],[11,7],[10,7],[9,7],[8,7]]];
const BASE=[[[1.5,1.5],[1.5,3.5],[3.5,1.5],[3.5,3.5]],[[1.5,10.5],[1.5,12.5],[3.5,10.5],[3.5,12.5]],[[10.5,10.5],[10.5,12.5],[12.5,10.5],[12.5,12.5]],[[10.5,1.5],[10.5,3.5],[12.5,1.5],[12.5,3.5]]];
const START=[0,13,26,39];
const SAFE={0:1,8:1,13:1,21:1,26:1,34:1,39:1,47:1};
const COL=['#D94E34','#2E6E8A','#C98A1B','#3E7C4F'];
const TINT=['rgba(217,78,52,.22)','rgba(46,110,138,.20)','rgba(201,138,27,.26)','rgba(62,124,79,.22)'];
const NAME=['Você','Azul','Ouro','Verde'];
const OFF=[[-7,-7],[7,-7],[-7,7],[7,7],[0,-10],[0,10],[-10,0],[10,0]];
const PIP={1:[4],2:[0,8],3:[0,4,8],4:[0,2,6,8],5:[0,2,4,6,8],6:[0,2,3,5,6,8]};
let over=false,pos=[[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1],[-1,-1,-1,-1]];
let turn=0,dice=0,phase='roll',mov=[],seq=0,moves=0,rollT=0;
let caps=[0,0,0,0],fin=[0,0,0,0],msg='Boa sorte! Tire 6 para sair da base.';
const hud=H.hud(root,[['t','TURNO','Você'],['d','DADO','—'],['casa','EM CASA','0/4'],['cap','CAPTURAS',0]]);
const say=H.msg(root,'Tire 6 para sair da base! Casas ⭐ são seguras. Capturar e guardar peão dão jogada extra. Guarde os 4 para vencer!');
const o=H.cvs(root,480,480),x=o.x;
const d2=H.cvs(root,480,84),x2=d2.x;
const brow=H.el('div','g-row',null,root);
const rollBtn=H.btn(root,'🎲 Rolar dado',doRoll,true);
const Z=[];
for(let r=0;r<15;r++){Z.push([]);for(let c=0;c<15;c++)Z[r].push('w');}
TRACK.forEach(rc=>{Z[rc[0]][rc[1]]='t';});
for(let p=0;p<4;p++)HOME[p].forEach(rc=>{Z[rc[0]][rc[1]]='h'+p;});
for(let r=0;r<6;r++)for(let c=0;c<6;c++)Z[r][c]='b0';
for(let r=0;r<6;r++)for(let c=9;c<15;c++)Z[r][c]='b1';
for(let r=9;r<15;r++)for(let c=9;c<15;c++)Z[r][c]='b2';
for(let r=9;r<15;r++)for(let c=0;c<6;c++)Z[r][c]='b3';
for(let r=6;r<9;r++)for(let c=6;c<9;c++)Z[r][c]='ct';
const STARTC={};START.forEach((g,p)=>{STARTC[TRACK[g][0]+','+TRACK[g][1]]=p;});
const STARC={};[8,21,34,47].forEach(g=>{STARC[TRACK[g][0]+','+TRACK[g][1]]=1;});
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function pawnCell(p,i){
  const v=pos[p][i];
  if(v<0)return{r:BASE[p][i][0],c:BASE[p][i][1]};
  if(v<=50){const g=(START[p]+v)%52;return{r:TRACK[g][0]+.5,c:TRACK[g][1]+.5,g};}
  if(v<=56)return{r:HOME[p][v-51][0]+.5,c:HOME[p][v-51][1]+.5};
  return{r:6.6+((p%2)*.55)+((i>1)?.3:0),c:6.6+(((p/2)|0)*.55)+((i%2)?.3:0)};
}
function movable(p,d){
  const out=[];
  for(let i=0;i<4;i++){
    const v=pos[p][i];
    if(v<0){if(d===6)out.push(i);continue;}
    if(v>=57||v+d>57)continue;
    out.push(i);
  }
  return out;
}
function status(){
  hud.set('t',NAME[turn]);hud.set('d',dice||'—');
  hud.set('casa',fin[0]+'/4');hud.set('cap',caps[0]);
  say(msg);
}
function doRoll(){
  if(over||turn!==0||phase!=='roll')return;
  phase='dice';rollT=.8;H.sfx('tick');
  sched(()=>{dice=1+((Math.random()*6)|0);rollT=0;resolveRoll(0);},820);
}
function aiTurn(){
  if(over||turn===0||phase!=='roll')return;
  phase='dice';rollT=.7;H.sfx('tick');
  const p=turn;
  sched(()=>{dice=1+((Math.random()*6)|0);rollT=0;resolveRoll(p);},720);
}
function resolveRoll(p){
  mov=movable(p,dice);
  if(!mov.length){
    msg=(p===0?'Você tirou '+dice+' e passou.':NAME[p]+' tirou '+dice+' e passou.');
    H.sfx('bad');status();
    sched(nextTurn,900);return;
  }
  if(p===0){phase='move';msg='Tirou '+dice+'! Toque num peão com anel dourado ou use os botões.';buildBtns();}
  else applyMove(p,aiPick(p,dice,mov),dice);
  status();
}
function buildBtns(){
  brow.innerHTML='';
  mov.forEach(i=>{
    const v=pos[0][i];
    const hint=v<0?'sair da base':(v+dice>=57?'GUARDAR!':'+'+dice+' casas');
    H.btn(brow,'Peão '+(i+1)+' ('+hint+')',()=>humanMove(i),false);
  });
}
function humanMove(i){
  if(over||turn!==0||phase!=='move')return;
  if(mov.indexOf(i)<0)return;
  brow.innerHTML='';mov=[];
  applyMove(0,i,dice);
}
function applyMove(p,i,d){
  const from=pos[p][i];
  const to=from<0?0:from+d;
  let cap=false;
  if(to<=50){
    const g=(START[p]+to)%52;
    if(!SAFE[g]){
      for(let q=0;q<4;q++){
        if(q===p)continue;
        for(let j=0;j<4;j++){
          const w=pos[q][j];
          if(w>=0&&w<=50&&(START[q]+w)%52===g){pos[q][j]=-1;cap=true;caps[p]++;}
        }
      }
    }
  }
  pos[p][i]=to;moves++;
  if(to===57)fin[p]++;
  H.sfx(cap?'ok':'tick');
  msg=NAME[p]+(from<0?' saiu da base!':' avançou '+(to-from)+' casas'+(to===57?' e GUARDOU o peão!':''))+(cap?' CAPTURA! ⚔️':'');
  if(fin[p]===4){gameOver(p,'quatro peões em casa');return;}
  if(moves>600){gameOver(leader(),'limite de lances');return;}
  if(d===6||cap||to===57){
    msg+=' Jogue de novo!';
    phase='roll';dice=0;status();
    if(p!==0)sched(aiTurn,800);
  }else sched(nextTurn,550);
  status();
}
function nextTurn(){
  seq++;brow.innerHTML='';mov=[];
  turn=(turn+1)%4;phase='roll';dice=0;
  msg='Vez de '+NAME[turn]+'.';
  status();
  if(turn!==0)sched(aiTurn,700);
}
function aiPick(p,d,mv){
  let bi=mv[0],bs=-1e9;
  for(const i of mv){
    const from=pos[p][i],to=from<0?0:from+d;
    let s=to*.12;
    if(from<0)s+=12;
    if(to===57)s+=30;
    if(to<=50){
      const g=(START[p]+to)%52;
      if(SAFE[g])s+=5;
      else{
        for(let q=0;q<4;q++){
          if(q===p)continue;
          for(let j=0;j<4;j++){
            const w=pos[q][j];
            if(w<0||w>50)continue;
            const dist=(g-(START[q]+w)%52+52)%52;
            if(dist===0)s+=16;else if(dist>=1&&dist<=6)s-=4;
          }
        }
      }
    }
    if(s>bs){bs=s;bi=i;}
  }
  return bi;
}
function leader(){
  let bi=0,bs=-1;
  for(let p=0;p<4;p++){
    let s=fin[p]*60+caps[p]*3;
    for(let i=0;i<4;i++)s+=Math.max(0,pos[p][i]);
    if(p===0)s+=.5;
    if(s>bs){bs=s;bi=p;}
  }
  return bi;
}
function gameOver(w,why){
  over=true;seq++;brow.innerHTML='';rollBtn.disabled=true;
  let prog=0;for(let i=0;i<4;i++)prog+=Math.max(0,pos[0][i]);
  const sc=prog+fin[0]*60+caps[0]*15+(w===0?300:0);
  H.score(sc);
  H.done(w===0?{win:true,score:sc,title:'🏆 Ludo vencido!',sub:'4 peões em casa · '+caps[0]+' capturas · '+moves+' lances.'}
    :{win:false,score:sc,title:NAME[w]+' venceu!',sub:'Motivo: '+why+' · você guardou '+fin[0]+'/4.'});
}
H.onTap(o,(px,py)=>{
  if(over||turn!==0||phase!=='move'||!mov.length)return;
  const c=Math.floor(px/CS),r=Math.floor(py/CS);
  if(r<0||r>14||c<0||c>14)return;
  for(const i of mov){
    const v=pos[0][i];
    if(v<0){if(r<6&&c<6){humanMove(i);return;}}
    else{const pc=pawnCell(0,i);if(Math.floor(pc.r)===r&&Math.floor(pc.c)===c){humanMove(i);return;}}
  }
});
function dieFace(f,cx,cy,s){
  x2.fillStyle='#FAF7F0';x2.strokeStyle='#181816';x2.lineWidth=3;
  x2.beginPath();x2.rect(cx-s/2,cy-s/2,s,s);x2.fill();x2.stroke();
  x2.fillStyle='#181816';
  PIP[f].forEach(k=>{const gx=(k%3-1)*s*.28,gy=(((k/3)|0)-1)*s*.28;x2.beginPath();x2.arc(cx+gx,cy+gy,s*.07,0,7);x2.fill();});
}
const BASEREG=[[0,0],[0,9],[9,9],[9,0]];
H.loop((dt,now)=>{
  if(rollT>0)rollT-=dt;
  rollBtn.disabled=!(turn===0&&phase==='roll'&&!over);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<15;r++)for(let c=0;c<15;c++){
    const z=Z[r][c];
    x.fillStyle=z==='w'?'#F4F1EB':z==='t'?'#FAF7F0':z==='ct'?'#EDE8DC':TINT[+z[1]];
    x.fillRect(c*CS,r*CS,CS,CS);
    x.strokeStyle=H.C.cement;x.lineWidth=1;x.strokeRect(c*CS+.5,r*CS+.5,CS-1,CS-1);
  }
  x.textAlign='center';x.textBaseline='middle';
  for(const k in STARTC){
    const p=STARTC[k],rc=k.split(',');
    x.fillStyle=COL[p];x.fillRect(+rc[1]*CS+2,+rc[0]*CS+2,CS-4,CS-4);
    x.fillStyle='#fff';x.font='bold 15px system-ui';x.fillText('★',+rc[1]*CS+16,+rc[0]*CS+17);
  }
  x.fillStyle=H.C.ink3;x.font='13px system-ui';
  for(const k in STARC){const rc=k.split(',');x.fillText('★',+rc[1]*CS+16,+rc[0]*CS+16);}
  for(let p=0;p<4;p++){
    const rr=BASEREG[p];
    x.fillStyle='#FAF7F0';x.strokeStyle=COL[p];x.lineWidth=3;
    x.beginPath();x.rect(rr[1]*CS+8,rr[0]*CS+8,6*CS-16,6*CS-16);x.fill();x.stroke();
  }
  x.fillStyle=H.C.ink;x.font='bold 22px system-ui';x.fillText('★',240,232);
  x.font='bold 12px system-ui';x.fillText('CASA',240,256);
  const groups={};
  for(let p=0;p<4;p++)for(let i=0;i<4;i++){
    const pc=pawnCell(p,i);
    const k=pc.r.toFixed(1)+':'+pc.c.toFixed(1);
    (groups[k]=groups[k]||[]).push({p,i,pc});
  }
  for(const k in groups){
    const g=groups[k];
    g.forEach((e,n)=>{
      const off=OFF[n%OFF.length];
      const px=e.pc.c*CS+(g.length>1?off[0]:0),py=e.pc.r*CS+(g.length>1?off[1]:0);
      const hot=(turn===0&&phase==='move'&&e.p===0&&mov.indexOf(e.i)>=0);
      if(hot){x.strokeStyle=H.C.gold;x.lineWidth=3;x.beginPath();x.arc(px,py,13+2*Math.sin(now*7),0,7);x.stroke();}
      x.fillStyle='rgba(0,0,0,.18)';x.beginPath();x.ellipse(px+2,py+3,10,5,0,0,7);x.fill();
      x.fillStyle=COL[e.p];x.beginPath();x.arc(px,py,11,0,7);x.fill();
      x.strokeStyle='#FAF7F0';x.lineWidth=2;x.stroke();
      x.fillStyle='#fff';x.font='bold 11px system-ui';x.fillText(e.i+1,px,py+1);
    });
  }
  x2.fillStyle=H.C.paper2;x2.fillRect(0,0,d2.W,d2.H);
  x2.fillStyle=COL[turn];x2.fillRect(10,12,60,60);
  x2.fillStyle='#fff';x2.font='bold 20px system-ui';x2.textAlign='center';x2.textBaseline='middle';
  x2.fillText(NAME[turn][0],40,43);
  x2.fillStyle=H.C.ink;x2.font='bold 19px system-ui';x2.textAlign='left';
  x2.fillText('Vez: '+NAME[turn],82,30);
  x2.font='13px system-ui';x2.fillStyle=H.C.ink2;
  x2.fillText(msg.slice(0,54),82,58);
  dieFace(rollT>0?1+((Math.random()*6)|0):(dice||1),430,42,58);
});
status();
}});"""

# 252 — Cobras e Escadas
GAMES[252] = r"""/* NCODE N · 252 Cobras e Escadas — role, suba e não escorregue! */
GREG(252,{
init(root,H){
const CS=44,M=10;
const SN={16:6,47:26,49:11,56:53,62:19,64:60,87:24,93:73,95:75,98:78};
const LD={1:38,4:14,9:31,21:42,28:84,36:44,51:67,71:91,80:100};
const COL=['#D94E34','#2E6E8A','#3E7C4F'];
const NAME=['Você','Azul','Verde'];
const OFF=[[-11,-11],[11,-11],[0,11]];
let over=false,pos=[1,1,1],turn=0,dice=1,phase='roll',seq=0,plies=0,rollT=0;
let steps=[],stepT=0,slide=null,msg='Quem chegar ao 100 exato vence!';
let lad=[0,0,0],snk=[0,0,0];
const hud=H.hud(root,[['t','TURNO','Você'],['d','DADO','—'],['p','SUA POS','1'],['e','ESC×COB','0×0']]);
const say=H.msg(root,'Dado 6 dá jogada extra! 🪜 escadas sobem, 🐍 cobras descem. Só vence cravando o 100 exato.');
const o=H.cvs(root,450,504),x=o.x;
const rollBtn=H.btn(root,'🎲 Rolar dado',doRoll,true);
function cellXY(n){
  const rb=((n-1)/10)|0,idx=(n-1)%10;
  const c=rb%2?9-idx:idx,r=9-rb;
  return{x:M+c*CS+CS/2,y:M+r*CS+CS/2};
}
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function status(){hud.set('t',NAME[turn]);hud.set('d',dice||'—');hud.set('p',pos[0]);hud.set('e',lad[0]+'×'+snk[0]);say(msg);}
function doRoll(){
  if(over||turn!==0||phase!=='roll')return;
  phase='dice';rollT=.7;H.sfx('tick');
  sched(()=>{dice=1+((Math.random()*6)|0);rollT=0;resolveRoll(0);},720);
}
function aiTurn(){
  if(over||turn===0||phase!=='roll')return;
  phase='dice';rollT=.7;
  const p=turn;
  sched(()=>{dice=1+((Math.random()*6)|0);rollT=0;resolveRoll(p);},720);
}
function resolveRoll(p){
  if(pos[p]+dice>100){
    msg=NAME[p]+' tirou '+dice+': precisa do número exato!';H.sfx('bad');status();
    sched(nextTurn,900);return;
  }
  steps=[];for(let n=pos[p]+1;n<=pos[p]+dice;n++)steps.push(n);
  phase='anim';stepT=0;status();
}
function animDone(p){
  const sq=pos[p];
  if(LD[sq]){slide={a:sq,b:LD[sq],t:0,p};lad[p]++;msg=NAME[p]+' subiu 🪜 '+sq+' → '+LD[sq]+'!';H.sfx('ok');}
  else if(SN[sq]){slide={a:sq,b:SN[sq],t:0,p};snk[p]++;msg=NAME[p]+' escorregou 🐍 '+sq+' → '+SN[sq]+'!';H.sfx('bad');}
  else finishMove(p);
  status();
}
function finishMove(p){
  if(pos[p]===100){gameOver(p,false);return;}
  if(dice===6){msg+=' Tirou 6, jogue de novo!';phase='roll';status();if(p!==0)sched(aiTurn,800);}
  else sched(nextTurn,650);
}
function nextTurn(){
  seq++;turn=(turn+1)%3;plies++;phase='roll';
  if(plies>170){let w=0;for(let p=0;p<3;p++)if(pos[p]>pos[w]||(pos[p]===pos[w]&&p===0))w=p;gameOver(w,true);return;}
  msg='Vez de '+NAME[turn]+'.';status();
  if(turn!==0)sched(aiTurn,700);
}
function gameOver(w,cap){
  over=true;seq++;rollBtn.disabled=true;
  const sc=Math.max(0,pos[0]*2+lad[0]*25-snk[0]*5+(w===0?250:0));
  H.score(sc);
  H.done(w===0?{win:true,score:sc,title:'🏆 Chegou ao 100!',sub:lad[0]+' escadas · '+snk[0]+' cobras.'}
    :{win:false,score:sc,title:NAME[w]+' chegou primeiro!',sub:cap?'Limite de turnos — você estava no '+pos[0]+'.':'Você estava no '+pos[0]+'.'});
}
function drawSnake(a,b){
  const A=cellXY(a),B=cellXY(b);
  const mx=(A.x+B.x)/2,my=(A.y+B.y)/2;
  const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy)||1;
  const nx=-dy/L*26,ny=dx/L*26;
  x.strokeStyle='#B23A24';x.lineWidth=7;x.lineCap='round';
  x.beginPath();x.moveTo(A.x,A.y);x.quadraticCurveTo(mx+nx,my+ny,B.x,B.y);x.stroke();
  x.lineWidth=3;x.strokeStyle='#E8A33D';
  x.beginPath();x.moveTo(A.x,A.y);x.quadraticCurveTo(mx+nx,my+ny,B.x,B.y);x.stroke();
  x.fillStyle='#B23A24';x.beginPath();x.arc(A.x,A.y-8,9,0,7);x.fill();
  x.fillStyle='#fff';x.beginPath();x.arc(A.x-3,A.y-10,2,0,7);x.arc(A.x+3,A.y-10,2,0,7);x.fill();
}
function drawLadder(a,b){
  const A=cellXY(a),B=cellXY(b);
  const dx=B.x-A.x,dy=B.y-A.y,L=Math.hypot(dx,dy)||1;
  const nx=-dy/L*7,ny=dx/L*7;
  x.strokeStyle='#8A6A2F';x.lineWidth=4;
  x.beginPath();x.moveTo(A.x+nx,A.y+ny);x.lineTo(B.x+nx,B.y+ny);x.moveTo(A.x-nx,A.y-ny);x.lineTo(B.x-nx,B.y-ny);x.stroke();
  x.lineWidth=3;
  for(let i=1;i<6;i++){
    const t=i/6,px=A.x+dx*t,py=A.y+dy*t;
    x.beginPath();x.moveTo(px+nx,py+ny);x.lineTo(px-nx,py-ny);x.stroke();
  }
}
H.loop((dt,now)=>{
  if(rollT>0)rollT-=dt;
  rollBtn.disabled=!(turn===0&&phase==='roll'&&!over);
  if(phase==='anim'&&steps.length&&!over){
    stepT+=dt;
    if(stepT>=.13){stepT=0;pos[turn]=steps.shift();H.sfx('tick');if(!steps.length)animDone(turn);}
  }
  if(slide&&!over){
    slide.t+=dt/.8;
    if(slide.t>=1){pos[slide.p]=slide.b;const p=slide.p;slide=null;finishMove(p);}
  }
  x.fillStyle='#EDE8DC';x.fillRect(0,0,o.W,o.H);
  x.textAlign='left';x.textBaseline='alphabetic';
  for(let n=1;n<=100;n++){
    const rb=((n-1)/10)|0,idx=(n-1)%10;
    const c=rb%2?9-idx:idx,r=9-rb;
    x.fillStyle=(r+c)%2?'#FAF7F0':'#F1ECE0';
    x.fillRect(M+c*CS,M+r*CS,CS,CS);
    x.strokeStyle=H.C.cement;x.lineWidth=1;x.strokeRect(M+c*CS+.5,M+r*CS+.5,CS-1,CS-1);
    x.fillStyle=H.C.ink3;x.font='10px system-ui';
    x.fillText(n,M+c*CS+3,M+r*CS+12);
  }
  for(const k in LD)drawLadder(+k,LD[k]);
  for(const k in SN)drawSnake(+k,SN[k]);
  for(let p=0;p<3;p++){
    let X;
    if(slide&&slide.p===p){const A=cellXY(slide.a),B=cellXY(slide.b),t=Math.min(1,slide.t);X={x:A.x+(B.x-A.x)*t,y:A.y+(B.y-A.y)*t-16*Math.sin(t*Math.PI)};}
    else X=cellXY(pos[p]);
    const px=X.x+OFF[p][0],py=X.y+OFF[p][1];
    if(p===turn&&!over){x.strokeStyle=H.C.gold;x.lineWidth=3;x.beginPath();x.arc(px,py,14,0,7);x.stroke();}
    x.fillStyle=COL[p];x.beginPath();x.arc(px,py,11,0,7);x.fill();
    x.strokeStyle='#FAF7F0';x.lineWidth=2;x.stroke();
    x.fillStyle='#fff';x.font='bold 11px system-ui';x.textAlign='center';x.textBaseline='middle';
    x.fillText(NAME[p][0],px,py+1);
    x.textAlign='left';x.textBaseline='alphabetic';
  }
  x.fillStyle='#EDE8DC';x.fillRect(0,460,450,44);
  x.fillStyle=COL[turn];x.beginPath();x.arc(26,482,12,0,7);x.fill();
  x.fillStyle='#fff';x.font='bold 12px system-ui';x.textAlign='center';x.textBaseline='middle';
  x.fillText(NAME[turn][0],26,483);
  x.fillStyle=H.C.ink;x.font='bold 17px system-ui';x.textAlign='left';
  x.fillText('Vez: '+NAME[turn]+'   🎲 '+(rollT>0?1+((Math.random()*6)|0):dice),48,483);
  x.fillStyle=H.C.ink2;x.font='13px system-ui';
  x.fillText('pos '+pos[0]+' · 🪜'+lad[0]+' 🐍'+snk[0],310,483);
  x.textAlign='left';x.textBaseline='alphabetic';
});
status();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
