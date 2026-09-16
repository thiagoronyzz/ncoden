/* NCODE N · 288 Corrida de Cavalos — galope ritmado! */
GREG(288,{
init(root,H){
let over=false,px=0,sp=0,stam=100,last=0,combo=0,t=0;
let rivals=[{x:0,sp:0},{x:0,sp:0}];
const hud=H.hud(root,[['d','DIST','0m'],['st','FÔLEGO','100%'],['pos','POS','3º']]);
const say=H.msg(root,'Toque GALOPAR no ritmo (~3 por segundo)! Ritmo certo = velocidade; descompasso cansa. 400m contra 2 rivais!');
const o=H.cvs(root,560,320),x=o.x;
H.btn(root,'🐎 GALOPAR (toque no ritmo!)',gallop,true);
function gallop(){
 if(over)return;
 const now=t,gap=now-last;last=now;
 if(gap>.22&&gap<.48){combo++;sp=Math.min(46,sp+4+combo*.4);stam-=1.5;H.sfx('tick');}
 else{combo=0;sp=Math.min(40,sp+1);stam-=4;H.sfx('bad');}
}
function gameOver(){
 over=true;
 const r=Math.min(rivals[0].x,rivals[1].x);
 const win=px>=400&&px>=r;
 const sc=win?Math.max(200,600-(t|0)*6):px|0;
 H.score(sc);
 H.done(win?{win:true,score:sc,title:'🏇 Foto-finish sua!',sub:'400m em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Rivais venceram!',sub:'Mantenha o ritmo sem esgotar o fôlego!'});
}
H.loop(dt=>{
 if(over)return;t+=dt;
 stam=Math.min(100,stam+(sp<20?10:2)*dt);
 if(stam<=0){sp*=.9;}
 sp*=.995;
 px+=sp*dt*3;
 rivals.forEach((r,i)=>{r.sp=30+Math.sin(t*(1+i*.3)+i*2)*8+t*.4;r.x+=r.sp*dt*3;});
 const order=[px,rivals[0].x,rivals[1].x].sort((a,b)=>b-a).indexOf(px)+1;
 hud.set('d',(Math.min(400,px/3)|0)+'m');hud.set('st',(stam|0)+'%');hud.set('pos',order+'º');
 if(px>=1200||rivals.some(r=>r.x>=1200)){gameOver();return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,560,320);
 x.fillStyle='#C9B189';
 for(let i=0;i<3;i++)x.fillRect(0,70+i*70,560,44);
 const cam=Math.max(0,px-200);
 x.font='30px system-ui';x.textAlign='center';
 x.fillText('🏇',px-cam,105);
 x.fillText('🐎',rivals[0].x-cam,175);
 x.fillText('🐎',rivals[1].x-cam,245);
 x.fillStyle='#fff';x.fillRect(1200-cam,60,8,200);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Fôlego',12,30);
 x.fillStyle='#000';x.fillRect(80,18,200,14);
 x.fillStyle=stam>30?'#3E7C4F':'#D94E34';x.fillRect(80,18,200*stam/100,14);
 x.fillStyle='#181816';
 x.fillText('Ritmo x'+combo+'  Vel '+sp.toFixed(0),300,30);
});
}});
