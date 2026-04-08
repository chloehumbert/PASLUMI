// Navigation mobile
const navToggle = document.querySelector('.nav-toggle');
const nav = document.querySelector('.main-nav');

if (navToggle && nav) {
  navToggle.addEventListener('click', () => {
    nav.classList.toggle('open');
  });
}

// Année dynamique dans le footer
const yearSpan = document.getElementById('year');
if (yearSpan) {
  yearSpan.textContent = String(new Date().getFullYear());
}

// Filtre galerie
const filterButtons = document.querySelectorAll('.filter-btn');
const galleryItems = document.querySelectorAll('.gallery-item');

filterButtons.forEach((btn) => {
  btn.addEventListener('click', () => {
    const filter = btn.getAttribute('data-filter');

    filterButtons.forEach((b) => b.classList.remove('active'));
    btn.classList.add('active');

    galleryItems.forEach((item) => {
      const category = item.getAttribute('data-category');
      if (filter === 'all' || category === filter) {
        item.style.display = '';
      } else {
        item.style.display = 'none';
      }
    });
  });
});

// Animation au scroll (reveal)
const revealElements = document.querySelectorAll('.reveal');

const onScrollReveal = () => {
  const triggerBottom = window.innerHeight * 0.9;

  revealElements.forEach((el) => {
    const rect = el.getBoundingClientRect();
    if (rect.top < triggerBottom) {
      el.classList.add('visible');
    }
  });
};

window.addEventListener('scroll', onScrollReveal);
window.addEventListener('load', onScrollReveal);

// Auth modal (connexion / inscription)
const authModal = document.getElementById('auth-modal');
const authForm = document.getElementById('auth-form');
const authTabs = document.querySelectorAll('.auth-tab');
const authClose = document.querySelector('.auth-close');
const authSubtitle = document.getElementById('auth-subtitle');
const authSubmit = document.getElementById('auth-submit');
const authHint = document.getElementById('auth-hint');
const authFields = {
  name: document.querySelector('.auth-field-name'),
  confirm: document.querySelector('.auth-field-confirm'),
};

const setAuthMode = (mode = 'login') => {
  authTabs.forEach((tab) => tab.classList.toggle('active', tab.dataset.mode === mode));

  const isLogin = mode === 'login';
  if (authSubtitle) {
    authSubtitle.textContent = isLogin
      ? 'Accédez à votre espace client.'
      : 'Activez votre accès client en quelques secondes.';
  }

  if (authSubmit) {
    authSubmit.textContent = isLogin ? 'Se connecter' : 'Créer un compte';
  }

  if (authHint) {
    authHint.textContent = isLogin
      ? 'Mot de passe oublié ? Contactez support@paslumi.fr.'
      : 'Utilisez une adresse email professionnelle si possible.';
  }

  authFields.name?.classList.toggle('is-hidden', isLogin);
  authFields.confirm?.classList.toggle('is-hidden', isLogin);

  authForm?.setAttribute('data-mode', mode);
};

const openAuth = (mode = 'login') => {
  if (!authModal) return;
  setAuthMode(mode);
  authModal.dataset.open = 'true';
  authModal.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
};

const closeAuth = () => {
  if (!authModal) return;
  authModal.dataset.open = 'false';
  authModal.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
};

document.querySelectorAll('[data-auth-mode]').forEach((btn) => {
  btn.addEventListener('click', (event) => {
    event.preventDefault();
    const mode = btn.getAttribute('data-auth-mode') || 'login';
    openAuth(mode);
    if (nav && nav.classList.contains('open')) {
      nav.classList.remove('open');
    }
  });
});

authTabs.forEach((tab) => {
  tab.addEventListener('click', () => setAuthMode(tab.dataset.mode));
});

authClose?.addEventListener('click', closeAuth);

authModal?.addEventListener('click', (event) => {
  if (event.target === authModal) {
    closeAuth();
  }
});

document.addEventListener('keydown', (event) => {
  if (event.key === 'Escape' && authModal?.dataset.open === 'true') {
    closeAuth();
  }
});

authForm?.addEventListener('submit', async (event) => {
  event.preventDefault();
  if (!authForm) return;

  const mode = authForm.getAttribute('data-mode') || 'login';
  const endpoint = mode === 'login' ? 'login.php' : 'register.php';

  const data = new FormData(authForm);

  // Récupère les champs (certains peuvent être cachés selon le mode)
  const password = data.get('password')?.toString() ?? '';
  const confirm = data.get('confirm')?.toString() ?? '';

  if (mode !== 'login' && confirm && confirm !== password) {
    alert('Les mots de passe ne correspondent pas.');
    return;
  }

  // Envoie en x-www-form-urlencoded pour que PHP lise $_POST facilement
  const params = new URLSearchParams();
  for (const [key, value] of data.entries()) {
    params.append(key, value.toString());
  }

  const submitBtn = document.getElementById('auth-submit');
  if (submitBtn) submitBtn.disabled = true;

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8',
      },
      body: params.toString(),
    });

    const text = await response.text();

    if (!response.ok) {
      alert(text || 'Erreur serveur.');
      return;
    }

    // PHP renvoie un texte simple (ex: "Compte créé" / "Connexion réussie")
    alert(text.trim());
    closeAuth();
  } catch (err) {
    alert(`Impossible de joindre le serveur (${endpoint}).`);
    // eslint-disable-next-line no-console
    console.error(err);
  } finally {
    if (submitBtn) submitBtn.disabled = false;
  }
});


