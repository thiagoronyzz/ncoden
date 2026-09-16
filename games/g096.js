/* NCODE N · 096 Farol — ilumine todas as rotas */
GREG(96,{
init(root,H){
const N=7,R=2;
const SC=[
 {lanes:[[1,0],[1,1],[1,2],[3,2],[3,3],[3,4],[5,4],[5,5],[5,6]],k:3},
 {lanes:[[0,0],[0,1],[1,0],[1,1],[3,2],[3,3],[4,5],[4,6],[6,5],[6,6]],k:3}
];
let sc2=0,over=false,put=[];
const hud=H.hud(root,[["cn","CENÁRIO","1/2"],["fr","FARÓIS","0/3"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique no mar para erguer faróis (raio 2). Toda <b>rota azul</b> precisa de luz!");
const o=H.cvs(root,420,420),x=o.x;
let sc=0;
const s=()=>Math.floor(Math.min(o.W,o.H)/N);
const key=(r,c)=>r+","+c;
H.onTap(o,(px,py)=>{
  if(over)return;
  const ss=s(),c=Math.floor(px/ss),r=Math.floor(py/ss);
  if(r<0||r>=N||c<0||c>=N)return;
  const i=put.findIndex(p=>p[0]===r&&p[1]===c);
  if(i>=0){put.splice(i,1);}
  else{
    if(put.length>=SC[sc2].k){H.sfx("bad");say("Só "+SC[sc2].k+" faróis! Clique num erguido para remover.");return;}
    put.push([r,c]);
  }
  H.sfx("tick");hud.set("fr",put.length+"/"+SC[sc2].k);
});
H.loop(()=>{
  const ss=s(),S=SC[sc2];
  const lset=new Set(S.lanes.map(l=>key(l[0],l[1])));
  x.fillStyle="#1d2b36";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const lit=put.some(p=>Math.abs(p[0]-r)+Math.abs(p[1]-c)<=R);
    x.fillStyle=lset.has(key(r,c))?(lit?"#7fb3d5":"#2E6E8A"):(lit?"#2c3e4d":"#1d2b36");
    x.fillRect(c*ss+1,r*ss+1,ss-2,ss-2);
  }
  x.font=Math.floor(ss*.55)+"px serif";
  put.forEach(p=>x.fillText("🗼",p[1]*ss+6,p[0]*ss+ss-6));
  const unlit=S.lanes.filter(l=>!put.some(p=>Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<=R)).length;
  x.fillStyle="#fff";x.font="12px 'Space Mono',monospace";
  x.fillText("rotas no escuro: "+unlit,12,20);
});
H.btn(root,"💡 Verificar iluminação",()=>{
  if(over)return;
  const S=SC[sc2];
  const unlit=S.lanes.filter(l=>!put.some(p=>Math.abs(p[0]-l[0])+Math.abs(p[1]-l[1])<=R));
  if(!unlit.length){
    sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    sc2++;
    if(sc2>=SC.length){over=true;return H.done({win:true,score:sc+100,title:"Costa iluminada!",sub:"Todas as rotas dos 2 cenários sob luz."});}
    put=[];hud.set("cn","2/2");hud.set("fr","0/3");
    say("Cenário 2: um farol terá de cobrir dois grupos! (raio 2 manhattan)");
  }else{H.sfx("bad");say("Ainda há <b>"+unlit.length+"</b> trechos no escuro!");}
},true);
}});
