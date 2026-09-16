/* NCODE N · 011 Cascata de Dominós — posicione e derrube até o alvo */
GREG(11,{
init(root,H){
const LV=[
 {k:6,tgt:[470,300],walls:[]},
 {k:8,tgt:[470,120],walls:[[250,120,20,180]]},
 {k:10,tgt:[470,300],walls:[[180,200,140,20],[330,80,20,140]]}
];
let lv=0,over=false,running=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["dm","DOMINÓS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no vazio para <b>plantar</b> dominós (clique num plantado para <b>girar</b>). A queda começa na base 🏁.");
const o=H.cvs(root,520,340),x=o.x;
let doms=[];
function base(){return{x:40,y:300,a:0,fall:0,ft:0};}
function reset(){doms=[base()];running=false;hud.set("dm","1/"+LV[lv].k);hud.set("nv",lv+1);}
function inWall(px,py){
  for(const w of LV[lv].walls)if(px>w[0]&&px<w[0]+w[2]&&py>w[1]&&py<w[1]+w[3])return true;
  return false;
}
H.onTap(o,(px,py)=>{
  if(over||running)return;
  for(const d of doms){
    if(Math.hypot(d.x-px,d.y-py)<16){d.a=(d.a+45)%360;H.sfx("tick");return;}
  }
  if(doms.length>=LV[lv].k){H.sfx("bad");say("Limite de <b>"+LV[lv].k+"</b> dominós!");return;}
  if(inWall(px,py)||py<30||py>320||px<10||px>510)return;
  doms.push({x:px,y:py,a:0,fall:0,ft:0});hud.set("dm",doms.length+"/"+LV[lv].k);H.sfx("tick");
});
H.loop(dt=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;
  for(const w of LV[lv].walls)x.fillRect(w[0],w[1],w[2],w[3]);
  const t=LV[lv].tgt;
  x.fillStyle=H.C.wasabi;x.beginPath();x.arc(t[0],t[1],16,0,7);x.fill();
  x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
  x.fillStyle=H.C.ink;x.font="bold 11px 'Space Mono',monospace";x.fillText("ALVO",t[0]-18,t[1]+30);
  if(running){
    let all=true;
    for(const d of doms){
      if(d.fall===1&&d.ft<1){d.ft=Math.min(1,d.ft+dt*3);all=false;
        if(d.ft>=1){
          const rad=d.a*Math.PI/180;
          const tipx=d.x+Math.cos(rad)*34,tipy=d.y+Math.sin(rad)*34;
          for(const n of doms)if(!n.fall&&Math.hypot(n.x-tipx,n.y-tipy)<26)n.fall=1;
          if(Math.hypot(t[0]-tipx,t[1]-tipy)<30)win();
        }
      } else if(!d.fall)all=false;
    }
    if(all&&!over){running=false;H.sfx("bad");say("A cascata <b>parou</b> antes do alvo. Reposicione os dominós.");doms.forEach(d=>{d.fall=0;d.ft=0;});}
  }
  for(const d of doms){
    x.save();x.translate(d.x,d.y);x.rotate(d.a*Math.PI/180+d.ft*1.4);
    x.fillStyle=d.fall?H.C.terra:H.C.card;
    x.fillRect(-5,-30,10,30);
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.strokeRect(-5,-30,10,30);
    x.fillStyle=H.C.ink;x.beginPath();x.arc(0,-10,2,0,7);x.arc(0,-20,2,0,7);x.fill();
    x.restore();
  }
  x.font="20px serif";x.fillText("🏁",22,308);
});
function win(){
  if(over)return;running=false;
  H.sfx("ok");const sc=(lv+1)*150;H.score(sc);hud.set("sc",sc);
  if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Cascata total!",sub:"Todas as fileiras caíram sobre os alvos."});}
  lv++;say("Nível "+(lv+1)+": paredes no caminho da queda.");H.after(700,reset);
}
const row=H.el("div","g-row",null,root);
H.btn(row,"👆 Derrubar o primeiro",()=>{if(!over&&!running){running=true;doms[0].fall=1;H.sfx("pop");}},true);
H.btn(row,"↻ Limpar",()=>{if(!over)reset();},false);
reset();
}});
