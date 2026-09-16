/* NCODE N · 016 Labirinto Pintado — pinte tudo sem repetir passo */
GREG(16,{
init(root,H){
function snakeOpen(n){return{walls:new Set(),n};}
function snakeRows(n,spurCols){
  const walls=new Set();
  for(let c=0;c<n;c++)if(!spurCols.includes(c))walls.add((n-1)+","+c);
  return{walls,n};
}
const LV=[snakeOpen(4),snakeOpen(5),snakeRows(6,[4,5]),snakeRows(7,[5,6])];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["pt","PINTADO","0%"],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas, deslize ou clique em vizinhos: pinte <b>todas</b> as casas sem pisar duas vezes.");
const o=H.cvs(root,440,400),x=o.x;
let N=4,walls=new Set(),px=0,py=0,painted=new Set(),total=1;
function load(){
  N=LV[lv].n;walls=LV[lv].walls;px=0;py=0;
  painted=new Set(["0,0"]);total=N*N-walls.size;
  hud.set("nv",lv+1);upd();draw();
}
function upd(){hud.set("pt",Math.round(painted.size/total*100)+"%");}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const X=ox+c*s,Y=oy+r*s,k=r+","+c;
    x.fillStyle=walls.has(k)?H.C.ink:painted.has(k)?H.C.terra:H.C.card;
    x.fillRect(X+2,Y+2,s-4,s-4);
    x.strokeStyle=H.C.ink;x.lineWidth=1;x.strokeRect(X+2,Y+2,s-4,s-4);
  }
  x.fillStyle=H.C.ink;
  x.beginPath();x.arc(ox+px*s+s/2,oy+py*s+s/2,s*0.22,0,7);x.fill();
  x.strokeStyle=H.C.paper;x.lineWidth=2;x.stroke();
}
function move(dx,dy){
  if(over)return;
  const nx=px+dx,ny=py+dy;
  if(nx<0||ny<0||nx>=N||ny>=N||walls.has(ny+","+nx))return;
  if(painted.has(ny+","+nx)){H.sfx("bad");say("Casa <b>repetida</b>! Recomece o nível.");return;}
  px=nx;py=ny;painted.add(ny+","+nx);upd();H.sfx("tick");draw();
  if(painted.size>=total){
    H.sfx("ok");const sc=(lv+1)*120;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Galeria pintada!",sub:"4 labirintos cobertos sem repetir um passo."});}
    lv++;say("Nível "+(lv+1)+": grade maior. Planeje o caminho antes.");load();
  }
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowUp")move(0,-1);if(c==="ArrowDown")move(0,1);
  if(c==="ArrowLeft")move(-1,0);if(c==="ArrowRight")move(1,0);});
H.swipe(o,{up:()=>move(0,-1),down:()=>move(0,1),left:()=>move(-1,0),right:()=>move(1,0)});
H.onTap(o,(tx,ty)=>{
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  const c=Math.floor((tx-ox)/s),r=Math.floor((ty-oy)/s);
  if(Math.abs(r-py)+Math.abs(c-px)===1)move(c-px,r-py);
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)load();},false);
load();
}});
