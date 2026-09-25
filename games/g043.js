/* NCODE N · 043 Corte de Frutas — fatie, desvie das bombas */
GREG(43,{
init(root,H){
const FR=[["maçã","#D94E34"],["laranja","#E8A33D"],["melancia","#3E7C4F"],["limão","#C4D645"],["uva","#2E6E8A"],["kiwi","#9AAE2E"]];
let over=false,items=[],halves=[],sc=0,lives=3,t=60,spawn=0,trail=[];
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Deslize o dedo/mouse para <b>fatiar</b>. Bombas custam uma vida!");
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
      e:bomb?-1:Math.floor(Math.random()*FR.length),bomb,r:22,sliced:false,rot:Math.random()*6});
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
            say("Bomba! Vidas: "+lives);
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
  x.textAlign="center";
  for(const it of items){x.save();x.translate(it.x,it.y);x.rotate(it.rot*.2);
    const fr=it.e<0?null:FR[it.e];
    x.fillStyle=it.bomb?"#181816":fr[1];x.beginPath();x.arc(0,0,20,0,7);x.fill();
    x.strokeStyle=it.bomb?"#181816":H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=it.bomb?H.C.paper:H.C.ink;x.font="bold 10px 'Plus Jakarta Sans',sans-serif";x.textAlign="center";x.textBaseline="middle";
    x.fillText(it.bomb?"BOMB":fr[0],0,1);x.restore();}
  x.globalAlpha=.7;
  for(const h of halves){x.save();x.translate(h.x,h.y);x.rotate((1-h.life)*3);
    const fr=h.e<0?null:FR[h.e];
    x.fillStyle=h.bomb?"#181816":fr[1];x.beginPath();x.arc(0,0,11,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=1.5;x.stroke();x.restore();}
  x.globalAlpha=1;
  x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();
  trail.forEach((p,i)=>i?x.lineTo(p.x,p.y):x.moveTo(p.x,p.y));x.stroke();
});
}});
