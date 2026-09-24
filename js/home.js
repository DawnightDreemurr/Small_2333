/* ============ home.js · 首页专属 ============ */
(function(){
  var $=MEME.$;
  $('dmSend').addEventListener('click',function(){
    var inp=$('dmInput'),v=inp.value.trim();
    if(!v){MEME.toast('空弹幕会掉下来的，写点啥吧');return}
    if(window.HERO_FIRE)HERO_FIRE(v);
    inp.value='';MEME.toast('弹幕已起飞 🚀');
  });
  $('dmInput').addEventListener('keydown',function(e){if(e.key==='Enter')$('dmSend').click()});
  $('marqueeTrack').innerHTML=(MQ.map(function(t){return '<span>'+t+' ✦</span>'}).join('')).repeat(2);
  $('vstrip').innerHTML=VIDEOS.map(function(v){
    return '<button class="vcard" data-t="'+v.t+'"><div class="vthumb" style="background:'+v.g+'"><div class="play">▶</div><span class="dur">'+v.d+'</span></div><div class="vmeta"><h3>'+v.t+'</h3><div class="row"><span>UP：'+v.u+'</span><span>'+v.p+' 播放</span></div></div></button>';
  }).join('');
  $('vstrip').addEventListener('click',function(e){var c=e.target.closest('.vcard');if(c)MEME.toast('该视频将在你三连后上线（骗你的，下次一定）')});
  $('dictPreview').innerHTML=MEMES.slice(0,6).map(window.memeCardHTML).join('');
  var DIR_DESC={dict:'43 条梗收录在册，可搜索可筛选',rank:'热榜实时跳动（玄学数据）',classroom:'弹幕礼仪六门必修课',quotes:'12 张名场面翻牌卡',history:'2009 → 2026 滚动动画长卷',arcade:'五大名场面游戏：翻瓶/肘击/节奏/木鱼/分贝',philosophy:'♂ 使用指南与精神图腾',factory:'在线梗图生成器，可下载',quiz:'八题定段位，梗王中王',playground:'八个互动小玩意儿一次玩个够',sanlian:'充电桩已就位，还有逃亡彩蛋'};
  $('dirGrid').innerHTML=MEME.PAGES.filter(function(p){return p.id!=='home'}).map(function(p){
    return '<a class="dir-card" href="'+p.href+'"><i data-lucide="'+p.icon+'"></i><b>'+p.label+'</b><span>'+DIR_DESC[p.id]+'</span><span class="go">进入展厅 →</span></a>';
  }).join('');
  MEME.icons();
  window.DICT_HOOK=function(q){location.href='dict.html?q='+encodeURIComponent(q)};
  setInterval(function(){$('statConc').textContent=(96+Math.random()*3.9).toFixed(1)+'%'},2600);
})();
