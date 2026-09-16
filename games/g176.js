/* NCODE N · 176 Impacto de Meteoro — 5 alvos, 8 pedras! */
GREG(176,{
init(root,H){
let over=false,tgts=[],craters=[],shots=8,fall=null;
const hud=H.hud(root,[["mt","METEOROS",8],["al","ALVOS","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no céu para lançar o meteoro ali! A cratera destrói alvos 🎯 num raio de ~55px.");
const o=H.cvs(root,520,380),x=o.x;
let sc=0;
const r=H.rng(77);
for(let i=0;i<5;i++)tgts.push({x:60+r()*400,y:270+r()*60,dead:false});
H.onTap(o,(px,py)=>{
  if(over||fall||shots<=0)return;
  if(py>240){H.sfx("bad");say("Mire no céu!");return;}
  fall={x:px,y:-20,tx:px};shots--;hud.set("mt",shots);H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  if(fall){
    fall.y+=520*dt;
    if(fall.y>=300){
      const cy=fall.y;
      craters.push({x:fall.x,y:cy,r:40+Math.random()*20});
      H.sfx("bad");
      tgts.forEach(t=>{
        if(!t.dead&&Math.hypot(t.x-fall.x,t.y-cy)<62){t.dead=true;sc+=100;H.score(sc);H.sfx("ok");}
      });
      hud.set("al",tgts.filter(t=>t.dead).length+"/5");hud.set("sc",sc);
      fall=null;
      if(tgts.every(t=>t.dead)){over=true;
        return H.done({win:true,score:sc+shots*25+100,title:"Bombardeio perfeito!",sub:"5 alvos craterados com "+shots+" meteoro(s) de sobra."});}
      if(shots<=0){over=true;
        return H.done({win:false,score:sc,title:"Céu limpo!",sub:tgts.filter(t=>t.dead).length+"/5 alvos. Mire no meio deles!"});
      }
    }
  }
  const g=x.createLinearGradient(0,0,0,o.H);
  g.addColorStop(0,"#0d2436");g.addColorStop(.7,"#2c4a5e");g.addColorStop(.7,"#3E7C4F");g.addColorStop(1,"#2c5a34");
  x.fillStyle=g;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";
  for(let i=0;i<50;i++){x.fillRect((i*89)%o.W,(i*53)%230,2,2);}
  craters.forEach(c=>{
    x.fillStyle="#1a1a18";
    x.beginPath();x.ellipse(c.x,c.y,c.r,c.r*.45,0,0,7);x.fill();
    x.strokeStyle="#5b3d20";x.lineWidth=3;x.stroke();
  });
  x.font="24px serif";
  tgts.forEach(t=>{if(!t.dead)x.fillText("🎯",t.x-12,t.y+8);});
  if(fall){
    x.strokeStyle="#F5A623";x.lineWidth=3;
    x.beginPath();x.moveTo(fall.x,fall.y-60);x.lineTo(fall.x,fall.y);x.stroke();
    x.fillStyle="#F5A623";x.beginPath();x.arc(fall.x,fall.y,10,0,7);x.fill();
  }
});
}});
