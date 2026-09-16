/* NCODE N · 020 Ímã Empurrão — guie a bola de metal com o ímã */
GREG(20,{
init(root,H){
const LV=[
 {walls:[[200,120,24,160]],holes:[[400,300]],goal:[470,80],start:[60,300]},
 {walls:[[150,0,24,220],[330,140,24,220]],holes:[[240,300],[420,200]],goal:[470,320],start:[60,60]},
 {walls:[[0,180,320,24],[200,180,320,24]],holes:[[260,80],[260,280]],goal:[470,60],start:[40,320]}
];
let lv=0,over=false,deaths=0,t0=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["qd","QUEDAS",0],["md","MODO","ATRAIR"]]);
const say=H.msg(root,"Mova o <b>ímã</b> (mouse/toque). Botão ou Espaço alterna <b>atrair/repelir</b>. Leve a bola ● ao ◉ sem cair.");
const o=H.cvs(root,520,360),x=o.x;
const ptr=H.ptr(o);
let bx,by,vx,vy,pol=1;
function load(){
  const L=LV[lv];
  bx=L.start[0];by=L.start[1];vx=0;vy=0;
  hud.set("nv",lv+1);
  if(lv===0)t0=performance.now();
}
function toggle(){pol*=-1;hud.set("md",pol>0?"ATRAIR":"REPELIR");H.sfx("tick");}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")toggle();});
H.btn(root,"🧲 Alternar: atrair / repelir",toggle,false);
function circleRect(cx,cy,r,rc){
  const nx=H.clamp(cx,rc[0],rc[0]+rc[2]),ny=H.clamp(cy,rc[1],rc[1]+rc[3]);
  const dx=cx-nx,dy=cy-ny,d=Math.hypot(dx,dy);
  if(d<r){
    if(d===0)return;
    const push=(r-d);
    bx+=dx/d*push;by+=dy/d*push;
    const vn=(vx*dx+vy*dy)/d;
    if(vn<0){vx-=1.6*vn*dx/d;vy-=1.6*vn*dy/d;}
  }
}
H.loop(dt=>{
  if(over)return;
  const L=LV[lv];
  const dx=ptr.x-bx,dy=ptr.y-by,d=Math.max(30,Math.hypot(dx,dy));
  const F=pol*26000/(d*d)*60;
  vx+=dx/d*F*dt;vy+=dy/d*F*dt;
  vx*=0.985;vy*=0.985;
  vx=H.clamp(vx,-320,320);vy=H.clamp(vy,-320,320);
  bx+=vx*dt;by+=vy*dt;
  bx=H.clamp(bx,12,o.W-12);by=H.clamp(by,12,o.H-12);
  for(const w of L.walls)circleRect(bx,by,10,w);
  for(const h of L.holes){
    if(Math.hypot(bx-h[0],by-h[1])<16){
      deaths++;hud.set("qd",deaths);H.sfx("bad");
      say("🕳️ A bola caiu! De volta ao início.");
      bx=L.start[0];by=L.start[1];vx=0;vy=0;
    }
  }
  if(Math.hypot(bx-L.goal[0],by-L.goal[1])<18){
    H.sfx("ok");
    if(lv>=LV.length-1){
      over=true;
      const secs=Math.round((performance.now()-t0)/1000);
      const sc=Math.max(100,1200-secs*8-deaths*80);H.score(sc);
      return H.done({win:true,score:sc,title:"Metal sob controle!",sub:"3 labirintos em "+secs+"s com "+deaths+" quedas."});
    }
    lv++;say("Nível "+(lv+1)+": mais paredes, mais buracos.");load();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(4,4,o.W-8,o.H-8);
  x.fillStyle=H.C.ink;
  for(const w of L.walls)x.fillRect(w[0],w[1],w[2],w[3]);
  for(const h of L.holes){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(h[0],h[1],15,0,7);x.fill();
    x.fillStyle=H.C.paper;x.font="11px 'Space Mono',monospace";x.fillText("O",h[0]-4,h[1]+4);
  }
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(L.goal[0],L.goal[1],14,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.strokeStyle=pol>0?H.C.ok:H.C.terra;x.setLineDash([4,4]);
  x.beginPath();x.moveTo(bx,by);x.lineTo(ptr.x,ptr.y);x.stroke();x.setLineDash([]);
  x.font="20px serif";x.fillText(pol>0?"🧲":"🧲",ptr.x-10,ptr.y-14);
  const gr=x.createRadialGradient(bx-3,by-3,1,bx,by,11);
  gr.addColorStop(0,"#fff");gr.addColorStop(1,"#8A877C");
  x.fillStyle=gr;x.beginPath();x.arc(bx,by,10,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.stroke();
});
load();
}});
