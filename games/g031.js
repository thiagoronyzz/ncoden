/* NCODE N · 031 Fechadura — descubra a combinação dos pinos */
GREG(31,{
init(root,H){
let round=0,over=false,att=0,lock=false;
const hud=H.hud(root,[["rd","FECHADURA","1/2"],["tt","TENTATIVAS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nos pinos para ciclar alturas <b>1–4</b>. <b>Testar</b>: ● = pino certo no lugar certo, ○ = altura certa no lugar errado.");
const o=H.cvs(root,440,220),x=o.x;
let code=[],guess=[1,1,1,1];
const hist=H.el("div","g-col",null,root);
function build(){
  const r=H.rng(600+round*43);
  code=H.shuffle(r,[1,2,3,4]);
  guess=[1,1,1,1];att=0;lock=false;
  hist.innerHTML="";hud.set("rd",(round+1)+"/2");hud.set("tt","0/8");draw();
}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ink;x.fillRect(40,30,o.W-80,150);
  x.fillStyle=H.C.gold;x.beginPath();x.arc(o.W/2,150,26,0,7);x.fill();
  for(let i=0;i<4;i++){
    const px=90+i*80;
    for(let h=0;h<4;h++){
      x.fillStyle=h<guess[i]?H.C.wasabi:"#3a3a36";
      x.fillRect(px,160-(h+1)*30,40,26);
      x.strokeStyle=H.C.paper;x.strokeRect(px,160-(h+1)*30,40,26);
    }
    x.fillStyle=H.C.paper;x.font="bold 14px 'Space Mono',monospace";
    x.fillText("P"+(i+1)+"="+guess[i],px-4,200-14);
  }
}
H.onTap(o,(px,py)=>{
  if(over)return;
  for(let i=0;i<4;i++){
    const bx=90+i*80;
    if(px>bx-10&&px<bx+50&&py>20&&py<190){guess[i]=guess[i]%4+1;H.sfx("tick");draw();return;}
  }
});
function test(){
  if(over||lock)return;
  att++;hud.set("tt",att+"/8");
  let exact=0;const cr=code.slice(),gr=guess.slice();
  for(let i=0;i<4;i++)if(gr[i]===cr[i]){exact++;cr[i]=gr[i]=-1;}
  let mis=0;
  for(let i=0;i<4;i++)if(gr[i]>0){const j=cr.indexOf(gr[i]);if(j>=0){mis++;cr[j]=-1;}}
  const row=H.el("div","g-msg","<b>"+guess.join(" ")+"</b> → "+"●".repeat(exact)+"○".repeat(mis)+"<span style='opacity:.5'>"+("·".repeat(4-exact-mis))+"</span>",hist);
  if(exact===4){
    lock=true;
    H.sfx("ok");const sc=(round+1)*150+(8-att)*15;H.score(sc);hud.set("sc",sc);
    round++;
    if(round>=2){over=true;return H.done({win:true,score:sc+100,title:"Cofre aberto!",sub:"2 fechaduras decifradas pela lógica."});}
    say("Primeira fechadura aberta! Nova combinação…");H.after(800,build);
  }else{
    H.sfx("bad");
    if(att>=8){over=true;return H.done({win:false,score:round*120,title:"Fechadura emperrada",sub:"8 tentativas sem abrir. A combinação era "+code.join(" ")+"."});}
    say("Tentativa "+att+": "+exact+" exatos, "+mis+" deslocados.");
  }
  draw();
}
H.btn(root,"Testar combinação",test,true);
build();
}});
