/* NCODE N · 327 Pântano Perigoso — cruze o brejo! */
GREG(327,{
init(root,H){
const N=9,CS=48,OX=14,OY=14;
let over=false,pc=0,pr=8,cd=0,t=0,lives=3;
const SAND=[[2,7],[5,6],[3,4],[6,3],[1,5],[7,6],[4,2]];
const CROCS=[{c:4,r:7,d:1},{c:2,r:3,d:-1},{c:6,r:1,d:1}];
const hud=H.hud(root,[['v','VIDAS',3]]);
const say=H.msg(root,'Chegue à terra firme ! Areia movediça ● prende (perde vida), crocodilos andam — não encoste!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 pc=nc;pr=nr;cd=.16;H.sfx('tick');check();
}
function hurt(why){
 lives--;H.sfx('bad');hud.set('v',lives);
 if(lives<=0){gameOver(false);return;}
 pc=0;pr=8;
 say(why+' Vidas: '+lives);
}
function check(){
 if(SAND.some(s=>s[0]===pc&&s[1]===pr)){hurt('● Areia movediça!');return;}
 if(CROCS.some(c=>c.c===pc&&c.r===pr)){hurt('Crocodilo!');return;}
 if(pc===8&&pr===0){gameOver(true);return;}
}
function gameOver(win){over=true;const sc=win?300+lives*100:60;H.score(sc);
H.done(win?{win:true,score:sc,title:'Pântano cruzado!',sub:'Sem virar almoço!'}:{win:false,score:sc,title:'O brejo venceu!',sub:'Decore a areia e o ritmo dos crocodilos!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
let cT=0;
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 cT+=dt;
 if(cT>.6){cT=0;CROCS.forEach(c=>{c.c+=c.d;if(c.c<0||c.c>=N){c.d*=-1;c.c+=c.d*2;}});check();}
 x.fillStyle='#4A6E3E';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const s=SAND.some(q=>q[0]===c&&q[1]===r);
  x.fillStyle=s?'#8A6A2F':'#4A6E3E';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#3A5A30';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  if(s){x.font='20px system-ui';x.textAlign='center';x.fillText('●',OX+c*CS+24,OY+r*CS+34);}
 }
 x.font='22px system-ui';x.textAlign='center';
 x.fillText('i:flag',OX+8*CS+24,OY+0*CS+34);
 CROCS.forEach(c=>x.fillText('i:croc',OX+c.c*CS+24,OY+c.r*CS+34));
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+24,OY+pr*CS+24,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+24,OY+pr*CS+24,5,0,7);x.fill();
});
}});
