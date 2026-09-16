#!/usr/bin/env python3
"""Gera games/g181..g190 — FÍSICA & SANDBOX (parte 3, final)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 181 — Simulador de Tecido
GAMES[181] = r"""/* NCODE N · 181 Simulador de Tecido — corte e cace as estrelas! */
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
}});"""

# 182 — Corpo Mole
GAMES[182] = r"""/* NCODE N · 182 Corpo Mole — atravesse sem estourar! */
GREG(182,{
init(root,H){
let over=false,blob={x:60,y:300,vx:0,vy:0,r:22,sq:0},squeeze=0,spikes=[];
const hud=H.hud(root,[["es","PRESSÃO","0%"],["st","STATUS","vá ao 🏁"]]);
const say=H.msg(root,"ARRASTE a geleca pelo canal até o 🏁! Espremida demais (fino) ou espinho = 💥. Devagar nas fendas!");
const o=H.cvs(root,520,400),x=o.x;
const WALLS=[
  {x:0,y:0,w:520,h:20},{x:0,y:380,w:520,h:20},
  {x:150,y:20,w:24,h:220},{x:150,y:320,w:24,h:60},
  {x:300,y:100,w:24,h:280},{x:420,y:20,w:24,h:200},{x:420,y:300,w:24,h:80}
];
spikes=[{x:260,y:360},{x:262,y:40},{x:486,y:250}];
const GOAL={x:486,y:330};
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  if(ptr.down){
    blob.vx+=((ptr.x-blob.x)*8-blob.vx)*dt*4;
    blob.vy+=((ptr.y-blob.y)*8-blob.vy)*dt*4;
  }else{blob.vx*=0.9;blob.vy*=0.9;}
  blob.vx=H.clamp(blob.vx,-260,260);blob.vy=H.clamp(blob.vy,-260,260);
  blob.x+=blob.vx*dt;blob.y+=blob.vy*dt;
  // colisão paredes (empurra para fora)
  for(const w of WALLS){
    const nx=H.clamp(blob.x,w.x,w.x+w.w),ny=H.clamp(blob.y,w.y,w.y+w.h);
    const dx=blob.x-nx,dy=blob.y-ny,d=Math.hypot(dx,dy);
    if(d<blob.r){
      const push=(blob.r-d);
      if(d>0.01){blob.x+=dx/d*push;blob.y+=dy/d*push;}
      blob.vx*=.5;blob.vy*=.5;
    }
  }
  blob.x=H.clamp(blob.x,24,o.W-24);blob.y=H.clamp(blob.y,24,o.H-24);
  // espremer: mede espaço livre ao redor
  let free=60;
  for(const w of WALLS){
    const nx=H.clamp(blob.x,w.x,w.x+w.w),ny=H.clamp(blob.y,w.y,w.y+w.h);
    free=Math.min(free,Math.hypot(blob.x-nx,blob.y-ny));
  }
  const target=free<blob.r+6?(1-free/(blob.r+6)):0;
  blob.sq+=(target-blob.sq)*dt*5;
  hud.set("es",Math.floor(blob.sq*100)+"%");
  if(blob.sq>0.75){squeeze+=dt;
    if(squeeze>1){over=true;H.sfx("lose");
      return H.done({win:false,score:0,title:"ESPLODIU! 💥",sub:"Espremeram demais a geleca. Passe devagar!"});
    }
  }else squeeze=Math.max(0,squeeze-dt*2);
  if(spikes.some(s=>Math.hypot(blob.x-s.x,blob.y-s.y)<20)){
    over=true;H.sfx("lose");
    return H.done({win:false,score:0,title:"ESPETOU! 💥",sub:"Desvie dos espinhos!"});
  }
  if(Math.hypot(blob.x-GOAL.x,blob.y-GOAL.y)<28){
    over=true;H.score(300);
    return H.done({win:true,score:300,title:"Geleca ninja!",sub:"Atravessou o canal inteirinha."});
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#5b3d20";
  WALLS.forEach(w=>x.fillRect(w.x,w.y,w.w,w.h));
  x.font="20px serif";
  spikes.forEach(s=>x.fillText("🦔",s.x-10,s.y+7));
  x.font="30px serif";x.fillText("🏁",GOAL.x-15,GOAL.y+10);
  const rx=blob.r*(1+blob.sq*.7),ry=blob.r*(1-blob.sq*.55);
  x.fillStyle="rgba(196,214,69,.9)";
  x.beginPath();x.ellipse(blob.x,blob.y,rx,ry,0,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(blob.x-6,blob.y-3,2.5,0,7);x.arc(blob.x+6,blob.y-3,2.5,0,7);x.fill();
  if(blob.sq>0.5){x.fillStyle=H.C.terra;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("⚠ VAI ESTOURAR!",180,30);}
});
}});"""

# 183 — Bola Grudenta
GAMES[183] = r"""/* NCODE N · 183 Bola Grudenta — cresça até 40! */
GREG(183,{
init(root,H){
let over=false,ball={x:250,y:200,vx:0,vy:0,r:10},objs=[],time=120,ax=0,ay=0;
const hud=H.hud(root,[["tm","TAMANHO",10],["tp","TEMPO",120],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas/WASD ou ARRASTE para rolar! Grude nos menores (📎🍒🧸…). Maiores que você te empurram. Chegue a 40!");
const o=H.cvs(root,500,380),x=o.x;
const EM=[["📎",4],["🍒",5],["🧸",7],["📕",6],["🎾",8],["👟",10],["🐈",12],["🪑",15],["🚲",18],["🛋️",22],["🚗",26],["🐘",30]];
const r=H.rng(9);
for(let i=0;i<36;i++){
  const k=Math.floor(r()*Math.min(EM.length,4+Math.floor(i/5)));
  objs.push({e:EM[k][0],s:EM[k][1],x:30+r()*440,y:30+r()*320});
}
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowLeft"||c==="KeyA")ax=d?-1:(ax===-1?0:ax);
  if(c==="ArrowRight"||c==="KeyD")ax=d?1:(ax===1?0:ax);
  if(c==="ArrowUp"||c==="KeyW")ay=d?-1:(ay===-1?0:ay);
  if(c==="ArrowDown"||c==="KeyS")ay=d?1:(ay===1?0:ay);
});
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:Math.floor(ball.r)*10,title:"Tempo!",sub:"Tamanho "+Math.floor(ball.r)+"/40. Grude nos pequenos primeiro!"});
  }
  let dx=ax,dy=ay;
  if(ptr.down){dx=(ptr.x-ball.x)/60;dy=(ptr.y-ball.y)/60;}
  ball.vx+=(dx*300-ball.vx)*dt*3;
  ball.vy+=(dy*300-ball.vy)*dt*3;
  ball.x=H.clamp(ball.x+ball.vx*dt,ball.r,o.W-ball.r);
  ball.y=H.clamp(ball.y+ball.vy*dt,ball.r,o.H-ball.r);
  for(let i=objs.length-1;i>=0;i--){
    const ob=objs[i];
    if(Math.hypot(ob.x-ball.x,ob.y-ball.y)<ball.r+ob.s){
      if(ob.s<ball.r*1.15){
        objs.splice(i,1);
        ball.r=Math.min(46,ball.r+ob.s*.22);
        H.sfx("pop");
        hud.set("tm",Math.floor(ball.r));H.score(Math.floor(ball.r)*10);hud.set("sc",Math.floor(ball.r)*10);
        if(ball.r>=40){over=true;
          return H.done({win:true,score:500,title:"Bola gigante!",sub:"De clipe a elefante em "+Math.floor(120-time)+"s!"});
        }
      }else{
        const d=Math.max(1,Math.hypot(ball.x-ob.x,ball.y-ob.y));
        ball.vx+=(ball.x-ob.x)/d*400*dt;ball.vy+=(ball.y-ob.y)/d*400*dt;
      }
    }
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.font="20px serif";
  objs.forEach(ob=>{
    x.font=Math.max(12,ob.s*1.6)+"px serif";
    x.fillText(ob.e,ob.x-ob.s*.8,ob.y+ob.s*.6);
  });
  x.fillStyle="#D94E34";
  x.beginPath();x.arc(ball.x,ball.y,ball.r,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.fillStyle="rgba(255,255,255,.4)";
  x.beginPath();x.arc(ball.x-ball.r*.3,ball.y-ball.r*.3,ball.r*.25,0,7);x.fill();
});
}});"""

# 184 — Travessia de Tábuas
GAMES[184] = r"""/* NCODE N · 184 Travessia de Tábuas — pregue e atravesse! */
GREG(184,{
init(root,H){
let over=false,pillars=[],gaps=[],planks=[],sel=-1,nails=8,walk=null,wind=0,wt=0;
const hud=H.hud(root,[["pg","PREGOS",8],["vn","VENTO","calmo"],["st","STATUS","construa"]]);
const say=H.msg(root,"Escolha a <b>tábua</b> (clique), clique no <b>vão</b> para deitar, clique na tábua para <b>pregar</b>! Solta + ventania = voa. Depois ATRAVESSE!");
const o=H.cvs(root,520,360),x=o.x;
for(let i=0;i<6;i++)pillars.push({x:40+i*88});
gaps=[0,1,2,3,4].map(i=>({a:i,b:i+1,plank:null,nail:false}));
planks=[{L:100},{L:96},{L:104},{L:92},{L:100},{L:98}];
H.onTap(o,(px,py)=>{
  if(over||walk)return;
  if(py>200&&py<300){
    let gi=-1;
    gaps.forEach((g,i)=>{
      const xa=pillars[g.a].x,xb=pillars[g.b].x;
      if(px>xa-10&&px<xb+10)gi=i;
    });
    if(gi<0)return;
    const g=gaps[gi];
    if(!g.plank){
      if(sel<0){H.sfx("bad");say("Escolha uma tábua abaixo primeiro!");return;}
      const gapLen=pillars[g.b].x-pillars[g.a].x;
      if(planks[sel].L<gapLen-6){H.sfx("bad");say("Tábua curta demais para este vão!");return;}
      g.plank=planks.splice(sel,1)[0];sel=-1;H.sfx("tick");paint();
    }else if(!g.nail){
      if(nails<=0){H.sfx("bad");say("Sem pregos!");return;}
      nails--;g.nail=true;hud.set("pg",nails);H.sfx("ok");paint();
    }
  }
});
const box=H.el("div","g-row",null,root);
function paint(){
  box.innerHTML="";
  planks.forEach((p,i)=>{
    const b=H.el("button","g-chip"+(sel===i?" hot":""),"🪵 "+p.L+"cm",box);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");paint();});
  });
  if(!planks.length)H.el("div","g-chip","sem tábuas…",box);
}
paint();
H.btn(root,"🚶 ATRAVESSAR!",()=>{
  if(over||walk)return;
  if(gaps.some(g=>!g.plank)){H.sfx("bad");say("Faltam tábuas em vãos!");return;}
  walk={x:pillars[0].x,g:0};hud.set("st","atravessando…");H.sfx("tick");
},true);
H.loop(dt=>{
  if(over)return;
  wt+=dt;
  if(wt>4){wt=0;wind=Math.random()<.4?1:0;hud.set("vn",wind?"VENTANIA!":"calmo");}
  if(wind&&!walk&&Math.random()<dt*.8){
    const loose=gaps.filter(g=>g.plank&&!g.nail);
    if(loose.length){
      const g=loose[Math.floor(Math.random()*loose.length)];
      planks.push(g.plank);g.plank=null;H.sfx("bad");paint();
      say("💨 A ventania levou uma tábua solta! PREGUE tudo.");
    }
  }
  if(walk&&!over){
    walk.x+=60*dt;
    const g=gaps[walk.g];
    const xb=pillars[g.b].x;
    if(walk.x>=xb){
      if(!g.nail&&Math.random()<.5){
        over=true;H.sfx("lose");
        return H.done({win:false,score:0,title:"TÁBUA SOLTA!",sub:"O vão "+(walk.g+1)+" cedeu. Pregue antes de atravessar!"});
      }
      walk.g++;
      if(walk.g>=gaps.length){over=true;H.score(300+nails*10);
        return H.done({win:true,score:300+nails*10,title:"Travessia heroica!",sub:"5 vãos sobre o cânion."});
      }
    }
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#3E7C4F";x.fillRect(0,300,o.W,60);
  pillars.forEach(p=>{
    x.fillStyle="#8A6A2F";x.fillRect(p.x-14,230,28,80);
  });
  gaps.forEach(g=>{
    const xa=pillars[g.a].x,xb=pillars[g.b].x;
    if(g.plank){
      x.fillStyle="#C9A06F";x.fillRect(xa-14,222,xb-xa+28,10);
      x.strokeStyle=H.C.ink;x.strokeRect(xa-14,222,xb-xa+28,10);
      if(g.nail){x.fillStyle=H.C.ink;x.beginPath();x.arc(xa,227,3,0,7);x.arc(xb,227,3,0,7);x.fill();}
    }else{
      x.strokeStyle=H.C.terra;x.setLineDash([5,5]);
      x.beginPath();x.moveTo(xa-14,227);x.lineTo(xb+14,227);x.stroke();x.setLineDash([]);
    }
  });
  if(walk){x.font="26px serif";x.fillText("🧍",walk.x-13,222);}
  else{x.font="26px serif";x.fillText("🧍",pillars[0].x-40,300);}
  if(wind){x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";x.fillText("💨💨💨",200,40);}
});
}});"""

# 185 — Pilha de Canhão
GAMES[185] = r"""/* NCODE N · 185 Pilha de Canhão — pirâmide 3-2-1! */
GREG(185,{
init(root,H){
const CAN={x:70,y:320};
let over=false,balls=[],aim=null,shots=12,rest=0;
const hud=H.hud(root,[["ti","TIROS",12],["pl","EMPILHADAS","0/6"]]);
const say=H.msg(root,"ARRASTE do canhão para mirar e SOLTE! Empilhe 6 balas na plataforma: 3 embaixo, 2 no meio, 1 no topo. 12 tiros!");
const o=H.cvs(root,520,380),x=o.x;
const PLAT={x:330,y:300,w:150,h:16};
const ptr=H.ptr(o);
let wasDown=false;
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.03);
  if(ptr.down&&shots>0){
    if(!wasDown&&Math.hypot(ptr.x-CAN.x,ptr.y-CAN.y)<110)aim={x:ptr.x,y:ptr.y};
    if(aim)aim={x:ptr.x,y:ptr.y};
  }else if(aim&&!ptr.down){
    const dx=CAN.x-aim.x,dy=CAN.y-aim.y;
    if(Math.hypot(dx,dy)>24){
      balls.push({x:CAN.x,y:CAN.y,vx:dx*3.4,vy:dy*3.4,r:14});
      shots--;hud.set("ti",shots);H.sfx("tick");
      if(shots<=0&&balls.length<6)say("Últimos tiros voando…");
    }
    aim=null;
  }
  wasDown=ptr.down;
  // física
  balls.forEach(b=>{
    b.vy+=800*dt;
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    b.vx*=0.999;
    // chão
    if(b.y>360-b.r){b.y=360-b.r;b.vy*=-0.3;b.vx*=0.8;}
    // plataforma (topo)
    if(b.vy>0&&b.x>PLAT.x&&b.x<PLAT.x+PLAT.w&&b.y+b.r>PLAT.y&&b.y+b.r<PLAT.y+26){
      b.y=PLAT.y-b.r;b.vy*=-0.25;b.vx*=0.85;
    }
    if(b.x<14){b.x=14;b.vx*=-0.4;}if(b.x>o.W-14){b.x=o.W-14;b.vx*=-0.4;}
  });
  for(let k=0;k<4;k++){
    for(let i=0;i<balls.length;i++)for(let j=i+1;j<balls.length;j++){
      const A=balls[i],B=balls[j];
      const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy),min=A.r+B.r;
      if(d<min&&d>0.01){
        const push=(min-d)/2,nx=dx/d,ny=dy/d;
        A.x-=nx*push;A.y-=ny*push;B.x+=nx*push;B.y+=ny*push;
        const rvx=B.vx-A.vx,rvy=B.vy-A.vy,rel=rvx*nx+rvy*ny;
        if(rel<0){
          A.vx+=nx*rel*.6;A.vy+=ny*rel*.6;
          B.vx-=nx*rel*.6;B.vy-=ny*rel*.6;
        }
      }
    }
  }
  const still=balls.every(b=>Math.hypot(b.vx,b.vy)<25);
  const onPlat=balls.filter(b=>b.x>PLAT.x-10&&b.x<PLAT.x+PLAT.w+10&&b.y<PLAT.y);
  const lv0=onPlat.filter(b=>b.y>PLAT.y-40).length;
  const lv1=onPlat.filter(b=>b.y<=PLAT.y-40&&b.y>PLAT.y-72).length;
  const lv2=onPlat.filter(b=>b.y<=PLAT.y-72).length;
  hud.set("pl",onPlat.length+"/6");
  if(still&&onPlat.length>=6&&lv0>=3&&lv1>=2&&lv1+lv2>=3){
    over=true;H.score(300+shots*20);
    return H.done({win:true,score:300+shots*20+100,title:"Artilheiro engenheiro!",sub:"Pirâmide 3-2-1 empilhada a bala!"});
  }
  if(shots<=0&&still){
    rest+=dt;
    if(rest>1.5){over=true;
      return H.done({win:false,score:onPlat.length*30,title:"Pilha torta!",sub:onPlat.length+"/6 na plataforma (3+2+1). Mire com carinho!"});
    }
  }else rest=0;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,360,o.W,20);
  x.fillStyle="#5b3d20";x.fillRect(PLAT.x,PLAT.y,PLAT.w,PLAT.h);
  x.fillRect(PLAT.x+10,PLAT.y+16,14,44);x.fillRect(PLAT.x+PLAT.w-24,PLAT.y+16,14,44);
  x.font="30px serif";x.fillText("💣",CAN.x-15,CAN.y+10);
  if(aim){
    x.strokeStyle=H.C.terra;x.lineWidth=2;
    x.beginPath();x.moveTo(CAN.x,CAN.y);x.lineTo(aim.x,aim.y);x.stroke();
  }
  balls.forEach(b=>{
    x.fillStyle=H.C.ink;x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill();
    x.fillStyle="#555";x.beginPath();x.arc(b.x-4,b.y-4,4,0,7);x.fill();
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("base "+Math.min(3,lv0)+"/3 · meio "+Math.min(2,lv1)+"/2 · topo "+Math.min(1,lv2)+"/1",330,290);
});
}});"""

# 186 — Derretimento de Gelo
GAMES[186] = r"""/* NCODE N · 186 Derretimento de Gelo — salve o brinquedo! */
GREG(186,{
init(root,H){
const N=10;
let over=false,ice=[],src=[],toy={r:5,c:5},heat=0,time=90;
const hud=H.hud(root,[["tp","TEMPO",90],["br","BRINQUEDO","preso 🧊"],["tq","CALOR NO BRINQUEDO","0%"]]);
const say=H.msg(root,"Clique para plantar <b>🔥 fonte de calor</b> (3 no total, clique de novo para mover). Derreta o gelo ao redor do 🧸 — mas calor demais nele (100% por 3s) derrete o brinquedo!");
const o=H.cvs(root,400,400),x=o.x;
const CS=36,OX=20,OY=20;
const r=H.rng(4);
for(let i=0;i<N*N;i++)ice.push(3);
src=[];
let over3=0;
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor((px-OX)/CS),rr=Math.floor((py-OY)/CS);
  if(c<0||c>=N||rr<0||rr>=N)return;
  const ix=src.findIndex(s=>s.c===c&&s.r===rr);
  if(ix>=0){src.splice(ix,1);H.sfx("tick");return;}
  if(src.length>=3){src.shift();}
  src.push({c,r:rr});H.sfx("tick");
});
function heatAt(c,rr){
  let h=0;
  src.forEach(s=>{
    const d=Math.hypot(s.c-c,s.r-rr);
    if(d<3.2)h+=Math.max(0,3.2-d);
  });
  return h;
}
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:0,title:"Congelou de novo!",sub:"O brinquedo segue preso. Cerque de calor!"});
  }
  for(let rr=0;rr<N;rr++)for(let c=0;c<N;c++){
    const k=rr*N+c;
    if(ice[k]>0&&heatAt(c,rr)>1.2)ice[k]=Math.max(0,ice[k]-dt*heatAt(c,rr)*.5);
  }
  const th=heatAt(toy.c,toy.r);
  heat=th>2.6?Math.min(100,heat+dt*34):Math.max(0,heat-dt*25);
  hud.set("tq",Math.floor(heat)+"%");
  if(heat>=100){over3+=dt;
    if(over3>3){over=true;H.sfx("lose");
      return H.done({win:false,score:0,title:"Brinquedo derretido!",sub:"Calor demais nele. Aqueça as bordas!"});
    }
  }else over3=0;
  // livre? 8 vizinhos derretidos
  let free=true;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(!dr&&!dc)continue;
    const nc=toy.c+dc,nr=toy.r+dr;
    if(nc<0||nc>=N||nr<0||nr>=N)continue;
    if(ice[nr*N+nc]>0.5)free=false;
  }
  if(free){over=true;H.score(300+Math.floor(time)*2);
    return H.done({win:true,score:300+Math.floor(time)*2,title:"Resgate gelado!",sub:"Brinquedo livre e intacto!"});
  }
  x.fillStyle="#0d2436";x.fillRect(0,0,o.W,o.H);
  for(let rr=0;rr<N;rr++)for(let c=0;c<N;c++){
    const v=ice[rr*N+c];
    x.fillStyle=v>2?"#7FB3D5":v>1?"#A8CCE4":v>0?"#D4E7F3":"rgba(255,255,255,.08)";
    x.fillRect(OX+c*CS+1,OY+rr*CS+1,CS-2,CS-2);
    if(heatAt(c,rr)>1.2&&v>0){
      x.fillStyle="rgba(217,78,52,.25)";
      x.fillRect(OX+c*CS+1,OY+rr*CS+1,CS-2,CS-2);
    }
  }
  x.font="22px serif";
  src.forEach(s=>x.fillText("🔥",OX+s.c*CS+4,OY+s.r*CS+28));
  x.fillText("🧸",OX+toy.c*CS+4,OY+toy.r*CS+28);
});
}});"""

# 187 — Plástico Bolha
GAMES[187] = r"""/* NCODE N · 187 Plástico Bolha — ESTOURE TUDO! */
GREG(187,{
init(root,H){
const C=8,R=6;
let over=false,bub=[],combo=0,best=0,time=60,last=0;
const hud=H.hud(root,[["tp","TEMPO",60],["cb","COMBO","x1"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas bolhas para estourar! Rápidas em sequência = <b>combo</b>. Dourada = +50! Estoure as 48 em 60s!");
const o=H.cvs(root,480,380),x=o.x;
let sc=0;
const r=H.rng(Date.now()%10000);
for(let i=0;i<C*R;i++)bub.push({pop:false,gold:r()<.06});
const CW=o.W/C,CH=o.H/R;
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor(px/CW),rr=Math.floor(py/CH);
  if(c<0||c>=C||rr<0||rr>=R)return;
  const b=bub[rr*C+c];
  if(b.pop){combo=0;hud.set("cb","x1");return;}
  b.pop=true;
  const now=performance.now();
  combo=(now-last<900)?combo+1:1;
  last=now;best=Math.max(best,combo);
  const pts=(b.gold?50:10)*Math.min(combo,8);
  sc+=pts;H.score(sc);hud.set("sc",sc);hud.set("cb","x"+Math.min(combo,8));
  H.beep(300+Math.min(combo,12)*60,.06);
  if(bub.every(q=>q.pop)){over=true;
    return H.done({win:true,score:sc+Math.floor(time)*5+100,title:"Satisfação total!",sub:"48 estouros, combo máximo x"+Math.min(best,8)+"!"});
  }
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    const left=bub.filter(q=>!q.pop).length;
    return H.done({win:false,score:sc,title:"Sobraram "+left+"!",sub:"Dedos mais rápidos na próxima!"});
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  bub.forEach((b,i)=>{
    const c=i%C,rr=(i/C)|0;
    const cx=c*CW+CW/2,cy=rr*CH+CH/2;
    if(b.pop){
      x.strokeStyle="rgba(0,0,0,.15)";
      x.beginPath();x.arc(cx,cy,14,0,7);x.stroke();
    }else{
      const g=x.createRadialGradient(cx-5,cy-5,2,cx,cy,18);
      if(b.gold){g.addColorStop(0,"#FFF3C4");g.addColorStop(1,"#E8A33D");}
      else{g.addColorStop(0,"#ffffff");g.addColorStop(1,"#7FB3D5");}
      x.fillStyle=g;
      x.beginPath();x.arc(cx,cy,17,0,7);x.fill();
      x.strokeStyle="rgba(0,0,0,.2)";x.stroke();
    }
  });
});
}});"""

# 188 — Areia no Recipiente
GAMES[188] = r"""/* NCODE N · 188 Areia no Recipiente — na medida exata! */
GREG(188,{
init(root,H){
let over=false,fx=250,pour=false,sand=100,jars=[],spill=0;
const hud=H.hud(root,[["ar","AREIA",100],["js","POTES","0/3"]]);
const say=H.msg(root,"ARRASTE o funil e SEGURE <b>despejar</b>! Encha cada pote até a <b>linha (±5)</b>. Areia fora do pote = desperdício. 100 de areia no total!");
const o=H.cvs(root,500,380),x=o.x;
jars=[{x:90,t:30,f:0},{x:250,t:45,f:0},{x:410,t:25,f:0}];
const ptr=H.ptr(o);
const btn=H.el("button","g-btn","SEGURE PARA DESPEJAR",root);
btn.addEventListener("pointerdown",e=>{e.preventDefault();pour=true;});
btn.addEventListener("pointerup",()=>pour=false);
btn.addEventListener("pointerleave",()=>pour=false);
const kb=H.keys();
kb.on((c,d)=>{if(c==="Space")pour=d;});
H.loop(dt=>{
  if(over)return;
  if(ptr.down)fx=H.clamp(ptr.x,40,o.W-40);
  if(pour&&sand>0){
    const amt=Math.min(sand,dt*16);
    sand-=amt;
    const j=jars.find(k=>Math.abs(fx-k.x)<34);
    if(j)j.f+=amt;else spill+=amt;
    hud.set("ar",Math.floor(sand));
    if(Math.random()<dt*10)H.sfx("tick");
  }
  const ok=jars.filter(j=>Math.abs(j.f-j.t)<=5).length;
  hud.set("js",ok+"/3");
  if(ok>=3){over=true;H.score(300+Math.floor(sand)*3);
    return H.done({win:true,score:300+Math.floor(sand)*3+100,title:"Medida exata!",sub:"3 potes perfeitos, "+Math.floor(sand)+" de areia de sobra."});
  }
  if(sand<=0&&!pour){
    over=true;
    return H.done({win:false,score:ok*80,title:"Areia acabou!",sub:ok+"/3 potes. Desperdiçou "+Math.floor(spill)+" fora!"});
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  jars.forEach(j=>{
    const h=200,fh=Math.min(200,j.f/50*200);
    x.strokeStyle=H.C.ink;x.lineWidth=3;
    x.strokeRect(j.x-34,140,68,200);
    x.fillStyle="#E4D5B5";
    x.fillRect(j.x-31,340-fh,62,fh);
    const ty=340-j.t/50*200;
    x.strokeStyle=H.C.ok;x.lineWidth=3;
    x.beginPath();x.moveTo(j.x-40,ty);x.lineTo(j.x+40,ty);x.stroke();
    x.fillStyle=Math.abs(j.f-j.t)<=5?H.C.ok:H.C.ink;
    x.font="bold 12px 'Space Mono',monospace";
    x.fillText(Math.floor(j.f)+"/"+j.t,j.x-20,356);
  });
  // funil
  x.fillStyle="#8A877C";
  x.beginPath();x.moveTo(fx-26,20);x.lineTo(fx+26,20);x.lineTo(fx+8,60);x.lineTo(fx-8,60);x.closePath();x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  if(pour&&sand>0){
    x.fillStyle="#D9B96F";
    x.fillRect(fx-2,60,4,90);
  }
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("arraste o funil · espaço também despeja",12,20);
});
}});"""

# 189 — Corda de Tarzan
GAMES[189] = r"""/* NCODE N · 189 Corda de Tarzan — atravesse o rio! */
GREG(189,{
init(root,H){
const ROPES=[{x:140,l:150},{x:300,y:0,l:170},{x:460,y:0,l:150}];
let over=false,ri=0,a=-1.1,va=1.5,mode="swing",fly=null,lives=3;
const hud=H.hud(root,[["cp","CIPÓ","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Balançe no cipó e aperte <b>SOLTAR (ou Espaço/toque)</b> no ponto certo! Alcance o próximo cipó ou a margem. 3 vidas!");
const o=H.cvs(root,540,400),x=o.x;
let sc=0;
const PLAT=[{x:0,w:80},{x:470,w:70}];
function anchor(){
  const R=ROPES[ri];
  return{x:R.x,y:40};
}
function pos(){
  const R=ROPES[ri],A=anchor();
  return{x:A.x+Math.sin(a)*R.l,y:A.y+Math.cos(a)*R.l};
}
function release(){
  if(over||mode!=="swing")return;
  const p=pos(),R=ROPES[ri];
  const v=va*R.l;
  let vx=Math.cos(a)*v,vy=-Math.sin(a)*v+40;
  const sp=Math.hypot(vx,vy)||1,cl=H.clamp(sp,280,480);
  vx=vx/sp*cl;vy=vy/sp*cl;
  fly={x:p.x,y:p.y,vx,vy};
  mode="fly";H.sfx("tick");
  say("Voando…");
}
H.btn(root,"🙌 SOLTAR!",release,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&(c==="Space"))release();});
H.onTap(o,()=>release());
H.loop(dt=>{
  if(over)return;
  if(mode==="swing"){
    va+=(-9.8/ROPES[ri].l*Math.sin(a))*dt*3;
    va*=0.999;a+=va*dt*3;
    if(Math.abs(va)<.05)va+=.12*dt*(a>0?-1:1);
  }else if(fly){
    fly.vy+=700*dt;fly.x+=fly.vx*dt;fly.y+=fly.vy*dt;
    // pegou próximo cipó?
    const nx=ROPES[ri+1];
    if(nx&&Math.hypot(fly.x-nx.x,fly.y-190)<46){
      ri++;a=fly.vx>0?-0.9:0.9;va=fly.vx/ROPES[ri].l;
      mode="swing";fly=null;sc+=100;H.score(sc);hud.set("sc",sc);hud.set("cp",(ri+1)+"/3");
      H.sfx("ok");say("Pegou o cipó "+(ri+1)+"!");
    }else if(fly.y>330){
      if(fly.x>470){
        over=true;H.score(sc+200);
        return H.done({win:true,score:sc+300,title:"Rei da selva!",sub:"Atravessou os 3 cipós até a margem!"});
      }
      lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;
        return H.done({win:false,score:sc,title:"Banho de rio!",sub:"3 quedas. Solte subindo para a direita!"});
      }
      say("💦 Caiu! ("+lives+" vidas) Solte quando o cipó apontar →!");
      mode="swing";fly=null;a=-1.1;va=0;
    }else if(fly.x>o.W+30||fly.x<-30){
      lives--;hud.set("vd",lives);
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Voou longe!",sub:"Solte mais cedo."});}
      mode="swing";fly=null;a=-1.1;va=0;
    }
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#2E6E8A";x.fillRect(0,330,o.W,70);
  x.fillStyle=H.C.ok;x.fillRect(0,300,80,30);x.fillRect(470,300,70,30);
  x.fillStyle="#3E7C4F";x.fillRect(0,0,o.W,40);
  ROPES.forEach((R,i)=>{
    x.strokeStyle=i===ri?"#5b3d20":"rgba(0,0,0,.25)";x.lineWidth=4;
    if(i===ri&&mode==="swing"){
      const p=pos();
      x.beginPath();x.moveTo(R.x,40);x.lineTo(p.x,p.y);x.stroke();
      x.font="26px serif";x.fillText("🧍",p.x-13,p.y-4);
    }else if(i>ri){
      x.beginPath();x.moveTo(R.x,40);x.lineTo(R.x,40+R.l);x.stroke();
      x.strokeStyle=H.C.wasabi;x.lineWidth=2;
      x.beginPath();x.arc(R.x,190,46,0,7);x.stroke();
    }
  });
  if(fly){x.font="26px serif";x.fillText("🤸",fly.x-13,fly.y+8);}
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("solte subindo → para voar longe!",150,55);
});
}});"""

# 190 — Castelo Inflável
GAMES[190] = r"""/* NCODE N · 190 Castelo Inflável — 8 estrelas pulando! */
GREG(190,{
init(root,H){
let over=false,pl={x:250,y:200,vx:0,vy:0},stars=[],got=0,time=90,ax=0;
const hud=H.hud(root,[["es","ESTRELAS","0/8"],["tp","TEMPO",90],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas/A-D ou ARRASTE para os lados — o pula-pula quica sozinho! Pegue as 8 ⭐ em 90s. Rosa = super-quique!");
const o=H.cvs(root,500,400),x=o.x;
const r=H.rng(12);
for(let i=0;i<8;i++)stars.push({x:40+r()*420,y:60+r()*180,got:false});
const BUMP=[{x:120,w:80},{x:320,w:80}];
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowLeft"||c==="KeyA")ax=d?-1:(ax===-1?0:ax);
  if(c==="ArrowRight"||c==="KeyD")ax=d?1:(ax===1?0:ax);
});
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:got*40,title:"Festa acabou!",sub:got+"/8 estrelas. Mire os quiques rosa!"});
  }
  let dx=ax;
  if(ptr.down)dx=H.clamp((ptr.x-pl.x)/80,-1,1);
  pl.vx+=(dx*260-pl.vx)*dt*4;
  pl.vy+=900*dt;
  pl.x+=pl.vx*dt;pl.y+=pl.vy*dt;
  if(pl.x<16){pl.x=16;pl.vx*=-0.7;}if(pl.x>o.W-16){pl.x=o.W-16;pl.vx*=-0.7;}
  if(pl.y>340){
    pl.y=340;
    const sup=BUMP.some(b=>pl.x>b.x&&pl.x<b.x+b.w);
    pl.vy=sup?-620:-430;
    H.sfx("pop");
  }
  stars.forEach(s=>{
    if(!s.got&&Math.hypot(s.x-pl.x,s.y-pl.y)<30){
      s.got=true;got++;H.score(got*40);hud.set("es",got+"/8");hud.set("sc",got*40);H.sfx("ok");
      if(got>=8){over=true;
        return H.done({win:true,score:420,title:"Rei do pula-pula!",sub:"8 estrelas sem parar de quicar!"});
      }
    }
  });
  x.fillStyle="#E86AA0";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#C44E80";
  for(let i=0;i<6;i++){x.fillRect(i*90+10,0,26,60);}
  x.fillStyle="#7A2E50";x.fillRect(0,340,o.W,60);
  BUMP.forEach(b=>{
    x.fillStyle=H.C.wasabi;x.fillRect(b.x,330,b.w,12);
  });
  x.font="24px serif";
  stars.forEach(s=>{if(!s.got)x.fillText("⭐",s.x-12,s.y+8);});
  x.font="30px serif";
  x.fillText("🤸",pl.x-15,pl.y-6);
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
