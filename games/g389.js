/* NCODE N · 389 Torneira Cheia — até a borda! */
GREG(389,{
init(root,H){
let over=false,level=0,filling=false,round=0,score=0,sp=0;
const hud=H.hud(root,[['c','COPO','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'Segure ENCHER e solte BEM na linha verde! Passou = transborda. 5 copos!');
const o=H.cvs(root,400,420),x=o.x;
const fb=H.btn(root,'Segurar = ENCHER',()=>{},true);
fb.addEventListener('pointerdown',()=>{if(!over&&!filling)startFill();});
fb.addEventListener('pointerup',()=>{if(!over&&filling)stopFill();});
function startFill(){level=0;filling=true;sp=55+Math.random()*45;}
function stopFill(){
 filling=false;
 const err=Math.abs(level-85);
 if(err<4){score+=100;H.sfx('ok');say('Perfeito! +100');}
 else if(err<10){score+=50;H.sfx('tick');say('Quase! +50');}
 else{H.sfx('bad');say(err>0&&level>85?'Transbordou!':'Pouco demais!');}
 hud.set('pt',score);round++;
 if(round>=5)gameOver();
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=350,score,title:score>=350?'Barman preciso!':'Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;
 if(filling){level+=sp*dt;if(level>=100){stopFill();}}
 x.fillStyle=H.C.paper;x.fillRect(0,0,400,420);
 x.strokeStyle='#181816';x.lineWidth=5;
 x.strokeRect(140,60,120,300);
 x.fillStyle='#7FB3C8';
 const h=Math.min(100,level)/100*280;
 x.fillRect(145,355-h,110,h);
 x.strokeStyle='#3E7C4F';x.lineWidth=4;
 const ly=355-85/100*280;
 x.beginPath();x.moveTo(130,ly);x.lineTo(270,ly);x.stroke();
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Copo '+(round+1)+'/5 · '+score+' pts',12,28);
});
}});
