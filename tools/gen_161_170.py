#!/usr/bin/env python3
"""Gera games/g161..g170 — FÍSICA & SANDBOX (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 161 — Castelo de Areia
GAMES[161] = r"""/* NCODE N · 161 Castelo de Areia — 5 torres antes da maré */
GREG(161,{
init(root,H){
const ZX=[60,155,250,345,440];
let over=false,h=[0,0,0,0,0],time=75,wave=18,parts=[];
const hud=H.hud(root,[["tp","MARÉ",75],["tr","TORRES","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas <b>faixas de areia</b> para empilhar! Torres com 4+ aguentam a onda (a cada 18s ela leva 1 das fracas). 5 torres com 6+ = castelo!");
const o=H.cvs(root,500,340),x=o.x;
let sc=0;
H.onTap(o,(px,py)=>{
  if(over)return;
  let bi=0,bd=1e9;
  ZX.forEach((zx,i)=>{const d=Math.abs(px-zx);if(d<bd){bd=d;bi=i;}});
  if(bd>55||h[bi]>=10){H.sfx("bad");return;}
  h[bi]++;H.sfx("tick");
  for(let i=0;i<6;i++)parts.push({x:ZX[bi]+(Math.random()-.5)*40,y:300-h[bi]*26,vx:(Math.random()-.5)*60,vy:-60-Math.random()*60,l:1});
  const done=h.filter(v=>v>=6).length;
  sc=done*60+h.reduce((a,b)=>a+b,0)*5;H.score(sc);
  hud.set("tr",done+"/5");hud.set("sc",sc);
  if(done>=5){over=true;return H.done({win:true,score:sc+Math.floor(time)*2,title:"Castelo pronto!",sub:"5 torres erguida antes da maré."});}
});
H.loop(dt=>{
  if(over)return;
  time-=dt;wave-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(wave<=0){
    wave=18;H.sfx("bad");
    h=h.map(v=>v>=4?v:Math.max(0,v-1));
    say("🌊 Onda! Torres fracas (<4) perderam areia.");
  }
  if(time<=0){over=true;
    return H.done({win:false,score:sc,title:"Maré levou tudo!",sub:"Só "+h.filter(v=>v>=6).length+"/5 torres. Foque uma por vez!"});}
  parts=parts.filter(p=>p.l>0);
  parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=300*dt;p.l-=dt*2;});
  x.fillStyle="#F4F1EB";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#E4D5B5";x.fillRect(0,300,o.W,40);
  ZX.forEach((zx,i)=>{
    x.fillStyle="rgba(0,0,0,.06)";x.fillRect(zx-48,20,96,280);
    for(let j=0;j<h[i];j++){
      x.fillStyle=j>=6?"#C98A3D":"#D9B96F";
      const w=76-j*2;
      x.fillRect(zx-w/2,300-(j+1)*24,w,22);
      x.strokeStyle="#8A6A2F";x.strokeRect(zx-w/2,300-(j+1)*24,w,22);
    }
    if(h[i]>=6){x.font="24px serif";x.fillText("🚩",zx-12,300-h[i]*24-26);}
    x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
    x.fillText(h[i]+"/6",zx-12,318);
  });
  x.fillStyle="#2E6E8A";
  parts.forEach(p=>{x.globalAlpha=Math.max(0,p.l);x.fillRect(p.x,p.y,4,4);x.globalAlpha=1;});
  x.fillStyle="#2E6E8A";x.font="12px 'Space Mono',monospace";
  x.fillText("🌊 onda em "+Math.ceil(wave)+"s",12,20);
});
}});"""

# 162 — Ponte de Gravetos
GAMES[162] = r"""/* NCODE N · 162 Ponte de Gravetos — atravesse o carrinho */
GREG(162,{
init(root,H){
const LV=[{cols:6,wt:1.5,budget:100},{cols:8,wt:2.5,budget:140}];
let lv=0,over=false,nodes=[],sticks=[],sel=-1,testing=false,cart=null,budget=0;
const hud=H.hud(root,[["nv","NÍVEL","1/2"],["or","ORÇAMENTO",100],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique em 2 nós para ligar um <b>graveto</b> (custa pelo tamanho). Triângulos aguentam mais! Depois <b>teste</b> com o carrinho.");
const o=H.cvs(root,520,360),x=o.x;
let sc=0;
function build(){
  const C=LV[lv].cols;
  budget=LV[lv].budget;sticks=[];sel=-1;testing=false;cart=null;
  nodes=[];
  const x0=70,x1=o.W-70;
  for(let c=0;c<C;c++)for(let r=0;r<2;r++){
    nodes.push({x:x0+(x1-x0)*c/(C-1),y:r===0?150:230});
  }
  hud.set("nv",(lv+1)+"/2");hud.set("or",budget);
  say("Nível "+(lv+1)+": vão de "+C+" nós, carga "+LV[lv].wt+". Ligue nós vizinhos!");
}
build();
function nid(c,r){return c*2+r;}
H.onTap(o,(px,py)=>{
  if(over||testing)return;
  let bi=-1,bd=24;
  nodes.forEach((n,i)=>{const d=Math.hypot(px-n.x,py-n.y);if(d<bd){bd=d;bi=i;}});
  if(bi<0)return;
  if(sel<0){sel=bi;H.sfx("tick");return;}
  if(sel===bi){sel=-1;return;}
  const a=nodes[sel],b=nodes[bi];
  const len=Math.hypot(a.x-b.x,a.y-b.y);
  if(len>150){H.sfx("bad");say("Graveto longo demais! Use nós vizinhos.");sel=-1;return;}
  if(sticks.some(s=>(s.a===sel&&s.b===bi)||(s.a===bi&&s.b===sel))){sel=-1;return;}
  const cost=Math.round(len/8);
  if(cost>budget){H.sfx("bad");say("Sem orçamento! (custa "+cost+")");sel=-1;return;}
  budget-=cost;sticks.push({a:sel,b:bi,broke:false});
  H.sfx("tick");hud.set("or",budget);sel=-1;
});
function edgeSupport(c){
  // vão entre coluna c e c+1 (nós de topo): soma suportes
  const T0=nid(c,0),T1=nid(c+1,0),B0=nid(c,1),B1=nid(c+1,1);
  let s=0;
  const has=(a,b)=>sticks.some(k=>!k.broke&&((k.a===a&&k.b===b)||(k.a===b&&k.b===a)));
  if(has(T0,T1))s+=1.0;
  if(has(T0,B0)&&has(B0,T1))s+=1.4;
  if(has(T0,B1)&&has(B1,T1))s+=1.4;
  if(has(B0,B1)&&(has(T0,B0)||has(T1,B1)))s+=0.6;
  if(has(T0,B1)&&has(T0,B0)&&has(B0,B1))s+=0.5;
  return s;
}
H.btn(root,"🚗 Testar com o carrinho",()=>{
  if(over||testing)return;
  testing=true;
  cart={c:0,x:nodes[nid(0,0)].x,y:150,fall:0};
  H.sfx("tick");say("🚗 Lá vai…");
},true);
H.loop(dt=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,250,70,110);x.fillRect(o.W-70,250,70,110);
  x.fillStyle="#2E6E8A";x.fillRect(70,250,o.W-140,110);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("carga "+LV[lv].wt+" · vão: triângulos valem 1.4",80,340);
  sticks.forEach(s=>{
    const a=nodes[s.a],b=nodes[s.b];
    x.strokeStyle=s.broke?"rgba(217,78,52,.4)":"#8A6A2F";
    x.lineWidth=s.broke?2:5;
    x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();
  });
  nodes.forEach((n,i)=>{
    x.fillStyle=i===sel?H.C.terra:H.C.ink;
    x.beginPath();x.arc(n.x,n.y,i===sel?8:5,0,7);x.fill();
  });
  if(cart&&!over){
    const C=LV[lv].cols;
    if(cart.fall>0){
      cart.fall+=dt;cart.y+=220*dt*cart.fall;
      if(cart.y>330){
        cart=null;testing=false;
        say("💥 A ponte quebrou! Reforce o vão (triângulos!) e teste de novo. Orçamento intacto.");
      }
    }else{
      cart.x+=70*dt;
      const cols=x=>nodes.map(n=>n.x);
      const xs=nodes.filter((_,i)=>i%2===0).map(n=>n.x);
      let ci=0;
      while(ci<xs.length-2&&cart.x>xs[ci+1])ci++;
      cart.c=ci;
      cart.y=150-14;
      if(ci>=C-2&&cart.x>=xs[C-1]){
        cart=null;testing=false;
        sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        lv++;
        if(lv>=LV.length){over=true;return H.done({win:true,score:sc+100,title:"Engenheiro de pontes!",sub:"2 travessias sem cair no rio."});}
        say("Travessia OK! +150. Nível 2: vão maior, carga maior.");build();
        return;
      }
      // testa o vão atual
      if(cart.x>xs[ci]+4){
        const sup=edgeSupport(ci);
        if(sup<LV[lv].wt){
          sticks.forEach(s=>{
            const cols2=[nid(ci,0),nid(ci+1,0),nid(ci,1),nid(ci+1,1)];
            if(cols2.includes(s.a)&&cols2.includes(s.b))s.broke=true;
          });
          cart.fall=0.01;H.sfx("bad");
          say("⚠️ Vão "+(ci+1)+": suporte "+sup.toFixed(1)+" < carga "+LV[lv].wt+"!");
        }
      }
    }
  }
  if(cart){
    x.font="26px serif";
    x.fillText("🛒",cart.x-13,cart.y+8);
  }
});
}});"""

# 163 — Bola de Demolição
GAMES[163] = r"""/* NCODE N · 163 Bola de Demolição — arrase em 5 golpes */
GREG(163,{
init(root,H){
const PIV={x:120,y:40},L=200,R=26;
let over=false,a=-1.2,va=0,drag=false,swings=0,blocks=[],rest=0;
const hud=H.hud(root,[["gp","GOLPES","0/5"],["dm","DEMOLIDO","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE a bola para trás e SOLTE! Demola 70% do prédio em 5 golpes. <b>Arraste de novo</b> quando ela parar.");
const o=H.cvs(root,520,380),x=o.x;
let sc=0;
function buildTower(){
  blocks=[];
  for(let r=0;r<5;r++)for(let c=0;c<3;c++){
    blocks.push({x:380+c*34,y:330-24-r*30,w:32,h:28,vx:0,vy:0,dyn:false,ox:380+c*34,oy:330-24-r*30});
  }
}
buildTower();
const ball=()=>({x:PIV.x+Math.sin(a)*L,y:PIV.y+Math.cos(a)*L});
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  const b=ball();
  if(ptr.down&&Math.hypot(ptr.x-b.x,ptr.y-b.y)<60){
    if(!drag&&Math.abs(va)<0.4){drag=true;swings++;hud.set("gp",swings+"/5");}
    if(drag){
      a=Math.atan2(ptr.x-PIV.x,ptr.y-PIV.y);
      a=H.clamp(a,-1.5,1.5);va=0;
    }
  }else if(drag){drag=false;H.sfx("tick");say("Golpe "+swings+"/5!");}
  if(!drag){
    va+=(-9.8/L*Math.sin(a))*dt*3;
    va*=0.999;a+=va*dt*3;
  }
  const b2=ball();
  const bv={x:(b2.x-b.x)/Math.max(dt,.001),y:(b2.y-b.y)/Math.max(dt,.001)};
  const spd=Math.hypot(bv.x,bv.y);
  blocks.forEach(bl=>{
    if(!bl.dyn){
      if(Math.abs(b2.x-(bl.x+bl.w/2))<R+bl.w/2&&Math.abs(b2.y-(bl.y+bl.h/2))<R+bl.h/2&&spd>120){
        bl.dyn=true;bl.vx=bv.x*.6;bl.vy=bv.y*.6-100;H.sfx("pop");
      }
    }else{
      bl.vy+=900*dt;bl.x+=bl.vx*dt;bl.y+=bl.vy*dt;
      bl.vx*=0.99;
      if(bl.y>330-bl.h){bl.y=330-bl.h;bl.vy*=-0.2;bl.vx*=0.7;}
      if(bl.x<0){bl.x=0;bl.vx*=-0.5;}if(bl.x>o.W-bl.w){bl.x=o.W-bl.w;bl.vx*=-0.5;}
    }
  });
  const down=blocks.filter(bl=>Math.abs(bl.x-bl.ox)>30||bl.oy-bl.y>30||(bl.dyn&&bl.y>bl.oy+10)).length;
  const pct=Math.round(down/blocks.length*100);
  hud.set("dm",pct+"%");
  sc=pct*5;H.score(sc);hud.set("sc",sc);
  if(pct>=70){over=true;return H.done({win:true,score:sc+(5-swings)*50+100,title:"Demolição total!",sub:pct+"% do prédio em "+swings+" golpe(s)."});}
  if(swings>=5&&Math.abs(va)<0.05&&!drag){
    rest+=dt;
    if(rest>2){over=true;
      return H.done({win:false,score:sc,title:"Prédio de pé!",sub:"Só "+pct+"% (meta 70%). Puxe mais para trás!"});}
  }else rest=0;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,330,o.W,50);
  x.strokeStyle=H.C.ink;x.lineWidth=4;
  x.beginPath();x.moveTo(PIV.x,0);x.lineTo(PIV.x,PIV.y);x.stroke();
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(PIV.x,PIV.y);x.lineTo(b2.x,b2.y);x.stroke();
  blocks.forEach(bl=>{
    x.fillStyle=bl.dyn?"#B0A696":"#C96A3D";
    x.fillRect(bl.x,bl.y,bl.w,bl.h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(bl.x,bl.y,bl.w,bl.h);
  });
  x.fillStyle=H.C.ink;x.beginPath();x.arc(b2.x,b2.y,R,0,7);x.fill();
  x.fillStyle="#555";x.beginPath();x.arc(b2.x-8,b2.y-8,7,0,7);x.fill();
  if(!drag&&swings<5&&Math.abs(va)<0.3){
    x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("ARRASTE A BOLA!",b2.x-60,b2.y-40);
  }
});
}});"""

# 164 — Catapulta de Cerco
GAMES[164] = r"""/* NCODE N · 164 Catapulta de Cerco — 3 acertos sobre a muralha */
GREG(164,{
init(root,H){
const AX={x:80,y:300};
let over=false,aim=null,stone=null,shots=5,hits=0,wind=0,parts=[];
const hud=H.hud(root,[["pd","PEDRAS",5],["ac","ACERTOS","0/3"],["vn","VENTO",0]]);
const say=H.msg(root,"ARRASTE da catapulta para trás e solte para lançar! Passe por cima da muralha e atinja a 🎯 bandeira.");
const o=H.cvs(root,520,360),x=o.x;
const WALL={x:300,w:26,y:170,h:170},TGT={x:430,y:320};
wind=Math.round((Math.random()-.5)*30);
hud.set("vn",wind);
const ptr=H.ptr(o);
let wasDown=false;
H.loop(dt=>{
  if(over)return;
  if(ptr.down&&!stone){
    if(!wasDown&&Math.hypot(ptr.x-AX.x,ptr.y-AX.y)<90)aim={x:ptr.x,y:ptr.y};
    if(aim)aim={x:ptr.x,y:ptr.y};
  }else if(aim&&!ptr.down){
    const dx=AX.x-aim.x,dy=AX.y-aim.y;
    if(Math.hypot(dx,dy)>20&&shots>0){
      stone={x:AX.x,y:AX.y,vx:dx*3.2,vy:dy*3.2};
      shots--;hud.set("pd",shots);H.sfx("tick");
    }
    aim=null;
  }
  wasDown=ptr.down;
  if(stone){
    stone.vy+=700*dt;stone.vx+=wind*dt;
    stone.x+=stone.vx*dt;stone.y+=stone.vy*dt;
    if(stone.x>WALL.x&&stone.x<WALL.x+WALL.w&&stone.y>WALL.y){
      stone=null;H.sfx("bad");say("🧱 Na muralha! Mais força.");
    }else if(Math.hypot(stone.x-TGT.x,stone.y-TGT.y)<26){
      stone=null;hits++;H.score(hits*100);hud.set("ac",hits+"/3");H.sfx("ok");
      for(let i=0;i<10;i++)parts.push({x:TGT.x,y:TGT.y,vx:(Math.random()-.5)*200,vy:-100-Math.random()*150,l:1});
      if(hits>=3){over=true;return H.done({win:true,score:300+shots*40+100,title:"Muralha vencida!",sub:"3 acertos com "+shots+" pedra(s) de sobra."});}
      say("🎯 Acertou! ("+hits+"/3)");
    }else if(stone.y>340||stone.x>o.W+20||stone.x<-20){
      stone=null;
      if(shots<=0){over=true;H.sfx("lose");
        return H.done({win:false,score:hits*100,title:"Sem pedras!",sub:"Só "+hits+"/3 acertos. Mire mais alto!"});}
      say("💥 Errou! Restam "+shots+".");
    }
  }
  parts=parts.filter(p=>p.l>0);
  parts.forEach(p=>{p.x+=p.vx*dt;p.y+=p.vy*dt;p.vy+=400*dt;p.l-=dt*1.5;});
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,330,o.W,30);
  x.fillStyle="#9A8F7A";
  x.fillRect(WALL.x,WALL.y,WALL.w,WALL.h);
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  for(let yy=WALL.y;yy<WALL.y+WALL.h;yy+=18){x.beginPath();x.moveTo(WALL.x,yy);x.lineTo(WALL.x+WALL.w,yy);x.stroke();}
  x.font="24px serif";x.fillText("🎯",TGT.x-12,TGT.y+8);
  x.strokeStyle="#8A6A2F";x.lineWidth=6;
  x.beginPath();x.moveTo(AX.x-20,330);x.lineTo(AX.x,AX.y);x.lineTo(AX.x+20,330);x.stroke();
  if(aim){
    x.strokeStyle=H.C.terra;x.lineWidth=2;
    x.beginPath();x.moveTo(AX.x,AX.y);x.lineTo(aim.x,aim.y);x.stroke();
    const dx=AX.x-aim.x,dy=AX.y-aim.y;
    let px=AX.x,py=AX.y,vx=dx*3.2,vy=dy*3.2;
    x.fillStyle=H.C.terra;
    for(let i=0;i<12;i++){vx+=wind*.05;vy+=700*.05;px+=vx*.05;py+=vy*.05;
      if(i%2===0){x.beginPath();x.arc(px,py,3,0,7);x.fill();}}
    x.fillStyle=H.C.ink;x.beginPath();x.arc(aim.x,aim.y,10,0,7);x.fill();
  }else if(!stone&&shots>0){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(AX.x,AX.y,10,0,7);x.fill();
  }
  if(stone){x.fillStyle=H.C.ink;x.beginPath();x.arc(stone.x,stone.y,10,0,7);x.fill();}
  parts.forEach(p=>{x.globalAlpha=Math.max(0,p.l);x.fillStyle=H.C.wasabi;x.fillRect(p.x,p.y,5,5);x.globalAlpha=1;});
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("vento "+(wind>0?"→":"←")+" "+Math.abs(Math.round(wind)),400,24);
});
}});"""

# 165 — Barragem de Blocos
GAMES[165] = r"""/* NCODE N · 165 Barragem de Blocos — segure a água 60s */
GREG(165,{
init(root,H){
let over=false,stack=[0,0,0,0,0,0],water=0,time=60,cool=0,leak=0,wt=0;
const hud=H.hud(root,[["tp","TEMPO",60],["ag","NÍVEL",0],["vz","VAZAMENTOS","0/3"]]);
const say=H.msg(root,"Clique nas <b>colunas</b> para empilhar blocos! A água sobe 1 nível a cada 8s — coluna abaixo do nível = vazamento.");
const o=H.cvs(root,500,360),x=o.x;
const MAXL=8;
H.onTap(o,(px,py)=>{
  if(over||cool>0)return;
  const c=Math.floor(px/(o.W/6));
  if(c<0||c>5||stack[c]>=MAXL)return;
  stack[c]++;cool=.18;H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;wt+=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(wt>=8){wt=0;water=Math.min(MAXL,water+1);hud.set("ag",water);H.sfx("bad");say("🌊 Água no nível "+water+"!");}
  // vazamento: coluna abaixo do nível tendo vizinho abaixo? qualquer coluna < nível
  let bad=stack.filter(s=>s<water).length;
  if(water>0&&bad>0){
    leak+=dt*bad*.5;
    hud.set("vz",Math.floor(leak)+"/3");
    if(leak>=3){over=true;H.sfx("lose");
      return H.done({win:false,score:Math.floor((60-time)*5),title:"Barragem rompeu!",sub:"Vazamentos demais. Tampe as colunas baixas!"});}
  }else leak=Math.max(0,leak-dt);
  if(time<=0){over=true;
    return H.done({win:true,score:300+stack.reduce((a,b)=>a+b,0)*5,title:"Barragem segura!",sub:"60 segundos sem romper."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const cw=o.W/6,lh=300/MAXL;
  for(let c=0;c<6;c++){
    for(let j=0;j<stack[c];j++){
      x.fillStyle=stack[c]<water?"#B06A4D":"#C98A3D";
      x.fillRect(c*cw+4,300-(j+1)*lh,cw-8,lh-2);
      x.strokeStyle=H.C.ink;x.strokeRect(c*cw+4,300-(j+1)*lh,cw-8,lh-2);
    }
  }
  x.fillStyle="rgba(46,110,138,.55)";
  x.fillRect(0,300-water*lh,o.W,water*lh);
  x.fillStyle="#fff";x.font="bold 13px 'Space Mono',monospace";
  if(water>0)x.fillText("NÍVEL "+water,10,300-water*lh+18);
  if(leak>0.3){x.fillStyle=H.C.terra;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("⚠ VAZANDO!",200,24);}
});
}});"""

# 166 — Arte com Dominós
GAMES[166] = r"""/* NCODE N · 166 Arte com Dominós — derrube até a estrela */
GREG(166,{
init(root,H){
let over=false,dom=[],falling=false,fallT=0;
const hud=H.hud(root,[["dm","DOMINÓS","0/22"],["st","STATUS","monte"]]);
const say=H.msg(root,"Clique para plantar dominós em <b>cadeia</b> (cada um mira o anterior). Chegue perto da ⭐ e aperte <b>DERRUBAR</b>! Alcance: 46px. Evite as 🌳.");
const o=H.cvs(root,500,360),x=o.x;
const OBS=[{x:170,y:130,r:34},{x:340,y:240,r:34}],STAR={x:450,y:70};
H.onTap(o,(px,py)=>{
  if(over||falling)return;
  if(dom.length>=22){H.sfx("bad");return;}
  if(OBS.some(b=>Math.hypot(px-b.x,py-b.y)<b.r+10)){H.sfx("bad");say("Dentro da árvore! Plante ao redor.");return;}
  const prev=dom[dom.length-1];
  if(prev){
    const d=Math.hypot(px-prev.x,py-prev.y);
    if(d>70){H.sfx("bad");say("Longe demais do anterior (máx 70px)!");return;}
    prev.a=Math.atan2(py-prev.y,px-prev.x);
  }
  dom.push({x:px,y:py,a:prev?Math.atan2(py-prev.y,px-prev.x):0,f:-1});
  H.sfx("tick");hud.set("dm",dom.length+"/22");
});
H.btn(root,"🎬 DERRUBAR!",()=>{
  if(over||falling||dom.length<3)return;
  falling=true;fallT=0;dom[0].f=0;
  hud.set("st","caindo…");H.sfx("ok");
},true);
H.btn(root,"↩️ Desfazer",()=>{if(!over&&!falling){dom.pop();hud.set("dm",dom.length+"/22");H.sfx("tick");}},false);
H.loop(dt=>{
  if(falling&&!over){
    fallT+=dt;
    let allF=true;
    dom.forEach((d,i)=>{
      if(d.f<0){allF=false;return;}
      if(d.f<1)d.f=Math.min(1,d.f+dt*4);
      if(d.f>=1&&i+1<dom.length&&dom[i+1].f<0){
        const nd=Math.hypot(dom[i+1].x-d.x,dom[i+1].y-d.y);
        if(nd<=46)dom[i+1].f=0;
      }
    });
    const last=dom[dom.length-1];
    if(last.f>=1){
      over=true;
      const dS=Math.hypot(last.x-STAR.x,last.y-STAR.y);
      if(dS<=70)return H.done({win:true,score:200+dom.length*10,title:"Reação perfeita!",sub:dom.length+" dominós até a estrela!"});
      return H.done({win:false,score:dom.length*5,title:"Cadeia curta!",sub:"O último caiu longe da ⭐. Chegue mais perto!"});
    }
    if(allF&&last.f<0){over=true;
      return H.done({win:false,score:dom.length*5,title:"Cadeia quebrou!",sub:"Um vão maior que 46px parou tudo."});}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.font="30px serif";
  OBS.forEach(b=>{x.fillText("🌳",b.x-15,b.y+10);});
  x.font="34px serif";x.fillText("⭐",STAR.x-17,STAR.y+12);
  x.strokeStyle=H.C.wasabi;x.lineWidth=2;
  x.beginPath();x.arc(STAR.x,STAR.y,70,0,7);x.stroke();
  dom.forEach((d,i)=>{
    x.save();x.translate(d.x,d.y);
    if(d.f>=0)x.rotate(d.a+Math.PI/2),x.translate(0,-10*Math.sin(d.f*Math.PI/2)),x.rotate(0);
    x.rotate(d.f>=0?0:d.a+Math.PI/2);
    x.fillStyle=i===0?H.C.terra:H.C.ink;
    x.fillRect(-5,-14,10,28);
    x.fillStyle="#fff";x.fillRect(-5,-1,10,2);
    x.restore();
    if(d.f<0&&i===dom.length-1){
      x.strokeStyle="rgba(0,0,0,.25)";x.lineWidth=1;
      x.beginPath();x.arc(d.x,d.y,46,0,7);x.stroke();
    }
  });
  if(!dom.length){
    x.fillStyle=H.C.ink3;x.font="13px 'Space Mono',monospace";
    x.fillText("clique para plantar o 1º dominó",140,180);
  }
});
}});"""

# 167 — Pista de Bolinha
GAMES[167] = r"""/* NCODE N · 167 Pista de Bolinha — trilhos até a bandeira */
GREG(167,{
init(root,H){
const T=60,COLS=8,ROWS=5;
const LV=[
 {start:[2,0],goal:[3,7],bag:{H:5,D:2,U:1,DROP:1}},
 {start:[1,0],goal:[4,7],bag:{H:6,D:2,U:1,DROP:2}}
];
let lv=0,over=false,grid=[],bag={},selP="H",anim=null;
const hud=H.hud(root,[["nv","NÍVEL","1/2"],["pc","PEÇA","H"]]);
const say=H.msg(root,"Escolha a peça e clique no grid para colocar (clique de novo para tirar). H=reto · D=descida(+vel) · U=subida(−vel) · V=queda. Leve a bolinha à 🏁!");
const o=H.cvs(root,COLS*T+20,ROWS*T+20),x=o.x;
const OX=10,OY=10;
function build(){
  grid=new Array(ROWS*COLS).fill(null);
  bag=Object.assign({},LV[lv].bag);
  anim=null;selP="H";hud.set("nv",(lv+1)+"/2");
  paintBag();
}
function paintBag(){
  hud.set("pc",selP+" "+JSON.stringify(bag).replace(/[{"}]/g,"").replace(/,/g," "));
}
build();
const prow=H.el("div","g-row",null,root);
["H","D","U","DROP"].forEach(p=>{
  H.btn(prow,p,()=>{selP=p;H.sfx("tick");paintBag();},false);
});
H.onTap(o,(px,py)=>{
  if(over||anim)return;
  const c=Math.floor((px-OX)/T),r=Math.floor((py-OY)/T);
  if(r<0||r>=ROWS||c<0||c>=COLS)return;
  const L=LV[lv];
  if(r===L.start[0]&&c===L.start[1])return;
  if(r===L.goal[0]&&c===L.goal[1])return;
  const k=r*COLS+c;
  if(grid[k]){bag[grid[k]]++;grid[k]=null;H.sfx("tick");paintBag();return;}
  if((bag[selP]||0)<=0){H.sfx("bad");say("Sem peças "+selP+"! Tire outra do grid.");return;}
  grid[k]=selP;bag[selP]--;H.sfx("tick");paintBag();
});
function sim(){
  const L=LV[lv];
  let r=L.start[0],c=L.start[1],entry="left",sp=3;
  const path=[[r,c]];
  for(let i=0;i<120;i++){
    if(r===L.goal[0]&&c===L.goal[1])return{ok:true,path};
    const p=(r>=0&&r<ROWS&&c>=0&&c<COLS)?grid[r*COLS+c]:null;
    if(r===L.start[0]&&c===L.start[1]){c++;entry="left";path.push([r,c]);continue;}
    if(!p){
      // cai na coluna
      let r2=r+1;
      while(r2<ROWS&&!grid[r2*COLS+c])r2++;
      if(r2>=ROWS)return{ok:false,why:"A bolinha caiu no vazio na coluna "+(c+1)+"!",path};
      r=r2;entry="top";path.push([r,c]);continue;
    }
    if(p==="H"){c++;entry="left";}
    else if(p==="D"){sp+=2;c++;entry="left";}
    else if(p==="U"){if(sp<2)return{ok:false,why:"Sem velocidade para a subida!",path};sp-=2;c++;entry="left";}
    else if(p==="DROP"){r++;entry="top";sp+=2;}
    if(c<0||c>=COLS||r<0||r>=ROWS)return{ok:false,why:"A bolinha saiu da pista!",path};
    path.push([r,c]);
  }
  return{ok:false,why:"Loop infinito!",path};
}
H.btn(root,"🔴 Soltar bolinha",()=>{
  if(over||anim)return;
  const res=sim();
  anim={path:res.path,i:0,ok:res.ok,why:res.why};
  H.sfx("tick");
},true);
let acc=0;
H.loop(dt=>{
  const L=LV[lv];
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const X=OX+c*T,Y=OY+r*T;
    x.fillStyle=(r+c)%2?H.C.card:"#EFEAE0";
    x.fillRect(X,Y,T,T);
    x.strokeStyle=H.C.cement;x.strokeRect(X,Y,T,T);
    const p=grid[r*COLS+c];
    x.lineWidth=6;x.lineCap="round";
    if(p==="H"){x.strokeStyle="#2E6E8A";x.beginPath();x.moveTo(X+4,Y+T/2);x.lineTo(X+T-4,Y+T/2);x.stroke();}
    if(p==="D"){x.strokeStyle="#3E7C4F";x.beginPath();x.moveTo(X+4,Y+8);x.lineTo(X+T-4,Y+T-8);x.stroke();}
    if(p==="U"){x.strokeStyle="#D94E34";x.beginPath();x.moveTo(X+4,Y+T-8);x.lineTo(X+T-4,Y+8);x.stroke();}
    if(p==="DROP"){x.strokeStyle="#7A6A53";x.beginPath();x.moveTo(X+T/2,Y+4);x.lineTo(X+T/2,Y+T-4);x.stroke();}
  }
  x.font="24px serif";
  x.fillText("🚀",OX+L.start[1]*T+14,OY+L.start[0]*T+40);
  x.fillText("🏁",OX+L.goal[1]*T+14,OY+L.goal[0]*T+40);
  if(anim){
    acc+=dt;
    if(acc>0.22){acc=0;anim.i++;}
    const idx=Math.min(anim.i,anim.path.length-1);
    const[rr,cc]=anim.path[idx];
    x.fillStyle=H.C.terra;
    x.beginPath();x.arc(OX+cc*T+T/2,OY+rr*T+T/2,10,0,7);x.fill();
    if(anim.i>=anim.path.length-1){
      const ok=anim.ok,why=anim.why;
      anim=null;
      if(ok){
        H.sfx("ok");
        lv++;
        if(lv>=LV.length){over=true;return H.done({win:true,score:400,title:"Engenheiro de pistas!",sub:"2 circuitos até a bandeira."});}
        say("Nível 1 OK! Agora um desnível maior…");build();
      }else{H.sfx("bad");say("❌ "+why);}
    }
  }
});
}});"""

# 168 — Pouso de Foguete
GAMES[168] = r"""/* NCODE N · 168 Pouso de Foguete — pouse suave no alvo */
GREG(168,{
init(root,H){
const LV=[{wind:0,pad:90},{wind:26,pad:60}];
let lv=0,over=false,r={},thrust=false,left=false,right=false;
const hud=H.hud(root,[["nv","NÍVEL","1/2"],["cb","COMBUSTÍVEL",100],["vv","VEL",0]]);
const say=H.msg(root,"<b>↑/W</b> motor · <b>←→/AD</b> inclinar. Pouse na 🟩 plataforma devagar (&lt;50) e reto! Toque: segure os botões.");
const o=H.cvs(root,500,420),x=o.x;
function build(){
  r={x:o.W/2+(Math.random()-.5)*160,y:50,vx:(Math.random()-.5)*30,vy:0,a:0,fuel:100};
  thrust=left=right=false;
  hud.set("nv",(lv+1)+"/2");
  say("Nível "+(lv+1)+(LV[lv].wind?": vento → "+LV[lv].wind+"!":"")+(" Pouse na plataforma!"));
}
build();
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowUp"||c==="KeyW")thrust=d;
  if(c==="ArrowLeft"||c==="KeyA")left=d;
  if(c==="ArrowRight"||c==="KeyD")right=d;
});
function holdBtn(label,set){
  const b=H.el("button","g-btn ghost",label,root);
  b.addEventListener("pointerdown",e=>{e.preventDefault();set(true);});
  b.addEventListener("pointerup",()=>set(false));
  b.addEventListener("pointerleave",()=>set(false));
}
const brow=H.el("div","g-row",null,root);
holdBtn("◀",v=>left=v);
holdBtn("🔥",v=>thrust=v);
holdBtn("▶",v=>right=v);
const PADY=o.H-40,PADX=o.W/2;
H.loop(dt=>{
  if(over)return;
  const L=LV[lv];
  if(left)r.a-=1.8*dt;
  if(right)r.a+=1.8*dt;
  r.a=H.clamp(r.a,-0.6,0.6);
  if(thrust&&r.fuel>0){
    r.fuel-=dt*22;
    r.vx+=Math.sin(r.a)*130*dt;
    r.vy-=Math.cos(r.a)*130*dt;
    if(Math.random()<dt*20)H.sfx("tick");
  }
  r.vy+=60*dt;r.vx+=L.wind*dt*.4;
  r.x+=r.vx*dt;r.y+=r.vy*dt;
  if(r.x<10){r.x=10;r.vx=0;}if(r.x>o.W-10){r.x=o.W-10;r.vx=0;}
  hud.set("cb",Math.max(0,Math.floor(r.fuel)));
  hud.set("vv",Math.floor(Math.hypot(r.vx,r.vy)));
  const onPad=Math.abs(r.x-PADX)<L.pad/2;
  if(r.y>=PADY-14){
    const sp=Math.hypot(r.vx,r.vy);
    if(onPad&&sp<50&&Math.abs(r.a)<0.25){
      H.sfx("ok");H.score((lv+1)*150+Math.floor(r.fuel));
      lv++;
      if(lv>=LV.length){over=true;return H.done({win:true,score:450,title:"Pouso perfeito!",sub:"2 missões sem amassar o foguete."});}
      say("Pouso suave! Nível 2: vento e plataforma menor.");build();return;
    }
    over=true;H.sfx("lose");
    return H.done({win:false,score:lv*150,title:!onPad?"Fora da plataforma!":sp>=50?"Impacto forte!":"Torto demais!",sub:"Desça <50 de velocidade, reto e no verde."});
  }
  if(r.y<0){r.y=0;r.vy=0;}
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";
  for(let i=0;i<40;i++){const sx=(i*97)%o.W,sy=(i*61)%280;x.fillRect(sx,sy,2,2);}
  x.fillStyle="#8A877C";x.fillRect(0,PADY,o.W,o.H-PADY);
  x.fillStyle=H.C.ok;x.fillRect(PADX-L.pad/2,PADY-6,L.pad,6);
  x.save();x.translate(r.x,r.y);x.rotate(r.a);
  if(thrust&&r.fuel>0){
    x.fillStyle="#E8A33D";
    x.beginPath();x.moveTo(-6,14);x.lineTo(0,30+Math.random()*10);x.lineTo(6,14);x.fill();
  }
  x.fillStyle="#E4D5B5";x.fillRect(-8,-14,16,28);
  x.fillStyle=H.C.terra;
  x.beginPath();x.moveTo(-8,-14);x.lineTo(0,-26);x.lineTo(8,-14);x.fill();
  x.fillStyle="#2E6E8A";x.beginPath();x.arc(0,-4,4,0,7);x.fill();
  x.restore();
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("vx "+r.vx.toFixed(0)+" vy "+r.vy.toFixed(0)+" ang "+(r.a*57).toFixed(0)+"°",12,20);
});
}});"""

# 169 — Boneco de Pano
GAMES[169] = r"""/* NCODE N · 169 Boneco de Pano — 400 pontos escada abaixo */
GREG(169,{
init(root,H){
let over=false,pts=[],sticks=[],thrown=false,drag=null,throws=0,score=0,rot=0,lastA=0,air=0,rest=0;
const hud=H.hud(root,[["ar","ARREMESSOS","0/3"],["pt","PONTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE o boneco para trás e SOLTE escada abaixo! Cambalhotas + distância = pontos. 3 arremessos, meta 400.");
const o=H.cvs(root,520,400),x=o.x;
const STEPS=[];
for(let i=0;i<7;i++)STEPS.push({x0:150+i*50,x1:200+i*50,top:150+i*32});
const GY=390;
function reset(){
  const sx=90,sy=110;
  pts=[
    {x:sx,y:sy-34,ox:sx,oy:sy-34},   // 0 cabeça
    {x:sx,y:sy-10,ox:sx,oy:sy-10},   // 1 tronco alto
    {x:sx,y:sy+16,ox:sx,oy:sy+16},   // 2 tronco baixo
    {x:sx-20,y:sy-8,ox:sx-20,oy:sy-8}, // 3 mão L
    {x:sx+20,y:sy-8,ox:sx+20,oy:sy-8}, // 4 mão R
    {x:sx-12,y:sy+40,ox:sx-12,oy:sy+40},// 5 pé L
    {x:sx+12,y:sy+40,ox:sx+12,oy:sy+40} // 6 pé R
  ];
  sticks=[[0,1],[1,2],[1,3],[1,4],[2,5],[2,6]];
  thrown=false;drag=null;rot=0;air=0;rest=0;
  lastA=Math.atan2(pts[2].y-pts[1].y,pts[2].x-pts[1].x);
}
reset();
const ptr=H.ptr(o);
function collide(p){
  if(p.y>GY){p.y=GY;p.x+=(p.ox-p.x)*-.0;p.vx=0;}
  for(const s of STEPS){
    if(p.x>s.x0&&p.x<s.x1&&p.y>s.top&&p.y<s.top+34){
      p.y=s.top;
    }
  }
  if(p.x<60&&p.y<150&&p.x>20){/* plataforma */
    if(p.y>140&&p.y<170)p.y=140;
  }
  if(p.x<8){p.x=8;}if(p.x>o.W-8){p.x=o.W-8;}
}
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.033);
  const cx=pts[1].x,cy=pts[1].y;
  if(!thrown){
    if(ptr.down&&Math.hypot(ptr.x-cx,ptr.y-cy)<70){
      if(!drag)drag={sx:ptr.x,sy:ptr.y};
      const dx=ptr.x-drag.sx,dy=ptr.y-drag.sy;
      pts.forEach((p,i)=>{
        const base=[[-0,-34],[0,-10],[0,16],[-20,-8],[20,-8],[-12,40],[12,40]][i];
        p.x=90+base[0]+dx*.5;p.y=110+base[1]+dy*.5;p.ox=p.x;p.oy=p.y;
      });
    }else if(drag){
      const dx=(ptr.x-drag.sx)*4,dy=(ptr.y-drag.sy)*4;
      pts.forEach(p=>{p.ox=p.x-dx*dt*8;p.oy=p.y-dy*dt*8;});
      thrown=true;throws++;hud.set("ar",throws+"/3");
      H.sfx("tick");drag=null;
    }
  }else{
    for(const p of pts){
      const vx=(p.x-p.ox)*0.99,vy=(p.y-p.oy)*0.99;
      p.ox=p.x;p.oy=p.y;
      p.x+=vx;p.y+=vy+900*dt*dt*2;
      collide(p);
    }
    for(let k=0;k<3;k++){
      for(const[a,b]of sticks){
        const A=pts[a],B=pts[b];
        const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1;
        const L0={ "0,1":24,"1,2":26,"1,3":20,"1,4":20,"2,5":26,"2,6":26 }[a+","+b]||24;
        const diff=(d-L0)/d*.5;
        A.x+=dx*diff;A.y+=dy*diff;B.x-=dx*diff;B.y-=dy*diff;
        collide(A);collide(B);
      }
    }
    const ang=Math.atan2(pts[2].y-pts[1].y,pts[2].x-pts[1].x);
    let da=ang-lastA;
    while(da>Math.PI)da-=2*Math.PI;while(da<-Math.PI)da+=2*Math.PI;
    rot+=Math.abs(da);lastA=ang;air+=dt;
    const mv=Math.hypot(pts[1].x-pts[1].ox,pts[1].y-pts[1].oy);
    if(mv<.3)rest+=dt;else rest=0;
    if(rest>1.2||air>14){
      const dist=Math.max(0,pts[1].x-90);
      const flips=Math.floor(rot/(Math.PI*2));
      const gain=Math.floor(dist*.8)+flips*80+Math.floor(air*5);
      score+=gain;H.score(score);hud.set("pt",score);hud.set("sc",score);
      H.sfx("ok");say("💥 "+gain+" pts! ("+flips+" flips, "+Math.floor(dist)+"px)");
      if(throws>=3){
        over=true;
        if(score>=400)return H.done({win:true,score,title:"Dublê lendário!",sub:score+" pontos em 3 tombos."});
        return H.done({win:false,score,title:"Queda sem graça…",sub:"Só "+score+"/400. Arremesse com mais força!"});
      }
      reset();
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,GY,o.W,o.H-GY);
  x.fillStyle="#9A8F7A";x.fillRect(20,140,130,10);
  STEPS.forEach(s=>{
    x.fillStyle="#B0A696";x.fillRect(s.x0,s.top,s.x1-s.x0,GY-s.top);
    x.strokeStyle=H.C.ink;x.strokeRect(s.x0,s.top,s.x1-s.x0,GY-s.top);
  });
  x.strokeStyle=H.C.ink;x.lineWidth=5;x.lineCap="round";
  sticks.forEach(([a,b])=>{x.beginPath();x.moveTo(pts[a].x,pts[a].y);x.lineTo(pts[b].x,pts[b].y);x.stroke();});
  x.fillStyle="#E8A33D";x.beginPath();x.arc(pts[0].x,pts[0].y,11,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  if(!thrown&&!drag){
    x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("ARRASTE E SOLTE!",40,60);
  }
});
}});"""

# 170 — Balão de Carga
GAMES[170] = r"""/* NCODE N · 170 Balão de Carga — atravesse os 3 portões */
GREG(170,{
init(root,H){
let over=false,crate={},bals=[],gates=[],t=0,gust=0,win=0;
const hud=H.hud(root,[["bl","BALÕES",0],["pt","PORTÕES","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na 📦 caixa para <b>amarrar balão</b> (sobe). Clique no <b>balão</b> para estourar (desce). Passe pelos 3 portões e pouse na 🟩!");
const o=H.cvs(root,520,400),x=o.x;
function build(){
  crate={x:50,y:300,vy:0};
  bals=[];t=0;
  gates=[{x:180,gap:120,gy:150},{x:320,gap:110,gy:230},{x:450,gap:100,gy:140}];
  win=0;
  hud.set("pt","0/3");
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  const bi=bals.findIndex(b=>Math.hypot(px-b.ox-30,py-(crate.y-50-b.i*4))<22);
  if(bi>=0){bals.splice(bi,1);H.sfx("pop");hud.set("bl",bals.length);return;}
  if(Math.abs(px-crate.x)<32&&Math.abs(py-crate.y)<32){
    if(bals.length>=8){H.sfx("bad");return;}
    bals.push({i:bals.length,ox:(Math.random()-.5)*40,c:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F"][bals.length%4]});
    H.sfx("tick");hud.set("bl",bals.length);
  }
});
H.loop(dt=>{
  if(over)return;
  t+=dt;
  gust=Math.sin(t*1.3)*20+Math.sin(t*.5)*15;
  const lift=bals.length*34;
  crate.vy+=(46*2.2-lift)*dt*2;
  crate.vy=H.clamp(crate.vy,-90,110);
  crate.y+=crate.vy*dt;
  crate.x+=52*dt;
  if(crate.y<20){crate.y=20;crate.vy=0;}
  if(crate.y>370){
    over=true;H.sfx("lose");
    return H.done({win:false,score:win*100,title:"Carga no chão!",sub:"Amarre mais balões para flutuar."});
  }
  for(const g of gates){
    if(!g.ok&&Math.abs(crate.x-g.x)<14){
      if(crate.y>g.gy&&crate.y<g.gy+g.gap){
        g.ok=true;win++;H.score(win*100);hud.set("pt",win+"/3");hud.set("sc",win*100);H.sfx("ok");
      }else{
        over=true;H.sfx("lose");
        return H.done({win:false,score:win*100,title:"Bateu no portão!",sub:win+"/3 portões. Ajuste a altitude!"});
      }
    }
  }
  if(crate.x>o.W-40){
    if(crate.y>300){
      over=true;return H.done({win:true,score:400,title:"Entrega aérea!",sub:"3 portões e pouso perfeito."});
    }
    over=true;H.sfx("lose");
    return H.done({win:false,score:win*100,title:"Passou do ponto!",sub:"Desça para pousar na plataforma verde."});
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,370,o.W,30);
  x.fillStyle=H.C.ok;x.fillRect(o.W-70,300,70,14);
  gates.forEach(g=>{
    x.fillStyle="#8A6A2F";
    x.fillRect(g.x-6,0,12,g.gy);
    x.fillRect(g.x-6,g.gy+g.gap,12,o.H-(g.gy+g.gap));
    x.fillStyle=g.ok?"rgba(196,214,69,.35)":"rgba(255,255,255,.25)";
    x.fillRect(g.x-6,g.gy,12,g.gap);
  });
  bals.forEach(b=>{
    const bx=crate.x+b.ox,by=crate.y-50-b.i*3;
    x.strokeStyle=H.C.ink;x.lineWidth=1;
    x.beginPath();x.moveTo(crate.x,crate.y-14);x.lineTo(bx,by+16);x.stroke();
    x.fillStyle=b.c;
    x.beginPath();x.ellipse(bx,by,16,20,0,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  });
  x.font="30px serif";x.fillText("📦",crate.x-15,crate.y+10);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("vento "+Math.round(gust),12,20);
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
