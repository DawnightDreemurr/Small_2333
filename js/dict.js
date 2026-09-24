/* ============ dict.js · 梗词典页 ============ */
(function(){
  var $=MEME.$,CATS=['全部'].concat(Array.from(new Set(MEMES.map(function(m){return m.c}))));
  var curCat='全部',curQ='';
  function renderChips(){
    $('catChips').innerHTML=CATS.map(function(c){
      var n=c==='全部'?MEMES.length:MEMES.filter(function(m){return m.c===c}).length;
      return '<button class="chip'+(c===curCat?' on':'')+'" data-cat="'+c+'">'+c+' <b>'+n+'</b></button>';
    }).join('');
  }
  function renderDict(){
    var q=curQ.toLowerCase();
    var list=MEMES.filter(function(m){
      var okQ=!q||m.n.toLowerCase().indexOf(q)>-1||m.d.indexOf(curQ)>-1||m.e.indexOf(curQ)>-1;
      return (curCat==='全部'||m.c===curCat)&&okQ;
    });
    $('dictCount').textContent='共 '+list.length+' 条';
    $('dictGrid').innerHTML=list.length?list.map(window.memeCardHTML).join(''):'<div class="dict-empty"><div class="big">🐣</div><p>一个梗都没搜到……要不试试「2333」？</p></div>';
  }
  $('catChips').addEventListener('click',function(e){
    var c=e.target.closest('.chip');if(!c)return;
    curCat=c.dataset.cat;renderChips();renderDict();
  });
  $('dictSearch').addEventListener('input',function(){curQ=this.value.trim();renderDict()});
  $('randomMemeBtn').addEventListener('click',function(){
    var m=MEMES[Math.floor(Math.random()*MEMES.length)];
    curQ='';curCat=m.c;$('dictSearch').value='';renderChips();renderDict();
    setTimeout(function(){
      var card=document.querySelector('.mcard[data-n="'+m.n+'"]');
      if(card){card.classList.add('flash');card.scrollIntoView({behavior:'smooth',block:'center'})}
    },120);
    MEME.toast('命运选中：「'+m.n+'」');
  });
  window.DICT_HOOK=function(q){curQ=q;curCat='全部';renderChips();renderDict();document.getElementById('dictGrid').scrollIntoView({behavior:'smooth'});MEME.toast('全网检索完毕，共 '+MEMES.filter(function(m){return m.n.indexOf(q)>-1||m.d.indexOf(q)>-1||m.e.indexOf(q)>-1}).length+' 条命中')};
  var q0=MEME.qs('q');
  if(q0){curQ=q0;$('dictSearch').value=q0}
  renderChips();renderDict();
})();
