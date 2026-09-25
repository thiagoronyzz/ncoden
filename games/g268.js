/* NCODE N · 268 Passo Silencioso — pise macio! */
GREG(268,{
init(root,H){
const N=10,CS=44,OX=10,OY=10;
// 0 tapete, 1 madeira, 2 vidro
const SUR=[
 [1,1,0,1,1,2,1,1,0,1],
 [1,0,0,1,2,2,1,0,0,1],
 [1,0,1,1,1,1,1,1,0,1],
 [1,0,1,2,2,1,0,1,0,1],
 [1,0,1,2,2,1,0,1,0,0],
 [1,0,0,0,1,1,0,1,1,0],
 [1,1,1,0,1,2,0,0,1,0],
 [2,2,1,0,1,2,1,0,1,0],
 [1,1,1,0,0,0,1,0,0,0],
 [1,0,0,0,1,1,1,1,1,0]
];
let over=false,pc=0,pr=9,noise=0,lives=3,cd=0,maxN=0;
const hud=H.hud(root,[['v','VIDAS',3],['rz','BARULHO','0%']]);
const say=H.msg(root,'Chegue à saída ! ■ tapete = silêncio · madeira = ruído · ■ vidro = MUITO ruído. Pare para o barulho baixar!');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(nc<0||nc>=N||nr<0||nr>=N)return;
 pc=nc;pr=nr;cd=.22;
 noise+=[0,14,34][SUR[nr][nc]];
 maxN=Math.max(maxN,noise);
 H.sfx(SUR[nr][nc]===2?'bad':'tick');
 if(noise>=100){lives--;noise=0;H.sfx('bad');if(lives<=0){gameOver(false);return;}}
 if(pc===9&&pr===0){gameOver(true);return;}
 status();
}
function status(){hud.set('v',lives);hud.set('rz',((noise|0))+'%');}
function gameOver(win){over=true;const sc=win?Math.max(150,500-(maxN|0)*2)+lives*60:40;H.score(sc);
H.done(win?{win:true,score:sc,title:'Passo de gato!',sub:'Pico de barulho: '+(maxN|0)+'%.' }:{win:false,score:sc,title:'Ouvido!',sub:'O guarda ouviu seus passos. Prefira o tapete!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;if(cd>0)cd-=dt;
 noise=Math.max(0,noise-22*dt);
 hud.set('rz',(noise|0)+'%');
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,460);
 const TCOL=['#7A5C3E','#C98A1B','#7FB3C8'];
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  x.fillStyle=TCOL[SUR[r][c]];x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle=H.C.paper;x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.font='24px system-ui';x.textAlign='center';
 x.fillText('i:door',OX+9*CS+22,OY+0*CS+33);
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,5,0,7);x.fill();
});
status();
}});
