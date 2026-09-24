/* ============ classroom.js · 弹幕教室页 ============ */
(function(){
  var $=MEME.$;
  $('classGrid').innerHTML=CLASSROOM.map(function(c,i){
    return '<div class="class-card" data-no="0'+(i+1)+'"><div class="ico">'+c.e+'</div><h3>'+c.t+'<small>'+c.s+'</small></h3><p>'+c.d+'</p>'+
    (c.p?'<div class="pbar"><span>00:00</span><i></i><b>01:23 空降 ✓</b></div>':'<div class="years"><span>老观众认证</span><span>礼仪必修</span></div>')+'</div>';
  }).join('');
})();
