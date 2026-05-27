/* === FORTE ATELIER LAYER === */
(function(){
  if (window.__FORTE_ATELIER_LOADED__) return;
  window.__FORTE_ATELIER_LOADED__ = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;


  /* ---------- Ambient audio toggle ---------- */
  function initAudio(){
    var existing = document.querySelector('.forte-audio-toggle');
    if (existing) return;

    var audio = new Audio();
    audio.loop = true;
    audio.volume = 0.32;
    audio.preload = 'none';
    // Open ambient bird/woodland recording, CC0 (Internet Archive — preview will fail gracefully if blocked)
    audio.src = 'https://cdn.pixabay.com/audio/2022/03/15/audio_e5d3e3e69b.mp3';
    audio.crossOrigin = 'anonymous';

    var btn = document.createElement('button');
    btn.className = 'forte-audio-toggle';
    btn.setAttribute('aria-label', 'Toggle ambient course sound');
    btn.setAttribute('type', 'button');
    btn.innerHTML = [
      '<span class="forte-audio-icon">',
      '  <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">',
      '    <path d="M3 9v6h4l5 5V4L7 9H3z M16.5 12c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77S18.01 4.14 14 3.23z"/>',
      '  </svg>',
      '</span>',
      '<span class="forte-audio-label">Course sound</span>'
    ].join('');
    document.body.appendChild(btn);

    var playing = false;
    var hoverTimer;

    btn.addEventListener('mouseenter', function(){
      clearTimeout(hoverTimer);
      btn.classList.add('is-expanded');
    });
    btn.addEventListener('mouseleave', function(){
      hoverTimer = setTimeout(function(){
        if (!playing) btn.classList.remove('is-expanded');
      }, 300);
    });

    btn.addEventListener('click', function(){
      if (playing){
        audio.pause();
        playing = false;
        btn.classList.remove('is-playing');
      } else {
        var p = audio.play();
        if (p && typeof p.then === 'function') {
          p.then(function(){
            playing = true;
            btn.classList.add('is-playing', 'is-expanded');
          }).catch(function(){
            // Audio source may be blocked — silently disable button
            btn.style.display = 'none';
          });
        } else {
          playing = true;
          btn.classList.add('is-playing', 'is-expanded');
        }
      }
    });
  }

  /* ---------- Visitor-type personalisation (subtle) ---------- */
  function initPersonalisation(){
    // Heuristic: detect visitor type from referrer + time + scroll behaviour
    var ref = (document.referrer || '').toLowerCase();
    var hour = new Date().getHours();
    var isWeekend = [0, 6].indexOf(new Date().getDay()) !== -1;
    var visitorType = 'general';

    // Membership-intent signals (Google search referrer + words)
    if (ref.includes('google') && /membership|join|fees/.test(window.location.search)) {
      visitorType = 'membership';
    }
    // Visiting golfer signals (weekend OR evening browsing)
    else if (isWeekend || hour >= 19 || hour < 6) {
      visitorType = 'visitor-evening';
    }
    // Corporate / event signals (linkedin referrer)
    else if (ref.includes('linkedin') || ref.includes('eventbrite')) {
      visitorType = 'corporate';
    }
    // Working-hours weekday browsing — likely member or admin
    else if (hour >= 9 && hour < 17 && !isWeekend) {
      visitorType = 'member-weekday';
    }

    document.body.setAttribute('data-visitor', visitorType);

    // Surface a contextual toast after 35s if they've engaged (scrolled > 60%)
    var shown = false;
    function tryShowToast(){
      if (shown) return;
      var pct = (window.scrollY + window.innerHeight) / document.documentElement.scrollHeight;
      if (pct < 0.55) return;
      shown = true;

      var msg = null;
      if (visitorType === 'membership') {
        msg = { txt: 'Looking at membership? Our office team replies same-day.', cta: 'Enquire', href: 'contact.html' };
      } else if (visitorType === 'visitor-evening') {
        msg = { txt: 'Visitor tee times are open from £40. Book online.', cta: 'Book', href: '#book' };
      } else if (visitorType === 'corporate') {
        msg = { txt: 'Corporate days and society packages — see what we offer.', cta: 'Packages', href: '#societies' };
      }
      if (!msg) return;

      var toast = document.createElement('div');
      toast.setAttribute('role', 'status');
      toast.style.cssText = [
        'position:fixed','bottom:84px','right:24px','z-index:48',
        'background:rgba(15,24,30,0.94)','backdrop-filter:blur(14px)',
        '-webkit-backdrop-filter:blur(14px)',
        'border:1px solid rgba(184,153,90,0.4)','border-radius:10px',
        'padding:14px 18px','color:#f4eed8','font-family:\'DM Sans\',sans-serif',
        'font-size:0.82rem','max-width:280px','line-height:1.5',
        'box-shadow:0 24px 60px -28px rgba(0,0,0,.5)',
        'opacity:0','transform:translateY(8px)',
        'transition:opacity 0.5s ease,transform 0.5s ease'
      ].join(';');
      toast.innerHTML = msg.txt +
        ' <a href="' + msg.href + '" style="color:#b8995a;text-decoration:none;border-bottom:1px solid rgba(184,153,90,.5);margin-left:6px">' + msg.cta + ' &rarr;</a>' +
        ' <button aria-label="Dismiss" style="background:none;border:0;color:rgba(244,238,216,.5);font-size:1rem;cursor:pointer;float:right;margin-left:8px;padding:0;line-height:1">&times;</button>';
      document.body.appendChild(toast);
      requestAnimationFrame(function(){
        setTimeout(function(){
          toast.style.opacity = '1';
          toast.style.transform = 'translateY(0)';
        }, 50);
      });
      toast.querySelector('button').addEventListener('click', function(){
        toast.style.opacity = '0';
        setTimeout(function(){ toast.remove(); }, 500);
      });
      // Auto-dismiss after 12s
      setTimeout(function(){
        if (toast.parentNode) {
          toast.style.opacity = '0';
          setTimeout(function(){ if (toast.parentNode) toast.remove(); }, 500);
        }
      }, 12000);
    }
    window.addEventListener('scroll', tryShowToast, { passive: true });
    setTimeout(tryShowToast, 35000);
  }

  function init(){
    initAudio();
    initPersonalisation();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
