/* ============ quiz.js · 梗力测试页 ============ */
(function(){
  var $=MEME.$,qi=0,score=0,answered=false;
  function quizHome(){qi=0;score=0;renderQ()}
  function renderQ(){
    answered=false;var q=QUIZ[qi];
    $('quizInner').innerHTML=
    '<div class="quiz-top"><span>第 '+(qi+1)+' / '+QUIZ.length+' 题</span><span>梗力检测中…</span></div>'+
    '<div class="quiz-bar"><i style="width:'+(qi/QUIZ.length*100)+'%"></i></div>'+
    '<div class="quiz-q">'+q.q+'</div>'+
    '<div class="quiz-opts" id="quizOpts">'+q.o.map(function(o,i){return '<button class="opt" data-i="'+i+'">'+String.fromCharCode(65+i)+'. '+o+'</button>'}).join('')+'</div>'+
    '<div class="quiz-fact" id="quizFact"></div>'+
    '<button class="btn btn-primary quiz-next" id="quizNext">'+(qi===QUIZ.length-1?'查看称号':'下一题')+'</button>';
  }
  $('quizBox').addEventListener('click',function(e){
    if(e.target.id==='quizRetry'){quizHome();return}
    var b=e.target.closest('.opt');if(!b||answered)return;
    answered=true;var q=QUIZ[qi],pick=+b.dataset.i;
    Array.prototype.forEach.call(document.querySelectorAll('#quizOpts .opt'),function(c,i){
      c.disabled=true;
      if(i===q.a)c.classList.add('correct');
      else if(i===pick)c.classList.add('wrong');
    });
    if(pick===q.a){score++;SFX.sfx('win');MEME.toast('学到了学到了！')}else{SFX.game('bad');MEME.toast('破防了……');}
    $('quizFact').textContent='<b class=\'why\'>为什么：</b>'+q.f;$('quizFact').classList.add('show');
    $('quizNext').classList.add('show');
  });
  document.addEventListener('click',function(e){
    if(e.target.id!=='quizNext')return;
    qi++;
    if(qi<QUIZ.length)renderQ();
    else{var r=RESULTS.find(function(x){return score<=x[0]})||RESULTS[RESULTS.length-1];
      $('quizInner').innerHTML='<div class="quiz-result"><div class="medal">'+r[2]+'</div><h3>'+r[1]+'</h3>'+
      '<p>得分：'+score+' / '+QUIZ.length+'</p><p>'+r[3]+'</p>'+
      '<button class="btn btn-primary" id="quizRetry" style="margin-top:22px">再来一次</button></div>';
      MEME.sfx('end');MEME.burst(0.5,0.4);}
  });
  quizHome();
})();
