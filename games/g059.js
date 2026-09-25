/* NCODE N · 059 Invasores em Onda — segure a descida */
GREG(59,{
init(root,H){
let over=false,px,aliens,shots,eshots,sc=0,lives=3,wave=0,dir=1,cd=0,et=0;
const hud=H.hud(root,[["wv","ONDA","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>◀ ▶</b> move · <b>Espaço/toque</b> atira. Destrua 3 ondas antes que pousem!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
function buildWave(){
  wave++;aliens=[];eshots=[];dir=1;
  hud.set("wv",wave+"/3");
  for(let r=0;r<3+Math.min(2,wave);r++)for(let c=0;c<7;c++)
    aliens.push({x:70+c*52,y:60+r*36,pts:(4-r)*10});
}
px=o.W/2;shots=[];buildWave();
kb.on((c,d)=>{if(d&&c==="Space")shoot();});
H.onTap(o,()=>shoot());
function shoot(){
  if(over||cd>0||shots.length>3)return;cd=.3;
  shots.push({x:px,y:o.H-56});H.beep(800,.06,"square",.035);
}
H.loop(dt=>{
  if(over)return;
  cd-=dt;
  if(kb.is("ArrowLeft"))px-=300*dt;
  if(kb.is("ArrowRight"))px+=300*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*10);
  px=H.clamp(px,30,o.W-30);
  const sp=26+wave*10;
  let edge=false;
  for(const a of aliens){a.x+=dir*sp*dt;if(a.x<24||a.x>o.W-24)edge=true;}
  if(edge){dir*=-1;for(const a of aliens)a.y+=16;}
  et-=dt;
  if(et<=0&&aliens.length){et=Math.max(.4,1.1-wave*.2);
    const a=aliens[Math.floor(Math.random()*aliens.length)];
    eshots.push({x:a.x,y:a.y+10});}
  for(const s of shots)s.y-=460*dt;
  shots=shots.filter(s=>s.y>-10);
  for(const s of eshots)s.y+=220*dt;
  eshots=eshots.filter(s=>s.y<o.H+10);
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];
    const j=aliens.findIndex(a=>Math.abs(a.x-s.x)<20&&Math.abs(a.y-s.y)<16);
    if(j>=0){sc+=aliens[j].pts;aliens.splice(j,1);shots.splice(i,1);
      H.score(sc);hud.set("sc",sc);H.sfx("pop");}
  }
  for(let i=eshots.length-1;i>=0;i--){
    const s=eshots[i];
    if(Math.abs(s.x-px)<20&&s.y>o.H-70&&s.y<o.H-30){
      eshots.splice(i,1);lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Base destruída!",sub:sc+" pontos até a onda "+wave+"."});}
      say("Nave atingida! Vidas: "+lives);
    }
  }
  if(aliens.some(a=>a.y>o.H-90)){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Invasão completa!",sub:"Os aliens pousaram na onda "+wave+"."});}
  if(!aliens.length){
    if(wave>=3){over=true;return H.done({win:true,score:sc+150,title:"Setor limpo!",sub:"3 ondas de invasores vaporizadas."});}
    H.sfx("ok");shots=[];buildWave();say("Onda "+wave+"! Mais rápidos, mais famintos.");
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.font="20px serif";
  for(const a of aliens)x.fillText("i:robot",a.x-10,a.y+7);
  x.font="26px serif";x.fillText("i:rocket",px-13,o.H-40);
  x.fillStyle=H.C.wasabi;
  for(const s of shots)x.fillRect(s.x-2,s.y-8,4,10);
  x.fillStyle=H.C.terra;
  for(const s of eshots){x.beginPath();x.arc(s.x,s.y,4,0,7);x.fill();}
});
}});
