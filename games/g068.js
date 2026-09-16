/* NCODE N · 068 Torre Balançante — solte no balanço certo */
GREG(68,{
init(root,H){
const GOAL=10;
let over=false,stack,sw,falling,sc=0;
const hud=H.hud(root,[["bl","BLOCOS","0/10"],["sc","PONTOS",0]]);
const say=H.msg(root,"O guindaste balança. <b>Toque/Espaço</b> solta o bloco sobre a torre. Tortos são <b>cortados</b>!");
const o=H.cvs(root,460,440),x=o.x;
const PIV={x:o.W/2,y:60},LEN=150;
function build(){
  stack=[{x:o.W/2-70,w:140,y:o.H-30}];sc=0;
  sw={a:1.1,w:0};falling=null;
  hud.set("bl","0/"+GOAL);hud.set("sc",0);
}
build();
function release(){
  if(over||falling)return;
  const bx=PIV.x+Math.sin(sw.a)*LEN;
  falling={x:bx-70,y:PIV.y+Math.cos(sw.a)*LEN,w:140,vy:0};
  H.sfx("tick");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")release();});
H.onTap(o,release);
H.loop(dt=>{
  if(over)return;
  if(!falling){
    sw.w+=(-9.8/LEN*Math.sin(sw.a))*dt*8;
    sw.a+=sw.w*dt;
    if(Math.abs(sw.a)>1.3)sw.w*=-0.98;
  }else{
    falling.vy+=1400*dt;falling.y+=falling.vy*dt;
    const top=stack[stack.length-1];
    if(falling.y>=top.y-24){
      const L=Math.max(falling.x,top.x),R=Math.min(falling.x+falling.w,top.x+top.w);
      if(R-L<10){over=true;H.sfx("lose");
        return H.done({win:false,score:sc,title:"Bloco ao vento!",sub:(stack.length-1)+" andares antes da queda."});}
      stack.push({x:L,w:R-L,y:top.y-24});
      sc+=(R-L)/top.w>0.92?30:10;
      H.score(sc);hud.set("sc",sc);hud.set("bl",(stack.length-1)+"/"+GOAL);H.sfx("ok");
      falling=null;sw={a:(Math.random()<.5?-1:1)*1.15,w:0};
      if(stack.length-1>=GOAL){over=true;return H.done({win:true,score:sc+150,title:"Guindaste de ouro!",sub:GOAL+" blocos empilhados no balanço."});}
    }
    if(falling&&falling.y>o.H+40){over=true;H.sfx("lose");
      return H.done({win:false,score:sc,title:"Errou a torre!",sub:(stack.length-1)+" andares."});}
  }
  const camY=Math.max(0,(o.H-160)-stack[stack.length-1].y);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(PIV.x-40,20,80,14);
  if(!falling){
    const bx=PIV.x+Math.sin(sw.a)*LEN,by=PIV.y+Math.cos(sw.a)*LEN;
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.beginPath();x.moveTo(PIV.x,PIV.y);x.lineTo(bx,by);x.stroke();
    x.fillStyle=H.C.gold;x.fillRect(bx-70,by,140,24);
    x.strokeStyle=H.C.ink;x.strokeRect(bx-70,by,140,24);
  }
  stack.forEach((b,i)=>{
    x.fillStyle=i%2?H.C.terra:H.C.ink;
    x.fillRect(b.x,b.y+camY,b.w,24);
    x.strokeStyle=H.C.paper;x.strokeRect(b.x,b.y+camY,b.w,24);
  });
  if(falling){
    x.fillStyle=H.C.gold;x.fillRect(falling.x,falling.y+camY,falling.w,24);
    x.strokeStyle=H.C.ink;x.strokeRect(falling.x,falling.y+camY,falling.w,24);
  }
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
