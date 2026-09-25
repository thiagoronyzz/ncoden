/* NCODE N · 004 Sombra Certa — gire a peça até a sombra bater */
GREG(4,{
init(root,H){
const SHAPES=[
 [[0,-46],[40,26],[-40,26]],
 [[-34,-20],[34,-20],[46,26],[0,10],[-46,26]],
 [[-40,-30],[-12,-30],[-12,-8],[40,-8],[40,26],[-40,26]],
 [[0,-48],[30,-14],[48,30],[0,18],[-48,30],[-30,-14]]
];
const ANG=[35,-50,120,-140,75];
let lv=0,cur=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["dg","ÂNGULO","0°"],["sc","PONTOS",0]]);
const say=H.msg(root,"Gire a peça com <b>◀ ▶</b> (ou setas) até a sombra coincidir com o molde tracejado.");
const o=H.cvs(root,520,340),x=o.x;
function poly(cx,cy,pts,ang,fill,stroke,dash){
  x.save();x.translate(cx,cy);x.rotate(ang*Math.PI/180);
  if(dash)x.setLineDash([7,6]);
  x.beginPath();x.moveTo(pts[0][0],pts[0][1]);
  for(let i=1;i<pts.length;i++)x.lineTo(pts[i][0],pts[i][1]);
  x.closePath();
  if(fill){x.fillStyle=fill;x.fill();}
  if(stroke){x.strokeStyle=stroke;x.lineWidth=2.5;x.stroke();}
  x.setLineDash([]);x.restore();
}
function norm(a){a%=360;if(a>180)a-=360;if(a<-180)a+=360;return a;}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.lineWidth=1;
  x.beginPath();x.moveTo(o.W/2,20);x.lineTo(o.W/2,o.H-20);x.stroke();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("// MOLDE-ALVO",24,30);x.fillText("// SUA PEÇA",o.W/2+24,30);
  x.fillStyle=H.C.terra;x.font="bold 12px 'Space Mono',monospace";
  x.fillText("LUZ",o.W/2-58,44);
  const pts=SHAPES[lv%SHAPES.length],A=ANG[lv%ANG.length];
  poly(130,200,pts,A,"rgba(217,78,52,.14)",H.C.terra,true);
  poly(390,140,pts,cur,H.C.ink,H.C.ink,false);
  x.save();x.globalAlpha=.28;
  poly(390,256,pts,cur,H.C.ink,null,false);
  x.restore();
  x.strokeStyle=H.C.ink3;x.beginPath();x.moveTo(60,300);x.lineTo(460,300);x.stroke();
  const d=Math.abs(norm(cur-A));
  x.fillStyle=d<7?H.C.ok:H.C.ink2;x.font="bold 15px 'Space Mono',monospace";
  x.fillText("Δ "+d.toFixed(1)+"°",o.W/2-24,o.H-14);
}
function rot(d){if(over)return;cur=norm(cur+d);hud.set("dg",Math.round(cur)+"°");H.sfx("tick");draw();}
const kb=H.keys();
kb.on(c=>{if(c==="ArrowLeft")rot(-6);if(c==="ArrowRight")rot(6);if(c==="Enter"||c==="Space")check();});
const row=H.el("div","g-row",null,root);
H.btn(row,"◀ Girar",()=>rot(-6),false);
H.btn(row,"Girar ▶",()=>rot(6),false);
H.btn(row,"✓ Conferir sombra",check,true);
function check(){
  if(over)return;
  const A=ANG[lv%ANG.length];
  if(Math.abs(norm(cur-A))<7){
    H.sfx("ok");const sc=(lv+1)*100;H.score(sc);hud.set("sc",sc);
    if(lv>=4){over=true;return H.done({win:true,score:sc+100,title:"Sombras alinhadas!",sub:"5 peças calibradas com precisão de relojoeiro."});}
    lv++;cur=0;hud.set("nv",lv+1);hud.set("dg","0°");
    say("Nível "+(lv+1)+": novo molde, novo ângulo.");
  }else{H.sfx("bad");say("Ainda fora — ajuste em passos de 6° até o Δ zerar.");}
  draw();
}
draw();
}});
