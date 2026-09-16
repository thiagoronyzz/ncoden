/* NCODE N · 060 Sapo Atravessador — rua e rio até a margem */
GREG(60,{
init(root,H){
const LANES=[
 {y:5.5,k:"road",sp:90,dir:1,items:[0,200,400]},
 {y:4.5,k:"road",sp:-130,dir:-1,items:[100,340]},
 {y:3.5,k:"road",sp:160,dir:1,items:[50,300]},
 {y:2,k:"river",sp:80,dir:1,items:[0,260]},
 {y:1,k:"river",sp:-110,dir:-1,items:[140,400]}
];
let over=false,fx,fy,sc=0,lives=3,wins=0;
const hud=H.hud(root,[["cr","TRAVESSIAS","0/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Setas / toque</b> nos vizinhos. Atravesse 3 ruas e 2 rios (pegue carona nas 🪵!). 3 travessias vencem.");
const o=H.cvs(root,500,440),x=o.x;
const ROW=62,OFF=40;
function reset(){fx=4;fy=6;}
reset();
function die(msg){
  lives--;hud.set("vd",lives);H.sfx("bad");reset();
  if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Sapo atropelado!",sub:msg});}
  say("💥 "+msg+" Vidas: "+lives);
}
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  if(c==="ArrowUp")hop(0,-1);if(c==="ArrowDown")hop(0,1);
  if(c==="ArrowLeft")hop(-1,0);if(c==="ArrowRight")hop(1,0);});
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor(px/(o.W/9)),r=Math.round((py-OFF)/ROW);
  if(Math.abs(c-fx)+Math.abs(r-fy)===1)hop(c-fx,r-fy);
});
function hop(dx,dy){
  fx=H.clamp(fx+dx,0,8);fy=H.clamp(fy+dy,0,6);H.sfx("tick");
  if(fy===0){
    wins++;sc+=100;H.score(sc);hud.set("sc",sc);hud.set("cr",wins+"/3");H.sfx("ok");
    if(wins>=3){over=true;return H.done({win:true,score:sc+100,title:"Rei do brejo!",sub:"3 travessias completas entre rua e rio."});}
    say("Travessia "+wins+"/3! De novo, sapo.");reset();
  }
}
H.loop(dt=>{
  if(over)return;
  for(const L of LANES)
    for(let i=0;i<L.items.length;i++){
      L.items[i]+=L.sp*dt;
      if(L.items[i]>o.W+40)L.items[i]=-40;
      if(L.items[i]<-40)L.items[i]=o.W+40;
    }
  const fyPx=OFF+fy*ROW;
  for(const L of LANES){
    if(Math.abs((OFF+L.y*ROW)-fyPx)>ROW/2)continue;
    const px=fx*(o.W/9)+o.W/18;
    const hit=L.items.some(ix=>Math.abs(ix-px)<36);
    if(L.k==="road"){if(hit){die("Atropelado na rua!");return;}}
    else{
      if(!hit){die("Caiu no rio!");return;}
      fx=H.clamp(fx+L.sp*dt/(o.W/9),0,8);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const zone=fy2=>fy2<2.6?"#2E6E8A":fy2>2.6&&fy2<6?"#4A4A44":H.C.ok;
  for(let r=0;r<=6;r++){x.fillStyle=zone(r);x.fillRect(0,OFF+r*ROW-ROW/2,o.W,ROW);}
  x.fillStyle=H.C.paper;x.font="bold 11px 'Space Mono',monospace";
  x.fillText("🏁 MARGEM SEGURA",14,OFF-ROW/2+16);
  x.fillText("🟢 INÍCIO",14,OFF+6*ROW+22);
  for(const L of LANES){
    const y=OFF+L.y*ROW;
    for(const ix of L.items){
      x.font="26px serif";
      x.fillText(L.k==="road"?(L.dir>0?"🚗":"🚙"):"🪵",ix-14,y+9);
    }
  }
  x.font="30px serif";
  x.fillText("🐸",fx*(o.W/9)+o.W/18-15,fyPx+11);
});
}});
