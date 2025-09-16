// Hamburger Toggle
const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
  hamburger.classList.toggle('open');
});

// Sticky Header Scroll Effect
const navbar = document.querySelector('.navbar');
const topBar = document.querySelector('.top-bar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) navbar.classList.add('scrolled'); else navbar.classList.remove('scrolled');
  if (window.scrollY > 20) topBar.classList.add('scrolled'); else topBar.classList.remove('scrolled');
});

// Fade-in on Scroll
const sections = document.querySelectorAll('section');
const observer = new IntersectionObserver(entries => {
  entries.forEach(entry => { if(entry.isIntersecting){ entry.target.classList.add('show'); }});
}, { threshold: 0.1 });
sections.forEach(section => observer.observe(section));






// HERO SECTION
const slides = document.querySelectorAll('.slide');
const prev = document.querySelector('.prev');
const next = document.querySelector('.next');
const dotsContainer = document.querySelector('.dots');
let currentSlide = 0;
let slideInterval;
// Create dots dynamically
slides.forEach((_, index) => {
  const dot = document.createElement('span');
  if (index === 0) dot.classList.add('active');
  dot.addEventListener('click', () => goToSlide(index));
  dotsContainer.appendChild(dot);
});
const dots = document.querySelectorAll('.dots span');
function changeSlide(nextIndex) {
  slides[currentSlide].classList.remove('active');
  dots[currentSlide].classList.remove('active');
  currentSlide = (nextIndex + slides.length) % slides.length;
  slides[currentSlide].classList.add('active');
  dots[currentSlide].classList.add('active');
}
function nextSlide() {
  changeSlide(currentSlide + 1);
}
function prevSlide() {
  changeSlide(currentSlide - 1);
}
function goToSlide(index) {
  changeSlide(index);
}
// Auto play
function startSlideShow() {
  slideInterval = setInterval(nextSlide, 5000);
}
function stopSlideShow() {
  clearInterval(slideInterval);
}
prev.addEventListener('click', () => {
  prevSlide();
  stopSlideShow();
  startSlideShow();
});
next.addEventListener('click', () => {
  nextSlide();
  stopSlideShow();
  startSlideShow();
});
dots.forEach((dot, index) => {
  dot.addEventListener('click', () => {
    goToSlide(index);
    stopSlideShow();
    startSlideShow();
  });
});
startSlideShow();





// ABOUT SECTION
// Animate stats counters
const counters = document.querySelectorAll('.counter');
counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;
    const speed = 200; // higher = slower
    const increment = target / speed;
    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target;
    }
  }
  updateCount();
});




// PRODUCTS SECTION
// Products & Testimonials Carousel
const carousel = document.getElementById('productCarousel');
const nextBtn = document.getElementById('nextProduct');
const prevBtn = document.getElementById('prevProduct');
const scrollAmount = 330;
let autoPlayInterval;
// Button navigation
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
const testiCards = Array.from(document.querySelectorAll('.testi-card'));
`const dots = Array.from(document.querySelectorAll('.dot'))`;
let testiIndex = 0;
// Show testimonial by index
function showTesti(i) {
  testiCards.forEach((card, idx) => card.classList.toggle('active', idx === i));
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
}
// Click on dot to navigate manually
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    testiIndex = parseInt(dot.dataset.index);
    showTesti(testiIndex);
    resetInterval();
  });
});




