/* NCODE N · 181 Simulador de Tecido — corte e cace as estrelas! */
GREG(181,{
init(root,H){
const C=14,R=10,SP=26,X0=70,Y0=30;
let over=false,pts=[],cons=[],stars=[],got=0,cut=0,total=0;
const hud=H.hud(root,[["es","ESTRELAS","0/3"],["ct","CORTES","0%"]]);
const say=H.msg(root,"ARRASTE a tesoura ✂️ pelo tecido para cortar fios! Solte as 3 ⭐ na cesta 🧺 — mas não corte os fios do varão (topo) nem 60% do pano!");
const o=H.cvs(root,500,400),x=o.x;
function id(c,r){return r*C+c;}
for(let r=0;r<R;r++)for(let c=0;c<C;c++)
  pts.push({x:X0+c*SP,y:Y0+r*SP,ox:X0+c*SP,oy:Y0+r*SP,pin:r===0});
for(let r=0;r<R;r++)for(let c=0;c<C;c++){
  if(c<C-1)cons.push({a:id(c,r),b:id(c+1,r),top:r===0});
  if(r<R-1)cons.push({a:id(c,r),b:id(c,r+1),top:r===0});
}
total=cons.length;
stars=[{p:id(4,6),got:false},{p:id(9,5),got:false},{p:id(6,8),got:false}];
const BASK={x:250,y:350,w:120};
const ptr=H.ptr(o);
let last=null;
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.03);
  // corte
  if(ptr.down){
    if(last){
      cons=cons.filter(k=>{
        const A=pts[k.a],B=pts[k.b];
        const mx=(A.x+B.x)/2,my=(A.y+B.y)/2;
        const d=Math.hypot(mx-ptr.x,my-ptr.y);
        if(d<14){
          if(k.top){over=true;H.sfx("lose");
            H.done({win:false,score:got*100,title:"Pano no chão!",sub:"Você cortou o varão! Corte só o meio."});
            return true;}
          cut++;return false;
        }
        return true;
      });
      if(over)return;
      hud.set("ct",Math.floor(cut/total*100)+"%");
      if(cut/total>0.6){over=true;
        return H.done({win:false,score:got*100,title:"Pano destruído!",sub:"Mais de 60% cortado. Seja cirúrgico!"});
      }
    }
    last={x:ptr.x,y:ptr.y};
  }else last=null;
  // física
  for(const p of pts){
    if(p.pin)continue;
    const vx=(p.x-p.ox)*0.98,vy=(p.y-p.oy)*0.98;
    p.ox=p.x;p.oy=p.y;
    p.x+=vx;p.y+=vy+900*dt*dt*2;
  }
  for(let k=0;k<3;k++){
    for(const cn of cons){
      const A=pts[cn.a],B=pts[cn.b];
      const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1;
      const diff=(d-SP)/d*.5;
      if(!A.pin){A.x+=dx*diff;A.y+=dy*diff;}
      if(!B.pin){B.x-=dx*diff;B.y-=dy*diff;}
    }
  }
  pts.forEach(p=>{if(p.y>390)p.y=390;});
  stars.forEach(s=>{
    if(s.got)return;
    const p=pts[s.p];
    if(Math.abs(p.x-BASK.x)<BASK.w/2&&p.y>BASK.y-30){
      s.got=true;got++;H.score(got*100);hud.set("es",got+"/3");H.sfx("ok");
      if(got>=3){over=true;
        return H.done({win:true,score:400,title:"Alfaiate físico!",sub:"3 estrelas na cesta com o pano inteiro."});}
    }
  });
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.lineWidth=2;
  cons.forEach(cn=>{
    x.beginPath();x.moveTo(pts[cn.a].x,pts[cn.a].y);x.lineTo(pts[cn.b].x,pts[cn.b].y);x.stroke();
  });
  x.strokeStyle=H.C.ink;x.lineWidth=5;
  x.beginPath();x.moveTo(X0-20,Y0-6);x.lineTo(X0+C*SP,Y0-6);x.stroke();
  x.font="18px serif";
  stars.forEach(s=>{if(!s.got)x.fillText("⭐",pts[s.p].x-9,pts[s.p].y+6);});
  x.fillStyle="#8A6A2F";x.fillRect(BASK.x-BASK.w/2,BASK.y,BASK.w,26);
  x.font="22px serif";x.fillText("🧺",BASK.x-11,BASK.y+22);
  if(ptr.down){x.font="20px serif";x.fillText("✂️",ptr.x-10,ptr.y+7);}
});
}});
