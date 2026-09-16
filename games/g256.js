/* NCODE N · 256 Tarô Interativo — combine o arcano ao momento! */
GREG(256,{
init(root,H){
const AREAS=['amor','carreira','saude','espirito'];
const AE={amor:'💘 AMOR',carreira:'💼 CARREIRA',saude:'🌿 SAÚDE',espirito:'🔮 ESPÍRITO'};
const FLAV={
  amor:['Um novo olhar cruzou seu caminho…','Uma relação pede uma decisão…','O coração quer se declarar…'],
  carreira:['Uma proposta inesperada chegou…','Seu esforço será avaliado…','Um rumo novo se desenha…'],
  saude:['Seu corpo pede atenção…','Hora de retomar a rotina…','A energia anda em baixa…'],
  espirito:['Você busca um sentido maior…','Um sonho se repetiu…','O silêncio interior chama…']
};
// nome, palavra1, palavra2, pesos amor/carreira/saude/espirito, significado
const ARC=[
  ['O Louco','começos','ousadia','1122','Um salto de fé abre caminhos que o mapa não mostra.'],
  ['O Mago','ação','talento','1211','Você tem as ferramentas: é hora de usá-las com intenção.'],
  ['A Sacerdotisa','intuição','mistério','2012','Escute o que não foi dito; a resposta mora no silêncio.'],
  ['A Imperatriz','acolher','criar','2120','Fertilidade de ideias e afetos: cuide do que cresce.'],
  ['O Imperador','ordem','firmeza','1210','Estrutura e disciplina sustentam a conquista.'],
  ['O Hierofante','fé','tradição','1102','Busque orientação em quem já trilhou o caminho.'],
  ['Os Amantes','união','escolha','2111','Uma escolha do coração define os próximos passos.'],
  ['O Carro','avanço','vitória','1211','Foco e rédeas firmes: a vitória vem do movimento.'],
  ['A Força','coragem','calma','1121','A doçura persistente doma a fera mais brava.'],
  ['O Eremita','busca','pausa','0112','Recolha-se para encontrar a própria lanterna.'],
  ['A Roda','ciclos','sorte','1121','O que desce, sobe: gire junto com a mudança.'],
  ['A Justiça','verdade','equilíbrio','1201','Colha o que plantou; decida com honestidade.'],
  ['O Enforcado','espera','entrega','1012','Mude o ângulo: render-se também é estratégia.'],
  ['A Morte','fim','renascer','1211','Um ciclo se encerra para outro nascer. Solte.'],
  ['A Temperança','moderação','cura','1121','Misture com paciência: o equilíbrio cura.'],
  ['O Diabo','desejo','apego','2100','Cuidado com correntes disfarçadas de prazer.'],
  ['A Torre','ruptura','revelar','0210','O que ruir abre céu: reconstrução à vista.'],
  ['A Estrela','esperança','brilho','2012','Depois da noite, a estrela guia a cura.'],
  ['A Lua','sonhos','ilusão','2012','Nem tudo é o que parece: atravesse a névoa.'],
  ['O Sol','alegria','êxito','2221','Clareza e calor: celebre as conquistas.'],
  ['O Julgamento','chamado','perdão','1212','Um chamado para se levantar e recomeçar.'],
  ['O Mundo','plenitude','ciclo','2221','Conclusão gloriosa: celebre e compartilhe.']
];
const ROUNDS=5;
let over=false,round=0,score=0,streak=0,hits=0,phase='pick',seq=0;
let trio=[],correct=0,area='amor',spread=[];
const hud=H.hud(root,[['r','RODADA','1/5'],['pt','PONTOS',0],['st','SEQUÊNCIA',0],['ac','ACERTOS',0]]);
const say=H.msg(root,'Cada momento pede um arcano! Leia o cenário, sinta e escolha a carta que melhor combina. 3+ acertos revelam sua leitura final.');
const box=H.el('div','g-col',null,root);
const scn=H.el('div','g-msg','',box);
const cards=H.el('div','g-row',null,box);
const info=H.el('div','g-msg','',box);
const nav=H.el('div','g-row',null,box);
function status(){hud.set('r',Math.min(round+1,ROUNDS)+'/'+ROUNDS);hud.set('pt',score);hud.set('st',streak);hud.set('ac',hits);}
function cardBtn(label,fn,face){
  const b=H.el('button','g-card'+(face?' hot':''),label,cards);
  b.style.width='120px';b.style.height='170px';b.style.fontSize='15px';
  b.addEventListener('click',fn);
  return b;
}
function newRound(){
  phase='pick';
  area=AREAS[(Math.random()*4)|0];
  const pool=ARC.map((a,i)=>i);
  const strong=pool.filter(i=>+ARC[i][3][AREAS.indexOf(area)]===2);
  const weak0=pool.filter(i=>+ARC[i][3][AREAS.indexOf(area)]===0);
  const weak1=pool.filter(i=>+ARC[i][3][AREAS.indexOf(area)]<=1);
  const ci=strong[(Math.random()*strong.length)|0];
  const bag=(weak0.length>=2?weak0:weak1).filter(i=>i!==ci);
  const d1=bag.splice((Math.random()*bag.length)|0,1)[0];
  const d2=bag.splice((Math.random()*bag.length)|0,1)[0];
  trio=[ci,d1,d2];
  for(let i=2;i>0;i--){const j=(Math.random()*(i+1))|0;const t=trio[i];trio[i]=trio[j];trio[j]=t;}
  correct=trio.indexOf(ci);
  cards.innerHTML='';info.innerHTML='';nav.innerHTML='';
  scn.innerHTML='<b>'+AE[area]+'</b> · '+FLAV[area][(Math.random()*FLAV[area].length)|0]+'<br>Qual arcano rege este momento?';
  trio.forEach((ci2,k)=>cardBtn('🌙<br><b>?</b><br><span style="font-size:12px">revelar</span>',()=>pick(k),false));
  status();
}
function pick(k){
  if(over||phase!=='pick')return;
  phase='reveal';
  const ok=k===correct;
  if(ok){hits++;streak++;score+=100+streak*25;H.sfx('ok');}
  else{streak=0;H.sfx('bad');}
  cards.innerHTML='';
  trio.forEach((ci2,j)=>{
    const a=ARC[ci2];
    const mark=j===correct?' ✅':(j===k?' ❌':'');
    const b=cardBtn('<b>'+a[0]+'</b><br><span style="font-size:12px">'+a[1]+' · '+a[2]+'</span>'+mark,()=>{},j===correct);
    if(j===k&&!ok)b.style.outline='3px solid #B23A24';
  });
  const a=ARC[trio[correct]];
  info.innerHTML=(ok?'✨ <b>Perfeito! +'+(100+streak*25)+'</b> ':'💫 Não foi dessa vez. ')+'<b>'+a[0]+'</b> rege '+area+': <i>'+a[4]+'</i>';
  const last=round>=ROUNDS-1;
  H.btn(nav,last?'🔮 Revelar minha leitura':'Próximo momento →',()=>{
    if(over||phase!=='reveal')return;
    round++;
    if(round>=ROUNDS)finalSpread();else newRound();
  },true);
  status();
}
function finalSpread(){
  phase='spread';
  const pool=ARC.map((a,i)=>i);
  for(let i=pool.length-1;i>0;i--){const j=(Math.random()*(i+1))|0;const t=pool[i];pool[i]=pool[j];pool[j]=t;}
  spread=[0,1,2].map(k=>({i:pool[k],rev:Math.random()<.4}));
  cards.innerHTML='';nav.innerHTML='';
  scn.innerHTML='<b>🔮 SUA LEITURA</b> · Passado · Presente · Futuro';
  const tags=['PASSADO','PRESENTE','FUTURO'];
  let txt='';
  spread.forEach((s,k)=>{
    const a=ARC[s.i];
    cardBtn('<span style="font-size:11px">'+tags[k]+'</span><br><b>'+a[0]+'</b>'+(s.rev?'<br>🙃':''),()=>{},!s.rev);
    txt+='<b>'+tags[k]+' — '+a[0]+(s.rev?' (invertido)':'')+':</b> '+a[4]+(s.rev?' <i>No avesso: energia pedindo atenção redobrada.</i>':'')+'<br>';
  });
  info.innerHTML=txt;
  H.btn(nav,'✨ Concluir leitura',()=>{
    if(over||phase!=='spread')return;
    over=true;
    const win=hits>=3;
    score+=hits*50;
    H.score(score);
    H.done(win?{win:true,score,title:'🔮 Leitura completa!',sub:hits+'/'+ROUNDS+' acertos · '+score+' pontos · os arcanos sorriem.'}
      :{win:false,score,title:'Névoa densa…',sub:hits+'/'+ROUNDS+' acertos · medite e tente de novo!'});
  },true);
  status();
}
newRound();
}});
