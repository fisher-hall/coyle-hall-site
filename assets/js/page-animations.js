/**
 * page-animations.js
 * Shared animation utilities for Coyle Hall inner pages.
 * Loaded globally — provides CoyleAnim.initWave, initParallax, initFadeIn.
 */
(function () {
  'use strict';

  window.CoyleAnim = window.CoyleAnim || {};

  /* Respect the user's reduced-motion preference. */
  function prefersReducedMotion() {
    return document.documentElement.matches('[data-motion="reduced"]') ||
      (window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches);
  }

  /**
   * initWave(canvasId)
   * Animates a canvas with a smooth sine-wave fill using --background-color.
   */
  CoyleAnim.initWave = function (canvasId) {
    var canvas = document.getElementById(canvasId);
    if (!canvas) return;
    var ctx = canvas.getContext('2d');
    var animId;
    var time = 0;

    function resize() {
      var rect = canvas.getBoundingClientRect();
      canvas.width = rect.width;
      canvas.height = rect.height;
    }
    resize();
    window.addEventListener('resize', resize);

    function getColor() {
      return getComputedStyle(document.documentElement)
        .getPropertyValue('--background-color').trim() || '#ffffff';
    }

    function drawWave(amplitudes, frequencies, speeds, opacity, yOffset) {
      ctx.globalAlpha = opacity;
      ctx.fillStyle = getColor();
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      var base = 10, vert = 6 * Math.sin(time * 0.02), rec = 2 * Math.sin(time * 0.015);
      drawWave([base + rec, (base + rec) * 0.15], [0.6, 0.9], [0.8, 0.6], 1, canvas.height * 0.38 + vert);
    }

    function animate() {
      renderFrame();
      time += 0.8;
      animId = requestAnimationFrame(animate);
    }

    /* Reduced motion: draw one static frame, no rAF loop. */
    function stopWave() { cancelAnimationFrame(animId); animId = null; }
    function startWave() {
      if (animId) return;
      if (prefersReducedMotion()) { renderFrame(); return; }
      animate();
    }

    /* Listen for manual-pref changes from the a11y panel. */
    document.addEventListener("a11y:change", function () {
      if (prefersReducedMotion()) { stopWave(); renderFrame(); }
      else startWave();
    });

    if (prefersReducedMotion()) {
      renderFrame();
      window.addEventListener("resize", function () { resize(); renderFrame(); });
      return;
    }

    animate();

    window.addEventListener("beforeunload", function () { cancelAnimationFrame(animId); });
  };

  /**
   * initParallax(options)
   * Sets --page-parallax-y on scroll so .page-parallax-layer moves with parallax.
   * options.multiplier: scroll multiplier (default -0.18)
   */
  CoyleAnim.initParallax = function (options) {
    var opts = options || {};
    var multiplier = opts.multiplier !== undefined ? opts.multiplier : -0.12;
    var frame = null;
    var root = document.documentElement;

    /* Reduced motion: leave the layer static — never bind scroll parallax. */
    if (prefersReducedMotion()) return;

    function update() {
      var scrollY = window.scrollY || window.pageYOffset || 0;
      root.style.setProperty('--page-parallax-bg-y', Math.max(-90, scrollY * multiplier) + 'px');
    }

    function queue() {
      if (frame !== null) return;
      frame = requestAnimationFrame(function () { update(); frame = null; });
    }

    update();
    window.addEventListener('scroll', queue, { passive: true });
    window.addEventListener('resize', queue, { passive: true });
  };

  /**
   * initFadeIn(selector)
   * Adds .visible to elements when they scroll into view.
   * Default selector: '.fade-in-section'
   */
  CoyleAnim.initFadeIn = function (selector) {
    var sel = selector || '.fade-in-section';
    var faders = document.querySelectorAll(sel);
    if (!faders.length) return;
    /* Mark elements now so CSS hides them — anything not yet marked
       stays visible, preventing a flash of invisible content on slow loads. */
    faders.forEach(function (el) { el.classList.add('fade-ready'); });
    var observer = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });
    faders.forEach(function (el) { observer.observe(el); });
  };

  /* Auto-initialise: every page gets fade-in; pages with the inner-page
     banner wave canvas also get the wave + parallax. Replaces the per-page
     inline init scripts. (The homepage keeps its own bespoke wave/parallax.) */
  function autoInit() {
    CoyleAnim.initFadeIn();
    if (document.getElementById('page-wave-canvas')) {
      CoyleAnim.initWave('page-wave-canvas');
      CoyleAnim.initParallax();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', autoInit);
  } else {
    autoInit();
  }

})();
