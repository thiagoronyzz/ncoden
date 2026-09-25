/* NCODE N · 289 Descida de Trenó — desvie no gelo! */
GREG(289,{
init(root,H){
let over=false,px=230,dist=0,sp=220,lives=3,t=0;
const OBS=[];
for(let i=0;i<40;i++)OBS.push({x:40+Math.random()*380,y:-i*260-300,k:Math.random()<.5?'i:pine':'i:box',hit:false});
const hud=H.hud(root,[['v','VIDAS',3],['d','DIST','0%']]);
const say=H.msg(root,'Desça até a base! ←→ desviam, ↓ freia. Bater tira vida e velocidade.');
const o=H.cvs(root,460,520),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(qx,qy)=>{tapS=qx<230?-1:1;tapT=.3;});
let tapS=0,tapT=0;
function gameOver(win){over=true;const sc=win?Math.max(200,700-(t|0)*8)+lives*60:dist/40|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'Descida limpa!',sub:t.toFixed(1)+'s com '+lives+' vidas.'}:{win:false,score:sc,title:'Trenó quebrado!',sub:'3 batidas. Freie nas curvas!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(tapT>0)tapT-=dt;else tapS=0;
 const L=(dn.ArrowLeft||dn.KeyA)||tapS<0,R=(dn.ArrowRight||dn.KeyD)||tapS>0,D=dn.ArrowDown||dn.KeyS;
 sp+=(((D?120:240))-sp)*1.5*dt;
 if(L)px-=230*dt;if(R)px+=230*dt;
 px=H.clamp(px,36,424);
 dist+=sp*dt;
 OBS.forEach(ob=>{
  const oy=ob.y+dist;
  if(!ob.hit&&Math.abs(oy-440)<26&&Math.abs(ob.x-px)<30){
   ob.hit=true;lives--;sp=90;H.sfx('bad');hud.set('v',lives);
   if(lives<=0){gameOver(false);return;}
  }
 });
 hud.set('d',Math.min(99,dist/10500*100|0)+'%');
 if(dist>=10500){gameOver(true);return;}
 x.fillStyle='#DCEEF5';x.fillRect(0,0,460,520);
 x.fillStyle='#fff';
 for(let i=0;i<30;i++){const wy=(i*89+dist)%560-20;x.fillRect((i*157)%440,wy,20,3);}
 x.fillStyle='#8A6A2F';x.fillRect(0,0,28,520);x.fillRect(432,0,28,520);
 OBS.forEach(ob=>{
  const oy=ob.y+dist;
  if(oy<-30||oy>550)return;
  x.font='26px system-ui';x.textAlign='center';
  x.fillText(ob.hit?'i:burst':ob.k,ob.x,oy+9);
 });
 x.font='32px system-ui';x.fillText('i:sled',px,452);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('i:heart'.repeat(Math.max(0,lives))+'  '+(dist/10500*100|0)+'%  '+sp.toFixed(0)+'km/h',12,26);
});
}});
