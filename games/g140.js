/* NCODE N · 140 Aquário — $150 em ingressos */
GREG(140,{
init(root,H){
let over=false,tanks=[],cash=0,time=180,show=0;
const hud=H.hud(root,[["cx","CAIXA","$0/150"],["tp","TEMPO",180],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no tanque para <b> alimentar</b>, duas vezes rápido para <b> limpar</b>. Peixes saudáveis atraem público pagante! <b>Show</b> dobra a renda por 15s.");
const box=H.el("div","g-col",null,root);
const trow=H.el("div","g-board",null,box);
trow.style.gridTemplateColumns="repeat(3,1fr)";
trow.style.width="min(100%,360px)";
tanks=[0,1,2].map(()=>({hung:80,dirt:10,fish:3}));
function paint(){
  hud.set("cx","$"+Math.floor(cash)+"/150");
  trow.innerHTML="";
  tanks.forEach((t,i)=>{
    const b=H.el("button","g-cell"+(t.fish===0?" bad":t.hung<25||t.dirt>75?" hot":" good"),null,trow);
    b.style.minHeight="86px";b.style.fontSize="13px";
    b.innerHTML="".repeat(t.fish)+"<br>"+Math.floor(t.hung)+""+Math.floor(100-t.dirt);
    let clicks=0;
    b.addEventListener("click",()=>{
      if(over||t.fish===0)return;
      clicks++;
      H.after(350,()=>{
        if(clicks>=2){t.dirt=Math.max(0,t.dirt-50);H.sfx("ok");say("Tanque "+(i+1)+" limpo!");}
        else{t.hung=Math.min(100,t.hung+30);H.sfx("tick");}
        clicks=0;paint();
      });
    });
  });
}
paint();
H.btn(root,"Show das focas (dobra renda 15s)",()=>{
  if(over||show>0)return;
  show=15;H.sfx("ok");say("SHOW! Renda dobrada!");
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;show-=dt;
  hud.set("tp",Math.max(0,Math.ceil(time)));
  tanks.forEach(t=>{
    if(t.fish===0)return;
    t.hung-=dt*4;t.dirt+=dt*3;
    if(t.hung<=0||t.dirt>=100){
      t.fish--;t.hung=70;t.dirt=30;H.sfx("bad");say("Um peixe não resistiu!");paint();
    }
  });
  const health=tanks.reduce((a,t)=>a+t.fish*(t.hung/100)*(1-t.dirt/150),0);
  cash+=dt*(0.5+health*0.35)*(show>0?2:1);
  H.score(Math.floor(cash));
  if(Math.random()<dt*2)paint();
  if(tanks.every(t=>t.fish===0)){over=true;return H.done({win:false,score:Math.floor(cash),title:"Tanques vazios!",sub:"Todos os peixes… Alimente e limpe!"});}
  if(cash>=150){over=true;return H.done({win:true,score:150+Math.floor(time),title:"Aquário lotado!",sub:"$150 em ingressos antes do fechamento."});}
  if(time<=0){over=true;return H.done({win:false,score:Math.floor(cash),title:"Hora de fechar!",sub:"$"+Math.floor(cash)+"/150. Peixes saudáveis = público!"});}
});
}});
