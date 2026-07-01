import './styles/styles.scss';

const burger = document.querySelector('[data-burger]');
const nav = document.querySelector('[data-nav]');

const heroBg = document.querySelector('[data-hero-bg]');
const hero = document.querySelector('.hero');

const MIN_WIDTH = 976;
const BREAKPOINT = 1000;

// ─── Team bg scroll ──────────────────────────────────────
const teamBg = document.querySelector('[data-team-bg]');
const team   = document.querySelector('.team');

function updateTeamBgWidth() {
  if (!teamBg || !team) return;

  const windowWidth = window.innerWidth;

  if (windowWidth < BREAKPOINT) {
    teamBg.style.maxWidth = '';
    return;
  }

  // getBoundingClientRect дає позицію відносно viewport у реальному часі
  const rect = team.getBoundingClientRect();

  // progress: 0 коли верх секції входить у viewport знизу,
  //           1 коли низ секції виходить з viewport зверху
  const progress = Math.min(
    Math.max(
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
      0
    ),
    1
  );

  const targetWidth = MIN_WIDTH + (windowWidth - MIN_WIDTH) * progress;
  teamBg.style.maxWidth = `${targetWidth}px`;
}

// Підключаємо до вже існуючого onScrollOrResize
const _origOnScroll = onScrollOrResize; // зберігаємо попередній

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
    updateTeamBgWidth(); // ← додаємо
    ticking = false;
  });
}

window.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);

updateTeamBgWidth();
updateHeroBgWidth();