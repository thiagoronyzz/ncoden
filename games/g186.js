/* NCODE N · 186 Derretimento de Gelo — salve o brinquedo! */
GREG(186,{
init(root,H){
const N=10;
let over=false,ice=[],src=[],toy={r:5,c:5},heat=0,time=90;
const hud=H.hud(root,[["tp","TEMPO",90],["br","BRINQUEDO","preso "],["tq","CALOR NO BRINQUEDO","0%"]]);
const say=H.msg(root,"Clique para plantar uma <b>fonte de calor</b> (3 no total; clique de novo para mover). Derreta o gelo ao redor do <b>brinquedo</b> — mas calor demais nele (100% por 3s) o derrete!");
const o=H.cvs(root,400,400),x=o.x;
const CS=36,OX=20,OY=20;
const r=H.rng(4);
for(let i=0;i<N*N;i++)ice.push(3);
src=[];
let over3=0;
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor((px-OX)/CS),rr=Math.floor((py-OY)/CS);
  if(c<0||c>=N||rr<0||rr>=N)return;
  const ix=src.findIndex(s=>s.c===c&&s.r===rr);
  if(ix>=0){src.splice(ix,1);H.sfx("tick");return;}
  if(src.length>=3){src.shift();}
  src.push({c,r:rr});H.sfx("tick");
});
function heatAt(c,rr){
  let h=0;
  src.forEach(s=>{
    const d=Math.hypot(s.c-c,s.r-rr);
    if(d<3.2)h+=Math.max(0,3.2-d);
  });
  return h;
}
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:0,title:"Congelou de novo!",sub:"O brinquedo segue preso. Cerque de calor!"});
  }
  for(let rr=0;rr<N;rr++)for(let c=0;c<N;c++){
    const k=rr*N+c;
    if(ice[k]>0&&heatAt(c,rr)>1.2)ice[k]=Math.max(0,ice[k]-dt*heatAt(c,rr)*.5);
  }
  const th=heatAt(toy.c,toy.r);
  heat=th>2.6?Math.min(100,heat+dt*34):Math.max(0,heat-dt*25);
  hud.set("tq",Math.floor(heat)+"%");
  if(heat>=100){over3+=dt;
    if(over3>3){over=true;H.sfx("lose");
      return H.done({win:false,score:0,title:"Brinquedo derretido!",sub:"Calor demais nele. Aqueça as bordas!"});
    }
  }else over3=0;
  // livre? 8 vizinhos derretidos
  let free=true;
  for(let dr=-1;dr<=1;dr++)for(let dc=-1;dc<=1;dc++){
    if(!dr&&!dc)continue;
    const nc=toy.c+dc,nr=toy.r+dr;
    if(nc<0||nc>=N||nr<0||nr>=N)continue;
    if(ice[nr*N+nc]>0.5)free=false;
  }
  if(free){over=true;H.score(300+Math.floor(time)*2);
    return H.done({win:true,score:300+Math.floor(time)*2,title:"Resgate gelado!",sub:"Brinquedo livre e intacto!"});
  }
  x.fillStyle="#0d2436";x.fillRect(0,0,o.W,o.H);
  for(let rr=0;rr<N;rr++)for(let c=0;c<N;c++){
    const v=ice[rr*N+c];
    x.fillStyle=v>2?"#7FB3D5":v>1?"#A8CCE4":v>0?"#D4E7F3":"rgba(255,255,255,.08)";
    x.fillRect(OX+c*CS+1,OY+rr*CS+1,CS-2,CS-2);
    if(heatAt(c,rr)>1.2&&v>0){
      x.fillStyle="rgba(217,78,52,.25)";
      x.fillRect(OX+c*CS+1,OY+rr*CS+1,CS-2,CS-2);
    }
  }
  x.font="22px serif";
  src.forEach(s=>x.fillText("i:flame",OX+s.c*CS+4,OY+s.r*CS+28));
  x.fillText("i:teddy",OX+toy.c*CS+4,OY+toy.r*CS+28);
});
}});
