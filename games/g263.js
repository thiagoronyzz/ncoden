/* NCODE N · 263 Grid de Lasers — atravesse no ritmo! */
GREG(263,{
init(root,H){
const N=8,CS=54,OX=14,OY=14;
let over=false,pc=0,pr=7,lvl=0,lives=3,t=0,cd=0;
const LV=[
 [{o:'r',k:2,p:3,ph:0},{o:'c',k:4,p:4,ph:1},{o:'r',k:5,p:3.4,ph:2}],
 [{o:'r',k:1,p:2.6,ph:0},{o:'c',k:2,p:3,ph:1},{o:'r',k:4,p:2.8,ph:2},{o:'c',k:6,p:3.2,ph:0},{o:'r',k:6,p:3,ph:1}],
 [{o:'r',k:0,p:2.2,ph:0},{o:'c',k:1,p:2.4,ph:1},{o:'r',k:3,p:2.2,ph:2},{o:'c',k:3,p:2.6,ph:0},{o:'r',k:5,p:2.2,ph:1},{o:'c',k:5,p:2.4,ph:2},{o:'r',k:7,p:2.6,ph:0}]
];
const hud=H.hud(root,[['v','VIDAS',3],['nv','FASE','1/3']]);
const say=H.msg(root,'Chegue ao cofre 💰! Lasers vermelhos queimam — atravesse quando apagarem. Setas ou toque na casa vizinha.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{if(d)tryMove(c);});
function active(L){return((t+L.ph)%L.p)<L.p/2;}
function onLaser(){
 return LV[lvl].some(L=>active(L)&&((L.o==='r'&&L.k===pr)||(L.o==='c'&&L.k===pc)));
}
function tryMove(c){
 if(over||cd>0)return;
 let dc=0,dr=0;
 if(c==='ArrowLeft'||c==='KeyA')dc=-1;else if(c==='ArrowRight'||c==='KeyD')dc=1;
 else if(c==='ArrowUp'||c==='KeyW')dr=-1;else if(c==='ArrowDown'||c==='KeyS')dr=1;else return;
 step(dc,dr);
}
function step(dc,dr){
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 pc=nc;pr=nr;cd=.16;H.sfx('tick');check();
}
function check(){
 if(onLaser()){lives--;H.sfx('bad');hud.set('v',lives);if(lives<=0){gameOver(false);return;}pc=0;pr=7;}
 if(pc===7&&pr===0){
  if(lvl>=2){gameOver(true);return;}
  lvl++;pc=0;pr=7;H.sfx('ok');hud.set('nv',(lvl+1)+'/3');
 }
}
function gameOver(win){over=true;const sc=win?400+lives*100:lvl*120;H.score(sc);
H.done(win?{win:true,score:sc,title:'⚡ Ninja do laser!',sub:'3 salas sem um arranhão.'}:{win:false,score:sc,title:'Frito!',sub:'O laser te pegou na fase '+(lvl+1)+'.'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 if(onLaser()&&cd<=-1){}
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=(r+c)%2?'#2A2A33':'#24242C';x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#3A3A45';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 LV[lvl].forEach(L=>{
  x.fillStyle=active(L)?'#D94E34':'rgba(217,78,52,.18)';
  if(L.o==='r')x.fillRect(OX,OY+L.k*CS+CS/2-3,N*CS,6);
  else x.fillRect(OX+L.k*CS+CS/2-3,OY,6,N*CS);
 });
 x.font='26px system-ui';x.textAlign='center';
 x.fillText('💰',OX+7*CS+27,OY+0*CS+38);
 x.fillStyle=onLaser()?'#D94E34':'#C4D645';
 x.beginPath();x.arc(OX+pc*CS+27,OY+pr*CS+27,14,0,7);x.fill();
 x.strokeStyle='#fff';x.lineWidth=2;x.stroke();
 hud.set('nv',(lvl+1)+'/3');
});
}});