// TESTIMONIALS SECTION
// Modern Testimonials 
`const testiCards = Array.from(document.querySelectorAll('.testi-card'))`;
`const dots = Array.from(document.querySelectorAll('.dot'))`;
`let testiIndex = 0`;
// Show testimonial by index
function showTesti(i) {
  testiCards.forEach((card, idx) => card.classList.toggle('active', idx === i));
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
}
// Auto-rotate every 4.2s
let testiInterval = setInterval(() => {
  testiIndex = (testiIndex + 1) % testiCards.length;
  showTesti(testiIndex);
}, 4200);
// Click on dot to navigate manually
dots.forEach(dot => {
  dot.addEventListener('click', () => {
    testiIndex = parseInt(dot.dataset.index);
    showTesti(testiIndex);
    resetInterval();
  });
});
// Swipe support for touch devices
let startX = 0;
let endX = 0;
const slider = document.getElementById('testiSlider');
slider.addEventListener('touchstart', e => {
  startX = e.touches[0].clientX;
});
slider.addEventListener('touchmove', e => {
  endX = e.touches[0].clientX;
});
slider.addEventListener('touchend', () => {
  const deltaX = endX - startX;
  if (Math.abs(deltaX) > 50) { // swipe threshold
    if (deltaX < 0) { // swipe left
      testiIndex = (testiIndex + 1) % testiCards.length;
    } else { // swipe right
      testiIndex = (testiIndex - 1 + testiCards.length) % testiCards.length;
    }
    showTesti(testiIndex);
    resetInterval();
  }
});
// Reset auto-rotate interval
function resetInterval() {
  clearInterval(testiInterval);
  testiInterval = setInterval(() => {
    testiIndex = (testiIndex + 1) % testiCards.length;
    showTesti(testiIndex);
  }, 4200);
}
// Initialize first testimonial
showTesti(testiIndex);





/* COMMENT SECTION */
const commentForm = document.getElementById("commentForm");
const commentsList = document.getElementById("commentsList");
const commentResponse = document.getElementById("commentResponse");
const charCount = document.getElementById("charCount");
const commentBox = document.getElementById("comment");

// Character counter
commentBox.addEventListener("input", () => {
  charCount.textContent = `${commentBox.value.length}/250 characters`;
});

// Load saved comments from localStorage
window.addEventListener("DOMContentLoaded", () => {
  const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.forEach((comment, index) => {
    addCommentToDOM(comment, index);
  });
});

// Handle form submit
commentForm.addEventListener("submit", function(e) {
  e.preventDefault();
  // Get values
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const comment = commentBox.value.trim();

  if (!name || !email || !comment) {
    showMessage("⚠️ All fields are required.", "error");
    return;
  }

  // Date and time
  const now = new Date();
  const dateTime = now.toLocaleString();

  // Create comment object
  const newComment = { name, email, comment, dateTime };

  // Save to localStorage
  const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.push(newComment);
  localStorage.setItem("comments", JSON.stringify(savedComments));

  // Add to DOM
  addCommentToDOM(newComment, savedComments.length - 1);

  // Success message
  showMessage("✅ Your comment has been posted.", "success");

  // Reset form
  commentForm.reset();
  charCount.textContent = "0/250 characters";
});

// Function to add comment to page
function addCommentToDOM({ name, email, comment, dateTime }, index) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");
  commentDiv.innerHTML = `
    <strong>${name}</strong> <small>(${email})</small>
    <p class="comment-text">${comment}</p>
    <small>${dateTime}</small>
    <br>
    <button class="edit-btn"><i class="fa fa-edit"></i> Edit</button>
    <button class="delete-btn"><i class="fa fa-trash"></i> Delete</button>
  `;

  // Delete functionality
  commentDiv.querySelector(".delete-btn").addEventListener("click", () => {
    deleteComment(index);
  });

  // Edit functionality
  commentDiv.querySelector(".edit-btn").addEventListener("click", () => {
    editComment(index);
  });

  commentsList.prepend(commentDiv);
  commentDiv.scrollIntoView({ behavior: "smooth" });
}

// Delete a comment
function deleteComment(index) {
  let savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.splice(index, 1);
  localStorage.setItem("comments", JSON.stringify(savedComments));
  refreshComments();
  showMessage("❌ Comment deleted.", "error");
}

// Edit a comment
function editComment(index) {
  let savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  let commentObj = savedComments[index];

  document.getElementById("name").value = commentObj.name;
  document.getElementById("email").value = commentObj.email;
  commentBox.value = commentObj.comment;
  charCount.textContent = `${commentObj.comment.length}/250 characters`;

  // Remove old comment before resubmission
  savedComments.splice(index, 1);
  localStorage.setItem("comments", JSON.stringify(savedComments));
  refreshComments();
}

