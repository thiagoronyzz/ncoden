/* NCODE N · 070 Tiro Ricochete — quique até o alvo */
GREG(70,{
init(root,H){
const LV=[
 {walls:[[200,120,24,180]],tgt:[420,80],ammo:3},
 {walls:[[140,200,220,22],[330,60,22,120]],tgt:[430,330],ammo:3},
 {walls:[[120,120,22,220],[120,120,240,22],[360,120,22,220]],tgt:[240,280],ammo:4},
 {walls:[[180,80,22,140],[180,220,220,22],[400,220,22,140]],tgt:[90,330],ammo:4},
 {walls:[[100,150,300,22],[100,150,22,180],[380,150,22,180]],tgt:[240,330],ammo:4}
];
const GUN=[60,360];
let lv=0,over=false,ammo=3,bullets=[];
const hud=H.hud(root,[["nv","NÍVEL",1],["bl","BALAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Mire com <b>mouse/toque</b>, <b>clique/Espaço</b> atira. A bala quica nas paredes e muros até 6 vezes!");
const o=H.cvs(root,500,420),x=o.x;
const ptr=H.ptr(o);
function build(){ammo=LV[lv].ammo;bullets=[];hud.set("nv",lv+1);hud.set("bl",ammo);}
build();
function shoot(){
  if(over||ammo<=0||bullets.length>0)return;
  ammo--;hud.set("bl",ammo);
  const a=Math.atan2(ptr.y-GUN[1],ptr.x-GUN[0]);
  bullets.push({x:GUN[0],y:GUN[1],vx:Math.cos(a)*460,vy:Math.sin(a)*460,b:0});
  H.beep(200,.12,"sawtooth",.06);
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")shoot();});
H.onTap(o,()=>shoot());
function bounceWalls(b){
  for(const w of LV[lv].walls){
    if(b.x>w[0]&&b.x<w[0]+w[2]&&b.y>w[1]&&b.y<w[1]+w[3]){
      const dl=Math.abs(b.x-w[0]),dr=Math.abs(b.x-w[0]-w[2]);
      const dt=Math.abs(b.y-w[1]),db=Math.abs(b.y-w[1]-w[3]);
      const m=Math.min(dl,dr,dt,db);
      if(m===dl||m===dr){b.vx*=-1;b.x+=m===dl?-3:3;}
      else{b.vy*=-1;b.y+=m===dt?-3:3;}
      b.b++;H.beep(300+b.b*60,.05);return true;
    }
  }
  return false;
}
H.loop(dt=>{
  if(over)return;
  for(let i=bullets.length-1;i>=0;i--){
    const b=bullets[i];
    b.x+=b.vx*dt;b.y+=b.vy*dt;
    if(b.x<10||b.x>o.W-10){b.vx*=-1;b.x=H.clamp(b.x,10,o.W-10);b.b++;H.beep(300,.05);}
    if(b.y<10||b.y>o.H-10){b.vy*=-1;b.y=H.clamp(b.y,10,o.H-10);b.b++;H.beep(300,.05);}
    bounceWalls(b);
    const t=LV[lv].tgt;
    if(Math.hypot(b.x-t[0],b.y-t[1])<20){
      bullets.splice(i,1);
      const sc=(lv+1)*120+ammo*30;H.score(sc);hud.set("sc",sc);H.sfx("ok");
      if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Ricochete certeiro!",sub:"5 alvos atrás de cobertura, todos atingidos."});}
      lv++;say("Nível "+(lv+1)+": cobertura mais traiçoeira.");build();return;
    }
    if(b.b>6){bullets.splice(i,1);
      if(ammo<=0){over=true;return H.done({win:false,score:lv*100,title:"Sem balas!",sub:"A bala morreu no nível "+(lv+1)+". Use os cantos!"});}
      say("Bala perdida. Restam "+ammo+".");
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(5,5,o.W-10,o.H-10);
  x.fillStyle=H.C.ink;
  for(const w of LV[lv].walls)x.fillRect(w[0],w[1],w[2],w[3]);
  const t=LV[lv].tgt;
  x.fillStyle=H.C.terra;x.beginPath();x.arc(t[0],t[1],18,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle="#fff";x.beginPath();x.arc(t[0],t[1],7,0,7);x.fill();
  const a=Math.atan2(ptr.y-GUN[1],ptr.x-GUN[0]);
  x.save();x.translate(GUN[0],GUN[1]);x.rotate(a);
  x.fillStyle=H.C.ink;x.fillRect(0,-5,34,10);
  x.fillStyle=H.C.wasabi;x.fillRect(28,-3,8,6);
  x.restore();
  x.setLineDash([4,5]);x.strokeStyle=H.C.cement;
  x.beginPath();x.moveTo(GUN[0],GUN[1]);x.lineTo(GUN[0]+Math.cos(a)*60,GUN[1]+Math.sin(a)*60);x.stroke();
  x.setLineDash([]);
  for(const b of bullets){
    x.fillStyle=H.C.gold;x.beginPath();x.arc(b.x,b.y,5,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.stroke();
  }
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
}});
