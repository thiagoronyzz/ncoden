/* NCODE N · 328 Mina Desabada — escape cavando! */
GREG(328,{
init(root,H){
let over=false,o2=100,tools=100,prog=0,t=0;
const hud=H.hud(root,[['ox','OXIGÊNIO','100%'],['f','FERRAMENTAS','100%'],['s','SAÍDA','0%']]);
const say=H.msg(root,'Cave até a saída (100%)! Cavar gasta ferramenta e oxigênio. Descanse para poupar O₂. Ferramenta zera = mãos (lento)!');
const o=H.cvs(root,460,340),x=o.x;
H.btn(root,'⛏️ Cavar!',()=>{
 if(over)return;
 const eff=tools>0?8:2;
 prog+=eff;tools=Math.max(0,tools-7);o2-=3;
 H.sfx('tick');status();
 if(prog>=100){gameOver(true);return;}
},true);
H.btn(root,'😮‍💨 Poupar ar (+5 O₂)',()=>{
 if(over)return;
 o2=Math.min(100,o2+5);H.sfx('tick');status();
},false);
function status(){hud.set('ox',Math.max(0,o2|0)+'%');hud.set('f',(tools|0)+'%');hud.set('s',Math.min(100,prog|0)+'%');}
function gameOver(win){over=true;const sc=win?Math.max(150,400-(t|0)*3):prog|0;H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'⛏️ Fora da mina!',sub:'Escapou com '+(o2|0)+'% de O₂.'}:{win:false,score:sc|0,title:'Sem ar!',sub:'Cave em ritmo e poupe oxigênio!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 o2-=dt*1.6;
 status();
 if(o2<=0){gameOver(false);return;}
 x.fillStyle='#2A2118';x.fillRect(0,0,460,340);
 x.fillStyle='#4A3A28';x.fillRect(0,100,460,240);
 x.fillStyle='#1A1410';x.fillRect(30,140,400*Math.min(1,prog/100),120);
 x.font='30px system-ui';x.textAlign='center';x.fillText('🚪',430,240);
 x.fillText('⛏️',30+400*Math.min(1,prog/100),220);
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('O₂ '+(o2|0)+'% · 🔧 '+(tools|0)+'% · Saída '+(prog|0)+'%',14,30);
 x.fillStyle='#000';x.fillRect(14,40,300,12);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(14,40,300*Math.max(0,o2)/100,12);
});
status();
}});
