/* NCODE N · 013 Ponte Mínima — tábuas contadas sobre o abismo */
GREG(13,{
init(root,H){
const LV=[
 {anchors:[[60,250],[60,150],[460,250],[460,150],[260,290]],max:250,k:3},
 {anchors:[[50,260],[50,160],[470,260],[470,160],[200,300],[330,300]],max:200,k:4},
 {anchors:[[50,270],[50,150],[470,270],[470,150],[170,310],[260,250],[355,310]],max:170,k:5}
];
let lv=0,over=false,testing=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["tb","TÁBUAS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique em <b>duas âncoras</b> para estender uma tábua (alcance limitado). Depois <b>Teste a travessia</b>.");
const o=H.cvs(root,520,340),x=o.x;
let planks=[],sel=-1,walker=null;
function reset(){
  planks=[];sel=-1;walker=null;testing=false;
  hud.set("nv",lv+1);hud.set("tb","0/"+LV[lv].k);
}
H.onTap(o,(px,py)=>{
  if(over||testing)return;
  const A=LV[lv].anchors;
  let best=-1,bd=1e9;
  A.forEach((a,i)=>{const d=Math.hypot(a[0]-px,a[1]-py);if(d<26&&d<bd){bd=d;best=i;}});
  if(best<0)return;
  if(sel<0){sel=best;H.sfx("tick");return;}
  if(sel===best){sel=-1;return;}
  if(planks.some(p=>(p[0]===sel&&p[1]===best)||(p[0]===best&&p[1]===sel))){sel=-1;return;}
  const d=Math.hypot(A[sel][0]-A[best][0],A[sel][1]-A[best][1]);
  if(d>LV[lv].max){H.sfx("bad");say("Vão <b>longo demais</b> para uma tábua! Use apoios intermediários.");sel=-1;return;}
  if(planks.length>=LV[lv].k){H.sfx("bad");say("Acabaram as tábuas! Clique numa tábua para removê-la.");sel=-1;return;}
  planks.push([sel,best]);hud.set("tb",planks.length+"/"+LV[lv].k);H.sfx("ok");sel=-1;
});
function pathExists(){
  const A=LV[lv].anchors;
  const adj=A.map(()=>[]);
  planks.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const left=A.map((a,i)=>a[0]<150?i:-1).filter(i=>i>=0);
  const seen=new Set(left),q=left.slice();
  while(q.length){const i=q.pop();
    if(A[i][0]>370)return true;
    for(const j of adj[i])if(!seen.has(j)){seen.add(j);q.push(j);}
  }
  return false;
}
function findPath(){
  const A=LV[lv].anchors;
  const adj=A.map(()=>[]);
  planks.forEach(([a,b])=>{adj[a].push(b);adj[b].push(a);});
  const start=A.findIndex(a=>a[0]<150);
  const prev=new Array(A.length).fill(-1),seen=new Set([start]),q=[start];
  while(q.length){const i=q.shift();
    if(A[i][0]>370){const p=[i];let c=i;while(prev[c]>=0){c=prev[c];p.unshift(c);}return p;}
    for(const j of adj[i])if(!seen.has(j)){seen.add(j);prev[j]=i;q.push(j);}
  }
  return null;
}
H.loop(dt=>{
  const A=LV[lv].anchors;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#9db7c4";x.fillRect(120,230,280,110);
  x.fillStyle=H.C.ink;x.fillRect(0,180,120,160);x.fillRect(400,180,120,160);
  x.fillStyle=H.C.ok;x.fillRect(0,170,120,12);x.fillRect(400,170,120,12);
  x.fillStyle=H.C.gold;
  A.forEach((a,i)=>{if(a[0]>150&&a[0]<370){x.fillRect(a[0]-8,a[1],16,110);}});
  x.strokeStyle=H.C.terra;x.lineWidth=7;
  planks.forEach(([a,b])=>{x.beginPath();x.moveTo(A[a][0],A[a][1]);x.lineTo(A[b][0],A[b][1]);x.stroke();});
  A.forEach((a,i)=>{
    x.fillStyle=i===sel?H.C.wasabi:H.C.ink;
    x.beginPath();x.arc(a[0],a[1],10,0,7);x.fill();
    x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
  });
  if(walker){
    walker.t+=dt*.5;
    const p=walker.path;
    const seg=Math.min(p.length-2,Math.floor(walker.t));
    const f=walker.t-seg;
    const a=A[p[seg]],b=A[p[seg+1]];
    const wx=a[0]+(b[0]-a[0])*f,wy=a[1]+(b[1]-a[1])*f-14;
    x.font="22px serif";x.fillText("i:walk",wx-11,wy+8);
    if(walker.t>=p.length-1){walker=null;celebrate();}
  }
});
function celebrate(){
  testing=false;H.sfx("ok");
  const sc=(lv+1)*150+(LV[lv].k-planks.length)*30;H.score(sc);hud.set("sc",sc);
  if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Travessia garantida!",sub:"3 pontes erguidas com o mínimo de tábuas."});}
  lv++;say("Nível "+(lv+1)+": vão maior, tábuas mais curtas.");reset();
}
const row=H.el("div","g-row",null,root);
H.btn(row,"Testar travessia",()=>{
  if(over||testing)return;
  const p=findPath();
  if(!p){H.sfx("bad");say("Sem caminho contínuo da <b>margem esquerda</b> à direita.");return;}
  testing=true;walker={path:p,t:0};H.sfx("pop");
},true);
H.btn(row,"↺ Desfazer tábua",()=>{if(!over&&!testing){planks.pop();hud.set("tb",planks.length+"/"+LV[lv].k);}},false);
reset();
}});
