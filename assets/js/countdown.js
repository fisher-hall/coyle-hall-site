/* ───────────────────────────────────────────────────────────────
   COUNTDOWN — one controller for every countdown on the site.
   Replaces the old per-event scripts (Countdown.js, regatta-Countdown.js,
   car-smash-countdown.js, ironRA-Countdown.js).

   Markup:
     <div data-countdown data-target-date="2026-08-21T09:00:00">
       <div class="CountdownGrid …">
         <span class="CountdownBlock-number" data-unit="days">00</span>  …
         <span class="CountdownBlock-number" data-unit="hours">00</span>
         <span class="CountdownBlock-number" data-unit="mins">00</span>
         <span class="CountdownBlock-number" data-unit="secs">00</span>
       </div>
     </div>

   Behaviour:
     • Cells are matched by [data-unit] *within* the container, so multiple
       countdowns can coexist on one page with no id collisions.
     • Labels beside each number switch to singular at exactly 1 (Day/Hour/
       Minute/Second) and plural otherwise.
     • When the target passes, all cells read "0" and the [data-countdown]
       element is hidden — unless it carries [data-countdown-keep] (then it
       stays visible showing zeros, matching the old Iron RA behaviour).
─────────────────────────────────────────────────────────────── */
(function () {
  function start(root) {
    var target = new Date(root.dataset.targetDate).getTime();
    if (Number.isNaN(target)) return;

    var cells = {
      days: root.querySelector('[data-unit="days"]'),
      hours: root.querySelector('[data-unit="hours"]'),
      mins: root.querySelector('[data-unit="mins"]'),
      secs: root.querySelector('[data-unit="secs"]'),
    };
    var keep = root.hasAttribute("data-countdown-keep");
    var timer = null;

    // Each number is followed by its label; swap to the singular at exactly 1
    // ("1 Day", "1 Hour", ...) and the plural otherwise (including 0).
    var names = { days: "Day", hours: "Hour", mins: "Minute", secs: "Second" };

    function put(unit, value) {
      var cell = cells[unit];
      if (!cell) return;
      cell.textContent = value;
      var label = cell.nextElementSibling;
      if (label && label.classList.contains("CountdownBlock-label")) {
        label.textContent = names[unit] + (value === 1 ? "" : "s");
      }
    }

    function set(d, h, m, s) {
      put("days", d);
      put("hours", h);
      put("mins", m);
      put("secs", s);
    }

    function tick() {
      var distance = target - Date.now();
      if (distance <= 0) {
        set(0, 0, 0, 0);
        if (!keep) root.style.display = "none";
        if (timer) clearInterval(timer);
        return;
      }
      var day = 1000 * 60 * 60 * 24;
      set(
        Math.floor(distance / day),
        Math.floor((distance % day) / (1000 * 60 * 60)),
        Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60)),
        Math.floor((distance % (1000 * 60)) / 1000)
      );
    }

    tick();
    timer = setInterval(tick, 1000);
  }

  function init() {
    document.querySelectorAll("[data-countdown]").forEach(start);
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