// Refresh the comments list
function refreshComments() {
  commentsList.innerHTML = "";
  const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.forEach((comment, index) => {
    addCommentToDOM(comment, index);
  });
}

// Show response messages
function showMessage(msg, type) {
  commentResponse.textContent = msg;
  commentResponse.className = type;
  commentResponse.style.display = "block";
  setTimeout(() => {
    commentResponse.style.display = "none";
  }, 3000);
}






// Modal docs
  const docModal = document.getElementById('docModal');
  const docFrame = document.getElementById('docFrame');
  document.querySelectorAll('[data-doc]').forEach(btn=> btn.addEventListener('click', e=>{
    const src = e.currentTarget.getAttribute('data-doc'); docFrame.src = src; docModal.style.display = 'flex';
  }));
  docModal.querySelector('.close').addEventListener('click', ()=>{ docFrame.src=''; docModal.style.display='none' });
  window.addEventListener('click', e=>{ if(e.target === docModal) { docFrame.src=''; docModal.style.display='none'; } });
  // IntersectionObserver for reveal on scroll
  const io = new IntersectionObserver(entries=>{
    entries.forEach(entry=>{
      if(entry.isIntersecting){ entry.target.classList.add('in-view'); }
    });
  }, {threshold:0.15});
  document.querySelectorAll('[data-animate]').forEach(el=> io.observe(el));
  // Theme toggle with localStorage
  const themeToggle = document.getElementById('themeToggle');
  const setTheme = (dark)=>{
    document.body.classList.toggle('dark', !!dark);
    localStorage.setItem('chocam-dark', !!dark);
    themeToggle.innerHTML = dark ? '<i class="fa fa-sun"></i>' : '<i class="fa fa-moon"></i>';
  }
  const stored = localStorage.getItem('chocam-dark') === 'true'; setTheme(stored);
  themeToggle.addEventListener('click', ()=> setTheme(!document.body.classList.contains('dark')));




  // Simple form handling (client-side). Replace with server integration later.
  const quoteForm = document.getElementById('quoteForm');
  quoteForm.addEventListener('submit', function(e){ e.preventDefault();
    // basic validation
    const formData = new FormData(quoteForm);
    if(parseInt(formData.get('quantity')||0) < 1){ alert('Minimum quantity is 1 MT'); return; }
    // Here you can call your backend / EmailJS / serverless function
    alert('Quote request sent — thank you. We will contact you shortly.');
    quoteForm.reset();
  });

  const contactForm = document.getElementById('contactForm');
  contactForm.addEventListener('submit', function(e){ e.preventDefault(); alert('Message sent — thank you.'); contactForm.reset(); });

  const newsletter = document.getElementById('newsletterForm');
  newsletter.addEventListener('submit', function(e){ e.preventDefault(); alert('Subscribed — thank you.'); newsletter.reset(); });

  // Buttons that open quote section
  document.querySelectorAll('[data-target]').forEach(btn=> btn.addEventListener('click', e=>{ document.querySelector(e.currentTarget.getAttribute('data-target')).scrollIntoView({behavior:'smooth'}); }));





  // ===== Quote Form Validation & Interaction =====

  function submitQuote(event) {
  event.preventDefault();
  const name = document.getElementById("buyerName").value.trim();
  const email = document.getElementById("buyerEmail").value.trim();
  const product = document.getElementById("productSelect").value;
  const quantity = document.getElementById("quantity").value;
  const incoterm = document.getElementById("incoterm").value;
  const message = document.getElementById("quoteMessage").value.trim();
  const responseBox = document.getElementById("quoteResponse");
  let valid = true;

  document.querySelectorAll(".error-message").forEach(el => el.style.display = "none");

  function showError(input, msg) {
    const el = input.parentNode.querySelector(".error-message");
    if (el) {
      el.textContent = msg;
      el.style.display = "block";
      valid = false;
    }
  }

  if (!name) showError(document.getElementById("buyerName"), "Name is required");
  if (!email || !/\S+@\S+\.\S+/.test(email)) showError(document.getElementById("buyerEmail"), "Valid email required");
  if (!product) showError(document.getElementById("productSelect"), "Select a product");
  if (!quantity || quantity < 19) showError(document.getElementById("quantity"), "Minimum 19 metric tons required");
  if (!incoterm) showError(document.getElementById("incoterm"), "Select an Incoterm");

  if (valid) {
    responseBox.textContent = "Thank you! Your quote request has been submitted successfully.";
    responseBox.className = "success";
    responseBox.style.display = "flex";

    // Open WhatsApp with prefilled message (optional)
    const waMessage = `Hello! I would like a quote:\nName: ${name}\nEmail: ${email}\nProduct: ${product}\nQuantity: ${quantity} MT\nIncoterm: ${incoterm}\nMessage: ${message}`;
    const waLink = `https://wa.me/237123456789?text=${encodeURIComponent(waMessage)}`;
    `setTimeout(() => { window.open(waLink, "_blank"); }, 1000)`;

    setTimeout(() => document.getElementById("quoteForm").reset(), 1500);
  } else {
    responseBox.textContent = "⚠️ Please correct the errors above and try again.";
    responseBox.className = "error";
    responseBox.style.display = "block";
  }

  return false;
}





