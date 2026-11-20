/* ═══════════════════════════════════════════
   DATTATRAY HADKE — PORTFOLIO SCRIPT
   Loader · Neural Grid · Animations
   Typing · Tilt · Magnetic · Scroll FX
═══════════════════════════════════════════ */

'use strict';

/* ────────────────────────────────────────
   1. PAGE LOADER
──────────────────────────────────────── */
(function initLoader() {
  const loader = document.getElementById('loader');
  const fill   = document.getElementById('loaderFill');
  const text   = document.getElementById('loaderText');
  const msgs   = ['Initializing...', 'Loading assets...', 'Calibrating AI...', 'Ready.'];
  let progress = 0;
  let msgIdx   = 0;

  const interval = setInterval(() => {
    progress += Math.random() * 18 + 6;
    if (progress > 100) progress = 100;
    fill.style.width = progress + '%';

    const idx = Math.floor((progress / 100) * (msgs.length - 1));
    if (idx !== msgIdx) {
      msgIdx = idx;
      text.textContent = msgs[msgIdx];
    }

    if (progress >= 100) {
      clearInterval(interval);
      text.textContent = 'Ready.';
      setTimeout(() => {
        loader.classList.add('hidden');
        document.body.style.overflow = '';
        triggerHeroReveal();
      }, 400);
    }
  }, 60);

  document.body.style.overflow = 'hidden';
})();

/* ────────────────────────────────────────
   2. NEURAL CANVAS (Hero Background)
──────────────────────────────────────── */
(function initNeuralCanvas() {
  const canvas = document.getElementById('neuralCanvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');

  let W, H, nodes, mouse = { x: -999, y: -999 };
  const NODE_COUNT   = window.matchMedia('(max-width: 768px)').matches ? 40 : 80;
  const MAX_DIST     = 140;
  const PRIMARY      = '0,245,212';
  const SECONDARY    = '123,97,255';

  function resize() {
    W = canvas.width  = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    buildNodes();
  }

  function buildNodes() {
    nodes = Array.from({ length: NODE_COUNT }, () => ({
      x:  Math.random() * W,
      y:  Math.random() * H,
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      r:  Math.random() * 1.5 + 0.5,
    }));
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);

    for (let i = 0; i < nodes.length; i++) {
      const n = nodes[i];
      n.x += n.vx; n.y += n.vy;
      if (n.x < 0 || n.x > W) n.vx *= -1;
      if (n.y < 0 || n.y > H) n.vy *= -1;

      const dx = mouse.x - n.x, dy = mouse.y - n.y;
      const d  = Math.sqrt(dx*dx + dy*dy);
      if (d < 180) {
        n.vx += dx / d * 0.012;
        n.vy += dy / d * 0.012;
        const spd = Math.sqrt(n.vx*n.vx + n.vy*n.vy);
        if (spd > 1.5) { n.vx /= spd * 0.7; n.vy /= spd * 0.7; }
      }

      ctx.beginPath();
      ctx.arc(n.x, n.y, n.r, 0, Math.PI*2);
      ctx.fillStyle = `rgba(${PRIMARY},0.5)`;
      ctx.fill();
    }

    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const a = nodes[i], b = nodes[j];
        const dx = a.x - b.x, dy = a.y - b.y;
        const dist = Math.sqrt(dx*dx + dy*dy);
        if (dist < MAX_DIST) {
          const alpha = (1 - dist/MAX_DIST) * 0.35;
          const t = i / nodes.length;
          const color = t > 0.5 ? SECONDARY : PRIMARY;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.strokeStyle = `rgba(${color},${alpha})`;
          ctx.lineWidth = 0.5;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(draw);
  }

  canvas.addEventListener('mousemove', e => {
    const r = canvas.getBoundingClientRect();
    mouse.x = e.clientX - r.left;
    mouse.y = e.clientY - r.top;
  });
  canvas.addEventListener('mouseleave', () => { mouse.x = -999; mouse.y = -999; });

  window.addEventListener('resize', resize);
  resize();
  draw();
})();

/* ────────────────────────────────────────
   3. TYPING EFFECT
──────────────────────────────────────── */
(function initTyping() {
  const el = document.getElementById('typingEl');
  if (!el) return;

  const words = ['Engineer', 'Innovator', 'Builder', 'Deployer', 'Creator'];
  let wi = 0, ci = 0, deleting = false;

  function type() {
    const word = words[wi];
    if (!deleting) {
      el.textContent = word.slice(0, ++ci);
      if (ci === word.length) {
        deleting = true;
        setTimeout(type, 1800);
        return;
      }
      setTimeout(type, 90);
    } else {
      el.textContent = word.slice(0, --ci);
      if (ci === 0) {
        deleting = false;
        wi = (wi + 1) % words.length;
        setTimeout(type, 300);
        return;
      }
      setTimeout(type, 45);
    }
  }
  setTimeout(type, 1200);
})();

