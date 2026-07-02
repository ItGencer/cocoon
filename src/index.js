import './styles/styles.scss';

// має збігатись із $scroll-bg-min-width у _variables.scss
const SCROLL_BG_MIN_WIDTH = 976;
const BREAKPOINT = 1000;

const STORY_DATA = [
  {
    year: 2026,
    title: 'AI-native from day one',
    text: 'Every engagement now starts with AI-assisted discovery. We cut diagnostic time in half and deliver prototypes in weeks, not months.',
  },
  {
    year: 2025,
    title: 'First enterprise clients',
    text: 'Word spread. Two Fortune 500 companies brought us in to untangle cross-departmental workflows that had stalled for years.',
  },
  {
    year: 2024,
    title: 'Cocoon is founded',
    text: 'Lisa and Sarah leave their roles to build the consultancy they always wished existed. First client within three weeks — a logistics company bleeding money on manual processes.',
  },
  {
    year: 2022,
    title: 'The frustration crystallizes',
    text: 'Both independently hit the same wall: brilliant consultants who delivered decks, not outcomes. They start talking about what "consulting that actually ships" would look like.',
  },
  {
    year: 2018,
    title: 'Lisa and Sarah meet',
    text: 'A conference talk on developer experience sparks a conversation that never really ends. Different worlds — infrastructure and strategy — but the same conviction: build for users, not for org charts.',
  },
];

/** Бургер-меню: відкриття/закриття мобільної навігації. */
class BurgerMenu {
  constructor(burgerSelector, navSelector) {
    this.burger = document.querySelector(burgerSelector);
    this.nav = document.querySelector(navSelector);
    if (!this.burger || !this.nav) return;
    this._bindEvents();
  }

  _bindEvents() {
    this.burger.addEventListener('click', () => this.toggle());

    this.nav.querySelectorAll('.nav__link').forEach((link) => {
      link.addEventListener('click', () => this.close());
    });
  }

  toggle() {
    this.burger.classList.toggle('burger--active');
    this.nav.classList.toggle('nav--open');
    document.body.classList.toggle('no-scroll');
  }

  close() {
    this.burger.classList.remove('burger--active');
    this.nav.classList.remove('nav--open');
    document.body.classList.remove('no-scroll');
  }
}

/**
 * Розтягує фонове зображення секції від SCROLL_BG_MIN_WIDTH до 100vw
 * залежно від прогресу скролу.
 * mode: 'top'  — прогрес від початку сторінки (для hero: scrollY / висота секції)
 * mode: 'rect' — прогрес по позиції секції у viewport (для секцій нижче hero)
 */
class ScrollBackground {
  constructor({ bgSelector, sectionSelector, mode = 'rect' }) {
    this.bg = document.querySelector(bgSelector);
    this.section = document.querySelector(sectionSelector);
    this.mode = mode;
  }

  update() {
    if (!this.bg || !this.section) return;

    const windowWidth = window.innerWidth;

    if (windowWidth < BREAKPOINT) {
      this.bg.style.maxWidth = '';
      return;
    }

    const progress = this.mode === 'top' ? this._topProgress() : this._rectProgress();
    const targetWidth = SCROLL_BG_MIN_WIDTH + (windowWidth - SCROLL_BG_MIN_WIDTH) * progress;

    this.bg.style.maxWidth = `${targetWidth}px`;
  }

  _topProgress() {
    const heroHeight = this.section.offsetHeight;
    return this._clamp(window.scrollY / heroHeight);
  }

  _rectProgress() {
    const rect = this.section.getBoundingClientRect();
    return this._clamp((window.innerHeight - rect.top) / (window.innerHeight + rect.height));
  }

  _clamp(value) {
    return Math.min(Math.max(value, 0), 1);
  }
}

/** Таймлайн "Our Story": рендер пунктів + підсвітка активної точки при hover. */
class OurStoryTimeline {
  constructor(containerSelector, data) {
    this.container = document.querySelector(containerSelector);
    this.data = data;
    this.firstDot = null;

    if (this.container) this._render();
  }

