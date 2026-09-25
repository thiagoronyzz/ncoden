#!/usr/bin/env python3
"""NCODE N — reconstrói os dados dos jogos de simulação cujos campos eram
emoji e vieram vazios de fábrica. Substitui por palavras (pt-BR) legíveis ou
por tokens 'i:nome' quando o dado é desenhado em canvas. Uso:
python3 tools/repair_data.py [--dry]"""
import sys, os
ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DRY = "--dry" in sys.argv

def patch(fname, pairs, regex_pairs=()):
    path = os.path.join(ROOT, "games", fname)
    src = open(path, encoding="utf8").read()
    miss = 0
    for old, new in pairs:
        if old not in src:
            print("MISS", fname, "=>", old[:70]); miss += 1; continue
        src = src.replace(old, new, 1)
    import re
    for rx, rep in regex_pairs:
        src, n = re.subn(rx, rep, src)
        if not n: print("RXMISS", fname, rx[:60]); miss += 1
    if not DRY:
        open(path, "w", encoding="utf8").write(src)
    print(("OK  " if not miss else "PARCIAL ") + fname)

# ---------- g043 fatia de frutas: dados + desenho com cor ----------
patch("g043.js", [
    ('const FR=["","","","","",""];',
     'const FR=[["maçã","#D94E34"],["laranja","#E8A33D"],["melancia","#3E7C4F"],["limão","#C4D645"],["uva","#2E6E8A"],["kiwi","#9AAE2E"]];'),
    ('e:bomb?"":FR[Math.floor(Math.random()*FR.length)],bomb,r:22,sliced:false,rot:Math.random()*6});',
     'e:bomb?-1:Math.floor(Math.random()*FR.length),bomb,r:22,sliced:false,rot:Math.random()*6});'),
])

# ---------- g088 cidade: células e botões com palavras ----------
patch("g088.js", [
    ('const Z={casa:{e:"",c:20},loja:{e:"",c:30},fab:{e:"",c:30},parq:{e:"",c:25}};',
     'const Z={casa:{e:"casa",c:20},loja:{e:"loja",c:30},fab:{e:"fábrica",c:30},parq:{e:"parque",c:25}};'),
    ('const b=H.el("button","g-chip",Z[k].e+" "+k+" $"+Z[k].c,row);',
     'const b=H.el("button","g-chip",Z[k].e+" $"+Z[k].c,row);'),
])

# ---------- g092 arena: nomes no lugar dos glifos ----------
patch("g092.js", [
    ('const T={esp:{e:"",n:"Espada"},arc:{e:"",n:"Arco"},esc:{e:"",n:"Escudo"}};',
     'const T={esp:{e:"espada",n:"Espada"},arc:{e:"arco",n:"Arco"},esc:{e:"escudo",n:"Escudo"}};'),
    ('const b=H.el("button","g-btn ghost",T[k].e+" "+T[k].n,row);',
     'const b=H.el("button","g-btn ghost",T[k].n,row);'),
])

# ---------- g108 fábrica de robôs: cabeças nomeadas ----------
patch("g108.js", [
    ('const HEADS=["","",""],BODIES=["■","■","■"],NAMES=["Tocha","Parafuso","Antena"];',
     'const HEADS=["cúpula","parafuso","antena"],BODIES=["■","■","■"],NAMES=["Tocha","Parafuso","Antena"];'),
])

# ---------- g121 barista: rótulos de insumos ----------
patch("g121.js", [
    ('const SNM={bean:"grão $2",milk:"leite $2",cup:"copo $1",choc:"choc $3"};',
     'const SNM={bean:"grão $2",milk:"leite $2",cup:"copo $1",choc:"chocolate $3"};'),
    ('d.innerHTML=DR[o2.k].e+" "+DR[o2.k].n+(o2.brew>0?""+Math.ceil(o2.brew)+"s":o2.ready?"✔ SERVIR!":"preparar")+" · "+Math.ceil(o2.p);',
     'd.innerHTML=DR[o2.k].n+(o2.brew>0?" · "+Math.ceil(o2.brew)+"s":o2.ready?" · ✔ SERVIR!":" · preparar")+" · "+Math.ceil(o2.p);'),
])

# ---------- g123 hotel de pets ----------
patch("g123.js", [
    ('const PETS=["","","",""],NEED={eat:"",walk:"",play:""};',
     'const PETS=["cachorro","gato","coelho","papagaio"],NEED={eat:"comer",walk:"passear",play:"brincar"};'),
    ('b.innerHTML=p.e+"<br>"+(p.need?NEED[p.need]+" "+Math.ceil(p.t)+"s":"ok");',
     'b.innerHTML="<b>"+p.e+"</b><br>"+(p.need?NEED[p.need]+" "+Math.ceil(p.t)+"s":"ok");'),
])

# ---------- g124 padaria: usar nomes ----------
patch("g124.js", [
    ('const b=H.el("button","g-chip",IT[o.k].e+" "+IT[o.k].n+""+Math.ceil(o.p),o1);',
     'const b=H.el("button","g-chip",IT[o.k].n+" · "+Math.ceil(o.p)+"s",o1);'),
    ('H.el("div","g-chip","bandeja: "+(tray.map(k=>IT[k].e).join(" ")||"vazia"),box);',
     'H.el("div","g-chip","bandeja: "+(tray.map(k=>IT[k].n).join(", ")||"vazia"),box);'),
])

