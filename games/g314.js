/* NCODE N · 314 Noite Zumbi — segure até o amanhecer! */
GREG(314,{
init(root,H){
let over=false,wave=0,bar=100,ammo=30,kills=0,t=0,phase='build';
let zombs=[];
const hud=H.hud(root,[['o','ONDA','0/8'],['b','BARRICADA',100],['m','BALAS',30]]);
const say=H.msg(root,'Sobreviva a 8 ondas! Clique nos zumbis para atirar. Entre ondas: repare (+40) ou compre balas (+15). Barricada zera = fim!');
const o=H.cvs(root,480,400),x=o.x;
const brow=H.el('div','g-row',null,root);
function status(){hud.set('o',wave+'/8');hud.set('b',Math.max(0,bar|0));hud.set('m',ammo);}
function paintBtns(){
 brow.innerHTML='';
 if(over||phase!=='build')return;
 H.btn(brow,'🔨 Reparar (+40)',()=>{bar=Math.min(100,bar+40);H.sfx('tick');status();},false);
 H.btn(brow,'🔫 Balas (+15)',()=>{ammo+=15;H.sfx('tick');status();},false);
 H.btn(brow,'🌊 Chamar onda '+(wave+1),()=>{startWave();},true);
}
function startWave(){
 if(over||phase!=='build')return;
 wave++;
 const n=3+wave*2;
 zombs=[];
 for(let i=0;i<n;i++)zombs.push({x:500+Math.random()*220+i*30,y:80+Math.random()*280,hp:1+(wave>4?1:0),sp:26+wave*4+Math.random()*14});
 phase='fight';brow.innerHTML='';
 say('🌊 Onda '+wave+'/8 — '+n+' zumbis!');
 status();
}
H.onTap(o,(px,py)=>{
 if(over||phase!=='fight'||ammo<=0)return;
 ammo--;H.sfx('tick');
 let best=null,bd=1e9;
 zombs.forEach(z=>{const d=Math.hypot(px-z.x,py-z.y);if(d<bd){bd=d;best=z;}});
 if(best&&bd<40){best.hp--;if(best.hp<=0){zombs.splice(zombs.indexOf(best),1);kills++;}}
 status();
});
function gameOver(win){over=true;brow.innerHTML='';
 const sc=kills*20+(win?300:0);H.score(sc);
H.done(win?{win:true,score:sc,title:'🌅 Amanheceu!',sub:kills+' zumbis abatidos!'}:{win:false,score:sc,title:'A casa caiu!',sub:'Onda '+wave+'/8 · '+kills+' abates. Mire na cabeça!'});}
H.loop(dt=>{
 if(over)return;t+=dt;
 if(phase==='fight'){
  zombs.forEach(z=>{z.x-=z.sp*dt;});
  zombs.filter(z=>z.x<70).forEach(z=>{zombs.splice(zombs.indexOf(z),1);bar-=12;H.sfx('bad');});
  status();
  if(bar<=0){gameOver(false);return;}
  if(!zombs.length){
   if(wave>=8){gameOver(true);return;}
   phase='build';ammo+=8;paintBtns();say('Onda '+wave+' limpa! +8 balas. Prepare-se.');
  }
 }
 x.fillStyle='#1C1C24';x.fillRect(0,0,480,400);
 x.fillStyle='#8A6A2F';x.fillRect(0,60,60,320);
 x.fillStyle='#5A4A33';
 for(let i=0;i<6;i++)x.fillRect(6,70+i*50,48,10);
 x.fillStyle='#D94E34';x.font='bold 13px system-ui';x.textAlign='left';
 x.fillText('CASA '+Math.max(0,bar|0),4,54);
 zombs.forEach(z=>{x.font='26px system-ui';x.textAlign='center';x.fillText('🧟',z.x,z.y);});
 x.fillStyle='#fff';x.font='bold 15px system-ui';x.textAlign='left';
 x.fillText('Onda '+wave+'/8 · 🔫'+ammo+' · 🧟'+zombs.length,70,30);
});
paintBtns();status();
}});
