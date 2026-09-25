/* NCODE N · 137 Livraria — 10 leitores atendidos */
GREG(137,{
init(root,H){
const GEN=["romance","aventura","história"];
let over=false,stock=[3,3,3],cust=[],served=0,lost=0,spawn=1,time=150,nid=0;
const hud=H.hud(root,[["rd","LEITORES","0/10"],["tp","TEMPO",150],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no cliente para <b>recomendar</b> (gasta 1 do gênero). <b>Repor</b> enche a prateleira. <b>Sarau</b> acalma a fila (+6s para todos, recarrega)!");
const box=H.el("div","g-col",null,root);
const cbox=H.el("div","g-col",null,box);
const sbox=H.el("div","g-row",null,box);
let sc=0,cool=0;
function paint(){
  hud.set("rd",served+"/10");
  cbox.innerHTML="";
  cust.forEach(c=>{
    const b=H.el("button","g-chip","quer "+GEN[c.g]+""+Math.ceil(c.p),cbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      if(stock[c.g]<=0){H.sfx("bad");say("Prateleira vazia! Reponha "+GEN[c.g]+".");return;}
      stock[c.g]--;cust=cust.filter(q=>q.id!==c.id);
      served++;sc+=30;H.score(sc);H.sfx("ok");paint();
      if(served>=10){over=true;return H.done({win:true,score:sc+100,title:"Livreiros felizes!",sub:"10 leitores com o livro certo."});}
    });
  });
  if(!cust.length)H.el("div","g-chip","loja calma…",cbox);
  sbox.innerHTML="";
  GEN.forEach((g,i)=>{
    const b=H.el("button","g-chip",""+g+": "+stock[i]+" · repor",sbox);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{if(!over){stock[i]=Math.min(6,stock[i]+2);H.sfx("tick");paint();}});
  });
}
paint();
H.btn(root,"Sarau (+6s p/ todos)",()=>{
  if(over||cool>0)return;
  cool=20;cust.forEach(c=>c.p+=6);H.sfx("ok");say("Sarau! Fila acalmada.");paint();
},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;cool-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Livraria fechou!",sub:"Só "+served+"/10 atendidos."});}
  spawn-=dt;
  if(spawn<=0&&cust.length<3&&served+cust.length<12){
    spawn=5;cust.push({id:nid++,g:Math.floor(Math.random()*3),p:22});paint();
  }
  for(let i=cust.length-1;i>=0;i--){
    cust[i].p-=dt;
    if(cust[i].p<=0){cust.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Leitores fugiram!",sub:"3 desistências. Reponha e recomende!"});}
    }
  }
  if(Math.random()<dt*3)paint();
});
}});