# ---------- g127 fazenda: plantio/colheita com palavras ----------
patch("g127.js", [
    ('const CROP={nabo:{e:"",f:"",n:"Nabo",cost:3,t:2,pr:8},abob:{e:"",f:"",n:"Abóbora",cost:8,t:4,pr:25}};',
     'const CROP={nabo:{e:"broto",f:"nabo",n:"Nabo",cost:3,t:2,pr:8},abob:{e:"broto",f:"abóbora",n:"Abóbora",cost:8,t:4,pr:25}};'),
    ('else if(p.g>=CROP[p.k].t)b.innerHTML=CROP[p.k].f+"<br>COLHER!";',
     'else if(p.g>=CROP[p.k].t)b.innerHTML="<b>"+CROP[p.k].f+"</b><br>COLHER!";'),
    ('H.btn(row,CROP[k].f+" "+CROP[k].n+" $"+CROP[k].cost+" ("+CROP[k].t+"d → $"+CROP[k].pr+")",()=>plant=k,H.touch),k===plant);' if False else
     'H.btn(row,CROP[k].f+" "+CROP[k].n+" $"+CROP[k].cost+" ("+CROP[k].t+"d → $"+CROP[k].pr+")",()=>{plant=k;H.sfx("tick");say("Plantando "+CROP[k].n+".");},k===plant);',
     'H.btn(row,CROP[k].n+" $"+CROP[k].cost+" ("+CROP[k].t+"d → $"+CROP[k].pr+")",()=>{plant=k;H.sfx("tick");say("Plantando "+CROP[k].n+".");},k===plant);'),
])

# ---------- g128 pesca: sprites i: + porão com valores ----------
patch("g128.js", [
    ('const FISH=[{e:"",v:8},{e:"",v:15},{e:"",v:25}];',
     'const FISH=[{e:"i:fish",v:8},{e:"i:fish",v:15},{e:"i:octopus",v:25}];'),
    ('x.fillText("porão: "+hold.map(k=>FISH[k].e).join(""),12,o.H-10);',
     'x.fillText("porão: "+(hold.map(k=>"$"+FISH[k].v).join(" + ")||"vazio"),12,o.H-10);'),
])

# ---------- g134 florista ----------
patch("g134.js", [
    ('const FL=["","","","",""];',
     'const FL=["rosa","girassol","tulipa","margarida","azaleia"];'),
])

# ---------- g135 pizzaria ----------
patch("g135.js", [
    ('const TOP=["","","","","",""];',
     'const TOP=["queijo","cogumelo","azeitona","pimenta","cebola","bacon"];'),
])

# ---------- g145 mercado ----------
patch("g145.js", [
    ('const NM=["","",""];',
     'const NM=["leite","pão","maçã"];'),
])

# ---------- g151 estufa: variedades nomeadas ----------
patch("g151.js", [
    ('const VAR=[{e:"",h:[60,80],t:[18,24]},{e:"",h:[70,90],t:[15,20]},{e:"",h:[50,70],t:[22,28]}];',
     'const VAR=[{e:"champignon",h:[60,80],t:[18,24]},{e:"shitake",h:[70,90],t:[15,20]},{e:"pleurotus",h:[50,70],t:[22,28]}];'),
    ('b.innerHTML=v.e+" "+Math.floor(grow[i])+"%<br>"+Math.floor(hum[i])+"% ("+v.h[0]+"–"+v.h[1]+")<br> quer "+v.t[0]+"–"+v.t[1]+"°"+(grow[i]>=100?"<br>COLHER!":"");',
     'b.innerHTML="<b>"+v.e+"</b> "+Math.floor(grow[i])+"%<br>"+Math.floor(hum[i])+"% ("+v.h[0]+"–"+v.h[1]+")<br> quer "+v.t[0]+"–"+v.t[1]+"°"+(grow[i]>=100?"<br>COLHER!":"");'),
])

# ---------- g156 casa de chás ----------
patch("g156.js", [
    ('const TEA={verde:{e:"",n:"verde",t:[65,75]},preto:{e:"",n:"preto",t:[95,100]},erva:{e:"",n:"ervas",t:[80,90]}};',
     'const TEA={verde:{e:"verde",n:"verde",t:[65,75]},preto:{e:"preto",n:"preto",t:[95,100]},erva:{e:"erva",n:"ervas",t:[80,90]}};'),
    ('od.innerHTML="Pedido: chá "+TEA[order].e+" <b>"+order+"</b> ("+TEA[order].t[0]+"–"+TEA[order].t[1]+"°C) · "+Math.ceil(pat)+"s";',
     'od.innerHTML="Pedido: chá <b>"+TEA[order].n+"</b> ("+TEA[order].t[0]+"–"+TEA[order].t[1]+"°C) · "+Math.ceil(pat)+"s";'),
])

