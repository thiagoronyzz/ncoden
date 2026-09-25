/* NCODE N · 352 Mergulho no Naufrágio — artefatos do navio! */
GREG(352,{
init(root,H){
let over=false,room=0,o2=100,t=0,got=0;
const ROOMS=[
 [{k:'',got:false},{k:'',got:false}],
 [{k:'',got:false},{k:'',got:false}],
 [{k:'',got:false},{k:'',got:false}]
];
const hud=H.hud(root,[['s','SALA','1/3'],['ox','OXIGÊNIO','100%'],['a','ARTEFATOS','0/6']]);
const say=H.msg(root,'Toque nos artefatos para coletar! Complete a sala para avançar. O₂ acaba = fim!');
const o=H.cvs(root,460,360),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 ROOMS[room].forEach((a,i)=>{
  const ax=150+i*160,ay=200;
  if(!a.got&&Math.hypot(px-ax,py-ay)<40){
   a.got=true;got++;H.sfx('ok');hud.set('a',got+'/6');
   if(ROOMS[room].every(q=>q.got)){
    room++;
    if(room>=3){gameOver(true);return;}
    hud.set('s',(room+1)+'/3');o2=Math.min(100,o2+20);
    say('Sala '+(room+1)+'! +20 O₂.');
   }
  }
 });
});
function gameOver(win){over=true;const sc=got*60+(win?Math.ceil(o2)*2:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'Tesouro do navio!',sub:'6 artefatos resgatados!'}:{win:false,score:sc,title:'Sem ar!',sub:got+'/6 artefatos. Seja rápido!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 o2-=dt*2.4;
 hud.set('ox',Math.max(0,o2|0)+'%');
 if(o2<=0){gameOver(false);return;}
 x.fillStyle='#123F5C';x.fillRect(0,0,460,360);
 x.strokeStyle='#8A6A2F';x.lineWidth=6;x.strokeRect(20,60,420,260);
 x.fillStyle='rgba(255,255,255,.15)';x.fillRect(20,60,420,260);
 if(room<3)ROOMS[room].forEach((a,i)=>{
  if(!a.got){x.font='44px system-ui';x.textAlign='center';x.fillText(a.k,150+i*160,215+Math.sin(t*2+i)*5);}
 });
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Sala '+(room+1)+'/3 · O₂ '+(o2|0)+'% · '+got+'/6',12,30);
 x.fillStyle='#000';x.fillRect(12,38,200,10);
 x.fillStyle=o2>30?'#7FB3C8':'#D94E34';x.fillRect(12,38,200*Math.max(0,o2)/100,10);
});
}});
