/* NCODE N · 255 Mahjong Solitário — remova os 38 pares! */
GREG(255,{
init(root,H){
const TW=58,TH=68,OX=30,OY=26;
const DOTPOS={1:[[0,0]],2:[[-1,-1],[1,1]],3:[[-1,-1],[0,0],[1,1]],4:[[-1,-1],[1,-1],[-1,1],[1,1]],5:[[-1,-1],[1,-1],[0,0],[-1,1],[1,1]],6:[[-1,-1],[1,-1],[-1,0],[1,0],[-1,1],[1,1]],7:[[-1,-1],[1,-1],[0,-1],[-1,0],[1,0],[-1,1],[1,1]],8:[[-1,-1],[1,-1],[0,-1],[-1,0],[1,0],[0,1],[-1,1],[1,1]],9:[[-1,-1],[0,-1],[1,-1],[-1,0],[0,0],[1,0],[-1,1],[0,1],[1,1]]};
const CHN='一二三四五六七八九',HON='東南西北白發中',FLW='🌸🌺🌻🌷';
let over=false,tiles=[],sel=null,pairs=38,moves=0,streak=0,score=0,time=0;
let shuffles=3,hints=3,hintPair=null,hintT=0,msg='Toque em duas peças LIVRES iguais!';
const hud=H.hud(root,[['par','PARES',38],['tmp','TEMPO','0:00'],['pts','PONTOS',0],['eb','EMB×DICA','3×3']]);
const say=H.msg(root,'Peça livre = topo vazio + um lado aberto! Combine os 38 pares. Sem jogadas? Embaralhe (3×) ou peça dica (3×).');
const o=H.cvs(root,530,470),x=o.x;
const brow=H.el('div','g-row',null,root);
H.btn(brow,'🔀 Embaralhar',doShuffle,false);
H.btn(brow,'💡 Dica',doHint,false);
function fmtT(s){return ((s/60)|0)+':'+String((s|0)%60).padStart(2,'0');}
function status(){hud.set('par',pairs);hud.set('tmp',fmtT(time));hud.set('pts',score);hud.set('eb',shuffles+'×'+hints);say(msg);}
function deal(){
  const slots=[];
  for(let r=0;r<6;r++)for(let c=0;c<8;c++)slots.push({L:0,r,c});
  for(let r=0;r<4;r++)for(let c=0;c<6;c++)slots.push({L:1,r:r+1,c:c+1});
  for(let r=0;r<2;r++)for(let c=0;c<2;c++)slots.push({L:2,r:r+2,c:c+3});
  const ids=[];
  for(let s=0;s<38;s++){ids.push(s);ids.push(s);}
  for(let i=ids.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=ids[i];ids[i]=ids[j];ids[j]=t;}
  tiles=slots.map((s,i)=>({L:s.L,r:s.r,c:s.c,ux:s.c+s.L*.5,uy:s.r+s.L*.5,s:ids[i],gone:false}));
}
function tileXY(t){return{x:OX+t.ux*TW+t.L*5,y:OY+t.uy*TH-t.L*5};}
function blockedAbove(t){
  for(const u of tiles){
    if(u.gone||u===t||u.L<=t.L)continue;
    if(Math.abs(u.ux-t.ux)<1&&Math.abs(u.uy-t.uy)<1)return true;
  }
  return false;
}
function sideBlocked(t,dir){
  for(const u of tiles){
    if(u.gone||u===t||u.L!==t.L)continue;
    if(u.uy===t.uy&&u.ux===t.ux+dir)return true;
  }
  return false;
}
function isFree(t){return!t.gone&&!blockedAbove(t)&&!(sideBlocked(t,-1)&&sideBlocked(t,1));}
function findPair(){
  const free=tiles.filter(isFree);
  const seen={};
  for(const t of free){
    if(seen[t.s])return[seen[t.s],t];
    seen[t.s]=t;
  }
  return null;
}
function doShuffle(){
  if(over||shuffles<=0)return;
  const alive=tiles.filter(t=>!t.gone);
  const syms=alive.map(t=>t.s);
  for(let i=syms.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=syms[i];syms[i]=syms[j];syms[j]=t;}
  alive.forEach((t,i)=>t.s=syms[i]);
  sel=null;shuffles--;hintPair=null;
  H.sfx('tick');msg='Peças embaralhadas! ('+shuffles+' restantes)';status();
}
function doHint(){
  if(over||hints<=0||!pairs)return;
  const pr=findPair();
  if(!pr){msg='Sem pares livres! Embaralhe.';H.sfx('bad');status();return;}
  hintPair=pr;hintT=6;hints--;
  H.sfx('tick');msg='Olhe o brilho verde! ('+hints+' dicas)';status();
}
function gameOver(win){
  over=true;
  const bonus=win?Math.max(0,600-(time|0))*2:0;
  score+=bonus;H.score(score);
  H.done(win?{win:true,score,title:'🏆 Mahjong limpo!',sub:'38 pares · '+moves+' jogadas · '+fmtT(time)+' · bônus '+bonus+'.'}
    :{win:false,score,title:'Sem jogadas!',sub:pairs+' pares restantes · tente embaralhar antes de travar.'});
}
H.onTap(o,(px,py)=>{
  if(over)return;
  const order=tiles.slice().sort((a,b)=>(b.L-a.L)||(b.uy-a.uy)||(b.ux-a.ux));
  let hit=null;
  for(const t of order){
    if(t.gone)continue;
    const X=tileXY(t);
    if(px>=X.x&&px<=X.x+TW&&py>=X.y&&py<=X.y+TH){hit=t;break;}
  }
  if(!hit){sel=null;return;}
  if(!isFree(hit)){H.sfx('bad');msg='Peça presa! Libere o topo ou um dos lados.';status();return;}
  if(sel===hit){sel=null;H.sfx('tick');return;}
  if(sel&&sel.s===hit.s){
    sel.gone=true;hit.gone=true;sel=null;pairs--;moves++;
    streak++;score+=10+streak*2;hintPair=null;
    H.sfx('ok');
    msg=pairs?streak>2?'🔥 Sequência x'+streak+'! +'+(10+streak*2):'Par removido! +'+(10+streak*2):'Último par!';
    status();
    if(!pairs){gameOver(true);return;}
    if(!findPair()){
      if(shuffles>0){msg='Sem pares livres — embaralhe!';status();}
      else gameOver(false);
    }
    return;
  }
  if(sel){streak=0;}
  sel=hit;H.sfx('tick');
});
function drawSymbol(s,cx,cy){
  x.textAlign='center';x.textBaseline='middle';
  if(s<9){
    const n=s+1;
    if(n===1){x.fillStyle='#D94E34';x.beginPath();x.arc(cx,cy,15,0,7);x.fill();x.fillStyle='#FAF7F0';x.beginPath();x.arc(cx,cy,6,0,7);x.fill();return;}
    x.fillStyle='#2E6E8A';
    DOTPOS[n].forEach(p=>{x.beginPath();x.arc(cx+p[0]*10,cy+p[1]*11,5,0,7);x.fill();x.fillStyle='#FAF7F0';x.beginPath();x.arc(cx+p[0]*10,cy+p[1]*11,1.8,0,7);x.fill();x.fillStyle='#2E6E8A';});
  }else if(s<18){
    const n=s-8;
    x.fillStyle='#3E7C4F';
    if(n===1){x.fillRect(cx-6,cy-20,12,40);x.fillStyle='#E8A33D';x.fillRect(cx-6,cy-3,12,6);return;}
    DOTPOS[n].forEach(p=>{
      x.fillStyle='#3E7C4F';x.fillRect(cx+p[0]*11-4,cy+p[1]*12-6,8,12);
      x.fillStyle='#E8A33D';x.fillRect(cx+p[0]*11-4,cy+p[1]*12-1,8,2);
    });
  }else if(s<27){
    x.fillStyle='#181816';x.font='bold 20px serif';
    x.fillText(CHN[s-18],cx,cy-13);
    x.fillStyle='#D94E34';x.font='bold 22px serif';
    x.fillText('萬',cx,cy+13);
  }else if(s<34){
    const h=HON[s-27];
    if(h==='白'){x.strokeStyle='#2E6E8A';x.lineWidth=4;x.strokeRect(cx-11,cy-15,22,30);}
    else{x.fillStyle=h==='中'?'#D94E34':h==='發'?'#3E7C4F':'#181816';x.font='bold 30px serif';x.fillText(h,cx,cy);}
  }else{
    x.font='30px serif';x.fillText(FLW[s-34],cx,cy);
  }
}
H.loop(dt=>{
  if(!over){
    time+=dt;
    if(time>=900){gameOver(false);return;}
  }
  if(hintT>0)hintT-=dt;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const order=tiles.slice().sort((a,b)=>(a.L-b.L)||(a.uy-b.uy)||(a.ux-b.ux));
  for(const t of order){
    if(t.gone)continue;
    const X=tileXY(t);
    x.fillStyle='rgba(0,0,0,.20)';x.fillRect(X.x+3,X.y+4,TW,TH);
    x.fillStyle='#FAF7F0';x.fillRect(X.x,X.y,TW,TH);
    x.strokeStyle='#181816';x.lineWidth=1.5;x.strokeRect(X.x+.5,X.y+.5,TW-1,TH-1);
    x.fillStyle='#EDE8DC';x.fillRect(X.x+3,X.y+3,TW-6,5);
    drawSymbol(t.s,X.x+TW/2,X.y+TH/2);
    const free=isFree(t);
    if(!free){x.fillStyle='rgba(24,24,22,.16)';x.fillRect(X.x,X.y,TW,TH);}
    if(sel===t){x.strokeStyle=H.C.gold;x.lineWidth=3.5;x.strokeRect(X.x+1,X.y+1,TW-2,TH-2);}
    if(hintPair&&hintT>0&&(hintPair[0]===t||hintPair[1]===t)&&(hintT*4|0)%2===0){
      x.strokeStyle=H.C.wasabi;x.lineWidth=4;x.strokeRect(X.x,X.y,TW,TH);
    }
  }
  if(sel&&!over){
    x.fillStyle=H.C.ink;x.font='bold 13px system-ui';x.textAlign='left';x.textBaseline='alphabetic';
    x.fillText('Selecionada: encontre o par…',OX,462);
  }
});
deal();status();
}});
