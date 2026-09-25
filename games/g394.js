/* NCODE N · 394 Bolha no Limite — estoure no máximo! */
GREG(394,{
init(root,H){
let over=false,r=10,grow=true,round=0,score=0,sp=0;
const MAX=110;
const hud=H.hud(root,[['b','BOLHA','1/10'],['pt','PONTOS',0]]);
const say=H.msg(root,'A bolha cresce… e ESTOURA sozinha! Toque ESTOURAR o mais perto do máximo. 10 bolhas!');
const o=H.cvs(root,400,380),x=o.x;
H.btn(root,'ESTOURAR!',()=>{
 if(over)return;
 const p=r/MAX;
 if(p>.92){score+=100;H.sfx('ok');}
 else if(p>.75){score+=50;H.sfx('tick');}
 else H.sfx('bad');
 hud.set('pt',score);next();
},true);
function next(){
 round++;
 if(round>=10){gameOver();return;}
 hud.set('b',(round+1)+'/10');
 r=10;sp=40+Math.random()*50;
}
function gameOver(){over=true;H.score(score);
H.done({win:score>=700,score,title:score>=700?'Mestre das bolhas!':'Fim!',sub:score+'/1000 pontos.'});}
sp=50;
H.loop(dt=>{
 if(over)return;
 r+=sp*dt;
 if(r>=MAX){H.sfx('bad');say('Estourou sozinha!');next();return;}
 x.fillStyle='#BFD9E2';x.fillRect(0,0,400,380);
 x.fillStyle='rgba(255,255,255,.5)';x.beginPath();x.arc(200,190,r,0,7);x.fill();
 x.strokeStyle='#2E6E8A';x.lineWidth=3;x.stroke();
 x.strokeStyle='#D94E34';x.setLineDash([5,5]);
 x.beginPath();x.arc(200,190,MAX,0,7);x.stroke();x.setLineDash([]);
 x.fillStyle='#fff';x.beginPath();x.arc(200-r*.3,190-r*.3,8,0,7);x.fill();
});
}});
