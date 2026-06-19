function formatDate(str) {
  const d = new Date(str + 'T00:00:00');
  return {
    month: d.toLocaleDateString('en-GB', { month: 'short' }),
    year:  d.getFullYear(),
  };
}

function renderPost(p) {
  const d = p.date ? formatDate(p.date) : { month: '—', year: '' };
  return `
    <div class="post-item reveal">
      <div class="post-date">
        <span>${d.month}</span>
        <span>${d.year}</span>
      </div>
      <div class="post-right">
        ${p.tag     ? `<div class="post-tag">${p.tag}</div>` : ''}
        <div class="post-title"><a href="${p.slug}">${p.title}</a></div>
        ${p.excerpt ? `<div class="post-excerpt">${p.excerpt}</div>` : ''}
        <a class="post-read" href="${p.slug}">read →</a>
      </div>
    </div>`;
}

async function loadPosts() {
  const list = document.getElementById('post-list');
  const base = window.location.href.replace(/\/[^/]*$/, '/');

  const slugs = await fetch(base + 'posts.json').then(r => r.json());

  const posts = await Promise.all(slugs.map(async slug => {
    const html = await fetch(base + 'posts/' + slug).then(r => r.text());
    const doc  = new DOMParser().parseFromString(html, 'text/html');
    return {
      slug:    base + 'posts/' + slug,
      date:    doc.querySelector('meta[name="post-date"]')?.content ?? '',
      tag:     doc.querySelector('meta[name="post-tag"]')?.content  ?? '',
      title:   doc.querySelector('h1')?.textContent.trim()           ?? slug,
      excerpt: doc.querySelector('.post-body p')?.textContent.trim() ?? '',
    };
  }));

  list.innerHTML = posts.map(renderPost).join('');
  list.querySelectorAll('.reveal').forEach(el => observer.observe(el));
}

window.loadPosts = loadPosts;
