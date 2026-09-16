/* NCODE N · 036 Desatar Nó — arraste até desembaraçar */
GREG(36,{
init(root,H){
const LV=[
 {n:6,edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,0],[0,3],[1,4]]},
 {n:7,edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0],[0,3],[1,4],[2,5]]},
 {n:8,edges:[[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,0],[0,4],[1,5],[2,6],[3,7]]}
];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["xz","CRUZAMENTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste os <b>nós</b> até nenhum segmento se cruzar. Cruzamentos aparecem em vermelho.");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
let nodes=[],sel=null;
function build(){
  const L=LV[lv];
  const r=H.rng(400+lv*123);
  nodes=[];
  for(let i=0;i<L.n;i++)nodes.push({x:60+r()*380,y:60+r()*280});
  sel=null;hud.set("nv",lv+1);
}
function segInt(a,b,c,d){
  const d1=(d[0]-c[0])*(a[1]-c[1])-(d[1]-c[1])*(a[0]-c[0]);
  const d2=(d[0]-c[0])*(b[1]-c[1])-(d[1]-c[1])*(b[0]-c[0]);
  const d3=(b[0]-a[0])*(c[1]-a[1])-(b[1]-a[1])*(c[0]-a[0]);
  const d4=(b[0]-a[0])*(d[1]-a[1])-(b[1]-a[1])*(d[0]-a[0]);
  return((d1>0&&d2<0||d1<0&&d2>0)&&(d3>0&&d4<0||d3<0&&d4>0));
}
function crossings(){
  const L=LV[lv];let n=0;const bad=new Set();
  for(let i=0;i<L.edges.length;i++)for(let j=i+1;j<L.edges.length;j++){
    const[a,b]=L.edges[i],[c,d]=L.edges[j];
    if(a===c||a===d||b===c||b===d)continue;
    const A=nodes[a],B=nodes[b],C=nodes[c],D=nodes[d];
    if(segInt([A.x,A.y],[B.x,B.y],[C.x,C.y],[D.x,D.y])){n++;bad.add(i);bad.add(j);}
  }
  return{n,bad};
}
H.loop(()=>{
  if(over)return;
  if(ptr.down&&!sel){
    sel=nodes.find(nd=>Math.hypot(nd.x-ptr.x,nd.y-ptr.y)<22)||null;
  }
  if(!ptr.down)sel=null;
  if(sel){sel.x=H.clamp(ptr.x,20,o.W-20);sel.y=H.clamp(ptr.y,20,o.H-20);}
  const L=LV[lv],cr=crossings();
  hud.set("xz",cr.n);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  L.edges.forEach((e,i)=>{
    const A=nodes[e[0]],B=nodes[e[1]];
    x.strokeStyle=cr.bad.has(i)?H.C.terra:H.C.ink;
    x.lineWidth=cr.bad.has(i)?4:2.5;
    x.beginPath();x.moveTo(A.x,A.y);x.lineTo(B.x,B.y);x.stroke();
  });
  nodes.forEach((nd,i)=>{
    x.fillStyle=nd===sel?H.C.wasabi:H.C.gold;
    x.beginPath();x.arc(nd.x,nd.y,13,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";x.fillText(i,nd.x-4,nd.y+4);
  });
  if(cr.n===0){
    H.sfx("ok");const sc=(lv+1)*140;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Nó desfeito!",sub:"3 emaranhados viraram laços limpos."});}
    lv++;say("Nível "+(lv+1)+": mais nós, mais corda.");build();
    H.after(10,()=>{});
  }
});
H.btn(root,"↻ Reembaralhar",()=>{if(!over)build();},false);
build();
}});
