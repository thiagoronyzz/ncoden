/* NCODE N · 393 Sopro da Vela — apague no pico! */
GREG(393,{
init(root,H){
let over=false,f=0,t=0,round=0,score=0;
const hud=H.hud(root,[['v','VELA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A chama oscila! SOPRE quando ela estiver no ponto MAIS ALTO. 5 velas, 3+ apagadas!');
const o=H.cvs(root,400,380),x=o.x;
H.btn(root,'💨 SOPRAR!',()=>{
 if(over)return;
 if(f>.8){score+=100;H.sfx('ok');say('🕯️ Apagada! +100');}
 else{H.sfx('bad');say('❌ A chama resistiu…');}
 hud.set('pt',score);round++;
 if(round>=5){gameOver();return;}
 hud.set('v',(round+1)+'/5');t=0;
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'💨 Sopro certeiro!':'💨 Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 f=(Math.sin(t*3.1)*.5+.5)*.7+(Math.sin(t*7.3)*.5+.5)*.3;
 x.fillStyle='#1C1C24';x.fillRect(0,0,400,380);
 x.fillStyle='#EDE8DC';x.fillRect(180,220,40,120);
 const fh=40+f*90;
 x.fillStyle='#E8A33D';
 x.beginPath();x.ellipse(200,220-fh/2,22,fh/2,0,0,7);x.fill();
 x.fillStyle='#D94E34';
 x.beginPath();x.ellipse(200,220-fh/4,10,fh/4,0,0,7);x.fill();
 x.strokeStyle='#C4D645';x.lineWidth=2;x.setLineDash([4,4]);
 x.beginPath();x.moveTo(120,220-(40+.8*90));x.lineTo(280,220-(40+.8*90));x.stroke();x.setLineDash([]);
 x.fillStyle='#C4D645';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('SOPRE ACIMA DA LINHA',120,110);
});
}});
