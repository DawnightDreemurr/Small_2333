/* ============ sound.js · 全站音效系统 ============
   WebAudio 全合成，零素材依赖；默认静音，localStorage('meme-sound') 记忆开关。
   事件分类：tap=按钮点击 / win=彩蛋·成就 / end=游戏结算 / special=主题·专属音 */
window.SFX=(function(){
  var enabled=false, ctx=null, last=0;
  var SITE={'tap':[['C6',.045,0],['E6',.04,25]],'win':[['C5',.09,0],['E5',.09,70],['G5',.12,140],['C6',.16,210]],'end':[['E5',.12,0],['C5',.14,110],['G4',.2,220]],'special':[['G5',.07,0],['B5',.07,60],['D6',.11,120]]};
  var GAME={'combo':[['D5',.06,0],['F#5',.06,55],['A5',.09,110]],'bad':[['A3',.14,0],['E3',.18,80]],'pop':['sine',175,85,.13,.12],'quack':[['A4',.07,0],['D4',.09,70]]};
  function ensure(){
    try{ctx=ctx||new (window.AudioContext||window.webkitAudioContext)();
      if(ctx.state==='suspended')ctx.resume();
      return true;
    }catch(e){return false}
  }
  function tone(freq,when,dur,type,vol){
    var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime+when;
    o.type=type||'triangle';o.frequency.setValueAtTime(freq,t);
    g.gain.setValueAtTime(vol||.05,t);
    g.gain.exponentialRampToValueAtTime(.0001,t+dur);
    o.connect(g);g.connect(ctx.destination);
    o.start(t);o.stop(t+dur+.02);
  }
  function slide(from,to,dur,vol){
    try{
      var o=ctx.createOscillator(),g=ctx.createGain(),t=ctx.currentTime;
      o.type='sine';o.frequency.setValueAtTime(from,t);
      o.frequency.exponentialRampToValueAtTime(to,t+dur);
      g.gain.setValueAtTime(vol||.1,t);
      g.gain.exponentialRampToValueAtTime(.0001,t+dur);
      o.connect(g);g.connect(ctx.destination);o.start(t);o.stop(t+dur+.02);
    }catch(e){}
  }
  function play(name,vol){
    if(!enabled||!ensure())return;
    var now=Date.now();
    if(now-last<40)return;
    last=now;
    var seq=SITE[name];
    if(seq)seq.forEach(function(s,i){tone(noteHz(s[0]),s[2]/1000,s[1],name==='tap'?'square':'triangle',(vol||1)*(name==='tap'?.05:.07))});
    else if(name==='pop')slide(175,85,.13,.11);
    else if(name==='quack'){tone(440,0,.07,'square',.06);tone(294,.07,.09,'square',.06)}
    else if(GAME[name])GAME[name].forEach(function(s,i){tone(noteHz(s[0]),s[2]/1000,s[1],'triangle',.07)});
  }
  function noteHz(n){
    var NOTES={C3:130.81,E3:164.81,G3:196,B3:246.94,A3:220,D4:293.66,E4:329.63,G4:392,A4:440,B4:493.88,C5:523.25,D5:587.33,E5:659.25,Fs5:739.99,G5:783.99,A5:880,B5:987.77,C6:1046.5,D6:1174.7};
    return NOTES[n]||440;
  }
  /* ---- 一键开启：导航栏扬声器按钮 ---- */
  function init(){
    try{enabled=localStorage.getItem('meme-sound')==='on'}catch(e){}
    bindGlobal();
    function mount(){
      var btn=document.createElement('button');
      btn.className='icon-btn';btn.id='soundBtn';btn.title='音效开关（当前'+(enabled?'已开启':'静音')+'）';
      btn.setAttribute('aria-label','音效开关');btn.setAttribute('aria-pressed',enabled?'true':'false');
      btn.innerHTML='<i data-lucide="'+(enabled?'volume-2':'volume-x')+'"></i>';
      var sr=$('soundBtn');
      if(sr)sr.replaceWith(btn);
      else{var tr=document.querySelector('#topbar .top-right');if(tr)tr.insertBefore(btn,tr.firstChild)}
      btn.addEventListener('click',function(){
        enabled=!enabled;
        try{localStorage.setItem('meme-sound',enabled?'on':'off')}catch(e){}
        this.innerHTML='<i data-lucide="'+(enabled?'volume-2':'volume-x')+'"></i>';MEME.icons();
        this.setAttribute('aria-pressed',enabled?'true':'false');
        if(enabled){ensure();play('special');MEME.toast('🔊 音效已开启（再点一次静音）')}
        else MEME.toast('🔇 已静音');
      });
      MEME.icons();
    }
    mount();
  }
  /* ---- 全局自动接线：按钮/链接点击 → tap 音 ---- */
  function bindGlobal(){
    document.addEventListener('pointerdown',function(e){
      if(!enabled)return;
      var el=e.target.closest('button,a,.chip,.mem-cell,.sl-btn,#fleeBtn,.rps-btns button,.hole,.opt');
      if(el&&!el.closest('#soundBtn'))play('tap');
      var btn=e.target.closest('#soundBtn');
      if(btn)play('special');
    },true);
  }
  /* ---- 便捷 API：site 事件 / 游戏事件 ---- */
  function sfx(name,vol){play(name,vol)}
  function game(name){
    if(!enabled||!ensure())return;
    var now=Date.now();
    if(now-last<40)return;
    last=now;
    if(name==='pop')slide(175,85,.13,.11);
    else if(name==='quack'){tone(440,0,.07,'square',.06);tone(294,.07,.09,'square',.06)}
    else if(GAME[name])GAME[name].forEach(function(s,i){tone(noteHz(s[0]),s[2]/1000,s[1],'triangle',.07)});
  }
  return {init:init,sfx:sfx,game:game,get enabled(){return enabled}};
})();

if(window.MEME&&document.body)SFX.init();else document.addEventListener("DOMContentLoaded",function(){SFX.init()});
