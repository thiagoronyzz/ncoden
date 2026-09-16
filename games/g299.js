/* NCODE N · 299 Corrida de Cadeira de Rodas — impulsos alternados! */
GREG(299,{
init(root,H){
let over=false,px=0,sp=0,next=0,t=0,combo=0;
let rivals=[{x:0,sp:0},{x:0,sp:0}];
const hud=H.hud(root,[['d','DIST','0m'],['pos','POS','3º']]);
const say=H.msg(root,'Alterne ESQUERDA e DIREITA no ritmo! Repetir o lado quebra o embalo. 200m contra 2 rivais!');
const o=H.cvs(root,560,300),x=o.x;
const bL=H.btn(root,'⬅️ ESQUERDA',()=>push(0),false);
const bR=H.btn(root,'➡️ DIREITA',()=>push(1),false);
const kb=H.keys();kb.on((c,d)=>{if(!d)return;if(c==='ArrowLeft'||c==='KeyA')push(0);if(c==='ArrowRight'||c==='KeyD')push(1);});
function push(s){
 if(over)return;
 if(s===next){combo++;sp=Math.min(44,sp+2.5+combo*.3);next=1-next;H.sfx('tick');}
 else{combo=0;sp*=.85;H.sfx('bad');}
}
function gameOver(){
 over=true;
 const win=px>=600&&px>=rivals[0].x&&px>=rivals[1].x;
 const sc=win?Math.max(200,500-(t|0)*8):px|0;
 H.score(sc);
 H.done(win?{win:true,score:sc,title:'🥇 Sprint vencido!',sub:'200m em '+t.toFixed(1)+'s.'}:{win:false,score:sc,title:'Rivais venceram!',sub:'Alterne E-D-E-D sem errar!'});
}
H.loop(dt=>{
 if(over)return;t+=dt;
 sp*=.992;px+=sp*dt*3;
 rivals.forEach((r,i)=>{r.sp=27+Math.sin(t*1.5+i*2)*5+t*.5;r.x+=r.sp*dt*3;});
 const order=[px,rivals[0].x,rivals[1].x].sort((a,b)=>b-a).indexOf(px)+1;
 hud.set('d',(Math.min(200,px/3)|0)+'m');hud.set('pos',order+'º');
 if(px>=600||rivals.some(r=>r.x>=600)){gameOver();return;}
 x.fillStyle='#7CB56B';x.fillRect(0,0,560,300);
 x.fillStyle='#C9553E';x.fillRect(0,60,560,180);
 x.strokeStyle='#fff';x.lineWidth=2;
 for(let i=0;i<3;i++)x.strokeRect(0,60+i*60,560,60);
 const cam=Math.max(0,px-200);
 x.font='28px system-ui';x.textAlign='center';
 x.fillText('🦽',px-cam,105);
 x.fillText('🦽',rivals[0].x-cam,165);
 x.fillText('🦽',rivals[1].x-cam,225);
 x.fillStyle='#fff';x.fillRect(600-cam,60,8,180);
 x.fillStyle=next===0?'#C4D645':'#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Próximo: '+(next===0?'⬅️ ESQUERDA':'DIREITA ➡️')+'  x'+combo,12,40);
});
}});
