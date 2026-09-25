/* NCODE N · 129 Food Truck — 20 marmitas no almoço */
GREG(129,{
init(root,H){
const SPOTS=[{n:"Centro",x:90,crowd:0},{n:"Escola",x:250,crowd:0},{n:"Estádio",x:410,crowd:0}];
let over=false,at=0,cook=0,ready=4,served=0,time=150,drive=0;
const hud=H.hud(root,[["sv","SERVIDOS","0/20"],["mm","MARMITAS",4],["tp","TEMPO",150]]);
const say=H.msg(root,"Dirija-se à <b>multidão</b>, frite marmitas (4 por vez) e sirva! A fome muda de lugar…");
const o=H.cvs(root,500,260),x=o.x;
H.onTap(o,(px,py)=>{
  if(over||drive>0)return;
  let bi=0,bd=1e9;
  SPOTS.forEach((s,i)=>{const d=Math.abs(px-s.x);if(d<bd){bd=d;bi=i;}});
  if(bi!==at){drive=2.5;at=bi;H.sfx("tick");say("A caminho do "+SPOTS[bi].n+"…");}
});
H.btn(root,"Fritar 4 marmitas (6s)",()=>{
  if(over||cook>0||ready>=8)return;
  cook=6;H.sfx("tick");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*10,title:"Almoço acabou!",sub:served+"/20 servidos. Frite sem parar!"});}
  if(drive>0)drive-=dt;
  if(cook>0){cook-=dt;if(cook<=0){ready=Math.min(12,ready+4);hud.set("mm",ready);H.sfx("ok");}}
  SPOTS.forEach((s,i)=>{
    s.crowd=Math.max(0,s.crowd-dt*.15);
    if(Math.random()<dt*.5)s.crowd=Math.min(8,s.crowd+1);
  });
  const s=SPOTS[at];
  if(drive<=0&&s.crowd>=1&&ready>0){
    s.serve=(s.serve||0)+dt;
    if(s.serve>1.2){s.serve=0;s.crowd--;ready--;served++;
      hud.set("sv",served+"/20");hud.set("mm",ready);H.score(served*10);H.sfx("pop");
      if(served>=20){over=true;return H.done({win:true,score:250,title:"Truck famoso!",sub:"20 marmitas no horário do almoço."});}}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#4A4A44";x.fillRect(0,190,o.W,70);
  SPOTS.forEach(sp=>{
    x.font="22px serif";x.fillText(sp.n.split(" ")[0],sp.x-12,60);
    x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
    x.fillText(sp.n.split(" ")[1],sp.x-22,78);
    x.font="16px serif";
    for(let i=0;i<Math.floor(sp.crowd);i++)x.fillText("i:person",sp.x-30+(i%4)*16,120+Math.floor(i/4)*20);
  });
  x.font="40px serif";
  x.fillText("i:truck",SPOTS[at].x-20,225);
  if(drive>0){x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";x.fillText("dirigindo…",SPOTS[at].x-32,190);}
  if(cook>0){x.fillStyle=H.C.terra;x.font="bold 13px 'Space Mono',monospace";x.fillText("i:burger"+Math.ceil(cook)+"s",10,20);}
});
}});
