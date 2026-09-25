/* NCODE N · 280 Cofre de Ouvido — ouça os cliques! */
GREG(280,{
init(root,H){
let over=false,dial=0,nums=[],found=0,time=90;
for(let i=0;i<3;i++)nums.push((Math.random()*40)|0);
const hud=H.hud(root,[['n','NÚMEROS','0/3'],['tp','TEMPO',90]]);
const say=H.msg(root,'Gire o disco e sinta os cliques! Perto do número, o medidor sobe e o som acelera. Trave os 3 números antes do guarda voltar!');
const o=H.cvs(root,460,360),x=o.x;
const brow=H.el('div','g-row',null,root);
H.btn(brow,'◀ −1',()=>turn(-1),false);
H.btn(brow,'−5 ◀◀',()=>turn(-5),false);
H.btn(brow,'Travar número',lock,true);
H.btn(brow,'▶▶ +5',()=>turn(5),false);
H.btn(brow,'+1 ▶',()=>turn(1),false);
function target(){return nums[found];}
function dist(){
 let d=Math.abs(dial-target());
 return Math.min(d,40-d);
}
function turn(d){
 if(over)return;
 dial=(dial+d+40)%40;H.sfx('tick');
}
function lock(){
 if(over||found>=3)return;
 if(dial===target()){found++;H.sfx('ok');hud.set('n',found+'/3');
  if(found>=3){gameOver(true);return;}
  say('✔ Número '+(found)+'/3 travado! Ache o próximo…');
 }else{time-=8;H.sfx('bad');say('✕ Não é esse! −8s. Chegue BEM perto (medidor cheio).');}
}
function gameOver(win){over=true;const sc=win?300+Math.ceil(time)*3:found*70;H.score(sc);
H.done(win?{win:true,score:sc,title:'Ouvido de ouro!',sub:'Cofre aberto com '+Math.ceil(time)+'s de folga.'}:{win:false,score:sc,title:'O guarda voltou!',sub:found+'/3 números. Siga o medidor!'});}
H.loop(dt=>{
 if(over)return;
 time-=dt;
 if(time<=0){gameOver(found>=3);return;}
 hud.set('tp',Math.ceil(time));
 const d=dist(),hot=1-Math.min(1,d/8);
 x.fillStyle='#2A2620';x.fillRect(0,0,460,360);
 x.fillStyle='#4A4A44';x.beginPath();x.arc(150,160,110,0,7);x.fill();
 x.strokeStyle='#E8A33D';x.lineWidth=4;x.stroke();
 for(let i=0;i<40;i++){
  const a=i/40*6.283-Math.PI/2;
  const tx2=150+Math.cos(a)*92,ty2=160+Math.sin(a)*92;
  x.fillStyle=i%5===0?'#fff':'#8A877C';x.font=i%5===0?'bold 11px system-ui':'8px system-ui';x.textAlign='center';
  x.fillText(i,tx2,ty2+4);
 }
 const da=dial/40*6.283-Math.PI/2;
 x.strokeStyle='#D94E34';x.lineWidth=5;
 x.beginPath();x.moveTo(150,160);x.lineTo(150+Math.cos(da)*80,160+Math.sin(da)*80);x.stroke();
 x.fillStyle='#181816';x.beginPath();x.arc(150,160,14,0,7);x.fill();
 x.fillStyle='#fff';x.font='bold 26px system-ui';x.fillText(dial,150,220+70);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Números: '+found+'/3',300,80);
 x.fillText('i:gauge'+Math.ceil(time)+'s',300,105);
 x.fillText('SINAL:',300,150);
 for(let i=0;i<10;i++){
  x.fillStyle=i/10<hot?(hot>.85?'#C4D645':'#E8A33D'):'#4A4A44';
  x.fillRect(300+i*15,160,12,40);
 }
 if(hot>.85){x.fillStyle='#C4D645';x.font='bold 16px system-ui';x.fillText('CLIQUE!',300,230);}
 x.fillStyle='#8A877C';x.font='12px system-ui';
 x.fillText('Gire e observe o sinal.',300,260);
});
}});