/* ────────────────────────────────────────
   4. SCROLL EFFECTS
──────────────────────────────────────── */
(function initScrollEffects() {
  const progressBar  = document.getElementById('scrollProgress');
  const scrollInd    = document.getElementById('scrollIndicator');
  const backBtn      = document.getElementById('backToTop');
  const nav          = document.getElementById('nav');

  window.addEventListener('scroll', onScroll, { passive: true });

  function onScroll() {
    const scrollTop = window.scrollY;
    const docH = document.documentElement.scrollHeight - window.innerHeight;
    const pct  = docH > 0 ? (scrollTop / docH) * 100 : 0;

    if (progressBar) progressBar.style.width = pct + '%';
    if (scrollInd)   scrollInd.classList.toggle('hidden', scrollTop > 80);
    if (backBtn)     backBtn.classList.toggle('visible', scrollTop > 400);
    if (nav)         nav.classList.toggle('scrolled', scrollTop > 50);
  }
  onScroll();

  if (backBtn) {
    backBtn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  }
})();

/* ────────────────────────────────────────
   5. REVEAL ON SCROLL (IntersectionObserver)
──────────────────────────────────────── */
(function initReveal() {
  const els = document.querySelectorAll('.reveal-up, .reveal-left, .reveal-right');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const delay = parseInt(el.dataset.delay || 0);
      setTimeout(() => el.classList.add('visible'), delay);
      obs.unobserve(el);
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });

  els.forEach(el => obs.observe(el));
})();

/* ────────────────────────────────────────
   6. SKILL BAR ANIMATION
──────────────────────────────────────── */
(function initSkillBars() {
  const fills = document.querySelectorAll('.skill-fill');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      const el    = entry.target;
      const width = el.dataset.width || 0;
      setTimeout(() => { el.style.width = width + '%'; }, 200);
      obs.unobserve(el);
    });
  }, { threshold: 0.2 });

  fills.forEach(f => obs.observe(f));
})();

/* ────────────────────────────────────────
   7. 3D TILT on Project Cards
──────────────────────────────────────── */
(function initTilt() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.tilt-card').forEach(card => {
    const STRENGTH = 8;

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const cx   = rect.left + rect.width / 2;
      const cy   = rect.top  + rect.height / 2;
      const rx   = ((e.clientY - cy) / (rect.height / 2)) * -STRENGTH;
      const ry   = ((e.clientX - cx) / (rect.width  / 2)) * STRENGTH;

      card.style.transform     = `perspective(900px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-4px)`;
      card.style.transition    = 'transform 0.1s ease';
      card.style.willChange    = 'transform';

      const glow = card.querySelector('.project-glow');
      if (glow) {
        const px = ((e.clientX - rect.left) / rect.width)  * 100;
        const py = ((e.clientY - rect.top)  / rect.height) * 100;
        glow.style.background = `radial-gradient(circle at ${px}% ${py}%, var(--glow-color, rgba(0,245,212,0.3)) 0%, transparent 65%)`;
      }
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform  = 'perspective(900px) rotateX(0) rotateY(0) translateY(0)';
      card.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
      const glow = card.querySelector('.project-glow');
      if (glow) glow.style.background = '';
    });
  });
})();

/* ────────────────────────────────────────
   8. MAGNETIC BUTTONS
──────────────────────────────────────── */
(function initMagnetic() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.magnetic-btn').forEach(btn => {
    btn.addEventListener('mousemove', e => {
      const rect = btn.getBoundingClientRect();
      const cx   = rect.left + rect.width  / 2;
      const cy   = rect.top  + rect.height / 2;
      const dx   = (e.clientX - cx) * 0.3;
      const dy   = (e.clientY - cy) * 0.3;
      btn.style.transform    = `translate(${dx}px, ${dy}px)`;
      btn.style.transition   = 'transform 0.1s ease';
    });

    btn.addEventListener('mouseleave', () => {
      btn.style.transform  = '';
      btn.style.transition = 'transform 0.5s cubic-bezier(0.34,1.56,0.64,1)';
    });
  });
})();

/* ────────────────────────────────────────
   9. HERO REVEAL
──────────────────────────────────────── */
function triggerHeroReveal() {
  const items = document.querySelectorAll('#hero .reveal-up');
  items.forEach((el, i) => {
    setTimeout(() => el.classList.add('visible'), i * 120);
  });
}

