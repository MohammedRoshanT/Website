// Smooth scrolling for nav links
document.addEventListener('click', (e) => {
  const link = e.target.closest('a[href^="#"]');
  if (!link) return;
  const href = link.getAttribute('href');
  if (href.length > 1) {
    const target = document.querySelector(href);
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      const menu = document.getElementById('navMenu');
      if (menu && menu.classList.contains('is-open')) toggleMenu(false);
    }
  }
});

// Mobile nav toggle
const navToggle = document.querySelector('.nav__toggle');
const navMenu = document.getElementById('navMenu');
function toggleMenu(forceState) {
  const willOpen = typeof forceState === 'boolean' ? forceState : !navMenu.classList.contains('is-open');
  navMenu.classList.toggle('is-open', willOpen);
  navToggle.setAttribute('aria-expanded', String(willOpen));
}
if (navToggle && navMenu) {
  navToggle.addEventListener('click', () => toggleMenu());
}

// Typewriter effect in hero
(function typewriter() {
  const phrases = [
    'Cybersecurity Aspirant',
    'Ethical Hacker',
    'Security Researcher',
    'CSE Student',
    'MERN Stack Developer',
    'DevOps Enthusiast'
  ];
  const txtEl = document.querySelector('.typewriter__text');
  if (!txtEl) return;
  let i = 0, char = 0, deleting = false;
  const type = () => {
    const phrase = phrases[i % phrases.length];
    if (!deleting) {
      char++;
      txtEl.textContent = phrase.slice(0, char);
      if (char === phrase.length) {
        deleting = true;
        setTimeout(type, 1200);
        return;
      }
    } else {
      char--;
      txtEl.textContent = phrase.slice(0, char);
      if (char === 0) {
        deleting = false;
        i++;
      }
    }
    const delay = deleting ? 45 : 90;
    setTimeout(type, delay);
  };
  setTimeout(type, 600);
})();

// Scroll reveal animations
function initScrollReveal() {
  const animated = Array.from(document.querySelectorAll('[data-animate]'));
  if (animated.length) {
    const io = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    animated.forEach((el) => io.observe(el));
  }
}

// Initialize scroll reveal on page load
initScrollReveal();

// Subtle 3D tilt for project cards
function initTiltEffects() {
  const tiltCards = Array.from(document.querySelectorAll('[data-tilt]'));
  tiltCards.forEach((card) => {
    const inner = card.querySelector('.project-card__inner') || card;
    let frame;
    const onMove = (e) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const rect = card.getBoundingClientRect();
        const dx = e.clientX - rect.left;
        const dy = e.clientY - rect.top;
        const px = (dx / rect.width) - 0.5; // -0.5..0.5
        const py = (dy / rect.height) - 0.5;
        const rx = -py * 6; // rotateX
        const ry = px * 10;  // rotateY
        card.style.transform = `perspective(1000px) rotateX(${rx}deg) rotateY(${ry}deg) translateZ(6px)`;
      });
    };
    const reset = () => {
      cancelAnimationFrame(frame);
      card.style.transform = '';
    };
    inner.addEventListener('mousemove', onMove);
    inner.addEventListener('mouseleave', reset);
  });
}

// Initialize tilt effects on page load
initTiltEffects();

// Hero particles (lightweight canvas animation)
(function particles() {
  const canvas = document.getElementById('heroParticles');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  let width, height, dpr;

  const PARTICLE_COUNT = 80;
  const particles = [];
  const rand = (min, max) => Math.random() * (max - min) + min;

  function resize() {
    dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    width = canvas.clientWidth;
    height = canvas.clientHeight;
    canvas.width = Math.floor(width * dpr);
    canvas.height = Math.floor(height * dpr);
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }

  function init() {
    particles.length = 0;
    for (let i = 0; i < PARTICLE_COUNT; i++) {
      particles.push({
        x: rand(0, width),
        y: rand(0, height),
        vx: rand(-0.4, 0.4),
        vy: rand(-0.4, 0.4),
        r: rand(0.6, 2.0),
        a: rand(0.2, 0.8)
      });
    }
  }

  function step() {
    ctx.clearRect(0, 0, width, height);
    // draw subtle connection lines
    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      p.x += p.vx; p.y += p.vy;
      if (p.x < -50) p.x = width + 50; else if (p.x > width + 50) p.x = -50;
      if (p.y < -50) p.y = height + 50; else if (p.y > height + 50) p.y = -50;
    }

    for (let i = 0; i < particles.length; i++) {
      const p = particles[i];
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(0,246,255,${p.a})`;
      ctx.shadowColor = 'rgba(0,246,255,0.6)';
      ctx.shadowBlur = 8;
      ctx.fill();
    }

    // connection lines
    for (let i = 0; i < particles.length; i++) {
      for (let j = i + 1; j < particles.length; j++) {
        const p1 = particles[i], p2 = particles[j];
        const dx = p1.x - p2.x, dy = p1.y - p2.y;
        const dist = Math.hypot(dx, dy);
        if (dist < 120) {
          const alpha = 1 - dist / 120;
          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);
          ctx.strokeStyle = `rgba(0,246,255,${alpha * 0.2})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(step);
  }

  const onResize = () => { resize(); init(); };
  window.addEventListener('resize', onResize);
  resize();
  init();
  step();
})();

