/* NCODE N · 346 Pinturas Rupestres — documente a caverna! */
GREG(346,{
init(root,H){
let over=false,px=230,py=400,tx=px,ty=py,t=0,doc=0;
const PT=[];
for(let i=0;i<5;i++)PT.push({x:50+Math.random()*360,y:60+Math.random()*300,got:false});
const hud=H.hud(root,[['d','DOCUMENTADAS','0/5']]);
const say=H.msg(root,'Explore no escuro com a tocha! Perto de uma pintura , toque DOCUMENTAR. 5 pinturas!');
const o=H.cvs(root,460,480),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'Documentar',()=>{
 if(over)return;
 const p=PT.find(q=>!q.got&&Math.hypot(px-q.x,py-q.y)<70);
 if(p){p.got=true;doc++;H.sfx('ok');hud.set('d',doc+'/5');
  if(doc>=5){gameOver(true);return;}}
 else H.sfx('bad');
},true);
function gameOver(win){over=true;const sc=win?Math.max(150,450-(t|0)*3):doc*50;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Acervo completo!',sub:'5 pinturas documentadas!'}:{win:false,score:sc|0,title:'Fim!',sub:doc+'/5. Explore cada canto!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=140*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,20,440);py=H.clamp(py,20,460);
 x.fillStyle='#0C0C10';x.fillRect(0,0,460,480);
 x.fillStyle='rgba(232,163,61,.12)';x.beginPath();x.arc(px,py,110,0,7);x.fill();
 PT.forEach(p=>{
  if(Math.hypot(px-p.x,py-p.y)>110&&!p.got)return;
  x.font='30px system-ui';x.textAlign='center';
  x.fillText(p.got?'i:check':'i:suit',p.x,p.y+10);
 });
 x.font='24px system-ui';x.fillText('',px,py+8);
 if(t>150){gameOver(doc>=5);return;}
});
}});
