/* ───────────────────────────────────────────────────────────────
   home.js — behaviour for the homepage layout.
   Extracted from the page's inline <script> blocks: banner parallax,
   the dual-canvas (gradient + theme) wave, the Instagram feed, and the
   photo ticker. Every block guards on its own elements, so this is safe
   to ship in the global bundle (it no-ops on other pages).
─────────────────────────────────────────────────────────────── */
(function () {
  'use strict';

  /* Respect the user's reduced-motion preference (mirrors the ticker guard). */
  function prefersReducedMotion() {
    return document.documentElement.matches('[data-motion="reduced"]') ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /* ── Banner parallax ─────────────────────────────────────────── */
  function initHomeParallax() {
    if (!document.getElementById('home-banner-wrapper')) return;
    var root = document.documentElement;
    /* Reduced motion: leave the banner static — never bind scroll parallax. */
    if (prefersReducedMotion()) return;
    function update() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      root.style.setProperty('--home-parallax-bg-y', Math.max(-90, scrollY * -0.12) + 'px');
      root.style.setProperty('--home-parallax-text-y', Math.max(-42, scrollY * -0.08) + 'px');
    }
    update();
    window.addEventListener('scroll', update, { passive: true });
  }

  /* ── Dual-canvas wave (gradient banner wave + theme divider wave) ─ */
  function initHomeWaves() {
    var waveTargets = [
      { canvas: document.getElementById('wave-canvas'), colorMode: 'gradient' },
      { canvas: document.getElementById('wave-canvas-divider'), colorMode: 'theme' }
    ]
      .filter(function (t) { return t.canvas; })
      .map(function (t) { t.ctx = t.canvas.getContext('2d'); return t; })
      .filter(function (t) { return t.ctx; });

    if (!waveTargets.length) return;

    var animationId;

    function resizeCanvases() {
      waveTargets.forEach(function (target) {
        var rect = target.canvas.getBoundingClientRect();
        target.canvas.width = rect.width;
        target.canvas.height = rect.height;
      });
    }
    resizeCanvases();
    window.addEventListener('resize', resizeCanvases);

    function isDarkMode() {
      var savedTheme = localStorage.getItem('theme');
      if (savedTheme === 'dark') return true;
      if (savedTheme === 'light') return false;
      var root = document.documentElement;
      if (root.classList.contains('dark')) return true;
      if (root.classList.contains('light')) return false;
      return window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
    }

    function getCSSColor(variable) {
      return getComputedStyle(document.documentElement).getPropertyValue(variable).trim();
    }

    function getWaveColor(target) {
      if (target.canvas.id === 'wave-canvas-divider') {
        // High contrast forces a black page background regardless of theme,
        // so the divider must be black too (not white-on-black).
        var highContrast = document.documentElement.classList.contains('a11y-contrast-high');
        return (highContrast || isDarkMode()) ? '#000000' : '#ffffff';
      }
      if (target.canvas.id === 'wave-canvas') {
        var gradient = target.ctx.createLinearGradient(0, 0, target.canvas.width, 0);
        gradient.addColorStop(0, getCSSColor('--coyle-dark-green') || '#064121');
        gradient.addColorStop(1, getCSSColor('--coyle-light-green') || '#0A8A3F');
        return gradient;
      }
      return '#ffffff';
    }

    var time = 0;

    function drawWave(target, amplitudes, frequencies, speeds, opacity, yOffset, color) {
      var ctx = target.ctx, canvas = target.canvas;
      ctx.globalAlpha = opacity;
      ctx.shadowBlur = 0;
      ctx.shadowColor = 'transparent';
      ctx.fillStyle = color || '#ffffff';
      ctx.beginPath();
      ctx.moveTo(0, canvas.height);
      var points = [];
      for (var x = 0; x <= canvas.width; x += 2) {
        var y = yOffset;
        for (var i = 0; i < amplitudes.length; i++) {
          y += amplitudes[i] * Math.sin((x * frequencies[i] + time * speeds[i]) * Math.PI / 180);
        }
        points.push({ x: x, y: y });
      }
      ctx.lineTo(points[0].x, points[0].y);
      for (var j = 1; j < points.length - 1; j++) {
        var cur = points[j], nxt = points[j + 1];
        ctx.quadraticCurveTo(cur.x, cur.y, (cur.x + nxt.x) / 2, (cur.y + nxt.y) / 2);
      }
      if (points.length > 1) {
        var last = points[points.length - 1];
        ctx.lineTo(last.x, last.y);
      }
      ctx.lineTo(canvas.width, canvas.height);
      ctx.lineTo(0, canvas.height);
      ctx.closePath();
      ctx.fill();
    }

    function renderFrame() {
      waveTargets.forEach(function (target) {
        var ctx = target.ctx, canvas = target.canvas;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        var baseAmplitude = 10;
        var verticalMovement = 6 * Math.sin(time * 0.02);
        var recessionEffect = 2 * Math.sin(time * 0.015);
        var dynamicAmplitude = baseAmplitude + recessionEffect;
        drawWave(
          target,
          [dynamicAmplitude, dynamicAmplitude * 0.15],
          [0.6, 0.9],
          [0.8, 0.6],
          1,
          canvas.height * 0.38 + verticalMovement,
          getWaveColor(target)
        );
      });
    }

    function animate() {
      renderFrame();
      time += 0.8;
      animationId = requestAnimationFrame(animate);
    }
    /* Reduced motion: draw a single static wave frame and stop.
       Listens for a11y:change to restart or re-stop on pref toggle. */
    function stopHomeWave() {
      if (animationId) { cancelAnimationFrame(animationId); animationId = null; }
    }
    function startHomeWave() {
      if (animationId) return;
      if (prefersReducedMotion()) { renderFrame(); return; }
      animate();
    }

    document.addEventListener('a11y:change', function () {
      if (prefersReducedMotion()) { stopHomeWave(); resizeCanvases(); renderFrame(); }
      else startHomeWave();
    });

    window.addEventListener('resize', function () {
      resizeCanvases();
      if (prefersReducedMotion()) renderFrame();
    });

    if (prefersReducedMotion()) {
      renderFrame();
      return;
    }

    animate();

    window.addEventListener('beforeunload', function () {
      if (animationId) cancelAnimationFrame(animationId);
    });
  }

  /* ── Instagram feed (Behold.so) ──────────────────────────────── */
  function initInstagramFeed() {
    var grid = document.getElementById('ig-feed-grid');
    if (!grid) return;
    var loading = document.getElementById('ig-feed-loading');
    var fetched = false;

    function loadFeed() {
      if (fetched) return;
      fetched = true;
      var timeout = setTimeout(function () {
        if (loading && loading.parentNode) {
          loading.textContent = 'Follow us @real_coylehall on Instagram.';
        }
      }, 8000);

      fetch('https://feeds.behold.so/9XCk73VEQkyAaVvvrrBh')
        .then(function (r) { return r.json(); })
        .then(function (data) {
          clearTimeout(timeout);
          if (loading) loading.remove();
          var posts = Array.isArray(data) ? data : (data.posts || data.data || []);
          posts = posts.slice().sort(function (a, b) {
            return new Date(b.timestamp || 0) - new Date(a.timestamp || 0);
          });
          if (!posts.length) {
            grid.innerHTML = '<p style="opacity:0.5;text-align:center;padding:2rem;">No posts found.</p>';
            return;
          }
          // Behold's `sizes` entries expose the persistent behold.pictures URL
          // under `mediaUrl` (NOT `url`). The top-level `mediaUrl` is a short-
          // lived, hotlink-protected cdninstagram.com URL that 403s/expires —
          // reading it was why most tiles rendered blank.
          function pickSize(sizes) {
            if (!sizes) return '';
            var pref = ['medium', 'large', 'small', 'full'];
            for (var i = 0; i < pref.length; i++) {
              var s = sizes[pref[i]];
              if (s && (s.mediaUrl || s.url)) return s.mediaUrl || s.url;
            }
            return '';
          }
          posts.slice(0, 6).forEach(function (post) {
            var imgUrl = pickSize(post.sizes);
            if (!imgUrl && post.children && post.children.length) {
              imgUrl = pickSize(post.children[0].sizes) || post.children[0].mediaUrl || '';
            }
            if (!imgUrl) imgUrl = post.thumbnailUrl || post.mediaUrl || '';
            if (!imgUrl) return;
            var caption = post.caption || '';
            var typeIcon = post.mediaType === 'VIDEO'
              ? '<i class="fa-solid fa-video ig-type-icon" aria-hidden="true"></i>'
              : post.mediaType === 'CAROUSEL_ALBUM'
                ? '<i class="fa-solid fa-images ig-type-icon" aria-hidden="true"></i>'
                : '';
            var a = document.createElement('a');
            a.className = 'ig-post';
            a.href = post.permalink;
            a.target = '_blank';
            a.rel = 'noopener';
            a.setAttribute('aria-label', caption || 'View on Instagram');
            a.innerHTML =
              '<div class="ig-post-img-wrap">' +
                '<img src="' + imgUrl + '" alt="" loading="lazy" decoding="async" ' +
                'onerror="this.closest(\'.ig-post\').style.display=\'none\'">' +
                '<div class="ig-post-overlay">' + typeIcon + '<p>' + caption + '</p></div>' +
              '</div>';
            grid.appendChild(a);
          });
        })
        .catch(function () {
          clearTimeout(timeout);
          if (loading) loading.textContent = 'Follow us @real_coylehall on Instagram.';
        });
    }

    if ('IntersectionObserver' in window) {
      var observer = new IntersectionObserver(function (entries, obs) {
        if (entries[0].isIntersecting) {
          obs.disconnect();
          loadFeed();
        }
      }, { rootMargin: '200px' });
      observer.observe(grid);
    } else {
      loadFeed();
    }
  }

  /* ── Photo ticker ──────────────────────────────────────── */
  function initTicker() {
    var track = document.getElementById('ticker-track');
    if (!track) return;
    var pos = 0;
    var speed = 0.55;
    var targetSpeed = 0.55;
    var normalSpeed = 0.55;
    var slowSpeed = 0.12;
    var halfWidth = 0;
    var tickId = null;
    var running = false;

    track.parentElement.addEventListener('mouseenter', function () { targetSpeed = slowSpeed; });
    track.parentElement.addEventListener('mouseleave', function () { targetSpeed = normalSpeed; });

    function tick() {
      speed += (targetSpeed - speed) * 0.04;
      pos += speed;
      if (halfWidth && pos >= halfWidth) pos -= halfWidth;
      track.style.transform = 'translateX(-' + pos + 'px)';
      if (running) tickId = requestAnimationFrame(tick);
    }

    function stopTicker() {
      running = false;
      if (tickId) { cancelAnimationFrame(tickId); tickId = null; }
    }

    function startTicker() {
      if (running || prefersReducedMotion()) return;
      running = true;
      if (!halfWidth) halfWidth = track.scrollWidth / 2;
      tick();
    }

    /* Arrow buttons — injected into ticker-outer, shown only in reduced-motion mode. */
    var outer = track.parentElement;
    var prevBtn = document.createElement('button');
    prevBtn.type = 'button';
    prevBtn.className = 'ticker-arrow ticker-arrow--prev';
    prevBtn.setAttribute('aria-label', 'Previous photos');
    prevBtn.innerHTML = '<i class="fa-solid fa-chevron-left" aria-hidden="true"></i>';
    var nextBtn = document.createElement('button');
    nextBtn.type = 'button';
    nextBtn.className = 'ticker-arrow ticker-arrow--next';
    nextBtn.setAttribute('aria-label', 'Next photos');
    nextBtn.innerHTML = '<i class="fa-solid fa-chevron-right" aria-hidden="true"></i>';

    outer.style.position = 'relative';
    outer.insertBefore(prevBtn, track);
    outer.appendChild(nextBtn);

    var SCROLL_STEP = 320;
    prevBtn.addEventListener('click', function () {
      pos = Math.max(0, pos - SCROLL_STEP);
      track.style.transform = 'translateX(-' + pos + 'px)';
    });
    nextBtn.addEventListener('click', function () {
      if (halfWidth) pos = (pos + SCROLL_STEP) % halfWidth;
      track.style.transform = 'translateX(-' + pos + 'px)';
    });

    /* Respond to a11y pref changes at runtime. */
    document.addEventListener('a11y:change', function () {
      if (prefersReducedMotion()) stopTicker();
      else startTicker();
    });

    function init() {
      if (prefersReducedMotion()) return;
      halfWidth = track.scrollWidth / 2;
      startTicker();
    }

    if (document.readyState === 'complete') init();
    else window.addEventListener('load', init);
  }
  function boot() {
    initHomeParallax();
    initHomeWaves();
    initInstagramFeed();
    initTicker();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();
