document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');
  let menuOpen = false;

  // Handle mobile sidebar toggle
  mobileBtn.addEventListener('click', () => {
    menuOpen = !menuOpen;
    mobileMenu.style.right = menuOpen ? '0' : '-70%';
    overlay.classList.toggle('hidden', !menuOpen);
  });

  overlay.addEventListener('click', () => {
    menuOpen = false;
    mobileMenu.style.right = '-70%';
    overlay.classList.add('hidden');
  });

  // Language switch elements
  const langToggle = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  const mobileLangToggle = document.getElementById('mobile-lang-toggle');
  const mobileLangLabel = document.getElementById('mobile-lang-label');

  // Update both toggles & labels
  function updateLanguage(isTamil) {
    langLabel.textContent = isTamil ? 'TAMIL' : 'ENG';
    mobileLangLabel.textContent = isTamil ? 'TAMIL' : 'ENG';
    langToggle.checked = isTamil;
    mobileLangToggle.checked = isTamil;
  }

  // Listen for both toggles
  langToggle.addEventListener('change', () => updateLanguage(langToggle.checked));
  mobileLangToggle.addEventListener('change', () => updateLanguage(mobileLangToggle.checked));
});
