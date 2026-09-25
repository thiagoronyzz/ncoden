/* NCODE N · 010 Corda Cortada — corte no instante certo */
GREG(10,{
init(root,H){
const LV=[
 {piv:[150,70],L:170,ang:1.1,box:[330,300,80,34]},
 {piv:[360,60],L:200,ang:-1.2,box:[110,300,70,34]},
 {piv:[260,50],L:230,ang:1.25,box:[400,300,60,34]}
];
let lv=0,att=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["tt","TENTATIVA","1/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"A bola balança na corda. Pressione <b>CORTAR</b> (ou Espaço/toque) para soltá-la na cesta.");
const o=H.cvs(root,520,360),x=o.x;
let th,om,mode,bx,by,vx,vy;
function attempt(){
  const L=LV[lv];th=L.ang;om=0;mode="swing";hud.set("tt",(att+1)+"/3");hud.set("nv",lv+1);
}
function cut(){
  if(over||mode!=="swing")return;
  const L=LV[lv];
  bx=L.piv[0]+Math.sin(th)*L.L;by=L.piv[1]+Math.cos(th)*L.L;
  const w=om*L.L;vx=Math.cos(th)*w;vy=-Math.sin(th)*w;
  mode="fly";H.sfx("pop");
}
const kb=H.keys();kb.on((c,d)=>{if(d&&(c==="Space"||c==="Enter"))cut();});
H.onTap(o,cut);
H.loop(dt=>{
  if(over)return;
  const L=LV[lv];
  if(mode==="swing"){
    const al=-(9.8/L.L)*Math.sin(th)*60;
    om+=al*dt;th+=om*dt;
  }else if(mode==="fly"){
    vy+=900*dt;bx+=vx*dt;by+=vy*dt;
    const[qx,qy,qw,qh]=L.box;
    if(bx>qx&&bx<qx+qw&&by>qy&&by<qy+qh){
      mode="done";H.sfx("ok");
      const sc=(lv+1)*150+(2-att)*50;H.score(sc);hud.set("sc",sc);
      if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Corte cirúrgico!",sub:"3 cestas acertadas com 3 cortes precisos."});}
      lv++;att=0;say("Nível "+(lv+1)+": pêndulo novo, cesta nova.");H.after(800,attempt);
    }else if(by>o.H+20||bx<-20||bx>o.W+20){
      mode="done";att++;H.sfx("bad");
      if(att>=3){over=true;return H.done({win:false,score:lv*120,title:"Corda desperdiçada",sub:"3 tentativas sem cesta no nível "+(lv+1)+". Observe o balanço."});}
      say("Errou! Tentativa "+(att+1)+" de 3.");H.after(600,attempt);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;x.beginPath();x.moveTo(0,334);x.lineTo(o.W,334);x.stroke();
  const[qx,qy,qw,qh]=L.box;
  x.fillStyle=H.C.wasabi;x.fillRect(qx,qy,qw,qh);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(qx,qy,qw,qh);
  x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";x.fillText("CESTA",qx+8,qy+qh-10);
  x.fillStyle=H.C.ink;x.fillRect(L.piv[0]-5,20,10,L.piv[1]-20);
  x.beginPath();x.arc(L.piv[0],L.piv[1],6,0,7);x.fill();
  let px,py;
  if(mode==="swing"){px=L.piv[0]+Math.sin(th)*L.L;py=L.piv[1]+Math.cos(th)*L.L;
    x.strokeStyle=H.C.terra;x.lineWidth=3;x.beginPath();x.moveTo(L.piv[0],L.piv[1]);x.lineTo(px,py);x.stroke();
  }else{px=bx;py=by;}
  if(mode!=="done"||true){
    x.fillStyle=H.C.ink;x.beginPath();x.arc(px,py,14,0,7);x.fill();
    x.fillStyle=H.C.terra;x.beginPath();x.arc(px,py,9,0,7);x.fill();
  }
});
H.btn(root,"CORTAR A CORDA",cut,true);
attempt();
}});
