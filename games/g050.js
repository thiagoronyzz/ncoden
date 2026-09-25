/* NCODE N · 050 Canhão Espacial — defenda o núcleo */
GREG(50,{
init(root,H){
let over=false,ang=-Math.PI/2,shots=[],rocks=[],sc=0,lives=3,wave=0,spawnQ=0,cd=0,wavePause=2;
const hud=H.hud(root,[["wv","ONDA","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mire com <b>mouse/toque</b>, atire com <b>clique/Espaço</b>. Não deixe as rochas atingirem o núcleo!");
const o=H.cvs(root,480,440),x=o.x;
const cx=o.W/2,cy=o.H/2;
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")shoot();});
H.onTap(o,(px,py)=>{ang=Math.atan2(py-cy,px-cx);shoot();});
const ptr=H.ptr(o);
function shoot(){
  if(over||cd>0)return;cd=.22;
  shots.push({x:cx+Math.cos(ang)*26,y:cy+Math.sin(ang)*26,vx:Math.cos(ang)*420,vy:Math.sin(ang)*420});
  H.beep(700,.06,"square",.04);
}
function startWave(){
  wave++;spawnQ=4+wave*3;hud.set("wv",wave+"/3");
  say(wave>=3?"Onda final! Segure o núcleo!":"Onda "+wave+" se aproximando!");
}
H.loop(dt=>{
  if(over)return;
  cd-=dt;
  if(kb.is("ArrowLeft"))ang-=2.4*dt;
  if(kb.is("ArrowRight"))ang+=2.4*dt;
  if(ptr.down)ang=Math.atan2(ptr.y-cy,ptr.x-cx);
  if(!spawnQ&&!rocks.length){
    wavePause-=dt;
    if(wavePause<=0){
      if(wave>=3){over=true;return H.done({win:true,score:sc+150,title:"Núcleo salvo!",sub:"3 ondas vaporizadas pelo canhão."});}
      startWave();wavePause=1.5;
    }
  }
  if(spawnQ>0){spawnQ-=dt*1.2;
    if(Math.random()<dt*2){
      const a=Math.random()*6.28,R=Math.max(o.W,o.H)/2+30;
      const big=Math.random()<.35;
      rocks.push({x:cx+Math.cos(a)*R,y:cy+Math.sin(a)*R,
        vx:-(cx-(cx+Math.cos(a)*R)),vy:-(cy-(cy+Math.sin(a)*R)),r:big?22:13,hp:big?2:1});
      const rk=rocks[rocks.length-1];
      const d=Math.hypot(rk.vx,rk.vy),sp=40+wave*14;
      rk.vx=rk.vx/d*sp;rk.vy=rk.vy/d*sp;
    }
  }
  for(const s of shots){s.x+=s.vx*dt;s.y+=s.vy*dt;}
  shots=shots.filter(s=>s.x>-20&&s.x<o.W+20&&s.y>-20&&s.y<o.H+20);
  for(const r of rocks){r.x+=r.vx*dt;r.y+=r.vy*dt;}
  for(let i=shots.length-1;i>=0;i--){
    for(let j=rocks.length-1;j>=0;j--){
      const s=shots[i],r=rocks[j];
      if(Math.hypot(s.x-r.x,s.y-r.y)<r.r+4){
        shots.splice(i,1);r.hp--;
        if(r.hp<=0){
          rocks.splice(j,1);sc+=r.r>15?20:40;H.score(sc);hud.set("sc",sc);H.sfx("pop");
          if(r.r>15)for(let k=0;k<2;k++)rocks.push({x:r.x,y:r.y,vx:r.vx+(Math.random()-.5)*120,vy:r.vy+(Math.random()-.5)*120,r:12,hp:1});
        }else H.beep(300,.05);
        break;
      }
    }
  }
  for(let j=rocks.length-1;j>=0;j--){
    if(Math.hypot(rocks[j].x-cx,rocks[j].y-cy)<34){
      rocks.splice(j,1);lives--;hud.set("vd",lives);H.sfx("lose");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Núcleo destruído!",sub:sc+" pontos até a onda "+wave+"."});}
      say("Impacto no núcleo! Vidas: "+lives);
    }
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(cx,cy,22+Math.sin(Date.now()/300)*2,0,7);x.fill();
  x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
  x.save();x.translate(cx,cy);x.rotate(ang);
  x.fillStyle=H.C.terra;x.fillRect(10,-6,26,12);
  x.strokeStyle=H.C.paper;x.strokeRect(10,-6,26,12);
  x.restore();
  x.fillStyle=H.C.gold;
  for(const s of shots){x.beginPath();x.arc(s.x,s.y,4,0,7);x.fill();}
  for(const r of rocks){
    x.fillStyle="#8A877C";x.beginPath();x.arc(r.x,r.y,r.r,0,7);x.fill();
    x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.paper;x.font="10px 'Space Mono',monospace";x.fillText(r.hp>1?"2":"1",r.x-3,r.y+3);
  }
  x.fillStyle=H.C.paper;x.font="11px 'Space Mono',monospace";
  x.fillText("rochas: "+rocks.length,12,20);
});
startWave();
}});
