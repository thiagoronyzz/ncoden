/* NCODE N · 330 Base Subaquática — equilíbrio vital! */
GREG(330,{
init(root,H){
let over=false,o2=80,power=80,press=50,t=0,time=120;
const hud=H.hud(root,[['ox','O₂',80],['en','ENERGIA',80],['pr','PRESSÃO',50]]);
const say=H.msg(root,'Aguente 120s! O₂ cai sempre; energia cai com sistemas ligados; pressão oscila. Ligue/desligue com sabedoria!');
const box=H.el('div','g-col',null,root);
const st=H.el('div','g-msg','',box);
const brow=H.el('div','g-row',null,box);
let sys={o2:true,heat:true,pump:false};
function status(){
 hud.set('ox',Math.max(0,o2|0));hud.set('en',Math.max(0,power|0));hud.set('pr',press|0);
 st.innerHTML=(time|0)+'s restantes<br>O₂ '+o2.toFixed(0)+' · '+power.toFixed(0)+' · '+press.toFixed(0)+'%';
 paintBtns();
}
function paintBtns(){
 brow.innerHTML='';
 if(over)return;
 H.btn(brow,(sys.o2?'●':'○')+' Gerador O₂',()=>{sys.o2=!sys.o2;H.sfx('tick');status();},false);
 H.btn(brow,(sys.heat?'●':'○')+' Aquecedor',()=>{sys.heat=!sys.heat;H.sfx('tick');status();},false);
 H.btn(brow,(sys.pump?'●':'○')+' Bomba pressão',()=>{sys.pump=!sys.pump;H.sfx('tick');status();},false);
}
function gameOver(win,why){over=true;brow.innerHTML='';
 const sc=win?400:Math.max(20,120-time|0);H.score(sc|0);
H.done(win?{win:true,score:sc|0,title:'Turno completo!',sub:'Base estável por 120s!'}:{win:false,score:sc|0,title:'Base perdida!',sub:why});}
H.every(500,()=>{
 if(over)return;
 time-=.5;
 o2+=(sys.o2&&power>0?4:-5)*.5;
 power+=((sys.o2?3:0)+(sys.heat?2:0)+(sys.pump?4:0)>0?-((sys.o2?3:0)+(sys.heat?2:0)+(sys.pump?4:0)):2)*.5;
 power=Math.min(100,power);
 press+=(sys.pump?-8:5+Math.sin(time)*3)*.5;
 press=H.clamp(press,0,100);
 if(!sys.heat)o2-=1;
 status();
 if(o2<=0){gameOver(false,'Sem oxigênio!');return;}
 if(power<=0&&!sys.o2){o2-=2;}
 if(press>=100){gameOver(false,'Pressão máxima — casco rompeu!');return;}
 if(press<=0){gameOver(false,'Pressão zerada!');return;}
 if(time<=0){gameOver(true);return;}
});
status();
}});
