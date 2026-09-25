/* NCODE N · 335 Poço Envenenado — água pura pra vila! */
GREG(335,{
init(root,H){
let over=false,quota=0,t=0,time=120;
const WELLS=[];
for(let i=0;i<6;i++)WELLS.push({x:50+(i%3)*150,y:100+((i/3)|0)*120,pois:Math.random()<.5,tested:false,pure:false});
const hud=H.hud(root,[['q','COTA','0/4'],['tp','TEMPO',120]]);
const say=H.msg(root,'1º toque TESTA o poço, 2º toque PURIFICA (se sujo) ou COLETA (se limpo)! Entregue 4 águas puras em 2 min!');
const o=H.cvs(root,480,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 WELLS.forEach(w=>{
  if(Math.hypot(px-w.x-40,py-w.y-35)<55){
   if(w.pure){H.sfx('bad');return;}
   if(!w.tested){w.tested=true;H.sfx('tick');}
   else if(w.pois){w.pois=false;H.sfx('ok');}
   else{w.pure=true;quota++;H.sfx('ok');hud.set('q',quota+'/4');}
   if(quota>=4){gameOver(true);return;}
  }
 });
});
function gameOver(win){over=true;const sc=quota*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Vila salva!',sub:'4 águas puras entregues!'}:{win:false,score:sc,title:'Tempo esgotado!',sub:quota+'/4 águas. Teste, purifique, colete!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(quota>=4);return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,480,360);
 WELLS.forEach(w=>{
  x.fillStyle='#8A6A2F';x.fillRect(w.x,w.y,80,60);
  x.fillStyle='#4A2F1B';x.fillRect(w.x+10,w.y+10,60,25);
  x.font='16px system-ui';x.textAlign='center';
  if(w.pure)x.fillText('i:check',w.x+40,w.y+75);
  else if(!w.tested)x.fillText('i:question',w.x+40,w.y+75);
  else if(w.pois)x.fillText('i:skull',w.x+40,w.y+75);
  else x.fillText('i:drop',w.x+40,w.y+75);
 });
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('i:drop'+quota+'/4 · '+Math.ceil(time)+'s',12,28);
});
}});
