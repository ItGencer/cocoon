import './styles/styles.scss';

const burger = document.querySelector('[data-burger]');
const nav = document.querySelector('[data-nav]');

burger.addEventListener('click', () => {
  burger.classList.toggle('burger--active');
  nav.classList.toggle('nav--open');
  document.body.classList.toggle('no-scroll'); // блокує скрол фону при відкритому меню
});

// закриваємо меню при кліку на пункт навігації
nav.querySelectorAll('.nav__link').forEach(link => {
  link.addEventListener('click', () => {
    burger.classList.remove('burger--active');
    nav.classList.remove('nav--open');
    document.body.classList.remove('no-scroll');
  });
});

const heroBg = document.querySelector('[data-hero-bg]');
const hero = document.querySelector('.hero');

const MIN_WIDTH = 976;
const BREAKPOINT = 1000;

function updateHeroBgWidth() {
  if (!heroBg || !hero) return;

  const windowWidth = window.innerWidth;

  // нижче breakpoint — нічого не рахуємо, ширина 100% керується CSS
  if (windowWidth < BREAKPOINT) {
    heroBg.style.maxWidth = '';
    return;
  }

  const heroHeight = hero.offsetHeight;
  const scrollY = window.scrollY;

  // progress від 0 (верх сторінки) до 1 (проскролили всю висоту hero)
  const progress = Math.min(Math.max(scrollY / heroHeight, 0), 1);

  const targetWidth = MIN_WIDTH + (windowWidth - MIN_WIDTH) * progress;

  heroBg.style.maxWidth = `${targetWidth}px`;
}

let ticking = false;

function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateHeroBgWidth();
    ticking = false;
  });
}

window.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);
updateHeroBgWidth();