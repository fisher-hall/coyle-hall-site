'use strict';

/* ── Bio panel toggles (event delegation) ────────────────────── */
document.addEventListener('click', function (e) {
  const btn = e.target.closest('.cc-bio-btn');
  if (!btn) return;
  const card = btn.closest('.cc-card');
  if (!card) return;
  const bio = card.querySelector('.cc-bio');
  if (!bio) return;

  const open = btn.getAttribute('aria-expanded') === 'true';
  btn.setAttribute('aria-expanded', String(!open));
  bio.setAttribute('aria-hidden', String(open));
  if (open) {
    delete bio.dataset.open;
  } else {
    bio.dataset.open = '';
  }
});

/* ── Past Commissioners/Staff/Government accordion ───────────── */
function openPastBody(btn, body) {
  btn.setAttribute('aria-expanded', 'true');
  body.dataset.open = '';
  body.querySelectorAll('img[data-src]').forEach(function (img) {
    img.src = img.dataset.src;
    img.removeAttribute('data-src');
  });
}

function initPast() {
  const btn  = document.getElementById('past-toggle');
  const body = document.getElementById('past-body');
  if (!btn || !body) return;

  btn.addEventListener('click', function () {
    const open = btn.getAttribute('aria-expanded') === 'true';
    if (open) {
      btn.setAttribute('aria-expanded', 'false');
      delete body.dataset.open;
    } else {
      openPastBody(btn, body);
    }
  });

  // Search results and other deep links point at #past-<slug> for members
  // who only live in the collapsed "Past ___" accordion. Open it and bring
  // the matching row into view instead of landing on a hidden element.
  function focusPastTarget() {
    const hash = window.location.hash;
    if (!hash || hash.indexOf('#past-') !== 0) return;
    const target = document.getElementById(hash.slice(1));
    if (!target || !body.contains(target)) return;

    if (btn.getAttribute('aria-expanded') !== 'true') {
      openPastBody(btn, body);
    }
    requestAnimationFrame(function () {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
      target.focus({ preventScroll: true });
      target.classList.add('past-highlight');
      setTimeout(function () { target.classList.remove('past-highlight'); }, 2500);
    });
  }

  focusPastTarget();
  window.addEventListener('hashchange', focusPastTarget);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPast);
} else {
  initPast();
}
