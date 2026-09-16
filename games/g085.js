/* NCODE N · 085 Cerco ao Castelo — derrube a muralha */
GREG(85,{
init(root,H){
let over=false,ang=45,pw=62,wall=100,stones=8,proj=null,wind=0,sc=0;
const hud=H.hud(root,[["mr","MURALHA",100],["pd","PEDRAS",8],["sc","PONTOS",0]]);
const say=H.msg(root,"Ajuste <b>ângulo e força</b>, observe o <b>vento</b> e dispare. Derrube a muralha com 8 pedras!");
const o=H.cvs(root,520,360),x=o.x;
const WX=o.W-70;
function newWind(){wind=Math.round((Math.random()-.5)*14);hud.set("sc",sc);}
newWind();
function fire(){
  if(over||proj||stones<=0)return;
  stones--;hud.set("pd",stones);
  const a=ang*Math.PI/180,v=pw*9;
  proj={x:60,y:o.H-70,vx:Math.cos(a)*v,vy:-Math.sin(a)*v};
  H.sfx("pop");
}
H.loop(dt=>{
  if(over)return;
  if(proj){
    proj.vy+=800*dt;proj.vx+=wind*8*dt;
    proj.x+=proj.vx*dt;proj.y+=proj.vy*dt;
    if(proj.x>WX-14&&proj.x<WX+34&&proj.y>o.H-230&&proj.y<o.H-40){
      const dmg=Math.round(12+Math.hypot(proj.vx,proj.vy)/38);
      wall-=dmg;sc+=dmg;H.score(sc);hud.set("mr",Math.max(0,wall));hud.set("sc",sc);
      H.sfx("bad");proj=null;newWind();
      if(wall<=0){over=true;return H.done({win:true,score:sc+stones*20+100,title:"Muralha abaixo!",sub:"O castelo caiu com "+stones+" pedras de sobra."});}
      say("💥 Impacto direto! −"+dmg+" (vento agora "+wind+")");
    }else if(proj.x>o.W+20||proj.y>o.H+20||proj.x<-20){
      proj=null;newWind();
      if(stones<=0){over=true;return H.done({win:false,score:sc,title:"Sem pedras!",sub:"A muralha resistiu com "+wall+" HP. Ajuste a mira!"});}
      say("Errou! Vento: "+wind+". Restam "+stones+" pedras.");
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,o.H-40,o.W,40);
  x.fillStyle=H.C.ink;x.fillRect(WX,o.H-230,34,190);
  x.fillStyle=H.C.terra;x.fillRect(WX,o.H-230,34,190*(1-Math.max(0,wall)/100));
  x.fillStyle=H.C.ink;
  for(let i=0;i<4;i++)x.fillRect(WX-4+i*12,o.H-244,8,14);
  x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
  x.fillText(wall+" HP",WX-8,o.H-250);
  x.strokeStyle="#a4764a";x.lineWidth=6;
  x.beginPath();x.moveTo(40,o.H-40);x.lineTo(60,o.H-90);x.lineTo(90,o.H-40);x.stroke();
  x.fillStyle=H.C.ink;x.beginPath();x.arc(60,o.H-92,10,0,7);x.fill();
  x.fillStyle=H.C.ink3;x.font="12px 'Space Mono',monospace";
  x.fillText("∠ "+ang+"° · força "+pw+" · vento "+(wind>0?"+":"")+wind,14,24);
  if(!proj){
    const a=ang*Math.PI/180;
    x.setLineDash([4,5]);x.strokeStyle=H.C.terra;
    x.beginPath();x.moveTo(60,o.H-92);x.lineTo(60+Math.cos(a)*pw, o.H-92-Math.sin(a)*pw);x.stroke();
    x.setLineDash([]);
  }else{
    x.fillStyle=H.C.ink;x.beginPath();x.arc(proj.x,proj.y,8,0,7);x.fill();
  }
});
const r1=H.el("div","g-row",null,root);
[["∠ −","a",-3],["∠ +","a",3],["F −","p",-4],["F +","p",4]].forEach(([t,k,v])=>{
  const b=H.el("button","g-btn sm ghost",t,r1);
  b.addEventListener("click",()=>{
    if(k==="a")ang=H.clamp(ang+v,15,80);else pw=H.clamp(pw+v,30,95);
    H.sfx("tick");
  });
});
H.btn(root,"💥 DISPARAR",fire,true);
}});
