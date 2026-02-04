
//-------- Initialize Supabase using CDN
const SUPABASE_URL = "https://qnepxdyvfctreegcduxj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZXB4ZHl2ZmN0cmVlZ2NkdXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjY1NzYsImV4cCI6MjA3NTcwMjU3Nn0.9FTpA7Dg6PxD01j3Uo_eTURXAarsSV3C3_vDIU5fpbE";

// Use a new variable name to avoid conflicts
const supabaseClient = supabase.createClient(SUPABASE_URL, SUPABASE_KEY);









// ====================================
// LOAD PRODUCTS INTO PRODUCT GRID
// ====================================
async function loadProducts() {
  const { data: products, error } = await supabaseClient
    .from("products")
    .select("*")
    .order("id", { ascending: true });

  if (error) {
    console.error("Error loading products:", error);
    return;
  }

  const grid = document.getElementById("productGrid");
  const resultsCount = document.getElementById("resultsCount");

  if (!grid) {
    console.error("❌ ERROR: #productGrid container not found.");
    return;
  }

  grid.innerHTML = ""; // Clear static HTML

  products.forEach((p) => {
    const card = document.createElement("article");
    card.classList.add("product-card");
    card.setAttribute("tabindex", "0");
    card.dataset.type = p.type;
    card.dataset.origin = p.origin;

    card.innerHTML = `
      <div class="card-media">
        <img src="${p.image_url}" alt="${p.name}">
        <div class="badge ${p.badge_class || ""}">${p.badge_text || ""}</div>
      </div>

      <div class="card-body">
        <h3 class="product-title">${p.name}</h3>
        <p class="product-sub">${p.subtitle}</p>

        <ul class="specs">
          ${p.specs
            .map((spec) => `<li><strong>${spec.label}:</strong> ${spec.value}</li>`)
            .join("")}
        </ul>

        <div class="card-footer">
          <div class="price">${p.price_label} <span>${p.price_value}</span></div>

          <div class="actions">
            <button class="btn btn-quote" data-id="${p.slug}">Request Quote</button>
            <button class="btn btn-details" data-id="${p.slug}">Learn More</button>
          </div>
        </div>
      </div>
    `;

    grid.appendChild(card);
  });

  // Update product counter
  resultsCount.textContent = `Showing ${products.length} products`;
}

// ====================================
// LOAD VIDEO (unchanged)
// ====================================
async function loadProductVideo() {
  const { data: videos, error } = await supabaseClient
    .from("product_videos")
    .select("*")
    .limit(1)
    .single();

  if (error) {
    console.error("Error loading video:", error);
    return;
  }

  document.querySelector(".video-container h2").textContent = videos.title;
  document.querySelector(".video-container p").textContent = videos.description;
  document.querySelector(".video-container iframe").src = videos.video_url;
}

loadProducts();
loadProductVideo();










// Function to fetch and render Terms & Conditions
async function loadTermsAndConditions() {
  const { data, error } = await supabaseClient
    .from('terms_and_conditions')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching Terms:', error);
    return;
  }

  const termsContent = document.querySelector('#termsModal .modal-content');
  if (!termsContent) return;

  // Clear existing content except close button
  const closeBtn = termsContent.querySelector('.close');
  termsContent.innerHTML = '';
  if (closeBtn) termsContent.appendChild(closeBtn);

  // Render fetched data
  data.forEach(item => {
    if (item.heading) {
      const hTag = item.order_num === 1 ? document.createElement('h1') : document.createElement('h2');
      hTag.textContent = item.heading;
      termsContent.appendChild(hTag);
    }
    if (item.subheading) {
      const subH = document.createElement('h5');
      subH.textContent = item.subheading;
      termsContent.appendChild(subH);
    }
    if (item.content) {
      const p = document.createElement('p');
      p.innerHTML = item.content.replace(/\n/g, '<br>'); // preserve line breaks
      termsContent.appendChild(p);
    }
  });
}

// Function to fetch and render Privacy Policy
async function loadPrivacyPolicy() {
  const { data, error } = await supabaseClient
    .from('privacy_policy')
    .select('*')
    .order('order_num', { ascending: true });

  if (error) {
    console.error('Error fetching Privacy Policy:', error);
    return;
  }

  const privacyContent = document.querySelector('#privacyModal .modal-content');
  if (!privacyContent) return;

  // Clear existing content except close button
  const closeBtn = privacyContent.querySelector('.close');
  privacyContent.innerHTML = '';
  if (closeBtn) privacyContent.appendChild(closeBtn);

  // Render fetched data
  data.forEach(item => {
    if (item.heading) {
      const hTag = item.order_num === 1 ? document.createElement('h1') : document.createElement('h2');
      hTag.textContent = item.heading;
      privacyContent.appendChild(hTag);
    }
    if (item.subheading) {
      const subH = document.createElement('h5');
      subH.textContent = item.subheading;
      privacyContent.appendChild(subH);
    }
    if (item.content) {
      const p = document.createElement('p');
      p.innerHTML = item.content.replace(/\n/g, '<br>'); // preserve line breaks
      privacyContent.appendChild(p);
    }
  });
}

