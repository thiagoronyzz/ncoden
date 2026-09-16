/* NCODE N · 043 Corte de Frutas — fatie, desvie das bombas */
GREG(43,{
init(root,H){
const FR=["🍎","🍊","🍉","🍋","🍇","🥝"];
let over=false,items=[],halves=[],sc=0,lives=3,t=60,spawn=0,trail=[];
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Deslize o dedo/mouse para <b>fatiar</b>. Bombas 💣 custam uma vida!");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
let last={x:0,y:0};
H.loop(dt=>{
  if(over)return;
  t-=dt;H.time(Math.ceil(t)+"s");hud.set("tp",Math.ceil(t));
  if(t<=0){over=true;
    return sc>=250?H.done({win:true,score:sc,title:"Chef fatiador!",sub:sc+" pontos em 60 segundos de corte."})
                  :H.done({win:false,score:sc,title:"Salada pequena",sub:"Faltaram "+(250-sc)+" pontos para a meta 250."});}
  spawn-=dt;
  if(spawn<=0){spawn=0.55;
    const bomb=Math.random()<0.16;
    items.push({x:60+Math.random()*380,y:o.H+20,vx:(Math.random()-.5)*120,vy:-(380+Math.random()*160),
      e:bomb?"💣":FR[Math.floor(Math.random()*FR.length)],bomb,r:22,sliced:false,rot:Math.random()*6});
  }
  trail.push({x:ptr.x,y:ptr.y});if(trail.length>14)trail.shift();
  for(const it of items){
    it.vy+=700*dt;it.x+=it.vx*dt;it.y+=it.vy*dt;it.rot+=dt*2;
    if(!it.sliced){
      for(const p of trail){
        if(Math.hypot(it.x-p.x,it.y-p.y)<it.r+8){
          it.sliced=true;
          if(it.bomb){lives--;hud.set("vd",lives);H.sfx("lose");
            if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Explodiu!",sub:"3 bombas fatiadas. Observe antes de cortar."});}
            say("💥 Bomba! Vidas: "+lives);
          }else{sc+=10;H.score(sc);hud.set("sc",sc);H.sfx("pop");}
          halves.push({x:it.x,y:it.y,vx:-90,vy:it.vy*.4,e:it.e,bomb:it.bomb,life:1});
          halves.push({x:it.x,y:it.y,vx:90,vy:it.vy*.4,e:it.e,bomb:it.bomb,life:1});
          break;
        }
      }
    }
  }
  items=items.filter(it=>it.y<o.H+40&&!it.sliced);
  for(const h of halves){h.vy+=700*dt;h.x+=h.vx*dt;h.y+=h.vy*dt;h.life-=dt;}
  halves=halves.filter(h=>h.life>0);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.font="30px serif";
  for(const it of items){x.save();x.translate(it.x,it.y);x.rotate(it.rot*.2);x.fillText(it.e,-15,10);x.restore();}
  x.globalAlpha=.7;
  for(const h of halves){x.font="20px serif";x.fillText(h.e,h.x-10,h.y+7);}
  x.globalAlpha=1;
  x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();
  trail.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();
});
}});
