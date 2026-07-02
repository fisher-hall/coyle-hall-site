'use strict';

/* ── Bio panel toggles (event delegation) ────────────────────── */
function openBio(btn, bio) {
  btn.setAttribute('aria-expanded', 'true');
  bio.setAttribute('aria-hidden', 'false');
  bio.dataset.open = '';
}

document.addEventListener('click', function (e) {
  const btn = e.target.closest('.cc-bio-btn');
  if (!btn) return;
  const card = btn.closest('.cc-card');
  if (!card) return;
  const bio = card.querySelector('.cc-bio');
  if (!bio) return;

  const open = btn.getAttribute('aria-expanded') === 'true';
  if (open) {
    btn.setAttribute('aria-expanded', 'false');
    bio.setAttribute('aria-hidden', 'true');
    delete bio.dataset.open;
  } else {
    openBio(btn, bio);
  }
});

/* ── Highlight + scroll a card/row that a deep link points at ──── */
function revealTarget(target) {
  requestAnimationFrame(function () {
    target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    target.focus({ preventScroll: true });
    target.classList.add('profile-highlight');
    setTimeout(function () { target.classList.remove('profile-highlight'); }, 2500);
  });
}

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
  // who only live in the collapsed "Past ___" accordion, and #member-<slug>
  // for current members whose card is already on the page but whose bio
  // panel is collapsed. Open whichever's needed and bring the row into view.
  function focusHashTarget() {
    const hash = window.location.hash;
    if (!hash) return;
    const id = hash.slice(1);

    if (id.indexOf('past-') === 0) {
      const target = document.getElementById(id);
      if (!target || !body.contains(target)) return;
      if (btn.getAttribute('aria-expanded') !== 'true') {
        openPastBody(btn, body);
      }
      revealTarget(target);
    } else if (id.indexOf('member-') === 0) {
      const card = document.getElementById(id);
      if (!card) return;
      const cardBtn = card.querySelector('.cc-bio-btn');
      const cardBio = card.querySelector('.cc-bio');
      if (cardBtn && cardBio && cardBtn.getAttribute('aria-expanded') !== 'true') {
        openBio(cardBtn, cardBio);
      }
      revealTarget(card);
    }
  }

  focusHashTarget();
  window.addEventListener('hashchange', focusHashTarget);
}

if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', initPast);
} else {
  initPast();
}
