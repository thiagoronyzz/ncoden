/* NCODE N · 357 Oásis no Deserto — triangule! */
GREG(357,{
init(root,H){
let over=false,digs=8,found=0;
const OAS=[];
for(let i=0;i<3;i++)OAS.push({x:60+Math.random()*340,y:80+Math.random()*280,got:false});
const MARKS=[{x:60,y:60,k:'🗿'},{x:400,y:80,k:'🌵'},{x:80,y:380,k:'⛰️'},{x:400,y:380,k:'🏚️'}];
const hud=H.hud(root,[['o','OÁSIS','0/3'],['p','PÁS',8]]);
const say=H.msg(root,'8 escavações para achar 3 oásis! A distância até o oásis mais próximo aparece a cada tentativa. Triangule!');
const o=H.cvs(root,460,460),x=o.x;
let hint='';
H.onTap(o,(px,py)=>{
 if(over||digs<=0)return;
 digs--;hud.set('p',digs);
 let bd=1e9;
 OAS.forEach(s=>{if(!s.got){const d=Math.hypot(px-s.x,py-s.y);if(d<bd)bd=d;}});
 const hit=OAS.find(s=>!s.got&&Math.hypot(px-s.x,py-s.y)<34);
 if(hit){hit.got=true;found++;H.sfx('ok');hud.set('o',found+'/3');
  if(found>=3){gameOver(true);return;}}
 else H.sfx('tick');
 hint=bd<60?'🔥 MUITO PERTO!':bd<120?'🌡️ perto…':bd<200?'🥶 longe…':'🧊 muito longe…';
 tries.push({x:px,y:py});
 if(digs<=0){gameOver(found>=3);return;}
});
let tries=[];
function gameOver(win){over=true;const sc=found*100+(win?digs*30:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌴 Oásis mapeados!',sub:'3 refúgios encontrados!'}:{win:false,score:sc,title:'Sem pás!',sub:found+'/3 oásis. Use as distâncias!'});}
H.loop(()=>{
 if(over)return;
 x.fillStyle='#E8C86B';x.fillRect(0,0,460,460);
 MARKS.forEach(m=>{x.font='28px system-ui';x.textAlign='center';x.fillText(m.k,m.x,m.y);});
 OAS.forEach(s=>{if(s.got){x.font='34px system-ui';x.fillText('🌴',s.x,s.y);}});
 tries.forEach(q=>{x.fillStyle='#8A6A2F';x.beginPath();x.arc(q.x,q.y,8,0,7);x.fill();});
 x.fillStyle='#181816';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText('🌴 '+found+'/3 · 🥄 '+digs+'  '+hint,12,28);
});
}});
