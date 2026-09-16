/* NCODE N · 251 Ludo — leve os 4 peões para casa! */
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
}});
