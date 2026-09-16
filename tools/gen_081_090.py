#!/usr/bin/env python3
"""Gera games/g081..g090 — ESTRATÉGIA (parte 1)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 81 — Xeque-Mate Rápido
GAMES[81] = r"""/* NCODE N · 081 Xeque-Mate Rápido — mate em 1 lance */
GREG(81,{
init(root,H){
const PUZ=[
 {w:[["K",2,6],["Q",1,5]],b:[0,7],n:"Qg7 decide."},
 {w:[["K",2,1],["R",1,2]],b:[0,0],n:"A torre coroa na 8ª."},
 {w:[["K",6,5],["Q",5,6]],b:[7,7],n:"Encurrale no canto."},
 {w:[["K",2,3],["Q",3,3]],b:[0,4],n:"A dama fecha a porta."}
];
let pi=0,over=false,att=0,sc=0;
const hud=H.hud(root,[["pz","PUZZLE","1/4"],["tt","TENTATIVAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Brancas jogam e dão <b>mate em 1</b>. Clique na peça e depois no destino.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(8,1fr)";
board.style.width="min(100%,380px)";
let W=[],B=[],sel=-1;
function build(){
  const P=PUZ[pi];
  W=P.w.map(w=>({t:w[0],r:w[1],c:w[2]}));B={r:P.b[0],c:P.b[1]};sel=-1;att=0;
  hud.set("pz",(pi+1)+"/4");hud.set("tt",0);
  say("Puzzle "+(pi+1)+": "+P.n);
  paint();
}
function paint(){
  board.innerHTML="";
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    d.style.background=(r+c)%2?"#D8D5CC":H.C.card;
    const w=W.findIndex(p=>p.r===r&&p.c===c);
    if(w>=0){d.textContent=W[w].t==="K"?"♔":W[w].t==="Q"?"♕":"♖";if(w===sel)d.classList.add("sel");}
    if(B.r===r&&B.c===c)d.textContent="♚";
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
}
function pathClear(r1,c1,r2,c2){
  const dr=Math.sign(r2-r1),dc=Math.sign(c2-c1);
  let r=r1+dr,c=c1+dc;
  while(r!==r2||c!==c2){
    if(W.some(p=>p.r===r&&p.c===c))return false;
    if(B.r===r&&B.c===c)return false;
    r+=dr;c+=dc;
  }
  return true;
}
function legalMove(p,r,c){
  if(W.some(q=>q.r===r&&q.c===c))return false;
  if(B.r===r&&B.c===c)return false;
  const dr=Math.abs(r-p.r),dc=Math.abs(c-p.c);
  if(p.t==="K"){
    if(dr>1||dc>1||(!dr&&!dc))return false;
    if(Math.abs(r-B.r)<=1&&Math.abs(c-B.c)<=1)return false;
    return true;
  }
  if(p.t==="R"&&!(dr===0||dc===0))return false;
  if(p.t==="Q"&&!(dr===0||dc===0||dr===dc))return false;
  if(!dr&&!dc)return false;
  return pathClear(p.r,p.c,r,c);
}
function attacked(r,c){
  for(const p of W){
    const dr=Math.abs(r-p.r),dc=Math.abs(c-p.c);
    if(p.t==="K"){if(dr<=1&&dc<=1&&(dr||dc))return true;continue;}
    if(p.t==="R"&&!(dr===0||dc===0))continue;
    if(p.t==="Q"&&!(dr===0||dc===0||dr===dc))continue;
    if(pathClear(p.r,p.c,r,c))return true;
  }
  return false;
}
function isMate(){
  if(!attacked(B.r,B.c))return false;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(!dr&&!dc)continue;
    const r=B.r+dr,c=B.c+dc;
    if(r<0||r>7||c<0||c>7)continue;
    const ow=W.findIndex(p=>p.r===r&&p.c===c);
    if(ow>=0){
      const saved=W.splice(ow,1)[0];
      const def=attacked(r,c);
      W.splice(ow,0,saved);
      if(!def)return false;
    }else if(!attacked(r,c))return false;
  }
  return true;
}
function tap(r,c){
  if(over)return;
  const w=W.findIndex(p=>p.r===r&&p.c===c);
  if(sel<0){
    if(w>=0){sel=w;H.sfx("tick");paint();}
    return;
  }
  if(w===sel){sel=-1;paint();return;}
  const p=W[sel];
  if(legalMove(p,r,c)){
    const or=p.r,oc=p.c;p.r=r;p.c=c;
    att++;hud.set("tt",att);H.sfx("pop");
    if(isMate()){
      const gain=Math.max(50,200-att*15);sc+=gain;H.score(sc);hud.set("sc",sc);
      pi++;
      if(pi>=PUZ.length){over=true;paint();return H.done({win:true,score:sc+100,title:"Grande mestre!",sub:"4 mates em 1 lance cravados."});}
      say("♔ <b>MATE!</b> Próximo puzzle…");H.after(900,build);return;
    }
    p.r=or;p.c=oc;sel=-1;paint();
    say("Não é mate — as pretas escapam. Tente outro lance!");
  }else{H.sfx("bad");sel=w>=0?w:-1;paint();}
}
build();
}});"""

# 82 — Torres no Caminho
GAMES[82] = r"""/* NCODE N · 082 Torres no Caminho — segure as 8 ondas */
GREG(82,{
init(root,H){
const WP=[[-20,80],[400,80],[400,200],[120,200],[120,320],[540,320]];
let over=false,money=150,lives=10,wave=0,creeps=[],towers=[],shots=[],selT="arch",spawning=[],spawnT=0,sc=0;
const ARCH={cost:50,range:95,dmg:6,rate:2,col:"#2E6E8A"};
const CAN={cost:100,range:115,dmg:24,rate:.6,col:H.C.terra};
const hud=H.hud(root,[["wv","ONDA","0/8"],["ouro","OURO",150],["vd","VIDAS",10]]);
const say=H.msg(root,"Escolha a torre e clique no <b>gramado</b> (fora do caminho). Arqueira: rápida · Canhão: dano em área.");
const o=H.cvs(root,520,400),x=o.x;
function segDist(px,py,a,b){
  const dx=b[0]-a[0],dy=b[1]-a[1],L2=dx*dx+dy*dy;
  let t=((px-a[0])*dx+(py-a[1])*dy)/L2;t=H.clamp(t,0,1);
  return Math.hypot(px-(a[0]+t*dx),py-(a[1]+t*dy));
}
function onPath(px,py){
  for(let i=0;i<WP.length-1;i++)if(segDist(px,py,WP[i],WP[i+1])<26)return true;
  return false;
}
H.onTap(o,(px,py)=>{
  if(over)return;
  if(spawning.length||creeps.length){/* pode construir durante a onda também */}
  const T=selT==="arch"?ARCH:CAN;
  if(money<T.cost){H.sfx("bad");say("Ouro insuficiente! ("+T.cost+")");return;}
  if(onPath(px,py)){H.sfx("bad");say("Não dá para construir <b>sobre o caminho</b>!");return;}
  if(towers.some(t=>Math.hypot(t.x-px,t.y-py)<30)){H.sfx("bad");return;}
  money-=T.cost;towers.push({x:px,y:py,T,cd:0});
  hud.set("ouro",money);H.sfx("ok");
});
function startWave(){
  if(over||spawning.length||creeps.length)return;
  wave++;hud.set("wv",wave+"/8");
  const n=5+wave*2;
  for(let i=0;i<n;i++)spawning.push({hp:22+wave*13,speed:52+wave*4,rw:8+wave*2});
  spawnT=0;say("🌊 Onda "+wave+": "+n+" criaturas a caminho!");
}
H.loop(dt=>{
  if(over)return;
  if(spawning.length){
    spawnT-=dt;
    if(spawnT<=0){spawnT=.7;
      const c=spawning.shift();
      creeps.push(Object.assign({seg:0,t:0,x:WP[0][0],y:WP[0][1],maxhp:c.hp},c));
    }
  }
  for(let i=creeps.length-1;i>=0;i--){
    const c=creeps[i];
    let rem=c.speed*dt;
    while(rem>0&&c.seg<WP.length-1){
      const a=WP[c.seg],b=WP[c.seg+1];
      const len=Math.hypot(b[0]-a[0],b[1]-a[1])-c.t;
      if(rem<len){c.t+=rem;rem=0;}
      else{rem-=len;c.seg++;c.t=0;}
    }
    if(c.seg>=WP.length-1){
      creeps.splice(i,1);lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Base invadida!",sub:"Onda "+wave+". Venda? Não — construa mais cedo!"});}
      say("👹 Vazou uma! Vidas: "+lives);continue;
    }
    const a=WP[c.seg],b=WP[c.seg+1];
    const len=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1]));
    c.x=a[0]+(b[0]-a[0])*c.t/len;c.y=a[1]+(b[1]-a[1])*c.t/len;
  }
  for(const t of towers){
    t.cd-=dt;
    if(t.cd>0)continue;
    let best=null,bd=1e9;
    for(const c of creeps){
      const d=Math.hypot(c.x-t.x,c.y-t.y);
      if(d<t.T.range){const prog=c.seg*1000+c.t;if(prog>bd||!best){bd=prog;best=c;}}
    }
    if(best){t.cd=1/t.T.rate;
      shots.push({x:t.x,y:t.y-10,tx:best,ty:best.T||null,dmg:t.T.dmg,splash:t.T===CAN?44:0,sp:420});}
  }
  for(let i=shots.length-1;i>=0;i--){
    const s=shots[i];
    if(!creeps.includes(s.tx)){shots.splice(i,1);continue;}
    const dx=s.tx.x-s.x,dy=s.tx.y-s.y,d=Math.hypot(dx,dy);
    if(d<10){
      shots.splice(i,1);
      const victims=s.splash?creeps.filter(c=>Math.hypot(c.x-s.tx.x,c.y-s.tx.y)<s.splash):[s.tx];
      for(const v of victims){
        v.hp-=s.dmg;
        if(v.hp<=0&&creeps.includes(v)){
          creeps.splice(creeps.indexOf(v),1);
          money+=v.rw;sc+=10;H.score(sc);hud.set("ouro",money);hud.set("sc",sc);
        }
      }
      H.beep(500,.04);
    }else{s.x+=dx/d*s.sp*dt;s.y+=dy/d*s.sp*dt;}
  }
  if(wave>=8&&!creeps.length&&!spawning.length){
    over=true;return H.done({win:true,score:sc+200,title:"Fortaleza intacta!",sub:"8 ondas detidas. Vidas restantes: "+lives+"."});
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle="#c9b98f";x.lineWidth=34;x.lineJoin="round";x.beginPath();
  WP.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  x.beginPath();x.moveTo(WP[0][0],WP[0][1]-17);
  WP.forEach((p,i)=>{if(i)x.lineTo(p[0],p[1]-17);});x.stroke();
  for(const t of towers){
    x.fillStyle=H.C.ink;x.fillRect(t.x-12,t.y-8,24,22);
    x.fillStyle=t.T.col;x.beginPath();x.arc(t.x,t.y-12,13,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  }
  for(const c of creeps){
    x.fillStyle=H.C.terra;x.beginPath();x.arc(c.x,c.y,10,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
    x.fillStyle=H.C.ink;x.fillRect(c.x-12,c.y-20,24,5);
    x.fillStyle=H.C.wasabi;x.fillRect(c.x-12,c.y-20,24*Math.max(0,c.hp/c.maxhp),5);
  }
  x.fillStyle=H.C.gold;
  for(const s of shots){x.beginPath();x.arc(s.x,s.y,4,0,7);x.fill();}
  x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";
  x.fillText("🏰",o.W-34,336);
});
const row=H.el("div","g-row",null,root);
const b1=H.btn(row,"🏹 Arqueira $50",()=>{selT="arch";H.sfx("tick");},false);
const b2=H.btn(row,"💣 Canhão $100",()=>{selT="can";H.sfx("tick");},false);
H.btn(row,"🌊 Iniciar onda",startWave,true);
}});"""

# 83 — Pintura de Território
GAMES[83] = r"""/* NCODE N · 083 Pintura de Território — pinte mais que a IA */
GREG(83,{
init(root,H){
const N=8;
let over=false,g=[],lock=false;
const hud=H.hud(root,[["vo","VOCÊ",2],["ia","IA",2],["rd","RESTAM",60]]);
const say=H.msg(root,"Clique numa casa vazia: ela é sua <b>e as vizinhas inimigas viram</b>. Quem pintar mais vence!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(8,1fr)";
board.style.width="min(100%,360px)";
function build(){
  g=new Array(N*N).fill(0);
  g[27]=1;g[28]=-1;g[35]=-1;g[36]=1;
  lock=false;paint();counts();
}
function paint(){
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";
    if(g[i]===1){d.style.background=H.C.terra;}
    else if(g[i]===-1){d.style.background=H.C.ink;}
    else{d.addEventListener("click",()=>play(i));}
  }
}
function counts(){
  let a=0,b=0,e=0;
  for(const v of g){if(v===1)a++;else if(v===-1)b++;else e++;}
  hud.set("vo",a);hud.set("ia",b);hud.set("rd",e);
  return[a,b,e];
}
function flips(i,who){
  const r=(i/N)|0,c=i%N,out=[];
  [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
    const nr=r+v[0],nc=c+v[1];
    if(nr>=0&&nr<N&&nc>=0&&nc<N&&g[nr*N+nc]===-who)out.push(nr*N+nc);
  });
  return out;
}
function play(i){
  if(over||lock||g[i]!==0)return;
  g[i]=1;flips(i,1).forEach(k=>g[k]=1);
  H.sfx("tick");paint();
  let[a,b,e]=counts();
  if(!e)return finish();
  lock=true;
  H.after(450,()=>{
    if(over)return;
    let best=-1,bs=-1;
    for(let k=0;k<N*N;k++){
      if(g[k]!==0)continue;
      const f=flips(k,-1).length+(Math.random()*.5);
      if(f>bs){bs=f;best=k;}
    }
    if(best>=0){g[best]=-1;flips(best,-1).forEach(k=>g[k]=-1);}
    paint();counts();
    const e2=counts()[2];
    if(e2<=0)return finish();
    lock=false;
  });
}
function finish(){
  over=true;
  const[a,b]=counts();
  H.score(a);
  if(a>b)return H.done({win:true,score:a*5,title:"Território conquistado!",sub:a+" × "+b+" contra a IA."});
  if(a<b)return H.done({win:false,score:a*5,title:"IA pintou mais!",sub:a+" × "+b+". Roube as bordas dela!"});
  return H.done({win:true,score:a*5,title:"Empate técnico!",sub:a+" × "+b+"."});
}
build();
}});"""

# 84 — Marcha do Exército
GAMES[84] = r"""/* NCODE N · 084 Marcha do Exército — capture as bandeiras */
GREG(84,{
init(root,H){
const N=7,FLAGS=[[3,1],[3,5]];
let over=false,units=[],sel=null,turn=1;
const hud=H.hud(root,[["tn","TURNO",1],["vo","SUA TROPA",3],["ia","INIMIGOS",3]]);
const say=H.msg(root,"Clique num soldado e depois em <b>vizinho vazio</b> (mover) ou <b>inimigo vizinho</b> (atacar). Capture as 2 ⚑ ou destrua todos!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(7,1fr)";
board.style.width="min(100%,350px)";
function build(){
  units=[
    {s:1,r:6,c:1,hp:3},{s:1,r:6,c:3,hp:3},{s:1,r:6,c:5,hp:3},
    {s:-1,r:0,c:1,hp:3},{s:-1,r:0,c:3,hp:3},{s:-1,r:0,c:5,hp:3}
  ];
  units.forEach(u=>u.acted=false);
  sel=null;turn=1;paint();
}
function at(r,c){return units.find(u=>u.r===r&&u.c===c);}
function paint(){
  board.innerHTML="";
  const mine=units.filter(u=>u.s===1).length,foe=units.filter(u=>u.s===-1).length;
  hud.set("vo",mine);hud.set("ia",foe);hud.set("tn",turn);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="11px";
    const isF=FLAGS.some(f=>f[0]===r&&f[1]===c);
    const u=at(r,c);
    if(u){
      d.textContent=(u.s===1?"🛡️":"⚔️")+u.hp;
      d.style.background=u.s===1?"#dce8c8":"#f2c9c2";
      if(u===sel)d.classList.add("sel");
      if(u.acted)d.style.opacity=.55;
    }else if(isF){d.textContent="⚑";d.style.fontSize="18px";}
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
}
function tap(r,c){
  if(over)return;
  const u=at(r,c);
  if(sel&&Math.abs(r-sel.r)+Math.abs(c-sel.c)===1){
    if(!u){sel.r=r;sel.c=c;sel.acted=true;H.sfx("tick");sel=null;paint();checkFlags();return;}
    if(u.s===-1){
      u.hp--;sel.acted=true;H.sfx("bad");
      if(u.hp<=0)units.splice(units.indexOf(u),1);
      sel=null;paint();
      if(!units.some(q=>q.s===-1)){over=true;H.score(300);return H.done({win:true,score:300,title:"Exército derrotado!",sub:"Tropa inimiga aniquilada no turno "+turn+"."});}
      checkFlags();return;
    }
  }
  if(u&&u.s===1&&!u.acted){sel=u;H.sfx("tick");paint();}
  else if(u&&u.s===1&&u.acted)say("Este soldado já agiu neste turno.");
}
function checkFlags(){
  const held=FLAGS.every(f=>{const u=at(f[0],f[1]);return u&&u.s===1;});
  if(held){over=true;H.score(300);H.done({win:true,score:300,title:"Bandeiras capturadas!",sub:"As 2 posições são suas no turno "+turn+"."});}
}
function aiTurn(){
  if(over)return;
  for(const u of units.filter(q=>q.s===-1)){
    const foes=units.filter(q=>q.s===1);
    if(!foes.length)break;
    const adj=foes.find(f=>Math.abs(f.r-u.r)+Math.abs(f.c-u.c)===1);
    if(adj){adj.hp--;H.beep(200,.08);
      if(adj.hp<=0)units.splice(units.indexOf(adj),1);
      continue;
    }
    const tgt=FLAGS.map(f=>({r:f[0],c:f[1],foe:!(at(f[0],f[1])||{}).s||at(f[0],f[1]).s===1}))
      .sort((a,b)=>(Math.abs(a.r-u.r)+Math.abs(a.c-u.c))-(Math.abs(b.r-u.r)+Math.abs(b.c-u.c)))[0];
    const prey=foes.sort((a,b)=>(Math.abs(a.r-u.r)+Math.abs(a.c-u.c))-(Math.abs(b.r-u.r)+Math.abs(b.c-u.c)))[0];
    const goal=(tgt.foe||Math.random()<.4)?tgt:prey;
    const dr=Math.sign(goal.r-u.r),dc=Math.sign(goal.c-u.c);
    const opts=[];
    if(dr&&!at(u.r+dr,u.c)&&u.r+dr>=0&&u.r+dr<N)opts.push([u.r+dr,u.c]);
    if(dc&&!at(u.r,u.c+dc)&&u.c+dc>=0&&u.c+dc<N)opts.push([u.r,u.c+dc]);
    if(opts.length){const m=opts[0];u.r=m[0];u.c=m[1];}
  }
  units.forEach(u=>u.acted=false);
  turn++;sel=null;paint();
  if(!units.some(q=>q.s===1)){over=true;return H.done({win:false,score:0,title:"Tropa perdida!",sub:"Todos os seus soldados caíram."});}
  if(turn>30){over=true;return H.done({win:false,score:50,title:"Reforços inimigos!",sub:"A batalha se arrastou demais."});}
  say("Turno "+turn+": sua vez de marchar.");
}
H.btn(root,"🏁 Encerrar turno (IA joga)",()=>{if(!over){H.sfx("pop");aiTurn();}},true);
build();
}});"""

# 85 — Cerco ao Castelo
GAMES[85] = r"""/* NCODE N · 085 Cerco ao Castelo — derrube a muralha */
GREG(85,{
init(root,H){
let over=false,ang=45,pw=62,wall=100,stones=8,proj=null,wind=0,sc=0;
const hud=H.hud(root,[["mr","MURALHA",100],["pd","PEDRAS",8],["sc","PONTOS",0]]);
const say=H.msg(root,"Ajuste <b>ângulo e força</b>, observe o <b>vento</b> e dispare. Derrube a muralha com 8 pedras!");
const o=H.cvs(root,520,360),x=o.x;
const WX=o.W-70;
function newWind(){wind=Math.round((Math.random()-.5)*14);hud.set("sc",sc);}
newWind();
function fire(){
  if(over||proj||stones<=0)return;
  stones--;hud.set("pd",stones);
  const a=ang*Math.PI/180,v=pw*9;
  proj={x:60,y:o.H-70,vx:Math.cos(a)*v,vy:-Math.sin(a)*v};
  H.sfx("pop");
}
H.loop(dt=>{
  if(over)return;
  if(proj){
    proj.vy+=800*dt;proj.vx+=wind*8*dt;
    proj.x+=proj.vx*dt;proj.y+=proj.vy*dt;
    if(proj.x>WX-14&&proj.x<WX+34&&proj.y>o.H-230&&proj.y<o.H-40){
      const dmg=Math.round(12+Math.hypot(proj.vx,proj.vy)/38);
      wall-=dmg;sc+=dmg;H.score(sc);hud.set("mr",Math.max(0,wall));hud.set("sc",sc);
      H.sfx("bad");proj=null;newWind();
      if(wall<=0){over=true;return H.done({win:true,score:sc+stones*20+100,title:"Muralha abaixo!",sub:"O castelo caiu com "+stones+" pedras de sobra."});}
      say("💥 Impacto direto! −"+dmg+" (vento agora "+wind+")");
    }else if(proj.x>o.W+20||proj.y>o.H+20||proj.x<-20){
      proj=null;newWind();
      if(stones<=0){over=true;return H.done({win:false,score:sc,title:"Sem pedras!",sub:"A muralha resistiu com "+wall+" HP. Ajuste a mira!"});}
      say("Errou! Vento: "+wind+". Restam "+stones+" pedras.");
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,o.H-40,o.W,40);
  x.fillStyle=H.C.ink;x.fillRect(WX,o.H-230,34,190);
  x.fillStyle=H.C.terra;x.fillRect(WX,o.H-230,34,190*(1-Math.max(0,wall)/100));
  x.fillStyle=H.C.ink;
  for(let i=0;i<4;i++)x.fillRect(WX-4+i*12,o.H-244,8,14);
  x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
  x.fillText(wall+" HP",WX-8,o.H-250);
  x.strokeStyle="#a4764a";x.lineWidth=6;
  x.beginPath();x.moveTo(40,o.H-40);x.lineTo(60,o.H-90);x.lineTo(90,o.H-40);x.stroke();
  x.fillStyle=H.C.ink;x.beginPath();x.arc(60,o.H-92,10,0,7);x.fill();
  x.fillStyle=H.C.ink3;x.font="12px 'Space Mono',monospace";
  x.fillText("∠ "+ang+"° · força "+pw+" · vento "+(wind>0?"+":"")+wind,14,24);
  if(!proj){
    const a=ang*Math.PI/180;
    x.setLineDash([4,5]);x.strokeStyle=H.C.terra;
    x.beginPath();x.moveTo(60,o.H-92);x.lineTo(60+Math.cos(a)*pw, o.H-92-Math.sin(a)*pw);x.stroke();
    x.setLineDash([]);
  }else{
    x.fillStyle=H.C.ink;x.beginPath();x.arc(proj.x,proj.y,8,0,7);x.fill();
  }
});
const r1=H.el("div","g-row",null,root);
[["∠ −","a",-3],["∠ +","a",3],["F −","p",-4],["F +","p",4]].forEach(([t,k,v])=>{
  const b=H.el("button","g-btn sm ghost",t,r1);
  b.addEventListener("click",()=>{
    if(k==="a")ang=H.clamp(ang+v,15,80);else pw=H.clamp(pw+v,30,95);
    H.sfx("tick");
  });
});
H.btn(root,"💥 DISPARAR",fire,true);
}});"""

# 86 — Frota Pirata
GAMES[86] = r"""/* NCODE N · 086 Frota Pirata — afunde a frota rival */
GREG(86,{
init(root,H){
const N=6,SHIPS=[3,2,2];
let over=false,phase="place",pships=[],eships=[],shotsP=new Set(),shotsE=new Set(),pi=0,orient="H",sc=0;
const hud=H.hud(root,[["fs","FASE","POSICIONAR"],["vo","SEUS NAVIOS",3],["ia","INIMIGOS",3]]);
const say=H.msg(root,"Posicione 3 navios (tamanhos 3,2,2): alterne <b>H/V</b> e clique a casa inicial. Acerto dá <b>tiro extra</b>!");
const wrap=H.el("div","g-row",null,root);
const bP=H.el("div","g-board",null,wrap),bE=H.el("div","g-board",null,wrap);
[bP,bE].forEach(b=>{b.style.gridTemplateColumns="repeat(6,1fr)";b.style.width="min(46%,230px)";});
function cells(ship){const c=[];for(let i=0;i<ship.l;i++)c.push(ship.o==="H"?ship.r*N+ship.c+i:(ship.r+i)*N+ship.c);return c;}
function paint(){
  bP.innerHTML="";bE.innerHTML="";
  const pc=new Set(pships.flatMap(cells));
  const ec=new Set(eships.flatMap(cells));
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,bP);
    d.style.aspectRatio="1";d.style.fontSize="14px";
    if(shotsE.has(i))d.textContent=pc.has(i)?"🔥":"·";
    else if(pc.has(i))d.textContent="🚢";
    if(phase==="place"){(function(idx){d.addEventListener("click",()=>place(idx));})(i);}
  }
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,bE);
    d.style.aspectRatio="1";d.style.fontSize="14px";
    if(shotsP.has(i))d.textContent=ec.has(i)?"🔥":"🌊";
    else d.textContent="❔";
    if(phase==="war"){(function(idx){d.addEventListener("click",()=>fire(idx));})(i);}
  }
  const alive=S=>S.filter(s=>!cells(s).every(c=>(S===pships?shotsE:shotsP).has(c))).length;
  hud.set("vo",alive(pships));hud.set("ia",alive(eships));
}
function fits(ship,other){
  const cc=cells(ship);
  if(ship.o==="H"&&(ship.c+ship.l>N))return false;
  if(ship.o==="V"&&(ship.r+ship.l>N))return false;
  const occ=new Set(other.flatMap(cells));
  return cc.every(c=>!occ.has(c));
}
function place(i){
  if(over||phase!=="place")return;
  const ship={r:(i/N)|0,c:i%N,l:SHIPS[pi],o:orient};
  if(!fits(ship,pships)){H.sfx("bad");say("Não cabe aqui — tente outra casa ou gire!");return;}
  pships.push(ship);pi++;H.sfx("ok");
  if(pi>=SHIPS.length){
    const r=H.rng(Date.now()%100000);
    eships=[];
    for(const L of SHIPS){
      let s,guard=0;
      do{s={r:Math.floor(r()*N),c:Math.floor(r()*N),l:L,o:r()<.5?"H":"V"};guard++;}
      while(!fits(s,eships)&&guard<200);
      eships.push(s);
    }
    phase="war";hud.set("fs","GUERRA");
    say("⚔️ Guerra! Clique no mar inimigo (direita) para atirar.");
  }else say("Navio "+(pi+1)+"/3 (tamanho "+SHIPS[pi]+"). Orientação: "+orient);
  paint();
}
function sunk(S,shots){return S.filter(s=>cells(s).every(c=>shots.has(c))).length;}
function fire(i){
  if(over||phase!=="war"||shotsP.has(i))return;
  shotsP.add(i);
  const ec=new Set(eships.flatMap(cells));
  if(ec.has(i)){H.sfx("ok");sc+=20;H.score(sc);
    say("🎯 Acertou! Atire de novo.");
    if(sunk(eships,shotsP)>=eships.length){over=true;paint();return H.done({win:true,score:sc+150,title:"Mar dominado!",sub:"Frota inimiga afundada."});}
  }else{H.sfx("tick");say("🌊 Água… vez do inimigo!");
    H.after(600,()=>{
      if(over)return;
      aiMove();
    });
  }
  paint();
}
function aiMove(){
  const opts=[];
  for(let i=0;i<N*N;i++)if(!shotsE.has(i))opts.push(i);
  const i=opts[Math.floor(Math.random()*opts.length)];
  shotsE.add(i);
  const pc=new Set(pships.flatMap(cells));
  if(pc.has(i)){
    say("🔥 Seu navio foi atingido! O inimigo atira de novo…");paint();
    if(sunk(pships,shotsE)>=pships.length){over=true;return H.done({win:false,score:sc,title:"Frota afundada!",sub:"Seus navios viraram recife."});}
    H.after(700,()=>{if(!over)aiMove();});
  }else{say("O inimigo errou. Sua vez!");paint();}
}
const row=H.el("div","g-row",null,root);
H.btn(row,"⇄ Girar H/V",()=>{orient=orient==="H"?"V":"H";H.sfx("tick");say("Orientação: "+orient);},false);
paint();
}});"""

# 87 — Colônia de Formigas
GAMES[87] = r"""/* NCODE N · 087 Colônia de Formigas — 10 dias de rainha */
GREG(87,{
init(root,H){
let over=false,day=1,ants=12,food=20,tunnel=0,jobs={f:6,g:3,d:3},log=[];
const hud=H.hud(root,[["dia","DIA","1/10"],["ants","FORMIGAS",12],["food","COMIDA",20],["tun","TÚNEL","0%"]]);
const say=H.msg(root,"Distribua as formigas entre <b>forragear, guardar e cavar</b>. Sobreviva 10 dias com o túnel pronto!");
const box=H.el("div","g-col",null,root);
const logBox=H.el("div","g-msg","A rainha aguarda suas ordens…",root);
const JOBS=[["f","🌾 Forrageiras"],["g","🛡️ Guardas"],["d","⛏️ Cavadoras"]];
function paint(){
  box.innerHTML="";
  JOBS.forEach(([k,n])=>{
    const row=H.el("div","g-row",null,box);
    H.el("span","g-chip",n+" <b>"+jobs[k]+"</b>",row);
    const m=H.el("button","g-btn sm ghost","−",row);
    const p=H.el("button","g-btn sm ghost","+",row);
    m.addEventListener("click",()=>{if(jobs[k]>0){jobs[k]--;H.sfx("tick");paint();}});
    p.addEventListener("click",()=>{
      const tot=jobs.f+jobs.g+jobs.d;
      if(tot<ants){jobs[k]++;H.sfx("tick");paint();}
      else{H.sfx("bad");}
    });
  });
  const row=H.el("div","g-row",null,box);
  H.el("span","g-chip","Livres: <b>"+(ants-jobs.f-jobs.g-jobs.d)+"</b>",row);
}
function nextDay(){
  if(over)return;
  const atk=Math.floor(Math.random()*7);
  const gain=jobs.f*2;
  food+=gain;
  const eat=8+day;
  food-=eat;
  let msg="Dia "+day+": +"+gain+" comida, −"+eat+" consumida. ";
  if(jobs.g<atk){
    const loss=Math.min(ants-1,atk-jobs.g);
    ants-=loss;food=Math.max(0,food-6);
    msg+="🕷️ Aranha (força "+atk+")! Guardas insuficientes: −"+loss+" formigas. ";
    H.sfx("bad");
  }else{msg+="🛡️ Ataque "+atk+" repelido. ";H.sfx("ok");}
  tunnel=Math.min(100,tunnel+jobs.d*8);
  msg+="⛏️ Túnel em "+tunnel+"%.";
  const tot=jobs.f+jobs.g+jobs.d;
  if(tot>ants){jobs.f=Math.min(jobs.f,ants);jobs.g=Math.min(jobs.g,Math.max(0,ants-jobs.f));jobs.d=Math.max(0,ants-jobs.f-jobs.g);}
  hud.set("food",food);hud.set("ants",ants);hud.set("tun",tunnel+"%");
  logBox.innerHTML=msg;say(msg);
  if(ants<3||food<0){over=true;return H.done({win:false,score:day*20,title:"Colônia colapsou!",sub:msg});}
  day++;
  if(day>10){
    over=true;
    if(tunnel>=100)return H.done({win:true,score:200+ants*10,title:"Colônia próspera!",sub:"10 dias, túnel pronto e "+ants+" formigas."});
    return H.done({win:false,score:100,title:"Túnel incompleto!",sub:"Só "+tunnel+"% cavado. Mais cavadoras!"});
  }
  hud.set("dia",day+"/10");paint();
}
H.btn(root,"☀ Avançar dia",nextDay,true);
paint();
}});"""

# 88 — Quarteirão Urbano
GAMES[88] = r"""/* NCODE N · 088 Quarteirão Urbano — zoneie a felicidade */
GREG(88,{
init(root,H){
const N=5;
const Z={casa:{e:"🏠",c:20},loja:{e:"🏪",c:30},fab:{e:"🏭",c:30},parq:{e:"🌳",c:25}};
let over=false,g=[],sel="casa",cash=200,built=0;
const hud=H.hud(root,[["din","CAIXA",200],["fel","FELICIDADE",0],["ob","OBRAS",0]]);
const say=H.msg(root,"Escolha a zona e clique nos lotes. Meta: <b>10 obras e felicidade ≥ 20</b>. Casas amam parques e odeiam fábricas!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(5,1fr)";
board.style.width="min(100%,320px)";
function build(){g=new Array(N*N).fill(null);paint();}
function happy(){
  let h=0;
  for(let i=0;i<N*N;i++){
    if(!g[i])continue;
    const r=(i/N)|0,c=i%N;
    const nb=[];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1];
      if(nr>=0&&nr<N&&nc>=0&&nc<N&&g[nr*N+nc])nb.push(g[nr*N+nc]);
    });
    if(g[i]==="casa"){h+=2;nb.forEach(n=>{if(n==="parq")h+=2;if(n==="fab")h-=2;if(n==="loja")h+=1;});}
    if(g[i]==="loja"){h+=nb.filter(n=>n==="casa").length;}
    if(g[i]==="fab"){h+=1;h-=nb.filter(n=>n==="casa").length;}
    if(g[i]==="parq"){h+=nb.filter(n=>n==="casa").length;}
  }
  return h;
}
function paint(){
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="22px";
    if(g[i])d.textContent=Z[g[i]].e;
    else{(function(idx){d.addEventListener("click",()=>place(idx));})(i);}
  }
  hud.set("din",cash);hud.set("fel",happy());hud.set("ob",built+"/10");
}
function place(i){
  if(over||g[i])return;
  if(cash<Z[sel].c){H.sfx("bad");say("Sem caixa para "+sel+"!");return;}
  cash-=Z[sel].c;g[i]=sel;built++;H.sfx("ok");paint();
  if(built>=10){
    over=true;const h=happy();H.score(Math.max(0,h*5));
    if(h>=20)return H.done({win:true,score:h*5,title:"Bairro modelo!",sub:"Felicidade "+h+" com 10 obras."});
    return H.done({win:false,score:Math.max(0,h*5),title:"Bairro cinzento",sub:"Felicidade "+h+" (meta 20). Separe casas e fábricas!"});
  }
}
const row=H.el("div","g-row",null,root);
Object.keys(Z).forEach(k=>{
  const b=H.el("button","g-chip",Z[k].e+" "+k+" $"+Z[k].c,row);
  b.style.cursor="pointer";
  b.addEventListener("click",()=>{sel=k;H.sfx("tick");say("Zona: <b>"+k+"</b> ($"+Z[k].c+")");});
});
build();
}});"""

# 89 — Firewall
GAMES[89] = r"""/* NCODE N · 089 Firewall — proteja o núcleo por 12 turnos */
GREG(89,{
init(root,H){
const N=7,CORE=3*N+3;
let over=false,turn=1,inf=new Set([0,N-1,(N-1)*N,N*N-1]),blk=new Set(),mode="block",acts={block:2,clean:1};
const hud=H.hud(root,[["tn","TURNO","1/12"],["if","INFECTADOS",4],["ac","AÇÕES","3"]]);
const say=H.msg(root,"Modo <b>bloquear 🧱</b> (2/turno) ou <b>limpar 💊</b> (1/turno). O vírus se espalha a cada turno — salve o ⭐!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(7,1fr)";
board.style.width="min(100%,350px)";
function paint(){
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="16px";
    if(i===CORE){d.textContent="⭐";d.classList.add("sel");}
    else if(blk.has(i)){d.textContent="🧱";d.disabled=true;}
    else if(inf.has(i)){d.textContent="🦠";d.classList.add("bad");}
    else d.textContent="·";
    (function(idx){d.addEventListener("click",()=>tap(idx));})(i);
  }
  hud.set("if",inf.size);hud.set("tn",turn+"/12");hud.set("ac",acts.block+acts.clean);
}
function tap(i){
  if(over||i===CORE)return;
  if(mode==="block"){
    if(acts.block<=0||blk.has(i)||inf.has(i)){H.sfx("bad");return;}
    blk.add(i);acts.block--;H.sfx("tick");paint();
  }else{
    if(acts.clean<=0||!inf.has(i)){H.sfx("bad");return;}
    inf.delete(i);acts.clean--;H.sfx("ok");paint();
  }
}
function next(){
  if(over)return;
  const add=[];
  inf.forEach(i=>{
    const r=(i/N)|0,c=i%N,opts=[];
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(!blk.has(k)&&!inf.has(k))opts.push(k);
    });
    if(opts.length)add.push(opts[Math.floor(Math.random()*opts.length)]);
  });
  add.forEach(k=>inf.add(k));
  turn++;acts={block:2,clean:1};paint();
  if(inf.has(CORE)){over=true;return H.done({win:false,score:turn*10,title:"Núcleo infectado!",sub:"O vírus chegou ao ⭐ no turno "+turn+"."});}
  if(turn>12){over=true;return H.done({win:true,score:200-inf.size*5,title:"Rede segura!",sub:"12 turnos com o núcleo intacto."});}
  say("Turno "+turn+": o vírus avançou para "+add.length+" nós!");
}
const row=H.el("div","g-row",null,root);
H.btn(row,"🧱 Bloquear",()=>{mode="block";H.sfx("tick");},false);
H.btn(row,"💊 Limpar",()=>{mode="clean";H.sfx("tick");},false);
H.btn(row,"⏭ Próximo turno",next,true);
paint();
}});"""

# 90 — Rotação de Culturas
GAMES[90] = r"""/* NCODE N · 090 Rotação de Culturas — 4 estações no verde */
GREG(90,{
init(root,H){
const CR={trigo:{y:60,n:-20,e:"🌾"},milho:{y:95,n:-35,e:"🌽"},feijao:{y:40,n:25,e:"🫘"},pousio:{y:0,n:12,e:"🟫"}};
const SE=["Primavera","Verão","Outono","Inverno"];
let over=false,se=0,cash=100,N2=[60,60,60,60],plan=["trigo","trigo","trigo","trigo"];
const hud=H.hud(root,[["es","ESTAÇÃO","Primavera"],["cx","CAIXA",100],["sc","META","$800"]]);
const say=H.msg(root,"Escolha a cultura de cada talhão e avance a estação. Solo pobre rende pouco — alterne com feijão e pousio!");
const box=H.el("div","g-col",null,root);
const log=H.el("div","g-msg","Planeje a primeira estação…",root);
function paint(){
  box.innerHTML="";
  for(let f=0;f<4;f++){
    const row=H.el("div","g-row",null,box);
    H.el("span","g-chip","Talhão "+(f+1)+" · N=<b>"+Math.round(N2[f])+"</b>",row);
    Object.keys(CR).forEach(k=>{
      const b=H.el("button","g-chip"+(plan[f]===k?" hot":""),CR[k].e+" "+k,row);
      b.style.cursor="pointer";
      (function(ff,kk){b.addEventListener("click",()=>{plan[ff]=kk;H.sfx("tick");paint();});})(f,k);
    });
  }
  hud.set("es",SE[se]);hud.set("cx",cash);
}
function advance(){
  if(over)return;
  const price=0.85+Math.random()*0.5;
  let gain=0,msg="Colheita de "+SE[se]+" (preço ×"+price.toFixed(2)+"): ";
  for(let f=0;f<4;f++){
    const c=CR[plan[f]];
    const y=Math.round(c.y*(0.4+N2[f]/100)*price);
    gain+=y;
    N2[f]=H.clamp(N2[f]+c.n,0,100);
    msg+=plan[f]+" +$"+y+" · ";
  }
  cash+=gain;log.innerHTML=msg+"<b>Caixa: $"+cash+"</b>";
  H.sfx("ok");se++;
  if(se>=4){
    over=true;H.score(cash);
    if(cash>=800)return H.done({win:true,score:cash,title:"Safra recorde!",sub:"$"+cash+" com solo vivo. Agrônomo nato!"});
    return H.done({win:false,score:cash,title:"Solo esgotado",sub:"$"+cash+" (meta $800). Descanse a terra!"});
  }
  paint();
}
H.btn(root,"🌤️ Avançar estação",advance,true);
paint();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
