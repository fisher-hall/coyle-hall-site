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

/* ── Past Commissioners accordion ────────────────────────────── */
function initPast() {
  const btn  = document.getElementById('past-toggle');
  const body = document.getElementById('past-body');
  if (!btn || !body) return;

  btn.addEventListener('click', function () {
    const open = btn.getAttribute('aria-expanded') === 'true';
    btn.setAttribute('aria-expanded', String(!open));
    if (open) {
      delete body.dataset.open;
    } else {
      body.dataset.open = '';
      body.querySelectorAll('img[data-src]').forEach(function (img) {
        img.src = img.dataset.src;
        img.removeAttribute('data-src');
      });
    }
  });
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPast);
} else {
  initPast();
}
