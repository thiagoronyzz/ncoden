/* NCODE N · 381 Cronômetro Perfeito — pare nos 5,00s! */
GREG(381,{
init(root,H){
let over=false,t=0,run=false,round=0,errs=[];
const hud=H.hud(root,[['r','TENTATIVA','1/5'],['e','ERRO','—']]);
const say=H.msg(root,'Toque INICIAR e PARE o mais perto de 5,00s! 5 tentativas. Erro médio < 0,30s vence!');
const o=H.cvs(root,460,220),x=o.x;
const brow=H.el('div','g-row',null,root);
H.btn(brow,'▶️ INICIAR',()=>{
 if(over||run)return;
 t=0;run=true;H.sfx('tick');
},false);
H.btn(brow,'⏹️ PARAR!',()=>{
 if(over||!run)return;
 run=false;
 const e=Math.abs(t-5);
 errs.push(e);round++;
 H.sfx(e<.15?'ok':'bad');
 hud.set('r',Math.min(5,round+1)+'/5');hud.set('e',e.toFixed(2)+'s');
 say(e<.05?'🎯 PERFEITO! '+t.toFixed(2)+'s':e<.15?'Ótimo! '+t.toFixed(2)+'s':'Foi '+t.toFixed(2)+'s (erro '+e.toFixed(2)+'s)');
 if(round>=5)gameOver();
},true);
function gameOver(){over=true;
 const avg=errs.reduce((a,b)=>a+b,0)/5;
 const sc=Math.max(0,500-avg*800|0);H.score(sc);
H.done({win:avg<.3,score:sc,title:avg<.3?'⏱️ Precisão cirúrgica!':'⏱️ Fim!',sub:'Erro médio: '+avg.toFixed(2)+'s.'});}
H.loop(dt=>{
 if(run)t+=dt;
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,220);
 x.fillStyle=run?'#C4D645':'#4A4A44';x.font='bold 72px system-ui';x.textAlign='center';
 x.fillText(run?t.toFixed(2):(errs.length?t.toFixed(2):'0.00'),230,120);
 x.fillStyle='#E8A33D';x.font='bold 18px system-ui';
 x.fillText('META: 5.00s',230,160);
 x.fillStyle='#fff';x.font='14px system-ui';x.textAlign='left';
 x.fillText('Tentativas: '+errs.map(e=>e.toFixed(2)).join('  '),14,200);
});
}});
