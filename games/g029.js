/* NCODE N · 029 Balança Perfeita — distribua e equilibre */
GREG(29,{
init(root,H){
const LV=[[1,2,3,4],[1,2,4,7],[2,3,5,8,2],[1,3,4,6,6]];
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos pesos para ciclar <b>fora → prato esquerdo → prato direito</b>. Equilibre com tudo a bordo!");
const o=H.cvs(root,480,320),x=o.x;
let weights=[],side=[];
function build(){
  weights=LV[lv].slice();side=weights.map(()=>0);
  hud.set("nv",lv+1);paint();tray();
}
function sums(){
  let L=0,R=0;
  weights.forEach((w,i)=>{if(side[i]===1)L+=w;if(side[i]===2)R+=w;});
  return[L,R];
}
function paint(){
  const[L,R]=sums();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const tilt=H.clamp((L-R)*0.03,-0.35,0.35);
  x.fillStyle=H.C.ink;x.fillRect(o.W/2-8,150,16,130);
  x.fillRect(o.W/2-60,276,120,10);
  x.save();x.translate(o.W/2,150);x.rotate(tilt);
  x.fillStyle=H.C.terra;x.fillRect(-190,-5,380,10);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-190,-5,380,10);
  [-170,170].forEach(px=>{
    x.strokeStyle=H.C.ink;x.beginPath();x.moveTo(px,5);x.lineTo(px,60);x.stroke();
    x.fillStyle=H.C.gold;x.beginPath();x.ellipse(px,66,44,10,0,0,7);x.fill();x.stroke();
  });
  x.restore();
  x.fillStyle=H.C.ink;x.font="bold 16px 'Space Mono',monospace";
  x.fillText("◀ "+L,o.W/2-220,120);
  x.fillText(R+" ▶",o.W/2+150,120);
  if(side.every(s=>s>0)&&L===R){x.fillStyle=H.C.ok;x.font="bold 18px 'Space Mono',monospace";x.fillText("EQUILÍBRIO!",o.W/2-80,40);}
}
let trayBox=null;
function tray(){
  if(!trayBox)trayBox=H.el("div","g-row",null,root);
  trayBox.innerHTML="";
  weights.forEach((w,i)=>{
    const label=w+"kg "+(side[i]===0?"· fora":side[i]===1?"◀ esq":"dir ▶");
    const b=H.el("button","g-chip"+(side[i]?" hot":""),label,trayBox);
    b.style.cursor="pointer";b.style.fontSize="13px";
    b.addEventListener("click",()=>{
      if(over)return;
      side[i]=(side[i]+1)%3;H.sfx("tick");paint();tray();
      const[L,R]=sums();
      if(side.every(s=>s>0)&&L===R){
        H.sfx("ok");const sc=(lv+1)*130;H.score(sc);hud.set("sc",sc);
        if(lv>=LV.length-1){over=true;H.after(600,()=>H.done({win:true,score:sc+120,title:"Equilíbrio total!",sub:"4 balanças zeradas com todos os pesos."}));}
        else{lv++;say("Nível "+(lv+1)+": mais pesos, soma maior.");H.after(800,build);}
      }
    });
  });
}
build();
}});
