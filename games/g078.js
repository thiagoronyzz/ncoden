/* NCODE N · 078 Reação em Cadeia — um toque, tudo estoura */
GREG(78,{
init(root,H){
const LV=[{n:22,taps:3,quota:10},{n:25,taps:2,quota:15},{n:28,taps:1,quota:18}];
let lv=0,over=false,dots,bangs,left,popped;
const hud=H.hud(root,[["nv","NÍVEL",1],["tq","TOQUES",3],["pp","ESTOUROS",0]]);
const say=H.msg(root,"Toque para detonar uma <b>bolha expansiva</b>. Bolhas tocam bolas e encadeiam. Bata a meta de estouros!");
const o=H.cvs(root,500,400),x=o.x;
function build(){
  const L=LV[lv],r=H.rng(900+lv*31);
  dots=[];bangs=[];popped=0;left=L.taps;
  for(let i=0;i<L.n;i++)dots.push({x:30+r()*440,y:30+r()*340,
    vx:(r()-.5)*90,vy:(r()-.5)*90,r:9});
  hud.set("nv",lv+1);hud.set("tq",left);hud.set("pp","0/"+L.quota);
  say("Nível "+(lv+1)+": "+L.taps+" toques para "+L.quota+" estouros em "+L.n+" bolas.");
}
build();
H.onTap(o,(px,py)=>{
  if(over||left<=0)return;
  left--;hud.set("tq",left);
  bangs.push({x:px,y:py,r:4,grow:true});
  H.sfx("pop");
});
H.loop(dt=>{
  if(over)return;
  for(const d of dots){
    d.x+=d.vx*dt;d.y+=d.vy*dt;
    if(d.x<12||d.x>o.W-12)d.vx*=-1;
    if(d.y<12||d.y>o.H-12)d.vy*=-1;
  }
  for(const b of bangs){
    if(b.grow){b.r+=70*dt;if(b.r>46)b.grow=false;}
    else b.r-=40*dt;
  }
  bangs=bangs.filter(b=>b.r>1);
  for(let i=dots.length-1;i>=0;i--){
    const d=dots[i];
    if(bangs.some(b=>Math.hypot(b.x-d.x,b.y-d.y)<b.r+d.r)){
      dots.splice(i,1);popped++;
      bangs.push({x:d.x,y:d.y,r:6,grow:true});
      H.beep(400+popped*20,.06,"square",.04);
      hud.set("pp",popped+"/"+LV[lv].quota);
    }
  }
  if(!bangs.length&&left>=0&&dots.length){
    if(popped>=LV[lv].quota){
      H.sfx("ok");const sc=(lv+1)*120+popped*5;H.score(sc);
      if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+150,title:"Reação total!",sub:"3 detonações em cadeia acima da meta."});}
      lv++;build();
    }else if(left<=0){
      over=true;return H.done({win:false,score:popped*5,title:"Cadeia fraca",sub:popped+"/"+LV[lv].quota+" estouros. Mire onde as bolas se juntam!"});
    }
  }
  if(!dots.length&&!over){
    H.sfx("ok");const sc=(lv+1)*120+popped*5+100;H.score(sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc,title:"Tabuleiro limpo!",sub:"Todas as bolas estouradas em cadeia."});}
    lv++;build();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(const b of bangs){
    x.strokeStyle=H.C.terra;x.lineWidth=3;
    x.beginPath();x.arc(b.x,b.y,Math.max(1,b.r),0,7);x.stroke();
    x.fillStyle="rgba(217,78,52,.15)";
    x.beginPath();x.arc(b.x,b.y,Math.max(1,b.r),0,7);x.fill();
  }
  for(const d of dots){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(d.x,d.y,d.r,0,7);x.fill();
    x.fillStyle=H.C.wasabi;x.beginPath();x.arc(d.x,d.y,d.r-4,0,7);x.fill();
  }
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
}});
