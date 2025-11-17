//-------- Initializze Supabase
const SUPABASE_URL = "https://qnepxdyvfctreegcduxj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZXB4ZHl2ZmN0cmVlZ2NkdXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjY1NzYsImV4cCI6MjA3NTcwMjU3Nn0.9FTpA7Dg6PxD01j3Uo_eTURXAarsSV3C3_vDIU5fpbE";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);




//----------- Animate counter------------
function animateCounter(counterEl, target) {
  let count = 0;
  const speed = 200; // higher = slower
  const increment = target / speed;
  const updateCount = () => {
    count += increment;
    if (count < target) {
      counterEl.innerText = Math.ceil(count);
      requestAnimationFrame(updateCount);
    } else {
      counterEl.innerText = target;
    }
  };
  updateCount();
}


// --------------------
// Fetch stats from Supabase
// --------------------
async function fetchStats() {
  const { data, error } = await supabase
  .from('about_stats')
  .select('*');

  if (error) {
    console.error('Error fetching stats:', error);
    return;
  }

  const statsContainer = document.querySelector('.stats-row');
  if (!statsContainer) return console.warn('No .stats-row found');
  statsContainer.innerHTML = ''; // Clear existing counters

  data.forEach(stat => {
    const statEl = document.createElement('div');
    statEl.classList.add('stat');
    statEl.innerHTML = `
      <h3 class="counter">0</h3>
      <p>${stat.label}</p>
    `;
    statsContainer.appendChild(statEl);

    // Animate counter
    const counterEl = statEl.querySelector('.counter');
    animateCounter(counterEl, stat.value);
  });
}



// --------------------
// Fetch all other About section content
// --------------------
async function fetchAboutContent() {
  // Main headings and blocks
  const { data: contentData, error: contentError } = await supabase
  .from('about_content')
  .select('*');

  if (contentError) {
    console.error('Error fetching about_content:', contentError);
  } else {
    
  }


  // Values
  const { data: valuesData, error: valuesError } = await supabase
  .from('about_values')
  .select('*');

  if (valuesError) {
    console.error('Error fetching about_values:', valuesError);
  } else {
    const valuesContainer = document.querySelector('.values-row');
    if (valuesContainer) {
      valuesContainer.innerHTML = '';
      valuesData.forEach(val => {
        const block = document.createElement('div');
        block.classList.add('value-block');
        block.innerHTML = `
          <img src="${val.image_url}" alt="${val.title}">
          <h3>${val.title}</h3>
          <p>${val.description}</p>
        `;
        valuesContainer.appendChild(block);
      });
    }
  }

  // Timeline
  const { data: timelineData, error: timelineError } = await supabase
    .from('about_timeline')
    .select('*')
    .order('year', { ascending: true });
  if (timelineError) {
    console.error('Error fetching about_timeline:', timelineError);
  } else {
    const timelineContainer = document.querySelector('.timeline');
    if (timelineContainer) {
      timelineContainer.innerHTML = '';
      timelineData.forEach(item => {
        const el = document.createElement('div');
        el.classList.add('timeline-item');
        el.innerHTML = `
          <div class="timeline-date">${item.year}</div>
          <div class="timeline-content">${item.content}</div>
        `;
        timelineContainer.appendChild(el);
      });
    }
  }

  // Team
  const { data: teamData, error: teamError } = await supabase.from('about_team').select('*');
  if (teamError) {
    console.error('Error fetching about_team:', teamError);
  } else {
    const teamContainer = document.querySelector('.team-row');
    if (teamContainer) {
      teamContainer.innerHTML = '';
      teamData.forEach(member => {
        const el = document.createElement('div');
        el.classList.add('team-card');
        el.innerHTML = `
          <div class="team-img">
            <img src="${member.image_url}" alt="${member.name}">
          </div>
          <div class="team-info">
            <h3>${member.name}</h3>
            <p class="role">${member.role}</p>
            <p class="desc">${member.description}</p>
            <a href="mailto:${member.email}" class="btn-outline">Contact</a>
          </div>
        `;
        teamContainer.appendChild(el);
      });
    }
  }

  // Gallery
  const { data: galleryData, error: galleryError } = await supabase.from('about_gallery').select('*');
  if (galleryError) {
    console.error('Error fetching about_gallery:', galleryError);
  } else {
    const galleryContainer = document.querySelector('.farmer-gallery');
    if (galleryContainer) {
      galleryContainer.innerHTML = '';
      galleryData.forEach(img => {
        const el = document.createElement('img');
        el.src = img.image_url;
        el.alt = img.alt_text || '';
        el.classList.add('gallery-img');
        galleryContainer.appendChild(el);
      });
    }
  }
}

