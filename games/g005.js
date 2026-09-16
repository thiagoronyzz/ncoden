/* NCODE N · 005 Corrente Numérica — ligue 1..N sem cruzar */
GREG(5,{
init(root,H){
let lv=0,over=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["nx","PRÓXIMO",2],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste da casa <b>1</b> passando por <b>2, 3…</b> em ordem. Sem cruzar, sem revisitar.");
const o=H.cvs(root,480,440),x=o.x;
const ptr=H.ptr(o);
let N=5,K=4,nums={},path=[],expected=2,block=new Set(),drag=false;
function build(){
  N=5+Math.min(2,lv);K=4+lv;nums={};path=[];expected=2;block=new Set();
  const r=H.rng(1000+lv*333);
  const cells=[];for(let i=0;i<N*N;i++)cells.push(i);
  const sh=H.shuffle(r,cells);
  for(let k=1;k<=K;k++)nums[sh[k-1]]=k;
  const nb=Math.floor(N*N*0.08);
  for(let i=0;i<nb;i++){const c=sh[K+i];if(nums[c]==null)block.add(c);}
  const start=Object.keys(nums).find(k=>nums[k]===1);
  path=[+start];hud.set("nv",lv+1);hud.set("nx",2);
}
const cell=()=>Math.floor(Math.min(o.W,o.H)/N);
function rc(i){return[(i/N)|0,i%N];}
function adj(a,b){const[ra,ca]=rc(a),[rb,cb]=rc(b);return Math.abs(ra-rb)+Math.abs(ca-cb)===1;}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const s=cell(),ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  const inPath=new Set(path);
  for(let i=0;i<N*N;i++){
    const[r,c]=rc(i),px=ox+c*s,py=oy+r*s;
    x.fillStyle=block.has(i)?H.C.ink:inPath.has(i)?H.C.wasabi:H.C.card;
    x.fillRect(px+2,py+2,s-4,s-4);
    x.strokeStyle=H.C.ink;x.lineWidth=1;x.strokeRect(px+2,py+2,s-4,s-4);
    if(nums[i]){
      x.fillStyle=nums[i]<expected?H.C.ok:H.C.terra;
      x.font="bold "+Math.floor(s*0.42)+"px 'Space Mono',monospace";
      x.textAlign="center";x.textBaseline="middle";
      x.fillText(nums[i],px+s/2,py+s/2+1);
    }
  }
  if(path.length>1){
    x.strokeStyle=H.C.ink;x.lineWidth=4;x.beginPath();
    path.forEach((i,k)=>{const[r,c]=rc(i);const px=ox+c*s+s/2,py=oy+r*s+s/2;k?x.lineTo(px,py):x.moveTo(px,py);});
    x.stroke();
  }
  x.textAlign="left";x.textBaseline="alphabetic";
}
function cellAt(px,py){
  const s=cell(),ox=(o.W-s*N)/2,oy=(o.H-s*N)/2;
  const c=Math.floor((px-ox)/s),r=Math.floor((py-oy)/s);
  if(r<0||r>=N||c<0||c>=N)return -1;return r*N+c;
}
H.onTap(o,(px,py)=>{drag=true;step(cellAt(px,py));});
H.loop(()=>{
  if(over||!drag||!ptr.down&&drag){if(!ptr.down)drag=false;}
  if(drag&&ptr.down)step(cellAt(ptr.x,ptr.y));
  draw();
});
function step(i){
  if(over||i<0||block.has(i))return;
  const head=path[path.length-1];
  if(i===head)return;
  if(path.length>1&&i===path[path.length-2]){ // voltar
    const rm=path.pop();
    if(nums[rm]&&nums[rm]===expected-1){expected--;hud.set("nx",expected);}
    H.sfx("tick");return;
  }
  if(path.includes(i)||!adj(head,i))return;
  if(nums[i]&&nums[i]!==expected){H.sfx("bad");say("Ordem! O próximo é o <b>"+expected+"</b>.");return;}
  path.push(i);
  if(nums[i]===expected){
    expected++;hud.set("nx",expected>K?"✓":expected);H.sfx("ok");
    if(expected>K){
      const sc=(lv+1)*120;H.score(sc);hud.set("sc",sc);
      if(lv>=3){over=true;return H.done({win:true,score:sc+120,title:"Corrente completa!",sub:"Sequências ligadas sem um único cruzamento."});}
      lv++;say("Nível "+(lv+1)+": mais números, grade maior.");build();
    }
  }else H.beep(520,.04,"square",.02);
}
H.btn(root,"↻ Recomeçar nível",()=>{if(!over)build();},false);
build();
}});
