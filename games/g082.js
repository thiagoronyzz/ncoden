/* NCODE N · 082 Torres no Caminho — segure as 8 ondas */
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
  spawnT=0;say("Onda "+wave+": "+n+" criaturas a caminho!");
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
      say("Vazou uma! Vidas: "+lives);continue;
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
  x.fillText("i:castle",o.W-34,336);
});
const row=H.el("div","g-row",null,root);
const b1=H.btn(row,"Arqueira $50",()=>{selT="arch";H.sfx("tick");},false);
const b2=H.btn(row,"Canhão $100",()=>{selT="can";H.sfx("tick");},false);
H.btn(row,"Iniciar onda",startWave,true);
}});
