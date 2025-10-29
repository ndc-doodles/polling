document.addEventListener('DOMContentLoaded', () => {
  const mobileBtn = document.getElementById('mobile-menu-button');
  const mobileMenu = document.getElementById('mobile-menu');
  const overlay = document.getElementById('overlay');
  let menuOpen = false;

  // === Mobile Sidebar Toggle ===
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

  // === Language Toggles (Desktop & Mobile) ===
  const langToggle = document.getElementById('lang-toggle');
  const langLabel = document.getElementById('lang-label');
  const mobileLangToggle = document.getElementById('mobile-lang-toggle');
  const mobileLangLabel = document.getElementById('mobile-lang-label');

  // Sync UI updates
  function updateLanguage(isEnglish) {
    langLabel.textContent = isEnglish ? 'ENG' : 'TAMIL';
    mobileLangLabel.textContent = isEnglish ? 'ENG' : 'TAMIL';
    langToggle.checked = isEnglish;
    mobileLangToggle.checked = isEnglish;
  }

  // === Event Listeners ===
  langToggle.addEventListener('change', () => {
    updateLanguage(langToggle.checked);
  });

  mobileLangToggle.addEventListener('change', () => {
    updateLanguage(mobileLangToggle.checked);
  });

  // === Default Language: Tamil (gray switch) ===
  updateLanguage(false);
});











document.addEventListener('DOMContentLoaded', () => {
  const slides = [
    document.getElementById('slide1'),
    document.getElementById('slide2'),
    document.getElementById('slide3')
  ];

  const progressBars = [
    document.getElementById('progress1'),
    document.getElementById('progress2'),
    document.getElementById('progress3')
  ];

  const progressContainers = Array.from(document.querySelectorAll('[data-index]'));

  // Basic validation - bail early if essential elements missing
  if (slides.some(s => s === null) || progressBars.some(b => b === null) || progressContainers.length === 0) {
    console.warn('Slider: missing required DOM elements (slide/progress). Check IDs and data-index attributes.');
    return;
  }

  let current = 0;
  let autoSlideTimer = null;
  let progressTimer = null;

  function resetProgressBars() {
    progressBars.forEach(bar => {
      if (bar) bar.style.width = '0%';
    });
  }

  function clearTimers() {
    if (progressTimer) {
      clearInterval(progressTimer);
      progressTimer = null;
    }
    if (autoSlideTimer) {
      clearTimeout(autoSlideTimer);
      autoSlideTimer = null;
    }
  }

  function showSlide(index) {
    // clamp index
    index = ((index % slides.length) + slides.length) % slides.length;

    clearTimers();

    // Show/hide slides (use opacity + pointer-events for accessibility)
    slides.forEach((slide, i) => {
      if (!slide) return;
      if (i === index) {
        slide.style.opacity = '1';
        slide.style.pointerEvents = 'auto';
      } else {
        slide.style.opacity = '0';
        slide.style.pointerEvents = 'none';
      }
    });

    // Reset progress bars visually
    resetProgressBars();

    // Progress animation: increment width from 0 to 100 over durationMs
    const durationMs = 5000;       // total time per slide
    const tickMs = 50;             // interval tick (50ms -> 100 ticks for 5s)
    const step = 100 / (durationMs / tickMs);

    let width = 0;
    progressTimer = setInterval(() => {
      width += step;
      const pct = Math.min(100, width);
      if (progressBars[index]) progressBars[index].style.width = pct + '%';

      if (pct >= 100) {
        clearInterval(progressTimer);
        progressTimer = null;
      }
    }, tickMs);

    // Schedule next slide after durationMs
    autoSlideTimer = setTimeout(() => {
      current = (index + 1) % slides.length;
      showSlide(current);
    }, durationMs);
  }

  // Hook up click handlers for progress containers (jump to slide)
  progressContainers.forEach(container => {
    container.addEventListener('click', (e) => {
      const idx = parseInt(container.dataset.index, 10);
      if (Number.isNaN(idx)) return;
      current = idx;
      showSlide(current);
    });
  });

  // Start
  showSlide(current);

  // Optional: expose controls to window for debugging
  window._slider = {
    showSlide,
    next: () => showSlide(current + 1),
    prev: () => showSlide(current - 1),
    stop: clearTimers
  };
});




