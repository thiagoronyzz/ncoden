/* NCODE N · 141 Cinema — $120 em ingressos e pipoca */
GREG(141,{
init(root,H){
let over=false,rooms=[],queue=[],cash=0,pop=6,time=180,nid=0,spawn=1;
const hud=H.hud(root,[["cx","CAIXA","$0/120"],["pp","PIPOCA",6],["tp","TEMPO",180]]);
const say=H.msg(root,"Clique no cliente para <b>acomodar</b> na sala do filme dele (se houver lugar). <b> Estourar</b> repõe pipoca — cada espectador compra uma!");
const box=H.el("div","g-col",null,root);
const qbox=H.el("div","g-col",null,box);
const rbox=H.el("div","g-row",null,box);
rooms=[{mv:"Espacial",cap:6,in:[],t:30},{mv:"Comédia",cap:4,in:[],t:24}];
function paint(){
  hud.set("cx","$"+cash+"/120");hud.set("pp",pop);
  qbox.innerHTML="";
  queue.forEach(c=>{
    const b=H.el("button","g-chip",""+rooms[c.m].mv+""+Math.ceil(c.p),qbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      const r=rooms[c.m];
      if(r.in.length>=r.cap){H.sfx("bad");say("Sala lotada! Espere a sessão acabar.");return;}
      queue=queue.filter(q=>q.id!==c.id);
      r.in.push(1);cash+=8;
      if(pop>0){pop--;cash+=4;}
      H.score(cash);H.sfx("ok");paint();
      if(cash>=120){over=true;return H.done({win:true,score:cash+Math.floor(time),title:"Sessão esgotada!",sub:"$"+cash+" de bilheteria e bombonière."});}
    });
  });
  if(!queue.length)H.el("div","g-chip","bilheteria calma…",qbox);
  rbox.innerHTML="";
  rooms.forEach(r=>{
    H.el("div","g-chip",r.mv+" · "+r.in.length+"/"+r.cap+" · "+Math.ceil(r.t)+"s",rbox);
  });
}
paint();
H.btn(root,"Estourar pipoca (+4)",()=>{
  if(over||pop>=10)return;
  pop=Math.min(10,pop+4);H.sfx("tick");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:cash,title:"Última sessão!",sub:"$"+cash+"/120. Acomode e venda pipoca!"});}
  spawn-=dt;
  if(spawn<=0&&queue.length<4){spawn=3.5;queue.push({id:nid++,m:Math.floor(Math.random()*2),p:20});paint();}
  rooms.forEach(r=>{
    r.t-=dt;
    if(r.t<=0){r.t=r.cap===6?30:24;if(r.in.length){r.in=[];H.sfx("tick");}}
  });
  for(let i=queue.length-1;i>=0;i--){
    queue[i].p-=dt;
    if(queue[i].p<=0){queue.splice(i,1);paint();}
  }
  if(Math.random()<dt*2)paint();
});
}});
