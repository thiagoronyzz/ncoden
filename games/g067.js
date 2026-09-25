/* NCODE N · 067 Faca Giratória — fique sem bater */
GREG(67,{
init(root,H){
const GOAL=10;
let over=false,ang=0,speed=2.2,stuck=[],knife=null,sc=0;
const hud=H.hud(root,[["fk","FACAS","0/10"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> lança a faca no tronco giratório. Não acerte as já fincadas!");
const o=H.cvs(root,440,440),x=o.x;
const cx=o.W/2,cy=180,LR=74;
function build(){ang=0;stuck=[];knife=null;sc=0;speed=2.2;}
build();
function toss(){
  if(over||knife)return;
  knife={y:o.H-40};H.sfx("tick");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")toss();});
H.onTap(o,toss);
H.loop(dt=>{
  if(over)return;
  ang+=speed*dt;
  if(Math.random()<dt*.5)speed=H.clamp(speed+(Math.random()-.5)*.6,1.4,3.4)*(Math.random()<.02?-1:1);
  if(knife){
    knife.y-=620*dt;
    if(knife.y<=cy+LR+26){
      const rel=(((-Math.PI/2-ang)%(Math.PI*2))+Math.PI*2)%(Math.PI*2);
      const clash=stuck.some(s=>{
        let d=Math.abs(s-rel);
        if(d>Math.PI)d=Math.PI*2-d;
        return d<0.32;
      });
      if(clash){over=true;H.sfx("lose");
        return H.done({win:false,score:sc*20,title:"Facas colidiram!",sub:sc+"/"+GOAL+" fincadas. Espere a abertura!"});}
      stuck.push(rel);knife=null;sc++;
      H.score(sc*20);hud.set("sc",sc*20);hud.set("fk",sc+"/"+GOAL);H.sfx("ok");
      if(sc>=GOAL){over=true;return H.done({win:true,score:sc*20+150,title:"Faqueiro completo!",sub:GOAL+" facas no tronco sem uma colisão."});}
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.save();x.translate(cx,cy);
  x.fillStyle="#a4764a";x.beginPath();x.arc(0,0,LR,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.stroke();
  x.strokeStyle="rgba(0,0,0,.2)";
  for(let i=0;i<3;i++){x.beginPath();x.arc(0,0,24+i*16,0,7);x.stroke();}
  x.rotate(ang);
  for(const s of stuck){
    x.save();x.rotate(s);
    x.fillStyle="#c9c5b8";x.fillRect(LR-4,-5,44,10);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(LR-4,-5,44,10);
    x.fillStyle=H.C.ink;x.fillRect(LR+40,-7,12,14);
    x.restore();
  }
  x.restore();
  x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
  x.fillText("i:target"+(GOAL-sc)+" restantes",14,24);
  const ky=knife?knife.y:o.H-40;
  x.fillStyle="#c9c5b8";x.fillRect(cx-5,ky-44,10,44);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(cx-5,ky-44,10,44);
  x.fillStyle=H.C.ink;x.fillRect(cx-7,ky-58,14,14);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