/* ────────────────────────────────────────
   10. FLOATING PARTICLES
──────────────────────────────────────── */
(function initParticles() {
  const canvas = document.createElement('canvas');
  canvas.id = 'particleCanvas';
  canvas.style.cssText = 'position:fixed;inset:0;pointer-events:none;z-index:0;opacity:0.25;';
  document.body.prepend(canvas);

  const ctx = canvas.getContext('2d');
  let W, H;

  const COUNT = window.matchMedia('(max-width: 768px)').matches ? 20 : 45;
  let particles = [];

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function createParticle() {
    return {
      x:     Math.random() * W,
      y:     Math.random() * H + H,
      size:  Math.random() * 1.5 + 0.3,
      speed: Math.random() * 0.4 + 0.15,
      alpha: Math.random() * 0.5 + 0.1,
      color: Math.random() > 0.5 ? '0,245,212' : '123,97,255',
      drift: (Math.random() - 0.5) * 0.3,
    };
  }

  function init() {
    resize();
    particles = Array.from({ length: COUNT }, () => {
      const p = createParticle();
      p.y = Math.random() * H;
      return p;
    });
  }

  function draw() {
    ctx.clearRect(0, 0, W, H);
    particles.forEach((p, i) => {
      p.y  -= p.speed;
      p.x  += p.drift;
      p.alpha += (Math.random() - 0.5) * 0.01;
      p.alpha = Math.max(0.05, Math.min(0.6, p.alpha));

      if (p.y < -10) particles[i] = createParticle();

      ctx.beginPath();
      ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(${p.color},${p.alpha})`;
      ctx.fill();
    });
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', resize);
  init();
  draw();
})();

/* ────────────────────────────────────────
   11. LIQUID GLASS HOVER
──────────────────────────────────────── */
(function initLiquidGlass() {
  if (window.matchMedia('(max-width: 768px)').matches) return;

  document.querySelectorAll('.glass-card').forEach(card => {
    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width  * 100).toFixed(1);
      const y = ((e.clientY - rect.top)  / rect.height * 100).toFixed(1);
      card.style.setProperty('--mx', x + '%');
      card.style.setProperty('--my', y + '%');
      card.style.background = `
        radial-gradient(circle at ${x}% ${y}%, rgba(255,255,255,0.09) 0%, transparent 50%),
        rgba(255,255,255,0.06)
      `;
    });

    card.addEventListener('mouseleave', () => {
      card.style.background = '';
    });
  });
})();

/* ────────────────────────────────────────
   12. NAVIGATION MOBILE TOGGLE
──────────────────────────────────────── */
(function initNavToggle() {
  const toggle   = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  if (!toggle || !navLinks) return;

  toggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('mobile-open');
    toggle.classList.toggle('open', open);
    document.body.style.overflow = open ? 'hidden' : '';
  });

  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('mobile-open');
      toggle.classList.remove('open');
      document.body.style.overflow = '';
    });
  });
})();

/* ────────────────────────────────────────
   13. CONTACT FORM
──────────────────────────────────────── */
(function initContactForm() {
  const form = document.getElementById('contactForm');
  if (!form) return;

  const YOUR_EMAIL = 'hadkedattatray487@gmail.com';

  form.addEventListener('submit', e => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    if (!name || !email || !message) return;

    const subject = encodeURIComponent(`Portfolio Contact from ${name}`);
    const body    = encodeURIComponent(`Name: ${name}\nEmail: ${email}\n\nMessage:\n${message}`);

    window.location.href = `mailto:${YOUR_EMAIL}?subject=${subject}&body=${body}`;

    const btn  = form.querySelector('button[type="submit"]');
    const text = document.getElementById('submitText');
    const icon = document.getElementById('submitIcon');

    text.textContent = '✓ Opening Email App...';
    btn.style.background = 'linear-gradient(135deg,#10d98a,#00c87f)';
    if (icon) icon.style.display = 'none';

    setTimeout(() => {
      text.textContent = 'Send Message';
      btn.style.background = '';
      if (icon) icon.style.display = '';
      form.reset();
    }, 3000);
  });
})();

/* ────────────────────────────────────────
   14. SMOOTH SCROLL
──────────────────────────────────────── */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', e => {
    const target = document.querySelector(anchor.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ────────────────────────────────────────
   15. ACTIVE NAV LINK HIGHLIGHT
──────────────────────────────────────── */
(function initActiveNav() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  const obs = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        navLinks.forEach(link => {
          link.style.color = '';
          if (link.getAttribute('href') === '#' + entry.target.id) {
            link.style.color = 'var(--primary)';
          }
        });
      }
    });
  }, { threshold: 0.4 });

  sections.forEach(s => obs.observe(s));
})();

/* ────────────────────────────────────────
   16. TECH PILL STAGGER ANIMATION
──────────────────────────────────────── */
(function initPillStagger() {
  const pills = document.querySelectorAll('.tech-pill');
  pills.forEach((p, i) => {
    p.style.opacity   = '0';
    p.style.transform = 'translateY(16px)';
  });

  const obs = new IntersectionObserver(entries => {
    if (!entries[0].isIntersecting) return;
    pills.forEach((p, i) => {
      setTimeout(() => {
        p.style.transition = `opacity 0.5s ease, transform 0.5s cubic-bezier(0.34,1.56,0.64,1)`;
        p.style.opacity    = '1';
        p.style.transform  = 'translateY(0)';
      }, i * 60);
    });
    obs.disconnect();
  }, { threshold: 0.2 });

  const wrap = document.querySelector('.tech-pills');
  if (wrap) obs.observe(wrap);
})();

/* ────────────────────────────────────────
   17. PROJECT SEARCH & CATEGORY FILTERS
──────────────────────────────────────── */
(function initProjectControls() {
  const tabs = document.querySelectorAll('.filter-tab');
  const searchInput = document.getElementById('projectSearch');
  const clearBtn = document.getElementById('searchClear');
  const cards = document.querySelectorAll('.projects-grid .project-card');
  const grid = document.querySelector('.projects-grid');

  if (!cards.length) return;

  let activeFilter = 'all';
  let searchTerm = '';

  function applyFilters() {
    let visibleCount = 0;

    cards.forEach(card => {
      const category = card.dataset.category || '';
      const text = (card.textContent || '').toLowerCase();
      const keywords = (card.dataset.keywords || '').toLowerCase();

      const matchesCat = (activeFilter === 'all') || (category === activeFilter);
      const matchesSearch = !searchTerm || text.includes(searchTerm) || keywords.includes(searchTerm);

      if (matchesCat && matchesSearch) {
        card.classList.remove('filter-hidden');
        visibleCount++;
      } else {
        card.classList.add('filter-hidden');
      }
    });

    let noResults = document.getElementById('noProjectsFound');
    if (visibleCount === 0) {
      if (!noResults && grid) {
        noResults = document.createElement('div');
        noResults.id = 'noProjectsFound';
        noResults.className = 'no-results-msg glass-card';
        noResults.innerHTML = `No projects found matching "<strong>${escapeHtml(searchTerm)}</strong>". <button id="resetSearchFilter" style="margin-left:12px;background:rgba(0,245,212,0.1);border:1px solid var(--primary);color:var(--primary);padding:5px 14px;border-radius:100px;cursor:pointer;font-weight:600;font-size:0.8rem;">Reset Filters</button>`;
        grid.appendChild(noResults);
        document.getElementById('resetSearchFilter')?.addEventListener('click', () => {
          if (searchInput) searchInput.value = '';
          searchTerm = '';
          if (clearBtn) clearBtn.style.display = 'none';
          activeFilter = 'all';
          tabs.forEach(t => t.classList.toggle('active', t.dataset.filter === 'all'));
          applyFilters();
        });
      }
    } else if (noResults) {
      noResults.remove();
    }
  }

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      activeFilter = tab.dataset.filter || 'all';
      applyFilters();
    });
  });

  if (searchInput) {
    searchInput.addEventListener('input', e => {
      searchTerm = e.target.value.trim().toLowerCase();
      if (clearBtn) clearBtn.style.display = searchTerm ? 'block' : 'none';
      applyFilters();
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', () => {
      if (searchInput) {
        searchInput.value = '';
        searchInput.focus();
      }
      searchTerm = '';
      clearBtn.style.display = 'none';
      applyFilters();
    });
  }

  function escapeHtml(str) {
    return str.replace(/[&<>"']/g, m => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[m]);
  }
})();

/* ────────────────────────────────────────
   18. ONE-CLICK EMAIL COPY
──────────────────────────────────────── */
(function initCopyEmail() {
  const btn = document.getElementById('heroCopyEmail');
  const tooltip = document.getElementById('heroCopyTooltip');
  if (!btn) return;

  btn.addEventListener('click', async () => {
    const email = 'hadkedattatray487@gmail.com';
    try {
      await navigator.clipboard.writeText(email);
      if (tooltip) {
        tooltip.textContent = 'Copied to clipboard! ✓';
        setTimeout(() => { tooltip.textContent = 'Copy Email'; }, 2200);
      }
    } catch {
      if (tooltip) tooltip.textContent = email;
    }
  });
})();