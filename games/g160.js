/* NCODE N · 160 Barraca de Pipoca — 15 saquinhos no carnaval */
GREG(160,{
init(root,H){
const SEA=["sal","queijo","chocolate"];
let over=false,orders=[],pop=0,ready=0,served=0,lost=0,spawn=1,time=160,nid=0;
const hud=H.hud(root,[["pp","SAQUINHOS","0/15"],["ml","PRONTA",0],["tp","TEMPO",160]]);
const say=H.msg(root,"<b>Estourar</b> (5s) rende 5 porções. Clique no pedido com o <b>tempero certo</b> para ensacar e entregar!");
const box=H.el("div","g-col",null,root);
const lbox=H.el("div","g-col",null,box);
function paint(){
  hud.set("pp",served+"/15");hud.set("ml",ready+(pop>0?" (+"+Math.ceil(pop)+"s)":""));
  lbox.innerHTML="";
  orders.forEach(o=>{
    const b=H.el("button","g-chip",""+SEA[o.s]+""+Math.ceil(o.p),lbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>act(o.id));
  });
  if(!orders.length)H.el("div","g-chip","fila calma…",lbox);
}
function act(id){
  if(over)return;
  const o=orders.find(q=>q.id===id);
  if(!o)return;
  if(o.sea==null){H.sfx("bad");say("Escolha o tempero "+SEA[o.s]+" abaixo primeiro!");return;}
  if(o.sea!==o.s){H.sfx("bad");return;}
  if(ready<=0){H.sfx("bad");say("Sem pipoca pronta! Estoure mais.");return;}
  orders=orders.filter(q=>q.id!==id);
  ready--;served++;H.score(served*20);H.sfx("ok");paint();
  if(served>=15){over=true;return H.done({win:true,score:400,title:"Pipoqueiro rei!",sub:"15 saquinhos no carnaval lotado."});}
}
paint();
H.btn(root,"Estourar (5s → 5 porções)",()=>{
  if(over||pop>0||ready>=10)return;
  pop=5;H.sfx("tick");paint();
},false);
const srow=H.el("div","g-row",null,box);
SEA.forEach((s,i)=>{
  H.btn(srow,"temperar "+s,()=>{
    if(over)return;
    const o=orders.find(q=>q.sea==null);
    if(!o){H.sfx("bad");return;}
    if(o.s!==i){H.sfx("bad");say("Tempero errado! O pedido quer "+SEA[o.s]+".");return;}
    o.sea=i;H.sfx("ok");say("Temperado! Clique no pedido para ensacar.");paint();
  },false);
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:served*20,title:"Bloco acabou!",sub:served+"/15. Estoure sem parar!"});}
  if(pop>0){pop-=dt;if(pop<=0){ready=Math.min(12,ready+5);H.sfx("ok");}}
  spawn-=dt;
  if(spawn<=0&&orders.length<4&&served+orders.length<17){
    spawn=4;orders.push({id:nid++,s:Math.floor(Math.random()*3),p:20,sea:null});paint();
  }
  for(let i=orders.length-1;i>=0;i--){
    orders[i].p-=dt;
    if(orders[i].p<=0){orders.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=4){over=true;return H.done({win:false,score:served*20,title:"Foliões bravos!",sub:"4 desistências. A fila anda!"});}
    }
  }
  if(Math.random()<dt*2)paint();
});
}});
