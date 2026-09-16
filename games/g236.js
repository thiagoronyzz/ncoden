/* NCODE N · 236 Jogo da Memória — 12 pares! */
GREG(236,{
init(root,H){
const EM=["🐶","🐱","🐭","🐹","🐰","🦊","🐻","🐼","🐨","🐯","🦁","🐸"];
let over=false,deck=[],open=[],matched=0,moves=0,lock=false;
const hud=H.hud(root,[["pr","PARES","0/12"],["jg","JOGADAS",0]]);
const say=H.msg(root,"Vire 2 cartas por vez e decore! Complete os 12 pares — menos jogadas, mais pontos.");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(6,1fr)";
board.style.width="min(100%,440px)";
deck=EM.concat(EM).map((e,i)=>({e,id:i,up:false,ok:false}));
for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
function paint(){
  board.innerHTML="";
  deck.forEach((c,i)=>{
    const d=H.el("button","g-card"+(c.ok?" good":c.up?" hot":""),c.up||c.ok?c.e:"🂠",board);
    d.style.aspectRatio="0.72";d.style.fontSize="22px";
    d.addEventListener("click",()=>{
      if(over||lock||c.up||c.ok)return;
      c.up=true;open.push(i);H.sfx("tick");paint();
      if(open.length>=2){
        moves++;hud.set("jg",moves);lock=true;
        const[a,b]=open;open=[];
        if(deck[a].e===deck[b].e){
          H.after(400,()=>{
            deck[a].ok=deck[b].ok=true;matched++;
            hud.set("pr",matched+"/12");H.sfx("ok");lock=false;paint();
            if(matched>=12){
              over=true;
              const sc=Math.max(100,1200-moves*15);H.score(sc);
              return H.done({win:true,score:sc,title:"Memória de elefante!",sub:"12 pares em "+moves+" jogadas."});
            }
          });
        }else{
          H.after(750,()=>{deck[a].up=deck[b].up=false;lock=false;paint();});
        }
      }
    });
  });
}
paint();
}});
