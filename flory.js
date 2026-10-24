/**
 * FLORY FAMQ — MAJESTIC RP SERVER #15 PHOENIX
 * Official Portal Logic — Phoenix Edition
 */

document.addEventListener('DOMContentLoaded', () => {

  // ------------------------------------------------------------------------
  // 1. PHOENIX FLAME EMBERS CANVAS PARTICLE SYSTEM
  // ------------------------------------------------------------------------
  const canvas = document.getElementById('ambient-canvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let width, height;
    let particles = [];

    function resize() {
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    }
    window.addEventListener('resize', resize);
    resize();

    class FlameEmber {
      constructor() {
        this.reset(true);
      }

      reset(init = false) {
        this.x = Math.random() * width;
        this.y = init ? Math.random() * height : height + 10;
        this.size = Math.random() * 2.8 + 1;
        this.speedY = Math.random() * 1.2 + 0.5;
        this.speedX = (Math.random() - 0.5) * 0.8;
        this.alpha = Math.random() * 0.7 + 0.2;
        this.fade = Math.random() * 0.006 + 0.003;
        // Cyber Neon palette matching FLORY Panther: Magenta, Violet, Electric Purple, White Spark
        const colors = [
          '217, 70, 239',  // #D946EF Neon Magenta
          '224, 36, 195',  // #E024C3 Hot Pink Magenta
          '168, 85, 247',  // #A855F7 Electric Violet
          '147, 51, 234',  // #9333EA Cyber Purple
          '240, 171, 252', // Soft Glow Violet
          '255, 255, 255'  // Spark highlight
        ];
        this.color = colors[Math.floor(Math.random() * colors.length)];
      }

      update() {
        this.y -= this.speedY;
        this.x += this.speedX;
        this.alpha -= this.fade;

        if (this.y < -10 || this.alpha <= 0) {
          this.reset();
        }
      }

      draw() {
        ctx.save();
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(${this.color}, ${this.alpha})`;
        ctx.shadowBlur = 10;
        ctx.shadowColor = `rgba(${this.color}, 0.8)`;
        ctx.fill();
        ctx.restore();
      }
    }

    const count = Math.min(Math.floor(window.innerWidth / 20), 65);
    for (let i = 0; i < count; i++) {
      particles.push(new FlameEmber());
    }

    function animate() {
      ctx.clearRect(0, 0, width, height);
      particles.forEach(p => {
        p.update();
        p.draw();
      });
      requestAnimationFrame(animate);
    }
    animate();
  }

  // ------------------------------------------------------------------------
  // 2. HERO VIDEO AUDIO & FLOATING UNMUTE
  // ------------------------------------------------------------------------
  const bgVideo = document.getElementById('hero-bg-video');
  const unmuteBtn = document.getElementById('unmute-action-btn');
  const unmuteBanner = document.getElementById('unmute-banner');

  if (bgVideo && unmuteBtn) {
    unmuteBtn.addEventListener('click', () => {
      if (bgVideo.muted) {
        bgVideo.muted = false;
        bgVideo.volume = 1.0;
        unmuteBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          <span>Выключить звук</span>
        `;
        showToast('Звук видео включен!');
      } else {
        bgVideo.muted = true;
        unmuteBtn.innerHTML = `
          <span class="unmute-pulse"></span>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <path d="M19.07 4.93a10 10 0 0 1 0 14.14M15.54 8.46a5 5 0 0 1 0 7.07"></path>
          </svg>
          <span>Включить звук видео</span>
        `;
        showToast('Звук выключен');
      }
    });

    // Auto-unmute on first user click anywhere on page
    const unmuteOnInteraction = () => {
      if (bgVideo.muted) {
        bgVideo.muted = false;
        bgVideo.volume = 1.0;
        unmuteBtn.innerHTML = `
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"></polygon>
            <line x1="23" y1="9" x2="17" y2="15"></line>
            <line x1="17" y1="9" x2="23" y2="15"></line>
          </svg>
          <span>Выключить звук</span>
        `;
      }
      window.removeEventListener('click', unmuteOnInteraction);
      window.removeEventListener('touchstart', unmuteOnInteraction);
    };
    window.addEventListener('click', unmuteOnInteraction, { once: true });
    window.addEventListener('touchstart', unmuteOnInteraction, { once: true });
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

    navMenu.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', () => {
        navMenu.classList.remove('active');
        mobileToggle.setAttribute('aria-expanded', false);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 4. PROMO CODE COPY INTERACTION
  // ------------------------------------------------------------------------
  const copyPromoBtn = document.getElementById('copy-promo-btn');
  if (copyPromoBtn) {
    copyPromoBtn.addEventListener('click', () => {
      const code = 'FLORY';
      navigator.clipboard.writeText(code).then(() => {
        showToast(`Промокод "${code}" скопирован в буфер!`);
        copyPromoBtn.style.transform = 'scale(0.96)';
        setTimeout(() => {
          copyPromoBtn.style.transform = '';
        }, 180);
      }).catch(() => {
        showToast(`Промокод: ${code}`);
      });
    });
  }

  // ------------------------------------------------------------------------
  // 5. APPLICATION TABS (Семья vs РП стак)
  // ------------------------------------------------------------------------
  const tabFamily = document.getElementById('tab-family');
  const tabRp = document.getElementById('tab-rp');
  const ganggameGroup = document.getElementById('ganggame-group');
  const ganggameInput = document.getElementById('ganggame-rollback');
  let currentApplyType = 'family';

  function setApplyType(type) {
    currentApplyType = type;
    if (type === 'family') {
      tabFamily.classList.add('active');
      tabFamily.setAttribute('aria-selected', 'true');
      tabRp.classList.remove('active');
      tabRp.setAttribute('aria-selected', 'false');

      if (ganggameGroup) {
        ganggameGroup.style.display = 'flex';
      }
      if (ganggameInput) {
        ganggameInput.required = true;
      }
    } else {
      tabRp.classList.add('active');
      tabRp.setAttribute('aria-selected', 'true');
      tabFamily.classList.remove('active');
      tabFamily.setAttribute('aria-selected', 'false');

      if (ganggameGroup) {
        ganggameGroup.style.display = 'none';
      }
      if (ganggameInput) {
        ganggameInput.required = false;
        ganggameInput.value = '';
      }
    }
  }

  if (tabFamily && tabRp) {
    tabFamily.addEventListener('click', () => setApplyType('family'));
    tabRp.addEventListener('click', () => setApplyType('rp'));
  }

  // ------------------------------------------------------------------------
  // 6. MAIN RECRUITMENT APPLICATION FORM (FloryBOT)
  // ------------------------------------------------------------------------
  const applyForm = document.getElementById('apply-form');
  const applySuccess = document.getElementById('apply-success');
  const resetFormBtn = document.getElementById('reset-form-btn');
  const formCancelBtn = document.getElementById('form-cancel-btn');

  if (applyForm) {
    applyForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const typeLabel = currentApplyType === 'family' ? '⚔️ Заявка в семью FLORY (Основной капт-состав)' : '🎭 Заявка в РП стак FLORY';
      const name = document.getElementById('char-name')?.value.trim() || 'Не указано';
      const age = document.getElementById('ooc-age')?.value.trim() || 'Не указано';
      const discord = document.getElementById('discord-contact')?.value.trim() || 'Не указано';
      const screenshot = document.getElementById('screenshot-characters')?.value.trim() || 'Не указано';
      const history = document.getElementById('family-history')?.value.trim() || 'Не указано';
      const ganggame = currentApplyType === 'family' ? (document.getElementById('ganggame-rollback')?.value.trim() || 'Не указано') : 'Не требуется (РП стак)';
      const activity = document.getElementById('activity-time')?.value.trim() || 'Не указано';
      const staticId = document.getElementById('static-id-contact')?.value.trim() || 'Не указано';

      const formattedBotText = 
`━━━━━━━━━━━━━━━━━━━━━━━━━━
🔥 ${typeLabel} — СЕРВЕР #15 PHOENIX
━━━━━━━━━━━━━━━━━━━━━━━━━━
👤 Имя персонажа (IC): ${name}
🎂 Возраст (OOC): ${age}
💬 Discord для связи: ${discord}
🆔 Static ID на Phoenix: ${staticId}
📸 Скриншот персонажей: ${screenshot}
📜 История семей: ${history}
🎯 Откат с гангейма (тяжка/спешик): ${ganggame}
⏰ Активность (прайм / онлайн): ${activity}
━━━━━━━━━━━━━━━━━━━━━━━━━━
Отправлено через официальный сайт FLORY FAMQ`;

      navigator.clipboard.writeText(formattedBotText).then(() => {
        showToast('Заявка скопирована в буфер для FloryBOT!');
      }).catch(() => {});

      applyForm.style.display = 'none';
      if (applySuccess) {
        applySuccess.style.display = 'block';
        applySuccess.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    });

    if (resetFormBtn) {
      resetFormBtn.addEventListener('click', () => {
        applyForm.reset();
        applyForm.style.display = 'flex';
        if (applySuccess) {
          applySuccess.style.display = 'none';
        }
      });
    }

    if (formCancelBtn) {
      formCancelBtn.addEventListener('click', () => {
        applyForm.reset();
        showToast('Форма очищена');
      });
    }
  }

  // ------------------------------------------------------------------------
  // 7. QUICK MODAL DIALOG (<dialog>)
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

    // Light dismiss
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
        modalForm.style.display = 'none';
        if (modalSuccess) {
          modalSuccess.style.display = 'block';
        }
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
  // 8. TOAST NOTIFICATION HELPER
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
  // 9. STATS NUMBER COUNTER ON SCROLL
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
