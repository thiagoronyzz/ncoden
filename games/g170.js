/* NCODE N · 170 Balão de Carga — atravesse os 3 portões */
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
}});
