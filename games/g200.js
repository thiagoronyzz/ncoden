/* NCODE N · 200 Pulo Rítmico — 20 pulos no beat! */
GREG(200,{
init(root,H){
let over=false,t=0,gaps=[],jumped=0,lives=3,px=60,py=0,vy=0,jumpA=0;
const hud=H.hud(root,[["pu","PULOS","0/20"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Aperte <b>PULAR</b> (ou Espaço/toque) quando o marcador chegar na <b>zona verde</b>! 20 pulos, 3 vidas.");
const o=H.cvs(root,520,320),x=o.x;
for(let i=0;i<20;i++)gaps.push({t:1.5+i*0.62,hit:0});
function jump(){
  if(over)return;
  const g=gaps.find(k=>!k.hit&&Math.abs(k.t-t)<0.22);
  if(g){
    g.hit=1;jumped++;jumpA=1;vy=-300;
    H.score(jumped*25);hud.set("pu",jumped+"/20");hud.set("sc",jumped*25);H.sfx("ok");
    if(jumped>=20){over=true;return H.done({win:true,score:600,title:"Parkour musical!",sub:"20 pulos cravados no beat."});}
  }else{
    lives--;hud.set("vd",lives);H.sfx("bad");
    if(lives<=0){over=true;return H.done({win:false,score:jumped*25,title:"Tropeçou!",sub:jumped+"/20. Pule só na zona verde!"});}
  }
}
H.btn(root,"↑ PULAR!",jump,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")jump();});
H.onTap(o,()=>jump());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  gaps.forEach(g=>{
    if(!g.hit&&t>g.t+0.22){
      g.hit=-1;lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;H.done({win:false,score:jumped*25,title:"Tropeçou!",sub:jumped+"/20 pulos."});}
    }
  });
  if(over)return;
  jumpA=Math.max(0,jumpA-dt*3);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,240,o.W,80);
  const nx=gaps.find(g=>!g.hit);
  // corredor
  const run=(t*120)%o.W;
  x.font="30px serif";
  x.fillText("i:run",60,232-jumpA*60);
  // linha de tempo
  x.fillStyle=H.C.card;x.fillRect(40,60,o.W-80,40);
  x.fillStyle=H.C.ok;x.fillRect(o.W/2-30,60,60,40);
  gaps.forEach(g=>{
    if(g.hit)return;
    const gx=o.W/2+(g.t-t)*220;
    if(gx<40||gx>o.W-40)return;
    x.fillStyle=H.C.terra;
    x.beginPath();x.arc(gx,80,12,0,7);x.fill();
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("pule quando a bolinha entrar no verde!",130,130);
});
}});
