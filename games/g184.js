/* NCODE N · 184 Travessia de Tábuas — pregue e atravesse! */
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
    const b=H.el("button","g-chip"+(sel===i?" hot":""),""+p.L+"cm",box);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");paint();});
  });
  if(!planks.length)H.el("div","g-chip","sem tábuas…",box);
}
paint();
H.btn(root,"ATRAVESSAR!",()=>{
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
      say("A ventania levou uma tábua solta! PREGUE tudo.");
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
  if(walk){x.font="26px serif";x.fillText("i:person",walk.x-13,222);}
  else{x.font="26px serif";x.fillText("i:person",pillars[0].x-40,300);}
  if(wind){x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";x.fillText("i:smokei:smokei:smoke",200,40);}
});
}});
