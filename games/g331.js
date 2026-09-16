/* NCODE N · 331 Controle de Pragas — defenda a fazenda! */
GREG(331,{
init(root,H){
let over=false,wave=0,crop=100,t=0,spawn=0,kills=0;
let pests=[];
const hud=H.hud(root,[['o','ONDA','0/6'],['l','LAVOURA',100]]);
const say=H.msg(root,'Esmague as pragas antes que cheguem à lavoura (base)! 6 ondas. Lavoura zera = fim!');
const o=H.cvs(root,460,420),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 for(let i=pests.length-1;i>=0;i--){
  const p=pests[i];
  if(Math.hypot(px-p.x,py-p.y)<24){pests.splice(i,1);kills++;H.sfx('ok');break;}
 }
});
function gameOver(win){over=true;const sc=kills*15+(win?250:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌾 Lavoura salva!',sub:kills+' pragas esmagadas!'}:{win:false,score:sc,title:'Lavoura devorada!',sub:'Onda '+wave+'/6. Seja mais rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(!pests.length){
  if(wave>=6){gameOver(true);return;}
  wave++;hud.set('o',wave+'/6');
  const kinds=['🦗','🐀','🐦‍⬛'];
  for(let i=0;i<4+wave*2;i++)pests.push({x:Math.random()*440+10,y:-i*46-Math.random()*60,k:kinds[i%3],sp:40+wave*10+Math.random()*20});
  say('Onda '+wave+'/6!');
 }
 spawn+=dt;
 pests.forEach(p=>{p.y+=p.sp*dt;});
 pests.filter(p=>p.y>360).forEach(p=>{pests.splice(pests.indexOf(p),1);crop-=8;H.sfx('bad');hud.set('l',Math.max(0,crop|0));});
 if(crop<=0){gameOver(false);return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,460,420);
 x.fillStyle='#3E7C4F';x.fillRect(0,360,460,60);
 x.font='18px system-ui';x.textAlign='center';
 for(let i=0;i<23;i++)x.fillText(crop>0?'🌽':'🥀',10+i*20,398);
 pests.forEach(p=>{x.font='24px system-ui';x.fillText(p.k==='🐦‍⬛'?'🐦':p.k,p.x,p.y);});
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Onda '+wave+'/6 · 🌽 '+(crop|0)+'% · ☠️ '+kills,12,26);
});
}});
