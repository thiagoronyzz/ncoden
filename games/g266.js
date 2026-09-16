/* NCODE N · 266 Duto de Ventilação — rasteje até o cofre! */
GREG(266,{
init(root,H){
const MAP=[
 '############',
 '#S...#.....#',
 '##.#.#.###.#',
 '#..#...#F..#',
 '#.####.#.#.#',
 '#.#F...#.#V#',
 '#.#.##.#.#.#',
 '#...#..F#..#',
 '#####.####.#',
 '#.....#....#',
 '############'
];
const CS=38,OX=12,OY=12;
let over=false,pc=1,pr=1,fuses=0,lives=3,cd=0,t=0;
const SW=[
 {path:[[5,1],[5,2],[5,3],[6,3],[7,3],[7,2],[7,1]],i:0,dir:1},
 {path:[[9,4],[9,5],[9,6],[9,7],[8,7],[8,6],[8,5],[8,4]],i:0,dir:1}
];
let grid=MAP.map(r=>r.split(''));
const hud=H.hud(root,[['v','VIDAS',3],['f','FUSÍVEIS','0/3']]);
const say=H.msg(root,'Colete 3 fusíveis 🔌 e chegue ao cofre 💰! Olhos 👁️ patrulham os dutos. Setas ou toque na casa vizinha.');
const o=H.cvs(root,480,440),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(grid[nr][nc]==='#')return;
 pc=nc;pr=nr;cd=.15;H.sfx('tick');
 if(grid[nr][nc]==='F'){grid[nr][nc]='.';fuses++;H.sfx('ok');}
 check();
}
function check(){
 if(SW.some(s=>{const p=s.path[s.i];return p[0]===pc&&p[1]===pr;})){
  lives--;H.sfx('bad');if(lives<=0){gameOver(false);return;}pc=1;pr=1;
 }
 if(grid[pr][pc]==='V'){
  if(fuses>=3)gameOver(true);
 }
 status();
}
function status(){hud.set('v',lives);hud.set('f',fuses+'/3');say(fuses>=3?'Cofre destravado! Vá até 💰!':'Fusíveis: '+fuses+'/3 — o cofre precisa de 3!');}
function gameOver(win){over=true;const sc=win?350+fuses*50+lives*60:fuses*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'💰 Cofre aberto!',sub:'Rastejou como um profissional.'}:{win:false,score:sc,title:'Detectado!',sub:'A segurança te pegou. Decore as rotas!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
let swT=0;
H.loop(dt=>{
 if(over)return;t+=dt;if(cd>0)cd-=dt;
 swT+=dt;
 if(swT>.55){swT=0;SW.forEach(s=>{s.i+=s.dir;if(s.i>=s.path.length-1||s.i<=0)s.dir*=-1;});check();}
 x.fillStyle=H.C.paper;x.fillRect(0,0,480,440);
 for(let r=0;r<grid.length;r++)for(let c=0;c<grid[0].length;c++){
  const v=grid[r][c];
  x.fillStyle=v==='#'?'#4A4A44':v==='V'?(fuses>=3?'#3E7C4F':'#8A877C'):v==='F'?'#E8A33D':'#D8D5CC';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle=H.C.paper;x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  x.font='20px system-ui';x.textAlign='center';
  if(v==='F')x.fillText('🔌',OX+c*CS+19,OY+r*CS+28);
  if(v==='V')x.fillText('💰',OX+c*CS+19,OY+r*CS+28);
 }
 x.font='20px system-ui';
 SW.forEach(s=>{const p=s.path[s.i];x.fillText('👁️',OX+p[0]*CS+19,OY+p[1]*CS+28);});
 x.fillStyle='#181816';x.beginPath();x.arc(OX+pc*CS+19,OY+pr*CS+19,13,0,7);x.fill();
 x.fillStyle='#C4D645';x.beginPath();x.arc(OX+pc*CS+19,OY+pr*CS+19,5,0,7);x.fill();
});
status();
}});
