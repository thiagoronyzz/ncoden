/* NCODE N · 072 Martelada no Tempo — bata no ponto */
GREG(72,{
init(root,H){
let over=false,nail=0,hits=0,strikes=0,pos=0,dir=1,speed=1.6,sc=0;
const hud=H.hud(root,[["pr","PREGOS","0/5"],["st","TORTOS","0/5"],["sc","PONTOS",0]]);
const say=H.msg(root,"<b>Toque/Espaço</b> quando o marcador estiver no <b>verde</b>. 3 marteladas por prego, 5 pregos. 5 erros = fim!");
const o=H.cvs(root,500,300),x=o.x;
function hit(){
  if(over)return;
  if(pos>0.42&&pos<0.58){
    hits++;sc+=20;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(hits>=3){hits=0;nail++;speed+=.35;hud.set("pr",nail+"/5");H.sfx("pop");
      if(nail>=5){over=true;return H.done({win:true,score:sc+150,title:"Carpinteiro!",sub:"5 pregos retos, zero tortos."});}
      say("Prego "+(nail+1)/1+"! O ritmo acelera…");
    }
  }else{
    strikes++;hud.set("st",strikes+"/5");H.sfx("bad");
    if(strikes>=5){over=true;return H.done({win:false,score:sc,title:"Prego entortado!",sub:nail+" pregos antes do quinto erro."});}
    say("Torto! Erros: "+strikes+"/5.");
  }
}
const kb=H.keys();kb.on((c,d)=>{if(d&&c==="Space")hit();});
H.onTap(o,hit);
H.loop(dt=>{
  if(over)return;
  pos+=dir*speed*dt;
  if(pos>1){pos=1;dir=-1;}if(pos<0){pos=0;dir=1;}
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#a4764a";x.fillRect(40,190,o.W-80,50);
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(40,190,o.W-80,50);
  for(let i=0;i<5;i++){
    const nx=90+i*80,down=i<nail?34:i===nail?hits*11:0;
    x.fillStyle=i<nail?H.C.ok:"#c9c5b8";
    x.fillRect(nx-4,120-down+30,8,70-down);
    x.strokeStyle=H.C.ink;x.strokeRect(nx-4,120-down+30,8,70-down);
    x.fillStyle=H.C.ink;x.fillRect(nx-9,112-down+30,18,8);
  }
  x.fillStyle=H.C.card;x.fillRect(40,40,o.W-80,44);
  x.strokeStyle=H.C.ink;x.strokeRect(40,40,o.W-80,44);
  x.fillStyle=H.C.ok;x.fillRect(40+(o.W-80)*0.42,40,(o.W-80)*0.16,44);
  x.fillStyle=H.C.gold;x.fillRect(40+(o.W-80)*0.34,40,(o.W-80)*0.08,44);
  x.fillRect(40+(o.W-80)*0.58,40,(o.W-80)*0.08,44);
  x.fillStyle=H.C.ink;x.fillRect(40+pos*(o.W-80)-3,34,6,56);
  x.font="🔨";x.font="34px serif";x.fillText("🔨",40+pos*(o.W-80)-17,130);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("prego "+(nail+1)+"/5 · marteladas "+hits+"/3",40,104);
});
H.btn(root,"🔨 MARTELO!",hit,true);
}});
