/* === FORTE CHAPTERS + WEATHER === */
(function(){
  if (window.__FORTE_CHAPTERS_LOADED__) return;
  window.__FORTE_CHAPTERS_LOADED__ = true;

  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- Chapter system ---------- */
  function initChapters(){
    // Auto-tag sections with [data-chapter] if author has marked them
    var sections = document.querySelectorAll('section[data-chapter], .chapter-section');
    if (sections.length){
      var obs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting){
            var name = e.target.getAttribute('data-chapter') || 'course';
            document.body.setAttribute('data-chapter', name);
          }
        });
      }, { threshold: 0.35 });
      sections.forEach(function(s){ obs.observe(s); });
    }

    // Image reveal on scroll
    var images = document.querySelectorAll('.chapter-img, .story-image, .section-photo');
    if (images.length){
      var imgObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting){
            e.target.classList.add('is-revealed');
            imgObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.2 });
      images.forEach(function(img){ imgObs.observe(img); });
    }

    // Chapter heading reveal
    var headings = document.querySelectorAll('.chapter-heading');
    headings.forEach(function(h){
      if (!h.dataset.wrapped){
        h.dataset.wrapped = '1';
        var raw = h.textContent;
        h.innerHTML = '<span>' + raw + '</span>';
      }
    });
    if (headings.length){
      var hObs = new IntersectionObserver(function(entries){
        entries.forEach(function(e){
          if (e.isIntersecting){
            e.target.classList.add('is-revealed');
            hObs.unobserve(e.target);
          }
        });
      }, { threshold: 0.3 });
      headings.forEach(function(h){ hObs.observe(h); });
    }
  }

  /* ---------- Live Weather Widget ---------- */
  function getWeatherIconSVG(code){
    // Open-Meteo WMO code → simple SVG
    // Sunny: 0,1  / Cloudy: 2,3  / Foggy: 45,48 / Drizzle: 51-57 / Rain: 61-67, 80-82
    // Snow: 71-77, 85-86 / Thunder: 95-99
    if (code === 0 || code === 1) {
      return '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6"/><g stroke="currentColor" stroke-width="2" fill="none"><line x1="16" y1="2" x2="16" y2="6"/><line x1="16" y1="26" x2="16" y2="30"/><line x1="2" y1="16" x2="6" y2="16"/><line x1="26" y1="16" x2="30" y2="16"/><line x1="6" y1="6" x2="9" y2="9"/><line x1="23" y1="23" x2="26" y2="26"/><line x1="6" y1="26" x2="9" y2="23"/><line x1="23" y1="9" x2="26" y2="6"/></g></svg>';
    }
    if (code === 2 || code === 3) {
      return '<svg viewBox="0 0 32 32"><path d="M22 20 L8 20 A6 6 0 0 1 8 12 A4 4 0 0 1 14 10 A6 6 0 0 1 24 14 A4 4 0 0 1 22 20 Z"/></svg>';
    }
    if (code >= 45 && code <= 48) {
      return '<svg viewBox="0 0 32 32"><g stroke="currentColor" stroke-width="2" fill="none"><line x1="4" y1="12" x2="28" y2="12"/><line x1="6" y1="18" x2="26" y2="18"/><line x1="8" y1="24" x2="24" y2="24"/></g></svg>';
    }
    if ((code >= 51 && code <= 67) || (code >= 80 && code <= 82)) {
      return '<svg viewBox="0 0 32 32"><path d="M22 16 L8 16 A6 6 0 0 1 8 8 A4 4 0 0 1 14 6 A6 6 0 0 1 24 10 A4 4 0 0 1 22 16 Z"/><g stroke="currentColor" stroke-width="2" fill="none"><line x1="10" y1="20" x2="8" y2="26"/><line x1="16" y1="20" x2="14" y2="26"/><line x1="22" y1="20" x2="20" y2="26"/></g></svg>';
    }
    if ((code >= 71 && code <= 77) || code === 85 || code === 86) {
      return '<svg viewBox="0 0 32 32"><g stroke="currentColor" stroke-width="1.5"><circle cx="16" cy="16" r="1.5" fill="currentColor"/><line x1="16" y1="4" x2="16" y2="28"/><line x1="4" y1="16" x2="28" y2="16"/><line x1="7" y1="7" x2="25" y2="25"/><line x1="7" y1="25" x2="25" y2="7"/></g></svg>';
    }
    if (code >= 95) {
      return '<svg viewBox="0 0 32 32"><path d="M22 14 L8 14 A6 6 0 0 1 8 6 A4 4 0 0 1 14 4 A6 6 0 0 1 24 8 A4 4 0 0 1 22 14 Z"/><path d="M14 14 L10 22 L14 22 L12 28 L20 18 L16 18 L18 14 Z"/></svg>';
    }
    return '<svg viewBox="0 0 32 32"><circle cx="16" cy="16" r="6"/></svg>';
  }

  function compassPoint(deg){
    var dirs = ['N','NNE','NE','ENE','E','ESE','SE','SSE','S','SSW','SW','WSW','W','WNW','NW','NNW'];
    return dirs[Math.round(deg / 22.5) % 16];
  }

  function initWeather(){
    var meta = document.querySelector('meta[name="forte-club-coords"]');
    if (!meta) return; // No coords = no widget
    var coords = meta.getAttribute('content').split(',');
    if (coords.length !== 2) return;
    var lat = parseFloat(coords[0]);
    var lng = parseFloat(coords[1]);
    if (isNaN(lat) || isNaN(lng)) return;

    var url = 'https://api.open-meteo.com/v1/forecast?latitude=' + lat +
              '&longitude=' + lng +
              '&current=temperature_2m,weather_code,wind_speed_10m,wind_direction_10m' +
              '&wind_speed_unit=mph&temperature_unit=celsius&timezone=Europe/London';

    fetch(url).then(function(r){ return r.json(); }).then(function(data){
      if (!data || !data.current) return;
      var c = data.current;
      var temp = Math.round(c.temperature_2m);
      var code = c.weather_code;
      var wind = Math.round(c.wind_speed_10m);
      var windDir = c.wind_direction_10m;
      var dirText = compassPoint(windDir);

      var w = document.createElement('div');
      w.className = 'forte-weather';
      w.setAttribute('aria-label', 'Current weather at the course');
      w.innerHTML = [
        '<div class="forte-weather-row">',
        '  <span class="forte-weather-icon">' + getWeatherIconSVG(code) + '</span>',
        '  <span class="forte-weather-temp">' + temp + '°</span>',
        '  <span class="forte-weather-meta">',
        '    <span class="forte-weather-wind">',
        '      <span class="forte-weather-arrow" style="transform:rotate(' + (windDir + 180) + 'deg)">↑</span>',
        '      ' + wind + ' mph ' + dirText,
        '    </span>',
        '  </span>',
        '</div>',
        '<div class="forte-weather-label">Live · at the course</div>'
      ].join('');
      document.body.appendChild(w);
      requestAnimationFrame(function(){
        setTimeout(function(){ w.classList.add('is-loaded'); }, 80);
      });
    }).catch(function(){ /* silent — no widget if API fails */ });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', function(){
      initChapters();
      initWeather();
    });
  } else {
    initChapters();
    initWeather();
  }
})();
