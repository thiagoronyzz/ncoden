/* NCODE N · 359 Caça a Meteoritos — siga o detector! */
GREG(359,{
init(root,H){
let over=false,px=230,tx=px,py=350,ty=py,t=0,digs=6,found=0;
const MET=[];
for(let i=0;i<4;i++)MET.push({x:40+Math.random()*380,y:60+Math.random()*300,got:false});
const hud=H.hud(root,[['m','METEORITOS','0/4'],['p','PÁS',6]]);
const say=H.msg(root,'Ande com o detector! Perto de metal, ele apita forte (barra cheia). Toque ESCAVAR no ponto certo. 4 meteoritos, 6 pás!');
const o=H.cvs(root,460,420),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
H.onTap(o,(a,b)=>{tx=a;ty=b;});
H.btn(root,'⛏️ ESCAVAR aqui!',()=>{
 if(over||digs<=0)return;
 digs--;hud.set('p',digs);
 const hit=MET.find(m=>!m.got&&Math.hypot(px-m.x,py-m.y)<36);
 if(hit){hit.got=true;found++;H.sfx('ok');hud.set('m',found+'/4');
  if(found>=4){gameOver(true);return;}}
 else H.sfx('bad');
 if(digs<=0){gameOver(found>=4);return;}
},true);
function sig(){
 let bd=1e9;
 MET.forEach(m=>{if(!m.got){const d=Math.hypot(px-m.x,py-m.y);if(d<bd)bd=d;}});
 return H.clamp(1-bd/250,0,1);
}
function gameOver(win){over=true;const sc=found*80+(win?digs*30:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'☄️ Caça estelar!',sub:'4 meteoritos!'}:{win:false,score:sc,title:'Sem pás!',sub:found+'/4. Cave só no sinal máximo!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const sp=150*dt;
 const dx=((dn.ArrowRight||dn.KeyD)?1:0)-((dn.ArrowLeft||dn.KeyA)?1:0);
 const dy=((dn.ArrowDown||dn.KeyS)?1:0)-((dn.ArrowUp||dn.KeyW)?1:0);
 if(dx||dy){px+=dx*sp;py+=dy*sp;tx=px;ty=py;}
 else{const d=Math.hypot(tx-px,ty-py);if(d>4){px+=(tx-px)/d*sp;py+=(ty-py)/d*sp;}}
 px=H.clamp(px,20,440);py=H.clamp(py,20,400);
 const s=sig();
 if(s>.75&&Math.random()<dt*8)H.sfx('tick');
 x.fillStyle='#8A877C';x.fillRect(0,0,460,420);
 MET.forEach(m=>{if(m.got){x.font='26px system-ui';x.textAlign='center';x.fillText('☄️',m.x,m.y);}});
 x.font='28px system-ui';x.textAlign='center';x.fillText('🧑‍🔬',px,py+10);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('SINAL',12,28);
 x.fillStyle='#000';x.fillRect(80,18,220,14);
 x.fillStyle=s>.75?'#C4D645':s>.4?'#E8A33D':'#4A4A44';
 x.fillRect(80,18,220*s,14);
});
}});
