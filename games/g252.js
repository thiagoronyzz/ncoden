/* NCODE N · 252 Cobras e Escadas — role, suba e não escorregue! */
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
}});