// --------------------
// Initialize About Section
// --------------------
async function initAboutSection() {
  await fetchAboutContent();
  await fetchStats(); // Stats counters with animation
}

initAboutSection();







// ===== Supabase Product Fetch =====
async function loadProducts() {
  const { data: products, error } = await supabase.from('products').select('*').order('id', { ascending: true });
  if (error) {
    console.error('Error loading products:', error);
    return;
  }

  const carousel = document.getElementById('productCarousel');
  carousel.innerHTML = ''; // Clear static HTML

  products.forEach(product => {
    const card = document.createElement('div');
    card.classList.add('product-card');
    card.innerHTML = `
      <img src="${product.image_url}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${product.description}</p>
    `;
    carousel.appendChild(card);
  });
}

async function loadProductVideo() {
  const { data: videos, error } = await supabase.from('product_videos').select('*').limit(1).single();
  if (error) {
    console.error('Error loading video:', error);
    return;
  }

  document.querySelector('.video-container h2').textContent = videos.title;
  document.querySelector('.video-container p').textContent = videos.description;
  document.querySelector('.video-container iframe').src = videos.video_url;
}

loadProducts();
loadProductVideo();






// ===========================
// Load Export Steps
// ===========================
async function loadExportSteps() {
  const { data: steps, error } = await supabase.from('export_steps').select('*').order('step_number');
  if (error) return console.error('Error loading export steps:', error);

  const stepsContainer = document.querySelector('.steps');
  stepsContainer.innerHTML = ''; // clear static HTML

  steps.forEach((step, index) => {
    const stepEl = document.createElement('div');
    stepEl.classList.add('step');
    stepEl.setAttribute('data-aos', 'fade-up');
    stepEl.setAttribute('data-aos-delay', index * 100);
    stepEl.innerHTML = `
      <i class="${step.icon_class} step-icon"></i>
      <h3>${step.title}</h3>
      <p>${step.description}</p>
    `;
    stepsContainer.appendChild(stepEl);
  });
}

// ===========================
// Load Export Documents
// ===========================
async function loadExportDocuments() {
  const { data: docs, error } = await supabase.from('export_documents').select('*').order('id');
  if (error) return console.error('Error loading documents:', error);

  const docsContainer = document.querySelector('.documents-grid');
  docsContainer.innerHTML = '';

  docs.forEach((doc, index) => {
    const docEl = document.createElement('div');
    docEl.classList.add('document-card');
    docEl.setAttribute('data-aos', 'fade-up');
    docEl.setAttribute('data-aos-delay', index * 100);
    docEl.innerHTML = `
      <i class="${doc.icon_class} doc-icon"></i>
      <h4>${doc.title}</h4>
      <p>${doc.description}</p>
      <a href="${doc.file_url}" download class="btn">
        <i class="fas fa-file-pdf"></i> Download PDF
      </a>
    `;
    docsContainer.appendChild(docEl);
  });
}

// ===========================
// Initialize Section
// ===========================
async function initExportSection() {
  await loadExportSteps();
  await loadExportDocuments();
}

initExportSection();






//Blog $ News
async function loadBlogPosts() {
  const { data: posts, error } = await supabase.from('blog_posts').select('*').order('created_at', { ascending: false });
  if (error) return console.error('Error loading blog posts:', error);

  const blogGrid = document.querySelector('.blog-grid');
  blogGrid.innerHTML = ''; // Clear static HTML

  posts.forEach(post => {
    const postEl = document.createElement('div');
    postEl.classList.add('blog-card');
    postEl.innerHTML = `
      <div class="blog-img">
        <img src="${post.image_url}" alt="${post.title}">
      </div>
      <div class="blog-content">
        <h3>${post.title}</h3>
        <p>${post.content}</p>
        <a href="/blog/${post.slug}" class="btn-read">Read More</a>
      </div>
    `;
    blogGrid.appendChild(postEl);
  });
}

