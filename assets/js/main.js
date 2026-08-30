(function () {
  'use strict';

  const WHATSAPP_NUMBER = '6287894415426';
  const DEFAULT_MESSAGE = 'Halo Glorya Massage, saya ingin booking layanan pijat panggilan di Jogja. Mohon info jadwal yang tersedia.';

  function buildWhatsAppUrl(message) {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message || DEFAULT_MESSAGE)}`;
  }

  function openWhatsApp(message) {
    window.open(buildWhatsAppUrl(message), '_blank', 'noopener,noreferrer');
  }

  window.buildWhatsAppUrl = buildWhatsAppUrl;
  window.openWhatsApp = openWhatsApp;

  const header = document.getElementById('site-header');
  const menuToggle = document.getElementById('menu-toggle');
  const mobileMenu = document.getElementById('mobile-menu');

  function setMenu(open) {
    menuToggle.setAttribute('aria-expanded', String(open));
    menuToggle.setAttribute('aria-label', open ? 'Tutup menu navigasi' : 'Buka menu navigasi');
    mobileMenu.hidden = !open;
    mobileMenu.classList.toggle('menu-open', open);
    menuToggle.innerHTML = open
      ? '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="m6 6 12 12M18 6 6 18" stroke-linecap="round"/></svg>'
      : '<svg class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" aria-hidden="true"><path d="M4 7h16M4 12h16M4 17h16" stroke-linecap="round"/></svg>';
  }

  menuToggle.addEventListener('click', () => setMenu(menuToggle.getAttribute('aria-expanded') !== 'true'));
  document.querySelectorAll('.mobile-nav-link').forEach((link) => link.addEventListener('click', () => setMenu(false)));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && menuToggle.getAttribute('aria-expanded') === 'true') {
      setMenu(false);
      menuToggle.focus();
    }
  });

  function updateHeader() {
    header.classList.toggle('header-scrolled', window.scrollY > 20);
  }
  updateHeader();
  window.addEventListener('scroll', updateHeader, { passive: true });

  function scrollToSection(hash, updateHistory) {
    const target = document.querySelector(hash);
    if (!target) return;

    const top = target.getBoundingClientRect().top + window.scrollY - header.offsetHeight;
    window.scrollTo({
      top: Math.max(0, top),
      behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth'
    });

    if (updateHistory && window.location.hash !== hash) {
      window.history.pushState(null, '', hash);
    }
  }

  document.querySelectorAll('a[href^="#"]').forEach((link) => {
    link.addEventListener('click', (event) => {
      const hash = link.getAttribute('href');
      if (!hash || hash === '#') return;
      event.preventDefault();
      setMenu(false);
      scrollToSection(hash, true);
    });
  });

  window.addEventListener('load', () => {
    if (!window.location.hash) return;
    window.requestAnimationFrame(() => window.requestAnimationFrame(() => {
      scrollToSection(window.location.hash, false);
    }));
  });

  document.querySelectorAll('.wa-trigger').forEach((button) => {
    button.addEventListener('click', () => {
      let message = button.dataset.message;
      if (!message && button.dataset.service) {
        const detail = button.dataset.duration
          ? ` ${button.dataset.duration}${button.dataset.price ? ` (${button.dataset.price})` : ''}`
          : '';
        message = `Halo Glorya Massage, saya ingin booking ${button.dataset.service}${detail}. Mohon info jadwal yang tersedia.`;
      }
      openWhatsApp(message || DEFAULT_MESSAGE);
    });
  });

  const bookingForm = document.getElementById('booking-form');
  if (bookingForm) {
    bookingForm.addEventListener('submit', (event) => {
      event.preventDefault();
      if (!bookingForm.reportValidity()) return;

      const data = new FormData(bookingForm);
      const nama = String(data.get('nama') || '').trim();
      const alamat = String(data.get('alamat') || '').trim();
      const layanan = String(data.get('layanan') || '').trim();
      const durasi = String(data.get('durasi') || '').trim();
      const tanggalRaw = String(data.get('tanggal') || '');
      const waktu = String(data.get('waktu') || '').trim();
      const catatan = String(data.get('catatan') || '').trim();

      const tanggal = tanggalRaw
        ? new Date(`${tanggalRaw}T00:00:00`).toLocaleDateString('id-ID', { day: '2-digit', month: 'long', year: 'numeric' })
        : '';

      const message = [
        'Halo Glorya Massage, saya ingin booking:',
        '',
        `Nama: ${nama}`,
        `Layanan: ${layanan}`,
        `Durasi: ${durasi}`,
        `Tanggal: ${tanggal}`,
        `Waktu: ${waktu} WIB`,
        `Alamat: ${alamat}`,
        `Catatan: ${catatan || '-'}`,
        '',
        'Mohon konfirmasi jadwalnya. Terima kasih.'
      ].join('\n');

      openWhatsApp(message);
    });
  }

  document.querySelectorAll('.faq-button').forEach((button) => {
    button.addEventListener('click', () => {
      const expanded = button.getAttribute('aria-expanded') === 'true';
      const panel = document.getElementById(button.getAttribute('aria-controls'));
      button.setAttribute('aria-expanded', String(!expanded));
      panel.hidden = expanded;
    });
  });

  const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const revealItems = document.querySelectorAll('.reveal');
  if (reduceMotion || !('IntersectionObserver' in window)) {
    revealItems.forEach((item) => item.classList.add('is-visible'));
  } else {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.08, rootMargin: '0px 0px -35px' });
    revealItems.forEach((item) => revealObserver.observe(item));
  }

  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main section[id]');
  if ('IntersectionObserver' in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          navLinks.forEach((link) => link.classList.toggle('active', link.getAttribute('href') === `#${entry.target.id}`));
        }
      });
    }, { rootMargin: '-35% 0px -55%' });
    sections.forEach((section) => sectionObserver.observe(section));
  }

  document.getElementById('current-year').textContent = new Date().getFullYear();
}());
