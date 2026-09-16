/* NCODE N · 021 Medida de Água — despeje até a medida exata */
GREG(21,{
init(root,H){
const LV=[{caps:[8,5,3],goal:4},{caps:[9,4,3],goal:6},{caps:[12,7,5],goal:6}];
let lv=0,over=false,moves=0;
const hud=H.hud(root,[["nv","NÍVEL",1],["mv","DESPEJOS",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique num pote (<b>origem</b>) e depois noutro (<b>destino</b>) para despejar. Obtenha a medida exata em qualquer pote.");
const o=H.cvs(root,480,340),x=o.x;
let caps=[],water=[],sel=-1;
function build(){
  caps=LV[lv].caps.slice();water=[caps[0],0,0];sel=-1;moves=0;
  hud.set("nv",lv+1);hud.set("mv",0);draw();
  say("Nível "+(lv+1)+": potes de <b>"+caps.join(", ")+"</b> L. Meta: <b>"+LV[lv].goal+" L</b> exatos.");
}
function geom(i){
  const w=110,gap=30,tot=caps.length*w+(caps.length-1)*gap;
  const x0=(o.W-tot)/2+i*(w+gap);
  return{x:x0,y:60,w,h:220};
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.font="bold 14px 'Space Mono',monospace";
  x.fillText("META: "+LV[lv].goal+" L",20,30);
  caps.forEach((c,i)=>{
    const g=geom(i);
    x.fillStyle=i===sel?H.C.wasabi:H.C.card;
    x.fillRect(g.x,g.y,g.w,g.h);
    x.strokeStyle=H.C.ink;x.lineWidth=i===sel?4:2;x.strokeRect(g.x,g.y,g.w,g.h);
    const fh=g.h*(water[i]/c);
    x.fillStyle="#2E6E8A";x.fillRect(g.x+3,g.y+g.h-fh,g.w-6,Math.max(0,fh));
    x.fillStyle=H.C.ink;x.font="bold 15px 'Space Mono',monospace";
    x.fillText(water[i]+" / "+c+" L",g.x+12,g.y+g.h+24);
    x.font="12px 'Space Mono',monospace";
    x.fillText(i===0?"(cheio)":"",g.x+12,g.y-10);
  });
}
H.onTap(o,(px,py)=>{
  if(over)return;
  let hit=-1;
  caps.forEach((c,i)=>{const g=geom(i);if(px>g.x-8&&px<g.x+g.w+8&&py>g.y-30&&py<g.y+g.h+30)hit=i;});
  if(hit<0)return;
  if(sel<0){if(water[hit]<=0){H.sfx("bad");return;}sel=hit;H.sfx("tick");draw();return;}
  if(sel===hit){sel=-1;draw();return;}
  const amt=Math.min(water[sel],caps[hit]-water[hit]);
  if(amt<=0){H.sfx("bad");sel=-1;draw();return;}
  water[sel]-=amt;water[hit]+=amt;sel=-1;
  moves++;hud.set("mv",moves);H.beep(400+moves*20,.07,"sine",.04);draw();
  if(water.includes(LV[lv].goal)){
    H.sfx("ok");const sc=(lv+1)*120+Math.max(0,80-moves*4);H.score(sc);hud.set("sc",sc);
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Medida perfeita!",sub:"3 quantidades exatas sem copo medidor."});}
    lv++;H.after(600,build);
  }
});
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});
