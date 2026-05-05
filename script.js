/* SOLO HAIR STUDIO — script.js */

/* LOADER */
(function(){
  const loader = document.getElementById('loader');
  const progress = document.getElementById('loaderProgress');
  if (!loader||!progress) return;
  let pct = 0;
  document.body.style.overflow = 'hidden';
  const step = () => {
    pct += Math.random()*18+5;
    if (pct>100) pct=100;
    progress.style.width = pct+'%';
    if (pct<100) setTimeout(step,80);
    else setTimeout(()=>{ loader.classList.add('hidden'); document.body.style.overflow=''; }, 400);
  };
  setTimeout(step, 200);
})();

/* CURSOR */
(function(){
  if (window.matchMedia('(pointer:coarse)').matches) return;
  const cursor = document.getElementById('cursor');
  const follower = document.getElementById('cursorFollower');
  if (!cursor||!follower) return;
  let mx=0, my=0, fx=0, fy=0;
  document.addEventListener('mousemove',(e)=>{
    mx=e.clientX; my=e.clientY;
    cursor.style.left=mx+'px'; cursor.style.top=my+'px';
  });
  (function tick(){
    fx+=(mx-fx)*0.10; fy+=(my-fy)*0.10;
    follower.style.left=fx+'px'; follower.style.top=fy+'px';
    requestAnimationFrame(tick);
  })();
})();

/* NOISE */
(function(){
  const canvas = document.getElementById('noiseCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let w,h,imgData,data;
  const resize = () => {
    w=canvas.width=window.innerWidth; h=canvas.height=window.innerHeight;
    imgData=ctx.createImageData(w,h); data=imgData.data;
  };
  const drawNoise = () => {
    for (let i=0;i<data.length;i+=4){
      const v=(Math.random()*255)|0;
      data[i]=data[i+1]=data[i+2]=v; data[i+3]=255;
    }
    ctx.putImageData(imgData,0,0);
  };
  let tick=0;
  const loop = () => { tick++; if(tick%3===0) drawNoise(); requestAnimationFrame(loop); };
  resize(); window.addEventListener('resize',resize); loop();
})();

/* NAV */
(function(){
  const nav = document.getElementById('nav');
  const toggle = document.getElementById('navToggle');
  const links = document.getElementById('navLinks');

  if (nav) window.addEventListener('scroll',()=>{ nav.classList.toggle('scrolled',window.scrollY>60); },{passive:true});

  if (toggle && links) {
    // Toggle'ı body'e taşı — nav'ın stacking context'inden çıkar
    document.body.appendChild(toggle);

    const closeMenu = () => {
      links.classList.remove('open');
      toggle.classList.remove('open');
      nav.classList.remove('menu-open');
      document.body.style.overflow = '';
    };

    toggle.addEventListener('click', () => {
      const open = links.classList.toggle('open');
      toggle.classList.toggle('open', open);
      nav.classList.toggle('menu-open', open);
      document.body.style.overflow = open ? 'hidden' : '';
    });

    links.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

    // ESC ile kapat
    document.addEventListener('keydown', e => { if (e.key === 'Escape') closeMenu(); });
  }
})();

/* HERO SLIDER */
(function(){
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  if (!slides.length) return;
  let current = 0;
  let timer;
  const goTo = (idx) => {
    slides[current].classList.remove('active');
    dots[current]?.classList.remove('active');
    current = (idx + slides.length) % slides.length;
    slides[current].classList.add('active');
    dots[current]?.classList.add('active');
  };
  const start = () => { timer = setInterval(()=>goTo(current+1), 5000); };
  const reset = () => { clearInterval(timer); start(); };
  dots.forEach(dot => {
    dot.addEventListener('click', ()=>{ goTo(parseInt(dot.dataset.idx)); reset(); });
  });
  start();
})();

/* REVEAL */
(function(){
  const els = document.querySelectorAll('[data-reveal]');
  if (!els.length) return;
  const delays = [0, 0.1, 0.2, 0.15, 0.05];
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      const el = entry.target;
      const siblings = el.parentElement ? [...el.parentElement.querySelectorAll('[data-reveal]')] : [el];
      const idx = siblings.indexOf(el);
      el.style.transitionDelay = delays[idx % delays.length]+'s';
      el.classList.add('revealed');
      io.unobserve(el);
    });
  },{threshold:0.12, rootMargin:'0px 0px -40px 0px'});
  els.forEach(el=>io.observe(el));
})();

/* SERVICE CARDS STAGGER */
(function(){
  const cards = document.querySelectorAll('.service-card');
  if (!cards.length) return;
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(entry=>{
      if (!entry.isIntersecting) return;
      entry.target.style.transitionDelay = (parseInt(entry.target.dataset.idx||0)*0.07)+'s';
      entry.target.style.opacity='1';
      entry.target.style.transform='translateY(0)';
      io.unobserve(entry.target);
    });
  },{threshold:0.08, rootMargin:'0px 0px -20px 0px'});
  cards.forEach((c,i)=>{
    c.dataset.idx=i;
    c.style.opacity='0';
    c.style.transform='translateY(32px)';
    c.style.transition='opacity .7s cubic-bezier(0.16,1,0.3,1), transform .7s cubic-bezier(0.16,1,0.3,1), background .4s';
    io.observe(c);
  });
})();

