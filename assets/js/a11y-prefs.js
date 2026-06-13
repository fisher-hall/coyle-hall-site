/* Accessibility preferences panel.
   The store + early application live in the inline script in
   partials/essentials/head.html (window.__a11y), so prefs apply before
   paint with no flash. This module only wires the panel UI, keeps it in
   sync with the navbar theme toggle, and re-applies "System" options when
   the underlying OS media queries change. */
(function () {
  "use strict";
  var store = window.__a11y;
  if (!store) return;

  // Slider step mappings
  var TEXT_SIZE_STEPS = ['xs', 's', 'default', 'large', 'xl', '2xl', '3xl'];
  var TEXT_WEIGHT_STEPS = ['light', 'default', 'semibold', 'bold', 'extrabold'];
  var SLIDER_LABELS = { 'text-size': TEXT_SIZE_STEPS, 'text-weight': TEXT_WEIGHT_STEPS };

  document.addEventListener("DOMContentLoaded", function () {
    var overlay = document.querySelector("[data-a11y-overlay]");
    var dialog = overlay && overlay.querySelector(".a11y-panel");
    var openBtn = document.querySelector("[data-a11y-open]");
    if (!overlay || !dialog || !openBtn) return;

    var lastFocused = null;

    function reflect() {
      // Segmented controls
      overlay.querySelectorAll("[data-a11y-seg]").forEach(function (group) {
        var pref = group.getAttribute("data-a11y-seg");
        var current = store.get(pref);
        group.querySelectorAll("button[data-value]").forEach(function (b) {
          b.setAttribute("aria-pressed", String(b.getAttribute("data-value") === current));
        });
      });
      // On/off switches
      overlay.querySelectorAll("[data-a11y-toggle]").forEach(function (sw) {
        var pref = sw.getAttribute("data-a11y-toggle");
        sw.setAttribute("aria-checked", String(store.get(pref) === "on"));
      });
      // Reflect sliders
      overlay.querySelectorAll("[data-a11y-slider]").forEach(function (slider) {
        var pref = slider.getAttribute("data-a11y-slider");
        var current = store.get(pref);
        var steps = SLIDER_LABELS[pref];
        if (steps) {
          var idx = steps.indexOf(current);
          if (idx === -1) idx = pref === 'text-size' ? 2 : 1; // default index
          slider.value = idx;
          slider.setAttribute("aria-valuetext", steps[idx]);
        }
      });
      // Reflect "Follow System" checkboxes + grey out state
      overlay.querySelectorAll("[data-a11y-sys]").forEach(function (cb) {
        var pref = cb.getAttribute("data-a11y-sys");
        var isSystem = store.get(pref) === "system";
        cb.checked = isSystem;
        var field = cb.closest(".a11y-field");
        if (field) field.setAttribute("data-sys-active", isSystem ? "true" : "false");
      });
    }

    // Segmented choice groups
    overlay.querySelectorAll("[data-a11y-seg]").forEach(function (group) {
      var pref = group.getAttribute("data-a11y-seg");
      group.querySelectorAll("button[data-value]").forEach(function (b) {
        b.addEventListener("click", function () {
          store.set(pref, b.getAttribute("data-value"));
          // Un-check the system checkbox for this field when manually choosing
          var field = group.closest(".a11y-field");
          var sysCb = field && field.querySelector("[data-a11y-sys]");
          if (sysCb) sysCb.checked = false;
          reflect();
        });
      });
    });

    // On/off switches
    overlay.querySelectorAll("[data-a11y-toggle]").forEach(function (sw) {
      var pref = sw.getAttribute("data-a11y-toggle");
      sw.addEventListener("click", function () {
        store.set(pref, store.get(pref) === "on" ? "off" : "on");
        reflect();
      });
    });

    // Wire sliders
    overlay.querySelectorAll("[data-a11y-slider]").forEach(function (slider) {
      var pref = slider.getAttribute("data-a11y-slider");
      slider.addEventListener("input", function () {
        var steps = SLIDER_LABELS[pref];
        var val = steps[parseInt(slider.value, 10)];
        store.set(pref, val);
        slider.setAttribute("aria-valuetext", val);
        // Un-check the system checkbox for this field when manually sliding
        var field = slider.closest(".a11y-field");
        var sysCb = field && field.querySelector("[data-a11y-sys]");
        if (sysCb) sysCb.checked = false;
        reflect();
      });
    });

    // Wire "Follow System" checkboxes
    overlay.querySelectorAll("[data-a11y-sys]").forEach(function (cb) {
      var pref = cb.getAttribute("data-a11y-sys");
      var field = cb.closest(".a11y-field");
      cb.addEventListener("change", function () {
        if (cb.checked) {
          store.set(pref, "system");
        } else {
          // Set a concrete value (the current reflected value, not "system")
          var seg = field && field.querySelector("[data-a11y-seg]");
          var slider = field && field.querySelector("[data-a11y-slider]");
          if (seg) {
            var pressed = seg.querySelector("[aria-pressed=\"true\"]");
            if (pressed) store.set(pref, pressed.getAttribute("data-value"));
          } else if (slider) {
            var steps = SLIDER_LABELS[pref];
            store.set(pref, steps[parseInt(slider.value, 10)]);
          }
        }
        reflect();
      });
    });

    // Reset
    var resetBtn = overlay.querySelector("[data-a11y-reset]");
    if (resetBtn) resetBtn.addEventListener("click", function () { store.reset(); reflect(); });

    // Open / close
    function focusables() {
      return Array.prototype.slice.call(
        dialog.querySelectorAll('button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])')
      ).filter(function (el) { return !el.disabled && el.offsetParent !== null; });
    }
    function open() {
      lastFocused = document.activeElement;
      reflect();
      overlay.hidden = false;
      overlay.classList.add("is-open");
      openBtn.setAttribute("aria-expanded", "true");
      var f = focusables();
      if (f.length) f[0].focus();
    }
    function close() {
      overlay.classList.remove("is-open");
      overlay.hidden = true;
      openBtn.setAttribute("aria-expanded", "false");
      if (lastFocused && lastFocused.focus) lastFocused.focus();
    }

    openBtn.addEventListener("click", open);
    overlay.querySelectorAll("[data-a11y-close]").forEach(function (b) {
      b.addEventListener("click", close);
    });
    overlay.addEventListener("click", function (e) { if (e.target === overlay) close(); });
    document.addEventListener("keydown", function (e) {
      if (overlay.hidden) return;
      if (e.key === "Escape") { close(); return; }
      if (e.key === "Tab") {
        var f = focusables();
        if (!f.length) return;
        var first = f[0], last = f[f.length - 1];
        if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
        else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
      }
    });

    // Keep panel UI in sync when prefs change elsewhere (e.g. navbar toggle)
    document.addEventListener("a11y:change", reflect);

    // Re-apply "System" options live when the OS preferences change
    ["(prefers-color-scheme: dark)", "(prefers-contrast: more)", "(prefers-reduced-motion: reduce)"]
      .forEach(function (q) {
        var mql = window.matchMedia(q);
        var handler = function () { store.apply(); reflect(); };
        if (mql.addEventListener) mql.addEventListener("change", handler);
        else if (mql.addListener) mql.addListener(handler);
      });
  });
})();
