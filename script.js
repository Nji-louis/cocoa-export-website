// ================= HEADER =================
(function(){
  const hamburger = document.querySelector('.hamburger');
  const mainNav = document.querySelector('.main-nav');
  const header = document.querySelector('.site-header');
  const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
  const searchForm = document.getElementById('searchForm');

  // Hamburger toggle
  hamburger.addEventListener('click', () => {
    mainNav.classList.toggle('open');
    hamburger.classList.toggle('is-active');
  });

  // Mobile dropdown toggle
  dropdownToggles.forEach(toggle => {
    toggle.addEventListener('click', function(e){
      if(window.innerWidth <= 820){
        e.preventDefault();
        this.parentElement.classList.toggle('open');
      }
    });
  });

  // Sticky header
  window.addEventListener('scroll', () => {
    if(window.scrollY > 40) header.classList.add('sticky');
    else header.classList.remove('sticky');
  });

  // Search form
  if(searchForm){
    searchForm.addEventListener('submit', e => {
      e.preventDefault();
      const q = document.getElementById('siteSearch').value;
      if(!q.trim()) return;
      window.open(`https://www.google.com/search?q=${encodeURIComponent(q)}`, '_blank');
    });
  }
})();





 










// ================= HERO SLIDER =================
(() => {
  const slides = document.querySelectorAll('.slide');
  const prev = document.querySelector('.prev');
  const next = document.querySelector('.next');
  const dotsContainer = document.querySelector('.dots');
  let currentSlide = 0;
  let slideInterval;
  // Create dots
  slides.forEach((_, i) => {
    const dot = document.createElement('span');
    if (i === 0) dot.classList.add('active');
    dot.addEventListener('click', () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const heroDots = document.querySelectorAll('.dots span');
  function changeSlide(index) {
    slides[currentSlide].classList.remove('active');
    heroDots[currentSlide].classList.remove('active');
    currentSlide = (index + slides.length) % slides.length;
    slides[currentSlide].classList.add('active');
    heroDots[currentSlide].classList.add('active');
  }
  function nextSlide() { changeSlide(currentSlide + 1); }
  function prevSlide() { changeSlide(currentSlide - 1); }
  function goToSlide(index) { changeSlide(index); }
  prev.addEventListener('click', () => { prevSlide(); restartHero(); });
  next.addEventListener('click', () => { nextSlide(); restartHero(); });
  heroDots.forEach((dot, i) => dot.addEventListener('click', () => { goToSlide(i); restartHero(); }));
  function startHero() { slideInterval = setInterval(nextSlide, 5000); }
  function stopHero() { clearInterval(slideInterval); }
  function restartHero() { stopHero(); startHero(); }
  startHero();
})();





// ================= ABOUT COUNTERS =================
(() => {
  const counters = document.querySelectorAll('.counter');
  counters.forEach(counter => {
    const updateCount = () => {
      const target = +counter.dataset.target;
      const count = +counter.innerText;
      const increment = target / 200;
      if (count < target) {
        counter.innerText = Math.ceil(count + increment);
        setTimeout(updateCount, 20);
      } else counter.innerText = target;
    }
    updateCount();
  });
})();


// ============================================
// About Section Gallery JS with Auto-Slide & Pinch Zoom
// ============================================

let aboutSlideIndex = 1;
aboutShowSlides(aboutSlideIndex);

// Auto-slide every 5 seconds
let aboutAutoSlideTimer = setInterval(() => { aboutPlusSlides(1); }, 5000);

// Next/Prev
function aboutPlusSlides(n) {
  aboutShowSlides(aboutSlideIndex += n);
  resetAboutAutoSlide();
}

// Dot click
function aboutCurrentSlide(n) {
  aboutShowSlides(aboutSlideIndex = n);
  resetAboutAutoSlide();
}

// Reset auto-slide timer on manual navigation
function resetAboutAutoSlide() {
  clearInterval(aboutAutoSlideTimer);
  aboutAutoSlideTimer = setInterval(() => { aboutPlusSlides(1); }, 5000);
}

function aboutShowSlides(n) {
  let i;
  const slides = document.getElementsByClassName("about-slide");
  const dots = document.getElementsByClassName("about-dot");

  if (n > slides.length) aboutSlideIndex = 1;
  if (n < 1) aboutSlideIndex = slides.length;

  for (i = 0; i < slides.length; i++) slides[i].style.display = "none";
  for (i = 0; i < dots.length; i++) dots[i].classList.remove("active");

  slides[aboutSlideIndex - 1].style.display = "block";
  dots[aboutSlideIndex - 1].classList.add("active");
}

// ============================================
// Lightbox
// ============================================

const aboutLightbox = document.getElementById("aboutLightbox");
const aboutLightboxImg = document.getElementById("aboutLightboxImg");
const aboutLightboxCaption = document.getElementById("aboutLightboxCaption");

document.querySelectorAll(".about-slide img").forEach((img, index) => {
  img.addEventListener("click", () => {
    openAboutLightbox(img.src, img.alt);
    aboutCurrentSlide(index + 1);
  });
});

function openAboutLightbox(src, caption) {
  aboutLightbox.style.display = "block";
  aboutLightboxImg.src = src;
  aboutLightboxCaption.innerHTML = caption;
}

function closeAboutLightbox() {
  aboutLightbox.style.display = "none";
}

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener("keydown", function(event) {
  if (event.key === "ArrowLeft") aboutPlusSlides(-1);
  if (event.key === "ArrowRight") aboutPlusSlides(1);
  if (event.key === "Escape") closeAboutLightbox();
});

// ============================================
// Touch / Swipe Support
// ============================================

let touchStartXAbout = 0;
let touchEndXAbout = 0;

const aboutContainer = document.querySelector(".about-gallery-container");

aboutContainer.addEventListener("touchstart", (e) => {
  touchStartXAbout = e.changedTouches[0].screenX;
});

aboutContainer.addEventListener("touchend", (e) => {
  touchEndXAbout = e.changedTouches[0].screenX;
  handleAboutSwipe();
});

function handleAboutSwipe() {
  const swipeDistance = touchEndXAbout - touchStartXAbout;
  if (Math.abs(swipeDistance) < 50) return;
  if (swipeDistance > 50) aboutPlusSlides(-1);
  if (swipeDistance < -50) aboutPlusSlides(1);
}

// ============================================
// Pinch-to-Zoom Support (Mobile Lightbox)
// ============================================

let initialDistance = 0;
let currentScale = 1;

aboutLightboxImg.addEventListener('touchstart', function(e) {
  if (e.touches.length === 2) {
    initialDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
  }
});

aboutLightboxImg.addEventListener('touchmove', function(e) {
  if (e.touches.length === 2) {
    e.preventDefault(); // prevent scrolling
    const newDistance = Math.hypot(
      e.touches[0].pageX - e.touches[1].pageX,
      e.touches[0].pageY - e.touches[1].pageY
    );
    let scale = newDistance / initialDistance;
    scale = Math.min(Math.max(scale, 1), 3); // limit zoom between 1x and 3x
    currentScale = scale;
    aboutLightboxImg.style.transform = scale`(${currentScale})`;
  }
});

aboutLightboxImg.addEventListener('touchend', function(e) {
  if (currentScale < 1) {
    currentScale = 1;
    aboutLightboxImg.style.transform = scale(1);
  }
});





// Upgraded product grid interactions: filtering, search, modal, WhatsApp quote.
(() => {
  const filterSelect = document.getElementById('filterType');
  const searchInput = document.getElementById('productSearch');
  const grid = document.getElementById('productGrid');
  const resultsCount = document.getElementById('resultsCount');

  const modal = document.getElementById('productModal');
  const modalTitle = document.getElementById('modalTitle');
  const modalImage = document.getElementById('modalImage');
  const modalSummary = document.getElementById('modalSummary');
  const modalSpecs = document.getElementById('modalSpecs');
  const modalWA = document.getElementById('modalWhatsApp');
  const modalRequest = document.getElementById('modalRequest');
  const modalClose = modal.querySelector('.modal-close');

  const cards = Array.from(grid.querySelectorAll('.product-card'));

  function updateResultsCount(n) {
    resultsCount.textContent = `Showing ${n} product${n !== 1 ? 's' : ''}`;
  }

  function matchesFilter(card, typeFilter, searchTerm) {
    const type = card.dataset.type || '';
    const origin = card.dataset.origin || '';
    const text = (card.innerText || '').toLowerCase();
    const matchesType = (typeFilter === 'all') || (type.toLowerCase() === typeFilter.toLowerCase());
    const matchesSearch = !searchTerm || text.includes(searchTerm);
    return matchesType && matchesSearch;
  }

  function applyFilters() {
    const typeFilter = filterSelect.value;
    const searchTerm = searchInput.value.trim().toLowerCase();
    let visible = 0;
    cards.forEach(card => {
      if (matchesFilter(card, typeFilter, searchTerm)) {
        card.style.display = '';
        visible++;
      } else {
        card.style.display = 'none';
      }
    });
    updateResultsCount(visible);
  }

  filterSelect.addEventListener('change', applyFilters);
  searchInput.addEventListener('input', () => { applyFilters(); });

  // Modal helpers: gather product info from card and populate modal
  function openModalFromCard(cardId) {
    const card = cards.find(c => c.dataset.type === cardId || c.querySelector(`[data-id="${cardId}"]`));
    if (!card) return;
    const title = card.querySelector('.product-title')?.innerText || 'Product';
    const summary = card.querySelector('.product-sub')?.innerText || '';
    const img = card.querySelector('.card-media img')?.getAttribute('src') || 'images/slide1.jpg';
    const specItems = Array.from(card.querySelectorAll('.specs li')).map(li => li.innerText);

    modalTitle.innerText = title;
    modalSummary.innerText = summary;
    modalImage.setAttribute('src', img);
    modalImage.setAttribute('alt', title);

    modalSpecs.innerHTML = '';
    specItems.forEach(s => {
      const tr = document.createElement('tr');
      tr.innerHTML = `<td>${s}</td>`;
      modalSpecs.appendChild(tr);
    });

    // Setup whatsapp message link (pre-filled)
    const waText = encodeURIComponent(`Hello, I'm interested in your product: ${title}. Please send price, MOQ, and export details.`);
    modalWA.onclick = () => {
      // replace the number with your WhatsApp number for export inquiries
      const waNumber = '237699745546'; // example Cameroonian number - replace if needed
      window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
    };

    // Request Quote button - mailto fallback
    modalRequest.onclick = () => {
      const subject = encodeURIComponent(`Quote request: ${title}`);
      const body = encodeURIComponent(`Hello,\n\nI'm requesting a formal quote for: ${title}\n\nPlease provide price, MOQ, CIF terms and shipping timeline.\n\nRegards,\n`);
      // replace with your business email
      window.location.href = `mailto:export@chocam.com?subject=${subject}&body=${body}`;
    };

    // show modal
    modal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Close modal
  function closeModal() {
    modal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }
  modalClose.addEventListener('click', closeModal);
  modal.addEventListener('click', (e) => { if (e.target === modal) closeModal(); });
  document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeModal(); });

  // Wire up Learn More and Request Quote buttons in grid
  grid.addEventListener('click', (e) => {
    const lm = e.target.closest('.btn-details');
    const rq = e.target.closest('.btn-quote');
    if (lm) {
      const id = lm.dataset.id;
      openModalFromCard(id);
      return;
    }
    if (rq) {
      const id = rq.dataset.id;
      const card = cards.find(c => c.dataset.type === id);
      const title = card?.querySelector('.product-title')?.innerText || 'Product';
      // open WhatsApp prefilled (same number used in modal)
      const waText = encodeURIComponent(`Hello, I'd like a quote for: ${title}. MOQ & price please.`);
      const waNumber = '237699745546';
      window.open(`https://wa.me/${waNumber}?text=${waText}`, '_blank');
    }
  });

  // Initial load
  applyFilters();
})();







// ================= TESTIMONIALS =================
(() => {
  const testiCards = Array.from(document.querySelectorAll('.testi-card'));
  const testiDots = Array.from(document.querySelectorAll('.dot'));
  let testiIndex = 0;
  function showTesti(i) {
    testiCards.forEach((c, idx) => c.classList.toggle('active', idx === i));
    testiDots.forEach((d, idx) => d.classList.toggle('active', idx === i));
  }
  let testiInterval = setInterval(() => { testiIndex = (testiIndex + 1) % testiCards.length; showTesti(testiIndex); }, 4200);
  testiDots.forEach(dot => dot.addEventListener('click', () => {
    testiIndex = parseInt(dot.dataset.index);
    showTesti(testiIndex);
    resetTestiInterval();
  }));
  let startTouchX = 0, endTouchX = 0;
  const slider = document.getElementById('testiSlider');
  slider.addEventListener('touchstart', e => startTouchX = e.touches[0].clientX);
  slider.addEventListener('touchmove', e => endTouchX = e.touches[0].clientX);
  slider.addEventListener('touchend', () => {
    const deltaX = endTouchX - startTouchX;
    if (Math.abs(deltaX) > 50) {
      testiIndex = deltaX < 0 ? (testiIndex + 1) % testiCards.length : (testiIndex - 1 + testiCards.length) % testiCards.length;
      showTesti(testiIndex);
      resetTestiInterval();
    }
  });
  function resetTestiInterval() {
    clearInterval(testiInterval);
    testiInterval = setInterval(() => { testiIndex = (testiIndex + 1) % testiCards.length; showTesti(testiIndex); }, 4200);
  }
  showTesti(testiIndex);
})();






// Toggle window
const waBtn = document.getElementById("waSuiteBtn");
const waWindow = document.getElementById("waSuiteWindow");
const bubble = document.getElementById("waWelcomeBubble");

waBtn.addEventListener("click", () => {
  waWindow.style.display =
    waWindow.style.display === "block" ? "none" : "block";
  bubble.style.display = "none";
});

// Direct WhatsApp click for each agent
document.querySelectorAll(".wa-agent").forEach(agent => {
  agent.addEventListener("click", () => {
    const number = agent.getAttribute("data-number");
    const msg = agent.getAttribute("data-msg");
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(msg)}`, "_blank");
  });
});

// Dark Mode
const toggle = document.getElementById("waDarkToggle");
toggle.addEventListener("click", () => {
  document.body.classList.toggle("dark");
});







// ============================================
// Google Gallery JS (With Swipe + Keyboard)
// ============================================

let gpSlideIndex = 1;
gpShowSlides(gpSlideIndex);

// Next / Prev
function gpPlusSlides(n) {
  gpShowSlides(gpSlideIndex += n);
}

// Thumbnails
function gpCurrentSlide(n) {
  gpShowSlides(gpSlideIndex = n);
}

function gpShowSlides(n) {
  let i;
  const slides = document.getElementsByClassName("gp-slide");
  const thumbs = document.getElementsByClassName("gp-thumb");

  if (n > slides.length) gpSlideIndex = 1;
  if (n < 1) gpSlideIndex = slides.length;

  for (i = 0; i < slides.length; i++) slides[i].style.display = "none";
  for (i = 0; i < thumbs.length; i++) thumbs[i].classList.remove("active");

  slides[gpSlideIndex - 1].style.display = "block";
  thumbs[gpSlideIndex - 1].classList.add("active");
}

// ============================================
// Lightbox
// ============================================

const lightbox = document.getElementById("gpLightbox");
const lightboxImg = document.getElementById("gpLightboxImg");
const lightboxCaption = document.getElementById("gpLightboxCaption");

// Open lightbox on slide click
document.querySelectorAll(".gp-slide img").forEach((img, index) => {
  img.addEventListener("click", () => {
    openLightbox(img.src, img.alt);
    gpCurrentSlide(index + 1); 
  });
});

function openLightbox(src, caption) {
  lightbox.style.display = "block";
  lightboxImg.src = src;
  lightboxCaption.innerHTML = caption;
}

function closeLightbox() {
  lightbox.style.display = "none";
}

// ============================================
// Keyboard Navigation
// ============================================

document.addEventListener("keydown", function(event) {

  // Left arrow
  if (event.key === "ArrowLeft") {
    gpPlusSlides(-1);
  }

  // Right arrow
  if (event.key === "ArrowRight") {
    gpPlusSlides(1);
  }

  // ESC closes lightbox
  if (event.key === "Escape") {
    closeLightbox();
  }
});

// ============================================
// Touch / Swipe Support (Mobile)
// ============================================

let touchStartX = 0;
let touchEndX = 0;

// For main slideshow container
const gpContainer = document.querySelector(".gp-gallery-container");

// Detect touch start
gpContainer.addEventListener("touchstart", (e) => {
  touchStartX = e.changedTouches[0].screenX;
});

// Detect touch end
gpContainer.addEventListener("touchend", (e) => {
  touchEndX = e.changedTouches[0].screenX;
  handleSwipe();
});

// Logic for swipe
function handleSwipe() {
  const swipeDistance = touchEndX - touchStartX;

  if (Math.abs(swipeDistance) < 50) return; // Ignore tiny swipes

  // Swipe right → previous slide
  if (swipeDistance > 50) {
    gpPlusSlides(-1);
  }

  // Swipe left → next slide
  if (swipeDistance < -50) {
    gpPlusSlides(1);
  }
}





// FAQ module script
(function(){
  const originSelect = document.getElementById('originSelect');
  const portsAnswerEl = document.querySelector('.ports-answer');
  const faqList = document.getElementById('faqList');
  const faqSearch = document.getElementById('faqSearch');

  // Mapping origins -> ports & recommended text (edit as needed)
  const originPorts = {
    douala: 'Douala Autonomous Port (Douala). Main loading point for inland cocoa shipments.',
    kribi: 'Kribi Deep Seaport (Kribi). Suitable for larger vessels and containerized shipments.',
    limbe: 'Limbe Port (Limbe) / smaller ports — typically for specific orders or coastal shipments.',
    other: 'We can load from nominated ports depending on logistics and buyer preference. Contact us with your target port.'
  };

  function updatePortsAnswer() {
    const origin = originSelect.value || 'other';
    portsAnswerEl.textContent = originPorts[origin] || originPorts.other;
  }

  // Initialize the answer text
  updatePortsAnswer();
  originSelect.addEventListener('change', updatePortsAnswer);

  // Accessible accordion toggles
  faqList.addEventListener('click', (e) => {
    const btn = e.target.closest('.faq-q');
    if (!btn) return;
    const expanded = btn.getAttribute('aria-expanded') === 'true';
    // collapse any open one (optional: allow multiple open by commenting out)
    faqList.querySelectorAll('.faq-q').forEach(b => b.setAttribute('aria-expanded','false'));
    if (!expanded) btn.setAttribute('aria-expanded','true');
    else btn.setAttribute('aria-expanded','false');
  });

  // Search/filter
  faqSearch.addEventListener('input', () => {
    const q = faqSearch.value.trim().toLowerCase();
    faqList.querySelectorAll('.faq-item').forEach(item => {
      const text = item.textContent.toLowerCase();
      item.style.display = text.includes(q) ? '' : 'none';
    });
  });

  // Admin: add new FAQ quickly
  const addBtn = document.getElementById('addFaqBtn');
  addBtn.addEventListener('click', () => {
    const qText = document.getElementById('newQ').value.trim();
    const aText = document.getElementById('newA').value.trim();
    if (!qText || !aText) {
      alert('Enter both question and answer to add.');
      return;
    }
    const idSafe = 'q-' + Date.now();
    const article = document.createElement('article');
    article.className = 'faq-item';
    article.innerHTML = `
      <button class="faq-q" aria-expanded="false" aria-controls="${idSafe}-a" id="${idSafe}">
        ${escapeHtml(qText)} <span class="faq-toggle-indicator">+</span>
      </button>
      <div id="${idSafe}-a" class="faq-a" role="region" aria-labelledby="${idSafe}">
        <p>${escapeHtml(aText)}</p>
      </div>`;
    faqList.appendChild(article);
    document.getElementById('newQ').value = '';
    document.getElementById('newA').value = '';
  });

  // small helper to avoid injection
  function escapeHtml(s){ return s.replaceAll('&','&amp;').replaceAll('<','&lt;').replaceAll('>','&gt;'); }
})();
