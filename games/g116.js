/* NCODE N · 116 Carteiro — a rota mais curta */
GREG(116,{
init(root,H){
const MAPS=[
 {h:[[60,80],[200,60],[350,90],[120,220],[280,210],[420,230],[180,330],[330,330]],},
 {h:[[70,70],[250,50],[430,80],[90,200],[260,180],[400,200],[150,330],[330,310]],}
];
let m=0,order=[],over=false,moving=false;
const hud=H.hud(root,[["mp","MAPA","1/2"],["km","DISTÂNCIA","—"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas casas na ordem da rota (do correio e de volta). Respeite o <b>limite de km</b>!");
const o=H.cvs(root,500,360),x=o.x;
let sc=0,budget=0;
const P0=[40,320];
function dist(a,b){return Math.hypot(a[0]-b[0],a[1]-b[1]);}
function routeLen(ord){
  const H2=MAPS[m].h;
  let d=dist(P0,H2[ord[0]]),i;
  for(i=1;i<ord.length;i++)d+=dist(H2[ord[i-1]],H2[ord[i]]);
  d+=dist(H2[ord[ord.length-1]],P0);
  return d;
}
function greedy(){
  const H2=MAPS[m].h,left=H2.map((_,i)=>i),ord=[];
  let cur=P0;
  while(left.length){
    left.sort((a,b)=>dist(cur,H2[a])-dist(cur,H2[b]));
    cur=H2[left[0]];ord.push(left[0]);left.shift();
  }
  return ord;
}
function build(){
  order=[];moving=false;
  budget=Math.round(routeLen(greedy())*1.18);
  hud.set("mp",(m+1)+"/2");hud.set("km","limite "+budget);
  say("Mapa "+(m+1)+": visite as 8 casas com até <b>"+budget+" km</b>.");
}
build();
H.onTap(o,(px,py)=>{
  if(over||moving)return;
  const H2=MAPS[m].h;
  let bi=-1,bd=26;
  H2.forEach((h,i)=>{const d=Math.hypot(px-h[0],py-h[1]);if(d<bd){bd=d;bi=i;}});
  if(bi<0)return;
  const ix=order.indexOf(bi);
  if(ix>=0)order.splice(ix,1);else order.push(bi);
  H.sfx("tick");
  if(order.length===H2.length)hud.set("km",Math.round(routeLen(order))+" / "+budget);
});
H.loop(()=>{
  const H2=MAPS[m].h;
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  x.beginPath();x.moveTo(P0[0],P0[1]);
  order.forEach(i=>x.lineTo(H2[i][0],H2[i][1]));
  if(order.length===H2.length)x.lineTo(P0[0],P0[1]);
  x.stroke();
  x.font="22px serif";
  x.fillText("i:mailbox",P0[0]-12,P0[1]+8);
  H2.forEach((h,i)=>{
    x.fillText("i:house",h[0]-12,h[1]+8);
    const ix=order.indexOf(i);
    if(ix>=0){x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";
      x.fillText(ix+1,h[0]+10,h[1]-8);x.font="22px serif";}
  });
});
H.btn(root,"Entregar rota",()=>{
  if(over||moving)return;
  if(order.length!==MAPS[m].h.length){H.sfx("bad");say("Visite todas as 8 casas!");return;}
  const L=Math.round(routeLen(order));
  hud.set("km",L+" / "+budget);
  if(L>budget){H.sfx("bad");say("✕"+L+" km — acima do limite! Encurte a rota.");return;}
  sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
  m++;
  if(m>=MAPS.length){over=true;return H.done({win:true,score:sc+100,title:"Carteiro eficiente!",sub:"2 rotas dentro do limite de km."});}
  say("Rota aprovada! +150. Próximo mapa…");
  H.after(600,build);
},true);
}});
