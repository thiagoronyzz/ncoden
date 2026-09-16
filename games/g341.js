/* NCODE N · 341 Mapa do Tesouro — siga as pistas! */
GREG(341,{
init(root,H){
const CLUES=[
 ['🌴 "Onde a palmeira solitária dorme…"',['Palmeira do norte','Palmeira do sul','Coqueiral'],0],
 ['🪨 "A pedra que parece tartaruga…"',['Pedra redonda','Pedra tartaruga','Pedra alta'],1],
 ['💀 "Sob o olhar da caveira…"',['Caverna escura','Arco de pedra','Mirante'],1],
 ['🌊 "Onde a onda beija a areia…"',['Piscina natural','Enseada sul','Recife'],1],
 ['❌ "X marca o ponto final!"',['Sob a palmeira','Atrás da pedra','No centro da enseada'],2]
];
let over=false,step=0,digs=3;
const hud=H.hud(root,[['p','PISTA','1/5'],['pa','PÁS',3]]);
const say=H.msg(root,'Siga as 5 pistas do mapa! Cada pista: escolha o local. Errou = perde 1 pá. Acertou tudo = tesouro!');
const box=H.el('div','g-col',null,root);
const cl=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
function status(){hud.set('p',Math.min(5,step+1)+'/5');hud.set('pa',digs);}
function show(){
 const c=CLUES[step];
 cl.innerHTML='<b>Pista '+(step+1)+'/5:</b> '+c[0];
 brow.innerHTML='';
 c[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===c[2]){step++;H.sfx('ok');
    if(step>=5){gameOver(true);return;}
    say('✅ Certo! Próxima pista…');
   }else{digs--;H.sfx('bad');
    if(digs<=0){gameOver(false);return;}
    say('❌ Lugar errado! Pás: '+digs);
   }
   status();show();
  },false);
 });
 status();
}
function gameOver(win){over=true;brow.innerHTML='';
 const sc=win?300+digs*100:step*50;H.score(sc);
H.done(win?{win:true,score:sc,title:'💰 Tesouro encontrado!',sub:'X marcava o ponto!'}:{win:false,score:sc,title:'Mapa perdido!',sub:'Sem pás. Leia as pistas com calma!'});}
show();
}});
