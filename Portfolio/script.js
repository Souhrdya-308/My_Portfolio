/* ═══════════════════════════════════════
   Stars Canvas Background with Parallax
   ═══════════════════════════════════════ */
const canvas = document.getElementById('stars-canvas');
const ctx = canvas.getContext('2d');
let stars = [];
let scrollOffset = 0;

function resizeCanvas() {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
}

function createStars() {
  stars = [];
  const count = Math.floor((canvas.width * canvas.height) / 2200);
  for (let i = 0; i < count; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      radius: Math.random() * 1.8 + 0.2,
      alpha: Math.random() * 0.8 + 0.2,
      speed: Math.random() * 0.25 + 0.03,
      twinkleSpeed: Math.random() * 0.015 + 0.004,
      twinkleDir: Math.random() > 0.5 ? 1 : -1,
      depth: Math.random() * 3 + 1 // parallax depth
    });
  }
}

function drawStars() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  stars.forEach(star => {
    star.alpha += star.twinkleSpeed * star.twinkleDir;
    if (star.alpha >= 1 || star.alpha <= 0.1) star.twinkleDir *= -1;
    star.y -= star.speed;
    // Parallax offset
    const py = star.y - (scrollOffset * star.depth * 0.03);
    const drawY = ((py % canvas.height) + canvas.height) % canvas.height;
    if (star.y < -5) { star.y = canvas.height + 5; star.x = Math.random() * canvas.width; }
    ctx.beginPath();
    ctx.arc(star.x, drawY, star.radius, 0, Math.PI * 2);
    ctx.fillStyle = `rgba(186, 230, 253, ${star.alpha})`;
    ctx.fill();
  });
  requestAnimationFrame(drawStars);
}

resizeCanvas();
createStars();
drawStars();

// Track scroll for parallax
window.addEventListener('scroll', () => {
  scrollOffset = window.scrollY;
}, { passive: true });

/* ═══════════════════════════════════════
   Spaceship Canvas
   ═══════════════════════════════════════ */
const shipCanvas = document.getElementById('spaceship-canvas');
const shipCtx = shipCanvas.getContext('2d');
let spaceships = [];

function resizeShipCanvas() {
  shipCanvas.width = window.innerWidth;
  shipCanvas.height = window.innerHeight;
}

function createSpaceships() {
  spaceships = [];
  const count = 4 + Math.floor(Math.random() * 3);
  for (let i = 0; i < count; i++) {
    spaceships.push(makeShip());
  }
}

function makeShip() {
  const side = Math.random();
  let x, y, vx, vy;
  const speed = 0.3 + Math.random() * 1.0;
  if (side < 0.25) { x = -40; y = Math.random() * shipCanvas.height; vx = speed; vy = (Math.random() - 0.5) * 0.4; }
  else if (side < 0.5) { x = shipCanvas.width + 40; y = Math.random() * shipCanvas.height; vx = -speed; vy = (Math.random() - 0.5) * 0.4; }
  else if (side < 0.75) { x = Math.random() * shipCanvas.width; y = -40; vx = (Math.random() - 0.5) * 0.4; vy = speed; }
  else { x = Math.random() * shipCanvas.width; y = shipCanvas.height + 40; vx = (Math.random() - 0.5) * 0.4; vy = -speed; }
  return {
    x, y, vx, vy,
    size: 8 + Math.random() * 14,
    type: Math.floor(Math.random() * 3),
    alpha: 0.35 + Math.random() * 0.35,
    thrustPhase: Math.random() * Math.PI * 2
  };
}

