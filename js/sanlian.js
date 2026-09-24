/* ============ sanlian.js · 三连现场页（数字本地保存） ============ */
(function(){
  var $=MEME.$;
  function load(k,d){try{var v=localStorage.getItem(k);return v===null?d:+v}catch(e){return d}}
  function save(k,v){try{localStorage.setItem(k,String(v))}catch(e){}}
  var like=load('sl-like',233),coin=load('sl-coin',999),star=load('sl-star',666);
  var slHit={l:false,c:false,s:false},slDone=false;
  function refresh(){$('likeN').textContent=like.toLocaleString();$('coinN').textContent=coin.toLocaleString();$('starN').textContent=star.toLocaleString()}
  function bump(btn,nEl,v){nEl.textContent=v.toLocaleString();btn.classList.remove('bump');void btn.offsetWidth;btn.classList.add('bump')}
  function checkSL(){
    if(!slDone&&slHit.l&&slHit.c&&slHit.s){slDone=true;SFX.sfx('win');MEME.burst(0.5,0.55);MEME.toast('三连达成！UP 主今晚加鸡腿 🍗')}
  }
  $('likeBtn').addEventListener('click',function(){slHit.l=true;like++;save('sl-like',like);bump(this,$('likeN'),like);checkSL()});
  $('starBtn').addEventListener('click',function(){slHit.s=true;star++;save('sl-star',star);bump(this,$('starN'),star);checkSL()});
  var coinTimer=null,longed=false;
  $('coinBtn').addEventListener('pointerdown',function(){
    longed=false;coinTimer=setTimeout(function(){
      longed=true;slHit.c=true;coin+=2;save('sl-coin',coin);bump($('coinBtn'),$('coinN'),coin);
      MEME.toast('长按投币 ×2，大气！');MEME.burst(0.5,0.55);checkSL();
    },480);
  });
  ['pointerup','pointerleave','pointercancel'].forEach(function(ev){
    $('coinBtn').addEventListener(ev,function(){
      clearTimeout(coinTimer);
      if(!longed){longed=true;slHit.c=true;coin++;save('sl-coin',coin);bump($('coinBtn'),$('coinN'),coin);checkSL()}
    });
  });
  var dodges=0,EXC=['下次一定','一定一定！','下次是哪次？','了下个下次！','好吧，你是真的大佬…'];
  function moveFlee(){
    var z=$('fleeZone'),b=$('fleeBtn');
    b.style.left=(Math.random()*Math.max(10,z.clientWidth-b.offsetWidth-10))+'px';
    b.style.top=(Math.random()*Math.max(10,z.clientHeight-b.offsetHeight-10))+'px';
    b.style.transform='none';
  }
  $('fleeBtn').addEventListener('pointerenter',function(e){
    if(e.pointerType!=='mouse')return; /* 触屏由 pointerdown 统一处理，避免双计数 */
    if(dodges<5){dodges++;this.textContent=EXC[Math.min(dodges-1,EXC.length-1)];moveFlee()}
  });
  $('fleeBtn').addEventListener('pointerdown',function(e){
    if(e.pointerType==='touch'&&dodges<5){dodges++;this.textContent=EXC[Math.min(dodges-1,EXC.length-1)];moveFlee();MEME.toast('下次一定～')}
  });
  $('fleeBtn').addEventListener('click',function(){
    if(dodges>=5){
      this.textContent='服了，替你三连！';this.classList.add('surrender');
      like+=9;coin+=9;star+=9;save('sl-like',like);save('sl-coin',coin);save('sl-star',star);refresh();
      SFX.sfx('win');MEME.burst(0.5,0.5);MEME.toast('感谢施舍！下次记得一定！');
    }
  });
  refresh();
})();