// Call the functions to load data on page load
document.addEventListener('DOMContentLoaded', () => {
  loadTermsAndConditions();
  loadPrivacyPolicy();
});


















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

  const { data: comments, error } = await supabaseClient
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
    supabaseClient
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
    supabaseClient
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
  const { data, error } = await supabaseClient
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







// ===== Supabase Google Photos Style Gallery Loader =====
async function loadGallery() {
  const { data, error } = await supabaseClient
    .from('gallery')
    .select('*')
    .order('position', { ascending: true });

  if (error) {
    console.error("Failed to fetch gallery:", error);
    return;
  }

  // Containers
  const slideContainer = document.querySelector(".gp-gallery-container");
  const thumbContainer = document.querySelector(".gp-row");

  // Clear old static HTML
  slideContainer.innerHTML = `
    <a class="gp-prev" onclick="gpPlusSlides(-1)">&#10094;</a>
    <a class="gp-next" onclick="gpPlusSlides(1)">&#10095;</a>
  `;
  thumbContainer.innerHTML = "";

  // Build dynamic slides & thumbnails
  data.forEach((item, index) => {
    // SLIDES
    const slide = document.createElement("div");
    slide.classList.add("gp-slide", "fade");
    slide.innerHTML = `
      <img src="${item.image_url}" alt="${item.alt_text || ''}" loading="lazy">
      <p class="gp-caption">${item.caption || ''}</p>
    `;
    slideContainer.insertBefore(slide, slideContainer.querySelector(".gp-prev"));

    // THUMBNAILS
    const thumb = document.createElement("img");
    thumb.classList.add("gp-thumb");
    thumb.src = item.image_url;
    thumb.alt = item.alt_text || '';
    thumb.loading = "lazy";
    thumb.onclick = function () {
      gpCurrentSlide(index + 1);
    };

    thumbContainer.appendChild(thumb);
  });

  // After loading images, activate slideshow
  gpShowSlides(slideIndex = 1);
}

// ===== Original Slideshow Logic (unchanged) =====
let slideIndex = 1;

function gpPlusSlides(n) {
  gpShowSlides(slideIndex += n);
}

function gpCurrentSlide(n) {
  gpShowSlides(slideIndex = n);
}

function gpShowSlides(n) {
  let i;
  const slides = document.getElementsByClassName("gp-slide");
  const thumbs = document.getElementsByClassName("gp-thumb");

  if (n > slides.length) slideIndex = 1;
  if (n < 1) slideIndex = slides.length;

  for (i = 0; i < slides.length; i++) {
    slides[i].style.display = "none";
  }
  for (i = 0; i < thumbs.length; i++) {
    thumbs[i].classList.remove("active-thumb");
  }

  slides[slideIndex - 1].style.display = "block";
  thumbs[slideIndex - 1].classList.add("active-thumb");
}

// Load Gallery
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





