/* NCODE N · 234 Guerra de Cartas — leve as 52! */
GREG(234,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,you=[],cpu=[],log=[],battles=0;
const hud=H.hud(root,[["vc","SUAS","26"],["cp","DELE","26"],["bt","BATALHAS",0]]);
const say=H.msg(root,"Aperte <b>BATALHAR</b>! Maior leva. Empate = GUERRA (3 viradas + decide). Leve as 52 (máx 300 batalhas)!");
const box=H.el("div","g-col",null,root);
const vs=H.el("div","g-msg","",box);
const lg=H.el("div","g-msg","",box);
function deal(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push(r);
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  you=d.slice(0,26);cpu=d.slice(26);
}
deal();
function paint(){
  hud.set("vc",you.length);hud.set("cp",cpu.length);hud.set("bt",battles);
  lg.innerHTML=log.slice(-4).join("<br>");
}
function battle(){
  if(over)return;
  battles++;
  const pile=[];
  while(true){
    if(!you.length||!cpu.length)break;
    const a=you.shift(),b=cpu.shift();
    pile.push(a,b);
    vs.innerHTML="Você <b>"+RN(a)+"</b> × <b>"+RN(b)+"</b> CPU";
    if(a===1||b===1){/* A vale 14 */}
    const va=a===1?14:a,vb=b===1?14:b;
    if(va===vb){
      log.push("GUERRA! ("+pile.length+" na mesa)");
      for(let i=0;i<3;i++){
        if(you.length)pile.push(you.shift());
        if(cpu.length)pile.push(cpu.shift());
      }
      continue;
    }
    if(va>vb){you.push(...pile);log.push("✔ Você levou "+pile.length+"!");}
    else{cpu.push(...pile);log.push("✕ CPU levou "+pile.length+".");}
    break;
  }
  H.sfx("tick");paint();
  if(!cpu.length||!you.length||battles>=300){
    over=true;
    const winCpu=!you.length?false:!cpu.length?true:you.length>=cpu.length;
    H.score(you.length);
    if(winCpu&&you.length>=cpu.length&&you.length>0||!cpu.length)
      return H.done({win:true,score:100,title:"General invicto!",sub:"Todas as 52 cartas são suas!"});
    if(battles>=300&&you.length>=cpu.length)
      return H.done({win:true,score:you.length,title:"Venceu no tempo!",sub:you.length+" × "+cpu.length+" em 300 batalhas."});
    return H.done({win:false,score:cpu.length,title:"Derrota!",sub:"CPU ficou com as cartas. Guerra é sorte!"});
  }
}
paint();
H.btn(root,"BATALHAR!",battle,true);
H.btn(root,"→ 10 batalhas",()=>{if(!over){for(let i=0;i<10&&!over;i++)battle();}},false);
}});
