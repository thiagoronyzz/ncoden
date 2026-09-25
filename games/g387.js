/* NCODE N · 387 Porta Giratória — entre no giro! */
GREG(387,{
init(root,H){
let over=false,a=0,round=0,score=0,try2=false,pa=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A porta gira! Toque ENTRAR quando a abertura passar na SUA frente (embaixo). 5 tentativas!');
const o=H.cvs(root,400,400),x=o.x;
H.btn(root,'ENTRAR!',()=>{
 if(over||try2)return;
 try2=true;pa=a;
 let d=Math.abs(((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2)-Math.PI/2);
 d=Math.min(d,Math.PI*2-d);
 if(d<.3){score+=100;H.sfx('ok');say('✔ Entrou! +100');}
 else{H.sfx('bad');say('✕ Bateu na porta!');}
 hud.set('pt',score);
 round++;
 H.after(1100,()=>{if(over)return;if(round>=5){gameOver();return;}try2=false;hud.set('t',(round+1)+'/5');});
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'Entrada triunfal!':'Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;
 if(!try2)a+=dt*1.6;
 x.fillStyle=H.C.paper;x.fillRect(0,0,400,400);
 x.strokeStyle='#181816';x.lineWidth=6;
 x.beginPath();x.arc(200,190,110,0,7);x.stroke();
 for(let i=0;i<3;i++){
  const aa=a+i*2.094;
  x.strokeStyle='#8A6A2F';x.lineWidth=8;
  x.beginPath();x.moveTo(200,190);x.lineTo(200+Math.cos(aa)*105,190+Math.sin(aa)*105);x.stroke();
 }
 x.fillStyle='#3E7C4F';x.fillRect(170,300,60,60);
 x.font='30px system-ui';x.textAlign='center';x.fillText('i:walk',200,345);
 if(try2){x.font='40px system-ui';x.fillText(score%100===0&&round>0?'i:check':'i:burst',200,120);}
});
}});
