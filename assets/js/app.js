/* NCODE N — Catálogo (index): busca, filtros, favoritos, progresso */
"use strict";
(function(){
const $ = s => document.querySelector(s);
const store = {
  get(k,d){ try{ const v=localStorage.getItem("ncg_"+k); return v==null?d:JSON.parse(v); }catch(e){ return d; } },
  set(k,v){ try{ localStorage.setItem("ncg_"+k,JSON.stringify(v)); }catch(e){} }
};
const state = { q:"", genre:"all", tab:"all", sort:"num" };
const GENRES = window.GENRES, CAT = window.CATALOG;

function statusOf(id){
  if(store.get("done_"+id,0)) return 2;
  if(store.get("played_"+id,0)) return 1;
  return 0;
}
function esc(s){ return String(s).replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;"); }

function buildChips(){
  const box = $("#chips"); box.innerHTML = "";
  const mk = (key,label,count)=>{
    const b = document.createElement("button");
    b.className = "chip"+(state.genre===key?" on":"");
    b.innerHTML = esc(label)+' <span class="n">'+count+'</span>';
    b.addEventListener("click",()=>{ state.genre=key; buildChips(); build(); });
    box.appendChild(b);
  };
  mk("all","Tudo",CAT.length);
  Object.keys(GENRES).forEach(k=>mk(k, GENRES[k].e+" "+GENRES[k].n, CAT.filter(g=>g[2]===k).length));
}

function favs(){ return store.get("fav",[]); }

function list(){
  let L = CAT.slice();
  if(state.tab==="fav"){ const f=favs(); L = L.filter(g=>f.includes(g[0])); }
  if(state.tab==="todo") L = L.filter(g=>statusOf(g[0])===0);
  if(state.tab==="done") L = L.filter(g=>statusOf(g[0])===2);
  if(state.genre!=="all") L = L.filter(g=>g[2]===state.genre);
  if(state.q) L = L.filter(g=>(g[1]+" "+GENRES[g[2]].n+" "+g[3]).toLowerCase().includes(state.q));
  if(state.sort==="name") L.sort((a,b)=>a[1].localeCompare(b[1]));
  else if(state.sort==="diff") L.sort((a,b)=>window.difOf(b[0])-window.difOf(a[0]));
  else L.sort((a,b)=>a[0]-b[0]);
  return L;
}

function build(){
  const grid = $("#grid"); grid.innerHTML = "";
  const L = list();
  $("#countLine").textContent = "// EXIBINDO "+L.length+" / "+CAT.length+" JOGOS";
  if(!L.length){ grid.innerHTML = '<div class="empty">NENHUM JOGO ENCONTRADO — AJUSTE A BUSCA_</div>'; return; }
  const F = favs();
  L.forEach(g=>{
    const [id,title,genre,desc,ctrl] = g;
    const a = document.createElement("a");
    a.className = "card"+(F.includes(id)?" fav":"");
    a.href = "play.html#"+String(id).padStart(3,"0");
    const st = statusOf(id);
    const stHtml = st===2?'<span class="stamp done"><span class="dot"></span>concluído</span>'
      : st===1?'<span class="stamp played"><span class="dot"></span>jogado</span>'
      : '<span class="stamp"><span class="dot"></span>novo</span>';
    const best = store.get("best_"+id,0);
    a.innerHTML =
      '<div class="card-top"><span class="card-idx">Nº <b>'+String(id).padStart(3,"0")+'</b></span>'+stHtml+'</div>'+
      "<h2>"+esc(title)+"</h2>"+
      '<p class="card-desc">'+esc(desc)+"</p>"+
      '<div class="card-foot"><span class="gtag">'+GENRES[genre].e+" "+esc(GENRES[genre].n)+'</span>'+
      (best?'<span class="best">★ '+best+'</span>':"")+
      '<span class="card-go">JOGAR <i>→</i></span></div>';
    const fav = document.createElement("button");
    fav.className = "favbtn"+(F.includes(id)?" lit":"");
    fav.textContent = F.includes(id)?"★":"☆";
    fav.title = "Favoritar";
    fav.setAttribute("aria-label","Favoritar "+title);
    fav.addEventListener("click",ev=>{
      ev.preventDefault(); ev.stopPropagation();
      let f = favs();
      f = f.includes(id)?f.filter(x=>x!==id):f.concat([id]);
      store.set("fav",f); build();
    });
    a.appendChild(fav);
    grid.appendChild(a);
  });
}

function stats(){
  let p=0,d=0;
  CAT.forEach(g=>{ const s=statusOf(g[0]); if(s>=1)p++; if(s===2)d++; });
  $("#stPlayed").textContent = p;
  $("#stDone").textContent = d;
  const pct = Math.round(d/CAT.length*100);
  $("#stPct").textContent = pct+"%";
}

/* tema */
function theme(){
  const t = store.get("theme","light");
  document.documentElement.setAttribute("data-theme",t==="dark"?"dark":"light");
  $("#btnTheme").textContent = t==="dark"?"☀ CLARO":"◐ ESCURO";
}
document.addEventListener("DOMContentLoaded",()=>{
  buildChips(); build(); stats(); theme();
  let tm=null;
  $("#q").addEventListener("input",e=>{ clearTimeout(tm); tm=setTimeout(()=>{ state.q=e.target.value.trim().toLowerCase(); build(); },120); });
  document.querySelectorAll(".seg button").forEach(b=>b.addEventListener("click",()=>{
    document.querySelectorAll(".seg button").forEach(x=>x.classList.remove("on"));
    b.classList.add("on"); state.tab=b.dataset.tab; build();
  }));
  $("#sort").addEventListener("change",e=>{ state.sort=e.target.value; build(); });
  $("#btnTheme").addEventListener("click",()=>{
    const t = store.get("theme","light")==="dark"?"light":"dark";
    store.set("theme",t); theme();
  });
  $("#btnSurprise").addEventListener("click",()=>{
    location.href = "play.html#"+String(1+Math.floor(Math.random()*400)).padStart(3,"0");
  });
});
})();
