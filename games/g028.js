/* NCODE N · 028 Constelação — repita a ordem das estrelas */
GREG(28,{
init(root,H){
let round=0,over=false,seq=[],show=[],input=[],lives=2,tLeft=0,phase="show";
const hud=H.hud(root,[["rd","RODADA","1/5"],["vd","VIDAS",2],["sc","PONTOS",0]]);
const say=H.msg(root,"Memorize a ordem em que as estrelas <b>piscam</b> e repita clicando antes do tempo.");
const o=H.cvs(root,480,400),x=o.x;
let stars=[];
function build(){
  const r=H.rng(200+round*31);
  stars=[];
  for(let i=0;i<7;i++)stars.push({x:50+r()*380,y:50+r()*300});
  const len=3+round;
  seq=[];for(let i=0;i<len;i++)seq.push(Math.floor(r()*7));
  input=[];phase="show";show=seq.slice();
  tLeft=6+len*1.5;
  hud.set("rd",(round+1)+"/5");
  say("Observe a sequência…");
  const T=H.every(650,()=>{
    if(!show.length){clearInterval(T);phase="input";say("Sua vez! Repita a ordem.");return;}
    const s=show.shift();stars[s].flash=1;H.beep(500+s*60,.15,"sine",.05);
  });
}
H.onTap(o,(px,py)=>{
  if(over||phase!=="input")return;
  let best=-1,bd=1e9;
  stars.forEach((s,i)=>{const d=Math.hypot(s.x-px,s.y-py);if(d<30&&d<bd){bd=d;best=i;}});
  if(best<0)return;
  stars[best].flash=1;H.beep(500+best*60,.12,"sine",.05);
  input.push(best);
  const k=input.length-1;
  if(input[k]!==seq[k]){
    lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:round*80,title:"Céu nublado",sub:"A sequência se perdeu na rodada "+(round+1)+"."});}
    say("Ordem errada! Vidas: "+lives+". Veja de novo…");
    phase="show";show=seq.slice();input=[];
    const T=H.every(650,()=>{
      if(!show.length){clearInterval(T);phase="input";say("Sua vez!");return;}
      const s=show.shift();stars[s].flash=1;
    });
    return;
  }
  if(input.length>=seq.length){
    phase="wait";
    const sc=(round+1)*90+Math.round(tLeft)*5;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    round++;
    if(round>=5){over=true;return H.done({win:true,score:sc+100,title:"Cartógrafo do céu!",sub:"5 constelações traçadas na ordem exata."});}
    say("Perfeito! Próxima constelação…");H.after(800,build);
  }
});
H.loop(dt=>{
  if(phase==="input"&&!over){
    tLeft-=dt;
    if(tLeft<=0){over=true;return H.done({win:false,score:round*80,title:"Tempo esgotado",sub:"As estrelas se apagaram antes da resposta."});}
    H.time(tLeft.toFixed(1)+"s");
  }
  x.fillStyle="#14161c";x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.terra;x.lineWidth=2;
  for(let i=1;i<input.length;i++){
    if(input[i-1]==null||input[i]==null)continue;
    x.beginPath();x.moveTo(stars[input[i-1]].x,stars[input[i-1]].y);x.lineTo(stars[input[i]].x,stars[input[i]].y);x.stroke();
  }
  stars.forEach((s,i)=>{
    if(s.flash>0)s.flash-=dt*2;
    const f=Math.max(0,s.flash||0);
    x.fillStyle=f>0?"#fff":H.C.gold;
    x.beginPath();x.arc(s.x,s.y,f>0?11:6,0,7);x.fill();
    if(f>0){x.strokeStyle=H.C.wasabi;x.lineWidth=3;x.beginPath();x.arc(s.x,s.y,15,0,7);x.stroke();}
  });
  if(phase==="input"){
    x.fillStyle=H.C.terra;x.fillRect(20,o.H-18,(o.W-40)*Math.max(0,tLeft/12),8);
  }
});
build();
}});
