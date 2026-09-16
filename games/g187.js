/* NCODE N · 187 Plástico Bolha — ESTOURE TUDO! */
GREG(187,{
init(root,H){
const C=8,R=6;
let over=false,bub=[],combo=0,best=0,time=60,last=0;
const hud=H.hud(root,[["tp","TEMPO",60],["cb","COMBO","x1"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique nas bolhas para estourar! Rápidas em sequência = <b>combo</b>. Dourada = +50! Estoure as 48 em 60s!");
const o=H.cvs(root,480,380),x=o.x;
let sc=0;
const r=H.rng(Date.now()%10000);
for(let i=0;i<C*R;i++)bub.push({pop:false,gold:r()<.06});
const CW=o.W/C,CH=o.H/R;
H.onTap(o,(px,py)=>{
  if(over)return;
  const c=Math.floor(px/CW),rr=Math.floor(py/CH);
  if(c<0||c>=C||rr<0||rr>=R)return;
  const b=bub[rr*C+c];
  if(b.pop){combo=0;hud.set("cb","x1");return;}
  b.pop=true;
  const now=performance.now();
  combo=(now-last<900)?combo+1:1;
  last=now;best=Math.max(best,combo);
  const pts=(b.gold?50:10)*Math.min(combo,8);
  sc+=pts;H.score(sc);hud.set("sc",sc);hud.set("cb","x"+Math.min(combo,8));
  H.beep(300+Math.min(combo,12)*60,.06);
  if(bub.every(q=>q.pop)){over=true;
    return H.done({win:true,score:sc+Math.floor(time)*5+100,title:"Satisfação total!",sub:"48 estouros, combo máximo x"+Math.min(best,8)+"!"});
  }
});
H.loop(dt=>{
  if(over)return;
  time-=dt;hud.set("tp",Math.max(0,Math.ceil(time)));
  if(time<=0){over=true;
    const left=bub.filter(q=>!q.pop).length;
    return H.done({win:false,score:sc,title:"Sobraram "+left+"!",sub:"Dedos mais rápidos na próxima!"});
  }
  x.fillStyle="#BFE0EF";x.fillRect(0,0,o.W,o.H);
  bub.forEach((b,i)=>{
    const c=i%C,rr=(i/C)|0;
    const cx=c*CW+CW/2,cy=rr*CH+CH/2;
    if(b.pop){
      x.strokeStyle="rgba(0,0,0,.15)";
      x.beginPath();x.arc(cx,cy,14,0,7);x.stroke();
    }else{
      const g=x.createRadialGradient(cx-5,cy-5,2,cx,cy,18);
      if(b.gold){g.addColorStop(0,"#FFF3C4");g.addColorStop(1,"#E8A33D");}
      else{g.addColorStop(0,"#ffffff");g.addColorStop(1,"#7FB3D5");}
      x.fillStyle=g;
      x.beginPath();x.arc(cx,cy,17,0,7);x.fill();
      x.strokeStyle="rgba(0,0,0,.2)";x.stroke();
    }
  });
});
}});
