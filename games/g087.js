/* NCODE N · 087 Colônia de Formigas — 10 dias de rainha */
GREG(87,{
init(root,H){
let over=false,day=1,ants=12,food=20,tunnel=0,jobs={f:6,g:3,d:3},log=[];
const hud=H.hud(root,[["dia","DIA","1/10"],["ants","FORMIGAS",12],["food","COMIDA",20],["tun","TÚNEL","0%"]]);
const say=H.msg(root,"Distribua as formigas entre <b>forragear, guardar e cavar</b>. Sobreviva 10 dias com o túnel pronto!");
const box=H.el("div","g-col",null,root);
const logBox=H.el("div","g-msg","A rainha aguarda suas ordens…",root);
const JOBS=[["f","Forrageiras"],["g","Guardas"],["d","Cavadoras"]];
function paint(){
  box.innerHTML="";
  JOBS.forEach(([k,n])=>{
    const row=H.el("div","g-row",null,box);
    H.el("span","g-chip",n+" <b>"+jobs[k]+"</b>",row);
    const m=H.el("button","g-btn sm ghost","−",row);
    const p=H.el("button","g-btn sm ghost","+",row);
    m.addEventListener("click",()=>{if(jobs[k]>0){jobs[k]--;H.sfx("tick");paint();}});
    p.addEventListener("click",()=>{
      const tot=jobs.f+jobs.g+jobs.d;
      if(tot<ants){jobs[k]++;H.sfx("tick");paint();}
      else{H.sfx("bad");}
    });
  });
  const row=H.el("div","g-row",null,box);
  H.el("span","g-chip","Livres: <b>"+(ants-jobs.f-jobs.g-jobs.d)+"</b>",row);
}
function nextDay(){
  if(over)return;
  const atk=Math.floor(Math.random()*7);
  const gain=jobs.f*2;
  food+=gain;
  const eat=8+day;
  food-=eat;
  let msg="Dia "+day+": +"+gain+" comida, −"+eat+" consumida. ";
  if(jobs.g<atk){
    const loss=Math.min(ants-1,atk-jobs.g);
    ants-=loss;food=Math.max(0,food-6);
    msg+="Aranha (força "+atk+")! Guardas insuficientes: −"+loss+" formigas. ";
    H.sfx("bad");
  }else{msg+="Ataque "+atk+" repelido. ";H.sfx("ok");}
  tunnel=Math.min(100,tunnel+jobs.d*8);
  msg+="Túnel em "+tunnel+"%.";
  const tot=jobs.f+jobs.g+jobs.d;
  if(tot>ants){jobs.f=Math.min(jobs.f,ants);jobs.g=Math.min(jobs.g,Math.max(0,ants-jobs.f));jobs.d=Math.max(0,ants-jobs.f-jobs.g);}
  hud.set("food",food);hud.set("ants",ants);hud.set("tun",tunnel+"%");
  logBox.innerHTML=msg;say(msg);
  if(ants<3||food<0){over=true;return H.done({win:false,score:day*20,title:"Colônia colapsou!",sub:msg});}
  day++;
  if(day>10){
    over=true;
    if(tunnel>=100)return H.done({win:true,score:200+ants*10,title:"Colônia próspera!",sub:"10 dias, túnel pronto e "+ants+" formigas."});
    return H.done({win:false,score:100,title:"Túnel incompleto!",sub:"Só "+tunnel+"% cavado. Mais cavadoras!"});
  }
  hud.set("dia",day+"/10");paint();
}
H.btn(root,"Avançar dia",nextDay,true);
paint();
}});
