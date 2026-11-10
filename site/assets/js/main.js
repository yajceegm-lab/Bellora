// Bellora landingspagina: scroll-effecten, carrousel, video-knop en MailerLite sign-up
// Geen externe bibliotheken: één scroll-lus zet per element een voortgangswaarde --p (0 tot 1),
// en de CSS vertaalt die waarde naar beweging.

(function () {
  const root = document.documentElement;
  root.classList.add('js');
  const reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const finePointer = window.matchMedia('(pointer: fine)').matches;
  const desktop = window.matchMedia('(min-width: 1001px)');

  const clamp = function (v, a, b) { return Math.min(b, Math.max(a, v)); };

  // ---- Laden ----
  requestAnimationFrame(function () {
    requestAnimationFrame(function () { document.body.classList.add('is-loaded'); });
  });

  // ---- Statement: tekst opsplitsen in woorden ----
  const statement = document.querySelector('[data-words]');
  let words = [];
  if (statement) {
    const highlight = ['honing,', 'jasmijn', 'amber', 'duur'];
    const label = statement.textContent;
    statement.setAttribute('aria-label', label);
    statement.innerHTML = label.split(' ').map(function (w) {
      const hl = highlight.indexOf(w.toLowerCase()) > -1 ? ' hl' : '';
      return '<span class="w' + hl + '" aria-hidden="true">' + w + '</span>';
    }).join(' ');
    words = Array.prototype.slice.call(statement.querySelectorAll('.w'));
  }

  // ---- Prijs-teller ----
  const stat = document.querySelector('[data-count]');
  let counted = false;
  function countUp() {
    if (counted || !stat) return;
    counted = true;
    const euro = stat.querySelector('.count');
    const cent = stat.querySelector('.count-dec');
    if (reduce) return;
    const start = performance.now();
    const dur = 1400;
    (function tick(now) {
      const t = clamp((now - start) / dur, 0, 1);
      const e = 1 - Math.pow(1 - t, 3);
      const value = 19.99 * e;
      euro.textContent = Math.floor(value);
      cent.textContent = String(Math.round((value % 1) * 100)).padStart(2, '0');
      if (t < 1) requestAnimationFrame(tick);
      else { euro.textContent = '19'; cent.textContent = '99'; }
    })(start);
  }

  // ---- Scroll-elementen ----
  const tracked = Array.prototype.slice.call(document.querySelectorAll('[data-scroll]'));
  const topbar = document.querySelector('.topbar');
  const progress = document.querySelector('.progress');
  const navLinks = Array.prototype.slice.call(document.querySelectorAll('.pillnav a'));
  const sections = navLinks.map(function (a) { return document.querySelector(a.getAttribute('href')); });
  const night = document.querySelector('.night');
  const track = document.getElementById('moments');
  const viewport = document.querySelector('.moments-viewport');

  function measureNight() {
    if (!track || !viewport) return;
    const dist = Math.max(0, track.scrollWidth - viewport.clientWidth);
    night.style.setProperty('--dist', dist + 'px');
  }

  function update() {
    const vh = window.innerHeight;
    const y = window.scrollY;
    const max = document.documentElement.scrollHeight - vh;

    progress.style.setProperty('--sp', max > 0 ? (y / max).toFixed(4) : 0);
    topbar.classList.toggle('is-scrolled', y > 40);

    let current = 0;
    sections.forEach(function (s, i) { if (s && s.getBoundingClientRect().top < vh * 0.4) current = i; });
    navLinks.forEach(function (a, i) { a.classList.toggle('is-active', i === current); });

    if (reduce) return;

    tracked.forEach(function (el) {
      const r = el.getBoundingClientRect();
      const mode = el.dataset.scroll;
      let p;
      if (mode === 'hero') {
        p = clamp(-r.top / vh, 0, 1);
      } else if (mode === 'pin') {
        if (!desktop.matches) { el.style.setProperty('--p', 0); return; }
        p = clamp(-r.top / (r.height - vh), 0, 1);
      } else {
        // 0 wanneer het element onderaan binnenkomt, 1 wanneer het bovenaan verdwijnt
        if (r.bottom < -100 || r.top > vh + 100) return;
        p = clamp((vh - r.top) / (vh + r.height), 0, 1);
      }
      el.style.setProperty('--p', p.toFixed(4));

      if (stat && el.contains(stat) && p > 0.15) countUp();
    });

    // Woorden lichten een voor een op
    if (words.length) {
      const r = statement.getBoundingClientRect();
      const p = clamp((vh * 0.85 - r.top) / (r.height + vh * 0.35), 0, 1);
      const n = words.length;
      words.forEach(function (w, i) {
        const local = clamp(p * n - i, 0, 1);
        w.style.setProperty('--o', (0.16 + local * 0.84).toFixed(3));
      });
    }
  }

  let ticking = false;
  function onScroll() {
    if (!ticking) { requestAnimationFrame(function () { update(); ticking = false; }); ticking = true; }
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  window.addEventListener('resize', function () { measureNight(); update(); });
  window.addEventListener('load', function () { measureNight(); update(); });
  measureNight();
  update();
  if (reduce) countUp();

  // ---- Reveals voor losse elementen ----
  const reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && !reduce) {
    const io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) { entry.target.classList.add('is-in'); io.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(function (el) { io.observe(el); });
  } else {
    reveals.forEach(function (el) { el.classList.add('is-in'); });
  }

  // ---- Muis: hero-beeld en lichtranden ----
  if (!reduce && finePointer) {
    const heroImg = document.querySelector('.hero-bg img');
    window.addEventListener('pointermove', function (e) {
      const mx = e.clientX / window.innerWidth - 0.5;
      const my = e.clientY / window.innerHeight - 0.5;
      heroImg.style.translate = (mx * -16) + 'px ' + (my * -12) + 'px';
    }, { passive: true });

    document.querySelectorAll('[data-light]').forEach(function (card) {
      card.addEventListener('pointermove', function (e) {
        const r = card.getBoundingClientRect();
        card.style.setProperty('--mx', (e.clientX - r.left) + 'px');
        card.style.setProperty('--my', (e.clientY - r.top) + 'px');
      });
      card.addEventListener('pointerleave', function () {
        card.style.removeProperty('--mx'); card.style.removeProperty('--my');
      });
    });
  }

  // ---- Pijlknoppen: op desktop scrollt de pagina, op mobiel de kaartenrij ----
  document.querySelectorAll('.nav-btn').forEach(function (btn) {
    btn.addEventListener('click', function () {
      const dir = parseInt(btn.dataset.dir, 10);
      if (desktop.matches && !reduce) {
        const steps = 3;
        const total = night.offsetHeight - window.innerHeight;
        const start = night.getBoundingClientRect().top + window.scrollY;
        const now = clamp((window.scrollY - start) / total, 0, 1);
        const next = clamp(Math.round(now * steps) + dir, 0, steps) / steps;
        window.scrollTo({ top: start + next * total, behavior: 'smooth' });
      } else {
        const step = track.querySelector('.moment').getBoundingClientRect().width + 20;
        viewport.scrollBy({ left: dir * step, behavior: reduce ? 'auto' : 'smooth' });
      }
    });
  });

  // ---- Video: pauzeerknop ----
  const video = document.querySelector('.card-media');
  const toggle = document.querySelector('.video-toggle');
  function setToggle(paused) {
    toggle.textContent = paused ? 'Speel video af' : 'Pauzeer video';
    toggle.setAttribute('aria-pressed', String(paused));
  }
  if (video && toggle) {
    if (reduce) { video.removeAttribute('autoplay'); video.pause(); setToggle(true); }
    toggle.addEventListener('click', function () {
      if (video.paused) { video.play(); setToggle(false); } else { video.pause(); setToggle(true); }
    });
  }

  // ---- Sign-up formulier ----
  const form = document.getElementById('signup-form');
  const msg = document.getElementById('form-message');
  if (!form) return;

  const nameInput = document.getElementById('f-name');
  const emailInput = document.getElementById('f-email');
  const optin = document.getElementById('f-optin');
  const button = form.querySelector('button[type="submit"]');

  function show(text, type) {
    msg.textContent = text;
    msg.className = 'form-message' + (type ? ' is-' + type : '');
  }

  function validate() {
    [nameInput, emailInput].forEach(function (el) { el.removeAttribute('aria-invalid'); });
    if (!nameInput.value.trim()) {
      nameInput.setAttribute('aria-invalid', 'true'); nameInput.focus();
      return 'Vul je voornaam in.';
    }
    if (!emailInput.validity.valid || !emailInput.value.trim()) {
      emailInput.setAttribute('aria-invalid', 'true'); emailInput.focus();
      return 'Vul een geldig e-mailadres in, bijvoorbeeld naam@voorbeeld.be.';
    }
    if (!optin.checked) {
      optin.focus();
      return 'Vink het vakje aan om de nieuwsbrief te ontvangen.';
    }
    return '';
  }

  function success() {
    form.reset();
    show('Bijna klaar. Check je inbox en bevestig je inschrijving.', 'success');
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const error = validate();
    if (error) { show(error, 'error'); return; }

    button.disabled = true;
    show('Bezig met inschrijven…');

    fetch(form.action, { method: 'POST', body: new FormData(form) })
      .then(function (res) { return res.json(); })
      .then(function (data) {
        if (data && data.success) { success(); }
        else { show('Inschrijven lukte niet. Controleer je gegevens en probeer opnieuw.', 'error'); }
      })
      .catch(function () {
        // Als de browser het antwoord niet mag lezen, verzenden we via het verborgen iframe.
        form.submit();
        success();
      })
      .finally(function () { button.disabled = false; });
  });
})();
