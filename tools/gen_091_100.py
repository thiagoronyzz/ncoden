#!/usr/bin/env python3
"""Gera games/g091..g100 — ESTRATÉGIA (parte 2)."""
import os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
G = os.path.join(ROOT, "games")
GAMES = {}

# 91 — Rota Comercial
GAMES[91] = r"""/* NCODE N · 091 Rota Comercial — lucro alto, risco alto */
GREG(91,{
init(root,H){
const CITIES=[["A",80,80],["B",250,60],["C",420,90],["D",120,260],["E",300,280],["F",450,250]];
const ROUTES=[
 {a:0,b:1,p:60,r:10,c:20},{a:1,b:2,p:70,r:15,c:25},{a:0,b:3,p:50,r:10,c:20},
 {a:3,b:4,p:65,r:20,c:25},{a:4,b:5,p:75,r:25,c:30},{a:1,b:4,p:110,r:40,c:40},
 {a:2,b:5,p:60,r:10,c:20},{a:0,b:4,p:130,r:50,c:45}
];
let over=false,se=1,cash=120,picked=new Set();
const hud=H.hud(root,[["tm","TEMPORADA","1/4"],["cx","CAIXA",120],["mt","META","$500"]]);
const say=H.msg(root,"Marque rotas (custo total ≤ <b>$100</b>) e feche a temporada. Rotas longas pagam mais — e afundam mais!");
const o=H.cvs(root,500,340),x=o.x;
const list=H.el("div","g-col",null,root);
function paint(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  ROUTES.forEach((rt,i)=>{
    const a=CITIES[rt.a],b=CITIES[rt.b];
    x.strokeStyle=picked.has(i)?H.C.terra:H.C.cement;
    x.lineWidth=picked.has(i)?4:2;
    x.beginPath();x.moveTo(a[1],a[2]);x.lineTo(b[1],b[2]);x.stroke();
  });
  CITIES.forEach(c=>{
    x.fillStyle=H.C.ink;x.beginPath();x.arc(c[1],c[2],14,0,7);x.fill();
    x.fillStyle=H.C.paper;x.font="bold 12px 'Space Mono',monospace";x.fillText(c[0],c[1]-4,c[2]+4);
  });
  list.innerHTML="";
  let cost=0;picked.forEach(i=>cost+=ROUTES[i].c);
  ROUTES.forEach((rt,i)=>{
    const b=H.el("button","g-chip"+(picked.has(i)?" hot":""),
      CITIES[rt.a][0]+"–"+CITIES[rt.b][0]+" · +$"+rt.p+" · "+rt.r+"% risco · $"+rt.c,list);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      if(picked.has(i))picked.delete(i);
      else{
        let c2=0;picked.forEach(k=>c2+=ROUTES[k].c);
        if(c2+rt.c>100){H.sfx("bad");say("Orçamento de $100 estourado!");return;}
        picked.add(i);
      }
      H.sfx("tick");paint();
    });
  });
  H.el("div","g-chip","Custo: <b>$"+cost+"/100</b>",list);
}
function close(){
  if(over||!picked.size){H.sfx("bad");return;}
  let msg="Temporada "+se+": ";
  picked.forEach(i=>{
    const rt=ROUTES[i];
    if(Math.random()*100<rt.r){cash-=30;msg+=CITIES[rt.a][0]+"–"+CITIES[rt.b][0]+" afundou (−$30)! ";}
    else{cash+=rt.p;msg+=CITIES[rt.a][0]+"–"+CITIES[rt.b][0]+" +$"+rt.p+". ";}
  });
  picked=new Set();hud.set("cx",cash);H.sfx("ok");say(msg);
  se++;
  if(se>4){
    over=true;H.score(cash);
    if(cash>=500)return H.done({win:true,score:cash,title:"Magnata do comércio!",sub:"$"+cash+" em 4 temporadas."});
    return H.done({win:false,score:cash,title:"Caravana modesta",sub:"$"+cash+" (meta $500). Arrisque rotas longas!"});
  }
  hud.set("tm",se+"/4");paint();
}
H.btn(root,"⛵ Fechar temporada",close,true);
paint();
}});"""