loadBlogPosts();








// Testimonial Section
let testiCards = [];
let dots = [];
let testiIndex = 0;
let testiInterval;

// ===========================
// Load Testimonials
// ===========================
async function loadTestimonials() {
  const { data: testimonials, error } = await supabase
    .from('testimonials')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error('Error loading testimonials:', error);

  const slider = document.getElementById('testiSlider');
  const dotsContainer = document.getElementById('testiDots');

  slider.innerHTML = '';
  dotsContainer.innerHTML = '';

  testimonials.forEach((testi, idx) => {
    const card = document.createElement('div');
    card.classList.add('testi-card');
    if (idx === 0) card.classList.add('active');
    card.setAttribute('data-aos', 'fade-up');
    card.setAttribute('data-aos-delay', idx * 100);
    card.innerHTML = `
      <img src="${testi.avatar_url}" alt="Client Avatar" class="testi-avatar">
      <p class="testi-text">"${testi.testimonial_text}"</p>
      <div class="testi-rating">${'★'.repeat(testi.rating)}${'☆'.repeat(5 - testi.rating)}</div>
      <cite>— ${testi.company_name}</cite>
    `;
    slider.appendChild(card);

    // Create dot
    const dot = document.createElement('span');
    dot.classList.add('dot');
    if (idx === 0) dot.classList.add('active');
    dot.dataset.index = idx;
    dot.addEventListener('click', () => {
      testiIndex = parseInt(dot.dataset.index);
      showTesti(testiIndex);
      resetInterval();
    });
    dotsContainer.appendChild(dot);
  });

  testiCards = Array.from(document.querySelectorAll('.testi-card'));
  dots = Array.from(document.querySelectorAll('.dot'));
  showTesti(testiIndex);
  startAutoRotate();
}

// ===========================
// Show testimonial by index
// ===========================
function showTesti(i) {
  testiCards.forEach((card, idx) => card.classList.toggle('active', idx === i));
  dots.forEach((dot, idx) => dot.classList.toggle('active', idx === i));
}

// ===========================
// Auto-rotate testimonials
// ===========================
function startAutoRotate() {
  testiInterval = setInterval(() => {
    testiIndex = (testiIndex + 1) % testiCards.length;
    showTesti(testiIndex);
  }, 4200);
}

// ===========================
// Reset interval
// ===========================
function resetInterval() {
  clearInterval(testiInterval);
  startAutoRotate();
}

// ===========================
// Swipe support
// ===========================
const slider = document.getElementById('testiSlider');
let startX = 0;
let endX = 0;

slider.addEventListener('touchstart', e => { startX = e.touches[0].clientX; });
slider.addEventListener('touchmove', e => { endX = e.touches[0].clientX; });
slider.addEventListener('touchend', () => {
  const deltaX = endX - startX;
  if (Math.abs(deltaX) > 50) {
    testiIndex = deltaX < 0 ? (testiIndex + 1) % testiCards.length
                             : (testiIndex - 1 + testiCards.length) % testiCards.length;
    showTesti(testiIndex);
    resetInterval();
  }
});

// ===========================
// Initialize
// ===========================
loadTestimonials();






const commentForm = document.getElementById("commentForm");
const commentsList = document.getElementById("commentsList");
const commentResponse = document.getElementById("commentResponse");
const charCount = document.getElementById("charCount");
const commentBox = document.getElementById("comment");

// ===========================
// Character counter
// ===========================
commentBox.addEventListener("input", () => {
  charCount.textContent = `${commentBox.value.length}/250 characters`;
});

// ===========================
// Load comments from Supabase + localStorage
// ===========================
async function loadComments() {
  const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.forEach((comment, index) => addCommentToDOM(comment, index, true));

  const { data: comments, error } = await supabase
    .from('comments')
    .select('*')
    .order('created_at', { ascending: false });

  if (error) return console.error('Error loading comments:', error);

  comments.forEach(comment => {
    if (!savedComments.find(c => c.id === comment.id)) {
      addCommentToDOM(comment, null, false);
    }
  });
}

