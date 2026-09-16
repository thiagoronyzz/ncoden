/* NCODE N · 292 BMX Flatland — equilíbrio parado! */
GREG(292,{
init(root,H){
let over=false,bal=0,score=0,t=0,time=60,trick=null,trickT=0;
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',60]]);
const say=H.msg(root,'Equilibre a bike parada com ⬅️➡️! No verde, faça manobras para pontuar. Caiu 3 vezes = fim. Meta: 600!');
const o=H.cvs(root,460,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
let falls=0;
[['Tailwhip',100],['Barspin',150],['Manual',80]].forEach(tr=>{
 H.btn(root,'🚲 '+tr[0]+' ('+tr[1]+')',()=>{
  if(over||trick)return;
  if(Math.abs(bal)<25){score+=tr[1];trick=tr[0]+' +'+tr[1];trickT=1;H.sfx('ok');}
  else{score+=10;trick='fraco +10';trickT=1;H.sfx('bad');}
  hud.set('pt',score);
 },false);
});
function gameOver(win){over=true;H.score(score);
H.done(win?{win:true,score,title:'🚲 Mestre do flatland!',sub:score+' pontos!'}:{win:false,score,title:'Fim!',sub:score+'/600 pontos. Faça truques no verde!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 if(trickT>0)trickT-=dt;else trick=null;
 bal+=Math.sin(t*1.7)*30*dt+Math.sin(t*4.3)*14*dt;
 if(dn.ArrowLeft||dn.KeyA)bal-=70*dt;
 if(dn.ArrowRight||dn.KeyD)bal+=70*dt;
 bal=H.clamp(bal,-100,100);
 if(Math.abs(bal)>=100){falls++;bal=0;H.sfx('bad');say('💥 Queda '+falls+'/3!');if(falls>=3){gameOver(score>=600);return;}}
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(score>=600);return;}
 x.fillStyle=H.C.paper;x.fillRect(0,0,460,340);
 x.fillStyle='#8A877C';x.fillRect(0,260,460,80);
 x.save();x.translate(230,220);x.rotate(bal/220);
 x.font='60px system-ui';x.textAlign='center';x.fillText('🚲',0,20);x.restore();
 x.fillStyle='#181816';x.fillRect(80,40,300,18);
 x.fillStyle='#3E7C4F';x.fillRect(205,40,50,18);
 x.fillStyle=Math.abs(bal)>60?'#D94E34':'#E8A33D';
 x.fillRect(230+bal*1.4-5,34,10,30);
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(score+' pts · ⏱️'+Math.ceil(time)+'s · quedas '+falls+'/3 · meta 600',14,90);
 if(trick){x.font='bold 22px system-ui';x.textAlign='center';x.fillText(trick,230,130);}
});
}});
