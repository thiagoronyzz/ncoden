/* NCODE N · 138 Fábrica de Brinquedos — 20 peças, 0 defeito na caixa */
GREG(138,{
init(root,H){
let over=false,toys=[],spawn=0,done2=0,err=0,total=20,nid=0;
const hud=H.hud(root,[["pc","PEÇAS","0/20"],["er","ERROS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Brinquedo <b>perfeito 🧸</b> → 📦 EMBALAR · <b>quebrado 💔</b> (torto/cinza) → 🗑️ DESCARTAR. Clique na peça e depois no destino!");
const o=H.cvs(root,500,260),x=o.x;
let sc=0,sel=null;
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&done2+toys.length<total){
    spawn=1.5;
    toys.push({id:nid++,x:-30,bad:Math.random()<.3,wob:Math.random()*6});
  }
  for(let i=toys.length-1;i>=0;i--){
    toys[i].x+=70*dt;toys[i].wob+=dt*4;
    if(toys[i].x>o.W+30){toys.splice(i,1);err++;hud.set("er",err+"/3");H.sfx("bad");
      if(err>=3){over=true;return H.done({win:false,score:sc,title:"Linha parada!",sub:"3 falhas. Decida antes do fim da esteira!"});}
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,110,o.W,70);
  x.font="30px serif";
  toys.forEach(t=>{
    x.save();x.translate(t.x,150);
    if(t.bad){x.rotate(Math.sin(t.wob)*.4);x.globalAlpha=.55;}
    x.fillText(t.bad?"🧸‍💔":"🧸",-15,10);
    if(t.id===sel){x.strokeStyle=H.C.terra;x.lineWidth=3;x.strokeRect(-20,-28,40,44);}
    x.restore();x.globalAlpha=1;
  });
  x.font="13px 'Space Mono',monospace";x.fillStyle=H.C.ink;
  x.fillText("clique na peça para selecionar",12,24);
});
H.onTap(o,(px,py)=>{
  if(over)return;
  const t=toys.find(k=>Math.abs(px-k.x)<26&&py>100&&py<190);
  if(t){sel=t.id;H.sfx("tick");}
});
const row=H.el("div","g-row",null,root);
H.btn(row,"📦 EMBALAR (bom)",()=>{
  if(over||sel==null)return;
  const t=toys.find(k=>k.id===sel);
  if(!t){sel=null;return;}
  toys=toys.filter(k=>k.id!==sel);sel=null;
  if(t.bad){err++;hud.set("er",err+"/3");H.sfx("bad");say("💔 Defeito embalado! ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score:sc,title:"Recall!",sub:"3 defeitos na caixa. Olhe com atenção!"});}}
  else{done2++;sc+=25;H.score(sc);hud.set("pc",done2+"/"+total);H.sfx("ok");
    if(done2>=total){over=true;return H.done({win:true,score:sc+100,title:"Qualidade total!",sub:"20 brinquedos perfeitos embalados."});}}
},false);
H.btn(row,"🗑️ DESCARTAR (ruim)",()=>{
  if(over||sel==null)return;
  const t=toys.find(k=>k.id===sel);
  if(!t){sel=null;return;}
  toys=toys.filter(k=>k.id!==sel);sel=null;
  if(!t.bad){err++;hud.set("er",err+"/3");H.sfx("bad");say("🧸 Bom descartado! ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score:sc,title:"Desperdício!",sub:"3 bons no lixo."});}}
  else{done2++;sc+=25;H.score(sc);hud.set("pc",done2+"/"+total);H.sfx("ok");
    if(done2>=total){over=true;return H.done({win:true,score:sc+100,title:"Qualidade total!",sub:"20 peças triadas sem erro."});}}
},false);
}});
