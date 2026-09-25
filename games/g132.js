/* NCODE N · 132 Lava-Jato — 8 carros, 4 etapas em ordem */
GREG(132,{
init(root,H){
const ST=["Sabão","Esfrega","Enxágue","Seca"];
let over=false,cars=[],served=0,spawn=0;
const hud=H.hud(root,[["cr","CARROS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Carros avançam sozinhos! Clique na <b>etapa certa</b> quando o carro estiver na sua estação (faixas coloridas). Ordem: →→→.");
const o=H.cvs(root,520,260),x=o.x;
let sc=0,nid=0;
const ZW=o.W/4;
function paint2(){hud.set("cr",served+"/8");}
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&served+cars.length<9){
    spawn=7;
    cars.push({id:nid++,x:-50,stage:0,prog:0,col:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F"][nid%4]});
  }
  for(let i=cars.length-1;i>=0;i--){
    const c=cars[i];
    const need=c.stage<4;
    const inZone=c.x>=c.stage*ZW&&c.x<(c.stage+1)*ZW-40;
    if(need&&inZone&&c.prog<=0){
      // parado esperando a etapa
    }else{
      c.x+=44*dt;
    }
    if(need&&c.x>=(c.stage+1)*ZW-40&&c.prog<=0){
      // passou da estação sem fazer: volta? perde a etapa
      cars.splice(i,1);H.sfx("bad");
      say("Carro saiu sujo! Clique a etapa quando ele estiver na faixa.");
      if(served+cars.length>=9){/* fluxo */}
      continue;
    }
    if(c.prog>0){
      c.prog-=dt;
      if(c.prog<=0){c.stage++;}
    }
    if(c.stage>=4&&c.x>o.W+40){
      cars.splice(i,1);served++;sc+=50;H.score(sc);H.sfx("ok");paint2();
      if(served>=8){over=true;return H.done({win:true,score:sc+100,title:"Carros brilhando!",sub:"8 lavagens completas no ritmo da esteira."});}
    }
  }
  const cols=["#7fb3d5","#E8A33D","#3E7C4F","#C4D645"];
  for(let z=0;z<4;z++){
    x.fillStyle=cols[z]+"44";x.fillRect(z*ZW,0,ZW,o.H);
    x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
    x.fillText(ST[z],z*ZW+8,20);
  }
  cars.forEach(c=>{
    x.fillStyle=c.col;
    x.fillRect(c.x,120,70,36);
    x.fillStyle="#222";
    x.beginPath();x.arc(c.x+15,158,9,0,7);x.arc(c.x+55,158,9,0,7);x.fill();
    x.fillStyle="#fff";x.font="bold 11px 'Space Mono',monospace";
    x.fillText("etapa "+(c.stage+1)+"/4",c.x+4,140);
    if(c.prog>0){x.fillStyle=H.C.ink;x.fillText("…",c.x+32,112);}
  });
});
const row=H.el("div","g-row",null,root);
ST.forEach((s,i)=>{
  H.btn(row,s,()=>{
    if(over)return;
    const c=cars.find(k=>k.stage===i&&k.prog<=0&&k.x>=i*ZW-10&&k.x<(i+1)*ZW-40);
    if(c){c.prog=1.6;H.sfx("tick");}
    else H.sfx("bad");
  },false);
});
}});