# ---------- g158 ramen ----------
patch("g158.js", [
    ('const TOP=["","",""];',
     'const TOP=["ovo","carne","alga"];'),
    ('b.innerHTML="+["+o.top+"] "+(o.noodle==="ok"?"✔ MONTAR!":o.noodle?"⏳ cozinhando":"○ cozinhar")+" · "+Math.ceil(o.p);'
     if False else
     'b.innerHTML="+["+o.top+"] "+(o.noodle==="ok"?" MONTAR!":o.noodle?" cozinhando":" montar")+" · "+Math.ceil(o.p);',
     'b.innerHTML="ramen +["+o.top+"] "+(o.noodle==="ok"?"✔ MONTAR!":o.noodle?"cozinhando":"cozinhar")+" · "+Math.ceil(o.p)+"s";'),
])

# ---------- g159 smoothies: receitas e ingredientes ----------
patch("g159.js", [
    ('const GOAL={energia:{e:"",mix:["",""]},calma:{e:"",mix:["",""]},detox:{e:"",mix:["",""]}};',
     'const GOAL={energia:{e:"energia",mix:["banana","maçã"]},calma:{e:"calma",mix:["mirtilo","leite"]},detox:{e:"detox",mix:["couve","limão"]}};'),
    ('const ING=["","","","","",""];',
     'const ING=["banana","maçã","mirtilo","leite","couve","limão"];'),
    ('const say=H.msg(root,"Meta do cliente: <b> energia = + · calma = + · detox = +</b>. Ponha os 2, SEGURE bater (2s) e sirva!");',
     'const say=H.msg(root,"Meta do cliente: <b>energia = banana + maçã · calma = mirtilo + leite · detox = couve + limão</b>. Ponha os 2, SEGURE bater (2s) e sirva!");'),
    ('od.innerHTML="Meta: "+GOAL[goal].e+" <b>"+goal+"</b>";',
     'od.innerHTML="Meta: <b>"+GOAL[goal].e+"</b> = "+GOAL[goal].mix.join(" + ");'),
])

# ---------- g171 tornado: objetos i: no canvas ----------
patch("g171.js", [
    ('const EM=["","","","","","","","","","","","","","","",""];',
     'const EM=["i:house","i:house","i:car","i:car","i:pine","i:pine","i:sheep","i:truck","i:house","i:pine","i:car","i:barrel","i:building","i:pine","i:car","i:house"];'),
])

# ---------- g177 túnel de vento: pena/balão/avião como ícones ----------
patch("g177.js", [
    ('const OBJ=[{e:"",n:"pena",w:[35,55]},{e:"",n:"balão",w:[55,75]},{e:"",n:"avião",w:[75,95]}];',
     'const OBJ=[{e:"i:feather",n:"pena",w:[35,55]},{e:"i:balloon",n:"balão",w:[55,75]},{e:"i:plane",n:"avião",w:[75,95]}];'),
    ('say("✔"+OBJ[st-1].n+"! Agora: "+OBJ[st].e+" "+OBJ[st].n+" (vento "+OBJ[st].w.join("–")+").");',
     'say("✔ "+OBJ[st-1].n+" estabilizado! Agora: <b>"+OBJ[st].n+"</b> (vento "+OBJ[st].w.join("–")+").");'),
])

# ---------- g191 percussão: tambores i: ----------
patch("g191.js", [
    ('const DR=[{e:"",k:"A",f:110},{e:"",k:"S",f:180},{e:"",k:"D",f:260}];',
     'const DR=[{e:"i:drum",k:"A",f:110},{e:"i:drum",k:"S",f:180},{e:"i:drum",k:"D",f:260}];'),
])

# ---------- g236 memória: pares nomeados ----------
patch("g236.js", [
    ('const EM=["","","","","","","","","","","","","","","",""];',
     'const EM=["cachorro","gato","rato","hamster","coelho","raposa","urso","panda","koala","tigre","leão","sapo","cachorro","gato","rato","hamster","coelho","raposa","urso","panda","koala","tigre","leão","sapo"];'
     if False else
     'const EM=["cachorro","gato","rato","hamster","coelho","raposa","urso","panda","koala","tigre","leão","sapo"];'),
])


# ---------- retoques finais (linhas cujo formato atual difere) ----------
patch("g043.js", [
    ('x.font="30px serif";', 'x.textAlign="center";'),
])
patch("g092.js", [
    ('const say=H.msg(root,"vence · vence · vence . Monte 3 gladiadores e vença quartas, semi e final!");',
     'const say=H.msg(root,"A <b>espada</b> vence o arco · o <b>arco</b> vence o escudo · o <b>escudo</b> vence a espada. Monte 3 gladiadores e vença quartas, semi e final!");'),
])
patch("g158.js", [
    ('b.innerHTML="+"+o.top+" "+(o.noodle==="ok"?"✔ MONTAR!":o.noodle?"cozinhando":"cozinhar")+" · "+Math.ceil(o.p);',
     'b.innerHTML="ramen +["+o.top+"] "+(o.noodle==="ok"?"✔ MONTAR!":o.noodle?"cozinhando":"cozinhar")+" · "+Math.ceil(o.p)+"s";'),
])
