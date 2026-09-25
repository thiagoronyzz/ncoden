/* NCODE N · 032 Tangram — encaixe as peças na silhueta */
GREG(32,{
init(root,H){
const DEFS=[
 {pts:[[-30,-26],[30,-26],[0,26]],slot:[370,110],rot:0,n:"triângulo"},
 {pts:[[-24,-24],[24,-24],[24,24],[-24,24]],slot:[370,210],rot:0,n:"quadrado"},
 {pts:[[-42,-18],[42,-18],[42,18],[-42,18]],slot:[370,300],rot:0,n:"retângulo"},
 {pts:[[-18,-16],[18,-16],[0,16]],slot:[140,300],rot:180,n:"triângulo P"}
];
let over=false,placed=0,sc=0;
const hud=H.hud(root,[["pc","PEÇAS","0/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste cada peça até seu <b>molde tracejado</b>. Toque numa peça e use <b>Girar</b> se ela estiver torta.");
const o=H.cvs(root,520,360),x=o.x;
const ptr=H.ptr(o);
let pieces=[],sel=null,wasDown=false;
function build(){
  const r=H.rng(77);
  pieces=DEFS.map((d,i)=>({
    pts:d.pts,slot:d.slot,n:d.n,
    x:60+r()*160,y:60+r()*180,rot:[0,90,180,270][Math.floor(r()*4)],
    need:d.rot,done:false
  }));
  placed=0;sel=null;
}
build();
function drawPoly(px,py,pts,rot,fill,stroke,dash){
  x.save();x.translate(px,py);x.rotate(rot*Math.PI/180);
  if(dash)x.setLineDash([6,5]);
  x.beginPath();x.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);
  x.closePath();
  if(fill){x.fillStyle=fill;x.fill();}
  if(stroke){x.strokeStyle=stroke;x.lineWidth=2.5;x.stroke();}
  x.setLineDash([]);x.restore();
}
H.loop(()=>{
  if(ptr.down&&!wasDown){
    sel=null;
    for(let i=pieces.length-1;i>=0;i--){
      const p=pieces[i];
      if(!p.done&&Math.hypot(p.x-ptr.x,p.y-ptr.y)<52){sel=p;break;}
    }
  }
  wasDown=ptr.down;
  if(sel&&ptr.down&&!sel.done){sel.x=ptr.x;sel.y=ptr.y;}
  if(sel&&!ptr.down){
    const p=sel;
    if(Math.hypot(p.x-p.slot[0],p.y-p.slot[1])<34&&((p.rot%360+360)%360)===((p.need%360+360)%360)){
      p.done=true;p.x=p.slot[0];p.y=p.slot[1];
      placed++;sc+=100;H.score(sc);hud.set("sc",sc);hud.set("pc",placed+"/4");H.sfx("ok");
      if(placed>=4){over=true;return H.done({win:true,score:sc+100,title:"Silhueta completa!",sub:"4 peças de tangram no lugar exato."});}
      say("✔"+p.n+" encaixado! Faltam "+(4-placed)+".");
    }
    sel=null;
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  pieces.forEach(p=>{
    if(!p.done)drawPoly(p.slot[0],p.slot[1],p.pts,p.need,"rgba(217,78,52,.10)",H.C.terra,true);
  });
  pieces.forEach(p=>{
    drawPoly(p.x,p.y,p.pts,p.rot,p.done?H.C.wasabi:(p===sel?H.C.gold:H.C.card),H.C.ink,false);
  });
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(sel?("selecionada: "+sel.n+" ("+sel.rot+"°)"):"toque e arraste uma peça",14,o.H-12);
});
H.btn(root,"⟳ Girar selecionada",()=>{
  if(over||!selPtr())return;
  const p=selPtr();p.rot=(p.rot+90)%360;H.sfx("tick");
},false);
let lastSel=null;
H.loop(()=>{if(sel)lastSel=sel;});
function selPtr(){return sel||lastSel;}
}});
