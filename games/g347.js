/* NCODE N · 347 Poça de Maré — catálogo da maré! */
GREG(347,{
init(root,H){
let over=false,found={},t=0,time=90;
const CR=[
 {k:'',n:'caranguejo',x:80,y:120},{k:'★',n:'estrela-do-mar',x:200,y:220},{k:'',n:'concha',x:330,y:140},
 {k:'',n:'camarão',x:140,y:300},{k:'',n:'polvo bebê',x:380,y:290},{k:'',n:'anêmona',x:260,y:90}
];
const ROCKS=[];
for(let i=0;i<8;i++)ROCKS.push({x:40+Math.random()*380,y:60+Math.random()*300,open:false});
CR.forEach(c=>{const r=ROCKS[(Math.random()*ROCKS.length)|0];c.rx=r.x;c.ry=r.y;});
const hud=H.hud(root,[['c','CATÁLOGO','0/6'],['tp','TEMPO',90]]);
const say=H.msg(root,'Toque nas pedras para virar e achar bichos! Toque no bicho para catalogar. 6 espécies em 90s!');
const o=H.cvs(root,460,380),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 let hit=false;
 ROCKS.forEach(r=>{if(Math.hypot(px-r.x,py-r.y)<30){r.open=true;hit=true;H.sfx('tick');}});
 if(!hit)CR.forEach(c=>{
  if(!found[c.n]&&Math.hypot(px-c.x,py-c.y)<26){
   const r=ROCKS.find(q=>q.x===c.rx&&q.y===c.ry);
   if(r&&r.open){found[c.n]=1;H.sfx('ok');
    hud.set('c',Object.keys(found).length+'/6');
    if(Object.keys(found).length>=6){gameOver(true);return;}}
  }
 });
});
function gameOver(win){over=true;const n=Object.keys(found).length;const sc=n*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Catálogo completo!',sub:'6 bichos da maré!'}:{win:false,score:sc,title:'A maré subiu!',sub:n+'/6. Vire todas as pedras!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(Object.keys(found).length>=6);return;}
 x.fillStyle='#7FB3C8';x.fillRect(0,0,460,380);
 x.fillStyle='#E8C86B';x.fillRect(0,330,460,50);
 CR.forEach(c=>{
  if(found[c.n])return;
  const r=ROCKS.find(q=>q.x===c.rx&&q.y===c.ry);
  if(r&&r.open){x.font='26px system-ui';x.textAlign='center';x.fillText(c.k,c.x,c.y);}
 });
 ROCKS.forEach(r=>{
  if(r.open)return;
  x.fillStyle='#5A5A55';x.beginPath();x.ellipse(r.x,r.y,28,20,0,0,7);x.fill();
 });
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('i:clipboard'+Object.keys(found).join(', ')+Math.ceil(time),12,26);
});
}});
