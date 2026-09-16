/* NCODE N · 362 Desenho Rápido — rabisque e adivinhem! */
GREG(362,{
init(root,H){
const WORDS=['gato','casa','sol','peixe','árvore','carro','flor','barco','lua','óculos'];
let over=false,round=0,score=0,time=45,strokes=[],cur=null;
const hud=H.hud(root,[['r','RODADA','1/4'],['pt','PONTOS',0]]);
const say=H.msg(root,'Desenhe a palavra arrastando o dedo! Seu time adivinha. 4 rodadas de 45s!');
const o=H.cvs(root,460,340),x=o.x;
const ptr=H.ptr(o);
const wd=H.el('div','g-msg','',root);
const brow=H.el('div','g-row',null,root);
const words=WORDS.slice().sort(()=>Math.random()-.5).slice(0,4);
let wasDown=false;
function show(){
 if(round>=4){gameOver();return;}
 time=45;strokes=[];
 hud.set('r',(round+1)+'/4');
 wd.innerHTML='✏️ DESENHE: <b style="font-size:28px">'+words[round]+'</b>';
 brow.innerHTML='';
 H.btn(brow,'🧹 Limpar',()=>{strokes=[];H.sfx('tick');},false);
 H.btn(brow,'✅ Adivinharam!',()=>{score+=100+Math.ceil(time)*2;round++;H.sfx('ok');hud.set('pt',score);show();},true);
 H.btn(brow,'⏭️ Pular',()=>{round++;H.sfx('bad');show();},false);
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'🎨 Artista veloz!':'🎨 Fim!',sub:score+' pontos.'});}
H.loop(dt=>{
 if(over)return;
 time-=dt;
 if(time<=0){round++;show();return;}
 if(ptr.down&&!wasDown)cur=[];
 if(ptr.down&&cur)cur.push([ptr.x,ptr.y]);
 if(!ptr.down&&wasDown&&cur&&cur.length){strokes.push(cur);cur=null;}
 wasDown=ptr.down;
 x.fillStyle='#FAF7F0';x.fillRect(0,0,460,340);
 x.strokeStyle='#181816';x.lineWidth=4;x.lineCap='round';
 strokes.forEach(s=>{x.beginPath();s.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();});
 if(cur&&cur.length){x.beginPath();cur.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();}
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(words[round]+' · ⏱️'+Math.ceil(time)+'s · '+score+' pts',12,28);
});
show();
}});