// ===========================
// Add comment to DOM
// ===========================
function addCommentToDOM({ id, name, email, comment_text, created_at }, index, isLocal = false) {
  const commentDiv = document.createElement("div");
  commentDiv.classList.add("comment");
  commentDiv.innerHTML = `
    <strong>${name}</strong> <small>(${email})</small>
    <p class="comment-text">${comment_text}</p>
    <small>${new Date(created_at || Date.now()).toLocaleString()}</small>
    ${isLocal ? `
      <br>
      <button class="edit-btn"><i class="fa fa-edit"></i> Edit</button>
      <button class="delete-btn"><i class="fa fa-trash"></i> Delete</button>
    ` : ''}
  `;

  if (isLocal) {
    commentDiv.querySelector(".delete-btn").addEventListener("click", () => deleteComment(index));
    commentDiv.querySelector(".edit-btn").addEventListener("click", () => editComment(index));
  }

  commentsList.prepend(commentDiv);
  commentDiv.scrollIntoView({ behavior: "smooth" });
}

// ===========================
// Handle form submit
// ===========================
commentForm.addEventListener("submit", async function(e) {
  e.preventDefault();
  const name = document.getElementById("name").value.trim();
  const email = document.getElementById("email").value.trim();
  const comment = commentBox.value.trim();

  if (!name || !email || !comment) {
    showMessage("⚠️ All fields are required.", "error");
    return;
  }

  const now = new Date();
  const localComment = { name, email, comment_text: comment, created_at: now };

  // Save locally
  let savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.push(localComment);
  localStorage.setItem("comments", JSON.stringify(savedComments));
  addCommentToDOM(localComment, savedComments.length - 1, true);

  // Save to Supabase
  const { data, error } = await supabase
    .from('comments')
    .insert([{ name, email, comment_text: comment }])
    .select(); // to get inserted id

  if (error) {
    showMessage("❌ Failed to post comment.", "error");
    console.error(error);
  } else {
    // Update local comment with Supabase id for future edits/deletes
    const inserted = data[0];
    localComment.id = inserted.id;
    localStorage.setItem("comments", JSON.stringify(savedComments));
    showMessage("✅ Your comment has been posted.", "success");
  }

  // Reset form
  commentForm.reset();
  charCount.textContent = "0/250 characters";
});

// ===========================
// Edit comment (local + Supabase)
// ===========================
function editComment(index) {
  let savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  let commentObj = savedComments[index];

  document.getElementById("name").value = commentObj.name;
  document.getElementById("email").value = commentObj.email;
  commentBox.value = commentObj.comment_text;
  charCount.textContent = `${commentObj.comment_text.length}/250 characters`;

  // Remove old comment locally
  savedComments.splice(index, 1);
  localStorage.setItem("comments", JSON.stringify(savedComments));
  refreshComments();

  // Delete from Supabase if it exists
  if (commentObj.id) {
    supabase
      .from('comments')
      .delete()
      .eq('id', commentObj.id)
      .then(({ error }) => {
        if (error) console.error("Error deleting old comment from Supabase:", error);
      });
  }
}

// ===========================
// Delete comment (local + Supabase)
// ===========================
function deleteComment(index) {
  let savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  const commentObj = savedComments[index];

  savedComments.splice(index, 1);
  localStorage.setItem("comments", JSON.stringify(savedComments));
  refreshComments();
  showMessage("❌ Comment deleted.", "error");

  if (commentObj.id) {
    supabase
      .from('comments')
      .delete()
      .eq('id', commentObj.id)
      .then(({ error }) => {
        if (error) console.error("Error deleting comment from Supabase:", error);
      });
  }
}

// ===========================
// Refresh comments list
// ===========================
function refreshComments() {
  commentsList.innerHTML = "";
  const savedComments = JSON.parse(localStorage.getItem("comments")) || [];
  savedComments.forEach((comment, index) => addCommentToDOM(comment, index, true));
}

// ===========================
// Show messages
// ===========================
function showMessage(msg, type) {
  commentResponse.textContent = msg;
  commentResponse.className = type;
  commentResponse.style.display = "block";
  setTimeout(() => {
    commentResponse.style.display = "none";
  }, 3000);
}

// ===========================
// Initialize
// ===========================
loadComments();







