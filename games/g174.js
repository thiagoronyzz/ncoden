/* NCODE N · 174 Vulcão — desvie a lava das vilas! */
GREG(174,{
init(root,H){
const CW=26,CH=18,CS=18;
let over=false,grid=[],walls=12,time=100,spawn=0,burned=0;
const hud=H.hud(root,[["tp","TEMPO",100],["mr","MUROS",12],["vl","VILAS","3/3"]]);
const say=H.msg(root,"Clique para erguer <b>muro</b> (12 no total, clique de novo para tirar). A lava desce do 🌋 — proteja as 3 🏘️ por 100s ou jogue-a no 🌊 mar (direita)!");
const o=H.cvs(root,CW*CS+20,CH*CS+20),x=o.x;
const OX=10,OY=10;
const CR={c:12,r:1};
const VIL=[{c:6,r:15},{c:13,r:16},{c:20,r:15}];
const vilAlive=[true,true,true];
grid=new Array(CW*CH).fill(0); // 0 vazio,1 lava,2 muro
function idx(c,r){return r*CW+c;}
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
  if(c<0||c>=CW||r<0||r>=CH)return;
  if(VIL.some(v=>v.c===c&&v.r===r))return;
  if(c===CR.c&&r===CR.r)return;
  const k=idx(c,r);
  if(grid[k]===2){grid[k]=0;walls++;hud.set("mr",walls);H.sfx("tick");}
  else if(grid[k]===0&&walls>0){grid[k]=2;walls--;hud.set("mr",walls);H.sfx("tick");}
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){
    over=true;
    const alive=vilAlive.filter(Boolean).length;
    if(alive>=2)return H.done({win:true,score:alive*120,title:"Vilas salvas!",sub:alive+"/3 vilas intactas após 100s de erupção."});
    return H.done({win:false,score:alive*120,title:"Rio de lava!",sub:"Só "+alive+"/3 vilas. Cerque com muros!"});
  }
  spawn-=dt;
  if(spawn<=0){spawn=Math.max(.15,.5-time*.003);grid[idx(CR.c,CR.r)]=1;}
  // autômato da lava (de baixo para cima)
  for(let r=CH-1;r>=0;r--)for(let c=0;c<CW;c++){
    if(grid[idx(c,r)]!==1)continue;
    if(c===CW-1){grid[idx(c,r)]=0;continue;} // mar drena
    const opts=[[0,1],[-1,1],[1,1],[-1,0],[1,0]];
    for(const[dc,dr]of opts){
      const nc=c+dc,nr=r+dr;
      if(nc<0||nc>=CW||nr<0||nr>=CH)continue;
      if(grid[idx(nc,nr)]===0){grid[idx(nc,nr)]=1;grid[idx(c,r)]=0;break;}
    }
  }
  VIL.forEach((v,i)=>{
    if(vilAlive[i]&&grid[idx(v.c,v.r)]===1){
      vilAlive[i]=false;burned++;H.sfx("bad");
      hud.set("vl",vilAlive.filter(Boolean).length+"/3");
      say("🔥 Uma vila queimou! ("+vilAlive.filter(Boolean).length+" restantes)");
      if(vilAlive.filter(Boolean).length<2){
        // continua até o fim; derrota decidida no tempo
      }
    }
  });
  x.fillStyle="#3a2f28";x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<CH;r++)for(let c=0;c<CW;c++){
    const v=grid[idx(c,r)];
    if(v===1){
      x.fillStyle=Math.random()<.3?"#F5A623":"#D94E34";
      x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
    }else if(v===2){
      x.fillStyle="#8A6A2F";x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
      x.strokeStyle="#5b3d20";x.strokeRect(OX+c*CS,OY+r*CS,CS,CS);
    }
  }
  x.fillStyle="#2E6E8A";x.fillRect(OX+(CW-1)*CS,OY,CS,CH*CS);
  x.font="16px serif";
  x.fillText("🌋",OX+CR.c*CS-2,OY+CR.r*CS+16);
  VIL.forEach((v,i)=>x.fillText(vilAlive[i]?"🏘️":"☠️",OX+v.c*CS-2,OY+v.r*CS+16));
});
}});
