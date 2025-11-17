// ================= HEADER =================
(() => {
  const hamburger = document.querySelector('.hamburger');
  const navLinks = document.querySelector('.nav-links');
  const navbar = document.querySelector('.navbar');
  const topBar = document.querySelector('.top-bar');
  hamburger.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    hamburger.classList.toggle('open');
  });
  window.addEventListener('scroll', () => {
    navbar.classList.toggle('scrolled', window.scrollY > 50);
    topBar.classList.toggle('scrolled', window.scrollY > 20);
  });
  // Fade-in sections
  const sections = document.querySelectorAll('section');
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) entry.target.classList.add('show');
    });
  }, { threshold: 0.1 });
  sections.forEach(section => observer.observe(section));
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





// ================= PRODUCTS CAROUSEL =================
(() => {
  const carousel = document.getElementById('productCarousel');
  const nextBtn = document.getElementById('nextProduct');
  const prevBtn = document.getElementById('prevProduct');
  const scrollAmount = 330;
  let startX = 0;
  let autoPlayInterval;
  nextBtn.addEventListener('click', () => carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' }));
  prevBtn.addEventListener('click', () => carousel.scrollBy({ left: -scrollAmount, behavior: 'smooth' }));
  // Swipe support
  carousel.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  carousel.addEventListener('touchend', e => {
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;
    if (Math.abs(diff) > 50) {
      carousel.scrollBy({ left: diff > 0 ? scrollAmount : -scrollAmount, behavior: 'smooth' });
    }
  });
  // Carousel indicators
  const carouselItems = carousel.querySelectorAll('.product-card');
  const indicatorsContainer = document.getElementById('carouselIndicators');
  carouselItems.forEach((_, index) => {
    const dot = document.createElement('button');
    if (index === 0) dot.classList.add('active');
    dot.addEventListener('click', () => {
      carousel.scrollTo({ left: index * scrollAmount, behavior: 'smooth' });
      updateIndicators(index);
    });
    indicatorsContainer.appendChild(dot);
  });
  const indicators = indicatorsContainer.querySelectorAll('button');
  function updateIndicators(activeIndex) {
    indicators.forEach(dot => dot.classList.remove('active'));
    if (indicators[activeIndex]) indicators[activeIndex].classList.add('active');
  }
  // Update dots on scroll
  carousel.addEventListener('scroll', () => {
    const index = Math.round(carousel.scrollLeft / scrollAmount);
    updateIndicators(index);
  });
  // Autoplay
  function startAutoplay() {
    autoPlayInterval = setInterval(() => {
      carousel.scrollBy({ left: scrollAmount, behavior: 'smooth' });
      if (carousel.scrollLeft + carousel.clientWidth >= carousel.scrollWidth - 5) {
        carousel.scrollTo({ left: 0, behavior: 'smooth' });
      }
    }, 4000);
  }
  function stopAutoplay() { clearInterval(autoPlayInterval); }
  startAutoplay();
  carousel.addEventListener('mouseenter', stopAutoplay);
  carousel.addEventListener('mouseleave', startAutoplay);
  carousel.addEventListener('touchstart', stopAutoplay);
  carousel.addEventListener('touchend', startAutoplay);
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




