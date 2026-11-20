/**
 * Nilson Madureira Pará Advocacia
 * Fluid Physics & Direct Interaction Controller (emilkowalski/skills@apple-design)
 */

document.addEventListener('DOMContentLoaded', () => {
  const prefersReducedMotion = () =>
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // 1. Floating Translucent Header Scroll Edge Detection (§12)
  const header = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 12);
  };
  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll();

  // 2. Mobile Navigation Toggle
  const mobileToggle = document.getElementById('mobileToggle');
  const mainNav = document.getElementById('mainNav');
  if (mobileToggle && mainNav) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = mainNav.classList.toggle('open');
      mobileToggle.setAttribute('aria-expanded', String(isOpen));
    });

    mainNav.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        mainNav.classList.remove('open');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // 3. Direct WhatsApp Redirect (+55 19 98151-5127) for all buttons & links
  const WHATSAPP_NUMBER = '5519981515127';

  const openDirectWhatsApp = (topic = '') => {
    const baseMsg = topic
      ? `Olá, Dr. Nilson Madureira Pará! Vim pelo site e gostaria de informações sobre: ${topic}.`
      : `Olá, Dr. Nilson Madureira Pará! Vim pelo site e gostaria de agendar uma análise previdenciária.`;
    const url = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(baseMsg)}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  document.querySelectorAll('[data-open-whatsapp]').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const topic = btn.getAttribute('data-open-whatsapp') || '';
      openDirectWhatsApp(topic);
    });
  });

  // 4. Apple Fluid Physics Engine for Interruptible Draggable Media Sheet (§2-§9)
  const mediaModal = document.getElementById('mediaModal');
  const mediaSheet = mediaModal ? mediaModal.querySelector('.modal') : null;
  const closeMediaBtn = document.getElementById('closeMediaBtn');
  const mediaTitle = document.getElementById('mediaModalTitle');
  const mediaBody = document.getElementById('mediaModalBody');
  const mediaTag = document.getElementById('mediaModalTag');

  const mediaData = {
    '1': {
      tag: 'Entrevista em Direito Previdenciário',
      title: 'Como reverter negativas indevidas do INSS com segurança',
      body: 'Em participação especial na imprensa, o advogado Nilson Madureira Pará explica por que milhares de segurados têm seus pedidos indeferidos por falhas documentais simples e como a busca ativa de documentos (como PPP, laudos e registros rurais) garante a concessão do benefício no menor tempo possível.'
    },
    '2': {
      tag: 'Especial Aposentadoria Rural e Especial',
      title: 'Regras de transição e comprovação de atividade especial ou rural',
      body: 'Análise completa conduzida pelo Dr. Nilson Madureira Pará sobre o aproveitamento de períodos rurais na infância/juventude e o reconhecimento de agentes insalubres ou perigosos, mesmo quando a empresa já encerrou suas atividades.'
    },
    '3': {
      tag: 'Orientação ao Cidadão e Benefícios Assistenciais',
      title: 'BPC-LOAS, Auxílio-Acidente e Limbo Previdenciário: conheça seus direitos',
      body: 'Esclarecimento público sobre os requisitos reais de renda familiar para o BPC-LOAS (idosos e pessoas com deficiência) e como agir quando o INSS concede alta médica, mas o trabalhador permanece incapacitado.'
    }
  };

  // Apple Rubber-Banding (§9)
  function rubberband(overshoot, dimension = 320, constant = 0.55) {
    return (overshoot * dimension * constant) / (dimension + constant * Math.abs(overshoot));
  }

  // Apple Momentum Projection (§6)
  function project(initialVelocity, decelerationRate = 0.998) {
    return ((initialVelocity / 1000) * decelerationRate) / (1 - decelerationRate);
  }

  // Interruptible 1D Spring Solver (damping ratio + response, §4)
  let sheetState = {
    y: 32,
    v: 0,
    targetY: 32,
    scale: 0.96,
    opacity: 0,
    isOpen: false,
    isDragging: false,
    rafId: null
  };

  function renderSheet() {
    if (!mediaSheet) return;
    mediaSheet.style.transform = `translate3d(0, ${sheetState.y.toFixed(2)}px, 0) scale(${sheetState.scale.toFixed(4)})`;
    mediaSheet.style.opacity = String(Math.max(0, Math.min(1, sheetState.opacity)));
  }

  function animateSheetTo(targetY, targetOpacity, targetScale, initialVelocity = 0, dampingRatio = 1.0, response = 0.34, onComplete = null) {
    if (sheetState.rafId) cancelAnimationFrame(sheetState.rafId);

    if (prefersReducedMotion()) {
      sheetState.y = targetY;
      sheetState.v = 0;
      sheetState.opacity = targetOpacity;
      sheetState.scale = targetScale;
      renderSheet();
      if (onComplete) onComplete();
      return;
    }

    sheetState.targetY = targetY;
    sheetState.v = initialVelocity;

    const stiffness = Math.pow((2 * Math.PI) / response, 2);
    const damping = (4 * Math.PI * dampingRatio) / response;
    let lastTime = performance.now();

    function step(now) {
      if (sheetState.isDragging) return;
      const dt = Math.min((now - lastTime) / 1000, 0.032);
      lastTime = now;

      const displacement = sheetState.y - targetY;
      const springForce = -stiffness * displacement;
      const dampingForce = -damping * sheetState.v;
      const acceleration = springForce + dampingForce;

      sheetState.v += acceleration * dt;
      sheetState.y += sheetState.v * dt;

      // Smoothly converge opacity and scale alongside spring
      sheetState.opacity += (targetOpacity - sheetState.opacity) * Math.min(1, dt * 14);
      sheetState.scale += (targetScale - sheetState.scale) * Math.min(1, dt * 14);

      renderSheet();

      const settled = Math.abs(displacement) < 0.35 && Math.abs(sheetState.v) < 1.5;
      if (settled) {
        sheetState.y = targetY;
        sheetState.v = 0;
        sheetState.opacity = targetOpacity;
        sheetState.scale = targetScale;
        renderSheet();
        sheetState.rafId = null;
        if (onComplete) onComplete();
      } else {
        sheetState.rafId = requestAnimationFrame(step);
      }
    }

    sheetState.rafId = requestAnimationFrame(step);
  }

  const openMediaModal = (id) => {
    const item = mediaData[id];
    if (!item || !mediaModal || !mediaSheet) return;
    mediaTag.textContent = item.tag;
    mediaTitle.textContent = item.title;
    mediaBody.textContent = item.body;

    sheetState.isOpen = true;
    sheetState.y = 36;
    sheetState.scale = 0.96;
    sheetState.opacity = 0;
    renderSheet();

    mediaModal.classList.add('active');
    mediaModal.setAttribute('aria-hidden', 'false');
    document.body.classList.add('sheet-open');

    // Critically damped spring entrance (damping 1.0, response 0.34s)
    animateSheetTo(0, 1, 1, 0, 1.0, 0.34);
  };

  const closeMediaModal = (releaseVelocity = 0) => {
    if (!mediaModal || !sheetState.isOpen) return;
    sheetState.isOpen = false;
    document.body.classList.remove('sheet-open');

    animateSheetTo(60, 0, 0.96, releaseVelocity, 1.0, 0.26, () => {
      mediaModal.classList.remove('active');
      mediaModal.setAttribute('aria-hidden', 'true');
    });
  };

  // Direct Manipulation Drag-to-Dismiss with Velocity Handoff & Rubber-Banding (§2, §5, §6, §9)
  if (mediaSheet) {
    let startPointerY = 0;
    let startSheetY = 0;
    let history = [];

    mediaSheet.addEventListener('pointerdown', (e) => {
      if (e.target.closest('button') || e.target.closest('a')) return;
      if (!sheetState.isOpen) return;

      // Interrupt any running spring from live presentation value (§3)
      if (sheetState.rafId) {
        cancelAnimationFrame(sheetState.rafId);
        sheetState.rafId = null;
      }

      sheetState.isDragging = true;
      mediaSheet.setPointerCapture(e.pointerId);
      startPointerY = e.clientY;
      startSheetY = sheetState.y;
      history = [{ y: e.clientY, t: performance.now() }];
    });

    mediaSheet.addEventListener('pointermove', (e) => {
      if (!sheetState.isDragging) return;
      const dy = e.clientY - startPointerY;
      let nextY = startSheetY + dy;

      // Rubber-band resistance when dragging upward past resting bound (§9)
      if (nextY < 0) {
        nextY = rubberband(nextY, 260, 0.55);
      }

      sheetState.y = nextY;
      sheetState.opacity = nextY > 0 ? Math.max(0.25, 1 - nextY / 320) : 1;
      renderSheet();

      const now = performance.now();
      history.push({ y: e.clientY, t: now });
      if (history.length > 6) history.shift();
    });

    const endDrag = (e) => {
      if (!sheetState.isDragging) return;
      sheetState.isDragging = false;
      try {
        mediaSheet.releasePointerCapture(e.pointerId);
      } catch (_) {}

      // Compute release velocity (px/s)
      let velocity = 0;
      if (history.length >= 2) {
        const first = history[0];
        const last = history[history.length - 1];
        const dt = (last.t - first.t) / 1000;
        if (dt > 0) velocity = (last.y - first.y) / dt;
      }

      // Project resting endpoint using Apple exponential deceleration (§6)
      const projectedY = sheetState.y + project(velocity, 0.992);
      if (projectedY > 110 || sheetState.y > 100) {
        closeMediaModal(Math.max(velocity, 200));
      } else {
        // Momentum handoff back to rest with subtle under-damped bounce (~0.82)
        animateSheetTo(0, 1, 1, velocity, 0.82, 0.34);
      }
    };

    mediaSheet.addEventListener('pointerup', endDrag);
    mediaSheet.addEventListener('pointercancel', endDrag);
  }

  document.querySelectorAll('[data-media-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-media-id');
      openMediaModal(id);
    });
  });

  if (closeMediaBtn) {
    closeMediaBtn.addEventListener('click', () => closeMediaModal(0));
  }

  if (mediaModal) {
    mediaModal.addEventListener('click', (e) => {
      if (e.target === mediaModal) {
        closeMediaModal(0);
      }
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeMediaModal(0);
    }
  });
});
