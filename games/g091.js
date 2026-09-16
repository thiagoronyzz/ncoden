/* NCODE N · 091 Rota Comercial — lucro alto, risco alto */
GREG(91,{
init(root,H){
const CITIES=[["A",80,80],["B",250,60],["C",420,90],["D",120,260],["E",300,280],["F",450,250]];
const ROUTES=[
 {a:0,b:1,p:60,r:10,c:20},{a:1,b:2,p:70,r:15,c:25},{a:0,b:3,p:50,r:10,c:20},
 {a:3,b:4,p:65,r:20,c:25},{a:4,b:5,p:75,r:25,c:30},{a:1,b:4,p:110,r:40,c:40},
 {a:2,b:5,p:60,r:10,c:20},{a:0,b:4,p:130,r:50,c:45}
];
let over=false,se=1,cash=120,picked=new Set();
const hud=H.hud(root,[["tm","TEMPORADA","1/4"],["cx","CAIXA",120],["mt","META","$500"]]);
const say=H.msg(root,"Marque rotas (custo total ≤ <b>$100</b>) e feche a temporada. Rotas longas pagam mais — e afundam mais!");
const o=H.cvs(root,500,340),x=o.x;
const list=H.el("div","g-col",null,root);
function paint(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  ROUTES.forEach((rt,i)=>{
    const a=CITIES[rt.a],b=CITIES[rt.b];
    x.strokeStyle=picked.has(i)?H.C.terra:H.C.cement;
    x.lineWidth=picked.has(i)?4:2;
    x.beginPath();x.moveTo(a[1],a[2]);x.lineTo(b[1],b[2]);x.stroke();
  });
  CITIES.forEach(c=>{
    x.fillStyle=H.C.ink;x.beginPath();x.arc(c[1],c[2],14,0,7);x.fill();
    x.fillStyle=H.C.paper;x.font="bold 12px 'Space Mono',monospace";x.fillText(c[0],c[1]-4,c[2]+4);
  });
  list.innerHTML="";
  let cost=0;picked.forEach(i=>cost+=ROUTES[i].c);
  ROUTES.forEach((rt,i)=>{
    const b=H.el("button","g-chip"+(picked.has(i)?" hot":""),
      CITIES[rt.a][0]+"–"+CITIES[rt.b][0]+" · +$"+rt.p+" · "+rt.r+"% risco · $"+rt.c,list);
    b.style.cursor="pointer";
    b.addEventListener("click",()=>{
      if(over)return;
      if(picked.has(i))picked.delete(i);
      else{
        let c2=0;picked.forEach(k=>c2+=ROUTES[k].c);
        if(c2+rt.c>100){H.sfx("bad");say("Orçamento de $100 estourado!");return;}
        picked.add(i);
      }
      H.sfx("tick");paint();
    });
  });
  H.el("div","g-chip","Custo: <b>$"+cost+"/100</b>",list);
}
function close(){
  if(over||!picked.size){H.sfx("bad");return;}
  let msg="Temporada "+se+": ";
  picked.forEach(i=>{
    const rt=ROUTES[i];
    if(Math.random()*100<rt.r){cash-=30;msg+=CITIES[rt.a][0]+"–"+CITIES[rt.b][0]+" afundou (−$30)! ";}
    else{cash+=rt.p;msg+=CITIES[rt.a][0]+"–"+CITIES[rt.b][0]+" +$"+rt.p+". ";}
  });
  picked=new Set();hud.set("cx",cash);H.sfx("ok");say(msg);
  se++;
  if(se>4){
    over=true;H.score(cash);
    if(cash>=500)return H.done({win:true,score:cash,title:"Magnata do comércio!",sub:"$"+cash+" em 4 temporadas."});
    return H.done({win:false,score:cash,title:"Caravana modesta",sub:"$"+cash+" (meta $500). Arrisque rotas longas!"});
  }
  hud.set("tm",se+"/4");paint();
}
H.btn(root,"⛵ Fechar temporada",close,true);
paint();
}});
