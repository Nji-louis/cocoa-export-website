//-------- Initializze Supabase
const SUPABASE_URL = "https://qnepxdyvfctreegcduxj.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InFuZXB4ZHl2ZmN0cmVlZ2NkdXhqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjAxMjY1NzYsImV4cCI6MjA3NTcwMjU3Nn0.9FTpA7Dg6PxD01j3Uo_eTURXAarsSV3C3_vDIU5fpbE";
const supabase = window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY);






// -------------------------
// Supabase: make sure client is initialized before running this file.
// Example (uncomment + replace):
// import { createClient } from '@supabase/supabase-js'
// const SUPABASE_URL = 'https://your-project.supabase.co'
// const SUPABASE_ANON_KEY = 'your-anon-key'
// const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY)
// -------------------------

// ---------- Helpers ----------
function escapeHtml(str) {
  if (str == null) return '';
  return String(str);
}

function animateCounter(counterEl, target) {
  let count = 0;
  const speed = 200;
  const increment = Math.max(1, target / speed);
  const update = () => {
    count += increment;
    if (count < target) {
      counterEl.innerText = Math.ceil(count);
      requestAnimationFrame(update);
    } else {
      counterEl.innerText = target;
    }
  };
  update();
}

// find heading element by text content (case-insensitive, trimmed)
function findHeadingElement(tagSelector, textOptions = []) {
  const nodes = document.querySelectorAll(tagSelector);
  for (const n of nodes) {
    const t = (n.textContent || '').trim().toLowerCase();
    for (const opt of textOptions) {
      if (t === opt.toLowerCase() || t.startsWith(opt.toLowerCase())) return n;
    }
  }
  return null;
}

// set content in block after heading (common pattern in your HTML)
function setBlockContentByHeading(headingSelectors, headingNames, contentHtml) {
  const h = findHeadingElement(headingSelectors, headingNames);
  if (!h) return false;
  // prefer the next paragraph element sibling
  let p = h.nextElementSibling;
  // if next sibling is not p, search for first p within parent
  if (!p || p.tagName.toLowerCase() !== 'p') {
    p = h.parentElement?.querySelector('p');
  }
  if (p) p.innerHTML = escapeHtml(contentHtml);
  else {
    // fallback: set heading's nextElementSibling text
    if (h.nextElementSibling) h.nextElementSibling.innerHTML = escapeHtml(contentHtml);
  }
  return true;
}

