/* NCODE N · 171 Simulador de Tornado — sugue 14 coisas! */
GREG(171,{
init(root,H){
let over=false,tor={x:250,y:200},objs=[],got=0,time=90;
const hud=H.hud(root,[["sg","SUGADOS","0/14"],["tp","TEMPO",90],["sc","PONTOS",0]]);
const say=H.msg(root,"ARRASTE o tornado pela cidade! Quem chegar perto do funil roda e some. Sugue 14 em 90s!");
const o=H.cvs(root,500,380),x=o.x;
const EM=["i:house","i:house","i:car","i:car","i:pine","i:pine","i:sheep","i:truck","i:house","i:pine","i:car","i:barrel","i:building","i:pine","i:car","i:house"];
const r=H.rng(33);
EM.forEach(e=>objs.push({e,x:30+r()*440,y:60+r()*280,suck:0,a:r()*6,spin:2+r()*3}));
const ptr=H.ptr(o);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    return H.done({win:false,score:got*20,title:"Tornado passou!",sub:"Só "+got+"/14 sugados. Cubra a cidade toda!"});}
  if(ptr.down){tor.x=ptr.x;tor.y=ptr.y;}
  for(let i=objs.length-1;i>=0;i--){
    const b=objs[i];
    const d=Math.hypot(b.x-tor.x,b.y-tor.y);
    if(d<110){
      b.a+=dt*(6-d/25);
      const pull=(110-d)*dt*1.2;
      b.x+=(tor.x-b.x)/Math.max(d,1)*pull;
      b.y+=(tor.y-b.y)/Math.max(d,1)*pull;
      if(d<30){b.suck+=dt*2;}
    }
    if(b.suck>=1){
      objs.splice(i,1);got++;H.score(got*20);hud.set("sg",got+"/14");hud.set("sc",got*20);H.sfx("pop");
      if(got>=14){over=true;return H.done({win:true,score:380,title:"F5 total!",sub:"14 objetos rodopiando no funil."});}
    }
  }
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#4A4A44";x.fillRect(0,180,o.W,26);x.fillRect(240,0,26,o.H);
  x.font="24px serif";
  objs.forEach(b=>{
    x.save();x.translate(b.x,b.y);x.rotate(b.suck>0?b.a*3:0);
    x.globalAlpha=1-b.suck*.7;
    x.fillText(b.e,-12,8);x.restore();x.globalAlpha=1;
  });
  // funil
  for(let i=0;i<8;i++){
    const w=20+i*11,y=tor.y-70+i*22;
    x.fillStyle="rgba(200,200,195,.85)";
    x.beginPath();x.ellipse(tor.x+Math.sin(time*6+i)*8,y,w,10,0,0,7);x.fill();
    x.strokeStyle="#8A877C";x.stroke();
  }
  x.strokeStyle="rgba(217,78,52,.4)";x.lineWidth=2;
  x.beginPath();x.arc(tor.x,tor.y,110,0,7);x.stroke();
});
}});
