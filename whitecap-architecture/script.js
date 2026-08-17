(() => {
  const expertiseNav = document.getElementById('expertise-nav');
  const expertiseToggle = document.getElementById('expertise-toggle');
  const expertiseMenu = document.getElementById('expertise-menu');

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

  // Everything below only applies on expertise.html — no-ops elsewhere.
  const tabButtons = document.querySelectorAll('[role="tab"]');
  if (tabButtons.length) {
    const tabPanels = document.querySelectorAll('.tabpanel');
    const tabIntros = document.querySelectorAll('.tab-intro');
    const tabOrder = ['renovations', 'new-construction', 'interior', 'programming'];
    let currentTab = 'renovations';

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

    // Switching tabs while already on this page shouldn't spam browser
    // history, but the hash should still reflect the current tab so a
    // refresh or a direct link lands on the right one.
    function switchTab(tab) {
      history.replaceState(null, '', `#${tab}`);
      setTab(tab);
    }

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

    window.addEventListener('hashchange', () => {
      const tab = window.location.hash.replace(/^#/, '');
      if (tabOrder.includes(tab)) setTab(tab);
    });

    const initialTab = window.location.hash.replace(/^#/, '');
    setTab(tabOrder.includes(initialTab) ? initialTab : 'renovations');
  }

  const contactForm = document.getElementById('contact-form');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
    });
  }
})();
