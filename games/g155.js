/* NCODE N · 155 Saboaria — 8 sabonetes curados */
GREG(155,{
init(root,H){
const SC=["lavanda","limão","rosa"];
let over=false,order=0,mix=null,pour=0,rack=[],served=0,hold=false;
const hud=H.hud(root,[["sb","SABONETES","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"1⃣ Misture o <b>óleo do pedido</b>. 2⃣ SEGURE <b>verter</b> até a linha. 3⃣ Leve à <b>cura</b> (10s, cabem 3). 4⃣ <b>Embale</b> o curado!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
const rbox=H.el("div","g-row",null,box);
function paint(){
  od.innerHTML="Pedido: sabonete "+SC[order]+(mix!=null?" · mistura ✓":" · misture!")+(rack.length?" · curando "+rack.length+"/3":"");
  rbox.innerHTML="";
  rack.forEach((r,i)=>{
    const b=H.el("button","g-chip"+(r<=0?" good":""),r<=0?"✔ curado! EMBALAR":""+Math.ceil(r)+"s",rbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||r>0)return;
      rack.splice(i,1);served++;H.score(served*40);hud.set("sb",served+"/8");H.sfx("ok");paint();
      order=Math.floor(Math.random()*3);mix=null;pour=0;
      if(served>=8){over=true;return H.done({win:true,score:420,title:"Sabonetes artesanais!",sub:"8 barras misturadas, curadas e embaladas."});}
      say("Embalado! Novo pedido: "+SC[order]+".");paint();
    });
  });
  if(!rack.length)H.el("div","g-chip","prateleira de cura vazia",rbox);
}
const orow=H.el("div","g-row",null,box);
SC.forEach((s,i)=>{
  H.btn(orow,s,()=>{
    if(over||mix!=null)return;
    if(i!==order){H.sfx("bad");say("Óleo errado! O pedido é "+SC[order]+".");return;}
    mix=i;H.sfx("ok");say("Mistura pronta! VERTEJA até a linha.");paint();
  },false);
});
const vb=H.el("button","g-btn","SEGURE PARA VERTER",box);
vb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
vb.addEventListener("pointerup",()=>hold=false);
vb.addEventListener("pointerleave",()=>hold=false);
const o=H.cvs(root,440,150),x=o.x;
H.loop(dt=>{
  if(over)return;
  rack=rack.map(r=>r-dt);
  if(hold&&mix!=null)pour=Math.min(100,pour+dt*40);
  if(Math.random()<dt*2)paint();
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=3;x.strokeRect(180,10,80,120);
  x.fillStyle="#C4D645";x.fillRect(183,128-114*pour/100,74,114*pour/100);
  x.strokeStyle=H.C.ok;x.lineWidth=3;
  x.beginPath();x.moveTo(170,128-114*.6);x.lineTo(270,128-114*.6);x.stroke();
});
paint();
H.btn(root,"Levar à cura",()=>{
  if(over||mix==null)return;
  if(pour<55||pour>68){H.sfx("bad");say("✕ Nível fora da linha! (revertendo)");pour=0;return;}
  if(rack.length>=3){H.sfx("bad");say("Prateleira cheia! Embale um curado.");return;}
  rack.push(10);mix=null;pour=0;H.sfx("ok");say("Na cura (10s)! Pode misturar o próximo.");paint();
},true);
}});
