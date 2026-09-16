/* NCODE N · 015 Equilíbrio de Pilha — empilhe sem tombar */
GREG(15,{
init(root,H){
let over=false,lives=3,stack=[],cur=null,sc=0,falling=[];
const hud=H.hud(root,[["pc","PEÇAS","0/6"],["lf","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste a peça <b>suspensa</b> e solte sobre a pilha. Se o centro de massa sair da base, tudo tomba!");
const o=H.cvs(root,520,380),x=o.x;
const ptr=H.ptr(o);
const BASE={x:150,y:330,w:220,h:16};
function newPiece(){
  const r=H.rng(Date.now()%100000+stack.length*97+Math.floor(Math.random()*999));
  cur={w:56+H.rf(r,0,44),h:24,x:o.W/2,y:60,held:true};
}
newPiece();
H.onTap(o,()=>{if(cur&&!over&&falling.length===0){cur.held=false;drop();}});
function drop(){
  if(!cur)return;
  let topY=BASE.y;
  for(const p of stack)topY=Math.min(topY,p.y);
  cur.y=topY-cur.h/2;cur.held=false;
  const below=stack.length?stack[stack.length-1]:{x:BASE.x+BASE.w/2,w:BASE.w};
  const overlap=Math.min(cur.x+cur.w/2,below.x+below.w/2)-Math.max(cur.x-cur.w/2,below.x-below.w/2);
  if(overlap<cur.w*0.25){
    H.sfx("bad");say("Sem apoio! A peça escorregou.");
    falling=[{x:cur.x,y:cur.y,w:cur.w,h:cur.h,vy:0,vx:cur.x<below.x?-120:120}];
    cur=null;H.after(900,()=>{falling=[];if(!over)newPiece();});
    return;
  }
  stack.push(cur);cur=null;H.sfx("ok");
  hud.set("pc",stack.length+"/6");
  // centro de massa
  let m=0,mx=0;
  for(const p of stack){const a=p.w*p.h;m+=a;mx+=p.x*a;}
  mx/=m;
  const bsup=stack[0];
  if(mx<bsup.x-bsup.w/2||mx>bsup.x+bsup.w/2){
    say("⚠️ O centro de massa saiu da base — <b>TOMBANDO</b>!");
    falling=stack.map((p,i)=>({x:p.x,y:p.y,w:p.w,h:p.h,vy:-60-i*10,vx:(mx<260?-1:1)*(60+i*22),rot:0}));
    stack=[];
    lives--;hud.set("lf",lives);H.sfx("lose");
    H.after(1200,()=>{
      falling=[];
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Pilha desabada",sub:"3 tombos. Centralize as peças mais largas embaixo."});}
      say("Restam "+lives+" vidas. Recomece a pilha com calma.");newPiece();
    });
    return;
  }
  sc+=50;H.score(sc);hud.set("sc",sc);
  if(stack.length>=6){over=true;return H.done({win:true,score:sc+150,title:"Torre em pé!",sub:"6 peças empilhadas sobre a plataforma."});}
  newPiece();
}
H.loop(dt=>{
  if(cur&&cur.held){cur.x=H.clamp(ptr.x,30,o.W-30);}
  for(const f of falling){f.vy+=900*dt;f.x+=f.vx*dt;f.y+=f.vy*dt;if(f.rot!=null)f.rot+=dt*3;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,346,o.W,34);
  x.fillStyle=H.C.ink;x.fillRect(BASE.x,BASE.y,BASE.w,BASE.h);
  x.fillStyle=H.C.wasabi;x.fillRect(BASE.x,BASE.y,BASE.w,4);
  const drawP=(p,col)=>{
    x.save();x.translate(p.x,p.y);if(p.rot)x.rotate(p.rot*.2);
    x.fillStyle=col;x.fillRect(-p.w/2,-p.h/2,p.w,p.h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-p.w/2,-p.h/2,p.w,p.h);
    x.restore();
  };
  stack.forEach((p,i)=>drawP(p,i%2?H.C.gold:H.C.card));
  falling.forEach(f=>drawP(f,H.C.terra));
  if(cur){x.setLineDash([5,5]);x.strokeStyle=H.C.ink3;
    x.beginPath();x.moveTo(cur.x,0);x.lineTo(cur.x,o.H);x.stroke();x.setLineDash([]);
    drawP(cur,H.C.wasabi);}
  if(stack.length){
    let m=0,mx=0;for(const p of stack){const a=p.w*p.h;m+=a;mx+=p.x*a;}mx/=m;
    const topY=stack.reduce((a,p)=>Math.min(a,p.y),BASE.y);
    x.fillStyle=H.C.terra;x.beginPath();x.arc(mx,topY-24,5,0,7);x.fill();
    x.strokeStyle=H.C.terra;x.setLineDash([4,4]);x.beginPath();x.moveTo(mx,topY-20);x.lineTo(mx,BASE.y);x.stroke();x.setLineDash([]);
  }
});
}});
