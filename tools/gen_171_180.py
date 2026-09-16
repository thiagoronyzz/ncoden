#!/usr/bin/env python3
"""Gera games/g171..g180 — FÍSICA & SANDBOX (parte 2)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 171 — Simulador de Tornado
GAMES[171] = r"""/* NCODE N · 171 Simulador de Tornado — sugue 14 coisas! */
GREG(171,{
init(root,H){
let over=false,tor={x:250,y:200},objs=[],got=0,time=90;
const hud=H.hud(root,[["sg","SUGADOS","0/14"],["tp","TEMPO",90],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE o tornado pela cidade! Quem chegar perto do funil roda e some. Sugue 14 em 90s!");
const o=H.cvs(root,500,380),x=o.x;
const EM=["🏠","🏠","🚗","🚗","🌳","🌳","🐄","🚚","🏠","🌳","🚗","⛽","🏫","🌳","🚗","🏠"];
const r=H.rng(33);
EM.forEach(e=>objs.push({e,x:30+r()*440,y:60+r()*280,suck:0,a:r()*6,spin:2+r()*3}));
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:got*20,title:"Tornado passou!",sub:"Só "+got+"/14 sugados. Cubra a cidade toda!"});}
  if(ptr.down){tor.x=ptr.x;tor.y=ptr.y;}
  for(let i=objs.length-1;i>=0;i--){
    const b=objs[i];
    const d=Math.hypot(b.x-tor.x,b.y-tor.y);
    if(d<110){
      b.a+=dt*(6-d/25);
      const pull=(110-d)*dt*1.2;
      b.x+=(tor.x-b.x)/Math.max(d,1)*pull;
      b.y+=(tor.y-b.y)/Math.max(d,1)*pull;
      if(d<30){b.suck+=dt*2;}
    }
    if(b.suck>=1){
      objs.splice(i,1);got++;H.score(got*20);hud.set("sg",got+"/14");hud.set("sc",got*20);H.sfx("pop");
      if(got>=14){over=true;return H.done({win:true,score:380,title:"F5 total!",sub:"14 objetos rodopiando no funil."});}
    }
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#4A4A44";x.fillRect(0,180,o.W,26);x.fillRect(240,0,26,o.H);
  x.font="24px serif";
  objs.forEach(b=>{
    x.save();x.translate(b.x,b.y);x.rotate(b.suck>0?b.a*3:0);
    x.globalAlpha=1-b.suck*.7;
    x.fillText(b.e,-12,8);x.restore();x.globalAlpha=1;
  });
  // funil
  for(let i=0;i<8;i++){
    const w=20+i*11,y=tor.y-70+i*22;
    x.fillStyle="rgba(200,200,195,.85)";
    x.beginPath();x.ellipse(tor.x+Math.sin(time*6+i)*8,y,w,10,0,0,7);x.fill();
    x.strokeStyle="#8A877C";x.stroke();
  }
  x.strokeStyle="rgba(217,78,52,.4)";x.lineWidth=2;
  x.beginPath();x.arc(tor.x,tor.y,110,0,7);x.stroke();
});
}});"""

# 172 — Avalanche
GAMES[172] = r"""/* NCODE N · 172 Avalanche — soterre a cabana 🎯 */
GREG(172,{
init(root,H){
let over=false,balls=[],snow=[],cabs=[],throws=6;
const hud=H.hud(root,[["bl","BOLAS",6],["al","ALVO","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no alto da montanha para soltar a bola de neve — ela cresce rolando! Soterre 100% a cabana 🎯 sem passar de 60% nas outras.");
const o=H.cvs(root,520,380),x=o.x;
cabs=[{x:120,y:300,t:false,f:0},{x:300,y:320,t:true,f:0},{x:460,y:300,t:false,f:0}];
const slopeY=px=>80+px*0.42;
H.onTap(o,(px,py)=>{
  if(over||throws<=0||balls.length>=2)return;
  if(py>slopeY(px)-10){H.sfx("bad");say("Solte no alto da montanha (acima da encosta)!");return;}
  balls.push({x:px,y:py,vx:60,vy:0,r:10});
  throws--;hud.set("bl",throws);H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  for(let i=balls.length-1;i>=0;i--){
    const b=balls[i];
    b.vy+=500*dt;b.vx+=40*dt;
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    const sy=slopeY(b.x);
    if(b.y+b.r>sy){b.y=sy-b.r;b.vy*=-0.25;b.r=Math.min(46,b.r+dt*14);
      snow.push({x:b.x+(Math.random()-.5)*b.r,y:sy-4,r:4+Math.random()*6});
      if(snow.length>400)snow.splice(0,50);
    }
    cabs.forEach(c=>{
      if(Math.abs(b.x-c.x)<44&&b.y>c.y-60){
        c.f=Math.min(100,c.f+dt*b.r*1.1);
      }
    });
    if(b.x>o.W+60||b.y>o.H+40)balls.splice(i,1);
  }
  // neve acumulada também soterra
  cabs.forEach(c=>{
    let cover=0;
    snow.forEach(s=>{if(Math.abs(s.x-c.x)<40&&s.y>c.y-56)cover++;});
    c.f=Math.min(100,Math.max(c.f,cover*1.2));
  });
  const tgt=cabs.find(c=>c.t);
  hud.set("al",Math.floor(tgt.f)+"%");
  H.score(Math.floor(tgt.f)*3);hud.set("sc",Math.floor(tgt.f)*3);
  if(tgt.f>=100){
    over=true;
    const bad=cabs.some(c=>!c.t&&c.f>60);
    if(bad)return H.done({win:false,score:200,title:"Dano colateral!",sub:"Alvo soterrado, mas vizinhos passaram de 60%!"});
    return H.done({win:true,score:300+throws*30,title:"Avalanche cirúrgica!",sub:"Cabana-alvo soterrada, vizinhos a salvo."});
  }
  if(throws<=0&&!balls.length){
    over=true;
    return H.done({win:false,score:Math.floor(tgt.f)*3,title:"Neve pouca!",sub:"Alvo em "+Math.floor(tgt.f)+"%. Mire a bola por cima dele!"});
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";
  x.beginPath();x.moveTo(0,slopeY(0));
  for(let px=0;px<=o.W;px+=20)x.lineTo(px,slopeY(px));
  x.lineTo(o.W,o.H);x.lineTo(0,o.H);x.fill();
  x.fillStyle="#E8EDF0";
  snow.forEach(s=>{x.beginPath();x.arc(s.x,s.y,s.r,0,7);x.fill();});
  x.font="34px serif";
  cabs.forEach(c=>{
    x.fillText(c.t?"🎯":"🛖",c.x-17,c.y+10);
    x.fillStyle="rgba(255,255,255,.85)";
    x.fillRect(c.x-20,c.y-52,40*Math.min(1,c.f/100),6);
    x.strokeStyle=H.C.ink;x.strokeRect(c.x-20,c.y-52,40,6);
    x.font="34px serif";
  });
  x.fillStyle="#fff";
  balls.forEach(b=>{x.beginPath();x.arc(b.x,b.y,b.r,0,7);x.fill();x.strokeStyle="#8AB4D0";x.stroke();});
});
}});"""

# 173 — Terremoto
GAMES[173] = r"""/* NCODE N · 173 Terremoto — derrube só as fracas! */
GREG(173,{
init(root,H){
let over=false,builds=[],mag=0,charging=false,tries=3,shake=0;
const hud=H.hud(root,[["tt","TENTATIVAS",3],["mg","MAGNITUDE","0.0"],["sc","PONTOS",0]]);
const say=H.msg(root,"SEGURE para carregar (0→10) e SOLTE! 🏚️ fracas caem com 4+ · 🏢 fortes caem com 8.5+. Derrube as 2 fracas mantendo as 3 fortes!");
const o=H.cvs(root,520,340),x=o.x;
builds=[
  {x:60,w:70,h:150,weak:true,down:false,tilt:0},
  {x:150,w:80,h:200,weak:false,down:false,tilt:0},
  {x:250,w:60,h:120,weak:true,down:false,tilt:0},
  {x:330,w:80,h:230,weak:false,down:false,tilt:0},
  {x:425,w:65,h:170,weak:false,down:false,tilt:0}
];
const btn=H.el("button","g-btn","SEGURE: CARREGAR TREMOR",root);
btn.addEventListener("pointerdown",e=>{e.preventDefault();if(!over&&tries>0)charging=true;});
btn.addEventListener("pointerup",quake);
btn.addEventListener("pointerleave",()=>{if(charging)quake();});
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="Space"){
    if(d&&!over&&tries>0)charging=true;
    if(!d&&charging)quake();
  }
});
function quake(){
  if(!charging||over)return;
  charging=false;tries--;hud.set("tt",tries);
  shake=mag*2;H.sfx("bad");
  builds.forEach(b=>{
    if(b.down)return;
    if(b.weak&&mag>=4){b.down=true;b.tilt=(Math.random()<.5?-1:1);}
    if(!b.weak&&mag>=8.5){b.down=true;b.tilt=(Math.random()<.5?-1:1);}
  });
  const weakDown=builds.filter(b=>b.weak&&b.down).length;
  const strongDown=builds.filter(b=>!b.weak&&b.down).length;
  H.score(weakDown*100);hud.set("sc",weakDown*100);
  if(strongDown>0){over=true;
    return H.done({win:false,score:weakDown*100,title:"Tragédia!",sub:"Um prédio forte caiu (mag "+mag.toFixed(1)+"). Mire 4–8!"});
  }
  if(weakDown>=2){over=true;
    return H.done({win:true,score:200+tries*50,title:"Demolição sísmica!",sub:"Só as fracas caíram. Precisão de engenheiro!"});
  }
  if(tries<=0){over=true;
    return H.done({win:false,score:weakDown*100,title:"Tremor fraco!",sub:"Faltaram fracas em pé. Carregue até 4+!"});
  }
  say("Mag "+mag.toFixed(1)+": fracas "+weakDown+"/2. "+tries+" tentativa(s)!");
  mag=0;
}
H.loop(dt=>{
  if(charging&&!over){
    mag+=dt*3.2;
    if(mag>10)mag=0;
    hud.set("mg",mag.toFixed(1));
  }
  if(shake>0)shake-=dt*8;
  builds.forEach(b=>{if(b.down&&Math.abs(b.tilt)<1.4)b.tilt+=Math.sign(b.tilt)*dt*1.5;});
  const sx=shake>0?(Math.random()-.5)*shake:0;
  x.save();x.translate(sx,0);
  x.fillStyle=H.C.paper;x.fillRect(-20,0,o.W+40,o.H);
  x.fillStyle="#8A877C";x.fillRect(-20,300,o.W+40,40);
  builds.forEach(b=>{
    x.save();
    x.translate(b.x+b.w/2,300);x.rotate(b.tilt*.5);
    x.fillStyle=b.weak?"#C9A06F":"#7A8A99";
    x.fillRect(-b.w/2,-b.h,b.w,b.h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(-b.w/2,-b.h,b.w,b.h);
    x.fillStyle="rgba(255,255,255,.5)";
    for(let wy=-b.h+10;wy<-10;wy+=24)for(let wx=-b.w/2+6;wx<b.w/2-6;wx+=16)x.fillRect(wx,wy,9,12);
    x.restore();
    x.font="18px serif";
    x.fillText(b.weak?"🏚️":"🏢",b.x+b.w/2-9,296-b.h-4);
  });
  x.restore();
  x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";
  x.fillText("MAG "+mag.toFixed(1),12,24);
  x.fillStyle=H.C.terra;x.fillRect(12,30,200*mag/10,10);
  x.strokeStyle=H.C.ink;x.strokeRect(12,30,200,10);
  x.fillStyle=H.C.ok;x.fillRect(12+200*4/10,30,200*4.5/10,10);
});
}});"""

# 174 — Vulcão
GAMES[174] = r"""/* NCODE N · 174 Vulcão — desvie a lava das vilas! */
GREG(174,{
init(root,H){
const CW=26,CH=18,CS=18;
let over=false,grid=[],walls=12,time=100,spawn=0,burned=0;
const hud=H.hud(root,[["tp","TEMPO",100],["mr","MUROS",12],["vl","VILAS","3/3"]]);
const say=H.msg(root,"Clique para erguer <b>muro</b> (12 no total, clique de novo para tirar). A lava desce do 🌋 — proteja as 3 🏘️ por 100s ou jogue-a no 🌊 mar (direita)!");
const o=H.cvs(root,CW*CS+20,CH*CS+20),x=o.x;
const OX=10,OY=10;
const CR={c:12,r:1};
const VIL=[{c:6,r:15},{c:13,r:16},{c:20,r:15}];
const vilAlive=[true,true,true];
grid=new Array(CW*CH).fill(0); // 0 vazio,1 lava,2 muro
function idx(c,r){return r*CW+c;}
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(c<0||c>=CW||r<0||r>=CH)return;
  if(VIL.some(v=>v.c===c&&v.r===r))return;
  if(c===CR.c&&r===CR.r)return;
  const k=idx(c,r);
  if(grid[k]===2){grid[k]=0;walls++;hud.set("mr",walls);H.sfx("tick");}
  else if(grid[k]===0&&walls>0){grid[k]=2;walls--;hud.set("mr",walls);H.sfx("tick");}
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){
    over=true;
    const alive=vilAlive.filter(Boolean).length;
    if(alive>=2)return H.done({win:true,score:alive*120,title:"Vilas salvas!",sub:alive+"/3 vilas intactas após 100s de erupção."});
    return H.done({win:false,score:alive*120,title:"Rio de lava!",sub:"Só "+alive+"/3 vilas. Cerque com muros!"});
  }
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.15,.5-time*.003);grid[idx(CR.c,CR.r)]=1;}
  // autômato da lava (de baixo para cima)
  for(let r=CH-1;r>=0;r--)for(let c=0;c<CW;c++){
    if(grid[idx(c,r)]!==1)continue;
    if(c===CW-1){grid[idx(c,r)]=0;continue;} // mar drena
    const opts=[[0,1],[-1,1],[1,1],[-1,0],[1,0]];
    for(const[dc,dr]of opts){
      const nc=c+dc,nr=r+dr;
      if(nc<0||nc>=CW||nr<0||nr>=CH)continue;
      if(grid[idx(nc,nr)]===0){grid[idx(nc,nr)]=1;grid[idx(c,r)]=0;break;}
    }
  }
  VIL.forEach((v,i)=>{
    if(vilAlive[i]&&grid[idx(v.c,v.r)]===1){
      vilAlive[i]=false;burned++;H.sfx("bad");
      hud.set("vl",vilAlive.filter(Boolean).length+"/3");
      say("🔥 Uma vila queimou! ("+vilAlive.filter(Boolean).length+" restantes)");
      if(vilAlive.filter(Boolean).length<2){
        // continua até o fim; derrota decidida no tempo
      }
    }
  });
  x.fillStyle="#3a2f28";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<CH;r++)for(let c=0;c<CW;c++){
    const v=grid[idx(c,r)];
    if(v===1){
      x.fillStyle=Math.random()<.3?"#F5A623":"#D94E34";
      x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
    }else if(v===2){
      x.fillStyle="#8A6A2F";x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
      x.strokeStyle="#5b3d20";x.strokeRect(OX+c*CS,OY+r*CS,CS,CS);
    }
  }
  x.fillStyle="#2E6E8A";x.fillRect(OX+(CW-1)*CS,OY,CS,CH*CS);
  x.font="16px serif";
  x.fillText("🌋",OX+CR.c*CS-2,OY+CR.r*CS+16);
  VIL.forEach((v,i)=>x.fillText(vilAlive[i]?"🏘️":"☠️",OX+v.c*CS-2,OY+v.r*CS+16));
});
}});"""

# 175 — Muralha Anti-Tsunami
GAMES[175] = r"""/* NCODE N · 175 Muralha Anti-Tsunami — 3 ondas, cidade seca! */
GREG(175,{
init(root,H){
let over=false,walls=[],cash=60,wave=0,phase="build",anim=0,flood=false;
const hud=H.hud(root,[["od","ONDA","—/3"],["cx","CAIXA","$60"],["cd","CIDADE","seca ✓"]]);
const say=H.msg(root,"Clique nos lotes para <b>construir muro ($10)</b>. <b>Soltar onda!</b> testa tudo. Sobreviva às 3 ondas (+$20 por onda para reparos).");
const o=H.cvs(root,500,360),x=o.x;
walls=new Array(10).fill(0); // hp 0=vazio, 1..3
H.onTap(o,(px,py)=>{
  if(over||phase!=="build")return;
  const i=Math.floor(px/(o.W/10));
  if(i<0||i>9)return;
  if(walls[i]>=3){H.sfx("bad");return;}
  if(cash<10){H.sfx("bad");say("Sem caixa!");return;}
  cash-=10;walls[i]++;hud.set("cx","$"+cash);H.sfx("tick");
});
H.btn(root,"🌊 Soltar a onda!",()=>{
  if(over||phase!=="build")return;
  phase="wave";anim=0;flood=false;H.sfx("bad");
},true);
H.loop(dt=>{
  if(over)return;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,240,o.W,120);
  x.font="22px serif";
  for(let i=0;i<10;i++)x.fillText("🏠",i*50+12,330);
  const cw=o.W/10;
  walls.forEach((hp,i)=>{
    if(hp>0){
      x.fillStyle=["","#C9A06F","#8A6A2F","#5b3d20"][hp];
      x.fillRect(i*cw+4,240-hp*26,cw-8,hp*26);
      x.strokeStyle=H.C.ink;x.strokeRect(i*cw+4,240-hp*26,cw-8,hp*26);
    }else{
      x.strokeStyle=H.C.cement;x.setLineDash([4,4]);
      x.strokeRect(i*cw+4,240-26,cw-8,26);x.setLineDash([]);
    }
  });
  if(phase==="wave"){
    anim+=dt;
    const power=[2,3,4][wave];
    const wh=Math.min(250,anim*160);
    x.fillStyle="rgba(46,110,138,.75)";
    x.fillRect(0,240-wh,o.W,wh);
    x.fillStyle="#fff";x.font="bold 15px 'Space Mono',monospace";
    x.fillText("ONDA "+(wave+1)+" · força "+power,180,250-wh);
    if(anim>1.6){
      // resolve
      for(let i=0;i<10;i++){
        if(walls[i]<power){
          if(walls[i]>0){walls[i]=0;}
          flood=true;
        }else walls[i]--;
      }
      if(flood){
        over=true;hud.set("cd","ALAGADA!");
        return H.done({win:false,score:wave*80,title:"Tsunami passou!",sub:"Onda "+(wave+1)+" alagou a cidade. Muros ≥ força "+power+" em TODOS os lotes!"});
      }
      wave++;cash+=20;hud.set("cx","$"+cash);hud.set("od",wave+"/3");
      H.sfx("ok");
      if(wave>=3){over=true;
        return H.done({win:true,score:300+cash,title:"Cidade seca!",sub:"3 tsunamis contidos pela muralha."});}
      say("Onda "+wave+" contida! +$20. Próxima: força "+[2,3,4][wave]+". Repare (clique)!");
      hud.set("od",(wave+1)+"/3?");
      hud.set("od",(wave)+"/3");
      phase="build";
    }
  }else{
    x.fillStyle="#2E6E8A";
    for(let i=0;i<8;i++)x.fillRect(i*70+((Date.now()/30)%70)-70,232,34,5);
  }
});
}});"""

# 176 — Impacto de Meteoro
GAMES[176] = r"""/* NCODE N · 176 Impacto de Meteoro — 5 alvos, 8 pedras! */
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
}});"""

# 177 — Túnel de Vento
GAMES[177] = r"""/* NCODE N · 177 Túnel de Vento — 3 voos na faixa! */
GREG(177,{
init(root,H){
const OBJ=[{e:"🪶",n:"pena",w:[35,55]},{e:"🎈",n:"balão",w:[55,75]},{e:"✈️",n:"avião",w:[75,95]}];
let over=false,st=0,wind=30,oy=200,vy=0,holdT=0,gust=0,t=0;
const hud=H.hud(root,[["fs","FASE","1/3"],["vn","VENTO",30],["fx","NA FAIXA","0s/5s"]]);
const say=H.msg(root,"Ajuste o <b>vento</b> (+/−) para segurar o objeto na <b>faixa verde</b> por 5s! Cada um voa numa faixa de vento. Rajadas atrapalham!");
const o=H.cvs(root,500,340),x=o.x;
H.loop(dt=>{
  if(over)return;
  t+=dt;gust=Math.sin(t*2.1)*9+Math.sin(t*.7)*7;
  const O=OBJ[st];
  const eff=wind+gust;
  const mid=(O.w[0]+O.w[1])/2;
  const lift=(eff-mid)*2.2;
  vy+=(160-lift*4)*dt*.4;
  vy=H.clamp(vy,-140,140);
  oy=H.clamp(oy+vy*dt,60,o.H-40);
  const inZone=oy>130&&oy<210;
  if(inZone){holdT+=dt;hud.set("fx",holdT.toFixed(1)+"s/5s");}
  else holdT=Math.max(0,holdT-dt);
  if(holdT>=5){
    H.sfx("ok");st++;
    if(st>=OBJ.length){over=true;
      return H.done({win:true,score:400,title:"Aerodinâmica dominada!",sub:"3 objetos estabilizados no túnel."});}
    holdT=0;oy=200;vy=0;
    say("✅ "+OBJ[st-1].n+"! Agora: "+OBJ[st].e+" "+OBJ[st].n+" (vento "+OBJ[st].w.join("–")+").");
    hud.set("fs",(st+1)+"/3");
  }
  x.fillStyle="#2c3e4d";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(196,214,69,.25)";x.fillRect(0,130,o.W,80);
  x.strokeStyle=H.C.wasabi;x.strokeRect(0,130,o.W,80);
  x.strokeStyle="rgba(255,255,255,.3)";x.lineWidth=2;
  for(let i=0;i<6;i++){
    const yy=40+i*50,off=(t*(30+wind*3)+i*90)%(o.W+100)-50;
    x.beginPath();x.moveTo(off,yy);x.lineTo(off+40+wind,yy);x.stroke();
  }
  x.font="40px serif";x.fillText(O.e,o.W/2-20,oy+14);
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText(O.n+" voa com vento "+O.w.join("–")+" · rajada "+(gust>0?"+":"")+Math.round(gust),12,20);
  x.fillText("vento: "+Math.round(wind),12,300);
  x.fillStyle=H.C.wasabi;x.fillRect(12,308,wind*3,12);
});
const row=H.el("div","g-row",null,root);
H.btn(row,"💨 − vento",()=>{wind=Math.max(0,wind-5);hud.set("vn",Math.round(wind));H.sfx("tick");},false);
H.btn(row,"🌪️ + vento",()=>{wind=Math.min(100,wind+5);hud.set("vn",Math.round(wind));H.sfx("tick");},false);
}});"""

# 178 — Campo Magnético
GAMES[178] = r"""/* NCODE N · 178 Campo Magnético — 70% da limalha no alvo! */
GREG(178,{
init(root,H){
let over=false,parts=[],mags=[],holdT=0,time=120;
const hud=H.hud(root,[["lm","NO ALVO","0%"],["tp","TEMPO",120],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no vazio para plantar <b>ímã 🧲N (atrai)</b>, clique nele para virar <b>S (repele)</b>, de novo para tirar (máx 4). Segure 70% no ⭕ por 3s!");
const o=H.cvs(root,500,360),x=o.x;
const TGT={x:400,y:90,r:46};
const r=H.rng(55);
for(let i=0;i<40;i++)parts.push({x:40+r()*300,y:120+r()*200,vx:0,vy:0});
H.onTap(o,(px,py)=>{
  if(over)return;
  const mi=mags.findIndex(m=>Math.hypot(px-m.x,py-m.y)<24);
  if(mi>=0){
    const m=mags[mi];
    if(m.p==="N")m.p="S";
    else mags.splice(mi,1);
    H.sfx("tick");return;
  }
  if(mags.length>=4){H.sfx("bad");say("Máx 4 ímãs! Clique num ímã para alternar/remover.");return;}
  mags.push({x:px,y:py,p:"N"});H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:0,title:"Tempo esgotado!",sub:"N atrai, S empurra: combine os 4 ímãs!"});
  }
  parts.forEach(p=>{
    mags.forEach(m=>{
      const dx=m.x-p.x,dy=m.y-p.y,d=Math.max(20,Math.hypot(dx,dy));
      const f=(m.p==="N"?1:-1)*9000/(d*d)*dt*60;
      p.vx+=dx/d*f*dt*10;p.vy+=dy/d*f*dt*10;
    });
    p.vx*=0.94;p.vy*=0.94;
    p.vx=H.clamp(p.vx,-160,160);p.vy=H.clamp(p.vy,-160,160);
    p.x=H.clamp(p.x+p.vx*dt,8,o.W-8);
    p.y=H.clamp(p.y+p.vy*dt,8,o.H-8);
  });
  const inside=parts.filter(p=>Math.hypot(p.x-TGT.x,p.y-TGT.y)<TGT.r).length;
  const pct=Math.round(inside/parts.length*100);
  hud.set("lm",pct+"%");H.score(pct*4);hud.set("sc",pct*4);
  if(pct>=70){holdT+=dt;
    if(holdT>=3){over=true;
      return H.done({win:true,score:380,title:"Física magnética!",sub:"70% da limalha presa no alvo."});}
  }else holdT=0;
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.wasabi;x.lineWidth=3;
  x.beginPath();x.arc(TGT.x,TGT.y,TGT.r,0,7);x.stroke();
  x.fillStyle="rgba(196,214,69,.12)";
  x.beginPath();x.arc(TGT.x,TGT.y,TGT.r,0,7);x.fill();
  x.fillStyle="#C9C5B8";
  parts.forEach(p=>{x.beginPath();x.arc(p.x,p.y,3,0,7);x.fill();});
  x.font="20px serif";
  mags.forEach(m=>{
    x.fillText(m.p==="N"?"🧲":"🧿",m.x-10,m.y+7);
    x.fillStyle=m.p==="N"?"#D94E34":"#2E6E8A";x.font="bold 11px 'Space Mono',monospace";
    x.fillText(m.p,m.x-4,m.y-14);x.font="20px serif";
  });
  if(holdT>0){x.fillStyle=H.C.wasabi;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("SEGURANDO "+(3-holdT).toFixed(1)+"s…",180,30);}
});
H.btn(root,"🔀 Espalhar limalha",()=>{
  if(over)return;
  parts.forEach(p=>{p.x=40+Math.random()*300;p.y=120+Math.random()*200;p.vx=0;p.vy=0;});
  H.sfx("tick");
},false);
}});"""

# 179 — Mistura de Fluidos
GAMES[179] = r"""/* NCODE N · 179 Mistura de Fluidos — camadas na medida! */
GREG(179,{
init(root,H){
const FL={mel:{d:3,c:"#B06A1F",n:"🍯 mel"},agua:{d:2,c:"#2E6E8A",n:"💧 água"},oleo:{d:1,c:"#E8D33D",n:"🫒 óleo"},alcool:{d:0,c:"#BFE0EF",n:"🧪 álcool"}};
const ROUNDS=[
  {t:{mel:30,agua:30},n:"mel 30 + água 30"},
  {t:{mel:25,agua:25,oleo:25},n:"mel 25 + água 25 + óleo 25"},
  {t:{mel:20,agua:20,oleo:20,alcool:20},n:"todos 20"}
];
let over=false,rd=0,vol={mel:0,agua:0,oleo:0,alcool:0},sel="mel",pour=false;
const hud=H.hud(root,[["rd","RODADA","1/3"],["tt","TOTAL","0/100"]]);
const say=H.msg(root,"Escolha o líquido e SEGURE <b>despejar</b>. O tanque separa por densidade sozinho. Acerte as <b>quantidades (±8)</b>!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
function paint(){
  const tot=vol.mel+vol.agua+vol.oleo+vol.alcool;
  hud.set("rd",(rd+1)+"/3");hud.set("tt",Math.floor(tot)+"/100");
  od.innerHTML="🧾 Meta: "+ROUNDS[rd].n+" · atual: "+
    Object.keys(vol).map(k=>FL[k].n.split(" ")[0]+Math.floor(vol[k])).join(" ")+" · despejando: "+FL[sel].n;
}
paint();
const frow=H.el("div","g-row",null,box);
Object.keys(FL).forEach(k=>{
  H.btn(frow,FL[k].n,()=>{sel=k;H.sfx("tick");paint();},k===sel);
});
const pb=H.el("button","g-btn","SEGURE PARA DESPEJAR",box);
pb.addEventListener("pointerdown",e=>{e.preventDefault();pour=true;});
pb.addEventListener("pointerup",()=>pour=false);
pb.addEventListener("pointerleave",()=>pour=false);
const o=H.cvs(root,440,260),x=o.x;
H.loop(dt=>{
  if(over)return;
  if(pour){
    vol[sel]+=dt*14;
    const tot=vol.mel+vol.agua+vol.oleo+vol.alcool;
    if(tot>100){
      vol={mel:0,agua:0,oleo:0,alcool:0};pour=false;H.sfx("bad");
      say("🌊 TRANSBORDOU! Tanque esvaziado — recomece a rodada.");
    }
    paint();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=4;
  x.strokeRect(150,20,140,220);
  const order=["mel","agua","oleo","alcool"];
  let y=240;
  order.forEach(k=>{
    const h=vol[k]/100*220;
    x.fillStyle=FL[k].c;
    x.fillRect(154,y-h,132,h);
    y-=h;
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("denso ↓",300,230);x.fillText("leve ↑",300,40);
  if(pour){
    x.fillStyle=FL[sel].c;
    x.fillRect(214,0,12,40);
  }
});
const row=H.el("div","g-row",null,box);
H.btn(row,"✅ Conferir",()=>{
  if(over)return;
  const T=ROUNDS[rd].t;
  const ok=Object.keys(T).every(k=>Math.abs(vol[k]-T[k])<=8)&&
    Object.keys(vol).every(k=>(T[k]||0)===0?vol[k]<8:true);
  if(ok){
    H.sfx("ok");rd++;
    if(rd>=ROUNDS.length){over=true;
      return H.done({win:true,score:400,title:"Química perfeita!",sub:"3 tanques em camadas exatas."});}
    vol={mel:0,agua:0,oleo:0,alcool:0};
    say("✅ Rodada pronta! Agora: "+ROUNDS[rd].n);paint();
  }else{H.sfx("bad");say("❌ Fora da medida! Compare os números (±8).");}
},true);
H.btn(row,"🗑️ Esvaziar",()=>{if(!over){vol={mel:0,agua:0,oleo:0,alcool:0};H.sfx("tick");paint();}},false);
}});"""

# 180 — Corrente Giratória
GAMES[180] = r"""/* NCODE N · 180 Corrente Giratória — enrole e acerte! */
GREG(180,{
init(root,H){
const N=20,SEG=24,ANCH={x:110,y:80},POST={x:300,y:250,r:26},TGT={x:420,y:300,r:26};
const WALL={x:350,y:0,w:16,h:190};
let over=false,pts=[],tries=5,drag=false,thrown=false,rest=0,firstTouch=true;
const hud=H.hud(root,[["tt","TENTATIVAS",5],["st","STATUS","arraste a bola"]]);
const say=H.msg(root,"ARRASTE a bola da corrente e SOLTE para balançar! Enrole no poste e toque a 🎯 (o muro bloqueia o caminho direto).");
const o=H.cvs(root,520,380),x=o.x;
function reset(){
  pts=[];
  for(let i=0;i<N;i++)pts.push({x:ANCH.x,y:ANCH.y+i*SEG,ox:ANCH.x,oy:ANCH.y+i*SEG});
  thrown=false;drag=false;rest=0;
}
reset();
function collide(p,ball){
  // poste
  const dx=p.x-POST.x,dy=p.y-POST.y,d=Math.hypot(dx,dy),rr=POST.r+(ball?10:4);
  if(d<rr&&d>0.01){p.x=POST.x+dx/d*rr;p.y=POST.y+dy/d*rr;}
  // muro
  if(p.x>WALL.x&&p.x<WALL.x+WALL.w&&p.y<WALL.y+WALL.h){
    if(p.ox<=WALL.x)p.x=WALL.x;else p.x=WALL.x+WALL.w;
  }
  // chão/teto/paredes
  if(p.y>370){p.y=370;}
  if(p.y<6){p.y=6;}if(p.x<6){p.x=6;}if(p.x>o.W-6){p.x=o.W-6;}
}
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  dt=Math.min(dt,.03);
  const ball=pts[N-1];
  if(!thrown){
    if(ptr.down&&Math.hypot(ptr.x-ball.x,ptr.y-ball.y)<70){
      drag=true;
      ball.x=ptr.x;ball.y=ptr.y;ball.ox=ptr.x;ball.oy=ptr.y;
      collide(ball,true);
      hud.set("st","mirando…");
    }else if(drag){
      drag=false;thrown=true;tries--;hud.set("tt",tries);
      // impulso pelo deslocamento
      H.sfx("tick");hud.set("st","balançando…");
    }
  }else{
    for(let i=1;i<N;i++){
      const p=pts[i];
      const vx=(p.x-p.ox)*0.995,vy=(p.y-p.oy)*0.995;
      p.ox=p.x;p.oy=p.y;
      p.x+=vx;p.y+=vy+1400*dt*dt*(i===N-1?1.6:1);
      collide(p,i===N-1);
    }
    pts[0].x=ANCH.x;pts[0].y=ANCH.y;pts[0].ox=ANCH.x;pts[0].oy=ANCH.y;
    for(let k=0;k<6;k++){
      for(let i=0;i<N-1;i++){
        const A=pts[i],B=pts[i+1];
        const dx=B.x-A.x,dy=B.y-A.y,d=Math.hypot(dx,dy)||1;
        const diff=(d-SEG)/d;
        if(i===0){B.x-=dx*diff;B.y-=dy*diff;}
        else{A.x+=dx*diff*.5;A.y+=dy*diff*.5;B.x-=dx*diff*.5;B.y-=dy*diff*.5;}
        if(i>0)collide(A,false);
        collide(B,i+1===N-1);
      }
      pts[0].x=ANCH.x;pts[0].y=ANCH.y;
    }
    const mv=Math.hypot(ball.x-ball.ox,ball.y-ball.oy);
    if(mv<.4)rest+=dt;else rest=0;
    if(Math.hypot(ball.x-TGT.x,ball.y-TGT.y)<TGT.r+10){
      over=true;H.score(200+tries*60);
      return H.done({win:true,score:200+tries*60+100,title:"Tiro de corrente!",sub:"Alvo tocado com "+tries+" tentativa(s) de sobra."});
    }
    if(rest>1.5){
      if(tries<=0){over=true;
        return H.done({win:false,score:0,title:"Corrente cansada!",sub:"5 tentativas. Enrole no poste para alcançar!"});}
      say("Tentativa "+(5-tries)+"/5 falhou — arraste de novo!");
      hud.set("st","arraste a bola");
      reset();thrown=false;
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,370,o.W,10);
  x.fillStyle="#5b3d20";x.fillRect(WALL.x,WALL.y,WALL.w,WALL.h);
  x.fillStyle="#8A6A2F";x.beginPath();x.arc(POST.x,POST.y,POST.r,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.strokeStyle=H.C.terra;x.lineWidth=2;
  x.beginPath();x.arc(TGT.x,TGT.y,TGT.r,0,7);x.stroke();
  x.font="22px serif";x.fillText("🎯",TGT.x-11,TGT.y+8);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.beginPath();x.moveTo(pts[0].x,pts[0].y);
  pts.forEach(p=>x.lineTo(p.x,p.y));x.stroke();
  x.fillStyle=H.C.terra;
  x.beginPath();x.arc(ball.x,ball.y,11,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(ANCH.x,ANCH.y,6,0,7);x.fill();
  if(!thrown&&!drag&&firstTouch){
    x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
    x.fillText("ARRASTE A BOLA!",ball.x-60,ball.y+30);
  }
});
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
