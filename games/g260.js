/* NCODE N · 260 Castelo de Cartas — erga 8 andares sem cair! */
GREG(260,{
init(root,H){
const WINLVL=8,CX=240,BASEY=408,LH=44;
let over=false,seq=0,level=0,cards=0,score=0,perfects=0,stab=100;
let ang=0,vel=0,wind=0,gust=0,gustT=0,phase=0,fall=0,fallT=0,fallDir=1;
let slot=0,best=0,msg='Trave o marcador no VERDE para firmar a carta!';
let placed=[];
const hud=H.hud(root,[['lv','ANDAR','0/8'],['ct','CARTAS',0],['es','ESTABILIDADE',100],['rc','RECORDE',0]]);
const say=H.msg(root,'Cada andar = 2 cartas inclinadas + 1 teto! Trave o marcador no centro verde. Cuidado com o vento! Chegue ao 8º andar.');
const o=H.cvs(root,480,540),x=o.x;
H.btn(root,'🂠 Soltar carta (Espaço)',drop,true);
const kb=H.keys();
kb.on((c,d)=>{if(d&&c==='Space')drop();});
function sched(fn,ms){const t=seq;H.after(ms,()=>{if(t!==seq||over)return;fn();});}
function status(){hud.set('lv',level+'/'+WINLVL);hud.set('ct',cards);hud.set('es',Math.max(0,stab|0));hud.set('rc',best);say(msg);}
function marker(){return Math.max(-1,Math.min(1,Math.sin(phase)+wind*.12));}
function drop(){
  if(over||fall)return;
  const m=marker(),a=Math.abs(m);
  const wgt=1+level*.14;
  if(a<.12){perfects++;score+=25;stab=Math.min(100,stab+1);msg='✨ PERFEITO! +25';H.sfx('ok');}
  else{stab-=(4+16*a)*wgt;score+=10;msg=a<.4?'Boa! (+10)':'Torto! ('+(a<.7?'instável':'PERIGO')+')';H.sfx(a<.4?'tick':'bad');}
  placed.push({lvl:level,slot,off:m});
  cards++;slot++;
  if(stab<=0){stab=0;startFall();status();return;}
  if(slot>=3){
    slot=0;level++;score+=50;
    gust=(Math.random()*2-1)*(0.6+level*0.18);gustT=3;
    msg+=' — 🏰 '+level+'º andar! Rajada '+(gust>0?'▶':'◀')+'!';
    H.sfx('ok');
    if(level>=WINLVL){gameOver(true);return;}
  }
  if(score>best)best=score;
  status();
}
function startFall(){
  if(fall)return;
  fall=1;fallT=0;fallDir=ang>=0?1:-1;
  msg='🌪️ ESTÁ CAINDO!';
  H.sfx('bad');
}
function gameOver(win){
  over=true;seq++;
  if(score>best)best=score;
  H.score(score);
  H.done(win?{win:true,score,title:'🏰 Castelo pronto!',sub:'8 andares · '+cards+' cartas · '+perfects+' perfeitas · recorde '+best+'.'}
    :{win:false,score,title:'Desmoronou!',sub:level+' andares · '+cards+' cartas · recorde '+best+' · mire o verde!'});
}
function rcard(px,py,w,h,rot,roof){
  x.save();x.translate(px,py);x.rotate(rot);
  x.fillStyle='#FAF7F0';x.strokeStyle='#181816';x.lineWidth=2;
  x.beginPath();x.rect(-w/2,-h/2,w,h);x.fill();x.stroke();
  x.fillStyle=roof?'#D94E34':'#2E6E8A';
  x.font='bold '+(roof?10:13)+'px system-ui';x.textAlign='center';x.textBaseline='middle';
  x.fillText(roof?'▲':'♦',0,1);
  x.restore();
}
H.loop(dt=>{
  if(!over&&!fall){
    phase+=dt*(2.2+level*.35);
    if(gustT>0)gustT-=dt;else gust*=.98;
    const base=Math.sin(phase*.23)*(.3+level*.12);
    wind=base+gust;
    const k=3.2*(stab/100)+.4;
    vel+=(-k*ang-.7*vel+wind*.09)*dt;
    vel+=(Math.random()-.5)*dt*(100-stab)/100*4;
    ang+=vel*dt;
    if(Math.abs(ang)>.45||stab<=0)startFall();
  }
  if(fall&&!over){
    fallT+=dt;
    ang+=fallDir*dt*1.6;
    if(fallT>1.3){gameOver(false);return;}
  }
  // cenário
  x.fillStyle='#EFE9DB';x.fillRect(0,0,o.W,o.H);
  x.fillStyle='#E4DCCB';
  x.beginPath();x.arc(90,80,34,0,7);x.arc(130,70,26,0,7);x.arc(390,60,30,0,7);x.arc(425,72,22,0,7);x.fill();
  x.fillStyle='#8A6A2F';x.fillRect(0,BASEY+54,o.W,o.H-BASEY-54);
  x.fillStyle='#6E5323';x.fillRect(0,BASEY+54,o.W,6);
  // vento
  x.textAlign='left';x.textBaseline='alphabetic';
  x.fillStyle=H.C.ink2;x.font='bold 15px system-ui';
  const wa=Math.abs(wind);
  x.fillText('Vento: '+(wa<.25?'calmo ~':(wind>0?'▶':'◀').repeat(Math.min(3,1+(wa|0)))+' '+wa.toFixed(1)),14,28);
  if(gustT>0){x.fillStyle='#B23A24';x.fillText('🌪️ RAJADA!',330,28);}
  // torre
  x.save();x.translate(CX,BASEY+54);x.rotate(fall?0:ang);
  if(fall)x.rotate((fallT*fallDir*1.2));
  x.strokeStyle='#181816';x.lineWidth=2;
  for(const p of placed){
    const y=-p.lvl*LH-22,wdt=118-p.lvl*5;
    const fade=fall?Math.max(0,1-fallT*.7):1;
    x.globalAlpha=fade;
    x.save();x.translate(0,y);
    if(p.slot===0){rcard(-wdt/4,0,20,42,.24+p.off*.18,false);}
    else if(p.slot===1){rcard(wdt/4,0,20,42,-.24+p.off*.18,false);}
    else{rcard(0,-LH/2+2,wdt/2+26,14,p.off*.1,true);}
    x.restore();
  }
  x.globalAlpha=1;
  // fantasma da próxima carta
  if(!over&&!fall){
    const wdt=118-level*5;
    x.globalAlpha=.35;x.setLineDash([4,4]);
    x.strokeRect(slot===2?-(wdt/4+13):(slot===0?-wdt/4-10:wdt/4-10),slot===2?-level*LH-LH+10:-level*LH-44,slot===2?wdt/2+26:20,slot===2?14:42);
    x.setLineDash([]);x.globalAlpha=1;
  }
  x.restore();
  // marcador
  const my=452;
  x.fillStyle='#181816';x.fillRect(20,my,440,54);
  x.fillStyle='#3E7C4F';x.fillRect(20+220-26,my+8,52,38);
  x.fillStyle='#E8A33D';x.fillRect(20+220-70,my+8,44,38);x.fillRect(20+220+26,my+8,44,38);
  const m=marker();
  x.fillStyle='#FAF7F0';
  x.beginPath();x.moveTo(240+m*210,my+2);x.lineTo(240+m*210-8,my+16);x.lineTo(240+m*210+8,my+16);x.fill();
  x.fillRect(240+m*210-2,my+16,4,34);
  x.font='bold 12px system-ui';x.textAlign='center';
  x.fillStyle='#FAF7F0';x.fillText(slot===2?'TETO':(slot===0?'CARTA ESQUERDA':'CARTA DIREITA'),240,my+66);
  // estabilidade
  x.textAlign='left';
  x.fillStyle=H.C.ink;x.font='bold 13px system-ui';
  x.fillText('Estabilidade',20,530);
  x.fillStyle='#D8D5CC';x.fillRect(120,520,220,12);
  x.fillStyle=stab>55?'#3E7C4F':stab>25?'#E8A33D':'#B23A24';
  x.fillRect(120,520,220*Math.max(0,stab)/100,12);
  x.fillStyle=H.C.ink;
  x.fillText('Andar '+level+'/'+WINLVL+' · '+score+' pts',348,530);
});
status();
}});
