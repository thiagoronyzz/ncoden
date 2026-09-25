/* NCODE N · 024 Trem Desviado — acione os desvios, entregue os trens */
GREG(24,{
init(root,H){
const LV=[
 {sw:[{x:260,y:180,br:[[[260,180],[260,90],[490,90]],[[260,180],[260,270],[490,270]]],dir:0}],
  st:[{x:490,y:90,c:"red",n:"VERMELHA"},{x:490,y:270,c:"blue",n:"AZUL"}],
  pre:[[30,180],[260,180]],trains:["red","blue"]},
 {sw:[{x:200,y:180,br:[[[200,180],[200,90],[490,90]],[[200,180],[200,270],[330,270]]],dir:0},
      {x:330,y:270,br:[[[330,270],[330,200],[490,200]],[[330,270],[490,270]]],dir:1}],
  st:[{x:490,y:90,c:"red",n:"VERMELHA"},{x:490,y:200,c:"green",n:"VERDE"},{x:490,y:270,c:"blue",n:"AZUL"}],
  pre:[[30,180],[200,180]],trains:["red","green","blue"]},
 {sw:[{x:200,y:120,br:[[[200,120],[200,60],[490,60]],[[200,120],[200,180],[490,180]]],dir:0},
      {x:200,y:300,br:[[[200,300],[200,240],[490,240]],[[200,300],[490,300]]],dir:1}],
  st:[{x:490,y:60,c:"red",n:"VERMELHA"},{x:490,y:180,c:"blue",n:"AZUL"},{x:490,y:240,c:"green",n:"VERDE"},{x:490,y:300,c:"gold",n:"ÂMBAR"}],
  pre:[[30,120],[200,120]],pre2:[[30,300],[200,300]],trains:["red","blue","green","gold"]}
];
const COL={red:"#D94E34",blue:"#2E6E8A",green:"#3E7C4F",gold:"#E8A33D"};
let lv=0,over=false,qi=0,train=null,sc=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["tr","TRENS","0/2"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>desvios ◉</b> para alternar o ramo ativo. Cada trem deve chegar à estação da sua cor.");
const o=H.cvs(root,520,360),x=o.x;
function build(){
  qi=0;train=null;
  LV[lv].sw.forEach(s=>{s.dir=lv===2?(s.y>200?1:0):s.dir;});
  hud.set("nv",lv+1);
  say("Nível "+(lv+1)+": "+LV[lv].trains.length+" trens a caminho. Ajuste os desvios!");
  spawn();
}
function spawn(){
  const L=LV[lv];
  if(qi>=L.trains.length){
    over=true;H.score(sc+150);
    if(lv>=LV.length-1)return H.done({win:true,score:sc+150,title:"Ferrovia pontual!",sub:"Todos os trens nas estações certas, sem colisões."});
    lv++;say("Nível "+(lv+1)+": mais desvios, mais cores.");H.after(800,build);return;
  }
  const pre=(L.pre2&&qi>=2)?L.pre2:L.pre;
  train={c:L.trains[qi],route:pre.map(p=>p.slice()),seg:0,t:0,speed:130,armed:true};
  hud.set("tr",qi+"/"+L.trains.length);
}
function stationAt(px,py){
  return LV[lv].st.find(s=>Math.hypot(s.x-px,s.y-py)<34);
}
H.onTap(o,(px,py)=>{
  if(over)return;
  for(const s of LV[lv].sw){
    if(Math.hypot(s.x-px,s.y-py)<24){s.dir^=1;H.sfx("tick");return;}
  }
});
H.loop(dt=>{
  const L=LV[lv];
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  function line(pts,col,w){
    x.strokeStyle=col;x.lineWidth=w||3;x.beginPath();
    pts.forEach((p,i)=>i?x.lineTo(p[0],p[1]):x.moveTo(p[0],p[1]));x.stroke();
  }
  line(L.pre,"#8A877C",4);
  if(L.pre2)line(L.pre2,"#8A877C",4);
  L.sw.forEach((s,si)=>{
    s.br.forEach((b,bi)=>{
      line(b,bi===s.dir?H.C.ink:"#D8D5CC",bi===s.dir?4:2);
    });
    x.fillStyle=H.C.wasabi;x.beginPath();x.arc(s.x,s.y,13,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";
    x.fillText(s.dir?"▼":"▲",s.x-5,s.y+4);
  });
  L.st.forEach(s=>{
    x.fillStyle=COL[s.c];x.fillRect(s.x-16,s.y-16,32,28);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(s.x-16,s.y-16,32,28);
    x.fillStyle=H.C.ink;x.font="10px 'Space Mono',monospace";x.fillText(s.n,s.x-24,s.y+26);
  });
  if(train&&!over){
    const r=train.route;
    let remain=train.speed*dt,guard=0;
    while(remain>0&&guard++<10){
      const a=r[train.seg],b=r[train.seg+1];
      if(!b)break;
      const len=Math.hypot(b[0]-a[0],b[1]-a[1]);
      const left=len-train.t;
      if(remain<left){train.t+=remain;remain=0;}
      else{remain-=left;train.seg++;train.t=0;
        if(train.seg>=r.length-1){arrive();break;}
        // chegou num desvio? anexa ramo
        const p=r[train.seg];
        const sw=L.sw.find(s=>Math.hypot(s.x-p[0],s.y-p[1])<4);
        if(sw&&train.armed){train.armed=false;
          sw.br[sw.dir].slice(1).forEach(q=>r.push(q.slice()));
        }
      }
    }
    if(!train)return;
    const a=r[Math.min(train.seg,r.length-2)]||r[0],b=r[Math.min(train.seg+1,r.length-1)]||r[0];
    const len=Math.max(1,Math.hypot(b[0]-a[0],b[1]-a[1]));
    const px=a[0]+(b[0]-a[0])*train.t/len,py=a[1]+(b[1]-a[1])*train.t/len;
    train.px=px;train.py=py;
    x.save();x.translate(px,py);
    x.fillStyle=COL[train.c];x.fillRect(-16,-9,32,18);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-16,-9,32,18);
    x.fillStyle=H.C.paper;x.font="11px serif";x.fillText("i:train",-9,5);
    x.restore();
  }
});
function arrive(){
  const st=stationAt(train.px,train.py);
  if(st&&st.c===train.c){
    H.sfx("ok");sc+=120;H.score(sc);hud.set("sc",sc);qi++;
    say("Trem entregue na estação "+st.n+". "+(LV[lv].trains.length-qi)+" restantes.");
    train=null;H.after(500,spawn);
  }else{
    H.sfx("bad");say("✕ Estação errada! O trem "+train.c+" voltou. Reajuste os desvios.");
    train=null;H.after(700,spawn);
  }
}
build();
}});
