/* NCODE N · 172 Avalanche — soterre a cabana 🎯 */
GREG(172,{
init(root,H){
let over=false,balls=[],snow=[],cabs=[],throws=6;
const hud=H.hud(root,[["bl","BOLAS",6],["al","ALVO","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no alto da montanha para soltar a bola de neve — ela cresce rolando! Soterre 100% a cabana 🎯 sem passar de 60% nas outras.");
const o=H.cvs(root,520,380),x=o.x;
cabs=[{x:120,y:300,t:false,f:0},{x:300,y:320,t:true,f:0},{x:460,y:300,t:false,f:0}];
const slopeY=px=>80+px*0.42;
H.onTap(o,(px,py)=>{
  if(over||throws<=0||balls.length>=2)return;
  if(py>slopeY(px)-10){H.sfx("bad");say("Solte no alto da montanha (acima da encosta)!");return;}
  balls.push({x:px,y:py,vx:60,vy:0,r:10});
  throws--;hud.set("bl",throws);H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  for(let i=balls.length-1;i>=0;i--){
    const b=balls[i];
    b.vy+=500*dt;b.vx+=40*dt;
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    const sy=slopeY(b.x);
    if(b.y+b.r>sy){b.y=sy-b.r;b.vy*=-0.25;b.r=Math.min(46,b.r+dt*14);
      snow.push({x:b.x+(Math.random()-.5)*b.r,y:sy-4,r:4+Math.random()*6});
      if(snow.length>400)snow.splice(0,50);
    }
    cabs.forEach(c=>{
      if(Math.abs(b.x-c.x)<44&&b.y>c.y-60){
        c.f=Math.min(100,c.f+dt*b.r*1.1);
      }
    });
    if(b.x>o.W+60||b.y>o.H+40)balls.splice(i,1);
  }
  // neve acumulada também soterra
  cabs.forEach(c=>{
    let cover=0;
    snow.forEach(s=>{if(Math.abs(s.x-c.x)<40&&s.y>c.y-56)cover++;});
    c.f=Math.min(100,Math.max(c.f,cover*1.2));
  });
  const tgt=cabs.find(c=>c.t);
  hud.set("al",Math.floor(tgt.f)+"%");
  H.score(Math.floor(tgt.f)*3);hud.set("sc",Math.floor(tgt.f)*3);
  if(tgt.f>=100){
    over=true;
    const bad=cabs.some(c=>!c.t&&c.f>60);
    if(bad)return H.done({win:false,score:200,title:"Dano colateral!",sub:"Alvo soterrado, mas vizinhos passaram de 60%!"});
    return H.done({win:true,score:300+throws*30,title:"Avalanche cirúrgica!",sub:"Cabana-alvo soterrada, vizinhos a salvo."});
  }
  if(throws<=0&&!balls.length){
    over=true;
    return H.done({win:false,score:Math.floor(tgt.f)*3,title:"Neve pouca!",sub:"Alvo em "+Math.floor(tgt.f)+"%. Mire a bola por cima dele!"});
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";
  x.beginPath();x.moveTo(0,slopeY(0));
  for(let px=0;px<=o.W;px+=20)x.lineTo(px,slopeY(px));
  x.lineTo(o.W,o.H);x.lineTo(0,o.H);x.fill();
  x.fillStyle="#E8EDF0";
  snow.forEach(s=>{x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill();});
  x.font="34px serif";
  cabs.forEach(c=>{
    x.fillText(c.t?"🎯":"🛖",c.x-17,c.y+10);
    x.fillStyle="rgba(255,255,255,.85)";
    x.fillRect(c.x-20,c.y-52,40*Math.min(1,c.f/100),6);
    x.strokeStyle=H.C.ink;x.strokeRect(c.x-20,c.y-52,40,6);
    x.font="34px serif";
  });
  x.fillStyle="#fff";
  balls.forEach(b=>{x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill();x.strokeStyle="#8AB4D0";x.stroke();});
});
}});