//Request Quote 
async function submitQuote(event) {
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

  if (!valid) {
    responseBox.textContent = "⚠️ Please correct the errors above and try again.";
    responseBox.className = "error";
    responseBox.style.display = "block";
    return false;
  }

  // Save to Supabase
  const { data, error } = await supabase
    .from("quotes")
    .insert([{ name, email, product, quantity, incoterm, message }]);

  if (error) {
    responseBox.textContent = "❌ Failed to submit your request. Try again.";
    responseBox.className = "error";
    responseBox.style.display = "block";
    return false;
  }

  // Show success message
  responseBox.textContent = "✅ Your quote request has been submitted successfully!";
  responseBox.className = "success";
  responseBox.style.display = "flex";

  // Optional: WhatsApp prefilled message
  const waMessage = `Hello! I would like a quote:\nName: ${name}\nEmail: ${email}\nProduct: ${product}\nQuantity: ${quantity} MT\nIncoterm: ${incoterm}\nMessage: ${message};
  const waLink = https://wa.me/237123456789?text=${encodeURIComponent(waMessage)};
  setTimeout(() => { window.open(waLink, "_blank"); }, 1000)`;

  // Reset form after submission
  setTimeout(() => document.getElementById("quoteForm").reset(), 1500);
  return false;
}





// ===== Supabase Gallery Loader =====
async function loadGallery() {
  const { data, error } = await supabase
    .from('gallery')
    .select('*')
    .order('id');

  if (error) {
    console.error("Failed to fetch gallery:", error);
    return;
  }

  const galleryGrid = document.querySelector(".gallery-grid");
  galleryGrid.innerHTML = ""; // Clear existing HTML before adding new items

  for (const item of data) {
    const galleryItem = document.createElement("div");
    galleryItem.classList.add("gallery-item");
    galleryItem.innerHTML = `
      <img src="${item.image_url}" alt="${item.alt_text}" loading="lazy">
      <div class="overlay"><span>${item.title}</span></div>
    `;
    galleryGrid.appendChild(galleryItem);
  }

  // Reinitialize your lightbox functionality after loading
  initializeLightbox();
}

// Reuse your lightbox logic in a function
function initializeLightbox() {
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

  galleryItems.forEach((item, index) => {
    item.addEventListener("click", () => openLightbox(index));
  });
  closeBtn.addEventListener("click", closeLightbox);
  nextBtn.addEventListener("click", (e) => { e.stopPropagation(); showNext(); });
  prevBtn.addEventListener("click", (e) => { e.stopPropagation(); showPrev(); });
  lightbox.addEventListener("click", (e) => { if (e.target === lightbox) closeLightbox(); });
  document.addEventListener("keydown", (e) => {
    if (lightbox.style.display === "block") {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") closeLightbox();
    }
  });
}

document.addEventListener("DOMContentLoaded", loadGallery);







// ===== Contact Form with Supabase Submission =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("contactForm");
  const nameInput = document.getElementById("contactName");
  const emailInput = document.getElementById("contactEmail");
  const subjectInput = document.getElementById("contactSubject");
  const messageInput = document.getElementById("contactMessage");
  const responseBox = document.getElementById("contactResp");

  // Validate input fields
  function validateField(input) {
    const existingError = input.parentNode.querySelector(".error-message");
    if (existingError) existingError.remove();

    if (!input.value.trim()) {
      showError(input, `${input.placeholder} is required`);
      return false;
    }
    if (input.type === "email" && !/\S+@\S+\.\S+/.test(input.value)) {
      showError(input, "Please enter a valid email address");
      return false;
    }
    return true;
  }

  function showError(input, msg) {
    const error = document.createElement("div");
    error.classList.add("error-message");
    error.textContent = msg;
    error.style.color = "#b71c1c";
    error.style.fontSize = "0.85rem";
    error.style.marginTop = "4px";
    input.parentNode.appendChild(error);
  }

  async function sendContact(event) {
    event.preventDefault();

    const validName = validateField(nameInput);
    const validEmail = validateField(emailInput);
    const validSubject = validateField(subjectInput);
    const validMessage = validateField(messageInput);

    if (!validName || !validEmail || !validSubject || !validMessage) {
      responseBox.textContent = "⚠️ Please fix the errors above and try again.";
      responseBox.className = "response-message error";
      responseBox.style.display = "block";
      return false;
    }

    // Insert message into Supabase
    const { error } = await supabase.from("contact_messages").insert([
      {
        name: nameInput.value.trim(),
        email: emailInput.value.trim(),
        subject: subjectInput.value.trim(),
        message: messageInput.value.trim(),
      },
    ]);

    if (error) {
      console.error("Supabase insert error:", error);
      responseBox.textContent = "❌ Failed to send your message. Please try again later.";
      responseBox.className = "response-message error";
    } else {
      responseBox.textContent = "✅ Your message has been sent successfully!";
      responseBox.className = "response-message success";
      form.reset();
    }

    responseBox.style.display = "block";
    setTimeout(() => {
      responseBox.style.display = "none";
    }, 2500);

    return false;
  }

  // Attach event
  form.addEventListener("submit", sendContact);
});






