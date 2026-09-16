/* NCODE N · 275 Mansão do Roubo — cômodo por cômodo! */
GREG(275,{
init(root,H){
const RW=140,RH=180,OX=20,OY=20;
let over=false,pc=0,pr=1,loot=0,lives=2,t=0,cd=0,guard=0;
const LOOT=[[0,0],[2,0],[1,1],[2,1]];
const GOT={};
const CIRC=[0,1,2,5,4,3];
const hud=H.hud(root,[['v','VIDAS',2],['s','SAQUES','0/4']]);
const say=H.msg(root,'Saqueie os 4 cômodos 💎 e volte à porta 🚪! O ronda circula — se ele entrar com você, esconda-se no armário (fique parado no 🗄️)!');
const o=H.cvs(root,460,420),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function room(){return pr*3+pc;}
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>2||nr<0||nr>1)return;
 pc=nc;pr=nr;cd=.3;H.sfx('tick');check();
}
function closet(){const cx=OX+pc*RW+RW-28,cy=OY+pr*RH+28;return{cx,cy};}
let hideT=0;
function check(){
 const k=pc+','+pr;
 if(LOOT.some(l=>l[0]===pc&&l[1]===pr)&&!GOT[k]){GOT[k]=1;loot++;H.sfx('ok');hud.set('s',loot+'/4');}
 status();
}
function status(){say(loot>=4?'Tudo saqueado! Volte à porta 🚪 (canto inferior esquerdo)!':'Ronda no cômodo '+(guard+1)+' — saqueie '+loot+'/4!');}
function gameOver(win){over=true;const sc=win?400+lives*100:loot*60;H.score(sc);
H.done(win?{win:true,score:sc,title:'💎 Mansão limpa!',sub:'4 cômodos saqueados.'}:{win:false,score:sc,title:'Pego!',sub:loot+'/4 saques. Fuja da ronda!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/RW),r=Math.floor((py-OY)/RH);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
let gT=0;
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 gT+=dt;
 if(gT>2.6){gT=0;guard=(guard+1)%6;
  if(CIRC[guard]===room()){lives--;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver(false);return;}
   pc=0;pr=1;}
 }
 if(loot>=4&&pc===0&&pr===1){gameOver(true);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,420);
 for(let r=0;r<2;r++)for(let c=0;c<3;c++){
  const i=r*3+c;
  x.fillStyle=CIRC[guard]===i?'rgba(217,78,52,.2)':'#EDE8DC';
  x.fillRect(OX+c*RW,OY+r*RH,RW,RH);
  x.strokeStyle='#181816';x.lineWidth=2;x.strokeRect(OX+c*RW,OY+r*RH,RW,RH);
  x.fillStyle='#8A877C';x.font='12px system-ui';x.textAlign='left';x.fillText('Cômodo '+(i+1),OX+c*RW+8,OY+r*RH+20);
  x.font='22px system-ui';x.textAlign='center';
  x.fillText('🗄️',OX+c*RW+RW-28,OY+r*RH+32);
  if(c===0&&r===1)x.fillText('🚪',OX+c*RW+28,OY+r*RH+RH-16);
  const k=c+','+r;
  if(LOOT.some(l=>l[0]===c&&l[1]===r)&&!GOT[k])x.fillText('💎',OX+c*RW+RW/2,OY+r*RH+RH/2+8);
  if(CIRC[guard]===i){x.font='26px system-ui';x.fillText('💂',OX+c*RW+RW/2,OY+r*RH+44);}
 }
 const px=OX+pc*RW+RW/2,py=OY+pr*RH+RH/2+34;
 x.fillStyle='#181816';x.beginPath();x.arc(px,py,11,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(px,py,4,0,7);x.fill();
 hud.set('v',lives);
});
status();
}});