function drawShip(s) {
  shipCtx.save();
  shipCtx.translate(s.x, s.y);
  const angle = Math.atan2(s.vy, s.vx);
  shipCtx.rotate(angle);
  shipCtx.globalAlpha = s.alpha;
  const sz = s.size;

  if (s.type === 0) {
    shipCtx.beginPath();
    shipCtx.moveTo(sz, 0);
    shipCtx.lineTo(-sz * 0.6, -sz * 0.4);
    shipCtx.lineTo(-sz * 0.3, 0);
    shipCtx.lineTo(-sz * 0.6, sz * 0.4);
    shipCtx.closePath();
    shipCtx.fillStyle = '#94a3b8';
    shipCtx.fill();
    shipCtx.strokeStyle = 'rgba(56,189,248,0.6)';
    shipCtx.lineWidth = 1;
    shipCtx.stroke();
    shipCtx.beginPath();
    shipCtx.arc(sz * 0.3, 0, sz * 0.12, 0, Math.PI * 2);
    shipCtx.fillStyle = '#38bdf8';
    shipCtx.fill();
  } else if (s.type === 1) {
    shipCtx.beginPath();
    shipCtx.ellipse(0, 0, sz * 0.8, sz * 0.25, 0, 0, Math.PI * 2);
    shipCtx.fillStyle = '#64748b';
    shipCtx.fill();
    shipCtx.strokeStyle = 'rgba(103,232,249,0.5)';
    shipCtx.lineWidth = 1;
    shipCtx.stroke();
    shipCtx.beginPath();
    shipCtx.ellipse(0, -sz * 0.12, sz * 0.3, sz * 0.2, 0, Math.PI, 0);
    shipCtx.fillStyle = 'rgba(56,189,248,0.4)';
    shipCtx.fill();
  } else {
    shipCtx.beginPath();
    shipCtx.moveTo(sz * 0.7, 0);
    shipCtx.lineTo(-sz * 0.4, -sz * 0.5);
    shipCtx.lineTo(-sz * 0.2, -sz * 0.1);
    shipCtx.lineTo(-sz * 0.2, sz * 0.1);
    shipCtx.lineTo(-sz * 0.4, sz * 0.5);
    shipCtx.closePath();
    shipCtx.fillStyle = '#475569';
    shipCtx.fill();
    shipCtx.strokeStyle = 'rgba(165,243,252,0.4)';
    shipCtx.lineWidth = 0.8;
    shipCtx.stroke();
  }

  // Engine glow
  s.thrustPhase += 0.1;
  const thrustLen = sz * (0.3 + Math.sin(s.thrustPhase) * 0.15);
  const gradient = shipCtx.createRadialGradient(-sz * 0.4, 0, 0, -sz * 0.4, 0, thrustLen);
  gradient.addColorStop(0, 'rgba(56,189,248,0.7)');
  gradient.addColorStop(0.5, 'rgba(103,232,249,0.3)');
  gradient.addColorStop(1, 'rgba(56,189,248,0)');
  shipCtx.beginPath();
  shipCtx.arc(-sz * 0.4, 0, thrustLen, 0, Math.PI * 2);
  shipCtx.fillStyle = gradient;
  shipCtx.fill();

  shipCtx.restore();
}

function animateSpaceships() {
  shipCtx.clearRect(0, 0, shipCanvas.width, shipCanvas.height);
  for (let i = spaceships.length - 1; i >= 0; i--) {
    const s = spaceships[i];
    s.x += s.vx;
    s.y += s.vy;
    drawShip(s);
    if (s.x < -80 || s.x > shipCanvas.width + 80 || s.y < -80 || s.y > shipCanvas.height + 80) {
      spaceships[i] = makeShip();
    }
  }
  requestAnimationFrame(animateSpaceships);
}

resizeShipCanvas();
createSpaceships();
animateSpaceships();

/* Resize handler */
window.addEventListener('resize', () => {
  resizeCanvas(); createStars();
  resizeShipCanvas(); createSpaceships();
});

/* ═══════════════════════════════════════
   Smooth Scroll Navigation
   ═══════════════════════════════════════ */
document.querySelectorAll('nav a[href^="#"]').forEach(link => {
  link.addEventListener('click', e => {
    e.preventDefault();
    const id = link.getAttribute('href');
    const target = document.querySelector(id);
    if (target) {
      const offset = 80;
      const top = target.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: 'smooth' });
    }
    document.querySelector('nav').classList.remove('open');
    document.querySelector('.hamburger').classList.remove('active');
  });
});

/* ═══════════════════════════════════════
   Active Nav Highlight on Scroll
   ═══════════════════════════════════════ */
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a[href^="#"]');