// Smooth Scrolling
document.querySelectorAll('.navbar a').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    target.scrollIntoView({ behavior: 'smooth' });

    // Close mobile menu on click
    const nav = document.querySelector('.nav-links');
    if (nav.classList.contains('active')) {
      nav.classList.remove('active');
    }
  });
});




// office section
document.addEventListener("DOMContentLoaded", () => {
  const elements = document.querySelectorAll("#office .map-wrap, #office .contact-quick");
  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });
  elements.forEach(el => observer.observe(el));
});





// ===== Modal Control Functions =====
function openModal(id) {
  document.getElementById(id).style.display = "block";
}
function closeModal(id) {
  document.getElementById(id).style.display = "none";
}
// Close modal when clicking outside
window.onclick = function(event) {
  const modals = document.querySelectorAll(".modal");
  modals.forEach(modal => {
    if (event.target === modal) {
      modal.style.display = "none";
    }
  });
}






// Team Card
// scroll-animations.js

// Reusable function with Intersection Observer
document.addEventListener("DOMContentLoaded", () => {
  const observerOptions = {
    threshold: 0.2, // triggers when 20% of element is visible
  };

  const observer = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add("fade-in-up");
        observer.unobserve(entry.target); // animate once
      }
    });
  }, observerOptions);

  // Select elements to animate
  document.querySelectorAll(".about-block, .team-card").forEach(el => {
    el.classList.add("hidden"); // hide before animation
    observer.observe(el);
  });
});


document.addEventListener("DOMContentLoaded", () => {
  const cards = document.querySelectorAll(".team-card");

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add("fade-in-up");
        }, index * 150); // stagger each card by 150ms
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  cards.forEach(card => {
    card.classList.add("hidden");
    observer.observe(card);
  });
});


// Animate stats counters
`const counters = document.querySelectorAll('.counter')`;

counters.forEach(counter => {
  const updateCount = () => {
    const target = +counter.getAttribute('data-target');
    const count = +counter.innerText;

    const speed = 200; // higher = slower
    const increment = target / speed;

    if (count < target) {
      counter.innerText = Math.ceil(count + increment);
      setTimeout(updateCount, 20);
    } else {
      counter.innerText = target;
    }
  }

  updateCount();
});



