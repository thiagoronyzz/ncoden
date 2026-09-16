/* NCODE N · 204 Trem no Ritmo — 40 batidas nos trilhos! */
GREG(204,{
init(root,H){
let over=false,t=0,next=1.2,beat=0,wob=0,iv=0.7,wx=0;
const hud=H.hud(root,[["bt","BATIDAS","0/40"],["tr","TRILHOS","firmes"]]);
const say=H.msg(root,"Alimente a fornalha <b>NO RITMO</b> (botão, Espaço ou clique)! 3 balançadas e o trem descarrila. Ele acelera!");
const o=H.cvs(root,520,320),x=o.x;
function tap(){
  if(over||beat>=40)return;
  const e=Math.abs(t-next);
  if(e<iv*0.3){beat++;H.sfx("ok");iv=Math.max(0.38,0.7-beat*0.008);next+=iv;}
  else{wob++;wx=8;H.sfx("bad");hud.set("tr","BALANÇANDO "+wob+"/3");
    if(wob>=3){over=true;return H.done({win:false,score:beat*10,title:"DESCARRILOU!",sub:beat+"/40 batidas."});}
  }
  H.score(beat*10);hud.set("bt",beat+"/40");
  if(beat>=40){over=true;return H.done({win:true,score:500,title:"Expresso pontual!",sub:"40 batidas até a estação."});}
}
H.btn(root,"🔥 ALIMENTAR FORNALHA!",tap,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==="Space")tap();});
H.onTap(o,()=>tap());
H.loop(dt=>{
  if(over)return;
  t+=dt;
  if(wx>0)wx-=dt*20;
  if(t>next+iv*0.3&&beat<40){
    wob++;wx=8;next+=iv;H.sfx("bad");hud.set("tr","BALANÇANDO "+wob+"/3");
    if(wob>=3){over=true;return H.done({win:false,score:beat*10,title:"DESCARRILOU!",sub:beat+"/40 batidas."});}
  }
  if(Math.abs(t-next)<dt)H.beep(150,.08);
  const sh=wx>0?(Math.random()-.5)*wx:0;
  x.save();x.translate(sh,0);
  x.fillStyle=H.C.paper;x.fillRect(-20,0,o.W+40,o.H);
  x.fillStyle=H.C.ok;x.fillRect(-20,220,o.W+40,100);
  x.fillStyle="#5b3d20";
  for(let i=0;i<14;i++)x.fillRect(i*40-((t*120)%40),250,20,10);
  x.fillStyle="#8A877C";x.fillRect(-20,246,o.W+40,6);x.fillRect(-20,262,o.W+40,6);
  x.font="64px serif";
  x.fillText("🚂",60,240);
  x.fillText("🚃",150,240);x.fillText("🚃",230,240);
  const ph=H.clamp(1-Math.abs(t-next)/(iv*0.3),0,1);
  x.fillStyle=ph>0.5?H.C.wasabi:H.C.card;
  x.beginPath();x.arc(o.W/2,110,34+ph*10,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=4;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 13px 'Space Mono',monospace";
  x.fillText("velocidade "+Math.round(60/iv*2)+" km/h",180,70);
  x.restore();
});
}});
