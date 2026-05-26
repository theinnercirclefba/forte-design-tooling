/* === FORTE ATELIER LAYER === */
(function(){
  if (window.__FORTE_ATELIER_LOADED__) return;
  window.__FORTE_ATELIER_LOADED__ = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Three.js dimple sphere (decorative brass golf ball) ---------- */
  function initWebGL(){
    if (reduceMotion) return;
    if (typeof THREE === 'undefined') return;
    var hero = document.querySelector('.hero, .home-hero, .page-hero');
    if (!hero) return;
    // Only on the home hero — never on inner-page banners
    if (hero.classList.contains('page-hero') && !hero.classList.contains('hero')) return;
    if (window.innerWidth < 520) return;

    var mount = document.createElement('div');
    mount.className = 'forte-3d-decoration';
    mount.setAttribute('aria-hidden', 'true');
    hero.appendChild(mount);

    var width = mount.clientWidth;
    var height = mount.clientHeight;

    var scene = new THREE.Scene();
    var camera = new THREE.PerspectiveCamera(38, width / height, 0.1, 100);
    camera.position.z = 3.4;

    var renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(width, height);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    // Brass material
    var sphereGeo = new THREE.SphereGeometry(1, 64, 64);
    var brassColor = new THREE.Color('#b8995a');
    var brassMat = new THREE.MeshStandardMaterial({
      color: brassColor,
      metalness: 0.78,
      roughness: 0.32,
      flatShading: false
    });

    var ball = new THREE.Mesh(sphereGeo, brassMat);
    scene.add(ball);

    // Dimples as small inset spheres (illustrative — not literal golf-ball geometry)
    // Place ~120 small darker spheres on the surface for the dimple effect
    var dimpleGeo = new THREE.SphereGeometry(0.045, 12, 12);
    var dimpleMat = new THREE.MeshStandardMaterial({
      color: new THREE.Color('#8a6f3a'),
      metalness: 0.6,
      roughness: 0.5
    });
    var dimples = new THREE.Group();
    var dimpleCount = 96;
    for (var i = 0; i < dimpleCount; i++){
      var phi = Math.acos(-1 + (2 * i) / dimpleCount);
      var theta = Math.sqrt(dimpleCount * Math.PI) * phi;
      var d = new THREE.Mesh(dimpleGeo, dimpleMat);
      d.position.set(
        Math.cos(theta) * Math.sin(phi) * 1.0,
        Math.sin(theta) * Math.sin(phi) * 1.0,
        Math.cos(phi) * 1.0
      );
      d.position.multiplyScalar(0.97); // sit just below surface
      dimples.add(d);
    }
    ball.add(dimples);

    // Lighting
    var ambient = new THREE.AmbientLight(0xffffff, 0.45);
    scene.add(ambient);
    var key = new THREE.DirectionalLight(0xfff1d4, 1.4);
    key.position.set(2, 3, 4);
    scene.add(key);
    var fill = new THREE.DirectionalLight(0x7a90b8, 0.35);
    fill.position.set(-3, -1, 2);
    scene.add(fill);
    var rim = new THREE.PointLight(0xb8995a, 1.2, 8);
    rim.position.set(-2, 1.5, -2);
    scene.add(rim);

    var t = 0;
    var scrollY = 0;
    window.addEventListener('scroll', function(){ scrollY = window.scrollY; }, { passive: true });

    function animate(){
      t += 0.0048;
      ball.rotation.y = t;
      ball.rotation.x = Math.sin(t * 0.7) * 0.18;
      // Subtle scroll-driven tilt
      ball.position.y = Math.min(scrollY * -0.0025, 0.6);
      renderer.render(scene, camera);
      requestAnimationFrame(animate);
    }
    animate();

    requestAnimationFrame(function(){
      setTimeout(function(){ mount.classList.add('is-loaded'); }, 120);
    });

    window.addEventListener('resize', function(){
      var w = mount.clientWidth;
      var h = mount.clientHeight;
      if (w === 0 || h === 0) return;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    });
  }

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
    initWebGL();
    initAudio();
    initPersonalisation();
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
