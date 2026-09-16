/* NCODE N · 030 Esteira Seletora — desvie cada item ao cesto certo */
GREG(30,{
init(root,H){
const COLS=[H.C.terra,H.C.ok,"#2E6E8A"];
const NAMES=["VERMELHO","VERDE","AZUL"];
let over=false,items=[],gA=0,gB=1,spawn=0,sc=0,ok=0,wrong=0,total=15,interval=1.5;
const hud=H.hud(root,[["it","ITENS","0/15"],["ok","ACERTOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos <b>desviadores</b> (ou teclas 1/2) para alternar o lado. Combine a cor do item com o cesto.");
const o=H.cvs(root,480,420),x=o.x;
const BINS=[{x:70,c:0},{x:240,c:1},{x:410,c:2}];
const kb=H.keys();
kb.on((c,d)=>{if(!d||over)return;if(c==="Digit1"){gA^=1;H.sfx("tick");}if(c==="Digit2"){gB^=1;H.sfx("tick");}});
H.onTap(o,(px,py)=>{
  if(over)return;
  if(Math.hypot(px-240,py-150)<34){gA^=1;H.sfx("tick");}
  if(Math.hypot(px-330,py-260)<34){gB^=1;H.sfx("tick");}
});
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&(ok+wrong+items.length)<total){
    spawn=interval;interval=Math.max(.8,interval-.03);
    items.push({c:Math.floor(Math.random()*3),x:240,y:20,vy:60,vx:0,stage:0});
  }
  for(const it of items){
    it.y+=it.vy*dt;it.x+=it.vx*dt;
    if(it.stage===0&&it.y>=150){
      it.stage=1;
      if(gA===0){it.vx=-140;}else{it.vx=70;it.stage=1;}
    }
    if(it.stage===1&&gA===1&&it.y>=260&&it.x>200){
      it.stage=2;
      it.vx=gB===0?-120:120;it.x=330;
    }
    if(it.vx!==0&&it.stage>=1){
      const target=it.stage===1&&gA===0?70:(it.stage===2?(gB===0?240:410):it.x);
      if(Math.abs(it.x-target)<8){it.x=target;it.vx=0;}
    }
    it.vy=Math.min(160,it.vy+40*dt);
  }
  for(let i=items.length-1;i>=0;i--){
    const it=items[i];
    if(it.y>=370){
      items.splice(i,1);
      const bin=BINS.reduce((a,b)=>Math.abs(b.x-it.x)<Math.abs(a.x-it.x)?b:a);
      if(bin.c===it.c){ok++;sc+=10;H.sfx("ok");}
      else{sc=Math.max(0,sc-3);wrong++;H.sfx("bad");}
      const done=ok+wrong;
      hud.set("it",done+"/"+total);hud.set("ok",ok);hud.set("sc",sc);H.score(sc);
      if(done>=total){
        over=true;
        if(ok>=Math.ceil(total*0.7))return H.done({win:true,score:sc+100,title:"Separação eficiente!",sub:ok+"/"+total+" itens nos cestos certos."});
        return H.done({win:false,score:sc,title:"Mistura na esteira",sub:"Só "+ok+"/"+total+" certos. Antecipe o próximo item!"});
      }
    }
  }
  // desenho
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(210,0,60,20);
  x.strokeStyle=H.C.cement;x.lineWidth=2;
  x.beginPath();x.moveTo(240,20);x.lineTo(240,150);x.stroke();
  x.beginPath();x.moveTo(240,150);x.lineTo(70,370);x.stroke();
  x.beginPath();x.moveTo(240,150);x.lineTo(330,260);x.stroke();
  x.beginPath();x.moveTo(330,260);x.lineTo(240,370);x.stroke();
  x.beginPath();x.moveTo(330,260);x.lineTo(410,370);x.stroke();
  gate(240,150,gA,["◀ CESTO 1","▼ SEGUE"]);
  gate(330,260,gB,["◀ CESTO 2","CESTO 3 ▶"]);
  BINS.forEach((b,i)=>{
    x.fillStyle=COLS[b.c];x.fillRect(b.x-45,372,90,34);
    x.strokeStyle=H.C.ink;x.strokeRect(b.x-45,372,90,34);
    x.fillStyle="#fff";x.font="bold 10px 'Space Mono',monospace";x.fillText(NAMES[i],b.x-38,393);
  });
  for(const it of items){
    x.fillStyle=COLS[it.c];x.beginPath();x.arc(it.x,it.y,12,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  }
});
function gate(gx,gy,dir,labels){
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(gx,gy,20,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";
  x.fillText(dir?"▼":"◀",gx-6,gy+4);
  x.font="10px 'Space Mono',monospace";x.fillText(labels[dir],gx-30,gy-26);
}
H.btn(root,"↻ Reiniciar",()=>{if(!over){items=[];gA=0;gB=1;sc=0;ok=0;wrong=0;interval=1.5;spawn=0;hud.set("it","0/15");hud.set("ok",0);hud.set("sc",0);}},false);
}});
