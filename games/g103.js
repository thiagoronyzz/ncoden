/* NCODE N · 103 Mural Elétrico — acenda todas as lâmpadas */
GREG(103,{
init(root,H){
const PANELS=[
 {sw:[[0,1,2],[3,4,5],[6,7,8]],nm:["▬ topo","▬ meio","▬ base"]},
 {sw:[[0,4,8],[2,4,6],[1,4,7]],nm:["╲ diag","╱ diag","＋ coluna"]},
 {sw:[[0,1,3,4],[1,2,4,5],[3,4,6,7],[4,5,7,8]],nm:["◰","◱","◳","◲"]}
];
let p=0,bulbs=[],over=false,moves=0;
const hud=H.hud(root,[["pn","PAINEL","1/3"],["mv","TOQUES",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Cada interruptor alterna um grupo de lâmpadas (veja o símbolo). Acenda as <b>9</b>!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(3,1fr)";
board.style.width="min(100%,260px)";
const row=H.el("div","g-row",null,root);
let sc=0;
function build(){
  const P=PANELS[p];
  bulbs=new Array(9).fill(true);
  const sol=P.sw.map(()=>Math.random()<.5);
  sol.forEach((on,i)=>{if(on)P.sw[i].forEach(b=>bulbs[b]=!bulbs[b]);});
  if(bulbs.every(Boolean))bulbs[4]=false;
  moves=0;hud.set("pn",(p+1)+"/3");hud.set("mv",0);
  paint();
}
function paint(){
  board.innerHTML="";
  bulbs.forEach((b,i)=>{
    const d=H.el("div","g-cell"+(b?" good":""),null,board);
    d.style.aspectRatio="1";d.style.fontSize="24px";
    d.textContent=b?"💡":"⚫";
  });
  row.innerHTML="";
  PANELS[p].sw.forEach((s,i)=>{
    const btn=H.el("button","g-btn ghost",PANELS[p].nm[i],row);
    btn.addEventListener("click",()=>{
      if(over)return;
      s.forEach(b=>bulbs[b]=!bulbs[b]);
      moves++;hud.set("mv",moves);H.sfx("tick");paint();
      if(bulbs.every(Boolean)){
        sc+=120;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        p++;
        if(p>=PANELS.length){over=true;return H.done({win:true,score:sc+80,title:"Mural iluminado!",sub:"3 painéis acesos com lógica."});}
        say("Painel aceso! +120. Próximo: grupos diagonais/blocos.");
        H.after(600,build);
      }
    });
  });
}
build();
}});
