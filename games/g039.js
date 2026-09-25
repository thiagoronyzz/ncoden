/* NCODE N · 039 Pavio Sincronizado — estourem todos juntos */
GREG(39,{
init(root,H){
const LV=[{burn:[4,7,10]},{burn:[3,5.5,8]},{burn:[2.5,6,9,11]}];
let lv=0,over=false,running=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Ajuste o <b>retardo</b> de cada pavio (0–12s). Queimas: some retardo + queima — todos devem explodir <b>juntos</b> (±0.35s).");
const o=H.cvs(root,500,240),x=o.x;
let delays=[];
function build(){
  delays=LV[lv].burn.map(()=>0);
  running=false;hud.set("nv",lv+1);paint();tray();
}
function paint(prog,booms){
  const B=LV[lv].burn;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("TEMPO (s) →",400,16);
  B.forEach((b,i)=>{
    const y=34+i*52;
    x.fillStyle=H.C.ink;x.font="bold 12px 'Space Mono',monospace";
    x.fillText("P"+(i+1)+" q="+b+"s",8,y+16);
    x.fillStyle=H.C.card;x.fillRect(110,y,360,26);
    x.strokeStyle=H.C.ink;x.strokeRect(110,y,360,26);
    const sc2=360/16;
    x.fillStyle=H.C.cement;x.fillRect(110,y,delays[i]*sc2,26);
    x.fillStyle=H.C.terra;x.fillRect(110+delays[i]*sc2,y,b*sc2,26);
    const ex=110+(delays[i]+b)*sc2;
    x.fillStyle=booms&&booms[i]?H.C.gold:H.C.ink;
    x.beginPath();x.arc(Math.min(468,ex),y+13,booms&&booms[i]?12:7,0,7);x.fill();
    if(prog!=null){
      const px=110+prog*sc2;
      if(px>=110&&px<=470){x.strokeStyle=H.C.ok;x.lineWidth=2;x.beginPath();x.moveTo(px,20);x.lineTo(px,30+B.length*52);x.stroke();}
    }
  });
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-col",null,root);
  trayBox.innerHTML="";
  LV[lv].burn.forEach((b,i)=>{
    const row=H.el("div","g-row",null,trayBox);
    H.el("span","g-chip","Pavio "+(i+1)+" · retardo <b>"+delays[i].toFixed(1)+"s</b> → "+(delays[i]+b).toFixed(1)+"s",row);
    const m=H.el("button","g-btn sm ghost","−0.5",row);
    const p=H.el("button","g-btn sm ghost","+0.5",row);
    m.addEventListener("click",()=>{if(!running){delays[i]=Math.max(0,+(delays[i]-0.5).toFixed(1));H.sfx("tick");paint();tray();}});
    p.addEventListener("click",()=>{if(!running){delays[i]=Math.min(12,+(delays[i]+0.5).toFixed(1));H.sfx("tick");paint();tray();}});
  });
}
H.btn(root,"Acender pavios",()=>{
  if(over||running)return;
  running=true;
  const B=LV[lv].burn;
  const times=B.map((b,i)=>delays[i]+b);
  const T=Math.max(...times);
  const booms=B.map(()=>false);
  let t=0;
  say("Pavios acesos… observem o céu!");
  const iv=H.every(100,()=>{
    t+=0.1;paint(t,booms);
    B.forEach((b,i)=>{if(!booms[i]&&t>=times[i]){booms[i]=true;H.beep(200+i*150,.25,"sawtooth",.06);}});
    if(t>=T+0.6){
      clearInterval(iv);
      const spread=Math.max(...times)-Math.min(...times);
      if(spread<=0.35){
        H.sfx("win");const sc=(lv+1)*150+Math.max(0,Math.round(60-spread*100));H.score(sc);hud.set("sc",sc);
        if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Show sincronizado!",sub:"Todas as baterias explodiram no mesmo instante."});}
        lv++;say("Nível "+(lv+1)+": mais pavios, mais contas.");H.after(800,build);
      }else{H.sfx("bad");running=false;say("Espalhados por <b>"+spread.toFixed(2)+"s</b>! Dica: escolham um alvo T e façam retardo = T − queima.");paint();}
    }
  });
},true);
build();
}});
