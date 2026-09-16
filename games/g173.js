/* NCODE N · 173 Terremoto — derrube só as fracas! */
GREG(173,{
init(root,H){
let over=false,builds=[],mag=0,charging=false,tries=3,shake=0;
const hud=H.hud(root,[["tt","TENTATIVAS",3],["mg","MAGNITUDE","0.0"],["sc","PONTOS",0]]);
const say=H.msg(root,"SEGURE para carregar (0→10) e SOLTE! 🏚️ fracas caem com 4+ · 🏢 fortes caem com 8.5+. Derrube as 2 fracas mantendo as 3 fortes!");
const o=H.cvs(root,520,340),x=o.x;
builds=[
  {x:60,w:70,h:150,weak:true,down:false,tilt:0},
  {x:150,w:80,h:200,weak:false,down:false,tilt:0},
  {x:250,w:60,h:120,weak:true,down:false,tilt:0},
  {x:330,w:80,h:230,weak:false,down:false,tilt:0},
  {x:425,w:65,h:170,weak:false,down:false,tilt:0}
];
const btn=H.el("button","g-btn","SEGURE: CARREGAR TREMOR",root);
btn.addEventListener("pointerdown",e=>{e.preventDefault();if(!over&&tries>0)charging=true;});
btn.addEventListener("pointerup",quake);
btn.addEventListener("pointerleave",()=>{if(charging)quake();});
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="Space"){
    if(d&&!over&&tries>0)charging=true;
    if(!d&&charging)quake();
  }
});
function quake(){
  if(!charging||over)return;
  charging=false;tries--;hud.set("tt",tries);
  shake=mag*2;H.sfx("bad");
  builds.forEach(b=>{
    if(b.down)return;
    if(b.weak&&mag>=4){b.down=true;b.tilt=(Math.random()<.5?-1:1);}
    if(!b.weak&&mag>=8.5){b.down=true;b.tilt=(Math.random()<.5?-1:1);}
  });
  const weakDown=builds.filter(b=>b.weak&&b.down).length;
  const strongDown=builds.filter(b=>!b.weak&&b.down).length;
  H.score(weakDown*100);hud.set("sc",weakDown*100);
  if(strongDown>0){over=true;
    return H.done({win:false,score:weakDown*100,title:"Tragédia!",sub:"Um prédio forte caiu (mag "+mag.toFixed(1)+"). Mire 4–8!"});
  }
  if(weakDown>=2){over=true;
    return H.done({win:true,score:200+tries*50,title:"Demolição sísmica!",sub:"Só as fracas caíram. Precisão de engenheiro!"});
  }
  if(tries<=0){over=true;
    return H.done({win:false,score:weakDown*100,title:"Tremor fraco!",sub:"Faltaram fracas em pé. Carregue até 4+!"});
  }
  say("Mag "+mag.toFixed(1)+": fracas "+weakDown+"/2. "+tries+" tentativa(s)!");
  mag=0;
}
H.loop(dt=>{
  if(charging&&!over){
    mag+=dt*3.2;
    if(mag>10)mag=0;
    hud.set("mg",mag.toFixed(1));
  }
  if(shake>0)shake-=dt*8;
  builds.forEach(b=>{if(b.down&&Math.abs(b.tilt)<1.4)b.tilt+=Math.sign(b.tilt)*dt*1.5;});
  const sx=shake>0?(Math.random()-.5)*shake:0;
  x.save();x.translate(sx,0);
  x.fillStyle=H.C.paper;x.fillRect(-20,0,o.W+40,o.H);
  x.fillStyle="#8A877C";x.fillRect(-20,300,o.W+40,40);
  builds.forEach(b=>{
    x.save();
    x.translate(b.x+b.w/2,300);x.rotate(b.tilt*.5);
    x.fillStyle=b.weak?"#C9A06F":"#7A8A99";
    x.fillRect(-b.w/2,-b.h,b.w,b.h);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(-b.w/2,-b.h,b.w,b.h);
    x.fillStyle="rgba(255,255,255,.5)";
    for(let wy=-b.h+10;wy<-10;wy+=24)for(let wx=-b.w/2+6;wx<b.w/2-6;wx+=16)x.fillRect(wx,wy,9,12);
    x.restore();
    x.font="18px serif";
    x.fillText(b.weak?"🏚️":"🏢",b.x+b.w/2-9,296-b.h-4);
  });
  x.restore();
  x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";
  x.fillText("MAG "+mag.toFixed(1),12,24);
  x.fillStyle=H.C.terra;x.fillRect(12,30,200*mag/10,10);
  x.strokeStyle=H.C.ink;x.strokeRect(12,30,200,10);
  x.fillStyle=H.C.ok;x.fillRect(12+200*4/10,30,200*4.5/10,10);
});
}});
