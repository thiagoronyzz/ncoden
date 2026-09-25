/* NCODE N · 128 Barco de Pesca — $120 no cais */
GREG(128,{
init(root,H){
const FISH=[{e:"i:fish",v:8},{e:"i:fish",v:15},{e:"i:octopus",v:25}];
let over=false,bx=250,dir=0,fish=[],hold=[],cool=0,time=150,net=null;
const hud=H.hud(root,[["cx","CAIXA","$0/120"],["po","PORÃO","0/10"],["tp","TEMPO",150]]);
const say=H.msg(root,"<b>←/→ ou A/D</b> (ou toque nas laterais) para navegar. <b>Rede</b> pesca em volta! Venda no cais (esquerda).");
const o=H.cvs(root,500,360),x=o.x;
let cash=0;
const r=H.rng(4);
for(let i=0;i<10;i++)fish.push({x:r()*500,y:150+r()*180,v:20+r()*30,k:Math.floor(r()*3),d:r()<.5?1:-1});
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowLeft"||c==="KeyA")dir=d?-1:(dir===-1?0:dir);
  if(c==="ArrowRight"||c==="KeyD")dir=d?1:(dir===1?0:dir);
});
H.onTap(o,(px,py)=>{dir=px<o.W/2?-1:1;H.after(400,()=>dir=0);});
H.btn(root,"Lançar rede (3s)",()=>{
  if(over||cool>0||hold.length>=10)return;
  cool=3;net={x:bx,t:.5};H.sfx("tick");
  fish.forEach(f=>{
    if(hold.length>=10)return;
    if(Math.hypot(f.x-bx,f.y-200)<90&&Math.random()<.7){
      hold.push(f.k);f.x=Math.random()*500;f.y=150+Math.random()*180;
      H.sfx("pop");
    }
  });
  hud.set("po",hold.length+"/10");
},false);
H.btn(root,"Vender no cais",()=>{
  if(over||!hold.length)return;
  if(bx>90){H.sfx("bad");say("Navegue até o cais (esquerda)!");return;}
  hold.forEach(k=>cash+=FISH[k].v);
  hold=[];H.score(cash);hud.set("cx","$"+cash+"/120");hud.set("po","0/10");H.sfx("ok");
  if(cash>=120){over=true;return H.done({win:true,score:cash,title:"Pescador lendário!",sub:"$"+cash+" de peixe vendido no cais."});}
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Maré baixa!",sub:"$"+cash+"/120. Lulas valem $25!"});}
  bx=H.clamp(bx+dir*140*dt,30,o.W-30);
  fish.forEach(f=>{
    f.x+=f.v*f.d*dt;
    if(f.x<10){f.x=10;f.d=1;}if(f.x>o.W-10){f.x=o.W-10;f.d=-1;}
  });
  if(net){net.t-=dt;if(net.t<=0)net=null;}
  x.fillStyle="#7fb3d5";x.fillRect(0,0,o.W,120);
  x.fillStyle="#123a4d";x.fillRect(0,120,o.W,o.H-120);
  x.fillStyle="#5b3d20";x.fillRect(0,100,70,20);
  x.font="26px serif";x.fillText("i:factory",8,96);
  x.font="20px serif";
  fish.forEach(f=>x.fillText(FISH[f.k].e,f.x-10,f.y+8));
  x.font="34px serif";x.fillText("i:boat",bx-17,112);
  if(net){
    x.strokeStyle="#fff";x.lineWidth=2;
    x.beginPath();x.arc(net.x,200,90*(1-net.t),0,7);x.stroke();
  }
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("porão: "+(hold.map(k=>"$"+FISH[k].v).join(" + ")||"vazio"),12,o.H-10);
});
}});