// HERO SECTION (Dynamic from Supabase)
document.addEventListener("DOMContentLoaded", async () => {
  const slidesContainer = document.querySelector(".hero");
  const dotsContainer = document.querySelector(".dots");
  const prev = document.querySelector(".prev");
  const next = document.querySelector(".next");
  const heroContent = document.querySelector(".hero-content");

  let slides = [];
  let currentSlide = 0;
  let slideInterval;

  // Default language
  let currentLang = 'en'; // can be changed dynamically

  // Fetch hero slides from Supabase
  const { data, error } = await supabase
    .from("hero")
    .select("*")
    .order("id");

  if (error) {
    console.error("Error loading hero slides:", error);
    return;
  }

  slides = data;

  // Build slides dynamically
  const slideElements = slides.map((slide, index) => {
    const div = document.createElement("div");
    div.className = `slide ${index === 0 ? "active" : ""}`;
    div.style.backgroundImage = `url(${slide.image_url})`;
    slidesContainer.insertBefore(div, slidesContainer.querySelector(".overlay"));
    return div;
  });

  // Build dots
  dotsContainer.innerHTML = "";
  slides.forEach((_, i) => {
    const dot = document.createElement("span");
    if (i === 0) dot.classList.add("active");
    dot.addEventListener("click", () => goToSlide(i));
    dotsContainer.appendChild(dot);
  });
  const dots = document.querySelectorAll(".dots span");

  // Function to update hero text based on current language
  function updateHeroText() {
    const slide = slides[currentSlide];

    const heading = slide[`heading_${currentLang}`] || slide.heading_en;
    const description = slide[`description_${currentLang}`] || slide.description_en;
    const buttonText = slide[`button_text_${currentLang}`] || slide.button_text_en;

    heroContent.querySelector("h1").innerHTML = heading;
    heroContent.querySelector("p").innerHTML = description;
    const btn = heroContent.querySelector("a");
    btn.textContent = buttonText;
    btn.href = slide.button_link;
  }

  // Slide navigation
  function changeSlide(nextIndex) {
    slideElements[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (nextIndex + slides.length) % slides.length;
    slideElements[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
    updateHeroText();
  }

  function nextSlide() { changeSlide(currentSlide + 1); }
  function prevSlide() { changeSlide(currentSlide - 1); }
  function goToSlide(index) { changeSlide(index); }

  // Auto slideshow
  function startSlideShow() { slideInterval = setInterval(nextSlide, 5000); }
  function stopSlideShow() { clearInterval(slideInterval); }

  // Event listeners
  prev.addEventListener("click", () => { prevSlide(); stopSlideShow(); startSlideShow(); });
  next.addEventListener("click", () => { nextSlide(); stopSlideShow(); startSlideShow(); });
  dots.forEach((dot, index) => {
    dot.addEventListener("click", () => { goToSlide(index); stopSlideShow(); startSlideShow(); });
  });

  // Initial render
  updateHeroText();
  startSlideShow();

  // --- LANGUAGE SWITCHER ---
  // Make sure your language buttons have a class "lang-btn" and a data attribute: data-lang="fr" etc.
  document.querySelectorAll('.lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      currentLang = btn.dataset.lang;
      updateHeroText();
    });
  });
});

// 🌍 Handle language switching
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selectedLang = btn.dataset.lang;
    if (typeof updateHeroLanguage === 'function') {
      updateHeroLanguage(selectedLang);
    }

    // Collapse selector after choosing on mobile
    const selector = document.querySelector('.language-selector');
    if (window.innerWidth <= 600) {
      selector.classList.remove('expanded');
    }
  });
});

