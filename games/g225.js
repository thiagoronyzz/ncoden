/* NCODE N · 225 Metade do Ditado — complete o provérbio! */
GREG(225,{
init(root,H){
const DITADOS=[
 ["Casa de ferreiro, ","espeto de pau",["espada de ouro","espeto de pau","panela de barro"]],
 ["Quem não tem cão, ","caça com gato",["caça com leão","dorme sem som","caça com gato"]],
 ["Águas mansas, ","afundam um barco",["nunca molham ninguém","afundam um barco","erguem um moinho"]],
 ["De grão em grão, ","a galinha enche o papo",["o pão vira pão","a galinha enche o papo","a formiga fica cheia"]],
 ["Quem semeia vento, ","colhe tempestade",["colhe tempestade","colhe chuva fina","planta de novo"]],
 ["Cavalo dado, ","não se olha os dentes",["corre pra sempre","não se olha os dentes","vira pura raça"]],
 ["Antes tarde do que ","nunca",["mais cedo","nunca","de novo"]],
 ["Roma não foi construída ","em um dia",["em um dia","com tijolos ruins","por um homem só"]]
];
let over=false,qi=0,ok=0,err=0,streak=0,sc=0;
const hud=H.hud(root,[["rd","DITADO","1/8"],["er","ERROS","0/3"]]);
const say=H.msg(root,"Leia a <b>primeira metade</b> do ditado e escolha o final certo! 3 erros no máximo.");
const box=H.el("div","g-col",null,root);
const ph=H.el("div","g-msg","",box);
const opts=H.el("div","g-col",null,box);
function shuffle(a){return a.map((v,i)=>[Math.random(),i,v]).sort((p,q)=>p[0]-q[0]).map(p=>p[2]);}
function show(){
  if(qi>=8){finish();return;}
  hud.set("rd",(qi+1)+"/8");
  const d=DITADOS[qi];
  ph.innerHTML="DITADO "+(qi+1)+":<br><b>“"+d[0]+"…”</b><br>Como termina?";
  opts.innerHTML="";
  shuffle(d[2]).forEach(txt=>{
    const b=H.el("button","g-btn ghost",txt,opts);
    b.style.textAlign="left";
    b.addEventListener("click",()=>{
      if(over)return;
      if(txt===d[1]){
        streak++;ok++;sc+=streak>=3?75:50;H.score(sc);hud.set("rd",(qi+1)+"/8");
        H.sfx("ok");
      }else{
        streak=0;err++;hud.set("er",err+"/3");H.sfx("bad");
        if(err>=3){over=true;return H.done({win:false,score:sc,title:"Ditado pela metade!",sub:ok+"/8 finais certos."});}
      }
      qi++;show();
    });
  });
}
function finish(){
  over=true;const win=ok>=5;H.score(sc);
  H.done({win,score:sc,title:win?"Rei dos ditados!":"Quase lá!",sub:ok+"/8 finais certos."});
}
show();
}});
