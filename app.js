const lightbox = document.querySelector('.lightbox');
document.querySelectorAll('[data-gallery]').forEach(gallery => {
  const image = gallery.querySelector('.gallery-image');
  const label = gallery.querySelector('.image-label');
  const buttons = [...gallery.querySelectorAll('[data-image]')];
  buttons.forEach((button, index) => button.addEventListener('click', () => {
    image.src = button.dataset.image;
    image.alt = button.dataset.alt;
    label.textContent = button.dataset.caption.toUpperCase();
    gallery.querySelector('[data-count]').textContent = `0${index + 1} / 0${buttons.length}`;
    buttons.forEach(item => { item.classList.toggle('active', item === button); item.setAttribute('aria-pressed', String(item === button)); });
  }));
  gallery.querySelector('[data-enlarge]').addEventListener('click', () => {
    if (!lightbox) return;
    lightbox.querySelector('img').src = image.src;
    lightbox.querySelector('img').alt = image.alt;
    lightbox.querySelector('p').textContent = 'Greenhouse Valley · Demo gameplay screenshot · Subject to change';
    lightbox.showModal();
  });
});
if (lightbox) {
  lightbox.querySelector('.close').addEventListener('click', () => lightbox.close());
  lightbox.addEventListener('click', event => { if (event.target === lightbox) { const r = lightbox.getBoundingClientRect(); if (event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom) lightbox.close(); } });
}

// Play once per browser tab session; navigation back to the homepage stays immediate.
const intro = document.querySelector('.brand-intro');
if (intro && !matchMedia('(prefers-reduced-motion: reduce)').matches && !location.hash) {
  let seen = false;
  try { seen = sessionStorage.getItem('copperwing-intro-v1') === 'seen'; } catch {}
  if (!seen) {
    const content = [...document.body.children].filter(el => el !== intro && el.tagName !== 'SCRIPT');
    const previous = content.map(el => [el, el.inert]);
    const savedFocus = document.activeElement;
    intro.hidden = false;
    document.body.classList.add('intro-playing');
    content.forEach(el => { el.inert = true; });
    intro.querySelector('button').focus({preventScroll:true});
    let finished = false;
    const finish = () => {
      if (finished) return;
      finished = true;
      intro.hidden = true;
      document.body.classList.remove('intro-playing');
      previous.forEach(([el, inert]) => { el.inert = inert; });
      document.removeEventListener('keydown', onKey);
      try { sessionStorage.setItem('copperwing-intro-v1', 'seen'); } catch {}
      if (savedFocus && savedFocus !== document.body) savedFocus.focus({preventScroll:true});
      else document.querySelector('.brand')?.focus({preventScroll:true});
    };
    const onKey = event => { if (event.key === 'Escape') finish(); };
    document.addEventListener('keydown', onKey);
    intro.querySelector('button').addEventListener('click', finish);
    intro.addEventListener('animationend', event => { if (event.target === intro && event.animationName === 'intro-curtain') finish(); });
    setTimeout(finish, 3500);
  }
}