# 92 — Arena de Gladiadores
GAMES[92] = r"""/* NCODE N · 092 Arena de Gladiadores — draft e torneio */
GREG(92,{
init(root,H){
const T={esp:{e:"🗡",n:"Espada"},arc:{e:"🏹",n:"Arco"},esc:{e:"🛡",n:"Escudo"}};
const BEAT={esp:"arc",arc:"esc",esc:"esp"};
let over=false,team=[],stage=0;
const hud=H.hud(root,[["fs","FASE","DRAFT"],["sc","PONTOS",0]]);
const say=H.msg(root,"🗡 vence 🏹 · 🏹 vence 🛡 · 🛡 vence 🗡. Monte 3 gladiadores e vença quartas, semi e final!");
const box=H.el("div","g-col",null,root);
const log=H.el("div","g-msg","Escolha 3 gladiadores…",root);
let sc=0;
function draftUI(){
  box.innerHTML="";
  const row=H.el("div","g-row",null,box);
  Object.keys(T).forEach(k=>{
    const b=H.el("button","g-btn ghost",T[k].e+" "+T[k].n,row);
    b.addEventListener("click",()=>{
      if(over||team.length>=3)return;
      team.push(k);H.sfx("tick");
      if(team.length>=3){say("Time: "+team.map(t=>T[t].e).join(" ")+" — para a arena!");H.after(600,()=>fight(0));}
      else say("Escolhidos "+team.length+"/3: "+team.map(t=>T[t].e).join(" "));
    });
  });
}
function fight(st){
  stage=st;
  const names=["Quartas","Semifinal","FINAL"];
  hud.set("fs",names[st]);
  const foe=[0,1,2].map(()=>Object.keys(T)[Math.floor(Math.random()*3)]);
  log.innerHTML="<b>"+names[st]+"</b> — você "+team.map(t=>T[t].e).join("")+" × "+foe.map(t=>T[t].e).join("")+" rival";
  let w=0,l=0,msg="";
  for(let i=0;i<3;i++){
    const a=team[i],b=foe[i];
    if(a===b){msg+="Duelo "+(i+1+": ")+T[a].e+" = "+T[b].e+" (empate). ";}
    else if(BEAT[a]===b){w++;msg+="Duelo "+(i+1)+": "+T[a].e+" vence "+T[b].e+"! ";}
    else{l++;msg+="Duelo "+(i+1)+": "+T[a].e+" cai para "+T[b].e+". ";}
  }
  box.innerHTML="";
  H.el("div","g-msg",msg,box);
  const row=H.el("div","g-row",null,box);
  if(w>l){
    sc+=100;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(st>=2){over=true;H.after(800,()=>H.done({win:true,score:sc+150,title:"Campeão da arena!",sub:"3 chaves vencidas no pedra-papel-tesoura de aço."}));return;}
    H.btn(row,"⚔ Avançar para "+names[st+1],()=>fight(st+1),true);
  }else{
    H.sfx("bad");
    H.btn(row,"🔄 Novo draft",()=>{team=[];say("Escolha 3 gladiadores…");draftUI();},true);
    if(st>=2&&w<=l){/* pode tentar de novo */}
    H.el("div","g-msg","Derrota "+w+"×"+l+" (+empates). Redrafte e tente outra combinação!",box);
    if(w<l&&st===0){/* continua */}
  }
  const oldDone=log.innerHTML;
  if(w<=l&&w+l<3){/* empate geral conta como derrota */}
  if(w===l){/* desempate: revanche */}
}
draftUI();
const origFight=fight;
}});"""

# 93 — Rede de Espiões
GAMES[93] = r"""/* NCODE N · 093 Rede de Espiões — vigie sem ser visto */
GREG(93,{
init(root,H){
const N=6,QUOTA=30,MAXT=20;
let over=false,turn=1,intel=0,agents=[],targets=[],guards=[],selA=-1;
const hud=H.hud(root,[["tn","TURNO","1/20"],["in","INTEL","0/30"],["ag","AGENTES",4]]);
const say=H.msg(root,"Clique num agente 🕵️ e depois no destino (até 2 casas). Alvos 👀 vigiados (raio 2) geram intel. Guardas 💂 capturam agentes vizinhos!");
const o=H.cvs(root,420,420),x=o.x;
function build(){
  const r=H.rng(31);
  agents=[{r:0,c:0},{r:0,c:5},{r:5,c:0},{r:5,c:5}];
  targets=[{r:2,c:2},{r:3,c:3},{r:2,c:4}];
  guards=[{r:1,c:3,ph:0},{r:4,c:2,ph:2}];
  turn=1;intel=0;selA=-1;hud.set("tn","1/20");hud.set("in","0/30");hud.set("ag",4);
}
build();
const cell=()=>Math.floor(Math.min(o.W,o.H)/N);
H.onTap(o,(px,py)=>{
  if(over)return;
  const s=cell(),c=Math.floor(px/s),r=Math.floor(py/s);
  if(r<0||r>=N||c<0||c>=N)return;
  const ai=agents.findIndex(a=>a.r===r&&a.c===c);
  if(ai>=0){selA=ai;H.sfx("tick");return;}
  if(selA>=0){
    const a=agents[selA];
    if(Math.abs(a.r-r)+Math.abs(a.c-c)<=2&&Math.abs(a.r-r)+Math.abs(a.c-c)>0){
      a.r=r;a.c=c;selA=-1;H.sfx("tick");advance();return;
    }
  }
  H.sfx("bad");
});
function advance(){
  const r=Math.random;
  targets.forEach(t=>{
    const opts=[[1,0],[-1,0],[0,1],[0,-1],[0,0]];
    const m=opts[Math.floor(r()*opts.length)];
    t.r=H.clamp(t.r+m[0],0,N-1);t.c=H.clamp(t.c+m[1],0,N-1);
  });
  guards.forEach(g2=>{
    g2.ph=(g2.ph+1)%4;
    const d=[[0,1],[1,0],[0,-1],[-1,0]][g2.ph];
    g2.r=H.clamp(g2.r+d[0],0,N-1);g2.c=H.clamp(g2.c+d[1],0,N-1);
  });
  for(let i=agents.length-1;i>=0;i--){
    if(guards.some(g2=>Math.abs(g2.r-agents[i].r)+Math.abs(g2.c-agents[i].c)<=1)){
      agents.splice(i,1);intel=Math.max(0,intel-5);H.sfx("bad");
      say("🚨 Agente capturado! Restam "+agents.length+".");
    }
  }
  if(!agents.length){over=true;return H.done({win:false,score:intel,title:"Rede desmantelada!",sub:"Todos os agentes caíram. Afaste-se dos guardas!"});}
  let gain=0;
  targets.forEach(t=>{
    if(agents.some(a=>Math.abs(a.r-t.r)+Math.abs(a.c-t.c)<=2))gain++;
  });
  intel+=gain;turn++;
  hud.set("in",intel+"/"+QUOTA);hud.set("tn",turn+"/"+MAXT);hud.set("ag",agents.length);
  H.score(intel*5);
  if(intel>=QUOTA){over=true;return H.done({win:true,score:intel*5+100,title:"Dossiê completo!",sub:QUOTA+" de intel sem levantar suspeitas."});}
  if(turn>MAXT){over=true;return H.done({win:false,score:intel*5,title:"Alvos fugiram!",sub:intel+"/"+QUOTA+" de intel. Cubra mais área!"});}
  say("Turno "+turn+": +"+gain+" intel. ("+intel+"/"+QUOTA+")");
}
H.loop(()=>{
  const s=cell();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
  }
  x.font=Math.floor(s*.55)+"px serif";
  guards.forEach(g2=>x.fillText("💂",g2.c*s+8,g2.r*s+s-8));
  targets.forEach(t=>x.fillText("👀",t.c*s+8,t.r*s+s-8));
  agents.forEach((a,i)=>{
    x.fillStyle=i===selA?"rgba(196,214,69,.4)":"transparent";
    x.fillRect(a.c*s,a.r*s,s,s);
    x.strokeStyle=H.C.ink;x.strokeRect(a.c*s+2,a.r*s+2,s-4,s-4);
    x.fillText("🕵️",a.c*s+8,a.r*s+s-8);
  });
});
H.btn(root,"⏭ Passar turno (sem mover)",()=>{if(!over){selA=-1;advance();}},false);
}});"""

