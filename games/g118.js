/* NCODE N · 118 Vulcão — evacue antes da lava */
GREG(118,{
init(root,H){
const N=7,LAVA=[[6,3],[5,3],[4,3],[3,3],[2,3],[1,3],[0,3]];
const VIL=[{r:5,c:1,p:30},{r:3,c:5,p:40},{r:1,c:1,p:30}];
let over=false,turn=1,front=0,saved=0,lost=0,acts=3,bar={},evac={};
const hud=H.hud(root,[["tn","TURNO","1/10"],["sv","SALVOS",0],["ac","AÇÕES",3]]);
const say=H.msg(root,"Lava desce a coluna central! Clique na vila para <b>evacuar</b> (1 ação) ou na lava futura para <b>barreira</b> (segura 2 turnos, máx 3).");
const o=H.cvs(root,420,420),x=o.x;
const tot=VIL.reduce((a,v)=>a+v.p,0);
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
function lavaAt(){return LAVA[Math.min(front,LAVA.length-1)];}
H.onTap(o,(px,py)=>{
  if(over||acts<=0)return;
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  const vi=VIL.findIndex(v=>v.r===r&&v.c===c&&!evac[vi2id(r,c)]&&!eaten(r,c));
  const id=r+","+c;
  if(vi>=0&&!evac[id]){evac[id]=1;saved+=VIL[vi].p;acts--;H.sfx("ok");hud.set("sv",saved+"/"+tot);
    say(""+VIL[vi].p+" moradores evacuados!");return;}
  if(LAVA.some(l=>l[0]===r&&l[1]===c)&&Object.keys(bar).length<3&&!bar[id]){
    bar[id]=2;acts--;H.sfx("tick");say("Barreira erguida! (+2 turnos)");return;}
  H.sfx("bad");
});
function vi2id(r,c){return r+","+c;}
function eaten(r,c){
  for(let i=0;i<front&&i<LAVA.length;i++)if(LAVA[i][0]===r&&LAVA[i][1]===c)return true;
  return false;
}
H.loop(()=>{
  const ss=s();
  x.fillStyle=H.C.ok;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    x.strokeStyle="rgba(0,0,0,.15)";x.strokeRect(c*ss,r*ss,ss,ss);
  }
  x.font=Math.floor(ss*.6)+"px serif";
  for(let i=0;i<front&&i<LAVA.length;i++){
    const[r,c]=LAVA[i];
    x.fillStyle="#D94E34";x.fillRect(c*ss,r*ss,ss,ss);
    x.fillText("i:flame",c*ss+6,r*ss+ss-6);
  }
  LAVA.forEach((l,i)=>{
    if(i<front)return;
    const id=l[0]+","+l[1];
    x.fillStyle="rgba(217,78,52,.25)";x.fillRect(l[1]*ss,l[0]*ss,ss,ss);
    if(bar[id])x.fillText("i:brick",l[1]*ss+6,l[0]*ss+ss-6);
  });
  const top=LAVA[LAVA.length-1];
  x.fillText("i:volcano",top[1]*ss+2,top[0]*ss+ss-2);
  VIL.forEach(v=>{
    const id=v.r+","+v.c;
    if(evac[id])x.fillText("i:check",v.c*ss+6,v.r*ss+ss-6);
    else if(eaten(v.r,v.c))x.fillText("i:skull",v.c*ss+6,v.r*ss+ss-6);
    else x.fillText("i:house",v.c*ss+6,v.r*ss+ss-6);
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("barreiras: "+Object.keys(bar).length+"/3",12,18);
});
H.btn(root,"Avançar turno",()=>{
  if(over)return;
  const lavaCell=LAVA[Math.min(front,LAVA.length-1)];
  const id=lavaCell?lavaCell[0]+","+lavaCell[1]:null;
  if(id&&bar[id]){bar[id]--;if(bar[id]<=0)delete bar[id];say("Barreira segurou a lava!");}
  else front++;
  VIL.forEach(v=>{
    const vid=v.r+","+v.c;
    if(!evac[vid]&&eaten(v.r,v.c)){lost+=v.p;say("Uma vila foi engolida! ("+v.p+" moradores)");evac[vid]=2;}
  });
  turn++;acts=3;hud.set("tn",turn+"/10");hud.set("ac",3);hud.set("sv",saved+"/"+tot);
  const doneAll=VIL.every(v=>evac[v.r+","+v.c]);
  if(doneAll||turn>10){
    over=true;
    const pct=Math.round(saved/tot*100);H.score(saved);
    if(pct>=80)return H.done({win:true,score:saved+100,title:"Evacuação heroica!",sub:pct+"% da população a salvo."});
    return H.done({win:false,score:saved,title:"Cinzas e lamento…",sub:"Só "+pct+"% salvos. Evacue cedo, barre a lava!"});
  }
},true);
}});
