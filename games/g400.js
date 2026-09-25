/* NCODE N · 400 Eclipse Solar — alinhe a lua! */
GREG(400,{
init(root,H){
let over=false,a=0,sp=1,round=0,score=0,t=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'A lua orbita! Toque ALINHAR quando ela cobrir BEM o sol (topo). A cada tentativa, mais rápido. 5 tentativas!');
const o=H.cvs(root,440,440),x=o.x;
H.btn(root,'ALINHAR!',()=>{
 if(over)return;
 let d=Math.abs(((a%(Math.PI*2))+Math.PI*2)%(Math.PI*2)-Math.PI*1.5);
 d=Math.min(d,Math.PI*2-d);
 if(d<.12){score+=100;H.sfx('ok');say('ECLIPSE TOTAL! +100');}
 else if(d<.3){score+=50;H.sfx('tick');say('Parcial! +50');}
 else{H.sfx('bad');say('✕ Passou longe!');}
 hud.set('pt',score);round++;sp+=.35;
 if(round>=5){gameOver();return;}
 hud.set('t',(round+1)+'/5');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'Astrônomo supremo!':'Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 a+=sp*dt;
 x.fillStyle='#0C0C18';x.fillRect(0,0,440,440);
 x.strokeStyle='#3A3A45';x.lineWidth=2;
 x.beginPath();x.arc(220,220,130,0,7);x.stroke();
 x.fillStyle='#E8A33D';x.beginPath();x.arc(220,90,44,0,7);x.fill();
 x.fillStyle='#E8C86B';x.beginPath();x.arc(220,90,34,0,7);x.fill();
 const mx=220+Math.cos(a)*130,my=220+Math.sin(a)*130;
 x.fillStyle='#C9C9D4';x.beginPath();x.arc(mx,my,40,0,7);x.fill();
 x.fillStyle='#8A877C';x.beginPath();x.arc(mx-10,my-8,10,0,7);x.arc(mx+12,my+10,7,0,7);x.fill();
});
}});
