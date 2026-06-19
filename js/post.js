function initPost() {
  const date = document.querySelector('meta[name="post-date"]')?.content;
  const tag  = document.querySelector('meta[name="post-tag"]')?.content;

  if (tag)  document.getElementById('post-tag-display').textContent = tag;
  if (date) {
    const d = new Date(date + 'T00:00:00');
    document.getElementById('post-meta-display').innerHTML =
      `<span>${d.toLocaleDateString('en-GB', { month: 'long', year: 'numeric' })}</span>`;
  }
}

window.initPost = initPost;
