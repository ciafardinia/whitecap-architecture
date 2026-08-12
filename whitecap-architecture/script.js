(() => {
  const pages = document.querySelectorAll('.page');
  const navLinks = document.querySelectorAll('[data-goto-page]');
  const tabButtons = document.querySelectorAll('[role="tab"]');
  const tabPanels = document.querySelectorAll('.tabpanel');
  const tabIntros = document.querySelectorAll('.tab-intro');
  const expertiseNav = document.getElementById('expertise-nav');
  const expertiseToggle = document.getElementById('expertise-toggle');
  const expertiseMenu = document.getElementById('expertise-menu');
  const tabOrder = ['renovations', 'new-construction', 'interior', 'programming'];
  const pageOrder = ['home', 'services', 'about', 'contact'];

  let currentPage = 'home';
  let currentTab = 'renovations';

  const pageTitles = {
    home: 'Whitecap Architecture — Laboratory & Research Architecture',
    services: 'Expertise — Whitecap Architecture',
    about: 'About — Whitecap Architecture',
    contact: 'Contact — Whitecap Architecture',
  };

  function hashForRoute(page, tab) {
    if (page === 'services' && tab) return tab;
    if (page === 'home') return '';
    return page;
  }

  function routeFromHash() {
    const raw = decodeURIComponent(window.location.hash.replace(/^#/, ''));
    if (!raw || raw === 'home') return { page: 'home', tab: currentTab };
    if (tabOrder.includes(raw)) return { page: 'services', tab: raw };
    if (pageOrder.includes(raw)) return { page: raw, tab: currentTab };
    return { page: 'home', tab: currentTab };
  }

  // Real navigation (nav links, expertise menu, hero CTAs): changes the URL
  // hash, which creates a browser history entry so back/forward work, and
  // fires 'hashchange' so applyRoute below actually renders it.
  function navigate(page, tab) {
    const hash = hashForRoute(page, tab);
    if (window.location.hash === `#${hash}` || (!hash && !window.location.hash)) {
      applyRoute({ moveFocus: true });
      return;
    }
    window.location.hash = hash;
  }

  // In-page tab switch (pill click / arrow keys) while already on the
  // Expertise page: keep the URL in sync without spamming browser history.
  function switchTab(tab) {
    history.replaceState(null, '', `#${hashForRoute('services', tab)}`);
    setTab(tab);
  }

  function applyRoute({ moveFocus = false } = {}) {
    const { page, tab } = routeFromHash();
    setPage(page, { moveFocus });
    if (page === 'services') setTab(tab);
  }

  function setPage(page, { moveFocus = false } = {}) {
    currentPage = page;
    pages.forEach(el => el.classList.toggle('is-active', el.dataset.page === page));
    navLinks.forEach(el => {
      if (el.dataset.gotoPage) {
        if (el.dataset.gotoPage === page) el.setAttribute('aria-current', 'page');
        else el.removeAttribute('aria-current');
      }
    });
    closeExpertiseMenu();
    document.title = pageTitles[page] || pageTitles.home;
    window.scrollTo(0, 0);
    if (moveFocus) {
      const activePage = document.querySelector(`.page[data-page="${page}"]`);
      const heading = activePage && (activePage.querySelector('.tab-intro.is-active h1') || activePage.querySelector('h1'));
      if (heading) {
        heading.setAttribute('tabindex', '-1');
        heading.focus();
      }
    }
  }

  function setTab(tab) {
    currentTab = tab;
    tabButtons.forEach(btn => {
      const active = btn.dataset.tab === tab;
      btn.setAttribute('aria-selected', String(active));
      btn.tabIndex = active ? 0 : -1;
    });
    tabPanels.forEach(panel => {
      panel.classList.toggle('is-active', panel.id === `panel-${tab}`);
    });
    tabIntros.forEach(intro => {
      intro.classList.toggle('is-active', intro.dataset.tabIntro === tab);
    });
  }

  function goToTab(tab) {
    navigate('services', tab);
  }

  let expertiseCloseTimer = null;

  function openExpertiseMenu() {
    if (expertiseCloseTimer) {
      clearTimeout(expertiseCloseTimer);
      expertiseCloseTimer = null;
    }
    expertiseMenu.classList.add('is-open');
    expertiseToggle.setAttribute('aria-expanded', 'true');
  }

  function closeExpertiseMenu() {
    if (expertiseCloseTimer) {
      clearTimeout(expertiseCloseTimer);
      expertiseCloseTimer = null;
    }
    expertiseMenu.classList.remove('is-open');
    expertiseToggle.setAttribute('aria-expanded', 'false');
  }

  function scheduleCloseExpertiseMenu() {
    if (expertiseCloseTimer) clearTimeout(expertiseCloseTimer);
    expertiseCloseTimer = setTimeout(() => {
      expertiseCloseTimer = null;
      closeExpertiseMenu();
    }, 200);
  }

  document.querySelectorAll('[data-goto-page]').forEach(btn => {
    btn.addEventListener('click', () => navigate(btn.dataset.gotoPage));
  });

  document.querySelectorAll('[data-goto-tab]').forEach(btn => {
    btn.addEventListener('click', () => goToTab(btn.dataset.gotoTab));
  });

  tabButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      switchTab(btn.dataset.tab);
      requestAnimationFrame(() => requestAnimationFrame(() => window.scrollTo(0, 0)));
    });
    btn.addEventListener('keydown', (e) => {
      if (!['ArrowDown', 'ArrowUp', 'ArrowLeft', 'ArrowRight', 'Home', 'End'].includes(e.key)) return;
      e.preventDefault();
      const i = tabOrder.indexOf(currentTab);
      let next = i;
      if (e.key === 'ArrowDown' || e.key === 'ArrowRight') next = (i + 1) % tabOrder.length;
      if (e.key === 'ArrowUp' || e.key === 'ArrowLeft') next = (i - 1 + tabOrder.length) % tabOrder.length;
      if (e.key === 'Home') next = 0;
      if (e.key === 'End') next = tabOrder.length - 1;
      const nextTab = tabOrder[next];
      switchTab(nextTab);
      document.getElementById(`tab-${nextTab}`).focus();
    });
  });

  expertiseNav.addEventListener('mouseenter', openExpertiseMenu);
  expertiseNav.addEventListener('mouseleave', scheduleCloseExpertiseMenu);
  expertiseToggle.addEventListener('click', () => {
    if (expertiseMenu.classList.contains('is-open')) closeExpertiseMenu();
    else openExpertiseMenu();
  });
  document.addEventListener('mousedown', (e) => {
    if (!expertiseNav.contains(e.target)) closeExpertiseMenu();
  });
  expertiseNav.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && expertiseMenu.classList.contains('is-open')) {
      closeExpertiseMenu();
      expertiseToggle.focus();
    }
  });

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }

  window.addEventListener('hashchange', () => applyRoute({ moveFocus: true }));
  applyRoute({ moveFocus: false });
})();