# 94 — Represa
GAMES[94] = r"""/* NCODE N · 094 Represa — segure a cheia das fazendas */
GREG(94,{
init(root,H){
let over=false,wave=1,levees=[0,0,0,0,0],bags=6,farms=[1,1,1,1,1],water=[];
const hud=H.hud(root,[["on","ONDA","1/5"],["sc","SACOS",6],["fz","FAZENDAS",5]]);
const say=H.msg(root,"Clique nas colunas para empilhar <b>sacos de areia</b>. Depois solte a onda: onde água > dique, a fazenda alaga!");
const o=H.cvs(root,500,360),x=o.x;
function roll(){
  water=[0,1,2,3,4].map(()=>1+Math.floor(Math.random()*(2+wave)));
}
roll();
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor(px/(o.W/5));
  if(c<0||c>4||bags<=0)return;
  levees[c]++;bags--;hud.set("sc",bags);H.sfx("tick");
});
H.loop(()=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const cw=o.W/5;
  for(let c=0;c<5;c++){
    const bx=c*cw;
    x.fillStyle=farms[c]?H.C.ok:"#8A877C";
    x.fillRect(bx+6,o.H-60,cw-12,50);
    x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
    x.fillText(farms[c]?"🚜 FAZ":"☠",bx+cw/2-24,o.H-28);
    x.fillStyle="#c9b98f";
    for(let i=0;i<levees[c];i++)x.fillRect(bx+10,o.H-70-i*16,cw-20,13);
    x.strokeStyle=H.C.ink;x.strokeRect(bx+10,o.H-70-Math.max(0,levees[c])*16+ (levees[c]?16:0),0,0);
    x.fillStyle="#2E6E8A";x.font="bold 13px 'Space Mono',monospace";
    x.fillText("🌊"+water[c],bx+cw/2-16,30);
    x.fillStyle=H.C.ink;x.fillText("dique "+levees[c],bx+cw/2-24,48);
  }
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("clique na coluna = +1 saco",12,o.H-6);
});
H.btn(root,"🌊 Soltar a onda!",()=>{
  if(over)return;
  let lost=0;
  for(let c=0;c<5;c++){
    if(water[c]>levees[c]&&farms[c]){farms[c]=0;lost++;}
  }
  const left=farms.filter(Boolean).length;
  hud.set("fz",left);H.sfx(lost?"bad":"ok");
  if(left<4){over=true;return H.done({win:false,score:wave*20,title:"Vale inundado!",sub:"Só "+left+" fazendas restaram na onda "+wave+"."});}
  wave++;
  if(wave>5){over=true;return H.done({win:true,score:left*40+60,title:"Vale protegido!",sub:left+"/5 fazendas salvas das 5 cheias."});}
  bags+=3;hud.set("sc",bags);hud.set("on",wave+"/5");
  roll();
  say(lost?"⚠️ "+lost+" fazenda(s) alagada(s)! +3 sacos para a onda "+wave+".":"✅ Ninguém alagou! +3 sacos para a onda "+wave+".");
},true);
}});"""

