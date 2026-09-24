/* ============ factory.js · 梗图工厂页 ============ */
(function(){
  var $=MEME.$,genTpl='pink';
  var genTop=$('genTop'),genBottom=$('genBottom'),genSize=$('genSize'),genPat=$('genPat'),genCanvas=$('genCanvas');
  function wrapText(ctx,text,maxW){
    var out=[],line='';
    for(var i=0;i<text.length;i++){var t=line+text[i];
      if(ctx.measureText(t).width>maxW&&line){out.push(line);line=text[i]}else line=t}
    if(line)out.push(line);return out.slice(0,4);
  }
  function drawGen(){
    var W=800,H=1000,ctx=genCanvas.getContext('2d'),tpl=GEN_TPL[genTpl];
    var g=ctx.createLinearGradient(0,0,W,H);
    g.addColorStop(0,tpl.c[0]);g.addColorStop(0.55,tpl.c[1]);g.addColorStop(1,tpl.c[2]);
    ctx.fillStyle=g;ctx.fillRect(0,0,W,H);
    if(genPat.value==='dots'){ctx.fillStyle='rgba(255,255,255,.16)';
      for(var x=40;x<W;x+=64)for(var y=40;y<H;y+=64){ctx.beginPath();ctx.arc(x,y,6,0,7);ctx.fill()}}
    else if(genPat.value==='lines'){ctx.strokeStyle='rgba(255,255,255,.14)';ctx.lineWidth=10;
      for(var i2=-H;i2<W;i2+=70){ctx.beginPath();ctx.moveTo(i2,0);ctx.lineTo(i2+H,H);ctx.stroke()}}
    else if(genPat.value==='danmu'){
      for(var i3=0;i3<14;i3++){ctx.fillStyle='rgba(255,255,255,'+(0.06+Math.random()*0.10).toFixed(3)+')';
        var w=120+Math.random()*380,bx=Math.random()*(W-w),by=40+Math.random()*(H-140);
        if(ctx.roundRect){ctx.beginPath();ctx.roundRect(bx,by,w,34,17);ctx.fill()}else ctx.fillRect(bx,by,w,34)}}
    var size=+genSize.value;$('genSizeVal').textContent=size;
    ctx.font='900 '+size+'px "ZCOOL KuaiLe","PingFang SC","Microsoft YaHei",sans-serif';
    ctx.textAlign='center';ctx.lineJoin='round';
    ctx.strokeStyle='rgba(20,20,30,.85)';ctx.lineWidth=Math.max(6,size/6);
    function putLine(l,yy){ctx.strokeText(l,W/2,yy);ctx.fillStyle='#fff';ctx.fillText(l,W/2,yy)}
    wrapText(ctx,genTop.value||' ',W-110).forEach(function(l,i){putLine(l,70+size+i*size*1.15)});
    wrapText(ctx,genBottom.value||' ',W-110).slice().reverse().forEach(function(l,i){putLine(l,H-100-i*size*1.15)});
    ctx.font='24px "Noto Sans SC",sans-serif';ctx.textAlign='right';ctx.fillStyle='rgba(0,0,0,.45)';
    ctx.fillText('小破站梗图工厂 · 2026',W-24,H-24);
  }
  $('tplRow').addEventListener('click',function(e){
    var b=e.target.closest('.tpl');if(!b)return;
    genTpl=b.dataset.t;
    document.querySelectorAll('.tpl').forEach(function(t){t.classList.toggle('on',t===b)});
    drawGen();
  });
  [genTop,genBottom,genSize,genPat].forEach(function(el){el.addEventListener('input',drawGen);el.addEventListener('change',drawGen)});
  $('genRandom').addEventListener('click',function(){
    var p=GEN_COPY[Math.floor(Math.random()*GEN_COPY.length)];
    genTop.value=p[0];genBottom.value=p[1];drawGen();MEME.toast('金句已换，灵感 +1');
  });
  $('genDownload').addEventListener('click',function(){
    var a=document.createElement('a');a.download='小破站梗图.png';a.href=genCanvas.toDataURL('image/png');a.click();
    MEME.toast('梗图已出货，群里见 🖼️');
  });
  if(document.fonts&&document.fonts.ready)document.fonts.ready.then(drawGen);
  drawGen();
})();
