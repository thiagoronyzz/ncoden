/* NCODE N · 232 Blackjack — banca de $100 a $150! */
GREG(232,{
init(root,H){
let over=false,deck=[],ph=[],dh=[],bank=100,bet=10,state="bet",hide=true;
const hud=H.hud(root,[["bc","BANCA","$100"],["rd","RODADA",1]]);
const say=H.msg(root,"Chegue a <b>$150</b> (aposta $10)! <b>Pedir</b> soma carta · <b>Parar</b> encerra · dealer para no 17. Blackjack paga 3:2!");
const box=H.el("div","g-col",null,root);
let rd=1;
function mk(){
  deck=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)deck.push(Math.min(r,10));
  for(let i=deck.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=deck[i];deck[i]=deck[j];deck[j]=t;}
}
function val(h){
  let t=h.reduce((a,b)=>a+b,0),aces=h.filter(v=>v===1).length;
  while(aces>0&&t+10<=21){t+=10;aces--;}
  return t;
}
function paint(){
  hud.set("bc","$"+bank);hud.set("rd",rd);
  box.innerHTML="";
  const dv=hide?"?":val(dh);
  H.el("div","g-msg","Dealer ("+dv+"): "+dh.map((c,i)=>hide&&i===1?"":c).join(" "),box);
  H.el("div","g-msg","Você ("+val(ph)+"): "+ph.join(" "),box);
  const row=H.el("div","g-row",null,box);
  if(state==="play"){
    H.btn(row,"Pedir",()=>{
      if(over)return;
      ph.push(deck.pop());H.sfx("tick");
      if(val(ph)>21)finish();
      else paint();
    },true);
    H.btn(row,"Parar",()=>{if(!over)finish();},false);
  }else{
    H.btn(row,"Nova rodada ($10)",()=>{
      if(over||bank<10)return;
      bank-=10;rd++;start();
    },true);
  }
}
function start(){
  if(deck.length<12)mk();
  ph=[deck.pop(),deck.pop()];dh=[deck.pop(),deck.pop()];
  hide=true;state="play";paint();
  if(val(ph)===21)finish();
}
function finish(){
  hide=false;state="bet";
  while(val(dh)<17)dh.push(deck.pop());
  const p=val(ph),d=val(dh);
  let msg="";
  if(p>21){msg="Estourou! −$10";}
  else if(d>21){bank+=20;msg="Dealer estourou! +$10";}
  else if(p===21&&ph.length===2&&!(d===21&&dh.length===2)){bank+=25;msg="BLACKJACK! +$15";}
  else if(p>d){bank+=20;msg="Você "+p+" × "+d+"! +$10";}
  else if(p<d){msg="Dealer "+d+" × "+p+". −$10";}
  else{bank+=10;msg="Empate — aposta de volta.";}
  H.score(bank);H.sfx(bank>=100?"ok":"bad");say(msg);
  paint();
  if(bank>=150){over=true;return H.done({win:true,score:bank,title:"Mesa dominada!",sub:"Banca de $"+bank+"!"});}
  if(bank<10){over=true;return H.done({win:false,score:bank,title:"Banca quebrada!",sub:"Sem fichas. Pare no 17+!"});}
}
mk();
bank-=10;start();
}});
