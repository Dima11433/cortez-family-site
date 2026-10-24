/* ==========================================================================
   CORTEZ FAMILY — MAJESTIC RP INTERACTIVE SCRIPT
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. FULLSCREEN HERO VIDEO AUTOPLAY & AUDIO MANAGEMENT
  // ------------------------------------------------------------------------
  const heroVideo = document.getElementById('hero-bg-video');
  const audioToggle = document.getElementById('audio-toggle');
  const unmuteBanner = document.getElementById('unmute-banner');
  const unmuteActionBtn = document.getElementById('unmute-action-btn');

  function setAudioState(active) {
    if (!heroVideo) return;
    if (active) {
      heroVideo.muted = false;
      heroVideo.volume = 1.0;
      if (audioToggle) audioToggle.classList.add('playing');
      if (unmuteBanner) unmuteBanner.classList.add('hidden');
    } else {
      heroVideo.muted = true;
      if (audioToggle) audioToggle.classList.remove('playing');
      if (unmuteBanner) unmuteBanner.classList.remove('hidden');
    }
  }

  function enableAudioOnInteraction() {
    if (heroVideo && heroVideo.muted) {
      setAudioState(true);
      showToast('Звук видео включен 🔊');
    }
    document.removeEventListener('click', enableAudioOnInteraction);
    document.removeEventListener('touchstart', enableAudioOnInteraction);
    document.removeEventListener('keydown', enableAudioOnInteraction);
  }

  if (heroVideo) {
    // Attempt unmuted play first (if browser policy allows)
    heroVideo.muted = false;
    heroVideo.volume = 1.0;
    const playAttempt = heroVideo.play();
    if (playAttempt !== undefined) {
      playAttempt.then(() => {
        // Unmuted playback allowed directly
        setAudioState(true);
      }).catch(() => {
        // Browser blocked unmuted autoplay: start muted and listen for user interaction
        heroVideo.muted = true;
        heroVideo.play().catch(() => {});
        setAudioState(false);
        document.addEventListener('click', enableAudioOnInteraction, { passive: true });
        document.addEventListener('touchstart', enableAudioOnInteraction, { passive: true });
        document.addEventListener('keydown', enableAudioOnInteraction, { passive: true });
      });
    }

    heroVideo.addEventListener('pause', () => {
      heroVideo.play().catch(() => {});
    });
  }

  if (unmuteActionBtn) {
    unmuteActionBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      setAudioState(true);
      showToast('Звук видео включен 🔊');
    });
  }

  if (audioToggle && heroVideo) {
    audioToggle.addEventListener('click', (e) => {
      e.stopPropagation();
      if (heroVideo.muted) {
        setAudioState(true);
        showToast('Звук видео включен 🔊');
      } else {
        setAudioState(false);
        showToast('Звук выключен 🔇');
      }
    });
  }

  // ------------------------------------------------------------------------
  // 2. SUBTLE FLOATING AMBIENT PARTICLES (CANVAS)
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width = canvas.width = window.innerWidth;
    let height = canvas.height = window.innerHeight;

    window.addEventListener('resize', () => {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    });

    const particles = [];
    const particleCount = 28;

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.5,
        speedY: Math.random() * 0.4 + 0.15,
        speedX: (Math.random() - 0.5) * 0.2,
        opacity: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.01,
        color: Math.random() > 0.4 ? 'rgba(255, 183, 51, ' : 'rgba(242, 239, 231, '
      });
    }

    function animateParticles() {
      ctx.clearRect(0, 0, width, height);

      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.y -= p.speedY;
        p.x += p.speedX;
        p.opacity += Math.sin(Date.now() * 0.002 + i) * 0.005;

        if (p.y < -10) {
          p.y = height + 10;
          p.x = Math.random() * width;
        }
        if (p.x < -10) p.x = width + 10;
        if (p.x > width + 10) p.x = -10;

        const currentOpacity = Math.max(0.1, Math.min(0.65, p.opacity));
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = p.color + currentOpacity + ')';
        ctx.fill();
      }

      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ------------------------------------------------------------------------
  // 3. MOBILE MENU TOGGLE
  // ------------------------------------------------------------------------
  const mobileToggle = document.getElementById('mobile-toggle');
  const navMenu = document.getElementById('nav-menu');

  if (mobileToggle && navMenu) {
    mobileToggle.addEventListener('click', () => {
      const isOpen = navMenu.classList.toggle('active');
      mobileToggle.setAttribute('aria-expanded', isOpen);
    });

    // Close when clicking a link
    navMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. QUICK MODAL DIALOG (<dialog>)
  // ------------------------------------------------------------------------
  const quickDialog = document.getElementById('quick-dialog');
  const openApplyBtn = document.getElementById('open-apply-btn');
  const modalClose = document.getElementById('modal-close');
  const modalForm = document.getElementById('modal-form');
  const modalSuccess = document.getElementById('modal-success');

  if (quickDialog && openApplyBtn) {
    openApplyBtn.addEventListener('click', () => {
      quickDialog.showModal();
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        quickDialog.close();
      });
    }

    // Light dismiss: Close on outside backdrop click
    quickDialog.addEventListener('click', (e) => {
      const rect = quickDialog.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        quickDialog.close();
      }
    });

    if (modalForm) {
      modalForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const name = document.getElementById('m-name').value;
        const discord = document.getElementById('m-discord').value;
        const server = document.getElementById('m-server').value;

        const summary = `📋 Быстрая заявка в CORTEZ:\n• Игрок: ${name}\n• Discord: ${discord}\n• Сервер: ${server}`;
        navigator.clipboard?.writeText(summary).catch(() => {});

        modalForm.style.display = 'none';
        modalSuccess.style.display = 'block';
        showToast('Контакты скопированы и отправлены!');

        setTimeout(() => {
          quickDialog.close();
          setTimeout(() => {
            modalForm.reset();
            modalForm.style.display = 'flex';
            modalSuccess.style.display = 'none';
          }, 400);
        }, 2200);
      });
    }
  }

  // ------------------------------------------------------------------------
  // 5. MAIN APPLICATION FORM (RECRUITING: FAMILY & RP STACK TABS)
  // ------------------------------------------------------------------------
  const appForm = document.getElementById('application-form');
  const appSuccess = document.getElementById('apply-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const tabFamily = document.getElementById('tab-family');
  const tabRp = document.getElementById('tab-rp');
  const ganggameGroup = document.getElementById('ganggame-group');
  const ganggameInput = document.getElementById('ganggame-rollback');
  const formTypeInput = document.getElementById('form-type');

  // Tab switching: Family vs RP Stack
  if (tabFamily && tabRp) {
    tabFamily.addEventListener('click', () => {
      tabFamily.classList.add('active');
      tabFamily.setAttribute('aria-selected', 'true');
      tabRp.classList.remove('active');
      tabRp.setAttribute('aria-selected', 'false');

      if (formTypeInput) formTypeInput.value = 'family';
      if (ganggameGroup) ganggameGroup.style.display = 'flex';
      if (ganggameInput) ganggameInput.setAttribute('required', '');
    });

    tabRp.addEventListener('click', () => {
      tabRp.classList.add('active');
      tabRp.setAttribute('aria-selected', 'true');
      tabFamily.classList.remove('active');
      tabFamily.setAttribute('aria-selected', 'false');

      if (formTypeInput) formTypeInput.value = 'rp';
      if (ganggameGroup) ganggameGroup.style.display = 'none';
      if (ganggameInput) ganggameInput.removeAttribute('required');
    });
  }

  if (appForm && appSuccess) {
    appForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const formType = formTypeInput ? formTypeInput.value : 'family';
      const charAge = document.getElementById('char-age').value;
      const discordContact = document.getElementById('discord-contact').value;
      const screenshotCharacters = document.getElementById('screenshot-characters').value;
      const familyHistory = document.getElementById('family-history').value;
      const activityTime = document.getElementById('activity-time').value;
      const staticId = document.getElementById('static-id-contact')?.value || '';
      const ganggameRollback = ganggameInput ? ganggameInput.value : '';

      let discordReport = '';

      if (formType === 'family') {
        discordReport = 
`⚔️ **ЗАЯВКА В СЕМЬЮ CORTEZ (CORTEZBOT)**
━━━━━━━━━━━━━━━━━━━━━━
🌐 **Сервер:** Server #19 — Memphis
🎂 **Возраст:** ${charAge} лет
💬 **Discord:** ${discordContact}
📸 **Скриншот персонажей:** ${screenshotCharacters}
📜 **История семей:** ${familyHistory}
🎯 **Откат с гангейма (тяжка/спешик):** ${ganggameRollback}
⏰ **Активность (прайм-тайм и суточный онлайн):** ${activityTime}
${staticId ? `🆔 **Static ID:** ${staticId}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
*Форма отправлена через приложение CortezBOT*`;
      } else {
        discordReport = 
`🎭 **ЗАЯВКА В РП СТАК CORTEZ (CORTEZBOT)**
━━━━━━━━━━━━━━━━━━━━━━
🌐 **Сервер:** Server #19 — Memphis
🎂 **Возраст:** ${charAge} лет
💬 **Discord:** ${discordContact}
📸 **Скриншот персонажей:** ${screenshotCharacters}
📜 **История семей:** ${familyHistory}
⏰ **Активность (прайм-тайм и суточный онлайн):** ${activityTime}
${staticId ? `🆔 **Static ID:** ${staticId}\n` : ''}━━━━━━━━━━━━━━━━━━━━━━
*Форма отправлена через приложение CortezBOT*`;
      }

      if (navigator.clipboard) {
        navigator.clipboard.writeText(discordReport).then(() => {
          showToast('Заявка скопирована в буфер для CortezBOT / Discord!');
        }).catch(() => {
          showToast('Заявка успешно сформирована!');
        });
      } else {
        showToast('Заявка принята!');
      }

      appForm.style.display = 'none';
      appSuccess.style.display = 'block';
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        appForm.reset();
        appForm.style.display = 'flex';
        appSuccess.style.display = 'none';
      });
    }
  }

  // ------------------------------------------------------------------------
  // 6. TOAST NOTIFICATION HELPER
  // ------------------------------------------------------------------------
  function showToast(message) {
    const toast = document.getElementById('toast');
    if (!toast) return;

    toast.textContent = message;
    toast.classList.add('show');

    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 3500);
  }

  // ------------------------------------------------------------------------
  // 8. STATS NUMBER COUNTER ON SCROLL
  // ------------------------------------------------------------------------
  const statNumbers = document.querySelectorAll('.stat-num[data-count]');
  let counted = false;

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !counted) {
        counted = true;
        statNumbers.forEach(el => {
          const target = parseInt(el.getAttribute('data-count'), 10);
          if (isNaN(target)) return;

          let start = 0;
          const duration = 1500;
          const stepTime = 30;
          const steps = duration / stepTime;
          const increment = target / steps;

          const timer = setInterval(() => {
            start += increment;
            if (start >= target) {
              el.textContent = target + '+';
              clearInterval(timer);
            } else {
              el.textContent = Math.floor(start) + '+';
            }
          }, stepTime);
        });
      }
    });
  }, { threshold: 0.5 });

  const statsRow = document.querySelector('.stats-row');
  if (statsRow) {
    observer.observe(statsRow);
  }

});
