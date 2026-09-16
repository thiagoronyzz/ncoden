/* NCODE N · 046 Troca de Cor — combine com o anel */
GREG(46,{
init(root,H){
const COLS=[H.C.terra,H.C.gold,H.C.ok,"#2E6E8A"];
let over=false,by,ci=0,rings,ri=0,sc=0,speed=120;
const hud=H.hud(root,[["an","ANÉIS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"A bola sobe sozinha. <b>Toque/Espaço</b> troca a cor. Atravesse cada anel na <b>cor do arco</b> que encostar!");
const o=H.cvs(root,440,460),x=o.x;
function build(){
  by=o.H-60;ci=0;ri=0;sc=0;
  rings=[];
  const r=H.rng(99);
  for(let i=0;i<8;i++)rings.push({y:o.H-220-i*260,rot:r()*6,sp:(0.7+r()*0.9)*(i%2?-1:1)});
}
build();
function swap(){if(over)return;ci=(ci+1)%4;H.beep(400+ci*120,.06,"square",.04);}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")swap();});
H.onTap(o,swap);
H.loop(dt=>{
  if(over)return;
  by-=speed*dt;speed+=dt*4;
  const r=rings[ri];
  if(r){
    r.rot+=r.sp*dt;
    const dy=by-r.y;
    if(Math.abs(dy)<8){
      let a=Math.atan2(dy,o.W/2-o.W/2+0.0001);
      a=Math.atan2(dy,1);
      const ang=((Math.PI/2 - r.rot)%(Math.PI*2)+Math.PI*2)%(Math.PI*2);
      const seg=Math.floor(ang/(Math.PI/2))%4;
      if(seg!==ci){over=true;H.sfx("lose");
        return H.done({win:false,score:sc,title:"Cor errada!",sub:ri+" anéis vencidos. Gire o olhar junto com o anel."});}
      ri++;sc+=50;H.score(sc);hud.set("sc",sc);hud.set("an",ri+"/8");H.sfx("ok");
      if(ri>=rings.length){over=true;return H.done({win:true,score:sc+150,title:"Cromático!",sub:"8 anéis atravessados na cor exata."});}
    }
    if(by<r.y-200){/* segue */}
  }
  const camY=Math.max(0,(o.H-140)-by+200);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  rings.forEach((g,i)=>{
    if(i<ri)return;
    const cy=g.y+camY;
    if(cy<-60||cy>o.H+60)return;
    for(let s=0;s<4;s++){
      x.strokeStyle=COLS[s];x.lineWidth=14;
      x.beginPath();x.arc(o.W/2,cy,52,g.rot+s*Math.PI/2,g.rot+(s+1)*Math.PI/2);x.stroke();
    }
    x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
    x.fillText("ANEL "+(i+1),o.W/2-26,cy+78);
  });
  x.fillStyle=COLS[ci];x.beginPath();x.arc(o.W/2,by+camY,13,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  if(by+camY<-40){by=o.H-60;}
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
