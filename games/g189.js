/* NCODE N · 189 Corda de Tarzan — atravesse o rio! */
GREG(189,{
init(root,H){
const ROPES=[{x:140,l:150},{x:300,y:0,l:170},{x:460,y:0,l:150}];
let over=false,ri=0,a=-1.1,va=1.5,mode="swing",fly=null,lives=3;
const hud=H.hud(root,[["cp","CIPÓ","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Balançe no cipó e aperte <b>SOLTAR (ou Espaço/toque)</b> no ponto certo! Alcance o próximo cipó ou a margem. 3 vidas!");
const o=H.cvs(root,540,400),x=o.x;
let sc=0;
const PLAT=[{x:0,w:80},{x:470,w:70}];
function anchor(){
  const R=ROPES[ri];
  return{x:R.x,y:40};
}
function pos(){
  const R=ROPES[ri],A=anchor();
  return{x:A.x+Math.sin(a)*R.l,y:A.y+Math.cos(a)*R.l};
}
function release(){
  if(over||mode!=="swing")return;
  const p=pos(),R=ROPES[ri];
  const v=va*R.l;
  let vx=Math.cos(a)*v,vy=-Math.sin(a)*v+40;
  const sp=Math.hypot(vx,vy)||1,cl=H.clamp(sp,280,480);
  vx=vx/sp*cl;vy=vy/sp*cl;
  fly={x:p.x,y:p.y,vx,vy};
  mode="fly";H.sfx("tick");
  say("Voando…");
}
H.btn(root,"🙌 SOLTAR!",release,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&(c==="Space"))release();});
H.onTap(o,()=>release());
H.loop(dt=>{
  if(over)return;
  if(mode==="swing"){
    va+=(-9.8/ROPES[ri].l*Math.sin(a))*dt*3;
    va*=0.999;a+=va*dt*3;
    if(Math.abs(va)<.05)va+=.12*dt*(a>0?-1:1);
  }else if(fly){
    fly.vy+=700*dt;fly.x+=fly.vx*dt;fly.y+=fly.vy*dt;
    // pegou próximo cipó?
    const nx=ROPES[ri+1];
    if(nx&&Math.hypot(fly.x-nx.x,fly.y-190)<46){
      ri++;a=fly.vx>0?-0.9:0.9;va=fly.vx/ROPES[ri].l;
      mode="swing";fly=null;sc+=100;H.score(sc);hud.set("sc",sc);hud.set("cp",(ri+1)+"/3");
      H.sfx("ok");say("Pegou o cipó "+(ri+1)+"!");
    }else if(fly.y>330){
      if(fly.x>470){
        over=true;H.score(sc+200);
        return H.done({win:true,score:sc+300,title:"Rei da selva!",sub:"Atravessou os 3 cipós até a margem!"});
      }
      lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;
        return H.done({win:false,score:sc,title:"Banho de rio!",sub:"3 quedas. Solte subindo para a direita!"});
      }
      say("💦 Caiu! ("+lives+" vidas) Solte quando o cipó apontar →!");
      mode="swing";fly=null;a=-1.1;va=0;
    }else if(fly.x>o.W+30||fly.x<-30){
      lives--;hud.set("vd",lives);
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Voou longe!",sub:"Solte mais cedo."});}
      mode="swing";fly=null;a=-1.1;va=0;
    }
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#2E6E8A";x.fillRect(0,330,o.W,70);
  x.fillStyle=H.C.ok;x.fillRect(0,300,80,30);x.fillRect(470,300,70,30);
  x.fillStyle="#3E7C4F";x.fillRect(0,0,o.W,40);
  ROPES.forEach((R,i)=>{
    x.strokeStyle=i===ri?"#5b3d20":"rgba(0,0,0,.25)";x.lineWidth=4;
    if(i===ri&&mode==="swing"){
      const p=pos();
      x.beginPath();x.moveTo(R.x,40);x.lineTo(p.x,p.y);x.stroke();
      x.font="26px serif";x.fillText("🧍",p.x-13,p.y-4);
    }else if(i>ri){
      x.beginPath();x.moveTo(R.x,40);x.lineTo(R.x,40+R.l);x.stroke();
      x.strokeStyle=H.C.wasabi;x.lineWidth=2;
      x.beginPath();x.arc(R.x,190,46,0,7);x.stroke();
    }
  });
  if(fly){x.font="26px serif";x.fillText("🤸",fly.x-13,fly.y+8);}
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("solte subindo → para voar longe!",150,55);
});
}});
