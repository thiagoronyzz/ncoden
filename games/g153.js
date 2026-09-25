/* NCODE N · 153 Vinhedo — 3 vinhos envelhecidos */
GREG(153,{
init(root,H){
const SE=["Primavera","Verão","Outono","Inverno"];
let over=false,se=0,vines=[],grapes=0,barrels=[];
const hud=H.hud(root,[["es","ESTAÇÃO","Primavera"],["uv","UVAS",0],["vn","VINHOS","0/3"]]);
const say=H.msg(root,"Primavera/verão: clique na parreira para <b>crescer</b>. Outono: <b>colha</b> as maduras (3+). <b>Prensar</b>: 4 uvas → 1 mosto. Cada inverno envelhece +1. 3 vinhos com 2+ invernos!");
const box=H.el("div","g-col",null,root);
const vbox=H.el("div","g-board",null,box);
vbox.style.gridTemplateColumns="repeat(4,1fr)";
vbox.style.width="min(100%,340px)";
const bbox=H.el("div","g-msg","",box);
vines=new Array(8).fill(0);
function aged(){return barrels.filter(b=>b>=2).length;}
function paint(){
  hud.set("es",SE[se%4].split(" ")[1]+" · ano "+(Math.floor(se/4)+1)+"/2");
  hud.set("uv",grapes);hud.set("vn",aged()+"/3");
  vbox.innerHTML="";
  vines.forEach((v,i)=>{
    const b=H.el("button","g-cell"+(v>=3?" good":""),null,vbox);
    b.style.minHeight="62px";b.style.fontSize="13px";
    b.innerHTML=(v>=3?"":"")+v+"/3";
    b.addEventListener("click",()=>{
      if(over)return;
      const s2=se%4;
      if(s2<=1){if(vines[i]<3){vines[i]++;H.sfx("tick");paint();}}
      else if(s2===2){if(vines[i]>=3){vines[i]=0;grapes++;H.sfx("ok");say("+1 uva! ("+grapes+")");paint();}}
      else H.sfx("bad");
    });
  });
  bbox.innerHTML="barricas: "+(barrels.map(b=>""+b+"inv").join(" ")||"vazias");
}
paint();
H.btn(root,"Prensar (4 uvas → 1 mosto)",()=>{
  if(over||grapes<4||barrels.length>=4)return;
  grapes-=4;barrels.push(0);H.sfx("ok");say("Mosto na barrica! Envelhece a cada inverno.");paint();
},false);
H.btn(root,"Próxima estação",()=>{
  if(over)return;
  se++;
  if(se%4===0){barrels=barrels.map(b=>b+1);vines=vines.map(()=>0);say("Inverno: vinhos envelheceram!");}
  if(aged()>=3){over=true;paint();return H.done({win:true,score:500,title:"Vinho de reserva!",sub:"3 vinhos com 2+ invernos de barrica."});}
  if(se>=8){over=true;paint();
    return H.done({win:false,score:aged()*80,title:"Safra fraca…",sub:"Só "+aged()+"/3 reservas. Colha 4+ uvas por outono!"});
  }
  paint();
},true);
}});
