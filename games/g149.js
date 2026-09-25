/* NCODE N · 149 Fábrica de Velas — 10 velas aromáticas */
GREG(149,{
init(root,H){
const SC=["lavanda","limão","rosa"];
let over=false,queue=[],melt=null,pour=0,served=0,nid=0,spawn=1,want=0;
const hud=H.hud(root,[["vl","VELAS","0/10"],["sc","PONTOS",0]]);
const say=H.msg(root,"1⃣ <b>Derreter</b> cera (4s). 2⃣ Pingue a <b>essência do pedido</b>. 3⃣ SEGURE <b>verter</b> até a linha. 4⃣ <b>Embalar</b>!");
const box=H.el("div","g-col",null,root);
const qbox=H.el("div","g-msg","",box);
let hold=false,level=0,scent=null;
function paint(){
  qbox.innerHTML=queue.length?("Pedido: vela "+SC[queue[0]]):"sem pedidos…";
}
H.btn(root,"Derreter cera (4s)",()=>{
  if(over||melt||pour)return;
  melt=4;H.sfx("tick");say("Derretendo…");
},false);
const srow=H.el("div","g-row",null,root);
SC.forEach((s,i)=>{
  H.btn(srow,s,()=>{
    if(over||!melt||melt>0||scent!=null)return;
    if(!queue.length||queue[0]!==i){H.sfx("bad");say("Essência errada! O pedido é "+(queue.length?SC[queue[0]]:"?"));return;}
    scent=i;H.sfx("ok");say("Essência certa! Agora VERTEJA até a linha.");
  },false);
});
const vb=H.el("button","g-btn","SEGURE PARA VERTER",root);
vb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
vb.addEventListener("pointerup",()=>hold=false);
vb.addEventListener("pointerleave",()=>hold=false);
const o=H.cvs(root,440,170),x=o.x;
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&queue.length<2&&served+queue.length<11){
    spawn=4;queue.push(Math.floor(Math.random()*3));paint();
  }
  if(melt>0){melt-=dt;if(melt<=0){melt=0;say("Cera pronta! Pingue a essência.");}}
  if(hold&&melt===0&&scent!=null)level=Math.min(100,level+dt*45);
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;
  x.strokeRect(180,20,80,130);
  x.fillStyle="#E8A33D";
  x.fillRect(183,150-124*level/100,74,124*level/100);
  x.strokeStyle=H.C.ok;x.lineWidth=3;
  x.beginPath();x.moveTo(170,150-124*.7);x.lineTo(270,150-124*.7);x.stroke();
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText(melt>0?"derretendo "+Math.ceil(melt)+"s":melt===0?"cera pronta ✓":"derreta a cera",140,165);
});
H.btn(root,"Embalar vela",()=>{
  if(over||melt!==0||scent==null)return;
  if(level<65||level>78){H.sfx("bad");say("✕ Nível errado! Verteja até a LINHA VERDE. (revertendo)");level=0;return;}
  queue.shift();served++;H.score(served*30);hud.set("vl",served+"/10");H.sfx("ok");
  melt=null;scent=null;level=0;hold=false;paint();
  if(served>=10){over=true;return H.done({win:true,score:400,title:"Velas perfumadas!",sub:"10 velas derretidas, aromatizadas e embaladas."});}
  say("Vela embalada! Próxima…");
},true);
}});
