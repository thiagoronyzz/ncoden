/* NCODE N · 342 Escavação de Fósseis — escave com cuidado! */
GREG(342,{
init(root,H){
const N=8,CS=52,OX=22,OY=22;
let over=false,hp=100,found=0,t=0;
// esqueleto: espinha + costelas
const BONE=new Set(['3,2','3,3','3,4','3,5','2,3','4,3','2,4','4,4','1,3','5,3','3,1','3,6']);
let dug=new Set();
const hud=H.hud(root,[['o','OSSOS','0/12'],['i','INTEGRIDADE','100%']]);
const say=H.msg(root,'Toque para escavar cada quadrado! = osso (gentil). Escavar osso 2× quebra (−integridade). Ache os 12!');
const o=H.cvs(root,460,460),x=o.x;
H.onTap(o,(px,py)=>{
 if(over)return;
 const c=Math.floor((px-OX)/CS),r=Math.floor((py-OY)/CS);
 if(c<0||c>=N||r<0||r>=N)return;
 const k=c+','+r;
 if(dug.has(k)){
  if(BONE.has(k)){hp-=15;H.sfx('bad');hud.set('i',Math.max(0,hp)+'%');
   if(hp<=0){gameOver(false);return;}}
  return;
 }
 dug.add(k);H.sfx('tick');
 if(BONE.has(k)){found++;H.sfx('ok');hud.set('o',found+'/12');}
 if(found>=12){gameOver(true);return;}
});
function gameOver(win){over=true;const sc=found*30+(win?hp*2:0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Esqueleto completo!',sub:'12 ossos, integridade '+(hp|0)+'%.'}:{win:false,score:sc|0,title:'Fóssil quebrou!',sub:'Não escave o osso 2 vezes!'});}
H.loop(()=>{
 if(over)return;
 x.fillStyle='#C9B189';x.fillRect(0,0,460,460);
 for(let r=0;r<N;r++)for(let c=0;c<N;c++){
  const k=c+','+r;
  x.fillStyle=!dug.has(k)?'#8A6A2F':BONE.has(k)?'#EDE8DC':'#B9A37E';
  x.fillRect(OX+c*CS,OY+r*CS,CS,CS);
  x.strokeStyle='#5A4A33';x.strokeRect(OX+c*CS+.5,OY+r*CS+.5,CS-1,CS-1);
  if(dug.has(k)&&BONE.has(k)){x.font='26px system-ui';x.textAlign='center';x.fillText('i:bone',OX+c*CS+26,OY+r*CS+36);}
 }
});
}});