# 95 — Campo Minado Tático
GAMES[95] = r"""/* NCODE N · 095 Campo Minado Tático — minas na rota dos tanques */
GREG(95,{
init(root,H){
const SC=[
 {n:8,mines:4,tanks:[
   {path:[[1,0],[1,1],[1,2],[1,3],[1,4],[1,5],[1,6],[1,7]]},
   {path:[[4,0],[4,1],[4,2],[4,3],[4,4],[4,5],[4,6],[4,7]]},
   {path:[[7,3],[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]]}
 ]},
 {n:8,mines:6,tanks:[
   {path:[[0,0],[1,0],[2,0],[3,0],[4,0],[5,0],[6,0],[7,0]]},
   {path:[[0,7],[1,7],[2,7],[3,7],[4,7],[5,7],[6,7],[7,7]]},
   {path:[[7,1],[7,2],[7,3],[7,4],[7,5],[7,6]]},
   {path:[[2,2],[2,3],[2,4],[2,5],[2,6],[2,7]]}
 ]}
];
let sc2=0,over=false,mines=new Set(),running=false;
const hud=H.hud(root,[["cn","CENÁRIO","1/2"],["mn","MINAS","0/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique para plantar minas (números = turno da passagem). <b>Iniciar</b> move os tanques. Destrua todos antes da base!");
const o=H.cvs(root,440,440),x=o.x;
let sc=0;
function key(r,c){return r+","+c;}
function build(){
  mines=new Set();running=false;
  hud.set("cn",(sc2+1)+"/2");hud.set("mn","0/"+SC[sc2].mines);
  say("Cenário "+(sc2+1)+": "+SC[sc2].tanks.length+" tanques, "+SC[sc2].mines+" minas.");
}
build();
const cell=()=>Math.floor(Math.min(o.W,o.H)/SC[sc2].n);
H.onTap(o,(px,py)=>{
  if(over||running)return;
  const s=cell(),c=Math.floor(px/s),r=Math.floor(py/s);
  const k=key(r,c),S=SC[sc2];
  const isTerm=S.tanks.some(t=>{const p=t.path;return(p[0][0]===r&&p[0][1]===c)||(p[p.length-1][0]===r&&p[p.length-1][1]===c);});
  if(isTerm){H.sfx("bad");say("Não dá para minar início/fim da rota!");return;}
  if(mines.has(k)){mines.delete(k);}
  else{
    if(mines.size>=S.mines){H.sfx("bad");say("Sem minas! Clique numa plantada para remover.");return;}
    mines.add(k);
  }
  H.sfx("tick");hud.set("mn",mines.size+"/"+S.mines);
});
function simulate(){
  if(over||running)return;
  running=true;
  const S=SC[sc2];
  const alive=S.tanks.map(()=>true);
  const mm=new Set(mines);
  let t=0;
  say("Tanques em movimento…");
  const iv=H.every(450,()=>{
    let boom=false;
    S.tanks.forEach((tk,i)=>{
      if(!alive[i]||t>=tk.path.length)return;
      const[r,c]=tk.path[t];
      if(mm.has(key(r,c))){mm.delete(key(r,c));alive[i]=false;boom=true;H.sfx("pop");}
    });
    drawSim(t,alive);
    t++;
    const maxL=Math.max(...S.tanks.map(tk=>tk.path.length));
    if(t>=maxL||!alive.some(Boolean)){
      clearInterval(iv);
      if(!alive.some(Boolean)){
        sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        sc2++;
        if(sc2>=SC.length){over=true;return H.done({win:true,score:sc+100,title:"Coluna aniquilada!",sub:"Todos os tanques destruídos nos 2 cenários."});}
        say("Cenário limpo! Próximo: mais tanques.");H.after(700,build);
      }else{
        H.sfx("bad");say("❌ "+alive.filter(Boolean).length+" tanque(s) chegou(aram) à base! Reposicione as minas.");
        running=false;
      }
    }
  });
}
function drawSim(t,alive){
  const S=SC[sc2],n=S.n,s=cell();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
  }
  S.tanks.forEach((tk,i)=>{
    tk.path.forEach((p,j)=>{
      if(j>t)return;
      x.fillStyle="rgba(217,78,52,.12)";x.fillRect(p[1]*s+1,p[0]*s+1,s-2,s-2);
    });
    if(alive[i]&&t<tk.path.length){
      const[r,c]=tk.path[t];
      x.font=Math.floor(s*.6)+"px serif";x.fillText("🛡️",c*s+6,r*s+s-8);
    }else if(!alive[i]){
      x.font="18px serif";x.fillText("💥",10+i*30,o.H-10);
    }
  });
  x.font="14px serif";
  mines.forEach(k=>{
    const[r,c]=k.split(",").map(Number);
    x.fillText("⚫",c*s+10,r*s+s-10);
  });
}
H.loop(()=>{
  if(running)return;
  const S=SC[sc2],n=S.n,s=cell();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<n;r++)for(let c=0;c<n;c++){
    x.fillStyle=H.C.card;x.fillRect(c*s+1,r*s+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(c*s+1,r*s+1,s-2,s-2);
  }
  const cols=["rgba(217,78,52,.25)","rgba(46,110,138,.25)","rgba(62,124,79,.25)","rgba(232,163,61,.3)"];
  S.tanks.forEach((tk,i)=>{
    tk.path.forEach((p,j)=>{
      x.fillStyle=cols[i%4];x.fillRect(p[1]*s+1,p[0]*s+1,s-2,s-2);
      x.fillStyle=H.C.ink;x.font="10px 'Space Mono',monospace";
      x.fillText(j,p[1]*s+5,p[0]*s+14);
    });
    const e=tk.path[tk.path.length-1];
    x.font="16px serif";x.fillText("🏁",e[1]*s+8,e[0]*s+s-8);
  });
  x.font="16px serif";
  mines.forEach(k=>{
    const[r,c]=k.split(",").map(Number);
    x.fillText("💣",c*s+8,r*s+s-8);
  });
});
H.btn(root,"💥 Iniciar simulação",simulate,true);
}});"""

