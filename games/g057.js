/* NCODE N · 057 Cobra Clássica — coma, cresça, desvie */
GREG(57,{
init(root,H){
const N=16;
let over=false,snake,dir,nd,food,sc=0,tick=0,speed=.12;
const hud=H.hud(root,[["cp","COMPRIMENTO",3],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Setas / deslize</b> para virar. Coma para crescer. 120 pontos vencem — sem morder o rabo!");
const o=H.cvs(root,440,440),x=o.x;
function build(){
  snake=[{x:8,y:8},{x:7,y:8},{x:6,y:8}];dir={x:1,y:0};nd=dir;sc=0;speed=.12;
  place();hud.set("cp",3);hud.set("sc",0);
}
function place(){
  while(true){
    const f={x:Math.floor(Math.random()*N),y:Math.floor(Math.random()*N)};
    if(!snake.some(s=>s.x===f.x&&s.y===f.y)){food=f;return;}
  }
}
build();
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;
  if(c==="ArrowUp"&&dir.y!==1)nd={x:0,y:-1};
  if(c==="ArrowDown"&&dir.y!==-1)nd={x:0,y:1};
  if(c==="ArrowLeft"&&dir.x!==1)nd={x:-1,y:0};
  if(c==="ArrowRight"&&dir.x!==-1)nd={x:1,y:0};});
H.swipe(o,{up:()=>{if(dir.y!==1)nd={x:0,y:-1};},down:()=>{if(dir.y!==-1)nd={x:0,y:1};},
  left:()=>{if(dir.x!==1)nd={x:-1,y:0};},right:()=>{if(dir.x!==-1)nd={x:1,y:0};}});
H.loop(dt=>{
  if(over)return;
  tick+=dt;
  if(tick>=speed){
    tick=0;dir=nd;
    const h={x:snake[0].x+dir.x,y:snake[0].y+dir.y};
    if(h.x<0||h.y<0||h.x>=N||h.y>=N||snake.some(s=>s.x===h.x&&s.y===h.y)){
      over=true;H.sfx("lose");
      return H.done({win:false,score:sc,title:"Cobra enrolada!",sub:sc+" pontos antes da batida."});
    }
    snake.unshift(h);
    if(h.x===food.x&&h.y===food.y){
      sc+=10;H.score(sc);hud.set("sc",sc);hud.set("cp",snake.length);H.sfx("pop");
      speed=Math.max(.06,speed-.004);place();
      if(sc>=120){over=true;return H.done({win:true,score:sc+100,title:"Sucuri suprema!",sub:"120 pontos de maçãs devoradas."});}
    }else snake.pop();
  }
  const s=Math.floor(Math.min(o.W,o.H)/N);
  const ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(ox-3,oy-3,s*N+6,s*N+6);
  x.font=Math.floor(s*.8)+"px serif";
  x.fillText("i:fruit",ox+food.x*s+2,oy+food.y*s+s-3);
  snake.forEach((sg,i)=>{
    x.fillStyle=i===0?H.C.ink:H.C.ok;
    x.fillRect(ox+sg.x*s+1,oy+sg.y*s+1,s-2,s-2);
    if(i===0){x.fillStyle=H.C.wasabi;x.fillRect(ox+sg.x*s+s/2-2,oy+sg.y*s+4,4,4);}
  });
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
}});