// 🌍 Handle language switching (desktop & mobile)
document.querySelectorAll('.lang-btn').forEach(btn => {
  btn.addEventListener('click', (e) => {
    e.stopPropagation(); // prevent parent toggle on mobile
    document.querySelectorAll('.lang-btn').forEach(b => b.classList.remove('active'));
    btn.classList.add('active');

    const selectedLang = btn.dataset.lang;
    if (typeof updateHeroLanguage === 'function') {
      updateHeroLanguage(selectedLang);
    }

    // Collapse selector after choosing on mobile
    const selector = document.querySelector('.language-selector');
    if (window.innerWidth <= 600) {
      selector.classList.remove('expanded');
      const toggle = selector.querySelector('.language-toggle');
      toggle.style.opacity = '0';
      toggle.style.pointerEvents = 'none';
    }
  });
});

// 📱 Mobile Tap Toggle for Language Selector
const selector = document.querySelector('.language-selector');
selector.addEventListener('click', () => {
  if (window.innerWidth <= 600) {
    selector.classList.toggle('expanded');
    const toggle = selector.querySelector('.language-toggle');
    if (selector.classList.contains('expanded')) {
      toggle.style.opacity = '1';
      toggle.style.pointerEvents = 'all';
    } else {
      toggle.style.opacity = '0';
      toggle.style.pointerEvents = 'none';
    }
  }
});







// ===== Newsletter Subscription =====
document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("newsletterForm");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    const emailInput = form.querySelector("input[name='email']");
    const email = emailInput.value.trim();
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      alert("⚠️ Please enter a valid email address.");
      return;
    }

    // Insert subscriber into Supabase
    const { data, error } = await supabase
      .from("newsletter")
      .insert([{ email }]);

    if (error) {
       console.error("Newsletter error:", error);
      if (error.code === "23505") {
        alert("⚠️ You are already subscribed!");
      } else {
        alert("❌ Subscription failed. Please try again.");
      }
    } else {
      alert("✅ Thank you for subscribing!");
      form.reset();
    }
  });
});







// ===== Load Footer Content from Supabase =====
document.addEventListener("DOMContentLoaded", async () => {
  const { data, error } = await supabase
    .from("footer_content")
    .select("*")
    .order("id", { ascending: true })
    .limit(1)
    .single();

  if (error) {
    console.error("Failed to load footer content:", error);
    return;
  }

  // Update company name & about text
  document.querySelector("[data-translate='footer_company']").textContent = data.company_name;
  document.querySelector("[data-translate='footer_about']").textContent = data.about;
  document.querySelector("[data-translate='footer_powered']").innerHTML = data.powered_by;

  // Render Quick Links
  const linksContainer = document.querySelector(".footer-links");
  linksContainer.innerHTML = "";
  data.quick_links.forEach(link => {
    const li = document.createElement("li");
    li.innerHTML = `<a href="${link.href}">${link.name}</a>`;
    linksContainer.appendChild(li);
  });

  // Render Social Links
  const socialsContainer = document.querySelector(".socials");
  socialsContainer.innerHTML = "";
  data.social_links.forEach(social => {
    const a = document.createElement("a");
    a.href = social.url;
    a.target = "_blank";
    a.classList.add("w3-hover-opacity");
    a.innerHTML = `<i class="fa ${social.icon}"></i>`;
    socialsContainer.appendChild(a);
  });
});





// Tearms and Conditions / Privacy & Policy
 async function loadPageContent(slug, modalId) {
  const { data, error } = await supabase
    .from('site_pages')
    .select('content')
    .eq('slug', slug)
    .single();

  if (error) {
    console.error('Error loading', slug, error);
    return;
  }

  const modal = document.getElementById(modalId);
  if (modal) {
    const contentContainer = modal.querySelector('.modal-content');
    const closeBtn = contentContainer.querySelector('.close');

    // Clear previous content but keep the close button
    contentContainer.innerHTML = '';
    contentContainer.appendChild(closeBtn);

    const wrapper = document.createElement('div');
    wrapper.innerHTML = data.content;
    contentContainer.appendChild(wrapper);
  }
}