# 96 — Farol
GAMES[96] = r"""/* NCODE N · 096 Farol — ilumine todas as rotas */
GREG(96,{
init(root,H){
const N=7,R=2;
const SC=[
 {lanes:[[1,0],[1,1],[1,2],[3,2],[3,3],[3,4],[5,4],[5,5],[5,6]],k:3},
 {lanes:[[0,0],[0,1],[1,0],[1,1],[3,2],[3,3],[4,5],[4,6],[6,5],[6,6]],k:3}
];
let sc2=0,over=false,put=[];
const hud=H.hud(root,[["cn","CENÁRIO","1/2"],["fr","FARÓIS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no mar para erguer faróis (raio 2). Toda <b>rota azul</b> precisa de luz!");
const o=H.cvs(root,420,420),x=o.x;
let sc=0;
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
const key=(r,c)=>r+","+c;
H.onTap(o,(px,py)=>{
  if(over)return;
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  if(r<0||r>=N||c<0||c>=N)return;
  const i=put.findIndex(p=>p[0]===r&&p[1]===c);
  if(i>=0){put.splice(i,1);}
  else{
    if(put.length>=SC[sc2].k){H.sfx("bad");say("Só "+SC[sc2].k+" faróis! Clique num erguido para remover.");return;}
    put.push([r,c]);
  }
  H.sfx("tick");hud.set("fr",put.length+"/"+SC[sc2].k);
});
H.loop(()=>{
  const ss=s(),S=SC[sc2];
  const lset=new Set(S.lanes.map(l=>key(l[0],l[1])));
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const lit=put.some(p=>Math.abs(p[0]-r)+Math.abs(p[1]-c)<=R);
    x.fillStyle=lset.has(key(r,c))?(lit?"#7fb3d5":"#2E6E8A"):(lit?"#2c3e4d":"#1d2b36");
    x.fillRect(c*ss+1,r*ss+1,ss-2,ss-2);
  }
  x.font=Math.floor(ss*.55)+"px serif";
  put.forEach(p=>x.fillText("🗼",p[1]*ss+6,p[0]*ss+ss-6));
  const unlit=S.lanes.filter(l=>!put.some(p=>Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<=R)).length;
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("rotas no escuro: "+unlit,12,20);
});
H.btn(root,"💡 Verificar iluminação",()=>{
  if(over)return;
  const S=SC[sc2];
  const unlit=S.lanes.filter(l=>!put.some(p=>Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<=R));
  if(!unlit.length){
    sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    sc2++;
    if(sc2>=SC.length){over=true;return H.done({win:true,score:sc+100,title:"Costa iluminada!",sub:"Todas as rotas dos 2 cenários sob luz."});}
    put=[];hud.set("cn","2/2");hud.set("fr","0/3");
    say("Cenário 2: um farol terá de cobrir dois grupos! (raio 2 manhattan)");
  }else{H.sfx("bad");say("Ainda há <b>"+unlit.length+"</b> trechos no escuro!");}
},true);
}});"""