function updateActiveNav() {
  const scrollY = window.scrollY + 150;
  sections.forEach(sec => {
    const top = sec.offsetTop;
    const height = sec.offsetHeight;
    const id = sec.getAttribute('id');
    const link = document.querySelector(`nav a[href="#${id}"]`);
    if (link) {
      if (scrollY >= top && scrollY < top + height) {
        navLinks.forEach(l => l.classList.remove('active'));
        link.classList.add('active');
      }
    }
  });
}
window.addEventListener('scroll', updateActiveNav);

/* ═══════════════════════════════════════
   Header shrink on scroll
   ═══════════════════════════════════════ */
const header = document.querySelector('header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

/* ═══════════════════════════════════════
   Mobile Hamburger Menu
   ═══════════════════════════════════════ */
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('nav');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('active');
  navMenu.classList.toggle('open');
});

/* ═══════════════════════════════════════
   Scroll Reveal Animations
   ═══════════════════════════════════════ */
const revealEls = document.querySelectorAll('.reveal');
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) entry.target.classList.add('visible');
  });
}, { threshold: 0.1 });
revealEls.forEach(el => revealObserver.observe(el));

/* ═══════════════════════════════════════
   Skill Card Stagger Animation + Glow Colors
   ═══════════════════════════════════════ */
// Set per-card glow color from data-color attribute
document.querySelectorAll('.skill-card[data-color]').forEach(card => {
  const color = card.dataset.color;
  card.style.setProperty('--glow-color', color + '35');
});

const skillObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      const cards = entry.target.querySelectorAll('.skill-card');
      cards.forEach((card, i) => {
        setTimeout(() => card.classList.add('visible'), i * 80);
      });
      skillObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.2 });

document.querySelectorAll('.skills-category').forEach(cat => {
  skillObserver.observe(cat);
});

/* ═══════════════════════════════════════
   3D Tilt Effect on Cards
   ═══════════════════════════════════════ */
