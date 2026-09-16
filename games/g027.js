/* NCODE N · 027 Bloco Fugitivo — liberte o bloco vermelho */
GREG(27,{
init(root,H){
const LV=[
 [{o:"H",r:2,c:0,l:2,red:1},{o:"V",r:1,c:4,l:2},{o:"H",r:4,c:1,l:2},{o:"V",r:3,c:5,l:3}],
 [{o:"H",r:2,c:0,l:2,red:1},{o:"V",r:0,c:2,l:2},{o:"V",r:2,c:3,l:2},{o:"H",r:5,c:0,l:3},{o:"V",r:4,c:4,l:2}],
 [{o:"H",r:2,c:1,l:2,red:1},{o:"V",r:0,c:4,l:3},{o:"H",r:5,c:3,l:2},{o:"H",r:0,c:0,l:2},{o:"V",r:3,c:1,l:2}]
];
const COLORS=["#2E6E8A","#3E7C4F","#E8A33D","#8A877C","#7A6FF0"];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","MOVIMENTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste os blocos ao longo do seu eixo. Leve o <b>vermelho</b> até a saída ⇒.");
const o=H.cvs(root,440,440),x=o.x;
const ptr=H.ptr(o);
let cars=[],grab=null,grido=0,cell=0,winAnim=null;
function build(){
  cars=LV[lv].map((c,i)=>Object.assign({fr:c.r,fc:c.c,col:c.red?H.C.terra:COLORS[i%COLORS.length]},c));
  moves=0;grab=null;winAnim=null;
  hud.set("nv",lv+1);hud.set("mv",0);
  cell=Math.floor(Math.min(o.W,o.H)/6.6);grido=(o.W-cell*6)/2;
}
function occ(ignore){
  const m=new Set();
  cars.forEach(c=>{if(c===ignore)return;
    for(let i=0;i<c.l;i++)m.add(c.o==="H"?(c.fr+","+ (c.fc+i)):(c.fr+i+","+c.fc));
  });
  return m;
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.card;x.fillRect(grido,grido,cell*6,cell*6);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(grido,grido,cell*6,cell*6);
  x.strokeStyle=H.C.cement;x.lineWidth=1;
  for(let i=1;i<6;i++){
    x.beginPath();x.moveTo(grido+i*cell,grido);x.lineTo(grido+i*cell,grido+6*cell);x.stroke();
    x.beginPath();x.moveTo(grido,grido+i*cell);x.lineTo(grido+6*cell,grido+i*cell);x.stroke();
  }
  x.fillStyle=H.C.ok;x.fillRect(grido+6*cell-4,grido+2*cell+4,14,cell-8);
  x.fillStyle=H.C.ink;x.font="bold 16px 'Space Mono',monospace";x.fillText("⇒",grido+6*cell+16,grido+2*cell+cell/2+6);
  for(const c of cars){
    const px=grido+c.fc*cell+3,py=grido+c.fr*cell+3;
    const w=(c.o==="H"?c.l*cell:cell)-6,h=(c.o==="H"?cell:c.l*cell)-6;
    x.fillStyle=c===grab?H.C.wasabi:c.col;
    x.fillRect(px,py,w,h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(px,py,w,h);
    if(c.red){x.fillStyle="#fff";x.font="bold 18px 'Space Mono',monospace";x.fillText("★",px+w/2-8,py+h/2+6);}
  }
}
H.loop(()=>{
  if(over)return;
  if(winAnim){
    const red=cars.find(c=>c.red);red.fc+=0.09;
    draw();
    if(red.fc>6){winAnim=null;nextLevel();}
    return;
  }
  if(ptr.down&&!grab){
    const c=Math.floor((ptr.x-grido)/cell),r=Math.floor((ptr.y-grido)/cell);
    grab=cars.find(k=>{
      for(let i=0;i<k.l;i++){if(k.o==="H"){if(k.fr===r&&k.fc+i===c)return true;}else{if(k.fr+i===r&&k.fc===c)return true;}}
      return false;
    })||null;
    if(grab){grab.gx=ptr.x;grab.gy=ptr.y;grab.ofr=grab.fr;grab.ofc=grab.fc;grab.moved=false;}
  }else if(!ptr.down&&grab){
    if(grab.moved){moves++;hud.set("mv",moves);H.sfx("tick");
      const red=cars.find(c=>c.red);
      if(red.fc+red.l>=6){winAnim=true;H.sfx("pop");}
    }
    grab=null;
  }
  if(grab){
    const m=occ(grab);
    if(grab.o==="H"){
      let nc=Math.round(grab.ofc+(ptr.x-grab.gx)/cell);
      nc=Math.max(0,Math.min(6-grab.l,nc));
      let lo=grab.ofc,hi=grab.ofc;
      while(lo-1>=0&&!m.has(grab.fr+","+(lo-1)))lo--;
      while(hi+1<=6-grab.l&&!m.has(grab.fr+","+(hi+grab.l)))hi++;
      grab.fc=H.clamp(nc,lo,hi);
      if(grab.fc!==grab.ofc)grab.moved=true;
    }else{
      let nr=Math.round(grab.ofr+(ptr.y-grab.gy)/cell);
      nr=Math.max(0,Math.min(6-grab.l,nr));
      let lo=grab.ofr,hi=grab.ofr;
      while(lo-1>=0&&!m.has((lo-1)+","+grab.fc))lo--;
      while(hi+1<=6-grab.l&&!m.has((hi+grab.l)+","+grab.fc))hi++;
      grab.fr=H.clamp(nr,lo,hi);
      if(grab.fr!==grab.ofr)grab.moved=true;
    }
  }
  draw();
});
function nextLevel(){
  const sc=(lv+1)*140+Math.max(0,100-moves*3);H.score(sc);hud.set("sc",sc);H.sfx("ok");
  if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+120,title:"Fuga limpa!",sub:"O bloco vermelho escapou dos 3 estacionamentos."});}
  lv++;say("Nível "+(lv+1)+": mais carros no caminho.");build();
}
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});
