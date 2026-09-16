/* NCODE N · 329 Vazamento na Estação Espacial — repare! */
GREG(329,{
init(root,H){
let over=false,o2=100,t=0,fixed=0;
const LEAKS=[];
for(let i=0;i<6;i++)LEAKS.push({x:60+Math.random()*340,y:70+Math.random()*220,hp:2+((Math.random()*2)|0),id:i});
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['r','REPAROS','0/6']]);
const say=H.msg(root,'Toque nos vazamentos 💨 para reparar (2-3 toques)! Cada vazamento drena O₂. Zere os 6 antes do ar acabar!');
const o=H.cvs(root,460,340),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 LEAKS.forEach(l=>{
  if(l.hp>0&&Math.hypot(px-l.x,py-l.y)<30){
   l.hp--;H.sfx('tick');
   if(l.hp<=0){fixed++;H.sfx('ok');hud.set('r',fixed+'/6');}
   if(fixed>=6){gameOver(true);return;}
  }
 });
});
function gameOver(win){over=true;const sc=win?Math.max(200,500-(t|0)*4):fixed*50;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🛰️ Estação salva!',sub:'6 vazamentos selados!'}:{win:false,score:sc|0,title:'Sem oxigênio!',sub:fixed+'/6 reparos. Seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const open=LEAKS.filter(l=>l.hp>0).length;
 o2-=dt*(1+open*1.1);
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 x.fillStyle='#1C2430';x.fillRect(0,0,460,340);
 x.strokeStyle='#4A5A6A';x.lineWidth=3;
 x.strokeRect(30,50,400,260);
 LEAKS.forEach(l=>{
  if(l.hp<=0){x.font='20px system-ui';x.textAlign='center';x.fillText('✅',l.x,l.y);return;}
  x.font='26px system-ui';x.fillText('💨',l.x+Math.sin(t*6+l.id)*4,l.y);
  x.fillStyle='#fff';x.font='bold 12px system-ui';x.fillText('x'+l.hp,l.x,l.y+22);
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(o2|0)+'% · 🔧 '+fixed+'/6',14,30);
 x.fillStyle='#000';x.fillRect(14,36,200,10);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(14,36,200*Math.max(0,o2)/100,10);
});
}});
