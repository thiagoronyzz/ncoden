/* NCODE N · 127 Dia na Fazenda — $100 em 5 dias */
GREG(127,{
init(root,H){
const CROP={nabo:{e:"🌱",f:"🥕",n:"Nabo",cost:3,t:2,pr:8},abob:{e:"🌱",f:"🎃",n:"Abóbora",cost:8,t:4,pr:25}};
let over=false,day=1,cash=20,plots=[],plant="nabo";
const hud=H.hud(root,[["dd","DIA","1/5"],["cx","CAIXA","$20"],["mt","META","$100"]]);
const say=H.msg(root,"Clique no canteiro vazio para <b>plantar</b>, no seco 💧 para <b>regar</b>, no maduro para <b>colher e vender</b>!");
const box=H.el("div","g-col",null,root);
const prow=H.el("div","g-board",null,box);
prow.style.gridTemplateColumns="repeat(3,1fr)";
prow.style.width="min(100%,300px)";
plots=new Array(6).fill(0).map(()=>null);
function paint(){
  hud.set("dd",day+"/5");hud.set("cx","$"+cash);
  prow.innerHTML="";
  plots.forEach((p,i)=>{
    const b=H.el("button","g-cell"+(p&&p.g>=CROP[p.k].t?" good":""),null,prow);
    b.style.minHeight="70px";b.style.fontSize="14px";
    if(!p)b.innerHTML="🟫<br>plantar";
    else if(p.g>=CROP[p.k].t)b.innerHTML=CROP[p.k].f+"<br>COLHER!";
    else b.innerHTML=CROP[p.k].e+" "+p.g+"/"+CROP[p.k].t+(p.w?"":"<br>💧 seco");
    b.addEventListener("click",()=>act(i));
  });
}
function act(i){
  if(over)return;
  const p=plots[i];
  if(!p){
    if(cash<CROP[plant].cost){H.sfx("bad");return;}
    cash-=CROP[plant].cost;plots[i]={k:plant,g:0,w:false};H.sfx("tick");paint();return;
  }
  if(p.g>=CROP[p.k].t){cash+=CROP[p.k].pr;plots[i]=null;H.score(cash);H.sfx("ok");paint();return;}
  if(!p.w){p.w=true;H.sfx("tick");paint();}
  else H.sfx("bad");
}
paint();
const row=H.el("div","g-row",null,root);
Object.keys(CROP).forEach(k=>{
  H.btn(row,CROP[k].f+" "+CROP[k].n+" $"+CROP[k].cost+" ("+CROP[k].t+"d → $"+CROP[k].pr+")",()=>{plant=k;H.sfx("tick");say("Plantando "+CROP[k].n+".");},k===plant);
});
H.btn(root,"🌙 Encerrar o dia",()=>{
  if(over)return;
  plots.forEach(p=>{if(p&&p.w&&p.g<CROP[p.k].t)p.g++;if(p)p.w=false;});
  day++;
  if(day>5){
    over=true;H.score(cash);
    plots.forEach(p=>{if(p&&p.g>=CROP[p.k].t)cash+=CROP[p.k].pr;});
    if(cash>=100)return H.done({win:true,score:cash,title:"Fazenda próspera!",sub:"$"+cash+" em 5 dias."});
    return H.done({win:false,score:cash,title:"Colheita fraca…",sub:"$"+cash+" (meta $100). Abóbora vale mais!"});
  }
  say("☀️ Dia "+day+": regue tudo de novo!");
  paint();
},true);
}});
