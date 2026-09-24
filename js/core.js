/* ============ core.js · 全站壳层：CDN 库注入 / 壳层 UI / 光标 / 磁吸 / 彩蛋 ============
   Design Language: Pop Editorial —— 本文件负责所有页面的共享骨架 */
window.MEME=(function(){
  var PAGES=[
    {id:'home',href:'index.html',icon:'tv',label:'首页'},
    {id:'dict',href:'dict.html',icon:'book-open',label:'梗词典'},
    {id:'rank',href:'rank.html',icon:'flame',label:'梗热榜'},
    {id:'classroom',href:'classroom.html',icon:'graduation-cap',label:'弹幕教室'},
    {id:'quotes',href:'quotes.html',icon:'clapperboard',label:'名场面'},
    {id:'history',href:'history.html',icon:'landmark',label:'编年史'},
    {id:'factory',href:'factory.html',icon:'factory',label:'梗图工厂'},
    {id:'quiz',href:'quiz.html',icon:'flask-conical',label:'梗力测试'},
    {id:'playground',href:'playground.html',icon:'gamepad-2',label:'游乐场'},
    {id:'arcade',href:'arcade.html',icon:'joystick',label:'梗游厅'},
    {id:'philosophy',href:'philosophy.html',icon:'dumbbell',label:'哲♂学厅'},
    {id:'sanlian',href:'sanlian.html',icon:'coins',label:'三连现场'}
  ];
  var page=document.body.dataset.page||'home';
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var AUTO=!!(navigator.webdriver);           /* 无头/合成渲染环境：跳过所有时序动画 */
  var FINE=window.matchMedia&&matchMedia('(hover:hover) and (pointer:fine)').matches;
  function $(id){return document.getElementById(id)}
  function qs(name){var m=location.search.match(new RegExp('[?&]'+name+'=([^&]+)'));return m?decodeURIComponent(m[1].replace(/\+/g,' ')):''}
  function toast(msg){
    var box=$('toasts');if(!box)return;
    var t=document.createElement('div');t.className='toast';t.textContent=msg;box.appendChild(t);
    setTimeout(function(){t.classList.add('out');setTimeout(function(){t.remove()},350)},2600);
  }
  function burst(x,y){
    x=x||0.5;y=y||0.4;
    if(window.confetti){confetti({particleCount:130,spread:78,origin:{x:x,y:y},zIndex:1200});return}
    var c=document.createElement('canvas');c.style.cssText='position:fixed;inset:0;pointer-events:none;z-index:1200';document.body.appendChild(c);
    var fx=c.getContext('2d');c.width=innerWidth;c.height=innerHeight;
    var cols=['#F25D8E','#00A1D6','#FFC533','#2AC864'];
    var ps=[];for(var i=0;i<90;i++)ps.push({x:innerWidth*x,y:innerHeight*y,vx:(Math.random()-.5)*12,vy:Math.random()*-11-3,r:3+Math.random()*5,col:cols[Math.floor(Math.random()*4)],a:1,rot:Math.random()*6});
    (function f(){fx.clearRect(0,0,c.width,c.height);var alive=false;
      ps.forEach(function(p){p.vy+=0.32;p.x+=p.vx;p.y+=p.vy;p.a-=0.011;p.rot+=0.15;
        if(p.a>0){alive=true;fx.save();fx.globalAlpha=p.a;fx.translate(p.x,p.y);fx.rotate(p.rot);fx.fillStyle=p.col;fx.fillRect(-p.r,-p.r/2,p.r*2,p.r);fx.restore()}});
      if(alive)requestAnimationFrame(f);else c.remove()})();
  }
  /* ---- Lucide 图标：渲染 + 动态内容自动刷新 ---- */
  function refreshIcons(){
    if(window.lucide&&document.querySelector('[data-lucide]')){try{lucide.createIcons()}catch(e){}}
  }
  function watchIcons(){
    if(!window.MutationObserver)return;
    var t=null;
    new MutationObserver(function(){
      clearTimeout(t);t=setTimeout(function(){
        if(document.querySelector('[data-lucide]'))refreshIcons(); /* 无待渲染图标时零开销 */
      },200);
    }).observe(document.body,{childList:true,subtree:true});
  }
  /* ---- CDN 动态注入（lucide / gsap+ScrollTrigger / lenis） ---- */
  function loadLib(src,cb){
    var s=document.createElement('script');s.src=src;s.onload=cb;s.onerror=cb;document.head.appendChild(s);
  }
  function loadLibs(){
    var chain=[['https://unpkg.com/lucide@0.469.0/dist/umd/lucide.min.js',function(){refreshIcons();watchIcons()}],
               ['https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/gsap.min.js',null],
               ['https://cdn.jsdelivr.net/npm/gsap@3.12.5/dist/ScrollTrigger.min.js',function(){if(window.gsap)gsap.registerPlugin(ScrollTrigger)}],
               ['https://cdn.jsdelivr.net/npm/lenis@1.1.18/dist/lenis.min.js',function(){initLenis()}]];
    (function next(i){if(i>=chain.length){afterLibs();return}
      loadLib(chain[i][0],function(){var cb=chain[i][1];if(cb)cb();next(i+1)});
    })(0);
  }
  function initLenis(){
    if(RM||AUTO||!window.Lenis)return;
    try{var lenis=new Lenis({duration:1.1,smoothWheel:true});
      document.documentElement.style.scrollBehavior='auto'; /* 双重平滑会互相拉扯导致滚轮卡顿 */
      function raf(t){lenis.raf(t);requestAnimationFrame(raf)}requestAnimationFrame(raf);
    }catch(e){}
  }
  function afterLibs(){heroIntro()}
  /* ---- 首屏进入动画（GSAP；无头环境跳过，内容永远可见） ---- */
  function heroIntro(){
    if(!window.gsap||RM||AUTO)return;
    try{
      var els=document.querySelectorAll('.hero-badges .hbadge,.hero-title,.hero-sub,.hero-ctas,.dm-send,.hero-stats');
      if(els.length)gsap.from(els,{y:34,opacity:0,duration:.7,stagger:.09,ease:'power3.out',clearProps:'all'});
    }catch(e){}
  }
  var stormHook=null;
  /* ---- 头部 ---- */
  function renderHeader(){
    var nav=PAGES.map(function(p){return '<a href="'+p.href+'"'+(p.id===page?' class="on"':'')+'><i data-lucide="'+p.icon+'"></i>'+p.label+'</a>'}).join('');
    var mh=PAGES.map(function(p){return '<a href="'+p.href+'"><i data-lucide="'+p.icon+'"></i>'+p.label+'</a>'}).join('');
    var hd=document.createElement('div');hd.id='topbar';
    hd.innerHTML='<div class="container row">'+
      '<a class="logo" href="index.html" id="logo" title="连点三下有惊喜"><span class="tvbox">2333</span><span><b>小破站梗文化博物馆</b><span class="sub">非官方 · 纯整活</span></span></a>'+
      '<nav id="topnav" aria-label="主导航">'+nav+'</nav>'+
      '<div class="top-right">'+
        '<form class="searchbox" id="topSearchForm"><i data-lucide="search"></i><input id="topSearch" type="search" placeholder="搜个梗试试，比如「真香」" aria-label="搜索梗"><span class="hint">/</span></form>'+
        '<button class="icon-btn" id="themeBtn" title="切换深色模式" aria-label="切换深色模式"><i data-lucide="moon"></i></button>'+
        '<a class="btn btn-primary btn-sm" href="sanlian.html"><i data-lucide="coins"></i>一键三连</a>'+
        '<button class="icon-btn" id="hamburger" aria-label="打开菜单" aria-expanded="false"><i data-lucide="menu"></i></button>'+
      '</div></div><div id="mobileMenu">'+mh+'</div>';
    document.body.insertBefore(hd,document.body.firstChild);
    $('themeBtn').addEventListener('click',function(){
      var next=document.documentElement.dataset.theme==='dark'?'light':'dark';
      try{localStorage.setItem('meme-theme',next)}catch(e){}
      applyTheme(next,true);  /* 手动选择：写入存储并广播 */
    });
    $('hamburger').addEventListener('click',function(){
      var m=$('mobileMenu'),open=m.classList.toggle('open');
      this.setAttribute('aria-expanded',open?'true':'false');
      this.innerHTML='<i data-lucide="'+(open?'x':'menu')+'"></i>';refreshIcons();
    });
    $('topSearchForm').addEventListener('submit',function(e){
      e.preventDefault();var v=$('topSearch').value.trim();
      if(!v){toast('搜点什么吧，比如「真香」');return}
      if(window.DICT_HOOK){window.DICT_HOOK(v);return}
      location.href='dict.html?q='+encodeURIComponent(v);
    });
    var clicks=0,ct=null;
    $('logo').addEventListener('click',function(){
      clicks++;clearTimeout(ct);ct=setTimeout(function(){clicks=0},900);
      if(clicks>=3){clicks=0;
        document.body.classList.remove('wobble');void document.body.offsetWidth;document.body.classList.add('wobble');
        if(stormHook)stormHook('小破站冲鸭');
        toast('🔨 彩蛋：小电视被拍了三下，弹幕沸腾了');burst(0.15,0.08);
      }
    });
  }
  /* ---- 楼层导航 / 移动端快捷栏 ---- */
  function renderFloors(){
    var f=document.createElement('nav');f.id='floors';f.setAttribute('aria-label','页面导航');
    f.innerHTML=PAGES.map(function(p){return '<a href="'+p.href+'"'+(p.id===page?' class="on"':'')+'><span>'+p.label+'</span><i class="dot"></i></a>'}).join('');
    document.body.appendChild(f);
    var b=document.createElement('nav');b.id='bottomnav';b.setAttribute('aria-label','快捷导航');
    b.innerHTML='<div class="inner">'+PAGES.map(function(p){return '<a href="'+p.href+'"'+(p.id===page?' class="on"':'')+'><i data-lucide="'+p.icon+'"></i>'+p.label+'</a>'}).join('')+'</div>';
    document.body.appendChild(b);
  }
  /* ---- 页脚 ---- */
  function renderFooter(){
    var ft=document.createElement('footer');
    ft.innerHTML='<div class="container"><div class="foot-grid">'+
      '<div><h4>关于本馆</h4><p>小破站梗文化博物馆是一座纯粉丝向的互联网快乐收藏馆，与 B 站官方无关。所有梗均为网友集体创作；出处如有出入，欢迎弹幕指正（下次一定改）。设计语言：Pop Editorial，由弹幕、贴纸与硬阴影构成。</p></div>'+
      '<div><h4>展厅速览</h4><ul>'+PAGES.map(function(p){return '<li><a href="'+p.href+'"><i data-lucide="'+p.icon+'"></i>'+p.label+'</a></li>'}).join('')+'</ul></div>'+
      '<div><h4>彩蛋提示</h4><ul><li>在键盘上输入 2333 试试</li><li>连点左上角小电视三下</li><li>切走标签页再回来看看标题</li><li>游乐场里藏着一只「下次一定」</li></ul></div>'+
      '</div><div class="foot-bottom"><span>© 2026 小破站梗文化博物馆 · 由一键三连与人类高质量弹幕驱动</span><span>梗备案号：2333-33-2333 · 建议佩戴快乐食用</span></div></div>';
    document.body.appendChild(ft);
  }
  /* ---- 顶部滚动进度条 ---- */
  function renderProgress(){
    var p=document.createElement('div');p.id='progress';document.body.appendChild(p);
    var tick=false;
    window.addEventListener('scroll',function(){
      if(tick)return;tick=true;
      requestAnimationFrame(function(){
        var h=document.documentElement;
        p.style.width=(h.scrollTop/Math.max(1,h.scrollHeight-h.clientHeight)*100)+'%';
        tick=false;
      });
    },{passive:true});
  }
  /* ---- 自定义光标 + 磁吸按钮（桌面 / 非降级环境） ---- */
  function initCursorMagnet(){
    if(!FINE||RM||AUTO)return;
    var cur=document.createElement('div');cur.id='cursor';document.body.appendChild(cur);
    var tx=innerWidth/2,ty=innerHeight/2,cx=tx,cy=ty;
    document.addEventListener('pointermove',function(e){tx=e.clientX;ty=e.clientY});
    (function loop(){
      cx+=(tx-cx)*0.22;cy+=(ty-cy)*0.22;
      if(Math.abs(tx-cx)>.05||Math.abs(ty-cy)>.05)cur.style.left=cx+'px',cur.style.top=cy+'px';
      requestAnimationFrame(loop)})();
    document.addEventListener('pointerover',function(e){
      cur.classList.toggle('hot',!!e.target.closest('a,button,.flip,.mem-cell,input,select,textarea,[role="button"]'));
    });
    document.querySelectorAll('.btn').forEach(function(b){
      b.addEventListener('pointermove',function(e){
        var r=b.getBoundingClientRect();
        b.style.transform='translate('+((e.clientX-r.left)/r.width-.5)*8+'px,'+((e.clientY-r.top)/r.height-.5)*8+'px)';
      });
      b.addEventListener('pointerleave',function(){b.style.transform=''});
    });
  }
  /* ---- 主题：?theme= 参数 > 本地存储 > 系统偏好；未手动选择时跟随系统实时切换 ---- */
  var themeCbs=[];
  function applyTheme(t,notify){
    document.documentElement.dataset.theme=t;
    var mc=document.querySelector('meta[name="theme-color"]');
    if(mc)mc.content=(t==='dark'?'#141419':'#FAF6EF');
    syncThemeBtn();
    if(notify)themeCbs.forEach(function(cb){try{cb(t)}catch(e){}});
  }
  function initTheme(){
    var m=location.search.match(/[?&]theme=(light|dark)/);
    if(m){try{localStorage.setItem('meme-theme',m[1])}catch(e){}applyTheme(m[1],false);return}
    var saved=null;try{saved=localStorage.getItem('meme-theme')}catch(e){}
    if(saved){applyTheme(saved,false);return}
    var sys=window.matchMedia?matchMedia('(prefers-color-scheme: dark)'):null;
    if(sys&&sys.matches)applyTheme('dark',false);
    if(sys&&sys.addEventListener&&!saved){  /* 用户未表态时跟随系统 */
      sys.addEventListener('change',function(e){
        var has=null;try{has=localStorage.getItem('meme-theme')}catch(err){}
        if(!has)applyTheme(e.matches?'dark':'light',true);
      });
    }
  }
  function syncThemeBtn(){var b=$('themeBtn');if(b){b.innerHTML='<i data-lucide="'+(document.documentElement.dataset.theme==='dark'?'sun':'moon')+'"></i>';refreshIcons()}}
  /* ---- 加载彩蛋 ---- */
  function runLoader(){
    var l=$('loader');if(!l)return;
    if(AUTO||location.search.indexOf('noloader')>-1){l.classList.add('done');return}
    var pcur=PAGES.filter(function(p){return p.id===page})[0]||PAGES[0];
    var msgs=['正在唤醒小电视…','正在布置「'+pcur.label+'」展厅…','假装卡住：99%…','100%！下次一定'];
    var i=0,bar=$('loadBar'),msg=$('loadMsg');
    var t=setInterval(function(){i++;
      if(i<msgs.length-1){if(msg)msg.textContent=msgs[i];if(bar)bar.style.width=(i/(msgs.length-1)*94+2)+'%'}
      else{if(msg)msg.textContent=msgs[msgs.length-1];if(bar)bar.style.width='100%';clearInterval(t);
        setTimeout(function(){l.classList.add('done')},300)}
    },240);
    setTimeout(function(){l.classList.add('done')},2400);
  }
  /* ---- 彩蛋 ---- */
  function initEggs(){
    var buf='';
    document.addEventListener('keydown',function(e){
      if(e.key==='/'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){e.preventDefault();var s=$('topSearch');if(s)s.focus();return}
      buf=(buf+(e.key||'')).slice(-4);
      if(buf==='2333'){if(stormHook)stormHook('23333');burst(0.5,0.3);toast('检测到高阶冲浪选手，弹幕雨已装填 🌧️');buf=''}
    });
    var baseTitle=document.title;
    document.addEventListener('visibilitychange',function(){
      if(document.hidden)document.title='╭(°A°,)╮ 三连还没给呢！';
      else{document.title='欢迎回来！下次一定？';setTimeout(function(){document.title=baseTitle},2000)}
    });
  }
  /* ---- 启动 ---- */
  renderHeader();initTheme();runLoader();renderFloors();renderFooter();renderProgress();initEggs();initCursorMagnet();
  loadLibs();syncThemeBtn();
  return {
    page:page,PAGES:PAGES,$:$,toast:toast,burst:burst,qs:qs,icons:refreshIcons,
    setStorm:function(fn){stormHook=fn},storm:function(w){if(stormHook)stormHook(w)},
    onThemeChange:function(cb){themeCbs.push(cb)},
    theme:function(){return document.documentElement.dataset.theme||'light'}
  };
})();
