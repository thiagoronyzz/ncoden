/* NCODE N · 079 Defesa Digitada — destrua com palavras */
GREG(79,{
init(root,H){
const WORDS=["sol","mar","lua","rede","fogo","vento","planta","estrela","trovão","cavalo","janela","rio","ponte","areia","nuvem","papel","tinta","trem","festa","jardim","lago","monte","vale","canto"];
let over=false,foes=[],buf="",lock=-1,wave=0,sc=0,lives=3,spawn=0,kills=0;
const QUOTA=[6,8,10];
const hud=H.hud(root,[["wv","ONDA","1/3"],["vd","VIDAS",3],["sc","PONTOS",0]]);
const say=H.msg(root,"Digite as <b>letras</b> das palavras (teclado físico ou teclado da tela). Complete para destruir antes que cheguem!");
const o=H.cvs(root,500,360),x=o.x;
function startWave(){
  wave++;kills=0;buf="";lock=-1;foes=[];spawn=0;
  hud.set("wv",wave+"/3");say("🌊 Onda "+wave+": destrua "+QUOTA[wave-1]+" invasores!");
}
startWave();
function feed(ch){
  if(over)return;
  ch=ch.toLowerCase();
  if(lock<0||!foes[lock]){
    const cand=foes.findIndex(f=>f.w[0]===ch);
    if(cand<0){H.beep(180,.07,"sawtooth",.05);return;}
    lock=cand;buf="";
  }
  const f=foes[lock];
  if(!f){lock=-1;return;}
  if(f.w[buf.length]===ch){
    buf+=ch;H.beep(600+buf.length*40,.05,"square",.035);
    if(buf.length>=f.w.length){
      foes.splice(lock,1);lock=-1;buf="";kills++;
      sc+=f.w.length*10;H.score(sc);hud.set("sc",sc);H.sfx("pop");
      if(kills>=QUOTA[wave-1]){
        if(wave>=3){over=true;return H.done({win:true,score:sc+150,title:"Teclado flamejante!",sub:"3 ondas destruídas letra a letra."});}
        startWave();
      }
    }
  }else{H.beep(180,.07,"sawtooth",.05);buf="";lock=-1;}
}
const kb=H.keys();
kb.on((c,d,ev)=>{
  if(!d||over)return;
  const m=/^Key([A-Z])$/.exec(c);
  if(m)feed(m[1]);
  if(c==="Backspace"||c==="Escape"){buf="";lock=-1;}
});
H.onTap(o,(px,py)=>{
  const i=foes.findIndex(f=>py>f.y-20&&py<f.y+24);
  if(i>=0){lock=i;buf="";H.sfx("tick");}
});
const kbBox=H.el("div","g-col",null,root);
["QWERTYUIOP","ASDFGHJKLÇ","ZXCVBNM"].forEach(row=>{
  const r=H.el("div","g-row",null,kbBox);
  r.style.justifyContent="center";
  [...row].forEach(ch=>{
    const b=H.el("button","g-chip",ch,r);
    b.style.cursor="pointer";b.style.minWidth="26px";b.style.textAlign="center";
    b.addEventListener("click",()=>feed(ch));
  });
});
H.loop(dt=>{
  if(over)return;
  spawn-=dt;
  if(spawn<=0&&foes.length<5&&kills+foes.length<QUOTA[wave-1]+2){spawn=1.6;
    const w=WORDS[Math.floor(Math.random()*WORDS.length)];
    foes.push({w,x:60+Math.random()*380,y:-10,sp:26+wave*8});}
  for(let i=foes.length-1;i>=0;i--){
    const f=foes[i];f.y+=f.sp*dt;
    if(f.y>o.H-40){
      foes.splice(i,1);if(lock===i){lock=-1;buf="";}
      lives--;hud.set("vd",lives);H.sfx("bad");
      if(lives<=0){over=true;return H.done({win:false,score:sc,title:"Base invadida!",sub:"3 invasores passaram. Digite mais rápido!"});}
      say("👾 Passou um! Vidas: "+lives);
    }
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.terra;x.fillRect(0,o.H-24,o.W,24);
  x.fillStyle="#fff";x.font="bold 12px 'Space Mono',monospace";x.fillText("⚠ LINHA DA BASE",o.W/2-70,o.H-7);
  foes.forEach((f,i)=>{
    x.font="18px 'Space Mono',monospace";
    const tw=x.measureText(f.w).width;
    x.fillStyle=i===lock?H.C.wasabi:H.C.card;
    x.fillRect(f.x-tw/2-10,f.y-20,tw+20,32);
    x.strokeStyle=H.C.ink;x.lineWidth=i===lock?3:1.5;
    x.strokeRect(f.x-tw/2-10,f.y-20,tw+20,32);
    x.font="bold 18px 'Space Mono',monospace";
    const done=f.w.slice(0,i===lock?buf.length:0),rest=f.w.slice(i===lock?buf.length:0);
    x.fillStyle=H.C.terra;x.fillText(done,f.x-tw/2,f.y+4);
    x.fillStyle=H.C.ink;x.fillText(rest,f.x-tw/2+x.measureText(done).width,f.y+4);
    x.font="20px serif";x.fillText("👾",f.x-10,f.y-24);
  });
});
}});
