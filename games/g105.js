/* NCODE N · 105 Correio Maluco — 20 encomendas, 3 destinos */
GREG(105,{
init(root,H){
const BINS=[{e:"○",n:"NORTE"},{e:"●",n:"SUL"},{e:"○",n:"LESTE"}];
let over=false,pkgs=[],spawn=0,sent=0,err=0,total=20,sel=null;
const hud=H.hud(root,[["ev","ENVIADAS","0/20"],["er","ERROS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique na encomenda e depois no <b>destino certo</b> (cor do selo). Não deixe cair da esteira!");
const o=H.cvs(root,500,300),x=o.x;
let sc=0;
const row=H.el("div","g-row",null,root);
BINS.forEach((b,i)=>{
  const btn=H.el("button","g-btn ghost",b.e+" "+b.n,row);
  btn.addEventListener("click",()=>{
    if(over||!sel)return;
    const p=pkgs.find(k=>k.id===sel);
    if(p){
      if(p.b===i){sent++;sc+=25;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        hud.set("ev",sent+"/"+total);
        if(sent>=total){over=true;return H.done({win:true,score:sc+100,title:"Correspondência em dia!",sub:"20 encomendas nos destinos certos."});}
      }else{err++;H.sfx("bad");hud.set("er",err+"/3");say("✕ Destino errado! ("+err+"/3)");
        if(err>=3){over=true;return H.done({win:false,score:sc,title:"Caos postal!",sub:"3 erros. Confira a cor do selo!"});}}
      pkgs=pkgs.filter(k=>k.id!==sel);
    }
    sel=null;
  });
});
let nid=0;
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&sent+pkgs.length+err<total+3&&sent+pkgs.length<total){
    spawn=Math.max(.7,1.6-sent*.05);
    pkgs.push({id:nid++,b:Math.floor(Math.random()*3),x:-30,y:120+Math.random()*40});
  }
  const sp=60+sent*4;
  for(let i=pkgs.length-1;i>=0;i--){
    pkgs[i].x+=sp*dt;
    if(pkgs[i].x>o.W+20){
      pkgs.splice(i,1);err++;H.sfx("bad");hud.set("er",err+"/3");
      say("Caiu da esteira! ("+err+"/3)");
      if(err>=3){over=true;return H.done({win:false,score:sc,title:"Caos postal!",sub:"3 falhas. Despache mais rápido!"});}
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A877C";x.fillRect(0,100,o.W,90);
  x.fillStyle=H.C.ink;
  for(let lx=0;lx<o.W;lx+=40)x.fillRect(lx,142,22,6);
  x.font="26px serif";
  pkgs.forEach(p=>{
    x.fillStyle=p.id===sel?"#fff":"#c9b98f";
    x.fillRect(p.x,p.y,34,30);x.strokeStyle=p.id===sel?H.C.terra:H.C.ink;
    x.lineWidth=p.id===sel?3:2;x.strokeRect(p.x,p.y,34,30);
    x.fillText(BINS[p.b].e,p.x+4,p.y+27);
  });
});
H.onTap(o,(px,py)=>{
  if(over)return;
  const p=pkgs.find(k=>px>=k.x&&px<=k.x+34&&py>=k.y&&py<=k.y+30);
  if(p){sel=p.id;H.sfx("tick");}
});
}});
