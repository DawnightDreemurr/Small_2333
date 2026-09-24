/* ============ rank.js · 梗热榜页 ============ */
(function(){
  var $=MEME.$;
  $('rankList').innerHTML=RANKS.map(function(r,i){
    return '<div class="rank-row"><div class="rank-no r'+(i+1)+'">'+(i+1)+'</div>'+
    '<div class="info"><b>'+r.n+'</b><span class="cat">'+r.c+'</span></div>'+
    '<div class="rank-heat"><b class="heat-num" data-v="'+r.h+'">'+r.h.toFixed(1)+'万</b>'+
    '<span class="trend '+(r.d>0?'up':'down')+'">'+(r.d>0?'▲':'▼')+' '+Math.abs(r.d).toFixed(1)+'</span></div></div>';
  }).join('');
  setInterval(function(){
    document.querySelectorAll('.heat-num').forEach(function(el){
      var v=parseFloat(el.dataset.v)+Math.random()*0.6-0.25;
      v=Math.max(88,Math.min(99.9,v));el.dataset.v=v;el.textContent=v.toFixed(1)+'万';
    });
  },2200);
  var ni=0;
  $('noteNext').addEventListener('click',function(){ni=(ni+1)%NOTES.length;$('panelNote').textContent=NOTES[ni]});
  setInterval(function(){ni=(ni+1)%NOTES.length;$('panelNote').textContent=NOTES[ni]},9000);
  setInterval(function(){
    var d=new Date(),p=function(n){return String(n).padStart(2,'0')};
    $('memeClock').textContent='梗圈标准时间 '+p(d.getHours())+':'+p(d.getMinutes())+':'+p(d.getSeconds());
  },1000);
})();
