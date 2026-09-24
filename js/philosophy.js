/* ============ philosophy.js · 哲♂学厅：转换器 / 词汇表 ============ */
(function(){
  var $=MEME.$;
  var mode='full';
  var KEYWORDS=['精神','兄弟','上班','上课','干饭','考研','坚持','努力','加油','冲','变强','健身','早八','下班'];
  function toFull(s){return s.split('').join('♂')}
  function toHalf(s){
    var out='',i=0;
    while(i<s.length){out+=s.slice(i,i+2);if(i+2<s.length)out+='♂';i+=2}
    return out;
  }
  function toKey(s){
    var hit={};
    KEYWORDS.forEach(function(k){var idx=s.indexOf(k);while(idx>-1){hit[idx+k.length-1]=1;idx=s.indexOf(k,idx+1)}});
    var out='';
    for(var i=0;i<s.length;i++){out+=s[i];if(hit[i]&&i<s.length-1)out+='♂'}
    return out;
  }
  function render(){
    var v=$('convIn').value.trim();
    if(!v){$('convOut').innerHTML='<span style="color:var(--ink-soft);font-size:15px;font-family:var(--body)">转换结果会出现在这里……</span>';return}
    var r=mode==='full'?toFull(v):mode==='half'?toHalf(v):toKey(v);
    $('convOut').innerHTML=r.replace(/♂/g,'<b>♂</b>');
  }
  $('convModes').addEventListener('click',function(e){
    var c=e.target.closest('.chip');if(!c)return;
    mode=c.dataset.m;
    document.querySelectorAll('#convModes .chip').forEach(function(x){x.classList.toggle('on',x===c)});
    render();
  });
  $('convIn').addEventListener('input',render);
  document.querySelectorAll('.conv-samples .chip').forEach(function(b){
    b.addEventListener('click',function(){$('convIn').value=b.dataset.s;render()});
  });
  $('convCopy').addEventListener('click',function(){
    var v=$('convIn').value.trim();
    if(!v){MEME.toast('先写点东西再庄严化');return}
    var r=$('convOut').textContent;
    (navigator.clipboard?navigator.clipboard.writeText(r):Promise.reject()).then(function(){MEME.toast('已复制，去弹幕区庄严一下吧 ♂')})
    .catch(function(){
      var ta=document.createElement('textarea');ta.value=r;document.body.appendChild(ta);ta.select();
      try{document.execCommand('copy');MEME.toast('已复制，去弹幕区庄严一下吧 ♂')}catch(e){MEME.toast('复制失败，请手动选择')}
      ta.remove();
    });
  });
  $('convClear').addEventListener('click',function(){$('convIn').value='';render()});
  $('vocabGrid').innerHTML=PHILO.map(function(p){
    return '<div class="vocab-card"><b>'+p.t.replace(/♂/g,'<i class="mp">♂</i>')+'</b><p>'+p.d+'</p></div>';
  }).join('');
  MEME.icons();
  render();
})();
