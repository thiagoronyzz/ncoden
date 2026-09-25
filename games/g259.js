/* NCODE N · 259 Paciência Aranha — limpe as 8 sequências! */
GREG(259,{
init(root,H){
const RL={1:'A',11:'J',12:'Q',13:'K'};
function rn(r){return RL[r]||String(r);}
let over=false,cols=[],stock=[],sel=null,moves=0,score=500,seqs=0,seq=0;
let msg='Monte sequências descendentes K→A! Coluna vazia aceita qualquer carta.',hintM=null,hintT=0;
const hud=H.hud(root,[['sq','SEQUÊNCIAS','0/8'],['mv','LANCES',0],['pt','PONTOS',500],['st','MONTE',50]]);
const say=H.msg(root,'Aranha 1 naipe! Toque numa carta para selecionar a sequência e toque na coluna destino. Complete K→A para limpar. Completar 8 vence!');
const board=H.el('div','g-row',null,root);
board.style.alignItems='flex-start';
const brow=H.el('div','g-row',null,root);
function status(){hud.set('sq',seqs+'/8');hud.set('mv',moves);hud.set('pt',score);hud.set('st',stock.length);say(msg);}
function shuffle(a){for(let i=a.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=a[i];a[i]=a[j];a[j]=t;}return a;}
function deal(){
  const d=[];
  for(let s=0;s<8;s++)for(let r=1;r<=13;r++)d.push({r,up:false});
  shuffle(d);
  cols=[];
  for(let c=0;c<10;c++){
    cols.push([]);
    const n=c<4?6:4;
    for(let k=0;k<n;k++)cols[c].push(d.pop());
    cols[c][cols[c].length-1].up=true;
  }
  stock=d;
}
function runValid(c,i){
  const col=cols[c];
  if(i<0||i>=col.length||!col[i].up)return false;
  for(let k=i;k<col.length-1;k++)if(col[k].r!==col[k+1].r+1)return false;
  return true;
}
function canPlace(t,runFrom,runCard){
  const col=cols[t];
  if(!col.length){
    // mover coluna inteira para outro vazio é inútil
    if(runFrom!=null&&cols[runFrom].length>0&&sel!=null&&sel.i===0)return false;
    return true;
  }
  const top=col[col.length-1];
  return top.up&&top.r===runCard+1;
}
function clickCard(c,i){
  if(over)return;
  hintM=null;
  if(sel){
    if(sel.c===c&&sel.i===i){sel=null;H.sfx('tick');paint();return;}
    if(c!==sel.c){
      const run=cols[sel.c].slice(sel.i);
      if(canPlace(c,sel.c,run[0].r)){
        cols[sel.c]=cols[sel.c].slice(0,sel.i);
        run.forEach(k=>cols[c].push(k));
        const sc=cols[sel.c];
        if(sc.length&&!sc[sc.length-1].up)sc[sc.length-1].up=true;
        sel=null;moves++;score--;H.sfx('tick');
        msg='Boa! '+moves+' lances.';
        checkComplete(c);paint();
        if(!over&&stock.length===0&&!legalMoves())gameOver(false);
        else status();
        return;
      }
    }
    sel=null;
  }
  if(runValid(c,i)){sel={c,i};H.sfx('tick');}
  else if(cols[c][i]&&cols[c][i].up){H.sfx('bad');msg='Só dá para mover sequência descendente revelada!';status();}
  paint();
}
function checkComplete(c){
  const col=cols[c];
  if(col.length<13)return;
  const top=col.slice(col.length-13);
  for(let k=0;k<13;k++){
    if(!top[k].up||top[k].r!==13-k)return;
  }
  cols[c]=col.slice(0,col.length-13);
  const nc=cols[c];
  if(nc.length&&!nc[nc.length-1].up)nc[nc.length-1].up=true;
  seqs++;score+=100;
  H.sfx('ok');
  msg='Sequência K→A completa! +100 ('+seqs+'/8)';
  if(seqs>=8){paint();gameOver(true);}
}
function legalMoves(){
  for(let c=0;c<10;c++){
    for(let i=0;i<cols[c].length;i++){
      if(!runValid(c,i))continue;
      for(let t=0;t<10;t++){
        if(t===c)continue;
        const save=sel;sel={c,i};
        const ok=canPlace(t,c,cols[c][i].r);
        sel=save;
        if(ok)return{c,i,t};
      }
    }
  }
  return null;
}
function dealRow(){
  if(over)return;
  hintM=null;
  if(stock.length<10){H.sfx('bad');msg='O monte precisa de 10 cartas para distribuir!';status();return;}
  if(cols.some(c=>!c.length)){H.sfx('bad');msg='Preencha as colunas vazias antes de distribuir!';status();return;}
  for(let c=0;c<10;c++){const k=stock.pop();k.up=true;cols[c].push(k);}
  moves++;score--;H.sfx('tick');
  msg='Nova fileira! ('+stock.length+' restantes)';
  for(let c=0;c<10;c++){checkComplete(c);if(over)return;}
  paint();status();
}
function hint(){
  if(over)return;
  const m=legalMoves();
  if(m){hintM=m;hintT=6;msg='Tente mover a sequência de '+rn(cols[m.c][m.i].r)+' para a coluna '+(m.t+1)+'.';H.sfx('tick');}
  else{msg=stock.length?'Sem jogadas — distribua!':'Sem jogadas e sem monte!';H.sfx('bad');}
  status();
}
function gameOver(win){
  over=true;
  score=Math.max(0,score+(win?Math.max(0,800-moves):0));
  H.score(score);
  H.done(win?{win:true,score,title:'Aranha vencida!',sub:'8 sequências · '+moves+' lances · '+score+' pontos.'}
    :{win:false,score,title:'Teia travada!',sub:seqs+'/8 sequências · '+moves+' lances · revele cartas cedo!'});
}
function paint(){
  board.innerHTML='';
  cols.forEach((col,c)=>{
    const cd=H.el('div','g-col',null,board);
    cd.style.minWidth='46px';cd.style.gap='0';
    if(!col.length){
      const s=H.el('button','g-cell','＋',cd);
      s.style.minHeight='60px';s.style.opacity='.5';
      s.addEventListener('click',()=>clickEmpty(c));
    }
    col.forEach((k,i)=>{
      const inSel=sel&&sel.c===c&&i>=sel.i;
      const inHint=hintM&&((hintM.c===c&&i>=hintM.i)||(hintM.t===c&&i===col.length-1))&&hintT>0;
      const b=H.el('button','g-chip',k.up?rn(k.r)+'♠':'▓▓',cd);
      b.style.fontSize='12px';b.style.padding='3px 2px';
      if(!k.up){b.style.background='#D94E34';b.style.color='#FAF7F0';b.style.minHeight='14px';}
      else b.style.minHeight='30px';
      if(inSel)b.style.outline='3px solid #E8A33D';
      if(inHint)b.style.outline='3px solid #C4D645';
      b.addEventListener('click',()=>clickCard(c,i));
    });
  });
  brow.innerHTML='';
  const sb=H.btn(brow,'Distribuir ('+stock.length+')',dealRow,false);
  if(!stock.length)sb.disabled=true;
  H.btn(brow,'Dica',hint,false);
}
function clickEmpty(c){
  if(over||!sel||sel.c===c)return;
  clickCard(c,cols[c].length);
}
H.every(500,()=>{
  if(hintT>0){hintT-=.5;if(hintT<=0){hintM=null;paint();}}
});
deal();paint();status();
}});
