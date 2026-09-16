/* NCODE N · 106 Restaurante Lotado — sirva 12 mesas */
GREG(106,{
init(root,H){
const TABLES=[{s:2},{s:2},{s:4},{s:6}];
let over=false,queue=[],tabs=[],served=0,lost=0,spawn=1,sel=-1;
const hud=H.hud(root,[["sv","SERVIDOS","0/12"],["pd","DESISTÊNCIAS","0/4"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no grupo e depois numa <b>mesa livre que caiba</b>. Quem espera demais vai embora!");
const box=H.el("div","g-col",null,root);
const qrow=H.el("div","g-row",null,box);
const trow=H.el("div","g-row",null,box);
let sc=0;
tabs=TABLES.map(t=>({s:t.s,busy:0}));
let nid=0;
function paint(){
  qrow.innerHTML="";trow.innerHTML="";
  queue.forEach((g,i)=>{
    const b=H.el("button","g-chip"+(sel===i?" hot":""),"👥"+g.n+" ⏳"+Math.ceil(g.p),qrow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{sel=i;H.sfx("tick");paint();});
  });
  if(!queue.length)H.el("div","g-chip","fila vazia…",qrow);
  tabs.forEach((t,i)=>{
    const b=H.el("button","g-chip"+(t.busy>0?"":" hot"),t.busy>0?("🍽️ "+Math.ceil(t.busy)+"s"):("🪑 mesa "+t.s+" ("+(t.s)+" lug.)"),trow);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over||sel<0||t.busy>0)return;
      const g=queue[sel];
      if(g.n>t.s){H.sfx("bad");say("Grupo de "+g.n+" não cabe na mesa de "+t.s+"!");return;}
      t.busy=8;queue.splice(sel,1);sel=-1;H.sfx("ok");paint();
    });
  });
}
paint();
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&served+queue.length+tabs.filter(t=>t.busy>0).length<14){
    spawn=3.2;
    queue.push({id:nid++,n:[1,2,2,3,4,5,6][Math.floor(Math.random()*7)],p:16});
    if(sel>=queue.length)sel=-1;
    paint();
  }
  for(let i=queue.length-1;i>=0;i--){
    queue[i].p-=dt;
    if(queue[i].p<=0){
      queue.splice(i,1);lost++;hud.set("pd",lost+"/4");H.sfx("bad");paint();
      if(sel>=queue.length)sel=-1;
      if(lost>=4){over=true;return H.done({win:false,score:sc,title:"Salão vazio!",sub:"4 grupos desistiram. Acomode mais rápido!"});}
    }
  }
  tabs.forEach(t=>{
    if(t.busy>0){
      t.busy-=dt;
      if(t.busy<=0){
        served++;sc+=40;H.score(sc);hud.set("sc",sc);hud.set("sv",served+"/12");H.sfx("ok");
        if(served>=12){over=true;return H.done({win:true,score:sc+120,title:"Casa cheia, casa feliz!",sub:"12 grupos servidos sem esvaziar a fila."});}
      }
    }
  });
  if(Math.random()<dt*4)paint();
});
}});
