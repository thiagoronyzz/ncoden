/* NCODE N · 044 Chuva de Perigos — desvie, colete, sobreviva */
GREG(44,{
init(root,H){
let over=false,px=250,items=[],sc=0,lives=3,t=60,spawn=0;
const hud=H.hud(root,[["sc","PONTOS",0],["vd","VIDAS",3],["tp","TEMPO",60]]);
const say=H.msg(root,"Mova com <b>mouse, toque ou setas</b>. Moedas valem 10, estrelas ★ 30, bigornas machucam!");
const o=H.cvs(root,500,400),x=o.x;
const ptr=H.ptr(o);
const kb=H.keys();
H.loop(dt=>{
  if(over)return;
  t-=dt;hud.set("tp",Math.ceil(Math.max(0,t)));H.time(Math.ceil(Math.max(0,t))+"s");
  if(t<=0){over=true;
    return sc>=200?H.done({win:true,score:sc,title:"Sobrevivente!",sub:sc+" pontos sem ser esmagado."})
                  :H.done({win:false,score:sc,title:"Poucas moedas",sub:"Meta 200 — você fez "+sc+". Arrisque-se mais!"});}
  if(kb.is("ArrowLeft"))px-=320*dt;
  if(kb.is("ArrowRight"))px+=320*dt;
  if(ptr.down)px+=(ptr.x-px)*Math.min(1,dt*10);
  px=H.clamp(px,30,o.W-30);
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.25,.7-t*0.006);
    const r=Math.random();
    items.push({x:20+Math.random()*(o.W-40),y:-20,vy:160+Math.random()*140+(60-t)*3,
      k:r<.55?"coin":r<.8?"anvil":"star"});
  }
  for(let i=items.length-1;i>=0;i--){
    const it=items[i];it.y+=it.vy*dt;
    if(it.y>o.H-70&&it.y<o.H-20&&Math.abs(it.x-px)<34){
      items.splice(i,1);
      if(it.k==="coin"){sc+=10;H.sfx("tick");}
      else if(it.k==="star"){sc+=30;H.sfx("ok");}
      else{lives--;hud.set("vd",lives);H.sfx("bad");
        if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Esmagado!",sub:sc+" pontos antes da terceira bigorna."});}
        say("Ai! Vidas: "+lives);
      }
      H.score(sc);hud.set("sc",sc);
    }else if(it.y>o.H+20)items.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.strokeStyle=H.C.cement;
  for(let i=0;i<8;i++){x.beginPath();x.moveTo(i*70,0);x.lineTo(i*70-20,o.H);x.stroke();}
  x.font="26px serif";
  for(const it of items)x.fillText(it.k==="coin"?"i:coin":it.k==="star"?"★":"",it.x-13,it.y+9);
  x.font="34px serif";x.fillText("i:person",px-17,o.H-34);
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("◀ ▶ ou arraste",12,20);
});
}});
