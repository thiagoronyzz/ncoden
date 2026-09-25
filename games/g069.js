/* NCODE N · 069 Salto Orbital — pule de planeta em planeta */
GREG(69,{
init(root,H){
const GOAL=12;
let over=false,planets,cur,tgt,proj,sc=0,lives=3;
const hud=H.hud(root,[["sl","SALTOS","0/12"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> salta em direção ao <b>planeta apontado</b>. O salto vai reto até onde ele <b>está</b> — tempore a órbita!");
const o=H.cvs(root,500,440),x=o.x;
const cx=o.W/2,cy=o.H/2;
function build(){
  const r=H.rng(21);
  planets=[
    {orb:70,pr:20,a:r()*6,sp:.5},
    {orb:120,pr:17,a:r()*6,sp:-.38},
    {orb:170,pr:15,a:r()*6,sp:.3}
  ];
  cur={p:0};tgt=1;proj=null;sc=0;lives=3;
  hud.set("sl","0/"+GOAL);hud.set("vd",3);hud.set("sc",0);
}
build();
function pos(p){return{x:cx+Math.cos(p.a)*p.orb,y:cy+Math.sin(p.a)*p.orb};}
function leap(){
  if(over||proj)return;
  const a=pos(planets[cur.p]),b=pos(planets[tgt]);
  const d=Math.max(1,Math.hypot(b.x-a.x,b.y-a.y));
  proj={x:a.x,y:a.y,vx:(b.x-a.x)/d*340,vy:(b.y-a.y)/d*340,from:cur.p,to:tgt};
  H.sfx("pop");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")leap();});
H.onTap(o,leap);
H.loop(dt=>{
  if(over)return;
  for(const p of planets)p.a+=p.sp*dt;
  if(proj){
    proj.x+=proj.vx*dt;proj.y+=proj.vy*dt;
    const b=pos(planets[proj.to]);
    if(Math.hypot(proj.x-b.x,proj.y-b.y)<planets[proj.to].pr+10){
      cur.p=proj.to;proj=null;sc++;
      tgt=(tgt+1)%planets.length;
      if(tgt===cur.p)tgt=(tgt+1)%planets.length;
      H.score(sc*25);hud.set("sc",sc*25);hud.set("sl",sc+"/"+GOAL);H.sfx("ok");
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*25+150,title:"Navegador orbital!",sub:GOAL+" saltos entre planetas sem deriva."});}
    }else if(proj.x<-30||proj.x>o.W+30||proj.y<-30||proj.y>o.H+30){
      proj=null;lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc*25,title:"Deriva espacial!",sub:sc+" saltos antes de se perder. Salte mais cedo!"});}
      say("Deriva! Vidas: "+lives+". Mire onde o planeta <b>vai estar</b>.");
    }
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.gold;x.beginPath();x.arc(cx,cy,26,0,7);x.fill();
  planets.forEach((p,i)=>{
    x.strokeStyle="rgba(255,255,255,.18)";x.beginPath();x.arc(cx,cy,p.orb,0,7);x.stroke();
  });
  planets.forEach((p,i)=>{
    const q=pos(p);
    x.fillStyle=i===cur.p?H.C.wasabi:i===tgt?H.C.terra:"#2E6E8A";
    x.beginPath();x.arc(q.x,q.y,p.pr,0,7);x.fill();
    x.strokeStyle="#fff";x.lineWidth=2;x.stroke();
    if(i===cur.p){x.fillStyle="#fff";x.font="14px serif";x.fillText("i:suit",q.x-8,q.y-14);}
    if(i===tgt){x.strokeStyle=H.C.wasabi;x.setLineDash([4,4]);x.beginPath();x.arc(q.x,q.y,p.pr+7,0,7);x.stroke();x.setLineDash([]);}
  });
  if(proj){
    x.strokeStyle=H.C.paper;x.setLineDash([4,4]);
    const a=pos(planets[proj.from]);
    x.beginPath();x.moveTo(a.x,a.y);x.lineTo(proj.x,proj.y);x.stroke();x.setLineDash([]);
    x.fillStyle="#fff";x.beginPath();x.arc(proj.x,proj.y,6,0,7);x.fill();
  }
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
