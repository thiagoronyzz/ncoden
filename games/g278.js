/* NCODE N · 278 Hack do Elevador — suba sem ser visto! */
GREG(278,{
init(root,H){
let over=false,floor=1,seq=[],show=0,showT=0,input=[],det=0,phase='show';
const COLS=['#D94E34','#2E6E8A','#3E7C4F','#E8A33D'];
const hud=H.hud(root,[['a','ANDAR','1/3'],['dt','DETECÇÃO','0%']]);
const say=H.msg(root,'Repita a sequência nos painéis para subir! Erro = +25% detecção. 3 andares até o cofre!');
const o=H.cvs(root,460,300),x=o.x;
const brow=H.el('div','g-row',null,root);
function status(){hud.set('a',floor+'/3');hud.set('dt',(det|0)+'%');}
function newSeq(){
 seq=[];input=[];
 const n=3+floor;
 for(let i=0;i<n;i++)seq.push((Math.random()*4)|0);
 phase='show';show=0;showT=0;
 say('Andar '+floor+': memorize a sequência!');
}
function press(i){
 if(over||phase!=='go')return;
 H.sfx('tick');
 if(i===seq[input.length]){input.push(i);
  if(input.length>=seq.length){
   if(floor>=3){gameOver(true);return;}
   floor++;status();H.sfx('ok');
   newSeq();
  }
 }else{
  det+=25;H.sfx('bad');input=[];
  if(det>=100){gameOver(false);return;}
  say('Erro! +25% detecção. Tente de novo.');
 }
 status();
}
function gameOver(win){over=true;const sc=win?400+(100-det)*2:floor*80;H.score(sc);
H.done(win?{win:true,score:sc,title:'Acesso liberado!',sub:'Andar restrito alcançado.'}:{win:false,score:sc,title:'Rastreado!',sub:'O sistema te detectou no andar '+floor+'.'});}
COLS.forEach((c,i)=>{
 const b=H.el('button','g-card','■',brow);
 b.style.width='100px';b.style.height='70px';b.style.fontSize='30px';b.style.background='#222';
 b.addEventListener('click',()=>press(i));
 b.dataset.i=i;
});
function paintBtns(){
 brow.children.forEach(b=>{
  const i=+b.dataset.i;
  const lit=phase==='show'&&show<seq.length&&seq[show]===i&&showT<.5;
  b.style.background=lit?COLS[i]:'#222';
  b.innerHTML=lit?'■':'□';
 });
}
H.loop(dt=>{
 if(over)return;
 if(phase==='show'){
  showT+=dt;
  if(showT>.7){showT=0;show++;if(show>=seq.length){phase='go';say('Sua vez! Repita!');}}
  paintBtns();
 }
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,300);
 x.fillStyle='#EDE8DC';x.fillRect(150,20,160,260);
 x.strokeStyle='#181816';x.lineWidth=3;x.strokeRect(150,20,160,260);
 for(let f=3;f>=1;f--){
  const y=250-(f-1)*86;
  x.fillStyle=f===floor?'#C4D645':'#8A877C';
  x.beginPath();x.arc(190,y,16,0,7);x.fill();
  x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='center';
  x.fillText(f===3?'i:money':f,190,y+5);
 }
 x.fillStyle='#D94E34';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Andar '+floor+'/3',330,60);
 x.fillText('Detecção '+(det|0)+'%',330,90);
 x.fillStyle='#000';x.fillRect(330,100,100,12);
 x.fillStyle='#D94E34';x.fillRect(330,100,det,12);
 x.fillStyle='#E8A33D';x.font='13px system-ui';
 x.fillText(phase==='show'?'MEMORIZE…':'REPITA!',330,140);
 x.fillStyle='#fff';
 x.fillText('Progresso: '+input.length+'/'+seq.length,330,165);
});
newSeq();status();
}});