// ---------- Main fetch function ----------
async function fetchAndRenderAbout() {
  // 1) about_content
  const { data: contentData, error: contentErr } = await supabase
    .from('about_content')
    .select('*')
    .order('position', { ascending: true });

  if (contentErr) console.error('about_content error', contentErr);

  if (contentData && contentData.length) {
    for (const item of contentData) {
      const sec = (item.section || '').toLowerCase();

      if (sec === 'hero') {
        // hero: first H1.faq-heading inside #about-content and the first paragraph after it
        const heroH1 = document.querySelector('#about-content h1.faq-heading');
        if (heroH1) heroH1.innerText = item.heading || heroH1.innerText;
        const heroP = document.querySelector('#about-content > p');
        if (heroP) heroP.innerText = item.content || heroP.innerText;
      } else if (sec === 'who_we_are') {
        setBlockContentByHeading('h3.faq-heading', ['Who We Are'], item.content);
      } else if (sec === 'mission') {
        // mission is inside div.about-mission -> p
        const missionP = document.querySelector('.about-mission p');
        if (missionP) missionP.innerHTML = escapeHtml(item.content);
      } else if (sec === 'vision' || sec === 'our version') {
        const visionP = document.querySelector('.about-vision p');
        if (visionP) visionP.innerHTML = escapeHtml(item.content);
      } else if (sec === 'story') {
        const storyP = document.querySelector('.about-story p');
        if (storyP) storyP.innerHTML = escapeHtml(item.content);
      } else if (sec === 'ceo_message' || sec === 'ceo') {
        const ceoP = document.querySelector('.about-ceo p');
        if (ceoP) ceoP.innerHTML = escapeHtml(item.content);
      } else if (sec === 'what_we_stand_for') {
        const h = findHeadingElement('h2.faq-heading', ['What We Stand For']);
        if (h) {
          // paragraph is next sibling or inside same block
          let p = h.nextElementSibling;
          if (!p || p.tagName.toLowerCase() !== 'p') p = h.parentElement?.querySelector('p');
          if (p) p.innerHTML = escapeHtml(item.content);
        }
      } else if (sec === 'export_intro') {
        // export intro: the paragraph just above the .export-process-list
        const ul = document.querySelector('.export-process-list');
        if (ul) {
          // find the nearest paragraph sibling above the ul
          let p = ul.previousElementSibling;
          if (!p || p.tagName.toLowerCase() !== 'p') p = ul.parentElement?.querySelector('p');
          if (p) p.innerHTML = escapeHtml(item.content);
        }
      }
    }
  }

  // 2) about_values
  const { data: valuesData, error: valuesErr } = await supabase.from('about_values').select('*').order('position', { ascending: true });
  if (valuesErr) console.error('about_values error', valuesErr);
  const valuesContainer = document.querySelector('.values-row');
  if (valuesContainer && valuesData) {
    valuesContainer.innerHTML = '';
    for (const v of valuesData) {
      const div = document.createElement('div');
      div.className = 'value-block';
      div.innerHTML = `
        <img src="${escapeHtml(v.image_url || '')}" alt="${escapeHtml(v.title || '')}">
        <h3 class="faq-heading">${escapeHtml(v.title || '')}</h3>
        <p>${escapeHtml(v.description || '')}</p>
      `;
      valuesContainer.appendChild(div);
    }
  }

  // 3) about_export_steps
  const { data: stepsData, error: stepsErr } = await supabase.from('about_export_steps').select('*').order('step_number', { ascending: true });
  if (stepsErr) console.error('about_export_steps error', stepsErr);
  const stepsList = document.querySelector('.export-process-list');
  if (stepsList && stepsData) {
    stepsList.innerHTML = '';
    for (const s of stepsData) {
      const li = document.createElement('li');
      li.innerHTML = `<strong>${s.step_number}. </strong>${escapeHtml(s.content)}`;
      stepsList.appendChild(li);
    }
  }

  // 4) about_timeline
  const { data: timelineData, error: timelineErr } = await supabase.from('about_timeline').select('*').order('year', { ascending: true });
  if (timelineErr) console.error('about_timeline error', timelineErr);
  const timelineContainer = document.querySelector('.timeline');
  if (timelineContainer && timelineData) {
    timelineContainer.innerHTML = '';
    for (const t of timelineData) {
      const el = document.createElement('div');
      el.className = 'timeline-item';
      el.innerHTML = `<div class="timeline-date">${escapeHtml(String(t.year))}</div><div class="timeline-content">${escapeHtml(t.content)}</div>`;
      timelineContainer.appendChild(el);
    }
  }

  // 5) about_gallery
  const { data: galleryData, error: galleryErr } = await supabase.from('about_gallery').select('*').order('position', { ascending: true });
  if (galleryErr) console.error('about_gallery error', galleryErr);
  const galleryContainer = document.querySelector('.about-gallery-container');
  if (galleryContainer && galleryData) {
    // We'll rebuild slides + arrows (keeps your existing lightbox IDs)
    let slidesHtml = '';
    galleryData.forEach((g, idx) => {
      slidesHtml += `
        <div class="about-slide fade">
          <img loading="lazy" src="${escapeHtml(g.image_url)}" alt="${escapeHtml(g.alt_text || '')}">
          <p class="about-caption">${escapeHtml(g.alt_text || '')}</p>
        </div>
      `;
    });

    // Add arrows (they were in your original HTML). We'll keep the same class names and onclick handlers.
    slidesHtml += `
      <a class="about-prev" onclick="aboutPlusSlides(-1)">&#10094;</a>
      <a class="about-next" onclick="aboutPlusSlides(1)">&#10095;</a>
    `;

    galleryContainer.innerHTML = slidesHtml;

    // Rebuild dots container separately
    const dotsContainer = document.querySelector('.about-dots-container');
    if (dotsContainer) {
      dotsContainer.innerHTML = '';
      galleryData.forEach((_, i) => {
        const span = document.createElement('span');
        span.className = 'about-dot';
        span.setAttribute('onclick', `aboutCurrentSlide(${i + 1})`);
        dotsContainer.appendChild(span);
      });
    }

    // initialize slides (use your existing slide functions if present)
    if (typeof aboutInitSlides === 'function') aboutInitSlides();
  }

  // 6) about_stats
  const { data: statsData, error: statsErr } = await supabase.from('about_stats').select('*').order('position', { ascending: true });
  if (statsErr) console.error('about_stats error', statsErr);
  const statsContainer = document.querySelector('.stats-row');
  if (statsContainer && statsData) {
    statsContainer.innerHTML = '';
    for (const s of statsData) {
      const div = document.createElement('div');
      div.className = 'stat';
      div.innerHTML = `<h3 class="counter">0</h3><p>${escapeHtml(s.label)}</p>`;
      statsContainer.appendChild(div);
      // animate
      const counterEl = div.querySelector('.counter');
      animateCounter(counterEl, Number(s.value || 0));
    }
  }

  // 7) about_team
  const { data: teamData, error: teamErr } = await supabase.from('about_team').select('*').order('position', { ascending: true });
  if (teamErr) console.error('about_team error', teamErr);
  const teamContainer = document.querySelector('.team-row');
  if (teamContainer && teamData) {
    teamContainer.innerHTML = '';
    for (const m of teamData) {
      const card = document.createElement('div');
      card.className = 'team-card';
      card.innerHTML = `
        <div class="team-img"><img src="${escapeHtml(m.image_url || '')}" alt="${escapeHtml(m.name || '')}"></div>
        <div class="team-info">
          <h3>${escapeHtml(m.name || '')}</h3>
          <p class="role">${escapeHtml(m.role || '')}</p>
          <p class="desc">${escapeHtml(m.description || '')}</p>
          <a href="mailto:${escapeHtml(m.email || '')}" class="btn-outline">Contact</a>
        </div>
      `;
      teamContainer.appendChild(card);
    }
  }







async function loadAboutInfo() {
  const { data, error } = await supabase
    .from("about_info") // correct table name
    .select("*")
    .order("position", { ascending: true }); // use 'position' for ordering

  if (error) {
    console.error("Error loading About Info:", error);
    return;
  }

  const container = document.querySelector(".about-info-grid");

  if (!container) {
    console.error("❌ ERROR: .about-info-grid container not found.");
    return;
  }

  container.innerHTML = ""; // Clear old content

  data.forEach((item) => {
    const card = document.createElement("div");
    card.classList.add("info-card");

    card.innerHTML = `
      <i class="fas fa-id-card"></i> <!-- static icon for now -->
      <h4>${item.title ?? ""}</h4>
      <p>${item.value ?? ""}</p>
    `;

    container.appendChild(card);
  });
}

loadAboutInfo();

  // final: log success
  // console.log('About section loaded from Supabase');
}

