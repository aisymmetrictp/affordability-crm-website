/* ============================================
   AISymmetric CRM — Landing Page Scripts
   Particles, Typewriter, Counters, Scroll FX
   ============================================ */

// ============ PARTICLE SYSTEM (Valor-inspired sparks) ============
class ParticleSystem {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.particles = [];
    this.resize();
    window.addEventListener('resize', () => this.resize());
  }

  resize() {
    this.canvas.width = window.innerWidth;
    this.canvas.height = window.innerHeight;
  }

  createParticle() {
    return {
      x: Math.random() * this.canvas.width,
      y: this.canvas.height + 10,
      vx: (Math.random() - 0.5) * 0.5,
      vy: -(Math.random() * 1.5 + 0.5),
      size: Math.random() * 2 + 0.5,
      life: 1,
      decay: Math.random() * 0.005 + 0.002,
      color: Math.random() > 0.5 ? '249, 115, 22' : '37, 99, 235',
    };
  }

  update() {
    // Add new particles
    if (this.particles.length < 80) {
      this.particles.push(this.createParticle());
    }

    this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

    this.particles = this.particles.filter(p => {
      p.x += p.vx;
      p.y += p.vy;
      p.life -= p.decay;

      if (p.life <= 0) return false;

      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.6})`;
      this.ctx.fill();

      // Glow
      this.ctx.beginPath();
      this.ctx.arc(p.x, p.y, p.size * 3, 0, Math.PI * 2);
      this.ctx.fillStyle = `rgba(${p.color}, ${p.life * 0.1})`;
      this.ctx.fill();

      return true;
    });

    requestAnimationFrame(() => this.update());
  }

  start() {
    this.update();
  }
}

// Init particles
const particleCanvas = document.getElementById('particles');
if (particleCanvas) {
  const ps = new ParticleSystem(particleCanvas);
  ps.start();
}

// ============ TYPEWRITER ============
const typewriterEl = document.getElementById('typewriter');
const phrases = [
  'Replaces $50+ Tools',
  'Thinks For You',
  'Heals Itself',
  'Knows Your Industry',
  'Scales With You',
  'Works on Day 1',
];

let phraseIndex = 0;
let charIndex = 0;
let isDeleting = false;
let typeSpeed = 80;

function typewrite() {
  if (!typewriterEl) return;

  const currentPhrase = phrases[phraseIndex];

  if (isDeleting) {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex - 1);
    charIndex--;
    typeSpeed = 40;
  } else {
    typewriterEl.textContent = currentPhrase.substring(0, charIndex + 1);
    charIndex++;
    typeSpeed = 80;
  }

  if (!isDeleting && charIndex === currentPhrase.length) {
    typeSpeed = 2000; // Pause at end
    isDeleting = true;
  } else if (isDeleting && charIndex === 0) {
    isDeleting = false;
    phraseIndex = (phraseIndex + 1) % phrases.length;
    typeSpeed = 400; // Pause before next phrase
  }

  setTimeout(typewrite, typeSpeed);
}

typewrite();

// ============ NAVBAR SCROLL ============
const navbar = document.getElementById('navbar');
let lastScroll = 0;

window.addEventListener('scroll', () => {
  const currentScroll = window.pageYOffset;

  if (currentScroll > 50) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }

  lastScroll = currentScroll;
});

// ============ MOBILE MENU ============
const mobileToggle = document.getElementById('mobileToggle');
const navLinks = document.getElementById('navLinks');

if (mobileToggle) {
  mobileToggle.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    mobileToggle.classList.toggle('active');
  });

  // Close on link click
  navLinks.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('active');
      mobileToggle.classList.remove('active');
    });
  });
}

// ============ COUNTER ANIMATION ============
const counters = document.querySelectorAll('.counter');
let countersStarted = false;

function animateCounters() {
  counters.forEach(counter => {
    const target = parseInt(counter.getAttribute('data-target'));
    const duration = 2000;
    const step = target / (duration / 16);
    let current = 0;

    function update() {
      current += step;
      if (current >= target) {
        counter.textContent = target.toLocaleString();
        return;
      }
      counter.textContent = Math.floor(current).toLocaleString();
      requestAnimationFrame(update);
    }

    update();
  });
}

// ============ SCROLL REVEAL (Custom AOS) ============
function revealOnScroll() {
  const elements = document.querySelectorAll('[data-aos]');
  const windowHeight = window.innerHeight;

  elements.forEach(el => {
    const elementTop = el.getBoundingClientRect().top;
    const delay = parseInt(el.getAttribute('data-aos-delay')) || 0;

    if (elementTop < windowHeight * 0.85) {
      setTimeout(() => {
        el.classList.add('visible');
      }, delay);
    }
  });

  // Counter trigger
  if (!countersStarted) {
    const heroVisual = document.querySelector('.hero-visual');
    if (heroVisual) {
      const rect = heroVisual.getBoundingClientRect();
      if (rect.top < windowHeight) {
        countersStarted = true;
        animateCounters();
      }
    }
  }
}

window.addEventListener('scroll', revealOnScroll);
window.addEventListener('load', revealOnScroll);

// ============ SMOOTH SCROLL ============
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    const href = this.getAttribute('href');
    if (href === '#') return;

    e.preventDefault();
    const target = document.querySelector(href);
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// ============ TILT EFFECT ON CARDS ============
document.querySelectorAll('.value-card, .agent-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateX = (y - centerY) / 20;
    const rotateY = (centerX - x) / 20;

    card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
  });

  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// ============ PRICING CARD HOVER GLOW ============
document.querySelectorAll('.pricing-card').forEach(card => {
  card.addEventListener('mousemove', (e) => {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    card.style.setProperty('--glow-x', `${x}px`);
    card.style.setProperty('--glow-y', `${y}px`);
  });
});

// ============ FAQ ACCORDION ============
document.querySelectorAll('.faq-question').forEach(btn => {
  btn.addEventListener('click', () => {
    const item = btn.parentElement;
    const isOpen = item.classList.contains('open');

    // Close all other items
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('open');
      i.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
    });

    // Toggle current
    if (!isOpen) {
      item.classList.add('open');
      btn.setAttribute('aria-expanded', 'true');
    }
  });
});

// ============ PARALLAX on hero orbs ============
window.addEventListener('mousemove', (e) => {
  const x = (e.clientX / window.innerWidth - 0.5) * 2;
  const y = (e.clientY / window.innerHeight - 0.5) * 2;

  document.querySelectorAll('.hero-orb').forEach((orb, i) => {
    const speed = (i + 1) * 10;
    orb.style.transform = `translate(${x * speed}px, ${y * speed}px)`;
  });
});
