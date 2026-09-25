/* NCODE N · 244 Relógio — vença 1 de 3 baralhos! */
GREG(244,{
init(root,H){
const RN=r=>r===1?"A":r===11?"J":r===12?"Q":r===13?"K":r;
let over=false,piles=[],cur=null,att=1,kings=0,revealed=0;
const hud=H.hud(root,[["tt","TENTATIVA","1/3"],["rv","REVELADAS","0/52"],["k","REIS",0]]);
const say=H.msg(root,"Clique em <b>virar</b>! A carta vai para sua hora (A=1…Q=12, K=centro) e vira a próxima. 4º K = perde. Revele as 52!");
const box=H.el("div","g-col",null,root);
const cb=H.el("div","g-msg","",box);
function mk(){
  const d=[];
  for(let s=0;s<4;s++)for(let r=1;r<=13;r++)d.push(r);
  for(let i=d.length-1;i>0;i--){const j=Math.floor(Math.random()*(i+1));const t=d[i];d[i]=d[j];d[j]=t;}
  piles=[];
  for(let p=0;p<13;p++)piles.push(d.slice(p*4,p*4+4));
  cur=piles[12].pop();kings=0;revealed=0;
  paint();
}
function paint(){
  hud.set("tt",att+"/3");hud.set("rv",revealed+"/52");hud.set("k",kings+"/4");
  cb.innerHTML="Carta: <b>"+(cur?RN(cur):"—")+"</b> → "+(cur?(cur===13?"CENTRO ":"hora "+cur):"—");
}
H.btn(root,"↻ Virar carta",()=>{
  if(over||!cur)return;
  revealed++;
  const dest=cur===13?12:cur-1;
  if(dest===12){
    kings++;hud.set("k",kings+"/4");H.sfx("bad");
    if(kings>=4){
      att++;
      if(att>3){over=true;return H.done({win:false,score:revealed,title:"4 reis!",sub:"3 baralhos sem sorte. Tente de novo!"});}
      say("4º rei! Tentativa "+att+"/3…");mk();return;
    }
    cur=piles[12].length?piles[12].pop():null;
  }else{
    H.sfx("tick");
    cur=piles[dest].length?piles[dest].pop():null;
  }
  hud.set("rv",revealed+"/52");
  if(revealed>=52){over=true;H.score(500);
    return H.done({win:true,score:500,title:"Relógio completo!",sub:"52 cartas reveladas na tentativa "+att+"!"});
  }
  if(!cur){ // pilha vazia = travou
    att++;
    if(att>3){over=true;return H.done({win:false,score:revealed,title:"Relógio travou!",sub:"3 tentativas sem completar."});}
    say("Travou! Tentativa "+att+"/3…");mk();return;
  }
  paint();
},true);
mk();
}});
