/**
 * Registro del Service Worker y flujo de instalación PWA para Nómada Tours en Arequipa.
 * - Soporta el prompt nativo (beforeinstallprompt) en Chrome/Edge/Android.
 * - Ofrece un modal con instrucciones claras para iOS Safari u otros navegadores.
 */
(function () {
  'use strict';

  const isLocalOrHttps =
    window.location.protocol === 'https:' ||
    window.location.hostname === 'localhost' ||
    window.location.hostname === '127.0.0.1';

  if ('serviceWorker' in navigator && isLocalOrHttps) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('./sw.js').catch(() => {});
    });
  }

  const headerBtn = document.getElementById('pwa-header-install-btn');
  const mobileBtn = document.getElementById('pwa-mobile-install-btn');
  const footerBtn = document.getElementById('pwa-footer-install-btn');
  const installModal = document.getElementById('pwa-install-modal');
  const installBackdrop = document.getElementById('pwa-modal-backdrop');
  const installCloseBtn = document.getElementById('pwa-modal-close-btn');
  const installFooterCloseBtn = document.getElementById('pwa-modal-ok-btn');
  const toastEl = document.getElementById('pwa-toast');

  const isStandalone =
    window.matchMedia('(display-mode: standalone)').matches ||
    window.navigator.standalone === true;

  let deferredPrompt = null;
  let lastTriggerEl = null;

  function showToast(message) {
    if (!toastEl) return;
    toastEl.textContent = message;
    toastEl.classList.remove('hidden');
    window.setTimeout(() => {
      toastEl.classList.add('hidden');
    }, 3500);
  }

  function updateInstallButtonsVisibility() {
    if (isStandalone) {
      if (headerBtn) {
        headerBtn.classList.add('hidden');
        headerBtn.classList.remove('inline-flex');
      }
      if (mobileBtn) mobileBtn.classList.add('hidden');
      if (footerBtn) footerBtn.classList.add('hidden');
      return;
    }

    // El botón compacto del header aparece cuando el navegador ofrece instalación nativa
    if (headerBtn) {
      const showHeader = Boolean(deferredPrompt);
      headerBtn.classList.toggle('hidden', !showHeader);
      headerBtn.classList.toggle('inline-flex', showHeader);
    }
  }

  function openInstallModal(triggerEl) {
    if (!installModal) return;
    lastTriggerEl = triggerEl || document.activeElement;
    installModal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
    if (installCloseBtn) installCloseBtn.focus();
  }

  function closeInstallModal() {
    if (!installModal || installModal.classList.contains('hidden')) return;
    installModal.classList.add('hidden');
    document.body.style.overflow = '';
    if (lastTriggerEl && typeof lastTriggerEl.focus === 'function' && document.contains(lastTriggerEl)) {
      lastTriggerEl.focus();
    }
    lastTriggerEl = null;
  }

  async function handleInstallClick(e) {
    const trigger = e.currentTarget;
    if (deferredPrompt) {
      deferredPrompt.prompt();
      try {
        const { outcome } = await deferredPrompt.userChoice;
        if (outcome === 'accepted') {
          deferredPrompt = null;
          updateInstallButtonsVisibility();
        }
      } catch {}
      return;
    }
    openInstallModal(trigger);
  }

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    updateInstallButtonsVisibility();
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    if (headerBtn) headerBtn.classList.add('hidden');
    if (mobileBtn) mobileBtn.classList.add('hidden');
    if (footerBtn) footerBtn.classList.add('hidden');
    closeInstallModal();
    showToast('Nómada se instaló como aplicación en tu dispositivo.');
  });

  [headerBtn, mobileBtn, footerBtn].forEach(btn => {
    if (btn) btn.addEventListener('click', handleInstallClick);
  });

  if (installCloseBtn) installCloseBtn.addEventListener('click', closeInstallModal);
  if (installFooterCloseBtn) installFooterCloseBtn.addEventListener('click', closeInstallModal);
  if (installBackdrop) installBackdrop.addEventListener('click', closeInstallModal);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && installModal && !installModal.classList.contains('hidden')) {
      closeInstallModal();
    }
  });

  updateInstallButtonsVisibility();
})();
