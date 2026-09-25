/* NCODE N · 168 Pouso de Foguete — pouse suave no alvo */
GREG(168,{
init(root,H){
const LV=[{wind:0,pad:90},{wind:26,pad:60}];
let lv=0,over=false,r={},thrust=false,left=false,right=false;
const hud=H.hud(root,[["nv","NÍVEL","1/2"],["cb","COMBUSTÍVEL",100],["vv","VEL",0]]);
const say=H.msg(root,"<b>↑/W</b> motor · <b>←→/AD</b> inclinar. Pouse na ■ plataforma devagar (&lt;50) e reto! Toque: segure os botões.");
const o=H.cvs(root,500,420),x=o.x;
function build(){
  r={x:o.W/2+(Math.random()-.5)*160,y:50,vx:(Math.random()-.5)*30,vy:0,a:0,fuel:100};
  thrust=left=right=false;
  hud.set("nv",(lv+1)+"/2");
  say("Nível "+(lv+1)+(LV[lv].wind?": vento → "+LV[lv].wind+"!":"")+(" Pouse na plataforma!"));
}
build();
const kb=H.keys();
kb.on((c,d)=>{
  if(c==="ArrowUp"||c==="KeyW")thrust=d;
  if(c==="ArrowLeft"||c==="KeyA")left=d;
  if(c==="ArrowRight"||c==="KeyD")right=d;
});
function holdBtn(label,set){
  const b=H.el("button","g-btn ghost",label,root);
  b.addEventListener("pointerdown",e=>{e.preventDefault();set(true);});
  b.addEventListener("pointerup",()=>set(false));
  b.addEventListener("pointerleave",()=>set(false));
}
const brow=H.el("div","g-row",null,root);
holdBtn("◀",v=>left=v);
holdBtn("",v=>thrust=v);
holdBtn("▶",v=>right=v);
const PADY=o.H-40,PADX=o.W/2;
H.loop(dt=>{
  if(over)return;
  const L=LV[lv];
  if(left)r.a-=1.8*dt;
  if(right)r.a+=1.8*dt;
  r.a=H.clamp(r.a,-0.6,0.6);
  if(thrust&&r.fuel>0){
    r.fuel-=dt*22;
    r.vx+=Math.sin(r.a)*130*dt;
    r.vy-=Math.cos(r.a)*130*dt;
    if(Math.random()<dt*20)H.sfx("tick");
  }
  r.vy+=60*dt;r.vx+=L.wind*dt*.4;
  r.x+=r.vx*dt;r.y+=r.vy*dt;
  if(r.x<10){r.x=10;r.vx=0;}if(r.x>o.W-10){r.x=o.W-10;r.vx=0;}
  hud.set("cb",Math.max(0,Math.floor(r.fuel)));
  hud.set("vv",Math.floor(Math.hypot(r.vx,r.vy)));
  const onPad=Math.abs(r.x-PADX)<L.pad/2;
  if(r.y>=PADY-14){
    const sp=Math.hypot(r.vx,r.vy);
    if(onPad&&sp<50&&Math.abs(r.a)<0.25){
      H.sfx("ok");H.score((lv+1)*150+Math.floor(r.fuel));
      lv++;
      if(lv>=LV.length){over=true;return H.done({win:true,score:450,title:"Pouso perfeito!",sub:"2 missões sem amassar o foguete."});}
      say("Pouso suave! Nível 2: vento e plataforma menor.");build();return;
    }
    over=true;H.sfx("lose");
    return H.done({win:false,score:lv*150,title:!onPad?"Fora da plataforma!":sp>=50?"Impacto forte!":"Torto demais!",sub:"Desça <50 de velocidade, reto e no verde."});
  }
  if(r.y<0){r.y=0;r.vy=0;}
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";
  for(let i=0;i<40;i++){const sx=(i*97)%o.W,sy=(i*61)%280;x.fillRect(sx,sy,2,2);}
  x.fillStyle="#8A877C";x.fillRect(0,PADY,o.W,o.H-PADY);
  x.fillStyle=H.C.ok;x.fillRect(PADX-L.pad/2,PADY-6,L.pad,6);
  x.save();x.translate(r.x,r.y);x.rotate(r.a);
  if(thrust&&r.fuel>0){
    x.fillStyle="#E8A33D";
    x.beginPath();x.moveTo(-6,14);x.lineTo(0,30+Math.random()*10);x.lineTo(6,14);x.fill();
  }
  x.fillStyle="#E4D5B5";x.fillRect(-8,-14,16,28);
  x.fillStyle=H.C.terra;
  x.beginPath();x.moveTo(-8,-14);x.lineTo(0,-26);x.lineTo(8,-14);x.fill();
  x.fillStyle="#2E6E8A";x.beginPath();x.arc(0,-4,4,0,7);x.fill();
  x.restore();
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("vx "+r.vx.toFixed(0)+" vy "+r.vy.toFixed(0)+" ang "+(r.a*57).toFixed(0)+"°",12,20);
});
}});
