/* NCODE N · 383 Brecha no Trânsito — atravesse correndo! */
GREG(383,{
init(root,H){
let over=false,lane=0,px=40,t=0,lives=3,cross=0;
const LANES=[];
for(let i=0;i<5;i++){LANES.push({y:80+i*70,sp:(120+i*40)*(i%2?-1:1),cars:[]});LANES[i].cars.push(Math.random()*500,Math.random()*500+300);}
const hud=H.hud(root,[['v','VIDAS',3],['t','TRAVESSIAS','0/3']]);
const say=H.msg(root,'Toque CORRER para avançar 1 faixa entre os carros! Atravesse as 5 faixas, 3 vezes. 3 vidas!');
const o=H.cvs(root,560,460),x=o.x;
H.btn(root,'CORRER 1 faixa!',()=>{
 if(over)return;
 lane++;H.sfx('tick');
 const L=LANES[lane-1];
 if(L&&L.cars.some(cx=>Math.abs(cx-px)<44)){lives--;H.sfx('bad');hud.set('v',lives);lane=0;if(lives<=0){gameOver(false);return;}}
 if(lane>=5){lane=0;cross++;H.sfx('ok');hud.set('t',cross+'/3');px=40+Math.random()*480;if(cross>=3){gameOver(true);return;}}
},true);
function gameOver(win){over=true;H.score(cross*120+lives*50);
H.done({win:win,score:cross*120+lives*50,title:win?'Atravessou tudo!':'Atropelado!',sub:cross+'/3 travessias.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 LANES.forEach(L=>{L.cars=L.cars.map(cx=>{cx+=L.sp*dt;if(cx>620)cx=-60;if(cx<-60)cx=620;return cx;});});
 x.fillStyle='#3A3A45';x.fillRect(0,0,560,460);
 x.fillStyle='#3E7C4F';x.fillRect(0,0,560,50);x.fillRect(0,410,560,50);
 LANES.forEach((L,i)=>{
  x.fillStyle='#E8A33D';
  for(let s=0;s<10;s++)x.fillRect(s*60,72+i*70,30,4);
  L.cars.forEach(cx=>{x.font='30px system-ui';x.textAlign='center';x.fillText('i:car',cx,L.y+10);});
 });
 const py=435-lane*78;
 x.font='28px system-ui';x.textAlign='center';x.fillText('i:walk',px,py);
});
}});
