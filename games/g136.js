/* NCODE N · 136 Passeador de Cães — 60s sem nó nas guias */
GREG(136,{
init(root,H){
let over=false,walker={x:250,y:300},dogs=[],posts=[],time=60,tangle=0,knots=0;
const hud=H.hud(root,[["tp","TEMPO",60],["no","NÓS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE o passeador (ou os cães) para que as <b>guias nunca se cruzem</b>! Linha cruzada por 3s = nó.");
const o=H.cvs(root,500,420),x=o.x;
let sc=0;
const r=H.rng(21);
for(let i=0;i<3;i++)dogs.push({x:100+i*150,y:120,a:r()*6.28,sp:40+r()*25});
for(let i=0;i<4;i++)posts.push({x:80+r()*340,y:80+r()*220});
const ptr=H.ptr(o);
function seg(a,b,c,d){
  const d1=(d.x-c.x)*(a.y-c.y)-(d.y-c.y)*(a.x-c.x);
  const d2=(d.x-c.x)*(b.y-c.y)-(d.y-c.y)*(b.x-c.x);
  const d3=(b.x-a.x)*(c.y-a.y)-(b.y-a.y)*(c.x-a.x);
  const d4=(b.x-a.x)*(d.y-a.y)-(b.y-a.y)*(d.x-a.x);
  return((d1>0&&d2<0)||(d1<0&&d2>0))&&((d3>0&&d4<0)||(d3<0&&d4>0));
}
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  sc=Math.floor((60-time)*5);H.score(sc);hud.set("sc",sc);
  if(time<=0){over=true;return H.done({win:true,score:300,title:"Passeio tranquilo!",sub:"60 segundos sem um nó nas guias."});}
  if(ptr.down){
    // arrasta o mais próximo do toque (passeador ou cão)
    let best=walker,bd=Math.hypot(ptr.x-walker.x,ptr.y-walker.y);
    dogs.forEach(d=>{const dd=Math.hypot(ptr.x-d.x,ptr.y-d.y);if(dd<bd){bd=dd;best=d;}});
    best.x=H.clamp(ptr.x,20,o.W-20);best.y=H.clamp(ptr.y,20,o.H-20);
  }
  dogs.forEach(d=>{
    d.a+=(Math.random()-.5)*3*dt;
    const dd=Math.hypot(d.x-walker.x,d.y-walker.y);
    if(dd>150)d.a=Math.atan2(walker.y-d.y,walker.x-d.x)+(Math.random()-.5);
    if(dd<50)d.a=Math.atan2(d.y-walker.y,d.x-walker.x)+(Math.random()-.5);
    d.x=H.clamp(d.x+Math.cos(d.a)*d.sp*dt,20,o.W-20);
    d.y=H.clamp(d.y+Math.sin(d.a)*d.sp*dt,20,o.H-20);
  });
  let cross=false;
  for(let i=0;i<dogs.length;i++)for(let j=i+1;j<dogs.length;j++){
    if(seg(walker,dogs[i],walker,dogs[j])){cross=true;break;}
  }
  if(cross){
    tangle+=dt;
    if(tangle>3){
      tangle=0;knots++;hud.set("no",knots+"/3");H.sfx("bad");
      dogs.forEach((d,i)=>{d.x=100+i*150;d.y=120;});
      say("🪢 Nó! ("+knots+"/3) Cães reposicionados.");
      if(knots>=3){over=true;return H.done({win:false,score:sc,title:"Emaranhado total!",sub:"3 nós. Arraste os cães para separar!"});}
    }
  }else tangle=Math.max(0,tangle-dt*2);
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.font="22px serif";
  posts.forEach(p=>x.fillText("🌳",p.x-11,p.y+8));
  dogs.forEach(d=>{
    x.strokeStyle=cross?"#D94E34":H.C.ink;x.lineWidth=2;
    x.beginPath();x.moveTo(walker.x,walker.y);x.lineTo(d.x,d.y);x.stroke();
  });
  x.font="26px serif";
  x.fillText("🧍",walker.x-13,walker.y+9);
  dogs.forEach(d=>x.fillText("🐕",d.x-13,d.y+9));
  if(cross){x.fillStyle="#D94E34";x.font="bold 14px 'Space Mono',monospace";
    x.fillText("⚠ GUIAS CRUZADAS! "+(3-tangle).toFixed(1)+"s",120,24);}
});
}});
