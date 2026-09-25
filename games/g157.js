/* NCODE N · 157 Sushi Bar — 10 pedidos da esteira */
GREG(157,{
init(root,H){
const PC=["nigiri","maki","temaki"];
let over=false,belt=[],order=0,served=0,err=0,time=150,spawn=0,nid=0;
const hud=H.hud(root,[["pd","PEDIDOS","0/10"],["er","ERROS","0/3"],["tp","TEMPO",150]]);
const say=H.msg(root,"O pedido mostra a peça. Clique no <b>prato certo</b> quando passar na esteira! Prato errado = erro.");
const o=H.cvs(root,500,300),x=o.x;
let sc=0;
function newOrder(){order=Math.floor(Math.random()*3);}
newOrder();
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score:sc,title:"Bar fechou!",sub:served+"/10. Fique de olho na esteira!"});}
  spawn-=dt;
  if(spawn<=0){spawn=1.6;belt.push({id:nid++,k:Math.floor(Math.random()*3),x:-30});}
  for(let i=belt.length-1;i>=0;i--){
    belt[i].x+=75*dt;
    if(belt[i].x>o.W+30)belt.splice(i,1);
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.font="bold 15px 'Space Mono',monospace";
  x.fillText("PEDIDO: "+PC[order],14,30);
  x.fillStyle="#8A877C";x.fillRect(0,120,o.W,80);
  x.fillStyle=H.C.ink;
  for(let lx=0;lx<o.W;lx+=44)x.fillRect(lx,156,24,6);
  x.font="30px serif";
  belt.forEach(p=>{
    x.fillStyle="#fff";x.beginPath();x.ellipse(p.x,160,26,14,0,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillText(PC[p.k].split(" ")[0],p.x-15,172);
  });
});
H.onTap(o,(px,py)=>{
  if(over)return;
  const p=belt.find(k=>Math.abs(px-k.x)<28&&py>110&&py<210);
  if(!p)return;
  if(p.k===order){
    belt=belt.filter(k=>k.id!==p.id);
    served++;sc+=40;H.score(sc);hud.set("pd",served+"/10");hud.set("sc",sc);H.sfx("ok");
    if(served>=10){over=true;return H.done({win:true,score:sc+100,title:"Itamae!",sub:"10 pedidos pescados da esteira."});}
    newOrder();
  }else{
    err++;hud.set("er",err+"/3");H.sfx("bad");say("✕ Peça errada! Pedido: "+PC[order]+". ("+err+"/3)");
    if(err>=3){over=true;return H.done({win:false,score:sc,title:"Cliente alérgico!",sub:"3 pratos errados. Leia o pedido!"});}
  }
});
}});
