/* ============ fx.js · 全站动感层 ============
   滚动渐入 / 卡片 3D 倾斜 / 按钮波纹 / 页面擦除转场 / Konami / 发呆提醒
   全部尊重 prefers-reduced-motion；无头环境(webdriver)自动跳过动画（内容恒可见） */
(function(){
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AUTO=!!(navigator.webdriver);
  var FINE=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  var RUN=!RM&&!AUTO;
  var $=function(id){return document.getElementById(id)};
  /* ---------- 1. 滚动渐入（IO 驱动，批内交错） ---------- */
  var RV_SEL='.mcard,.dir-card,.vcard,.class-card,.vocab-card,.creed,.game-frame,.widget,.arcade-links a,.rank-row,.flip,.quiz-box,.sanlian-wrap,.philo-origin,.conv-box';
  function initReveal(){
    if(!RUN||!window.IntersectionObserver)return;
    document.documentElement.classList.add('fx-armed');
    var els=Array.prototype.slice.call(document.querySelectorAll(RV_SEL));
    var io=new IntersectionObserver(function(es){
      es.forEach(function(en){
        if(!en.isIntersecting)return;
        en.target.classList.add('fx-in');
        io.unobserve(en.target);
        /* 渐入完成后摘除专用类与 inline delay，把 transform 过渡还给组件（hover 立即响应） */
        setTimeout(function(){en.target.classList.remove('fx-rv');en.target.style.transitionDelay=''},700);
      });
    },{rootMargin:'0px 0px -8% 0px',threshold:0.08});
    els.forEach(function(el,i){
      el.classList.add('fx-rv');
      el.style.transitionDelay=(i%6)*60+'ms';
      io.observe(el);
    });
  }
  /* ---------- 2. 卡片 3D 倾斜跟随（桌面） ---------- */
  var TILT_SEL='.mcard,.vcard,.dir-card,.widget,.vocab-card';
  function initTilt(){
    if(!FINE||!RUN)return;
    document.querySelectorAll(TILT_SEL).forEach(function(card){
      var raf=null;
      card.addEventListener('pointermove',function(e){
        if(raf)return;
        raf=requestAnimationFrame(function(){
          raf=null;
          var r=card.getBoundingClientRect();
          if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)return;
          var dx=(e.clientX-r.left)/r.width-.5, dy=(e.clientY-r.top)/r.height-.5;
          card.style.transform='perspective(700px) rotateX('+(-dy*7).toFixed(2)+'deg) rotateY('+(dx*7).toFixed(2)+'deg) translate(-3px,-3px)';
        });
      });
      card.addEventListener('pointerleave',function(){
        if(raf){cancelAnimationFrame(raf);raf=null}
        card.style.transform='';
      });
    });
  }
  /* ---------- 3. 按钮波纹（Pop 墨圈） ---------- */
  function initRipple(){
    if(!RUN)return;
    document.addEventListener('pointerdown',function(e){
      var b=e.target.closest('.btn,.chip,.sl-btn,.opt,.icon-btn,#cpsBtn,#bottleBtn,#dbBtn');
      if(!b)return;
      var r=b.getBoundingClientRect(),d=Math.max(r.width,r.height)*1.6;
      var s=document.createElement('span');
      s.className='fx-ripple';
      s.style.cssText='width:'+d+'px;height:'+d+'px;left:'+(e.clientX-r.left-d/2)+'px;top:'+(e.clientY-r.top-d/2)+'px;';
      if(getComputedStyle(b).position==='static')b.style.position='relative';
      if(getComputedStyle(b).overflow!=='hidden')b.style.overflow='hidden';
      b.appendChild(s);
      setTimeout(function(){s.remove()},480);
    },true);
  }
  /* ---------- 4. 页面擦除转场（站内链接） ---------- */
  function initWipe(){
    if(!RUN)return;
    var w=document.createElement('div');w.className='fx-wipe';document.body.appendChild(w);
    document.addEventListener('click',function(e){
      if(e.defaultPrevented||e.button!==0||e.metaKey||e.ctrlKey||e.shiftKey||e.altKey)return;
      var a=e.target.closest('a[href]');
      if(!a||a.target==='_blank'||a.hasAttribute('download'))return;
      var href=a.getAttribute('href');
      if(!href||href.charAt(0)==='#'||/^https?:/i.test(href)||/^(mailto|tel):/i.test(href))return;
      if(a.closest('#soundBtn,#themeBtn'))return;
      e.preventDefault();
      w.classList.add('go');
      setTimeout(function(){location.href=href},240);
    },true);
    window.addEventListener('pageshow',function(){w.classList.remove('go')});
  }
  /* ---------- 5. Konami 彩蛋 ---------- */
  function initKonami(){
    var buf='';
    document.addEventListener('keydown',function(e){
      buf=(buf+e.key).slice(-20);
      if(buf==='ArrowUpArrowUpArrowDownArrowDownArrowLeftArrowRightArrowLeftArrowRightba'){
        buf='';
        document.body.classList.remove('wobble');void document.body.offsetWidth;document.body.classList.add('wobble');
        if(window.MEME){MEME.storm('上上下下左右左右BA');MEME.burst(0.5,0.35);MEME.toast('🎮 秘技发动！30 条命已到账（精神上的）')}
      }
    });
  }
  /* ---------- 6. 发呆提醒（40s 无操作） ---------- */
  function initIdle(){
    var t=null;
    function reset(){
      clearTimeout(t);
      t=setTimeout(function(){
        if(window.MEME)MEME.toast('🛋️ 馆长巡查：别装死，「有精神」！');
      },40000);
    }
    ['pointermove','keydown','scroll','pointerdown'].forEach(function(ev){
      window.addEventListener(ev,function(){reset()},{passive:true});
    });
    reset();
  }
  /* ---------- 7. 跑马灯随滚动方向转向 ---------- */
  function initMarquee(){
    var tr=document.querySelector('.marquee-track');
    if(!tr||!RUN)return;
    var lastY=window.scrollY,tick=false;
    window.addEventListener('scroll',function(){
      if(tick)return;tick=true;
      requestAnimationFrame(function(){
        var y=window.scrollY;
        if(Math.abs(y-lastY)>=4){tr.style.animationDirection=y>lastY?'normal':'reverse';lastY=y}
        tick=false;
      });
    },{passive:true});
  }
  /* ---------- 8. 顶栏滚动投影 ---------- */
  function initTopShadow(){
    var bar=document.getElementById('topbar');
    if(!bar)return;
    window.addEventListener('scroll',function(){
      bar.classList.toggle('scrolled',window.scrollY>10);
    },{passive:true});
  }
  /* ---------- 9. 哲♂学厅光标拖尾 ---------- */
  function initTrail(){
    if(!FINE||!RUN)return;
    if(!/philosophy/.test((document.body.dataset.page||'')))return;
    var last=0;
    document.addEventListener('pointermove',function(e){
      var now=Date.now();
      if(now-last<90)return;
      last=now;
      var s=document.createElement('span');
      s.className='fx-trail';
      s.textContent=Math.random()<.5?'♂':'💪';
      s.style.left=e.clientX+'px';s.style.top=e.clientY+'px';
      document.body.appendChild(s);
      setTimeout(function(){s.remove()},900);
    });
  }
  /* ---------- 启动 ---------- */
  function boot(){
    initReveal();initTilt();initRipple();initWipe();initKonami();initIdle();initMarquee();initTopShadow();initTrail();
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',boot);
  else boot();
})();
