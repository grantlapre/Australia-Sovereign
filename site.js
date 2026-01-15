(function () {
  // 1) Load shared nav.html into any element with [data-include="nav"]
  async function loadNav() {
    const holders = document.querySelectorAll('[data-include="nav"]');
    if (!holders.length) return;

    try {
      const res = await fetch('nav.html', { cache: 'no-cache' });
      if (!res.ok) throw new Error('Failed to load nav.html');
      const html = await res.text();

      holders.forEach(h => (h.innerHTML = html));

      // After nav loads, wire up theme toggle
      wireThemeToggle();
      highlightActiveNav();
    } catch (e) {
      // Fail gracefully (still shows page content)
      console.warn(e);
    }
  }

  // 2) Theme toggle (persist via localStorage)
  function applySavedTheme() {
    const saved = localStorage.getItem('as_theme');
    if (saved === 'light' || saved === 'dark') {
      document.documentElement.setAttribute('data-theme', saved);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
  }

  function wireThemeToggle() {
    const btn = document.querySelector('[data-theme-toggle]');
    if (!btn) return;

    btn.addEventListener('click', () => {
      const current = document.documentElement.getAttribute('data-theme') || 'dark';
      const next = current === 'dark' ? 'light' : 'dark';
      document.documentElement.setAttribute('data-theme', next);
      localStorage.setItem('as_theme', next);
    });
  }

  // 3) Optional: highlight current page in nav
  function highlightActiveNav() {
    const path = (location.pathname.split('/').pop() || 'index.html').toLowerCase();
    document.querySelectorAll('.nav a.chip').forEach(a => {
      const href = (a.getAttribute('href') || '').toLowerCase();
      if (href === path) {
        a.style.outline = '2px solid var(--accent)';
        a.style.outlineOffset = '2px';
      }
    });
  }

  // 4) Collapsible sections (accordion)
  // Markup expected:
  // <div class="accordion" data-accordion>
  //   <div class="acc-item" aria-expanded="false">
  //     <button class="acc-btn" type="button" data-acc-btn>Title ...</button>
  //     <div class="acc-panel">...</div>
  //   </div>
  // </div>
  function wireAccordions() {
    document.querySelectorAll('[data-accordion]').forEach(acc => {
      acc.querySelectorAll('[data-acc-btn]').forEach(btn => {
        btn.addEventListener('click', () => {
          const item = btn.closest('.acc-item');
          if (!item) return;

          const isOpen = item.getAttribute('aria-expanded') === 'true';

          // Close others (single-open behaviour). If you want multi-open, delete this block.
          acc.querySelectorAll('.acc-item').forEach(i => i.setAttribute('aria-expanded', 'false'));

          item.setAttribute('aria-expanded', isOpen ? 'false' : 'true');
        });
      });
    });
  }

  // 5) Footer year helper
  function setYear() {
    document.querySelectorAll('[data-year]').forEach(el => {
      el.textContent = new Date().getFullYear();
    });
  }

  // Boot
  applySavedTheme();
  loadNav();
  wireAccordions();
  setYear();
})();