function initTiltCards() {
  const cards = document.querySelectorAll('.card, .highlight-card');
  
  cards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;
      const rotateX = ((y - centerY) / centerY) * -5;
      const rotateY = ((x - centerX) / centerX) * 5;
      
      card.style.transform = `perspective(800px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-6px) scale(1.02)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
    });
  });
}
initTiltCards();

/* ═══════════════════════════════════════
   Count-Up Animation for Stats
   ═══════════════════════════════════════ */
function animateCountUp(element, target, duration = 1500) {
  const isFloat = String(target).includes('.');
  const hasPlus = element.textContent.includes('+');
  let start = 0;
  const startTime = performance.now();
  
  function update(currentTime) {
    const elapsed = currentTime - startTime;
    const progress = Math.min(elapsed / duration, 1);
    // Ease out cubic
    const eased = 1 - Math.pow(1 - progress, 3);
    const current = start + (target - start) * eased;
    
    if (isFloat) {
      element.textContent = current.toFixed(2) + (hasPlus ? '+' : '');
    } else {
      element.textContent = Math.floor(current) + (hasPlus ? '+' : '');
    }
    
    if (progress < 1) {
      requestAnimationFrame(update);
    } else {
      // Restore original text
      if (isFloat) {
        element.textContent = target + (hasPlus ? '+' : '');
      } else {
        element.textContent = target + (hasPlus ? '+' : '');
      }
    }
  }
  
  requestAnimationFrame(update);
}

function initCountUp() {
  const statElements = document.querySelectorAll('.highlight-number, .stat-value, .training-stat-value');
  
  const countObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting && !entry.target.dataset.counted) {
        entry.target.dataset.counted = 'true';
        const text = entry.target.textContent.trim();
        const numMatch = text.match(/[\d.]+/);
        if (numMatch) {
          const num = parseFloat(numMatch[0]);
          if (!isNaN(num) && num > 0) {
            animateCountUp(entry.target, num);
          }
        }
      }
    });
  }, { threshold: 0.5 });
  
  statElements.forEach(el => countObserver.observe(el));
}
initCountUp();

/* ═══════════════════════════════════════
   Floating Particles Effect
   ═══════════════════════════════════════ */
function createFloatingParticles() {
  const heroSection = document.querySelector('.hero');
  if (!heroSection) return;
  
  for (let i = 0; i < 8; i++) {
    const particle = document.createElement('div');
    particle.style.cssText = `
      position: absolute;
      width: ${3 + Math.random() * 5}px;
      height: ${3 + Math.random() * 5}px;
      background: rgba(56, 189, 248, ${0.1 + Math.random() * 0.2});
      border-radius: 50%;
      pointer-events: none;
      z-index: 0;
      left: ${Math.random() * 100}%;
      top: ${Math.random() * 100}%;
      animation: particleFloat ${5 + Math.random() * 10}s ease-in-out infinite;
      animation-delay: ${Math.random() * 5}s;
    `;
    heroSection.appendChild(particle);
  }
  
  // Add keyframe
  if (!document.getElementById('particle-styles')) {
    const style = document.createElement('style');
    style.id = 'particle-styles';
    style.textContent = `
      @keyframes particleFloat {
        0%, 100% { transform: translate(0, 0) scale(1); opacity: 0.3; }
        25% { transform: translate(30px, -40px) scale(1.2); opacity: 0.6; }
        50% { transform: translate(-20px, -80px) scale(0.8); opacity: 0.4; }
        75% { transform: translate(40px, -30px) scale(1.1); opacity: 0.5; }
      }
    `;
    document.head.appendChild(style);
  }
}
createFloatingParticles();

/* ═══════════════════════════════════════
   Typing Effect
   ═══════════════════════════════════════ */
const typingEl = document.getElementById('typing-text');
const phrases = [
  'Building Intelligent AI Systems',
  'Solving 900+ Algorithmic Challenges',
  'Deep Learning & Computer Vision',
  'Competitive Programming Enthusiast',
  'GATE 2026 CS/IT Qualified'
];
let phraseIdx = 0, charIdx = 0, isDeleting = false;

function typeEffect() {
  const current = phrases[phraseIdx];
  if (isDeleting) {
    typingEl.textContent = current.substring(0, charIdx--);
    if (charIdx < 0) { isDeleting = false; phraseIdx = (phraseIdx + 1) % phrases.length; }
    setTimeout(typeEffect, 28);
  } else {
    typingEl.textContent = current.substring(0, charIdx++);
    if (charIdx > current.length) { isDeleting = true; setTimeout(typeEffect, 2200); }
    else setTimeout(typeEffect, 50);
  }
}
typeEffect();

/* ═══════════════════════════════════════
   Page Loader
   ═══════════════════════════════════════ */
window.addEventListener('load', () => {
  const loader = document.getElementById('page-loader');
  if (loader) {
    setTimeout(() => {
      loader.classList.add('hidden');
    }, 800);
  }
});

/* ═══════════════════════════════════════
   Scroll Progress Bar
   ═══════════════════════════════════════ */
const progressBar = document.getElementById('scroll-progress');

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const scrollPercent = (scrollTop / docHeight) * 100;
  if (progressBar) {
    progressBar.style.width = scrollPercent + '%';
  }
}

window.addEventListener('scroll', updateScrollProgress, { passive: true });

/* ═══════════════════════════════════════
   Cursor Spotlight
   ═══════════════════════════════════════ */
const spotlight = document.getElementById('cursor-spotlight');
let spotlightActive = false;

document.addEventListener('mousemove', (e) => {
  if (spotlight) {
    if (!spotlightActive) {
      spotlight.classList.add('active');
      spotlightActive = true;
    }
    spotlight.style.left = e.clientX + 'px';
    spotlight.style.top = e.clientY + 'px';
  }
});

document.addEventListener('mouseleave', () => {
  if (spotlight) {
    spotlight.classList.remove('active');
    spotlightActive = false;
  }
});

/* ═══════════════════════════════════════
   Back to Top Button
   ═══════════════════════════════════════ */
const backToTop = document.getElementById('back-to-top');

window.addEventListener('scroll', () => {
  if (backToTop) {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  }
}, { passive: true });

if (backToTop) {
  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}
