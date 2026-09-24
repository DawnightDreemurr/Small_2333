/* ============ playground.js · 游乐场：8 个互动小玩意儿 ============ */
(function(){
  var $=MEME.$;
  /* ---- 1 今日梗运势 ---- */
  var GRADS=['linear-gradient(140deg,#8E8EF7,#FB7299)','linear-gradient(140deg,#00A1D6,#2AC864)','linear-gradient(140deg,#FFB027,#F25D8E)','linear-gradient(140deg,#F25D8E,#FFB027)'];
  var d0=new Date();
  var seed=d0.getFullYear()*10000+(d0.getMonth()+1)*100+d0.getDate();
  function srand(s){var x=Math.sin(s)*10000;return x-Math.floor(x)}
  var fIdx=Math.floor(srand(seed)*FORTUNES.length);
  var dstr=d0.getFullYear()+' 年 '+(d0.getMonth()+1)+' 月 '+d0.getDate()+' 日';
  function showF(i){var f=FORTUNES[i];
    $('fortuneCard').style.background=GRADS[i%GRADS.length];
    $('fLv').textContent=f.ico+' '+f.lv;
    $('fMsg').textContent=f.msg;
    $('fMeta').textContent=dstr+' · '+f.tip;
  }
  showF(fIdx);
  $('fRedraw').addEventListener('click',function(){
    fIdx=Math.floor(Math.random()*FORTUNES.length);showF(fIdx);
    MEME.burst(0.5,0.45);MEME.toast('重抽成功，硬币 -1（假的）');
  });
  /* ---- 2 记忆翻牌 ---- */
  var mFirst=null,mLock=false,mMoves=0,mDone=0,mT0=0,mTimer=null;
  function memBuild(){
    var cells=MEMORY_EMO.concat(MEMORY_EMO.slice());
    for(var i=cells.length-1;i>0;i--){var j=Math.floor(Math.random()*(i+1)),t=cells[i];cells[i]=cells[j];cells[j]=t}
    $('memGrid').innerHTML=cells.map(function(e){return '<button class="mem-cell" data-e="'+e+'">❓</button>'}).join('');
    mFirst=null;mLock=false;mMoves=0;mDone=0;$('memMoves').textContent='0';
    $('memTime').textContent='0s';clearInterval(mTimer);mT0=0;
    $('memStat').textContent='翻出全部 8 对即通关！';
  }
  $('memGrid').addEventListener('click',function(e){
    var c=e.target.closest('.mem-cell');
    if(!c||mLock||c.classList.contains('open')||c.classList.contains('done'))return;
    if(!mT0){mT0=Date.now();mTimer=setInterval(function(){$('memTime').textContent=Math.floor((Date.now()-mT0)/1000)+'s'},500)}
    c.classList.add('open');c.textContent=c.dataset.e;
    if(!mFirst){mFirst=c;return}
    mMoves++;$('memMoves').textContent=String(mMoves);mLock=true;
    var a=mFirst,b=c;mFirst=null;
    if(a.dataset.e===b.dataset.e){
      a.classList.add('done');b.classList.add('done');mDone++;mLock=false;
      if(mDone===MEMORY_EMO.length){
        clearInterval(mTimer);
        var sec=Math.floor((Date.now()-mT0)/1000);
        $('memStat').textContent='🎉 通关！'+mMoves+' 步 / '+sec+' 秒（梗力过人）';
        MEME.burst(0.5,0.5);
      }
    }else{
      setTimeout(function(){a.classList.remove('open');b.classList.remove('open');a.textContent='❓';b.textContent='❓';mLock=false},650);
    }
  });
  $('memRestart').addEventListener('click',function(){memBuild();MEME.toast('牌桌已重洗')});
  memBuild();
  /* ---- 3 手速大作战 ---- */
  var cpsRun=false,cpsCount=0,cpsT=null,cpsBest=0;
  var CPS_RANKS=[[9,'⚡ 手速惊人 · 梗圈闪电侠'],[7,'🔥 肝帝预备役'],[5,'👍 手速在线'],[3,'🐢 普通选手'],[0,'🗣️ 弹幕都替你着急']];
  try{cpsBest=+(localStorage.getItem('meme-cps-best')||0)}catch(e){}
  $('cpsBest').textContent=cpsBest?cpsBest.toFixed(1):'—';
  $('cpsBtn').addEventListener('click',function(){
    if(cpsRun){cpsCount++;this.textContent='点！×'+cpsCount;return}
    cpsRun=true;cpsCount=1;this.classList.add('hot');this.textContent='点！×1';
    var t0=Date.now(),btn=this;
    cpsT=setInterval(function(){
      var left=10-(Date.now()-t0)/1000;
      $('cpsBar').style.width=Math.max(0,left*10)+'%';
      if(left<=0){clearInterval(cpsT);cpsRun=false;
        var cps=cpsCount/10,rank='';
        for(var i=0;i<CPS_RANKS.length;i++){if(cps>=CPS_RANKS[i][0]){rank=CPS_RANKS[i][1];break}}
        $('cpsRank').textContent=rank;
        if(cps>cpsBest){cpsBest=cps;try{localStorage.setItem('meme-cps-best',String(cps))}catch(e){}}
        $('cpsBest').textContent=cpsBest.toFixed(1);
        btn.classList.remove('hot');btn.textContent='再来一轮';
        $('cpsBar').style.width='0%';
        if(cps>=8)MEME.burst(0.5,0.5);
        MEME.toast(cps.toFixed(1)+' 点/秒 · '+rank);
      }
    },100);
  });
  /* ---- 4 三连大作战（街机） ---- */
  var gCv=$('gameCanvas'),g=gCv.getContext('2d'),GW=460,GH=520;
  var gRun=false,gScore=0,gLeft=30,gItems=[],gPX=GW/2,gLast=0,gSpawn=0,gBest=0;
  var GOOD=[['🪙',10],['👍',10],['⭐',15]],BAD=['🕊️','😴'];
  try{gBest=+(localStorage.getItem('meme-game-best')||0)}catch(e){}
  $('gBest').textContent=String(gBest);
  function gDraw(){
    g.clearRect(0,0,GW,GH);g.textAlign='center';g.textBaseline='middle';
    g.font='38px serif';
    gItems.forEach(function(it){g.fillText(it.e,it.x,it.y)});
    g.font='42px serif';g.fillText('📺',gPX,486);
    if(!gRun&&gLeft<=0){
      g.fillStyle='rgba(242,93,142,.92)';
      g.font='900 34px "ZCOOL KuaiLe","Microsoft YaHei",sans-serif';
      g.fillText('时间到！得分 '+gScore,GW/2,GH/2);
      g.font='16px "Noto Sans SC",sans-serif';g.fillStyle='#71747F';
      g.fillText('点「再来一局」继续三连',GW/2,GH/2+40);
    }
  }
  function gLoop(ts){
    if(!gRun)return;
    if(!gLast)gLast=ts;
    var dt=Math.min(0.05,(ts-gLast)/1000);gLast=ts;
    gLeft-=dt;gSpawn-=dt;
    if(gSpawn<=0){gSpawn=0.35+Math.random()*0.4;
      if(Math.random()<0.75){var pk=GOOD[Math.floor(Math.random()*GOOD.length)];
        gItems.push({x:30+Math.random()*(GW-60),y:30,e:pk[0],v:130+Math.random()*120,pts:pk[1]})}
      else gItems.push({x:30+Math.random()*(GW-60),y:30,e:BAD[Math.floor(Math.random()*BAD.length)],v:130+Math.random()*140,pts:-20});
    }
    for(var i=0;i<gItems.length;i++){var it=gItems[i];it.y+=it.v*dt;
      if(it.y>450&&it.y<505&&Math.abs(it.x-gPX)<34){
        gScore=Math.max(0,gScore+it.pts);gItems.splice(i--,1);continue}
      if(it.y>GH+20)gItems.splice(i--,1);
    }
    $('gScore').textContent=String(gScore);
    $('gTime').textContent=Math.max(0,Math.ceil(gLeft))+'s';
    gDraw();
    if(gLeft<=0){gRun=false;
      if(gScore>gBest){gBest=gScore;try{localStorage.setItem('meme-game-best',String(gBest))}catch(e){}}
      $('gBest').textContent=String(gBest);
      $('gStart').disabled=false;$('gStart').textContent='再来一局';
      if(gScore>=150)MEME.burst(0.5,0.5);
      MEME.toast(gScore>=150?'三连神教认证！':'别灰心，鸽神今天庇佑的不是你');
      return;
    }
    requestAnimationFrame(gLoop);
  }
  $('gStart').addEventListener('click',function(){
    gRun=true;gScore=0;gLeft=30;gItems=[];gSpawn=0;gLast=0;
    this.disabled=true;this.textContent='三连中…';gDraw();
    requestAnimationFrame(gLoop);
  });
  function setPX(clientX){
    var r=gCv.getBoundingClientRect();
    gPX=Math.max(24,Math.min(GW-24,(clientX-r.left)/r.width*GW));
  }
  gCv.addEventListener('pointermove',function(e){setPX(e.clientX)});
  gCv.addEventListener('touchmove',function(e){e.preventDefault();setPX(e.touches[0].clientX)},{passive:false});
  gDraw();
  /* ---- 5 猜拳大战 ---- */
  var rpsWin=0,rpsLose=0,rpsDraw=0,rpsStreak=0,HANDS=['✊','✋','✌️'];
  $('rpsBtns').addEventListener('click',function(e){
    var b=e.target.closest('button');if(!b)return;
    var mine=+b.dataset.h,tv=Math.floor(Math.random()*3);
    var myEl=$('rpsMyHand'),tvEl=$('rpsTvHand');
    myEl.textContent=HANDS[mine];tvEl.textContent='📺';
    tvEl.classList.remove('shake');void tvEl.offsetWidth;tvEl.classList.add('shake');
    setTimeout(function(){
      tvEl.textContent=HANDS[tv];
      var r=(mine-tv+3)%3,res=$('rpsResult');
      if(r===1){rpsWin++;rpsStreak++;res.textContent='🎉 你赢了！';res.style.color='var(--green)';
        if(rpsStreak===3){MEME.burst(0.5,0.5);MEME.toast('三连胜！小电视申请 rematch')}}
      else if(r===2){rpsLose++;rpsStreak=0;res.textContent='😭 输了……';res.style.color='#e5484d'}
      else{rpsDraw++;res.textContent='🤝 平局，心有灵犀';res.style.color='var(--blue)'}
      $('rpsScore').textContent='胜 '+rpsWin+' · 负 '+rpsLose+' · 平 '+rpsDraw;
      if(Math.random()<0.5)MEME.toast(RPS_TAUNTS[Math.floor(Math.random()*RPS_TAUNTS.length)]);
    },350);
  });
  /* ---- 6 梗浓度检测仪 ---- */
  $('densGo').addEventListener('click',function(){
    var t=$('densText').value;
    if(!t.trim()){MEME.toast('先写点什么，哪怕一句「真香」');return}
    var hits=[],score=0;
    DENS_KEYS.forEach(function(k){var c=t.split(k).length-1;if(c>0){score+=6*Math.min(3,c);hits.push(k)}});
    score+=Math.min(30,t.length/10);
    score+=Math.min(10,(t.match(/哈/g)||[]).length*2);
    score+=Math.min(9,(t.match(/[！!？?]/g)||[]).length*3);
    score=Math.max(0,Math.min(100,Math.round(score)));
    $('densGaugeI').style.width=score+'%';
    var v;
    if(score>=90){v='🏆 梗浓度超标！建议立即进馆办展';MEME.burst(0.5,0.5)}
    else if(score>=70)v='🔥 高浓度冲浪选手，实锤了';
    else if(score>=50)v='😎 中度玩梗，梗力健康';
    else if(score>=30)v='🙂 轻度冲浪，仍有巨大潜力';
    else v='🐣 几乎无梗，建议全文背诵弹幕教室';
    $('densVerdict').textContent=v+'（'+score+' / 100）';
    $('densReport').classList.add('show');
    $('densReport').innerHTML='检出热梗关键词 <b>'+hits.length+'</b> 个'+(hits.length?'：'+hits.slice(0,8).join('、')+(hits.length>8?'…':''):'（纯天然无公害文本）')+'；文本长度 '+t.length+' 字；综合判定浓度 <b>'+score+'</b> / 100。本报告由玄学谱仪出具，仅供整活。';
  });
  /* ---- 7 梗命转盘 ---- */
  var wCv=$('wheelCv'),w=wCv.getContext('2d');
  var WITEMS=MEMES.slice(0,10);
  var WCOLS=['#FB7299','#00A1D6','#FFB027','#2AC864','#F25D8E','#7CC4FF','#FFC85C','#67E08C','#FF9AB0','#4FB3E8'];
  var wRot=0,wSpin=false;
  function wDraw(){
    var n=WITEMS.length,A=Math.PI*2/n,cx=160,cy=160,R=150;
    w.clearRect(0,0,320,320);
    for(var i=0;i<n;i++){
      w.beginPath();w.moveTo(cx,cy);w.arc(cx,cy,R,i*A+wRot,(i+1)*A+wRot);w.closePath();
      w.fillStyle=WCOLS[i%WCOLS.length];w.fill();
      w.save();w.translate(cx,cy);w.rotate(i*A+A/2+wRot);
      w.fillStyle='#fff';w.font='700 13px "Noto Sans SC",sans-serif';w.textAlign='right';w.textBaseline='middle';
      var nm=WITEMS[i].n;if(nm.length>6)nm=nm.slice(0,6);
      w.fillText(nm,R-12,0);w.restore();
    }
    w.beginPath();w.arc(cx,cy,26,0,7);w.fillStyle='#fff';w.fill();
    w.fillStyle='#F25D8E';w.font='700 12px sans-serif';w.textAlign='center';w.textBaseline='middle';w.fillText('GO',cx,cy+1);
    w.beginPath();w.moveTo(cx-12,4);w.lineTo(cx+12,4);w.lineTo(cx,30);w.closePath();w.fillStyle='#1B1D24';w.fill();
  }
  wDraw();
  $('wheelGo').addEventListener('click',function(){
    if(wSpin)return;wSpin=true;
    var start=wRot,target=start+Math.PI*2*(5+Math.random()*3),t0=null;
    $('wheelResult').textContent='转动中……命运的车轮没有刹车';
    requestAnimationFrame(function anim(ts){
      if(t0===null)t0=ts;
      var p=Math.min(1,(ts-t0)/4000);p=1-Math.pow(1-p,3);
      wRot=start+(target-start)*p;wDraw();
      if(p<1)requestAnimationFrame(anim);
      else{wSpin=false;
        var n=WITEMS.length,A=Math.PI*2/n;
        var ang=(-Math.PI/2-wRot)%(Math.PI*2);if(ang<0)ang+=Math.PI*2;
        var m=WITEMS[Math.floor(ang/A)%n];
        $('wheelResult').innerHTML='<b>🎉 命运梗选中你：'+m.n+'</b><br>'+m.d+'<br>弹幕示范：「'+m.e+'」';
        MEME.burst(0.5,0.5);
      }
    });
  });
  /* ---- 8 梗码工坊 ---- */
  function qrMake(){
    var v=$('qrText').value.trim()||location.href,box=$('qrBox');
    box.innerHTML='';
    if(!window.QRCode){box.innerHTML='<p class="w-note">二维码库没加载出来（需要联网加载 CDN），文字请先进收藏夹。</p>';return}
    try{new QRCode(box,{text:v,width:160,height:160,colorDark:'#F25D8E',colorLight:'#ffffff',correctLevel:QRCode.CorrectLevel.M})}
    catch(e){box.innerHTML='<p class="w-note">生成失败，换个短点的文字试试。</p>'}
  }
  $('qrGen').addEventListener('click',qrMake);
  $('qrSite').addEventListener('click',function(){$('qrText').value=location.href;qrMake()});
  $('qrDown').addEventListener('click',function(){
    var c=$('qrBox').querySelector('canvas');
    if(!c){MEME.toast('先生成一个二维码');return}
    var a=document.createElement('a');a.download='梗码.png';a.href=c.toDataURL('image/png');a.click();
    MEME.toast('梗码已出货 📱');
  });
  if(window.QRCode)qrMake();
})();
