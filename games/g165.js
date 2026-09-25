/* NCODE N · 165 Barragem de Blocos — segure a água 60s */
GREG(165,{
init(root,H){
let over=false,stack=[0,0,0,0,0,0],water=0,time=60,cool=0,leak=0,wt=0;
const hud=H.hud(root,[["tp","TEMPO",60],["ag","NÍVEL",0],["vz","VAZAMENTOS","0/3"]]);
const say=H.msg(root,"Clique nas <b>colunas</b> para empilhar blocos! A água sobe 1 nível a cada 8s — coluna abaixo do nível = vazamento.");
const o=H.cvs(root,500,360),x=o.x;
const MAXL=8;
H.onTap(o,(px,py)=>{
  if(over||cool>0)return;
  const c=Math.floor(px/(o.W/6));
  if(c<0||c>5||stack[c]>=MAXL)return;
  stack[c]++;cool=.18;H.sfx("tick");
});
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;wt+=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(wt>=8){wt=0;water=Math.min(MAXL,water+1);hud.set("ag",water);H.sfx("bad");say("Água no nível "+water+"!");}
  // vazamento: coluna abaixo do nível tendo vizinho abaixo? qualquer coluna < nível
  let bad=stack.filter(s=>s<water).length;
  if(water>0&&bad>0){
    leak+=dt*bad*.5;
    hud.set("vz",Math.floor(leak)+"/3");
    if(leak>=3){over=true;H.sfx("lose");
      return H.done({win:false,score:Math.floor((60-time)*5),title:"Barragem rompeu!",sub:"Vazamentos demais. Tampe as colunas baixas!"});}
  }else leak=Math.max(0,leak-dt);
  if(time<=0){over=true;
    return H.done({win:true,score:300+stack.reduce((a,b)=>a+b,0)*5,title:"Barragem segura!",sub:"60 segundos sem romper."});}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const cw=o.W/6,lh=300/MAXL;
  for(let c=0;c<6;c++){
    for(let j=0;j<stack[c];j++){
      x.fillStyle=stack[c]<water?"#B06A4D":"#C98A3D";
      x.fillRect(c*cw+4,300-(j+1)*lh,cw-8,lh-2);
      x.strokeStyle=H.C.ink;x.strokeRect(c*cw+4,300-(j+1)*lh,cw-8,lh-2);
    }
  }
  x.fillStyle="rgba(46,110,138,.55)";
  x.fillRect(0,300-water*lh,o.W,water*lh);
  x.fillStyle="#fff";x.font="bold 13px 'Space Mono',monospace";
  if(water>0)x.fillText("NÍVEL "+water,10,300-water*lh+18);
  if(leak>0.3){x.fillStyle=H.C.terra;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("VAZANDO!",200,24);}
});
}});