(function () {
  // === Toggle share popup visibility ===
  document.querySelectorAll('.share-btn').forEach(btn => {
    btn.addEventListener('click', e => {
      e.stopPropagation();
      const popup = btn.nextElementSibling;

      // Close other popups
      document.querySelectorAll('.share-popup').forEach(p => {
        if (p !== popup) p.classList.add('hidden');
      });

      popup.classList.toggle('hidden');
    });
  });

  // === Close all popups on outside click ===
  document.addEventListener('click', () => {
    document.querySelectorAll('.share-popup').forEach(p => p.classList.add('hidden'));
  });

  // === Platform-specific sharing (with heading, paragraph, and read more link) ===
  document.querySelectorAll('.share-popup button[data-platform]').forEach(opt => {
    opt.addEventListener('click', e => {
      e.stopPropagation();

      const container = opt.closest('.news-card');
      const title = container?.dataset.title || 'Latest News';
      const description = container?.dataset.description?.slice(0, 120) || '';
      const detailPage = `${window.location.origin}/polling/blog_detail.html`;

      // Message structure for sharing
      const message = `${title}\n\n${description}...\n\nRead more: ${detailPage}`;
      const encodedMessage = encodeURIComponent(message);

      let shareUrl = '';

      switch (opt.dataset.platform) {
        case 'facebook':
          // Facebook allows message in 'quote' param
          shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(detailPage)}&quote=${encodedMessage}`;
          break;
        case 'twitter':
          shareUrl = `https://twitter.com/intent/tweet?text=${encodedMessage}`;
          break;
        case 'whatsapp':
          shareUrl = `https://api.whatsapp.com/send?text=${encodedMessage}`;
          break;
        case 'linkedin':
          // LinkedIn doesn't support custom text in URL params
          shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(detailPage)}`;
          break;
        default:
          navigator.clipboard.writeText(message)
            .then(() => alert('✅ Share message copied to clipboard'))
            .catch(() => console.warn('Clipboard unavailable'));
          return;
      }

      window.open(shareUrl, '_blank', 'noopener,noreferrer,width=600,height=500');
      opt.closest('.share-popup')?.classList.add('hidden');
    });
  });

  // === News card click to open detail page ===
  document.querySelectorAll('.news-card').forEach(card => {
    card.addEventListener('click', e => {
      if (e.target.closest('.share-btn') || e.target.closest('.share-popup')) return; // Prevent conflict

      const title = card.dataset.title || 'Untitled';
      const date = card.dataset.date || '';
      const image = card.dataset.image || '';
      const description = card.dataset.description || '';

      const content = `
        <p>${description}</p>
        <p class="mt-4">Stay tuned for more in-depth analysis and updates on this topic.</p>
      `;

      localStorage.setItem('selectedNews', JSON.stringify({ title, date, image, description, content }));
      window.location.href = 'blog_detail.html';
    });
  });
})();


document.addEventListener('DOMContentLoaded', () => {
  const news = JSON.parse(localStorage.getItem('selectedNews'));
  if (!news) return;

  document.querySelector('#news-title').innerText = news.title;
  document.querySelector('#news-date').innerText = news.date;
  document.querySelector('#news-image').src = news.image;
  document.querySelector('#news-content').innerHTML = news.content;
});

 document.addEventListener("DOMContentLoaded", function () {
      const selectedNews = JSON.parse(localStorage.getItem("selectedNews"));
      if (selectedNews) {
        document.getElementById("news-title").textContent = selectedNews.title;
        document.getElementById("news-category").innerHTML =
          'Category: <span class="font-medium text-blue-600">' + selectedNews.category + "</span>";
        document.getElementById("news-date").textContent = "Published: " + selectedNews.date;
        document.getElementById("news-description").textContent = selectedNews.description;
        document.getElementById("news-image").src = selectedNews.image;
      }
    });