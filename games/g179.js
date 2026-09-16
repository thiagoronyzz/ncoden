/* NCODE N · 179 Mistura de Fluidos — camadas na medida! */
GREG(179,{
init(root,H){
const FL={mel:{d:3,c:"#B06A1F",n:"🍯 mel"},agua:{d:2,c:"#2E6E8A",n:"💧 água"},oleo:{d:1,c:"#E8D33D",n:"🫒 óleo"},alcool:{d:0,c:"#BFE0EF",n:"🧪 álcool"}};
const ROUNDS=[
  {t:{mel:30,agua:30},n:"mel 30 + água 30"},
  {t:{mel:25,agua:25,oleo:25},n:"mel 25 + água 25 + óleo 25"},
  {t:{mel:20,agua:20,oleo:20,alcool:20},n:"todos 20"}
];
let over=false,rd=0,vol={mel:0,agua:0,oleo:0,alcool:0},sel="mel",pour=false;
const hud=H.hud(root,[["rd","RODADA","1/3"],["tt","TOTAL","0/100"]]);
const say=H.msg(root,"Escolha o líquido e SEGURE <b>despejar</b>. O tanque separa por densidade sozinho. Acerte as <b>quantidades (±8)</b>!");
const box=H.el("div","g-col",null,root);
const od=H.el("div","g-msg","",box);
function paint(){
  const tot=vol.mel+vol.agua+vol.oleo+vol.alcool;
  hud.set("rd",(rd+1)+"/3");hud.set("tt",Math.floor(tot)+"/100");
  od.innerHTML="🧾 Meta: "+ROUNDS[rd].n+" · atual: "+
    Object.keys(vol).map(k=>FL[k].n.split(" ")[0]+Math.floor(vol[k])).join(" ")+" · despejando: "+FL[sel].n;
}
paint();
const frow=H.el("div","g-row",null,box);
Object.keys(FL).forEach(k=>{
  H.btn(frow,FL[k].n,()=>{sel=k;H.sfx("tick");paint();},k===sel);
});
const pb=H.el("button","g-btn","SEGURE PARA DESPEJAR",box);
pb.addEventListener("pointerdown",e=>{e.preventDefault();pour=true;});
pb.addEventListener("pointerup",()=>pour=false);
pb.addEventListener("pointerleave",()=>pour=false);
const o=H.cvs(root,440,260),x=o.x;
H.loop(dt=>{
  if(over)return;
  if(pour){
    vol[sel]+=dt*14;
    const tot=vol.mel+vol.agua+vol.oleo+vol.alcool;
    if(tot>100){
      vol={mel:0,agua:0,oleo:0,alcool:0};pour=false;H.sfx("bad");
      say("🌊 TRANSBORDOU! Tanque esvaziado — recomece a rodada.");
    }
    paint();
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.ink;x.lineWidth=4;
  x.strokeRect(150,20,140,220);
  const order=["mel","agua","oleo","alcool"];
  let y=240;
  order.forEach(k=>{
    const h=vol[k]/100*220;
    x.fillStyle=FL[k].c;
    x.fillRect(154,y-h,132,h);
    y-=h;
  });
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("denso ↓",300,230);x.fillText("leve ↑",300,40);
  if(pour){
    x.fillStyle=FL[sel].c;
    x.fillRect(214,0,12,40);
  }
});
const row=H.el("div","g-row",null,box);
H.btn(row,"✅ Conferir",()=>{
  if(over)return;
  const T=ROUNDS[rd].t;
  const ok=Object.keys(T).every(k=>Math.abs(vol[k]-T[k])<=8)&&
    Object.keys(vol).every(k=>(T[k]||0)===0?vol[k]<8:true);
  if(ok){
    H.sfx("ok");rd++;
    if(rd>=ROUNDS.length){over=true;
      return H.done({win:true,score:400,title:"Química perfeita!",sub:"3 tanques em camadas exatas."});}
    vol={mel:0,agua:0,oleo:0,alcool:0};
    say("✅ Rodada pronta! Agora: "+ROUNDS[rd].n);paint();
  }else{H.sfx("bad");say("❌ Fora da medida! Compare os números (±8).");}
},true);
H.btn(row,"🗑️ Esvaziar",()=>{if(!over){vol={mel:0,agua:0,oleo:0,alcool:0};H.sfx("tick");paint();}},false);
}});
