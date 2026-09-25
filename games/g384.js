/* NCODE N · 384 Pulo do Elevador — pule na plataforma! */
GREG(384,{
init(root,H){
let over=false,ey=300,dir=1,jumping=false,jx=0,jy=0,jt=0,round=0,score=0;
const hud=H.hud(root,[['t','TENTATIVA','1/5'],['pt','PONTOS',0]]);
const say=H.msg(root,'O elevador sobe e desce! PULE quando alinhar com a plataforma. 5 tentativas!');
const o=H.cvs(root,460,480),x=o.x;
H.btn(root,'PULAR!',()=>{
 if(over||jumping)return;
 jumping=true;jt=0;jx=140;jy=ey;H.sfx('tick');
},true);
function gameOver(){over=true;H.score(score);
H.done({win:score>=300,score,title:score>=300?'Saltador preciso!':'Fim!',sub:score+'/500 pontos.'});}
H.loop(dt=>{
 if(over)return;
 if(!jumping)ey+=dir*140*dt;
 if(ey<80){ey=80;dir=1;}if(ey>420){ey=420;dir=-1;}
 if(jumping){
  jt+=dt;jx+=260*dt;jy+=60*dt;
  if(jx>=330){
   jumping=false;round++;
   const err=Math.abs(jy-250);
   if(err<26){score+=100;H.sfx('ok');say('✔'+(100)+'! Na plataforma!');}
   else{H.sfx('bad');say('✕ Errou por '+(err|0)+'px!');}
   hud.set('pt',score);hud.set('t',Math.min(5,round+1)+'/5');
   if(round>=5){gameOver();return;}
  }
 }
 x.fillStyle='#2A2A33';x.fillRect(0,0,460,480);
 x.fillStyle='#4A4A55';x.fillRect(100,40,80,420);
 x.fillStyle='#C4D645';x.fillRect(110,ey-30,60,60);
 x.fillStyle='#3E7C4F';x.fillRect(330,224,100,16);
 x.font='20px system-ui';x.textAlign='center';x.fillText('i:flag',380,218);
 if(jumping){x.font='26px system-ui';x.fillText('',jx,jy);}
 else{x.font='26px system-ui';x.fillText('i:dance',140,ey+8);}
});
}});
