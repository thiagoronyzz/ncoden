/* NCODE N · 349 Mapa Estelar — ligue as constelações! */
GREG(349,{
init(root,H){
let over=false,ci=0,path=[],t=0,time=150;
const CONS=[
 {n:'Triângulo',pts:[[100,100],[200,80],[150,180]],need:[0,1,2]},
 {n:'Linha do Norte',pts:[[300,120],[340,200],[380,280],[330,330]],need:[0,1,2,3]},
 {n:'Casa',pts:[[120,300],[200,300],[200,380],[120,380],[160,250]],need:[4,0,1,2,3]}
];
const hud=H.hud(root,[['c','CONSTELAÇÃO','1/3'],['tp','TEMPO',150]]);
const say=H.msg(root,'Ligue as estrelas NA ORDEM dos números! Toque estrela por estrela. 3 constelações!');
const o=H.cvs(root,460,460),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 const c=CONS[ci];
 c.pts.forEach((p,i)=>{
  if(Math.hypot(px-p[0],py-p[1])<26){
   if(c.need[path.length]===i){path.push(i);H.sfx('tick');
    if(path.length>=c.need.length){
     ci++;path=[];
     if(ci>=3){gameOver(true);return;}
     hud.set('c',(ci+1)+'/3');H.sfx('ok');
    }
   }else{path=[];H.sfx('bad');say('✕ Ordem errada! Recomece a constelação.');}
  }
 });
});
function gameOver(win){over=true;const sc=win?300+Math.ceil(time)*2:ci*80;H.score(sc);
H.done(win?{win:true,score:sc,title:'Céu mapeado!',sub:'3 constelações ligadas!'}:{win:false,score:sc,title:'Amanheceu!',sub:ci+'/3. Siga os números!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));
 if(time<=0){gameOver(ci>=3);return;}
 x.fillStyle='#0C0C18';x.fillRect(0,0,460,460);
 x.fillStyle='#fff';
 for(let i=0;i<40;i++)x.fillRect((i*197)%460,(i*131)%460,2,2);
 if(ci>=3)return;
 const c=CONS[ci];
 x.strokeStyle='#C4D645';x.lineWidth=3;
 x.beginPath();
 path.forEach((pi,k)=>{const p=c.pts[pi];if(k===0)x.moveTo(p[0],p[1]);else x.lineTo(p[0],p[1]);});
 x.stroke();
 c.pts.forEach((p,i)=>{
  const done2=path.includes(i);
  x.fillStyle=done2?'#C4D645':'#fff';
  x.beginPath();x.arc(p[0],p[1],done2?10:13,0,7);x.fill();
  x.fillStyle='#0C0C18';x.font='bold 13px system-ui';x.textAlign='center';
  x.fillText(c.need.indexOf(i)+1,p[0],p[1]+5);
 });
 x.fillStyle='#fff';x.font='bold 16px system-ui';x.textAlign='left';
 x.fillText(c.n+' · '+path.length+'/'+c.need.length+' · '+Math.ceil(time),12,28);
});
}});
