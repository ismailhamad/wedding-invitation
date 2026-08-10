/* ══════════════════════════════════════════════════════
   Wedding Invitation — Main JavaScript
   Groom: Ismail | Bride: Sara | Date: 13 Aug 2026
   Venue: Violet Hall
══════════════════════════════════════════════════════ */

import './style.css';

/* ──────────────────────────────────────────
   1. GLOBAL CONFIG
────────────────────────────────────────── */
let envelopeOpened = false;
let autoScrollActive = false;
let scrollControl;
let resumeTimeout;

const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
const scrollSpeed = isMobile ? 0.9 : 1.1;

/* ──────────────────────────────────────────
   2. SMART AUTO SCROLL ENGINE
────────────────────────────────────────── */
function startAutoScroll() {
  if (!envelopeOpened || autoScrollActive) return;
  autoScrollActive = true;

  function step() {
    if (!autoScrollActive) return;
    window.scrollBy(0, scrollSpeed);

    const isEnd = (window.innerHeight + window.pageYOffset) >= (document.body.scrollHeight - 5);
    if (isEnd) {
      autoScrollActive = false;
      cancelAnimationFrame(scrollControl);
    } else {
      scrollControl = requestAnimationFrame(step);
    }
  }
  scrollControl = requestAnimationFrame(step);
}

function stopAutoScroll() {
  autoScrollActive = false;
  cancelAnimationFrame(scrollControl);
  clearTimeout(resumeTimeout);
}

function handleUserInteraction() {
  if (!envelopeOpened) return;
  stopAutoScroll();
  resumeTimeout = setTimeout(() => {
    startAutoScroll();
  }, 2500);
}

window.addEventListener("touchstart", handleUserInteraction, { passive: true });
window.addEventListener("wheel", handleUserInteraction, { passive: true });
window.addEventListener("mousedown", handleUserInteraction, { passive: true });

/* ──────────────────────────────────────────
   3. PETALS ANIMATION
────────────────────────────────────────── */
(function initPetals() {
  const items = ['🌸', '🌷', '🌹', '✿', '❀'];
  const count = isMobile ? 10 : 20;
  for (let i = 0; i < count; i++) {
    const el = document.createElement('div');
    el.className = 'petal';
    el.textContent = items[i % items.length];
    el.style.cssText = `
      left:${Math.random() * 100}%;
      font-size:${9 + Math.random() * 9}px;
      animation-duration:${11 + Math.random() * 12}s;
      animation-delay:${Math.random() * 16}s;
      will-change: transform;
    `;
    document.body.appendChild(el);
  }
})();

/* ──────────────────────────────────────────
   4. COUNTDOWN TIMER
────────────────────────────────────────── */
function tick() {
  const target = new Date('2026-08-13T19:00:00').getTime();
  const now = new Date().getTime();
  const diff = target - now;

  if (diff < 0) {
    document.getElementById('wlD').textContent = '🎉';
    document.getElementById('wlH').textContent = '🎉';
    document.getElementById('wlM').textContent = '🎉';
    document.getElementById('wlS').textContent = '🎉';
    return;
  }

  const pad = v => String(v).padStart(2, '0');
  const d = pad(Math.floor(diff / (1000 * 60 * 60 * 24)));
  const h = pad(Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)));
  const m = pad(Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)));
  const s = pad(Math.floor((diff % (1000 * 60)) / 1000));

  const els = { 'wlD': d, 'wlH': h, 'wlM': m, 'wlS': s };
  for (let id in els) {
    const el = document.getElementById(id);
    if (el) el.textContent = els[id];
  }
}
setInterval(tick, 1000);
tick();

/* ──────────────────────────────────────────
   5. INTERSECTION OBSERVER (Reveal)
────────────────────────────────────────── */
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => {
    if (e.isIntersecting) {
      e.target.classList.add('visible');
      observer.unobserve(e.target);
    }
  });
}, { threshold: 0.1 });

/* ──────────────────────────────────────────
   6. ENVELOPE OPEN LOGIC
────────────────────────────────────────── */
window.openEnvelope = function() {
  if (envelopeOpened) return;
  envelopeOpened = true;

  const screen = document.getElementById('env-screen');
  const invitation = document.getElementById('invitation');

  screen.classList.add('tapped');

  // Wait for ripple animation, then reveal invitation
  setTimeout(() => {
    screen.classList.add('hide');
    invitation.classList.add('show');

    // Start background music
    playMusic();

    // Observe all reveal elements
    document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

    // Start auto scroll after a brief pause
    setTimeout(startAutoScroll, 800);
  }, 900);
};

/* ──────────────────────────────────────────
   7. SCROLL HINT BUTTON
────────────────────────────────────────── */
const scrollHintBtn = document.getElementById('scrollHintBtn');
if (scrollHintBtn) {
  scrollHintBtn.addEventListener('click', () => {
    const welcome = document.querySelector('.s-welcome');
    if (welcome) welcome.scrollIntoView({ behavior: 'smooth' });
  });
}

/* ──────────────────────────────────────────
   8. BACKGROUND MUSIC
────────────────────────────────────────── */
const music = document.getElementById('bgMusic');
const musicToggle = document.getElementById('musicToggle');
let musicPlaying = false;

function playMusic() {
  if (!music) return;
  music.volume = 0.35;
  music.play().then(() => {
    musicPlaying = true;
    if (musicToggle) {
      musicToggle.classList.add('visible');
      musicToggle.classList.remove('is-muted');
    }
  }).catch(() => {
    // Autoplay blocked — show toggle as muted
    if (musicToggle) {
      musicToggle.classList.add('visible');
      musicToggle.classList.add('is-muted');
    }
  });
}

if (musicToggle) {
  musicToggle.addEventListener('click', () => {
    if (!music) return;
    if (musicPlaying) {
      music.pause();
      musicPlaying = false;
      musicToggle.classList.add('is-muted');
    } else {
      music.play().then(() => {
        musicPlaying = true;
        musicToggle.classList.remove('is-muted');
      }).catch(() => {});
    }
  });
}

/* ──────────────────────────────────────────
   9. TOAST NOTIFICATION
────────────────────────────────────────── */
function showToast(msg) {
  const t = document.getElementById('toast');
  if (!t) return;
  t.textContent = msg;
  t.classList.add('show');
  setTimeout(() => t.classList.remove('show'), 3500);
}

/* ──────────────────────────────────────────
   10. PARALLAX EFFECT ON HERO
────────────────────────────────────────── */
window.addEventListener('scroll', () => {
  const hero = document.querySelector('.hero-bg-img');
  if (!hero) return;

  const rect = hero.getBoundingClientRect();
  if (rect.bottom > 0 && rect.top < window.innerHeight) {
    const offset = window.pageYOffset * 0.3;
    hero.style.transform = `translateY(${offset}px)`;
  }
}, { passive: true });

