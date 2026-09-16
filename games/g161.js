/* NCODE N · 161 Castelo de Areia — 5 torres antes da maré */
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
}});