// ===== Gallery Lightbox =====
document.addEventListener("DOMContentLoaded", () => {
  const galleryItems = document.querySelectorAll(".gallery-item");
  const lightbox = document.getElementById("lightbox");
  const lightboxImg = document.getElementById("lightbox-img");
  const lightboxCaption = document.getElementById("lightbox-caption");
  const closeBtn = document.querySelector(".lightbox .close");
  const prevBtn = document.querySelector(".lightbox-prev");
  const nextBtn = document.querySelector(".lightbox-next");

  let currentIndex = 0;

  function openLightbox(index) {
    currentIndex = index;
    const img = galleryItems[index].querySelector("img");
    const caption = galleryItems[index].querySelector(".overlay span").innerText;
    lightboxImg.src = img.src;
    lightboxImg.alt = img.alt;
    lightboxCaption.innerText = caption;
    lightbox.style.display = "block";
  }

  function closeLightbox() {
    lightbox.style.display = "none";
  }

  function showNext() {
    currentIndex = (currentIndex + 1) % galleryItems.length;
    openLightbox(currentIndex);
  }

  function showPrev() {
    currentIndex = (currentIndex - 1 + galleryItems.length) % galleryItems.length;
    openLightbox(currentIndex);
  }

  // Click on gallery item
  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });

  // Close lightbox
  closeBtn.addEventListener("click", closeLightbox);

  // Navigation arrows
  nextBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showNext();
  });

  prevBtn.addEventListener("click", (e) => {
    e.stopPropagation();
    showPrev();
  });

  // Close on click outside image
  lightbox.addEventListener("click", (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  // Keyboard support
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "block") {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    }
  });
});







// ===== Contact Form Real-Time Validation & Submission =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const name = document.getElementById("contactName");
  const email = document.getElementById("contactEmail");
  const subject = document.getElementById("contactSubject");
  const message = document.getElementById("contactMessage");
  const responseBox = document.getElementById("contactResp");
  // Validation rules
  function validateField(input) {
    let valid = true;
    // Remove existing error
    const existingError = input.parentNode.querySelector(".error-message");
    if (existingError) existingError.remove();
    if (!input.value.trim()) {
      `showError(input, ${input.placeholder} is required)`;
      valid = false;
    } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
      showError(input, "Please enter a valid email address");
      valid = false;
    }
    return valid;
  }
  function showError(input, msg) {
    let error = document.createElement("div");
    error.classList.add("error-message");
    error.style.color = "#b71c1c";
    error.style.fontSize = "0.85rem";
    error.style.marginTop = "4px";
    error.textContent = msg;
    input.parentNode.appendChild(error);
  }
  // Real-time validation on input
  [name, email, subject, message].forEach(field => {
    field.addEventListener("input", () => {
      validateField(field);
    });
  });
  // On form submit
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    let valid = true;
    [name, email, subject, message].forEach(field => {
      if (!validateField(field)) valid = false;
    });
    if (valid) {
      responseBox.textContent = "✅ Your message has been sent successfully! We will contact you soon.";
      responseBox.className = "response-message success";
      responseBox.style.display = "block";
      setTimeout(() => {
        form.reset();
        responseBox.style.display = "none";
      }, 1500);
    } else {
      responseBox.textContent = "⚠️ Please fix the errors above and try again.";
      responseBox.className = "response-message error";
      responseBox.style.display = "block";
    }
  });
});
function showError(input, msg) {
  let error = document.createElement("div");
  error.classList.add("error-message");
  error.textContent = msg;
  input.parentNode.appendChild(error);

  // Trigger animation
  setTimeout(() => error.classList.add("show"), 10);
}

form.addEventListener("submit", (e) => {
  e.preventDefault();
  let valid = true;

  // Validate all fields
  [name, email, subject, message].forEach(field => {
    if (!validateField(field)) valid = false;
  });

  if (valid) {
    responseBox.textContent = "✅ Your message has been sent successfully! We will contact you soon.";
    responseBox.className = "response-message success show"; // trigger animation

    setTimeout(() => {
      form.reset();
      responseBox.classList.remove("show");
    }, 1500);
  } else {
    responseBox.textContent = "⚠️ Please fix the errors above and try again.";
    responseBox.className = "response-message error show"; // trigger animation
  }
});
function validateField(input) {
  let valid = true;
  const existingError = input.parentNode.querySelector(".error-message");
  if (existingError) existingError.remove();

  // Remove previous shake
  input.classList.remove("input-error");

  if (!input.value.trim()) {
    `showError(input, ${input.placeholder} is required)`;
    input.classList.add("input-error");
    valid = false;
  } else if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
    showError(input, "Please enter a valid email address");
    input.classList.add("input-error");
    valid = false;
  }

  return valid;
}



