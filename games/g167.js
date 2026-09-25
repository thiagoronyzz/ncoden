/* NCODE N · 167 Pista de Bolinha — trilhos até a bandeira */
GREG(167,{
init(root,H){
const T=60,COLS=8,ROWS=5;
const LV=[
 {start:[2,0],goal:[3,7],bag:{H:5,D:2,U:1,DROP:1}},
 {start:[1,0],goal:[4,7],bag:{H:6,D:2,U:1,DROP:2}}
];
let lv=0,over=false,grid=[],bag={},selP="H",anim=null;
const hud=H.hud(root,[["nv","NÍVEL","1/2"],["pc","PEÇA","H"]]);
const say=H.msg(root,"Escolha a peça e clique no grid para colocar (clique de novo para tirar). H=reto · D=descida(+vel) · U=subida(−vel) · V=queda. Leve a bolinha à !");
const o=H.cvs(root,COLS*T+20,ROWS*T+20),x=o.x;
const OX=10,OY=10;
function build(){
  grid=new Array(ROWS*COLS).fill(null);
  bag=Object.assign({},LV[lv].bag);
  anim=null;selP="H";hud.set("nv",(lv+1)+"/2");
  paintBag();
}
function paintBag(){
  hud.set("pc",selP+" "+JSON.stringify(bag).replace(/[{"}]/g,"").replace(/,/g," "));
}
build();
const prow=H.el("div","g-row",null,root);
["H","D","U","DROP"].forEach(p=>{
  H.btn(prow,p,()=>{selP=p;H.sfx("tick");paintBag();},false);
});
H.onTap(o,(px,py)=>{
  if(over||anim)return;
  const c=Math.floor((px-OX)/T),r=Math.floor((py-OY)/T);
  if(r<0||r>=ROWS||c<0||c>=COLS)return;
  const L=LV[lv];
  if(r===L.start[0]&&c===L.start[1])return;
  if(r===L.goal[0]&&c===L.goal[1])return;
  const k=r*COLS+c;
  if(grid[k]){bag[grid[k]]++;grid[k]=null;H.sfx("tick");paintBag();return;}
  if((bag[selP]||0)<=0){H.sfx("bad");say("Sem peças "+selP+"! Tire outra do grid.");return;}
  grid[k]=selP;bag[selP]--;H.sfx("tick");paintBag();
});
function sim(){
  const L=LV[lv];
  let r=L.start[0],c=L.start[1],entry="left",sp=3;
  const path=[[r,c]];
  for(let i=0;i<120;i++){
    if(r===L.goal[0]&&c===L.goal[1])return{ok:true,path};
    const p=(r>=0&&r<ROWS&&c>=0&&c<COLS)?grid[r*COLS+c]:null;
    if(r===L.start[0]&&c===L.start[1]){c++;entry="left";path.push([r,c]);continue;}
    if(!p){
      // cai na coluna
      let r2=r+1;
      while(r2<ROWS&&!grid[r2*COLS+c])r2++;
      if(r2>=ROWS)return{ok:false,why:"A bolinha caiu no vazio na coluna "+(c+1)+"!",path};
      r=r2;entry="top";path.push([r,c]);continue;
    }
    if(p==="H"){c++;entry="left";}
    else if(p==="D"){sp+=2;c++;entry="left";}
    else if(p==="U"){if(sp<2)return{ok:false,why:"Sem velocidade para a subida!",path};sp-=2;c++;entry="left";}
    else if(p==="DROP"){r++;entry="top";sp+=2;}
    if(c<0||c>=COLS||r<0||r>=ROWS)return{ok:false,why:"A bolinha saiu da pista!",path};
    path.push([r,c]);
  }
  return{ok:false,why:"Loop infinito!",path};
}
H.btn(root,"○ Soltar bolinha",()=>{
  if(over||anim)return;
  const res=sim();
  anim={path:res.path,i:0,ok:res.ok,why:res.why};
  H.sfx("tick");
},true);
let acc=0;
H.loop(dt=>{
  const L=LV[lv];
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  for(let r=0;r<ROWS;r++)for(let c=0;c<COLS;c++){
    const X=OX+c*T,Y=OY+r*T;
    x.fillStyle=(r+c)%2?H.C.card:"#EFEAE0";
    x.fillRect(X,Y,T,T);
    x.strokeStyle=H.C.cement;x.strokeRect(X,Y,T,T);
    const p=grid[r*COLS+c];
    x.lineWidth=6;x.lineCap="round";
    if(p==="H"){x.strokeStyle="#2E6E8A";x.beginPath();x.moveTo(X+4,Y+T/2);x.lineTo(X+T-4,Y+T/2);x.stroke();}
    if(p==="D"){x.strokeStyle="#3E7C4F";x.beginPath();x.moveTo(X+4,Y+8);x.lineTo(X+T-4,Y+T-8);x.stroke();}
    if(p==="U"){x.strokeStyle="#D94E34";x.beginPath();x.moveTo(X+4,Y+T-8);x.lineTo(X+T-4,Y+8);x.stroke();}
    if(p==="DROP"){x.strokeStyle="#7A6A53";x.beginPath();x.moveTo(X+T/2,Y+4);x.lineTo(X+T/2,Y+T-4);x.stroke();}
  }
  x.font="24px serif";
  x.fillText("i:rocket",OX+L.start[1]*T+14,OY+L.start[0]*T+40);
  x.fillText("i:flag",OX+L.goal[1]*T+14,OY+L.goal[0]*T+40);
  if(anim){
    acc+=dt;
    if(acc>0.22){acc=0;anim.i++;}
    const idx=Math.min(anim.i,anim.path.length-1);
    const[rr,cc]=anim.path[idx];
    x.fillStyle=H.C.terra;
    x.beginPath();x.arc(OX+cc*T+T/2,OY+rr*T+T/2,10,0,7);x.fill();
    if(anim.i>=anim.path.length-1){
      const ok=anim.ok,why=anim.why;
      anim=null;
      if(ok){
        H.sfx("ok");
        lv++;
        if(lv>=LV.length){over=true;return H.done({win:true,score:400,title:"Engenheiro de pistas!",sub:"2 circuitos até a bandeira."});}
        say("Nível 1 OK! Agora um desnível maior…");build();
      }else{H.sfx("bad");say("✕"+why);}
    }
  }
});
}});
