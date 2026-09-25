/* NCODE N · 282 Arrancada — troque no verde! */
GREG(282,{
init(root,H){
let over=false,rpm=0,gear=1,dist=0,rdist=0,t=0,red=0,go=false,cd=3;
const hud=H.hud(root,[['m','MARCHA',1],['d','DIST','0m']]);
const say=H.msg(root,'Segure ACELERAR para subir o giro e troque no VERDE! Vermelho demais quebra o motor. 400m contra o rival!');
const o=H.cvs(root,460,340),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&(c==='Space'||c==='Enter'))shift();});
H.btn(root,'↑ TROCAR MARCHA (Espaço)',shift,true);
const acc=H.btn(root,'● Segurar = ACELERAR',()=>{},false);
acc.addEventListener('pointerdown',()=>{dn.acc=true;});
acc.addEventListener('pointerup',()=>{dn.acc=false;});
function shift(){
 if(over||!go)return;
 if(rpm>6.2&&rpm<8){gear=Math.min(5,gear+1);rpm=3;H.sfx('ok');}
 else if(rpm>=8){H.sfx('bad');}
 else{H.sfx('tick');}
}
function gameOver(win){over=true;const sc=win?Math.max(150,500-(t|0)*8):dist|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'Arrancada vencida!',sub:'400m em '+t.toFixed(2)+'s.'}:{win:false,score:sc,title:'Rival venceu!',sub:'Troque sempre no verde!'});}
H.loop(dt=>{
 if(over)return;
 if(cd>0){cd-=dt;if(cd<=0){go=true;say('FOI! ●');} }
 else t+=dt;
 const th=dn.acc||dn.ArrowUp||dn.KeyW;
 if(go&&th)rpm+=dt*(9-gear);
 else rpm-=dt*4;
 rpm=H.clamp(rpm,0,10);
 if(rpm>=8.6)red+=dt;else red=Math.max(0,red-dt*2);
 if(red>1.2){gameOver(false);return;}
 const sp=go?(gear*14+rpm*4)*(red>.4?.6:1):0;
 dist+=sp*dt;
 rdist+=go?(62+t*1.5)*dt:0;
 hud.set('m',gear);hud.set('d',(dist|0)+'m');
 if(dist>=400){gameOver(true);return;}
 if(rdist>=400){gameOver(false);return;}
 x.fillStyle='#2A2A33';x.fillRect(0,0,460,340);
 x.fillStyle='#3A3A45';x.fillRect(0,120,460,140);
 x.fillStyle='#E8A33D';
 for(let i=0;i<12;i++)x.fillRect((i*60-(dist*2%60)),198,30,5);
 x.font='34px system-ui';x.textAlign='center';
 x.fillText('i:car',60+(dist/400)*340,165);
 x.fillText('i:car',60+(rdist/400)*340,235);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('VOCÊ '+Math.min(400,dist|0)+'m  ●  RIVAL '+Math.min(400,rdist|0)+'m',14,40);
 // conta-giros
 x.fillStyle='#000';x.fillRect(14,60,432,34);
 for(let i=0;i<=10;i++){
  x.fillStyle=i<6?'#3E7C4F':i<8?'#C4D645':'#D94E34';
  if(rpm>=i)x.fillRect(16+i*43,62,40,30);
 }
 x.fillStyle='#fff';x.font='bold 14px system-ui';
 x.fillText('GIRO '+rpm.toFixed(1)+'  ·  Marcha '+gear+'/5'+(red>.4?'MOTOR!':''),14,115);
 if(cd>0){x.fillStyle='#C4D645';x.font='bold 60px system-ui';x.textAlign='center';x.fillText(Math.ceil(cd),230,200);}
});
}});
