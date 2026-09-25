/* NCODE N · 358 Fonte Termal — quente ou frio! */
GREG(358,{
init(root,H){
const N=7,CS=60,OX=20,OY=50;
let over=false,digs=10,found=0;
const SPR=[];
for(let i=0;i<2;i++)SPR.push({c:(Math.random()*N)|0,r:(Math.random()*N)|0,got:false});
let tried=new Set(),hint='';
const hud=H.hud(root,[['f','FONTES','0/2'],['p','PÁS',10]]);
const say=H.msg(root,'Ache 2 fontes termais em 10 tentativas! Cada toque diz QUENTE/MORNO/FRIO pela distância.');
const o=H.cvs(root,460,490),x=o.x;
H.onTap(o,(px,py)=>{
 if(over||digs<=0)return;
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(c<0||c>=N||r<0||r>=N||tried.has(c+','+r))return;
 tried.add(c+','+r);digs--;hud.set('p',digs);
 const hit=SPR.find(s=>!s.got&&s.c===c&&s.r===r);
 if(hit){hit.got=true;found++;H.sfx('ok');hud.set('f',found+'/2');
  if(found>=2){gameOver(true);return;}}
 else{
  let bd=99;
  SPR.forEach(s=>{if(!s.got){const d=Math.abs(s.c-c)+Math.abs(s.r-r);if(d<bd)bd=d;}});
  hint=bd<=1?'QUENTE!':bd<=2?'morno…':'frio…';
  H.sfx('tick');
 }
 if(digs<=0){gameOver(found>=2);return;}
});
function gameOver(win){over=true;const sc=found*120+(win?digs*25:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Águas termais!',sub:'2 fontes descobertas!'}:{win:false,score:sc,title:'Sem pás!',sub:found+'/2 fontes. Cerque o QUENTE!'});}
H.loop(()=>{
 if(over)return;
 x.fillStyle='#5A6E5A';x.fillRect(0,0,460,490);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const k=c+','+r;
  const s=SPR.find(q=>q.c===c&&q.r===r&&q.got);
  x.fillStyle=tried.has(k)?'#8A877C':'#4A5A4A';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#2A3A2A';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  if(s){x.font='30px system-ui';x.textAlign='center';x.fillText('',OX+c*CS+30,OY+r*CS+42);}
 }
 x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('Relíquias '+found+'/2 · Escavações '+digs+'  ·  '+hint,12,30);
});
}});
