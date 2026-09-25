/* NCODE N · 373 Qual é a Música — ouça e adivinhe! */
GREG(373,{
init(root,H){
const M=[
 ['Rock clássico',['Rock','Samba','Funk','Jazz'],0],
 ['Batucada',['Rock','Samba','Pop','Clássica'],1],
 ['Cordas suaves',['Funk','Rock','Clássica','Rap'],2],
 ['Refrão pop',['Samba','Pop','Jazz','Blues'],1],
 ['Sopro alto',['Jazz','Rock','Sertanejo','Eletrônica'],0],
 ['Sanfona',['Forró','Rock','Pop','Reggae'],0]
];
let over=false,qi=0,score=0,play=0,t=0;
const hud=H.hud(root,[['m','MÚSICA','1/6'],['pt','PONTOS',0]]);
const say=H.msg(root,'Um trecho toca (barras animadas + dica)! Adivinhe o estilo. 6 músicas!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
const o=H.cvs(root,460,120),x=o.x;
function show(){
 if(qi>=6){gameOver();return;}
 play=3;
 hud.set('m',(qi+1)+'/6');
 const m=M[qi];
 st.innerHTML='Ouvindo… dica: <b>'+m[0]+'</b>';
 brow.innerHTML='';
 m[1].forEach((opt,i)=>{
  H.btn(brow,opt,()=>{
   if(over)return;
   if(i===m[2]){score+=100;H.sfx('ok');}
   else{H.sfx('bad');say('✕ Era: '+m[1][m[2]]);}
   qi++;hud.set('pt',score);show();
  },false);
 });
}
function gameOver(){over=true;brow.innerHTML='';H.score(score);
H.done({win:score>=400,score,title:score>=400?'Ouvido de ouro!':'Fim!',sub:score+'/600 pontos.'});}
H.loop(dt=>{
 t+=dt;if(play>0)play-=dt;
 x.fillStyle='#1C1C22';x.fillRect(0,0,460,120);
 for(let i=0;i<24;i++){
  const h=play>0?20+Math.abs(Math.sin(t*6+i))*(50+((i*37)%40)):8;
  x.fillStyle=play>0?'#C4D645':'#4A4A44';
  x.fillRect(10+i*18,110-h,12,h);
 }
});
show();
}});
