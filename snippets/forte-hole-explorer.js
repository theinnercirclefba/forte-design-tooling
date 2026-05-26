/* === HOLE EXPLORER === */
(function(){
  var explorer = document.querySelector('.hole-explorer');
  if (!explorer) return;
  var raw = explorer.getAttribute('data-holes');
  if (!raw) return;
  var holes;
  try { holes = JSON.parse(raw); } catch(e) { return; }
  var detail = document.getElementById('hole-detail');
  if (!detail) return;
  var markers = explorer.querySelectorAll('.hole-marker');
  var activeNum = null;

  /* Procedural plan-view SVG generator */
  function holePlanSVG(h){
    var w = 360, hH = 110;
    var pad = 14;
    var teeX = pad + 6, teeY = hH / 2;
    var greenX = w - pad - 26;
    var greenY = hH / 2;
    var midX = w / 2;
    var midY = hH / 2;

    // Adjust mid Y based on shape
    if (h.shape === 'dogleg-l') midY = hH * 0.78;
    else if (h.shape === 'dogleg-r') midY = hH * 0.22;
    else if (h.shape === 'short') { midX = (teeX + greenX) / 2; midY = hH / 2; }

    // Fairway path
    var path = 'M ' + teeX + ' ' + teeY +
               ' Q ' + midX + ' ' + midY +
               ' ' + greenX + ' ' + greenY;

    // Bunkers — more if higher SI difficulty (1=hardest, 18=easiest)
    var bunkerCount = h.si <= 6 ? 4 : h.si <= 12 ? 3 : 2;
    var bunkers = '';
    for (var i = 0; i < bunkerCount; i++){
      var bx = pad + 60 + (i * (w - 120) / bunkerCount) + (Math.sin(i + h.n) * 14);
      var by = hH / 2 + (Math.sin(i * 1.7 + h.n) * 24);
      var br = 4 + (i % 2) * 1.5;
      bunkers += '<ellipse cx="' + bx + '" cy="' + by + '" rx="' + (br * 1.4) + '" ry="' + br + '" fill="#C9A14E" opacity=".85"/>';
    }

    // Trees if "tree" mentioned in description
    var trees = '';
    if (/tree|wood|parkland/i.test(h.desc)){
      for (var t = 0; t < 6; t++){
        var tx = pad + 30 + (t * (w - 80) / 6);
        var ty1 = 14, ty2 = hH - 14;
        trees += '<circle cx="' + tx + '" cy="' + ty1 + '" r="3" fill="#3D5F45" opacity=".6"/>';
        trees += '<circle cx="' + tx + '" cy="' + ty2 + '" r="3" fill="#3D5F45" opacity=".6"/>';
      }
    }

    return [
      '<svg viewBox="0 0 ' + w + ' ' + hH + '" xmlns="http://www.w3.org/2000/svg">',
      // Fairway (wide stroke)
      '<path d="' + path + '" stroke="#3D5F45" stroke-width="20" fill="none" stroke-linecap="round" opacity=".25"/>',
      // Mown line
      '<path d="' + path + '" stroke="#3D5F45" stroke-width="14" fill="none" stroke-linecap="round" opacity=".4"/>',
      // Trees
      trees,
      // Bunkers
      bunkers,
      // Green
      '<ellipse cx="' + greenX + '" cy="' + greenY + '" rx="16" ry="11" fill="#8B6F3A" opacity=".22"/>',
      '<ellipse cx="' + greenX + '" cy="' + greenY + '" rx="13" ry="9" fill="#3D5F45" opacity=".7"/>',
      // Pin
      '<line x1="' + greenX + '" y1="' + greenY + '" x2="' + greenX + '" y2="' + (greenY - 14) + '" stroke="#0E1A24" stroke-width="1"/>',
      '<polygon points="' + greenX + ',' + (greenY - 14) + ' ' + (greenX + 6) + ',' + (greenY - 11) + ' ' + greenX + ',' + (greenY - 8) + '" fill="#6B1F2E"/>',
      // Tee box
      '<rect x="' + (teeX - 5) + '" y="' + (teeY - 4) + '" width="10" height="8" rx="1" fill="#0E1A24" opacity=".55"/>',
      // Tee label
      '<text x="' + (teeX - 8) + '" y="' + (teeY + 18) + '" font-family="DM Sans" font-size="8" fill="#3A4855" letter-spacing="1.2">TEE</text>',
      '<text x="' + (greenX - 14) + '" y="' + (greenY + 24) + '" font-family="DM Sans" font-size="8" fill="#3A4855" letter-spacing="1.2">GREEN</text>',
      '</svg>'
    ].join('');
  }

  function animateCounter(el, target, suffix){
    var start = 0;
    var dur = 1100;
    var startTime = null;
    function step(t){
      if (!startTime) startTime = t;
      var elapsed = t - startTime;
      var p = Math.min(elapsed / dur, 1);
      var eased = 1 - Math.pow(1 - p, 3); // ease-out cubic
      var val = Math.round(start + (target - start) * eased);
      el.textContent = val.toLocaleString('en-GB') + (suffix || '');
      if (p < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
  }

  function renderHole(n){
    if (activeNum === n) return;
    activeNum = n;
    var h = holes.find(function(x){ return x.n === n; });
    if (!h) return;

    markers.forEach(function(m){
      if (parseInt(m.getAttribute('data-hole'), 10) === n) m.classList.add('is-active');
      else m.classList.remove('is-active');
    });

    var isSignature = (n === 6);
    var plan = holePlanSVG(h);
    var nDisplay = n < 10 ? '0' + n : n;
    var sigBadge = isSignature ? '<span class="hole-detail-signature">Signature</span>' : '<span style="font-size:.66rem;letter-spacing:2px;text-transform:uppercase;color:var(--ink-soft)">Hole ' + nDisplay + ' &middot; Par ' + h.par + '</span>';

    detail.innerHTML = [
      '<div class="hole-detail">',
      '  <div class="hole-detail-num-wrap">',
      '    <span class="hole-detail-num"><em>' + nDisplay + '</em></span>',
      '    ' + sigBadge,
      '  </div>',
      '  <div class="hole-detail-stats">',
      '    <div class="hole-detail-stat"><div class="hole-detail-stat-num" data-c="' + h.par + '">0</div><div class="hole-detail-stat-lbl">Par</div></div>',
      '    <div class="hole-detail-stat"><div class="hole-detail-stat-num" data-c="' + h.yd + '">0</div><div class="hole-detail-stat-lbl">Yards</div></div>',
      '    <div class="hole-detail-stat"><div class="hole-detail-stat-num" data-c="' + h.si + '">0</div><div class="hole-detail-stat-lbl">Stroke Index</div></div>',
      '  </div>',
      '  <div class="hole-detail-plan" aria-label="Plan view of hole ' + n + '">' + plan + '</div>',
      '  <p class="hole-detail-desc">&ldquo;' + h.desc + '&rdquo;</p>',
      (h.vid
        ? '  <button class="hole-detail-cta" data-vid="' + h.vid + '" type="button">' +
          '    <span class="hole-detail-cta-icon">&#9654;</span>' +
          '    Watch the drone flyover' +
          '  </button>'
        : (h.name
          ? '  <div class="hole-detail-meta">' + h.name + '</div>'
          : '')
      ),
      '</div>'
    ].join('\n');

    // Animate counters
    var counters = detail.querySelectorAll('[data-c]');
    counters.forEach(function(el){
      var target = parseInt(el.getAttribute('data-c'), 10);
      if (isNaN(target)) return;
      animateCounter(el, target, '');
    });

    // CTA opens the existing hole-player modal (only present when h.vid is set)
    var cta = detail.querySelector('.hole-detail-cta');
    if (cta && h.vid){
      cta.addEventListener('click', function(){
        var player = document.getElementById('hole-player');
        var iframe = document.getElementById('hole-iframe');
        if (player && iframe){
          iframe.src = 'https://www.youtube.com/embed/' + h.vid + '?autoplay=1&rel=0&modestbranding=1';
          player.removeAttribute('hidden');
        }
      });
    }
  }

  // Wire up markers (hover for desktop, click for touch)
  markers.forEach(function(m){
    var n = parseInt(m.getAttribute('data-hole'), 10);
    m.addEventListener('mouseenter', function(){ renderHole(n); });
    m.addEventListener('click', function(){ renderHole(n); });
    m.addEventListener('focus', function(){ renderHole(n); });
    m.setAttribute('tabindex', '0');
    m.setAttribute('role', 'button');
    m.setAttribute('aria-label', 'Show details for hole ' + n);
    m.addEventListener('keydown', function(e){
      if (e.key === 'Enter' || e.key === ' '){
        e.preventDefault();
        renderHole(n);
      }
    });
  });

  // Auto-open signature hole (6) after a beat so first-time viewers see the pattern
  if (!('ontouchstart' in window)) {
    setTimeout(function(){
      var sigMarker = explorer.querySelector('.hole-marker.is-signature');
      if (sigMarker && !activeNum) {
        renderHole(6);
      }
    }, 2400);
  }
})();

