/* NCODE N · 084 Marcha do Exército — capture as bandeiras */
GREG(84,{
init(root,H){
const N=7,FLAGS=[[3,1],[3,5]];
let over=false,units=[],sel=null,turn=1;
const hud=H.hud(root,[["tn","TURNO",1],["vo","SUA TROPA",3],["ia","INIMIGOS",3]]);
const say=H.msg(root,"Clique num soldado e depois em <b>vizinho vazio</b> (mover) ou <b>inimigo vizinho</b> (atacar). Capture as 2 ou destrua todos!");
const board=H.el("div","g-board",null,root);
board.style.gridTemplateColumns="repeat(7,1fr)";
board.style.width="min(100%,350px)";
function build(){
  units=[
    {s:1,r:6,c:1,hp:3},{s:1,r:6,c:3,hp:3},{s:1,r:6,c:5,hp:3},
    {s:-1,r:0,c:1,hp:3},{s:-1,r:0,c:3,hp:3},{s:-1,r:0,c:5,hp:3}
  ];
  units.forEach(u=>u.acted=false);
  sel=null;turn=1;paint();
}
function at(r,c){return units.find(u=>u.r===r&&u.c===c);}
function paint(){
  board.innerHTML="";
  const mine=units.filter(u=>u.s===1).length,foe=units.filter(u=>u.s===-1).length;
  hud.set("vo",mine);hud.set("ia",foe);hud.set("tn",turn);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const d=H.el("button","g-cell",null,board);
    d.style.aspectRatio="1";d.style.fontSize="11px";
    const isF=FLAGS.some(f=>f[0]===r&&f[1]===c);
    const u=at(r,c);
    if(u){
      d.textContent=(u.s===1?"":"")+u.hp;
      d.style.background=u.s===1?"#dce8c8":"#f2c9c2";
      if(u===sel)d.classList.add("sel");
      if(u.acted)d.style.opacity=.55;
    }else if(isF){d.textContent="";d.style.fontSize="18px";}
    (function(rr,cc){d.addEventListener("click",()=>tap(rr,cc));})(r,c);
  }
}
function tap(r,c){
  if(over)return;
  const u=at(r,c);
  if(sel&&Math.abs(r-sel.r)+Math.abs(c-sel.c)===1){
    if(!u){sel.r=r;sel.c=c;sel.acted=true;H.sfx("tick");sel=null;paint();checkFlags();return;}
    if(u.s===-1){
      u.hp--;sel.acted=true;H.sfx("bad");
      if(u.hp<=0)units.splice(units.indexOf(u),1);
      sel=null;paint();
      if(!units.some(q=>q.s===-1)){over=true;H.score(300);return H.done({win:true,score:300,title:"Exército derrotado!",sub:"Tropa inimiga aniquilada no turno "+turn+"."});}
      checkFlags();return;
    }
  }
  if(u&&u.s===1&&!u.acted){sel=u;H.sfx("tick");paint();}
  else if(u&&u.s===1&&u.acted)say("Este soldado já agiu neste turno.");
}
function checkFlags(){
  const held=FLAGS.every(f=>{const u=at(f[0],f[1]);return u&&u.s===1;});
  if(held){over=true;H.score(300);H.done({win:true,score:300,title:"Bandeiras capturadas!",sub:"As 2 posições são suas no turno "+turn+"."});}
}
function aiTurn(){
  if(over)return;
  for(const u of units.filter(q=>q.s===-1)){
    const foes=units.filter(q=>q.s===1);
    if(!foes.length)break;
    const adj=foes.find(f=>Math.abs(f.r-u.r)+Math.abs(f.c-u.c)===1);
    if(adj){adj.hp--;H.beep(200,.08);
      if(adj.hp<=0)units.splice(units.indexOf(adj),1);
      continue;
    }
    const tgt=FLAGS.map(f=>({r:f[0],c:f[1],foe:!(at(f[0],f[1])||{}).s||at(f[0],f[1]).s===1}))
      .sort((a,b)=>(Math.abs(a.r-u.r)+Math.abs(a.c-u.c))-(Math.abs(b.r-u.r)+Math.abs(b.c-u.c)))[0];
    const prey=foes.sort((a,b)=>(Math.abs(a.r-u.r)+Math.abs(a.c-u.c))-(Math.abs(b.r-u.r)+Math.abs(b.c-u.c)))[0];
    const goal=(tgt.foe||Math.random()<.4)?tgt:prey;
    const dr=Math.sign(goal.r-u.r),dc=Math.sign(goal.c-u.c);
    const opts=[];
    if(dr&&!at(u.r+dr,u.c)&&u.r+dr>=0&&u.r+dr<N)opts.push([u.r+dr,u.c]);
    if(dc&&!at(u.r,u.c+dc)&&u.c+dc>=0&&u.c+dc<N)opts.push([u.r,u.c+dc]);
    if(opts.length){const m=opts[0];u.r=m[0];u.c=m[1];}
  }
  units.forEach(u=>u.acted=false);
  turn++;sel=null;paint();
  if(!units.some(q=>q.s===1)){over=true;return H.done({win:false,score:0,title:"Tropa perdida!",sub:"Todos os seus soldados caíram."});}
  if(turn>30){over=true;return H.done({win:false,score:50,title:"Reforços inimigos!",sub:"A batalha se arrastou demais."});}
  say("Turno "+turn+": sua vez de marchar.");
}
H.btn(root,"Encerrar turno (IA joga)",()=>{if(!over){H.sfx("pop");aiTurn();}},true);
build();
}});
