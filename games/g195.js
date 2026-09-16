/* NCODE N · 195 Beat Box — copie 3 batidas! */
GREG(195,{
init(root,H){
const ROWS=[["🥁 kick",90],["👏 snare",280],["🎩 hat",520]];
const TARGETS=[
  [[1,0,0,0,1,0,0,0],[0,0,1,0,0,0,1,0],[1,1,1,1,1,1,1,1]],
  [[1,0,1,0,1,0,0,0],[0,0,0,0,1,0,0,0],[0,1,0,1,0,1,0,1]],
  [[1,1,0,0,1,0,0,1],[0,0,1,0,0,0,1,0],[1,0,1,0,1,0,1,0]]
];
let over=false,rd=0,grid=[],step=0,acc=0,playing=true;
const hud=H.hud(root,[["bt","BATIDA","1/3"],["ps","PASSO",1]]);
const say=H.msg(root,"Clique nas células para montar a batida <b>igual ao alvo</b> (lado direito). O loop toca a SUA versão — confira de ouvido e aperte CONFERIR!");
const box=H.el("div","g-col",null,root);
function newRound(){
  grid=TARGETS[rd].map(()=>new Array(8).fill(0));
  hud.set("bt",(rd+1)+"/3");
  paint();
}
function paint(){
  box.innerHTML="";
  ROWS.forEach((rw,r)=>{
    const row=H.el("div","g-row",null,box);
    H.el("div","g-chip",rw[0],row);
    for(let s=0;s<8;s++){
      const b=H.el("button","g-btn"+(grid[r][s]?"":" ghost"),grid[r][s]?"●":"·",row);
      b.style.minWidth="34px";b.style.padding="4px";
      b.addEventListener("click",()=>{if(!over){grid[r][s]=grid[r][s]?0:1;H.sfx("tick");paint();}});
    }
    H.el("div","g-chip","🎯 "+TARGETS[rd][r].map(v=>v?"●":"·").join(""),row);
  });
}
newRound();
H.btn(root,"▶️/⏸️ loop",()=>{playing=!playing;H.sfx("tick");},false);
H.btn(root,"✅ Conferir batida",()=>{
  if(over)return;
  const ok=grid.every((row,r)=>row.every((v,s)=>v===TARGETS[rd][r][s]));
  if(ok){
    H.sfx("ok");rd++;
    if(rd>=3){over=true;return H.done({win:true,score:300,title:"Beatmaker!",sub:"3 batidas copiadas nota a nota."});}
    say("Batida "+rd+" pronta! Próxima…");newRound();
  }else{H.sfx("bad");say("❌ Diferente do alvo! Compare ● por ●.");}
},true);
H.loop(dt=>{
  if(over||!playing)return;
  acc+=dt;
  if(acc>0.28){
    acc=0;step=(step+1)%8;
    hud.set("ps",step+1);
    grid.forEach((row,r)=>{if(row[step])H.beep(ROWS[r][1],.07);});
  }
});
}});
