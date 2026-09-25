/* NCODE N · 098 Semáforo Inteligente — 25 carros sem batida */
GREG(98,{
init(root,H){
let over=false,ns=true,cars=[],passed=0,spawn=0,t=0;
const hud=H.hud(root,[["ps","ATRAVESSARAM","0/25"],["fl","FLUXO","NS"],["sc","PONTOS",0]]);
const say=H.msg(root,"Alterne o verde <b>NS ↔ LO</b>. Carros parados +12s <b>furam o vermelho</b> — e batem! Passe 25.");
const o=H.cvs(root,460,400),x=o.x;
const cx=o.W/2,cy=o.H/2;
function spawnCar(){
  const d=Math.floor(Math.random()*4);
  const lane=d===0?{x:cx-14,y:-20,vx:0,vy:90,ax:"ns"}:d===1?{x:cx+14,y:o.H+20,vx:0,vy:-90,ax:"ns"}:d===2?{x:-20,y:cy-14,vx:90,vy:0,ax:"ew"}:{x:o.W+20,y:cy+14,vx:-90,vy:0,ax:"ew"};
  if(cars.some(c=>Math.hypot(c.x-lane.x,c.y-lane.y)<44))return;
  cars.push(Object.assign(lane,{wait:0,run:false,col:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F"][d]}));
}
function toggle(){if(over)return;ns=!ns;hud.set("fl",ns?"NS":"LO");H.sfx("tick");}
H.btn(root,"Alternar verde",toggle,true);
H.onTap(o,(px,py)=>{if(Math.hypot(px-cx,py-cy)<60)toggle();});
H.loop(dt=>{
  if(over)return;
  t+=dt;spawn-=dt;
  if(spawn<=0){spawn=.9;spawnCar();}
  const green=ax=>ns?ax==="ns":ax==="ew";
  for(const c of cars){
    const nearStop=c.ax==="ns"?Math.abs(c.y-cy)<70:Math.abs(c.x-cx)<70;
    const inZone=c.ax==="ns"?Math.abs(c.y-cy)<34:Math.abs(c.x-cx)<34;
    c.inZone=inZone;
    if(!green(c.ax)&&nearStop&&!inZone&&!c.run){
      c.wait+=dt;
      if(c.wait>12){c.run=true;say("Um carro furou o vermelho!");}
    }else{
      c.wait=0;
      const ahead=cars.some(k=>k!==c&&k.ax===c.ax&&((c.vy>0&&k.y>c.y&&k.y-c.y<36)||(c.vy<0&&k.y<c.y&&c.y-k.y<36)||(c.vx>0&&k.x>c.x&&k.x-c.x<36)||(c.vx<0&&k.x<c.x&&c.x-k.x<36)));
      if(!ahead||inZone||c.run){c.x+=c.vx*dt;c.y+=c.vy*dt;}
    }
  }
  const z=cars.filter(c=>c.inZone);
  if(z.some(c=>c.ax==="ns")&&z.some(c=>c.ax==="ew")){
    const runner=z.find(c=>c.run);
    if(runner||Math.random()<dt*0){over=true;H.sfx("lose");
      return H.done({win:false,score:passed*10,title:"Batida no cruzamento!",sub:passed+" carros antes da colisão. Não segure um lado!"});}
  }
  for(let i=cars.length-1;i>=0;i--){
    const c=cars[i];
    if(c.x<-30||c.x>o.W+30||c.y<-30||c.y>o.H+30){
      cars.splice(i,1);
      if(c.run||true){passed++;H.score(passed*10);hud.set("sc",passed*10);hud.set("ps",passed+"/25");H.beep(500,.04);}
      if(passed>=25){over=true;return H.done({win:true,score:passed*10+100,title:"Trânsito fluindo!",sub:"25 carros sem uma batida."});}
    }
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#4A4A44";
  x.fillRect(cx-30,0,60,o.H);x.fillRect(0,cy-30,o.W,60);
  x.strokeStyle="#fff";x.setLineDash([8,8]);
  x.beginPath();x.moveTo(cx,0);x.lineTo(cx,cy-34);x.moveTo(cx,cy+34);x.lineTo(cx,o.H);x.stroke();
  x.beginPath();x.moveTo(0,cy);x.lineTo(cx-34,cy);x.moveTo(cx+34,cy);x.lineTo(o.W,cy);x.stroke();
  x.setLineDash([]);
  x.fillStyle=H.C.ink;x.fillRect(cx+34,cy-58,22,44);
  x.fillStyle=ns?H.C.ok:"#3a3a36";x.beginPath();x.arc(cx+45,cy-46,7,0,7);x.fill();
  x.fillStyle=ns?"#3a3a36":H.C.terra;x.beginPath();x.arc(cx+45,cy-26,7,0,7);x.fill();
  for(const c of cars){
    x.save();x.translate(c.x,c.y);
    if(c.vx!==0)x.rotate(Math.PI/2);
    x.fillStyle=c.run?"#ff0":c.col;x.fillRect(-9,-16,18,32);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-9,-16,18,32);
    x.restore();
    if(c.wait>8){x.fillStyle=H.C.terra;x.font="bold 11px 'Space Mono',monospace";x.fillText("!",c.x-3,c.y-20);}
  }
});
}});
