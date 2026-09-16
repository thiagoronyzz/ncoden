/* NCODE N · 110 Aquário Equilibrado — alimente e limpe */
GREG(110,{
init(root,H){
let over=false,fish=[],food=[],dirt=10,time=60,cool=0;
const hud=H.hud(root,[["px","PEIXES","5/5"],["sj","SUJEIRA","10%"],["tp","TEMPO",60]]);
const say=H.msg(root,"<b>🍤 Ração</b> afunda e os peixes caçam. <b>🧹 Limpar</b> tira sujeira (recarrega). Fome zerada ou sujeira 100% = morte!");
const o=H.cvs(root,500,360),x=o.x;
const cols=["#E8A33D","#D94E34","#7fb3d5","#C4D645","#E86AA0"];
for(let i=0;i<5;i++)fish.push({x:60+Math.random()*380,y:80+Math.random()*200,vx:40*(Math.random()<.5?-1:1),hung:80,c:cols[i]});
H.btn(root,"🍤 Jogar ração",()=>{
  if(over)return;
  food.push({x:40+Math.random()*420,y:10});H.sfx("tick");
  if(food.length>12)food.shift();
},false);
H.btn(root,"🧹 Limpar (+rec. 8s)",()=>{
  if(over||cool>0)return;
  cool=8;dirt=Math.max(0,dirt-45);H.sfx("ok");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;dirt=Math.min(100,dirt+dt*1.6);
  hud.set("tp",Math.max(0,Math.ceil(time)));hud.set("sj",Math.floor(dirt)+"%");
  food.forEach(f=>f.y+=40*dt);
  food=food.filter(f=>f.y<o.H-10);
  for(const f of fish){
    let tgt=null,bd=1e9;
    food.forEach(g=>{const d=Math.hypot(g.x-f.x,g.y-f.y);if(d<bd){bd=d;tgt=g;}});
    if(tgt){f.vx+=(tgt.x>f.x?160:-160)*dt;f.y+=(tgt.y-f.y)*2*dt;}
    else{f.vx+=(Math.random()-.5)*60*dt;f.y+=(Math.random()-.5)*30*dt;}
    f.vx=H.clamp(f.vx,-70,70);f.x+=f.vx*dt;
    if(f.x<20){f.x=20;f.vx=Math.abs(f.vx);}if(f.x>o.W-20){f.x=o.W-20;f.vx=-Math.abs(f.vx);}
    f.y=H.clamp(f.y,30,o.H-30);
    f.hung-=dt*(2+dirt*.03);
    for(let i=food.length-1;i>=0;i--){
      if(Math.hypot(food[i].x-f.x,food[i].y-f.y)<16){food.splice(i,1);f.hung=Math.min(100,f.hung+25);H.sfx("pop");}
    }
  }
  for(let i=fish.length-1;i>=0;i--){
    if(fish[i].hung<=0||dirt>=100){fish.splice(i,1);H.sfx("bad");say("🐟 Um peixe não resistiu!");}
  }
  hud.set("px",fish.length+"/5");
  if(fish.length<4){over=true;H.sfx("lose");
    return H.done({win:false,score:0,title:"Aquário vazio!",sub:"Menos de 4 peixes. Alimente e limpe sem parar!"});}
  if(time<=0){over=true;const sc=fish.length*60+Math.floor(100-dirt);
    return H.done({win:true,score:sc,title:"Ecossistema estável!",sub:fish.length+"/5 peixes após 60s."});}
  x.fillStyle="#123a4d";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="rgba(120,90,40,"+(dirt/220)+")";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#c9b98f";x.fillRect(0,o.H-14,o.W,14);
  x.fillStyle="#5b3d20";
  food.forEach(f=>{x.beginPath();x.arc(f.x,f.y,4,0,7);x.fill();});
  for(const f of fish){
    x.save();x.translate(f.x,f.y);x.scale(f.vx>=0?1:-1,1);
    x.fillStyle=f.c;
    x.beginPath();x.ellipse(0,0,16,9,0,0,7);x.fill();
    x.beginPath();x.moveTo(-14,0);x.lineTo(-24,-8);x.lineTo(-24,8);x.closePath();x.fill();
    x.fillStyle="#000";x.beginPath();x.arc(6,-2,2,0,7);x.fill();
    x.restore();
    x.fillStyle=f.hung>30?H.C.ok:H.C.terra;
    x.fillRect(f.x-14,f.y-20,28*(f.hung/100),4);
  }
  if(cool>0){x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";x.fillText("limpeza em "+Math.ceil(cool)+"s",12,20);}
});
}});
