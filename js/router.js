const main = document.querySelector('main');
const nav  = document.querySelector('nav');

function initPage() {
  const yr = document.getElementById('yr');
  if (yr) yr.textContent = new Date().getFullYear();

  document.querySelectorAll('.glow').forEach(el => {
    el.addEventListener('mousemove', e => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', ((e.clientX - r.left) / r.width  * 100).toFixed(1) + '%');
      el.style.setProperty('--my', ((e.clientY - r.top)  / r.height * 100).toFixed(1) + '%');
    });
  });

  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

  if (document.getElementById('post-list'))        loadPosts();
  if (document.getElementById('post-tag-display')) initPost();
}

async function navigate(url) {
  const res  = await fetch(url);
  const html = await res.text();
  const doc  = new DOMParser().parseFromString(html, 'text/html');

  document.title = doc.title;
  main.innerHTML = doc.querySelector('main').innerHTML;
  nav.innerHTML  = doc.querySelector('nav').innerHTML;
  history.pushState({}, '', url);
  window.scrollTo(0, 0);

  initPage();
  bindLinks();
}

function bindLinks() {
  document.querySelectorAll('a[href]').forEach(a => {
    if (a.dataset.bound) return;
    a.dataset.bound = '1';

    const href = a.getAttribute('href');
    if (!href || href.startsWith('http') || href.startsWith('mailto') || href.startsWith('#') || a.target === '_blank') return;

    a.addEventListener('click', e => {
      e.preventDefault();
      const url = new URL(href, window.location.href).href;
      if (url !== window.location.href) navigate(url);
    });
  });
}

window.addEventListener('popstate', () => navigate(window.location.href));

bindLinks();
initPage();
