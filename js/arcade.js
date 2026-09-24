/* ============ arcade.js · 梗游厅：翻瓶 / 肘击 / 节奏 ============ */
(function(){
  var $=MEME.$,RM=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  function ls(k){try{return localStorage.getItem(k)}catch(e){return null}}
  function sv(k,v){try{localStorage.setItem(k,String(v))}catch(e){}}
  /* ================= GAME 1 冰红茶 · 翻瓶挑战 ================= */
  (function(){
    var cv=$('bottleCv'),g=cv.getContext('2d'),W=560,H=360;
    var ground=H-46, run=false, power=0, charging=false;
    var b={x:W/2,y:ground,v:0,vy:0,ang:0,spin:0,fly:false};
    var TC={},bottleDirty=true;
    function refreshTC(){
      var cs=getComputedStyle(document.documentElement);
      TC.ink=(cs.getPropertyValue('--ink')||'#17171A').trim();
      TC.paper=(cs.getPropertyValue('--paper')||'#FAF6EF').trim();
      bottleDirty=true;
    }
    refreshTC();
    if(window.MEME)MEME.onThemeChange(function(){refreshTC()});
    var ok=0,combo=0,best=+(ls('meme-bottle-best')||0),tryN=0;
    $('bottleBest').textContent=String(best);
    var LOGS_OK=['冰力十足！完美落罐！','这瓶有讲究，稳！','空气突然安静：全场最稳。','瓶：你练过？','两圈半，艺术！'],
        LOGS_BAD=['瓶：下次一定站稳','地板：我的了','这口奶没 GP，重来','差一点点，再来！'];
    function log(s){$('bottleLog').textContent=s}
    function sizeCv(){var w=cv.clientWidth,dpr=Math.min(window.devicePixelRatio||1,2);cv.width=W*dpr;cv.height=H*dpr;g.setTransform(dpr*W/560,0,0,dpr*W/560,0,0)}
    function drawBottle(){
      g.save();g.translate(b.x,b.y);g.rotate(b.ang);
      g.lineWidth=2.5;g.strokeStyle=TC.ink;
      g.fillStyle='#D9822B';
      g.beginPath();
      g.moveTo(-14,46);g.lineTo(-14,-28);g.lineTo(-6,-44);g.lineTo(6,-44);g.lineTo(14,-28);g.lineTo(14,46);
      g.closePath();g.fill();g.stroke();
      g.fillStyle='#E03A2F';g.fillRect(-7,-56,14,13);g.strokeRect(-7,-56,14,13);
      g.fillStyle='#FFF6E8';g.fillRect(-14,-12,28,26);g.strokeRect(-14,-12,28,26);
      g.fillStyle=TC.ink;g.font='700 11px "Noto Sans SC",sans-serif';g.textAlign='center';g.textBaseline='middle';
      g.fillText('冰红茶',0,1);
      g.fillStyle='rgba(255,255,255,.35)';g.fillRect(-10,-40,5,80);
      g.restore();
      g.fillStyle=TC.ink;g.globalAlpha=.16;g.beginPath();g.ellipse(b.x,ground+42,30*Math.max(.3,1-(ground-b.y)/300),7,0,0,7);g.fill();g.globalAlpha=1;
    }
    function draw(){
      g.clearRect(0,0,W,H);
      g.strokeStyle=TC.ink;g.lineWidth=3;
      g.beginPath();g.moveTo(0,ground+52);g.lineTo(W,ground+52);g.stroke();
      g.fillStyle=TC.paper;g.globalAlpha=.5;g.fillRect(0,ground+52,W,H);g.globalAlpha=1;
      drawBottle();
      if(charging){
        g.fillStyle=TC.ink;g.font='800 13px "Noto Sans SC",sans-serif';g.textAlign='left';
        g.fillText('蓄力 '+Math.round(power*100)+'%',14,24);
      }
    }
    function reset(){b.x=W/2+Math.random()*60-30;b.y=ground;b.ang=0;b.spin=0;b.fly=false}
    function launch(){
      b.fly=true;b.vy=-(560+power*720);b.spin=(3.2+power*6.4)*(Math.PI/180);
      tryN++;$('bottleTry').textContent=String(tryN);
    }
    function land(){
      var deg=((b.ang*180/Math.PI)%360+360)%360;
      var off=Math.min(deg,360-deg);
      if(off<30){
        ok++;combo++;if(combo>best){best=combo;sv('meme-bottle-best',best)}
        $('bottleOK').textContent=String(ok);$('bottleCombo').textContent=String(combo);$('bottleBest').textContent=String(best);
        var msg=combo>=3?'三连翻！'+LOGS_OK[0]:LOGS_OK[Math.floor(Math.random()*LOGS_OK.length)];
        log(msg);SFX.game('combo');MEME.toast(combo>=3?'🔥 连击 x'+combo+'！'+msg:msg);
        if(combo>=3)MEME.burst(0.5,0.6);
        b.ang=0;
      }else{
        combo=0;$('bottleCombo').textContent='0';
        log(LOGS_BAD[Math.floor(Math.random()*LOGS_BAD.length)]);SFX.game('bad');
        b.ang=off<180?deg*Math.PI/180:(deg-360)*Math.PI/180;
      }
      b.y=ground;b.vy=0;b.spin=0;b.fly=false;bottleDirty=true;
      b.x=W/2+Math.random()*60-30;
    }
    var t0=0;
    function tick(ts){
      var dt=Math.min(.04,(ts-(t0||ts))/1000);t0=ts;
      if(charging&&power<1)power=Math.min(1,power+dt*0.85);
      $('bottlePower').style.width=(power*100)+'%';
      if(b.fly){
        b.vy+=1500*dt;b.y+=b.vy*dt;b.ang+=b.spin*dt*60;
        if(b.y>=ground)land();
      }
      if(!charging&&!b.fly&&!bottleDirty){requestAnimationFrame(tick);return}
      bottleDirty=false;
      draw();requestAnimationFrame(tick);
    }
    function startCharge(e){if(b.fly)return;e.preventDefault();charging=true;power=0}
    function endCharge(){if(!charging)return;charging=false;window.__bottleBusy=false;if(!b.fly)launch()}
    var btn=$('bottleBtn');
    btn.addEventListener('pointerdown',startCharge);
    ['pointerup','pointerleave','pointercancel'].forEach(function(ev){btn.addEventListener(ev,endCharge)});
    document.addEventListener('keydown',function(e){
      if(e.code==='Space'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)){
        e.preventDefault();if(!charging&&!b.fly){charging=true;power=0;window.__bottleBusy=true}
      }
    });
    document.addEventListener('keyup',function(e){if(e.code==='Space')endCharge()});
    window.addEventListener('blur',endCharge); /* 切走时释放可能卡住的空格蓄力 */
    window.addEventListener('resize',sizeCv);
    sizeCv();requestAnimationFrame(tick);
  })();
  /* ================= GAME 2 牢大 · 肘击靶场 ================= */
  (function(){
    var TYPES=[
      {e:'🏀',pts:10,p:.30,taunt:'Man!'},
      {e:'🥤',pts:15,p:.22,taunt:'冰力十足！'},
      {e:'🐔',pts:20,p:.18,taunt:'小黑子露出鸡脚了吧'},
      {e:'⏰',pts:25,p:.14,taunt:'你见过凌晨四点的洛杉矶吗'},
      {e:'📄',pts:-15,p:.16,taunt:'律师函肘不得！',bad:true}
    ];
    var score=0,best=+(ls('meme-elbow-best')||0),time=30,timer=null,spawner=null,run=false;
    $('elbowBest').textContent=String(best);
    var holes=[];
    (function build(){
      var box=$('elbowHoles');
      for(var i=0;i<6;i++){
        var h=document.createElement('div');h.className='hole';
        h.innerHTML='<span class="mole"></span><span class="fx"></span>';
        box.appendChild(h);holes.push(h);
        h.addEventListener('pointerdown',onHit(h));
      }
    })();
    function pick(){var r=Math.random(),acc=0;for(var i=0;i<TYPES.length;i++){acc+=TYPES[i].p;if(r<acc)return TYPES[i]}return TYPES[0]}
    function onHit(h){
      return function(){
        if(!run||!h.classList.contains('up'))return;
        var t=TYPES[+h.dataset.t],fx=h.querySelector('.fx'),mole=h.querySelector('.mole');
        h.classList.remove('up');h.classList.remove('hit');void h.offsetWidth;h.classList.add('hit');
        fx.textContent=(t.pts>0?'+':'')+t.pts;
        score+=t.pts;$('elbowScore').textContent=String(score);SFX.game(t.pts>0?(t.pts>=20?'combo':'quack'):'bad');
        if(t.bad){MEME.toast(t.taunt+' '+t.pts+' 分');setTimeout(function(){h.classList.remove('hit')},450)}
        else{
          setTimeout(function(){h.classList.remove('hit')},450);
          if(Math.random()<.4)MEME.toast(t.taunt);
        }
      };
    }
    function spawn(){
      if(!run)return;
      var free=holes.filter(function(h){return !h.classList.contains('up')});
      if(free.length){
        var h=free[Math.floor(Math.random()*free.length)];
        var t=pick();h.dataset.t=TYPES.indexOf(t);
        h.querySelector('.mole').textContent=t.bad?'📄':t.e;
        h.classList.add('up');
        var stay=Math.max(520,1050-time*14);
        setTimeout(function(){h.classList.remove('up')},stay);
      }
      spawner=setTimeout(spawn,Math.max(300,720-time*12)+Math.random()*260);
    }
    function startElbow(){
      if(run)return;run=true;score=0;time=30;
      $('elbowScore').textContent='0';$('elbowTime').textContent='30s';
      $('elbowOver').style.display='none';
      spawn();
      timer=setInterval(function(){
        time--;$('elbowTime').textContent=time+'s';
        if(time<=0){
          run=false;clearInterval(timer);clearTimeout(spawner);
          holes.forEach(function(h){h.classList.remove('up')});
          if(score>best){best=score;sv('meme-elbow-best',best);$('elbowBest').textContent=String(best)}
          var rank=score>=600?'🏆 肘击宗师':score>=400?'🔥 肘力惊人':score>=200?'👍 有点东西':'🌱 刚上岗';
          $('elbowOver').innerHTML='<div class="big">时间到！</div><div class="sub">本局得分 <b style="color:var(--gold);font-size:20px">'+score+'</b> · '+rank+'</div>'+
          '<div class="sub">「'+(score>=400?'Man! What can I say?':'下次一定肘得更准')+'」</div>'+
          '<button class="btn btn-primary" id="elbowStart"><i data-lucide="play"></i>再肘一局</button>';
          $('elbowOver').style.display='flex';MEME.icons();SFX.sfx('end');
          if(score>=400)MEME.burst(0.5,0.5);
        }
      },1000);
    }
    $('elbowOver').addEventListener('click',function(e){
      if(e.target.closest('#elbowStart'))startElbow();
    });
  })();
  /* ================= GAME 3 鸡你太美 · 节奏现场 ================= */
  (function(){
    var LANES=[
      {key:'d',label:'唱',icon:'🎤',c:'#F25D8E'},
      {key:'f',label:'跳',icon:'🕺',c:'#00A1D6'},
      {key:'j',label:'Rap',icon:'🎙️',c:'#FFC533'},
      {key:'k',label:'篮球',icon:'🏀',c:'#2AC864'}
    ];
    var wrap=$('rzLanes'),notes=[],run=false,score=0,combo=0,maxCombo=0,hits=0,misses=0;
    var laneEls=[],raf=null,beatT=null,beatMs=560,elapsed=0,last=0,dur=32000,muted=false,AC=null;
    LANES.forEach(function(l,i){
      var d=document.createElement('div');d.className='rz-lane';d.dataset.lane=i;
      d.innerHTML='<span class="lane-tag">'+l.label+'</span><div class="zone">'+l.icon+'</div><span class="key">'+l.key.toUpperCase()+'</span>';
      wrap.appendChild(d);laneEls.push(d);
    });
    function beep(f,dur,type){
      if(muted)return;
      try{
        AC=AC||new (window.AudioContext||window.webkitAudioContext)();
        var o=AC.createOscillator(),gn=AC.createGain();
        o.type=type||'square';o.frequency.value=f;
        gn.gain.setValueAtTime(.06,AC.currentTime);
        gn.gain.exponentialRampToValueAtTime(.001,AC.currentTime+(dur||.09));
        o.connect(gn);gn.connect(AC.destination);o.start();o.stop(AC.currentTime+(dur||.09));
      }catch(e){}
    }
    $('rzMute').addEventListener('click',function(){muted=!muted;this.textContent=muted?'关':'开'});
    function judgePop(txt,color){
      var j=$('rzJudge')||null;
      if(!j){j=document.createElement('div');j.className='rz-judge';j.id='rzJudge';wrap.querySelector('.rz-lanes').appendChild(j)}
      j.textContent=txt;j.style.color=color;j.classList.remove('pop');void j.offsetWidth;j.classList.add('pop');
    }
    function hitLane(i){
      var lane=laneEls[i];lane.classList.add('flash');setTimeout(function(){lane.classList.remove('flash')},90);
      if(!run)return;
      var zone=lane.getBoundingClientRect(),bestN=null,bestD=1e9;
      notes.forEach(function(n){
        if(n.lane!==i)return;
        var d=Math.abs(n.el.getBoundingClientRect().top-zone.bottom+32);
        if(d<bestD){bestD=d;bestN=n}
      });
      if(bestN&&bestD<64){
        notes.splice(notes.indexOf(bestN),1);bestN.el.remove();
        hits++;combo++;maxCombo=Math.max(maxCombo,combo);
        var perfect=bestD<22;
        score+=perfect?100:50;
        judgePop(perfect?'PERFECT!':'GOOD',perfect?'#F25D8E':'#00A1D6');
        SFX.game(perfect?'combo':'quack');
      }else{combo=0;beep(180,.12,'sawtooth')}
      updHUD();
    }
    laneEls.forEach(function(d,i){
      d.addEventListener('pointerdown',function(e){e.preventDefault();hitLane(i)});
    });
    document.addEventListener('keydown',function(e){
      if(e.repeat||!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName))return;
      var i=LANES.findIndex(function(l){return l.key===e.key.toLowerCase()});
      if(i>-1){e.preventDefault();hitLane(i)}
    });
    function updHUD(){
      $('rzScore').textContent=String(score);$('rzCombo').textContent=String(combo);
      var total=hits+misses;
      $('rzAcc').textContent=total?Math.round(hits/total*100)+'%':'--';
    }
    function spawnNote(){
      if(!run)return;
      var lane=Math.floor(Math.random()*4);
      var prob=Math.min(.92,.45+elapsed/dur*.5);
      if(Math.random()<prob){
        var l=LANES[lane],el=document.createElement('div');
        el.className='rz-note-n';el.style.background=l.c;el.style.top='-40px';
        el.innerHTML='<span class="nemoji">'+l.icon+'</span>';
        laneEls[lane].appendChild(el);
        notes.push({lane:lane,el:el});
      }
      beatT=setTimeout(spawnNote,beatMs*(Math.random()<.25?0.5:1));
    }
    function tick(ts){
      if(!run)return;
      var dt=Math.min(.05,(ts-(last||ts))/1000);last=ts;elapsed+=dt;
      var lanesH=laneEls[0].clientHeight,speed=(lanesH+40)/1.9;
      for(var i=0;i<notes.length;i++){
        var n=notes[i];n.y=(n.y||-40)+speed*dt;
        n.el.style.top=n.y+'px';
        if(n.y>lanesH){
          notes.splice(i--,1);n.el.remove();
          misses++;combo=0;judgePop('MISS','#8a8a93');SFX.game('bad');updHUD();
        }
      }
      if(elapsed>=dur){end();return}
      raf=requestAnimationFrame(tick);
    }
    function end(){
      run=false;clearTimeout(beatT);
      notes.forEach(function(n){n.el.remove()});notes=[];SFX.sfx('end');
      var acc=hits+misses?Math.round(hits/(hits+misses)*100):0;
      var title=acc>=90?'🏆 全馆最强小黑子':acc>=70?'🎤 台风稳健':acc>=50?'🐔 已尽力':'⚠️ 律 师 函 警 告';
      $('rzOverTitle').textContent=title;
      $('rzOverSub').innerHTML='得分 <b style="color:var(--gold)">'+score+'</b> · 最高连击 '+maxCombo+' · 命中率 '+acc+'%<br>练习时长两年半，不是白练的。';
      $('rzOver').style.display='flex';MEME.icons();
      if(acc>=70)MEME.burst(0.5,0.5);
    }
    $('rzStart').addEventListener('click',startRz);
    $('rzRestart').addEventListener('click',startRz);
    function startRz(){
      if(run)return;run=true;
      score=0;combo=0;maxCombo=0;hits=0;misses=0;elapsed=0;last=0;
      notes.forEach(function(n){n.el.remove()});notes=[];
      updHUD();$('rzOver').style.display='none';
      spawnNote();raf=requestAnimationFrame(tick);
      MEME.toast('🎵 鸡你太美~ 一起来！');
    }
  })();
  
  /* ================= GAME 4 电子木鱼 · 敲击修行 ================= */
  (function(){
    var disc=$('muyuDisc'),mallet=$('muyuMallet'),stage=$('muyuStage');
    var taps=0,combo=0,lastTap=0,merit=0,sec=0,timerOn=false;
    var TITLES=[[0,'初入山门'],[100,'红尘苦练'],[300,'红尘显眼包'],[666,'寺庙显眼包'],[1000,'电子高僧']];
    var MILE={66:'功德 +66，诸邪退散',108:'🔔 敲满 108 下！功德圆满，环环相扣',233:'233 连场，佛祖笑出了声',500:'五百罗汉见你都要让座',666:'六六大顺，功德doubleValue',1080:'🎵 木鱼敲出残影，赛博住持认证'};
    var WORDS=['赛博功德，人人平等','这一下敲走了三成班味','功德+1，烦恼-1','木鱼：施主手速可以','住持看了都说专业','烦恼像功德一样跑掉了'];
    function title(){var t=TITLES[0][1];TITLES.forEach(function(x){if(taps>=x[0])t=x[1]});return t}
    function upd(){$('muyuMerit').textContent=String(merit);$('muyuCombo').textContent=String(combo);$('muyuTaps').textContent=String(taps);$('muyuTitle').textContent=title()}
    function beepDu(){
      try{
        var AC=window._muyuAC||new (window.AudioContext||window.webkitAudioContext)();window._muyuAC=AC;
        var o=AC.createOscillator(),gn=AC.createGain();
        o.type='triangle';o.frequency.setValueAtTime(175,AC.currentTime);
        o.frequency.exponentialRampToValueAtTime(85,AC.currentTime+.11);
        gn.gain.setValueAtTime(.14,AC.currentTime);
        gn.gain.exponentialRampToValueAtTime(.001,AC.currentTime+.13);
        o.connect(gn);gn.connect(AC.destination);o.start();o.stop(AC.currentTime+.14);
      }catch(e){}
    }
    function floatMerit(txt){
      var f=document.createElement('span');f.className='merit-float';f.textContent=txt;
      f.style.marginLeft=((Math.random()*120)-60)+'px';
      stage.appendChild(f);setTimeout(function(){f.remove()},1000);
    }
    function ripple(){
      var r=document.createElement('span');r.className='ripple go';
      stage.appendChild(r);setTimeout(function(){r.remove()},750);
    }
    function tap(){
      var now=Date.now();
      combo=(now-lastTap<850)?combo+1:1;lastTap=now;
      taps++;merit+=combo>=10?2:1;upd();
      if(!timerOn){timerOn=true;setInterval(function(){sec++;
        var p=function(n){return String(n).padStart(2,'0')};
        $('muyuTime').textContent=p(Math.floor(sec/60))+':'+p(sec%60);
      },1000)}
      disc.classList.add('whack');mallet.classList.add('whack');
      setTimeout(function(){disc.classList.remove('whack');mallet.classList.remove('whack')},95);
      ripple();floatMerit(combo>=10?'功德+2 ⚡':'功德+1');beepDu();
      if(MILE[taps]){SFX.sfx('win');MEME.toast(MILE[taps]);MEME.burst(0.5,0.55)}
      if(combo===10)$('muyuLog').textContent='十连功德！'+WORDS[Math.floor(Math.random()*WORDS.length)];
      if(combo===25)$('muyuLog').textContent='廿五连击，施主怕不是带业修行。';
    }
    disc.addEventListener('pointerdown',function(e){e.preventDefault();tap()});
    document.addEventListener('keydown',function(e){
      if(e.code==='Space'&&!/INPUT|TEXTAREA|SELECT/.test(document.activeElement.tagName)&&!window.__bottleBusy){e.preventDefault();tap()}
    });
    upd();
  })();
  /* ================= GAME 5 奥利给 · 呐喊分贝机 ================= */
  (function(){
    var cv=$('dbCv'),g=cv.getContext('2d'),W=560,H=270;
    var stage=cv.closest('.game-stage'),face=$('dbFace');
    var db=0,peak=0,holding=false,charge=0,t0=null,micMode=false,micStream=null,analyser=null,AC=null,raf=null,data=null;
    var DC={};
    function refreshDC(){
      var cs=getComputedStyle(document.documentElement);
      DC.ink=(cs.getPropertyValue('--ink')||'#17171A').trim();
      DC.muted=(cs.getPropertyValue('--ink-soft')||'#56565E').trim();
      DC.paper2=(cs.getPropertyValue('--paper-2')||'#F3EDE2').trim();
      drawMeter();
    }
    if(window.MEME)MEME.onThemeChange(refreshDC);
    function drawMeter(){
      g.clearRect(0,0,W,H);
      var bx=30,bw=W-60,by=188,bh=42,segs=26,gap=4,sw=(bw-gap*(segs-1))/segs;
      for(var i=0;i<segs;i++){
        var v=(i+1)/segs*120,lit=v<=db;
        g.fillStyle=lit?(v<=60?'#2AC864':v<=85?'#FFC533':v<=105?'#F25D8E':'#E03A2F'):DC.paper2;
        g.strokeStyle=DC.ink;g.lineWidth=2;
        g.beginPath();
        if(g.roundRect){g.roundRect(bx+i*(sw+gap),by,sw,bh,4);g.fill();g.stroke()}
        else{g.rect(bx+i*(sw+gap),by,sw,bh);g.fill();g.stroke()}
      }
      [[0,'0'],[60/120,'60'],[90/120,'90'],[1,'120']].forEach(function(m){
        g.fillStyle=DC.muted;g.font='700 11px "Noto Sans SC",sans-serif';g.textAlign='center';
        g.fillText(m[1],bx+bw*m[0],H-12);
      });
      var nx=bx+bw*(db/120);
      g.fillStyle=DC.ink;
      g.beginPath();g.moveTo(nx-9,by-16);g.lineTo(nx+9,by-16);g.lineTo(nx,by-3);g.closePath();g.fill();
    }
    function verdict(v){
      if(v<60)return'🤫 声音太小，鸽子都被你吓不跑';
      if(v<80)return'🙂 礼貌呐喊 · 邻居友好型选手';
      if(v<100)return'😤 有内味了！再来一口仙气';
      if(v<114)return'🔥 奥力给!! 干就完了!!';
      return'🏆 末日咆哮体 · 泰坦级肺活量';
    }
    function showVerdict(){
      MEME.toast(db.toFixed(0)+' dB · '+verdict(peak));
      if(peak>=100)MEME.burst(0.5,0.5);
    }
    var lastDrawn=-1;
    function loop(ts){
      if(!holding&&!micMode&&db===lastDrawn){raf=requestAnimationFrame(loop);return}
      if(micMode&&db>0&&Math.abs(db-lastDrawn)<1){raf=requestAnimationFrame(loop);return}
      if(holding&&!micMode){
        if(t0===null)t0=ts;
        var d=(ts-t0)/1000;charge=d;
        db=Math.min(118,40+Math.min(d,2.2)*34+Math.sin(d*8)*3+Math.random()*2.5);
        face.textContent=db<70?'😟':db<90?'😤':db<108?'😠':'🤬';
        stage.classList.add('shake');
        face.style.transform='rotate('+((Math.random()*6)-3)+'deg) scale('+(1+db/600)+')';
      }
      if(micMode&&analyser){
        analyser.getByteTimeDomainData(data);
        var sum=0;for(var i=0;i<data.length;i++){var x=(data[i]-128)/128;sum+=x*x}
        var rms=Math.sqrt(sum/data.length);
        db=Math.max(db*0.92,Math.min(120,rms>0?Math.max(0,(20*Math.log10(rms))+90):0));
        if(db>peak){}
      }
      db=Math.round(db);
      lastDrawn=db;
      if(db>peak){peak=db;$('dbPeak').textContent=String(peak)}
      $('dbNow').textContent=String(db);$('dbNum').innerHTML=db+'<small>dB</small>';
      drawMeter();
      if(!(holding&&!micMode)){stage.classList.remove('shake');face.style.transform=''}
      raf=drawMeter();requestAnimationFrame(loop);
    }
    function stopHold(){
      if(!holding)return;holding=false;t0=null;
      face.textContent='😐';showVerdict();
    }
    var btn=$('dbBtn');
    btn.addEventListener('pointerdown',function(e){if(micMode)return;e.preventDefault();holding=true;charge=0;t0=null});
    ['pointerup','pointerleave','pointercancel'].forEach(function(ev){btn.addEventListener(ev,stopHold)});
    document.addEventListener('keyup',function(e){});
    $('dbMic').addEventListener('click',async function(){
      if(micMode){
        micMode=false;
        if(micStream){micStream.getTracks().forEach(function(t){t.stop()});micStream=null}
        analyser=null;db=0;
        this.innerHTML='<i data-lucide="mic"></i>真麦克风模式';MEME.icons();
        $('dbMode').textContent='模拟呐喊';$('dbSettle').style.display='none';
        MEME.toast('已切回模拟模式');return;
      }
      try{
        micStream=await navigator.mediaDevices.getUserMedia({audio:true});
        AC=AC||new (window.AudioContext||window.webkitAudioContext)();
        analyser=AC.createAnalyser();analyser.fftSize=1024;
        data=new Uint8Array(analyser.fftSize);
        AC.createMediaStreamSource(micStream).connect(analyser);
        micMode=true;db=0;
        this.innerHTML='<i data-lucide="mic-off"></i>关闭麦克风';MEME.icons();
        $('dbMode').textContent='真麦克风';$('dbSettle').style.display='inline-flex';
        MEME.toast('🎤 麦克风已上线：对着屏幕喊一嗓子！');
      }catch(e){MEME.toast('麦克风不可用或被拒绝，继续模拟模式')}
    });
    $('dbSettle').addEventListener('click',function(){
      if(!micMode)return;
      db=0;showVerdict(); /* showVerdict 内已含 toast，去掉重复提示 */
    });
    drawMeter();requestAnimationFrame(loop);
  })();

  /* ---- 馆内地图 ---- */
  (function(){
    var SKIP={arcade:1,home:1};
    var DESC={dict:'43 条梗收录在册',rank:'热榜实时跳动',classroom:'弹幕礼仪必修课',quotes:'12 张名场面翻牌',history:'2009→2026 滚动长卷',factory:'梗图生成器',quiz:'八题定段位',playground:'八个小玩意儿',sanlian:'充电桩已就位',philosophy:'♂ 使用指南与精神图腾'};
    $('moreHalls').innerHTML=MEME.PAGES.filter(function(p){return !SKIP[p.id]}).map(function(p){
      return '<a href="'+p.href+'"><b>'+p.label+'</b><span>'+(DESC[p.id]||'')+'</span></a>';
    }).join('');
    MEME.icons();
  })();
})();
