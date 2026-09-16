/* NCODE N · 130 Lavanderia — 10 peças no prazo */
GREG(130,{
init(root,H){
let over=false,items=[],wash=[null,null],dry=[null],served=0,lost=0,spawn=1,time=180,nid=0;
const hud=H.hud(root,[["pv","DEVOLVIDAS","0/10"],["tp","TEMPO",180],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na peça suja para <b>lavar</b> → clique na lavadora pronta para <b>secar</b> → clique na secadora pronta para <b>dobrar e devolver</b>! Peça esquecida mofa e volta à estaca zero.");
const box=H.el("div","g-col",null,root);
let sc=0;
function paint(){
  hud.set("pv",served+"/10");
  box.innerHTML="";
  H.el("div","g-msg","🧺 Cesto: "+items.length+" peça(s) suja(s)",box);
  const r1=H.el("div","g-row",null,box);
  items.forEach(it=>{
    const b=H.el("button","g-chip","👕 "+Math.ceil(it.p)+"s",r1);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      const f=wash.findIndex(q=>!q);
      if(f<0){H.sfx("bad");say("Lavadoras ocupadas!");return;}
      items=items.filter(q=>q.id!==it.id);
      wash[f]={t:5,over:8};H.sfx("tick");paint();
    });
  });
  const r2=H.el("div","g-row",null,box);
  wash.forEach((w,i)=>{
    const b=H.el("button","g-cell"+(w&&w.t<=0?" good":w?" hot":""),null,r2);
    b.style.minWidth="120px";b.style.fontSize="13px";
    b.innerHTML=!w?"🌀 lav "+(i+1)+"<br>livre":w.t>0?"🌀 lavando<br>"+Math.ceil(w.t)+"s":"✅ PRONTA!<br>"+Math.ceil(w.over)+"s";
    b.addEventListener("click",()=>{
      if(over||!w||w.t>0)return;
      if(dry[0]){H.sfx("bad");say("Secadora ocupada!");return;}
      dry[0]={t:4,over:8};wash[i]=null;H.sfx("tick");paint();
    });
  });
  const r3=H.el("div","g-row",null,box);
  const d=dry[0];
  const bd=H.el("button","g-cell"+(d&&d.t<=0?" good":d?" hot":""),null,r3);
  bd.style.minWidth="140px";bd.style.fontSize="13px";
  bd.innerHTML=!d?"💨 secadora<br>livre":d.t>0?"💨 secando<br>"+Math.ceil(d.t)+"s":"✅ DOBRAR!<br>"+Math.ceil(d.over)+"s";
  bd.addEventListener("click",()=>{
    if(over||!d||d.t>0)return;
    dry[0]=null;served++;sc+=30;H.score(sc);H.sfx("ok");paint();
    if(served>=10){over=true;return H.done({win:true,score:sc+100,title:"Roupa cheirosa!",sub:"10 peças lavadas, secas e dobradas."});}
  });
}
paint();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Expediente acabou!",sub:"Só "+served+"/10 devolvidas."});}
  spawn-=dt;
  if(spawn<=0&&served+items.length+wash.filter(Boolean).length+(dry[0]?1:0)<12){
    spawn=7;items.push({id:nid++,p:40});paint();
  }
  wash.forEach((w,i)=>{
    if(!w)return;
    if(w.t>0)w.t-=dt;
    else{w.over-=dt;if(w.over<=0){wash[i]=null;items.push({id:nid++,p:30});H.sfx("bad");say("🤢 Peça mofou na lavadora! Relave.");paint();}}
  });
  if(dry[0]){
    if(dry[0].t>0)dry[0].t-=dt;
    else{dry[0].over-=dt;
      if(dry[0].over<=0){dry[0]=null;items.push({id:nid++,p:30});H.sfx("bad");say("🤢 Peça mofou na secadora! Relave.");paint();}}
  }
  for(let i=items.length-1;i>=0;i--){
    items[i].p-=dt;
    if(items[i].p<=0){items.splice(i,1);lost++;H.sfx("bad");paint();
      if(lost>=3){over=true;return H.done({win:false,score:sc,title:"Freguesia perdida!",sub:"3 clientes levaram a roupa suja embora."});}}
  }
  if(Math.random()<dt*3)paint();
});
}});
