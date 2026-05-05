const header = document.querySelector('.site-header');
const menuToggle = document.getElementById('menuToggle');
const mobilePanel = document.getElementById('mobilePanel');
const mobileOverlay = document.getElementById('mobileOverlay');
const mobileClose = document.getElementById('mobileClose');

function closeMenu() {
  mobilePanel.classList.remove('open');
  mobileOverlay.classList.remove('show');
  document.body.classList.remove('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'false');
  mobilePanel?.setAttribute('aria-hidden', 'true');
}

function openMenu() {
  mobilePanel.classList.add('open');
  mobileOverlay.classList.add('show');
  document.body.classList.add('menu-open');
  menuToggle?.setAttribute('aria-expanded', 'true');
  mobilePanel?.setAttribute('aria-hidden', 'false');
}

menuToggle?.addEventListener('click', () => {
  if (mobilePanel.classList.contains('open')) {
    closeMenu();
  } else {
    openMenu();
  }
});

mobileClose?.addEventListener('click', closeMenu);
mobileOverlay?.addEventListener('click', closeMenu);

document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener('click', (event) => {
    const href = anchor.getAttribute('href');
    if (!href || href === '#') return;
    const target = document.querySelector(href);
    if (!target) return;

    event.preventDefault();
    const headerOffset = header ? header.offsetHeight : 80;
    const top = target.getBoundingClientRect().top + window.pageYOffset - headerOffset + 1;

    window.scrollTo({ top, behavior: 'smooth' });
    closeMenu();
  });
});

const slides = Array.from(document.querySelectorAll('.slide'));
const dotsWrap = document.getElementById('sliderDots');
const prevBtn = document.getElementById('sliderPrev');
const nextBtn = document.getElementById('sliderNext');
let currentSlide = 0;
let autoTimer;

function renderDots() {
  slides.forEach((_, index) => {
    const dot = document.createElement('button');
    dot.type = 'button';
    dot.setAttribute('aria-label', `Go to slide ${index + 1}`);
    if (index === currentSlide) dot.classList.add('active');
    dot.addEventListener('click', () => {
      goToSlide(index);
      restartAuto();
    });
    dotsWrap.appendChild(dot);
  });
}

function updateSlider() {
  slides.forEach((slide, index) => {
    slide.classList.toggle('active', index === currentSlide);
  });
  dotsWrap.querySelectorAll('button').forEach((dot, index) => {
    dot.classList.toggle('active', index === currentSlide);
  });
}

function goToSlide(index) {
  currentSlide = (index + slides.length) % slides.length;
  updateSlider();
}

function nextSlide() {
  goToSlide(currentSlide + 1);
}

function prevSlide() {
  goToSlide(currentSlide - 1);
}

function startAuto() {
  autoTimer = setInterval(nextSlide, 5200);
}
function restartAuto() {
  clearInterval(autoTimer);
  startAuto();
}

prevBtn?.addEventListener('click', () => {
  prevSlide();
  restartAuto();
});
nextBtn?.addEventListener('click', () => {
  nextSlide();
  restartAuto();
});

renderDots();
updateSlider();
startAuto();

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });

document.querySelectorAll('.reveal').forEach((item) => observer.observe(item));
