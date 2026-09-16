/* NCODE N · 162 Ponte de Gravetos — atravesse o carrinho */
GREG(162,{
init(root,H){
const LV=[{cols:6,wt:1.5,budget:100},{cols:8,wt:2.5,budget:140}];
let lv=0,over=false,nodes=[],sticks=[],sel=-1,testing=false,cart=null,budget=0;
const hud=H.hud(root,[["nv","NÍVEL","1/2"],["or","ORÇAMENTO",100],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique em 2 nós para ligar um <b>graveto</b> (custa pelo tamanho). Triângulos aguentam mais! Depois <b>teste</b> com o carrinho.");
const o=H.cvs(root,520,360),x=o.x;
let sc=0;
function build(){
  const C=LV[lv].cols;
  budget=LV[lv].budget;sticks=[];sel=-1;testing=false;cart=null;
  nodes=[];
  const x0=70,x1=o.W-70;
  for(let c=0;c<C;c++)for(let r=0;r<2;r++){
    nodes.push({x:x0+(x1-x0)*c/(C-1),y:r===0?150:230});
  }
  hud.set("nv",(lv+1)+"/2");hud.set("or",budget);
  say("Nível "+(lv+1)+": vão de "+C+" nós, carga "+LV[lv].wt+". Ligue nós vizinhos!");
}
build();
function nid(c,r){return c*2+r;}
H.onTap(o,(px,py)=>{
  if(over||testing)return;
  let bi=-1,bd=24;
  nodes.forEach((n,i)=>{const d=Math.hypot(px-n.x,py-n.y);if(d<bd){bd=d;bi=i;}});
  if(bi<0)return;
  if(sel<0){sel=bi;H.sfx("tick");return;}
  if(sel===bi){sel=-1;return;}
  const a=nodes[sel],b=nodes[bi];
  const len=Math.hypot(a.x-b.x,a.y-b.y);
  if(len>150){H.sfx("bad");say("Graveto longo demais! Use nós vizinhos.");sel=-1;return;}
  if(sticks.some(s=>(s.a===sel&&s.b===bi)||(s.a===bi&&s.b===sel))){sel=-1;return;}
  const cost=Math.round(len/8);
  if(cost>budget){H.sfx("bad");say("Sem orçamento! (custa "+cost+")");sel=-1;return;}
  budget-=cost;sticks.push({a:sel,b:bi,broke:false});
  H.sfx("tick");hud.set("or",budget);sel=-1;
});
function edgeSupport(c){
  // vão entre coluna c e c+1 (nós de topo): soma suportes
  const T0=nid(c,0),T1=nid(c+1,0),B0=nid(c,1),B1=nid(c+1,1);
  let s=0;
  const has=(a,b)=>sticks.some(k=>!k.broke&&((k.a===a&&k.b===b)||(k.a===b&&k.b===a)));
  if(has(T0,T1))s+=1.0;
  if(has(T0,B0)&&has(B0,T1))s+=1.4;
  if(has(T0,B1)&&has(B1,T1))s+=1.4;
  if(has(B0,B1)&&(has(T0,B0)||has(T1,B1)))s+=0.6;
  if(has(T0,B1)&&has(T0,B0)&&has(B0,B1))s+=0.5;
  return s;
}
H.btn(root,"🚗 Testar com o carrinho",()=>{
  if(over||testing)return;
  testing=true;
  cart={c:0,x:nodes[nid(0,0)].x,y:150,fall:0};
  H.sfx("tick");say("🚗 Lá vai…");
},true);
H.loop(dt=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle=H.C.ok;x.fillRect(0,250,70,110);x.fillRect(o.W-70,250,70,110);
  x.fillStyle="#2E6E8A";x.fillRect(70,250,o.W-140,110);
  x.fillStyle=H.C.ink;x.font="12px 'Space Mono',monospace";
  x.fillText("carga "+LV[lv].wt+" · vão: triângulos valem 1.4",80,340);
  sticks.forEach(s=>{
    const a=nodes[s.a],b=nodes[s.b];
    x.strokeStyle=s.broke?"rgba(217,78,52,.4)":"#8A6A2F";
    x.lineWidth=s.broke?2:5;
    x.beginPath();x.moveTo(a.x,a.y);x.lineTo(b.x,b.y);x.stroke();
  });
  nodes.forEach((n,i)=>{
    x.fillStyle=i===sel?H.C.terra:H.C.ink;
    x.beginPath();x.arc(n.x,n.y,i===sel?8:5,0,7);x.fill();
  });
  if(cart&&!over){
    const C=LV[lv].cols;
    if(cart.fall>0){
      cart.fall+=dt;cart.y+=220*dt*cart.fall;
      if(cart.y>330){
        cart=null;testing=false;
        say("💥 A ponte quebrou! Reforce o vão (triângulos!) e teste de novo. Orçamento intacto.");
      }
    }else{
      cart.x+=70*dt;
      const cols=x=>nodes.map(n=>n.x);
      const xs=nodes.filter((_,i)=>i%2===0).map(n=>n.x);
      let ci=0;
      while(ci<xs.length-2&&cart.x>xs[ci+1])ci++;
      cart.c=ci;
      cart.y=150-14;
      if(ci>=C-2&&cart.x>=xs[C-1]){
        cart=null;testing=false;
        sc+=150;H.score(sc);hud.set("sc",sc);H.sfx("ok");
        lv++;
        if(lv>=LV.length){over=true;return H.done({win:true,score:sc+100,title:"Engenheiro de pontes!",sub:"2 travessias sem cair no rio."});}
        say("Travessia OK! +150. Nível 2: vão maior, carga maior.");build();
        return;
      }
      // testa o vão atual
      if(cart.x>xs[ci]+4){
        const sup=edgeSupport(ci);
        if(sup<LV[lv].wt){
          sticks.forEach(s=>{
            const cols2=[nid(ci,0),nid(ci+1,0),nid(ci,1),nid(ci+1,1)];
            if(cols2.includes(s.a)&&cols2.includes(s.b))s.broke=true;
          });
          cart.fall=0.01;H.sfx("bad");
          say("⚠️ Vão "+(ci+1)+": suporte "+sup.toFixed(1)+" < carga "+LV[lv].wt+"!");
        }
      }
    }
  }
  if(cart){
    x.font="26px serif";
    x.fillText("🛒",cart.x-13,cart.y+8);
  }
});
}});
