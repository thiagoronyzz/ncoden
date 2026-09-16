/* NCODE N · 101 Biblioteca Viva — ordene as lombadas */
GREG(101,{
init(root,H){
let round=1,books=[],moves=0,sel=-1,over=false;
const hud=H.hud(root,[["sl","SALA","1/3"],["mv","TROCAS","0/8"],["sc","PONTOS",0]]);
const say=H.msg(root,"Clique em dois livros para trocar de lugar. Ordene do <b>mais baixo ao mais alto</b>!");
const o=H.cvs(root,500,300),x=o.x;
let sc=0;
function build(){
  const n=4+round;
  const r=H.rng(round*7+1);
  books=[];
  for(let i=0;i<n;i++)books.push({h:60+Math.floor(r()*130),c:["#D94E34","#2E6E8A","#E8A33D","#3E7C4F","#7A6A53"][i%5]});
  if(books.every((b,i,a)=>i===0||a[i-1].h<=b.h)){const t=books[0];books[0]=books[n-1];books[n-1]=t;}
  moves=0;sel=-1;
  hud.set("sl",round+"/3");hud.set("mv","0/"+(n+3));
}
build();
H.onTap(o,(px,py)=>{
  if(over)return;
  const n=books.length,w=o.W/n,i=Math.floor(px/w);
  if(i<0||i>=n)return;
  if(sel<0){sel=i;H.sfx("tick");return;}
  if(sel===i){sel=-1;return;}
  const t=books[sel];books[sel]=books[i];books[i]=t;
  sel=-1;moves++;H.sfx("tick");
  hud.set("mv",moves+"/"+(n+3));
  if(books.every((b,j,a)=>j===0||a[j-1].h<=b.h)){
    sc+=100;H.score(sc);hud.set("sc",sc);H.sfx("ok");
    round++;
    if(round>3){over=true;return H.done({win:true,score:sc+100,title:"Biblioteca em ordem!",sub:"3 salas catalogadas por altura."});}
    say("Sala organizada! +100. Próxima: mais livros.");
    H.after(600,build);return;
  }
  if(moves>=n+3){over=true;H.sfx("lose");
    return H.done({win:false,score:sc,title:"Bagunça demais!",sub:"Trocas esgotadas na sala "+round+". Planeje antes!"});}
});
H.loop(()=>{
  const n=books.length,w=o.W/n;
  x.fillStyle=H.C.paper;x.fillRect(0,0,o.W,o.H);
  x.fillStyle="#7A6A53";x.fillRect(0,o.H-24,o.W,24);
  books.forEach((b,i)=>{
    x.fillStyle=sel===i?H.C.wasabi:b.c;
    x.fillRect(i*w+4,o.H-24-b.h,w-8,b.h);
    x.strokeStyle=H.C.ink;x.lineWidth=sel===i?3:1;
    x.strokeRect(i*w+4,o.H-24-b.h,w-8,b.h);
  });
});
}});
