/* NCODE N · 229 Boggle Shake — 10 palavras conectadas! */
GREG(229,{
init(root,H){
const GRID=["C","A","T","O","A","R","E","I","S","O","L","A","M","E","S","A"];
const DICT=["ATO","SOL","SOLA","MESA","TER","OLEO","REI","LEIA","TIA","OITO","RATO","ERA","ARO","OLA","OLAS","MOLA","MOLAS","SELO","SELOS","TEIA","TEIAS","REAL","ROL","SOM"];
let over=false,found=[],chain=[],time=150,score=0;
const hud=H.hud(root,[["pv","PALAVRAS","0/10"],["tp","TEMPO",150],["pt","PONTOS",0]]);
const say=H.msg(root,"ARRASTE (ou toque em sequência) por letras <b>vizinhas</b> (8 direções, sem repetir)! Solte/toque ✅ para confirmar. 10 palavras!");
const o=H.cvs(root,400,440),x=o.x;
const CS=88,OX=24,OY=60;
const ptr=H.ptr(o);
let wasDown=false,dragging=false;
function cellAt(px,py){
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(r<0||r>3||c<0||c>3)return -1;
  return r*4+c;
}
function adj(a,b){
  const ar=(a/4)|0,ac=a%4,br=(b/4)|0,bc=b%4;
  return Math.abs(ar-br)<=1&&Math.abs(ac-bc)<=1&&a!==b;
}
function addCell(i){
  if(i<0||over)return;
  if(!chain.length){chain.push(i);H.sfx("tick");return;}
  if(chain[chain.length-1]===i)return;
  if(chain.includes(i)){
    if(chain.length>1&&chain[chain.length-2]===i){chain.pop();H.sfx("tick");}
    return;
  }
  if(adj(chain[chain.length-1],i)){chain.push(i);H.beep(350+chain.length*30,.05);}
}
function seal(){
  if(!chain.length)return;
  const w=chain.map(i=>GRID[i]).join("");
  if(w.length>=3&&DICT.includes(w)&&!found.includes(w)){
    found.push(w);score+=w.length*10;H.score(score);
    hud.set("pv",found.length+"/10");hud.set("pt",score);H.sfx("ok");
    if(found.length>=10){over=true;return H.done({win:true,score:score+100,title:"Boggle master!",sub:"10 palavras conectadas."});}
  }else H.sfx("bad");
  chain=[];
}
H.onTap(o,(px,py)=>{if(!dragging)addCell(cellAt(px,py));});
H.btn(root,"✅ Confirmar palavra",()=>{if(!over)seal();},false);
H.btn(root,"🗑️ Limpar",()=>{chain=[];H.sfx("tick");},false);
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;return H.done({win:false,score,title:"Tempo!",sub:found.length+"/10. Tente SOL, MESA, RATO…"});}
  if(ptr.down&&!wasDown){dragging=true;chain=[];addCell(cellAt(ptr.x,ptr.y));}
  if(dragging&&ptr.down)addCell(cellAt(ptr.x,ptr.y));
  if(dragging&&!ptr.down){dragging=false;seal();}
  wasDown=ptr.down;
  x.fillStyle="#2E6E8A";x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#fff";x.font="bold 15px 'Space Mono',monospace";
  x.fillText("🔤 "+chain.map(i=>GRID[i]).join("")+" ("+chain.length+")",20,32);
  x.fillText("📖 "+found.join(" "),20,o.H-12);
  for(let i=0;i<16;i++){
    const r=(i/4)|0,c=i%4;
    const on=chain.includes(i);
    x.fillStyle=on?H.C.wasabi:"#F4F1EB";
    x.fillRect(OX+c*CS+3,OY+r*CS+3,CS-6,CS-6);
    x.strokeStyle=H.C.ink;x.lineWidth=2;
    x.strokeRect(OX+c*CS+3,OY+r*CS+3,CS-6,CS-6);
    x.fillStyle=H.C.ink;x.font="bold 34px 'Space Mono',monospace";
    x.fillText(GRID[i],OX+c*CS+28,OY+r*CS+58);
    if(on){
      x.fillStyle=H.C.terra;x.font="bold 14px 'Space Mono',monospace";
      x.fillText(chain.indexOf(i)+1,OX+c*CS+8,OY+r*CS+24);
    }
  }
});
}});
