const root = document.getElementById('page-root');
const fragments = [
  'html/header.html',
  'html/hero.html',
  'html/produits.html',
  'html/advantages.html',
  'html/applications.html',
  'html/gallery.html',
  'html/why.html',
  'html/faq.html',
  'html/contact.html',
  'html/auth-footer.html',
];

async function loadIndex() {
  if (!root) return;
  for (const file of fragments) {
    const response = await fetch(file);
    const html = await response.text();
    const wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    while (wrapper.firstChild) {
      root.appendChild(wrapper.firstChild);
    }
  }
  const script = document.createElement('script');
  script.src = 'js/script.js';
  document.body.appendChild(script);
}

loadIndex().catch((error) => console.error('Chargement des fragments impossible', error));
