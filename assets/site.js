(function(){
  function scaleEmbeds(){
    document.querySelectorAll('.embed-frame').forEach(function(frame){
      var slide = frame.querySelector('.slide');
      if (!slide) return;
      var w = frame.clientWidth || 320;
      var s = w / 1280;
      frame.style.height = Math.round(720 * s) + 'px';
      slide.style.setProperty('--embed-scale', s.toFixed(4));
    });
  }

  document.querySelectorAll('.video-card').forEach(function(card){
    var video = card.querySelector('video');
    var playBtn = card.querySelector('.play-btn');
    if (!video) return;
    if (playBtn) {
      playBtn.addEventListener('click', function(e){
        e.stopPropagation();
        video.play();
      });
    }
    card.addEventListener('click', function(e){
      if (e.target.closest('video')) return;
      if (video.paused) video.play();
      else video.pause();
    });
    video.addEventListener('play', function(){ card.classList.add('playing'); });
    video.addEventListener('pause', function(){ card.classList.remove('playing'); });
  });

  var deckIframe = document.getElementById('deckIframe');
  if (deckIframe) {
    var SECTION_DEFS = [
      {label:'个人概述', index:1, color:'#328CFF'},
      {label:'01 IP联名', index:6, color:'#328CFF'},
      {label:'02 全域整合', index:20, color:'#FF7043'},
      {label:'03 媒介种草', index:31, color:'#009688'},
      {label:'04 节点热点', index:37, color:'#7B1FA2'},
      {label:'05 品牌视觉', index:41, color:'#1A1A2E'},
      {label:'收尾', index:45, color:'#1A1A2E'}
    ];
    var deckFrame = document.getElementById('deckFrame');
    var prevBtn = document.getElementById('prevBtn');
    var nextBtn = document.getElementById('nextBtn');
    var autoplayBtn = document.getElementById('autoplayBtn');
    var fullscreenBtn = document.getElementById('fullscreenBtn');
    var pageIndicator = document.getElementById('pageIndicator');
    var progressBar = document.getElementById('progressBar');
    var sectionJump = document.getElementById('sectionJump');
    var cur = 0;
    var total = 49;
    var iframeReady = false;
    var pendingIndex = null;
    var autoplayOn = false;
    var autoplayTimer = null;
    var slideParam = Number(new URLSearchParams(location.search).get('slide'));
    if (slideParam > 0) pendingIndex = slideParam - 1;

    function goTo(i){
      pendingIndex = i;
      if (iframeReady) deckIframe.contentWindow.postMessage({type:'portfolio:go', index:i}, '*');
      setAutoplay(false);
    }

    function setIndicator(i, n){
      cur = i;
      total = n || total;
      pageIndicator.textContent = String(cur + 1).padStart(2, '0') + ' / ' + String(total).padStart(2, '0');
      progressBar.style.width = ((cur + 1) / total * 100).toFixed(2) + '%';
      var activeStart = 0;
      SECTION_DEFS.forEach(function(s){ if (cur >= s.index) activeStart = s.index; });
      sectionJump.querySelectorAll('.jump-chip').forEach(function(chip){
        chip.classList.toggle('active', Number(chip.dataset.index) === activeStart);
      });
    }

    function setAutoplay(on){
      autoplayOn = on;
      autoplayBtn.classList.toggle('is-on', on);
      autoplayBtn.setAttribute('aria-pressed', on ? 'true' : 'false');
      if (on) {
        if (autoplayTimer) clearInterval(autoplayTimer);
        autoplayTimer = setInterval(function(){
          if (iframeReady) deckIframe.contentWindow.postMessage({type:'portfolio:go', index:cur + 1}, '*');
        }, 4000);
      } else if (autoplayTimer) {
        clearInterval(autoplayTimer);
        autoplayTimer = null;
      }
    }

    SECTION_DEFS.forEach(function(s){
      var btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'jump-chip';
      btn.dataset.index = s.index;
      btn.innerHTML = '<span class="chip-dot" style="background:' + s.color + '"></span>' + s.label;
      btn.addEventListener('click', function(){ goTo(s.index); });
      sectionJump.appendChild(btn);
    });

    prevBtn.addEventListener('click', function(){ goTo(cur - 1); });
    nextBtn.addEventListener('click', function(){ goTo(cur + 1); });
    autoplayBtn.addEventListener('click', function(){ setAutoplay(!autoplayOn); });
    fullscreenBtn.addEventListener('click', function(){
      if (!document.fullscreenElement) {
        if (deckFrame.requestFullscreen) deckFrame.requestFullscreen();
      } else if (document.exitFullscreen) {
        document.exitFullscreen();
      }
    });
    document.addEventListener('fullscreenchange', function(){
      var isFs = Boolean(document.fullscreenElement);
      document.body.classList.toggle('is-fullscreen', isFs);
      fullscreenBtn.classList.toggle('is-on', isFs);
    });

    deckIframe.addEventListener('load', function(){
      iframeReady = true;
      if (pendingIndex !== null) {
        deckIframe.contentWindow.postMessage({type:'portfolio:go', index:pendingIndex}, '*');
      }
    });
    window.addEventListener('message', function(e){
      var d = e.data;
      if (!d || d.type !== 'portfolio:page') return;
      setIndicator(d.index, d.total);
    });
    document.addEventListener('visibilitychange', function(){
      if (document.hidden) setAutoplay(false);
    });
  }

  window.addEventListener('resize', scaleEmbeds);
  document.addEventListener('DOMContentLoaded', scaleEmbeds);
  scaleEmbeds();
})();