# 97 — Pastor de Ovelhas
GAMES[97] = r"""/* NCODE N · 097 Pastor de Ovelhas — recolha antes dos lobos */
GREG(97,{
init(root,H){
const N=8,PEN=[0,7];
let over=false,turn=1,sheep=[],dog={},wolves=[],fences=new Set(),saved=0,fleft=6;
const hud=H.hud(root,[["tn","TURNO","1/20"],["sv","SALVAS","0/4"],["lb","LOBOS",2]]);
const say=H.msg(root,"Clique num destino (até 2 casas) para o 🐕. Ovelhas 🐑 fogem dele — empurre-as ao curral 🏠! 6 cercas: modo <b>cerca</b>.");
const o=H.cvs(root,440,440),x=o.x;
let mode="dog";
function build(){
  const r=H.rng(12);
  sheep=[];for(let i=0;i<4;i++)sheep.push({r:4+Math.floor(r()*3),c:1+Math.floor(r()*4)});
  dog={r:7,c:0};wolves=[{r:0,c:0},{r:7,c:7}];fences=new Set();saved=0;turn=1;fleft=6;
  hud.set("tn","1/20");hud.set("sv","0/4");
}
build();
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
const key=(r,c)=>r+","+c;
H.onTap(o,(px,py)=>{
  if(over)return;
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  if(r<0||r>=N||c<0||c>=N)return;
  if(mode==="fence"){
    if(fences.has(key(r,c))||(r===PEN[0]&&c===PEN[1]))return;
    if(fleft<=0){H.sfx("bad");return;}
    if(sheep.some(q=>q.r===r&&q.c===c)||wolves.some(q=>q.r===r&&q.c===c))return;
    fences.add(key(r,c));fleft--;H.sfx("tick");return;
  }
  if(Math.abs(r-dog.r)+Math.abs(c-dog.c)>2||fences.has(key(r,c))){H.sfx("bad");return;}
  dog={r,c};H.sfx("tick");advance();
});
function stepAway(e,from){
  const opts=[[1,0],[-1,0],[0,1],[0,-1]];
  let best=null,bd=-1;
  for(const m of opts){
    const nr=e.r+m[0],nc=e.c+m[1];
    if(nr<0||nr>=N||nc<0||nc>=N||fences.has(key(nr,nc)))continue;
    const d=Math.abs(nr-from.r)+Math.abs(nc-from.c);
    if(d>bd){bd=d;best={r:nr,c:nc};}
  }
  return best;
}
function stepTo(e,to){
  const opts=[[1,0],[-1,0],[0,1],[0,-1]];
  let best=null,bd=1e9;
  for(const m of opts){
    const nr=e.r+m[0],nc=e.c+m[1];
    if(nr<0||nr>=N||nc<0||nc>=N||fences.has(key(nr,nc)))continue;
    const d=Math.abs(nr-to.r)+Math.abs(nc-to.c);
    if(d<bd){bd=d;best={r:nr,c:nc};}
  }
  return best;
}
function advance(){
  for(const q of sheep){
    const nearW=wolves.map(w=>({w,d:Math.abs(w.r-q.r)+Math.abs(w.c-q.c)})).sort((a,b)=>a.d-b.d)[0];
    const dd=Math.abs(dog.r-q.r)+Math.abs(dog.c-q.c);
    let mv=null;
    if(nearW&&nearW.d<=4)mv=stepAway(q,nearW.w);
    else if(dd<=3)mv=stepAway(q,dog);
    else if(Math.random()<.5){const m=[[1,0],[-1,0],[0,1],[0,-1]][Math.floor(Math.random()*4)];
      const nr=q.r+m[0],nc=q.c+m[1];
      if(nr>=0&&nr<N&&nc>=0&&nc<N&&!fences.has(key(nr,nc)))mv={r:nr,c:nc};}
    if(mv){q.r=mv.r;q.c=mv.c;}
  }
  for(const w of wolves){
    if(!sheep.length)break;
    const prey=sheep.map(q=>({q,d:Math.abs(q.r-w.r)+Math.abs(q.c-w.c)})).sort((a,b)=>a.d-b.d)[0].q;
    const mv=stepTo(w,prey);
    if(mv){w.r=mv.r;w.c=mv.c;}
  }
  for(let i=sheep.length-1;i>=0;i--){
    if(sheep[i].r===PEN[0]&&sheep[i].c===PEN[1]){sheep.splice(i,1);saved++;hud.set("sv",saved+"/4");H.sfx("ok");}
    else if(wolves.some(w=>Math.abs(w.r-sheep[i].r)+Math.abs(w.c-sheep[i].c)<=1)){
      over=true;H.sfx("lose");
      return H.done({win:false,score:saved*50,title:"Lobo no rebanho!",sub:saved+" salvas. Cerque com as 6 cercas!"});
    }
  }
  turn++;hud.set("tn",turn+"/20");
  if(!sheep.length){over=true;H.score(300);return H.done({win:true,score:300,title:"Rebanho a salvo!",sub:"4 ovelhas no curral no turno "+turn+"."});}
  if(turn>20){over=true;return H.done({win:false,score:saved*50,title:"Noite chegou!",sub:"Só "+saved+"/4 salvas. Empurre com o cão!"});}
}
H.loop(()=>{
  const ss=s();
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){x.strokeStyle="rgba(0,0,0,.12)";x.strokeRect(c*ss,r*ss,ss,ss);}
  x.font=Math.floor(ss*.6)+"px serif";
  fences.forEach(k=>{const[r,c]=k.split(",").map(Number);x.fillText("🪵",c*ss+4,r*ss+ss-4);});
  x.fillText("🏠",PEN[1]*ss+4,PEN[0]*ss+ss-4);
  sheep.forEach(q=>x.fillText("🐑",q.c*ss+4,q.r*ss+ss-4));
  wolves.forEach(w=>x.fillText("🐺",w.c*ss+4,w.r*ss+ss-4));
  x.fillText("🐕",dog.c*ss+4,dog.r*ss+ss-4);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("cercas: "+fleft+" · modo: "+mode,12,18);
});
const row=H.el("div","g-row",null,root);
H.btn(row,"🐕 Mover cão",()=>{mode="dog";H.sfx("tick");},false);
H.btn(row,"🪵 Plantar cerca",()=>{mode="fence";H.sfx("tick");},false);
}});"""

