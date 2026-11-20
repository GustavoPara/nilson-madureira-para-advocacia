/**
 * Nilson Madureira Pará Advocacia — Interactive Controller
 */

document.addEventListener('DOMContentLoaded', () => {
  // 1. Sticky Header Scroll Effect
  const header = document.getElementById('siteHeader');
  const handleScroll = () => {
    if (window.scrollY > 24) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
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

  // Keep modal close logic intact if needed
  const contactModal = document.getElementById('contactModal');
  const closeModalBtn = document.getElementById('closeModalBtn');
  const closeModal = () => {
    if (!contactModal) return;
    contactModal.classList.remove('active');
    contactModal.setAttribute('aria-hidden', 'true');
  };

  if (closeModalBtn) {
    closeModalBtn.addEventListener('click', closeModal);
  }

  if (contactModal) {
    contactModal.addEventListener('click', (e) => {
      if (e.target === contactModal) {
        closeModal();
      }
    });
  }

  // Escape key closes modals
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeModal();
      closeMediaModal();
    }
  });

  // Handle WhatsApp form submission (fallback)
  const contactForm = document.getElementById('whatsappForm');
  const serviceSelect = document.getElementById('serviceSelect');
  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('clientName').value.trim();
      const phone = document.getElementById('clientPhone').value.trim();
      const topic = serviceSelect ? serviceSelect.value : 'Análise Previdenciária';
      const details = document.getElementById('clientMessage').value.trim();

      const textParts = [
        `Olá, Dr. Nilson Madureira Pará! Gostaria de agendar uma análise previdenciária.`,
        ``,
        `*Nome:* ${name || 'Cliente'}`,
        `*Telefone:* ${phone || 'Não informado'}`,
        `*Interesse:* ${topic}`,
      ];
      if (details) {
        textParts.push(`*Resumo do caso:* ${details}`);
      }

      const encoded = encodeURIComponent(textParts.join('\n'));
      const whatsappUrl = `https://wa.me/5519981515127?text=${encoded}`;
      window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      closeModal();
    });
  }

  // 4. Media Modal ("Nilson Madureira Pará na Mídia")
  const mediaModal = document.getElementById('mediaModal');
  const closeMediaBtn = document.getElementById('closeMediaBtn');
  const mediaTitle = document.getElementById('mediaModalTitle');
  const mediaBody = document.getElementById('mediaModalBody');
  const mediaTag = document.getElementById('mediaModalTag');

  const mediaData = {
    '1': {
      tag: 'ENTREVISTA EXCLUSIVA • DIREITO PREVIDENCIÁRIO',
      title: 'Como destravar pedidos negados pelo INSS com provas técnicas',
      body: 'Em participação especial na imprensa, o advogado Nilson Madureira Pará explica por que milhares de segurados têm seus pedidos indeferidos por falhas documentais simples e como a busca ativa de documentos (como PPP, laudos e registros rurais) garante a concessão do benefício no menor tempo possível.'
    },
    '2': {
      tag: 'ESPECIAL • APOSENTADORIA RURAL E ESPECIAL',
      title: 'Regras de transição e comprovação de atividade especial ou rural',
      body: 'Análise completa conduzida pelo Dr. Nilson Madureira Pará sobre o aproveitamento de períodos rurais na infância/juventude e o reconhecimento de agentes insalubres ou perigosos, mesmo quando a empresa já encerrou suas atividades.'
    },
    '3': {
      tag: 'ORIENTAÇÃO AO CIDADÃO • BENEFÍCIOS ASSISTENCIAIS',
      title: 'BPC-LOAS, Auxílio-Acidente e Limbo Previdenciário: conheça seus direitos',
      body: 'Esclarecimento público sobre os requisitos reais de renda familiar para o BPC-LOAS (idosos e pessoas com deficiência) e como agir quando o INSS concede alta médica, mas o trabalhador permanece incapacitado.'
    }
  };

  const closeMediaModal = () => {
    if (!mediaModal) return;
    mediaModal.classList.remove('active');
    mediaModal.setAttribute('aria-hidden', 'true');
  };

  document.querySelectorAll('[data-media-id]').forEach((card) => {
    card.addEventListener('click', () => {
      const id = card.getAttribute('data-media-id');
      const item = mediaData[id];
      if (item && mediaModal) {
        mediaTag.textContent = item.tag;
        mediaTitle.textContent = item.title;
        mediaBody.textContent = item.body;
        mediaModal.classList.add('active');
        mediaModal.setAttribute('aria-hidden', 'false');
      }
    });
  });

  if (closeMediaBtn) {
    closeMediaBtn.addEventListener('click', closeMediaModal);
  }

  if (mediaModal) {
    mediaModal.addEventListener('click', (e) => {
      if (e.target === mediaModal) {
        closeMediaModal();
      }
    });
  }
});
