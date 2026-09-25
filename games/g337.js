/* NCODE N · 337 Ponte Caindo — resgate os carros! */
GREG(337,{
init(root,H){
let over=false,t=0,saved=0;
const CARS=[];
for(let i=0;i<6;i++)CARS.push({x:60+i*62,y:200,ttl:25+i*14,saved:false,gone:false});
const hud=H.hud(root,[['s','SALVOS','0/6']]);
const say=H.msg(root,'Toque nos carros para guiá-los para fora antes que caiam! Salve 5 de 6!');
const o=H.cvs(root,460,340),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 CARS.forEach(c=>{
  if(!c.saved&&!c.gone&&Math.hypot(px-c.x,py-c.y)<30){
   c.saved=true;saved++;H.sfx('ok');hud.set('s',saved+'/6');
   if(saved>=5){gameOver(true);return;}
  }
 });
});
function gameOver(win){over=true;const sc=saved*70+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Resgate total!',sub:saved+' carros salvos!'}:{win:false,score:sc,title:'A ponte caiu!',sub:saved+'/5 salvos. Seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 CARS.forEach(c=>{
  if(c.saved||c.gone)return;
  c.ttl-=dt;
  if(c.ttl<=0){c.gone=true;H.sfx('bad');}
 });
 if(CARS.every(c=>c.saved||c.gone)){gameOver(saved>=5);return;}
 x.fillStyle='#9AD0E8';x.fillRect(0,0,460,340);
 x.fillStyle='#2E6E8A';x.fillRect(0,240,460,100);
 x.fillStyle='#8A877C';x.fillRect(30,220,400,20);
 x.fillStyle='#3E7C4F';x.fillRect(0,220,30,20);x.fillRect(430,220,30,20);
 CARS.forEach(c=>{
  if(c.saved){x.font='22px system-ui';x.textAlign='center';x.fillText('i:car',12+saved*4,210);return;}
  if(c.gone){return;}
  x.font='26px system-ui';x.textAlign='center';x.fillText('i:car',c.x,c.y+8+Math.sin(t*10+c.x)*2);
  x.fillStyle='#000';x.fillRect(c.x-20,c.y-26,40,6);
  x.fillStyle=c.ttl<8?'#D94E34':'#E8A33D';x.fillRect(c.x-20,c.y-26,40*Math.max(0,c.ttl/39),6);
 });
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('i:car'+saved+'/5 salvos',12,28);
});
}});
