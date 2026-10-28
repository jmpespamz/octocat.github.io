(() => {
  const prefersReduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Nav gains a solid background after the page scrolls.
  const nav = document.getElementById('nav');
  const updateNav = () => nav.classList.toggle('scrolled', window.scrollY > 20);
  updateNav();
  window.addEventListener('scroll', updateNav, { passive: true });

  // Reveal elements as they enter the viewport.
  const revealObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add('in');
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
  document.querySelectorAll('.reveal').forEach((el) => revealObserver.observe(el));

  // Count numbers up when they become visible.
  const formatCount = (value, el) => {
    const decimals = parseInt(el.dataset.decimals || '0', 10);
    return value.toFixed(decimals) + (el.dataset.suffix || '');
  };

  const countUp = (el) => {
    const target = parseFloat(el.dataset.target);
    const duration = 1600;
    const start = performance.now();
    const step = (now) => {
      const t = Math.min((now - start) / duration, 1);
      const eased = 1 - Math.pow(1 - t, 3);
      el.textContent = formatCount(target * eased, el);
      if (t < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  };

  if (!prefersReduced) {
    const countObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          countUp(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.6 });

    document.querySelectorAll('[data-target]').forEach((el) => {
      el.textContent = formatCount(0, el);
      countObserver.observe(el);
    });
  }

  // Build the 42 region dots with a staggered glow.
  const regionDots = document.getElementById('regionDots');
  if (regionDots) {
    for (let i = 0; i < 42; i++) {
      const dot = document.createElement('span');
      dot.style.animationDelay = (((i * 7) % 21) * 0.15).toFixed(2) + 's';
      regionDots.appendChild(dot);
    }
  }

  // Track the pointer across cards for a spotlight effect.
  document.querySelectorAll('.card').forEach((card) => {
    card.addEventListener('pointermove', (event) => {
      const rect = card.getBoundingClientRect();
      card.style.setProperty('--mx', `${event.clientX - rect.left}px`);
      card.style.setProperty('--my', `${event.clientY - rect.top}px`);
    });
  });

  // Switch pricing between monthly and annual.
  const billing = document.getElementById('billing');
  const priceValues = document.querySelectorAll('.price-value');
  const renderPrices = () => {
    const annual = billing.checked;
    priceValues.forEach((el) => {
      el.textContent = annual ? el.dataset.annual : el.dataset.monthly;
    });
  };
  billing.addEventListener('change', renderPrices);
  renderPrices();
})();
