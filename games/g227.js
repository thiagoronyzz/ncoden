/* NCODE N · 227 Sopa de Letras Flutuante — pesque 5 palavras! */
GREG(227,{
init(root,H){
const WORDS=["SOPA","CALDO","MACARRAO","LEGUME","TEMPERO"];
let over=false,wi=0,chips=[],buf=[],time=150,score=0;
const hud=H.hud(root,[["pv","PALAVRAS","0/5"],["tp","TEMPO",150]]);
const say=H.msg(root,"Toque as letras flutuantes <b>na ordem</b> da palavra! Errou = recomeça a palavra. 5 palavras em 150s.");
const o=H.cvs(root,480,400),x=o.x;
const r=H.rng(Date.now()%10000);
function build(){
  buf=[];
  const w=WORDS[wi];
  chips=[];
  const letters=w.split("").concat(["A","E","O","S","R"].slice(0,3));
  letters.forEach(l=>{
    chips.push({l,x:40+r()*400,y:80+r()*280,vx:(r()-.5)*40,vy:(r()-.5)*40,got:false});
  });
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=chips.find(k=>!k.got&&Math.hypot(px-k.x,py-k.y)<22);
  if(!c)return;
  const want=WORDS[wi][buf.length];
  if(c.l===want){
    c.got=true;buf.push(c.l);H.sfx("tick");H.beep(400+buf.length*50,.06);
    if(buf.length>=WORDS[wi].length){
      wi++;score+=80;H.score(score);hud.set("pv",wi+"/5");H.sfx("ok");
      if(wi>=WORDS.length){over=true;return H.done({win:true,score:score+Math.floor(time),title:"Sopa pronta!",sub:"5 palavras pescadas na ordem."});}
      say("Palavra pescada! Próxima…");build();
    }
  }else{
    chips.forEach(k=>k.got=false);buf=[];H.sfx("bad");say("✕ Fora de ordem! Recomece "+WORDS[wi]+".");
  }
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Sopa esfriou!",sub:wi+"/5 palavras."});}
  chips.forEach(c=>{
    if(c.got)return;
    c.x+=c.vx*dt;c.y+=c.vy*dt;
    if(c.x<24||c.x>o.W-24)c.vx*=-1;
    if(c.y<64||c.y>o.H-24)c.vy*=-1;
    c.x=H.clamp(c.x,24,o.W-24);c.y=H.clamp(c.y,64,o.H-24);
  });
  x.fillStyle="#B06A1F";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#8A4F14";
  for(let i=0;i<20;i++){x.beginPath();x.arc((i*67)%o.W,(i*97)%o.H,3,0,7);x.fill();}
  x.fillStyle="#fff";x.font="bold 16px 'Space Mono',monospace";
  x.fillText("i:target"+WORDS[wi]+"  ·  "+buf.join(""),14,28);
  x.font="bold 18px 'Space Mono',monospace";
  chips.forEach(c=>{
    if(c.got)return;
    x.fillStyle="#F4F1EB";
    x.beginPath();x.arc(c.x,c.y,19,0,7);x.fill();
    x.strokeStyle=H.C.ink;x.lineWidth=2;x.stroke();
    x.fillStyle=H.C.ink;
    x.fillText(c.l,c.x-7,c.y+7);
  });
});
}});
