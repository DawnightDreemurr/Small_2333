/* ============ danmaku.js · 首页弹幕引擎（Canvas，纸底用深色墨字） ============ */
(function(){
  var cv=document.getElementById('heroCanvas');if(!cv)return;
  var ctx=cv.getContext('2d'),HW=0,HH=0,heroVisible=true,bullets=[];
  var RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var COLORS=['#17171A','#F25D8E','#00A1D6','#D98E00','#1B8A4B'];
  function size(){var dpr=Math.min(window.devicePixelRatio||1,2);HW=cv.clientWidth;HH=cv.clientHeight;cv.width=HW*dpr;cv.height=HH*dpr;ctx.setTransform(dpr,0,0,dpr,0,0)}
  function makeB(recycle,mini){
    return {x:recycle?Math.random()*HW:HW+30,y:24+Math.random()*Math.max(60,HH-48),
      t:DM_WORDS[Math.floor(Math.random()*DM_WORDS.length)],
      s:mini?12+Math.random()*10:14+Math.random()*16,
      v:(0.5+Math.random()*1.2)*(mini?2.4:1),
      c:COLORS[Math.floor(Math.random()*COLORS.length)],
      rec:!!recycle,a:mini?1:0.5+Math.random()*0.5};
  }
  function init(){bullets=[];var n=Math.max(12,Math.min(30,Math.floor(HW/58)));for(var i=0;i<n;i++)bullets.push(makeB(true))}
  function tick(){
    if(!heroVisible||document.hidden){requestAnimationFrame(tick);return}
    ctx.clearRect(0,0,HW,HH);ctx.textBaseline='middle';
    for(var i=0;i<bullets.length;i++){var b=bullets[i];b.x-=b.v;
      ctx.font='700 '+b.s+'px "Noto Sans SC",sans-serif';ctx.globalAlpha=b.a;ctx.fillStyle=b.c;
      ctx.fillText(b.t,b.x,b.y);
      if(b.x+ctx.measureText(b.t).width<-14){if(b.rec)Object.assign(b,makeB(true));else bullets.splice(i--,1)}
    }
    ctx.globalAlpha=1;requestAnimationFrame(tick);
  }
  function staticD(){ctx.clearRect(0,0,HW,HH);ctx.textBaseline='middle';ctx.font='700 18px "Noto Sans SC",sans-serif';ctx.fillStyle='#F25D8E';DM_WORDS.slice(0,6).forEach(function(t,i){ctx.fillText(t,24+i*150,44+(i%2)*30)})}
  function fire(text){
    var b=makeB(false);b.t=text;b.s=26;b.c='#F25D8E';b.v=1.7;b.a=1;b.y=HH*0.15+Math.random()*HH*0.6;
    bullets.push(b);
    var nonRec=bullets.filter(function(x){return !x.rec});
    if(nonRec.length>6)bullets.splice(bullets.indexOf(nonRec[0]),1);
    var dm=document.getElementById('statDm');
    if(dm)dm.textContent=(parseInt(dm.textContent.replace(/,/g,''),10)+1).toLocaleString();
  }
  function storm(word){for(var i=0;i<26;i++){var b=makeB(false,true);b.t=word;bullets.push(b)}}
  MEME.setStorm(storm);
  size();init();
  new IntersectionObserver(function(es){heroVisible=es[0].isIntersecting},{threshold:0}).observe(document.getElementById('top'));
  window.addEventListener('resize',function(){size();if(RM)staticD();else init()});
  if(RM)staticD();else requestAnimationFrame(tick);
  window.HERO_FIRE=fire;
})();