/* PRICING TABS */
(function(){
  const tabs = document.querySelectorAll('.pricing-tab');
  const cards = document.querySelectorAll('.pricing-card');
  if (!tabs.length) return;

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const cat = tab.dataset.cat;
      cards.forEach(card => {
        if (cat === 'tum') {
          card.classList.remove('hidden-cat');
        } else {
          if (card.dataset.cat === cat) {
            card.classList.remove('hidden-cat');
          } else {
            card.classList.add('hidden-cat');
          }
        }
      });
    });
  });
})();

/* GALLERY SLIDER */
(function(){
  const slider = document.getElementById('gallerySlider');
  const prevBtn = document.getElementById('galleryPrev');
  const nextBtn = document.getElementById('galleryNext');
  const progressBar = document.getElementById('galleryProgressBar');
  const counter = document.getElementById('galleryCounter');
  if (!slider) return;

  const slides = slider.querySelectorAll('.gallery-slide');
  const total = 3;
  let current = 0;
  let autoTimer;
  let startX = 0;
  let isDragging = false;

  const getSlideWidth = () => {
    const slide = slides[0];
    const style = window.getComputedStyle(slide);
    return slide.offsetWidth + parseInt(style.marginRight||0);
  };

  const update = (animate=true) => {
    if (!animate) slider.style.transition = 'none';
    else slider.style.transition = 'transform .8s cubic-bezier(0.16,1,0.3,1)';
    slider.style.transform = `translateX(${-current * getSlideWidth()}px)`;
    if (progressBar) progressBar.style.width = ((current % total + 1) / total * 100) + '%';
    if (counter) {
      const display = (current % total) + 1;
      counter.textContent = (display < 10 ? '0' : '') + display + ' / 0' + total;
    }
  };

  const next = () => { current = (current + 1) % slides.length; update(); };
  const prev = () => { current = (current - 1 + slides.length) % slides.length; update(); };
  const startAuto = () => { autoTimer = setInterval(next, 4000); };
  const resetAuto = () => { clearInterval(autoTimer); startAuto(); };

  if (nextBtn) nextBtn.addEventListener('click', ()=>{ next(); resetAuto(); });
  if (prevBtn) prevBtn.addEventListener('click', ()=>{ prev(); resetAuto(); });

  slider.addEventListener('mousedown', e=>{ isDragging=true; startX=e.clientX; slider.style.transition='none'; });
  slider.addEventListener('touchstart', e=>{ isDragging=true; startX=e.touches[0].clientX; slider.style.transition='none'; },{passive:true});
  const endDrag = (endX) => {
    if (!isDragging) return;
    isDragging=false;
    const diff = startX - endX;
    if (Math.abs(diff)>60) { diff>0 ? next() : prev(); resetAuto(); }
    else update();
  };
  slider.addEventListener('mouseup', e=>endDrag(e.clientX));
  slider.addEventListener('touchend', e=>endDrag(e.changedTouches[0].clientX));
  slider.addEventListener('mouseleave', e=>{ if(isDragging){ isDragging=false; update(); } });

  document.addEventListener('keydown', e=>{
    if (e.key==='ArrowRight') { next(); resetAuto(); }
    if (e.key==='ArrowLeft')  { prev(); resetAuto(); }
  });

  update(false);
  startAuto();
  window.addEventListener('resize', ()=>update(false));
})();

/* COUNTER */
(function(){
  const nums = document.querySelectorAll('[data-count]');
  if (!nums.length) return;
  const ease = t => 1 - Math.pow(1-t,4);
  const animate = (el) => {
    const target = parseInt(el.dataset.count,10);
    const dur = 1800;
    const start = performance.now();
    const tick = (now) => {
      const p = Math.min((now-start)/dur,1);
      const val = Math.round(ease(p)*target);
      el.textContent = target>=1000 ? (val/1000).toFixed(1)+'k' : val;
      if (p<1) requestAnimationFrame(tick);
      else el.textContent = target>=1000 ? Math.round(target/1000)+'k+' : target+'+';
    };
    requestAnimationFrame(tick);
  };
  const io = new IntersectionObserver(entries=>{
    entries.forEach(e=>{ if(e.isIntersecting){ animate(e.target); io.unobserve(e.target); } });
  },{threshold:.5});
  nums.forEach(el=>io.observe(el));
})();

/* FLOATING WA */
(function(){
  const btn = document.getElementById('waFloat');
  if (!btn) return;
  window.addEventListener('scroll',()=>{ btn.classList.toggle('visible',window.scrollY>300); },{passive:true});
})();

/* HERO SCROLL FADE */
(function(){
  const s = document.getElementById('heroScroll');
  if (!s) return;
  window.addEventListener('scroll',()=>{ s.style.opacity=Math.max(0,1-window.scrollY/220); },{passive:true});
})();

/* TILT on service cards */
(function(){
  if (window.matchMedia('(pointer:coarse)').matches) return;
  document.querySelectorAll('.service-card').forEach(card=>{
    card.addEventListener('mousemove',e=>{
      const r=card.getBoundingClientRect();
      const x=((e.clientX-r.left)/r.width-.5)*7;
      const y=((e.clientY-r.top)/r.height-.5)*7;
      card.style.transform=`perspective(600px) rotateY(${x}deg) rotateX(${-y}deg) translateZ(4px)`;
    });
    card.addEventListener('mouseleave',()=>{ card.style.transform=''; });
  });
})();

/* SMOOTH ANCHOR */
(function(){
  document.querySelectorAll('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href');
      if(id==='#') return;
      const target=document.querySelector(id);
      if(!target) return;
      e.preventDefault();
      window.scrollTo({top:target.getBoundingClientRect().top+window.scrollY-80, behavior:'smooth'});
    });
  });
})();
