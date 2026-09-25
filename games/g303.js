/* NCODE N · 303 Tirolesa — gemas na selva! */
GREG(303,{
init(root,H){
let over=false,px=40,sp=0,gems=0,t=0;
const GEMS=[];
for(let i=0;i<10;i++)GEMS.push({x:400+i*420,y:120+Math.random()*160,got:false});
const hud=H.hud(root,[['g','GEMAS','0/10'],['v','VEL','0']]);
const say=H.msg(root,'Desça a tirolesa e pegue as gemas ! Segure FREIO/Espaço para desacelerar — chegue à plataforma com velocidade abaixo de 120!');
const o=H.cvs(root,560,380),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;});
function lineY(x2){return 60+x2*.42;}
function gameOver(ok,fast){over=true;const win=ok&&!fast&&gems>=6;const sc=gems*60+(win?200:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Descida perfeita!',sub:gems+'/10 gemas e chegada suave.'}:{win:false,score:sc,title:'Chegada ruim!',sub:gems+'/10 gemas. '+(fast?'Rápido demais — freie no fim!':'Pegue ao menos 6 gemas!')});}
H.loop(dt=>{
 if(over)return;t+=dt;
 const brake=dn.Space||dn.ArrowDown||dn.KeyS;
 sp+=((brake?-160:130)-sp*.25)*dt;
 sp=H.clamp(sp,20,340);
 px+=sp*dt;
 const py=lineY(px);
 hud.set('v',sp|0);
 GEMS.forEach(g=>{
  if(!g.got&&Math.abs(g.x-px)<30&&Math.abs(g.y-py)<44){g.got=true;gems++;H.sfx('ok');hud.set('g',gems+'/10');}
 });
 if(px>=4500){gameOver(true,sp>120);return;}
 const cam=H.clamp(px-100,0,4100);
 x.fillStyle='#7CB56B';x.fillRect(0,0,560,380);
 x.strokeStyle='#4A2F1B';x.lineWidth=4;
 x.beginPath();x.moveTo(40-cam,lineY(40));x.lineTo(4540-cam,lineY(4540));x.stroke();
 x.fillStyle='#5A4A33';
 for(let i=0;i<14;i++){const tx2=i*380-cam;x.fillRect(tx2,lineY(i*380+140)+60,26,120);}
 GEMS.forEach(g=>{
  if(g.got)return;
  const gx=g.x-cam;
  if(gx>-20&&gx<580){x.font='22px system-ui';x.textAlign='center';x.fillText('i:gem',gx,g.y+8);}
 });
 x.fillStyle='#8A6A2F';x.fillRect(4500-cam,lineY(4500)-10,80,20);
 const jx=px-cam,jy=lineY(px);
 x.strokeStyle='#181816';x.lineWidth=3;
 x.beginPath();x.moveTo(jx,jy);x.lineTo(jx,jy+22);x.stroke();
 x.font='28px system-ui';x.textAlign='center';x.fillText('i:climb',jx,jy+48);
 x.fillStyle='#181816';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('i:gem'+gems+'/10 · Vel '+(sp|0)+(brake?' FREIANDO':'')+' · chegue < 120!',12,26);
});
}});
