/* NCODE N · 008 Gelo Deslizante — deslize até a saída */
GREG(8,{
init(root,H){
const MAPS=[
 ["#####","#S..#","#.###","#..E#","#####"],
 ["#####","#S#E#","#.#.#","#...#","#####"],
 ["######","#S..##","#.##.#","#.#.##","#...E#","######"],
 ["#######","#S...##","#.##..#","#.##..#","#..O.E#","#######"]
];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","DESLIZES",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Setas, deslize ou clique numa casa: você <b>só para</b> ao bater. ⭕ é buraco — desvie.");
const o=H.cvs(root,460,400),x=o.x;
let grid=[],W=0,Hh=0,px=0,py=0,anim=null;
function load(){
  grid=MAPS[lv].map(r=>r.split(""));Hh=grid.length;W=grid[0].length;moves=0;hud.set("mv",0);hud.set("nv",lv+1);
  for(let r=0;r<Hh;r++)for(let c=0;c<W;c++)if(grid[r][c]==="S"){py=r;px=c;grid[r][c]=".";}
  draw();
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const s=Math.floor(Math.min(o.W/W,o.H/Hh));
  const ox=(o.W-s*W)/2,oy=(o.H-s*Hh)/2;
  for(let r=0;r<Hh;r++)for(let c=0;c<W;c++){
    const v=grid[r][c],X=ox+c*s,Y=oy+r*s;
    x.fillStyle=v==="#"?H.C.ink:v==="O"?H.C.ink:H.C.card;
    x.fillRect(X+1,Y+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(X+1,Y+1,s-2,s-2);
    x.font=Math.floor(s*0.5)+"px serif";x.textAlign="center";x.textBaseline="middle";
    if(v==="E"){x.fillStyle=H.C.ok;x.fillText("🏁",X+s/2,Y+s/2);}
    if(v==="O"){x.fillStyle=H.C.paper;x.fillText("⭕",X+s/2,Y+s/2);}
  }
  const bx=ox+px*s+s/2,by=oy+py*s+s/2;
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,s*0.3,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.textAlign="left";x.textBaseline="alphabetic";
}
function slide(dx,dy){
  if(over||anim)return;
  let nx=px,ny=py,fell=false,win=false;
  while(true){
    const tx=nx+dx,ty=ny+dy;
    if(grid[ty][tx]==="#")break;
    nx=tx;ny=ty;
    if(grid[ty][tx]==="O"){fell=true;break;}
    if(grid[ty][tx]==="E"){win=true;break;}
  }
  if(nx===px&&ny===py)return;
  moves++;hud.set("mv",moves);H.sfx("tick");
  anim={fx:px,fy:py,tx:nx,ty:ny,t:0,fell,win};
}
H.loop(dt=>{
  if(anim){
    anim.t+=dt*5;
    const fx=anim.fx+(anim.tx-anim.fx)*Math.min(1,anim.t);
    const fy=anim.fy+(anim.ty-anim.fy)*Math.min(1,anim.t);
    px=Math.round(fx);py=Math.round(fy);draw();
    if(anim.t>=1){
      px=anim.tx;py=anim.ty;
      if(anim.fell){H.sfx("bad");say("🕳️ Caiu no buraco! De volta ao início.");load();}
      else if(anim.win){
        H.sfx("ok");const sc=(lv+1)*120+Math.max(0,60-moves*3);H.score(sc);hud.set("sc",sc);
        if(lv>=MAPS.length-1){over=true;anim=null;return H.done({win:true,score:sc+100,title:"Pista gelada vencida!",sub:"4 labirintos derrapados até a saída."});}
        lv++;say("Nível "+(lv+1)+": gelo mais traiçoeiro.");load();
      }
      anim=null;draw();
    }
  }
});
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowUp")slide(0,-1);if(c==="ArrowDown")slide(0,1);
  if(c==="ArrowLeft")slide(-1,0);if(c==="ArrowRight")slide(1,0);});
H.swipe(o,{up:()=>slide(0,-1),down:()=>slide(0,1),left:()=>slide(-1,0),right:()=>slide(1,0)});
H.onTap(o,(tx,ty)=>{
  const s=Math.floor(Math.min(o.W/W,o.H/Hh));
  const ox=(o.W-s*W)/2,oy=(o.H-s*Hh)/2;
  const c=Math.floor((tx-ox)/s),r=Math.floor((ty-oy)/s);
  if(r===py&&c!==px)slide(c>px?1:-1,0);else if(c===px&&r!==py)slide(0,r>py?1:-1);
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over){anim=null;load();}},false);
load();draw();
}});