// ---------- Initialization ----------
document.addEventListener('DOMContentLoaded', async () => {
  try {
    await fetchAndRenderAbout();
  } catch (err) {
    console.error('Error initializing About section:', err);
  }
});





// ====================================
// LOAD PRODUCTS INTO PRODUCT GRID
// ====================================
async function loadProducts() {
  const { data: products, error } = await supabase
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
  const { data: videos, error } = await supabase
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






  
// fetch export
async function loadExportData() {
  const { data, error } = await supabase
    .from('exports')
    .select('*')
    .order('id', { ascending: true })
    .limit(1);

  if (error) {
    console.error('Error fetching export data:', error);
    return;
  }

  if (data && data.length > 0) {
    const exportData = data[0];
    displayExportData(exportData);
  }
}

// 4. Display data on the page
function displayExportData(exportData) {
  // Section title & subtitle
  document.querySelector('.export-section .section-title').textContent = exportData.section_title;
  document.querySelector('.export-section .section-subtitle').textContent = exportData.section_subtitle;

  // Timeline
  const timelineContainer = document.querySelector('.export-section .timeline');
  timelineContainer.innerHTML = ''; // clear existing

  exportData.timeline.forEach(step => {
    const stepDiv = document.createElement('div');
    stepDiv.classList.add('timeline-step');
    stepDiv.dataset.category = step.category;

    stepDiv.innerHTML = `
      <div class="step-icon">${step.icon}</div>
      <h3>${step.title}</h3>
      <ul>
        ${step.steps.map(s => `<li>${s}</li>`).join('')}
      </ul>
    `;
    timelineContainer.appendChild(stepDiv);
  });

  // Minimum order
  document.querySelector('.export-section .export-details p').textContent = exportData.min_order;

  // Documents
  const docList = document.querySelector('.export-section .export-doc-list');
  docList.innerHTML = exportData.documents.map(d => `<li>${d}</li>`).join('');
}

// 5. Load data on page load
window.addEventListener('DOMContentLoaded', loadExportData);

  


  // ============================
  // FETCH COCOA SPECIFICATIONS
  // ============================
  async function loadSpecifications() {
    const table = document.querySelector('.spec-table');

    const { data: specs, error } = await supabase
      .from('cocoa_specifications')
      .select('*')
      .order('id');

    if (error) {
      console.error("Spec fetch error:", error);
      return;
    }

    // Keep table header only
    table.innerHTML = `
      <tr>
        <th>Parameter</th>
        <th>Specification</th>
      </tr>
    `;

    specs.forEach(row => {
      table.innerHTML += `
        <tr>
          <td><strong>${row.parameter}</strong></td>
          <td>${row.specification}</td>
        </tr>
      `;
    });
  }

  // ============================
  // FETCH EXPORT DOCUMENTS
  // ============================
  async function loadExportDocuments() {
    const list = document.querySelector('.export-details');

    const { data: documents, error } = await supabase
      .from('export_documents')
      .select('*')
      .order('id');

    if (error) {
      console.error("Documents fetch error:", error);
      return;
    }

    list.innerHTML = "";

    documents.forEach(doc => {
      list.innerHTML += `<li>${doc.title}</li>`;
    });
  }

  // ============================
  // LOAD ALL EXPORT DATA
  // ============================
  document.addEventListener("DOMContentLoaded", () => {
  loadSpecifications();
  loadExportDocuments();
});







// Load documents from Supabase
async function loadDocuments() {
  const { data, error } = await supabase
    .from('documents')
    .select('*')
    .order('id', { ascending: true });

  if (error) {
    console.error('Error loading documents:', error);
    return;
  }

  displayDocuments(data || []);
}

// Render documents on the page
function displayDocuments(documents) {
  const grid = document.querySelector('.documents-grid');
  grid.innerHTML = ''; // clear existing

  documents.forEach(doc => {
    const card = document.createElement('div');
    card.classList.add('document-card');

    card.innerHTML = `
      <i class="${doc.icon_class} doc-icon"></i>
      <h4>${doc.title}</h4>
      <p>${doc.description}</p>
      <a href="${doc.pdf_url}" download class="btn">
        <i class="fas fa-file-pdf"></i> Download PDF
      </a>
    `;

    grid.appendChild(card);
  });
}

// Load documents on page load
window.addEventListener('DOMContentLoaded', loadDocuments);







// Function to fetch and render Terms & Conditions
async function loadTermsAndConditions() {
  const { data, error } = await supabase
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
  const { data, error } = await supabase
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







// ===== Supabase Google Photos Style Gallery Loader =====
async function loadGallery() {
  const { data, error } = await supabase
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



