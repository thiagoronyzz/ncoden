/* NCODE N · 038 Trilha de Formigas — desenhe o caminho do banquete */
GREG(38,{
init(root,H){
const LV=[
 {n:8,col:[0,0],food:[7,7],obs:[[3,1],[3,2],[3,3],[3,4],[3,5],[3,6]],ink:26},
 {n:8,col:[0,7],food:[7,0],obs:[[2,2],[2,3],[2,4],[2,5],[5,2],[5,3],[5,4],[5,5]],ink:30},
 {n:9,col:[4,0],food:[4,8],obs:[[1,3],[2,3],[3,3],[5,3],[6,3],[7,3],[1,5],[2,5],[5,5],[6,5],[7,5]],ink:34}
];
let lv=0,over=false,released=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["fk","FEROMÔNIO",0],["sc","PONTOS",0]]);
const say=H.msg(root,"Arraste para pintar a <b>trilha</b> da colônia até a <b>comida</b>. Depois <b>solte as formigas</b>.");
const o=H.cvs(root,440,440),x=o.x;
const ptr=H.ptr(o);
let N=8,trail=new Set(),obs=new Set(),ants=[],ap=0;
function key(r,c){return r+","+c;}
function build(){
  const L=LV[lv];N=L.n;trail=new Set();ants=[];released=false;ap=0;
  obs=new Set(L.obs.map(p=>key(p[0],p[1])));
  hud.set("nv",lv+1);hud.set("fk","0/"+L.ink);
}
function cell(){
  const s=Math.floor(Math.min(o.W,o.H)/N);
  return{s,ox:(o.W-s*N)/2,oy:(o.H-s*N)/2};
}
H.loop(()=>{
  const L=LV[lv],{s,ox,oy}=cell();
  if(ptr.down&&!over&&!released){
    const c=Math.floor((ptr.x-ox)/s),r=Math.floor((ptr.y-oy)/s);
    if(r>=0&&r<N&&c>=0&&c<N){
      const k=key(r,c);
      if(!obs.has(k)&&!trail.has(k)&&trail.size<L.ink){trail.add(k);hud.set("fk",trail.size+"/"+L.ink);if(trail.size%4===0)H.beep(600,.03,"square",.02);}
    }
  }
  if(released&&ants.length){
    ap+=0.12;
    if(ap>=ants.path.length-1){ap=0;}
  }
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<N;r++)for(let c=0;c<N;c++){
    const k=key(r,c),X=ox+c*s,Y=oy+r*s;
    x.fillStyle=obs.has(k)?H.C.ink:trail.has(k)?H.C.wasabi:H.C.card;
    x.fillRect(X+1,Y+1,s-2,s-2);
    x.strokeStyle=H.C.cement;x.strokeRect(X+1,Y+1,s-2,s-2);
  }
  x.font=Math.floor(s*0.6)+"px serif";
  x.fillText("i:house",ox+L.col[1]*s+4,oy+L.col[0]*s+s-6);
  x.fillText("i:fruit",ox+L.food[1]*s+4,oy+L.food[0]*s+s-6);
  if(released&&ants.path){
    for(let i=0;i<3;i++){
      const idx=Math.floor(ap-i*2);
      if(idx<0)continue;
      const[r,c]=ants.path[idx];
      x.font="16px serif";x.fillText("i:ant",ox+c*s+s/2-8,oy+r*s+s/2+6);
    }
  }
});
function bfs(){
  const L=LV[lv];
  const ok=k=>k===key(L.col[0],L.col[1])||k===key(L.food[0],L.food[1])||trail.has(k);
  const start=key(L.col[0],L.col[1]),goal=key(L.food[0],L.food[1]);
  const prev={[start]:null},q=[start],seen=new Set([start]);
  while(q.length){
    const k=q.shift();
    if(k===goal){const p=[k];let c=k;while(prev[c]){c=prev[c];p.unshift(c);}return p.map(q2=>q2.split(",").map(Number));}
    const[r,c]=k.split(",").map(Number);
    [[1,0],[-1,0],[0,1],[0,-1]].forEach(v=>{
      const nr=r+v[0],nc=c+v[1],nk=key(nr,nc);
      if(nr<0||nr>=N||nc<0||nc>=N||seen.has(nk)||obs.has(nk)||!ok(nk))return;
      seen.add(nk);prev[nk]=k;q.push(nk);
    });
  }
  return null;
}
const row=H.el("div","g-row",null,root);
H.btn(row,"Soltar formigas",()=>{
  if(over||released)return;
  const p=bfs();
  if(!p){H.sfx("bad");say("Trilha <b>desconectada</b>! Ligue a colônia à comida sem pular casas.");return;}
  released=true;ants={path:p};H.sfx("pop");
  say("Formigas a caminho… ");
  H.after(2500,()=>{
    if(over)return;
    const sc=(lv+1)*140;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    if(lv>=LV.length-1){over=true;return H.done({win:true,score:sc+100,title:"Banquete entregue!",sub:"3 colônias alimentadas por trilhas perfeitas."});}
    lv++;say("Nível "+(lv+1)+": obstáculos novos na floresta.");build();
  });
},true);
H.btn(row,"Apagar trilha",()=>{if(!over&&!released){trail=new Set();hud.set("fk","0/"+LV[lv].ink);}},false);
build();
}});
