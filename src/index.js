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

window.addEventListener('scroll', onScrollOrResize, { passive: true });
window.addEventListener('resize', onScrollOrResize);

updateTeamBgWidth();
updateHeroBgWidth();


const storyData = [
  {
    year: 2026,
    title: "AI-native from day one",
    text: "Every engagement now starts with AI-assisted discovery. We cut diagnostic time in half and deliver prototypes in weeks, not months.",
  },
  {
    year: 2025,
    title: "First enterprise clients",
    text: "Word spread. Two Fortune 500 companies brought us in to untangle cross-departmental workflows that had stalled for years.",
  },
  {
    year: 2024,
    title: "Cocoon is founded",
    text: "Lisa and Sarah leave their roles to build the consultancy they always wished existed. First client within three weeks — a logistics company bleeding money on manual processes.",
  },
  {
    year: 2022,
    title: "The frustration crystallizes",
    text: "Both independently hit the same wall: brilliant consultants who delivered decks, not outcomes. They start talking about what \"consulting that actually ships\" would look like.",
  },
  {
    year: 2018,
    title: "Lisa and Sarah meet",
    text: "A conference talk on developer experience sparks a conversation that never really ends. Different worlds — infrastructure and strategy — but the same conviction: build for users, not for org charts.",
  },
];

function setActiveStoryItem(container, activeEl) {
  container
    .querySelectorAll(".our-story__item--active")
    .forEach((el) => el.classList.remove("our-story__item--active"));
  activeEl.classList.add("our-story__item--active");
}


function setActiveDot(container, dotEl) {
  container
    .querySelectorAll(".our-story__dot--active")
    .forEach((el) => el.classList.remove("our-story__dot--active"));
  dotEl.classList.add("our-story__dot--active");
}

function initOurStory() {
  const container = document.querySelector("[data-story-timeline]");
  if (!container) return;

  let firstDot = null;

  storyData.forEach((item, index) => {
    // колонка 1: точка
    const dotWrap = document.createElement("div");
    dotWrap.className = "our-story__dot-wrap";
    const dot = document.createElement("span");
    dot.className = "our-story__dot";
    if (index === 0) {
      dot.classList.add("our-story__dot--active"); // 2026 активний за замовчуванням
      firstDot = dot;
    }
    dotWrap.appendChild(dot);

    // колонка 2: картка
    const itemEl = document.createElement("div");
    const itemElSpan = document.createElement("span");
    const itemElContent = document.createElement("div");
    const itemEltext = document.createElement("div");
    itemEl.className = "our-story__item";
    
    itemElSpan.className = "our-story__year";
    itemElSpan.textContent = item.year;
    
    itemElContent.className = "our-story__item-content";
    itemElContent.textContent = item.title;

    itemEltext.className = "our-story__item-text";
    itemEltext.textContent = item.text;

    itemEl.appendChild(itemElSpan);
    itemEl.appendChild(itemElContent);
    itemElContent.appendChild(itemEltext);

    // наведення на картку підсвічує "свою" точку (замикання на dot з цієї ітерації)
    itemEl.addEventListener("mouseenter", () => setActiveDot(container, dot));

    container.appendChild(dotWrap);
    container.appendChild(itemEl);
  });

  // миша пішла з усього таймлайну — повертаємось до 2026
  container.addEventListener("mouseleave", () => {
    if (firstDot) setActiveDot(container, firstDot);
  });
}

initOurStory();


// ─── Pricing bg scroll ───────────────────────────────────
const pricingBg = document.querySelector('[data-pricing-bg]');
const pricing   = document.querySelector('.pricing');

function updatePricingBgWidth() {
  if (!pricingBg || !pricing) return;

  const windowWidth = window.innerWidth;

  if (windowWidth < BREAKPOINT) {
    pricingBg.style.maxWidth = '';
    return;
  }

  const rect = pricing.getBoundingClientRect();

  const progress = Math.min(
    Math.max(
      (window.innerHeight - rect.top) / (window.innerHeight + rect.height),
      0
    ),
    1
  );

  const targetWidth = MIN_WIDTH + (windowWidth - MIN_WIDTH) * progress;
  pricingBg.style.maxWidth = `${targetWidth}px`;
}


    updatePricingBgWidth();


    
let ticking = false;
function onScrollOrResize() {
  if (ticking) return;
  ticking = true;
  requestAnimationFrame(() => {
    updateHeroBgWidth();
    updateTeamBgWidth();
    updatePricingBgWidth();
    ticking = false;
  });
}



// ─── Contact form ────────────────────────────────────────
const contactForm = document.querySelector('[data-contact-form]');

if (contactForm) {
  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const data = Object.fromEntries(new FormData(contactForm));
    console.log('Contact form submitted:', data);

    // TODO: тут заміни на реальний запит до бекенду / сервісу форм
    // fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: {...} })

    contactForm.reset();
    alert('Дякуємо! Ми зв\'яжемось з вами найближчим часом.');
  });
}