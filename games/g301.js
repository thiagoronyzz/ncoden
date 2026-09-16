/* NCODE N · 301 Surf de Onda — fique no tubo! */
GREG(301,{
init(root,H){
let over=false,py=260,score=0,t=0,time=60,curl=260,wipe=0;
const hud=H.hud(root,[['pt','PONTOS',0],['tp','TEMPO',60]]);
const say=H.msg(root,'Fique dentro da zona verde do tubo! ⬆️⬇️ movem. Manobras no tubo valem pontos. 3 quedas = fim. Meta: 500!');
const o=H.cvs(root,480,400),x=o.x;
const kb=H.keys(),dn={};kb.on((c,d)=>{dn[c]=d;if(d&&c==='Space')trick();});
H.onTap(o,(qx,qy)=>{tapY=qy;});
let tapY=null;
H.btn(root,'🏄 Manobra! (Espaço)',trick,false);
function trick(){
 if(over)return;
 const d=Math.abs(py-curl);
 if(d<40){score+=50;H.sfx('ok');}
 else{wipe++;H.sfx('bad');if(wipe>=3){gameOver();return;}}
}
function gameOver(){over=true;const win=score>=500;H.score(score);
H.done(win?{win:true,score,title:'🏄 Rei do tubo!',sub:score+' pontos!'}:{win:false,score,title:'Fim da onda!',sub:score+'/500 pontos. Fique no verde!'});}
H.loop(dt=>{
 if(over)return;t+=dt;time-=dt;
 curl=260+Math.sin(t*1.1)*110+Math.sin(t*2.7)*30;
 const U=dn.ArrowUp||dn.KeyW,D=dn.ArrowDown||dn.KeyS;
 if(U)py-=200*dt;if(D)py+=200*dt;
 if(tapY!=null){py+=(tapY-py)*4*dt;}
 py=H.clamp(py,90,390);
 if(Math.abs(py-curl)<40)score+=dt*20;
 hud.set('pt',score|0);hud.set('tp',Math.ceil(time));
 if(py<=95||py>=385){wipe++;py=260;H.sfx('bad');if(wipe>=3){gameOver();return;}}
 if(time<=0){gameOver();return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,480,400);
 x.fillStyle='#3EAFBF';
 x.beginPath();x.moveTo(0,400);
 for(let sx=0;sx<=480;sx+=10)x.lineTo(sx,120+Math.sin(sx*.02+t*2)*24);
 x.lineTo(480,400);x.fill();
 x.fillStyle='rgba(196,214,69,.5)';x.fillRect(0,curl-40,480,80);
 x.fillStyle='#fff';
 for(let i=0;i<16;i++){const wx=(i*139+t*120)%520-20;x.fillRect(wx,100+((i*67)%60),24,5);}
 x.font='32px system-ui';x.textAlign='center';x.fillText('🏄',140,py+10);
 x.fillStyle='#181816';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText((score|0)+' pts · ⏱️'+Math.ceil(time)+'s · quedas '+wipe+'/3 · meta 500',12,26);
});
}});