  _render() {
    this.data.forEach((item, index) => this._renderItem(item, index));

    // миша пішла з усього таймлайну — повертаємось до першого (2026) пункту
    this.container.addEventListener('mouseleave', () => {
      if (this.firstDot) this._setActiveDot(this.firstDot);
    });
  }

  _renderItem(item, index) {
    const { dotWrap, dot } = this._createDot(index);
    const card = this._createCard(item);

    card.addEventListener('mouseenter', () => this._setActiveDot(dot));

    this.container.append(dotWrap, card);
  }

  _createDot(index) {
    const dotWrap = document.createElement('div');
    dotWrap.className = 'our-story__dot-wrap';

    const dot = document.createElement('span');
    dot.className = 'our-story__dot';

    if (index === 0) {
      dot.classList.add('our-story__dot--active');
      this.firstDot = dot;
    }

    dotWrap.appendChild(dot);
    return { dotWrap, dot };
  }

  _createCard({ year, title, text }) {
    const card = document.createElement('div');
    card.className = 'our-story__item';

    const yearEl = document.createElement('span');
    yearEl.className = 'our-story__year';
    yearEl.textContent = year;

    const titleEl = document.createElement('div');
    titleEl.className = 'our-story__item-title';
    titleEl.textContent = title;

    const textEl = document.createElement('div');
    textEl.className = 'our-story__item-text';
    textEl.textContent = text;

    card.append(yearEl, titleEl, textEl);
    return card;
  }

  _setActiveDot(dotEl) {
    this.container
      .querySelectorAll('.our-story__dot--active')
      .forEach((el) => el.classList.remove('our-story__dot--active'));
    dotEl.classList.add('our-story__dot--active');
  }
}

/** Форма контактів: сабміт без перезавантаження сторінки. */
class ContactForm {
  constructor(selector) {
    this.form = document.querySelector(selector);
    if (this.form) this.form.addEventListener('submit', (e) => this._handleSubmit(e));
  }

  _handleSubmit(event) {
    event.preventDefault();

    const data = Object.fromEntries(new FormData(this.form));
    console.log('Contact form submitted:', data);

    // TODO: замінити на реальний запит до бекенду / сервісу форм
    // fetch('/api/contact', { method: 'POST', body: JSON.stringify(data), headers: {...} })

    this.form.reset();
    alert("Дякуємо! Ми зв'яжемось з вами найближчим часом.");
  }
}

/** Точка входу: ініціалізує всі компоненти сторінки. */
class App {
  constructor() {
    this.burgerMenu = new BurgerMenu('[data-burger]', '[data-nav]');
    this.ourStory = new OurStoryTimeline('[data-story-timeline]', STORY_DATA);
    this.contactForm = new ContactForm('[data-contact-form]');

    this.scrollBackgrounds = [
      new ScrollBackground({ bgSelector: '[data-hero-bg]', sectionSelector: '.hero', mode: 'top' }),
      new ScrollBackground({ bgSelector: '[data-team-bg]', sectionSelector: '.team', mode: 'rect' }),
      new ScrollBackground({ bgSelector: '[data-pricing-bg]', sectionSelector: '.pricing', mode: 'rect' }),
    ];

    this._ticking = false;
    this._bindScroll();
    this._updateBackgrounds();
  }

  _bindScroll() {
    const onScrollOrResize = () => this._requestUpdate();
    window.addEventListener('scroll', onScrollOrResize, { passive: true });
    window.addEventListener('resize', onScrollOrResize);
  }

  _requestUpdate() {
    if (this._ticking) return;
    this._ticking = true;

    requestAnimationFrame(() => {
      this._updateBackgrounds();
      this._ticking = false;
    });
  }

  _updateBackgrounds() {
    this.scrollBackgrounds.forEach((bg) => bg.update());
  }
}

new App();