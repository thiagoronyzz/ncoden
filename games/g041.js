/* NCODE N · 041 Torre Empilhada — alinhe os blocos que caem */
GREG(41,{
init(root,H){
let over=false;
const hud=H.hud(root,[["bl","BLOCOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Espaço / toque</b> solta o bloco. Alinhe sobre a torre — o que sobrar é cortado!");
const o=H.cvs(root,460,440),x=o.x;
let stack,cur,dir,speed,sc=0;
function build(){
  stack=[{x:o.W/2-70,w:140,y:o.H-30}];sc=0;
  newBlock();hud.set("bl",0);hud.set("sc",0);
}
function newBlock(){
  const top=stack[stack.length-1];
  cur={x:0,y:top.y-26,w:top.w,fromLeft:Math.random()<.5};
  cur.x=cur.fromLeft?-cur.w:o.W;
  dir=cur.fromLeft?1:-1;speed=170+stack.length*14;
}
function drop(){
  if(over||!cur)return;
  const top=stack[stack.length-1];
  const L=Math.max(cur.x,top.x),R=Math.min(cur.x+cur.w,top.x+top.w);
  if(R-L<8){over=true;H.sfx("lose");return H.done({win:false,score:sc,title:"Bloco perdido!",sub:stack.length-1+" andares erguidos antes da queda."});}
  const perfect=(R-L)/top.w>0.9;
  stack.push({x:L,w:R-L,y:top.y-26});
  sc+=perfect?30:10;H.score(sc);hud.set("sc",sc);hud.set("bl",stack.length-1);
  H.sfx(perfect?"ok":"tick");
  if(stack.length-1>=15){over=true;return H.done({win:true,score:sc+150,title:"Arranha-céu!",sub:"15 andares perfeitamente alinhados."});}
  newBlock();
}
const kb=H.keys();kb.on((c,d)=>{if(d&&(c==="Space"||c==="ArrowDown"))drop();});
H.onTap(o,drop);
H.loop(dt=>{
  if(over||!cur)return;
  cur.x+=dir*speed*dt;
  if(cur.x<-cur.w-10){cur.x=o.W+10;}if(cur.x>o.W+10){cur.x=-cur.w-10;}
  const camY=Math.max(0,(o.H-140)-(stack[stack.length-1].y));
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,o.H-14+camY,o.W,14);
  stack.forEach((b,i)=>{
    x.fillStyle=i%2?H.C.terra:H.C.ink;
    x.fillRect(b.x,b.y+camY,b.w,26);
    x.strokeStyle=H.C.paper;x.lineWidth=1;x.strokeRect(b.x,b.y+camY,b.w,26);
  });
  x.fillStyle=H.C.wasabi;x.fillRect(cur.x,cur.y+camY,cur.w,26);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(cur.x,cur.y+camY,cur.w,26);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("ANDAR "+stack.length,12,20);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over)build();},false);
build();
}});
