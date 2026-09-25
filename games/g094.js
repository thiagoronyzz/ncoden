/* NCODE N · 094 Represa — segure a cheia das fazendas */
GREG(94,{
init(root,H){
let over=false,wave=1,levees=[0,0,0,0,0],bags=6,farms=[1,1,1,1,1],water=[];
const hud=H.hud(root,[["on","ONDA","1/5"],["sc","SACOS",6],["fz","FAZENDAS",5]]);
const say=H.msg(root,"Clique nas colunas para empilhar <b>sacos de areia</b>. Depois solte a onda: onde água > dique, a fazenda alaga!");
const o=H.cvs(root,500,360),x=o.x;
function roll(){
  water=[0,1,2,3,4].map(()=>1+Math.floor(Math.random()*(2+wave)));
}
roll();
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor(px/(o.W/5));
  if(c<0||c>4||bags<=0)return;
  levees[c]++;bags--;hud.set("sc",bags);H.sfx("tick");
});
H.loop(()=>{
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  const cw=o.W/5;
  for(let c=0;c<5;c++){
    const bx=c*cw;
    x.fillStyle=farms[c]?H.C.ok:"#8A877C";
    x.fillRect(bx+6,o.H-60,cw-12,50);
    x.fillStyle=H.C.ink;x.font="11px 'Space Mono',monospace";
    x.fillText(farms[c]?"FAZ":"i:skull",bx+cw/2-24,o.H-28);
    x.fillStyle="#c9b98f";
    for(let i=0;i<levees[c];i++)x.fillRect(bx+10,o.H-70-i*16,cw-20,13);
    x.strokeStyle=H.C.ink;x.strokeRect(bx+10,o.H-70-Math.max(0,levees[c])*16+ (levees[c]?16:0),0,0);
    x.fillStyle="#2E6E8A";x.font="bold 13px 'Space Mono',monospace";
    x.fillText("i:wave"+water[c],bx+cw/2-16,30);
    x.fillStyle=H.C.ink;x.fillText("dique "+levees[c],bx+cw/2-24,48);
  }
  x.fillStyle=H.C.ink3;x.font="11px 'Space Mono',monospace";
  x.fillText("clique na coluna = +1 saco",12,o.H-6);
});
H.btn(root,"Soltar a onda!",()=>{
  if(over)return;
  let lost=0;
  for(let c=0;c<5;c++){
    if(water[c]>levees[c]&&farms[c]){farms[c]=0;lost++;}
  }
  const left=farms.filter(Boolean).length;
  hud.set("fz",left);H.sfx(lost?"bad":"ok");
  if(left<4){over=true;return H.done({win:false,score:wave*20,title:"Vale inundado!",sub:"Só "+left+" fazendas restaram na onda "+wave+"."});}
  wave++;
  if(wave>5){over=true;return H.done({win:true,score:left*40+60,title:"Vale protegido!",sub:left+"/5 fazendas salvas das 5 cheias."});}
  bags+=3;hud.set("sc",bags);hud.set("on",wave+"/5");
  roll();
  say(lost?""+lost+" fazenda(s) alagada(s)! +3 sacos para a onda "+wave+".":"✔ Ninguém alagou! +3 sacos para a onda "+wave+".");
},true);
}});
