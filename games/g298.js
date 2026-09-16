/* NCODE N · 298 Triciclo Maluco — pedale bambo! */
GREG(298,{
init(root,H){
let over=false,px=0,sp=0,wob=0,t=0;
let rivals=[{x:0},{x:0}];
const hud=H.hud(root,[['d','DIST','0m'],['pos','POS','3º']]);
const say=H.msg(root,'Pedale (toque PEDAL!) e segure o bambo com ⬅️➡️! Bambo no limite = queda (perde velocidade). 300m contra 2 malucos!');
const o=H.cvs(root,560,320),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&c==='Space')pedal();});
H.btn(root,'🚲 PEDAL!',pedal,true);
function pedal(){
 if(over)return;
 sp=Math.min(50,sp+3);wob+=(Math.random()-.5)*36;H.sfx('tick');
}
function gameOver(){
 over=true;
 const win=px>=900&&px>=rivals[0].x&&px>=rivals[1].x;
 const sc=win?Math.max(200,600-(t|0)*6):px|0;
 H.score(sc);
 H.done(win?{win:true,score:sc,title:'🚲 Rei do bambo!',sub:'300m em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Os malucos venceram!',sub:'Pedale e corrija o bambo sem parar!'});
}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(dn.ArrowLeft||dn.KeyA)wob-=90*dt;
 if(dn.ArrowRight||dn.KeyD)wob+=90*dt;
 wob+=Math.sin(t*3)*20*dt;
 wob=H.clamp(wob,-100,100);
 if(Math.abs(wob)>=100){wob=0;sp*=.3;H.sfx('bad');}
 sp*=.99;
 px+=sp*dt*3;
 rivals.forEach((r,i)=>{r.x+=(26+Math.sin(t*2+i*3)*6+t*.3)*dt*3;});
 const order=[px,rivals[0].x,rivals[1].x].sort((a,b)=>b-a).indexOf(px)+1;
 hud.set('d',(Math.min(300,px/3)|0)+'m');hud.set('pos',order+'º');
 if(px>=900||rivals.some(r=>r.x>=900)){gameOver();return;}
 x.fillStyle='#C9B189';x.fillRect(0,0,560,320);
 const cam=Math.max(0,px-200);
 x.font='28px system-ui';x.textAlign='center';
 x.save();x.translate(px-cam,110);x.rotate(wob/200);x.fillText('🚲',0,9);x.restore();
 x.fillText('🛺',rivals[0].x-cam,190);
 x.fillText('🛵',rivals[1].x-cam,260);
 x.fillStyle='#fff';x.fillRect(900-cam,60,8,220);
 x.fillStyle='#181816';x.fillRect(180,20,200,14);
 x.fillStyle=Math.abs(wob)>70?'#D94E34':'#E8A33D';
 x.fillRect(280+wob-5,16,10,22);
 x.fillStyle='#181816';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('BAMBO',120,32);
});
}});
