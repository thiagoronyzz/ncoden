/* NCODE N · 040 Hex Preenchido — complete a colmeia com tri-hex */
GREG(40,{
init(root,H){
const LINE=[[0,0],[1,0],[2,0]],CORNER=[[0,0],[1,0],[0,1]];
const LV=[
 {qs:3,rs:3,pieces:["L","L","L"]},
 {qs:4,rs:3,pieces:["C","C","L","L"]},
 {qs:5,rs:3,pieces:["C","C","L","L","L"]}
];
let lv=0,over=false,sel=0,rot=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["pc","PEÇAS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Escolha a peça, <b>gire</b> se preciso e clique na colmeia para <b>assentar</b>. Clique na peça assentada para remover.");
const o=H.cvs(root,520,360),x=o.x;
const SZ=24;
let board=new Set(),placed=[],pieces=[];
function key(q,r){return q+","+r;}
function shapeOf(p){return p==="L"?LINE:CORNER;}
function rotAx(cells,k){
  let c=cells.map(q=>q.slice());
  for(let i=0;i<k;i++)c=c.map(([q,r])=>[-r,q+r]);
  const mq=Math.min(...c.map(q=>q[0])),mr=Math.min(...c.map(q=>q[1]));
  return c.map(([q,r])=>[q-mq,r-mr]);
}
function center(q,r){
  const L=LV[lv];
  const wpx=SZ*Math.sqrt(3)*(L.qs+L.rs/2);
  const ox=(o.W-wpx)/2+SZ,hpx=SZ*1.5*(L.rs-1);
  const oy=(o.H-hpx)/2;
  return[ox+SZ*Math.sqrt(3)*(q+r/2),oy+SZ*1.5*r];
}
function hexPath(cx,cy,s){
  x.beginPath();
  for(let i=0;i<6;i++){
    const a=Math.PI/180*(60*i-30);
    const px=cx+s*Math.cos(a),py=cy+s*Math.sin(a);
    i?x.lineTo(px,py):x.moveTo(px,py);
  }
  x.closePath();
}
function build(){
  const L=LV[lv];
  board=new Set();placed=[];pieces=L.pieces.slice();sel=0;rot=0;
  for(let q=0;q<L.qs;q++)for(let r=0;r<L.rs;r++)board.add(key(q,r));
  hud.set("nv",lv+1);hud.set("pc","0/"+pieces.length);
  tray();draw();
}
function atCell(px,py){
  const L=LV[lv];let best=null,bd=1e9;
  for(let q=0;q<L.qs;q++)for(let r=0;r<L.rs;r++){
    const[cx,cy]=center(q,r);
    const d=Math.hypot(cx-px,cy-py);
    if(d<SZ&&d<bd){bd=d;best=[q,r];}
  }
  return best;
}
H.onTap(o,(px,py)=>{
  if(over)return;
  const hit=atCell(px,py);
  if(!hit)return;
  const k=key(hit[0],hit[1]);
  const pi=placed.findIndex(p=>p.cells.includes(k));
  if(pi>=0){
    const[p]=placed.splice(pi,1);pieces.push(p.t);sel=pieces.length-1;
    H.sfx("tick");tray();draw();hud.set("pc",(LV[lv].pieces.length-pieces.length)+"/"+LV[lv].pieces.length);return;
  }
  if(!pieces.length)return;
  const t=pieces[sel],sh=rotAx(shapeOf(t),rot);
  const cells=sh.map(([dq,dr])=>key(hit[0]+dq,hit[1]+dr));
  const used=new Set(placed.flatMap(p=>p.cells));
  if(!cells.every(c=>board.has(c)&&!used.has(c))){H.sfx("bad");say("Não encaixa — respeite a colmeia e as peças vizinhas.");return;}
  placed.push({t,cells});pieces.splice(sel,1);sel=0;
  H.sfx("ok");tray();draw();
  hud.set("pc",(LV[lv].pieces.length-pieces.length)+"/"+LV[lv].pieces.length);
  if(placed.flatMap(p=>p.cells).length>=board.size){
    const sc=(lv+1)*160;H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Colmeia completa!",sub:"3 tabuleiros hexagonais sem uma lacuna."});}
    lv++;say("Nível "+(lv+1)+": colmeia maior, peças curvas.");H.after(700,build);
  }
});
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const used={};
  placed.forEach((p,i)=>p.cells.forEach(c=>used[c]=i));
  board.forEach(k=>{
    const[q,r]=k.split(",").map(Number);
    const[cx,cy]=center(q,r);
    hexPath(cx,cy,SZ-2);
    x.fillStyle=used[k]!=null?(used[k]%2?H.C.wasabi:H.C.gold):H.C.card;
    x.fill();x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    if(used[k]!=null){x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";x.fillText(placed[used[k]].t,cx-4,cy+4);}
  });
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  pieces.forEach((t,i)=>{
    const b=H.el("button","g-chip"+(i===sel?" hot":""),t==="L"?"▬ tri-reta":"◣ tri-curva",trayBox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");tray();});
  });
  const rb=H.el("button","g-btn sm ghost","⟳ Girar 60°",trayBox);
  rb.addEventListener("click",()=>{rot=(rot+1)%6;H.sfx("tick");});
}
build();
}});
