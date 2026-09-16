/* NCODE N · 166 Arte com Dominós — derrube até a estrela */
GREG(166,{
init(root,H){
let over=false,dom=[],falling=false,fallT=0;
const hud=H.hud(root,[["dm","DOMINÓS","0/22"],["st","STATUS","monte"]]);
const say=H.msg(root,"Clique para plantar dominós em <b>cadeia</b> (cada um mira o anterior). Chegue perto da ⭐ e aperte <b>DERRUBAR</b>! Alcance: 46px. Evite as 🌳.");
const o=H.cvs(root,500,360),x=o.x;
const OBS=[{x:170,y:130,r:34},{x:340,y:240,r:34}],STAR={x:450,y:70};
H.onTap(o,(px,py)=>{
  if(over||falling)return;
  if(dom.length>=22){H.sfx("bad");return;}
  if(OBS.some(b=>Math.hypot(px-b.x,py-b.y)<b.r+10)){H.sfx("bad");say("Dentro da árvore! Plante ao redor.");return;}
  const prev=dom[dom.length-1];
  if(prev){
    const d=Math.hypot(px-prev.x,py-prev.y);
    if(d>70){H.sfx("bad");say("Longe demais do anterior (máx 70px)!");return;}
    prev.a=Math.atan2(py-prev.y,px-prev.x);
  }
  dom.push({x:px,y:py,a:prev?Math.atan2(py-prev.y,px-prev.x):0,f:-1});
  H.sfx("tick");hud.set("dm",dom.length+"/22");
});
H.btn(root,"🎬 DERRUBAR!",()=>{
  if(over||falling||dom.length<3)return;
  falling=true;fallT=0;dom[0].f=0;
  hud.set("st","caindo…");H.sfx("ok");
},true);
H.btn(root,"↩️ Desfazer",()=>{if(!over&&!falling){dom.pop();hud.set("dm",dom.length+"/22");H.sfx("tick");}},false);
H.loop(dt=>{
  if(falling&&!over){
    fallT+=dt;
    let allF=true;
    dom.forEach((d,i)=>{
      if(d.f<0){allF=false;return;}
      if(d.f<1)d.f=Math.min(1,d.f+dt*4);
      if(d.f>=1&&i+1<dom.length&&dom[i+1].f<0){
        const nd=Math.hypot(dom[i+1].x-d.x,dom[i+1].y-d.y);
        if(nd<=46)dom[i+1].f=0;
      }
    });
    const last=dom[dom.length-1];
    if(last.f>=1){
      over=true;
      const dS=Math.hypot(last.x-STAR.x,last.y-STAR.y);
      if(dS<=70)return H.done({win:true,score:200+dom.length*10,title:"Reação perfeita!",sub:dom.length+" dominós até a estrela!"});
      return H.done({win:false,score:dom.length*5,title:"Cadeia curta!",sub:"O último caiu longe da ⭐. Chegue mais perto!"});
    }
    if(allF&&last.f<0){over=true;
      return H.done({win:false,score:dom.length*5,title:"Cadeia quebrou!",sub:"Um vão maior que 46px parou tudo."});}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.font="30px serif";
  OBS.forEach(b=>{x.fillText("🌳",b.x-15,b.y+10);});
  x.font="34px serif";x.fillText("⭐",STAR.x-17,STAR.y+12);
  x.strokeStyle=H.C.wasabi;x.lineWidth=2;
  x.beginPath();x.arc(STAR.x,STAR.y,70,0,7);x.stroke();
  dom.forEach((d,i)=>{
    x.save();x.translate(d.x,d.y);
    if(d.f>=0)x.rotate(d.a+Math.PI/2),x.translate(0,-10*Math.sin(d.f*Math.PI/2)),x.rotate(0);
    x.rotate(d.f>=0?0:d.a+Math.PI/2);
    x.fillStyle=i===0?H.C.terra:H.C.ink;
    x.fillRect(-5,-14,10,28);
    x.fillStyle="#fff";x.fillRect(-5,-1,10,2);
    x.restore();
    if(d.f<0&&i===dom.length-1){
      x.strokeStyle="rgba(0,0,0,.25)";x.lineWidth=1;
      x.beginPath();x.arc(d.x,d.y,46,0,7);x.stroke();
    }
  });
  if(!dom.length){
    x.fillStyle=H.C.ink3;x.font="13px 'Space Mono',monospace";
    x.fillText("clique para plantar o 1º dominó",140,180);
  }
});
}});
