/* NCODE N · 062 Canos Batendo Asa — voe entre os canos */
GREG(62,{
init(root,H){
const GOAL=15;
let over=false,bx,by,vy,pipes,sc=0,spawn=0,dead=false;
const hud=H.hud(root,[["cb","CANOS","0/15"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> bate as asas. Passe por "+GOAL+" canos sem encostar!");
const o=H.cvs(root,460,440),x=o.x;
function build(){bx=120;by=o.H/2;vy=0;pipes=[];sc=0;dead=false;spawn=1.2;}
build();
function flap(){if(over||dead)return;vy=-430;H.beep(600,.06,"square",.035);}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")flap();});
H.onTap(o,flap);
H.loop(dt=>{
  if(over)return;
  if(!dead){
    vy+=1300*dt;by+=vy*dt;
    spawn-=dt;
    if(spawn<=0){spawn=1.5;
      const gap=140,gy=80+Math.random()*(o.H-160-gap);
      pipes.push({x:o.W+20,gy,gap,ok:false});
    }
    for(const p of pipes){
      p.x-=170*dt;
      if(!p.ok&&p.x+34<bx){p.ok=true;sc++;H.score(sc);hud.set("sc",sc);hud.set("cb",sc+"/"+GOAL);H.sfx("ok");
        if(sc>=GOAL){over=true;return H.done({win:true,score:sc*20+100,title:"Voo limpo!",sub:GOAL+" canos cruzados sem uma pena amassada."});}}
      if(bx+12>p.x&&bx-12<p.x+34&&(by-12<p.gy||by+12>p.gy+p.gap)){dead=true;H.sfx("lose");}
    }
    pipes=pipes.filter(p=>p.x>-60);
    if(by<-20||by>o.H+20)dead=true;
    if(dead){over=true;return H.done({win:false,score:sc*20,title:"Caiu do céu!",sub:sc+" canos de "+GOAL+". Bata as asas com ritmo!"});}
  }
  x.fillStyle="#cfe8ef";x.fillRect(0,0,o.W,o.H);
  for(const p of pipes){
    x.fillStyle=H.C.ok;x.fillRect(p.x,0,34,p.gy);x.fillRect(p.x,p.gy+p.gap,34,o.H-p.gy-p.gap);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(p.x,0,34,p.gy);x.strokeRect(p.x,p.gy+p.gap,34,o.H-p.gy-p.gap);
    x.fillStyle=H.C.ink;x.fillRect(p.x-3,p.gy-12,40,12);x.fillRect(p.x-3,p.gy+p.gap,40,12);
  }
  x.save();x.translate(bx,by);x.rotate(H.clamp(vy/900,-.4,.7));
  x.font="30px serif";x.fillText("🐤",-15,10);x.restore();
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