# 98 — Semáforo Inteligente
GAMES[98] = r"""/* NCODE N · 098 Semáforo Inteligente — 25 carros sem batida */
GREG(98,{
init(root,H){
let over=false,ns=true,cars=[],passed=0,spawn=0,t=0;
const hud=H.hud(root,[["ps","ATRAVESSARAM","0/25"],["fl","FLUXO","NS"],["sc","PONTOS",0]]);
const say=H.msg(root,"Alterne o verde <b>NS ↔ LO</b>. Carros parados +12s <b>furam o vermelho</b> — e batem! Passe 25.");
const o=H.cvs(root,460,400),x=o.x;
const cx=o.W/2,cy=o.H/2;
function spawnCar(){
  const d=Math.floor(Math.random()*4);
  const lane=d===0?{x:cx-14,y:-20,vx:0,vy:90,ax:"ns"}:d===1?{x:cx+14,y:o.H+20,vx:0,vy:-90,ax:"ns"}:d===2?{x:-20,y:cy-14,vx:90,vy:0,ax:"ew"}:{x:o.W+20,y:cy+14,vx:-90,vy:0,ax:"ew"};
  if(cars.some(c=>Math.hypot(c.x-lane.x,c.y-lane.y)<44))return;
  cars.push(Object.assign(lane,{wait:0,run:false,col:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F"][d]}));
}
function toggle(){if(over)return;ns=!ns;hud.set("fl",ns?"NS":"LO");H.sfx("tick");}
H.btn(root,"🚦 Alternar verde",toggle,true);
H.onTap(o,(px,py)=>{if(Math.hypot(px-cx,py-cy)<60)toggle();});
H.loop(dt=>{
  if(over)return;
  t+=dt;spawn-=dt;
  if(spawn<=0){spawn=.9;spawnCar();}
  const green=ax=>ns?ax==="ns":ax==="ew";
  for(const c of cars){
    const nearStop=c.ax==="ns"?Math.abs(c.y-cy)<70:Math.abs(c.x-cx)<70;
    const inZone=c.ax==="ns"?Math.abs(c.y-cy)<34:Math.abs(c.x-cx)<34;
    c.inZone=inZone;
    if(!green(c.ax)&&nearStop&&!inZone&&!c.run){
      c.wait+=dt;
      if(c.wait>12){c.run=true;say("🚨 Um carro furou o vermelho!");}
    }else{
      c.wait=0;
      const ahead=cars.some(k=>k!==c&&k.ax===c.ax&&((c.vy>0&&k.y>c.y&&k.y-c.y<36)||(c.vy<0&&k.y<c.y&&c.y-k.y<36)||(c.vx>0&&k.x>c.x&&k.x-c.x<36)||(c.vx<0&&k.x<c.x&&c.x-k.x<36)));
      if(!ahead||inZone||c.run){c.x+=c.vx*dt;c.y+=c.vy*dt;}
    }
  }
  const z=cars.filter(c=>c.inZone);
  if(z.some(c=>c.ax==="ns")&&z.some(c=>c.ax==="ew")){
    const runner=z.find(c=>c.run);
    if(runner||Math.random()<dt*0){over=true;H.sfx("lose");
      return H.done({win:false,score:passed*10,title:"Batida no cruzamento!",sub:passed+" carros antes da colisão. Não segure um lado!"});}
  }
  for(let i=cars.length-1;i>=0;i--){
    const c=cars[i];
    if(c.x<-30||c.x>o.W+30||c.y<-30||c.y>o.H+30){
      cars.splice(i,1);
      if(c.run||true){passed++;H.score(passed*10);hud.set("sc",passed*10);hud.set("ps",passed+"/25");H.beep(500,.04);}
      if(passed>=25){over=true;return H.done({win:true,score:passed*10+100,title:"Trânsito fluindo!",sub:"25 carros sem uma batida."});}
    }
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#4A4A44";
  x.fillRect(cx-30,0,60,o.H);x.fillRect(0,cy-30,o.W,60);
  x.strokeStyle="#fff";x.setLineDash([8,8]);
  x.beginPath();x.moveTo(cx,0);x.lineTo(cx,cy-34);x.moveTo(cx,cy+34);x.lineTo(cx,o.H);x.stroke();
  x.beginPath();x.moveTo(0,cy);x.lineTo(cx-34,cy);x.moveTo(cx+34,cy);x.lineTo(o.W,cy);x.stroke();
  x.setLineDash([]);
  x.fillStyle=H.C.ink;x.fillRect(cx+34,cy-58,22,44);
  x.fillStyle=ns?H.C.ok:"#3a3a36";x.beginPath();x.arc(cx+45,cy-46,7,0,7);x.fill();
  x.fillStyle=ns?"#3a3a36":H.C.terra;x.beginPath();x.arc(cx+45,cy-26,7,0,7);x.fill();
  for(const c of cars){
    x.save();x.translate(c.x,c.y);
    if(c.vx!==0)x.rotate(Math.PI/2);
    x.fillStyle=c.run?"#ff0":c.col;x.fillRect(-9,-16,18,32);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-9,-16,18,32);
    x.restore();
    if(c.wait>8){x.fillStyle=H.C.terra;x.font="bold 11px 'Space Mono',monospace";x.fillText("!",c.x-3,c.y-20);}
  }
});
}});"""

