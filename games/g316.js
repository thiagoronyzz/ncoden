/* NCODE N · 316 Explorador de Caverna — ache a saída! */
GREG(316,{
init(root,H){
const MAP=[
 '##########',
 '#S...#...#',
 '###.#.#.#.',
 '#...#.#.#.',
 '#.#.#...#.',
 '#.#.#####.',
 '#.#.....#.',
 '#.#####.#.',
 '#G..#..G#.',
 '##########'
];
const CS=44,OX=10,OY=10;
let over=false,pc=1,pr=1,torch=100,gems=0,cd=0;
let grid=MAP.map(r=>r.split(''));
const hud=H.hud(root,[['t','TOCHA','100%'],['g','GEMAS',0]]);
const say=H.msg(root,'Ache a saída 🚪 no escuro! A tocha apaga com o tempo — gemas 💎 recarregam +20. Setas ou toque vizinho.');
const o=H.cvs(root,460,460),x=o.x;
const kb=H.keys();kb.on((c,d)=>{if(!d)return;
 if(c==='ArrowLeft'||c==='KeyA')step(-1,0);else if(c==='ArrowRight'||c==='KeyD')step(1,0);
 else if(c==='ArrowUp'||c==='KeyW')step(0,-1);else if(c==='ArrowDown'||c==='KeyS')step(0,1);});
function step(dc,dr){
 if(over||cd>0)return;
 const nc=pc+dc,nr=pr+dr;
 if(grid[nr]===undefined||grid[nr][nc]==='#')return;
 pc=nc;pr=nr;cd=.14;torch-=1.2;H.sfx('tick');
 if(grid[nr][nc]==='G'){grid[nr][nc]='.';gems++;torch=Math.min(100,torch+25);H.sfx('ok');hud.set('g',gems);}
 if(nr===3&&nc===9){gameOver(true);return;}
 if(torch<=0){gameOver(false);return;}
 status();
}
function status(){hud.set('t',Math.max(0,torch|0)+'%');}
function gameOver(win){over=true;const sc=win?300+gems*80+Math.ceil(torch)*2:gems*40;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🔦 Caverna vencida!',sub:gems+' gemas e tocha em '+(torch|0)+'%.'}:{win:false,score:sc|0,title:'Escuridão total!',sub:'A tocha apagou. Pegue as gemas 💎!'});}
H.onTap(o,(px,py)=>{
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(Math.abs(c-pc)+Math.abs(r-pr)===1)step(c-pc,r-pr);
});
H.loop(dt=>{
 if(over)return;if(cd>0)cd-=dt;
 torch-=dt*.8;
 hud.set('t',Math.max(0,torch|0)+'%');
 if(torch<=0){gameOver(false);return;}
 x.fillStyle='#0C0C10';x.fillRect(0,0,460,460);
 const R=2.2;
 for(let r=0;r<10;r++)for(let c=0;c<10;c++){
  const d=Math.hypot(c-pc,r-pr);
  if(d>R+1)continue;
  const v=grid[r][c];
  x.globalAlpha=d>R?.25:1;
  x.fillStyle=v==='#'?'#4A4A44':'.#'.includes(v)?'#2A2A33':'#2A2A33';
  if(v==='.')x.fillStyle='#2A2A33';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.globalAlpha=1;
  if(v==='G'&&d<=R+1){x.font='22px system-ui';x.textAlign='center';x.fillText('💎',OX+c*CS+22,OY+r*CS+32);}
 }
 x.font='22px system-ui';x.textAlign='center';x.fillText('🚪',OX+9*CS+22,OY+3*CS+32);
 x.fillStyle='#E8A33D';x.beginPath();x.arc(OX+pc*CS+22,OY+pr*CS+22,10,0,7);x.fill();
 x.fillStyle='#fff';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('🔥 '+(torch|0)+'%  💎 '+gems,12,452);
});
status();
}});
