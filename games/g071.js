/* NCODE N · 071 Pino na Fenda — solte na hora exata */
GREG(71,{
init(root,H){
const GOAL=8;
let over=false,slotX=250,dir=1,pin=null,sc=0,lives=5,speed=200;
const hud=H.hud(root,[["ac","ACERTOS","0/8"],["vd","VIDAS",5],["sc","PONTOS",0]]);
const say=H.msg(root,"A fenda desliza sem parar. <b>Toque/Espaço</b> solta o pino de cima. "+GOAL+" acertos vencem!");
const o=H.cvs(root,500,380),x=o.x;
function drop(){
  if(over||pin)return;
  pin={x:o.W/2,y:30,vy:0};H.sfx("tick");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")drop();});
H.onTap(o,drop);
H.loop(dt=>{
  if(over)return;
  slotX+=dir*speed*dt;
  if(slotX>o.W-70){slotX=o.W-70;dir=-1;}
  if(slotX<70){slotX=70;dir=1;}
  if(pin){
    pin.vy+=1500*dt;pin.y+=pin.vy*dt;
    if(pin.y>=o.H-90){
      if(Math.abs(pin.x-slotX)<30){
        sc++;speed+=22;H.score(sc*25);hud.set("sc",sc*25);hud.set("ac",sc+"/"+GOAL);H.sfx("ok");
        if(sc>=GOAL){over=true;return H.done({win:true,score:sc*25+100,title:"Mira de laser!",sub:GOAL+" pinos na fenda em movimento."});}
      }else{
        lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc*25,title:"Pinos tortos!",sub:sc+" acertos. Solte um pouco antes!"});}
        say("Errou! Vidas: "+lives+".");
      }
      pin=null;
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.setLineDash([4,5]);
  x.beginPath();x.moveTo(o.W/2,0);x.lineTo(o.W/2,o.H-90);x.stroke();x.setLineDash([]);
  x.fillStyle=H.C.ink;
  x.fillRect(20,o.H-80,slotX-30-20,26);
  x.fillRect(slotX+30,o.H-80,o.W-20-(slotX+30),26);
  x.fillStyle=H.C.wasabi;x.fillRect(slotX-30,o.H-80,60,26);
  x.strokeStyle=H.C.ink;x.lineWidth=2;
  x.strokeRect(slotX-30,o.H-80,60,26);
  if(!pin){
    x.fillStyle=H.C.terra;
    x.beginPath();x.moveTo(o.W/2-8,20);x.lineTo(o.W/2+8,20);x.lineTo(o.W/2,52);x.closePath();x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  }else{
    x.fillStyle=H.C.terra;
    x.beginPath();x.moveTo(pin.x-8,pin.y-32);x.lineTo(pin.x+8,pin.y-32);x.lineTo(pin.x,pin.y);x.closePath();x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  }
});
H.btn(root,"↻ Recomeçar",()=>{over=false;sc=0;lives=5;speed=200;pin=null;slotX=250;hud.set("ac","0/8");hud.set("vd",5);hud.set("sc",0);},false);
}});
