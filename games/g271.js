/* NCODE N · 271 Fuga da Prisão — cave até o muro! */
GREG(271,{
init(root,H){
let over=false,prog=0,caught=0,t=0,time=150;
const hud=H.hud(root,[['t','TÚNEL','0%'],['s','DESCONFIANÇA','0%'],['tp','TEMPO',150]]);
const say=H.msg(root,'Cave até 100%! ⛏️ Cavar faz barulho — pare quando o guarda passar (luz vermelha)! Cavar devagar é sempre seguro.');
const o=H.cvs(root,460,340),x=o.x;
H.btn(root,'⛏️ Cavar rápido (+8, barulhento)',()=>{
 if(over)return;
 prog+=8;H.sfx('tick');
 if(danger()){caught+=34;H.sfx('bad');}
 check();
},true);
H.btn(root,'🥄 Cavar devagar (+3, seguro)',()=>{
 if(over)return;
 prog+=3;H.sfx('tick');check();
},false);
function danger(){return(t%9)>6;}
function check(){
 if(caught>=100){gameOver(false);return;}
 if(prog>=100){gameOver(true);return;}
 status();
}
function status(){hud.set('t',Math.min(100,prog|0)+'%');hud.set('s',Math.min(100,caught|0)+'%');hud.set('tp',Math.ceil(time));}
function gameOver(win){over=true;const sc=win?300+Math.ceil(time)*2:prog|0;H.score(sc);
H.done(win?{win:true,score:sc,title:'⛏️ Liberdade!',sub:'Túnel pronto em '+(150-Math.ceil(time))+'s.'}:{win:false,score:sc,title:'Pego no flagra!',sub:'Túnel em '+(prog|0)+'%. Não cave sob a luz vermelha!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 caught=Math.max(0,caught-dt*3);
 if(time<=0){gameOver(prog>=100);return;}
 status();
 x.fillStyle='#3A332A';x.fillRect(0,0,460,340);
 x.fillStyle='#22222A';x.fillRect(30,60,400,200);
 x.fillStyle=danger()?'rgba(217,78,52,.5)':'rgba(62,124,79,.4)';
 x.fillRect(30,60,400,60);
 x.fillStyle='#fff';x.font='bold 17px system-ui';x.textAlign='center';
 x.fillText(danger()?'🚨 GUARDA PASSANDO — PARE!':'✅ Corredor livre — CAVE!',230,98);
 x.fillStyle='#5A4A33';x.fillRect(30,150,400,110);
 x.fillStyle='#2A2118';x.fillRect(30,150,400*Math.min(1,prog/100),110);
 x.font='30px system-ui';x.fillText('🧱',415,245);x.fillText('⛏️',30+400*Math.min(1,prog/100),205);
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('Túnel '+Math.min(100,prog|0)+'% · Desconfiança '+(caught|0)+'% · ⏱️'+Math.ceil(time)+'s',14,300);
 x.fillStyle='#000';x.fillRect(14,308,432,10);
 x.fillStyle='#D94E34';x.fillRect(14,308,432*Math.min(1,caught/100),10);
});
status();
}});
