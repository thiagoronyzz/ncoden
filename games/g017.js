/* NCODE N · 017 Elevador Lógico — programe paradas, entregue todos */
GREG(17,{
init(root,H){
const LV=[{floors:6,pax:6,runs:3},{floors:6,pax:9,runs:3},{floors:7,pax:12,runs:4}];
let lv=0,over=false,busy=false;
const hud=H.hud(root,[["nv","NÍVEL",1],["run","VIAGENS","0/3"],["dlv","ENTREGUES","0/6"]]);
const say=H.msg(root,"Clique em andares para enfileirar <b>paradas</b> (máx. 4). <b>Executar</b> roda o elevador. Capacidade: 4.");
const o=H.cvs(root,520,400),x=o.x;
let F=6,wait=[],stops=[],el=0,aboard=[],runs=0,deliv=0,total=6,moving=null;
function build(){
  const L=LV[lv];F=L.floors;total=L.pax;deliv=0;runs=0;el=0;aboard=[];stops=[];wait=[];
  const r=H.rng(500+lv*77);
  for(let i=0;i<total;i++){
    const f=Math.floor(r()*F);let t=Math.floor(r()*F);
    if(t===f)t=(t+1)%F;
    wait.push({f,t});
  }
  hud.set("nv",lv+1);hud.set("run","0/"+L.runs);hud.set("dlv","0/"+total);
  draw();
}
function floorY(f){return 30+(F-1-f)*((o.H-60)/F);}
function draw(){
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const fw=(o.H-60)/F;
  for(let f=0;f<F;f++){
    const y=floorY(f);
    x.fillStyle=stops.includes(f)?H.C.wasabi:H.C.card;
    x.fillRect(120,y,360,fw-4);
    x.strokeStyle=H.C.ink;x.strokeRect(120,y,360,fw-4);
    x.fillStyle=H.C.ink;x.font="bold 13px 'Space Mono',monospace";
    x.fillText((f+1)+"º",60,y+fw/2+5);
    const w=wait.filter(p=>p.f===f);
    x.font="12px 'Space Mono',monospace";
    w.slice(0,6).forEach((p,i)=>{x.fillStyle=H.C.terra;x.fillText("🧍→"+(p.t+1),140+i*52,y+fw/2+5);});
    if(stops.includes(f)){x.fillStyle=H.C.ink;x.fillText("◉ parada "+(stops.indexOf(f)+1),400,y+fw/2+5);}
  }
  const ey=floorY(Math.round(el));
  x.fillStyle=H.C.ink;x.fillRect(20,ey,70,fw-4);
  x.fillStyle=H.C.gold;x.font="12px 'Space Mono',monospace";
  x.fillText("🛗"+aboard.length+"/4",26,ey+fw/2+4);
}
H.onTap(o,(px,py)=>{
  if(over||busy)return;
  const fw=(o.H-60)/F;
  const f=F-1-Math.floor((py-30)/fw);
  if(f<0||f>=F)return;
  if(stops.includes(f))stops=stops.filter(s=>s!==f);
  else{if(stops.length>=4){H.sfx("bad");say("Máximo de <b>4 paradas</b> por viagem!");return;}stops.push(f);}
  H.sfx("tick");draw();
});
function exec(){
  if(over||busy||!stops.length)return;
  busy=true;runs++;hud.set("run",runs+"/"+LV[lv].runs);H.sfx("pop");
  const queue=stops.slice();stops=[];
  function nextStop(){
    if(!queue.length){busy=false;draw();
      if(deliv>=total){
        over=true;const sc=(lv+1)*150+(LV[lv].runs-runs)*60;H.score(sc);
        if(lv>=LV.length-1)return H.done({win:true,score:sc+100,title:"Síndico eficiente!",sub:"Todos entregues no mínimo de viagens."});
        lv++;say("Nível "+(lv+1)+": mais moradores, mais pressa.");H.after(700,build);return;
      }
      if(runs>=LV[lv].runs){over=true;return H.done({win:false,score:deliv*20,title:"Viagens esgotadas",sub:"Faltaram "+(total-deliv)+" entregas. Agrupe destinos vizinhos."});}
      say("Viagem "+runs+" concluída. Programe as próximas paradas.");
      return;
    }
    const target=queue.shift();
    moving=H.every(120,()=>{
      if(el<target)el++;else if(el>target)el--;else{
        clearInterval(moving);
        const out=aboard.filter(p=>p.t===target).length;
        aboard=aboard.filter(p=>p.t!==target);deliv+=out;
        while(aboard.length<4){
          const i=wait.findIndex(p=>p.f===target);
          if(i<0)break;aboard.push(wait.splice(i,1)[0]);
        }
        hud.set("dlv",deliv+"/"+total);H.sfx("ok");draw();
        H.after(350,nextStop);return;
      }
      draw();
    });
  }
  nextStop();
}
H.btn(root,"▶ Executar viagem",exec,true);
build();
}});
