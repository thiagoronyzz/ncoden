/* NCODE N · 093 Rede de Espiões — vigie sem ser visto */
GREG(93,{
init(root,H){
const N=6,QUOTA=30,MAXT=20;
let over=false,turn=1,intel=0,agents=[],targets=[],guards=[],selA=-1;
const hud=H.hud(root,[["tn","TURNO","1/20"],["in","INTEL","0/30"],["ag","AGENTES",4]]);
const say=H.msg(root,"Clique num agente e depois no destino (até 2 casas). Alvos vigiados (raio 2) geram intel. Guardas capturam agentes vizinhos!");
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
      say("Agente capturado! Restam "+agents.length+".");
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
  guards.forEach(g2=>x.fillText("i:guard",g2.c*s+8,g2.r*s+s-8));
  targets.forEach(t=>x.fillText("i:eye",t.c*s+8,t.r*s+s-8));
  agents.forEach((a,i)=>{
    x.fillStyle=i===selA?"rgba(196,214,69,.4)":"transparent";
    x.fillRect(a.c*s,a.r*s,s,s);
    x.strokeStyle=H.C.ink;x.strokeRect(a.c*s+2,a.r*s+2,s-4,s-4);
    x.fillText("i:detective",a.c*s+8,a.r*s+s-8);
  });
});
H.btn(root,"Passar turno (sem mover)",()=>{if(!over){selA=-1;advance();}},false);
}});
