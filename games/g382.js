/* NCODE N · 382 Pêndulo no Alvo — solte no ponto! */
GREG(382,{
init(root,H){
let over=false,a=1,av=0,round=0,hits=0,released=false,ba=null;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['a','ACERTOS','0/5']]);
const say=H.msg(root,'O pêndulo balança! Toque SOLTAR quando passar pelo CENTRO para acertar o alvo. 5 tentativas, 3+ acertos!');
const o=H.cvs(root,460,400),x=o.x;
H.btn(root,'SOLTAR!',()=>{
 if(over||released)return;
 released=true;
 const err=Math.abs(a);
 ba={x:230+Math.sin(a)*220,y:120+Math.cos(a)*220,vy:0};
 if(err<.18){hits++;H.sfx('ok');say('ACERTOU!');}
 else{H.sfx('bad');say('✕ Errou por '+(err*57|0)+'°!');}
 hud.set('a',hits+'/5');
 round++;
 H.after(1200,()=>{
  if(over)return;
  if(round>=5){gameOver();return;}
  a=1;av=0;released=false;ba=null;
  hud.set('t',(round+1)+'/5');
 });
},true);
function gameOver(){over=true;H.score(hits*100);
H.done({win:hits>=3,score:hits*100,title:hits>=3?'Mira de mestre!':'Fim!',sub:hits+'/5 acertos.'});}
H.loop(dt=>{
 if(over)return;
 if(!released){av+=-9.8/2.2*Math.sin(a)*dt;a+=av*dt;}
 else if(ba){ba.vy+=900*dt;ba.y+=ba.vy*dt;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,400);
 x.fillStyle='#D94E34';x.beginPath();x.arc(230,360,26,0,7);x.fill();
 x.fillStyle='#FAF7F0';x.beginPath();x.arc(230,360,14,0,7);x.fill();
 x.fillStyle='#D94E34';x.beginPath();x.arc(230,360,6,0,7);x.fill();
 const px=230+Math.sin(a)*220,py=120+Math.cos(a)*220;
 x.strokeStyle='#181816';x.lineWidth=4;
 x.beginPath();x.moveTo(230,120);x.lineTo(released?230:px,released?120:py);x.stroke();
 x.fillStyle='#181816';x.fillRect(220,112,20,10);
 if(!released){x.fillStyle='#2E6E8A';x.beginPath();x.arc(px,py,16,0,7);x.fill();}
 else if(ba&&ba.y<380){x.fillStyle='#2E6E8A';x.beginPath();x.arc(ba.x,Math.min(360,ba.y),14,0,7);x.fill();}
 x.strokeStyle='#C4D645';x.lineWidth=2;x.setLineDash([5,5]);
 x.beginPath();x.moveTo(230,120);x.lineTo(230,360);x.stroke();x.setLineDash([]);
});
}});
