document.addEventListener('DOMContentLoaded', () => {

  // ========== PARTICLE CANVAS (upgraded) ==========
  const canvas = document.getElementById('heroCanvas');
  if (canvas) {
    const ctx = canvas.getContext('2d');
    let particles = [];
    let mouseX = 0, mouseY = 0;

    function resize() {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    }
    resize();
    window.addEventListener('resize', resize);

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
    });

    class Particle {
      constructor() {
        this.reset();
      }
      reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.size = Math.random() * 2 + 0.3;
        this.baseSpeedX = (Math.random() - 0.5) * 0.4;
        this.baseSpeedY = (Math.random() - 0.5) * 0.4;
        this.speedX = this.baseSpeedX;
        this.speedY = this.baseSpeedY;
        this.opacity = Math.random() * 0.5 + 0.1;
        this.pulse = Math.random() * Math.PI * 2;
      }
      update() {
        // Mouse repulsion
        const dx = this.x - mouseX;
        const dy = this.y - mouseY;
        const dist = Math.sqrt(dx * dx + dy * dy);
        if (dist < 200) {
          const force = (200 - dist) / 200;
          this.speedX = this.baseSpeedX + (dx / dist) * force * 1.5;
          this.speedY = this.baseSpeedY + (dy / dist) * force * 1.5;
        } else {
          this.speedX += (this.baseSpeedX - this.speedX) * 0.05;
          this.speedY += (this.baseSpeedY - this.speedY) * 0.05;
        }

        this.x += this.speedX;
        this.y += this.speedY;
        this.pulse += 0.02;

        if (this.x < -10) this.x = canvas.width + 10;
        if (this.x > canvas.width + 10) this.x = -10;
        if (this.y < -10) this.y = canvas.height + 10;
        if (this.y > canvas.height + 10) this.y = -10;
      }
      draw() {
        const pulsedOpacity = this.opacity * (0.7 + Math.sin(this.pulse) * 0.3);
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(56, 189, 248, ${pulsedOpacity})`;
        ctx.fill();

        // Glow effect on larger particles
        if (this.size > 1.2) {
          ctx.beginPath();
          ctx.arc(this.x, this.y, this.size * 4, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(56, 189, 248, ${pulsedOpacity * 0.06})`;
          ctx.fill();
        }
      }
    }

    const count = Math.min(120, Math.floor(window.innerWidth / 12));
    for (let i = 0; i < count; i++) {
      particles.push(new Particle());
    }

    function connectParticles() {
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 140) {
            const opacity = 0.08 * (1 - dist / 140);
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(56, 189, 248, ${opacity})`;
            ctx.lineWidth = 0.6;
            ctx.stroke();
          }
        }
      }
    }

    function animateParticles() {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Center glow
      const gradient = ctx.createRadialGradient(
        canvas.width / 2, canvas.height * 0.4, 0,
        canvas.width / 2, canvas.height * 0.4, canvas.width * 0.4
      );
      gradient.addColorStop(0, 'rgba(56, 189, 248, 0.02)');
      gradient.addColorStop(1, 'transparent');
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      particles.forEach(p => { p.update(); p.draw(); });
      connectParticles();
      requestAnimationFrame(animateParticles);
    }
    animateParticles();
  }

  // ========== CURSOR GLOW ==========
  const glow = document.getElementById('cursorGlow');
  if (glow && window.innerWidth > 768) {
    let glowX = 0, glowY = 0, targetX = 0, targetY = 0;
    document.addEventListener('mousemove', (e) => {
      targetX = e.clientX;
      targetY = e.clientY;
    });
    function animateGlow() {
      glowX += (targetX - glowX) * 0.08;
      glowY += (targetY - glowY) * 0.08;
      glow.style.left = glowX + 'px';
      glow.style.top = glowY + 'px';
      requestAnimationFrame(animateGlow);
    }
    animateGlow();
  }

  // ========== NAVBAR SCROLL ==========
  const navbar = document.getElementById('navbar');
  let lastScroll = 0;
  window.addEventListener('scroll', () => {
    const st = window.scrollY;
    if (st > 100) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
    lastScroll = st;
  });

  // ========== REVEAL ON SCROLL (staggered) ==========
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, i) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, i * 80);
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.08, rootMargin: '0px 0px -60px 0px' });

  document.querySelectorAll('.reveal').forEach(el => {
    revealObserver.observe(el);
  });

  // ========== COUNTER ANIMATION ==========
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.textContent;
        const match = text.match(/\+?(\d+)/);
        if (match) {
          const target = parseInt(match[1]);
          const prefix = text.startsWith('+') ? '+' : '';
          const suffix = text.includes('%') ? '%' : '';
          let current = 0;
          const duration = 2500;
          const startTime = performance.now();
          function easeOut(t) { return 1 - Math.pow(1 - t, 3); }
          function tick(now) {
            const elapsed = now - startTime;
            const progress = Math.min(elapsed / duration, 1);
            current = Math.floor(easeOut(progress) * target);
            el.textContent = prefix + current + suffix;
            if (progress < 1) requestAnimationFrame(tick);
          }
          requestAnimationFrame(tick);
        }
        counterObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  document.querySelectorAll('.afc-number').forEach(el => {
    counterObserver.observe(el);
  });

  // ========== SMOOTH SCROLL ==========
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      e.preventDefault();
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        const offset = 80;
        const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
        window.scrollTo({ top, behavior: 'smooth' });
      }
    });
  });

  // ========== FORM ==========
  const API_URL = 'https://www.andersdev.com.br';

  const form = document.getElementById('leadForm');
  if (form) {
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      const data = new FormData(form);
      const name = data.get('name') || '';
      const email = data.get('email') || '';
      const phone = data.get('phone') || '';
      const sector = data.get('sector') || '';
      const idea = data.get('idea') || '';

      const btn = form.querySelector('.cta-btn');
      const btnSpan = btn.querySelector('span');
      const originalText = btnSpan.textContent;
      btnSpan.textContent = 'ENVIANDO...';
      btn.style.pointerEvents = 'none';

      // 1) Salva no banco + envia email
      try {
        await fetch(`${API_URL}/api/lead`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name, email, phone, sector, idea })
        });
      } catch (err) {
        console.log('API offline, lead vai pelo WhatsApp');
      }

      // 2) WhatsApp
      const msg = encodeURIComponent(
        `Olá Daniel! Meu nome é ${name}.` +
        (sector ? ` Meu setor: ${sector}.` : '') +
        (idea ? ` Minha ideia/dor: ${idea}` : '') +
        (phone ? ` | WhatsApp: ${phone}` : '')
      );
      const whatsappUrl = `https://wa.me/5554999648368?text=${msg}`;

      btnSpan.textContent = '✅ ENVIADO! ABRINDO WHATSAPP...';
      btn.style.background = 'linear-gradient(135deg, #2d8a1e, #4CAF30)';

      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        btnSpan.textContent = originalText;
        btn.style.background = '';
        btn.style.pointerEvents = '';
        form.reset();
      }, 1200);
    });
  }

  // ========== TILT EFFECT ON CARDS ==========
  if (window.innerWidth > 768) {
    document.querySelectorAll('[data-tilt]').forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = (y - centerY) / centerY * -4;
        const rotateY = (x - centerX) / centerX * 4;
        card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(800px) rotateX(0) rotateY(0) translateY(0)';
      });
    });
  }

  // ========== PARALLAX ON SECTIONS ==========
  if (window.innerWidth > 768) {
    window.addEventListener('scroll', () => {
      const st = window.scrollY;
      document.querySelectorAll('.section-accent::before').forEach(el => {
        el.style.transform = `translateY(${st * 0.05}px)`;
      });
    });
  }
});
