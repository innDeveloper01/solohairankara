/* ─────────────────────────────────────────
   SOLO HAIR STUDIO — script.js
───────────────────────────────────────── */

/* ── LOADER ── */
(function () {
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  if (!loader || !progress) return;

  let pct = 0;
  const step = () => {
    pct += Math.random() * 18 + 5;
    if (pct > 100) pct = 100;
    progress.style.width = pct + '%';
    if (pct < 100) {
      setTimeout(step, 80);
    } else {
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
      }, 400);
    }
  };

  document.body.style.overflow = 'hidden';
  setTimeout(step, 200);
})();


/* ── CUSTOM CURSOR ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor || !follower) return;

  let mx = 0, my = 0;
  let fx = 0, fy = 0;
  let raf;

  document.addEventListener('mousemove', (e) => {
    mx = e.clientX;
    my = e.clientY;
    cursor.style.left = mx + 'px';
    cursor.style.top  = my + 'px';
  });

  function animateFollower() {
    fx += (mx - fx) * 0.10;
    fy += (my - fy) * 0.10;
    follower.style.left = fx + 'px';
    follower.style.top  = fy + 'px';
    raf = requestAnimationFrame(animateFollower);
  }
  animateFollower();
})();


/* ── NOISE CANVAS ── */
(function () {
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w, h, imageData, data;

  function resize() {
    w = canvas.width  = window.innerWidth;
    h = canvas.height = window.innerHeight;
    imageData = ctx.createImageData(w, h);
    data = imageData.data;
  }

  function drawNoise() {
    for (let i = 0; i < data.length; i += 4) {
      const val = (Math.random() * 255) | 0;
      data[i] = data[i+1] = data[i+2] = val;
      data[i+3] = 255;
    }
    ctx.putImageData(imageData, 0, 0);
  }

  let tick = 0;
  function loop() {
    tick++;
    if (tick % 3 === 0) drawNoise();
    requestAnimationFrame(loop);
  }

  resize();
  window.addEventListener('resize', resize);
  loop();
})();


/* ── NAV SCROLL + MOBILE TOGGLE ── */
(function () {
  const nav    = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links  = document.getElementById('navLinks');

  if (nav) {
    window.addEventListener('scroll', () => {
      nav.classList.toggle('scrolled', window.scrollY > 60);
    }, { passive: true });
  }

  if (toggle && links) {
    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
    });

    links.querySelectorAll('a').forEach(a => {
      a.addEventListener('click', () => {
        links.classList.remove('open');
        toggle.classList.remove('open');
      });
    });
  }
})();


/* ── SCROLL REVEAL ── */
(function () {
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;

  const delays = [0, 0.1, 0.2, 0.15, 0.25, 0.05];

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = el.parentElement
        ? [...el.parentElement.querySelectorAll('[data-reveal]')]
        : [el];
      const idx = siblings.indexOf(el);
      const delay = delays[idx % delays.length];
      el.style.transitionDelay = delay + 's';
      el.classList.add('revealed');
      io.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => io.observe(el));
})();


/* ── SERVICE CARDS STAGGER ── */
(function () {
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay =
        (parseInt(entry.target.dataset.idx || 0) * 0.07) + 's';
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.1, rootMargin: '0px 0px -30px 0px' });

  cards.forEach((c, i) => {
    c.dataset.idx = i;
    c.setAttribute('data-reveal', '');
    io.observe(c);
  });
})();


/* ── GALLERY ITEMS STAGGER ── */
(function () {
  const items = document.querySelectorAll('.gallery-item');
  if (!items.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (!entry.isIntersecting) return;
      const idx = parseInt(entry.target.dataset.idx || 0);
      entry.target.style.transitionDelay = (idx * 0.08) + 's';
      entry.target.classList.add('revealed');
      io.unobserve(entry.target);
    });
  }, { threshold: 0.08 });

  items.forEach((item, i) => {
    item.dataset.idx = i;
    item.setAttribute('data-reveal', '');
    item.style.opacity = '0';
    item.style.transform = 'translateY(30px)';
    item.style.transition = 'opacity 0.7s cubic-bezier(0.16,1,0.3,1), transform 0.7s cubic-bezier(0.16,1,0.3,1)';
    io.observe(item);
  });
})();


/* ── COUNTER ANIMATION ── */
(function () {
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;

  function easeOutQuart(t) {
    return 1 - Math.pow(1 - t, 4);
  }

  function animateCounter(el) {
    const target = parseInt(el.dataset.count, 10);
    const duration = 1800;
    const start = performance.now();
    const suffix = target >= 1000 ? '+' : '+';

    const tick = (now) => {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = easeOutQuart(progress);
      const current = Math.round(eased * target);
      el.textContent = current >= 1000
        ? (current / 1000).toFixed(1) + 'k'
        : current;
      if (progress < 1) requestAnimationFrame(tick);
      else el.textContent = target >= 1000
        ? (target / 1000).toFixed(0) + 'k+'
        : target + '+';
    };
    requestAnimationFrame(tick);
  }

  const io = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      animateCounter(entry.target);
      io.unobserve(entry.target);
    });
  }, { threshold: 0.5 });

  nums.forEach(el => io.observe(el));
})();


/* ── FLOATING WA BUTTON ── */
(function () {
  const btn = document.getElementById('waFloat');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    btn.classList.toggle('visible', window.scrollY > 300);
  }, { passive: true });
})();


/* ── PARALLAX HERO IMAGE ── */
(function () {
  const img = document.getElementById('heroImg');
  if (!img) return;
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

  function onScroll() {
    const scrollY = window.scrollY;
    if (scrollY > window.innerHeight) return;
    img.style.transform = `scale(1) translateY(${scrollY * 0.25}px)`;
  }

  window.addEventListener('scroll', onScroll, { passive: true });
})();


/* ── HERO SCROLL FADE ── */
(function () {
  const heroScroll = document.getElementById('heroScroll');
  if (!heroScroll) return;

  window.addEventListener('scroll', () => {
    const opacity = Math.max(0, 1 - window.scrollY / 220);
    heroScroll.style.opacity = opacity;
  }, { passive: true });
})();


/* ── MAGNETIC BUTTONS (desktop only) ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  const btns = document.querySelectorAll('.contact-btn, .btn, .wa-float');

  btns.forEach(btn => {
    btn.addEventListener('mousemove', (e) => {
      const rect = btn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dx = (e.clientX - cx) * 0.18;
      const dy = (e.clientY - cy) * 0.18;
      btn.style.transform = `translate(${dx}px, ${dy}px)`;
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform = '';
    });
  });
})();


/* ── SMOOTH ANCHOR SCROLL ── */
(function () {
  document.querySelectorAll('a[href^="#"]').forEach(a => {
    a.addEventListener('click', (e) => {
      const id = a.getAttribute('href');
      if (id === '#') return;
      const target = document.querySelector(id);
      if (!target) return;
      e.preventDefault();
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    });
  });
})();


/* ── HERO BADGE SLOW SPIN (no CSS animation needed) ── */
(function () {
  const badge = document.querySelector('.hero-badge-inner');
  if (!badge) return;
  badge.style.animation = 'none';
})();


/* ── TILT EFFECT on service cards (desktop) ── */
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  - 0.5) * 6;
      const y = ((e.clientY - rect.top)  / rect.height - 0.5) * 6;
      card.style.transform = `perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
})();
