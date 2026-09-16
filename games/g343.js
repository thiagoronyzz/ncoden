/* NCODE N · 343 Mergulho Profundo — fotografe o abismo! */
GREG(343,{
init(root,H){
let over=false,py=100,o2=100,t=0,photos=0;
const SP=[];
const KINDS=['🐙','🦑','🐡','🦈','🐋','🪼'];
for(let i=0;i<12;i++)SP.push({y:200+i*160,x:60+Math.random()*340,k:KINDS[i%6],got:false,ph:Math.random()*7});
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['f','FOTOS','0/6']]);
const say=H.msg(root,'Desça com ⬇️, suba com ⬆️! Perto da criatura, toque FOTOGRAFAR. 6 espécies diferentes! O₂ acaba = fim.');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.btn(root,'📸 Fotografar',()=>{
 if(over)return;
 const s=SP.find(q=>!q.got&&SP.indexOf(q)%2===0?false:!q.got&&Math.abs(py-q.y)<60);
 if(s){s.got=true;photos++;H.sfx('ok');hud.set('f',photos+'/6');
  if(photos>=6){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=photos*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'📸 Abismo documentado!',sub:'6 espécies fotografadas!'}:{win:false,score:sc,title:'Sem ar!',sub:photos+'/6 fotos. Suba para respirar? Não — seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(dn.ArrowUp||dn.KeyW)py-=160*dt;
 if(dn.ArrowDown||dn.KeyS)py+=160*dt;
 py=H.clamp(py,60,2000);
 o2-=dt*(2+py/500);
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 const cam=H.clamp(py-260,0,1560);
 const g=py/2000;
 x.fillStyle='rgb('+(20-g*15|0)+','+(60-g*50|0)+','+(90-g*70|0)+')';
 x.fillRect(0,0,460,520);
 SP.forEach(s=>{
  const sy=s.y-cam;
  if(sy<-30||sy>550)return;
  x.font='34px system-ui';x.textAlign='center';
  x.fillText(s.got?'✅':s.k,s.x+Math.sin(t+s.ph)*20,sy);
 });
 x.font='30px system-ui';x.fillText('🤿',230,py-cam+10);
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(o2|0)+'% · 📸 '+photos+'/6 · '+(py|0)+'m',12,26);
});
}});
