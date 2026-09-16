/* NCODE N · 077 Bolha Escudo — infle e ricocheteie */
GREG(77,{
init(root,H){
const LV=[{len:1400,gap:150},{len:1700,gap:130},{len:2000,gap:112}];
let lv=0,over=false,bx,by,vy,air,on,dist,spikes,lives=3,sc=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["ar","AR",100],["vd","VIDAS",3]]);
const say=H.msg(root,"<b>Segure toque/Espaço</b> para inflar a bolha (gasta ar). Com bolha, espinhos <b>ricocheteiam</b>; sem bolha, machucam!");
const o=H.cvs(root,520,340),x=o.x;
const ptr=H.ptr(o);const kb=H.keys();
let held=false;
function build(){
  bx=90;by=o.H/2;vy=0;air=100;dist=0;spikes=[];
  const L=LV[lv],r=H.rng(300+lv*55);
  for(let d=300;d<L.len;d+=170+r()*120){
    const top=r()<.5,sz=26+r()*20;
    const gy=top?0:o.H-sz;
    spikes.push({d,top,sz,gap:L.gap});
    if(r()<.4)spikes.push({d:d+90,top:!top,sz:26,gap:L.gap});
  }
  hud.set("nv",lv+1);hud.set("vd",lives);
}
build();
kb.on((c,d)=>{if(c==="Space")held=d;});
H.loop(dt=>{
  if(over)return;
  on=held||ptr.down;
  air=H.clamp(air+(on?-32:22)*dt,0,100);
  hud.set("ar",Math.round(air));
  const bub=on&&air>0;
  vy+=bub?-200*dt:500*dt;vy=H.clamp(vy,-260,300);
  if(kb.is("ArrowUp"))vy-=700*dt;
  if(kb.is("ArrowDown"))vy+=700*dt;
  by+=vy*dt;dist+=150*dt;
  by=H.clamp(by,20,o.H-20);
  for(const s of spikes){
    const sx=s.d-dist;
    if(sx>bx-70&&sx<bx+20){
      const hitY=s.top?by<s.sz+16:by>o.H-s.sz-16;
      if(hitY){
        if(bub){vy=s.top?260:-260;bx+=14;air=Math.max(0,air-18);H.sfx("pop");}
        else{
          lives--;hud.set("vd",lives);H.sfx("bad");by=o.H/2;vy=0;
          if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Bolha furada!",sub:"Nível "+(lv+1)+". Infle antes dos espinhos!"});}
          say("Espinho! Vidas: "+lives);
          break;
        }
      }
    }
  }
  sc=Math.floor(dist/10)+(lv*200);H.score(sc);
  if(dist>=LV[lv].len){
    H.sfx("ok");
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Travessia blindada!",sub:"3 corredores de espinhos ricocheteados."});}
    lv++;say("Nível "+(lv+1)+": corredor mais estreito!");build();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.cement;x.fillRect(0,0,o.W,14);x.fillRect(0,o.H-14,o.W,14);
  for(const s of spikes){
    const sx=s.d-dist;
    if(sx<-40||sx>o.W+40)continue;
    x.fillStyle=H.C.ink;
    if(s.top){x.beginPath();x.moveTo(sx,s.sz);x.lineTo(sx+18,s.sz);x.lineTo(sx+9,0);x.closePath();x.fill();}
    else{x.beginPath();x.moveTo(sx,o.H-s.sz);x.lineTo(sx+18,o.H-s.sz);x.lineTo(sx+9,o.H);x.closePath();x.fill();}
  }
  if(bub){
    x.fillStyle="rgba(46,110,138,.3)";x.beginPath();x.arc(bx,by,24,0,7);x.fill();
    x.strokeStyle="#2E6E8A";x.lineWidth=2;x.stroke();
  }
  x.fillStyle=H.C.terra;x.beginPath();x.arc(bx,by,12,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText(Math.floor(dist)+"m / "+LV[lv].len+"m",12,30);
});
H.btn(root,"↻ Recomeçar",()=>{if(!over){lives=3;build();}},false);
}});
