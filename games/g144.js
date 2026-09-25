/* NCODE N · 144 Correio — 18 cartas, 3 CEPs */
GREG(144,{
init(root,H){
const ZONE=["○ Sul","● Centro","○ Norte"];
let over=false,table=[],sorted=0,sent=0,err=0,spawn=1,time=150,nid=0,truck=0;
const hud=H.hud(root,[["ct","ENTREGUES","0/18"],["er","ERROS","0/3"],["tp","TEMPO",150]]);
const say=H.msg(root,"Clique na carta e depois na <b>caixa do CEP certo</b> (cor). A cada 6, o caminhão entrega sozinho!");
const box=H.el("div","g-col",null,root);
const tbox=H.el("div","g-row",null,box);
const zbox=H.el("div","g-row",null,box);
let sel=null;
function paint(){
  tbox.innerHTML="";
  table.forEach(c=>{
    const b=H.el("button","g-chip"+(sel===c.id?" hot":""),""+ZONE[c.z],tbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=c.id;H.sfx("tick");paint();});
  });
  if(!table.length)H.el("div","g-chip","mesa livre…",tbox);
}
paint();
ZONE.forEach((z,i)=>{
  H.btn(zbox,""+z,()=>{
    if(over||sel==null)return;
    const c=table.find(q=>q.id===sel);
    if(!c){sel=null;return;}
    table=table.filter(q=>q.id!==sel);sel=null;
    if(c.z===i){
      sorted++;truck++;H.sfx("ok");
      if(truck>=6){truck=0;sent+=6;H.score(sent*10);hud.set("ct",sent+"/18");H.sfx("ok");say("Caminhão partiu com 6 cartas!");
        if(sent>=18){over=true;return H.done({win:true,score:280,title:"Entrega total!",sub:"18 cartas nos CEPs certos."});}}
      hud.set("ct",sent+"/18 (+"+truck+" no caminhão)");
    }else{
      err++;hud.set("er",err+"/3");H.sfx("bad");say("✕ CEP errado! ("+err+"/3)");
      if(err>=3){over=true;return H.done({win:false,score:sent*10,title:"Cartas extraviadas!",sub:"3 erros de triagem. Confira a cor!"});}
    }
    paint();
  },false);
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sent*10,title:"Agência fechou!",sub:sent+"/18 entregues."});}
  spawn-=dt;
  if(spawn<=0&&sent+truck+table.length<20){
    spawn=2.2;
    if(table.length>=8){err++;hud.set("er",err+"/3");H.sfx("bad");
      if(err>=3){over=true;return H.done({win:false,score:sent*10,title:"Mesa transbordou!",sub:"Cartas demais acumuladas."});}}
    else{table.push({id:nid++,z:Math.floor(Math.random()*3)});paint();}
  }
});
}});
