/* NCODE N · 338 Derramamento de Óleo — contenha! */
GREG(338,{
init(root,H){
const N=10,CS=40,OX=30,OY=40;
let over=false,oil=[],booms=[],t=0,tick=0,time=150;
oil.push([4,2]);
const hud=H.hud(root,[['tp','TEMPO',150],['m','MANCHA',1]]);
const say=H.msg(root,'Toque na água para lançar barreiras 🟡! Cerque a mancha antes que toque a costa (embaixo). Sobreviva 150s!');
const o=H.cvs(root,460,470),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(c<0||c>=N||r<0||r>=N||r>=8)return;
 const k=c+','+r;
 if(oil.some(q=>q[0]===c&&q[1]===r)||booms.includes(k))return;
 if(booms.length>=14){say('Limite de 14 barreiras!');H.sfx('bad');return;}
 booms.push(k);H.sfx('tick');
});
function gameOver(win,why){over=true;const sc=win?400:Math.max(20,150-time|0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'🌊 Costa salva!',sub:'Mancha contida!'}:{win:false,score:sc|0,title:'Desastre!',sub:why});}
H.loop(dt=>{
 if(over)return;t+=dt;tick+=dt;time-=dt;
 hud.set('tp',Math.ceil(time));hud.set('m',oil.length);
 if(tick>1.6){tick=0;
  const news=[];
  oil.forEach(q=>{
   [[1,0],[-1,0],[0,1],[0,-1]].forEach(d=>{
    const nc=q[0]+d[0],nr=q[1]+d[1];
    if(nc<0||nc>=N||nr<0||nr>=N)return;
    const k=nc+','+nr;
    if(booms.includes(k)||oil.some(z=>z[0]===nc&&z[1]===nr)||news.some(z=>z[0]===nc&&z[1]===nr))return;
    news.push([nc,nr]);
   });
  });
  oil=oil.concat(news);
  if(oil.some(q=>q[1]>=8)){gameOver(false,'O óleo chegou à costa!');return;}
  // cercada?
  const edge=oil.some(q=>q[0]===0||q[0]===N-1||q[1]===0||q[1]===7);
  if(!edge&&news.length===0){gameOver(true);return;}
 }
 if(time<=0){gameOver(true);return;}
 x.fillStyle='#2E6E8A';x.fillRect(0,0,460,470);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const isOil=oil.some(q=>q[0]===c&&q[1]===r);
  const isBoom=booms.includes(c+','+r);
  x.fillStyle=r>=8?'#E8C86B':isOil?'#1A1A1A':isBoom?'#E8A33D':'#2E6E8A';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='rgba(255,255,255,.2)';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
 }
 x.fillStyle='#fff';x.font='bold 14px system-ui';x.textAlign='left';
 x.fillText('⏱️'+Math.ceil(time)+'s · Mancha '+oil.length+' · Barreiras '+booms.length+'/14',14,28);
});
}});
