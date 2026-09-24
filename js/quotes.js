/* ============ quotes.js · 名场面翻牌页 ============ */
(function(){
  var $=MEME.$;
  $('quoteGrid').innerHTML=QUOTES.map(function(q){
    return '<div class="flip" tabindex="0" role="button" aria-label="点击翻牌看出处"><div class="flip-inner">'+
    '<div class="face front"><div class="q">「'+q.q+'」</div><div class="tip">👆 点我翻牌</div></div>'+
    '<div class="face back"><span class="yr">'+q.yr+' 年</span><div class="src">'+q.src+'</div><p>'+q.note+'</p></div></div></div>';
  }).join('');
  document.querySelectorAll('.flip').forEach(function(f){
    f.addEventListener('click',function(){f.classList.toggle('on')});
    f.addEventListener('keydown',function(e){if(e.key==='Enter'||e.key===' '){e.preventDefault();f.classList.toggle('on')}});
  });
})();