// HERO Section
document.addEventListener("DOMContentLoaded", async () => {
  const supabase = window.supabaseClient;

  const hero = document.querySelector('[data-sb="hero"]');
  const heroContent = hero.querySelector('[data-sb="hero-content"]');
  const headingEl = hero.querySelector('[data-sb="hero-heading"]');
  const descEl = hero.querySelector('[data-sb="hero-description"]');
  const btnEl = hero.querySelector('[data-sb="hero-button"]');
  const dotsContainer = hero.querySelector('[data-sb="hero-dots"]');
  const prevBtn = hero.querySelector('[data-sb="hero-prev"]');
  const nextBtn = hero.querySelector('[data-sb="hero-next"]');

  let slides = [];
  let slideEls = [];
  let dots = [];
  let currentSlide = 0;
  let interval;
  let currentLang = "en";

  // Fetch hero data
  const { data, error } = await supabaseClient
    .from("hero")
    .select("*")
    .order("id");

  if (error || !data.length) {
    console.error("Hero load failed:", error);
    return;
  }

  slides = data;

  // Build slides
  slides.forEach((slide, index) => {
    const div = document.createElement("div");
    div.className = `slide ${index === 0 ? "active" : ""}`;
    div.style.backgroundImage = `url(${slide.image_url})`;
    hero.insertBefore(div, hero.querySelector(".overlay"));
    slideEls.push(div);

    const dot = document.createElement("span");
    if (index === 0) dot.classList.add("active");
    dot.onclick = () => goTo(index);
    dotsContainer.appendChild(dot);
    dots.push(dot);
  });

  function updateText() {
    const s = slides[currentSlide];
    headingEl.innerHTML = s[`heading_${currentLang}`] || s.heading_en;
    descEl.innerHTML = s[`description_${currentLang}`] || s.description_en;
    btnEl.textContent = s[`button_text_${currentLang}`] || s.button_text_en;
    btnEl.href = s.button_link || "#";
  }

  function goTo(i) {
    slideEls[currentSlide].classList.remove("active");
    dots[currentSlide].classList.remove("active");
    currentSlide = (i + slides.length) % slides.length;
    slideEls[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
    updateText();
  }

  function next() { goTo(currentSlide + 1); }
  function prev() { goTo(currentSlide - 1); }

  function start() {
    interval = setInterval(next, 5000);
  }

  function reset() {
    clearInterval(interval);
    start();
  }

  prevBtn.onclick = () => { prev(); reset(); };
  nextBtn.onclick = () => { next(); reset(); };

  updateText();
  start();
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
    const { data, error } = await supabaseClient
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
  const { data, error } = await supabaseClient
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
  const { data, error } = await supabaseClient
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
};








// BLOG Post
async function loadBlogPosts() {
  const { data, error } = await supabaseClient
    .from("blog_posts")
    .select("*")
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Blog error:", error);
    return;
  }

  const grid = document.querySelector(".blog-grid");
  grid.innerHTML = "";

  data.forEach(post => {
    grid.innerHTML += `
      <article class="blog-card" itemscope itemtype="https://schema.org/BlogPosting">
        <div class="blog-img">
          <a href="${post.image_url}" target="_blank">
            <img src="${post.image_url}" alt="${post.title}" loading="lazy">
          </a>
        </div>
        <div class="blog-content">
          <h3 itemprop="headline">${post.title}</h3>
          <p itemprop="description">${post.description}</p>
          <a href="${post.read_more_url}" class="btn-read" target="_blank" rel="noopener noreferrer">
            Read More
          </a>
        </div>
      </article>
    `;
  });
}

async function loadCocoaNews() {
  const { data, error } = await supabaseClient
    .from("cocoa_news")
    .select("*")
    .order("published_at", { ascending: false })
    .limit(5);

  if (error) {
    console.error("News error:", error);
    return;
  }

  const newsList = document.getElementById("news-list");
  newsList.innerHTML = "";

  data.forEach(news => {
    newsList.innerHTML += `
      <p>
        <a href="${news.url}" target="_blank" rel="noopener noreferrer">
          ${news.headline}
        </a>
        <small> – ${news.source || "News"}</small>
      </p>
    `;
  });
}

document.addEventListener("DOMContentLoaded", () => {
  loadBlogPosts();
  loadCocoaNews();
});












// ---------- Fetch & Render Office Info ----------
async function loadOfficeInfo() {
  const { data, error } = await supabaseClient
    .from('office_info')
    .select('*')
    .limit(1);

  if (error) {
    console.error('Error loading office info:', error);
    return;
  }

  if (!data || data.length === 0) return;

  const office = data[0];

  // Heading & Subtitle
  document.getElementById('office-heading').textContent = `Our Office in ${office.location}`;
  document.querySelector('.office-subtitle').textContent = 
    `Visit or contact our cocoa export office in ${office.location} — the commercial hub of Cameroon and a key gateway for international cocoa shipments.`;

  // Map
  document.getElementById('officeMap').src = office.map_embed;

  // Quick Contact
  const phoneBtn = document.getElementById('phoneBtn');
  phoneBtn.href = `tel:${office.phone}`;
  phoneBtn.textContent = office.phone;

  const whatsappBtn = document.getElementById('whatsappBtn');
  whatsappBtn.href = `https://wa.me/${office.whatsapp}`;
  whatsappBtn.textContent = "Chat on WhatsApp";

  const linkedinBtn = document.getElementById('linkedinBtn');
  linkedinBtn.href = office.linkedin;
  linkedinBtn.textContent = "LinkedIn";

  // Office note
  document.getElementById('officeNote').innerHTML = 
    `📍 <strong>Location:</strong> ${office.location} • <strong>Availability:</strong> Office hours & WhatsApp support available for international buyers`;
}

// ---------- Initialize ----------
document.addEventListener('DOMContentLoaded', loadOfficeInfo);