// Footer year
const yearEl = document.getElementById('currentYear');
if (yearEl) yearEl.textContent = String(new Date().getFullYear());

// Fetch GitHub repositories
async function fetchGitHubRepos() {
  const username = 'mohammedroshant';
  const projectsGrid = document.querySelector('.projects__grid');
  
  if (!projectsGrid) return;
  
  try {
    const response = await fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`);
    if (!response.ok) throw new Error(`GitHub API error: ${response.status}`);
    
    const repos = await response.json();
    const filteredRepos = repos.filter(repo => 
      !repo.fork && 
      !repo.name.includes('roshan') && 
      repo.name !== 'mohammedroshant' &&
      repo.description
    );
    
    // Clear existing static content
    projectsGrid.innerHTML = '';
    
    // Create project cards for each repo
    filteredRepos.slice(0, 4).forEach((repo, index) => {
      const card = createProjectCard(repo, index);
      projectsGrid.appendChild(card);
    });
    
    // Reinitialize animations and tilt effects for new cards
    initScrollReveal();
    initTiltEffects();
    
  } catch (error) {
    console.error('Error fetching GitHub repos:', error);
    // Keep the original static content if API fails
  }
}

function createProjectCard(repo, index) {
  const card = document.createElement('article');
  card.className = 'project-card';
  card.setAttribute('data-tilt', '');
  card.setAttribute('data-animate', 'fade-up');
  
  // Get language icon
  const languageIcon = getLanguageIcon(repo.language);
  
  // Create tech tags from language and topics
  const techTags = [repo.language, ...(repo.topics || [])].filter(Boolean).slice(0, 4);
  
  card.innerHTML = `
    <div class="project-card__inner">
      <h3 class="project-card__title">${repo.name.replace(/-/g, ' ').replace(/\b\w/g, l => l.toUpperCase())}</h3>
      <p class="project-card__desc">${repo.description || 'A project showcasing modern web development practices.'}</p>
      <ul class="project-card__tags" role="list">
        ${techTags.map(tag => `<li>${tag}</li>`).join('')}
      </ul>
      <div class="project-card__links">
        <a class="btn btn--ghost" href="${repo.html_url}" target="_blank" rel="noopener noreferrer">GitHub</a>
        <a class="btn btn--secondary" href="${repo.homepage || '#'}" target="_blank" rel="noopener noreferrer">Live Demo</a>
      </div>
    </div>
  `;
  
  return card;
}

function getLanguageIcon(language) {
  const icons = {
    'JavaScript': 'fab fa-js',
    'TypeScript': 'fab fa-js',
    'React': 'fab fa-react',
    'Node.js': 'fab fa-node-js',
    'HTML': 'fab fa-html5',
    'CSS': 'fab fa-css3-alt',
    'Python': 'fab fa-python',
    'Java': 'fab fa-java',
    'PHP': 'fab fa-php',
    'C++': 'fas fa-code',
    'C#': 'fas fa-code',
    'Go': 'fab fa-golang',
    'Rust': 'fas fa-code',
    'Ruby': 'fab fa-ruby',
    'Swift': 'fab fa-swift',
    'Kotlin': 'fas fa-code',
    'Dart': 'fas fa-code',
    'Vue': 'fab fa-vuejs',
    'Angular': 'fab fa-angular',
    'Svelte': 'fas fa-code'
  };
  return icons[language] || 'fas fa-code';
}

// Initialize GitHub repos on page load
document.addEventListener('DOMContentLoaded', () => {
  fetchGitHubRepos();
});



