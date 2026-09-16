/* NCODE N · 310 Carrinho de Compras — descida maluca! */
GREG(310,{
init(root,H){
let over=false,px=230,dist=0,sp=200,lives=3,score=0,t=0;
const CARS=[];
for(let i=0;i<34;i++)CARS.push({x:50+Math.random()*360,y:-i*300-250,hit:false,lane:(Math.random()*3)|0});
const COINS=[];
for(let i=0;i<20;i++)COINS.push({x:50+Math.random()*360,y:-i*520-150,got:false});
const hud=H.hud(root,[['v','VIDAS',3],['pt','PONTOS',0]]);
const say=H.msg(root,'Desça o estacionamento! Desvie dos carros 🚗, pegue moedas 🪙. 3 batidas = fim. Meta: 500 pontos!');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(){over=true;const win=score>=500;H.score(score|0);
H.done(win?{win:true,score:score|0,title:'🛒 Descida radical!',sub:(score|0)+' pontos!'}:{win:false,score:score|0,title:'Carrinho quebrou!',sub:(score|0)+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0;
 sp=Math.min(380,sp+dt*8);
 if(L)px-=260*dt;if(R)px+=260*dt;
 px=H.clamp(px,44,416);
 dist+=sp*dt;score+=dt*15;
 CARS.forEach(c=>{
  const cy=c.y+dist;
  if(!c.hit&&Math.abs(cy-430)<30&&Math.abs(c.x-px)<34){
   c.hit=true;lives--;sp=140;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver();return;}
  }
 });
 COINS.forEach(c=>{
  const cy=c.y+dist;
  if(!c.got&&Math.abs(cy-430)<26&&Math.abs(c.x-px)<28){c.got=true;score+=40;H.sfx('ok');hud.set('pt',score|0);}
 });
 hud.set('pt',score|0);
 if(dist>=10400){gameOver();return;}
 x.fillStyle='#5A5A55';x.fillRect(0,0,460,520);
 x.strokeStyle='#E8A33D';x.lineWidth=3;
 for(let i=0;i<4;i++){const lx=60+i*113;x.beginPath();x.moveTo(lx,0);x.lineTo(lx,520);x.stroke();}
 CARS.forEach(c=>{
  const cy=c.y+dist;
  if(cy<-30||cy>550)return;
  x.font='30px system-ui';x.textAlign='center';x.fillText(c.hit?'💥':'🚗',c.x,cy+10);
 });
 COINS.forEach(c=>{
  const cy=c.y+dist;
  if(!c.got&&cy>-20&&cy<540){x.font='20px system-ui';x.fillText('🪙',c.x,cy+7);}
 });
 x.font='32px system-ui';x.fillText('🛒',px,442);
});
}});
