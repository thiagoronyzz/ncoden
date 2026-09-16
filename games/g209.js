/* NCODE N · 209 Dança de Sapateado — 32 passos! */
GREG(209,{
init(root,H){
let over=false,t=0,steps=[],done=0,err=0;
const hud=H.hud(root,[["ps","PASSOS","0/32"],["er","ERROS","0/5"]]);
const say=H.msg(root,"Siga o padrão: <b>← pé esquerdo / → pé direito</b> (setas, A/D ou botões), um por batida! 5 erros = fim.");
const o=H.cvs(root,500,300),x=o.x;
const r=H.rng(61);
const PAT=[];
for(let i=0;i<32;i++)PAT.push(r()<.5?"L":"R");
PAT.forEach((p,i)=>steps.push({t:1.5+i*0.5,p,hit:0}));
function step(foot){
  if(over)return;
  const s=steps.find(k=>!k.hit&&Math.abs(k.t-t)<0.22);
  if(s&&s.p===foot){
    s.hit=1;done++;H.score(done*20);hud.set("ps",done+"/32");
    H.sfx("ok");H.beep(foot==="L"?300:380,.07);
    if(done>=32){over=true;return H.done({win:true,score:740,title:"Sapateador!",sub:"32 passos sem pisar fora!"});
  }
}else{
    err++;hud.set("er",err+"/5");H.sfx("bad");
    if(s)s.hit=-1;
    if(err>=5){over=true;return H.done({win:false,score:done*20,title:"Tropeçou!",sub:done+"/32 passos."});}
  }
}
const kb=H.keys();
kb.on((c,d)=>{if(!d)return;
  if(c==="ArrowLeft"||c==="KeyA")step("L");
  if(c==="ArrowRight"||c==="KeyD")step("R");});
const row=H.el("div","g-row",null,root);
H.btn(row,"🦶 ESQUERDO",()=>step("L"),false);
H.btn(row,"DIREITO 🦶",()=>step("R"),false);
H.loop(dt=>{
  if(over)return;
  t+=dt;
  steps.forEach(s=>{
    if(!s.hit&&t>s.t+0.22){
      s.hit=-1;err++;hud.set("er",err+"/5");H.sfx("bad");
      if(err>=5){over=true;H.done({win:false,score:done*20,title:"Tropeçou!",sub:done+"/32 passos."});}
    }
  });
  if(over)return;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.font="54px serif";
  x.fillText("💃",o.W/2-27,120);
  const nx=steps.find(s=>!s.hit);
  x.font="bold 20px 'Space Mono',monospace";
  steps.forEach((s,i)=>{
    if(s.hit||s.t<t-0.3||i>done+6)return;
    const gx=60+(s.t-t)*160;
    if(gx<20||gx>o.W-20)return;
    x.fillStyle=s.p==="L"?"#2E6E8A":H.C.terra;
    x.fillText(s.p==="L"?"◀ L":"R ▶",gx,220);
  });
  x.fillStyle=H.C.ink;
  x.fillRect(o.W/2-2,160,4,100);
  x.font="13px 'Space Mono',monospace";
  x.fillText("pise o pé certo na linha!",160,270);
});
}});
