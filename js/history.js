/* ============ history.js · 编年史滚动长卷增强（内容为构建期静态 HTML，JS 仅增强） ============ */
(function(){
  var $=MEME.$;
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var stl=$('stl'),fill=$('stlFill'),tv=$('stlTv'),chapNav=$('stlChapters');
  var eraEls=[1,2,3,4].map(function(i){return document.getElementById('e'+i)});
  var navAs=chapNav.querySelectorAll('a');
  function onScroll(){
    var vh=window.innerHeight;
    var r=stl.getBoundingClientRect();
    var p=Math.max(0,Math.min(1,(vh*0.55-r.top)/r.height));
    fill.style.height=(p*100)+'%';tv.style.top=(p*100)+'%';
    var cur=0;
    for(var i=0;i<4;i++){var el=eraEls[i];if(el&&el.getBoundingClientRect().top<vh*0.55)cur=i}
    navAs.forEach(function(a,i){a.classList.toggle('on',i===cur)});
  }
  var tick=false;
  function onScrollT(){if(tick)return;tick=true;requestAnimationFrame(function(){onScroll();tick=false})}
  window.addEventListener('scroll',onScrollT,{passive:true});
  window.addEventListener('resize',function(){onScrollT()});
  onScroll();
  function animCount(el){
    if(RM||!window.IntersectionObserver)return;
    var n=+el.dataset.n,suf=el.dataset.suf||'',t0=null;
    requestAnimationFrame(function a(ts){
      if(t0===null)t0=ts;
      var p=Math.min(1,(ts-t0)/700);p=1-Math.pow(1-p,3);
      el.textContent=Math.round(n*p)+suf;
      if(p<1)requestAnimationFrame(a);else el.textContent=n+suf;
    });
  }
  if(window.IntersectionObserver){
    var sio=new IntersectionObserver(function(es){
      es.forEach(function(en){if(en.isIntersecting){animCount(en.target);sio.unobserve(en.target)}});
    },{threshold:0.5});
    document.querySelectorAll('#stlStats b').forEach(function(b){sio.observe(b)});
  }
  function submit2026(){
    var v=$('y2026Input').value.trim();
    if(!v){MEME.toast('先写一个梗，再挑战官方收录');return}
    var s=document.createElement('span');s.className='newchip';s.textContent=v.slice(0,14);
    $('y2026Chips').appendChild(s);$('y2026Input').value='';
    SFX.sfx('win');MEME.burst(0.5,0.45);MEME.toast('恭喜！你的梗已编入《2026 梗编年史》');
  }
  $('y2026Add').addEventListener('click',submit2026);
  $('y2026Input').addEventListener('keydown',function(e){if(e.key==='Enter')submit2026()});
})();
