/* NCODE N · 146 Mecânico — 6 carros, ferramenta certa */
GREG(146,{
init(root,H){
const PART={freio:{s:"rangido",t:"chave"},motor:{s:"fumaça",t:"martelo"},pneu:{s:"chiado",t:"furadeira"}};
let over=false,car=null,diag=null,prog=0,served=0,err=0,spawn=0,nid=0;
const hud=H.hud(root,[["cr","CARROS","0/6"],["er","ERROS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"1⃣ <b>Diagnosticar</b> revela a peça. 2⃣ Escolha a <b>ferramenta</b>. 3⃣ SEGURE <b>consertar</b>. Ferramenta errada quebra a peça!");
const box=H.el("div","g-col",null,root);
const cbox=H.el("div","g-msg","elevador livre…",box);
const pbox=H.el("div","g-msg","",box);
let sc=0,hold=false,tool=null;
function paint(){
  cbox.innerHTML=car?("sintoma: <b>"+PART[car.k].s+"</b>"+(diag?" · peça: <b>"+car.k+"</b> "+PART[car.k].t:" · peça: ?")):"elevador livre…";
}
H.btn(root,"Diagnosticar",()=>{
  if(over||!car||diag)return;
  diag=car.k;H.sfx("ok");paint();say("Peça: "+car.k+"! Pegue "+PART[car.k].t+".");
},false);
const trow=H.el("div","g-row",null,root);
["chave","martelo","furadeira"].forEach(t=>{
  H.btn(trow,t,()=>{tool=t.split(" ")[0];H.sfx("tick");say("Ferramenta: "+t);},false);
});
const fb=H.el("button","g-btn","SEGURE PARA CONSERTAR",root);
fb.addEventListener("pointerdown",e=>{e.preventDefault();hold=true;});
fb.addEventListener("pointerup",()=>hold=false);
fb.addEventListener("pointerleave",()=>hold=false);
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&!car&&served<6){
    spawn=1;
    const ks=Object.keys(PART);
    car={k:ks[Math.floor(Math.random()*3)]};diag=null;prog=0;tool=null;
    paint();say("Novo carro: "+PART[car.k].s+"!");
  }
  if(car&&hold){
    if(!diag){hold=false;H.sfx("bad");say("Diagnostique antes!");}
    else if(tool!==PART[car.k].t.split(" ")[0]){
      hold=false;err++;hud.set("er",err+"/3");H.sfx("bad");
      say("Peça quebrada! ("+err+"/3)");
      if(err>=3){over=true;return H.done({win:false,score:sc,title:"Oficina falida!",sub:"3 peças quebradas. Diagnostique e confira!"});}
    }else{
      prog+=dt/2;
      pbox.innerHTML="consertando: "+Math.floor(prog*100)+"%";
      if(prog>=1){
        car=null;diag=null;prog=0;served++;sc+=50;H.score(sc);
        hud.set("cr",served+"/6");hud.set("sc",sc);H.sfx("ok");
        pbox.innerHTML="";
        if(served>=6){over=true;return H.done({win:true,score:sc+100,title:"Mecânico mestre!",sub:"6 carros diagnosticados e consertados."});}
        say("Pronto! Próximo carro…");
      }
      paint();
    }
  }
});
}});
