/* =========================================================
   Mr. Sweeps Chimney Cleaning — site behaviour
   Vanilla JS, no dependencies. All form work degrades
   gracefully: the form posts normally without JS.
   ========================================================= */
(function () {
  'use strict';

  var FORM_ENDPOINT = 'https://vision.leadrai.com/api/forms/142eddfdd7ad452b4cd6256fb1d52d35';

  /* ---------- Current year in footer ---------- */
  var yearEl = document.getElementById('year');
  if (yearEl) yearEl.textContent = String(new Date().getFullYear());

  /* ---------- Populate hidden _page field ---------- */
  var pageField = document.getElementById('pageField');
  if (pageField) pageField.value = window.location.href;

  /* ---------- Sticky header shadow ---------- */
  var header = document.getElementById('siteHeader');
  function onScroll() {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 8);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile navigation ---------- */
  var nav = document.getElementById('primaryNav');
  var toggle = document.getElementById('navToggle');
  var backdrop = document.getElementById('navBackdrop');

  function setNav(open) {
    if (!nav || !toggle) return;
    nav.classList.toggle('open', open);
    toggle.setAttribute('aria-expanded', open ? 'true' : 'false');
    toggle.setAttribute('aria-label', open ? 'Close navigation menu' : 'Open navigation menu');
    if (backdrop) backdrop.hidden = !open;
    document.body.style.overflow = open ? 'hidden' : '';
  }

  if (toggle) {
    toggle.addEventListener('click', function () {
      setNav(toggle.getAttribute('aria-expanded') !== 'true');
    });
  }
  if (backdrop) backdrop.addEventListener('click', function () { setNav(false); });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') setNav(false);
  });

  if (nav) {
    nav.addEventListener('click', function (e) {
      var link = e.target.closest ? e.target.closest('a') : null;
      if (link) setNav(false);
    });
  }

  // Reset inline nav state if resized back to desktop
  var mq = window.matchMedia('(min-width: 861px)');
  var onMq = function (ev) { if (ev.matches) setNav(false); };
  if (mq.addEventListener) mq.addEventListener('change', onMq);
  else if (mq.addListener) mq.addListener(onMq);

  /* ---------- Scroll-spy for nav links ---------- */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  var sections = navLinks
    .map(function (a) {
      var id = a.getAttribute('href').slice(1);
      return id ? document.getElementById(id) : null;
    })
    .filter(Boolean);

  if ('IntersectionObserver' in window && sections.length) {
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        navLinks.forEach(function (a) {
          a.classList.toggle('active', a.getAttribute('href') === '#' + entry.target.id);
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px', threshold: 0 });
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ---------- Reveal on scroll ---------- */
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var revealTargets = document.querySelectorAll(
    '.section-head, .about-body, .card, .step, .diff, .form-card, .contact-info, .hero-figure'
  );

  if (!reduceMotion && 'IntersectionObserver' in window) {
    var ro = new IntersectionObserver(function (entries, obs) {
      entries.forEach(function (entry) {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('in');
        obs.unobserve(entry.target);
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -40px 0px' });

    Array.prototype.forEach.call(revealTargets, function (el, i) {
      el.classList.add('reveal');
      el.style.transitionDelay = (Math.min(i % 4, 3) * 70) + 'ms';
      ro.observe(el);
    });
  }

  /* ---------- Contact form ---------- */
  var form = document.getElementById('quoteForm');
  var card = form ? form.closest('.form-card') : null;
  var success = document.getElementById('formSuccess');
  var note = document.getElementById('formNote');
  var submitBtn = document.getElementById('submitBtn');

  function showSuccess(scroll) {
    if (!success || !card) return;
    success.hidden = false;
    card.classList.add('sent');
    if (scroll) {
      success.scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'center' });
    }
  }

  /* Show confirmation after a plain (non-JS) submission returns ?submitted=1 */
  try {
    var params = new URLSearchParams(window.location.search);
    if (params.get('submitted') === '1') {
      showSuccess(true);
    }
  } catch (err) { /* URLSearchParams unavailable — plain form still works */ }

  function fieldError(input, message) {
    clearError(input);
    input.classList.add('invalid');
    input.setAttribute('aria-invalid', 'true');
    var span = document.createElement('span');
    span.className = 'field-error';
    span.textContent = message;
    if (input.parentNode) input.parentNode.appendChild(span);
  }

  function clearError(input) {
    input.classList.remove('invalid');
    input.removeAttribute('aria-invalid');
    var parent = input.parentNode;
    if (!parent) return;
    var existing = parent.querySelector('.field-error');
    if (existing) existing.remove();
  }

  function validate() {
    var ok = true;
    var first = null;

    var checks = [
      { id: 'f-name', msg: 'Please enter your name.' },
      { id: 'f-phone', msg: 'Please enter a phone number we can reach you on.' },
      { id: 'f-email', msg: 'Please enter a valid email address.' }
    ];

    checks.forEach(function (c) {
      var el = document.getElementById(c.id);
      if (!el) return;
      var value = el.value.trim();
      var bad = !value;

      if (!bad && c.id === 'f-email') {
        bad = !/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(value);
      }
      if (!bad && c.id === 'f-phone') {
        bad = (value.replace(/\D/g, '').length < 7);
        if (bad) c.msg = 'Please enter a valid phone number.';
      }

      if (bad) {
        ok = false;
        fieldError(el, c.msg);
        if (!first) first = el;
      } else {
        clearError(el);
      }
    });

    if (first) first.focus();
    return ok;
  }

  if (form) {
    // Clear errors as the visitor types
    form.addEventListener('input', function (e) {
      if (e.target && e.target.classList && e.target.classList.contains('invalid')) {
        clearError(e.target);
      }
    });

    form.addEventListener('submit', function (e) {
      // Keep _page current even for a no-JS style submission path
      if (pageField) pageField.value = window.location.href;

      if (!validate()) {
        e.preventDefault();
        return;
      }

      // Progressive enhancement: submit via fetch to the same endpoint.
      if (!window.fetch || !window.FormData) return; // fall back to a normal POST

      e.preventDefault();

      var data = new FormData(form);
      var payload = {};
      data.forEach(function (value, key) { payload[key] = value; });
      payload._page = window.location.href;

      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.textContent = 'Sending…';
      }
      if (note) {
        note.classList.remove('error');
        note.textContent = 'Sending your request…';
      }

      fetch(FORM_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
        body: JSON.stringify(payload)
      })
        .then(function (res) {
          return res.json().catch(function () { return { ok: res.ok }; });
        })
        .then(function (result) {
          if (result && result.ok) {
            form.reset();
            showSuccess(true);
          } else {
            throw new Error('Submission rejected');
          }
        })
        .catch(function () {
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.textContent = 'Send My Request';
          }
          if (note) {
            note.classList.add('error');
            note.innerHTML =
              'Sorry — that didn’t go through. Please call <a href="tel:8176925624">817-692-5624</a> and we’ll take care of you.';
          }
        });
    });
  }
})();