# 99 — Médico da Peste
GAMES[99] = r"""/* NCODE N · 099 Médico da Peste — quarentene e salve 60% */
GREG(99,{
init(root,H){
const N=6,TURNS=12;
let over=false,turn=1,st=[],qt={},qi=0;
const hud=H.hud(root,[["tn","TURNO","1/12"],["sd","SAUDÁVEIS","94%"],["qr","QUARENTENAS",2]]);
const say=H.msg(root,"Clique em até <b>2 distritos sãos</b> por turno para isolar (3 turnos). Doentes curam em 3 turnos. Salve 60%!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(6,1fr)";
board.style.width="min(100%,340px)";
function build(){
  st=new Array(N*N).fill(0);qi=2;qt={};
  [7,20,28].forEach(i=>st[i]=1);
  turn=1;paint();
}
function paint(){
  const healthy=st.filter(v=>v===0||v===3).length;
  hud.set("sd",Math.round(healthy/36*100)+"%");
  hud.set("tn",turn+"/"+TURNS);hud.set("qr",qi);
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="18px";
    if(qt[i]){d.textContent="⛔";d.classList.add("sel");}
    else if(st[i]===1){d.textContent="🤒";d.classList.add("bad");}
    else if(st[i]===3){d.textContent="💚";}
    else{d.textContent="🏠";(function(idx){d.addEventListener("click",()=>quar(idx));})(i);}
  }
}
function quar(i){
  if(over||qi<=0||st[i]!==0||qt[i])return;
  qt[i]=3;qi--;H.sfx("tick");paint();
}
function next(){
  if(over)return;
  const add=[];
  st.forEach((v,i)=>{
    if(v!==1)return;
    const r=(i/N)|0,c=i%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(q=>{
      const nr=r+q[0],nc=c+q[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(st[k]===0&&!qt[k]&&Math.random()<.5)add.push(k);
    });
  });
  add.forEach(k=>st[k]=1);
  st.forEach((v,i)=>{if(v===2)st[i]=3;});
  const sick=[];
  st.forEach((v,i)=>{if(v===1)sick.push(i);});
  sick.forEach(i=>{st[i]=st[i+"_t"]=(st[i+"_t"]||0)+1>=3?2:1;});
  Object.keys(qt).forEach(k=>{qt[k]--;if(qt[k]<=0)delete qt[k];});
  turn++;qi=2;paint();
  const healthy=st.filter(v=>v===0||v===3).length;
  if(turn>TURNS){
    over=true;H.score(healthy*5);
    if(healthy>=22)return H.done({win:true,score:healthy*5,title:"Epidemia contida!",sub:healthy+"/36 distritos sãos após 12 turnos."});
    return H.done({win:false,score:healthy*5,title:"Peste venceu!",sub:"Só "+healthy+"/36 sãos. Isole os vizinhos dos focos!"});
  }
  say("Turno "+turn+": "+add.length+" novos casos. Saudáveis: "+healthy+"/36.");
}
H.btn(root,"⏭ Próximo turno",next,true);
build();
}});"""

# 100 — Incêndio Florestal
GAMES[100] = r"""/* NCODE N · 100 Incêndio Florestal — água e aceiros */
GREG(100,{
init(root,H){
const N=8,TURNS=10;
const WIND=[[0,1,"L→"],["Vento E →",""],[1,0,"↓"],[0,-1,"←"],[-1,0,"↑"]];
let over=false,turn=1,g=[],acts=2,wind=0;
const hud=H.hud(root,[["tn","TURNO","1/10"],["vn","VENTO","E"],["ac","AÇÕES",2]]);
const say=H.msg(root,"<b>Árvore pegando fogo 🔥</b>: clique para apagar. <b>Árvore verde</b>: clique para cortar aceiro. 2 ações/turno. Salve 70%!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(8,1fr)";
board.style.width="min(100%,360px)";
function build(){
  g=new Array(N*N).fill(1);
  [27,28,35].forEach(i=>g[i]=2);
  turn=1;acts=2;wind=Math.floor(Math.random()*4);
  paint();
}
const WL=["E →","S ↓","O ←","N ↑"];
function paint(){
  const saved=g.filter(v=>v===1).length;
  hud.set("tn",turn+"/"+TURNS);hud.set("vn",WL[wind]);hud.set("ac",acts);
  board.innerHTML="";
  for(let i=0;i<N*N;i++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="17px";
    if(g[i]===1)d.textContent="🌲";
    else if(g[i]===2){d.textContent="🔥";d.classList.add("bad");}
    else if(g[i]===3){d.textContent="⬛";d.disabled=true;}
    else{d.textContent="🟫";d.disabled=true;}
    if(g[i]===1||g[i]===2){(function(idx){d.addEventListener("click",()=>act(idx));})(i);}
  }
}
function act(i){
  if(over||acts<=0)return;
  if(g[i]===2){g[i]=4;acts--;H.sfx("ok");say("💧 Fogo apagado!");}
  else if(g[i]===1){g[i]=4;acts--;H.sfx("tick");say("🪓 Aceiro aberto!");}
  else return;
  paint();
}
function next(){
  if(over)return;
  const DV=[[0,1],[1,0],[0,-1],[-1,0]][wind];
  const ignite=new Set();
  g.forEach((v,i)=>{
    if(v!==2)return;
    const r=(i/N)|0,c=i%N;
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(q=>{
      const nr=r+q[0],nc=c+q[1];
      if(nr<0||nr>=N||nc<0||nc>=N)return;
      const k=nr*N+nc;
      if(g[k]!==1)return;
      const p=(q[0]===DV[0]&&q[1]===DV[1])?0.85:0.3;
      if(Math.random()<p)ignite.add(k);
    });
  });
  g.forEach((v,i)=>{if(v===2)g[i]=3;});
  ignite.forEach(k=>g[k]=2);
  wind=Math.floor(Math.random()*4);
  turn++;acts=2;paint();
  const saved=g.filter(v=>v===1).length;
  if(turn>TURNS){
    over=true;H.score(saved*3);
    if(saved>=45)return H.done({win:true,score:saved*3+100,title:"Floresta salva!",sub:saved+"/64 árvores de pé após 10 turnos."});
    return H.done({win:false,score:saved*3,title:"Cinzas…",sub:"Só "+saved+"/64 árvores. Corte aceiros contra o vento!"});
  }
  say("Turno "+turn+": "+ignite.size+" novos focos! Vento "+WL[wind]+".");
}
H.btn(root,"⏭ Próximo turno",next,true);
build();
}});"""

for i, code in GAMES.items():
    fn = os.path.join(G, f"g{i:03d}.js")
    with open(fn, "w", encoding="utf-8") as f:
        f.write(code + "\n")
    print("wrote", fn, len(code), "bytes")
