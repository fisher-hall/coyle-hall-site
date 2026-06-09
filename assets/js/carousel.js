/* ───────────────────────────────────────────────────────────────
   CAROUSEL — one controller for every .Carousel on the site.
   Replaces the per-event inline scripts on Car Smash and Regatta.

   For each .Carousel it wires prev/next buttons, builds dot
   navigation into the sibling .Carousel-dots, and autoplays
   (default 3500ms, override with data-interval). Autoplay pauses on
   hover, focus, and when the tab is hidden.
─────────────────────────────────────────────────────────────── */
(function () {
  function initCarousel(carousel) {
    var track = carousel.querySelector(".Carousel-track");
    var slides = Array.prototype.slice.call(
      carousel.querySelectorAll(".Carousel-slide")
    );
    if (!track || slides.length === 0) return;

    var prevButton = carousel.querySelector(".Carousel-control--prev");
    var nextButton = carousel.querySelector(".Carousel-control--next");
    var dotsContainer = carousel.parentElement
      ? carousel.parentElement.querySelector(".Carousel-dots")
      : null;
    var intervalMs = parseInt(carousel.dataset.interval, 10) || 3500;

    var currentIndex = 0;
    var autoplayId = null;
    var dots = [];

    function render(index) {
      currentIndex = (index + slides.length) % slides.length;
      track.style.transform = "translateX(-" + currentIndex * 100 + "%)";
      dots.forEach(function (dot, i) {
        dot.classList.toggle("active", i === currentIndex);
        dot.setAttribute("aria-current", i === currentIndex ? "true" : "false");
      });
    }

    function stop() {
      if (autoplayId !== null) {
        window.clearInterval(autoplayId);
        autoplayId = null;
      }
    }

    function start() {
      if (slides.length < 2) return;
      // Respect reduced-motion (OS preference or the accessibility panel):
      // never auto-advance; manual prev/next/dots still work.
      if (document.documentElement.getAttribute("data-motion") === "reduced") return;
      stop();
      autoplayId = window.setInterval(function () {
        render(currentIndex + 1);
      }, intervalMs);
    }

    function goTo(index) {
      render(index);
      start();
    }

    if (dotsContainer) {
      slides.forEach(function (_, index) {
        var dot = document.createElement("button");
        dot.type = "button";
        dot.className = "Carousel-dot";
        dot.setAttribute("aria-label", "Go to slide " + (index + 1));
        dot.addEventListener("click", function () {
          goTo(index);
        });
        dotsContainer.appendChild(dot);
      });
      dots = Array.prototype.slice.call(
        dotsContainer.querySelectorAll(".Carousel-dot")
      );
    }

    if (prevButton) prevButton.addEventListener("click", function () { goTo(currentIndex - 1); });
    if (nextButton) nextButton.addEventListener("click", function () { goTo(currentIndex + 1); });

    carousel.addEventListener("mouseenter", stop);
    carousel.addEventListener("mouseleave", start);
    carousel.addEventListener("focusin", stop);
    carousel.addEventListener("focusout", function (event) {
      if (!carousel.contains(event.relatedTarget)) start();
    });
    document.addEventListener("visibilitychange", function () {
      if (document.hidden) stop();
      else start();
    });

    render(0);
    start();
  }

  function init() {
    document.querySelectorAll(".Carousel").forEach(initCarousel);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
