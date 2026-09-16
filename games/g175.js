/* NCODE N · 175 Muralha Anti-Tsunami — 3 ondas, cidade seca! */
GREG(175,{
init(root,H){
let over=false,walls=[],cash=60,wave=0,phase="build",anim=0,flood=false;
const hud=H.hud(root,[["od","ONDA","—/3"],["cx","CAIXA","$60"],["cd","CIDADE","seca ✓"]]);
const say=H.msg(root,"Clique nos lotes para <b>construir muro ($10)</b>. <b>Soltar onda!</b> testa tudo. Sobreviva às 3 ondas (+$20 por onda para reparos).");
const o=H.cvs(root,500,360),x=o.x;
walls=new Array(10).fill(0); // hp 0=vazio, 1..3
H.onTap(o,(px,py)=>{
  if(over||phase!=="build")return;
  const i=Math.floor(px/(o.W/10));
  if(i<0||i>9)return;
  if(walls[i]>=3){H.sfx("bad");return;}
  if(cash<10){H.sfx("bad");say("Sem caixa!");return;}
  cash-=10;walls[i]++;hud.set("cx","$"+cash);H.sfx("tick");
});
H.btn(root,"🌊 Soltar a onda!",()=>{
  if(over||phase!=="build")return;
  phase="wave";anim=0;flood=false;H.sfx("bad");
},true);
H.loop(dt=>{
  if(over)return;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,240,o.W,120);
  x.font="22px serif";
  for(let i=0;i<10;i++)x.fillText("🏠",i*50+12,330);
  const cw=o.W/10;
  walls.forEach((hp,i)=>{
    if(hp>0){
      x.fillStyle=["","#C9A06F","#8A6A2F","#5b3d20"][hp];
      x.fillRect(i*cw+4,240-hp*26,cw-8,hp*26);
      x.strokeStyle=H.C.ink;x.strokeRect(i*cw+4,240-hp*26,cw-8,hp*26);
    }else{
      x.strokeStyle=H.C.cement;x.setLineDash([4,4]);
      x.strokeRect(i*cw+4,240-26,cw-8,26);x.setLineDash([]);
    }
  });
  if(phase==="wave"){
    anim+=dt;
    const power=[2,3,4][wave];
    const wh=Math.min(250,anim*160);
    x.fillStyle="rgba(46,110,138,.75)";
    x.fillRect(0,240-wh,o.W,wh);
    x.fillStyle="#fff";x.font="bold 15px 'Space Mono',monospace";
    x.fillText("ONDA "+(wave+1)+" · força "+power,180,250-wh);
    if(anim>1.6){
      // resolve
      for(let i=0;i<10;i++){
        if(walls[i]<power){
          if(walls[i]>0){walls[i]=0;}
          flood=true;
        }else walls[i]--;
      }
      if(flood){
        over=true;hud.set("cd","ALAGADA!");
        return H.done({win:false,score:wave*80,title:"Tsunami passou!",sub:"Onda "+(wave+1)+" alagou a cidade. Muros ≥ força "+power+" em TODOS os lotes!"});
      }
      wave++;cash+=20;hud.set("cx","$"+cash);hud.set("od",wave+"/3");
      H.sfx("ok");
      if(wave>=3){over=true;
        return H.done({win:true,score:300+cash,title:"Cidade seca!",sub:"3 tsunamis contidos pela muralha."});}
      say("Onda "+wave+" contida! +$20. Próxima: força "+[2,3,4][wave]+". Repare (clique)!");
      hud.set("od",(wave+1)+"/3?");
      hud.set("od",(wave)+"/3");
      phase="build";
    }
  }else{
    x.fillStyle="#2E6E8A";
    for(let i=0;i<8;i++)x.fillRect(i*70+((Date.now()/30)%70)-70,232,34,5);
  }
});
}});
