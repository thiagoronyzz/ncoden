/* NCODE N · 374 Corrida de Categorias — toque rápido! */
GREG(374,{
init(root,H){
const CATS=[
 ['FRUTAS',['','','','','','','','','']],
 ['ANIMAIS',['','','','','','','','','']],
 ['VEÍCULOS',['','','','','','','','','']]
];
let over=false,round=0,score=0,bot=0,time=0,need=0;
const hud=H.hud(root,[['r','RODADA','1/3'],['vc','VOCÊ',0],['bt','BOT',0]]);
const say=H.msg(root,'Toque TUDO da categoria antes do bot! 3 rodadas. Errar = −1s!');
const box=H.el('div','g-col',null,root);
const ct=H.el('div','g-msg','',box);
const grid=H.el('div','g-board',null,box);
grid.style.gridTemplateColumns='repeat(3,1fr)';
let items=[];
function show(){
 if(round>=3){gameOver();return;}
 const c=CATS[round];
 hud.set('r',(round+1)+'/3');
 time=20;
 items=c[1].map((e,i)=>({e,ok:''.includes(e)&&((round===0&&''.includes(e))||(round===1&&''.includes(e))||(round===2&&''.includes(e))),got:false}));
 need=items.filter(i=>i.ok).length;
 ct.innerHTML='<b>'+c[0]+'</b> · ache '+need+'! 20s';
 grid.innerHTML='';
 items.forEach(it=>{
  const b=H.el('button','g-cell',it.e,grid);
  b.style.fontSize='34px';b.style.minHeight='64px';
  b.addEventListener('click',()=>{
   if(over||it.got)return;
   if(it.ok){it.got=true;b.style.opacity='.25';score++;H.sfx('ok');hud.set('vc',score);
    if(!items.some(i=>i.ok&&!i.got)){round++;bot+=3+((Math.random()*3)|0);hud.set('bt',bot);H.after(800,()=>{if(!over)show();});}
   }else{time=Math.max(0,time-1);H.sfx('bad');}
  });
 });
}
H.every(1000,()=>{
 if(over||round>=3)return;
 time--;
 ct.innerHTML='<b>'+CATS[round][0]+'</b> · ache '+items.filter(i=>i.ok&&!i.got).length+'! '+time+'s';
 if(time<=0){round++;bot+=4;hud.set('bt',bot);show();}
});
function gameOver(){over=true;grid.innerHTML='';H.score(score*20);
H.done({win:score>bot,score:score*20,title:score>bot?'Mais rápido!':'Bot venceu!',sub:'Você '+score+' × '+bot+' bot.'});}
show();
}});
